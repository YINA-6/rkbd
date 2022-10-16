// subpkg/myswiper/mySwiper.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // dataList: [{
        //         "id": 1,
        //         "qid": "2017001",
        //         "type": "00",
        //         "question": "CPU执行算术运算或者逻辑运算时，常将源操作数和结果暂存在（1）中。",
        //         "options": "程序计数器（PC）,累加器（AC）,指令寄存器（IR）,地址寄存器（AR）",
        //         "result": "B",
        //         "analysis": "CPU中常设置多个寄存器，其中，程序计数器的作用是保存待读取指令在内存中的地址，累加器是算逻运算单元中用来暂存源操作数和计算结果的寄存器，指令寄存器暂存从内存读取的指令，地址寄存器暂存要访问的内存单元的地址。",
        //         "categoryId": "1",
        //         "photo": ""
        //     },
        //     {
        //         "id": 2,
        //         "qid": "2017002",
        //         "type": "00",
        //         "question": "要判断字长为16位的整数a的低四位是否全为0，则（2）。",
        //         "options": "将a与0x000F进行逻辑与运算，然后判断运算结果是否等于0,将a与0x000F进行“逻辑或运算，然后判断运算结果是否等于F,将a与0xFFFO进行“逻辑异或运算，然后判断运算结果是否等于0,将a与0xFFFO进行“逻辑与运算，然后判断运算结果是否等于F",
        //         "result": "A",
        //         "analysis": "将整数a与0×000F4进行“逻辑与运算，则运算结果中高12位都为0，而低4位则完全是a的低4位，所以“逻辑与运算的结果为0，则说明a的低4位为0。",
        //         "categoryId": "1",
        //         "photo": ""
        //     },
        //     {
        //         "id": 3,
        //         "qid": "2017003",
        //         "type": "00",
        //         "question": "计算机系统中常用的输入/输出控制方式有无条件传送、中断、程序查询和DMA方式等。当采用（3）方式时，不需要CPU执行程序指令来传送数据。",
        //         "options": "中断,程序查询,无条件传送,DMA",
        //         "result": "D",
        //         "analysis": "中断方式、程序查询方式和无条件传送方式都是通过CPU执行程序指令来传送数据的，DMA方式下是由DMA控制器直接控制数据的传送过程，CPU需要让出对总线的控制权，并不需要CPU执行程序指令来传送数据。",
        //         "categoryId": "1",
        //         "photo": ""
        //     },
        //     {
        //         "id": 4,
        //         "qid": "2017004",
        //         "type": "00",
        //         "question": "某系统由下图所示的冗余部件构成。若每个部件的千小时可靠度都为R，则该系统的千小时可靠度为（4）。",
        //         "options": "（1-R3）（1-R2）,（1-（1-R3））（1-（1-R）2）,（1-R3）+（1-R2）,（1-（1-R）3）+（1-（1-R）2）",
        //         "result": "B",
        //         "analysis": "可靠度为R1和R2的两个部件并联后的可靠度为（1-（1-R1）（1-R2）），这两个部件串联后的可靠度为R1R2，因此图中所示系统的可靠度为（1-（1-R）3）（1-（（1-R）2）。",
        //         "categoryId": "1",
        //         "photo": "2017003-00"
        //     }
        // ],
        dataList: [],
        swiperList: [], //swiper数据 固定3个
        navBarTitle: '刷题模式', // 导航栏标题
        globalController: false, // 全局控制变量，由navBar控制
        currentIndex: 0, //真实的index
        swiperCurrent: 0, //current="{{swipercurrent}} 第一次加载为0，其他时间为1
        recordCurrent: 0, //swiper上次的index 之后保持为1
        duration: 300, //动画时常
        ico: ['A', 'B', 'C', 'D'],
        answerCount: [0, 0], // 答题情况和数量 答对--答错
        isCollected: false // 是否已收藏
    },

    //=============方法区==============
    onClickLeft() {
        console.log(this.data.swiperList)
        console.log(this.data.dataList)
        this.getPageHeight()
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
        console.log(e)
        const item = e.currentTarget.dataset.item
            // 记录已选选项
        item.selectOption = e.currentTarget.id
            // 点击选项后，无论对错显示解析
        item.analysisController = true

        if (e.currentTarget.id === item.result) {
            console.log("@@ 答对了")
            item.isAnswer = true
            this.data.answerCount[0]++ // 正确数量++
                // 自动下一题
                this.data.page++
                this.setData({
                    answerCount: this.data.answerCount,
                    page: this.data.page,
                    swiperList: this.data.swiperList
                })
            this.upSwiper(this.data.page)
        } else {
            console.log("@@ 答错了")
            item.isAnswer = true
            item.selectOption = e.currentTarget.id
            this.data.swiperList[this.data.page - 1] = item // 修改原数据
            this.data.answerCount[1]++ // 错误数量++
                this.setData({
                    answerCount: this.data.answerCount,
                    swiperList: this.data.swiperList
                })
                // 手动下一题
        }
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
        if (detail.source === "touch") {
            this.upSwiper(detail.current)
        }
    },
    // 显示swiper页的处理函数
    upSwiper(index) {
        // 下标越界
        if (index < 0 || index >= this.data.dataList.length) {
            console.log('swiper-index越界')
            return
        }
        this.setData({
                currentIndex: index,
            })
            // console.log("加载index@", index, "page@", this.data.page)

        // 更新展示数据
        let list = []
            // 加载当前索引页前后一个数据页
        for (let i = index - 1; i <= index + 1; i++) {
            let item = this.data.dataList[i]
            if (typeof(item) !== "undefined") {
                list.push(item)
            } else {
                console.log("index@", i, "是空页")
            }
        }
        let current = 0
            // 只要加载的索引页不是0 current永远都是1 以保证让swiper永远显示swiperList[1]
        if (index != 0) {
            current = 1
        }
        //current 和 list 数据同时更新 避免页面闪烁
        this.setData({
            swiperCurrent: current,
            duration: 300,
            // 清洗options字符串数组
            swiperList: list
        })

    },
    getPageHeight() {
        let totalHeight = 0
        wx.createSelectorQuery().selectAll('.question,.option').boundingClientRect().exec(res => {
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
        // 1.获取传参
        console.log('@options', options)
        const year = options.year
        const order = options.order
        const url = '/storage/' + year + '/' + order
            // 2.请求服务器获取数据 
        await request(url).then(res => {
                console.log('@@页面请求数据-dataList', res.data)
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

        console.log('@@组件挂载-dataList', this.data.dataList)
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