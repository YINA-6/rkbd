// components/subjectSelect/my-subject.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isShow: {
            type: Boolean,
            values: false
        },
        items: Array
    },

    /**
     * 组件的初始数据
     */
    data: {
        mainActiveIndex: 0,
        activeId: 7,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onClickNav({ detail = {} }) {
            this.setData({
                mainActiveIndex: detail.index || 0,
            });
        },

        onClickItem({ detail = {} }) {
            const activeId = this.data.activeId === detail.id ? null : detail.id;
            this.setData({
                activeId,
                isShow: false
            });
            this.triggerEvent("getSubjectEvent", detail)
        },
        onClickOverlay() {
            this.setData({ isShow: false })
        }
    }
})