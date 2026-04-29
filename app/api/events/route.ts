import cloudinary from "@/lib/cloudinary";

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

        const file = theFormData.get('image') as File;
        if (!file) return NextResponse.json({ message: 'image file is requiered' }, { status: 400 });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }).end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

        const createdEvent = await Event.create(event);
        return NextResponse.json({ message: 'event created successfully', event: createdEvent }, { status: 201 })

    } catch (e: any) {
        console.log(e);
        return NextResponse.json({ message: 'Event creation failed', e: e.message }, { status: 500 })
    }
}