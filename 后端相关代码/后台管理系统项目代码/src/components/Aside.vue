<template>
    <div class="aside">
        <el-menu :default-active="onRoutes" class="el-menu-vertical" :collapse="sidebar.collapse"
            background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" uunique-opened router>

            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-sub-menu :index="item.index" :key="item.index">
                        <template #title>
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-sub-menu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template #title>{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-sub-menu>
                            <el-menu-item v-else :index="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>
  
<script>
import { useSidebarStore } from '../store/sidebar';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

export default {
    setup() {
        const sidebar = useSidebarStore()

        const route = useRoute();
        const onRoutes = computed(() => {
            console.log(route.path);
            return route.path;
        });


        const items = [
            {
                icon: 'Odometer',
                index: '/',
                title: '系统首页',
            }, 
            {
                icon: 'User',
                index: '/employee',
                title: '成员管理',
            },
            {
                icon: 'Calendar',
                index: '2',
                title: '表单管理',
                subs: [
                    {
                        index: '/category',
                        title: '分类表',
                    },
                    {
                        index: '/provinces',
                        title: '省份表',
                    },
                    {
                        index: '/storage',
                        title: '题库表',
                    },
                    {
                        index: '/user',
                        title: '用户表',
                    },
                ]
            },

        ]
        return {
            sidebar,
            onRoutes,
            items
        }
    }
}


</script>
  
<style scoped>
.aside {
    display: block;
    position: absolute;
    left: 0;
    top: 60px;
    bottom: 0;
    /* 滚动条 */
    overflow-y: scroll;
}

/* 滚动条样式 */
.aside::-webkit-scrollbar {
    width: 0;
}

/* 侧边栏样式 */
.aside>ul {
    height: 100%;
}

.el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
}
</style>
  