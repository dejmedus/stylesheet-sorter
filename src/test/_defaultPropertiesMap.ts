// for testing purposes
import { defaultSortOrder, defaultCategories } from "../lib/defaultConfig";
import { IPropertiesMap } from "../lib/types";

export default function defaultPropertiesMap() {
  let propertiesMap: IPropertiesMap = {};

  let index = 0;
  defaultSortOrder.forEach((category) => {
    defaultCategories[category].forEach((property) => {
      propertiesMap[property] = index++;
    });
  });

  return propertiesMap;
}
