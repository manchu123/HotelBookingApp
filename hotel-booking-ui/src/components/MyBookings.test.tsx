import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyBookings from './MyBookings';
import axiosInstance from '../service/axiosInstance';

// Mock axiosInstance
jest.mock('../service/axiosInstance', () => ({
    get: jest.fn(), // Mock only the `get` method
}));

describe('MyBookings Component', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    test('displays bookings when API call is successful', async () => {
        // Mock successful API response
        axiosInstance.get.mockResolvedValueOnce({
            data: [
                { id: '1', name: 'Booking 1', location: 'Location 1' },
                { id: '2', name: 'Booking 2', location: 'Location 2' },
            ],
        });

        render(<MyBookings />);

        const booking1 = await screen.findByText(/Booking 1/i);
        const booking2 = await screen.findByText(/Booking 2/i);

        expect(booking1).toBeInTheDocument();
        expect(booking2).toBeInTheDocument();
    });

    test('displays error message on API failure', async () => {
        // Mock API error
        axiosInstance.get.mockRejectedValueOnce(new Error('Failed to fetch bookings'));

        render(<MyBookings />);

        const errorMessage = await screen.findByText(/Failed to fetch bookings/i);

        expect(errorMessage).toBeInTheDocument();
    });
});
