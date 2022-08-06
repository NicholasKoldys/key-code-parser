/* NicholasKoldys.dev
All rights reserved (c) 2024

KEY-CODE-PARSER

Rules.ts/js

Constains Regex rules tailored to input Keys.

History
-------
2022/07/07 - Nicholas.K. - 1.0.0
  Initial creation.
 */
import { DefinedKeys, Keyable } from "./Keys";
import { RegexTemplate } from "./RegexTemplate";

export type Rules = {
  patterns: RegexTemplate;
  hasTokens: boolean;
};

export enum GroupsNames {
  TYPE = "TYPE",
  RESULT = "RESULT"
}

export enum Ruleable {
  AllowableSpace = "AllowableSpace",
  Fencing = "Fencing",
  HeadingSect = "HeadingSect",
  TextBlock = "TextBlock",
  Paragraph = "Paragraph",
  Highlight = "Highlight",
  Span = "Span",
}

export type BlockRules = {
  [key: string]: Rules;
};
export type InlineRules = {
  [key: string]: Rules;
};

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
  const AllowableSpaceTemplate = new RegexTemplate(/ *?(EndOfLine%)/)
    .replace("EndOfLine%", EndOfLine)
    .createRegex();
  const AllCharInLine = /[^\n]+/;
  const AllContainedChar = /[\s\S]*?/;
  const EmptySurronding = /\n(?!\s*?\n)/;
  const SectionHeaderTemplate = new RegexTemplate(/HeaderPrimaryKey%|HeaderSecondaryKey%/)
    .replace("HeaderPrimaryKey%", HeaderPrimaryKey)
    .replace("HeaderSecondaryKey%", HeaderSecondaryKey)
    .createRegex();

  return Object.fromEntries(
    new Map([
      [
        Ruleable.AllowableSpace,
        {
          patterns: new RegexTemplate(
            /^(?<RESULT>AllowableSpace%)/
          )
            .replace("AllowableSpace%", AllowableSpaceTemplate.regex)
            .createRegex( { [GroupsNames.RESULT] : 1 } ),
          hasTokens: false,
        },
      ],
      [
        Ruleable.Fencing,
        {
          patterns: new RegexTemplate(
            /^(?<TYPE>FencingKey%)(?<RESULT>AllContainedChar%|$)(?:FencingKey%)/
          )
            .replace("FencingKey%", FencingKey)
            .replace("AllContainedChar%", AllContainedChar)
            .createRegex( { [GroupsNames.TYPE] : 1, [GroupsNames.RESULT] : 2 } ),
          hasTokens: true,
        },
      ],
      [
        Ruleable.HeadingSect,
        {
          patterns: new RegexTemplate(
            /^(?<RESULT>EmptySurronding%|.+\n)(?<TYPE>SectionHeader%)(?:EndOfLine%)/
          )
            .replace("SectionHeader%", SectionHeaderTemplate.regex)
            .replace("EmptySurronding%", EmptySurronding)
            .replace("EndOfLine%", EndOfLine)
            .createRegex( { [GroupsNames.RESULT] : 1, [GroupsNames.TYPE] : 2 } ),
          hasTokens: false,
        },
      ],
      [
        Ruleable.TextBlock,
        {
          patterns: new RegexTemplate(
            /^(?<RESULT>AllCharInLine%AllowableSpace%)/
          )
            .replace("AllowableSpace%", AllowableSpaceTemplate.regex)
            .replace("AllCharInLine%", AllCharInLine)
            .createRegex( { [GroupsNames.RESULT] : 1 } ),
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

  const SpanableTemplate =  new RegexTemplate(/Bold%|Redact%/)
    .replace("Bold%", BoldKey)
    .replace("Redact%", RedactKey)
    .createRegex();

  return Object.fromEntries(
    new Map([
      [
        Ruleable.Paragraph,
        {
          //TODO for para - need someway to scan for false flags like 3~ instead of 2~ bc 2 is allowed but three isnt
          patterns: new RegexTemplate(
            /^(?!HighlightKey%|Spanable%)(?<RESULT>[\s\S]*?)(?=HighlightKey%|Spanable%|$)/
          )
            .replace("Spanable%", SpanableTemplate.regex)
            .replace("HighlightKey%", HighlightKey)
            .createRegex( { [GroupsNames.RESULT] : 1 } ),
          hasTokens: false,
        },
      ],
      [
        Ruleable.Highlight,
        {
          patterns: new RegexTemplate(
            /(HighlightKey%)(?:\~(?<TYPE>\S*) ?|)(?<RESULT>[\s\S]*?)(\1)/
          )
            .replace("HighlightKey%", HighlightKey)
            .createRegex( { [GroupsNames.TYPE] : 2, [GroupsNames.RESULT] : 3 } ),
          hasTokens: true,
        },
      ],
      [
        Ruleable.Span,
        {
          patterns: new RegexTemplate(
            /(?<TYPE>Spanable%)(?<RESULT>[\s\S]*?)\1/
          )
            .replace("Spanable%", SpanableTemplate.regex)
            .createRegex( { [GroupsNames.TYPE] : 1, [GroupsNames.RESULT] : 2 } ),
          hasTokens: false,
        },
      ],
    ])
  );
};
