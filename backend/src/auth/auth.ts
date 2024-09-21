import { json, Router } from "express";
import cookieParser from "cookie-parser";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import { prisma } from "../db";
import { sign } from "jsonwebtoken";

//important variables
const JWT_SECRET = process.env.JWT_SECRET ?? "jwtsecret";

const auth = Router();

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

auth.use(json());
auth.use(cookieParser());

auth.post("/google", async (req, res) => {
  const code = req.body.code;
  if (!code) {
    return res.status(400).json({ message: "Google Signin Failed" });
  }
  const {
    tokens: { access_token },
  } = await oAuth2Client.getToken(code);
  if (!access_token) {
    return res.status(400).json({ message: "Google Signin Failed" });
  }
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
        },
      }
    );
    const {
      email,
      name,
      picture,
    }: { email: string; name: string; picture: string } = response.data;
    if (!email || !name)
      return res.status(400).json({ message: "Google Signin Failed" });
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    let userId = existingUser?.id ?? "-1";
    if (!existingUser) {
      const newUser = await prisma.user.create({
        data: {
          email: email,
          name: name,
          avatarUrl: picture,
        },
      });
      userId = newUser.id;
    }

    // Generate JWT token
    const token = sign({ userId }, JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      domain:
        process.env.NODE_ENV === "production" ? ".mallik.tech" : undefined,
    });
    res.status(200).json({ message: "Google Signin Success" });
  } catch (error) {
    return res.status(500).json({ message: "Request Failed" });
  }
});

auth.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      domain:
        process.env.NODE_ENV === "production" ? ".mallik.tech" : undefined,
    });
    res.status(200).json({ message: "Logout Success" });
  } catch (error) {
    return res.status(500).json({ message: "Logout Failed" });
  }
});

export default auth;
