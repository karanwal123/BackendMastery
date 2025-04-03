

class ApiResponse{
    constructor(statusCode,data,message="Success"){
        this.statusCode=statusCode;
        this.data=data;
        this.message=message;
        this.success=statusCode < 400;
    }
}
export {ApiResponse};
// This code snippet is a utility for handling API responses in a standardized way.
// It is a JavaScript class (ApiResponse) that standardizes API responses by including:

// HTTP Status Code (statusCode) – Example: 200 OK, 404 Not Found

// Data (data) – The actual response data (e.g., user info, a list of items)

// Message (message) – A short description of the response (default: "Success")

// Success (success) – A boolean (true/false) that checks if the request was successful.