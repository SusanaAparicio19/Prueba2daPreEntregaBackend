import { Schema,model } from 'mongoose';

const productSchema = new Schema({
    id: { type: String, required: true },
    quantity: { type: Number, required: true },
},{
    strict:'throw',
    versionKey: false,
});

const cartsSchema = new Schema({
    _id: { type: String, required: true },
    products: [ productSchema ]
},{
    strict:'throw',
    versionKey: false,
});

export const dbCarts= model('carts', cartsSchema)