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

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            Allow: "GET, POST, OPTIONS",
        },
    });
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const contentType = req.headers.get("content-type") ?? "";
        let eventData: Record<string, unknown>;

        if (contentType.includes("application/json")) {
            const body = await req.json();
            if (!body || typeof body !== "object" || Array.isArray(body)) {
                return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
            }
            eventData = body as Record<string, unknown>;
        } else {
            const formData = await req.formData();
            eventData = Object.fromEntries(formData.entries());
        }

        const createdEvent = await Event.create(eventData);

        return NextResponse.json({ message: "Event created successfully", event: createdEvent }, { status: 201 });
    } catch (error) {
        console.error(error);

        if (error && typeof error === "object" && "name" in error && error.name === "ValidationError") {
            return NextResponse.json(
                { message: "Validation failed", error: error instanceof Error ? error.message : "Invalid input" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Event creation failed", error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}