import UserSchema from "../models/UserSchema.js";
import LoginDetailsSchema from "../models/LoginDetails.js";
import moment from "moment";
// login verification
export const getUser = async (req, res) => {
  console.log(req.body);
  const userName = req.body.userName;
  const password = req.body.password;

  UserSchema.findOne({ email: userName }, (error, user) => {
    if (!user) {
      return res.status(409).json({ message: "Auth failed, E-mail not found" });
      //   {
      //   loginSuccess: false,
      //   message: "Auth failed, E-mail not found",
      // }
      // );
    }
    if (user.password === password) {
      console.log(user);
      return res.status(201).json({ loginSuccess: true, userId: user.user_id });
    } else {
      return res.status(409).json({ message: "Worng Password" });
    }
  });
};

// all user
export const getUserList = async (req, res) => {
  console.log(req.body);

  const userId = req.body.userId;

  let userData = await UserSchema.aggregate([
    {
      $match: {
        $expr: {
          $ne: ["$user_id", userId],
        },
      },
    },
    {
      $project: {
        name: 1,
        user_id: 1,
        _id: 0,
      },
    },
  ]);

  console.log("reached", userData);
  if (userData) {
    return res.status(201).send({ userList: userData });
  } else {
    return res.status(409).json({ message: "Data Not Found" });
  }
};

//get profile
export const getProfile = async (req, res) => {
  const user_id = req.body.user_id;

  let user_data = await UserSchema.aggregate([
    {
      $match: {
        user_id: user_id,
      },
    },
  ]);

  if (user_data) {
    return res.status(201).send(user_data);
  } else {
    return res.status(409).json({ message: "User Not Found" });
  }
};

//update prfile
export const updateProfile = async (req, res) => {
  const profileDetails = req.body.profileDetails;

  console.log(profileDetails);
  const updatedData = await UserSchema.updateOne(
    {
      user_id: profileDetails.user_id,
    },
    {
      email: profileDetails.email,
      country: profileDetails.country,
      state: profileDetails.state,
      name: profileDetails.name,
      mobile: profileDetails.mobile,
      address: profileDetails.address,
    }
  );

  if (updatedData) {
    return res.status(201).send(updatedData);
  } else {
    return res.status(409).json({ message: "User Not Found" });
  }
};
//update usersFriendList
export const updateFriendList = async (req, res) => {
  const userId = req.body.userId;
  const friendId = req.body.friendId;
  const friendName = req.body.friendName;

  const updateFriend = UserSchema.findOneAndUpdate(
    {
      user_id: userId,
    },
    {
      $push: {
        friendsList: { friendId: friendId, friendName: friendName },
      },
    },
    (error, doc) => {
      if (error) {
        return res.status(409).json({ message: error.message });
      } else {
        return res.status(201).json(doc);
      }
    }
  );
};

// all user
export const getFriendsList = async (req, res) => {
    console.log(req.body);

    const userId = req.body.userId;

    let userData = await UserSchema.aggregate([
      {
        $match: {
          $expr: {
            $eq: ["$user_id", userId],
          },
        },
      },
      {
        $project: {
          friendsList:1,
          _id: 0,
        },
      },
    ]);

    if (userData) {
      return res.status(201).send({ userData });
    } else {
      return res.status(409).json({ message: "Data Not Found" });
    }
  };

// New SignUp

export const insertUser = async (req, res) => {
  console.log("req=>", req.body);
  const post = req.body;

  const newPost = new UserSchema(post);

  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

//Log information insert
export const insertLog = async (req, res) => {
  const post = req.body;

  const newPost = new LoginDetailsSchema(post);

  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateLog = async (req, res) => {
  const condition = { log_info_id: req.body.log_info_id };
  const logout_date = req.body.logout_date;

  const updateData = LoginDetailsSchema.findOneAndUpdate(
    condition,
    {
      logout_date: logout_date,
    },
    {
      new: true,
    },
    (error, doc) => {
      if (error) {
        return res.status(409).json({ message: error.message });
      } else {
        return res.status(201).json(doc);
      }
    }
  );
};

export const getLog = async (req, res) => {
  const log_info_id = req.body.log_info_id;
  const user_id = req.body.user_id;
  const startOfDay = moment().startOf("day").unix();
  const endOfDay = moment().endOf("day").unix();
  const weekStart = moment().startOf("week").unix();
  const weekEnd = moment().endOf("week").unix();
  const monthStart = moment().startOf("month").unix();

  const monthEnd = moment().endOf("month").unix();
  console.log(startOfDay, "2");

  let daily = await LoginDetailsSchema.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$user_id", user_id] },
            { $gt: ["$login_date", startOfDay] },
            { $lt: ["$logout_date", endOfDay] },
          ],
        },
      },
    },
    {
      $project: {
        log_info_id: 1,
        user_id: 1,
        login_date: 1,
        logout_date: 1,
        _id: 0,
      },
    },
    {
      $group: {
        _id: "$user_id",
        login_date: { $addToSet: "$login_date" },
        logout_date: { $addToSet: "$logout_date" },
        daily_count: { $sum: 1 },
        daily_log: { $first: true },
      },
    },
  ]);
  let weekly = await LoginDetailsSchema.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$user_id", user_id] },
            { $gt: ["$login_date", weekStart] },
            { $lt: ["$logout_date", weekEnd] },
          ],
        },
      },
    },
    {
      $project: {
        log_info_id: 1,
        user_id: 1,
        login_date: 1,
        logout_date: 1,
        _id: 0,
      },
    },
    {
      $group: {
        _id: "$user_id",
        login_date: { $addToSet: "$login_date" },
        logout_date: { $addToSet: "$logout_date" },
        weekly_log: { $first: true },
        week_count: { $sum: 1 },
      },
    },
  ]);
  let monthly = await LoginDetailsSchema.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$user_id", user_id] },
            { $gt: ["$login_date", monthStart] },
            { $lt: ["$logout_date", monthEnd] },
          ],
        },
      },
    },
    {
      $project: {
        log_info_id: 1,
        user_id: 1,
        login_date: 1,
        logout_date: 1,
        _id: 0,
      },
    },
    {
      $group: {
        _id: "$user_id",
        login_date: { $addToSet: "$login_date" },
        logout_date: { $addToSet: "$logout_date" },
        weekly_log: { $first: true },
        week_count: { $sum: 1 },
      },
    },
  ]);

  if (daily) {
    console.log("=>", weekStart, weekEnd);
    return res.status(201).send({ daily, weekly, monthly });
  } else {
    return res.status(409).json({ message: "Log Not Found" });
  }
};

export const emailCheck = async (req, res) => {
  const email = req.body.email;

  let user_data = await UserSchema.aggregate([
    {
      $match: {
        email: { $eq: email },
      },
    },
  ]);
  if (user_data.length>0) {
    return res.status(201).send(user_data);
  } else {
    return res.status(409).json({ message: "User Not Found" });
  }
};
