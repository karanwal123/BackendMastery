import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  console.log("registerUser");
  res.status(200).json({ message: "User registered successfully" });

  //   1. get user details from FRONTEND → (username,password,fullname,email)
  // 2. validation → (check if the email entered by user ..is real or fake) (fields are not empty)
  // 3. check if user already exists
  // 4. check for images → check for AVATAR
  // 5. upload them to Cloudinary
  // 6. create user object → create entry in db
  // 7. remove password and refresh token field from response
  // 8. check for user creation
  // 9. return response

  const { fullName, email, username, password } = req.body;
  console.log("email :", email);
  //The .trim() method removes leading and trailing spaces from a string.

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //     //if (fullName === "") {
  //   return res.status(400).json({ error: "Full name is required" });
  // }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  //.findOne() is a Mongoose query method that returns one document that matches the criteria.
  //$or is a MongoDB operator that finds at least one matching condition.

  if (existedUser) {
    throw new ApiError(409, "User with same email or username already exists");
  }

  const avatarLocalPath = req?.files?.avatar[0]?.path;
  //currently stored on SERVER ..not on cloudinary
  //req.files is an object containing uploaded files.

  const coverImageLocalPath = req?.files?.coverImage[0]?.path;

  if (!avatarLocalPath && !coverImageLocalPath) {
    throw new ApiError(400, "Please upload avatar or cover image");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Please upload avatar..it is REQUIRED");
  }
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    username: username.toLowerCase(),
    password,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //"-password -refreshToken" excludes the password and refreshToken fields from the result.

  if(!createdUser) {
    throw new ApiError(500, "Error creating user");//(Internal Server Error)
  }
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User created successfully")
  );
});

export { registerUser };
