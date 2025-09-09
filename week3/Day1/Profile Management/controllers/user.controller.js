const User = require("../models/user.model");

exports.addUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};


exports.addProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { profileName, url } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profiles.push({ profileName, url });
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};


exports.getUsers = async (req, res, next) => {
  try {
    const { profile } = req.query;
    let users;

    if (profile) {
      users = await User.find({ "profiles.profileName": profile });
    } else {
      users = await User.find();
    }

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};


exports.search = async (req, res, next) => {
  try {
    const { name, profile } = req.query;
    const user = await User.findOne({ name });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (profile) {
      const foundProfile = user.profiles.find((p) => p.profileName === profile);
      if (foundProfile) return res.status(200).json(foundProfile);
      return res.status(200).json({ message: "User found, but profile not found", user });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};


exports.updateProfile = async (req, res, next) => {
  try {
    const { userId, profileName } = req.params;
    const { url } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = user.profiles.find((p) => p.profileName === profileName);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.url = url;
    await user.save();
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};


exports.deleteProfile = async (req, res, next) => {
  try {
    const { userId, profileName } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profiles = user.profiles.filter((p) => p.profileName !== profileName);
    await user.save();
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (err) {
    next(err);
  }
};
