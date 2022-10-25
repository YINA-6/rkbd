// components/swiper/my-swiper.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        dataList: {
            type: Array,
            value: []
        },
        index: {
            type: Number,
            value: 0
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        swiperList: [], //swiper数据 固定3个
        navBarTitle: '刷题模式', // 导航栏标题
        globalController: false, // 全局控制变量，由navBar控制
        currentIndex: 0, //dataList的index
        swiperCurrent: 0, //current="{{swipercurrent}} 第一次加载为0，其他时间为1
        recordCurrent: 0, //swiper上次的index 之后保持为1
        duration: 300, //动画时常
        ico: ['A', 'B', 'C', 'D'],
        answerCount: [0, 0], // 答题情况和数量 答对--答错
        // isCollected: false, // 是否已收藏 添加到item里
        show: false, // 弹出层控制
        disableOptionLt4: false, // 禁用前四个选项
        disableOptionGt4: false, // 禁用后四个选项
        tagList: ['.question', '.photo', '.select', '.answer', '.analysis'],
        totalHeight: 667
    },

    /**
     * 组件的方法列表
     */
    methods: {
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
        onClickOption(e) {
            let optionIndex = e.currentTarget.dataset.index
            let id = e.currentTarget.id
            let item = e.currentTarget.dataset.item // 副本，用作临时修改
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
            this.getPageHeight(this.data.tagList)

            if (isNext === true) {
                this.upSwiper(dataListIndex)
            }
        },
        // 收藏点击事件
        onClickCollect() {
            console.log("click tapaaa")
                // 更新修改后的item
            this.data.swiperList[this.data.swiperCurrent].isCollected = !this.data.swiperList[this.data.swiperCurrent].isCollected // 修改页面item
            this.data.dataList[this.data.currentIndex] = this.data.swiperList[this.data.swiperCurrent] // 更新存储
            this.setData({
                swiperList: this.data.swiperList, // 覆盖数据
                dataList: this.data.dataList, // 覆盖数据
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
                this.createSelectorQuery().selectAll(tag).boundingClientRect().exec(res => {
                    if (res[0].length != 0) {
                        totalHeight += res[0][0].height;
                    }
                })
            })
            setTimeout(() => {
                console.log(this.data.totalHeight)
                this.setData({ totalHeight })
            }, 500)




        },

    }
})