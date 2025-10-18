# AGENTS.md

## How to use this file

* Skim once at the start of a session to align on global policies.
* Follow project or folder AGENTS.md files for task-specific commands and nuances.
* Ask the user when instructions conflict or feel unsafe.

## Agent conduct

* Verify assumptions before executing commands; call out uncertainties first.
* Ask for clarification when the request is ambiguous, destructive, or risky.

## Code style

- Prefer simpler code to complex code

## Code style - Typescript

- Single quotes, no semicolons
- Use Nil (src/remote/util/nil.ts) instead of null | undefined
- Single 'export' single file. If interface is used outside of file, then it should have its own file. Data interfaces
  are stored in folder 'models'
- For all interfaces and classes, add very simple comment saying purpose. Keep it short.
- Prefer to have static methods in utils, do not use static private methods in regular classes.
- Interface and Classes filenames should match Interface and Classes name (i.e. simple-task-executor.ts filename
  SimpleTaskExecutor class)