const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true },
        price:{
          type: Number, required: true
        }
        
      }
    ],
    totalPrice:{
      type: Number,default: 0
    }
    
  }
});

userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  let carttotalPrice=this.cart.totalPrice;

  if (cartProductIndex >= 0) {
    
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    newPrice=this.cart.items[cartProductIndex].price + product.price
    updatedCartItems[cartProductIndex].quantity = newQuantity;
    updatedCartItems[cartProductIndex].price=newPrice;
    carttotalPrice=carttotalPrice+product.price
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
      price:product.price
    });
    carttotalPrice=carttotalPrice+product.price
  }
  console.log(carttotalPrice)

  const updatedCart = {
    items: updatedCartItems,
   totalPrice:carttotalPrice
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === productId.toString();
  });
  newPrice=this.cart.items[cartProductIndex].price
  this.cart.items = updatedCartItems;
  const carttotalPrice= this.cart.totalPrice-newPrice
  this.cart.totalPrice=carttotalPrice;
  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart = { items: [] ,totalPrice:0};
  return this.save();
};

module.exports = mongoose.model('User', userSchema);