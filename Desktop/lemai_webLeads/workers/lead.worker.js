import "../config/env.js";
import { Worker } from "bullmq";
import db from "../config/database.js";
import axios from "axios";
import redis from "../utils/redis.js";

new Worker(
  "lead-queue",
  async (job) => {
    const { leadId } = job.data;

    const [rows] = await db.query("SELECT * FROM leads WHERE id = ?", [leadId]);
    const lead = rows[0];

    if (!lead) return;

    try {
      await axios.post(process.env.CRM_API_URL, {
        email: lead.email,
        name: lead.name,
        phone: lead.full_phone
      });

      await db.query(
        "UPDATE leads SET status = ? WHERE id = ?",
        ["SENT_TO_CRM", leadId]
      );

      console.log("Lead pushed to CRM:", lead.email);
    } catch (err) {
      console.error("CRM Failed, retrying...");

      await db.query(
        "UPDATE leads SET status = ?, retry_count = retry_count + 1 WHERE id = ?",
        ["RETRYING", leadId]
      );

      throw err;
    }
  },
  { connection: redis }
);

console.log("Lead Worker Running");
