import { Router } from "express";
import { ProductManagerMongo } from '../ProductManagerMongo.js';

export const productsRouter = Router();
const ProdMan = new ProductManagerMongo();


productsRouter.get('/', async (request, response) => {
  try {
      const { limit = 10, page = 1, sort, query } = request.query;

      const products = await ProdMan.getProducts({ limit, page, sort, query });

      const totalPages = Math.ceil(products.total / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      const result = {
          status: 'success',
          payload: products.results,
          totalPages,
          prevPage: hasPrevPage ? page - 1 : null,
          nextPage: hasNextPage ? page + 1 : null,
          page: page,
          hasPrevPage,
          hasNextPage,
          prevLink: hasPrevPage ? `/products?limit=${limit}&page=${page - 1}` : null,
          nextLink: hasNextPage ? `/products?limit=${limit}&page=${page + 1}` : null
      };

      response.json(result);
  } catch (error) {
      console.log(error);
      response.status(500).json({ status: 'error', message: 'Error al recibir los productos' });
  }
});

/*

productsRouter.get('/', async (request, response) => {
    try {
        const prd = await ProdMan.getProducts();
        const products = await JSON.parse(prd);

        const limit = parseInt(request.query.limit);

        if (!isNaN(limit)) {
            return response.json(products.slice(0, limit));
        } else {
            return response.json(products);
        }
    } catch (error) {
        console.log(error);
        response.send(`Error al recibir los productos`);
    }
});
*/
productsRouter.get('/:pid', async (request, response) => {
    const id = parseInt(request.params.pid);    
    try {
      const prdId = await ProdMan.getProductById(id);
      response.json(prdId);
      
    } catch (error) {
        console.log(error);
        response.send(`Error al recibir el producto con Id ${id}`);
    }
  });

 productsRouter.post('/', async (request, response) => {
    const { category, object, title, description, code, stock, status, price } = request.body;
    try {
      const newProduct = await ProdMan.addProduct({
        category,
        object,
        title,
        description,
        code,
        stock,
        status,
        price,
      });
      
      response.json(newProduct);
    } catch (error) {
      console.log(error);
      response.send(`Error al agregar el producto!!`);
    }
  });

  productsRouter.put('/:pid', async (request, response) => {
    const id = parseInt(request.params.id);    
    try {
        const { category, object, title, description, code, stock, status, price } = request.body;
        const prodUpDate = await ProdMan.updateProduct(id, {category, object, title, description, code, stock, status, price});
        response.json(prodUpDate);
    } catch (error) {
        console.log(error);
        response.send(`Error al editar el producto con Id ${id}`);
    }
  });

  productsRouter.delete('/:pid', async (request, response) => {
    const id = parseInt(request.params.id);    
    try {
        await ProdMan.deleteProduct(id);
        response.send(`Producto eliminado`);
    } catch (error) {
        console.log(error);
        response.send(`Error al eliminar el producto con Id ${id}`);
    }
  });


