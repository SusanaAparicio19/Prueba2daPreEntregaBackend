import express from 'express';
import { engine } from 'express-handlebars';
import { ProductManagerMongo } from './ProductManagerMongo.js';
import { CartsManager } from './CartsManagerMongo.js';
import { PORT, MONGODB_CNX_STR } from './config.js';
import { productsRouter } from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import mongoose from 'mongoose';

export const ProdMan = new ProductManagerMongo({ path: './db/products.json' });
export const cartsManager = new CartsManager();

await mongoose.connect(MONGODB_CNX_STR)
console.log(`Base de Datos Conectada`)

const app = express();

app.listen(PORT, async () => {
  console.log(`Conectado al puerto ${PORT}`);
});

app.engine('handlebars', engine())
app.set('views', './views')
app.set(`view engine`, 'handlebars')

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => {
  response.sendFile('index.html', { root: 'views' });
});


