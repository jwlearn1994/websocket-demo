<template>
  <div class="view-home">
    <div class="chat-board">
      <div
        v-for="item in messages"
        :key="`chat_item_${item.msg}`"
        class="chat-item"
      >
        {{ item.msg }}
      </div>
    </div>
    <div class="chat-panel">
      <textarea class="form-control" v-model="msg" />
      <div class="send-btn" @click="onSendMsg">
        <span class="material-icons">send</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ViewHome',
  data() {
    return {
      msg: '',
      messages: [],
    };
  },
  watch: {
    $ws() {
      this.initSocketEvents();
    },
  },
  methods: {
    initSocketEvents() {
      const vm = this;
      vm.$ws.addEventListener('message', ({ data }) => {
        vm.messages.push(JSON.parse(data));
      });
    },
    onSendMsg() {
      const vm = this;
      const payload = {
        msg: vm.msg,
        date: new Date().getTime(),
      };
      vm.$ws.send(JSON.stringify(payload));
      vm.msg = '';
    },
  },
  created() {
    this.initSocketEvents();
  },
};
</script>

<style lang="scss">
.view-home {
  max-width: 375px;
  height: 100%;
  margin: auto;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  .chat-board {
    flex: 1;
  }
  .chat-panel {
    display: flex;
    align-items: center;
    padding: 12px 10px;
    border-top: 1px solid #ddd;
    background: #a3d1e0;
    > textarea {
      height: 50px;
      margin-right: 10px;
    }
    .send-btn {
      user-select: none;
      cursor: pointer;
    }
  }
}
</style>
