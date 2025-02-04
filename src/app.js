import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.routes.js";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/v1", routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
