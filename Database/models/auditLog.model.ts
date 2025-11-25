import { Schema, model, models, type Document, type Model } from 'mongoose';

export enum AuditAction {
  USER_DELETE = 'user_delete',
  USER_RESTORE = 'user_restore',
  ROLE_CHANGE = 'role_change',
  USER_UPDATE = 'user_update',
  USER_CREATE = 'user_create',
  ADMIN_LOGIN = 'admin_login'
}

export interface IAuditLog extends Document {
  adminId: string;
  adminEmail: string;
  action: AuditAction;
  targetUserId?: string;
  targetUserEmail?: string;
  metadata: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    adminId: {
      type: String,
      required: true,
      index: true
    },
    adminEmail: {
      type: String,
      required: true
    },
    action: {
      type: String,
      enum: Object.values(AuditAction),
      required: true,
      index: true
    },
    targetUserId: {
      type: String,
      index: true
    },
    targetUserEmail: {
      type: String
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'auditLogs'
  }
);

// Index for filtering by action and date
AuditLogSchema.index({ action: 1, createdAt: -1 });

// Compound index for admin-specific queries
AuditLogSchema.index({ adminId: 1, createdAt: -1 });

// Index for target user lookups
AuditLogSchema.index({ targetUserId: 1, createdAt: -1 });

export const AuditLog: Model<IAuditLog> =
  (models?.AuditLog as Model<IAuditLog>) || model<IAuditLog>('AuditLog', AuditLogSchema);
