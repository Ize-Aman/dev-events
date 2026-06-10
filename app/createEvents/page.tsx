'use client'
import Tags from "@/components/Tags";
import React, { useState } from "react";

const Page = () => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [mode, setMode] = useState('');
    const [banner, setBanner] = useState<File | null>(null);
    const [tag, setTag] = useState<string[]>([]);
    const [description, setDescription] = useState('');
    const [agenda, setAgenda] = useState<string[]>(['Not set']);
    const [overview, setOverview] = useState('not set');
    const [audience, setAudience] = useState('Any');
    const [organizer, setOrganizer] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("title", title);
        formData.append("date", date);
        formData.append("time", time);
        formData.append("venue", 'Na');
        formData.append("mode", mode);
        if (banner) formData.append("image", banner);
        formData.append("tags", JSON.stringify(tag));
        formData.append("agenda", JSON.stringify(agenda));
        formData.append("description", description);
        formData.append("overview", overview);
        formData.append("audience", audience);
        formData.append("location", location);
        formData.append("organizer", organizer);

        try {
            const response = await fetch('/api/events', {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            if (!response.ok) {
                console.error(`Create event failed (${response.status})`, data);
                return;
            }

            console.log('event created', data);
        } catch (e) {
            console.error('Event creation failed', e);
        }
    }

    return (
        <div id="create-event">
            <h1 className="text-[35px] sm:text-[48px]">Create an Event</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-card">

                    <label htmlFor="title">Event Title</label>
                    <input onChange={(e) => setTitle(e.target.value)} required type="text" id="title" className="form-input" placeholder="Enter event title" />

                    <label htmlFor="date">Event Date</label>
                    <input onChange={(e) => setDate(e.target.value)} required type='date' className="w-full form-input" id="date" placeholder="Enter event date" />

                    <label htmlFor="time">Event Time</label>
                    <input onChange={(e) => setTime(e.target.value)} required type="time" className="w-full form-input" id="time" placeholder="Enter event time" />

                    <label htmlFor="location">Location</label>
                    <input onChange={(e) => setLocation(e.target.value)} required type="text" id="location" className="form-input" placeholder="Enter location or online link" />

                    <label htmlFor="event-Mode">Event Type</label>
                    <select onChange={(e) => setMode(e.target.value)} required className="bg-dark-200 rounded-[6px] mb-4 px-5 py-2.5 text-white focus:outline-none focus:ring-0 focus:border-transparent" id="event-mode">
                        <option className="text-white" value="online" label="online" />
                        <option className="text-white" value="offline" label="offline" />
                        <option className="text-white" value="hybrid" label="hybrid" />
                    </select>

                    <label htmlFor="audience">Audience</label>
                    <input
                        onChange={
                            (e) => {
                                setAudience(e.target.value);
                                if (audience === '') setAudience('Any');
                            }
                        }
                        type="text"
                        id="audience"
                        className="form-input"
                        placeholder="Enter the audience that might be interested"
                    />

                    <label htmlFor="organizer">Organizer</label>
                    <input onChange={(e) => setOrganizer(e.target.value)} required type="text" id="organizer" className="form-input" placeholder="Enter organizer details" />

                    <label htmlFor="event-banner">Event Image/Banner</label>
                    <input
                        type="file"
                        required
                        accept="image/*"
                        id="event-banner"
                        className="form-input"
                        placeholder="Enter event title"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setBanner(file);
                        }}
                    />

                    <label htmlFor="event-tags">Event Tags</label>
                    <Tags tag={tag} setTag={setTag} />

                    <label htmlFor="event-description">Event Desciption</label>
                    <textarea
                        id="event-description"
                        required
                        className="bg-dark-200 rounded-[6px] mb-4 px-5 py-2.5 focus:outline-none focus:ring-0 focus:border-transparent"
                        rows={5}
                        placeholder="Briefly describe the event"
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <label htmlFor="event-overview">Overview</label>
                    <textarea
                        id="event-overview"
                        className="bg-dark-200 rounded-[6px] mb-4 px-5 py-2.5 focus:outline-none focus:ring-0 focus:border-transparent"
                        rows={5}
                        placeholder="An overview of the event"
                        onChange={(e) => setOverview(e.target.value)}
                    />

                    <button type="submit">Save Event</button>

                </div>
            </form>
        </div>
    )
};

export default Page;
