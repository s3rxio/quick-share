import { TransformFnParams } from "class-transformer";

export const toArray = <T>(params: TransformFnParams, sperator = ","): T[] =>
  params.value?.split ? params.value.split(sperator) : [];
