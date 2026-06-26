import { ProductModel } from "../../models/product.model.js";

export class ProductManagerMongo {
  async getProducts({ limit = 10, page = 1, query, sort }) {
    const filter = {};

    if (query) {
      // Filtrar por categoría o disponibilidad
      if (query === "true" || query === "false") {
        filter.status = query === "true";
      } else {
        filter.category = query;
      }
    }

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
      lean: true,
    };

    const result = await ProductModel.paginate(filter, options);
    return result;
  }

  async getProductById(id) {
    const product = await ProductModel.findById(id).lean();
    if (!product) throw new Error(`Producto con ID ${id} no encontrado`);
    return product;
  }

  async addProduct(data) {
    const product = await ProductModel.create(data);
    return product;
  }

  async updateProduct(id, data) {
    // No permitir modificar el _id
    delete data._id;
    const updated = await ProductModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) throw new Error(`Producto con ID ${id} no encontrado`);
    return updated;
  }

  async deleteProduct(id) {
    const deleted = await ProductModel.findByIdAndDelete(id);
    if (!deleted) throw new Error(`Producto con ID ${id} no encontrado`);
    return deleted;
  }
}
