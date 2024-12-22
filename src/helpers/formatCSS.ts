import { IEditorConfig } from "../lib/types";

/**
 * Format styles based on the editor configuration settings
 *
 * @param {string} stylesheet stylesheet string to format
 * @param {IEditorConfig} editorConfig editor configuration settings
 * @returns {string} the formatted stylesheet string
 */
export default function formatCSS(
  stylesheet: string,
  editorConfig: IEditorConfig
): string {
  const { collapse, newline, indentSize } = editorConfig;

  const openBracket = collapse === "collapse" ? " {\n" : "\n{\n";
  const closeBracket = newline ? "\n}\n\n" : "\n}\n";

  const formatRules: [RegExp, string][] = [
    [/([^}])\s*(})/g, "$1;}"], // ensure each declaration ends with a ;
    [/;\s*(?!})/g, ";\n"], // newline after each stylesheet property
    [/{/g, openBracket], // newline after {
    [/}}/g, "\n}}"], // new line after } inside block
    [/\}(?![\}])/g, closeBracket], // new line after } not inside block
    [/(?<!:):(?![-\w]+\s*\{)[\s]*/g, ": "], // space after property name (color: )
    [/,\s*/g, ", "], // space between comma separated selectors
  ];

  for (const rule of formatRules) {
    // should this be replaceAll or replace?
    stylesheet = stylesheet.replaceAll(...rule);
  }

  let indentLevel = 0;
  let formattedCSS = "";

  const lines = stylesheet.split("\n");
  for (let line of lines) {
    line = line.trim();

    if (line.endsWith("}")) {
      indentLevel--;
    }

    formattedCSS += " ".repeat(indentSize * indentLevel);

    if (line.endsWith("{")) {
      indentLevel++;
    }

    formattedCSS += line + "\n";
  }

  return formattedCSS.trim();
}
