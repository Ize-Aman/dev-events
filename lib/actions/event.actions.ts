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

export const deleteEvent = async (slug: string) => {
    try {
        connectDB();
        await Event.deleteOne({slug});
        return {success: true};
    } catch (e) {
        const error = e instanceof Error
            ? {name: e.name, message: e.message}
            : {name: 'Error', message: 'unknown error'};
        
        return {success: false, error};
    }
}