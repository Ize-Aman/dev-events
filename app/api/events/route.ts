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

        const body = await req.json();

        const {
            title,
            description,
            overview,
            image,
            venue,
            location,
            date,
            time,
            mode,
            audience,
            agenda,
            organizer,
            tags
        } = body;

        if (
            !title ||
            !description ||
            !overview ||
            !image ||
            !venue ||
            !location ||
            !date ||
            !time ||
            !mode ||
            !audience ||
            !agenda ||
            !organizer ||
            !tags
        ) {
            return NextResponse.json({ error: "All fields are requiered" }, { status: 400 });
        }

        const event = await Event.create({
            title,
            description,
            overview,
            image,
            venue,
            location,
            date,
            time,
            mode,
            audience,
            agenda,
            organizer,
            tags,
        });

        return NextResponse.json(event, { status: 201 });
    } catch (e: any) {
        console.log(e);
        return NextResponse.json({ e: e.message || "Server error" }, { status: 500 })
    }
}