<script lang="ts">
import TerminalCode from "./TerminalCode.vue";
import { defineComponent } from "vue";
import { store } from "../store";

export default defineComponent({
  name: "Challenge",
  components: {
    TerminalCode,
  },
  props: {
    challengeData: {
      type: Object,
    },
    diceData: {
      type: Object,
    },
  },
  data() {
    return {
      store,
      createDiceBoxVisible: false,
      terminalCode: "",
      form: {
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
      },
    };
  },
  computed: {
    privateKey() {
      return store.account?.privateKey()?.to_string();
    },
    playing() {
      const palyingDic = {};
      this.challengeData.handledHallenge.forEach((i, sIndex) => {
        this.diceData.handledDices.forEach((item, index) => {
          if (i.game_id === item.game_id && i.signer === item.opponent) {
            i.diceIndex = index;
            palyingDic[sIndex] = i;
          }
        });
      });
      return palyingDic;
    },
  },
  methods: {
    onConfirm(index) {
      console.log(this.diceData.dices, this.playing);

      this.terminalCode = `./target/release/snarkos developer execute --private-key ${
        this.privateKey
      } --broadcast "http://127.0.0.1:3030/testnet3/transaction/broadcast" --query "http://127.0.0.1:3030" zkgaming_dice.aleo accept_challenge "${
        this.diceData.dices[this.playing[index].diceIndex]
      }" "${this.challengeData.challenge[index]}"`;
    },
  },
});
</script>

<template>
  <div class="py-3">
    <div>
      <div class="flex">
        <span class="text-3xl font-medium">Challenge</span>
      </div>
      <div v-for="(value, index) in challengeData.handledHallenge" v-bind:key="value._nonce" class="mt-3">
        <div class="grid grid-cols-6 bg-amber-800 rounded-xl p-3 text-white">


          <div class="col-span-4 flex items-center">
            {{ value.signer }} 
          </div>


          <div class="col-span-1">
            Number: <span>{{value.needed_num}} </span>
            <br />
            Top Face Value: <span>{{value.point}} </span>
          </div>
          <button class="col-span-1 bg-white text-amber-800 rounded-lg mr-8" @click="() => onConfirm(index)">Check</button>
        </div>
      </div>
    </div>

    <TerminalCode
      :message="terminalCode"
      @onClose="
        () => {
          this.terminalCode = '';
        }
      "
    />
  </div>
</template>
