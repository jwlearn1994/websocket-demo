export default {
  install(Vue, options) {
    const connect = Vue.prototype.$connect = () => {
      const ws = new WebSocket(options.url);

      ws.addEventListener('open', () => {
        console.log('Socket opened');
      });

      ws.addEventListener('close', (e) => {
        console.log('Socket closed. Reconnect will be attempted in 1 second.', e.reason);
        connect();
      });

      Vue.prototype.$ws = ws;
    };
    connect();
  },
};
