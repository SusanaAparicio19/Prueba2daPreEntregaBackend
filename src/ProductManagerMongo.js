import { randomUUID } from 'crypto'
import { dbProducts } from './models/products.mongoose.js'

export class ProductManagerMongo {
 
  async addProduct(datosProducto) {
    datosProducto._id = randomUUID()
    const product = await dbProducts.create(datosProducto)
    return product.toObject()
  } 
 
  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    const skip = (page - 1) * limit;
    const filter = query ? { $or: [{ category: query }, { status: query }] } : {};

    let queryObj = dbProducts.find(filter).skip(skip).limit(limit).lean();
    
    if (sort === 'asc' || sort === 'desc') {
        queryObj = queryObj.sort({ price: sort });
    }

    const results = await queryObj;
    const total = await dbProducts.countDocuments(filter);

    return { results, total };
  }


  async getProductById(id) {
    const buscada = await dbProducts.findById(id).lean()
    if (!buscada) {
      throw new Error(`Producto no encontrado`)
    }
    return buscada  
  }

  async updateProduct(id, updatedFields) {
    const modificada = await dbProducts.findByIdAndUpdate(id,
      { $set: updatedFields},
      { new: true})
      .lean()

      if (!modificada) {
        throw new Error(`Producto no encontrado`)
      }
      return modificada 
  }
    

  async deleteProduct(id) {
    const borrada = await dbProducts.findByIdAndDelete(id).lean()

      if (!borrada) {
        throw new Error(`Producto no encontrado`)
      }
      return borrada 
  }
}
