// @ts-nocheck
import { KeyCodeParser } from "../../../dist/KeyCodeParser.js";

/**
 * @type {HTMLTextAreaElement}
 */
const MDEditor = document.getElementById('MDEditor');

MDEditor.style.borderWidth = '2px';
MDEditor.style.borderStyle = 'solid';
MDEditor.style.borderColor = 'red';
MDEditor.style.borderRadius = '1em';

const rawInput = `0._0
0._1   
0._2  
0._3    
1._0 Heading 1  this is random text  sadsd - d--- dsad---dsa (()) 
---
1._2
2._0 Heading 2
===
2._2
2._3 ---
2._4
2._5 above and below is a break
2._6
2._7 ===
2._8 text right after break rendered as regular.
2._9 [nothing special]
2.10
2.11 (just like this)
2.12 (nexted quotes are (ok))
2.13 'Single quoted'
2.14
2.15		tabs add tabs
2.16			Why would it change anything else
2.17		if you want a box use a styled option
___
3._1
___
4._1
4._2
5._0 Heading 3
===
\`\`\`
5._3
5._4 Fencing 1 " using \` " 
5._5 block that will enable style default is: 'block-style'
\`\`\`
5._6
5._7
5._8
5._9 [[[
5.10	 Fencing is user selected 
5.11	 \` fencing in fence is not allowed. 
5.12	 and will cause weird string seperation.
5.13   use highlight instead. \`
5.14 ]]]
5.15
5.16 Set inside paragraphs can be \`\`highlighted text\`\`
5.17   this is set standard or using \`\`~highlight-style personal styles\` default is: \`highlight-style\`\`
5.18     \`\`~block-style *block-style should not be seen* personal styles\` 
5.19 \` this is like block style but will cover new lines as well.
5.20 **BOLDED_:1** is: 'other styles can be used' .
5.21 end of style block \`\`
5.22 \`\` ~nowork-style_ this is spaced and will not work\`\`
5.23 **BOLDED_:2**
5.24
5.25 This is text and this will be, **BOLDED:3**; paragraph after bolded will not be bolded.
5.26 This will contain a link [(link to here)"the text in quotes should be selectable"]
EOF Treat all symbols in redacted double as crossed out not hidden ~~redactedtext~~
`;

MDEditor.value = rawInput;

function parseBlocks(MDEditorVal) {
  try {
    if (!MDEditorVal) throw (new Error('emptyEditorVal'));

    const parser = new KeyCodeParser();
      parser.parse(MDEditorVal);

    parser.tokens.forEach( (parent) => {
      console.log(parent);
      if(parent?.children?.length > 0 ) 
        parent?.children.forEach( (child) => {
          console.log(child);
        });

      if(parent?.text == '') console.error(parent);
    });

    return parser.getStringArray();

  } catch (e) {
    console.error(e);
  }
};

const submit = document.getElementById('submit');
submit.onclick = (function applyMarkdown() {
  const MDText = document.getElementById('MDText');
  MDText.style.whiteSpace = "pre";

  MDText.innerText = '';

  parseBlocks(MDEditor.value)?.map(keyedStr => {
    MDText.innerText += keyedStr;
  });
});