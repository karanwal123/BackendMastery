// Import required modules:
// - multer for handling multipart/form-data uploads
// - path for handling file paths
// - fs for interacting with the file system
import multer from "multer";
import path from "path";
import fs from "fs";

// Define a temporary folder path where uploaded files will be stored.
// process.cwd() returns the current working directory, then we navigate to '/public/temp'
const tempFolder = path.join(process.cwd(), "public", "temp");

// Check if the destination folder exists. If not, create it recursively
// Using fs.existsSync to verify existence and fs.mkdirSync with { recursive: true }
// ensures that even nested directories will be created if they don't exist.
if (!fs.existsSync(tempFolder)) {
  fs.mkdirSync(tempFolder, { recursive: true });
}

// Configure multer's diskStorage to set up where and how files will be stored.
const storage = multer.diskStorage({
  // The destination callback sets the folder to save the file.
  // 'req' is the request object, 'file' is the file object,
  // and 'cb' is the callback to signal completion.
  destination: function (req, file, cb) {
    cb(null, tempFolder); // Save files to the temporary folder defined earlier.
  },
  // The filename callback sets a unique name for the file.
  // This ensures that multiple files with the same original name do not conflict.
  filename: function (req, file, cb) {
    // Generate a unique suffix using current time and a random number.
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Extract the original file extension using path.extname.
    const ext = path.extname(file.originalname);
    // Combine the field name, unique suffix, and extension to form the new filename.
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Initialize the multer middleware with the specified storage settings.
// This middleware can be used to handle file uploads in routes.
export const upload = multer({ storage });
