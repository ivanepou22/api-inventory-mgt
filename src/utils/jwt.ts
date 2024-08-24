import jwt, { JwtPayload } from "jsonwebtoken";

interface SignOption {
  expiresIn?: string | number;
}
const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: "1h",
};
export async function generateAccessToken(
  payload: JwtPayload,
  options: SignOption = DEFAULT_SIGN_OPTION
) {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  // Use this command to generate ACCESS_TOKEN_SECRET: openssl rand -base64 32
  const token = jwt.sign(payload, secret!, options);
  return token;
}
