import { List, CssNode } from "css-tree";

/**
 * Sorts the list of CSS nodes based on the properties map
 *
 * Uses `List` and `CssNode` from the `css-tree` library
 * {@link https://github.com/csstree/csstree/blob/612cc5f2922b2304869497d165a0cc65257f7a8b/lib/utils/List.js|css-tree docs}
 *
 * @param {List<CssNode>} list list of CSS nodes to sort
 * @param {Object} propertiesMap the properties map for sorting
 * @returns {List<CssNode>} the sorted list of CSS nodes
 */
export default function sortList(
  list: List<CssNode>,
  propertiesMap: { [property: string]: number }
): List<CssNode> {
  const listArray: CssNode[] = list.toArray();

  const { toSort, toAppend } = listArray.reduce(
    (result: { toSort: CssNode[]; toAppend: CssNode[] }, node: CssNode) => {
      if (
        node.type === "Declaration" &&
        propertiesMap.hasOwnProperty(node.property)
      ) {
        result.toSort.push(node);
      } else {
        result.toAppend.push(node);
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
