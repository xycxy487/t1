const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
  const db = cloud.database()
  const { feedId } = event
  
  try {
    const res = await db.collection('comments')
      .where({ feed_id: parseInt(feedId) })
      .orderBy('created_at', 'desc')
      .get()
    
    return {
      code: 0,
      data: res.data,
      message: '获取评论成功'
    }
  } catch (err) {
    return {
      code: -1,
      data: [],
      message: '获取评论失败: ' + err.message
    }
  }
}
