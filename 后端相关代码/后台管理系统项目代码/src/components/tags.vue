<template>
    <div class="tags" v-if="tags.show">
        <ul>
            <li class="tags-li" v-for="(item, index) in tags.list" :class="{ active: isActive(item.path) }"
                :key="index">
                <router-link :to="item.path" class="tags-li-title">{{ item.title }}</router-link>
                <el-icon @click="closeTags(index)">
                    <Close />
                </el-icon>
            </li>
        </ul>
    </div>

</template>

<script>
import { useTagsStore } from "../store/tags"
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';

export default {
    setup() {
        const tags = useTagsStore()
        const route = useRoute();
        const router = useRouter();

        const isActive = (path) => {
            return path === route.fullPath;
        };

        // 设置标签
        const setTags = (route) => {
            const isExist = tags.list.some(item => {
                return item.path === route.fullPath;
            });
            if (!isExist) {
                if (tags.list.length >= 8) tags.delTagsItem(0);
                tags.setTagsItem({
                    name: route.name,
                    title: route.meta.title,
                    path: route.fullPath
                });
            }
        };
        setTags(route);
        onBeforeRouteUpdate(to => {
            setTags(to);
        });


        // 关闭单个标签
        const closeTags = (index) => {
            const delItem = tags.list[index];
            tags.delTagsItem(index);
            const item = tags.list[index] ? tags.list[index] : tags.list[index - 1];
            if (item) {
                delItem.path === route.fullPath && router.push(item.path);
            } else {
                router.push('/');
            }
        };

        return {
            tags,
            isActive,
            setTags,
            closeTags
        }

    }
}
</script>

<style>
.tags {
    position: relative;
    height: 30px;
    overflow: hidden;
    background: #fff;
    padding-right: 120px;
    box-shadow: 0 5px 10px #ddd;
}

.tags ul {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
}

.tags-li {
    display: flex;
    align-items: center;
    float: left;
    margin: 3px 5px 2px 3px;
    border-radius: 3px;
    font-size: 12px;
    overflow: hidden;
    cursor: pointer;
    height: 23px;
    border: 1px solid #e9eaec;
    background: #fff;
    padding: 0 5px 0 12px;
    color: #666;
    -webkit-transition: all 0.3s ease-in;
    -moz-transition: all 0.3s ease-in;
    transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
    background: #f8f8f8;
}

.tags-li.active {
    color: #fff;
}

.tags-li-title {
    float: left;
    max-width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 5px;
    color: #666;
}

.tags-li.active .tags-li-title {
    color: #fff;
}
</style>