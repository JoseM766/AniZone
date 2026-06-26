import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

import { connectDB } from "./utils/db.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import { initSocket } from "./utils/socket.js";
import { hbsHelpers } from "./utils/hbsHelpers.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Handlebars
app.engine("handlebars", engine({ helpers: hbsHelpers }));
app.set("view engine", "handlebars");
app.set("views", join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));

// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Rutas Vistas
app.use("/", viewsRouter);

// Socket.io
initSocket(io);

// Conectar DB e iniciar servidor
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🎌 AniZone corriendo en http://localhost:${PORT}`);
  });
});

export { io };
