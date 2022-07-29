let db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: []

    },
    // 获取商品详情数据
    getgoods(e){
        var that=this
        var list=[]
        db.collection("goodsList").doc(e).get()
        .then(res=>{
           
            res.data.number=1
            res.data.src=res.data.src[0]
           list[0]=res.data
           that.setData({
               list:list,
               allMoney:res.data.prize
           })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) { 
       if(options.id){
          this.getgoods(options.id)
       }
       else{
        this.getlist()
       }

    },
    //   获取用户购物车结账订单
    getlist() {
        var that = this
        db.collection("goodsCar").where({
                _openid: wx.getStorageSync('openid'),
                conditionCar: true
            }).get()
            .then(res => {
                this.setData({
                    list: res.data
                })
                that.judgeAllmo(res.data)
            })
    },
    judgeAllmo(list) {
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

// 开启导航
gomap() {
  wx.openLocation({
    latitude: 24.889966,
    longitude: 104.308323,
  })
},
// 联系商家
callphone(){
    var phone='10086'
    wx.showActionSheet({
        itemList: ['复制','呼叫'],
        success (res) {
          if(res.tapIndex==0){
            wx.setClipboardData({
              data:phone,
              success(res){
                wx.showToast({
                  title: '已复制',
                })
              }
            })
          }
          else if(res.tapIndex==1){
            wx.makePhoneCall({
              phoneNumber:phone,
            })
          }
        },
        fail (res) {
          console.log(res.errMsg)
        }
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