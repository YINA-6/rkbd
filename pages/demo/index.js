// pages/demo/demo.js
import request from '../../utils/request'
// import { areaList } from '../../miniprogram_npm/@vant/area-data/data';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dataList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        // 1.获取传参
        const year = 2017
        const order = 0
        const key = year + order
            // 0.优先加载本地数据
        try {
            var value = wx.getStorageSync(key.toString())
            if (value) {
                // Do something with return value
                console.log('已获取本地数据')
                    // 传递给组件
                this.setData({
                    dataList: JSON.parse(value) // 这是要存储的数据
                })
            } else {
                const url = 'storage/' + year + '/' + order
                    // 2.请求服务器获取数据 
                await request(url).then(res => {
                        console.log('已获取网络数据')
                        this.setData({
                            dataList: res.data // 这是要存储的数据
                        })
                    })
                    // 清洗options字符串数组"
                this.data.dataList.forEach(x => {
                        x.options = x.options.split(','), // 处理选项
                            x.result = x.result.split(',') // 处理答案
                        x.isRight = [], //  兼容多选题
                            x.selectOption = [], // 兼容多选题
                            x.analysisController = false // 是否显示解析

                    })
                    // 存储数据
                wx.setStorage({
                    key: key.toString(),
                    data: JSON.stringify(this.data.dataList)
                })
            }
        } catch (e) {
            // Do something when catch error
            console.log(e)
        }
        // 加载索引页
        const child = this.selectComponent('#my-swiper')
        child.upSwiper(0)


    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})