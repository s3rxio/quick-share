import { JwtConfig } from "@backend/common/types";

export const jwtConfig: JwtConfig = {
  global: true,
  secret: process.env.QCKSHARE_JWT_SECRET,
  signOptions: { expiresIn: "1d" }
};
