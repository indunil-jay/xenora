import mongoose from "mongoose";
import validator from "validator";

interface IUser {
  name: string;
  email: string;
  role: string;
  photo: string;
  password: string;
  passwordConfirm: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, "Username is required."],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Email is required."],
    validate: [validator.isEmail, "Please provide a valid email."],
  },
  role: {
    type: String,
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: [8, "Password must contain at least 8 characters."],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Password confirm is required."],
    minlength: [8, "Password confirm must contain at least 8 characters."],
  },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
