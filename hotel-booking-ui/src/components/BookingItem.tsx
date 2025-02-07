import {
    Alert,
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Stack,
    TextField,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import {Hotel} from "../model/Hotel";
import {Link} from "react-router-dom";
import CustomizedDialogs from "./CustomizedDialogs";
import {Booking} from "../model/Booking";
import axiosInstance from "../service/axiosInstance";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, {Dayjs} from "dayjs";

interface Props {
    booking: Booking;
}

const BookingItem: React.FC<Props> = ({booking}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [numRooms, setNumRooms] = useState(booking.numRooms);
    const [checkIn, setCheckIn] = useState<Dayjs | null>(dayjs(booking.checkIn));
    const [checkOut, setCheckOut] = useState<Dayjs | null>(dayjs(booking.checkOut));
    const [error, setError] = useState<string>("")

    // Open dialog
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    // Close dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };


    const [openEditDialog, setEditOpenDialog] = useState(false);

    // Open dialog
    const handleOpenEditDialog = () => {
        setEditOpenDialog(true);
    };

    // Close dialog
    const handleCloseEditDialog = () => {
        setEditOpenDialog(false);
    };

    const validateUpdateBooking = () => {

        // Validate all fields before searching
        if (!checkIn || !checkOut || !numRooms) {
            setError("Please fill all the required fields.");
            return;
        }
        // Validate that the check-out date is after the check-in date
        if (checkOut.isBefore(checkIn, "day")) {
            setError("Check-out date must be later than check-in date.");
            return;
        }

        setError("")

        handleUpdateBooking()
    }

    const handleUpdateBooking = async () => {
        try {
            const response = await axiosInstance.put(`bookings/${booking.id}`, {
                checkIn,
                checkOut,
                numRooms,
            });
            if (response.status === 200) {
                console.log("Booking updated successfully!");
                setEditOpenDialog(false);
            }
        } catch (error) {
            console.error("Error updating booking:", error);
        }
    };

    // Handle the cancel action
    const handleCancelBooking = async () => {
        try {
            const response = await axiosInstance.put(`/bookings/${booking.id}/status`, {status: 'cancelled'});
            if (response.status === 200) {
                console.log("Booking cancelled successfully!");
                // Update the booking status in the local state or re-fetch bookings
                setOpenDialog(false);
            }
        } catch (error) {
            console.error("Error cancelling booking:", error);
        }
    };

    return (
        <Card sx={{}}>
            <CardActionArea onClick={handleOpenEditDialog}
                            sx={{ pointerEvents: booking.status === "cancelled" ? "none" : "auto" }}>
                <CardMedia
                    component="img"
                    height="140"
                    image="https://picsum.photos/200/300"
                    alt="Hotel image"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {booking.hotelName}
                    </Typography>
                    <Typography variant="body2" sx={{color: 'text.secondary'}}>
                        {booking.numRooms} rooms
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                {booking.status === "booked" ? (
                    <>
                        <Button size="small" color="primary" onClick={handleOpenDialog}>
                            Cancel Booking
                        </Button>
                    </>
                ) : booking.status === "cancelled" ? (
                    <Typography variant="body2" sx={{color: 'text.secondary'}}>
                        Booking Cancelled
                    </Typography>
                ) : (
                    <Button size="small" color="primary" disabled>
                        Unavailable
                    </Button>
                )}
            </CardActions>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Cancel Booking</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to cancel this booking?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        No
                    </Button>
                    <Button onClick={handleCancelBooking} color="primary">
                        Yes, Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Edit Booking Details</DialogTitle>
                <DialogContent>

                    <Stack direction="column" spacing={4}>

                        <TextField
                            label="Number of Rooms"
                            type="number"
                            value={numRooms}
                            onChange={(e) => setNumRooms(Number(e.target.value))}
                            fullWidth
                            margin="normal"
                        />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Check-in Date"
                                value={checkIn}
                                onChange={(newValue) => setCheckIn(newValue)}
                                disablePast
                            />

                        </LocalizationProvider>
                        {/* Check-out Date */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Check-out Date"
                                value={checkOut}
                                onChange={(newValue) => setCheckOut(newValue)}
                                disablePast
                            />
                        </LocalizationProvider>
                        { /* Error Message */}
                        {error && <Alert severity="error">{error}</Alert>}
                        
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={validateUpdateBooking} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default BookingItem;
