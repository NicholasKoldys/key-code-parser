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
import { DefinedKeys, keyable } from "./Keys.ts";

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

  const FencingKey = `${keys[keyable.Fencing].key}{${keys[keyable.Fencing].repeated}}` 
    || '\`{3}';
  const HeaderPrimaryKey = `${keys[keyable.HeaderPrimaryKey].key}{${keys[keyable.HeaderPrimaryKey].repeated}}` 
    || '\-{3}';
  const HeaderSecondaryKey = `${keys[keyable.HeaderSecondaryKey].key}{${keys[keyable.HeaderPrimaryKey].repeated}}` 
    || '\={3}';

  const EndOfLine = /\n|$/;
  const MustEnd = regExTemplate(/(?:EndOfLine%)/)
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
    // export const BlockOrderedRules: BlockRules = Object.fromEntries(new Map([
    ['AllowableSpace', { //* allow space before Filetext, and at the end of Filetext.
      regex: regExTemplate(/^(?<RESULT> *?(EndOfLine))/)
        .replace('EndOfLine', EndOfLine)
          .getRegex(),
      hasTokens: false,
    }],
    ['Fencing', {
      // regex: regExTemplate(/^(?:`{3})(?<RESULT>AllContainedChar%|$)(?:`{3})/)
      regex: regExTemplate(/^(?:FencingKey%)(?<RESULT>AllContainedChar%|$)(?:FencingKey%)/)
        .replace('FencingKey%', FencingKey)
        .replace('AllContainedChar%', AllContainedChar)
          .getRegex(),
      hasTokens: true,
    }],
    ['Heading1Sect', {
      regex: regExTemplate(/^(?<RESULT>EmptySurronding%|.+\n)(?:HeaderPrimaryKey%)MustEnd%/)
        .replace('HeaderPrimaryKey%', HeaderPrimaryKey)
        .replace('EmptySurronding%', EmptySurronding)
        .replace('MustEnd%', MustEnd)
          .getRegex(),
      hasTokens: false,
    }],
    ['Heading2Sect', {
      regex: regExTemplate(/^(?<RESULT>EmptySurronding%|.+\n)(?:HeaderSecondaryKey%)MustEnd%/)//equals sign
        .replace('HeaderSecondaryKey%', HeaderSecondaryKey)
        .replace('EmptySurronding%', EmptySurronding)
        .replace('MustEnd%', MustEnd)
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
// export const InlineOrderedRules: InlineRules = Object.fromEntries(new Map([

  const BoldKey = `${keys[keyable.Bold].key}{${keys[keyable.Bold].repeated}}` 
    || '\*{2}';
  const RedactKey = `${keys[keyable.Redact].key}{${keys[keyable.Redact].repeated}}` 
    || '\~{2}';
  const InterruptKey = `${keys[keyable.Interrupt].key}{${keys[keyable.Interrupt].repeated}}` 
    || '\/{2}';
  const Highlight = `${keys[keyable.Highlight].key}{${keys[keyable.Highlight].repeated}}` 
    || '\`{2}';

  const Spanable = regExTemplate(/(Bold%|Redact%)|(Bold%|Redact%)/)
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

  return Object.fromEntries(new Map([ 
    ['Paragraph', {
      regex: regExTemplate(/^(?!Highlight%\~?|Spanable%)(?<RESULT>[\s\S]+?|.+?)(?=Highlight%\~?|Spanable%|$)/)
        .replace('Spanable%', Spanable)
        .replace('Highlight%', Highlight)
        .getRegex(),
      hasTokens: false,
    }],
    ['Highlight', {
      regex: regExTemplate(/(Highlight%)(?:\~(?<TYPE>[\S]+)|)(?<RESULT>[^\`]|[^\`][\s\S]+?)(\1)(?!\`)/)
        .replace('Highlight%', Highlight)
        .getRegex(),
      hasTokens: true,
    }],
    ['Span', {
      regex: regExTemplate(/(?:SpanableStart%)(?<RESULT>[\s\S]*?)(?:SpanableEnd%)/)
        .replace('SpanableStart%', SpanableStart)
        .replace('SpanableEnd%', SpanableEnd)
        .getRegex(),
      hasTokens: false,
    }],
  ]));
}