'use client';

import { createBooking } from "@/lib/actions/booking.action";
import { useState } from "react";

const BookEvent = ({ slug, eventId }: { eventId: string, slug: string }) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [registered, setRegistered] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { success, error } = await createBooking({ eventId, email })

        if (success) setSubmitted(true);
        else if (error?.name === 'MongoServerError') setRegistered(true);
        else console.error('Booking creation failed', error);
    }

    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm">Thank you for signing up!</p>
            ) : registered ? (
                <p className="text-sm">Email already registered!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email" value={email}
                            onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Enter your email address"
                        />
                    </div>
                    <button type="submit" className="button-submit">Submit</button>
                </form>
            )}
        </div>
    )
};

export default BookEvent;
