// pages/pastExam/pastExam.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        msg: 'hello world',
        dataList: []
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 请求数据并存储
        // request("/storage/2017/1").then(res => {
        //     console.log('@@页面请求数据-dataList', res.data)
        //     this.setData({
        //         dataList: res.data // 这是我要传递的数据
        //     })
        // })

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