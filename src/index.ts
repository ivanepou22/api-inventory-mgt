import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { tenantMiddleware } from "./middleware/tenantMiddleware";
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
import onlineOrderSetupRouter from "./routes/onlineOrderSetupRoutes";
import noSeriesSetupRouter from "./routes/noSeriesSetupRoutes";

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
app.use(tenantMiddleware);

// API routes
const apiRoutes = [
  { router: userRouter },
  { router: shopRouter, useTenantMiddleware: true },
  { router: supplierRouter, useTenantMiddleware: true },
  { router: customerRouter, useTenantMiddleware: true },
  { router: loginRouter, useRouteLimiter: true, useTenantMiddleware: false },
  { router: productTagRouter, useTenantMiddleware: true },
  { router: brandRouter, useTenantMiddleware: true },
  { router: unitRouter, useTenantMiddleware: true },
  { router: categoryRouter, useTenantMiddleware: true },
  { router: productRouter, useTenantMiddleware: true },
  { router: orderRouter, useRouteLimiter: true, useTenantMiddleware: true },
  { router: payeeRouter, useTenantMiddleware: true },
  { router: expenseCategoryRouter, useTenantMiddleware: true },
  { router: expenseRouter, useRouteLimiter: true, useTenantMiddleware: true },
  { router: notificationRouter, useTenantMiddleware: true },
  { router: adjustmentRouter, useTenantMiddleware: true },
  { router: purchaseRouter, useTenantMiddleware: true },
  { router: stockHistoryRouter, useTenantMiddleware: true },
  { router: purchaseLineRouter, useTenantMiddleware: true },
  { router: vendorPostingGroupRouter, useTenantMiddleware: true },
  { router: customerPostingGroupRouter, useTenantMiddleware: true },
  { router: journalTemplateRouter, useTenantMiddleware: true },
  { router: journalBatchRouter, useTenantMiddleware: true },
  { router: vatPostingSetupRouter, useTenantMiddleware: true },
  { router: vatBusPostingGroupRouter, useTenantMiddleware: true },
  { router: vatProductPostingGroupRouter, useTenantMiddleware: true },
  { router: genBusPostingGroupRouter, useTenantMiddleware: true },
  { router: genProductPostingGroupRouter, useTenantMiddleware: true },
  { router: genPostingSetupRouter, useTenantMiddleware: true },
  { router: inventoryPostingGroupRouter, useTenantMiddleware: true },
  { router: inventoryPostingSetupRouter, useTenantMiddleware: true },
  { router: noSeriesRouter, useTenantMiddleware: true },
  { router: noSeriesLineRouter, useTenantMiddleware: true },
  { router: tenantRouter },
  { router: companyRouter },
  { router: companyInformationRouter, useTenantMiddleware: true },
  { router: tagRouter, useTenantMiddleware: true },
  { router: onlineOrderSetupRouter, useTenantMiddleware: true },
  { router: noSeriesSetupRouter, useTenantMiddleware: true },
];

apiRoutes.forEach(({ router, useRouteLimiter }) => {
  const middlewares = useRouteLimiter ? [routeLimiter] : [];
  app.use("/api/v1", ...middlewares, router);
});

try {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Error starting the server: ", error);
}
