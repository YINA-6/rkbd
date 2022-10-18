// subpkg/myswiper/mySwiper.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dataList: [],
        swiperList: [], //swiper数据 固定3个
        navBarTitle: '刷题模式', // 导航栏标题
        globalController: false, // 全局控制变量，由navBar控制
        currentIndex: 0, //dataList的index
        swiperCurrent: 0, //current="{{swipercurrent}} 第一次加载为0，其他时间为1
        recordCurrent: 0, //swiper上次的index 之后保持为1
        duration: 300, //动画时常
        ico: ['A', 'B', 'C', 'D'],
        answerCount: [0, 0], // 答题情况和数量 答对--答错
        isCollected: false // 是否已收藏
    },

    //=============方法区==============
    onClickLeft() {
        this.getPageHeight()
            // this.upSwiper(10)

    },
    onClickRight() {
        let newTitle = this.data.navBarTitle === '刷题模式' ? '背题模式' : '刷题模式'
            // 更新数据

        this.setData({
            navBarTitle: newTitle,
            globalController: !this.data.globalController

        })
    },
    onClickOption(e) {
        let item = e.currentTarget.dataset.item // 副本，用作临时修改
            // 记录已选选项
        item.selectOption = e.currentTarget.id
            // 点击选项后，无论对错显示解析
        item.analysisController = true
        if (e.currentTarget.id === item.result) {
            console.log("@@ 答对了")
            item.isAnswer = true
            this.data.answerCount[0]++ // 正确数量++
                // 最后把修改后的item写回list，用于永久存储
                this.data.dataList[this.data.currentIndex] = item
                // 最后把修改后的item写回swiperList，用于界面更新
            this.data.swiperList[this.data.swiperCurrent] = item
                // 自动下一题
            this.data.currentIndex++
                this.upSwiper(this.data.currentIndex)
        } else {
            console.log("@@ 答错了")
            item.isAnswer = true
            item.selectOption = e.currentTarget.id
                // 最后把修改后的item写回list，用于永久存储
            this.data.dataList[this.data.currentIndex] = item
                // 最后把修改后的item写回swiperList，用于界面更新
            this.data.swiperList[this.data.swiperCurrent] = item
            this.data.answerCount[1]++ // 错误数量++
                // 手动下一题
        }

        // 更新数据
        this.setData({
            dataList: this.data.dataList, // 覆盖数据
            swiperList: this.data.swiperList, // 覆盖数据
            answerCount: this.data.answerCount, // 触发视图层更新
            currentIndex: this.data.currentIndex // 触发视图层更新 
        })
    },
    onClickCollect(e) {
        console.log(this.data.swiperList[this.data.swiperCurrent]);
        this.setData({
            isCollected: !this.data.isCollected
        })
    },
    // swiper滑动触发事件
    animationfinish({ detail }) {
        // 加载页面
        if (detail.source == "touch") {
            this.upSwiper(this.data.currentIndex + detail.current - this.data.recordCurrent)
        }
    },
    // 显示swiper页的处理函数
    upSwiper(index) {
        console.log('index-', index)
            // 下标越界
        if (index < 0 || index >= this.data.dataList.length) {
            console.log('swiper-index越界')
            return
        }
        this.setData({
                currentIndex: index,
            })
            // 更新展示数据
        let list = []
            // 加载当前索引页前后一个数据页
        for (let i = this.data.currentIndex - 1; i <= this.data.currentIndex + 1; ++i) {
            let item = this.data.dataList[i]
            if (typeof(item) !== "undefined") {
                list.push(item)
            }
        }
        let current = 0;
        // 只要加载的索引页不是0 current永远都是1 以保证让swiper永远显示swiperList[1]
        if (index != 0) {
            current = 1
        }
        this.setData({
                duration: 0
            })
            // current 和 list要同时更新，不然数据会闪
        this.setData({
            swiperCurrent: current,
            recordCurrent: current,
            duration: 300,
            swiperList: list
        })

    },
    getPageHeight() {
        let totalHeight = 0
        wx.createSelectorQuery().selectAll('#vtag').boundingClientRect().exec(res => {
            console.log(res) // 这里获取了多个重复数组，待解决
                // res[0].forEach(x => {
                //     totalHeight += x.height
                // })
        })

    },


    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        //获取前置页面发来的参数，向服务器请求数据，存储到dataList
        // 0.优先加载本地数据

        // 1.获取传参
        const year = options.year
        const order = options.order
        const url = '/storage/' + year + '/' + order
            // 2.请求服务器获取数据 
        await request(url).then(res => {
                this.setData({
                    dataList: res.data // 这是要存储的数据
                })
            })
            // 清洗options字符串数组"
        this.data.dataList.forEach(x => {
                x.options = x.options.split(','),
                    x.isAnswer = null, // 是否做出了选择 
                    x.selectOption = '', // 选择的选项 
                    x.analysisController = false // 是否显示解析
            })
            // 初始化数据
        console.log('@@onLoad数据已挂载', this.data.dataList)
            // 加载索引页
        this.upSwiper(0)
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