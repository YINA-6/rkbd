// subpkg/randomExam/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        number: 10
    },
    // 跳转
    onClickConfirm() {
        wx.navigateTo({
            url: '/subpkg/swiper/index?number=' + this.data.number + '&type=sjlx',
        })
    },
    // 修改数量
    onClickAlterADD() {
        console.log('Alter add');
        this.setData({ number: this.data.number + 1 })
    },
    onClickAlterREDUCE() {
        console.log('Alter reduce');
        if (this.data.number <= 1) {
            return
        }
        this.setData({ number: this.data.number - 1 })
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