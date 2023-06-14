import { ICategories } from "../lib/types";

export default function getPropertiesMap(
  sortOrder: string[],
  categories: ICategories
) {
  let propertiesMap: { [property: string]: number } = {};
  let index = 0;
  for (let i = 0; i < sortOrder.length; i++) {
    for (let j = 0; j < categories[sortOrder[i]].length; j++) {
      propertiesMap[categories[sortOrder[i]][j]] = index++;
    }
  }
  return propertiesMap;
}
