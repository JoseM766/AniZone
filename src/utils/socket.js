import { ProductManagerMongo } from "../dao/mongo/ProductManagerMongo.js";

const productManager = new ProductManagerMongo();

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);

    // Enviar lista actual al conectarse
    socket.on("getProducts", async () => {
      const result = await productManager.getProducts({});
      socket.emit("productsList", result.docs);
    });

    // Nuevo producto en tiempo real
    socket.on("newProduct", async (productData) => {
      try {
        const newProduct = await productManager.addProduct(productData);
        const result = await productManager.getProducts({});
        io.emit("productsList", result.docs); // broadcast a todos
        io.emit("productAdded", newProduct);
      } catch (error) {
        socket.emit("serverError", { message: error.message });
      }
    });

    // Eliminar producto en tiempo real
    socket.on("deleteProduct", async (pid) => {
      try {
        await productManager.deleteProduct(pid);
        const result = await productManager.getProducts({});
        io.emit("productsList", result.docs);
        io.emit("productDeleted", pid);
      } catch (error) {
        socket.emit("serverError", { message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Cliente desconectado: ${socket.id}`);
    });
  });
};
