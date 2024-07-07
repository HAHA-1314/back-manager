<template>
  <div class="body">
    <a-row :span="24" class="header">Management System 登录页面</a-row>
    <a-row class="content">
      <div class="loginModal">
        <a-row justify="center">
          <a-col style="font-size: 30px; margin-top: 10px; font-weight: 300">
            登录
          </a-col>
        </a-row>
        <a-row align="center" style="margin-top: 10px">
          <a-col style="width: 80%; margin-bottom: 20px">
            <a-input placeholder="请输入账号" v-model:value="username">
              <template #prefix>
                <user-outlined type="user" />
              </template>
              <template #suffix>
                <a-tooltip title="length expect for at least 6.">
                  <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
                </a-tooltip>
              </template>
            </a-input>
          </a-col>
        </a-row>
        <a-row align="center" style="margin-top: 10px">
          <a-col style="width: 80%; margin-bottom: 20px">
            <a-input-password placeholder="请输入密码" v-model:value="password">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-col>
        </a-row>
        <a-row align="center">
          <a-col style="margin-bottom: 20px">
            <a-button type="primary" @click="handleLogin" :loading="loading"
              >登录
              <template #icon>
                <PoweroffOutlined />
              </template>
            </a-button>
          </a-col>
        </a-row>
      </div>
    </a-row>
    <a-row :span="24" class="footer" justify="center">
      Management System ©2018 Created by HAHA
      <router-link to="/register">Register</router-link>
    </a-row>
  </div>

</template>

<script setup>
// import FancyButton from 'vue'
import { ref } from "vue";
import {
  UserOutlined,
  InfoCircleOutlined,
  LockOutlined,
  PoweroffOutlined,
} from "@ant-design/icons-vue";
import router from "../router/index.js";
import axios from "axios";
import { message as ant_message } from "ant-design-vue";
import { useStore } from "vuex/dist/vuex.cjs.js";
const username = ref(null);
const password = ref(null);
const loading = ref(false);
const vuexisLogin = useStore();

const handleLogin = async () => {
  if (username.value == null || username.value == "") {
    ant_message.error("用户名不能为空");
    return;
  } else if (username.value.length < 6) {
    ant_message.error("用户名长度不能小于6");
    return;
  } else if (password.value == null || password.value == "") {
    ant_message.error("密码不能为空");
    return;
  } else if (password.value.length < 6) {
    ant_message.error("密码长度不能小于6");
    return;
  }
  //使用正则表达式？
  loading.value = true;
  try {
    const res = (
      await axios.request({
        url: "http://localhost:3001/login",
        method: "post",
        data: {
          username: username.value,
          password: password.value,
        },
      })
    ).data;
    if (res.err == null) {
      ant_message.success("登陆成功！");
      localStorage.setItem("token", res.token);
      if (res.authority == "admin") {
        vuexisLogin.commit("islogin", res);
        router.push("/content/admin");
      } else if (res.authority == "user") {
        vuexisLogin.commit("islogin", res);
        router.push({ path: `/content/${res.username}` }); //不能直接使用vuexisLogin.state.username 否则undefined
      }
    } else {
      ant_message.error(res.err);
    }
  } catch (error) {
    ant_message.error("登录异常404");
    console.log(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.body {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(../assets/background.png);
  background-size: cover;
}
.header {
  display: inline-block;
  margin-bottom: 30px;
  width: 100%;
  text-align: center;
  background-color: #fff3;
  line-height: 60px;
  font-size: 28px;
  color: #f8eeee;
}
.footer {
  line-height: 60px;
  font-size: 18px;
  white-space: nowrap;
}
.loginModal {
  display: inline-block;
  position: relative;
  width: 80%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  border-radius: 10px;
  will-change: filter;
  transition: filter 300ms;
}
.loginModal:hover {
  filter: drop-shadow(0 0 20px #fff4);
}
</style>
