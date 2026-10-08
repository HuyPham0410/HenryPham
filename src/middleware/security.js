// Apply security headers, request limits, and visitor-bound CSRF protection.
const { randomBytes } = require("node:crypto");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const { doubleCsrf } = require("csrf-csrf");
const { rateLimit } = require("express-rate-limit");

function installSecurity(app, config) {
  app.disable("x-powered-by");
  app.set("trust proxy", config.trustProxy);
  app.use(
    helmet({
      strictTransportSecurity: config.production ? undefined : false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'none'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: config.production ? [] : null,
        },
      },
    }),
  );
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: "Too many requests. Please try again later.",
    }),
  );
  app.use(cookieParser(config.csrfSecret));
  const identityCookie = config.production ? "__Host-visitor" : "visitor";
  const cookieOptions = {
    httpOnly: true,
    secure: config.production,
    sameSite: "strict",
    path: "/",
  };
  // A signed random visitor ID binds CSRF tokens to one browser; it is not a login identity.
  const identify = (req, res, next) => {
    let identity = req.signedCookies[identityCookie];
    if (typeof identity !== "string" || !/^[a-f0-9]{64}$/.test(identity)) {
      identity = randomBytes(32).toString("hex");
      res.cookie(identityCookie, identity, { ...cookieOptions, signed: true });
    }
    req.visitorId = identity;
    next();
  };
  const csrf = doubleCsrf({
    getSecret: () => config.csrfSecret,
    getSessionIdentifier: (req) => req.visitorId,
    cookieName: config.production ? "__Host-csrf" : "csrf",
    cookieOptions,
    getCsrfTokenFromRequest: (req) =>
      typeof req.body?._csrf === "string" ? req.body._csrf : undefined,
  });
  // Count all submission attempts, including invalid forms, to limit repeated abuse.
  const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: "Too many message attempts. Please wait 15 minutes and try again.",
  });
  return { identify, contactLimiter, ...csrf };
}

module.exports = { installSecurity };
