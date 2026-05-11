import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Inquiry from "../models/Inquiry.js";

const createInquiry = asyncHandler(async (req, res) => {
  const { inquiryEmail, inquiryPhone, inquiryService, inquiryCalc } = req.body;

  if (!inquiryEmail || !inquiryPhone || !inquiryService || !inquiryCalc) {
    throw new ApiError(400, "All inquiry fields are required");
  }

  if (!["Eligibility", "CGPA"].includes(inquiryCalc)) {
    throw new ApiError(400, "Inquiry calculation type must be 'Eligibility' or 'CGPA'");
  }

  const inquiry = await Inquiry.create({
    inquiryEmail: inquiryEmail.toLowerCase(),
    inquiryPhone: inquiryPhone.trim(),
    inquiryService: inquiryService.trim(),
    inquiryCalc,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, inquiry, "Inquiry submitted successfully"));
});

const getAllInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        inquiries,
        `Retrieved ${inquiries.length} inquiries successfully`
      )
    );
});

const updateInquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { inquiryEmail, inquiryPhone, inquiryService, inquiryCalc } = req.body;

  const inquiry = await Inquiry.findById(id);

  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  // Validate inquiry calculation type if provided
  if (inquiryCalc && !["Eligibility", "CGPA"].includes(inquiryCalc)) {
    throw new ApiError(400, "Inquiry calculation type must be 'Eligibility' or 'CGPA'");
  }

  // Update fields if provided
  if (inquiryEmail) inquiry.inquiryEmail = inquiryEmail.toLowerCase();
  if (inquiryPhone) inquiry.inquiryPhone = inquiryPhone.trim();
  if (inquiryService) inquiry.inquiryService = inquiryService.trim();
  if (inquiryCalc) inquiry.inquiryCalc = inquiryCalc;

  await inquiry.save();

  return res
    .status(200)
    .json(new ApiResponse(200, inquiry, "Inquiry updated successfully"));
});

const deleteInquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const inquiry = await Inquiry.findByIdAndDelete(id);

  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, inquiry, "Inquiry deleted successfully"));
});

export { createInquiry, getAllInquiries, updateInquiry, deleteInquiry };
