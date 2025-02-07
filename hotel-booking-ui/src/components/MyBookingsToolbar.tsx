import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MyBookingsToolbar: React.FC = () => {
    const userName = "Manchu Bhargavi";
    const navigate = useNavigate(); // Hook for navigation

    return (
        <AppBar position="static">
            <Toolbar>
                {/* Header Title */}
                <Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                onClick={() => navigate("/")}>
                    Hotel Room Booking
                </Typography>

                <Box display="flex" alignItems="center">
                    <Typography
                        variant="body1"
                        sx={{ marginRight: 1, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                        onClick={() => navigate("/my-bookings")} // Navigate on click
                    >
                        {userName}
                    </Typography>

                    {/* Profile Icon */}
                    <IconButton>
                        <Avatar alt={userName} src="/path-to-profile.jpg" />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default MyBookingsToolbar;
