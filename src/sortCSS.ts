import { IPropertiesMap } from "./lib/types";

/**
 * Sorts stylesheets by property order
 *
 * @param {string} stylesheet stylesheet to sort
 * @param {IPropertiesMap} propertiesMap properties map to sort the css
 * @returns {string} the sorted stylesheet
 */
export function sortCSS(
  stylesheet: string,
  propertiesMap: IPropertiesMap
): string {
  // https://regex101.com/r/8463Hl/1
  const regex = /\{(\s*([^{}]*?)\s*)\}/gm;

  return stylesheet.replace(regex, (block, innerText, declarations) => {
    if (!declarations) {
      return block;
    }

    const trailingSpacesNum =
      innerText.length - innerText.trimStart().length - 1;
    const trailingSpaces = " ".repeat(trailingSpacesNum);

    return sortBlock(block, declarations, trailingSpaces, propertiesMap);
  });
}

/**
 * Sorts style blocks found by regex.
 *
 * @param block - The full style block found by regex. ex: { color: red; background-color: blue; }
 * @param declarations - The declarations. ex: color: red; background-color: blue;
 * @param trailingSpaces - The trailing spaces before the block.
 * @param propertiesMap - Object that maps properties to their sort order index.
 */
function sortBlock(
  block: string,
  declarations: string,
  trailingSpaces: string,
  propertiesMap: { [key: string]: number }
) {
  const unsortedDeclarations = declarations
    .split(";")
    .map((dec) => dec.trim())
    .filter((dec) => dec !== "");

  if (!unsortedDeclarations.length) {
    return block;
  }

  const sortedDeclarations = unsortedDeclarations.sort(
    (aDec: string, bDec: string) => {
      const a = aDec.split(":")[0].trim();
      const b = bDec.split(":")[0].trim();

      const aIndex = propertiesMap[a] || Number.MAX_VALUE;
      const bIndex = propertiesMap[b] || Number.MAX_VALUE;

      return bIndex - aIndex;
    }
  );

  const sortedDeclarationsStr =
    sortedDeclarations.join(`;\n${trailingSpaces}`) + ";";

  return block.replace(declarations, sortedDeclarationsStr);
}
