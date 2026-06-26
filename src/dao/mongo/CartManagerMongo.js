import { CartModel } from "../../models/cart.model.js";

export class CartManagerMongo {
  async createCart() {
    const cart = await CartModel.create({ products: [] });
    return cart;
  }

  async getCartById(id) {
    const cart = await CartModel.findById(id).populate("products.product").lean();
    if (!cart) throw new Error(`Carrito con ID ${id} no encontrado`);
    return cart;
  }

  async addProductToCart(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado`);

    const existingItem = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado`);

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    return cart;
  }

  async updateCart(cartId, products) {
    const cart = await CartModel.findByIdAndUpdate(
      cartId,
      { products },
      { new: true, runValidators: true }
    ).populate("products.product");
    if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado`);
    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado`);

    const item = cart.products.find(
      (item) => item.product.toString() === productId
    );
    if (!item) throw new Error(`Producto no encontrado en el carrito`);

    item.quantity = quantity;
    await cart.save();
    return cart;
  }

  async clearCart(cartId) {
    const cart = await CartModel.findByIdAndUpdate(
      cartId,
      { products: [] },
      { new: true }
    );
    if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado`);
    return cart;
  }
}
