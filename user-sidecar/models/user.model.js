const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  adress: { type: String },
  postCode: { type: String },
  name: { type: String },
  plate: { type: Number },
  unit: { type: Number }
}, { _id: false });

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  phoneNumber: { type: String, required: true },
  email: { type: String },
  fatherName: { type: String },
  password: { type: String },
  pictureProfile: { type: String },
  nationalCode: { type: String },
  birthDate: { type: String },
  adresses: [addressSchema],
  authStatus: { type: Number },        // 0 = just init, 1 = complete profile, 2 = old service
  identityStatus: { type: Number },    // 0 = false, 1 = true, 2 = pending
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
