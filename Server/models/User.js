const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: [true, "First name must be supplied"],
  },

  lastname: {
    type: String,
    required: [true, "Last name must be supplied"],
  },

  department: {
    type: String,
    required: [true, "Department must be supplied"],
  },

  username: {
    type: String,
    required: [true, "Username must be supplied"],
  },

  email: {
    type: String,
    required: [true, "Email address must be supplied"],
    unique: true,
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    required: [true, "Role must be supplied"],
    default: "user",
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
