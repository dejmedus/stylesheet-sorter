import { IPropertiesMap, Declaration } from "./lib/types";

/**
 * Sorts stylesheets by property order
 *
 * @param stylesheet stylesheet to sort
 * @param propertiesMap properties map to sort the css
 * @returns the sorted stylesheet
 */
export function sortCSS(
  stylesheet: string,
  propertiesMap: IPropertiesMap
): string {
  // https://regex101.com/r/xG831U/4
  const regex = /\{(\s([^{}]*?)\s*)\}/gm;

  return stylesheet.replace(regex, (block, _, declarations) => {
    if (!declarations) {
      return block;
    }

    return sortBlock(block, declarations, propertiesMap);
  });
}

/**
 * Sorts style blocks found by regex.
 *
 * @param block - The full style block found by regex. ex: { color: red; background-color: blue; }
 * @param declarations - The declarations. ex: color: red; background-color: blue;
 * @param propertiesMap - Object that maps properties to their sort order index.
 * @returns The sorted block.
 */
function sortBlock(
  block: string,
  declarations: string,
  propertiesMap: IPropertiesMap
): string {
  const sections = declarations.split("\n\n");

  sections.forEach((section) => {
    const sortedSection = sortSection(section, propertiesMap);
    block = block.replace(section, sortedSection);
  });

  return block;
}

/**
 * Sorts section of style block (separated by newlines)
 *
 * @param section - A section of the style block. ex: color: red; background-color: blue;
 * @param propertiesMap - Object that maps properties to their sort order index.
 * @returns The sorted section.
 */
function sortSection(section: string, propertiesMap: IPropertiesMap): string {
  // https://regex101.com/r/eXptio/2
  const regex = /^\s*\/\*[\s\S]*?\*\/\s*$/gm;
  const containsHeaderComment = regex.test(section);
  if (containsHeaderComment) {
    return section;
  }

  const unsortedDeclarations: Declaration[] = splitDeclarations(section);
  if (!unsortedDeclarations.length) {
    return section;
  }

  const sortedDeclarations: Declaration[] = unsortedDeclarations.sort(
    (aDec: string, bDec: string) => {
      const aProperty = aDec.split(":")[0].trim();
      const bProperty = bDec.split(":")[0].trim();

      // nullish coalescing
      // https://www.typescriptlang.org/play/?#example/nullish-coalescing
      const aIndex = propertiesMap[aProperty] ?? Number.MAX_VALUE;
      const bIndex = propertiesMap[bProperty] ?? Number.MAX_VALUE;

      return aIndex - bIndex;
    }
  );

  // should keep the same join char as original section?
  // const decJoinChar = section.includes("\n") ? "\n" : " ";
  const sortedDeclarationsStr: string = sortedDeclarations.join("\n");

  return sortedDeclarationsStr;
}

/**
 * Splits declarations into an array of declaration strings
 *
 * @param declarations - The declarations ex: color: red; background-color: blue;
 * @returns An array of declarations
 */
function splitDeclarations(declarations: string): Declaration[] {
  const decArr: string[] = [];
  let curDec = "";
  let hasComment = false;

  for (let i = 0; i < declarations.length; i++) {
    const curChar = declarations[i];
    const nextChars = declarations.slice(i, i + 2);

    if (hasComment && nextChars === "*/") {
      hasComment = false;

      decArr.push(curDec.trimEnd() + " */");

      curDec = "";
      // account for the extra */ chars
      i += 2;
      continue;
    }

    if (!hasComment && curChar === ";") {
      const currentLine = declarations.slice(i, declarations.indexOf("\n", i));

      if (currentLine.includes("/*")) {
        hasComment = true;
      } else {
        decArr.push(curDec.trimEnd() + ";");

        curDec = "";
        continue;
      }
    }

    curDec += curChar;
  }

  decArr.push(curDec.trimEnd());

  // // type guard + predicates
  // // https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
  const isDeclaration = (dec: string): dec is Declaration =>
    dec.includes(":") && dec.split(":").length >= 2;

  return (
    decArr
      // .map((dec) => (dec.slice(0, 2) === "\n" ? dec.replace("\n", "") : dec))
      .map((dec) => dec.replace("\n", ""))
      .filter(isDeclaration)
  );
}
