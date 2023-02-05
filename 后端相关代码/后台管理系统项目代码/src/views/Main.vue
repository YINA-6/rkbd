<template>
    <Header></Header>
    <Aside></Aside>
    <div class="content-box" :class="{ 'content-collapse': sidebarStore.collapse }">
        <tags></tags>
        <div class="content">
            <router-view v-slot="{ Component }">
                <transition name="move" mode="out-in">
                    <keep-alive :include="nameList.value">
                        <component :is="Component"></component>
                    </keep-alive>
                </transition>
            </router-view>
        </div>
    </div>

</template>
  
<script setup>
import Header from "../components/Header.vue"
import Aside from "../components/Aside.vue"
import tags from "../components/tags.vue"
import { useSidebarStore } from "../store/sidebar"
import { useTagsStore } from "../store/tags"
import {ref} from 'vue'
const sidebarStore = useSidebarStore()
const tagsStore = useTagsStore()
const nameList = ref(tagsStore.nameList)

</script>
  
<style scoped>
.layout-container-demo .el-header {
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
    color: var(--el-text-color-primary);
    background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
    border-right: none;
}

.layout-container-demo .el-main {
    padding: 0;
}

.layout-container-demo .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
}
</style>
  