import * as vscode from "vscode";
import * as assert from "assert";
import * as sinon from "sinon";

import getPropertiesMap from "../helpers/getPropertiesMap";

suite("VS Code Configuration", () => {
  let getConfigurationStub: sinon.SinonStub;

  setup(() => {
    getConfigurationStub = sinon.stub(vscode.workspace, "getConfiguration");
  });

  teardown(() => {
    getConfigurationStub.restore();
  });
});
