let db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
      nickName: "黑子哥疫情超市",
      avatarUrl: "cloud://cloud1-2gt2x3j976c15ebd.636c-cloud1-2gt2x3j976c15ebd-1309707474/src=http___img.pptjia.com_image_20171014_cfbe80b3c6c548dae0a72ef2fde28c98.jpg&refer=http___img.pptjia.webp"
    },
    allowDeng: false,
    number: 10,
    show: false,
    locationsrc: ["https://s1.ax1x.com/2022/07/21/jLDVVH.jpg"]

  },
  showPopup() {
    this.setData({
      show: true
    });
  },
  // 开启导航
  gomap() {
    wx.openLocation({
      latitude: 24.889966,
      longitude: 104.308323,
    })
  },
  // 查看地址图片
  skansrc() {
    wx.previewImage({
      urls: this.data.locationsrc,
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


  onClose() {
    this.setData({
      show: false
    });
  },
  // 用户授权登录
  allowDeng() {
    var that = this
    wx.getUserProfile({
      desc: '信息完善',
      success(res) {
        wx.showLoading({
          title: '数据加载中',
        })
        wx.setStorageSync('user', res.userInfo)
        // 获取用户openid
        wx.cloud.callFunction({
          name: "userOpenid",
          success(ses) {
            that.judgeDatabase(res.userInfo, ses.result.openid)
            wx.setStorageSync('openid', ses.result.openid)
          }
        })
      }
    })
  },
  // 退出登录
  cancleDeng() {
    var that = this
    // 清楚用户缓存
    wx.showModal({
      title: "退出登录",
      content: "退出后将无法享用部分权益?",
      success(res) {
        let user = that.data.user;
        user.nickName = '黑子哥疫情超市';
        user.avatarUrl = 'cloud://cloud1-2gt2x3j976c15ebd.636c-cloud1-2gt2x3j976c15ebd-1309707474/src=http___img.pptjia.com_image_20171014_cfbe80b3c6c548dae0a72ef2fde28c98.jpg&refer=http___img.pptjia.webp'
        if (res.confirm) {
          wx.removeStorageSync('user')
          wx.removeStorageSync('openid')
          that.setData({
            allowDeng: false,
            user: user
          })

        }
      }
    })
  },
  // 判断是否将用户信息加入数据库
  judgeDatabase(userInfo, openid) {
    var that = this
    // 数据库查询
    db.collection("goodsUsers").where({
        _openid: openid
      }).get()
      .then(res => {
        // 用户第一次登录
        if (res.data.length == 0) {
          // 将用户信息写入数据库
          db.collection("goodsUsers").add({
            data: {
              nick: userInfo.nickName,
              src: userInfo.avatarUrl,
              phone: '',
              number: 0,
              name: ''
            }
          }).then(res => {
            that.setData({
              user: userInfo,
              allowDeng: true,
              number: 0,
            })
            wx.hideLoading()
          })
        }
        // 不是第一次登录
        else {
          db.collection("goodsUsers").where({
              _openid: openid
            }).get()
            .then(res => {
              let user = that.data.user
              user.nickName = res.data[0].nick
              user.avatarUrl = res.data[0].src
              that.setData({
                user: user,
                number: res.data[0].number,
                allowDeng: true
              })
              wx.hideLoading()

            })
        }
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
    // 判断用户是否保留登录状态
    if (wx.getStorageSync('user')) {
      db.collection("goodsUsers").where({
          _openid: wx.getStorageSync('openid')
        }).get()
        .then(res => {
          let user = this.data.user
          user.nickName = res.data[0].nick;
          user.avatarUrl = res.data[0].src;
          user.name = res.data[0].name;
          user.phone = res.data[0].phone
          wx.setStorageSync('user', user)
          this.setData({
            user: user,
            number: res.data[0].number,
            allowDeng: true
          })
        })
    }

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