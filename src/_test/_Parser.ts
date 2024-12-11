import { assertEquals, TestsOf } from "@nicholaskoldys/just-equate-testing";
import { KeyCodeParser } from "../Parser.js";
import { Ruleable } from "../Rules.js";
import { Keyable } from "../Keys.js";

const KCP = new KeyCodeParser();

TestsOf("KeyCodeParser: ", {

  "Created                  ": [
    () => assertEquals(typeof KCP, 'object'),
    "created KeyCodeParser",
  ],

  "Parse creates tokens     ": [
    () => {
      KCP.parse( 'Hello World'  );
      assertEquals(KCP.tokens[0].keyName, Ruleable.TextBlock);
    },
    "parsed then interpretted as TextBlock",
  ],

  "Parse overwrites last    ": [
    () => {
      KCP.parse( '\`\`\`contains fencing and \`\`depth\`\` \`\`\`' );
      // KCP.iterateTokens( ( tok ) => {  
      //   console.log(tok);
      // }, { callWithParents: true } );
      assertEquals(KCP.tokens[0].keyName, Ruleable.Fencing);
    },
    "parsed then interpretted as Fencing",
  ],

  "Parses appropriate depth ": [
    () => {
      KCP.parse( '\`\`\`contains fencing depth => paragraph depth 1 \`\` highlight depth 2 **BOLD** span depth 2 \`\` \`\`\`' );

      if( !KCP.tokens[0]?.children ) 
        assertEquals(false, true);
      else if( !KCP.tokens[0]?.children[1]?.children ) {
        assertEquals(false, true);
      } else
        assertEquals(KCP.tokens[0]?.children[1]?.children[1].raw, "**BOLD**");
    },
    "counted BOLD depth to 2.",
  ],
});

TestsOf("KeyCodeParser Utilities: ", {

  "getOrderedChildren       ": [
    () => {
      KCP.parse( 
`
_Child Paragraph 1_
\`\`\`
_Fencing Paragraph 2_
\`\`_highlight Paragraph 3_\`\`
\`\`\`
` );
      let it = KCP.getOrderedChildren()
      assertEquals(it.next().value.text.trim(), '_Child Paragraph 1_');
      assertEquals(it.next().value.text.trim(), '_Fencing Paragraph 2_');
      assertEquals(it.next().value.text.trim(), '_highlight Paragraph 3_');
    },
    "retrieved all entries that were child elements.",
  ],
  "getTokenTree             ": [
    () => {
      KCP.parse( 
`
_Child Paragraph 1_
\`\`\`
_Fencing Paragraph 2_
\`\`_highlight Paragraph 3_\`\`
\`\`\`
` );
      let it = KCP.getTokenTree()
      assertEquals(it.next().value.keyName, Ruleable.TextBlock);
      assertEquals(it.next().value.text.trim(), '_Child Paragraph 1_');
      assertEquals(it.next().value.keyName, Ruleable.Fencing);
      assertEquals(it.next().value.text.trim(), '_Fencing Paragraph 2_');
      assertEquals(it.next().value.keyName, Ruleable.Highlight);
      assertEquals(it.next().value.text.trim(), '_highlight Paragraph 3_');
    },
    "retrieved parent entries and their child elements.",
  ],
});