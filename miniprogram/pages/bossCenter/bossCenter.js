let db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 0,
        saleGoods: [],
        xiaGoods: [],
        boss: [],
        waitDeal: {
            waitPay: 0,
            waitOut: 0,
            waitIn: 0,
        },
        todayDig: {
            money: 0,
            order: 0
        },
        Yesterday: {
            money: 0,
            order: 0
        }
    },
    onChange(event) {
        // event.detail 的值为当前选中项的索引
        this.setData({
            active: event.detail
        });
    },
    goIndex() {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    // 获取个人商品  const let var 
    getmyGoods() {
        const that = this
        db.collection("goodsList").where({
                onSales: true
            }).skip(that.data.saleGoods.length).get()
            .then(res => {
                that.setData({
                    saleGoods: that.data.saleGoods.concat(res.data)
                })
                if (res.data.length == 20) {
                    that.getmyGoods()
                } else {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                }
            })

    },
    // 商品信息管理
    goMoods(e) {
        let active = e.currentTarget.dataset.active * 1
        wx.navigateTo({
            url: '/pages/bossCenter/mygoods?active=' + active,
        })

    },
    xiaGoods() {
        const that = this
        db.collection("goodsList").where({
                onSales: false
            }).skip(that.data.xiaGoods.length).get()
            .then(res => {
                that.setData({
                    xiaGoods: that.data.xiaGoods.concat(res.data)
                })
                if (res.data.length == 20) {
                    that.xiaGoods()
                } else {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                }
            })

    },
    addGoods(e) {

        wx.navigateTo({
            url: '/pages/addGoods/addGoods',
        })
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
        wx.showLoading({
            title: '数据加载中',
        })
        this.setData({
            saleGoods: [],
            xiaGoods: [],
        })
        this.getmyGoods()
        this.xiaGoods()
        this.getbosss()

    },
    getbosss() {
        var that = this
        db.collection("merchantData").doc('ca780ad562e25bee0cb13d4b156b7ff2').get()
            .then(res => {
                that.setData({
                    boss: res.data
                })
            })
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