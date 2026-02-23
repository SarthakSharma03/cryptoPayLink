import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import paymentRouter from "./routes/payment.route";




dotenv.config();

const app = express();

app.use(cors());
app.use(
  express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/payment", paymentRouter);
app.get("/", (_, res) => {
  res.status(200).json({
    message: "Backend is running successfully 🚀"
  });
});
const PORT = process.env.PORT || 3000 ;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(() => {
    app.listen(PORT, () => {
      console.log(`⚠️ Server running without DB on port ${PORT}`);
    });
  });


export default app;
