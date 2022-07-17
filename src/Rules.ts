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
import { DefinedKeys, Keyable } from "./Keys.js";

export type Rules = {
  regex: RegExp,
  hasTokens: boolean,
}

export type BlockRules = {
  [key: string]: Rules
};
export type InlineRules = {
  [key: string]: Rules
};

const Caret = /(^|[^\[])\^/g;

export function regExTemplate(regex: string | RegExp, opt = '') {
  let source = typeof regex === 'string' ? regex : regex.source;

  const RegExObj = { 

    replace: (positionId: string | RegExp, value: string | RegExp) => {
      let regEx = typeof value === 'string' ? value : value.source;
      regEx = regEx.replace(Caret, '$1');
      source = source.replaceAll(positionId, regEx);
      return RegExObj;
    },

    getRegex: () => {
      return new RegExp(source, opt);
    }

  };

  return RegExObj;
}

/**
 * Sorted List of Rules most sectionable to least.
 * The most sectionable are profiled first and will be styled before the least.
 *  * Map is used to ensure preserved order.
 */
//! All blocks need to be surrounded by spaces, if not we cannnot go line by line.
export const BlockOrderedRules = function( keys: DefinedKeys ): BlockRules {

  const FencingKey = `${keys[Keyable.Fencing].key}{${keys[Keyable.Fencing].repeated}}`;
  const HeaderPrimaryKey = `${keys[Keyable.HeaderPrimaryKey].key}{${keys[Keyable.HeaderPrimaryKey].repeated}}`;
  const HeaderSecondaryKey = `${keys[Keyable.HeaderSecondaryKey].key}{${keys[Keyable.HeaderPrimaryKey].repeated}}`;

  const EndOfLine = /\n|$/;
  const AnyEnding = regExTemplate(/(?:EndOfLine%)/)
    .replace('EndOfLine%', EndOfLine)
      .getRegex();
  const AllowableSpace = regExTemplate(/( *?(EndOfLine%))/)
    .replace('EndOfLine%', EndOfLine)
      .getRegex();
  const AllCharInLine = /[^\n]/;
  const MustCharLine = /.+\n/;
  const AllContainedChar = /[\s\S]*?/;
  const EmptySurronding = /\n(?!\s*?\n)/;

  return Object.fromEntries( new Map([ 
    ['AllowableSpace', {
      regex: regExTemplate(/^(?<RESULT> *?(EndOfLine))/)
        .replace('EndOfLine', EndOfLine)
          .getRegex(),
      hasTokens: false,
    }],
    ['Fencing', {
      regex: regExTemplate(/^(?:FencingKey%)(?<RESULT>AllContainedChar%|$)(?:FencingKey%)/)
        .replace('FencingKey%', FencingKey)
        .replace('AllContainedChar%', AllContainedChar)
          .getRegex(),
      hasTokens: true,
    }],
    ['Heading1Sect', {
      regex: regExTemplate(/^(?<RESULT>EmptySurronding%|.+\n)(?:HeaderPrimaryKey%)AnyEnding%/)
        .replace('HeaderPrimaryKey%', HeaderPrimaryKey)
        .replace('EmptySurronding%', EmptySurronding)
        .replace('AnyEnding%', AnyEnding)
          .getRegex(),
      hasTokens: false,
    }],
    ['Heading2Sect', {
      regex: regExTemplate(/^(?<RESULT>EmptySurronding%|.+\n)(?:HeaderSecondaryKey%)AnyEnding%/)//equals sign
        .replace('HeaderSecondaryKey%', HeaderSecondaryKey)
        .replace('EmptySurronding%', EmptySurronding)
        .replace('AnyEnding%', AnyEnding)
          .getRegex(),
      hasTokens: false,
    }],
    ['Text', {
      regex: regExTemplate(/^(?<RESULT>AllCharInLine%+AllowableSpace%)/)
        .replace('AllowableSpace%', AllowableSpace)
        .replace('AllCharInLine%', AllCharInLine)
          .getRegex(),
      hasTokens: true,
    }]
  ]));
}

/**
 * Sorted List of Rules most applicable to least. ~think big contains small
 *  * Map is used to ensure preserved order.
 */
export const InlineOrderedRules = function( keys: DefinedKeys ): InlineRules {

  const BoldKey = `${keys[Keyable.Bold].key}{${keys[Keyable.Bold].repeated}}`;
  const RedactKey = `${keys[Keyable.Redact].key}{${keys[Keyable.Redact].repeated}}`;
  const InterruptKey = `${keys[Keyable.Interrupt].key}{${keys[Keyable.Interrupt].repeated}}`;
  const Highlight = `${keys[Keyable.Highlight].key}{${keys[Keyable.Highlight].repeated}}`;

  const Spanable = regExTemplate(/(Bold%|Redact%)/)
    .replace('Bold%', BoldKey)
    .replace('Redact%', RedactKey)
    .getRegex();
  const SpanableStart = regExTemplate(/(?<TYPE>Bold%|Redact%)/)
    .replace('Bold%', BoldKey)
    .replace('Redact%', RedactKey)
      .getRegex();
  const SpanableEnd = regExTemplate(/(Bold%|Redact%)/)
    .replace('Bold%', BoldKey)
    .replace('Redact%', RedactKey)
      .getRegex();

      // (\*{2}|\~{2})(\S*?)(\*{2}|\~{2})

  return Object.fromEntries(new Map([ 
    ['Paragraph', {
      regex: regExTemplate(/^(?!Highlight%\~?|Spanable%)(?<RESULT>[\s\S]+?|.+?)(?=Highlight%\~?|Spanable%|$)/)
        .replace('Spanable%', Spanable)
        .replace('Highlight%', Highlight)
        .getRegex(),
      hasTokens: false,
    }],
    ['Highlight', {
      regex: regExTemplate(/(Highlight%)(?:\~(?<TYPE>[\S]+)|)(?: ?)(?<RESULT>[^\`]|[^\`][\s\S]+?)(\1)(?!\`)/)
        .replace('Highlight%', Highlight)
        .getRegex(),
      hasTokens: true,
    }],
    ['Span', {
      regex: regExTemplate(/SpanableStart%(?<RESULT>\S*?)\1/)
        .replace('SpanableStart%', SpanableStart)
        .getRegex(),
      hasTokens: false,
    }],
  ]));
}