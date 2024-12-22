import { parse, walk, generate } from "css-tree";
import { IPropertiesMap, IEditorConfig } from "./lib/types";
import sortList from "./helpers/sortList";
import formatCSS from "./helpers/formatCSS";

/**
 * Sorts CSS properties
 *
 *  * Uses `parse`, `walk`, and `generate` from the `css-tree` library
 * {@link https://github.com/csstree/csstree/blob/612cc5f2922b2304869497d165a0cc65257f7a8b/docs/definition-syntax.md|css-tree docs}
 *
 * @param {string} stylesheet stylesheet to sort
 * @param {IPropertiesMap} propertiesMap properties map to sort the css
 * @param {IEditorConfig} editorConfig editor configuration settings
 * @returns {string} the sorted stylesheet
 */
export function sortCSS(
  stylesheet: string,
  propertiesMap: IPropertiesMap,
  editorConfig: IEditorConfig
): string {
  const ast = parse(stylesheet);

  walk(ast, (node) => {
    if (node.type === "Rule") {
      const sortedList = sortList(node.block.children, propertiesMap);
      node.block.children.clear();
      node.block.children.appendList(sortedList);
    }
  });

  return formatCSS(generate(ast), editorConfig);
}
