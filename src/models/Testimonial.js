import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    authorImage: {
      type: String,
      required: [true, "Author image is required"],
    },
    quote: {
      type: String,
      required: [true, "Quote is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
