const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type : String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
})

userSchema.pre('save', function(next){
  var user = this;
  if(user.isModified('password')){

    //비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function(err, salt){
      if(err) return next(err);
  
      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err);
        console.log('%cUser.js line:46 user.password', 'color: #007acc;', user.password);
        user.password = hash;
        console.log('%cUser.js line:46 user.password', 'color: #007acc;', user.password);
        next();
      })
    })
  }else{
    next();
  }
  
})


// const comparePassword = function()
userSchema.methods.comparePassword = function(plainPassword, cb){
  //plainPassword : 5332222  db에 있는 암호화된 비밀번호 : $2b$10$PFx25MQuL5M7WhgNtiNdOu4rHUS3my6Eqg8OzQz5B/EM51JpSlJDS 
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  })
}

userSchema.methods.genToken = function(cb) {
  var user = this;
  //jsonwebtoken을 이용해서 토큰을 생성하기
  var token = jwt.sign(user._id.toHexString(), 'secretToken');
  console.log('%cUser.js line:70 user._id', 'color: #007acc;', user._id);
  console.log('%cUser.js line:71 user._id.toHexString()', 'color: #007acc;', user._id.toHexString());
  console.log('%cUser.js line:72 user._id.toJSON()', 'color: #007acc;', user._id.toJSON());   
  console.log('%cUser.js line:73 user._id==user._id.toHexString()', 'color: #007acc;', user._id==user._id.toHexString());
  console.log('%cUser.js line:74 typeof(user._id)', 'color: #007acc;', typeof(user._id));
  console.log('%cUser.js line:75 typeof(user._id.toHexString())', 'color: #007acc;', typeof(user._id.toHexString()));
  console.log('%cUser.js line:75 typeof(user._id.toJSON())', 'color: #007acc;', typeof(user._id.toJSON()));

  //user._id + 'secretToken = token
  //나중에 'secretToken' -> user._id
  user.token = token;
  user.save(function(err, user) {
    if(err) return cb(err);
    cb(null, user);
  })
}

userSchema.statics.findByToken = function(token, cb){
  var user = this;

  //토큰을 복호화 한다.
  jwt.verify(token, 'secretToken', function(err, decoded){
    //유저 아이디를 이용해서 유저를 찾은 후 클라이언트에서 가져온 토큰과 데이터베이스의 토큰이 일치하는지 확인
    user.findOne({"_id": decoded, "token": token}, function(err, user){
      if(err) return cb(err);
      cb(null, user);
    })
  })
}

const User = mongoose.model('User',userSchema);

module.exports = { User }
