import "dotenv/config";
import cors from "cors";
import express from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "./generated/prisma/client";

const app = express();

app.use(
  cors({
    origin: "https://your-client-domain.com", // Your front-end URL
    credentials: true, // Allow cookies to be sent
  })
);

app.options(
  "*",
  cors({ origin: "https://your-client-domain.com", credentials: true })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 1000 * 60 * 60 * 24,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
