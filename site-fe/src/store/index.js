import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state:{
    userInfo: {}
  },
  getters:{//通过getters定义的内容应该可以直接用.访问
    isLogin(state){
      return !!Object.keys(state.userInfo).length;//双重否定等于肯定
    }
  },
  mutations:{
    changeUserInfo(state, data){
      state.userInfo = data;
    }
  },
  actions:{}
})

export default store;