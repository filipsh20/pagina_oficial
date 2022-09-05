const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const { Schema } = mongoose;

const userSchema = new Schema({
        username: { type: String, unique: true, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        verification: { type: Boolean, default: false, required: true }
});

userSchema.methods.encryptPass = (password) => {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

userSchema.methods.comparePass = function (password) {
        return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('users', userSchema);