import * as vscode from "vscode";
import { sortCSS } from "./sortCSS";
import getPropertiesMap from "./helpers/getPropertiesMap";
import getEditorConfig from "./helpers/getEditorConfig";

let disposable: vscode.Disposable | undefined;

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.workspace.onWillSaveTextDocument((event) => {
    const languages = ["css", "scss"];

    if (languages.includes(event.document.languageId)) {
      const propertiesMap = getPropertiesMap();
      const editorConfig = getEditorConfig();

      const stylesheet = event.document.getText();
      const sortedCSS = sortCSS(stylesheet, propertiesMap, editorConfig);

      // onWillSave + waitUntil prevents looping
      event.waitUntil(
        Promise.resolve([
          new vscode.TextEdit(
            new vscode.Range(
              event.document.positionAt(0),
              event.document.positionAt(stylesheet.length)
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
