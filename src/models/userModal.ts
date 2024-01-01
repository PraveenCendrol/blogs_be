import mongoose, { Schema, Model, model, Document } from "mongoose";

import crypto from "crypto";
import validator from "validator";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;

  firstname: string;
  lastname?: string;
  avatar?: string;

  username: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  role?: "admin" | "user";
  //   followers?: string[];
  //   following?: string[];
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpire?: Date;
  active: boolean;
  correctPassword(inputPass: string, dbPass: string): Promise<boolean>;
  changedPasswordAfter(jwtTimeStamp: number): boolean;
  createPasswordResetToken(): string;
}

const userSchema: Schema<IUser> = new Schema<IUser, Model<IUser>>(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },

    username: {
      type: String,
      required: [true, "User name required"],
      unique: true,
    },
    email: {
      type: String,
      require: [true, "Email is required"],
      unique: true,
      validate: [validator.isEmail, "A valid email is required"],
    },
    password: {
      type: String,
      required: [true, "Provide a Password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Provide a Password confirmation"],
      validate: {
        validator: function (this: IUser, el: string) {
          return el === this.password;
        },
        message: "Password and Password confirm should match",
      },
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpire: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    //   followers: [
    //     {
    //       type: mongoose.Types.ObjectId,
    //     },
    //   ],
    //   following: [
    //     {
    //       type: mongoose.Types.ObjectId,
    //     },
    //   ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre<IUser>("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

userSchema.pre<Model<IUser>>(/^find/, function () {
  this.find({ active: { $ne: false } });
});

userSchema.methods.correctPassword = async function (
  inputPass: string,
  dbPass: string
): Promise<boolean> {
  return await bcrypt.compare(inputPass, dbPass);
};

userSchema.methods.changedPasswordAfter = function (
  jwtTimeStamp: number
): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000
    );
    return jwtTimeStamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpire = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

const User: Model<IUser> = model<IUser>("User", userSchema);

export default User;
