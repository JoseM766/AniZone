import { CartManagerMongo } from "../dao/mongo/CartManagerMongo.js";

const manager = new CartManagerMongo();

export const createCart = async (req, res) => {
  try {
    const cart = await manager.createCart();
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cart = await manager.getCartById(req.params.cid);
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(404).json({ status: "error", error: error.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await manager.addProductToCart(cid, pid);
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await manager.removeProductFromCart(cid, pid);
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(404).json({ status: "error", error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const cart = await manager.updateCart(req.params.cid, req.body.products);
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ status: "error", error: "Cantidad inválida" });
    }

    const cart = await manager.updateProductQuantity(cid, pid, parseInt(quantity));
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(404).json({ status: "error", error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await manager.clearCart(req.params.cid);
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(404).json({ status: "error", error: error.message });
  }
};
