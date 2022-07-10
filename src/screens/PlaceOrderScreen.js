import React, { useEffect, useContext } from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from 'react-bootstrap/esm/Button';
import ListGroup from "react-bootstrap/ListGroup";
import { Link, useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';


const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { cart, userInfo } = state;


    /* nuber to 2 deciam point */
    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100 //123.2345=>123.23
    /*  applying round to item Price*/
    cart.itemsPrice = round2(
        cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    );
    /* if itemprice greaterThen 100  round2(0)(add deciaaml point 0) otherwise round2(10) (add deciaml point 10 ) */
    cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);

    /* adding 15%  tax to itemPrice */
    cart.taxPrice = round2(0.15 * cart.itemsPrice);

    /*  adding itemPrice +shippingprice+ taxprice*/
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;


    const placeOrderHandler = async () => {

    }


    useEffect(() => {
        if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart, navigate])


    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
            <Helmet>
                <title>Preview Order</title>
            </Helmet>
            <h1>Previwe Order</h1>
            <Row>
                <Col md={8}>
                    {/* Shpping details  */}
                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Shipping</Card.Title>
                            <Card.Text>
                                <strong>Name:</strong>{cart.shippingAddress.fullName}<br />
                                <strong>Address:</strong>{cart.shippingAddress.address},
                                {cart.shippingAddress.city},
                                {cart.shippingAddress.postalCode},
                                {cart.shippingAddress.country}
                            </Card.Text>
                            <Link to="/shipping">Edit</Link>
                        </Card.Body>
                    </Card>

                    {/*  Payemnt Details */}
                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Payemnt</Card.Title>
                            <Card.Text>
                                <strong>Method:</strong>{cart.paymentMethod}
                            </Card.Text>
                            <Link to="/payment">Edit</Link>
                        </Card.Body>
                    </Card>

                    {/* order  item  details */}
                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Items</Card.Title>
                            <ListGroup variant="flush">
                                {cart.cartItems.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className="align-items-center">
                                            {/* item Image & name */}
                                            <Col md={6}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="img-fluid rounded img-thumbnail"
                                                ></img>{' '}
                                                <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                            </Col>
                                            {/* item quantity */}
                                            <Col md={3}>
                                                <span>{item.quantity}</span>
                                            </Col>
                                            {/* item Price */}
                                            <Col md={3}>${item.price}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <Link to="/cart">Edit</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Order Summary</Card.Title>
                            <ListGroup variant="flush">
                                {/* itemPrice */}
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Item
                                        </Col>
                                        <Col>
                                            <Col>${cart.itemsPrice.toFixed(2)}</Col>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {/*  Shipping details*/}
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${cart.shippingPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>

                                {/*  Tax details*/}
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${cart.taxPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>

                            {/*  Order Total*/}
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        <strong> Order Total</strong>
                                    </Col>
                                    <Col>
                                        <strong>${cart.totalPrice.toFixed(2)}</strong>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            {/*   button */}
                            <ListGroup.Item>
                                <div className="d-grid">
                                    <Button
                                        type="button"
                                        onClick={placeOrderHandler}
                                        disabled={cart.cartItems.length === 0}
                                    >
                                        Place Order
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <h1>PlaceOrderScreen</h1>
        </div>
    );
}

export default PlaceOrderScreen;
