import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    inquiryEmail: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    inquiryPhone: {
      type: String,
      required: [true, "Phone number is required"],
      match:[/^(?:\+88|88)?(01[3-9]\d{8})$/],
      trim: true,
    },
    inquiryService: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Service",
      required: [true, "Service name is required"],
      trim: true,
    },
    inquiryCalc: {
      type: String,
      enum: ["Eligibility", "CGPA"],
    },
  },
  { timestamps: true }
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
