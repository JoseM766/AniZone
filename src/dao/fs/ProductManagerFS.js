import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, "../../../data/products.json");

export class ProductManagerFS {
  async #readData() {
    try {
      const data = await readFile(DATA_PATH, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async #writeData(products) {
    await writeFile(DATA_PATH, JSON.stringify(products, null, 2));
  }

  async getProducts({ limit = 10, page = 1, query, sort } = {}) {
    let products = await this.#readData();

    if (query) {
      if (query === "true" || query === "false") {
        products = products.filter((p) => String(p.status) === query);
      } else {
        products = products.filter((p) => p.category === query);
      }
    }

    if (sort) {
      products.sort((a, b) =>
        sort === "asc" ? a.price - b.price : b.price - a.price
      );
    }

    const totalDocs = products.length;
    const totalPages = Math.ceil(totalDocs / limit);
    const start = (page - 1) * limit;
    const docs = products.slice(start, start + parseInt(limit));

    return {
      docs,
      totalDocs,
      totalPages,
      page: parseInt(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }

  async getProductById(id) {
    const products = await this.#readData();
    const product = products.find((p) => p.id === id);
    if (!product) throw new Error(`Producto con ID ${id} no encontrado`);
    return product;
  }

  async addProduct(data) {
    const products = await this.#readData();
    const newProduct = {
      id: Date.now().toString(),
      ...data,
      status: data.status ?? true,
      thumbnails: data.thumbnails ?? [],
    };
    products.push(newProduct);
    await this.#writeData(products);
    return newProduct;
  }

  async updateProduct(id, data) {
    const products = await this.#readData();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Producto con ID ${id} no encontrado`);
    delete data.id;
    products[index] = { ...products[index], ...data };
    await this.#writeData(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.#readData();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Producto con ID ${id} no encontrado`);
    const [deleted] = products.splice(index, 1);
    await this.#writeData(products);
    return deleted;
  }
}
