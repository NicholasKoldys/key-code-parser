import { defaultKeys, Keyable } from "../Keys.js";
import { BlockOrderedRules, InlineOrderedRules } from "../Rules.js";
import { TestsOf, assertEquals, assert } from "@nicholaskoldys/just-equate-testing";

const TestKey = `${defaultKeys[Keyable.Fencing]?.key}{${
  defaultKeys[Keyable.Fencing]?.repeated
}}`;

const CustomKeys = Object.assign(Object.assign({}, defaultKeys), {
  [Keyable.HeaderPrimaryKey]: {
    key: "&",
    repeated: 10,
    rule: Keyable.HeaderPrimaryKey,
  },
  [Keyable.HeaderSecondaryKey]: {
    key: "%",
    repeated: 10,
    rule: Keyable.HeaderSecondaryKey,
  },
});

TestsOf("Testing Keys String Building: ", {

  "TestKey created              ": [
    () => assertEquals(TestKey, "`{3}"),
    "reading default keys properly",
  ],

  "User Keys inheriting         ": [
    () =>
      assertEquals(CustomKeys[Keyable.Fencing], defaultKeys[Keyable.Fencing]),
    "testing custom user keys.",
  ],

  "FAILIF overwriting           ": [
    () =>
      assertEquals(
        CustomKeys[Keyable.HeaderPrimaryKey],
        defaultKeys[Keyable.HeaderPrimaryKey],
        true
      ),
    "testing custom user keys.",
  ],
});

TestsOf("Testing Keys String Building: ", {

  "TestKey created              ": [
    () => assertEquals(TestKey, "`{3}"),
    "reading default keys properly",
  ],

  "User Keys inheriting         ": [
    () =>
      assertEquals(CustomKeys[Keyable.Fencing], defaultKeys[Keyable.Fencing]),
    "testing custom user keys.",
  ],

  "FAILIF overwriting           ": [
    () =>
      assertEquals(
        CustomKeys[Keyable.HeaderPrimaryKey],
        defaultKeys[Keyable.HeaderPrimaryKey],
        true
      ),
    "as user specified keys do not allow mutliple keys for single-Keyable.",
  ],
});

const BuiltBlockRules = BlockOrderedRules(defaultKeys);
const BuiltInlineRules = InlineOrderedRules(defaultKeys);

TestsOf("Sanity Checking with spaces: ", {

  "Sanity Space                 ": [
    () => {
      const newline1 = "\n";
      const newline2 = "\n";
      const newline3 = `\n`;
      const newline4 = `
`;
      assertEquals(newline1, newline2);
      assertEquals(newline2, newline3);
      assertEquals(newline3, newline4);
    },
    "ensured spaceing in my mind works.",
  ],

  "FAILIF templated str spaces  ": [
    () => {
      const newline1 = "\n";
      const newline4 = `
      `;
      assertEquals(newline1, newline4, true);
    },
    "to check template spacing as the editor space is considered with templates.",
  ],

  "Allowable space              ": [
    () => {
      const allspaces = "         ";
      const newline = `
`;
      assertEquals(
        BuiltBlockRules["AllowableSpace"].patterns.regex.exec(allspaces)?.groups?.RESULT,
        allspaces
      );
      assertEquals(
        BuiltBlockRules["AllowableSpace"].patterns.regex.exec(newline)?.groups?.RESULT,
        "\n"
      );
    },
    "has regex",
  ],

  "FAILIF multi newlines        ": [
    () => {
      const allspaces = "         \n\n";
      const newline = `\n
`;
      assertEquals(
        BuiltBlockRules["AllowableSpace"].patterns.regex.exec(allspaces)?.groups?.RESULT,
        allspaces,
        true
      );
      assertEquals(
        BuiltBlockRules["AllowableSpace"].patterns.regex.exec(newline)?.groups?.RESULT,
        "\n\n",
        true
      );
    },
    "to get multi newlines \\n\\n and template multiline two newlines.",
  ],
});

TestsOf("Block Rules: ", {

  "Fencing captures between     ": [
    () => {
      const fencingStringNull = "``````";
      const fencingStringX = "```x```";
      const fencingStringWithSpaces = "```x\nx    \nxxxx     \n\nx```";
      assertEquals(
        BuiltBlockRules["Fencing"].patterns.regex.exec(fencingStringNull)?.groups
          ?.RESULT,
        ""
      );
      assertEquals(
        BuiltBlockRules["Fencing"].patterns.regex.exec(fencingStringX)?.groups?.RESULT,
        "x"
      );
      assertEquals(
        BuiltBlockRules["Fencing"].patterns.regex.exec(fencingStringWithSpaces)?.groups
          ?.RESULT,
        "x\nx    \nxxxx     \n\nx"
      );
    },
    "allows newlines and all capturable characters.",
  ],

  "HeadingSection captures under": [
    () => {
      const headingSectionKeyOut = "Heading 1: Title of Section\n---";
      const headerOnlyCapture =
        "Heading 1: Title of Section\n---\n\n continuing text after.. ";
      assertEquals(
        BuiltBlockRules["HeadingSect"].patterns.regex.exec(headingSectionKeyOut)?.groups
          ?.RESULT,
        "Heading 1: Title of Section\n"
      );
      assertEquals(
        BuiltBlockRules["HeadingSect"].patterns.regex.exec(headerOnlyCapture)?.groups
          ?.RESULT,
        "Heading 1: Title of Section\n"
      );
    },
    "only selecting the header text.",
  ],

  "TextBlock captures multilines": [
    () => {
      const singleLine = "Text with no starting newline find me @outside.com\n";
      const preserveSpacing = "\t    \t  spacing and text with a single newline are captured \n  .... just not the ending the next.... ";
      assertEquals(
        BuiltBlockRules["TextBlock"].patterns.regex.exec(singleLine)?.groups?.RESULT,
        "Text with no starting newline find me @outside.com\n"
      );
      assertEquals(
        BuiltBlockRules["TextBlock"].patterns.regex.exec(preserveSpacing)?.groups?.RESULT,
        "\t    \t  spacing and text with a single newline are captured \n"
      );
    },
    "only selecting a single line of text.",
  ],
});

