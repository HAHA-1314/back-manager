<template>
  <div>
    <a-row
      justify="center"
      style="font-size: 30px; font-weight: 300; margin-bottom: 10px"
    >
      注册账号
    </a-row>
    <a-row style="margin-bottom: 10px" justify="center">
      <a-input
        placeholder="请输入账号"
        v-model:value="username"
        style="width: 80%"
      >
        <template #prefix>
          <user-outlined type="user" />
        </template>
        <template #suffix>
          <a-tooltip title="length expect for at least 6.">
            <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
          </a-tooltip>
        </template>
      </a-input>
    </a-row>
    <a-row justify="center">
      <a-input-password
        style="width: 80%"
        placeholder="请输入您的密码"
        v-model:value="first_password"
      >
        <template #prefix>
          <LockOutlined></LockOutlined>
        </template>
      </a-input-password>
    </a-row>
    <a-row style="margin-top: 10px" justify="center">
      <a-input-password
        placeholder="再输入一次密码,确认您的密码"
        v-model:value="second_password"
        style="width: 80%"
      >
        <template #prefix>
          <LockOutlined></LockOutlined>
        </template>
      </a-input-password>
    </a-row>
    <a-row justify="center">
      <a-button
        type="primary"
        style="margin-top: 10px"
        :loading="loading"
        @click="handleRegister"
        >注册</a-button
      >
      <router-link to="/login">login</router-link>
    </a-row>
  </div>
</template>

<script setup>
// import { message } from '../../node_modules/ant-design-vue';
import { message } from "ant-design-vue";
import {
  UserOutlined,
  InfoCircleOutlined,
  LockOutlined,
} from "@ant-design/icons-vue";
import { ref } from "vue";
import axios from "axios";
// import { useInternalMessage } from "ant-design-vue/es/message/useMessage";

const loading = ref(false);
const username = ref(null);
const first_password = ref(null);
const second_password = ref(null);

const handleRegister = async () => {
  // message.error("用户名不能为空");
  // message.success("用户名不能为空");
  //   console.log(username.value.length);
  //   console.log(username.value);
  if (username.value == null || username.value == "") {
    console.log(username.value);
    message.error("用户名不能为空！");
    return;
  } else if (username.value.length < 6) {
    message.error("用户名长度不能少于6！");
    return;
  } else if (first_password.value == null || first_password.value == "") {
    message.error("密码不能为空！");
    return;
  } else if (second_password.value == null || second_password.value == "") {
    message.error("请再次输入您的密码以确认！");
    return;
  } else if (first_password.value.length < 6) {
    message.error("密码长度不能少于6！");
    return;
  } else if (first_password.value != second_password.value) {
    message.error("两次密码不一致！");
    return;
  }
  try {
    const res = (
      await axios.request({
        url: "http://localhost:3001/register",
        method: "post",
        data: {
          username: username.value,
          password: first_password.value,
        },
      })
    ).data;
    if (res.err == null) {
      message.success("注册成功！");
    } else {
      message.error(res.err);
    }
  } catch (error) {
    message.error("Register Wrong!404");
  }
};
</script>
<style scoped></style>
