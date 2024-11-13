import "dotenv/config"; // para que use la configuración por defecto y cargue mis variables de entorno acorde a mi archivo .env
import { get } from "env-var";

export const envs = {
  PORT: get("PORT").required().asPortNumber(),

  /* MONGO DB */
  MONGO_URL: get("MONGO_URL").required().asString(),
  MONGO_DB_NAME: get("MONGO_DB_NAME").required().asString(),
  MONGO_USER: get("MONGO_USER").required().asString(),
  MONGO_PASS: get("MONGO_PASS").required().asString(),
};
