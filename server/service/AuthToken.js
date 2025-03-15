import axios from "axios";
import * as tools from "../utils/tools";
import config from "../config/config";
import applyFabricToken from "./ApplyFabricTokenService";
const https = require("https");

// Authentication Token Handler
export const AuthToken = async (req, res) => {
  try {
    const { authToken } = req.body;
    console.log("token =", authToken);

    const { token: fabricToken } = await applyFabricToken();
    console.log("applyFabricTokenResult", fabricToken);

    const result = await requestAuthToken(fabricToken, authToken);
    res.json(result);
  } catch (error) {
    console.error("Error in authToken:", error.response?.data || error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to Request Authentication Token
export const requestAuthToken = async (fabricToken, appToken) => {
  try {
    const reqObject = createRequestObject(appToken);

    const response = await axios.post(
      `${config.webBaseUrl}/payment/v1/auth/authToken`,
      reqObject,
      {
        headers: {
          "Content-Type": "application/json",
          "X-APP-Key": config.fabricAppId,
          Authorization: fabricToken,
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error requesting auth token:",
      error.response?.data || error
    );
    throw new Error("Failed to obtain auth token");
  }
};

// Function to Create Request Object
function createRequestObject(appToken) {
  const req = {
    timestamp: tools.createTimeStamp(),
    nonce_str: tools.createNonceStr(),
    method: "payment.authtoken",
    version: "1.0",
    biz_content: {
      access_token: appToken,
      trade_type: "InApp",
      appid: config.merchantAppId,
      resource_type: "OpenId",
    },
    sign: "",
    sign_type: "SHA256WithRSA",
  };
  req.sign = tools.signRequestObject(req);
  return req;
}
