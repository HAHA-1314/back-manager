<template>
    <div>
        <div v-if="userPage">
            <h1>Admin-Component</h1>
            <div>username: {{ vuexStore.state.username }}</div>
            <div>rule: {{ vuexStore.state.rule }}</div>
        </div>
        <router-view></router-view>
    </div>  
</template>

<script setup>
import { ref } from 'vue';
import router from '../router';
import { useStore } from 'vuex/dist/vuex.cjs.js';

const userPage = ref(true);
const vuexStore = useStore();

router.beforeEach((to, from) => {
    if (to.fullPath != '/content/admin') {
        userPage.value = false;
    }
    else userPage.value = true;
})
</script>

<style scoped>

</style>
