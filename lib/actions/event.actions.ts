'use server';
import { Event } from "@/database/event.model";
import connectDB from "../mongodb";

export const getSimilarEvents = async (slug: string) => {
    try {
        connectDB();
        const event = await Event.findOne({ slug });
        return await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean();
    } catch {
        return []
    }
}

export const createEvent = async ({ formData }: { formData: FormData }) => {
    try {
        const response = await fetch('/api/events', {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        return ({
            success: true,
            data: data
        })
    } catch (e) {
        console.error('Event creation failed', e);
        const error = e instanceof Error
            ? { name: e.name, message: e.message }
            : { name: 'Error', message: 'Unknown error' }

        return { success: false, error: error }
    }
}