let db = wx.cloud.database()
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listDetail: [],
        goodsList: [],

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

        this.getRandom();
        wx.showLoading({
            title: '商品加载中',
        })
        this.getList(options.id)

    },
    // 随机商品
    getRandom() {
        var that = this
        let list = []
        if (app.goodsList.length < 10) {
            for (var i = 0;; i++) {
                var list_num = 0
                let get_c = Math.round(Math.random() * 10) //随机生成一个固定范围的随机数0-9
                if (list.length == 3) { //判断是否已经得到了需要的人数 如果是终止循环
                    break
                } else {
                    if (get_c < app.goodsList.length) { //生成的随机数不能大于总人数
                        if (list.length) { //判断List是否还是一个空值
                            var add = true
                            for (var a = 0; a < list.length; a++) { //判断生成的随机数是否已经在List里面了防止重复
                                if (get_c == list[a]) {
                                    add = false
                                }
                            }
                            if (add) { //表明List里面还没有这个数据
                                list_num += list_num
                                list.push(get_c) //往list里面Push一个新的随机数

                            }
                        } else {
                            list[list_num] = get_c
                        }
                    }
                }

            }

        }
        // 总人数小于100
        else if (app.goodsList.length >= 10 && app.goodsList.length < 100) {
            for (var i = 0;; i++) {
                var list_num = 0
                let get_c = Math.round(Math.random() * 100)

                if (list.length == 3) {
                    break
                } else {
                    if (get_c < app.goodsList.length) {
                        if (list.length) {
                            var add = true
                            for (var a = 0; a < list.length; a++) {
                                if (get_c == list[a]) {
                                    add = false
                                }
                            }
                            if (add) {

                                list_num += list_num
                                list.push(get_c)

                            }
                        } else {
                            list[list_num] = get_c
                        }
                    }
                }

            }

        }
        console.log(list, 'abc')
        //  给推荐商品赋值
        var goodsList = []
        for (var i = 0; i < list.length; i++) {
            goodsList.push(app.goodsList[list[i]])
        }
        that.setData({
            goodsList: goodsList
        })
    },
    // 前往商品详情页
    goDetail(e) {
        wx.redirectTo({
            url: '/pages/goodsDetail/goodsDetail?id=' + e.currentTarget.dataset.id,
        })
    },
    // 获取详情页面商品
    getList(e) {
        var that = this
        db.collection("goodsList").doc(e).get()
            .then(res => {
                that.setData({
                    listDetail: res.data
                })
                wx.hideLoading({
                    success: (res) => {},
                })
            })
    },
    // 前往分类界面
    goTbarKind() {
        wx.switchTab({
            url: '/pages/kind/kind',
        })
    },
    // 立即购买
    gobuy(){
        wx.navigateTo({
            url: '/pages/payGoods/payGoods?id='+this.data.listDetail._id,
          })

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    // 将商品信息加入购物车
    addCar() {
        var that = this
        // 判断用户是否已经登录
        if (!wx.getStorageSync('openid')) {
            wx.showModal({
                title: "请先登录",
                content: "为了您的安全请先登录",
                success(res) {
                    if (res.confirm) {
                        wx.switchTab({
                            url: '/pages/my/my',
                        })
                    }
                }
            })
        } else {
            //判断此商品用户是否已经加入购物车
            db.collection("goodsCar").where({
                    id: that.data.listDetail._id,
                    _openid: wx.getStorageSync('openid')
                }).get()
                .then(res => {
                    if (res.data.length == 0) { //第一次加入
                        that.addFirst()
                    } else { //用户不是第一次加入
                        that.addMore(res.data[0]._id, res.data[0].number)

                    }
                })
        }
    },
    // 第一次加入数据库
    addFirst() {
        var that = this
        wx.showLoading({
            title: '',
        })
        db.collection("goodsCar").add({
                data: {
                    src: that.data.listDetail.src[0],
                    name: that.data.listDetail.name,
                    prize: that.data.listDetail.prize,
                    id: that.data.listDetail._id,
                    conditionCar: true,
                    number: 1,
                }
            })
            .then(res => {
                wx.hideLoading({
                    success: (res) => {
                        wx.showToast({
                            title: '亲！购物车等您哦',
                        })
                    },
                })
            })
    },
    // 不是第一次加入
    addMore(e, number) {
        var that = this
        wx.showLoading({
            title: '',
        })
        db.collection("goodsCar").doc(e).update({
                data: {
                    conditionCar: true,
                    number: number + 1,
                }
            })
            .then(res => {
                wx.hideLoading({
                    success: (res) => {
                        wx.showToast({
                            title: '亲！购物车等您哦',
                        })
                    },
                })
            })
    },
    skanimage(e){
        let src=e.currentTarget.dataset.src
        wx.previewImage({
          urls: this.data.listDetail.src,
          current:src
        })
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