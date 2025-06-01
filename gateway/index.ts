import corlationId from "./middleware/corlationId";
import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import winston from "winston";
import expressWinston from "express-winston";
import cookieParser from "cookie-parser";
import helmet from "helmet";
// import xss from "xss-clean"
// import ratelimit from 'express-rate-limit'
import hpp from "hpp";
import cors from "cors";
import responseTime from "response-time";
import { createLogger, format, transports } from "winston";
import router from "./service/router";
import client from "prom-client";

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

register.registerMetric(httpRequestCounter);

const { combine, timestamp, label, prettyPrint } = format;

const app = express();

//security
app.use(helmet());
app.use(hpp());
app.use(cors());

app.use(corlationId)

// app.use(session({
//     // Other session configurations
//     cookie: {
//       secure: true
//     }
//   }))

dotenv.config({ path: "./config/config.env" });

app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode,
    });
  });
  next();
});

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
});

//set logger
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "myLogs.log" }),
    ],
    format: format.combine(
      label({ label: "right meow!" }),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      prettyPrint()
    ),
    statusLevels: true,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
    expressFormat: true,
    ignoreRoute() {
      return false;
    },
  })
);

// inside logger!!!!
winston.configure({
  format: format.combine(
    label({ label: "right meow!" }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    prettyPrint()
  ),
  transports: [
    new winston.transports.File({ filename: "inside.log" }),
    // new winston.transports.Console()
  ],
});

process.on("unhandledRejection", (error) => {
  monitor.error.push(`${error}`);
  console.log("error occured . . .", error);
});

process.on("uncaughtException", (error) => {
  monitor.error.push(`${error}`);
  console.log("error occured", error);
});

process.on("unhandledException", (error) => {
  monitor.error.push(`${error}`);
  console.log("error occured . . .", error);
});

const port = process.env.PORT || 9009;

app.listen(port, () => {
  console.log("server connecting successfully . . .");
});

const routing = new router();

import ratelimit from "./ratelimit";
import monitor from "./service/statusMonitor";
import { adminMiddleware } from "./auth/auth.middleware";
import { blackListMiddleWare } from "./blackList.middleware";
import { connectRedis, redisCache } from "./service/redis.service";

//proxeing
// app.use('/' , routing.proxy(`http://localhost:3000`))     // proxing to product service
app.use(
  "/v1/main",
  routing.proxy(`http://localhost:9010`)
); // proxing to django for report service
app.use(
  "/v1/mainw",
  routing.proxy(`http://localhost:9012`)
); // roxy to query service
app.use(
  "/v1/trade",
  routing.proxy(`http://localhost:9013`)
); // proxing to django for report service


app.get("/monitor/all", async (req: any, res: any, next: any) => {
  let data = await monitor.getter();
  return res.status(200).json(data);
});

connectRedis();

let a = new redisCache();
