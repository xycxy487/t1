// pages/comments/comments.js
Page({
  data: {
    currentFeed: null,
    comments: [],
    inputValue: '',
    autoFocus: false,
    currentUser: null
  },

  onLoad(options) {
    const id = parseInt(options.id);
    const app = getApp();
    
    // 获取当前用户信息（确保已登录）
    const currentUser = app.globalData.userInfo || {
      username: '匿名用户',
      avatar: '/images/tab/de.png'
    };
    
    // 从全局获取动态数据
    const feed = (app.globalData.feeds || []).find(item => item.id === id);
    
    // 从全局获取评论数据（优先使用全局数据，没有则用缓存）
    const comments = app.globalData.comments?.[id] || 
                    wx.getStorageSync('comments_' + id) || 
                    [];
    
    this.setData({
      currentFeed: feed || {},
      comments: comments,
      currentUser: currentUser
    });
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  submitComment() {
    const { inputValue, currentFeed, currentUser } = this.data;
    if (!inputValue.trim() || !currentFeed.id) return;
    
    const app = getApp();
    const newComment = {
      id: Date.now(),
      feedId: currentFeed.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      content: inputValue.trim(),
      time: this.formatTime(new Date())
    };
    
    // 更新数据
    const updatedComments = [newComment, ...this.data.comments];
    
    // 更新全局数据
    if (!app.globalData.comments) {
      app.globalData.comments = {};
    }
    app.globalData.comments[currentFeed.id] = updatedComments;
    
    // 更新本地缓存
    try {
      wx.setStorageSync('comments_' + currentFeed.id, updatedComments);
    } catch (e) {
      console.error('存储评论失败:', e);
    }
    
    // 更新页面数据
    this.setData({
      comments: updatedComments,
      inputValue: '',
      autoFocus: true
    });
    
    // 更新原动态的评论数
    this.updateFeedCommentCount(updatedComments.length);
  },

  updateFeedCommentCount(newCount) {
    const app = getApp();
    const feedId = this.data.currentFeed.id;
    
    if (app.globalData.feeds) {
      const updatedFeeds = app.globalData.feeds.map(feed => {
        if (feed.id === feedId) {
          return { ...feed, comments: newCount };
        }
        return feed;
      });
      
      app.globalData.feeds = updatedFeeds;
      
      // 触发父页面更新（如果需要）
      const pages = getCurrentPages();
      if (pages.length > 1) {
        const prevPage = pages[pages.length - 2];
        prevPage.setData({ feeds: updatedFeeds });
      }
    }
  },

  formatTime(date) {
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff/60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)}小时前`;
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }
});