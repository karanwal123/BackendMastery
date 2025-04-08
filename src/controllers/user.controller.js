import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  console.log("registerUser");

  // 1. Get user details from the request body
  const { fullName, email, username, password } = req.body;
  console.log("email:", email);

  // 2. Validate that all required fields are provided
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // 3. Check if a user with the same username or email already exists
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with same email or username already exists");
  }
  console.log(req.files);

  // 4. Get file paths for avatar and cover image (if provided)
  const avatarLocalPath =
    req?.files?.avatar && req.files.avatar.length > 0
      ? req.files.avatar[0].path
      : null;
  const coverImageLocalPath =
    req?.files?.coverImage && req.files.coverImage.length > 0
      ? req.files.coverImage[0].path
      : null;

  // 5. Check that at least one image is uploaded
  if (!avatarLocalPath && !coverImageLocalPath) {
    throw new ApiError(400, "Please upload avatar or cover image");
  }

  // 6. Upload images to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Please upload avatar..it is REQUIRED");
  }

  // 7. Create user in the database
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    username: username.toLowerCase(),
    password,
  });

  // 8. Retrieve the created user, excluding sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Error creating user");
  }

  // 9. Return success response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //first we can ask the user if they already have an account or not
  //to check : validate username/email :: acc credentials
  //if not already -> throw them to register page
  //if they are -> ask for credentials -> username and password
  const { email, username, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "atleast type in username or email");
  }
  //check again
  //now we will learn mongo  db operators
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "user does not exist");
  }
  // userSchema.methods.comparePassword = async function (password) {
  //   return await bcrypt.compare(password, this.password);
  // };
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
    // This part tells Mongoose to exclude the password and refreshToken fields from the result. The minus sign (-) indicates that these fields should be omitted.
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
