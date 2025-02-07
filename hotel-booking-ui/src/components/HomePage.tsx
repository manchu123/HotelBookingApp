import React, {useState, useEffect} from "react";
import {
    Box,
    Button,
    MenuItem,
    TextField,
    Typography,
    TextFieldProps, Grid, Grid2, Stack,
} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs, {Dayjs} from "dayjs";
import axiosInstance from "../service/axiosInstance";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {Hotel} from "../model/Hotel";
import HotelItem from "./HotelItem";
import {Alert} from "@mui/lab";
import '../css/Homepage.css';


// Types
const rooms = ["1", "2", "3", "4"];

interface Location {
    location: string
}

// Components
const HomePage: React.FC = () => {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const [locationList, setLocationList] = useState<Location[]>([]);
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [location, setLocation] = useState<string>("");
    const [checkInDate, setCheckInDate] = useState<Dayjs | null>(dayjs()); // Today
    const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(dayjs().add(1, "day")); // Tomorrow
    const [room, setRoom] = useState<number>(1);
    const [error, setError] = useState<string>("");
    const checkInDateString = checkInDate?.format("YYYY-MM-DD") || "";
    const checkOutDateString = checkOutDate?.format("YYYY-MM-DD") || "";
    const handleSearch = () => {
        // Validate all fields before searching
        if (!location || !checkInDate || !checkOutDate || !room) {
            setError("Please fill all the required fields.");
            return;
        }
        // Validate that the check-out date is after the check-in date
        if (checkOutDate.isBefore(checkInDate, "day")) {
            setError("Check-out date must be later than check-in date.");
            return;
        }
        // Clear previous error
        setError("");

        console.log("Location:", location);
        console.log("Check-in:", checkInDate?.format("YYYY-MM-DD"));
        console.log("Check-out:", checkOutDate?.format("YYYY-MM-DD"));
        fetchHotels(location)
    };

    // Function to fetch hotels
    const fetchHotels = (location: string) => {
        axiosInstance
            .get("/hotels", {params: {location}})
            .then((res) => setHotels(res.data))
            .catch((error) => console.error("Error fetching hotels:", error));
    };

    const fetchLocations = async () => {
        try {
            const response = await axiosInstance.get('/hotels/locations');
            setLocationList(response.data); // Assuming the response data is an array of locations

        } catch (error) {
            console.log('Failed to fetch locations');
        }
    };

    useEffect(() => {
        fetchLocations()
    }, []);

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Hotels
            </Typography>

            {/* Location Dropdown */}

            <Box display="flex" gap={2} alignItems="center" justifyContent="center" sx={{mt: 4}}>
                {/* Location Dropdown */}
                <TextField
                    select
                    label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    sx={{width: 250}}
                >
                    {locationList.map((loc) => (
                        <MenuItem key={loc.location} value={loc.location}>
                            {loc.location}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Check-in Date */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Check-in Date"
                        value={checkInDate}
                        onChange={(newValue) => setCheckInDate(newValue)}
                        disablePast
                    />

                    {/* Check-out Date */}

                    <DatePicker
                        label="Check-out Date"
                        value={checkOutDate}
                        onChange={(newValue) => setCheckOutDate(newValue)}
                        disablePast
                    />
                </LocalizationProvider>

                <TextField
                    select
                    label="No of rooms"
                    value={room}
                    onChange={(e) => setRoom(Number(e.target.value))}
                    sx={{width: 200}}
                >
                    {rooms.map((room) => (
                        <MenuItem key={room} value={room}>
                            {room}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Search Button */}
                <Button variant="contained" color="primary" onClick={handleSearch}>
                    Search
                </Button>
            </Box>

            {/* Error Message */}
            {error && <Alert severity="error">{error}</Alert>}

            <Stack direction="column" className="stack-container">
                <Grid2 container spacing={{xs: 2, md: 3}} columns={{xs: 4, sm: 8, md: 12}}>
                    {hotels?.map((hotel, index) => (
                        <Grid2 key={index} size={{xs: 4, sm: 4, md: 4}}>

                            <HotelItem hotel={hotel} rooms={room} checkIn={checkInDateString} checkOut={checkOutDateString}/>
                        </Grid2>
                    ))}
                </Grid2>
            </Stack>

        </Box>
    )
        ;
};

export default HomePage;
