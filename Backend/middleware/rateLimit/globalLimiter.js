// import rateLimit from "express-rate-limit";

// export const globalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message: {
//     success: false,
//     message: "Too many requests, please try again later",
//   },
// });

import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,

  skip: (req) => req.method === "OPTIONS",

  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});
