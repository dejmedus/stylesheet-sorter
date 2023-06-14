import { List, CssNode } from "css-tree";

// https://github.com/csstree/csstree/blob/612cc5f2922b2304869497d165a0cc65257f7a8b/lib/utils/List.js
export default function sortList(
  list: List<CssNode>,
  propertiesMap: { [property: string]: number }
): List<CssNode> {
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
