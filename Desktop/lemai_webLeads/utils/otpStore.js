import redis from "./redis.js";

const OTP_PREFIX = "otp:";

export const saveOtp = async (email, code) => {
  const payload = JSON.stringify({
    code,
    attempts: 0,
    verified: false
  });

  await redis.setex(`${OTP_PREFIX}${email}`, 300, payload); // 5 mins
};

export const getOtp = async (email) => {
  const data = await redis.get(`${OTP_PREFIX}${email}`);
  return data ? JSON.parse(data) : null;
};

export const updateOtp = async (email, payload) => {
  await redis.setex(`${OTP_PREFIX}${email}`, 300, JSON.stringify(payload));
};

export const deleteOtp = async (email) => {
  await redis.del(`${OTP_PREFIX}${email}`);
};
