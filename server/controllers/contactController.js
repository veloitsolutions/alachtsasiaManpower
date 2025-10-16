import asyncHandler from 'express-async-handler';
import Contact from '../models/contactModel.js';

// @desc    Create a new contact submission
// @route   POST /api/contact
// @access  Public
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const contact = new Contact({
    name,
    email,
    phone,
    subject,
    message,
  });

  const createdContact = await contact.save();
  res.status(201).json(createdContact);
});

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({}).sort({ createdAt: -1 });
  res.json(contacts);
});

// @desc    Get a single contact submission
// @route   GET /api/contact/:id
// @access  Private/Admin
const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    res.json(contact);
  } else {
    res.status(404);
    throw new Error('Contact submission not found');
  }
});

// @desc    Update contact read status
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateContactReadStatus = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    contact.isRead = req.body.isRead;

    const updatedContact = await contact.save();
    res.json(updatedContact);
  } else {
    res.status(404);
    throw new Error('Contact submission not found');
  }
});

// @desc    Delete a contact submission
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    await Contact.deleteOne({ _id: contact._id });
    res.json({ message: 'Contact submission removed' });
  } else {
    res.status(404);
    throw new Error('Contact submission not found');
  }
});

export {
  createContact,
  getContacts,
  getContactById,
  updateContactReadStatus,
  deleteContact,
};
