import * as assert from "assert";

import { sortCSS } from "../sortCSS";
import defaultPropertiesMap from "./_defaultPropertiesMap";

suite("Ignore sorting", () => {
  const propertiesMap = defaultPropertiesMap();

  test("above comments: don't change", () => {
    const unsortedString = `.class {
          /* Standard box shadow */
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

          /* Older Webkit fallback */
          -webkit-box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

          /* Microsoft Edge Legacy */
          -ms-box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }`;

    assert.strictEqual(sortCSS(unsortedString, propertiesMap), unsortedString);
  });

  test("multiline above comments: don't change", () => {
    const unsortedString = `.class {
        text-decoration: underline;
        /* color
        comment */
        color: red;
      }`;

    assert.strictEqual(sortCSS(unsortedString, propertiesMap), unsortedString);
  });
});
