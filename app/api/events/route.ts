import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ events }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to fetch events", error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const theFormData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(theFormData.entries());
        } catch (e) {
            return NextResponse.json({ message: 'invalid json data format' }, { status: 400 })
        }

        const createdEvent = await Event.create(event);
        return NextResponse.json({ message: 'event created successfully', event: createdEvent }, { status: 201 })

    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: 'Event creation failed', e: e instanceof Error ? e.message : 'Unknown' }, { status: 500 })
    }
}