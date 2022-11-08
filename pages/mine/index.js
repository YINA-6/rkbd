// pages/mine/mine.js
import request from "../../utils/request"
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {}, //nickName,avatarUrl,city,province,country,gender,language
        hasUserInfo: false,
        userSession: {}, // openid,session_key
        userSyncData: { collects: [], errors: [] }, // 存储id
        quantityAndOdds: [0, 0], //amount, rightOdds
        responseData: {}, // question
        isSync: false, // 同步判断
        updateTime: '' //用户数据更新时间

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
        // 用户确认授权后，获取wx用户账号信息
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
                let odds = quantity == 0 ? 0 : odds = (right / quantity) * 100

                this.setData({ quantityAndOdds: [quantity, odds] })
            })
        } catch (e) {
            // Do something when catch error
        }
    },
    // 同步数据处理函数
    async synchrodata() {
        // ==========预处理=============
        if (!this.data.hasUserInfo) {
            // 警告通知
            wx.showToast({
                title: '请先登陆~',
                icon: 'error',
                mask: true,
            })
            return
        }
        // 获取用户的服务器数据-并做逻辑处理
        await this.getUserSyncInfo()
        if (!this.data.isSync) {
            return
        }
        console.log("========同步操作========");
        let storageCollects = wx.getStorageSync('collectionList')
        let storageErrors = wx.getStorageSync('errorList')

        // 把本地要同步的题目id加入
        if (storageCollects != '') {
            JSON.parse(storageCollects).forEach(x => {
                this.data.userSyncData.collects.push(x.id)
            })
        }
        if (storageErrors != '') {
            JSON.parse(storageErrors).forEach(x => {
                this.data.userSyncData.errors.push(x.id)
            })
        }
        // 清洗重复数据
        let noDuplicatedCollects = this.data.userSyncData.collects.filter((value, index, arr) => arr.indexOf(value) === index)

        let noDuplicatedErrors = this.data.userSyncData.errors.filter((value, index, arr) => arr.indexOf(value) === index)

        this.data.userSyncData.collects = noDuplicatedCollects
        this.data.userSyncData.errors = noDuplicatedErrors


        // 更新数据
        this.setData({ userSyncData: this.data.userSyncData })

        // 以id获取题目，并存储本地
        await this.storageOperation('collect')
        await this.storageOperation('error')

        await this.saveUserInfo()

    },
    async getUserSyncInfo() {
        // 服务器数据请求-做同步判断
        let isTrue = false
        this.data.isSync = isTrue
        await request("user/" + this.data.userSession.openid).then(res => {
            if (res.data != null) {
                // console.log(res.data);
                if (res.data.collects != "") {
                    res.data.collects.split(',').forEach(x => {
                        this.data.userSyncData.collects.push(parseInt(x))
                    })
                }
                if (res.data.errors != "") {
                    res.data.errors.split(',').forEach(x => {
                        this.data.userSyncData.errors.push(parseInt(x))
                    })
                }
                this.data.updateTime = res.data.updateTime
                    // 一天只同步一次数据
                const updataTime = wx.getStorageSync('updataTime')
                console.log("local updataTime is ", updataTime);
                if (!updataTime) {
                    console.log("local updataTime is empty, dont sync");
                    isTrue = false;
                }
                if (updataTime.slice(0, 10) == this.data.updateTime.slice(0, 10)) {
                    console.log("local datatime equal to sever dataTime");
                    wx.showToast({
                        title: '当天已经同步~',
                        icon: 'error',
                        mask: true,
                    })
                    isTrue = false;
                }
            } else {
                // 如果本地也没有数据
                if (storageCollects == '' && storageErrors == '') {
                    // 警告通知
                    wx.showToast({
                        title: '暂无同步数据~',
                        icon: 'error',
                        mask: true,
                    })
                    isTrue = false;
                }
            }
            // isTrue = true;
        })
        this.data.isSync = isTrue
    },
    // 上传用户数据到服务器
    async saveUserInfo() {
        const user = {
                openId: this.data.userSession.openid,
                quantityAndOdds: this.data.quantityAndOdds,
                collects: this.data.userSyncData.collects,
                errors: this.data.userSyncData.errors
            }
            // ！！！这里提交数据，数据表字段会有重复内容！！！
        await request('user', 'POST', user).then(res => {
            if (res.code == 200) {
                console.log("上传成功", res);
                wx.showToast({
                    title: '同步成功~',
                    icon: 'success',
                    mask: true,
                })
                this.data.updateTime = res.data.updateTime
            }
        })
    },

    async getQuestionById(ids) {
        if (ids == '') return
        await request("storage/" + ids).then(res => {
            console.log('获取题目', res);
            this.data.responseData = res.data
        })
    },

    async storageOperation(name) {
        if (name == 'collect') {
            // 以id获取题目
            await this.getQuestionById(this.data.userSyncData.collects.toString())
                // 存储到本地
            console.log("存储本地");
            wx.setStorageSync('collectionList', JSON.stringify(this.data.responseData))
        } else if (name == 'error') {
            // 以id获取题目
            await this.getQuestionById(this.data.userSyncData.errors.toString())
                // 存储到本地
            console.log("存储本地");
            wx.setStorageSync('errorList', JSON.stringify(this.data.responseData))
        }
    },
    PDFResources() {
        wx.showModal({
            content: '是否将网盘链接拷贝到你的剪贴板~',
            success: (res) => {
                if (res.confirm) {
                    wx.setClipboardData({
                        data: 'www.baidu.com',
                    })
                }
            }
        })
    },
    onClickNav({ currentTarget }) {
        console.log(currentTarget.id);
        if (currentTarget.id == 'feedback') {
            if (!this.data.hasUserInfo) {
                // 警告通知
                wx.showToast({
                    title: '请先登陆~',
                    icon: 'error',
                    mask: true,
                })
                return
            }
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