// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { sortCSS } from "./sort-css";
import * as sortConfig from "./lib/sort.config.json";
import { ICategories } from "./lib/types";

let disposable: vscode.Disposable | undefined;

export function activate(context: vscode.ExtensionContext) {
  // get categories list
  const categories: ICategories = sortConfig.categories;

  // get config from workspace or use default sort order
  const config = vscode.workspace.getConfiguration("css-style-sorter");
  const sortOrder: string[] = config.get("sortOrder", [
    "*",
    "Box Model",
    "Grid",
    "Flexbox",
    "Width and Height",
    "Margin and Padding",
    "Border",
    "Typography",
    "Background and Visual",
    "Transformations and Animations",
    "Other",
  ]);

  // on save inside css files, sort CSS
  let disposable = vscode.workspace.onWillSaveTextDocument((event) => {
    if (event.document.languageId === "css") {
      const text = event.document.getText();
      const sortedCSS = sortCSS(text, sortOrder, categories);

      // on willSave + waitUntil prevents looping
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