TestsOf("Inline Rules: Paragraph - ", {

  "single-line                  ": [
    () => {
      const justParagraph =
        "This is some text without a newline as the newline wont be taken.";
      assertEquals(
        BuiltInlineRules["Paragraph"].patterns.regex.exec(justParagraph)?.groups?.RESULT,
        justParagraph
      );
    },
    "paragraph line.",
  ],

  "captures multi-lines         ": [
    () => {
      const pWithNewline = "This is some text with a newline\n continued";
      const pWithMultilines =
        "This is some \ntext with some newlines\n \n hello!";
      const pWithPreSpacing = "     \n\n Even begining spacing.";
      assertEquals(
        BuiltInlineRules["Paragraph"].patterns.regex.exec(pWithNewline)?.groups?.RESULT,
        pWithNewline
      );
      assertEquals(
        BuiltInlineRules["Paragraph"].patterns.regex.exec(pWithMultilines)?.groups
          ?.RESULT,
        pWithMultilines
      );
      assertEquals(
        BuiltInlineRules["Paragraph"].patterns.regex.exec(pWithPreSpacing)?.groups
          ?.RESULT,
        pWithPreSpacing
      );
    },
    "grab space to preserve.",
  ],

  "FAILIF expecting high/span   ": [
    () => {
      const pWithMultilines =
        "This is some highlighted ``text with\n a newline``!";
      assertEquals(
        BuiltInlineRules["Paragraph"].patterns.regex.exec(pWithMultilines)?.groups
          ?.RESULT,
        pWithMultilines,
        true
      );
    },
    "only expect pre-highlight.",
  ],

  "expecting pre- high/span     ": [
    () => {
      const pWithMultilines =
        "This is some highlighted ``text with\n a newline``!";
      assertEquals(
        BuiltInlineRules["Paragraph"].patterns.regex.exec(pWithMultilines)?.groups
          ?.RESULT,
        "This is some highlighted "
      );
    },
    "paragraph cutting out other keys.",
  ],
});

TestsOf("Inline Rules: Highlight - ", {

  "captures RESULT              ": [
    () => {
      const highlightDefault = "``highlighted Text - Hello``";
      const highlightWType = "``~thisType highlighted Result! ~  ``";
      assertEquals(
        BuiltInlineRules["Highlight"].patterns.regex.exec(highlightDefault)?.groups
          ?.RESULT,
        "highlighted Text - Hello"
      );
      assertEquals(
        BuiltInlineRules["Highlight"].patterns.regex.exec(highlightWType)?.groups
          ?.RESULT,
        "highlighted Result! ~  "
      );
    },
    "contains text.",
  ],

  "captures TYPE                ": [
    () => {
      const highlightedResult = "``~thisType highlightedResult``";
      assertEquals(
        BuiltInlineRules["Highlight"].patterns.regex.exec(highlightedResult)?.groups
          ?.TYPE,
        "thisType"
      );
    },
    "contains text.",
  ],
});

TestsOf("Spannable Rules: Span - ", {

  "Spannable captures RESULT    ": [
    () => {
      const spanBoldResult = "**spannable Bolded result**";
      const spanRedactResult = "~~spannable Redacted result~~";
      assertEquals(
        BuiltInlineRules["Span"].patterns.regex.exec(spanBoldResult)?.groups?.RESULT,
        "spannable Bolded result"
      );
      assertEquals(
        BuiltInlineRules["Span"].patterns.regex.exec(spanRedactResult)?.groups?.RESULT,
        "spannable Redacted result"
      );
    },
    "types are read.",
  ],

  "Spannable captures TYPE      ": [
    () => {
      const spanBoldResult = "**spannable result**";
      const spanRedactResult = "~~spannable result~~";
      assertEquals(
        BuiltInlineRules["Span"].patterns.regex.exec(spanBoldResult)?.groups?.TYPE,
        "**"
      );
      assertEquals(
        BuiltInlineRules["Span"].patterns.regex.exec(spanRedactResult)?.groups?.TYPE,
        "~~"
      );
    },
    "types are read.",
  ],
});
