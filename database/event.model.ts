import { HydratedDocument, Model, Schema, model, models } from 'mongoose'

interface EventSchemaType {
    title: string
    slug: string
    description: string
    overview: string
    image: string
    venue: string
    location: string
    date: string
    time: string
    mode: string
    audience: string
    agenda: string[]
    organizer: string
    tags: string[]
    createdAt?: Date
    updatedAt?: Date
}

type EventDocument = HydratedDocument<EventSchemaType>
type EventModel = Model<EventSchemaType>

const isNonEmptyString = (value: string): boolean => value.trim().length > 0

const createSlug = (value: string): string =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')

const normalizeDateToISO = (value: string): string => {
    const parsedDate = new Date(value)

    if (Number.isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format. Provide a valid date value.')
    }

    return parsedDate.toISOString()
}

const normalizeTime = (value: string): string => {
    const trimmedTime = value.trim().toLowerCase()

    const twentyFourHourMatch = trimmedTime.match(/^([01]?\d|2[0-3]):([0-5]\d)$/)
    if (twentyFourHourMatch) {
        const [, hours, minutes] = twentyFourHourMatch
        return `${hours.padStart(2, '0')}:${minutes}`
    }

    const twelveHourMatch = trimmedTime.match(/^(1[0-2]|[1-9])(?::([0-5]\d))?\s*(am|pm)$/)
    if (twelveHourMatch) {
        const [, hoursPart, minutesPart = '00', meridiem] = twelveHourMatch
        const hours = Number.parseInt(hoursPart, 10)
        const normalizedHours = meridiem === 'pm' ? (hours % 12) + 12 : hours % 12
        return `${String(normalizedHours).padStart(2, '0')}:${minutesPart}`
    }

    throw new Error('Invalid time format. Use HH:mm or h:mm am/pm.')
}

const validateRequiredContent = (doc: EventDocument): void => {
    const requiredStringFields: Array<{ key: keyof EventSchemaType; label: string }> = [
        { key: 'title', label: 'title' },
        { key: 'description', label: 'description' },
        { key: 'overview', label: 'overview' },
        { key: 'image', label: 'image' },
        { key: 'venue', label: 'venue' },
        { key: 'location', label: 'location' },
        { key: 'date', label: 'date' },
        { key: 'time', label: 'time' },
        { key: 'mode', label: 'mode' },
        { key: 'audience', label: 'audience' },
        { key: 'organizer', label: 'organizer' },
    ]

    for (const field of requiredStringFields) {
        const fieldValue = doc[field.key]

        if (typeof fieldValue !== 'string' || !isNonEmptyString(fieldValue)) {
            throw new Error(`Field '${field.label}' is required and cannot be empty.`)
        }
    }

    if (!Array.isArray(doc.agenda) || doc.agenda.length === 0) {
        throw new Error("Field 'agenda' is required and must include at least one item.")
    }

    if (doc.agenda.some((item) => !isNonEmptyString(item))) {
        throw new Error("Field 'agenda' cannot contain empty values.")
    }

    if (!Array.isArray(doc.tags) || doc.tags.length === 0) {
        throw new Error("Field 'tags' is required and must include at least one item.")
    }

    if (doc.tags.some((item) => !isNonEmptyString(item))) {
        throw new Error("Field 'tags' cannot contain empty values.")
    }
}

const EventMongooseSchema = new Schema<EventSchemaType, EventModel>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, unique: true, trim: true },
        description: { type: String, required: true, trim: true },
        overview: { type: String, required: true, trim: true },
        image: { type: String, required: true, trim: true },
        venue: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        date: { type: String, required: true, trim: true },
        time: { type: String, required: true, trim: true },
        mode: { type: String, required: true, trim: true },
        audience: { type: String, required: true, trim: true },
        agenda: {
            type: [String],
            required: true,
            validate: {
                validator: (value: string[]) => value.length > 0,
                message: 'Agenda must include at least one item.',
            },
        },
        organizer: { type: String, required: true, trim: true },
        tags: {
            type: [String],
            required: true,
            validate: {
                validator: (value: string[]) => value.length > 0,
                message: 'Tags must include at least one value.',
            },
        },
    },
    {
        timestamps: true,
    }
)

EventMongooseSchema.index({ slug: 1 }, { unique: true })

EventMongooseSchema.pre('save', function eventPreSave(this: EventDocument) {
    validateRequiredContent(this)

    // Keep slug updates deterministic and only regenerate when the title changes.
    if (this.isModified('title')) {
        this.slug = createSlug(this.title)
    }

    // Normalize date/time before persistence so consumers get a consistent format.
    if (this.isModified('date')) {
        this.date = normalizeDateToISO(this.date)
    }

    if (this.isModified('time')) {
        this.time = normalizeTime(this.time)
    }
})

export const Event =
    (models.Event as EventModel | undefined) ?? model<EventSchemaType, EventModel>('Event', EventMongooseSchema)
