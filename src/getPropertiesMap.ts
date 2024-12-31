import * as vscode from "vscode";
import { ICategories, IPropertiesMap } from "./lib/types";
import { defaultSortOrder, defaultCategories } from "./lib/defaultConfig";

/**
 * Get the properties map for sorting
 *
 * @returns {IPropertiesMap} - the properties map for sorting
 */
export default function getPropertiesMap(): IPropertiesMap {
  const config = vscode.workspace.getConfiguration("Stylesheet Sorter");
  let categories: ICategories = config.get("Categories", {});
  let sortOrder: string[] = config.get("Sort Order", []);

  let validConfig =
    Object.keys(categories).length === sortOrder.length && sortOrder.length > 0;

  validConfig &&
    sortOrder.forEach((category) => {
      if (!Object.keys(categories).includes(category)) {
        validConfig = false;
        console.error(`Stylesheet Sorter: No category ${category} found.`);
      }
    });

  if (!validConfig) {
    console.error(
      "Stylesheet Sorter: Invalid configuration. Please check sort order in settings. Using default sort order."
    );
    categories = defaultCategories;
    sortOrder = defaultSortOrder;
  }

  let propertiesMap: IPropertiesMap = {};
  let index = 0;
  sortOrder.forEach((category) => {
    categories[category].forEach((property) => {
      propertiesMap[property] = index++;
    });
  });

  return propertiesMap;
}
