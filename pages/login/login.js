const app=getApp();

Page({
  data: {
    isLoggedIn: false,
    userInfo: {
      username: '',
      avatar: ''
    }
  },

  onLoad: function(options) {
    const userInfo = wx.getStorageSync('userInfo'); //直接读缓存
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        isLoggedIn: true
      });
    }
  },

  // 检查全局登录状态
  checkGlobalLoginStatus: function() {
    if (app.checkLoginStatus()) {
      const globalUserInfo = app.getGlobalUserInfo();
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

  // 提交用户信息并登录
  submitUserInfo() {
    const { username, avatar } = this.data.userInfo;
    
    if (!username || !avatar) {
      wx.showToast({
        title: '请完善用户信息',
        icon: 'none'
      });
      return;
    }

    // 创建完整的用户数据
    const userData = {
      username: username,
      avatar: avatar,
      userId: 'user_' + Date.now(),
      loginTime: new Date().toISOString()
    };

    console.log('准备保存到全局的用户数据:', userData);
    
    // 保存到全局
    app.setGlobalUserInfo(userData);
    
    // 更新页面状态
    this.setData({
      userInfo: userData,
      isLoggedIn: true
    });

    setTimeout(() => {
       wx.switchTab({
        url: '/pages/index/index'
       })
    }, 1500)
  },

  //检查登录状态
  checkLoginStatus: function() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        isLoggedIn: true
      })
      return true
    }
    return false
  }
})