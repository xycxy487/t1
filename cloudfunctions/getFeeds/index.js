const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const db = cloud.database()
  
  try {
    const res = await db.collection('feeds')
      .orderBy('created_at', 'desc')
      .get()
    
    return {
      code: 0,
      data: res.data,
      message: '获取动态成功'
    }
  } catch (err) {
    return {
      code: -1,
      data: [],
      message: '获取动态失败: ' + err.message
    }
  }
}
