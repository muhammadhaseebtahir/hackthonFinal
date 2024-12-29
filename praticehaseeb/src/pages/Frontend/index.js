import React from "react";
import {Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import ShowEvents from "./ShowEvents/ShowEvents";
import Header from "../../component/Header"
import Footer from "../../component/Footer"


export default function index() {
  return (
    <>
      <Header/>
      <main>

      <Routes>
      <Route index element={<Home/>} />
      <Route path="/ShowEvents" element={<ShowEvents/>} />
      
     
      </Routes>
      </main>

     <Footer/>
    </>
  );
}
