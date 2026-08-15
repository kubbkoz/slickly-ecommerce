import { d as defineEventHandler, i as defineCachedFunction, g as getQuery, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const PLACE_ID = "ChIJ1f4ccNbJFUcRUbCbvaArmfw";
const CACHE_TTL = 60 * 60 * 24;
const EMPTY_RESPONSE = { rating: 0, totalReviews: 0, reviews: [] };
async function tryLegacyApi(apiKey) {
  var _a, _b, _c, _d;
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,user_ratings_total,reviews&language=sk&reviews_sort=newest&key=${apiKey}`;
    const res = await $fetch(url);
    if (res.status !== "OK") return null;
    const r = (_a = res.result) != null ? _a : {};
    return {
      source: "legacy-places-api",
      rating: (_b = r.rating) != null ? _b : 0,
      totalReviews: (_c = r.user_ratings_total) != null ? _c : 0,
      reviews: ((_d = r.reviews) != null ? _d : []).filter((rv) => {
        var _a2;
        return ((_a2 = rv.text) != null ? _a2 : "").trim().length > 0;
      }).map((rv) => {
        var _a2, _b2, _c2, _d2, _e;
        return {
          author: (_a2 = rv.author_name) != null ? _a2 : "Z\xE1kazn\xEDk",
          photo: (_b2 = rv.profile_photo_url) != null ? _b2 : null,
          rating: (_c2 = rv.rating) != null ? _c2 : 5,
          text: (_d2 = rv.text) != null ? _d2 : "",
          date: (_e = rv.relative_time_description) != null ? _e : ""
        };
      })
    };
  } catch {
    return null;
  }
}
async function tryNewApi(apiKey) {
  var _a, _b, _c;
  try {
    const res = await $fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,reviews"
        }
      }
    );
    return {
      source: "places-api-new",
      rating: (_a = res.rating) != null ? _a : 0,
      totalReviews: (_b = res.userRatingCount) != null ? _b : 0,
      reviews: ((_c = res.reviews) != null ? _c : []).filter((r) => {
        var _a2, _b2;
        return ((_b2 = (_a2 = r.text) == null ? void 0 : _a2.text) != null ? _b2 : "").trim().length > 0;
      }).map((r) => {
        var _a2, _b2, _c2, _d, _e, _f, _g, _h;
        return {
          author: (_b2 = (_a2 = r.authorAttribution) == null ? void 0 : _a2.displayName) != null ? _b2 : "Z\xE1kazn\xEDk",
          photo: (_d = (_c2 = r.authorAttribution) == null ? void 0 : _c2.photoUri) != null ? _d : null,
          rating: (_e = r.rating) != null ? _e : 5,
          text: (_g = (_f = r.text) == null ? void 0 : _f.text) != null ? _g : "",
          date: (_h = r.relativePublishTimeDescription) != null ? _h : ""
        };
      })
    };
  } catch {
    return null;
  }
}
const fetchGoogleReviews = defineCachedFunction(
  async (_event) => {
    const config = useRuntimeConfig();
    if (!config.googlePlacesApiKey) return EMPTY_RESPONSE;
    let payload = await tryLegacyApi(config.googlePlacesApiKey);
    if (!payload || payload.reviews.length === 0) {
      const newPayload = await tryNewApi(config.googlePlacesApiKey);
      if (newPayload && newPayload.reviews.length > 0) payload = newPayload;
    }
    return payload || EMPTY_RESPONSE;
  },
  {
    name: "google-reviews",
    getKey: () => "default",
    maxAge: CACHE_TTL,
    // ?debug=1 bypasses the cache read (still writes a fresh entry) so the debug
    // endpoint always shows a live fetch instead of a cached result.
    shouldBypassCache: (event) => getQuery(event).debug === "1"
  }
);
const reviews_get = defineEventHandler(async (event) => {
  return fetchGoogleReviews(event);
});

export { reviews_get as default };
