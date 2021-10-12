import express from "express";
import multer from "multer";
import { Storage as localStorage } from "./utils/storage.js";
import path from "path";
import { v4 as uuid } from "uuid";

const router = express();
const storage = multer.diskStorage({
  destination: "files/",
  filename: (req, file, cb) => {
    cb(null, uuid() + "." + file.mimetype.split("/")[1]);
  },
});
const upload = multer({ storage });
const imagesStore = new localStorage("store", "images", "json");

router.use(express.json());
router.use(express.static("files"));

router.options("*", (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "https://flacial.github.io",
  });

  res.send("Headers set");
});

router.use("*", (req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "https://flacial.github.io",
  });
  next();
});

router.post("/image/api/upload", upload.single("imageFile"), (req, res) => {
  return res.status(201).send({
    fileUrl: `${req.protocol}://${req.headers.host}/image/api/${req.file.filename}`,
  });
});

router.get("/image/api/:fileName", (req, res) => {
  const { fileName } = req.params;

  return res.sendFile(path.resolve(`files/${fileName}`));
});

router.listen(process.env.PORT || 8124, () =>
  console.log("Server listening on 8124")
);

