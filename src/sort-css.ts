import { ICategory } from "./lib/types";

export function sortCSS(
  css: string,
  sortOrder: string[],
  properties: ICategory[]
): string {
  console.log("SORTING");
  console.log(css, sortOrder, properties);

  return "this text will replace current CSS";
}
