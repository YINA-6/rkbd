// pages/index/index.js
import request from '../../utils/request'
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        proSeletctIsShow: false,
        subjectSelectIsShow: false,
        provinceInfo: [],
        subjectInfo: {
            text: '软件设计师',
            id: 7
        },
        subjectItem: [{
                text: '高级',
                disabled: false,
                children: [{
                        text: '信息系统项目管理师',
                        id: 1,
                    },
                    {
                        text: '系统分析师',
                        id: 2,
                    },
                    {
                        text: '系统架构设计师',
                        id: 3,
                    },
                    {
                        text: '网络规划设计师',
                        id: 4,
                    },
                    {
                        text: '系统规划与管理师',
                        id: 5,
                    },
                ],
            },
            {
                text: '中级',
                disabled: false,
                children: [{
                        text: '软件测评师',
                        id: 6,
                    },
                    {
                        text: '软件设计师',
                        id: 7,
                    },
                    {
                        text: '软件过程能力评估师',
                        id: 8,
                    },
                    {
                        text: '网络工程师',
                        id: 9,
                    },
                    {
                        text: '多媒体应用设计师',
                        id: 10,
                    },
                    {
                        text: '嵌入式系统架构师',
                        id: 11,
                    },
                    {
                        text: '计算机辅助设计师',
                        id: 12,
                    },
                    {
                        text: '电子商务设计师',
                        id: 13,
                    },
                    {
                        text: '系统集成项目管理工程师',
                        id: 14,
                    },
                    {
                        text: '信息系统监理师',
                        id: 15,
                    },
                    {
                        text: '信息安全工程师',
                        id: 16,
                    },
                    {
                        text: '数据库系统工程师',
                        id: 17,
                    },
                    {
                        text: '信息系统管理工程师',
                        id: 18,
                    },
                    {
                        text: '计算机硬件工程师',
                        id: 19,
                    },
                    {
                        text: '信息技术支持工程师',
                        id: 20,
                    },

                ],
            },
            {
                text: '初级',
                disabled: false,
                children: [{
                        text: '程序员',
                        id: 21,
                    },
                    {
                        text: '网络管理员',
                        id: 22,
                    },
                    {
                        text: '多媒体应用制作技术员',
                        id: 23,
                    },
                    {
                        text: '电子商务技术员',
                        id: 24,
                    },
                    {
                        text: '信息系统运行管理员',
                        id: 25,
                    },
                    {
                        text: '网页制作员',
                        id: 26,
                    },
                    {
                        text: '信息处理技术员',
                        id: 27,
                    },


                ]
            }
        ]
    },
    async onClickBtn({ currentTarget }) {
        if (currentTarget.id === 'ljzt') {
            wx.navigateTo({
                url: '/subpkg/pastExam/index?subject=' + this.data.subjectInfo.id,
            })
        } else if (currentTarget.id === 'sjlx') {
            await request(`storage/random/10/${app.globalData.subjectInfo.id}`).then(res => {
                if (res.data.length <= 0) {
                    // 报错
                    Dialog.alert({
                        title: '警告',
                        message: '当前科目题库正在录入中...',
                    }).then(() => {
                        wx.switchTab({
                            url: '/pages/index/index'
                        })
                    });
                    return
                } else {
                    wx.navigateTo({
                        url: `/subpkg/swiper/index?type=sjlx`,
                    })
                }
            })
        } else if (currentTarget.id === 'zxlx') {
            wx.navigateTo({
                url: '/subpkg/specialExam/index?subject=' + this.data.subjectInfo.id
            })
            console.log('请先登陆，否则您的做题记录可能会丢失')
        } else if (currentTarget.id === 'cuoti') {
            wx.navigateTo({
                url: '/subpkg/errorList/index'
            })
        }
    },
    onChangeShow() {
        this.setData({ proSeletctIsShow: true })
    },
    onChangeSubject() {
        console.log('切换科目');
        this.setData({ subjectSelectIsShow: true })
    },
    // 组件事件
    getSubject({ detail }) {
        this.setData({
            subjectInfo: detail
        })
        app.globalData.subjectInfo = detail
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