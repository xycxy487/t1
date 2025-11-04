// pages/settings/settings.js
Page({
  data: {
    notificationEnabled: true,
    systemNotificationEnabled: true,
    cacheSize: '0.0MB',
    version: '1.0.0'
  },

  onLoad: function(options) {
    this.loadSettings();
    this.calculateCache();
  },

  // 加载用户设置
  loadSettings: function() {
    // 这里应该从缓存或服务器获取用户设置
    const settings = wx.getStorageSync('userSettings') || {};
    this.setData({
      notificationEnabled: settings.notificationEnabled !== false,
      systemNotificationEnabled: settings.systemNotificationEnabled !== false,
      version: settings.version || '1.0.0'
    });
  },

  // 计算缓存大小
  calculateCache: function() {
    wx.getStorageInfo({
      success: (res) => {
        const size = (res.currentSize / 1024).toFixed(2);
        this.setData({
          cacheSize: size + 'MB'
        });
      }
    });
  },

  // 切换消息通知
  toggleNotification: function(e) {
    const value = e.detail.value;
    this.setData({
      notificationEnabled: value
    });
    this.saveSettings();
  },

  // 切换系统通知
  toggleSystemNotification: function(e) {
    const value = e.detail.value;
    this.setData({
      systemNotificationEnabled: value
    });
    this.saveSettings();
  },

  // 保存设置
  saveSettings: function() {
    wx.setStorageSync('userSettings', {
      notificationEnabled: this.data.notificationEnabled,
      systemNotificationEnabled: this.data.systemNotificationEnabled
    });
  },

  // 清除缓存
  clearCache: function() {
    wx.showLoading({
      title: '清理中...',
    });
    
    wx.clearStorage({
      success: () => {
        this.calculateCache();
        wx.hideLoading();
        wx.showToast({
          title: '缓存已清除',
          icon: 'success'
        });
      }
    });
  },

  // 检查更新
  checkUpdate: function() {
    const updateManager = wx.getUpdateManager();
    
    updateManager.onCheckForUpdate((res) => {
      if (!res.hasUpdate) {
        wx.showToast({
          title: '已是最新版本',
          icon: 'none'
        });
      }
    });
    
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: (res) => {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        }
      });
    });
  },

  // 显示退出确认
  showLogoutConfirm: function() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success: (res) => {
        if (res.confirm) {
          this.logout();
        }
      }
    });
  },

  // 执行退出登录
  logout: function() {
    wx.showLoading({
      title: '退出中...',
    });
    
    setTimeout(() => {
      // 清除登录状态
      wx.removeStorageSync('token');
      wx.removeStorageSync('userInfo');

      // 清除全局用户信息（如果使用了全局状态）
      const app = getApp();
      if (app && app.clearGlobalUserInfo) {
        app.clearGlobalUserInfo();
      }
      
      wx.hideLoading();
      
      // 退出成功后跳转到登录页面
      wx.redirectTo({
        url: '/pages/login/login',
      });
    }, 1500);
  }
});
