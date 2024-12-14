import mongoose from "mongoose";
import bcrypt from "bcrypt";
const getProfileImage = () => {
  const style = ["croodles", "big-ears", "notionists", "bottts", "open-peeps"];
  const random_style = Math.floor(Math.random() * style.length);
  let seed = [
    "Garfield",
    "Tinkerbell",
    "Annie",
    "Loki",
    "Cleo",
    "Angel",
    "Bob",
    "Mia",
    "Coco",
    "Gracie",
    "Bear",
    "Bella",
    "Abby",
    "Harley",
    "Cali",
    "Leo",
    "Luna",
    "Jack",
    "Felix",
    "Kiki",
  ];
  const random_seed = Math.floor(Math.random() * seed.length);
  return `https://api.dicebear.com/9.x/${style[random_style]}/svg?seed=${seed[random_seed]}`;
};

const userSchema = new mongoose.Schema(
  {
    personal_info: {
      fullname: {
        type: String,
        required: true,
        lowercase: true,
        minlength: [3, "fullname must be 3 letters long"],
      },
      email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
      },
      password: { type: String, select: false },
      bio: {
        type: String,
        maxlength: [200, "Bio should not be more than 200"],
        default: "",
      },
      profile_image: {
        type: String,
        default: () => getProfileImage(),
      },
    },
    social_links: {
      youtube: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      github: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },
    account_info: {
      total_posts: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
    },
    google_auth: {
      type: Boolean,
      default: false,
    },
    blogs: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "blogs",
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("personal_info.password")) return next();
  this.personal_info.password = await bcrypt.hash(
    this.personal_info.password,
    8
  );
  next();
});

userSchema.methods.Checkpassword = async function (password, hashpassword) {
  return await bcrypt.compare(password, hashpassword);
};

export const userModel =
  mongoose.models.users || mongoose.model("users", userSchema);
