<template>
  <a-layout class="userMenu">
    <a-layout-sider theme="light">
      <a-menu
        id="dddddd"
        style="user-select: none"
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        @click="handleClick"
      >
        <a-sub-menu key="sub1" @titleClick="titleClick">
          <template #icon>
            <MailOutlined />
          </template>
          <template #title>Profile</template>
          <a-menu-item-group key="g1">
            <template #icon>
              <QqOutlined />
            </template>
            <template #title>UserInfo List</template>
            <a-menu-item key="1">Basic Info</a-menu-item>
            <a-menu-item key="2">Edit Info</a-menu-item>
          </a-menu-item-group>
          <a-menu-item-group key="g2" title="System Info">
            <a-menu-item key="3">Basic Info</a-menu-item>
            <a-menu-item key="4">Other Info</a-menu-item>
          </a-menu-item-group>
        </a-sub-menu>
        <a-sub-menu key="sub2" @titleClick="titleClick">
          <template #icon>
            <AppstoreOutlined />
          </template>
          <template #title>Demo</template>
          <a-menu-item key="5">To do List</a-menu-item>
          <a-menu-item key="6">Weather Search</a-menu-item>
          <a-sub-menu key="sub3" title="Submenu">
            <a-menu-item key="7">Option 7</a-menu-item>
            <a-menu-item key="8">Option 8</a-menu-item>
          </a-sub-menu>
        </a-sub-menu>
        <a-sub-menu key="sub4">
          <template #icon>
            <SettingOutlined />
          </template>
          <template #title>Setting</template>
          <a-menu-item key="9">Option 9</a-menu-item>
          <a-menu-item key="10">Option 10</a-menu-item>
          <a-menu-item key="11">Option 11</a-menu-item>
          <a-menu-item key="12">Logout</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content>
        <router-view class="userProfile"></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import {
  MailOutlined,
  QqOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue";
import router from "../router";
import { useStore } from "vuex/dist/vuex.cjs.js";

const vuexStore = useStore();
const selectedKeys = ref(["1"]);
const openKeys = ref(["sub1"]);
const handleClick = (e) => {
  if (e.key == 1) {
    console.log("user basic info");
    if (vuexStore.state.rule === "admin") router.push("/content/admin");
  }
  if (e.key == 3) {
    //对应system basic info按钮
    console.log("system basic info");
    if (vuexStore.state.rule === "admin")
      router.push("/content/admin/system-info");
  }
  if (e.key == 5) {
    //对应To do List按钮
    console.log("open To do List");
    if (vuexStore.state.rule === "admin")
      router.push("/content/admin/todoList");
    else if (vuexStore.state.rule === "user")
      router.push(`/content/${vuexStore.state.username}`);
  }
  if (e.key == 6) {
    //对应To do List按钮
    console.log("open Weather Search");
    router.push("/content/admin/qweather");
  }
  if (e.key == 12) {
    //对应logout按钮
    console.log("logout");
    localStorage.removeItem("token");
    sessionStorage.removeItem("state");
    vuexStore.commit("islogin", { islogin: false, rule: null });
    router.push("/login");
  }
};
const titleClick = (e) => {
  console.log("titleClick", e);
};
onMounted(() => {
  window.addEventListener("load", reloadPage);
});
const reloadPage = () => {
  console.log("reload content");
  if (vuexStore.state.rule == "admin") router.push("/content/admin");
  else if (vuexStore.state.rule == "user")
    router.push(`/content/${vuexStore.state.username}`);
};
</script>
<style scoped>
.userProfile {
  margin-left: 20px;
  margin-top: 20px;
}

</style>
