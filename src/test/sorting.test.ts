import * as assert from "assert";

import { sortCSS } from "../sortCSS";
import defaultPropertiesMap from "./_defaultPropertiesMap";
import { defaultEditorConfig } from "./_defaultEditorConfig";

suite("Sort", () => {
  const propertiesMap = defaultPropertiesMap();

  test("Sort CSS", () => {
    const unSortedString = `.class {
        text-decoration: underline;
        color: red;
      }`;
    const sortedString = `.class {
        color: red;
        text-decoration: underline;
      }`;

    assert.strictEqual(
      sortCSS(unSortedString, propertiesMap, defaultEditorConfig),
      sortedString
    );
  });

  test("inline comments", () => {
    const unSortedString = `.class {
        text-decoration: underline;
        color: red; /* color */
      }`;
    const sortedString = `.class {
        color: red; /* color */
        text-decoration: underline;
      }`;

    assert.strictEqual(
      sortCSS(unSortedString, propertiesMap, defaultEditorConfig),
      sortedString
    );
  });

  test("above comments", () => {
    const unSortedString = `.class {
        text-decoration: underline;
        /* color */
        color: red;
      }`;
    const sortedString = `.class {
        /* color */
        color: red;
        text-decoration: underline;
      }`;

    assert.strictEqual(
      sortCSS(unSortedString, propertiesMap, defaultEditorConfig),
      sortedString
    );
  });
});
