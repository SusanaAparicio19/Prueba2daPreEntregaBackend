import { Router } from 'express';
import { CartsManager } from '../CartsManagerMongo.js';

const cartsRouter = Router();

const cartsManager = new CartsManager();


cartsRouter.get('/', async (req, res) => {
  try {
    const carts = await cartsManager.findAll(); 
    res.json(carts);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

cartsRouter.post('/', async (req, res) => {
  try {
    const newCart = await cartsManager.createCart(req.body);
    res.json(newCart);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

cartsRouter.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartsManager.getCartById(cartId);
    res.json(cart);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

cartsRouter.get('/:cid/products', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const products = await cartsManager.getProductsFromCart(cartId);
    res.json(products);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = parseInt(req.body.quantity);

  try {
    const updatedCart = await cartsManager.addProductToCart(
      cartId,
      productId,
      quantity
    );
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

cartsRouter.put('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const updatedProducts = req.body.products; 

  try {
    const updatedCart = await cartsManager.updateCart(cartId, updatedProducts);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

cartsRouter.put('/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = parseInt(req.body.quantity);

  try {
    const updatedCart = await cartsManager.updateProductQuantity(cartId, productId, quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const updatedCart = await cartsManager.deleteProductFromCart(cartId, productId);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

cartsRouter.delete('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const updatedCart = await cartsManager.deleteAllProductsFromCart(cartId);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});



export default cartsRouter;



