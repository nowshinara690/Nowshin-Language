Nowshin Language — Local Web IDE and Compiler

Quick start

1) Serve the web IDE locally (recommended):

```powershell
# from project root
py -3 -m http.server 8000
# open http://localhost:8000
```

2) Build the native Nowshin compiler (Windows):

```bat
.\build.bat
```

What I changed
- Combined UI into `index.html` (single-file web IDE) with inline CSS and JS.
- Added Save/Load, autosave (localStorage), and Run-on-change features in the web UI.
- Improved the JS transpiler to handle `dekho <expr>;` and `poro` as `await customPoro()`.

Next steps you can ask me to do
- Improve the native compiler parser to accept newline-terminated statements (no semicolon required).
- Add unit tests and CI (GitHub Actions) for the compiler.
- Package the web UI as a minified single file or Electron app.

License: MIT
