const mongoose = require('mongoose');
const { isEmail, isLowercase } = require('validator');

const bcrypt = require('bcryptjs');

const bossSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, '이메일을 입력해주세요'],
    unique: true,
    lowercase: true,
    validate: [isEmail, '올바른 이메일 형식이 아닙니다.'],
  },
  password: {
    type: String,
    required: [true, '비밀번호를 입력해주세요.'],
  },
  address: { type: String },
  name: { type: String, required: true },
  isFirstLogin: { type: Boolean, default: true }, // 첫 로그인 여부 필드
});

bossSchema.statics.signUp = async function (email, password, address, name) {
  const salt = await bcrypt.genSalt();
  console.log(salt);
  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    const boss = await this.create({
      email,
      password: hashedPassword,
      address,
      name,
    });
    return { _id: boss._id, email: boss.email };
  } catch (err) {
    throw err;
  }
};

bossSchema.static.login = async function (email, pasword) {
  const boss = await this.findOne({ email });
  if (boss) {
    const auth = await bcrypt.compare(password, boss.password);
    if (auth) {
      return boss.visibleBoss;
    }
    throw Error('정확하지 않은 비밀번호입니다.');
  }
  throw Error('정확하지 않은 이메일입니다.');
};

const visibleBoss = bossSchema.virtual('visibleBoss');
visibleBoss.get(function (value, virtual, doc) {
  return {
    _id: doc._id,
    email: doc.email,
  };
});

const Boss = mongoose.model('boss', bossSchema);
module.exports = Boss;
