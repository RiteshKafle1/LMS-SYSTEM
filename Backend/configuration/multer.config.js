const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, `${file.filename - Date.now()}`);
  },
});

function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only images are allowed"), false);
}

const upload = multer({ storage, fileFilter });
module.exports = upload;
