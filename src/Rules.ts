export type Rules = {
  [key: string]: {
    regex: RegExp,
    hasTokens: boolean,
  }
}

export type BlockRules = Rules;
export type InlineRules = Rules;

const Caret = /(^|[^\[])\^/g;
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

/**
 * Sorted List of Rules most sectionable to least.
 * The most sectionable are profiled first and will be styled before the least.
 *  * Map is used to ensure preserved order.
 */
//! All blocks need to be surrounded by spaces, if not we cannnot go line by line.
export const BlockOrderedRules: BlockRules = Object.fromEntries(new Map([
  ['AllowableSpace', { //* allow space before Filetext, and at the end of Filetext.
    regex: regExTemplate(/^(?<RESULT> *?(EndOfLine))/)
      .replace('EndOfLine', EndOfLine)
        .getRegex(),
    hasTokens: false,
  }],
  ['Fencing', {
    regex: regExTemplate(/^(?:`{3})(?<RESULT>AllContainedChar%|$)(?:`{3})/)
      .replace('AllContainedChar%', AllContainedChar)
        .getRegex(),
    hasTokens: true,
  }],
  ['Heading1Sect', {
    regex: regExTemplate(/^(?<RESULT>EmptySurronding%|.+\n)(?:-{3})MustEnd%/)//minus sign
      .replace('EmptySurronding%', EmptySurronding)
      .replace('MustEnd%', MustEnd)
        .getRegex(),
    hasTokens: false,
  }],
  ['Heading2Sect', {
    regex: regExTemplate(/^(?<RESULT>EmptySurronding%|.+\n)(?:={3})MustEnd%/)//equals sign
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

const Bold = /\*/
const Redact = /\~/;
const Interrupt = /\/{2}/;
const InsertInterrupt = /\/\*/;
const StyleBlock = /\`{3}\~?/;
const Spanable = regExTemplate(/\;(Bold%|Redact%){2}\_|\_(Bold%|Redact%){2}\;/)
  .replace('Bold%', Bold)
  .replace('Redact%', Redact)
  .getRegex();
const SpanableStart = regExTemplate(/\;(?<TYPE>Bold%|Redact%){2}\_/)
  .replace('Bold%', Bold)
  .replace('Redact%', Redact)
    .getRegex();
const SpanableEnd = regExTemplate(/\_(Bold%|Redact%){2}\;/)
  .replace('Bold%', Bold)
  .replace('Redact%', Redact)
    .getRegex();

/**
 * Sorted List of Rules most applicable to least. ~think big contains small
 *  * Map is used to ensure preserved order.
 */
export const InlineOrderedRules: InlineRules = Object.fromEntries(new Map([
  ['Paragraph', {
    regex: regExTemplate(/^(?!StyleBlock%|Spanable%)(?<RESULT>[\s\S]+?|.+?)(?=StyleBlock%|Spanable%|$)/)
      .replace('Spanable%', Spanable)
      .replace('StyleBlock%', StyleBlock)
      .getRegex(),
    hasTokens: false,
  }],
  ['Highlight', {
    regex: regExTemplate(/(\`{3})(?:\~(?<TYPE>[\S]+)|)(?<RESULT>[^\`]|[^\`][\s\S]+?)(\1)(?!\`)/)
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