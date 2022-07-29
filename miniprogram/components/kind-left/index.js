// components/kind-left/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsKind: {
      type: Array,
      value: []
    },
    current:{
      type:Number,
      value:0
    }

  },

  /**
   * 组件的初始数据
   */
  data: {


  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeleft(e) {
      this.setData({
          current: e.currentTarget.dataset.index
        }),
        this.triggerEvent('on-change', {
          index: e.currentTarget.dataset.index
        })
    },

  }
})