import dotenv from "dotenv";
dotenv.config();
const config = {
  baseUrl: process.env.BASE_URL,
  webBaseUrl: process.env.WEB_BASE_URL,
  fabricAppId: process.env.FABRIC_APP_ID,
  appSecret: process.env.APP_SECRET,
  merchantAppId: process.env.MERCHANT_APP_ID,
  merchantCode: process.env.MERCHANT_CODE,
  privateKey: process.env.PRIVATE_KEY, // Use securely stored key
};

export default config;
