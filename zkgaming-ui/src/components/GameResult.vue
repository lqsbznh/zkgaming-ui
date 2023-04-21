<script lang="ts">
import TerminalCode from "./TerminalCode.vue";
import { defineComponent } from "vue";
import { store } from "../store";

export default defineComponent({
  name: "GameResult",
  components: {
    TerminalCode,
  },
  props: {
    data: {
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
    account() {
      return store.account?.address()?.to_string();
    },
  },
  methods: {
    createDiceBox() {
      this.createDiceBoxVisible = false;
      this.terminalCode = `./target/release/snarkos developer execute \
        --private-key ${this.privateKey} \
        --broadcast "http://127.0.0.1:3030/testnet3/transaction/broadcast" \
        --query "http://127.0.0.1:3030" zkgaming_dice.aleo initial_dicebox ${this.form["1"]}${this.form["2"]}${this.form["3"]}${this.form["4"]}${this.form["5"]}${this.form["6"]}u32 aleo1klq6r032hk8hpmz700a23cm32afl72uu68x6xhvcajprzc40cs8qku0a3j`;
    },
    onCreate() {
      this.createDiceBoxVisible = true;
    },
  },
});
</script>

<template>
  <div class="">
    <div>
      <div class="flex">
        <span class="text-3xl font-medium">GameResult</span>
      </div>
      <div class="w-full rounded-xl mt-3 ring-1 ring-amber-800" v-if="this.data.length">
        <div class="grid grid-cols-6 bg-amber-800 rounded-t-xl p-3 text-white">
          <div class="col-span-1">GameId</div>
          <div class="col-span-5">Winner</div>
        </div>
        <div class="grid grid-cols-6 p-3 data-[winer=true]:text-green-600 data-[winer=false]:text-red-600 font-medium" v-for="value in this.data" :data-winer="!!(account == value.Winner)" v-bind:key="value._nonce" >
          <div class="col-span-1">{{ value.GameId.replace(/u32|u64/g, "") }}</div>
          <div
            class="col-span-5"
          >
            <div>{{ value.Winner }}</div>
          </div>
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
