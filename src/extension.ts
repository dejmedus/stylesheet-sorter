// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { sortCSS } from "./sort-css";
import * as sortConfig from "./lib/sort.config.json";
import { ICategory } from "./lib/types";

let disposable: vscode.Disposable | undefined;

export function activate(context: vscode.ExtensionContext) {
  // get properties list
  const properties: ICategory[] = sortConfig.properties;

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

  disposable = vscode.workspace.onDidSaveTextDocument(
    (document: vscode.TextDocument) => {
      // if file is CSS, replace current stylesheet with sorted CSS
      if (document.languageId === "css") {
        const text = document.getText();
        const sortedCSS = sortCSS(text, sortOrder, properties);

        const edit = new vscode.WorkspaceEdit();
        const documentUri = document.uri;
        const wholeRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(text.length)
        );
        edit.replace(documentUri, wholeRange, sortedCSS);
        vscode.workspace.applyEdit(edit);
      }
    }
  );
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
  if (disposable) {
    disposable.dispose();
  }
}
