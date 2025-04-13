import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { loginUser } from "../controllers/user.controller.js";
import { logoutUser } from "../controllers/user.controller.js";
import { refreshAccessToken } from "../controllers/user.controller.js";
const router = Router();

//An HTTP POST request is used to send data to a server to create or update a resource

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  //After processing the file uploads, the request is passed to the registerUser function.
  registerUser
);
//upload.fields([...]) middleware
//This middleware is  provided by a library such as Multer, which is commonly used in Node.js applications to handle file uploads.

router.route("/login").post(verifyJWT, loginUser);
//thats why we gave next() in verifyJWT..cause loginUser is a function..and it will be called only if the previous middleware (verifyJWT) calls next().
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh").post(verifyJWT, refreshAccessToken);
export default router;
