const express = require("express");
const multer = require("multer");

const db = require("../data/database");

const fileStore = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: fileStore });

const router = express.Router();

router.get("/", async function (req, res) {
  const users = await db.getDb().collection("users").find().toArray()
  res.render("profiles", { users });
});

router.get("/new-user", function (req, res) {
  res.render("new-user");
});

router.post("/profiles", upload.single("image"), async (req, res, next) => {
  const uploadedImageFile = req.file;
  const uploadedData = req.body;

  await db.getDb().collection("users").insertOne({
    name: uploadedData.username,
    imagePath: uploadedImageFile.path,
  });

  console.log(uploadedData);
  console.log(uploadedImageFile);
  res.redirect("/");
});

module.exports = router;
