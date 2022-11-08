// subpkg/feedback/index.js

import request from "../../utils/request"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        textValue: ''
    },
    submit() {
        console.log(this.data.textValue.length);
        if (this.data.textValue.length < 10) {
            wx.showToast({
                title: '内容太少啦~',
                icon: "error"
            })
        }
        const user = {
            openId: wx.getStorageSync('userSession').openid,
            feedBack: this.data.textValue
        }
        request("user/feedback", 'POST', user).then(res => {
            console.log(res.data);
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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