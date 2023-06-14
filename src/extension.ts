// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { sortCSS } from "./sortCSS";
import * as sortConfig from "./lib/sort.config.json";
import { ICategories } from "./lib/types";
import getPropertiesMap from "./helpers/getPropertiesMap";

let disposable: vscode.Disposable | undefined;

export function activate(context: vscode.ExtensionContext) {
  // get config from workspace or use default properties and sort order
  const config = vscode.workspace.getConfiguration("css-style-sorter");
  const categories: ICategories = config.get(
    "categories",
    sortConfig.categories
  );
  const sortOrder: string[] = config.get("sortOrder", sortConfig.order);
  const propertiesMap = getPropertiesMap(sortOrder, categories);

  // on save inside css files, sort CSS
  let disposable = vscode.workspace.onWillSaveTextDocument((event) => {
    if (event.document.languageId === "css") {
      const text = event.document.getText();
      const sortedCSS = sortCSS(text, propertiesMap);

      // onWillSave + waitUntil prevents looping
      event.waitUntil(
        Promise.resolve([
          new vscode.TextEdit(
            new vscode.Range(
              event.document.positionAt(0),
              event.document.positionAt(text.length)
            ),
            sortedCSS
          ),
        ])
      );
    }
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
  if (disposable) {
    disposable.dispose();
  }
}
