import pkg from "googleapis";
import JWT from "jsonwebtoken";
import User from "../schemas/users.js";

// const { oauth2client } = pkg;
import { oauth2Client } from "../utils/googleConfig.js";


const options = {
  maxAge: 1000 * 60 * 60 * 24, // expire after 1 day
  httpOnly: false, // Cookie will not be exposed to client side code
  sameSite: "lax", // If client and server origins are different
  secure: false, // use with HTTPS only,
  priority: 'Medium'
};

export const googleAuth = async (req, res) => {
  try {
    const { code } = req.body; // Authorization code from client
    console.log("Authorization code received:", code);
    // Exchange authorization code for access token
    const googleTokenResponse = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleTokenResponse.tokens);
    const userResponse = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleTokenResponse.tokens.access_token}`,{
        method: 'GET',
    })
    const userData = await userResponse.json();
    console.log(userData)
    const { email, name, picture } = userData
    let user = await User.findOne({ email });
    if (!user) {
        // If user doesn't exist, create a new user
        user = await User.create({email, name, image:picture});
    }
    const { _id } = user;
    console.log("User authenticated:", _id);
    // Create a session or JWT token for the user
    const token = JWT.sign({ _id: _id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    console.log("JWT token created:", token);
    res.status(200).cookie("token", token, options).json({ message: "Authentication successful"});

  } catch (error) {
    console.error("Error during Google authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
}