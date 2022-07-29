// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({

        env: 'cloud1-2gt2x3j976c15ebd',
        traceUser: true,
      });
    }

    this.globalData = {
      goodList:[]
    };
  }
});