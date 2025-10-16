import mongoose from 'mongoose';

const gallerySchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['image', 'video'],
    },
    src: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      // Required only for videos
    },
  },
  {
    timestamps: true,
  }
);

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;
