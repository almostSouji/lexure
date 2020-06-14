# lexure

`npm i lexure`  

Lexer and parser for structured non-technical user input.  

## Features

- Parses quoted input with multiple quote types.
- Parses flags and options with customizable parsing implementation.
- Keeps trailing whitespace.
- Always parses input by allowing some mis-inputs.
- Includes a convenient wrapper to retrieve arguments.

## Example

```ts
import { Lexer, Parser, Args, Tokens, Unordered, some, none } from 'lexure';

const input = '!hello world "cool stuff" --foo --bar=baz a b c';

const lexer = new Lexer(input)
    .setQuotes([['"', '"'], ['“', '”']]);

const tokens = lexer.lex();
>>> [
    { value: '!hello', raw: '!hello', trailing: ' ' },
    { value: 'world', raw: 'world', trailing: ' ' },
    { value: 'cool stuff', raw: '"cool stuff"', trailing: ' ' },
    { value: '--foo', raw: '--foo', trailing: ' ' },
    { value: '--bar=baz', raw: '--bar=baz', trailing: ' ' },
    { value: 'a', raw: 'a', trailing: ' ' },
    { value: 'b', raw: 'b', trailing: ' ' },
    { value: 'c', raw: 'c', trailing: '' }
]

Tokens.extractCommand(s => s.startsWith('!') ? 1 : null, tokens)
>>> { value: 'hello', raw: 'hello', trailing: ' ' }

tokens
>>> [
    { value: 'world', raw: 'world', trailing: ' ' },
    { value: 'cool stuff', raw: '"cool stuff"', trailing: ' ' },
    { value: '--foo', raw: '--foo', trailing: ' ' },
    { value: '--bar=baz', raw: '--bar=baz', trailing: ' ' },
    { value: 'a', raw: 'a', trailing: ' ' },
    { value: 'b', raw: 'b', trailing: ' ' },
    { value: 'c', raw: 'c', trailing: '' }
]

const parser = new Parser(tokens)
    .setUnorderedStrategy(Unordered.longStrategy());

const res = parser.parse();
>>> {
    ordered: [
        { value: 'world', raw: 'world', trailing: ' ' },
        { value: 'cool stuff', raw: '"cool stuff"', trailing: ' ' },
        { value: 'a', raw: 'a', trailing: ' ' },
        { value: 'b', raw: 'b', trailing: ' ' },
        { value: 'c', raw: 'c', trailing: '' }
    ],
    flags: Set { 'foo' },
    options: Map { 'bar' => 'baz' }
}

Tokens.joinTokens(res.ordered)
>>> 'world "cool stuff" a b c'

const args = new Args(res);

args.single()
>>> 'world'

args.single()
>>> 'cool stuff'

args.findMap(x => x === 'c' ? some('it was a C') : none())
>>> { exists: true, value: 'it was a C' }

args.many()
>>> [
    { value: 'a', raw: 'a', trailing: ' ' },
    { value: 'b', raw: 'b', trailing: ' ' }
]

args.flag('foo')
>>> true

args.option('bar')
>>> 'baz'
```

See source code and tests for more usages and documentation.
