//The purpose of this middleware is to verify a JSON Web Token (JWT) from either a cookie or the Authorization header.
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from " .. /utils/asyncHandler";
import { User } from "../models/user.models";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  //HTTP headers are additional pieces of information sent along with every HTTP request or response.
  if (!token) {
    throw new ApiError(401, "Unauthorized Request");
    //return res.status(401).json({ message: "Unauthorized Request" });
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // This is usually an object containing the data that was encoded when the token was created—such as the user's ID
  //if the token is valid, jwt.verify returns the decoded payload of the token.
  //   //{
  //   id: "123",
  //   name: "Alice",
  //   iat: 1680000000, // issued at timestamp
  //   exp: 1680003600  // expiration timestamp
  // }

  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Unauthorized Request");
  }
  req.user = user;
  next();
});
