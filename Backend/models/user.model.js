import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Student", "Recruiter"],
      required: true,
    },
    profile: {
      bio: {
        type: String,
      },
      skills: [
        {
          type: String,
        },
      ],
      resume: {
        type: String,
      },
      resumeOriginalname: {
        type: String,
      },
      Company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
      ProfilePhoto: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

export  const User = mongoose.model("User", userSchema);
