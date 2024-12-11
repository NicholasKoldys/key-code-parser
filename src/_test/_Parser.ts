import { assertEquals, TestsOf } from "@nicholaskoldys/just-equate-testing";
import { KeyCodeParser } from "../Parser.js";
import { defaultKeys } from "../Keys.js";
import { Ruleable } from "../Rules.js";

const KCP = new KeyCodeParser();

TestsOf("KeyCodeParser: ", {

  "Created              ": [
    () => assertEquals(typeof KCP, 'object'),
    "created KeyCodeParser",
  ],

  "Parse creates tokens ": [
    () => {
      KCP.parse( 'Hello World'  );
      assertEquals(KCP.tokens[0].keyName, Ruleable.TextBlock);
    },
    "parsed then interpretted as TextBlock",
  ],

  "Parse overwrites last ": [
    () => {
      KCP.parse( '\`\`\`contains fencing and \`\`depth\`\` \`\`\`' );
      assertEquals(KCP.tokens[0].keyName, Ruleable.Fencing);
    },
    "parsed then interpretted as Fencing",
  ],
});