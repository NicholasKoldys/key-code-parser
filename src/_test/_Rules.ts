import { defaultKeys, Keyable } from "../Keys.js";
import { BlockOrderedRules, InlineOrderedRules } from "../Rules.js";
import { assert, assertEquals, TestsOf } from "./test-lib.js";

const TestKey = `${defaultKeys[Keyable.Fencing]?.key}{${defaultKeys[Keyable.Fencing]?.repeated}}`;

const CustomKeys = Object.assign( Object.assign({}, defaultKeys), {
  [ Keyable.HeaderPrimaryKey ]: {
    key: '\&',
    repeated: 10,
    rule: Keyable.HeaderPrimaryKey
  },
  [ Keyable.HeaderSecondaryKey ]: {
    key: '\%',
    repeated: 10,
    rule: Keyable.HeaderSecondaryKey
  },
});

TestsOf("Testing Keys String Building: ", {
  'TestKey created      ': 
    [ () => assertEquals( TestKey, '\`{3}' ), 'reading default keys properly'],
  'User Keys inheriting ': 
    [ () => assertEquals( CustomKeys[Keyable.Fencing], defaultKeys[Keyable.Fencing] ), 'testing custom user keys.'],
  'FailIf overwriting   ': 
    [ () => assertEquals( CustomKeys[Keyable.HeaderPrimaryKey], defaultKeys[Keyable.HeaderPrimaryKey], true ), 'testing custom user keys.'],
});

TestsOf("Testing Keys String Building: ", {
  'TestKey created      ': 
    [ () => assertEquals( TestKey, '\`{3}' ), 'reading default keys properly'],
  'User Keys inheriting ': 
    [ () => assertEquals( CustomKeys[Keyable.Fencing], defaultKeys[Keyable.Fencing] ), 'testing custom user keys.'],
  'FailIf overwriting   ': 
    [ () => assertEquals( CustomKeys[Keyable.HeaderPrimaryKey], defaultKeys[Keyable.HeaderPrimaryKey], true ), 'as user specified keys do not allow mutliple keys for single-Keyable.'],
});

const BuiltBlockRules = BlockOrderedRules( defaultKeys);
const BuiltInlineRules = InlineOrderedRules( defaultKeys);

TestsOf("Testing Block Rules: ", {
  'Sanity Space                       ':
    [ () => {
      const newline1 = '\n';
      const newline2 = "\n";
      const newline3 = `\n`;
      const newline4 = `
`;
      assertEquals( newline1, newline2 );
      assertEquals( newline2, newline3 );
      assertEquals( newline3, newline4 );
    }, 'ensured spaceing in my mind works.'],
  'FailIf Templates aren`t checked    ':
    [ () => {
      const newline1 = '\n';
      const newline4 = `
      `;
      assertEquals( newline1, newline4, true );
    }, 'to check template spacing as the editor space is considered with templates.'],
  'Allowable space                    ': 
    [ () => {
      const allspaces = '         ';
      const newline = `
`;
      assertEquals( BuiltBlockRules['AllowableSpace'].regex.exec(allspaces)?.groups?.RESULT, allspaces )
      assertEquals( BuiltBlockRules['AllowableSpace'].regex.exec(newline)?.groups?.RESULT, "\n" )
    }, 'has regex'],
  'FailIf more than oneline of spaces ': 
    [ () => {
      const allspaces = '         \n\n';
      const newline = `\n
`;
      assertEquals( BuiltBlockRules['AllowableSpace'].regex.exec(allspaces)?.groups?.RESULT, allspaces, true )
      assertEquals( BuiltBlockRules['AllowableSpace'].regex.exec(newline)?.groups?.RESULT, "\n\n", true )
    }, 'to get multi newlines \\n\\n and template multiline two newlines.'],
  'Fencing captures all within keys   ':
    [ () => {
      const fencingStringNull = "``````";
      const fencingStringX = "```x```";
      const fencingStringWithSpaces = "```x\nx    \nxxxx     \n\nx```";
      assertEquals( BuiltBlockRules['Fencing'].regex.exec( fencingStringNull )?.groups?.RESULT, '' );
      assertEquals( BuiltBlockRules['Fencing'].regex.exec( fencingStringX )?.groups?.RESULT, 'x' );
      assertEquals( BuiltBlockRules['Fencing'].regex.exec( fencingStringWithSpaces )?.groups?.RESULT, 'x\nx    \nxxxx     \n\nx' );
    }, 'allows newlines and all capturable characters.'],
  'HeadingSection captures all under  ':
    [ () => {
      const headingSectionKeyOut = "Heading 1: Title of Section\n---"
      const headerOnlyCapture = "Heading 1: Title of Section\n---\n\n continuing text after.. ";
      assertEquals( BuiltBlockRules['Heading1Sect'].regex.exec( headingSectionKeyOut )?.groups?.RESULT, 
        'Heading 1: Title of Section\n' );
      assertEquals( BuiltBlockRules['Heading1Sect'].regex.exec( headerOnlyCapture )?.groups?.RESULT, 
        'Heading 1: Title of Section\n' );
    }, 'only selecting the header text.'],
  'Text groups everything else        ':
    [ () => {
      const singleLine = "Text with no starting newline find me @outside.com\n"
      const preserveSpacing = "\t    \t  spacing and text with a single newline are captured \n  .... just not the ending the next.... ";
      assertEquals( BuiltBlockRules['Text'].regex.exec( singleLine )?.groups?.RESULT, 
        'Text with no starting newline find me @outside.com\n' );
      assertEquals( BuiltBlockRules['Text'].regex.exec( preserveSpacing )?.groups?.RESULT, 
        '\t    \t  spacing and text with a single newline are captured \n' );
    }, 'only selecting a single line of text.'],
});

