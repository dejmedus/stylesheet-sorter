import { parse, walk, generate } from "css-tree";
import { IPropertiesMap } from "./lib/types";
import sortList from "./helpers/sortList";

// replace selector properties list with sorted properties list
export function sortCSS(text: string, propertiesMap: IPropertiesMap): string {
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

  return generate(ast);
}
