# Interpreter Structure
- Lexer
- Parser
- AST
- Bytecode compiler
- Bytecode interpreter
- Runtime


## Lexer
- transform code into a series of tokens, like `IF, ELSE, LPARAN, RPARAN, RBRACE, LBRACE`
- iterate over tokens
- stream to Parser

## Parser
- takes tokens to figure out structure (AST)
- builds arrays of blocks and scopes with instruction tokens inside

## Bytecode
- super basic language doing the things


------------
# Resources:
- http://lisperator.net/pltut/parser/input-stream
- https://www.youtube.com/watch?v=LCslqgM48D4