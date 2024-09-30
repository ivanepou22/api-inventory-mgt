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
import notificationRouter from "./routes/notificationRoutes";
import adjustmentRouter from "./routes/adjustmentRoutes";
import purchaseRouter from "./routes/purchaseRoutes";
import stockHistoryRouter from "./routes/stockHistoryRoutes";
import purchaseLineRouter from "./routes/purchaseLineRoutes";
import vendorPostingGroupRouter from "./routes/vendorPostingGroupRoutes";
import customerPostingGroupRouter from "./routes/customerPostingGroupRoutes";
import journalTemplateRouter from "./routes/journalTemplateRoutes";
import journalBatchRouter from "./routes/journalBatchRoutes";
import vatPostingSetupRouter from "./routes/vatPostingSetupRoutes";
import vatBusPostingGroupRouter from "./routes/vatBusPostingGroupRoutes";
import vatProductPostingGroupRouter from "./routes/vatProdPostingGroupRoutes";
import genBusPostingGroupRouter from "./routes/genBusPostingGroupRoutes";
import genProductPostingGroupRouter from "./routes/genProductPostingGroupRoutes";
import genPostingSetupRouter from "./routes/genPostingSetupRoutes";
import inventoryPostingSetupRouter from "./routes/inventoryPostingSetupRoutes";
import inventoryPostingGroupRouter from "./routes/inventoryPostingGroupRoutes";
import noSeriesRouter from "./routes/noSeriesRoutes";
import noSeriesLineRouter from "./routes/noSeriesLineRoutes";
import tenantRouter from "./routes/tenantRoutes";
import companyRouter from "./routes/companyRoutes";
import companyInformationRouter from "./routes/companyInformationRoutes";
import tagRouter from "./routes/tagRoutes";

require("dotenv").config();
const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 600, // 10 minutes
};

app.use(cors(corsOptions));
app.use(helmet());

const appRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: "Too many requests from this IP, please try again in an hour!",
    });
  },
});

app.use(appRateLimiter);

const routeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: "Too many requests from this IP, please try again in an hour!",
    });
  },
});

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
const apiRoutes = [
  { router: userRouter },
  { router: shopRouter },
  { router: supplierRouter },
  { router: customerRouter },
  { router: loginRouter, useRouteLimiter: true },
  { router: productTagRouter },
  { router: brandRouter },
  { router: unitRouter },
  { router: categoryRouter },
  { router: productRouter },
  { router: orderRouter, useRouteLimiter: true },
  { router: payeeRouter },
  { router: expenseCategoryRouter },
  { router: expenseRouter, useRouteLimiter: true },
  { router: notificationRouter },
  { router: adjustmentRouter },
  { router: purchaseRouter },
  { router: stockHistoryRouter },
  { router: purchaseLineRouter },
  { router: vendorPostingGroupRouter },
  { router: customerPostingGroupRouter },
  { router: journalTemplateRouter },
  { router: journalBatchRouter },
  { router: vatPostingSetupRouter },
  { router: vatBusPostingGroupRouter },
  { router: vatProductPostingGroupRouter },
  { router: genBusPostingGroupRouter },
  { router: genProductPostingGroupRouter },
  { router: genPostingSetupRouter },
  { router: inventoryPostingGroupRouter },
  { router: inventoryPostingSetupRouter },
  { router: noSeriesRouter },
  { router: noSeriesLineRouter },
  { router: tenantRouter },
  { router: companyRouter },
  { router: companyInformationRouter },
  { router: tagRouter },
];

apiRoutes.forEach(({ router, useRouteLimiter }) => {
  const middlewares = [];
  if (useRouteLimiter) {
    middlewares.push(routeLimiter);
  }
  app.use("/api/v1", ...middlewares, router);
});

try {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Error starting the server: ", error);
}
