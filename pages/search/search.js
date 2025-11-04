// pages/search/search.js
Page({
  data: {
    keyword: '',
    historyList: [],
    hotKeywords: ['西湖', '故宫', '长城', '九寨沟', '张家界'],
    destinations: [],
    attractions: [],
    guides: [],
    isLoading: false
  },

  onLoad: function(options) {
    if (options.keyword) {
      this.setData({
        keyword: decodeURIComponent(options.keyword)
      });
      this.doSearch();
    }
    this.loadSearchHistory();
  },

  // 加载搜索历史
  loadSearchHistory: function() {
    const history = wx.getStorageSync('searchHistory') || [];
    this.setData({
      historyList: history
    });
  },

  // 搜索输入事件
  onSearchInput: function(e) {
    this.setData({
      keyword: e.detail.value
    });
    
    // 简单防抖处理
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.data.keyword.trim()) {
        this.doSearch();
      }
    }, 300);
  },

  // 执行搜索
  doSearch: function() {
    const keyword = this.data.keyword.trim();
    if (!keyword) return;
    
    this.setData({
      isLoading: true
    });
    
    // 模拟API请求
    setTimeout(() => {
      // 这里应该是真实的API请求
      const mockData = this.getMockSearchResults(keyword);
      
      this.setData({
        destinations: mockData.destinations,
        attractions: mockData.attractions,
        guides: mockData.guides,
        isLoading: false
      });
      
      // 保存搜索历史
      this.saveSearchHistory(keyword);
    }, 800);
  },

  // 获取模拟数据
  getMockSearchResults: function(keyword) {
    // 这里应该是真实的API请求
    // 返回模拟数据用于演示
    return {
      destinations: [
        {
          id: 1,
          name: `${keyword}风景区`,
          desc: `${keyword}著名旅游景点`,
          image: '/images/destination1.jpg'
        }
      ],
      attractions: [
        {
          id: 101,
          name: `${keyword}著名景点`,
          location: `中国${keyword}`,
          image: '/images/attraction1.jpg'
        }
      ],
      guides: [
        {
          id: 1001,
          title: `${keyword}旅游攻略`,
          author: '旅行达人',
          views: 1024
        }
      ]
    };
  },

  // 保存搜索历史
  saveSearchHistory: function(keyword) {
    let history = wx.getStorageSync('searchHistory') || [];
    history = history.filter(item => item !== keyword); // 去重
    history.unshift(keyword); // 添加到开头
    history = history.slice(0, 10); // 最多保存10条
    wx.setStorageSync('searchHistory', history);
    this.setData({
      historyList: history
    });
  },

  // 清空搜索历史
  clearHistory: function() {
    wx.removeStorageSync('searchHistory');
    this.setData({
      historyList: []
    });
  },

  // 通过历史记录搜索
  searchByHistory: function(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({
      keyword
    });
    this.doSearch();
  },

  // 通过热门搜索
  searchByHot: function(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({
      keyword
    });
    this.doSearch();
  },

  // 返回
  goBack: function() {
    wx.navigateBack();
  },

  // 跳转到目的地详情
  navigateToDestination: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/destination/detail?id=${id}`,
    });
  },

  // 跳转到景点详情
  navigateToAttraction: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/attraction/detail?id=${id}`,
    });
  },

  // 跳转到攻略详情
  navigateToGuide: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/guide/detail?id=${id}`,
    });
  }
});
