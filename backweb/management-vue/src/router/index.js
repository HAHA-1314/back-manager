import { createRouter, createWebHistory } from "vue-router";

import LoginView from "../views/login.vue";
import RegisterView from "../views/register.vue";
import ContentView from "../views/content.vue"; //提供组件
import AdminComponent from "../components/admin.vue";
import UserComponent from "../components/user.vue";
import AdminSystemInfo from "../components/admin-system-info.vue";
import _404 from "../components/404.vue";
import Weather from "../components/weather.vue";
import TodoList from "../components/todoList.vue";

const routes = [
  //存储路由，自由定义路由规则
  {
    path: "/", //根路径
    rediect: "/login", //重定向
  },
  {
    path: "/login", //根路径
    component: LoginView, //导入对应组件
  },
  {
    path: "/register", //根路径
    component: RegisterView, //导入对应组件
  },
  {
    path: "/content",
    component: ContentView,
    children: [
      {
        path: "admin",
        component: AdminComponent,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "system-info",
            component: AdminSystemInfo,
          },
          {
            path: "todoList",
            component: TodoList,
          },
          {
            path: "qweather",
            component: Weather,
          },
        ],
      },
      {
        path: ":id",
        component: UserComponent,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "todoList",
            component: TodoList,
          },
          {
            path: "qweather",
            component: Weather,
          },
        ],
      },
    ],
  },
  {
    path: "/404",
    component: _404,
  },
];

const router = createRouter({
  history: createWebHistory(), // createWebHashHistory
  routes,
});

export default router; //路由器导出
