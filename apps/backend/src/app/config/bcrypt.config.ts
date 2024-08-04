import { BcryptConfig } from "@backend/common/types";

export const bcryptConfig: BcryptConfig = {
  saltRounds: parseInt(process.env.QCKSHARE_BCRYPT_SALT_ROUNDS, 10) || 10
};
