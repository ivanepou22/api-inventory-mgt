import express from "express";
import {
  createJournalBatch,
  deleteJournalBatch,
  getJournalBatch,
  getJournalBatches,
  updateJournalBatch,
} from "@/controllers/journalBatchController";

const journalBatchRouter = express.Router();

journalBatchRouter.post("/journal-templates", createJournalBatch);
journalBatchRouter.get("/journal-templates", getJournalBatches);
journalBatchRouter.get("/journal-templates/:id", getJournalBatch);
journalBatchRouter.put("/journal-templates/:id", updateJournalBatch);
journalBatchRouter.delete("/journal-templates/:id", deleteJournalBatch);

export default journalBatchRouter;
