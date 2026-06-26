import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, "../../../data/carts.json");

export class CartManagerFS {
  async #readData() {
    try {
      const data = await readFile(DATA_PATH, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async #writeData(carts) {
    await writeFile(DATA_PATH, JSON.stringify(carts, null, 2));
  }

  async createCart() {
    const carts = await this.#readData();
    const newCart = { id: Date.now().toString(), products: [] };
    carts.push(newCart);
    await this.#writeData(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.#readData();
    const cart = carts.find((c) => c.id === id);
    if (!cart) throw new Error(`Carrito con ID ${id} no encontrado`);
    return cart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.#readData();
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado`);

    const existing = cart.products.find((p) => p.product === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await this.#writeData(carts);
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const carts = await this.#readData();
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado`);
    cart.products = cart.products.filter((p) => p.product !== productId);
    await this.#writeData(carts);
    return cart;
  }

  async updateCart(cartId, products) {
    const carts = await this.#readData();
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado`);
    cart.products = products;
    await this.#writeData(carts);
    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const carts = await this.#readData();
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado`);
    const item = cart.products.find((p) => p.product === productId);
    if (!item) throw new Error(`Producto no encontrado en el carrito`);
    item.quantity = quantity;
    await this.#writeData(carts);
    return cart;
  }

  async clearCart(cartId) {
    const carts = await this.#readData();
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado`);
    cart.products = [];
    await this.#writeData(carts);
    return cart;
  }
}
