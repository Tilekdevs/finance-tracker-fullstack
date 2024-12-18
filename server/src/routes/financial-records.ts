import express, { Request, Response } from "express";
import FinancialRecordModel from "../schema/financial-record";

const router = express.Router();

router.get("/getAllByUserID/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    console.log("Fetching records for user:", userId);

    if (!userId) {
      console.error("User ID is missing in request");
      return res.status(400).send({ message: "User ID is required" });
    }

    const records = await FinancialRecordModel.find({ userId: userId });
    console.log("Records found:", records);

    if (records.length === 0) {
      console.warn("No records found for user:", userId);
      return res.status(404).send({ message: "No records found for the user." });
    }

    res.status(200).send(records);
  } catch (err) {
    console.error("Error fetching financial records:", err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const newRecordBody = req.body;
    console.log("Пасхалко")
    console.log("Received record:", newRecordBody);

    if (!newRecordBody.userId || !newRecordBody.date || !newRecordBody.description || !newRecordBody.amount || !newRecordBody.category || !newRecordBody.paymentMethod) {
      console.error("Missing fields in request body:", newRecordBody);
      return res.status(400).send({ message: "All fields are required" });
    }

    const newRecord = new FinancialRecordModel(newRecordBody);
    const savedRecord = await newRecord.save();
    console.log("Record saved:", savedRecord);

    res.status(201).send(savedRecord);
  } catch (err) {
    console.error("Error saving financial record:", err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const newRecordBody = req.body;
    const record = await FinancialRecordModel.findByIdAndUpdate(id, newRecordBody, { new: true });

    if (!record) return res.status(404).send();

    res.status(200).send(record);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const record = await FinancialRecordModel.findByIdAndDelete(id);
    if (!record) return res.status(404).send();
    res.status(200).send(record);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
