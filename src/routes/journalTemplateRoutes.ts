import express from "express";
import {
  createJournalTemplate,
  deleteJournalTemplate,
  getJournalTemplate,
  getJournalTemplates,
  updateJournalTemplate,
} from "@/controllers/journalTemplateController";

const journalTemplateRouter = express.Router();

journalTemplateRouter.post("/journal-templates", createJournalTemplate);
journalTemplateRouter.get("/journal-templates", getJournalTemplates);
journalTemplateRouter.get("/journal-templates/:id", getJournalTemplate);
journalTemplateRouter.put("/journal-templates/:id", updateJournalTemplate);
journalTemplateRouter.delete("/journal-templates/:id", deleteJournalTemplate);

export default journalTemplateRouter;
