import { error } from "console";
import mongoose from "mongoose";


const MONGODB_URI = process.env.MONGODB_URI;



declare global{
    var mongooseCache : {
        conn : typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}



let cached = global.mongooseCache;


if(!cached){
    cached = global.mongooseCache = {conn: null, promise: null};
}


export const connectToDatabase = async () => {
    if(!MONGODB_URI) throw new Error("MONGODB_URI is not defined, it must be defined in the environment variables");

    // If we already have a cached connection, return it
    if(cached.conn) return cached.conn;

    // If we don't have a promise, create one
    if(!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log(`✅ Connected to MongoDB - ${process.env.NODE_ENV} environment`);
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        console.error("❌ MongoDB connection error:", error);
        throw error;
    }
    
}