<script lang="ts">
import TerminalCode from "./TerminalCode.vue";
import { defineComponent } from "vue";
import { store } from "../store";

export default defineComponent({
  name: "DiceBox",
  components: {
    TerminalCode,
  },
  props: {
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
        1: undefined,
        2: undefined,
        3: undefined,
        4: undefined,
        5: undefined,
        6: undefined,
      },
      rules: {
        1: [{ required: true, message: "Please input", trigger: "blur" }],
        2: [{ required: true, message: "Please input", trigger: "blur" }],
        3: [{ required: true, message: "Please input", trigger: "blur" }],
        4: [{ required: true, message: "Please input", trigger: "blur" }],
        5: [{ required: true, message: "Please input", trigger: "blur" }],
        6: [{ required: true, message: "Please input", trigger: "blur" }],
        opponent: [
          {
            required: true,
            message: "Please input opponent",
            trigger: "blur",
          },
        ],
      },
      ruleFormRef: undefined,
    };
  },
  computed: {
    privateKey() {
      return store.account?.privateKey()?.to_string();
    },
  },
  methods: {
    createDiceBox(formEl: any) {
      // if (!formEl) return;
      // console.log(formEl);

      // await formEl.validate((valid, fields) => {
      //   if (valid) {
      this.createDiceBoxVisible = false;
      this.terminalCode = `./target/release/snarkos developer execute --private-key ${this.privateKey} --broadcast "http://127.0.0.1:3030/testnet3/transaction/broadcast" --query "http://127.0.0.1:3030" zkgaming_dice.aleo initial_dicebox ${this.form["1"]}${this.form["2"]}${this.form["3"]}${this.form["4"]}${this.form["5"]}${this.form["6"]}u32 ${this.form.opponent}`;

      //   } else {
      //     console.log("error submit!", fields);
      //   }
      // });
    },
    onCreate() {
      this.createDiceBoxVisible = true;
    },
    startGame(index) {
      this.terminalCode = `./target/release/snarkos developer execute --private-key ${
        this.privateKey
      } --broadcast "http://127.0.0.1:3030/testnet3/transaction/broadcast" --query "http://127.0.0.1:3030" zkgaming_dice.aleo offer_dicebox "${
        this.diceData.dices[index]
      }" ${Math.random().toString().slice(3, 9)}u64`;
    },
    onClose() {
      this.form = {
        1: undefined,
        2: undefined,
        3: undefined,
        4: undefined,
        5: undefined,
        6: undefined,
      };
    },
  },
});
</script>

<template>
  <div class="py-3">
    <div>
      <div class="flex justify-between">
        <span class="text-3xl font-medium">DiceBox</span>
        <button
          class="w-[100px] bg-amber-500 h-9 inline-block rounded-lg text-white"
          @click="onCreate"
        >
          create
        </button>
      </div>

      <div
        class="w-full rounded-xl mt-3 ring-1 ring-amber-800"
        v-if="this.diceData.handledDices.length"
      >
        <div class="grid grid-cols-6 bg-amber-800 rounded-t-xl p-3 text-white">
          <div class="col-span-4">Opponent</div>
          <div class="col-span-1">Dice</div>
        </div>
        <div
          class="grid grid-cols-6 p-3"
          v-for="(value, index) in this.diceData.handledDices"
          v-bind:key="value._nonce"
        >
          <div class="col-span-4">{{ value.opponent }}</div>
          <div class="flex col-span-1">
            <div class="h-full w-7" v-for="(item, i) in value.dices.split('')" v-bind:key="i">
              <div class="bg-cover w-full h-full bg-[url('/dicebox.png')]" :style="{'background-position': `${20 * (item - 1)}%`}" />
            </div>
          </div>
          <button
            v-if="value.game_id === '0'"
            class="inline-block rounded-lg mx-8 ring-1 ring-amber-800 text-amber-800 col-span-1 hover:shadow-md hover:shadow-amber-800/50"
            @click="() => startGame(index)"
          >
            Play
          </button>
        </div>
      </div>
    </div>

    <el-dialog v-model="createDiceBoxVisible" title="Shipping address" @close="onClose">
      <el-form :model="form" :rules="this.rules">
        <el-form-item label="Dice Setting:">
          <div class="grid grid-cols-6 gap-x-8">
            <el-input-number
              :controls="false"
              class="w-12"
              :min="1"
              :max="6"
              v-model="form['1']"
              autocomplete="off"
            />
            <el-input-number
              :controls="false"
              class="w-12"
              :min="1"
              :max="6"
              v-model="form['2']"
              autocomplete="off"
            />
            <el-input-number
              :controls="false"
              class="w-12"
              :min="1"
              :max="6"
              v-model="form['3']"
              autocomplete="off"
            />
            <el-input-number
              :controls="false"
              class="w-12"
              :min="1"
              :max="6"
              v-model="form['4']"
              autocomplete="off"
            />
            <el-input-number
              :controls="false"
              class="w-12"
              :min="1"
              :max="6"
              v-model="form['5']"
              autocomplete="off"
            />
            <el-input-number
              :controls="false"
              class="w-12"
              :min="1"
              :max="6"
              v-model="form['6']"
              autocomplete="off"
            />
          </div>
        </el-form-item>
        <el-form-item label="Address of Opponent:">
          <el-input v-model="form.opponent" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createDiceBoxVisible = false">Cancel</el-button>
          <el-button
            type="primary"
            class="bg-amber-500 hover:bg-amber-500/50 hover:border-amber-500/50 border-amber-500"
            @click="createDiceBox(ruleFormRef)"
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
