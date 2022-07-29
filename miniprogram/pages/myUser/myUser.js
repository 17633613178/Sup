let db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      user:wx.getStorageSync('user')
    })

  },
  // 用户提交信息
  submit(e){
    var that=this
    let dd=e.detail.value
    if(!dd.name){
      wx.showToast({
        title: '请输入姓名',
        icon:"none"
      })
    }
    else if(!dd.phone){
      wx.showToast({
        title: '请输入联系电话',
        icon:"none"
      })
    }
    else{
      wx.showModal({
        title:"保存信息",
        content:"是否修改个人信息",
        success(res){
          if(res.confirm){
            db.collection("goodsUsers").where({
              _openid:wx.getStorageSync('openid')
            }).update({
              data:{
                name:dd.name,
                phone:dd.phone
              }
            })
            .then(res=>{
              wx.showToast({
                title: '修改成功',
                success(res){
                  wx.switchTab({
                    url: '/pages/my/my',
                  })
                }
              })
            })
          }
        }
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