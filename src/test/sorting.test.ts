import * as assert from "assert";

import { sortCSS } from "../sortCSS";
import defaultPropertiesMap from "./_defaultPropertiesMap";

const propertiesMap = defaultPropertiesMap();

suite("sort", () => {
  test("sort css", () => {
    const unsortedString = `.class {
        position: absolute;
        display: flex;

        font-size: 16px;
        font-family: Arial;
      }`;
    const sortedString = `.class {
        display: flex;
        position: absolute;

        font-family: Arial;
        font-size: 16px;
      }`;

    assert.strictEqual(sortCSS(unsortedString, propertiesMap), sortedString);
  });

  test("properties from different categories", () => {
    const unsortedString = `.class {
          margin: 10px;
          color: red;
          display: block;
        }`;
    const sortedString = `.class {
          display: block;
          margin: 10px;
          color: red;
        }`;

    assert.strictEqual(sortCSS(unsortedString, propertiesMap), sortedString);
  });

  test("properties from same category", () => {
    const unsortedString = `.class {
          margin-bottom: 10px;
          margin-top: 10px;
          margin-right: 5px;
          margin-left: 5px;
        }`;
    const sortedString = `.class {
          margin-top: 10px;
          margin-right: 5px;
          margin-bottom: 10px;
          margin-left: 5px;
        }`;

    assert.strictEqual(sortCSS(unsortedString, propertiesMap), sortedString);
  });

  test("properties not in properties map", () => {
    const unsortedString = `.class {
          text-decoration: underline;
          color: red;
          custom-property: value;
        }`;
    const sortedString = `.class {
          color: red;
          text-decoration: underline;
          custom-property: value;
        }`;

    assert.strictEqual(sortCSS(unsortedString, propertiesMap), sortedString);
  });

  test("newlines in styles", () => {
    const unsortedString = `body {
    custom-property: value;
    font:
      1em/150% Helvetica,
      Arial,
      sans-serif;
    text-decoration: underline;
    color: red;
  }`;
    const sortedString = `body {
    color: red;
    font:
      1em/150% Helvetica,
      Arial,
      sans-serif;
    text-decoration: underline;
    custom-property: value;
  }`;

    assert.strictEqual(sortCSS(unsortedString, propertiesMap), sortedString);
  });
});

suite("sort comments", () => {
  test("inline comments", () => {
    const unsortedString = `.class {
        text-decoration: underline;
        color: red; /* color */
      }`;
    const sortedString = `.class {
        color: red; /* color */
        text-decoration: underline;
      }`;

    assert.strictEqual(sortCSS(unsortedString, propertiesMap), sortedString);
  });

  test("multiline inline comments", () => {
    const unsortedString = `.class {
        text-decoration: underline;
        color: red; /* color
        comment */
      }`;
    const sortedString = `.class {
        color: red; /* color
        comment */
        text-decoration: underline;
      }`;

    assert.strictEqual(sortCSS(unsortedString, propertiesMap), sortedString);
  });

  test("outer comments", () => {
    const unsortedString = `@media (min-width: 70em) {
    /* Increase the global font size on larger screens or windows
       for better readability */
    body {
      font-size: 130%;
      font-family: Arial, sans-serif;
    }
  }

  /* Handle specific elements nested in the DOM */
  div p,
  #id:first-line {
    background-color: red;
    border-radius: 3px;
  }`;
    const sortedString = `@media (min-width: 70em) {
    /* Increase the global font size on larger screens or windows
       for better readability */
    body {
      font-family: Arial, sans-serif;
      font-size: 130%;
    }
  }

  /* Handle specific elements nested in the DOM */
  div p,
  #id:first-line {
    border-radius: 3px;
    background-color: red;
  }`;

    assert.strictEqual(sortCSS(unsortedString, propertiesMap), sortedString);
  });

  test("commented out styles", () => {
    const unsortedString = `/*.special {
    color: red;
    display: block;
  }*/`;
    const sortedString = `/*.special {
    display: block;
    color: red;
  }*/`;
    assert.strictEqual(sortCSS(unsortedString, propertiesMap), sortedString);
  });
});
