import { HydratedDocument, Model, Schema, Types, model, models } from 'mongoose'

import { Event } from './event.model'

interface BookingSchemaType {
    eventId: Types.ObjectId
    email: string
    createdAt?: Date
    updatedAt?: Date
}

type BookingDocument = HydratedDocument<BookingSchemaType>
type BookingModel = Model<BookingSchemaType>

const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase())

const BookingMongooseSchema = new Schema<BookingSchemaType, BookingModel>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: (value: string) => isValidEmail(value),
                message: 'Invalid email format.',
            },
        },
    },
    {
        timestamps: true,
    }
)

BookingMongooseSchema.pre('save', async function bookingPreSave(this: BookingDocument) {
    if (!isValidEmail(this.email)) {
        throw new Error('Invalid email format.')
    }

    // Validate event reference at write-time to prevent orphan bookings.
    if (this.isNew || this.isModified('eventId')) {
        const eventExists = await Event.exists({ _id: this.eventId })

        if (!eventExists) {
            throw new Error('Referenced event does not exist.')
        }
    }
})

export const Booking =
    (models.Booking as BookingModel | undefined) ??
    model<BookingSchemaType, BookingModel>('Booking', BookingMongooseSchema)
