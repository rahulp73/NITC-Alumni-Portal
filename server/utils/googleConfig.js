import { google } from "googleapis";
import { configDotenv } from 'dotenv';
configDotenv();

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:5173" // Redirect URI
);