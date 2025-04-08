const express = require("express");
const router = express.Router();
const File = require("./fileModel");
const upload = require("./multerConfig");
const uploadToCloudinary = require("./cloudinary");
const fs = require("fs");

// uploading files
router.post("/upload", upload.array("files", 10), async (req, res) => {
  try {
    if (req.files.length === 0 || !req.files) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadFiles = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.path);

      const newFile = new File({
        filename: file.originalname,
        path: result.secure_url,
        localPath: file.path,
        size: file.size,
        uploadDate: new Date(),
        public_id: result.public_id,
      });

      await newFile.save();
      uploadFiles.push(newFile);
    }

    res.status(200).json({
      message: "Files uploaded successfully",
      files: uploadFiles,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ message: "Error uploading files" });
  }
});

//for listing all files
router.get("/files", async (req, res) => {
  try {
    const files = await File.find();
    if (!files) return res.status(404).json({ message: "No files found" });
    res.status(200).json({ message: "File fetched sucessfully", files: files });
  } catch (error) {
    console.log("error getting files:", error);
  }
});

//for downloading files
router.get("/download/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return "file id Required";
    const file = await File.findById(id);
    console.log("file:", file.path);
    if (!file) return res.status(404).json({ message: "File not found" });

    const filePath = file.localPath; // Local path to the file
    const fileName = file.filename;
    res.set("Cache-Control", "public, max-age=3600"); // Cache for 1 hour (3600 seconds) // Original filename
    res.download(filePath, fileName);
    //res.redirect(file.path);
  } catch (error) {
    console.log("error downloading file:", error);
  }
});
module.exports = router;
