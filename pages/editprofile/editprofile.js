// pages/editprofile/editprofile.js
Page({
  data: {
    avatarUrl: '',
    username: '',
    bio: ''
  },

  onLoad: function(options) {
    // 从全局或缓存获取当前用户数据
    const app = getApp()
    this.setData({
      avatarUrl: app.globalData.userInfo.avatar || '',
      username: app.globalData.userInfo.username || '',
      bio: app.globalData.userInfo.bio || ''
    })
  },

  chooseAvatar: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          avatarUrl: res.tempFilePaths[0]
        })
        // 这里可以添加上传到服务器的逻辑
      }
    })
  },

  onUsernameInput: function(e) {
    this.setData({
      username: e.detail.value
    })
  },

  onBioInput: function(e) {
    this.setData({
      bio: e.detail.value
    })
  },

  saveProfile: function() {
    const { avatarUrl, username, bio } = this.data
    
    if (!username.trim()) {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none'
      })
      return
    }

    // 更新全局数据
    const app = getApp()
    app.globalData.userInfo = {
      ...app.globalData.userInfo,
      avatar: avatarUrl,
      username: username,
      bio: bio
    }

    // 这里应该添加保存到服务器的逻辑
    
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    })
    
    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  }
})
