# react-compiler-benchmark-report

## expo (React Native)

### Case 1

Open the "Welcome" talk and close it.

Bundle analyze files can be loaded using atlas, see [Analyzing bundle size with Atlas](https://docs.expo.dev/guides/analyzing-bundles/#analyzing-bundle-size-with-atlas).

#### Without React Compiler

- [Bundle size](./atlas/without-react-compiler-atlas.jsonl): 7.4M
- [Perf data](./react-native-devtools-profile/case1-without-react-compiler.json)
  - open talk:
    - 1st commit
      - Render: 16.3ms
      - Layout effects: 1.6ms
      - Passive effects: 1ms
    - 2nd comit
      - Render: 72.5ms
      - Layout effects: 6.8ms
      - Passive effects: 1.4ms
  - close talk:
    - 9th comit
      - Render: 68.9ms
      - Layout effects: 5.7ms
      - Passive effects: 0.9ms

#### With React Compiler

- [Bundle size](./atlas/with-react-compiler-atlas.jsonl): 6.9M
  - Why it is smaller? The node_modules are smaller because when react compiler is enabled, expo uses more strict compilation mode. `node_modules` is reduced from 7.1M to 6.6M. 
    - eg. `node_modules/date-fns/index.mjs` (reduced from 95K to 37K)
    - without react compiler:
      
      ```js
      // ...
      
      var _yearsToMonths = require(_dependencyMap[243], "./yearsToMonths.mjs");
      Object.keys(_yearsToMonths).forEach(function (key) {
        if (key === "default" || key === "__esModule") return;
        if (key in exports && exports[key] === _yearsToMonths[key]) return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function () {
            return _yearsToMonths[key];
          }
        });
      });
      
      // ...
      ```
    
    - with react compiler:

      ```js
      "use strict";
      // ...
      
      var _yearsToMonthsMjs = require(_dependencyMap[243], "./yearsToMonths.mjs");
      for (var _key244 in _yearsToMonthsMjs) {
        exports[_key244] = _yearsToMonthsMjs[_key244];
      }
      
      // ...
      ```
  
      
  - `app` is changed from 38K to 45K (+7K, +18%), `components` is changed to 59K to 75K (+16K, +27%).

- [Perf data](./react-native-devtools-profile/case1-with-react-compiler.json)
  - open talk:
    - 1st commit
      - Render: 16.4ms (not changed)
      - Layout effects: 1.3ms
      - Passive effects: 1.9ms
    - 2nd comit
      - Render: 11.6ms (-60.9ms, -84%)
      - Layout effects: 2.3ms
      - Passive effects: 0.5ms
  - close talk:
    - 8th comit
      - Render: 9ms (59.9ms, -86%)
      - Layout effects: 0.6ms
      - Passive effects: 0.2ms

Conclusion when using React Compiler:

- the bundle size is 18%~27% larger.
- subsequent render time is reduced by 84~86%.

## ReactLynx

To avoid development cost, we enabled `production` mode and only changed `mangle` to false to allow us get full component name in Trace.

### Case 1

Open the "Welcome" talk there times and close it.

Trace files can be loaded by: https://ui.perfetto.dev/

#### Without React Compiler

- Trace file: [case1-without-react-compiler](./trace/case1-without-react-compiler.pftrace)
- Bundle size:
  - main-thread.js: 448K
  - background.js: 439K
- Perf data:
  - main thread VMExecute: 18ms
  - main thread IFR ReactLynx::diff: 29ms
  - background thread first screen ReactLynx::diff: 26ms
  - background thread interactions
    - 1st interaction:
      - open talk ReactLynx::diff: 57ms
      - close talk ReactLynx::diff: 59ms
    - 2nd interaction:
      - open talk ReactLynx::diff: 58ms
      - close talk ReactLynx::diff: 59ms
    - 3rd interaction:
      - open talk ReactLynx::diff: 63ms
      - close talk ReactLynx::diff: 58ms
  - main thread patch updates
    - 1st interaction:
      - open talk ReactLynx::patch: 25ms
      - close talk ReactLynx::patch: 4ms
    - 2nd interaction:
      - open talk ReactLynx::patch: 19ms
      - close talk ReactLynx::patch: 5ms
    - 3rd interaction:
      - open talk ReactLynx::patch: 18ms
      - close talk ReactLynx::patch: 5ms

#### With React Compiler

- Trace file: [case1-with-react-compiler](./trace/case1-with-react-compiler.pftrace)
- Bundle size:
  - main-thread.js: 479K (+31K, +6%)
  - background.js: 476K (+37K, +8%)
- Perf data:
  - main thread VMExecute: 19ms (+1ms, +5%)
  - main thread ReactLynx::diff: 33ms (+4ms, 13%)
  - background thread first screen ReactLynx::diff: 28ms (+2ms, +7%)
  - background thread interactions
    - 1st interaction:
      - open talk ReactLynx::diff: 29ms (-28ms, -49%)
      - close talk ReactLynx::diff: 22ms (-37ms, -62%)
    - 2nd interaction:
      - open talk ReactLynx::diff: 27ms (-31ms, -53%)
      - close talk ReactLynx::diff: 24ms (-35ms, -58%)
    - 3rd interaction:
      - open talk ReactLynx::diff: 27ms (-36ms, -57%)
      - close talk ReactLynx::diff: 25ms (-33ms, -56%)
  - main thread patch updates
    - 1st interaction:
      - open talk ReactLynx::patch: 14ms (-11ms, -44%)
      - close talk ReactLynx::patch: 4ms (0, 0%)
    - 2nd interaction:
      - open talk ReactLynx::patch: 18ms (-1ms, -5%)
      - close talk ReactLynx::patch: 5ms (0, 0%)
    - 3rd interaction:
      - open talk ReactLynx::patch: 18ms (0, 0%)
      - close talk ReactLynx::patch: 6ms (+1ms, +20%)

Conclusion when using React Compiler:

- the bundle size is 6%~8% larger. VMExecute is +5% larger.
- main thread IFR diff is 13% larger. We should disable react compiler in main-thread because components are only rendered for the IFR and never updated in main thread.
- background first screen diff is 7% larger. This is the trade-off, we have to cache/memo things that will be resued in next interactions.
- background subsequent diff is 49%~62% smaller. It is a significant performance improvement. 
- main thread patch updates seems to be same without react compiler.
