const  { Schema, model } = require("mongoose");

const photographerSchema = new Schema(
  {
    profilePicUrl: {
      type: String,
      trim: true,
      default: "https://res.cloudinary.com/santic/image/upload/v1592769503/mi-mascota/profile-pics/defaultPic_on0abf.png"
    },
    firstName: {
      type: String,
      trim: true,
      required: [true, "Name is required."],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      match: [/^\S+@\S+\.\S+$/, "Invalid email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    // googleID: String,
    // add password property here
    passwordHash: {
      type: String,
      required: [true, "Password is required."],
    },
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    portfolio: [{type: String}],
    skills: [{type: String}],
    verified: {
      type: Boolean
    },
    location: [{type: String}],
    country: {
      type: String
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = model("Photographer", photographerSchema);