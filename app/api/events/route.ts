import { Event } from "@/database";
import connectDB from "@/lib/mongodb";

import { NextRequest, NextResponse } from "next/server";

const X02_Key = process.env.X02_PUBLIC_KEY;
const X02_Folder_Id = process.env.X02_PUBLIC_FOLDER_ID;

export async function GET() {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 }).lean();

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
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

        const file = (theFormData.get('image')) as File | null;
        if (!file) return NextResponse.json({ message: 'image file is required' }, { status: 400 });

        const rawTags = theFormData.get('tags');
        const rawAgenda = theFormData.get('agenda');
        let tags: string[] = [];
        let agenda: string[] = [];

        try {
            tags = rawTags ? JSON.parse(String(rawTags)) : [];
            agenda = rawAgenda ? JSON.parse(String(rawAgenda)) : [];
        } catch {
            return NextResponse.json(
                { message: 'tags and agenda must be valid JSON arrays' },
                { status: 400 }
            );
        }

        if (!X02_Key) {
            return NextResponse.json({ message: 'x02 api key is missing' }, { status: 500 });
        }

        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        //upload image to X02

        const postImage = await fetch("https://up.x02.me/api/upload?format=json", {
            method: "POST",
            headers: { "x-api-key": X02_Key },
            body: uploadFormData
        });

        //get the uploaded image URL and filename

        const uploadResult = await postImage.json();
        const uploadedImageName = uploadResult?.data?.filename;
        const uploadedImageUrl = uploadResult?.data?.url;

        if (!postImage.ok || !uploadResult?.success || !uploadedImageUrl) {
            return NextResponse.json(
                {
                    message: 'failed to upload image to x02',
                    status: postImage.status,
                    error: uploadResult?.error || 'invalid upload response',
                },
                { status: 502 }
            );
        }

        //move the uploaded image to the approprate folder in X02

        const moveToFolder = await fetch(`https://up.x02.me/api/user/images/${uploadedImageName}/move`, {
            method: "PATCH",
            headers: {
                "x-api-key": X02_Key,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ folderId: X02_Folder_Id }),
        });

        const moveImage = await moveToFolder.json();

        if (!moveToFolder.ok || !moveImage || !moveImage.success) {
            return NextResponse.json(
                {
                    message: 'unable to move file to folder',
                    status: moveToFolder.status,
                    error: moveImage?.error || 'invalid move response',
                },
                { status: 502 }
            )
        }

        /*
        * upload the Event updating the image URL you get from X02
        * update the Tags and Agenda field
        */

        event.image = uploadedImageUrl;
        const createdEvent = await Event.create({ ...event, tags: tags, agenda: agenda });
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