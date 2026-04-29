import { Event } from "@/database";
import connectDB from "@/lib/mongodb";

import { NextRequest, NextResponse } from "next/server";

const X02_Key = process.env.X02_PUBLIC_KEY;

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

        const file = (theFormData.get('image') || theFormData.get('posterImage')) as File | null;
        if (!file) return NextResponse.json({ message: 'image file is required' }, { status: 400 });

        if (!X02_Key) {
            return NextResponse.json({ message: 'x02 api key is missing' }, { status: 500 });
        }

        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("expiry", "1d");

        const postImage = await fetch("https://up.x02.me/api/upload?format=json", {
            method: "POST",
            headers: { "x-api-key": X02_Key },
            body: uploadFormData
        });

        const uploadResult = await postImage.json();
        const uploadedImageUrl = uploadResult?.data?.url;

        if (!postImage.ok || !uploadResult?.success || !uploadedImageUrl) {
            return NextResponse.json(
                {
                    message: 'failed to upload image to x02',
                    error: uploadResult?.error || 'invalid upload response',
                },
                { status: 502 }
            );
        }

        event.image = uploadedImageUrl;
        const createdEvent = await Event.create(event);
        return NextResponse.json({ message: 'event created successfully', event: createdEvent }, { status: 201 })

    } catch (e: unknown) {
        console.log(e);
        return NextResponse.json(
            {
                message: 'Event creation failed',
                error: e instanceof Error ? e.message : 'Unknown error',
            },
            { status: 500 }
        )
    }
}