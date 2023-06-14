import { parse, walk, generate } from "css-tree";
import { IPropertiesMap, IEditorConfig } from "./lib/types";
import sortList from "./helpers/sortList";

// replace selector properties list with sorted properties list
export function sortCSS(
  text: string,
  propertiesMap: IPropertiesMap,
  editorConfig: IEditorConfig
): string {
  const commentMap: { [location: string]: string } = {};
  const ast = parse(text, {
    positions: true,
    onComment: function (value, loc) {
      commentMap[loc.start.line] = value;
    },
  });

  walk(ast, (node) => {
    if (node.type === "Rule") {
      const sortedList = sortList(node.block.children, propertiesMap);
      node.block.children.clear();
      node.block.children.appendList(sortedList);
    }
  });

  return formatCSS(generate(ast), editorConfig);
}

function formatCSS(css: string, editorConfig: IEditorConfig): string {
  // formatting and indentation config
  const openBracket = editorConfig.collapse === "collapse" ? " {\n" : "\n{\n";
  const closeBracket = editorConfig.newline ? "\n}\n\n" : "\n}\n";

  // formatting rules
  css = css.replace(/([^}])\s*(})/g, "$1;}"); // ensure each declaration ends with a ;
  css = css.replace(/;\s*(?!})/g, ";\n"); // newline after each css property
  css = css.replace(/{/g, openBracket); // newline after {
  css = css.replace(/}}/g, "\n}}"); // new line after } inside block
  css = css.replace(/\}(?![\}])/g, closeBracket); // new line after } not inside block
  css = css.replace(/(?<!:):(?![-\w]+\s*\{)[\s]*/g, ": "); // space after property name (color: )
  css = css.replace(/,\s*/g, ", "); // space between comma separated selectors

  // indentation rules
  let indentLevel = 0;
  let formattedCSS = "";

  const lines = css.split("\n");
  for (let line of lines) {
    line = line.trim();

    // at end of block decrease the indentation level
    if (line.endsWith("}")) {
      indentLevel--;
    }

    formattedCSS += " ".repeat(editorConfig.indentSize * indentLevel);

    // at beginning of block increase the indentation level
    if (line.endsWith("{")) {
      indentLevel++;
    }

    formattedCSS += line + "\n";
  }

  return formattedCSS.trim();
}
