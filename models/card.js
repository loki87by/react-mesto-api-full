// **импорт
const mongoose = require('mongoose');
const validator = require('validator');

// **схема
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: [true, 'Введите ссылку в формате http(s)://'],
    validate: {
      validator(str) {
        return validator.isURL(str);
      },
      // eslint-disable-next-line arrow-body-style
      message: (props) => {
        return `Ссылка ${props.str} введена не верно`;
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// **экспорт
module.exports = mongoose.model('card', cardSchema);
