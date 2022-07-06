import { Helmet } from "react-helmet-async";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom"

export default function SiginScreen() {
    const { search } = useLocation();
    /* Redirect in the url  by instance  seeing from  url seacrh params and passing the search object to this  */
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    /* if  url exist set it in the redirect  otherwise default  */
    const redirect = redirectInUrl ? redirectInUrl : '/';

    return (
        <Container classname="small-container">
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <h1 className="my-3">Sign in</h1>
            <Form>
                {/* email */}
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    {/* input */}
                    <Form.Control type="email" required />
                </Form.Group>

                {/* password */}
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    {/* input */}
                    <Form.Control type="password" required />
                </Form.Group>

                {/* submit */}
                <div className="mb-3">
                    <Button type="submit">Sign In</Button>
                </div>

                {/* New Customer */}
                <div className="mb-3">
                    New customer?{' '}
                    <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
                </div>
            </Form>
        </Container>
    )
}