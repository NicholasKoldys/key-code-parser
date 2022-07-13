// @ts-nocheck
import { KeyInterpreter } from "../../../dist/Parser.js";

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
5._8		.
5._9 abcdefghijklmnopqrstuvwxyz
5.10
5.11 abcdefghijklmnopqrstuvwxyz
5.12 				 		
5.13			
5.14   				.
5.15
5.16
5.17~~~
5.28 Fencing 2
5.29 block that will enable style default is: 'block-style'
5.30 abcdefghijklmnopqrstuvwxyz
5.31~~~
5.32
5.33 [[[
5.34	 Fencing is user selected abcdefghijklmnopqrstuvwxyzabcde 
5.35	 \`\`\`fencing in fence ignored, 
5.36	 just print as is
5.37   \`\`\`
5.38  ]]] 
5.39
5.40 Set inside paragraphs can be \`\`highlighted text\`\`
5.41   this is set standard or using \`\`~highlight-style personal styles\` default is: \`highlight-style\`\`
5.42     \`\`~block-style *block-style should not be seen* personal styles\` 
5.43 \` this is like block style but will cover new lines as well.
5.44 ;**_BOLDED_:DEFAULT_**; is: 'other styles can be used' .
5.45 end of style block \`\`
5.46 \`\` ~nowork-style_ this is spaced and will not work\`\`
5.47 ;**_BOLDED_:DEFAULT_**;
5.48
5.49 This is text and this will be ;**_BOLDED_**; paragraph after bolded will not be bolded.
5.50 This will contain a link [(link to here)"the text in quotes should be selectable"]
EOF Treat all symbols in redacted double as crossed out not hidden ;~~_redacted text_~~;
`;

MDEditor.value = rawInput;

function parseBlocks(MDEditorVal) {
  try {
    if (!MDEditorVal) throw (new Error('emptyEditorVal'));

    const interpretter = new KeyInterpreter();
      interpretter.parse(MDEditorVal);

    interpretter.getStringArray().forEach( val => {
      // console.log(val);
    })

    return interpretter.getStringArray();

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