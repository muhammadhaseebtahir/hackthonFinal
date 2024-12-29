// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom';

// import {Row,Col,Input,Form,Typography, Button, message} from "antd"
// import { LockOutlined, MailOutlined } from "@ant-design/icons";

// import { auth, fireStore } from '../../config/firebase';
// import {  signInWithEmailAndPassword } from 'firebase/auth';

// import { isEmail } from '../../config/global';
// import { doc, getDoc } from 'firebase/firestore';
// import { useAuthContext } from '../../context/AuthContextProvider';


// const {Title} = Typography;
// const initialize= {email:"",password:""}

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

// let {email,password} = state;

// if (!isEmail(email)) { return message.error("Please enter a valid email address.") }
// if (password.length<3) { return message.error("Password must be at least 6 characters long.") }

// setIsProcessing(true)
// signInWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     readUserProfile(user)
//     message.success("SuccessFully Login")
//     // ...
//   })
//   .catch((error) => {
//     // const errorCode = error.code;
//     // const errorMessage = error.message;
//     message.error("Email does not exist Please register her.")
//   }).finally(()=>{
//     setIsProcessing(false)
//     setState(initialize)
//   })

//   }

// const readUserProfile =async(userCredential)=>{
// const {uid} =userCredential
// const docRef = doc(fireStore, "user", uid);
// const docSnap = await getDoc(docRef);

// if (docSnap.exists()) {
//   // console.log("Document data:", docSnap.data());
//   const user =docSnap.data()
//   dispatch({type:"SET_LOGGED_IN",payload:(user)})

// } else {
//   // docSnap.data() will be undefined in this case
//   console.log("No such document!");
// }
// navigate("/")
// }



//   return (
   
//     <main>
//       <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light ">
//         <div className="card shadow p-3" style={{width:500}}>
//           <Title level={2} className="text-center py-2">Login</Title>
//           <Form>
//         <Row gutter={[20,20]} >
        
//           <Col  span={20} offset={2}>
//       <Input size="large" prefix={<MailOutlined />} placeholder='Enter your email'  onChange={handleChange} value={state.email} name="email"/>     
         
//           </Col>
//           <Col span={20} offset={2}>
//           <span style={{float:"right"}}><Link>Forgot Password?</Link></span>
//       <Input.Password  size="large" prefix={<LockOutlined />} placeholder='Enter your password'  onChange={handleChange} value={state.password} name="password"/>     
         
//           </Col>
//           <Col span={20} offset={2}>
//       <Button type='primary' size="large" block  onClick={handleSubmit} loading={isProcessing} >Login</Button>
//           </Col>
//         </Row>             
//       </Form>
//       <Row>
//         <Col span={24}>
//         <p className='text-center pt-2'>Creat New Account.  <Link to="/auth/register">Register</Link> </p>
//         </Col>
//       </Row> 
//         </div>
//       </div>
//       </main>
   

//   )
// }

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Input, Form, Typography, Button, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import axios from 'axios';
import { useAuthContext } from '../../context/AuthContext';

const { Title } = Typography;
const initialize = { email: "", password: "" };

export default function Register() {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [state, setState] = useState(initialize);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    setState(s => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let { email, password } = state;
  
    if (!email || !password) {
      return message.error("Please fill in all fields.");
    }
    if (password.length < 6) {
      return message.error("Password must be at least 6 characters long.");
    }
  
    setIsProcessing(true);
  
    try {
      const response = await axios.post('https://backend-s9y6.vercel.app/auth/login', { email, password });
      const { token, user } = response.data;
      console.log(user, token);
  
      // Store token and user data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ type: "SET_LOGGED_IN", payload: (user) });
  
      message.success("Successfully logged in");
      navigate("/");
  
    } catch (error) {
      message.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsProcessing(false);
      setState(initialize);
    }
  };
  return (
    <main>
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light ">
        <div className="card shadow p-3" style={{ width: 500 }}>
          <Title level={2} className="text-center py-2">Login</Title>
          <Form>
            <Row gutter={[20, 20]}>
              <Col span={20} offset={2}>
                <Input size="large" prefix={<MailOutlined />} placeholder='Enter your email' onChange={handleChange} value={state.email} name="email" />
              </Col>
              <Col span={20} offset={2}>
                <span style={{ float: "right" }}><Link to='/auth/ForgotPassword'>Forgot Password?</Link></span>
                <Input.Password size="large" prefix={<LockOutlined />} placeholder='Enter your password' onChange={handleChange} value={state.password} name="password" />
              </Col>
              <Col span={20} offset={2}>
                <Button type='primary' size="large" block onClick={handleSubmit} loading={isProcessing}>Login</Button>
              </Col>
            </Row>
          </Form>
          <Row>
            <Col span={24}>
              <p className='text-center pt-2'>Create New Account. <Link to="/auth/register">Register</Link></p>
            </Col>
          </Row>
        </div>
      </div>
    </main>
  );
}
