// pages/social/social.js
Page({
  data: {
    postContent: '',
    feeds: [],
    comments: []
  },
  
  onLoad: function(options) {
    console.log('social页面加载，参数:', options);
    this.loadFeeds();
  },
  
  onShow: function() {
    // 页面显示时刷新数据，确保评论数更新
    this.loadFeeds();
  },
  
  // 加载动态列表
  loadFeeds: function() {
    const app = getApp();
    wx.showLoading({
      title: '加载中...',
    });
    
    app.getFeedsFromDB().then(feeds => {
      console.log('获取到的动态数据:', feeds);
      
      // 处理数据，将 comments_count 映射到 comments
      const processedFeeds = (feeds || []).map(feed => {
        return {
          ...feed,
          comments: feed.comments_count || 0  // 关键修改：映射字段名
        };
      });
      
      this.setData({ 
        feeds: processedFeeds
      });
      wx.hideLoading();
    }).catch(err => {
      console.error('加载动态失败:', err);
      wx.hideLoading();
      this.setData({ feeds: [] });
    });
  },

  // 输入内容监听
  onContentInput: function(e) {
    this.setData({
      postContent: e.detail.value
    });
  },

  // 提交发布
  submitPost: function() {
    if (!this.data.postContent.trim()) {
      wx.showToast({
        title: '请填写内容',
        icon: 'none'
      });
      return;
    }

    const app = getApp();
    const userInfo = app.getGlobalUserInfo();
    
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '发布中...',
    });

    // 调用发布API
    this.publishFeedToDB(this.data.postContent, userInfo).then(() => {
      this.setData({ postContent: '' });
      this.loadFeeds(); // 重新加载动态列表
      wx.hideLoading();
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      });
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '发布失败',
        icon: 'none'
      });
    });
  },
  
  // 发布动态到数据库
  publishFeedToDB: function(content, userInfo) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${getApp().globalData.baseUrl}/feeds`,
        method: 'POST',
        data: {
          username: userInfo.username,
          avatar: userInfo.avatar,
          content: content,
          images: '[]'
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
  
  // 点赞/取消点赞
  likeFeed: function(e) {
    const feedId = e.currentTarget.dataset.id;
    const feeds = this.data.feeds.map(item => {
      if (item.id === feedId) {
        const newLikedState = !item.liked;
        const newLikesCount = newLikedState ? item.likes + 1 : item.likes - 1;
        
        // 立即更新UI
        this.setData({
          feeds: this.data.feeds.map(feed => 
            feed.id === feedId ? { 
              ...feed, 
              liked: newLikedState, 
              likes: newLikesCount 
            } : feed
          )
        });
        
        // 调用后端API更新点赞状态
        this.updateLikeInDB(feedId, newLikedState);
        
        return {
          ...item,
          liked: newLikedState,
          likes: newLikesCount
        };
      }
      return item;
    });
  },
  
  // 更新点赞状态到数据库
  updateLikeInDB: function(feedId, isLiked) {
    wx.request({
      url: `${getApp().globalData.baseUrl}/feeds/${feedId}/like`,
      method: 'POST',
      data: { liked: isLiked },
      success: res => {
        if (res.data.code !== 0) {
          console.error('更新点赞状态失败:', res.data.message);
        }
      }
    });
  },
  
  // 点击评论图标 - 跳转到评论页面
  commentFeed: function(e) {
    const feedId = e.currentTarget.dataset.id;
    console.log('跳转到评论页面，feedId:', feedId);
    
    if (!feedId) {
      wx.showToast({
        title: '动态ID不存在',
        icon: 'none'
      });
      return;
    }
    
    // 跳转到评论页面，传递feedId参数
    wx.navigateTo({
      url: `/pages/comments/comments?feedId=${feedId}`,
      success: () => {
        console.log('跳转成功');
      },
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },
  
  // 分享功能
  shareFeed: function(e) {
    const feedId = e.currentTarget.dataset.id;
    const feed = this.data.feeds.find(item => item.id === feedId);
    
    wx.showActionSheet({
      itemList: ['分享给好友', '分享到朋友圈'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.showToast({
            title: '已分享给好友',
            icon: 'success'
          });
        } else if (res.tapIndex === 1) {
          wx.showToast({
            title: '已分享到朋友圈',
            icon: 'success'
          });
        }
      }
    });
  },
  
  // 下拉刷新
  onPullDownRefresh: function() {
    this.loadFeeds().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
