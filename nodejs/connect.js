const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// 数据库连接
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',  
  password: 'Xiaoye1234',
  database: 't1'
});

// 微信小程序配置（需要改成你的）
const APPID = 'wx8e140af680d436d0';
const SECRET = '92e16f1bbccab171df930e027fbafad4';

// 微信登录接口
app.post('/api/login', async (req, res) => {
  const { code, nickname, avatar } = req.body;

  try {
    // 1. 获取openid
    const response = await fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code`);
    const data = await response.json();
    
    if (data.errcode) {
      return res.json({ code: 400, message: '登录失败' });
    }

    const openid = data.openid;

    // 2. 检查用户是否存在
    const [users] = await pool.execute('SELECT * FROM users WHERE openid = ?', [openid]);

    let user;
    if (users.length > 0) {
      // 用户已存在 - 更新用户信息
      await pool.execute(
        'UPDATE users SET nickname = ?, avatar_url = ? WHERE openid = ?',
        [nickname || '微信用户', avatar || '', openid]
      );
      user = users[0];
    } else {
      // 新用户，插入数据库
      const [result] = await pool.execute(
        'INSERT INTO users (openid, nickname, avatar_url) VALUES (?, ?, ?)',
        [openid, nickname || '微信用户', avatar || '']
      );
      // 获取新插入的用户信息
      const [newUsers] = await pool.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
      user = newUsers[0];
    }

    // 3. 插入登录记录（取消注释并修复）
    await pool.execute(
      'INSERT INTO user_login_logs (openid, nickname, avatar_url) VALUES (?, ?, ?)',
      [openid, nickname || '微信用户', avatar || '']
    );

    res.json({ 
      code: 200, 
      message: users.length > 0 ? '登录成功' : '注册成功',
      data: { user: user } 
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.json({ code: 500, message: '服务器错误' });
  }
});

// 1. 获取动态列表 
app.get('/api/feeds', async (req, res) => {
  try {
    const sql = 'SELECT * FROM feeds ORDER BY publish_time DESC';
    const [results] = await pool.execute(sql); 
    
    // 处理时间显示
    const feeds = results.map(feed => ({
      ...feed,
      time: formatTime(feed.publish_time)
    }));
    
    res.json({ code: 0, data: feeds, message: '获取成功' });
  } catch (err) {
    console.error('获取动态失败:', err);
    res.json({ code: -1, data: [], message: err.message });
  }
});

// 2. 获取评论列表 - 改为Promise方式
app.get('/api/comments/:feedId', async (req, res) => {
  try {
    const feedId = req.params.feedId;
    const sql = 'SELECT * FROM comments WHERE feed_id = ? ORDER BY created_at DESC';
    
    const [results] = await pool.execute(sql, [feedId]);
    
    const comments = results.map(comment => ({
      ...comment,
      time: formatTime(comment.created_at)
    }));
    
    res.json({ code: 0, data: comments, message: '获取成功' });
  } catch (err) {
    console.error('获取评论失败:', err);
    res.json({ code: -1, data: [], message: err.message });
  }
});

// 3. 添加评论 - 改为Promise方式并修复db未定义错误
app.post('/api/comments', async (req, res) => {
  try {
    const { feed_id, username, avatar, content } = req.body;
    
    // 插入评论
    const insertSql = 'INSERT INTO comments (feed_id, username, avatar, content) VALUES (?, ?, ?, ?)';
    const [result] = await pool.execute(insertSql, [feed_id, username, avatar, content]);
    
    // 更新动态的评论数 - 修复：使用pool而不是不存在的db
    const updateSql = 'UPDATE feeds SET comments_count = comments_count + 1 WHERE id = ?';
    await pool.execute(updateSql, [feed_id]);
    
    res.json({ code: 0, message: '评论成功', id: result.insertId });
  } catch (err) {
    console.error('添加评论失败:', err);
    res.json({ code: -1, message: err.message });
  }
});

// 时间格式化函数
function formatTime(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = now - time;
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return '刚刚';
  if (hours < 24) return `${hours}小时前`;
  return `${Math.floor(hours / 24)}天前`;
}

// 启动服务器
app.listen(port,() => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
