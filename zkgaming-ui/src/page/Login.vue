<script lang="ts">
import AleoAccount from "../components/AleoAccount.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Login",
  components: {
    AleoAccount,
  },
  data() {
    return {};
  },
  computed: {},
  async created() {},
});
</script>

<template>
  <div class="translate-y-1/2 w-96 mx-auto">
    <h1 class="text-5xl font-bold">Set Account</h1>
    <AleoAccount />
  </div>
</template>

<style scoped></style>
