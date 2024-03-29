import express from "express";
import { addAttributes, deleteAttribute, getAttributes } from "../controller/attributesController.js";
const router = express.Router();

router.get('/', getAttributes)
router.post('/',addAttributes)
router.delete("/:id", deleteAttribute);

export default router