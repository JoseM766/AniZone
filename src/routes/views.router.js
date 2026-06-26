import { Router } from "express";
import { ProductManagerMongo } from "../dao/mongo/ProductManagerMongo.js";
import { CartManagerMongo } from "../dao/mongo/CartManagerMongo.js";

const router = Router();
const productManager = new ProductManagerMongo();
const cartManager = new CartManagerMongo();

// Listado de productos con paginación
router.get("/products", async (req, res) => {
  try {
    const { limit = 8, page = 1, query, sort } = req.query;
    const result = await productManager.getProducts({ limit, page, query, sort });

    const buildLink = (p) =>
      p ? `/products?page=${p}&limit=${limit}${query ? `&query=${query}` : ""}${sort ? `&sort=${sort}` : ""}` : null;

    res.render("products", {
      title: "AniZone - Catálogo",
      products: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: buildLink(result.prevPage),
      nextLink: buildLink(result.nextPage),
      query: query || "",
      sort: sort || "",
    });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

// Detalle de un producto
router.get("/products/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    res.render("productDetail", {
      title: `AniZone - ${product.title}`,
      product,
    });
  } catch (error) {
    res.status(404).render("error", { error: error.message });
  }
});

// Vista de carrito
router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    const total = cart.products.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    res.render("cart", {
      title: "AniZone - Mi Carrito",
      cart,
      products: cart.products,
      total: total.toFixed(2),
      cartId: req.params.cid,
    });
  } catch (error) {
    res.status(404).render("error", { error: error.message });
  }
});

// Vista en tiempo real (WebSockets)
router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {
    title: "AniZone - Admin en Tiempo Real",
  });
});

// Home
router.get("/", (req, res) => {
  res.redirect("/products");
});

export default router;
