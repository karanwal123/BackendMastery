import mongoose from "mongoose";
import { DB_NAME } from "./constants";







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