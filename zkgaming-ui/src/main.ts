import * as Vue from "vue";
import App from "./App.vue";
import * as VueRouter from "vue-router";
import ElementPlus from 'element-plus'
import VueClipboard from 'vue-clipboard2'
import VueCookies from 'vue-cookies'
import 'element-plus/dist/index.css'
import "./assets/main.css";



import GameBoard from './page/GameBoard.vue';
import Login from './page/Login.vue';

const routes = [
  { path: "/", component: GameBoard },
  { path: "/login", component: Login },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

const app = Vue.createApp(App);

app.use(VueCookies, { expires: '1d'})
app.use(ElementPlus)
app.use(VueClipboard)
app.use(router);

app.mount("#app");
