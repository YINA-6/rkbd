<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <el-icon v-if="sidebar.collapse">
                <Expand />
            </el-icon>
            <el-icon v-else>
                <Fold />
            </el-icon>
        </div>
        <div class="logo">后台管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 消息中心 -->
                <div class="btn-bell">
                    <el-tooltip effect="dark" content="未读消息" placement="bottom">
                        <el-icon size="20">
                            <Message />
                        </el-icon>
                    </el-tooltip>
                </div>
                <!-- 用户头像 -->
                <el-avatar class="user-avator" :size="30" src="/img.jpg" />
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click">
                    <span class="el-dropdown-link">
                        {{userInfo.username}}
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="user">个人中心</el-dropdown-item>
                            <el-dropdown-item divided command="loginout" @click="logOut">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>

    </div>


</template>

<script setup  name="header">
import { useSidebarStore } from '../store/sidebar'
import { reactive, onMounted } from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter()
const sidebar = useSidebarStore()
// 侧边栏折叠
const collapseChage = () => {
    sidebar.handleCollapse();
}
const userInfo = reactive({
    username: '',
    id: '',
})
const logOut = ()=>{
    console.log('退出登录');
    localStorage.removeItem('userInfo')
    router.push('/login')
}
onMounted(() => {
    [userInfo.id, userInfo.username] = [...Object.values(JSON.parse(localStorage.getItem('userInfo')))]
    console.log('onMounted');
})
</script>

<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    font-size: 22px;
    color: #fff;
}

.collapse-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    float: left;
    padding: 0 21px;
    cursor: pointer;
}

.header .logo {
    float: left;
    width: 200px;
    line-height: 60px;
}

.header-right {
    float: right;
    padding-right: 50px;
}

.header-user-con {
    display: flex;
    height: 60px;
    align-items: center;
}

.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.user-name {
    margin-left: 10px;
}

.user-avator {
    margin-left: 20px;
}

.el-dropdown-link {
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
}
</style>
