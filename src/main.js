import Vue from "vue";
import App from "./App.vue";
import "@/assets/styles/tailwind.css";
import lodash from "lodash";
window._ = lodash;
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
