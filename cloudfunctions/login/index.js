const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    
    // 返回标准格式，包含 success 字段
    return {
      success: true,  // 添加这个关键字段
      action: "mobile_login",
      userInfo: {
        username: '',
        avatar: '',
      },
      timestamp: Date.now(),
      message: '登录成功'
    }
    
  } catch (error) {
    console.error('登录错误:', error)
    return {
      success: false,
      message: error.message
    }
  }
}