import Vue from 'vue';
import router from './router';
import ws from './socket';
import './styles/global.scss';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(ws, {
  url: 'ws://localhost:8000',
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
