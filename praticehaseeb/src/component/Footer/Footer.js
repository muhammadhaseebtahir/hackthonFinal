import React from 'react';
import { Row, Col, Typography, Space, Button } from 'antd';
import { FaInstagram, FaPinterest, FaWhatsapp } from 'react-icons/fa';
import footer_logo from "../../component/Asset/event.webp";

const { Text } = Typography;

export default function Footer() {
  const getFullyear = new Date().getFullYear();

  return (
    <footer className='bg-body-tertiary' style={{  padding: '20px 0' }}>
      <div className="container">
        {/* Footer Logo Section */}
        <Row justify="center" align="middle" style={{ marginBottom: '20px' }}>
          <Col className="footer-logo" style={{ textAlign: 'center' }}>
            <img src={footer_logo} alt="Logo" style={{ maxWidth: '250px', marginBottom: '10px',borderRadius:"100%" }} />
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#15616d' }}>MeetUp<span style={{ fontFamily: "inherit" }}> Hub.</span></h2>
          </Col>
        </Row>

        {/* Footer Links Section */}
        <Row justify="center" align="middle">
          <Col>
            <Space size="large">
              <Button type="link" style={{ padding: 0, color: '#15616d' }}>Company</Button>
              <Button type="link" style={{ padding: 0, color: '#15616d' }}>Products</Button>
              <Button type="link" style={{ padding: 0, color: '#15616d' }}>Offices</Button>
              <Button type="link" style={{ padding: 0, color: '#15616d' }}>About</Button>
              <Button type="link" style={{ padding: 0, color: '#15616d' }}>Contact</Button>
            </Space>
          </Col>
        </Row>

        {/* Social Icons Section */}
        <Row justify="center" align="middle" style={{ marginTop: '20px' }}>
          <Col>
            <Space size="middle">
              <Button icon={<FaInstagram />} shape="circle" size="large" style={{ borderColor: '#15616d' }} />
              <Button icon={<FaPinterest />} shape="circle" size="large" style={{ borderColor: '#15616d' }} />
              <Button icon={<FaWhatsapp />} shape="circle" size="large" style={{ borderColor: '#15616d' }} />
            </Space>
          </Col>
        </Row>

        {/* Footer Bottom Section */}
        <Row justify="center" align="middle" style={{ marginTop: '30px' }}>
          <Col>
            <Text type="secondary" style={{ fontSize: '14px', color: '#6c757d' }}>&copy; {getFullyear} All rights reserved.</Text>
          </Col>
        </Row>
      </div>
    </footer>
  );
}
