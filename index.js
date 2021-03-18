const express = require('express');
const app = express();
const port = 3000;
const { User } = require('./models/User');
const config = require('./config/key');
// const bodyParser = require('body-parser');

//application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
// app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log('MongoDB Disconnected...'+err));

  

app.get('/', (req, res) => {
  res.send('Hello World! sex -^')
})

app.post('/register', (req, res) => {

  // 회원가입 할때 필요한 정보들을 clien에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



