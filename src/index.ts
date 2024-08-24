import express from "express"; // Import the Express framework
import customerRouter from "./routes/customerRoutes";
import userRouter from "./routes/userRoutes";
import shopRouter from "./routes/shopRoutes";
import supplierRouter from "./routes/supplierRoutes";
import loginRouter from "./routes/loginRoutes";

require("dotenv").config(); // Load environment variables from a .env file into process.env
const cors = require("cors"); // Import the CORS middleware
const app = express(); // Create an Express application instance

app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for all routes

const PORT = process.env.PORT || 8000; // Set the server's port from environment variables or default to 8000

app.use(express.json()); // Parse incoming JSON requests and make the data available in req.body
app.use("/api/v1", userRouter);
app.use("/api/v1", shopRouter);
app.use("/api/v1", supplierRouter);
app.use("/api/v1", customerRouter); // Routes will be available under /api/v1
app.use("/api/v1", loginRouter); // Routes will be available under /api/v1

try {
  app.listen(PORT, () => {
    // Start the server and listen on the specified port
    console.log(`Server is running on http://localhost:${PORT}`); // Log a message indicating the server is running
  });
} catch (error) {
  console.error("Error starting the server: ", error);
}
