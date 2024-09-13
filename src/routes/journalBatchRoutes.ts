import express from "express";
import {
  createJournalBatch,
  deleteJournalBatch,
  getJournalBatch,
  getJournalBatches,
  updateJournalBatch,
} from "@/controllers/journalBatchController";

const journalBatchRouter = express.Router();

journalBatchRouter.post("/journal-batches", createJournalBatch);
journalBatchRouter.get("/journal-batches", getJournalBatches);
journalBatchRouter.get("/journal-batches/:id", getJournalBatch);
journalBatchRouter.put("/journal-batches/:id", updateJournalBatch);
journalBatchRouter.delete("/journal-batches/:id", deleteJournalBatch);

export default journalBatchRouter;
