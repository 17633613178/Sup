let db = wx.cloud.database()
const app = getApp()

Page({
    data: {
        active: 0,
        swiper: [],
        goodsList: [],
        lookserch: false,
        search: null,
        listsearch: [],
    },


    onChange(event) {
        this.setData({
            active: event.detail.index
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
            title: '',
        })
        this.getswiper();
        this.getgoods();
    },
    getswiper() {
        var that = this
        db.collection("swierIndex").get()
            .then(res => {
                that.setData({
                    swiper: res.data
                })
            })
    },
    getgoods() {
        var that = this
        db.collection("goodsList").where({
                onSales: true
            }).skip(that.data.goodsList.length).get()
            .then(res => {
                that.setData({
                    goodsList: that.data.goodsList.concat(res.data)
                })


                if (res.data.length == 20) {
                    that.getgoods()
                } else {
                    app.goodsList = that.data.goodsList
                    wx.hideLoading({
                        success: (res) => {},
                    })
                }
            })
    },

    // 获取用户输入值
    onChange(e) {
        let that = this
        if (e.detail == "") {
            that.setData({
                search: null,
                lookserch: false,
                listsearch: []
            })
        } else {
            that.setData({
                search: e.detail,
            })
        }
    },
    // 搜索商品
    onSearch() {
        let that = this
        if (that.data.search == null) {
            wx.showToast({
                title: '请输入关键词',
                icon: 'none'
            })
        }
        // 毛搜索课程
        else {
            wx.showLoading({
                title: '搜索中',
            })
            // 根据名称搜索考试
            db.collection("goodsList").where({ //毛搜索
                    name: db.RegExp({ //
                        regexp: that.data.search, //regexp搜索值
                        options: 'i',
                    })
                }).get()
                .then(res => {
                  
                    that.setData({
                        listsearch: that.data.listsearch.concat(res.data)
                    })
                    // 根据分类搜索考试
                    db.collection("goodsList").where({ //毛搜索
                            kind: db.RegExp({ //
                                regexp: that.data.search, //regexp搜索值
                                options: 'i',
                            })
                        }).get()
                        .then(res => {
                        
                            if (that.data.listsearch.length != 0) {
                                for (var i = 0; i < res.data.length; i++) {
                                    let jude = false
                                    for (var a = 0; a < that.data.listsearch.length; a++) {
                                        if (that.data.listsearch[i]._id == res.data[a]._id) {
                                            jude = true
                                        }
                                    }
                                    if (!jude) {
                                        that.setData({
                                            listsearch: that.data.listsearch.concat(res.data[i])
                                        })
                                    }
                                }
                            } else {
                                that.setData({
                                    listsearch: that.data.listsearch.concat(res.data)
                                })
                            }
                            // 判断是否有所搜结果
                            if (that.data.listsearch.length == 0) {
                                wx.showToast({
                                    title: '无匹配结果',
                                    icon: 'none'
                                })
                            } else {
                                that.setData({
                                    lookserch: true
                                })
                            }
                            wx.hideLoading()


                        })


                })
        }


    },

    // 前往商品详情页
    goDetail(e) {
        wx.navigateTo({
            url: '/pages/goodsDetail/goodsDetail?id=' + e.currentTarget.dataset.id,
        })
    },

});