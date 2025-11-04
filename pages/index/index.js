// index.js
Page({
  data: {
    searchKeyword:'',
    banners: [
      { id: 1, image: '/images/banner/ba1.jpg' },
      { id: 2, image: '/images/banner/ba2.jpg' },
      { id: 3, image: '/images/banner/ba3.jpg' }
    ],
    hotList: [
      { 
        id: 1, 
        name: '北京故宫一日游', 
        desc: '探索中国古代皇家宫殿的壮丽与神秘', 
        image: '/images/beijing.jpg',
        price: 120
      },
      { 
        id: 2, 
        name: '上海外滩夜景游', 
        desc: '欣赏黄浦江两岸的璀璨夜景和万国建筑', 
        image: '/images/shanghai.jpg',
        price: 80
      },
      { 
        id: 3, 
        name: '成都熊猫基地', 
        desc: '近距离观察可爱的大熊猫和小熊猫', 
        image: '/images/chengdu.jpg',
        price: 60
      }
    ],
    strategies: [
      { 
        id: 1, 
        title: '三日游遍北京经典景点', 
        cover: '/images/s1.jpg',
        author: '旅行达人',
        date: '2023-10-15'
      },
      { 
        id: 2, 
        title: '上海美食探索之旅', 
        cover: '/images/food.jpg',
        author: '美食家',
        date: '2023-09-28'
      }
    ]
  },
  
  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    })
  },
  
  onShareAppMessage() {
    return {
      title: '发现精彩旅游路线',
      path: '/pages/index/index'
    }
  },

  // 搜索输入事件
  onSearchInput: function(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 执行搜索
  onSearchConfirm: function() {
    const keyword = this.data.searchKeyword.trim();
    if (keyword) {
      // 保存搜索历史
      this.saveSearchHistory(keyword);
      
      // 跳转到搜索页面
      wx.navigateTo({
        url: `/pages/search/search?keyword=${encodeURIComponent(keyword)}`,
      });
      
      // 清空输入框
      this.setData({
        searchKeyword: ''
      });
    }
  },

  // 清空搜索
  clearSearch: function() {
    this.setData({
      searchKeyword: ''
    });
  },

  // 保存搜索历史
  saveSearchHistory: function(keyword) {
    let history = wx.getStorageSync('searchHistory') || [];
    history = history.filter(item => item !== keyword); // 去重
    history.unshift(keyword); // 添加到开头
    history = history.slice(0, 10); // 最多保存10条
    wx.setStorageSync('searchHistory', history);
  }


})