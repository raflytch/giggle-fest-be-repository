import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerDocument = YAML.load(join(__dirname, "../docs/swagger.yml"));

const router = Router();

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
