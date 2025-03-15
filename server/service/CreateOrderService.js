import axios from "axios";
import applyFabricToken from "./ApplyFabricTokenService.js";
import * as tools from "../utils/tools.js";
import config from "../config/config.js";

export const createOrder = async (req, res) => {
  try {
    const { title, amount } = req.body;
    console.log(`Title: ${title} Amount: ${amount}`);

    const { token: fabricToken } = await applyFabricToken();
    console.log("fabricToken =", fabricToken);

    const createOrderResult = await requestCreateOrder(
      fabricToken,
      title,
      amount
    );
    console.log(createOrderResult);

    const prepayId = createOrderResult.biz_content.prepay_id;
    const rawRequest = createRawRequest(prepayId);
    console.log("Assembled URL");
    console.log(`${WEB_BASE_URL}${rawRequest}&version=1.0&trade_type=Checkout`);

    res.send(
      `${config.webBaseUrl}${rawRequest}&version=1.0&trade_type=Checkout`
    );
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const requestCreateOrder = async (fabricToken, title, amount) => {
  try {
    const reqObject = createRequestObject(title, amount);

    const response = await axios.post(
      `${config.baseUrl}/payment/v1/merchant/preOrder`,
      reqObject,
      {
        headers: {
          "Content-Type": "application/json",
          "X-APP-Key": config.fabricAppId,
          Authorization: fabricToken,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error requesting order:", error.response?.data || error);
    throw new Error("Failed to create order");
  }
};

function createRequestObject(title, amount) {
  const req = {
    timestamp: tools.createTimeStamp(),
    nonce_str: tools.createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
  };

  const biz = {
    notify_url: "https://www.google.com",
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    merch_order_id: createMerchantOrderId(),
    trade_type: "Checkout",
    title,
    total_amount: amount,
    trans_currency: "ETB",
    timeout_express: "120m",
  };

  req.biz_content = biz;
  req.sign = tools.signRequestObject(req);
  req.sign_type = "SHA256WithRSA";
  console.log(req);

  return req;
}

function createMerchantOrderId() {
  return Date.now().toString();
}

function createRawRequest(prepayId) {
  const map = {
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    nonce_str: tools.createNonceStr(),
    prepay_id: prepayId,
    timestamp: tools.createTimeStamp(),
  };

  const sign = tools.signRequestObject(map);
  return Object.entries(map)
    .map(([key, value]) => `${key}=${value}`)
    .concat([`sign=${sign}`, "sign_type=SHA256WithRSA"])
    .join("&");
}

export default { createOrder, requestCreateOrder };
