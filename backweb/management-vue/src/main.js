import { createApp } from 'vue'
import store from './store/index'
import App from './App.vue'
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import router from "./router";

const app = createApp(App);

app.use(Antd).use(router).use(store).mount("#app");
