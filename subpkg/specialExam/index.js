// subpkg/specialExam/index.js
import request from "../../utils/request"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeName: '0',
        dataList: [],
        percentageList: []
    },
    onChange(event) {
        this.setData({
            activeName: event.detail,
        });
    },
    onClickStart({ currentTarget }) {
        const item = currentTarget.dataset.item
        const id = item.categoryId
        console.log(id)
        wx.navigateTo({
            url: '/subpkg/swiper/index?cid=' + id + '&type=zxlx',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        // 获取分类信息
        await request('category').then(res => {
            this.setData({ dataList: res.data })
        })

        // 获取本地存储 计算答题进度

        for (let i = 0; i < this.data.dataList.length; i++) {
            let yesNumber = 0
            const value = ''
            try {
                value = wx.getStorageSync('categoryId' + i)
                if (value) {
                    // Do something with return value
                    value = JSON.parse(value)
                    value.forEach(x => {
                        x.analysisController == true ? yesNumber++ : 0
                    })
                }
            } catch (e) {
                // Do something when catch error
                console.log(e);
            }


            this.data.percentageList.push({ 'cid': i, 'percentage': (yesNumber / value.length).toFixed(2) * 100, 'yesNumber': yesNumber })
            this.setData({
                percentageList: this.data.percentageList
            })
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