import React from "react";

import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Blogs from "./pages/Blogs";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Notification from "./pages/Notification";
import Orders from "./pages/Orders";
import Manage from "./pages/Manage";
import DetailedOrder from "./pages/Order/DetailedOrder";
import Payment from "./pages/Payment/payment";
import UserDetails from "./pages/User/UserDetails";
import Support from "./pages/Support";


export default function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          {/* <Route path="/" exact element={<Home/>} /> */}
          {/* <Route path="/manage" element={<Manage/>} /> */}
          {/* <Route path="/blogs" element={<Blogs/>} /> */}
          {/* <Route path="/notification" element={<Notification />} /> */}

          {/* All Users */}
          {/* <Route path="/users" element={<Users />} /> */}
          {/* <Route path="/user/:userId" element={<UserDetails />} /> */}

          {/* All Order Based Route */}
          <Route path="/" element={<Orders />} />
          <Route path="/order/:orderId" element={<DetailedOrder />} />


          {/* All Payment Details */}
          {/* <Route path="/offers" element={<Payment />} /> */}
          <Route path="/support" element={<Support />} />
        </Routes>
      </Router>
    </div>
  );
}
