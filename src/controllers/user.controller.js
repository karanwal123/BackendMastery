import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
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

  if (fullName === "") {
    //only for testing purpose on backend
    throw new ApiError(400, "Full name is required");
  }

  //     //if (fullName === "") {
  //   return res.status(400).json({ error: "Full name is required" });
  // }
});

export { registerUser };
