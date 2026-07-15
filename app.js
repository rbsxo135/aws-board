const express = require('express');
const app = express();
const cors = require('cors');

const postsRouter = require('./posts');

app.use(cors({
  origin: 'https://www.gitlab-ktg.kro.kr', // 요청을 보내는 S3 도메인 주소 (마지막 슬래시 / 는 제외)
  credentials: true
}));
app.use(express.json());      // req.body(JSON) 파싱

app.get('/', (req, res) => {
  res.send('API 서버 실행 중!');
});

app.use('/posts', postsRouter);

app.listen(3000, () => console.log('http://localhost:3000'));

