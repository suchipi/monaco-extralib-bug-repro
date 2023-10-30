import TSWorker from "url:monaco-editor/esm/vs/language/typescript/ts.worker.js";
import EditorWorker from "url:monaco-editor/esm/vs/editor/editor.worker.js";
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";

self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === "typescript" || label === "javascript") {
      return TSWorker;
    }
    return EditorWorker;
  },
};

const container = document.getElementById("container");

monaco.editor.create(container, {
  value: `
type VERSION = typeof api.version;
const blah = api.somethingElse();
    `.trim(),
  language: "typescript",
});

const apiLibs = {
  v1: {
    filePath: "inmemory:/api/v1.d.ts",
    content: `
interface api {
  version: "1"
  something(): boolean;
}
declare const api: api;
    `.trim(),
  },
  v2: {
    filePath: "inmemory:/api/v2.d.ts",
    content: `
interface api {
  version: "2",
  something(): boolean;
  somethingElse(): boolean;
}
declare const api: api;
    `.trim(),
  },
};

const select = document.getElementById("api-chooser");

let selectedApiVersion = select.value;
updateApiExtraLibs();

select.addEventListener("input", (event) => {
  selectedApiVersion = select.value;
  updateApiExtraLibs();
});

function updateApiExtraLibs() {
  const extraLibs = [];

  const lib = apiLibs[selectedApiVersion];
  if (lib != null) {
    extraLibs.push(lib);
  }

  monaco.languages.typescript.typescriptDefaults.setExtraLibs(extraLibs);
}
