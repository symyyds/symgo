const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'message_board',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试数据库连接
pool.getConnection()
  .then(connection => {
    console.log('MySQL数据库连接成功');
    connection.release();
  })
  .catch(err => {
    console.error('MySQL数据库连接失败:', err);
  });

// API路由
// 获取所有留言
app.get('/api/messages', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // 获取总记录数
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM messages');
    const total = countResult[0].total;

    // 获取分页数据
    const [messages] = await pool.query(
      'SELECT * FROM messages ORDER BY timestamp DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    res.json({
      messages,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('获取留言失败:', error);
    res.status(500).json({ error: '获取留言失败' });
  }
});

// 发布新留言
app.post('/api/messages', async (req, res) => {
  try {
    const { nickname, content } = req.body;
    if (!content) {
      return res.status(400).json({ error: '留言内容不能为空' });
    }

    const [result] = await pool.query(
      'INSERT INTO messages (nickname, content) VALUES (?, ?)',
      [nickname || '匿名用户', content]
    );

    const [newMessage] = await pool.query(
      'SELECT * FROM messages WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newMessage[0]);
  } catch (error) {
    console.error('发布留言失败:', error);
    res.status(500).json({ error: '发布留言失败' });
  }
});

// 删除留言（需要管理员权限）
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const adminPassword = req.headers['admin-password'];
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: '未授权的操作' });
    }

    const [result] = await pool.query(
      'DELETE FROM messages WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '留言不存在' });
    }

    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除留言失败:', error);
    res.status(500).json({ error: '删除留言失败' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
}); 