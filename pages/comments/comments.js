// pages/comments/comments.js
Page({
  data: {
    feedId: null,
    comments: [],
    commentContent: '',
    currentFeed: null
  },
  
  onLoad: function(options) {
    console.log('评论页面参数:', options);
    const feedId = options.feedId;
    
    if (!feedId) {
      wx.showToast({
        title: '动态不存在',
        icon: 'none'
      });
      wx.navigateBack();
      return;
    }
    
    this.setData({ feedId: feedId });
    this.loadComments(feedId);
    this.loadFeedInfo(feedId);
  },
  
  // 加载评论列表
  loadComments: function(feedId) {
    const app = getApp();
    wx.showLoading({
      title: '加载评论...',
    });
    
    app.getCommentsFromDB(feedId).then(comments => {
      this.setData({ 
        comments: comments || []
      });
      wx.hideLoading();
      console.log('评论数据:', comments);
    }).catch(err => {
      console.error('加载评论失败:', err);
      wx.hideLoading();
      this.setData({ comments: [] });
    });
  },
  
  // 加载动态信息
  loadFeedInfo: function(feedId) {
    const app = getApp();
    const feeds = app.globalData.feeds || [];
    const currentFeed = feeds.find(feed => feed.id == feedId);
    
    if (currentFeed) {
      this.setData({ currentFeed: currentFeed });
    }
  },
  
  // 输入评论内容
  onCommentInput: function(e) {
    this.setData({
      commentContent: e.detail.value
    });
  },
  
  // 提交评论
  submitComment: function() {
    const content = this.data.commentContent.trim();
    if (!content) {
      wx.showToast({
        title: '请输入评论内容',
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
    
    // 调用添加评论API
    app.addCommentToDB(this.data.feedId, content).then(() => {
      this.setData({ commentContent: '' });
      this.loadComments(this.data.feedId); // 重新加载评论
      wx.hideLoading();
      wx.showToast({
        title: '评论成功',
        icon: 'success'
      });
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '评论失败',
        icon: 'none'
      });
    });
  },
  
  // 返回上一页
  goBack: function() {
    wx.navigateBack();
  }
});
