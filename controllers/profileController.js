const Profile = require("../models/ProfileSchema");
const Users = require("../models/UserSchema");
const multer = require("multer");
const fs = require("fs");
// const upload=multer({dest:"../front_end_repo/public/photo"})

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../front_end_repo/public/photo");
  },
  filename: async (req, file, cb) => {
    const user = await Users.findOne({ userName: req.user });
    const extension = file.mimetype.split("/")[1];
    cb(null, `user-${user._id}-${Date.now()}.${extension}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("error", false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
const uploadUserPhoto = upload.single("photo");

const createProfile = async (req, res) => {
  const cookies = req.cookies;
  const refreshToken = cookies.jwtCookie;
  const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();
  try {
    result = await Profile.create({
      ...req.body,
      profileOwnerId: foundUser._id,
      profileOwnerAlias: foundUser.userName,
      profilePhoto: "/default.png",
    });
    res.status(201).json(result);
  } catch (err) {
    console.error("ln 15 profileCtrl" + err);
  }
};

const getProfile = async (req, res) => {
  const cookies = req.cookies;
  const refreshToken = cookies.jwtCookie;
  try {
    const foundUser = await Users.findOne({refreshToken: refreshToken}).exec();
    const id = foundUser._id
    const foundProfile = await Profile.findOne({ profileOwnerId: id });
    res.json(foundProfile);
  } catch (err) {
    console.error("ln 28 profileCnt" + err);
    res.status(69);
  }
};
const getForeignProfile = async (req, res) => {
  console.log(req.params.id);
  try {
    const foreignProfile = await Profile.findOne({
      profileOwnerId: req.params.id,
    });
    console.log(foreignProfile);
    // const result ={...foreignProfile,screenName:user['userName']}
    // console.log(result)
    res.status(200).json(foreignProfile);
  } catch (err) {
    console.error("ln 41 profileCnt" + err);
  }
};

const updateProfile = async (req, res) => {
  const cookies = req.cookies;
  const refreshToken = cookies.jwtCookie;
  try {
    const foundUser = await Users.findOne({
      refreshToken: refreshToken,
    }).exec();
    const id = foundUser._id;
    const foundUserProfile = await Profile.findOne({ profileOwnerId: id });
    console.log(foundUserProfile)
    if (foundUserProfile.profilePhoto && req.file) {
      fs.unlink(
        "../front_end_repo/public/photo/" + foundUserProfile.profilePhoto,
        (err) => {
          console.error(err);
        }
      );
    }

    const updateObject = { ...req.body, profilePhoto: req?.file?.filename };
    await Profile.updateOne({ profileOwnerId: id }, updateObject);
    const result = await Profile.findOne({ profileOwnerId: id });
    res.json(result);
  } catch (err) {
    console.error("ln 56 profileCnt" + err);
    res.status(409);
  }
};

const deleteProfile = async (req, res) => {
  const cookies = req.cookies;
  const refreshToken = cookies.jwtCookie;
  try {
    const foundUser = await Users.findOne({
      refreshToken: refreshToken,
    }).exec();
    const id = foundUser._id;
    const result = await Profile.deleteOne({ profileOwnerId: id });
    res.json(result);
  } catch (err) {
    console.error("ln 82 profileCnt" + err);
    res.status(409);
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  getForeignProfile,
  deleteProfile,
  uploadUserPhoto,
};
