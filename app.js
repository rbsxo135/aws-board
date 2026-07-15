const express = require('express');
const app = express();
const cors = require('cors');

const postsRouter = require('./posts');

app.use(cors());              // 프론트 요청 허용
app.use(express.json());      // req.body(JSON) 파싱

app.get('/', (req, res) => {
  res.send('API 서버 실행 중!');
});

app.use('/posts', postsRouter);

app.listen(3000, () => console.log('http://localhost:3000'));

