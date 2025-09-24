**Basic User Authentication API**
User Model:
Create a Mongoose schema for your User. It must include:
email: String, required, unique, valid email format.
password: String, required.
passwordResetToken: String.
passwordResetExpires: Date.
Standard Auth Routes:
POST /api/auth/register: Creates a new user. The password must be hashed using bcryptjs before saving.
POST /api/auth/login: Authenticates a user with their email and password, returning a JWT upon success.
This is a two-step process that requires two new endpoints.

Step A: "Forgot Password" Endpoint
Route: POST /api/auth/forgot-password
Logic:

The request body will contain the user's email.
Log the Ethereal message URL to the console so you can easily open the email in your browser.

Step B: "Reset Password" Endpoint
Route: PATCH /api/auth/reset-password/:token
Logic:

Get the un-hashed token from the URL parameters (req.params.token).
Hash this incoming token so you can find the matching user in the database.
Find a user where the passwordResetToken matches the hashed token and the passwordResetExpires date is still in the future ($gt: Date.now()).
If no user is found or the token is expired, return a 400 Bad Request error.
If the token is valid, take the new password from the request body, hash it, and update the user's password field.
Clear the passwordResetToken and passwordResetExpires fields in the database.
Send a success response.
