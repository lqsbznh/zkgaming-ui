<script setup lang="ts">
import init, { PrivateKey, RecordCiphertext } from '@aleohq/wasm';

// Initialize WASM
init("http://localhost:5173/node_modules/@aleohq/wasm/aleo_wasm_bg.wasm");
</script>

<template>
  <main class="container mx-auto">
    <router-view></router-view>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
