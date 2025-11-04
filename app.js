// app.js
App({
  // 全局数据
  globalData: {
    userInfo: null,
    isLoggedIn: false,
    
    // 示例数据（这些可以保留在globalData中）
    feeds: [
      {
        id: 1,
        username: '旅行达人',
        avatar: '/images/chengdu.jpg',
        time: '3小时前',
        content: '刚刚从北京回来，故宫真是太壮观了！推荐大家一定要去看看，特别是珍宝馆，里面的文物精美绝伦。',
        images: ['/images/beijing.jpg'],
        likes: 24,
        comments: 2,
        liked: false
      },
      {
        id: 2,
        username: '美食探索者',
        avatar: '/images/shanghai.jpg',
        time: '昨天',
        content: '上海的小笼包真的名不虚传，汤汁鲜美，皮薄馅多。推荐城隍庙附近的南翔馒头店，虽然要排队，但绝对值得！',
        images: ['/images/food.jpg'],
        likes: 15,
        comments: 1,
        liked: false
      }
    ],
    comments: {
      1: [
        {
          id: 101,
          username: '故宫爱好者',
          avatar: '/images/hangz.jpg',
          content: '珍宝馆的翡翠白菜真的惊艳！我去年去看过',
          time: '1小时前'
        },
        {
          id: 102,
          username: '历史迷',
          avatar: '/images/shanghai.jpg',
          content: '建议早上去，人少的时候更有感觉',
          time: '45分钟前'
        }
      ],
      2: [
        {
          id: 201,
          username: '吃货小分队',
          avatar: '/images/banner/ba2.jpg',
          content: '他们家的蟹粉小笼也是一绝！',
          time: '昨天'
        }
      ]
    }
  },

  // 设置全局用户信息
  setGlobalUserInfo: function(userInfo) {
    this.globalData.userInfo = userInfo;
    this.globalData.isLoggedIn = true;
    console.log('全局用户信息已设置:', userInfo);
  },

  // 获取全局用户信息
  getGlobalUserInfo: function() {
    return this.globalData.userInfo;
  },

  // 检查登录状态
  checkLoginStatus: function() {
    return this.globalData.isLoggedIn && this.globalData.userInfo !== null;
  },

  // 清除全局用户信息
  clearGlobalUserInfo: function() {
    this.globalData.userInfo = null;
    this.globalData.isLoggedIn = false;
    console.log('全局用户信息已清除');
  },

  onLaunch: function() {
    console.log('小程序初始化');
    
    // 初始化云开发
    wx.cloud.init({
      env: 'cloud1-7gcp4ymj35d40393', // 使用您的环境ID
      traceUser: true
    });
    console.log('云开发初始化完成');

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
  },

  onHide: function() {
    console.log('小程序隐藏');
  }
});