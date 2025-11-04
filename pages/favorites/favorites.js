// pages/favorites/favorites.js
Page({
  data: {
    activeTab: 'places', // 当前激活的标签
    places: [],          // 收藏的地点
    notes: [],           // 收藏的游记
    products: []         // 收藏的商品
  },

  onLoad: function(options) {
    this.loadFavoritesData();
  },

  // 切换标签
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  // 加载收藏数据
  loadFavoritesData: function() {
    // 这里应该是从服务器或缓存获取数据的逻辑
    // 模拟数据
    setTimeout(() => {
      this.setData({
        places: [
          {
            id: 1,
            name: '西湖风景区',
            location: '浙江杭州',
            tags: ['5A景区', '自然风光']
          },
          {
            id: 2,
            name: '故宫博物院',
            location: '北京',
            tags: ['5A景区', '历史古迹']
          }
        ],
        notes: [
          {
            id: 1,
            title: '杭州三日游完美攻略',
            author: '旅行达人小王',
            coverImage: '/images/hangz.jpg',
            likes: 1024,
            views: 2048
          }
        ],
        products: [
          {
            id: 1,
            name: '西湖龙井茶叶礼盒',
            price: 298,
            image: '/images/tea.jpg'
          }
        ]
      });
    }, 500);
  },
});
