import { parse, walk, generate } from "css-tree";
import { IPropertiesMap, IEditorConfig } from "./lib/types";
import sortList from "./helpers/sortList";
import formatCSS from "./helpers/formatCSS";

// replace selector properties list with sorted properties list
export function sortCSS(
  text: string,
  propertiesMap: IPropertiesMap,
  editorConfig: IEditorConfig
): string {
  const ast = parse(text);

  walk(ast, (node) => {
    if (node.type === "Rule") {
      const sortedList = sortList(node.block.children, propertiesMap);
      node.block.children.clear();
      node.block.children.appendList(sortedList);
    }
  });

  return formatCSS(generate(ast), editorConfig);
}
