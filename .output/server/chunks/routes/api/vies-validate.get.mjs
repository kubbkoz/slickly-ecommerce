import { d as defineEventHandler, g as getQuery, c as createError } from '../../nitro/nitro.mjs';
import 'nodemailer';
import 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'anymatch';
import 'lru-cache';
import 'vue-router';
import 'node:url';
import '@iconify/utils';
import 'consola';

const VIES_WSDL_URL = "https://ec.europa.eu/taxation_customs/vies/services/checkVatService";
function buildSoapEnvelope(countryCode, vatNumber) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ec.europa.eu:taxud:vies:services:checkVat:types">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:checkVat>
         <urn:countryCode>${countryCode}</urn:countryCode>
         <urn:vatNumber>${vatNumber}</urn:vatNumber>
      </urn:checkVat>
   </soapenv:Body>
</soapenv:Envelope>`;
}
function extractTag(xml, tag) {
  var _a;
  const regex = new RegExp(`<[^:]*:?${tag}[^>]*>([\\s\\S]*?)<\\/[^:]*:?${tag}>`, "i");
  const match = xml.match(regex);
  return ((_a = match == null ? void 0 : match[1]) == null ? void 0 : _a.trim()) || "";
}
const viesValidate_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const rawVatId = (query.vatId || "").trim().replace(/\s/g, "");
  if (!rawVatId || rawVatId.length < 4) {
    throw createError({ statusCode: 400, statusMessage: "Zadajte platn\xE9 I\u010C DPH (min. 4 znaky)." });
  }
  const countryCode = rawVatId.substring(0, 2).toUpperCase();
  const vatNumber = rawVatId.substring(2);
  if (!/^[A-Z]{2}$/.test(countryCode)) {
    throw createError({ statusCode: 400, statusMessage: "I\u010C DPH mus\xED za\u010D\xEDna\u0165 dvojp\xEDsmenkov\xFDm k\xF3dom krajiny (napr. SK, CZ)." });
  }
  if (!vatNumber) {
    throw createError({ statusCode: 400, statusMessage: "Zadajte \u010D\xEDslo za k\xF3dom krajiny." });
  }
  try {
    const soapBody = buildSoapEnvelope(countryCode, vatNumber);
    const response = await $fetch.raw(VIES_WSDL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        "SOAPAction": ""
      },
      body: soapBody,
      responseType: "text",
      timeout: 2e4
    });
    const xml = response._data;
    const valid = extractTag(xml, "valid").toLowerCase() === "true";
    const name = extractTag(xml, "name");
    const address = extractTag(xml, "address");
    return {
      valid,
      countryCode,
      vatNumber,
      vatId: rawVatId,
      name: name && name !== "---" ? name : void 0,
      address: address && address !== "---" ? address : void 0
    };
  } catch (err) {
    const message = (err == null ? void 0 : err.data) || (err == null ? void 0 : err.message) || "";
    if (typeof message === "string" && message.includes("INVALID_INPUT")) {
      return { valid: false, countryCode, vatNumber, vatId: rawVatId, error: "Neplatn\xFD form\xE1t I\u010C DPH." };
    }
    if (typeof message === "string" && message.includes("SERVICE_UNAVAILABLE")) {
      throw createError({ statusCode: 503, statusMessage: "VIES slu\u017Eba je moment\xE1lne nedostupn\xE1. Sk\xFAste nesk\xF4r." });
    }
    if (typeof message === "string" && message.includes("MS_UNAVAILABLE")) {
      throw createError({ statusCode: 503, statusMessage: `Valida\u010Dn\xE1 slu\u017Eba pre krajinu ${countryCode} je moment\xE1lne nedostupn\xE1.` });
    }
    if ((err == null ? void 0 : err.name) === "TimeoutError" || typeof message === "string" && (message.includes("TIMEOUT") || message.toLowerCase().includes("timeout") || message.toLowerCase().includes("aborted"))) {
      throw createError({ statusCode: 504, statusMessage: `Valida\u010Dn\xE1 slu\u017Eba pre krajinu ${countryCode} neodpoved\xE1. Sk\xFAste nesk\xF4r.` });
    }
    console.error("[vies-validate] Error:", err == null ? void 0 : err.name, err == null ? void 0 : err.statusCode, message);
    throw createError({ statusCode: 502, statusMessage: "Nepodarilo sa overi\u0165 I\u010C DPH cez VIES." });
  }
});

export { viesValidate_get as default };
