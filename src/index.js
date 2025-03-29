import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  //app.listen(process.env.PORT || 8000) starts the server only after MongoDB is connected.
  .catch((error) => {
    console.log("MONGO DB connection failed..the error is :: ", error);
  });

// an async function that returns a Promise.

/*
import express from "express";
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("Error: ", error);
      throw error;
    });
    // function handleError(error) {
    //     console.log("Error: ", error);
    //   }

    //   app.on("error", handleError);
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
})();
*/
