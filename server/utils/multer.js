import multer from "multer";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // limit file size to 5MB
});

export default upload;
