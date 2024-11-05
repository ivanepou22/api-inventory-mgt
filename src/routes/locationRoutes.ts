import express from "express";
import {
  createLocation,
  deleteLocation,
  getLocation,
  getLocations,
  updateLocation,
} from "@/controllers/locationController";

const locationRouter = express.Router();

locationRouter.post("/locations", createLocation);
locationRouter.get("/locations", getLocations);
locationRouter.get("/locations/:id", getLocation);
locationRouter.put("/locations/:id", updateLocation);
locationRouter.delete("/locations/:id", deleteLocation);

export default locationRouter;
