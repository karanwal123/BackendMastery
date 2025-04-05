import multer from "multer";
import path from "path";
import fs from "fs";

// Destination path (absolute)
const tempFolder = path.join(process.cwd(), "public", "temp");

// Ensure the folder exists
if (!fs.existsSync(tempFolder)) {
  fs.mkdirSync(tempFolder, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempFolder); // Save files to ./public/temp
  },
  filename: function (req, file, cb) {
    // Create a unique filename to avoid collisions
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Exported multer middleware
export const upload = multer({ storage });
