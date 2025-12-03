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
    console.log('profile页面加载，全局用户信息:', getApp().globalData.userInfo);
    this.loadUserData();
  },

  onShow: function() {
    console.log('profile页面显示，全局用户信息:', getApp().globalData.userInfo);
    this.loadUserData();
  },

  loadUserData: function() {
    const app = getApp();
    const userInfo = app.getGlobalUserInfo();
    
    console.log('加载用户数据:', userInfo);
    
    if (userInfo && Object.keys(userInfo).length > 0) {
      this.setData({
        userInfo: userInfo
      });
      console.log('用户信息设置成功');
    } else {
      console.log('用户信息为空，尝试从缓存恢复');
      if (app.checkLoginStatus()) {
        const refreshedUserInfo = app.getGlobalUserInfo();
        this.setData({
          userInfo: refreshedUserInfo || {}
        });
      } else {
        console.log('用户未登录，跳转到登录页');
        wx.redirectTo({
          url: '/pages/login/login'
        });
      }
    }
  },
  
  navigateToEdit: function() {
    const app = getApp();
    if (!app.checkLoginStatus()) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/editprofile/editprofile',
    });
  },
  
  navigateToMyTrips: function() {
    const app = getApp();
    if (!app.checkLoginStatus()) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/mytrips/mytrips'
    });
  },
  
  navigateToFavorites: function() {
    const app = getApp();
    if (!app.checkLoginStatus()) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/favorites/favorites'
    });
  },
  
  navigateToOrders: function() {
    const app = getApp();
    if (!app.checkLoginStatus()) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/orders/orders'
    });
  },
  
  navigateToSettings: function() {
    const app = getApp();
    if (!app.checkLoginStatus()) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  }
})

