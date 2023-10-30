# Monaco/TypeScript setExtraLibs spelling fix diagnostic bug

This repo contains a repro for a bug in Monaco and/or TypeScript where using `setExtraLibs` to swap out some `.d.ts` files does not work in certain cases related to TypeScript's "suggested spelling fixes" feature.

## Instructions

- Install Node.js; any semi-recent version should work, but I used v18.18.0
- Clone the repo and `cd` into it
- Run `npm install`
- Run `npm start`
- Open <http://localhost:1234>
- Note the error on line 2:
  ```
  Property 'somethingElse' does not exist on type 'api'. Did you mean 'something'?(2551)
  v1.d.ts(3, 3): 'something' is declared here.
  ```
  - This is because `somethingElse` exists in API v2 (v2.d.ts) but not API v1 (v1.d.ts).
- Select "v2" from the `<select>` dropdown element labeled "API Version".
  - This calls `monaco.languages.typescript.typescriptDefaults.setExtraLibs`.
- The bug: The diagnostic message on line 2 is still present, and the error message still refers to "v1.d.ts" (which is no longer loaded).
  - Additionally, hovering over the `VERSION` identifier in line 1 shows `type VERSION = "1"`, when it should show `type VERSION = "2"`.

## Notes

- This bug appears to have been introduced:
  - When Monaco upgraded their TypeScript dependency from 4.5.5 to 4.9.5, in https://github.com/microsoft/monaco-editor/compare/d62f239f37b0ca36ecd705a37373eccce0f3fd07...9d14e8283a765c2030a48fa8f22eb6d258ad397b
  - and in this TypeScript PR: https://github.com/microsoft/TypeScript/pull/49575
- If you rename the methods such that one method's name does not contain the entirety of another method's name, the bug to no longer presents itself. This is not a sufficient workaround, but it may shed light on the cause.
