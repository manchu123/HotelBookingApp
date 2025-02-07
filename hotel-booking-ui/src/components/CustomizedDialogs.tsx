import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

// Custom Styled Dialog
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

// Define Props for the Dialog Component
interface CustomizedDialogProps {
    open: boolean;
    handleClose: () => void;
    onBookingConfirm: () => void;
}

export default function CustomizedDialogs({ open, handleClose, onBookingConfirm }: CustomizedDialogProps) {
    return (
        <BootstrapDialog onClose={handleClose} open={open} aria-labelledby="customized-dialog-title">
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Confirm Booking
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                <Typography gutterBottom>
                    Are you sure want to book this hotel?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={onBookingConfirm}>
                    Confirm
                </Button>
            </DialogActions>

            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Cancel
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}
