"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const financial_record_1 = __importDefault(require("../schema/financial-record"));
const router = express_1.default.Router();
router.get("/getAllByUserID/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        console.log("Fetching records for user:", userId);
        // Проверьте, что userId не пустой
        if (!userId) {
            return res.status(400).send({ message: "User ID is required" });
        }
        const records = yield financial_record_1.default.find({ userId: userId });
        if (records.length === 0) {
            return res.status(404).send("No records found for the user.");
        }
        res.status(200).send(records);
    }
    catch (err) {
        console.error("Error fetching financial records:", err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newRecordBody = req.body;
        console.log("Received record:", newRecordBody);
        if (!newRecordBody.userId || !newRecordBody.date || !newRecordBody.description || !newRecordBody.amount || !newRecordBody.category || !newRecordBody.paymentMethod) {
            return res.status(400).send({ message: "All fields are required" });
        }
        const newRecord = new financial_record_1.default(newRecordBody);
        const savedRecord = yield newRecord.save();
        res.status(201).send(savedRecord);
    }
    catch (err) {
        console.error("Error saving financial record:", err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const newRecordBody = req.body;
        const record = yield financial_record_1.default.findByIdAndUpdate(id, newRecordBody, { new: true });
        if (!record)
            return res.status(404).send();
        res.status(200).send(record);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const record = yield financial_record_1.default.findByIdAndDelete(id);
        if (!record)
            return res.status(404).send();
        res.status(200).send(record);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
exports.default = router;
