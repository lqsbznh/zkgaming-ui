<script lang="ts">
import TerminalCode from "./TerminalCode.vue";
import { defineComponent } from "vue";
import { store } from "../store";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "Statement",
  components: {
    TerminalCode,
  },
  props: {
    statementData: {
      type: Object,
    },
    diceData: {
      type: Object,
    },
  },
  data() {
    return {
      store,
      terminalCode: "",
      checkBoxVisible: false,
      form: {},
      option: [],
      selectStatementIndex: undefined,
      againstVisible: false,
      currentData: {}
    };
  },
  computed: {
    privateKey() {
      return store.account?.privateKey()?.to_string();
    },
    playing() {
      const palyingDic = {};
      this.statementData.handledStatement.forEach((i, sIndex) => {
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
    onStart(signer, index) {
      this.selectStatementIndex = index;
      this.option = this.diceData.handledDices.filter((item, index) => {
        item.index = index;
        return item.game_id === "0" && item.opponent === signer;
      });
      if (this.option.length) {
        this.checkBoxVisible = true;
      } else {
        ElMessage({
          message: `Please create a dice box with an opponent of ${signer}`,
          type: "warning",
        });
      }
    },
    startGame() {
      this.terminalCode = `./target/release/snarkos developer execute --private-key ${
        this.privateKey
      } --broadcast "http://127.0.0.1:3030/testnet3/transaction/broadcast" --query "http://127.0.0.1:3030" zkgaming_dice.aleo accept_dicebox "${
        this.diceData.dices[this.form.boxValue]
      }" "${this.statementData.statement[this.selectStatementIndex]}"`;
      this.checkBoxVisible = false;
    },
    continue(param, index) {
      this.currentData = param;
      this.selectStatementIndex = index;
      this.againstVisible = true;
    },
    onAgainst() {
      this.againstVisible = false;

      this.terminalCode = `./target/release/snarkos developer execute --private-key ${
        this.privateKey
      } --broadcast "http://127.0.0.1:3030/testnet3/transaction/broadcast" --query "http://127.0.0.1:3030" zkgaming_dice.aleo response_statement "${
        this.statementData.statement[this.selectStatementIndex]
      }" ${this.form.num}u32 ${this.form.point}u32`;
    },
    onChallenge(index) {
      this.terminalCode = `./target/release/snarkos developer execute --private-key ${
        this.privateKey
      } --broadcast "http://127.0.0.1:3030/testnet3/transaction/broadcast" --query "http://127.0.0.1:3030" zkgaming_dice.aleo raise_challenge "${
        this.diceData.dices[this.playing[index].diceIndex]
      }" "${this.statementData.statement[index]}"`;
    },
  },
});
</script>

<template>
  <div class="py-3">
    <div>
      <div class="flex">
        <span class="text-3xl font-medium">Statement</span>
      </div>

      <div
        class="w-full rounded-xl mt-3 ring-1 ring-amber-800"
        v-if="this.statementData.handledStatement.length"
      >
        <div class="grid grid-cols-6 bg-amber-800 rounded-t-xl p-3 text-white">
          <div class="col-span-4">Opponent</div>
          <div class="col-span-1">Opponent's bid</div>
        </div>
        <div
          class="grid grid-cols-6 p-3"
          v-for="(value, index) in this.statementData.handledStatement"
          v-bind:key="value._nonce"
        >
          <div class="col-span-4 flex items-center">{{ value.signer }}</div>
          <div class="flex flex-col col-span-1">
            <!-- <div class="h-full" v-for="(item, i) in value.dices.split('')" v-bind:key="i">
              <div
                class="bg-cover w-full h-full bg-[url('/dicebox.png')]"
                :style="{ 'background-position': `${20 * (item - 1)}%` }"
              /> -->

            <div v-if="this.playing[index]?.diceIndex !== undefined">Number: {{ value.num }}</div>
            <div v-if="this.playing[index]?.diceIndex !== undefined">Top Face Value: {{ value.point }}</div>
            <!-- </div> -->
          </div>
          <button
            class="inline-block rounded-lg mx-8 ring-1 ring-amber-800 text-amber-800 col-span-1 hover:shadow-md hover:shadow-amber-800/50"
            v-if="this.playing?.[index]?.diceIndex === undefined"
            @click="() => onStart(value.signer, index)"
          >
            Prepare
          </button>
          <div class="col-span-1 flex mx-8 space-x-4">
            <button
              class="flex-1 ring-amber-800 text-amber-800 rounded-lg ring-1 hover:shadow-md hover:shadow-amber-800/50"
              v-if="this.playing[index]?.diceIndex !== undefined"
              @click="() => this.continue({ point: value.point, num: value.num }, index)"
            >
              Bid
            </button>
            <button
              class="flex-1 ring-amber-800 text-amber-800 rounded-lg ring-1 hover:shadow-md hover:shadow-amber-800/50"
              v-if="this.playing[index]?.diceIndex !== undefined"
              @click="() => onChallenge(index)"
            >
              Open
            </button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="checkBoxVisible" title="">
      <el-form :model="form">
        <el-form-item label="Select DiceBox:" class="flex items-center">
          <el-select v-model="form.boxValue" class="m-2" placeholder="Select">
            <el-option
              v-for="item in this.option"
              :key="item._nonce"
              :label="item.dices"
              :value="item.index"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="checkBoxVisible = false">Cancel</el-button>
          <el-button
            type="primary"
            class="bg-amber-500 hover:bg-amber-500/50 hover:border-amber-500/50 border-amber-500"
            @click="startGame"
          >
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="againstVisible" title="Bid">
      <el-form :model="form">
        <el-form-item >
          <div class="flex flex-col space-y-2">
            <div class="grid grid-cols-6">
              <span class="mr-2 inline-block col-span-2">Num:</span>
              <el-input-number
                :controls="false"
                class="col-span-4"
                :min="this.currentData.num"
                v-model="form.num"
                autocomplete="off"
              />
            </div>

            <div class="grid grid-cols-6">
              <span class="mr-2 inline-block col-span-2">Top Face Value:</span>
              <el-input-number
                :controls="false"
                class="col-span-4"
                :max="6"
                :min="1"
                v-model="form.point"
                autocomplete="off"
              />
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="checkBoxVisible = false">Cancel</el-button>
          <el-button
            type="primary"
            class="bg-amber-500 hover:bg-amber-500/50 hover:border-amber-500/50 border-amber-500"
            @click="onAgainst"
          >
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>

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
