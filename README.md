# tree-sitter-tap

Tree-sitter grammar for **Tap** — the shell config DSL from [Loom](https://github.com/Taha95-dev/loom).

Tap lets you write aliases, functions, and keybindings **once**, then compile them to **bash**, **zsh**, and **fish** with `tapc`.

```tap
alias ll = "ls -la"
function build {
  cmake --build build
}
bind <F5><b> build
bind <T><e> vi
```
Features

    ✅ Aliases — alias name = "command"

    ✅ Functions — function name { body } (multi-line)

    ✅ Bindings — bind <keys> action (single keys + chords)

    ✅ Key chords — <F5><b>, <C-x><C-c>, <T><e>

    ✅ Comments — # ...

    ✅ Case-insensitive keys — <Tab>, <TAB>, <T>, <t> all work

Install (Neovim)
1. Build the parser
```bash

git clone https://github.com/Taha95-dev/tree-sitter-tap.git
cd tree-sitter-tap
tree-sitter build --output tap.so
```
2. Copy to Neovim
```bash

mkdir -p ~/.config/nvim/parser
cp tap.so ~/.config/nvim/parser/tap.so

mkdir -p ~/.config/nvim/queries/tap
cp queries/highlights.scm ~/.config/nvim/queries/tap/
```
3. Register in init.lua
```lua

vim.treesitter.language.add("tap", {
  path = vim.fn.expand("~/.config/nvim/parser/tap.so"),
})
vim.treesitter.language.register("tap", "tap")

vim.api.nvim_create_autocmd("FileType", {
  pattern = "tap",
  callback = function()
    vim.treesitter.start()
  end,
})
```
4. Filetype detection
```lua

vim.filetype.add({
  extension = { tap = "tap" },
})
```
5. Verify
```vim

:InspectTree
```
Install (nvim-treesitter)

If you use nvim-treesitter (main branch), add tap manually:
```lua

local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
parser_config.tap = {
  install_info = {
    url = "https://github.com/Taha95-dev/tree-sitter-tap",
    files = { "src/parser.c" },
    branch = "main",
  },
  filetype = "tap",
}
```
Then:
```vim

:TSInstall tap
```
Grammar
```tap
alias	alias name = "cmd"	alias ll = "ls -la"
function_decl	function name { body }	function build { ... }
binding	bind <keys> action	bind <F5><b> build
key	<...>	<F5>, <C-x>, <T>
string	"..." with escapes	"ls -la"
comment	# ...	# this is a comment
```
Development
```bash

# Regenerate parser from grammar.js
tree-sitter generate

# Run tests
tree-sitter test

# Parse a file
tree-sitter parse ~/.loom/config.tap

# Build shared library
tree-sitter build --output tap.so
```
Test corpus

Test cases live in test/corpus/. Each file tests one construct:

    alias.txt — aliases

    function.txt — functions

    binding.txt — bindings

    chord.txt — key chords

    comment.txt — comments

What is Tap?

Tap is the DSL used by Loom, a paid developer productivity suite. It compiles shell shortcuts to bash, zsh, and fish with a single source of truth.

    !(Loom-v2)[https://buy.polar.sh/polar_cl_zvnuIMcqUEG0ghrgaFfFV9PivHvnI9esOA40D25wvUK]

    tapc compiler: part of Loom (C, with IR, linter, and multi-shell codegen)

License

MIT
