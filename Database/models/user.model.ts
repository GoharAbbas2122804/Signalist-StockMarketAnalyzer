import { Schema, model, models, type Document, type Model } from 'mongoose';

export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin'
}

export interface IUser extends Document {
  id: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  image?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // Soft delete support
  lastLoginAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      trim: true
    },
    image: {
      type: String
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null
    },
    lastLoginAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    collection: 'user' // Better Auth uses 'user' collection
  }
);

// Index for efficient role-based queries
UserSchema.index({ role: 1, createdAt: -1 });

// Index for soft delete queries (only active users)
UserSchema.index({ deletedAt: 1 });

// Compound index for admin dashboard queries
UserSchema.index({ role: 1, deletedAt: 1, createdAt: -1 });

export const User: Model<IUser> =
  (models?.User as Model<IUser>) || model<IUser>('User', UserSchema);
