const mongoose = require('mongoose');
const { isEmail, isLowerCase } = require('validator');
const bcrypt = require('bcryptjs');

const guestSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, '이메일을 입력해주세요'],
    unique: true,
    lowercase: true,
    validate: [isEmail, '올바른 이메일 형식이 아닙니다'],
  },
  password: {
    type: String,
    required: [true, '비밀번호가 입력되어야 합니다.'],
  },
  nickname: { type: String },
  name: { type: String, required: true },
});

guestSchema.statics.signUp = async function (email, password, nickname, name) {
  const salt = await bcrypt.genSalt();
  console.log(salt);
  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    const guest = await this.create({
      email,
      password: hashedPassword,
      nickname,
      name,
    });
    return { _id: guest._id, email: guest.email };
  } catch (err) {
    throw err;
  }
};

guestSchema.statics.login = async function (email, password) {
  const guest = await this.findOne({ email });
  if (guest) {
    const auth = await bcrypt.compare(password, guest.password);
    if (auth) {
      return guest.visibleGuest;
    }
    throw Error('정확하지 않은 비밀번호입니다.');
  }
  throw Error('정확하지 않은 이메일입니다.');
};

const visibleGuest = guestSchema.virtual('visibleGuest');
visibleGuest.get(function (value, virtual, doc) {
  return {
    _id: doc.id,
    email: doc.email,
  };
});

const Guest = mongoose.model('guest', guestSchema);
module.exports = Guest;
