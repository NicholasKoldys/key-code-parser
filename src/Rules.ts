/* NicholasKoldys.dev
All rights reserved (c) 2024

KEY-CODE-PARSER

Rules.ts/js

Constains Regex rules tailored to input Keys.

History
-------
2024/10/18 - Nicholas.K. - 1.0.0
  Initial creation.
 */
import { DefinedKeys, Keyable } from "./Keys";

export type Rules = {
  regex: RegExp;
  hasTokens: boolean;
};

export type BlockRules = {
  [key: string]: Rules;
};
export type InlineRules = {
  [key: string]: Rules;
};

const Caret = /(^|[^\[])\^/g;

function regExTemplate(regex: string | RegExp, opt = "") {
  let source = typeof regex === "string" ? regex : regex.source;

  const RegExObj = {
    replace: (positionId: string | RegExp, value: string | RegExp) => {
      let regEx = typeof value === "string" ? value : value.source;
      regEx = regEx.replace(Caret, "$1");
      source = source.replaceAll(positionId, regEx);
      return RegExObj;
    },

    getRegex: () => {
      return new RegExp(source, opt);
    },
  };

  return RegExObj;
}

/**
 * Sorted List of Rules most sectionable to least.
 * The most sectionable are profiled first and will be styled before the least.
 *  * Map is used to ensure preserved order.
 */
//! All blocks need to be surrounded by spaces, if not we cannnot go line by line.
export const BlockOrderedRules = function (keys: DefinedKeys): BlockRules {

  const FencingKey = `${
    keys[Keyable.Fencing].key
  }{${
    keys[Keyable.Fencing].repeated
  }}`;

  const HeaderPrimaryKey = `${
    keys[Keyable.HeaderPrimaryKey].key
  }{${
    keys[Keyable.HeaderPrimaryKey].repeated
  }}`;

  const HeaderSecondaryKey = `${
    keys[Keyable.HeaderSecondaryKey].key
  }{${
    keys[Keyable.HeaderPrimaryKey].repeated
  }}`;

  const EndOfLine = /\n|$/;
  const AllowableSpace = regExTemplate(/ *?(EndOfLine%)/)
    .replace("EndOfLine%", EndOfLine)
    .getRegex();
  const AllCharInLine = /[^\n]+/;
  const AllContainedChar = /[\s\S]*?/;
  const EmptySurronding = /\n(?!\s*?\n)/;
  const SectionHeader = regExTemplate(/HeaderPrimaryKey%|HeaderSecondaryKey%/)
    .replace("HeaderPrimaryKey%", HeaderPrimaryKey)
    .replace("HeaderSecondaryKey%", HeaderSecondaryKey)
    .getRegex();

  return Object.fromEntries(
    new Map([
      [
        "AllowableSpace",
        {
          regex: regExTemplate(/^(?<RESULT>AllowableSpace%)/)
            .replace("AllowableSpace%", AllowableSpace)
            .getRegex(),
          hasTokens: false,
        },
      ],
      [
        "Fencing",
        {
          regex: regExTemplate(
            /^(?<TYPE>FencingKey%)(?<RESULT>AllContainedChar%|$)(?:FencingKey%)/
          )
            .replace("FencingKey%", FencingKey)
            .replace("AllContainedChar%", AllContainedChar)
            .getRegex(),
          hasTokens: true,
        },
      ],
      [
        "HeadingSect",
        {
          regex: regExTemplate(
            /^(?<RESULT>EmptySurronding%|.+\n)(?<TYPE>SectionHeader%)(?:EndOfLine%)/
          )
            .replace("SectionHeader%", SectionHeader)
            .replace("EmptySurronding%", EmptySurronding)
            .replace("EndOfLine%", EndOfLine)
            .getRegex(),
          hasTokens: false,
        },
      ],
      [
        "TextBlock",
        {
          regex: regExTemplate(/^(?<RESULT>AllCharInLine%AllowableSpace%)/)
            .replace("AllowableSpace%", AllowableSpace)
            .replace("AllCharInLine%", AllCharInLine)
            .getRegex(),
          hasTokens: true,
        },
      ],
    ])
  );
};

/**
 * Sorted List of Rules most applicable to least. ~think big contains small
 *  * Map is used to ensure preserved order.
 */
export const InlineOrderedRules = function (keys: DefinedKeys): InlineRules {

  const BoldKey = `${
    keys[Keyable.Bold].key
  }{${
    keys[Keyable.Bold].repeated
  }}`;

  const RedactKey = `${
    keys[Keyable.Redact].key
  }{${
    keys[Keyable.Redact].repeated
  }}`;

  const InterruptKey = `${
    keys[Keyable.Interrupt].key
  }{${
    keys[Keyable.Interrupt].repeated
  }}`;

  const HighlightKey = `${
    keys[Keyable.Highlight].key
  }{${
    keys[Keyable.Highlight].repeated
  }}`;

  const Spanable = regExTemplate(/Bold%|Redact%/)
    .replace("Bold%", BoldKey)
    .replace("Redact%", RedactKey)
    .getRegex();

  return Object.fromEntries(
    new Map([
      [
        "Paragraph",
        {
          //TODO for para - need someway to scan for false flags like 3~ instead of 2~ bc 2 is allowed but three isnt
          regex: regExTemplate(
            /^(?!HighlightKey%|Spanable%)(?<RESULT>[\s\S]*?)(?=HighlightKey%|Spanable%|$)/
          )
            .replace("Spanable%", Spanable)
            .replace("HighlightKey%", HighlightKey)
            .getRegex(),
          hasTokens: false,
        },
      ],
      [
        "Highlight",
        {
          regex: regExTemplate(
            /(HighlightKey%)(?:\~(?<TYPE>\S*) ?|)(?<RESULT>[\s\S]*?)(\1)/
          )
            .replace("HighlightKey%", HighlightKey)
            .getRegex(),
          hasTokens: true,
        },
      ],
      [
        "Span",
        {
          regex: regExTemplate(/(?<TYPE>Spanable%)(?<RESULT>[\s\S]*?)\1/)
            .replace("Spanable%", Spanable)
            .getRegex(),
          hasTokens: false,
        },
      ],
    ])
  );
};
