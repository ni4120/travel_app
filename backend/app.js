require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const port = 3001;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect();

// サーバーコード
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// セッションの設定
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // 開発中はfalse、本番環境ではtrueに設定する
}));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'public/uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.get('/api/spots', (req, res) => {
  connection.query('SELECT * FROM spots', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.post('/api/post', upload.array('images', 10), (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Not logged in' });
  }
  const { spotName, recommendedPoint, recommendedFood, comment, latitude, longitude } = req.body;
  const images = req.files.map(file => file.path.replace('public', ''));
  const post = { user_id: req.session.userId, spotName, recommendedPoint, recommendedFood, comment, latitude, longitude, images: JSON.stringify(images) };

  connection.query('INSERT INTO spots SET ?', post, (error, results) => {
    if (error) throw error;
    res.json({ success: true });
  });
});

app.delete('/api/spots/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM spots WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error("Error during deletion:", error);
      res.status(500).send('Server Error');
      return;
    }
    res.json({ success: true });
  });
});


// ユーザー登録
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (error, results) => {
    if (error) throw error;
    res.json({ success: true });
  });
});

// ユーザーログイン
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  connection.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.userId = user.id;
        res.json({ success: true });
      } else {
        res.json({ success: false, message: 'Incorrect password' });
      }
    } else {
      res.json({ success: false, message: 'User not found' });
    }
  });
});

app.post('/api/post', upload.array('images', 10), (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Not logged in' });
  }
  const { spotName, recommendedPoint, recommendedFood, comment, latitude, longitude } = req.body;
  const images = req.files.map(file => file.path.replace('public', ''));
  const post = { user_id: req.session.userId, spotName, recommendedPoint, recommendedFood, comment, latitude, longitude, images: JSON.stringify(images) };

  connection.query('INSERT INTO spots SET ?', post, (error, results) => {
    if (error) throw error;
    res.json({ success: true });
  });
});


app.get('/api/user-spots/:userId', (req, res) => {
  const { userId } = req.params;
  connection.query('SELECT * FROM spots WHERE user_id = ?', [userId], (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});


// 全ユーザー取得
app.get('/api/users', (req, res) => {
  connection.query('SELECT id, username FROM users', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});


app.get('/api/my-spots', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Not logged in' });
  }
  connection.query('SELECT * FROM spots WHERE user_id = ?', [req.session.userId], (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.get('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('セッション破棄エラー', err);
      return res.status(500).send('ログアウトに失敗しました');
    }
    res.json({ success: true });
  });
});


app.get('/api/check-auth', (req, res) => {
  if (req.session.userId) {
    res.json({ isLoggedIn: true });
  } else {
    res.json({ isLoggedIn: false });
  }
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
