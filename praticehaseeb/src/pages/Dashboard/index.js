import React from "react";
import {Routes, Route } from "react-router-dom";

import AllShowEvents from "./AllShowEvents";



export default function index() {
  return (
    <>
      

      <Routes>
 <Route path="/AllShowEvents" element={<AllShowEvents/>}/>
      
     
      </Routes>
      
    </>
  );
}
