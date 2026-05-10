import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import Upload from '../models/Upload.js'; // Use Upload consistently
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() }); // ✅
// Upload File
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    const upload = new Upload({
      userId: req.user.id,
      filename: req.file.originalname,
      originalname: req.file.originalname,
      buffer: req.file.buffer,
      data: jsonData,
      status: "uploaded",
    });

    await upload.save();
    res.status(201).json({ message: 'File uploaded & parsed successfully' });
  } catch (error) {
    console.error("Error in uploadFile controller:", error);
    res.status(500).json({ error: 'Failed to parse file' });
  }
};

// Get History
export const getUploadHistory = async (req, res) => {
  try {
    const uploads = await Upload.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(uploads);
  } catch (error) {
    console.error('Failed to fetch upload history:', error);
    res.status(500).json({ error: 'Failed to fetch upload history' });
  }
};

// View File by ID
export const viewFileById = async (req, res) => {
  try {
    const file = await Upload.findById(req.params.id);
    if (!file) return res.status(404).send('File not found');

    const sheet = xlsx.utils.json_to_sheet(file.data);
    const html = xlsx.utils.sheet_to_html(sheet);

    res.send(html);
  } catch (error) {
    console.error('Error viewing file:', error);
    res.status(500).send('Error viewing file');
  }
};

// Download File by ID
export const downloadFileById = async (req, res) => {
  try {
    const file = await Upload.findById(req.params.id);
    if (!file) return res.status(404).send("File not found");

    // Create a new workbook and add the JSON data as a worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(file.data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write workbook to a buffer
    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Set headers to force download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalname}"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Send buffer as response
    res.send(buffer);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).send("Error downloading file");
  }
};

// Delete File by ID
export const deleteFileById = async (req, res) => {
  try {
    const file = await Upload.findById(req.params.id);
    if (!file) return res.status(404).send('File not found');

    await file.deleteOne();
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).send('Error deleting file');
  }
};

//getUserFiles
export const getUserFiles = async (req, res) => {
  try {
    const userId = req.user.id;
    const files = await Upload.find({ userId });
    res.status(200).json({ files });
  } catch (error) {
    console.error("Error fetching user files:", error);
    res.status(500).json({ error: "Failed to fetch user files" });
  }
};


