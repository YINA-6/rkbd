// pages/mine/mine.js
import request from "../../utils/request"
import Toast from '@vant/weapp/toast/toast';
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        hasUserInfo: false,
        userSession: {},
        quantityAndOdds: [0, 0]
    },

    getUserProfile(e) {
        wx.getUserProfile({
            desc: '用于获取账号信息',
            success: (res) => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
                wx.setStorageSync('userInfo', this.data.userInfo)
                this.getUserSession()
            }
        })
    },
    getUserSession() {
        // 用户确认授权后，获取用户账号信息
        wx.login({
            success: (res) => {
                if (res.code) {
                    // 发起网络请求
                    request('/wx/login/' + res.code).then(res => {
                        if (res.data) {
                            this.setData({ userSession: res.data })
                            wx.setStorageSync('userSession', this.data.userSession)
                        }
                    })
                }
            }
        })
    },
    exitLogin() {
        this.setData({
            userInfo: {},
            userSession: {},
            hasUserInfo: false
        })
        wx.removeStorageSync('userInfo')
        wx.removeStorageSync('userSession')
    },

    // 获取 答题数量& 答题正确率
    getAnswerData() {
        let right = 0
        let error = 0
        try {
            const res = wx.getStorageInfoSync()
            res.keys.forEach(key => {
                try {
                    var value = wx.getStorageSync(key)
                    if (value) {
                        // Do something with return value
                        if (value.indexOf('recordIndex') != -1) {
                            // console.log(JSON.parse(value).pop());
                            // calculate
                            const append = JSON.parse(value).pop()
                            right += append.answerCount[0]
                            error += append.answerCount[1]
                        }
                    }
                } catch (e) {
                    // Do something when catch error
                }
                let quantity = right + error
                let odds = (right / quantity) * 100
                this.setData({ quantityAndOdds: [quantity, odds] })
            })
        } catch (e) {
            // Do something when catch error
        }
    },
    // 同步数据处理函数
    synchrodata() {
        if (this.data.hasUserInfo) {
            Toast.loading({
                message: '加载中...',
                forbidClick: true,
            });
        } else {
            Toast('请先登陆噢~');
        }
    },
    onClickNav({ currentTarget }) {
        console.log(currentTarget.id);
        if (currentTarget.id == 'feedback') {
            wx.navigateTo({
                url: '/subpkg/feedback/index',
            })
        } else if (currentTarget.id == 'aboutUs') {
            wx.navigateTo({
                url: '/subpkg/about/index',
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 加载本地用户信息
        let userInfo = wx.getStorageSync('userInfo')
        let userSession = wx.getStorageSync('userSession')
        if (userInfo && userSession) {
            this.setData({ userInfo, userSession, hasUserInfo: true })
        } else {
            console.log('未获取到本地用户信息');
        }

        this.getAnswerData()
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
        this.getAnswerData()
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