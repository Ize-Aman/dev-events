'use client'
import Tags from "@/components/Tags";
import { useState } from "react";

const Page = () => {
    const [type, setType] = useState('text');
    return (
        <div id="create-event">
            <div className="flex flex-col gap-8">
                <h1 className="text-[35px] sm:text-[48px]">Create an Event</h1>
                <form>
                    <div className="form-card">
                        <label htmlFor="title">Event Title</label>
                        <input type="text" id="title" placeholder="Enter event title" />

                        <label htmlFor="date">Event Date</label>
                        <input type='date' className="w-full" id="date" placeholder="Enter event date" />

                        <label htmlFor="time">Event Time</label>
                        <input type="time" className="w-full" id="time" placeholder="Enter event time" />

                        <label htmlFor="venue">Venue</label>
                        <input type="text" id="venue" placeholder="Enter venue or online link" />

                        <label htmlFor="event-type">Event Type</label>
                        <select className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white focus:outline-none focus:ring-0 focus:border-transparent" id="event-type">
                            <option className="text-white" value="online" label="online" />
                            <option className="text-white" value="offline" label="offline" />
                            <option className="text-white" value="hybrid" label="hybrid" />
                        </select>

                        <label htmlFor="event-banner">Event Image/Banner</label>
                        <input type="file" id="event-banner" placeholder="Enter event title" />

                        <Tags />

                        <label htmlFor="event-description">Event Desciption</label>
                        <textarea
                            id="event-description"
                            className="bg-dark-200 rounded-[6px] px-5 py-2.5 focus:outline-none focus:ring-0 focus:border-transparent"
                            rows={5}
                            placeholder="Briefly describe the event"
                        />
                    </div>
                </form>
            </div>
        </div>
    )
};

export default Page;
