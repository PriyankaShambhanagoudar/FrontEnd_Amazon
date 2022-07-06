import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from "../Store"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import Card from "react-bootstrap/Card";
import axios from 'axios';

export default function CartScreen() {
    const navigate = useNavigate();

    /*   rename  dispatch to  ctxDispatch   useContext= by using usecontext , we can have access to the state of the context  & change the context */
    const { state, dispatch: ctxDispatch } = useContext(Store);

    /*  */
    const {
        cart: { cartItems },
    } = state;
    /* increase & descrease item  */
    const updateHandler = async (item, quantity) => {
        /* get current item quantity from backend  */
        const { data } = await axios.get(`/api/products/${item._id}`);
        /* if  */
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }


        /*  */
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity },
        });


    }
    /*  remove item in the cart */
    const removeItemHandler = (item) => {

        ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
    }

    /* checkout */
    const checkoutHandler = () => {
        navigate('/signin?redirect=/shipping');
    }
    return (
        <div>
            <Helmet>
                <title>Shopping Cart</title>
            </Helmet>
            <h1>Shopping Cart</h1>
            <Row>
                {/* showing list of item */}
                <Col md={8}>
                    {/* if cart length  0 need to show message cart is empty */}
                    {cartItems.length === 0 ? (
                        /*  */
                        <MessageBox>
                            Cart is empty. <Link to="/">Go Shopping</Link>
                        </MessageBox>
                    ) : (
                        /* list of item */
                        <ListGroup>
                            {cartItems.map((item) => (
                                <ListGroup.Item key={item._id}>
                                    <Row className="align-items-center">
                                        <Col md={4}>
                                            {/*  item image*/}
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="img-fluid rounded img-thumbnail"
                                            ></img>

                                            <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                        </Col>


                                        {/* button Increase & decrease product quantity  */}
                                        <Col md={3}>
                                            {/* Decrease item quantity */}
                                            <Button
                                                onClick={() => updateHandler(item, item.quantity - 1)}
                                                variant="light" disabled={item.quantity === 1}>
                                                <i className="fas fa-minus-circle"></i>
                                            </Button>

                                            <span>{item.quantity}</span>
                                            {/* Increase item quantity */}
                                            <Button
                                                variant="light"
                                                onClick={() => updateHandler(item, item.quantity + 1)}
                                                disabled={item.quantity === item.countInStock}
                                            >
                                                <i className="fas fa-plus-circle"></i>
                                            </Button>
                                        </Col>

                                        <Col md={3}>${item.price}</Col>
                                        {/*  remove item*/}
                                        <Col md={2}>
                                            {/*remove item in cart  */}
                                            <Button
                                                onClick={() => removeItemHandler(item)}
                                                variant="light">
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                {/*action part(CHECKOUT)  */}
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    {/*    Total price and quantity  */}
                                    <h3>
                                        Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                                        items) : $
                                        {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                                    </h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    {/*checkout button  */}
                                    <div className="d-grid">
                                        <Button
                                            onClick={() => checkoutHandler()}
                                            type="button"
                                            variant="primary"
                                            disabled={cartItems.length === 0}
                                        >
                                            Proceed to Checkout
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}