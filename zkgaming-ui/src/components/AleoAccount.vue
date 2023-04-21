<script lang="ts">
import { defineComponent } from "vue";
import { Account, type Block } from "@aleohq/sdk";

import { store } from "../store";

export default defineComponent({
  name: "AleoAccount",
  data() {
    return {
      pk: "",
    };
  },
  methods: {
    setAccount() {
      let account = new Account({ privateKey: this.pk });
      store.setAccount(account);
      this.$router.push("/");

      console.log("Set account", account);
    },
  },
});
</script>

<template>
  <div>
    <input
      type="text"
      placeholder="Enter your private key"
      class="border rounded-lg h-14 w-full my-20 px-4"
      v-model="pk"
    />
    <button class="w-full bg-amber-500 inline-block h-14 rounded-lg" @click="setAccount">
      Confirm
    </button>
  </div>
</template>
