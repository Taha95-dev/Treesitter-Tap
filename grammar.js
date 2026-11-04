/**
 * @file A colorscheme for Tap (DSL of Loom)
 * @author Taha Kashif <kashiftaha976@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

/**
 * @file A colorscheme for Tap (DSL of Loom)
 * @author Taha Kashif <kashiftaha976@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "tap",

  extras: $ => [
    /\s/,
    $.comment,
  ],

  rules: {
    source_file: $ => repeat($._item),

    _item: $ => choice(
      $.alias,
      $.function_decl,
      $.binding,
    ),

    // alias name = "command"
    alias: $ => seq(
      'alias',
      field('name', $.identifier),
      '=',
      field('command', $.string),
    ),

    // function name { body }
    function_decl: $ => seq(
      'function',
      field('name', $.identifier),
      '{',
      field('body', $.function_body),
      '}',
    ),

    function_body: $ => repeat1(/[^\{\}]+/),

    // bind <keys> action
    binding: $ => seq(
      'bind',
      field('keys', $.key_sequence),
      field('action', $.identifier),
    ),

    key_sequence: $ => repeat1($.key),

    // <F5>, <C-x>, <T>
    key: $ => seq(
      '<',
      /[A-Za-z0-9\-]+/,
      '>',
    ),

    identifier: $ => /[a-zA-Z_\.][a-zA-Z0-9_\-\.]*/,
    string: $ => seq(
      '"',
      repeat(choice(
        /[^"\\]/,
        /\\./,
      )),
      '"',
    ),

    comment: $ => token(seq('#', /.*/)),
  }
});
