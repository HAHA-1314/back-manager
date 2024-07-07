import { createStore } from "vuex";

const state = sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')) : {
  islogin: false,
  rule: null,
  username: null, //username 
};

const mutations = {
  islogin(state,user) {
    state.islogin = user.islogin;
    state.rule = user.authority;
    state.username = user.username;
  },
};

export default createStore({
    state,
    mutations,
});
