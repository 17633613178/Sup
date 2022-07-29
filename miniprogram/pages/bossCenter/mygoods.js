let db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    saleGoods: [],
    xiaGoods: [],
  },
  // 商品的下架
  xiajia(e) {
    var index = e.currentTarget.dataset.index
    let saleGoods = this.data.saleGoods
    let xiaGoods = this.data.xiaGoods
    var id = this.data.saleGoods[index]._id
    var that = this
    wx.showModal({
      title: "商品下架",
      content: "确定下架此商品吗",
      success(res) {
        if (res.confirm) {
          db.collection("goodsList").doc(id).update({
              data: {
                onSales: false
              }
            })
            .then(res => {
              xiaGoods.push(saleGoods[index])
              saleGoods.splice(index, 1)
              that.setData({
                saleGoods: saleGoods,
                xiaGoods: xiaGoods,
             
              })
              wx.showToast({
                title: '已下架',
              })
            })
        }
      }
    })
  },
  // 商品的上架
  shangjia(e){
    var index = e.currentTarget.dataset.index
    let saleGoods = this.data.saleGoods
    let xiaGoods = this.data.xiaGoods
    var id = this.data.xiaGoods[index]._id
    var that = this
    wx.showModal({
      title: "商品下架",
      content: "确定上架此商品吗",
      success(res) {
        if (res.confirm) {
          db.collection("goodsList").doc(id).update({
              data: {
                onSales: true
              }
            })
            .then(res => {
              saleGoods.push(saleGoods[index])
              xiaGoods.splice(index, 1)
              that.setData({
                saleGoods: saleGoods,
                xiaGoods: xiaGoods,
             
              })
              wx.showToast({
                title: '已上架',
              })
            })
        }
      }
    })
  },
  // 商品的编辑
  addGoods(e){
    let id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/addGoods/addGoods?id='+id,
    })
  },

  onChange(event) {
    this.setData({
      active: event.detail.index
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '数据加载中',
    })
    this.setData({
      active: options.active * 1
    })
    this.getmyGoods()
    this.xiaGoods()

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