/**
 * @file Grammar for Tap (Full Programming Language for Loom)
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

  word: $ => $.identifier,

  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => choice(
      $.var_declaration,
      $.function_declaration,
      $.if_statement,
      $.while_statement,
      $.return_statement,
      $.expression_statement,
      $.block,
    ),

    // var x = 10
    var_declaration: $ => seq(
      'var',
      field('name', $.identifier),
      optional(seq(':', field('type', $.identifier))),
      optional(seq('=', field('value', $._expression))),
    ),

    // function name(arg1, arg2) { body }
    function_declaration: $ => seq(
      'function',
      field('name', $.identifier),
      optional(seq('(', optional($.parameters), ')')),
      field('body', $.block),
    ),

    parameters: $ => commaSep1($.identifier),

    // if condition { ... } else { ... }
    if_statement: $ => seq(
      'if',
      field('condition', $._expression),
      field('consequence', $.block),
      optional(seq('else', field('alternative', choice($.block, $.if_statement)))),
    ),

    // while condition { ... }
    while_statement: $ => seq(
      'while',
      field('condition', $._expression),
      field('body', $.block),
    ),

    // return value
    return_statement: $ => prec.right(seq(
      'return',
      optional(field('value', $._expression)),
    )),

    // expression
    expression_statement: $ => $._expression,

    // { ... }
    block: $ => seq(
      '{',
      repeat($._statement),
      '}',
    ),

    // --- Expressions ---
    _expression: $ => choice(
      $.binary_expression,
      $.unary_expression,
      $.assignment_expression,
      $.call_expression,
      $.member_expression,
      $.index_expression,
      $.array_literal,
      $.string,
      $.number,
      $.boolean,
      $.identifier,
      $.parenthesized_expression,
      $.key_chord,
    ),

    assignment_expression: $ => prec.right(1, seq(
      field('left', $._expression),
      '=',
      field('right', $._expression),
    )),

    binary_expression: $ => choice(
      ...[
        ['+', 6], ['-', 6],
        ['*', 7], ['/', 7],
        ['==', 4], ['!=', 4],
        ['<', 5], ['>', 5], ['<=', 5], ['>=', 5],
      ].map(([operator, precedence]) =>
        prec.left(precedence, seq(
          field('left', $._expression),
          field('operator', operator),
          field('right', $._expression),
        ))
      )
    ),

    unary_expression: $ => prec(8, seq(
      choice('!', '-'),
      field('argument', $._expression),
    )),

    call_expression: $ => prec(9, seq(
      field('function', $._expression),
      '(',
      optional(commaSep1($._expression)),
      ')',
    )),

    member_expression: $ => prec(10, seq(
      field('object', $._expression),
      '.',
      field('property', $.identifier),
    )),

    index_expression: $ => prec(10, seq(
      field('object', $._expression),
      '[',
      field('index', $._expression),
      ']',
    )),

    array_literal: $ => seq(
      '[',
      optional(commaSep1($._expression)),
      ']',
    ),

    parenthesized_expression: $ => seq(
      '(',
      $._expression,
      ')',
    ),

    // The new !C!g key chord syntax
    key_chord: $ => token(seq(
      '!',
      /[a-zA-Z0-9]+/,
      repeat(seq('!', /[a-zA-Z0-9]+/)),
    )),

    // --- Primitives ---
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    string: $ => seq(
      '"',
      repeat(choice(
        /[^"\\]/,
        /\\./,
      )),
      '"',
    ),

    number: $ => /\d+(\.\d+)?/,

    boolean: $ => choice('true', 'false'),

    comment: $ => token(seq('#', /.*/)),
  }
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}
