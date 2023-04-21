import { reactive } from "vue";
import init from '@aleohq/wasm';
import type { Account } from "@aleohq/sdk";
await init("http://localhost:5173/node_modules/@aleohq/wasm/aleo_wasm_bg.wasm");


export const store = reactive({
    account: null as Account | null,

    setAccount(account: Account) {
        this.account = account
    }
})