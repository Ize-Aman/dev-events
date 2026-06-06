'use server';

import { Booking } from "@/database";
import connectDB from "../mongodb";

export const createBooking = async ({ eventId, email }: { eventId: string, email: string }) => {
    try {
        await connectDB();

        const booking = await Booking.create({ eventId, email });

        return { success: true, booking: JSON.parse(JSON.stringify(booking)) };
    } catch (e) {
        console.error('creating booking failed', e);

        const error = e instanceof Error
            ? { name: e.name, message: e.message }
            : { name: 'Error', message: 'Unknown booking error' };

        return {
            success: false,
            error,
        };
    }
}