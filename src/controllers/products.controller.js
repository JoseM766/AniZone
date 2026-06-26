import { ProductManagerMongo } from "../dao/mongo/ProductManagerMongo.js";

const manager = new ProductManagerMongo();

export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, query, sort } = req.query;
    const result = await manager.getProducts({ limit, page, query, sort });

    const buildLink = (p) =>
      p
        ? `${req.protocol}://${req.get("host")}/api/products?page=${p}&limit=${limit}${query ? `&query=${query}` : ""}${sort ? `&sort=${sort}` : ""}`
        : null;

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: buildLink(result.prevPage),
      nextLink: buildLink(result.nextPage),
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await manager.getProductById(req.params.pid);
    res.json({ status: "success", payload: product });
  } catch (error) {
    res.status(404).json({ status: "error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({
        status: "error",
        error: "Faltan campos obligatorios: title, description, code, price, stock, category",
      });
    }

    const product = await manager.addProduct({
      title, description, code,
      price: parseFloat(price),
      status: status ?? true,
      stock: parseInt(stock),
      category,
      thumbnails: thumbnails ?? [],
    });

    res.status(201).json({ status: "success", payload: product });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updated = await manager.updateProduct(req.params.pid, req.body);
    res.json({ status: "success", payload: updated });
  } catch (error) {
    res.status(404).json({ status: "error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await manager.deleteProduct(req.params.pid);
    res.json({ status: "success", payload: deleted });
  } catch (error) {
    res.status(404).json({ status: "error", error: error.message });
  }
};
