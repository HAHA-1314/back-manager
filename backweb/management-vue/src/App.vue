<template>
  <router-view></router-view>
</template>

<script setup>
import axios from "axios";
import { useStore } from "vuex";
import router from "./router";
import { onMounted } from "vue";
const vuexisLogin = useStore();

router.beforeEach(async (to, from) => {
  if (to.meta.requiresAuth) {
    //路径导航守卫
    console.log("requiresAuth");
    if (
      vuexisLogin.state.rule == "admin" &&
      (to.fullPath == "/content/admin" ||
        to.fullPath == "/content/admin/system-info" ||
        to.fullPath == "/content/admin/todoList" ||
      to.fullPath == "/content/admin/qweather")
    ) {
      console.log(vuexisLogin.state);
    } else if (
      vuexisLogin.state.rule == "user" &&
      (to.fullPath == `/content/${vuexisLogin.state.username}` ||
        to.fullPath == `/content/${vuexisLogin.state.username}/todolist` ||
        to.fullPath == `/content/${vuexisLogin.state.username}/qweather`)
    ) {
      console.log(vuexisLogin.state);
    } else {
      console.log("Not Auth");
      console.log(to);
      console.log(from);
      router.push("/404");
    }
  }
  if (localStorage.getItem("token") != null && to.fullPath == '/login') {
    const islogin = (
      await axios.request({
        method: "post",
        url: "http://localhost:3001/islogin",
        data: {
          token: localStorage.getItem("token"),
        },
      })
    ).data;
    console.log(islogin);
    if (islogin.err !== null) {
      vuexisLogin.commit("islogin", islogin);
      console.log("token失效");
    } else if (islogin.authority === "admin") {
      // console.log(islogin);
      vuexisLogin.commit("islogin", islogin);
      router.push("/content/admin");
    } else if (islogin.authority === "user") {
      // console.log(islogin);
      vuexisLogin.commit("islogin", islogin);
      router.push({ path: `/content/${vuexisLogin.state.username}` });
    }
  } else if (localStorage.getItem("token") == null && to.fullPath == null) {
    router.push("/login");
  }
  // return false;
});

onMounted(() => {
  window.addEventListener("unload", saveState); //刷新之前完成保存vuex数据
  console.log("vuexisLogin.state.islogin", vuexisLogin.state.islogin);
});

const saveState = () => {
  console.log("vuexisLogin.state.islogin", vuexisLogin.state.islogin);
  if (vuexisLogin.state.islogin == true) {
    console.log("saveState:islogin == true");
    sessionStorage.setItem("state", JSON.stringify(vuexisLogin.state));
  } else {
    return;
  }
};
</script>

<style scoped></style>
