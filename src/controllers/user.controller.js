import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

export { registerUser };
