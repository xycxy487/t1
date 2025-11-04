// pages/social/social.js
Page({
  data: {
    postContent: '', // 发布内容
    feeds: ''
  },
  
  onLoad() {
    // 初始化时将数据存入全局，方便评论页面访问
    const app = getApp();
    if (!app.globalData.feeds) {
      app.globalData.feeds = this.data.feeds;
    }
    else{
      this.setData({
        feeds: [...app.globalData.feeds]
      });
    }
  },
  
  // 输入内容监听
  onContentInput(e) {
    this.setData({
      postContent: e.detail.value
    });
  },

  // 提交发布
  submitPost() {
    if (!this.data.postContent.trim()) {
      wx.showToast({
        title: '请填写内容',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '发布中...',
    });

    const app = getApp();
    const userInfo=app.globalData.userInfo;

    // 模拟上传过程
    setTimeout(() => {
      const newFeed = {
        id: Date.now(),
        username: userInfo.username, // 实际应用中应从用户信息获取
        avatar: userInfo.avatar, // 默认头像
        time: '刚刚',
        content: this.data.postContent,
        likes: 0,
        comments: 0,
        liked: false
      };

      // 更新数据
      const updatedFeeds = [newFeed, ...this.data.feeds];
      this.setData({
        feeds: updatedFeeds,
        postContent: ''
      });

      // 更新全局数据
      getApp().globalData.feeds = updatedFeeds;

      wx.hideLoading();
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      });
    }, 1500);
  },
  
  likeFeed(e) {
    const id = e.currentTarget.dataset.id;
    const feeds = this.data.feeds.map(item => {
      if (item.id === id) {
        return {
          ...item,
          liked: !item.liked,
          likes: item.liked ? item.likes - 1 : item.likes + 1
        };
      }
      return item;
    });
    
    // 更新全局数据
    getApp().globalData.feeds = feeds;
    
    this.setData({ feeds });
  },
  
  commentFeed(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/comments/comments?id=' + id
    });
  },
  
  shareFeed(e) {
    const id = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: ['分享给好友', '分享到朋友圈'],
      success(res) {
        console.log('分享方式:', res.tapIndex);
      }
    });
  }
});