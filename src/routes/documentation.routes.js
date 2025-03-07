import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let swaggerDocument;

try {
  const swaggerPath = join(__dirname, "../docs/swagger.yml");
  if (fs.existsSync(swaggerPath)) {
    swaggerDocument = YAML.load(swaggerPath);
  } else {
    console.error("Swagger file not found:", swaggerPath);
    swaggerDocument = {
      openapi: "3.0.0",
      info: {
        title: "GiggleFest API",
        version: "1.0.0",
        description:
          "Swagger file not found. This is a fallback configuration.",
      },
    };
  }
} catch (error) {
  console.error("Error loading swagger document:", error);
  swaggerDocument = {
    openapi: "3.0.0",
    info: {
      title: "GiggleFest API",
      version: "1.0.0",
      description:
        "Error loading Swagger file. This is a fallback configuration.",
    },
  };
}

const router = Router();

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocument, { explorer: true }));

export default router;
