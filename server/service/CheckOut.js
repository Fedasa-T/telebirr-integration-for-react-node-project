import config from "../config/config.js";
export {}; // Ensure this file is treated as a module

const title = "Telebirr Integration"; // Replace with your desired title
const amount = "Amount"; // Replace with your desired amount
// const baseUrl = "https://your-api-url.com"; // Replace with your actual base URL

async function startPay() {
  if (!amount) {
    console.error("Amount is required to start payment.");
    return;
  }

  window.handleinitDataCallback = function () {
    window.location.href = window.location.origin;
  };

  try {
    const response = await fetch(`${config.webBaseUrl}/create/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, amount }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const rawRequest = await response.text();
    if (!rawRequest.trim()) {
      console.error("Received an empty response.");
      return;
    }

    if (!window.consumerapp) {
      console.warn("This is not opened in the app!");
      return;
    }

    const obj = JSON.stringify({
      functionName: "js_fun_start_pay",
      params: {
        rawRequest: rawRequest.trim(),
        functionCallBackName: "handleinitDataCallback",
      },
    });

    window.consumerapp.evaluate(obj);
  } catch (error) {
    console.error("Error occurred during payment:", error);
  }
}
