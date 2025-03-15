import axios from "axios";
import https from "https";
import config from "../config/config.js"; // Ensure config.js exists and is correct

export default async function applyFabricToken() {
  try {
    console.log(
      "Fetching Fabric Token from:",
      `${config.baseUrl}/payment/v1/token`
    ); // Debug URL

    const response = await axios.post(
      `${config.baseUrl}/payment/v1/token`, // Ensure config.baseUrl is correctly loaded
      { appSecret: config.appSecret },
      {
        headers: {
          "Content-Type": "application/json",
          "X-APP-Key": config.fabricAppId,
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }), // ⚠️ Consider `true` in production
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching Fabric token:",
      error.response?.data || error.message
    );
    throw new Error("Failed to obtain Fabric token");
  }
}
