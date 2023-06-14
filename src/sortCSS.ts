import {
  parse,
  walk,
  generate,
  Rule,
  Declaration,
  Block,
  CssNode,
} from "css-tree";
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

  let css = "";
  walk(ast, (node) => {
    // add comments
    if (node.type === "Rule") {
      const sortedList = sortList(node.block.children, propertiesMap);
      node.block.children.clear();
      node.block.children.appendList(sortedList);
      // css += generateCSS(node);
    }
  });

  // return css;
  return formatCSS(generate(ast));
}

function formatCSS(css: string): string {
  css = css.replace(/{/g, " {\n");
  css = css.replace(/}/g, "\n}\n\n");
  css = css.replace(/;/g, ";\n");
  // css = css.replace(/:/g, ": ");
  css = css.replace(/,\S+/g, ", ");

  // Add indentation
  const indentSize = 2;
  const indentChar = " ";

  let indentLevel = 0;
  let formattedCSS = "";

  // Split the CSS into individual lines
  const lines = css.split("\n");

  for (let line of lines) {
    line = line.trim();

    if (line.endsWith("}")) {
      // Decrease the indentation level
      indentLevel--;
    }

    // Add indentation for the current line
    for (let i = 0; i < indentLevel; i++) {
      formattedCSS += indentChar.repeat(indentSize);
    }

    formattedCSS += line + "\n";

    if (line.endsWith("{")) {
      // Increase the indentation level
      indentLevel++;
    }
  }

  return formattedCSS.trim();
}

// function generateCSS(curRule: Rule): string {
//   function generateDeclaration(declaration: Declaration): string {
//     let valueStr = "";

//     if (declaration.value.type === "Value") {
//       declaration.value.children.forEach((valueNode) => {
//         console.log(valueNode.type);
//         if (valueNode.type === "Identifier") {
//           valueStr += `${valueNode.name} `;
//         } else if (
//           valueNode.type === "Percentage" ||
//           valueNode.type === "Number" ||
//           valueNode.type === "Dimension"
//         ) {
//           valueStr += `${valueNode.value} `;
//         }
//       });
//     }
//     return `${declaration.property}: ${valueStr.slice(
//       0,
//       valueStr.length - 1
//     )};`;
//   }

//   function generateBlock(block: Block, indentLevel: number): string {
//     const indent = " ".repeat(indentLevel * 2);
//     let blockCSS = "";

//     block.children.forEach((child) => {
//       // add comments
//       if (child.type === "Declaration") {
//         blockCSS += `${indent}${generateDeclaration(child)}\n`;
//       }
//     });

//     return blockCSS;
//   }

//   function removeComma(str: string) {
//     return str.slice(0, str.length - 2);
//   }

//   function generateRule(rule: Rule, indentLevel: number): string {
//     const indent = " ".repeat(indentLevel * 2);
//     let ruleCSS = "";

//     if (rule.prelude.type === "SelectorList") {
//       let selectors = "";
//       rule.prelude.children.forEach((selectorNode) => {
//         if (selectorNode.type === "Selector") {
//           selectorNode.children.forEach((selector) => {
//             if (
//               selector.type === "ClassSelector" ||
//               selector.type === "IdSelector" ||
//               selector.type === "AttributeSelector" ||
//               selector.type === "TypeSelector"
//             ) {
//               selectors += `${selector.name}, `;
//             } else if (
//               selector.type === "PseudoClassSelector" ||
//               selector.type === "PseudoElementSelector"
//             ) {
//               selectors = removeComma(selectors);
//               selectors += `:${selector.name}, `;
//             }
//           });
//         }
//       });
//       ruleCSS += `${indent}${removeComma(selectors)} {\n`;
//       ruleCSS += generateBlock(rule.block, indentLevel + 1);
//       ruleCSS += `${indent}}\n`;
//     }
//     return ruleCSS;
//   }
//   const css = generateRule(curRule, 0);
//   console.log(css);
//   return css;
// }
