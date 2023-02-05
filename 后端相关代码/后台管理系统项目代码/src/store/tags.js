import { defineStore } from 'pinia';

export const useTagsStore = defineStore('tags', {
    state: () => {
        return {
            list: []
                /**
         * interface ListItem {
                name: string;
                path: string;
                title: string;
            }
         */
        }
    },
    getters: {
        show: (state) => {
            return state.list.length > 0;
        },
        nameList: (state) => {
            return state.list.map(item => item.name);
        }
    },
    actions: {
        setTagsItem(data) {
            this.list.push(data);
        },
        delTagsItem(index) {
            this.list.splice(index, 1);
        },
    }

})