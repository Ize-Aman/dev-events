import { Booking } from "@/database";
import { IEvent } from "@/database/event.model";
import Image from "next/image";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const Page = async () => {
    'use cache';

    const response = await fetch(`${BASE_URL}/api/events`);
    const { events } = await response.json();

    return (
        <div id="admin">
            <div className="flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-[35px] sm:text-[48px]">Event Management</h1>
                <button><Link href={`${BASE_URL}/createEvents`}>Add new Event</Link></button>
            </div>
            <div className="overflow-auto">
                <table>
                    <tbody>
                        <tr className="head">
                            <th>Events</th>
                            <th>Location</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th colSpan={2}>Booked Spots</th>
                        </tr>
                        {events && events.length > 0 && events.map(async (event: IEvent) => {
                            let bookings = await Booking.countDocuments({ eventId: event._id });
                            return (
                                <tr key={event.title} className="body">
                                    <td> <Image width={40} height={40} src={event.image} className="poster" alt='poster' /> {event.title}</td>
                                    <td>{event.location}</td>
                                    <td>{event.date}</td>
                                    <td>{event.time}</td>
                                    <td>{bookings}</td>
                                    <td>Delete</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div >
    )
};

export default Page;
