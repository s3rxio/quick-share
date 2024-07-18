import { TransformFnParams } from "class-transformer";

export const toNumber = (params: TransformFnParams) =>
  params.value ? Number(params.value) : 0;
