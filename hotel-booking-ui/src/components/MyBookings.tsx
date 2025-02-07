import {Box, Grid2, Stack, Typography} from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../service/axiosInstance";
import { Booking } from "../model/Booking";
import BookingItem from "./BookingItem";

const MyBookings = () => {

    const [bookings, setBookings] = useState<Booking[]>([]);

    const fetchBookings = () => {
        axiosInstance
            .get("/bookings")
            .then((res) => setBookings(res.data))
            .catch((error) => console.error("Error fetching hotels:", error));
    };


    useEffect(() => {
        fetchBookings()
    })

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                My Bookings
            </Typography>


            <Stack direction="column" >
                <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {bookings?.map((booking, index) => (
                        <Grid2 key={index} size={{ xs: 4, sm: 4, md: 4 }}>
                            <BookingItem booking={booking} />
                        </Grid2>
                    ))}
                </Grid2>
            </Stack>
        </div>
    );
};

export default MyBookings;