import mongoose, { Model } from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";

interface IUser {
  name: string;
  email: string;
  role: "user" | "admin";
  photo: string;
  password: string;
  passwordConfirm: string | undefined;
}

interface IUserMethods {
  correctPassword(inputPassword: string, dbPassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  name: {
    type: String,
    required: [true, "username is required."],
    trim: true,
    validate: {
      validator: function (val: string) {
        return /^[A-Za-z\s]+$/.test(val);
      },
      message:
        "the username must consist of only alphabetic characters (A-Z) and spaces.",
    },
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "email address is required."],
    validate: [validator.isEmail, "please provide a valid email address."],
  },
  role: {
    type: String,
    default: "user",
    enum: {
      values: ["user", "admin"],
      message: "role must be either 'user' or 'admin'.",
    },
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "password is required."],
    minlength: [8, "password must be at least 8 characters long."],
    select: false,
  },
  passwordConfirm: {
    type: String,
    select: false,
    required: [true, "password confirmation is required."],
    minlength: [8, "password confirmation must be at least 8 characters long."],
    validate: {
      validator: function (val: string) {
        return val === this.password;
      },
      message: "password and password confirmation do not match.",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  inputPassword: string,
  dbPassword: string
) {
  return await bcryptjs.compare(inputPassword, dbPassword);
};

const User = mongoose.model<IUser, UserModel>("User", userSchema);
export default User;
