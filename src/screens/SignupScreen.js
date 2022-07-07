import { useContext, useEffect, useState } from 'react';
import { Helmet } from "react-helmet-async";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom"
import Axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';




export default function SiginupScreen() {
    const navigate = useNavigate();
    const { search } = useLocation();
    /* Redirect in the url  by instance  seeing from  url seacrh params and passing the search object to this  */
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    /* if  url exist set it in the redirect  otherwise default  */
    const redirect = redirectInUrl ? redirectInUrl : '/';


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { state, dispatch: ctxDispatch } = useContext(Store);

    const { userInfo } = state;

    /* submit  */
    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }


        try {
            const { data } = await Axios.post('/api/users/signup', {
                name,
                email,
                password,

            });
            /* after login dispatching the action */
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            //console.log(data);

            /* data adding to localstorage 
            key is userInfo & we get data from backend convert to json stringify
            */
            localStorage.setItem('userInfo', JSON.stringify(data));

            navigate(redirect || '/');
        } catch (err) {
            // alert('Invalid email or password')\
            /*  error  message  */
            toast.error(getError(err))
        }
    }

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo])


    return (
        <Container className="small-container">
            <Helmet>
                <title>Sign Up</title>
            </Helmet>
            <h1 className="my-3">Sign Up</h1>
            <Form onSubmit={submitHandler} >
                {/* name */}
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Name</Form.Label>
                    {/* input */}
                    <Form.Control type="email" required onChange={(e) => setName(e.target.value)} />
                </Form.Group>

                {/* email */}
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    {/* input */}
                    <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                {/* password */}
                <Form.Group className="mb-3" controlId="password" onChange={(e) => setPassword(e.target.value)}>
                    <Form.Label>Password</Form.Label>
                    {/* input */}
                    <Form.Control type="password" required />
                </Form.Group>


                {/*Confirm password */}
                <Form.Group className="mb-3" controlId="password" onChange={(e) => setConfirmPassword(e.target.value)}>
                    <Form.Label>Confirm Password</Form.Label>
                    {/* input */}
                    <Form.Control type="password" required />
                </Form.Group>


                {/* submit */}
                <div className="mb-3">
                    <Button type="submit">Sign Up</Button>
                </div>

                {/*  Already have an account */}
                <div className="mb-3">
                    Already have an account?{' '}
                    <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
                </div>
            </Form>
        </Container>
    )
}