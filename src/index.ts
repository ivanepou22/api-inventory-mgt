import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import customerRouter from "./routes/customerRoutes";
import userRouter from "./routes/userRoutes";
import shopRouter from "./routes/shopRoutes";
import supplierRouter from "./routes/supplierRoutes";
import loginRouter from "./routes/loginRoutes";
import productTagRouter from "./routes/productTagRoutes";
import brandRouter from "./routes/brandRoutes";
import unitRouter from "./routes/unitRoutes";
import categoryRouter from "./routes/categoryRoutes";
import productRouter from "./routes/productRoutes";
import orderRouter from "./routes/orderRoutes";
import payeeRouter from "./routes/payeeRoutes";
import expenseCategoryRouter from "./routes/expenseCategoryRoutes";
import expenseRouter from "./routes/expenseRoutes";

require("dotenv").config();
const app = express();

app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(helmet());

const appRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (_req, res) => {
    res.status(429).json({
      error: "Too many requests from this IP, please try again later!",
    });
  },
}); // Use helmet middleware to secure the app by setting various HTTP headers

app.use(appRateLimiter); // Use rate limiting middleware to prevent abuse

const routeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: "Too many requests from this IP, please try again later!",
    });
  },
});

const PORT = process.env.PORT || 8000;

app.use(express.json()); // Parse incoming JSON requests and make the data available in req.body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request
app.use("/api/v1", routeLimiter, userRouter);
app.use("/api/v1", shopRouter);
app.use("/api/v1", supplierRouter);
app.use("/api/v1", customerRouter);
app.use("/api/v1", routeLimiter, loginRouter);
app.use("/api/v1", productTagRouter);
app.use("/api/v1", brandRouter);
app.use("/api/v1", unitRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", routeLimiter, orderRouter);
app.use("/api/v1", payeeRouter);
app.use("/api/v1", expenseCategoryRouter);
app.use("/api/v1", routeLimiter, expenseRouter);

try {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Error starting the server: ", error);
}
