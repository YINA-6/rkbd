// subpkg/errorList/index.js

import request from '../../utils/request';
import Dialog from '@vant/weapp/dialog/dialog';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        swiperCurrent: 0,

        //
        activeName: '0',
        categoryList: [],

        // 
        errorIsEmpty: false, // 错题集为空
        collectIsEmpty: false, // 错题集为空

        //
        errorDialogShow: false,
        collectDialogShow: false

    },
    changeItem({ detail }) {
        this.setData({ swiperCurrent: detail.current })
    },
    onClickCuoti() {
        this.setData({ swiperCurrent: 0 })
    },
    onClickCollect() {
        this.setData({ swiperCurrent: 1 })
    },
    onChange(event) {
        this.setData({
            activeName: event.detail,
        });
    },
    onClickStart({ currentTarget }) {
        wx.navigateTo({
            url: '/subpkg/swiper/index?type=ctlx',
        })
    },
    onClickErrorBtn() {
        this.setData({ errorDialogShow: true })
    },
    onCancelErrorDialog() {
        this.setData({ errorDialogShow: false })
    },
    onConfirmErrorDialog() {
        // 移除本地存储
        wx.removeStorage({
                key: 'errorList',
            })
            // 遍历categoryList.item，查找error元素
        let categoryList = this.data.categoryList.filter((value, index, arr) => {
                if (value.errors.length > 0) {
                    console.log(value);
                    // 有则清除 error = []
                    value.errors = []
                }
                return value
            })
            // 更新数据
        this.setData({ errorIsEmpty: true, categoryList })
        console.log('已清除errorList');
    },

    onClickCollectBtn() {
        console.log('collect btn click')
        this.setData({ collectDialogShow: true })
    },
    onCancelCollectDialog() {
        this.setData({ collcetDialogShow: false })
    },
    onConfirmCollectDialog() {
        // 移除本地存储
        wx.removeStorage({
                key: 'collectionList',
            })
            // 遍历collectionList.item，查找collect元素
        let categoryList = this.data.categoryList.filter((value, index, arr) => {
                if (value.collect.length > 0) {
                    console.log(value);
                    // 有则清除 collect = []
                    value.collect = []
                }
                return value
            })
            // 更新数据
        this.setData({ collectIsEmpty: true, categoryList })
        console.log('已清除collectionList');
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {

        // 获取分类信息
        await request('category').then(res => {
            this.setData({
                categoryList: res.data
            })
        })

        let errorValue = wx.getStorageSync('errorList')
        if (errorValue != '') {
            this.data.categoryList.forEach((item, index) => {
                // 修改categoryList，追加error元素
                item['errors'] = []
                JSON.parse(errorValue).forEach(x => {
                    if (x.categoryId == item.categoryId) {
                        item['errors'].push(x)
                    }
                })
                this.data.categoryList[index] = item
            })

        } else {
            console.log('当前没有错题记录')
            this.setData({ errorIsEmpty: true })
        }


        let collectValue = wx.getStorageSync('collectionList')
        if (collectValue != '') {
            this.data.categoryList.forEach((item, index) => {
                // 修改categoryList，追加error元素
                item['collect'] = []
                JSON.parse(collectValue).forEach(x => {
                    if (x.categoryId == item.categoryId) {
                        item['collect'].push(x)
                    }
                })
                this.data.categoryList[index] = item
            })
        } else {
            console.log('当前没有收藏记录')
            this.setData({ collectIsEmpty: true })

        }
        this.setData({ categoryList: this.data.categoryList })


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