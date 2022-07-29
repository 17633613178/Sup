let db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsList: [],
        allChoose: true,
        allMoney: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        
    },
    //   获取用户购物车数据
    getgoods() {
        wx.showLoading({
            title: '加载中',
        })
        var that = this
        db.collection("goodsCar").where({
                _openid: wx.getStorageSync('openid')
            }).get()
            .then(res => {
                wx.hideLoading({
                    success: (e) => {
                        that.setData({
                            goodsList:res.data
                        })
                        if (res.data.length) {
                            that.judgeAllch(res.data)
                            that.getAllmoney(that.data.goodsList)
                        }

                        
                    },
                })
            })

    },
    // 判断用户是否已经全选
    judgeAllch(list) {
      
        var that = this
        let all = true
        for (var i = 0; i < list.length; i++) {
            if (!list[i].conditionCar) {
                all = false
            }
        }
        that.setData({
            allChoose: all
        })
    },
    // 用户选择或取消选择
    choose(e) {
        var that = this
        let list = that.data.goodsList[e.currentTarget.dataset.index]
        let index = e.currentTarget.dataset.index

        // 跟新数据库选中状态
        db.collection("goodsCar").doc(list._id).update({
                data: {
                    conditionCar: !list.conditionCar
                }
            })
            .then(res => {
                that.setData({
                    ["goodsList[" + index + "].conditionCar"]: !list.conditionCar
                })
                that.judgeAllch(that.data.goodsList)
                that.getAllmoney(that.data.goodsList)
            })
    },
    // 前往商品详情页
    goDetail(e) {
        wx.navigateTo({
            url: '/pages/goodsDetail/goodsDetail?id=' + e.currentTarget.dataset.id,
        })
    },
    // 购物车商品的减少
    jianNumber(e) {
        var that = this
        let index = e.currentTarget.dataset.index
        let list = that.data.goodsList[index]
        if (list.number != 1) {
            db.collection("goodsCar").doc(list._id).update({
                    data: {
                        number: list.number - 1
                    }
                })
                .then(res => {
                    that.setData({
                        ["goodsList[" + index + "].number"]: list.number - 1,
                        ["goodsList[" + index + "].conditionCar"]:true
                    })
                    that.getAllmoney(that.data.goodsList)
                })
        } else {
            wx.showToast({
                title: '已经是最少了',
                icon: "none"
            })
        }
    },
    // 购物车商品的增加
    addNumber(e){
        var that = this
        let index = e.currentTarget.dataset.index
        let list = that.data.goodsList[index]
      
            db.collection("goodsCar").doc(list._id).update({
                    data: {
                        number: list.number + 1
                    }
                })
                .then(res => {
                    that.setData({
                        ["goodsList[" + index + "].number"]: list.number + 1,
                        ["goodsList[" + index + "].conditionCar"]:true
                    })
                    that.getAllmoney(that.data.goodsList)
                })
       
    },
    // 全选或者取消全选
    allChoose() {
        var that = this
        let allChoose = that.data.allChoose
        that.setData({
            allChoose: !allChoose
        })
        if (allChoose) { //取消全选
            let list = that.data.goodsList
            for (var i = 0; i < list.length; i++) {
                if (list[i].conditionCar) {
                    list[i].conditionCar = false
                    db.collection("goodsCar").doc(list[i]._id).update({
                            data: {
                                conditionCar: false
                            }
                        })
                        .then(res => {

                        })
                }

            }
            that.setData({
                goodsList: list
            })
        } else { //全选
            let list = that.data.goodsList
            for (var i = 0; i < list.length; i++) {
                if (!list[i].conditionCar) {
                    list[i].conditionCar = true
                    db.collection("goodsCar").doc(list[i]._id).update({
                            data: {
                                conditionCar: true
                            }
                        })
                        .then(res => {

                        })
                }
            }
            that.setData({
                goodsList: list
            })
        }
        that.getAllmoney(that.data.goodsList)
    },
    // 判断总金额
    getAllmoney(list) {
        let allMoney = 0
        var that = this
        for (var i = 0; i < list.length; i++) {
            if (list[i].conditionCar) {
                allMoney += list[i].number * list[i].prize
            }
        }
        that.setData({
            allMoney: allMoney
        })
    },
    // 长按删除购物车
    delete(e){
        let index=e.currentTarget.dataset.index
        var that=this
        wx.showModal({
            title:"删除购物车",
            content:"确定要删除次商品吗",
            success(res){
                if(res.confirm){
                    var list=that.data.goodsList
                   
               
                  db.collection("goodsCar").doc(list[index]._id).remove()
                  .then(res=>{
                     wx.showToast({
                       title: '已删除',
                        success(res){
                            list.splice(index,1)
                            that.setData({
                                goodsList:list
                            })
                            that.getAllmoney(that.data.goodsList)
                        }
                     })
                  })
                }
            }
        })
    },
    // 用户提交订单
    onClickButton(){
       if(this.data.allMoney){
           wx.navigateTo({
             url: '/pages/payGoods/payGoods',
           })
       }
       else{
           wx.showToast({
             title: '请选择商品!!!',
             icon:'none'
           })
       }
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
        this.getgoods();
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
        this.getgoods()

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})