<script lang="ts">
import AleoAccount from "../components/AleoAccount.vue";
import DiceBox from "../components/DiceBox.vue";
import Statement from "../components/Statement.vue";
import Challenge from "../components/Challenge.vue";
import GameResult from "../components/GameResult.vue";
import { defineComponent } from "vue";
import { store } from "../store";
import { Account, AleoNetworkClient, type Block } from "@aleohq/sdk";
import { RecordCiphertext, RecordPlaintext } from "@aleohq/wasm";

interface DiceBoxRecord {
  dices: string;
}

function sleep(ms: number | undefined) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export default defineComponent({
  name: "GameBoard",
  components: {
    AleoAccount,
    DiceBox,
    Statement,
    Challenge,
    GameResult,
  },
  data() {
    return {
      store,
      records: new Map(),
      results: [] as any[],
    };
  },
  computed: {
    privateKey() {
      return store.account?.privateKey()?.to_string();
    },
    diceData() {
      let dices: any[] = [];
      let handledDices: any[] = [];
      this.records.forEach((value, key) => {
        const handledDice = {};
        if (value.toString().search("dices") > 0) {
          let str = value.toString();
          const reg = /(u32|u64)?.public|(u32|u64)?.private/g;
          str = str.replace(reg, "");

          str.split(/{|,|}/g).forEach(item => {
            if (item) {
              const obj = item.split(":");
              handledDice[obj[0].trim()] = obj[1].trim();
            }
          });

          handledDices.push(handledDice);
          dices.push(value);
        }
      });
      return { dices, handledDices };
    },
    statementData() {
      let statement: any[] = [];
      let handledStatement: any[] = [];

      this.records.forEach((value, key) => {
        if (value.toString().search("needed_num") < 0 && value.toString().search("num") > 0) {
          const handledData = {};

          let str = value.toString();
          const reg = /(u32|u64)?.public|(u32|u64)?.private/g;
          str = str.replace(reg, "");

          str.split(/{|,|}/g).forEach(item => {
            if (item) {
              const obj = item.split(":");
              handledData[obj[0].trim()] = obj[1].trim();
            }
          });

          handledStatement.push(handledData);
          statement.push(value);
        }
      });
      return { statement, handledStatement };
    },
    challengeData() {
      let challenge: any[] = [];
      let handledHallenge: any[] = [];
      this.records.forEach((value, key) => {
        if (value.toString().search("needed_num") > 0) {
          const handledData = {};

          let str = value.toString();
          const reg = /(u32|u64)?.public|(u32|u64)?.private/g;
          str = str.replace(reg, "");

          str.split(/{|,|}/g).forEach(item => {
            if (item) {
              const obj = item.split(":");
              handledData[obj[0].trim()] = obj[1].trim();
            }
          });

          handledHallenge.push(handledData);
          challenge.push(value);
        }
      });
      return { challenge, handledHallenge };
    },
  },
  async created() {
    if (!store.account) {
      return this.$router.replace({ path: "/login" });
    }

    let nodeConnection = new AleoNetworkClient("http://192.168.200.25:3030");

    while (store.account == null) {
      await sleep(1000);
    }
    console.log("Private Key:", this.privateKey);

    let privateKey = store.account?.privateKey();
    console.log("Private Key:", privateKey?.to_string());
    let viewKey = store.account?.viewKey();
    // const viewKey = store.account?.viewKey();
    // this.records = await nodeConnection.findUnspentRecords(0, undefined, privateKey, undefined, -1).catch((err) => {
    //     console.log(err);
    // }) as RecordPlaintext[];
    // let currentHeight = await nodeConnection.getLatestHeight().catch((err) => {
    //     console.log(err);
    // }) as number;
    let currentHeight = 0;

    while (true) {
      let latestBlock = (await nodeConnection.getLatestBlock().catch(err => {
        console.log(err);
      })) as Block;
      if (currentHeight >= latestBlock.header.metadata.height) {
        await sleep(1000 * 15);
        continue;
      }
      currentHeight += 1;
      let currentBlock = (await nodeConnection.getBlock(currentHeight).catch(err => {
        console.log(err);
      })) as Block;
      console.log("Syncing block", currentBlock.header.metadata.height);
      currentBlock.transactions?.forEach(transaction => {
        if (transaction.type == "execute") {
          transaction.execution.transitions?.forEach(transition => {
            transition.inputs?.forEach(input => {
              if (input.type == "record") {
                if (this.records.has(input.id)) {
                  this.records.delete(input.id);
                }
              }
            });

            if (!(typeof transition.outputs == "undefined")) {
              if (transition.function == "accept_challenge") {
                let resultDate = {
                  GameId: transition.outputs[0].value,
                  Winner: transition.outputs[1].value,
                };

                this.results.push(resultDate);
              }
            }

            if (!(typeof transition.outputs == "undefined")) {
              for (let i = 0; i < transition.outputs?.length; i++) {
                if (transition.outputs[i].type == "record") {
                  let recordCiphertext = RecordCiphertext.fromString(transition.outputs[i].value);
                  if (recordCiphertext.isOwner(viewKey)) {
                    let recordPlaintext = recordCiphertext.decrypt(viewKey);
                    console.log("Found a record:", recordPlaintext.toString());
                    if (recordPlaintext.toString().search("dices") > 0) {
                      console.log(this.privateKey);

                      let sn = recordPlaintext.serialNumberString(
                        privateKey,
                        "dicebox.aleo",
                        "dicebox"
                      );
                      console.log("sn", recordPlaintext);

                      this.records.set(sn, recordPlaintext);
                      continue;
                    }
                    if (recordPlaintext.toString().search("needed_num") > 0) {
                      let sn = recordPlaintext.serialNumberString(
                        privateKey,
                        "zkgaming_dice.aleo",
                        "challenge"
                      );
                      this.records.set(sn, recordPlaintext);
                      continue;
                    }
                    if (recordPlaintext.toString().search("num") > 0) {
                      let sn = recordPlaintext.serialNumberString(
                        privateKey,
                        "zkgaming_dice.aleo",
                        "statement"
                      );
                      this.records.set(sn, recordPlaintext);
                      continue;
                    }
                  }
                }
              }
            }
          });
        }
      });
    }
  },
  methods: {},
});
</script>

<template>
  <div class="py-10">
    <h1 class="text-5xl font-bold">Game Board</h1>
    <div class="flex text-slate-700 my-3">
      <span class="font-medium">Aleo Account:</span>
      <p class="ml-2">{{ store.account?.address()?.to_string() }}</p>
    </div>
    <DiceBox :diceData="diceData" />
    <Statement :statementData="statementData" :diceData="diceData" />
    <Challenge :challengeData="challengeData" :diceData="diceData" />
    <GameResult :data="results" />
  </div>
</template>
