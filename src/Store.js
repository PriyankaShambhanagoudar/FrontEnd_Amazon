import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],



  },
};
function reducer(state, action) {
  switch (action.type) {
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
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      /*  {this object keep  all values in field,   cart= keep all previous  values in the cart objects  in the state  and only update cartitems }  */
      return { ...state, cart: { ...state.cart, cartItems } };


    //remove item in the cart 

    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      /*  {this object keep  all values in field,   cart= keep all previous  values in the cart objects  in the state  and only update cartitems }  */
      return { ...state, cart: { ...state.cart, cartItems } }
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
