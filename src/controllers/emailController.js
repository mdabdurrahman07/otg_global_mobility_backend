import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Inquiry from "../models/Inquiry.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = asyncHandler(async (req, res) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    throw new ApiError(400, "Email recipient, subject, and HTML content are required");
  }

  try {
    const response = await resend.emails.send({
      from: "OTG Global Mobility <noreply@otgglobalmobility.com>",
      to,
      subject,
      html,
    });

    if (!response || response.error) {
      throw new ApiError(500, response?.error?.message || "Failed to send email");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, response, "Email sent successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to send email");
  }
});

const replyToInquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { subject, html } = req.body;

  if (!subject || !html) {
    throw new ApiError(400, "Reply subject and HTML content are required");
  }

  const inquiry = await Inquiry.findById(id);

  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  try {
    const response = await resend.emails.send({
      from: "OTG Global Mobility <noreply@otgglobalmobility.com>",
      to: inquiry.inquiryEmail,
      subject,
      html,
    });

    if (!response || response.error) {
      throw new ApiError(500, response?.error?.message || "Failed to send reply email");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, response, "Reply email sent successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to send reply email");
  }
});

export { sendEmail, replyToInquiry };
