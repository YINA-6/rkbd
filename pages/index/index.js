// pages/index/index.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow: false,
        provinceInfo: []
    },
    onClickBtn({ currentTarget }) {
        if (currentTarget.id === 'ljzt') {
            wx.navigateTo({
                url: '/subpkg/pastExam/index',
            })
        } else if (currentTarget.id === 'sjlx') {
            wx.navigateTo({
                url: '/subpkg/randomExam/index',
            })
        } else if (currentTarget.id === 'zxlx') {
            console.log('navigateTo zxlx')
        } else if (currentTarget.id === 'cuoti') {
            console.log('navigateTo cuoti')
        }
    },
    onChangeShow() {
        this.setData({ isShow: true })
    },
    // 组件事件
    async getProvince({ detail }) {
        let id = detail.province[0]
        await request('provinces/' + id).then(res => {
            this.setData({ provinceInfo: res.data, isShow: detail.isShow })
            wx.setStorageSync('provinceInfo', res.data) // 本地存储
        })


    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 加载省市信息
        let data = wx.getStorageSync('provinceInfo')
        if (data) {
            this.setData({ provinceInfo: data })
        }

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