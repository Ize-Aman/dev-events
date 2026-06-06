'use server';

import { Booking } from "@/database";
import connectDB from "../mongodb";

export const createBooking = async ({ eventID, slug, email }: { eventID: string, slug: string, email: string }) => {
    try {
        await connectDB();

        const booking = (await Booking.create({ eventID, slug, email })).lean();

        return { success: true, booking };
    } catch (error) {
        console.error('creating booking failed', error);
        return { success: false, error: error };
    }
}