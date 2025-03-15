import * as pmlib from "./sign-util-lib.js";
import config from "../config/config.js";
import crypto from "crypto";
import { rs } from "./sign-util-lib.js"; // ✅ Correct way for named import

// Fields not participating in signature
const excludeFields = [
  "sign",
  "sign_type",
  "header",
  "refund_info",
  "openType",
  "raw_request",
  "biz_content",
];

console.log("Config:", config);

export function signRequestObject(requestObject) {
  const fields = [];
  const fieldMap = {};

  for (const key in requestObject) {
    if (!excludeFields.includes(key)) {
      fields.push(key);
      fieldMap[key] = requestObject[key];
    }
  }

  // Include "biz_content" fields in the signature
  if (requestObject.biz_content) {
    let biz = requestObject.biz_content;
    for (let key in biz) {
      if (!excludeFields.includes(key)) {
        fields.push(key);
        fieldMap[key] = biz[key];
      }
    }
  }

  // Sort by ASCII order
  fields.sort();

  let signStrList = fields.map((key) => `${key}=${fieldMap[key]}`);
  let signOriginStr = signStrList.join("&");

  console.log("signOriginStr:", signOriginStr);
  return signString(signOriginStr, config.privateKey);
}

export function signString(text, privateKey) {
  try {
    const sha256withrsa = new rs.KJUR.crypto.Signature({
      alg: "SHA256withRSAandMGF1",
    });

    sha256withrsa.init(privateKey);
    sha256withrsa.updateString(text);
    return pmlib.rs.hextob64(sha256withrsa.sign());
  } catch (error) {
    console.error("Error signing string:", error);
    return null;
  }
}

export function createTimeStamp() {
  return Math.floor(Date.now() / 1000).toString();
}

// Generate a 32-character random string
export function createNonceStr() {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from(
    { length: 32 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export default {
  signString,
  signRequestObject,
  createTimeStamp,
  createNonceStr,
};
