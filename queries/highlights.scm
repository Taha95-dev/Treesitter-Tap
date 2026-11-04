; Keywords
"alias" @keyword
"function" @keyword
"bind" @keyword

; Names
(alias name: (identifier) @function)
(function_decl name: (identifier) @function)
(binding action: (identifier) @function)

; Strings
(string) @string

; Keys
(key) @constant

; Comments
(comment) @comment
