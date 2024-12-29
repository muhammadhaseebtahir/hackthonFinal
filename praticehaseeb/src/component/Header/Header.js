import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { Button, Space } from "antd";

export default function Header() {
  const { isAuthenticated, user, isAdmin, handleLogout } = useAuthContext(); // Fixed typo here
  const [Admin, setAdmin] = useState();
  console.log("user",user);
  console.log("isAuthenticated", isAuthenticated); 
  console.log("isAdmin", isAdmin); 

  const navigate = useNavigate();

  useEffect(() => {
    let Admin = isAdmin;
    setAdmin(Admin);
  }, [isAuthenticated, user, isAdmin]); // Corrected dependency

  return (
    <header style={{ position: "sticky", zIndex: 1000, top: 0 }}>
      <nav className="navbar navbar-expand-lg bg-body-tertiary shadow">
        <div className="container">
          <Link to="/" style={{ textDecoration: "none" }}>
            <h3 style={{ fontWeight: "bold", color: "black" }}>
              MeetUp<span style={{color:"#15616d",fontFamily:"inherit"}}> Hub.</span>
            </h3>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav m-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" className="nav-link active" aria-current="page">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/ShowEvents" className="nav-link active" aria-current="page">
                ShowEvents
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link active" aria-current="page">
                  Contact
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/shop/cart" className="nav-link active" aria-current="page">
                  Order
                </Link>
              </li>
            </ul>
            <div className="d-flex">
              {!isAuthenticated ? (
                <Button className="text-light bg-primary" onClick={() => navigate("/auth/login")}>
                  Login
                </Button>
              ) : (
                <Space>
                  {!Admin ? (
                    <Button className="text-light bg-primary" onClick={handleLogout}>
                      Logout
                    </Button>
                  ) : (
                    <Space>
                      <Button className="text-light bg-primary" onClick={handleLogout}>
                        Logout
                      </Button>
                      <Button className="text-light bg-primary" onClick={() => navigate("/dashboard/AllShowEvents")}>
                        Dashboard
                      </Button>
                    </Space>
                  )}
                </Space>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
