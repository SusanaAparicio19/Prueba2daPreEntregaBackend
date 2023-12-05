import { randomUUID } from 'crypto'
import { dbCarts } from './models/carts.mongoose.js'

export class CartsManager {
 
  async createCart(datosCart) {
    datosCart._id = randomUUID()
    const cart = await dbCarts.create(datosCart)
    return cart.toObject()
}

async findAll(){
    return await dbCarts.find().lean()
}

async getCartById(cartId) {
    const buscada = await dbCarts.findById(cartId).populate('product.id').lean();
    if (!buscada) {
      throw new Error('id no encontrado')
    }
    return buscada;
  }

async addProductToCart(cartId, productId) {
    try {
      const cart = await dbCarts.findById(cartId).lean();
  
      if (!cart) {
        throw new Error('Carrito no encontrado');
      } else {
        const existingProduct = cart.products.find(product => product.id === productId);
  
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          cart.products.push({ id: productId, quantity: 1 });
        }
  
        const updatedCart = await dbCarts.findByIdAndUpdate(cartId, { products: cart.products }, { new: true }).populate('products.id').lean();
        console.log('Producto agregado con éxito');
        return updatedCart;
      }
    } catch (error) {
      console.error('Error al agregar producto:', error.message);
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await dbCarts.findById(cartId).lean();

      if (!cart) {
        throw new Error('Carrito no encontrado');
      } else {
        const existingProduct = cart.products.find(product => product.id === productId);

        if (existingProduct) {
          existingProduct.quantity = quantity;
         
          const updatedCart = await dbCarts.findByIdAndUpdate(cartId, { products: cart.products }, { new: true }).populate('products.id').lean();
          console.log('Cantidad de producto actualizada con éxito');
          return updatedCart;
        } else {
          throw new Error('Producto no encontrado en el carrito');
        }
      }
    } catch (error) {
      console.error('Error al actualizar cantidad del producto:', error.message);
      throw error;
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await dbCarts.findById(cartId).lean();

      if (!cart) {
        throw new Error('Carrito no encontrado');
      } else {
        cart.products = cart.products.filter(product => product.id !== productId);
       
        const updatedCart = await dbCarts.findByIdAndUpdate(cartId, { products: cart.products }, { new: true }).populate('products.id').lean();
        console.log('Producto eliminado del carrito con éxito');
        return updatedCart;
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error.message);
      throw error;
    }
  }

  async deleteAllProductsFromCart(cartId) {
    try {
      
      const updatedCart = await dbCarts.findByIdAndUpdate(cartId, { products: [] }, { new: true }).populate('products.id').lean();
      console.log('Todos los productos del carrito han sido eliminados');
      return updatedCart;
    } catch (error) {
      console.error('Error al eliminar todos los productos del carrito:', error.message);
      throw error;
    }
  }

  async updateCart(cartId, updatedProducts) {
    try {
      
      const updatedCart = await dbCarts.findByIdAndUpdate(cartId, { products: updatedProducts }, { new: true }).populate('products.id').lean();
      console.log('Carrito actualizado con éxito');
      return updatedCart;
    } catch (error) {
      console.error('Error al actualizar carrito:', error.message);
      throw error;
    }
  }

  async getProductsFromCart(cartId) {
      const cart = await dbCarts.getCartById(cartId).populate('products.id').lean();
      return cart ? cart.products : [];
    }
 
}
 
 