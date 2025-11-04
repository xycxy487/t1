// pages/profile/profile.js
Page({
  data: {
    userInfo: {},
    stats: {
      travelCount: 2,
      followers: 26,
      following: 23
    }
  },

  onLoad: function() {
    this.loadUserData()
  },

  onShow: function() {
    this.loadUserData()
  },

  loadUserData: function() {
    const app = getApp()
    this.setData({
      userInfo: app.globalData.userInfo || {}
    })
    
    // 这里可以添加从服务器获取统计数据的逻辑
  },
  
  navigateToEdit: function() {
    wx.navigateTo({
      url: '/pages/editprofile/editprofile',
    })
  },
  
  navigateToMyTrips() {
    wx.navigateTo({
      url: '/pages/mytrips/mytrips'
    })
  },
  
  navigateToFavorites() {
    wx.navigateTo({
      url: '/pages/favorites/favorites'
    })
  },
  
  navigateToOrders() {
    wx.navigateTo({
      url: '/pages/orders/orders'
    })
  },
  
  navigateToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    })
  }
})
