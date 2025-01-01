import * as vscode from "vscode";
import * as assert from "assert";
import * as sinon from "sinon";

import getPropertiesMap from "../getPropertiesMap";

suite("VS Code Configuration", () => {
  let getConfigurationStub: sinon.SinonStub;

  setup(() => {
    getConfigurationStub = sinon.stub(vscode.workspace, "getConfiguration");
  });

  teardown(() => {
    getConfigurationStub.restore();
  });

  test("getPropertiesMap respects custom sort order and categories", () => {
    getConfigurationStub.returns({
      get: (configName: string) => {
        if (configName === "categories") {
          return {
            customCategory1: ["customClass1", "customClass2"],
            customCategory2: ["customClass3", "customClass4"],
          };
        }
        if (configName === "sortOrder") {
          return ["customCategory2", "customCategory1"];
        }
        return {};
      },
    });

    const propertiesMap = getPropertiesMap();

    const expectedPropertiesMap = {
      customClass1: 2,
      customClass2: 3,
      customClass3: 0,
      customClass4: 1,
    };

    assert.deepStrictEqual(propertiesMap, expectedPropertiesMap);
  });
});
