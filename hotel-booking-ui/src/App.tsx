import React from 'react';
import {Route, BrowserRouter as Router, Routes, Link} from "react-router-dom";
import HomePage from './components/HomePage';
import MyBookings from "./components/MyBookings";
import MyBookingsToolbar from "./components/MyBookingsToolbar";
import {Container} from "@mui/material";

function App() {
    return (
        <Router>
            <MyBookingsToolbar />
            <Container maxWidth="lg" sx={{ maxWidth: 1300, mt: 2 }}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/my-bookings" element={<MyBookings />} />
            </Routes>
            </Container>
        </Router>

    );
}

export default App;
