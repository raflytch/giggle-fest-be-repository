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

router.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocument);
});

router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customCssUrl:
      "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.0.0/swagger-ui.css",
    customJs: [
      "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.0.0/swagger-ui-bundle.js",
      "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.0.0/swagger-ui-standalone-preset.js",
    ],
  })
);

export default router;
