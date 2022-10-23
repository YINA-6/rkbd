// components/provinceSelect/my-provinceSelect.js
import { areaList } from '../../miniprogram_npm/@vant/area-data/data';

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isShow: {
            type: Boolean,
            values: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        areaList,
        province: '北京市'
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onAreaConfirm({ detail }) {
            var eventDetail = {}
            this.setData({ province: [detail.values[0].code, detail.values[0].name], isShow: false })
            eventDetail["province"] = this.data.province
            eventDetail["isShow"] = this.data.isShow
                // 组件事件

            this.triggerEvent('getProvinceEvent', eventDetail)
        },
        onAreaCancel() {
            console.log('cancel 按钮');
            this.setData({ isShow: false })
        },
        onChangeShow() {
            this.setData({
                isShow: true
            })
        },
    }
})