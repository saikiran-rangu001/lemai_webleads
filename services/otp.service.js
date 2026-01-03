import crypto from "crypto";
import { saveOtp, getOtp, updateOtp } from "../utils/otpStore.js";
import { otpQueue } from "../utils/queue.js";

export const sendOtpService = async (email) => {
  const existing = await getOtp(email);

  if (existing && !existing.verified) {
    throw new Error("OTP already sent. Please wait.");
  }

  const code = crypto.randomInt(100000, 999999).toString();

  await saveOtp(email, code);

  await otpQueue.add(
    "send-otp",
    { email, code },
    {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 5000   // retries after 5s, then 10s, 20s...
      },
      removeOnComplete: true,
      removeOnFail: false
    }
  );


  return true;
};

export const verifyOtpService = async (email, otp) => {
  const data = await getOtp(email);

  if (!data) throw new Error("OTP expired or not requested");

  if (data.attempts >= 5) throw new Error("Too many attempts");

  if (data.code !== otp) {
    data.attempts += 1;
    await updateOtp(email, data);
    throw new Error("Invalid OTP");
  }

  data.verified = true;
  await updateOtp(email, data);

  return true;
};
