import * as vscode from "vscode";
import { ICategories } from "../lib/types";
import * as sortConfig from "../lib/sort.config.json";

export default function getPropertiesMap() {
  // get config from workspace or use default properties and sort order
  const config = vscode.workspace.getConfiguration("CSS Style Sorter");
  let categories: ICategories = config.get("Categories", sortConfig.categories);
  let sortOrder: string[] = config.get(
    "Sort Order",
    sortConfig.order
  ).sortOrder;

  // ensure valid config files - categories in sort order must exist in categories list
  let validConfig = Object.keys(categories).length === sortOrder.length;

  if (validConfig) {
    for (let i = 0; i < sortOrder.length; i++) {
      if (!Object.keys(categories).includes(sortOrder[i])) {
        validConfig = false;
        console.error(
          "CSS Style Sorter: No category ",
          sortOrder[i],
          " found."
        );

        break;
      }
    }
  }

  // if config is invalid, use defaults
  if (!validConfig) {
    console.error(
      "CSS Style Sorter: Invalid configuration. Please check sort order in settings. Using default sort order."
    );
    categories = sortConfig.categories;
    sortOrder = sortConfig.order.sortOrder;
  }

  let propertiesMap: { [property: string]: number } = {};
  let index = 0;
  for (let i = 0; i < sortOrder.length; i++) {
    for (let j = 0; j < categories[sortOrder[i]].length; j++) {
      propertiesMap[categories[sortOrder[i]][j]] = index++;
    }
  }
  return propertiesMap;
}
