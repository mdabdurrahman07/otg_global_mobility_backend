import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Contact from "../models/Contact.js";

const createContact = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, serviceType } = req.body;

  if (!name || !email || !phoneNumber || !serviceType) {
    throw new ApiError(400, "Name, email, phone number, and service type are required");
  }

  const contact = await Contact.create({
    name: name.trim(),
    email: email.trim(),
    phoneNumber: phoneNumber.trim(),
    serviceType,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, contact, "Contact created successfully"));
});

const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        contacts,
        `Retrieved ${contacts.length} contacts successfully`
      )
    );
});

const getContactById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findById(id);

  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, contact, "Contact retrieved successfully"));
});

const updateContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, phoneNumber, serviceType, markAsRead } = req.body;

  const contact = await Contact.findById(id);

  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  if (name) contact.name = name.trim();
  if (email) contact.email = email.trim();
  if (phoneNumber) contact.phoneNumber = phoneNumber.trim();
  if (serviceType) contact.serviceType = serviceType;
  if (markAsRead !== undefined) contact.markAsRead = markAsRead;

  await contact.save();

  const updatedContact = await Contact.findById(id);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedContact, "Contact updated successfully"));
});

const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findByIdAndDelete(id);

  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Contact deleted successfully"));
});

export { createContact, getAllContacts, getContactById, updateContact, deleteContact };
