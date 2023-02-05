// subpkg/myswiper/mySwiper.js
import request from '../../utils/request'
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dataList: [],
        swiperList: [], //swiper数据 固定3个
        errorList: [], // 错误题目，存储完整题目
        collectionList: [], // 收藏题目，存储完整题目
        navBarTitle: '刷题模式', // 导航栏标题
        globalController: false, // 全局控制变量，由navBar控制
        currentIndex: 0, //dataList当前的index，还可以用于页面恢复?待完成
        swiperCurrent: 0, //current="{{swipercurrent}} 第一次加载为0，其他时间为1
        recordCurrent: 0, //swiper上次的index 之后保持为1
        duration: 300, //动画时常
        ico: ['A', 'B', 'C', 'D'],
        answerCount: [0, 0], // 答题情况和数量 答对--答错
        show: false, // 弹出层控制
        disableOptionLt4: false, // 禁用前四个选项
        disableOptionGt4: false, // 禁用后四个选项
        tagList: ['.question', '.photo', '.select', '.answer', '.analysis'],
        totalHeight: 667,
        storageKey: '', // 本地存储的key

    },

    //=============方法区==============
    showPopup() {
        this.setData({ show: true });
    },

    onClose() {
        this.setData({ show: false });
    },
    // 题号点击事件
    onClickStide(e) {
        this.onClose() //关闭弹出层
        this.upSwiper(e.currentTarget.dataset.index) // 加载题目
    },
    // 导航栏点击事件
    onClickLeft() {
        wx.navigateBack({
            delta: 0,
        })

    },
    onClickRight() {
        let newTitle = this.data.navBarTitle === '刷题模式' ? '背题模式' : '刷题模式'
            // 更新数据

        this.setData({
            navBarTitle: newTitle,
            globalController: !this.data.globalController

        })
        this.getPageHeight(this.data.tagList)
    },
    // 点击选项的处理事件
    onClickOption(e) {
        let optionIndex = e.currentTarget.dataset.index
        let id = e.currentTarget.id
        let item = e.currentTarget.dataset.item // 副本，用作临时修改
        let originalItem = e.currentTarget.dataset.item // 副本，用作保持给错题集
        let isNext = false
        let dataListIndex = this.data.currentIndex

        console.log('clickIndex', optionIndex);
        // 第一空的点击处理逻辑
        if (optionIndex < 4) {
            //  判断是否已作答
            if (item.selectOption[0] != null) {
                return
            }
            item.selectOption[0] = id
            if (id == item.result[0]) {
                console.log('@@第一空答对了')
                item.isRight[0] = true
                this.data.answerCount[0]++ // 正确数量++

            } else {
                console.log('@@第一空答错了')
                item.isRight[0] = false
                this.data.answerCount[1]++ // 错误数量++
                    this.data.errorList.push(originalItem)
            }

            // 处理单选题
            if (item.result.length == 1) {
                item.analysisController = true // 默认开启解析
                if (item.isRight[0] === true) {
                    isNext = true
                    dataListIndex++ // 下一题
                }
            }

            // 最后把修改后的item写回list，用于永久存储
            this.data.dataList[this.data.currentIndex] = item
                // 最后把修改后的item写回swiperList，用于界面更新
            this.data.swiperList[this.data.swiperCurrent] = item
        } else if (optionIndex >= 4 && optionIndex < 8) {
            // 第二空的点击处理逻辑
            // 判断是否已作答

            if (item.selectOption[1] != null) {
                return
            }
            item.selectOption[1] = id

            if (id == item.result[1]) {
                console.log('@@第二空答对了')
                item.isRight[1] = true
                this.data.answerCount[0]++ // 正确数量++
                    if (item.isRight[0] == true && item.result.length == 2) {
                        // 两空都答对，自动下一题
                        dataListIndex++
                        isNext = true
                    }
            } else {
                console.log('@@第二空答错了')
                item.isRight[1] = false
                this.data.answerCount[1]++ // 错误数量++
                    this.data.errorList.push(originalItem)
            }
            // 最后把修改后的item写回list，用于永久存储
            this.data.dataList[this.data.currentIndex] = item
                // 最后把修改后的item写回swiperList，用于界面更新
            this.data.swiperList[this.data.swiperCurrent] = item

        } else {
            // 第三空的点击处理逻辑
            // 判断是否已作答
            if (item.selectOption[2] != null) {
                return
            }
            item.selectOption[2] = id

            if (id == item.result[2]) {
                console.log('@@第三空答对了')
                item.isRight[2] = true
                this.data.answerCount[0]++ // 正确数量++
                    if (item.isRight[0] == true && item.isRight[1] == true && item.result.length == 3) {
                        // 三空都答对，自动下一题
                        dataListIndex++
                        isNext = true
                    }
            } else {
                console.log('@@第三空答错了')
                item.isRight[2] = false
                this.data.answerCount[1]++ // 错误数量++
                    this.data.errorList.push(originalItem)
            }

            // 最后把修改后的item写回list，用于永久存储
            this.data.dataList[this.data.currentIndex] = item
                // 最后把修改后的item写回swiperList，用于界面更新
            this.data.swiperList[this.data.swiperCurrent] = item

        }
        // 全局判断解析显示
        if (item.result.length == 1 && item.selectOption[0] != null) {
            item.analysisController = true
        } else if (item.result.length == 2 && item.selectOption[0] != null && item.selectOption[1] != null) {
            item.analysisController = true
        } else if (item.result.length == 3 && item.selectOption[0] != null && item.selectOption[1] != null && item.selectOption[2] != null) {
            item.analysisController = true
        }
        // 更新数据

        this.setData({
            dataList: this.data.dataList, // 覆盖数据
            swiperList: this.data.swiperList, // 覆盖数据
            answerCount: this.data.answerCount, // 触发视图层更新
            currentIndex: this.data.currentIndex, // 触发视图层更新 

        })

        // 存储正确-错误数组


        this.getPageHeight(this.data.tagList)

        if (isNext === true) {
            this.upSwiper(dataListIndex)
        }
    },
    // 收藏点击事件
    onClickCollect() {
        console.log("click tap")
            // 更新修改后的item

        this.data.swiperList[this.data.swiperCurrent].isCollected = !this.data.swiperList[this.data.swiperCurrent].isCollected // 修改页面item
        this.data.dataList[this.data.currentIndex] = this.data.swiperList[this.data.swiperCurrent] // 更新存储
        this.setData({
            swiperList: this.data.swiperList, // 覆盖数据
            dataList: this.data.dataList, // 覆盖数据
        })

        // 收藏
        let isCollected
        const item = this.data.swiperList[this.data.swiperCurrent]
        if (item.isCollected == true) {
            // 添加收藏
            this.data.collectionList.forEach(x => {
                if (item.qid == x.qid) {
                    // 无需添加
                    isCollected = true
                    return
                }
            })
            if (isCollected != true) {
                console.log('添加收藏');
                this.data.collectionList.push(item)
            }
        } else {
            // 取消收藏
            console.log('取消收藏')
            this.data.collectionList.pop(item)
        }

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

        // current 和 list要同时更新，不然页面会闪
        this.setData({
            swiperCurrent: current,
            recordCurrent: current,
            duration: 300,
            swiperList: list,
        })
        this.getPageHeight(this.data.tagList)

    },
    // 获取节点高度 页面加载有闪烁
    getPageHeight(tagList) {
        let totalHeight = 170
        tagList.forEach(x => {
            let tag = '#active-swiper-item > ' + x
            wx.createSelectorQuery().selectAll(tag).boundingClientRect().exec(res => {
                if (res[0].length != 0) {
                    totalHeight += res[0][0].height;
                }
            })
        })
        setTimeout(() => {
            this.setData({ totalHeight })
        }, 500)
    },
    defSetStorage(item) {
        wx.setStorage({
            key: `${this.data.storageKey}-${app.globalData.subjectInfo.id}`,
            data: JSON.stringify(item)
        })
    },
    async getANDSetData(url) {
        // 0.优先加载本地数据
        console.log('this.data.storageKey', this.data.storageKey);
        console.log('url', url)
        try {
            const key = `${this.data.storageKey}-${app.globalData.subjectInfo.id}`
            var value = wx.getStorageSync(key)
            if (this.data.storageKey == 'random') {
                value = false
            }
            if (value) {
                // Do something with return value
                console.log('已获取本地数据')
                this.setData({
                    dataList: JSON.parse(value) // 这是要存储的数据
                })
                console.log(this.data.dataList);
                if (this.data.storageKey == 'errorList' || this.data.storageKey == 'collectionList') {
                    console.log('错题-收藏 特别处理');
                    // 清洗格式
                    this.data.dataList.forEach(x => {
                        // x.options = x.options.split(','), // 处理选项
                        //     x.result = x.result.split(',') // 处理答案
                        x.isRight = [], //  兼容多选题
                            x.selectOption = [], // 兼容多选题
                            x.analysisController = false // 是否显示解析
                    })
                }
            } else {
                // 2.请求服务器获取数据 
                await request(url).then(res => {
                        console.log('已获取网络数据res', res)
                        this.setData({
                            dataList: res.data // 这是要存储的数据
                        })
                    })
                    // 清洗格式
                this.data.dataList.forEach(x => {
                    x.options = x.options.split(','), // 处理选项
                        x.result = x.result.split(',') // 处理答案
                    x.isRight = [], //  兼容多选题
                        x.selectOption = [], // 兼容多选题
                        x.analysisController = false // 是否显示解析

                })
            }
        } catch (e) {
            // Do something when catch error
            console.log(e)
        }

        // 加载答题情况
        if (JSON.stringify(this.data.dataList[this.data.dataList.length - 1]).indexOf('recordIndex') != -1) {
            const append = this.data.dataList.pop()
            console.log(append);
            this.setData({
                    answerCount: append.answerCount
                })
                // 加载上一次的索引页
            this.upSwiper(append.recordIndex)
        } else {
            // 默认初始页
            this.upSwiper(0)
        }




    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        console.log(options)
        const type = options.type
        const subject = app.globalData.subjectInfo.id
        if (type == 'ljzt') {
            // 1.历届真题处理逻辑
            const year = options.year
            const order = options.order
            this.data.storageKey = (year + order).toString()
            const url = `storage/${year}/${order}/${subject}`
            this.getANDSetData(url)
        } else if (type == 'sjlx') {
            // 2.随机练习处理逻辑
            this.data.storageKey = `random`
            const url = `storage/random/10/${app.globalData.subjectInfo.id}`
            this.getANDSetData(url)
        } else if (type == 'zxlx') {
            // 3.专项练习处理逻辑
            const id = options.cid
            this.data.storageKey = `categoryId${id}`
            const url = `storage/cid/${id}/${subject}`
            this.getANDSetData(url)
        } else if (type == 'ctlx') {
            // 4.错题练习处理逻辑
            this.data.storageKey = `errorList`
            this.getANDSetData(null)
        } else if (type == 'sclx') {
            // 5.收藏练习处理逻辑
            this.data.storageKey = `collectionList`
            this.getANDSetData(null)
        } else {
            console.log('未知type参数')
        }



    },
    // 入参 fmt-格式 date-日期
    dateFormat(fmt, date) {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(), // 年
            "m+": (date.getMonth() + 1).toString(), // 月
            "d+": date.getDate().toString(), // 日
            "H+": date.getHours().toString(), // 时
            "M+": date.getMinutes().toString(), // 分
            "S+": date.getSeconds().toString() // 秒
                // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
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
        // 加载上一次退出的页面？

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        // 更新本地存储
        console.log('页面隐藏，更新本地存储')
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        console.log('页面卸载，更新本地存储')
            // 更新本地存储
        let item = this.data.dataList
        if (this.data.storageKey != 'errorList' && this.data.storageKey != 'collectionList') {
            console.log("添加记录item");
            item.push({
                recordIndex: this.data.currentIndex,
                answerCount: this.data.answerCount
            })
        }

        this.defSetStorage(item)

        if (this.data.collectionList.length > 0) {
            // 存储收藏数据
            wx.setStorage({
                key: `collectionList-${app.globalData.subjectInfo.id}`,
                data: JSON.stringify(this.data.collectionList)
            })
        }

        if (this.data.errorList.length > 0) {
            //处理错题集数据 这里要获取本地存储的错题还有当前页面的错题，进行合并
            // 如果当前页面是错题练习，则不再进行存储
            if (this.data.storageKey == 'errorList') {
                return
            }
            let storageError = wx.getStorageSync(`errorList-${app.globalData.subjectInfo.id}`)
            if (storageError != '') {
                storageError.forEach(x => {
                    this.data.errorList.push(x)
                })
            }

            let noDuplicateArray = this.data.errorList.filter((value, index, arr) => {
                return arr.indexOf(value) === index
            })

            wx.setStorageSync(`errorList-${app.globalData.subjectInfo.id}`, JSON.stringify(noDuplicateArray))
                // 设置辅助参数更新时间
            let date = new Date()
            wx.setStorageSync('updataTime', this.dateFormat("YYYY-mm-dd HH:MM:SS", date))
        }

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