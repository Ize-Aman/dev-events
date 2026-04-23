import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    throw new Error('Missing environment variable: MONGODB_URI')
}

const mongodbUri: string = MONGODB_URI

type MongooseConnection = typeof mongoose

type MongooseCache = {
    conn: MongooseConnection | null
    promise: Promise<MongooseConnection> | null
}

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined
}

// Reuse a single cached connection across hot reloads in development.
const cached = global.mongooseCache ?? { conn: null, promise: null }

if (!global.mongooseCache) {
    global.mongooseCache = cached
}

/**
 * Connect to MongoDB using Mongoose.
 * - Reuses an existing connection when available.
 * - Stores an in-flight promise to avoid duplicate concurrent connections.
 */
export async function connectToDatabase(): Promise<MongooseConnection> {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(mongodbUri, {
            bufferCommands: false,
        })
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        // Reset the promise so future retries can establish a new connection.
        cached.promise = null
        throw error
    }

    return cached.conn
}