TestsOf("Testing Inline Rules: ", {
  'Paragraph       ':
    [ () => {
      const justParagraph = "This is some text without a newline as the newline wont be taken.";
      assertEquals( BuiltInlineRules['Paragraph'].regex.exec( justParagraph )?.groups?.RESULT, 
        justParagraph );
    }, 'paragraph line.'],
  'Paragraph captures multi-lines':
    [ () => {
      const pWithNewline = "This is some text with a newline\n continued";
      const pWithMultilines = "This is some \ntext with some newlines\n \n hello!";
      const pWithPreSpacing = "     \n\n Even begining spacing.";
      assertEquals( BuiltInlineRules['Paragraph'].regex.exec( pWithNewline )?.groups?.RESULT, 
        pWithNewline );
      assertEquals( BuiltInlineRules['Paragraph'].regex.exec( pWithMultilines )?.groups?.RESULT, 
        pWithMultilines );
      assertEquals( BuiltInlineRules['Paragraph'].regex.exec( pWithPreSpacing )?.groups?.RESULT, 
        pWithPreSpacing );
    }, 'grab space to preserve.'],
  'Paragraph FAILIF expecting highlighted/span':
    [ () => {
      const pWithMultilines = "This is some highlighted \`\`text with\n a newline\`\`!";
      assertEquals( BuiltInlineRules['Paragraph'].regex.exec( pWithMultilines )?.groups?.RESULT, 
        pWithMultilines, true );
    }, 'only expect pre-highlight.'],
  'Paragraph expecting pre- highlighted/span':
    [ () => {
      const pWithMultilines = "This is some highlighted \`\`text with\n a newline\`\`!";
      assertEquals( BuiltInlineRules['Paragraph'].regex.exec( pWithMultilines )?.groups?.RESULT, 
        'This is some highlighted ' );
    }, 'contains text.'],
  'Highlight captures RESULT':
    [ () => {
      const highlighted = "\`\`highlightedText\`\`"
      const highlightedResult = "\`\`~thisType highlightedResult\`\`";
      assertEquals( BuiltInlineRules['Highlight'].regex.exec( highlighted )?.groups?.RESULT, 
        'highlightedText' );
      assertEquals( BuiltInlineRules['Highlight'].regex.exec( highlightedResult )?.groups?.RESULT, 
        'highlightedResult' );
    }, 'contains text.'],
  'Highlight captures TYPE':
    [ () => {
      const highlightedResult = "\`\`~thisType highlightedResult\`\`";      
      assertEquals( BuiltInlineRules['Highlight'].regex.exec( highlightedResult )?.groups?.TYPE, 
        'thisType' );
    }, 'contains text.'],
  'Spannable captures RESULT':
    [ () => {
      const spanBoldResult = "**spannable Bolded result**";
      const spanRedactResult = "~~spannable Redacted result~~";
      assertEquals( BuiltInlineRules['Span'].regex.exec( spanBoldResult )?.groups?.RESULT, 
        'spannable Bolded result' );
      assertEquals( BuiltInlineRules['Span'].regex.exec( spanRedactResult )?.groups?.RESULT, 
        'spannable Redacted result' );
    }, 'types are read.'],
  'Spannable captures TYPE':
    [ () => {
      const spanBoldResult = "**spannable result**";
      const spanRedactResult = "~~spannable result~~";
      assertEquals( BuiltInlineRules['Span'].regex.exec( spanBoldResult )?.groups?.TYPE, 
        '**' );
      assertEquals( BuiltInlineRules['Span'].regex.exec( spanRedactResult )?.groups?.TYPE, 
        '~~' );
    }, 'types are read.'],
});