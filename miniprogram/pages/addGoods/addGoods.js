let db = wx.cloud.database()
let id = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: [],
    kind: ['烟酒', '酸奶', '蔬菜', '辣条', '泡面', '文具', '面包', '饮料', '生活用品', '水果'],
    kindIndex: ['休闲百货', '烟酒调料', '洗漱日化', '学习用品'],
    index: 0,
    index_kind: 0,
    upGoods: false,
    list: []

  },
  changekind(e) {
    this.setData({
      index_kind: e.detail.value
    })
  },
  changeindex(e) {
    this.setData({
      index: e.detail.value
    })
  },
  // 商品的上传
  submit(e) {
    let dd = e.detail.value
    var that = this
    if (!that.data.src.length) {
      wx.showToast({
        title: '请上传商品图片',
        icon: "none"
      })
    } else if (!dd.name) {
      wx.showToast({
        title: '请输入商品名字',
        icon: "none"
      })
    } else if (!dd.prize) {
      wx.showToast({
        title: '请输入商品价格',
        icon: "none"
      })

    } else if (!dd.number) {
      wx.showToast({
        title: '请输入商品库存',
        icon: "none"
      })

    } else if (!dd.description) {
      wx.showToast({
        title: '请输入商品描述',
        icon: "none"
      })
    } else {
      if (!that.data.upGoods) {
        wx.showModal({
          title: "新增商品",
          content: "确定上架此商品吗?",
          success(res) {
            if (res.confirm) {
              db.collection("goodsList").add({
                  data: {
                    name: dd.name,
                    src: that.data.src,
                    kind: that.data.kind[that.data.index_kind],
                    kindIndex: that.data.kindIndex[that.data.index],
                    prize: dd.prize * 1,
                    number: dd.number * 1,
                    description: dd.description,
                    numberSale: 0,
                    pinglist: [],
                    onSales: true
                  }
                })
                .then(res => {
                  wx.showToast({
                    title: '上架成功',
                    success(res) {
                      wx.redirectTo({
                        url: '/pages/bossCenter/bossCenter',
                      })
                    }
                  })
                })
            }
          }
        })
      } else {
        wx.showModal({
          title: "编辑商品",
          content: "确定编辑此商品吗",
          success(res) {
            if (res.confirm) {
              db.collection("goodsList").doc(id).update({
             data:{
              name: dd.name,
              src: that.data.src,
              kind: that.data.kind[that.data.index_kind],
              kindIndex: that.data.kindIndex[that.data.index],
              prize: dd.prize * 1,
              number: dd.number * 1,
              description: dd.description,
             }
             
              })
              .then(res=>{
                wx.showToast({
                  title: '编辑成功',
                  success(res){
                    wx.redirectTo({
                      url: '/pages/bossCenter/mygoods',
                    })
                  }
                })
              })
            }
          }
        })
      }
    }

  },
  upimage() {
    let that = this
    wx.chooseImage({
      count: 9, //count表示数量
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.showLoading({
          title: '上传中',
        })

        let time = Date.now() //获取当前的时间戳
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          wx.cloud.uploadFile({
              cloudPath: "friends.images/" + time + i, //文件名
              filePath: res.tempFilePaths[i] //文件
            })
            .then(res => {
              that.setData({
                src: that.data.src.concat(res.fileID)
              })
              wx.hideLoading()
              wx.showToast({
                title: '上传成功',
                icon: 'none'
              })
            })
        }
      }
    })
  },
  getGoods(e) {
    var that = this
    db.collection("goodsList").doc(e).get()
      .then(res => {
        let kind = res.data.kind
        let kindIndex = res.data.kindIndex
        for (var i = 0; i < that.data.kindIndex.length; i++) {
          if (kindIndex == that.data.kindIndex[i]) {
            that.setData({
              index: i
            })
          }
        }
        for (var i = 0; i < that.data.kind.length; i++) {
          if (kind == that.data.kind[i]) {
            that.setData({
              index_kind: i
            })
          }
        }
        that.setData({
          list: res.data,
          src: res.data.src
        })
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      id = options.id
      this.setData({
        upGoods: true
      })
      this.getGoods(options.id)
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