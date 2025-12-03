// app.js
App({
  // 全局数据
  globalData: {
    userInfo: null,
    isLoggedIn: false,
    feeds:[],
    baseUrl:'http://localhost:3000/api'
  },

  // 设置全局用户信息
  setGlobalUserInfo: function(userInfo) {
  if (!userInfo) return false;
  
  console.log('设置全局用户信息，原始数据:', userInfo);
  
  // 适配login.js中的userInfo格式
  const formattedUserInfo = {
    username: userInfo.username || '',
    avatar: userInfo.avatar || '',
    userId: userInfo.userId || userInfo.id || `user_${Date.now()}`,
    openid: userInfo.openid || '',
    loginTime: userInfo.loginTime || new Date().toISOString()
  };
  
  this.globalData.userInfo = formattedUserInfo;
  this.globalData.isLoggedIn = true;
  
  console.log('全局用户信息已设置:', formattedUserInfo);
  return true;
},

  // 获取全局用户信息
  getGlobalUserInfo: function() {
    return this.globalData.userInfo;
  },

  // 检查登录状态
checkLoginStatus: function() {
  console.log('检查全局登录状态');
  
  // 先检查内存中的登录状态
  if (this.globalData.isLoggedIn && this.globalData.userInfo) {
    console.log('内存中已登录');
    return true;
  }
  
  // 如果内存中没有，检查本地缓存
  try {
    const userInfo = wx.getStorageSync('userInfo');
    console.log('从缓存读取用户信息:', userInfo);
    
    if (userInfo && typeof userInfo === 'object' && Object.keys(userInfo).length > 0) {
      // 如果缓存中有有效的用户信息，同步到全局
      this.setGlobalUserInfo(userInfo);
      console.log('从缓存恢复登录状态成功');
      return true;
    }
  } catch (e) {
    console.error('读取缓存失败:', e);
  }
  
  console.log('用户未登录');
  return false;
},

  // 清除全局用户信息
  clearGlobalUserInfo: function() {
    this.globalData.userInfo = null;
    this.globalData.isLoggedIn = false;
    console.log('全局用户信息已清除');
  },

  // 获取动态列表（从MySQL数据库）
  getFeedsFromDB: function() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.globalData.baseUrl}/feeds`,
        method: 'GET',
        success: res => {
          if (res.data.code === 0) {
            this.globalData.feeds = res.data.data;
            resolve(res.data.data);
          } else {
            reject(new Error(res.data.message));
          }
        },
        fail: err => {
          reject(err);
        }
      });
    });
  },

  // 获取评论列表（从MySQL数据库）
  getCommentsFromDB: function(feedId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.globalData.baseUrl}/comments/${feedId}`,
        method: 'GET',
        success: res => {
          if (res.data.code === 0) {
            resolve(res.data.data);
          } else {
            reject(new Error(res.data.message));
          }
        },
        fail: err => {
          reject(err);
        }
      });
    });
  },

  // 添加评论（保存到MySQL数据库）
  addCommentToDB: function(feedId, content) {
    return new Promise((resolve, reject) => {
      const userInfo = this.getGlobalUserInfo();
      if (!userInfo) {
        reject(new Error('用户未登录'));
        return;
      }

      wx.request({
        url: `${this.globalData.baseUrl}/comments`,
        method: 'POST',
        data: {
          feed_id: feedId,
          username: userInfo.username,
          avatar: userInfo.avatar,
          content: content
        },
        success: res => {
          if (res.data.code === 0) {
            resolve(res.data);
          } else {
            reject(new Error(res.data.message));
          }
        },
        fail: err => {
          reject(err);
        }
      });
    });
  },

  onLaunch: function() {
    console.log('小程序初始化');
    
    // 初始化云开发
    wx.cloud.init({
      env: 'cloud1-7gcp4ymj35d40393', // 使用您的环境ID
      traceUser: true
    });
    console.log('云开发初始化完成');

    // 启动时自动同步登录状态
    this.syncLoginStatus();
    if (this.checkLoginStatus()) {
      this.getFeedsFromDB().then(feeds => {
        console.log('动态数据加载成功', feeds);
      });
    }

    // 检查登录状态
    if (!this.checkLoginStatus()) {
      // 未登录，强制跳转到登录页
      wx.reLaunch({
        url: '/pages/login/login'
      });
    }
  },

  onShow: function() {
    console.log('小程序显示');
    this.syncLoginStatus();
  },

  onHide: function() {
    console.log('小程序隐藏');
  },

  // 同步登录状态
syncLoginStatus: function() {
  return this.checkLoginStatus();
}
});