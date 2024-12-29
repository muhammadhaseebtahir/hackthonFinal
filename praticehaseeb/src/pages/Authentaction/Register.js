// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom';

// import {Row,Col,Input,Form,Typography, Button, message} from "antd"
// import { LockOutlined, UserOutlined,MailOutlined } from "@ant-design/icons";

// import { auth, fireStore } from '../../config/firebase';
// import { createUserWithEmailAndPassword } from 'firebase/auth';

// import { isEmail } from '../../config/global';
// import { doc, setDoc } from 'firebase/firestore';
// import { useAuthContext } from '../../context/AuthContext';


// const {Title} = Typography;
// const initialize= {fullName:"",email:"",password:""}

// export default function Register() {
//   const {dispatch} =useAuthContext()
//   const navigate =useNavigate()
//   const [state ,setState] =useState(initialize)
//   const [isProcessing,setIsProcessing] = useState(false)

//   const handleChange =(e)=>{
//     setState(s=> ({...s,[e.target.name]:e.target.value}));
//   }

//   const handleSubmit =(e)=>{
//   e.preventDefault()

// let {fullName,email,password} = state;
// fullName = fullName.trim()
// if (fullName.length < 3) { return   message.error("Please enter your full name"); }
// if (!isEmail(email)) { return message.error("Please enter a valid email address.") }
// if (password.length<3) { return message.error("Password must be at least 6 characters long.") }

// setIsProcessing(true)
// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed up 
//     const user = userCredential.user;
//     creatUserProfile(user)
//     message.success("A user has been successfully reagister")
//     // ...
//   })
//   .catch((error) => {
//     // const errorCode = error.code;
//     // const errorMessage = error.message;
//     switch(error.code){
//       case "auth/email-already-in-use":
//         message.error("Email already in register");break;
//         default :message.error("Something went wrong while creating new user")
//     }
//   }).finally(()=>{
//     setIsProcessing(false)
//     setState(initialize)
//   })

//   }

// const creatUserProfile =async(userCredential)=>{
// const {uid} =userCredential
// const {fullName,email} = state
// const user ={
//   fullName,email,uid,status:"active",role:["customer"]
// }
// await setDoc(doc(fireStore, "user", uid), user);
// dispatch({type:"SET_LOGGED_IN",payload:{user}})
// navigate("/")
// }



//   return (
   
//     <main>
//       <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light ">
//         <div className="card shadow p-3" style={{width:500}}>
//           <Title level={2} className="text-center py-2">Register</Title>
//           <Form>
//         <Row gutter={[20,20]} >
//           <Col size="large" span={20} offset={2}>
//       <Input  prefix={<UserOutlined />} placeholder='Enter your name' onChange={handleChange} value={state.fullName} name="fullName"/>     
         
//           </Col>
//           <Col  span={20} offset={2}>
//       <Input size="large" prefix={<MailOutlined />} placeholder='Enter your email'  onChange={handleChange} value={state.email} name="email"/>     
         
//           </Col>
//           <Col span={20} offset={2}>
//       <Input.Password  size="large" prefix={<LockOutlined />} placeholder='Enter your password'  onChange={handleChange} value={state.password} name="password"/>     
         
//           </Col>
//           <Col span={20} offset={2}>
//       <Button type='primary' size="large" block  onClick={handleSubmit} loading={isProcessing} >Register</Button>
//           </Col>
//         </Row>             
//       </Form>
//       <Row>
//         <Col span={24}>
//         <p className='text-center pt-2'>Already Have an Account? <Link to="/auth/login">Login</Link> </p>
//         </Col>
//       </Row> 
//         </div>
//       </div>
//       </main>
   

//   )
// }


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Input, Form, Typography, Button, message } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { useAuthContext } from '../../context/AuthContext';

const { Title } = Typography;
const initialize = { fullName: '', email: '', password: '' };

export default function Register() {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [state, setState] = useState(initialize);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let { fullName, email, password } = state;
    fullName = fullName.trim();
    if (fullName.length < 3) {
      return message.error('Please enter your full name');
    }
    if (!isEmail(email)) {
      return message.error('Please enter a valid email address.');
    }
    if (password.length < 3) {
      return message.error('Password must be at least 6 characters long.');
    }

    setIsProcessing(true);

    // Update the API URL to the one provided
    axios
      .post('https://backend-s9y6.vercel.app/auth/register', { fullName, email, password })
      .then((response) => {
        const { token, user } = response.data;
        localStorage.setItem('authToken', token); // Store JWT in localStorage
        dispatch({ type: 'SET_LOGGED_IN', payload: { user } });
        message.success('A user has been successfully registered');
        navigate('/');
      })
      .catch((error) => {
        console.error(error);
        message.error(error.response ? error.response.data.message : 'Something went wrong');
      })
      .finally(() => {
        setIsProcessing(false);
        setState(initialize);
      });
  };

  const isEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  return (
    <main>
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light ">
        <div className="card shadow p-3" style={{ width: 500 }}>
          <Title level={2} className="text-center py-2">Register</Title>
          <Form>
            <Row gutter={[20, 20]}>
              <Col size="large" span={20} offset={2}>
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your name"
                  onChange={handleChange}
                  value={state.fullName}
                  name="fullName"
                />
              </Col>
              <Col span={20} offset={2}>
                <Input
                  size="large"
                  prefix={<MailOutlined />}
                  placeholder="Enter your email"
                  onChange={handleChange}
                  value={state.email}
                  name="email"
                />
              </Col>
              <Col span={20} offset={2}>
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                  onChange={handleChange}
                  value={state.password}
                  name="password"
                />
              </Col>
              <Col span={20} offset={2}>
                <Button type="primary" size="large" block onClick={handleSubmit} loading={isProcessing}>
                  Register
                </Button>
              </Col>
            </Row>
          </Form>
          <Row>
            <Col span={24}>
              <p className="text-center pt-2">
                Already Have an Account? <Link to="/auth/login">Login</Link>
              </p>
            </Col>
          </Row>
        </div>
      </div>
    </main>
  );
}

