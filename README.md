# Key - Code - Parser

For testing of functionality, run the demo's public html.

```demo/public/index.html```

With live server or some other hosting as the file imports module scripts that must be hosted due to CORS.

The default text shows possibilites and a good base structure to how keys are parsed.

Notice: Headings remove the key, All spacing is kept, Fencing is removed but spacing preserved.

Styles can be added within the imported keys

## Code

Source written in typescript and transcribed to js.

### Rules.ts

The regex magic contains the Block and Inline Rules for the key-parser engine. 
function regExTempalate is the creator of the 

> BlockOrderedRules : 
>   - AllowableSpace - which preserves white-space, can be defined by the user.
>   - Fencing - stylize a block : possibly creating a view/section wrapper
>   - Heading1Sect - seperate heading sections, not inline for possible section creation useful for articles.
>   - Heading2Sect - 
>   - Text - non-specified block located under the following due to ordering, will then be passed to inline.
Caret is used for creating combined regex into longer rules.

> InlineOrderedRules :
>    - Paragraph
>    - Highlight
>    - Span

### Parser.ts

Interface Token - returned object type.

class Tokenizer - stores parsed strings into tokens.