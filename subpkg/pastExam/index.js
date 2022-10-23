import request from '../../utils/request'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        yearList: [],
        yearNameList: [],
        year: '',
        order: ''

    },
    onClickGrid({ currentTarget }) {
        let item = currentTarget.dataset.item
        let year = item.substring(0, 4)
        let order = item.substring(4, 5)
        this.setData({
            year,
            order
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        let list = []
        let data = []
        await request('storage/yearlist').then(res => {
            data = res.data
            res.data.forEach(x => {
                let order = x.substring(4, 5)
                if (order == 0) {
                    list.push(x.substring(0, 4) + '上半年')
                } else {
                    list.push(x.substring(0, 4) + '下半年')
                }
            })
        })
        this.setData({ yearNameList: list, yearList: data })
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