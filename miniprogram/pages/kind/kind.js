let db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper: [],
    goodsKind: [],
    goodsList: [],
    current: 0,
    currents:0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showLoading({
      title: '加载中',
    })
    this.swiper()
    this.getkind()
    this.getgoods()
  },
  swiper() {
    var that = this
    db.collection("swiperKind").get()
      .then(res => {
        that.setData({
          swiper: res.data
        })
      })
  },
  getkind() {
    var that = this
    db.collection("goodsKind").get()
      .then(res => {
        that.setData({
          goodsKind: res.data
        })
      })
  },
  getgoods() {
    var that = this
    db.collection("goodsList").where({onSales:true}).skip(that.data.goodsList.length).get()
      .then(res => {
        that.setData({
          goodsList: that.data.goodsList.concat(res.data)
        })
     
        if (res.data.length == 20) {
          that.getgoods()
        }
        else{
       
          wx.hideLoading({
            success: (res) => {},
          })
        }
      })
  },
  changeLeft(e) {
    this.setData({
      current: e.detail.index
    })
  },
  changeRigth(e) {
    var that=this
     let rects=e.detail.rects
     for(var i=0;i<rects.length;i++){
       if(rects[i].top>0&&rects[i].top<160){
        that.setData({
          currents:i
        })
       }
     }
  },
  // 前往商品详情页
  goDeail(e){
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?id='+e.detail.id,
    })
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