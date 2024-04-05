import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  // Allow only Excel and PDF files
  if (!file.originalname.match(/\.(xlsx|xls|pdf)$/)) {
    return cb(new Error("Invalid file type"), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Error handling middleware
export const handleFileUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer errors
    console.error("Multer error:", err);
    return res.status(400).json({ message: err.message });
  } else if (err) {
    // Handle other errors
    console.error("File upload error:", err);
    return res.status(400).json({ message: err.message });
  } else {
    next();
  }
};
