import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Input, Form, Typography, Button, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import axios from 'axios'; // Make sure to install axios

const { Title } = Typography;
const initialize = { email: "", newPassword: "", confirmPassword: "" };

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [state, setState] = useState(initialize);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let { email } = state;

    if (!isEmail(email)) {
      return message.error("Please enter a valid email address.");
    }

    setIsProcessing(true);

    // Send the password reset email using the backend API
    axios.post('https://backend-s9y6.vercel.app/auth/forgot-password', { email })
      .then(() => {
        message.success("Password reset email sent!");
      })
      .catch((error) => {
        message.error(`Error: ${error.response.data.message}`);
      })
      .finally(() => {
        setIsProcessing(false);
        navigate("/update-password"); // Redirect to a new page to input the new password
      });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    const { newPassword, confirmPassword, email } = state;

    if (newPassword !== confirmPassword) {
      return message.error("Passwords do not match.");
    }

    setIsProcessing(true);

    try {
      // Send the new password to your backend API to update the password
      const response = await axios.post('https://backend-s9y6.vercel.app/auth/forgot-password', {
        email,
        newPassword,
      });

      message.success('Password updated successfully!');
      navigate('/login'); // Redirect to login after successful password update
    } catch (error) {
      console.error('Error updating password:', error);
      message.error('Failed to update password');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main>
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow p-3" style={{ width: 500 }}>
          <Title level={2} className="text-center py-2">Forgot Password</Title>

          {/* Form to request password reset email */}
          <Form onSubmit={handleSubmit}>
            <Row gutter={[20, 20]}>
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
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleSubmit}
                  loading={isProcessing}
                >
                  Send Reset Email
                </Button>
              </Col>
            </Row>
          </Form>

          {/* Form to update password after receiving reset email */}
          <Form onSubmit={handlePasswordUpdate}>
            <Row gutter={[20, 20]}>
              <Col span={20} offset={2}>
                <Input.Password
                  size="large"
                  placeholder="Enter new password"
                  onChange={handleChange}
                  value={state.newPassword}
                  name="newPassword"
                />
              </Col>
              <Col span={20} offset={2}>
                <Input.Password
                  size="large"
                  placeholder="Confirm new password"
                  onChange={handleChange}
                  value={state.confirmPassword}
                  name="confirmPassword"
                />
              </Col>
              <Col span={20} offset={2}>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handlePasswordUpdate}
                  loading={isProcessing}
                >
                  Update Password
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </main>
  );
}

// Utility function to validate email format
function isEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email);
}
