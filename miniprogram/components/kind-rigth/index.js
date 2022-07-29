// components/kind-rigth/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    swiper: {
      type: Array,
      value: []
    },
    goodsList:{
      type:Array,
      value:[]
    },
    goodsKind:{
      type:Array,
      value:[]
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
    kind:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindscroll(e){
      this.createSelectorQuery().selectAll('.section').boundingClientRect(
        rects => {
          this.triggerEvent('on-change', {
            rects:rects
          })
        }
      ).exec();
    },
    goDetail(e){
      this.triggerEvent('go-detail', {
        id:e.currentTarget.dataset.id
      })
    },
  }
})