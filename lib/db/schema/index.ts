export * from "./tables";
export * from "./relations";

import * as tables from "./tables";
import * as rels from "./relations";

export const schema = {
  ...tables,
  ...rels,
} as const;
