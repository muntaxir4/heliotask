import express from "express";
import authRouter from "./auth/auth";
import userRouter from "./user/user";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.WEB_URL,
    credentials: true,
  })
);

app.get("/", (_, res) => {
  res.status(200).json({ message: "HelioTask API" });
});

app.get("/api/v1/healthcheck", (_, res) => {
  res.status(200).json({ message: "Health Check Successfull" });
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

export default app;
