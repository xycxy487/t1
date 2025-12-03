const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
  const db = cloud.database()
  const { feedId, username, avatar, content } = event
  
  try {
    // 添加评论
    const commentRes = await db.collection('comments').add({
      data: {
        feed_id: parseInt(feedId),
        username: username,
        avatar: avatar,
        content: content,
        created_at: new Date()
      }
    })
    
    // 更新动态的评论数
    await db.collection('feeds').doc(feedId.toString()).update({
      data: {
        comments_count: db.command.inc(1)
      }
    })
    
    return {
      code: 0,
      data: commentRes._id,
      message: '评论添加成功'
    }
  } catch (err) {
    return {
      code: -1,
      data: null,
      message: '评论添加失败: ' + err.message
    }
  }
}
