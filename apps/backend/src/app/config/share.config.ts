import ms from "ms";

export const shareConfig = {
  expiration: {
    default: ms(process.env.QCKSHARE_API_SHARE_EXPIRATION_DEFAULT || "12h"),
    max: ms(process.env.QCKSHARE_API_SHARE_EXPIRATION_MAX || "7d")
  }
};
