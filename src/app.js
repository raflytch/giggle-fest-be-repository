import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index.routes.js";
import documentationRoutes from "./routes/documentation.routes.js";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", routes);
app.use("/api-docs", documentationRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
