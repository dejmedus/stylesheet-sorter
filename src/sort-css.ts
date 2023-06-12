import { parse, walk, generate, List, CssNode } from "css-tree";
import { ICategories } from "./lib/types";

// replace selector properties list with sorted properties list
export function sortCSS(
  text: string,
  sortOrder: string[],
  categories: {}
): string {
  const ast = parse(text);
  const propertiesMap = getPropertiesMap(sortOrder, categories);

  walk(ast, (node) => {
    if (node.type === "Rule") {
      const sortedList = sortList(node.block.children, propertiesMap);
      node.block.children.clear();
      node.block.children.appendList(sortedList);
    }
  });

  return generate(ast);
}

function getPropertiesMap(sortOrder: string[], categories: ICategories) {
  let propertiesMap: { [property: string]: number } = {};
  let index = 0;
  for (let i = 0; i < sortOrder.length; i++) {
    for (let j = 0; j < categories[sortOrder[i]].length; j++) {
      propertiesMap[categories[sortOrder[i]][j]] = index++;
    }
  }
  return propertiesMap;
}

function sortList(
  list: List<CssNode>,
  propertiesMap: { [property: string]: number }
): List<CssNode> {
  // https://github.com/csstree/csstree/blob/612cc5f2922b2304869497d165a0cc65257f7a8b/lib/utils/List.js
  const listArray: CssNode[] = list.toArray();

  const { toSort, toAppend } = listArray.reduce(
    (result: { toSort: CssNode[]; toAppend: CssNode[] }, a: CssNode) => {
      if (
        a.type === "Declaration" &&
        propertiesMap.hasOwnProperty(a.property)
      ) {
        result.toSort.push(a);
      } else {
        result.toAppend.push(a);
      }
      return result;
    },
    { toSort: [], toAppend: [] }
  );

  toSort.sort((a, b) =>
    a.type === "Declaration" && b.type === "Declaration"
      ? propertiesMap[a.property] - propertiesMap[b.property]
      : -1
  );

  return new List<CssNode>().fromArray([...toSort, ...toAppend]);
}
