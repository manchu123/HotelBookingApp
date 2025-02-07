import {Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography} from "@mui/material";
import React, {useState} from "react";
import {Hotel} from "../model/Hotel";
import {Link} from "react-router-dom";
import CustomizedDialogs from "./CustomizedDialogs";
import axiosInstance from "../service/axiosInstance";
import dayjs, {Dayjs} from "dayjs";

interface Props {
    hotel: Hotel,
    rooms: number,
    checkIn: string,
    checkOut: string,
}

const HotelItem: React.FC<Props> = ({ hotel, rooms, checkIn, checkOut }) => {
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleBookingConfirm = async () => {
        try {
            const bookingData = {
                hotelId: hotel.id,
                hotelName: hotel.name,
                location: hotel.location,
                checkIn: checkIn, // Example: Current Date
                checkOut: checkOut, // Example: Next Day
                numRooms: rooms, // Example: Default 1 room
                status:"booked"
            };

            const response = await axiosInstance.post("/bookings", bookingData);
            console.log("Booking confirmed:", response.data);

            // Close the dialog after successful booking
            setOpenDialog(false);
        } catch (error) {
            console.error("Error booking hotel:", error);
        }
    };

    return (
        <Card sx={{}}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image="https://picsum.photos/200/300"
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {hotel.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {hotel.location}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary" onClick={handleOpenDialog}>
                    Book
                </Button>
            </CardActions>

            <CustomizedDialogs open={openDialog} handleClose={handleCloseDialog} onBookingConfirm={
                handleBookingConfirm

            } />
        </Card>
    );
}

export default HotelItem;
