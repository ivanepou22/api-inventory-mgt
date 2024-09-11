import express from "express";
import {
  deleteStockHistory,
  getStockHistory,
  getStockHistories,
  updateStockHistory,
} from "@/controllers/stockHistoryController";

const stockHistoryRouter = express.Router();

stockHistoryRouter.get("/stock-history", getStockHistories);
stockHistoryRouter.get("/stock-history/:id", getStockHistory);
stockHistoryRouter.put("/stock-history/:id", updateStockHistory);
stockHistoryRouter.delete("/stock-history/:id", deleteStockHistory);

export default stockHistoryRouter;
