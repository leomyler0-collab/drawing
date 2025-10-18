import mongoose, { Document, Schema } from 'mongoose';

export interface IDrawing extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  canvasData: string; // Base64 image or JSON canvas data
  thumbnail?: string;
  width: number;
  height: number;
  isPublic: boolean;
  likes: number;
  views: number;
  tags: string[];
  layers?: any[];
  createdAt: Date;
  updatedAt: Date;
}

const DrawingSchema = new Schema<IDrawing>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    canvasData: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    layers: {
      type: Schema.Types.Mixed,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
DrawingSchema.index({ userId: 1, createdAt: -1 });
DrawingSchema.index({ isPublic: 1, createdAt: -1 });

export default mongoose.model<IDrawing>('Drawing', DrawingSchema);
