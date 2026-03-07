import mongoose from "mongoose";

interface User {
  name: string;
  email: string;
  password: string;
  profilePicture: string;
  role: "SELLER" | "BUYER";
}

const UserSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters long"],
      select: false, // Exclude password from query results by default
    },
    profilePicture: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["SELLER", "BUYER"],
      required: [true, "Role is required"],
    },
  },
  { timestamps: true }
);

const UserModel =
  mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;