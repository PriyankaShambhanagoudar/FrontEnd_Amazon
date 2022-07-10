import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  /*/////////////////////////////////////////////////////////// userInfo///////////////////////////////////////////////////////// */

  /* get userInfo   from localStorage  */
  userInfo: localStorage.getItem('userInfo')
    /*  if its exist convert to json parse (userInfo) */
    ? JSON.parse(localStorage.getItem('userInfo'))
    /* otherwise set it to empty object */
    : null,



  cart: {
    /*/////////////////////////////////////////////////////////// shippingAddress///////////////////////////////////////////////////////// */

    /* get shippingAddress   from localStorage */
    shippingAddress: localStorage.getItem('shippingAddress')
      /*  if its exist convert to json parse (shippingAddress) */
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      /* otherwise set it to null */
      : {},


    /*/////////////////////////////////////////////////////////// paymentMethod///////////////////////////////////////////////////////// */

    /* get paymentMethod   from localStorage */
    paymentMethod: localStorage.getItem('paymentMethod')
      /*  if its exist convert to json parse (paymentMethod) */
      ? localStorage.getItem('paymentMethod')
      /* otherwise set it to empty string */
      : '',

    /*/////////////////////////////////////////////////////////// cartItems///////////////////////////////////////////////////////// */


    /*  if cart item exist in local  storage  */
    cartItems: localStorage.getItem('cartItems')
      /*  use json that power convert to  this  history to js  */
      ? JSON.parse(localStorage.getItem('cartItems'))
      /* otherwise empty array */
      : [],
  },
};
function reducer(state, action) {
  switch (action.type) {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    case 'CART_ADD_ITEM':
      // add to cart

      /* adding the cart to new item */
      const newItem = action.payload;

      /*  get exist item */
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );

      /*  if alreday have item in the cart  & we need to update the  current  item with new item  that we got from action payload  otherwise  keep previous item in the cart    */
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
          item._id === existItem._id ? newItem : item
        )
        /*  it exist item null  we need to add new item  */
        : [...state.cart.cartItems, newItem];

      //storing item in the local storage 
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      /*  {this object keep  all values in field,   cart= keep all previous  values in the cart objects  in the state  and only update cartitems }  */
      return { ...state, cart: { ...state.cart, cartItems } };


    //remove item in the cart 

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    case 'CART_REMOVE_ITEM': {
      /* if the item id does not qual to to current id return it otherwise remove it   */
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      //storing item in the local storage 
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      /*  {this object keep  all values in field,   cart= keep all previous  values in the cart objects  in the state  and only update cartitems }  */
      return { ...state, cart: { ...state.cart, cartItems } }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    case 'CART_CLEAR':
      return {
        /* previous state  */
        ...state,
        /* previous state of the cart & adding cartItem to empty array(removing all the item from cart ) */
        
        cart: { ...state.cart, cartItems: [] },
      }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    case 'USER_SIGNIN':
      /*previous state & update the user info based one the data we got from back end (data)  */
      return { ...state, userInfo: action.payload };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    case 'USER_SIGNOUT':
      /* previous state & userInfo null */
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
        }
      }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //save shpping address
    case "SAVE_SHIPPING_ADDRESS":
      return {
        /*  previous stat*/
        ...state,
        /* taking only shpping address */
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        }
      }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //payment
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      }

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
