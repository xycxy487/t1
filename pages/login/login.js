const app = getApp();

Page({
  data: {
    isLoggedIn: false,
    userInfo: {
      username: '',
      avatar: ''
    },
    loading: false
  },

  onLoad: function(options) {
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        isLoggedIn: true
      });
      return true;
    }
    return false;
  },

  // 检查全局登录状态
  checkGlobalLoginStatus: function() {
    if (app.checkLoginStatus && app.checkLoginStatus()) {
      const globalUserInfo = app.getGlobalUserInfo && app.getGlobalUserInfo();
      console.log('全局用户信息:', globalUserInfo);
      
      this.setData({
        userInfo: globalUserInfo,
        isLoggedIn: true
      });
    } else {
      console.log('用户未登录，显示登录表单');
      this.setData({
        isLoggedIn: false
      });
    }
  },

  // 获取用户头像
  chooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      'userInfo.avatar': avatarUrl
    });
    console.log('头像已设置:', avatarUrl);
  },

  // 输入用户名
  inputusername(e) {
    this.setData({
      'userInfo.username': e.detail.value
    });
  },

  // 微信登录并提交用户信息到后端
  submitUserInfo() {
    const { username, avatar } = this.data.userInfo;
    
    if (!username || !avatar) {
      wx.showToast({
        title: '请完善用户信息',
        icon: 'none'
      });
      return;
    }

    this.setData({ loading: true });

    // 1. 先获取微信登录code
    wx.login({
      success: (loginRes) => {
        if (loginRes.code) {
          // 2. 发送到后端服务器
          this.loginToServer(loginRes.code, username, avatar);
        } else {
          this.showError('微信登录失败');
        }
      },
      fail: () => {
        this.showError('登录失败，请重试');
      }
    });
  },

  // 发送登录请求到后端服务器
  loginToServer(code, nickname, avatarUrl) {
    wx.request({
      url: 'http://localhost:3000/api/login', // 你的后端地址
      method: 'POST',
      data: {
        code: code,
        nickname: nickname,
        avatar: avatarUrl
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.loginSuccess(res.data, nickname, avatarUrl);
        } else {
          this.showError(res.data.message || '登录失败');
        }
      },
      fail: (err) => {
        console.error('请求失败:', err);
        this.showError('网络连接失败');
      },
      complete: () => {
        this.setData({ loading: false });
      }
    });
  },

  // 修改后的登录成功处理
loginSuccess(serverData, nickname, avatarUrl) {
  console.log('后端返回的完整数据:', serverData); // 先打印看看数据结构
  
  // 安全地获取用户数据
  const userDataFromServer = serverData.data || {};
  const userInfo = userDataFromServer.user || userDataFromServer;
  
  // 创建完整的用户数据
  const userData = {
    username: nickname,
    avatar: avatarUrl,
    userId: userInfo.id || 'user_' + Date.now(),
    openid: userInfo.openid || '',
    loginTime: new Date().toISOString(),
    // 安全地合并后端数据
    ...userInfo
  };

  console.log('最终用户数据:', userData);
  
  // 保存到本地缓存
  wx.setStorageSync('userInfo', userData);
  
  // 更新页面状态
  this.setData({
    userInfo: userData,
    isLoggedIn: true
  });

  wx.showToast({
    title: serverData.message || '登录成功',
    icon: 'success',
    duration: 1500
  });

  // 跳转到首页
  setTimeout(() => {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }, 1500);
},

  // 显示错误信息
  showError(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
    this.setData({ loading: false });
  },
});
