import * as vscode from "vscode";

export default function getEditorConfig() {
  const editor = vscode.workspace.getConfiguration("editor");
  let indentSize: number = editor.get("indentSize", 2);

  // handle tabSize setting
  if (typeof indentSize !== "number") {
    indentSize = editor.get("tabSize", 2);
    if (typeof indentSize !== "number") {
      indentSize = 2;
    }
  }

  const cssFormat = vscode.workspace.getConfiguration("css.format");
  const collapse: "collapse" | "expand" = cssFormat.get(
    "braceStyle",
    "collapse"
  );
  const newline: boolean = cssFormat.get("newlineBetweenRules", true);

  return {
    indentSize: indentSize,
    collapse: collapse,
    newline: newline,
  };
}
