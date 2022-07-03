import { defaultKeys } from "./Keys.js";
import { BlockOrderedRules, InlineOrderedRules } from "./Rules.js";
class Tokenizer {
    blockRules;
    inlineRules;
    constructor(keys = defaultKeys) {
        this.blockRules = BlockOrderedRules(keys);
        this.inlineRules = InlineOrderedRules(keys);
    }
    tokenize(parsedStr, ruleName, token) {
        const result = parsedStr?.groups ? (parsedStr.groups?.RESULT || 'null') : parsedStr[1];
        const type = parsedStr?.groups ? (parsedStr.groups?.TYPE || 'null') : '';
        return {
            keyName: ruleName,
            raw: token ? (token?.raw || '') + parsedStr[0] : parsedStr[0],
            text: token ? (token?.text || '') + (result || '') : (result || ''),
            depth: 0,
            type: type,
        };
    }
}
export class KeyInterpreter {
    Tokenizer;
    tokens;
    inlineQueue;
    constructor() {
        this.Tokenizer = new Tokenizer();
        this.tokens = [];
        this.inlineQueue = [];
    }
    lexar(src, rules, parent, setRule) {
        const keys = Object.keys(rules);
        const rulesLength = keys.length;
        let parsed;
        for (let b = setRule || 0; b < rulesLength; b++) {
            const iterRule = keys[b];
            const orderedRule = rules[iterRule];
            if (parsed = orderedRule.regex.exec(src)) {
                if (parsed[0].length > 0) {
                    let token;
                    let tokenArray;
                    if (parent) {
                        if (!parent?.children)
                            parent.children = new Array();
                        tokenArray = parent.children;
                    }
                    else {
                        tokenArray = this.tokens;
                    }
                    //* get the last token for possible concatenation.
                    const lastIter = tokenArray.length - 1;
                    const prevToken = tokenArray[lastIter >= 0 || lastIter != undefined ? lastIter : 0];
                    //* Remove previous token + combine to make singular concatentaed token.
                    if (prevToken && (prevToken.keyName == iterRule)) {
                        token = this.Tokenizer.tokenize(parsed, iterRule, prevToken);
                        tokenArray.pop();
                        //* if the rule can have child tokens, remove the previous parsable entry as we are going to create a new one.
                        if (orderedRule?.hasTokens)
                            this.inlineQueue.pop();
                    }
                    else {
                        token = this.Tokenizer.tokenize(parsed, iterRule);
                    }
                    //* If parent add to inline loop
                    if (orderedRule?.hasTokens) {
                        if ('Paragraph' in rules) {
                            this.lexar(token.text, rules, token, (0));
                        }
                        else {
                            this.inlineQueue.push(token);
                        }
                    }
                    tokenArray.push(token);
                    src = src.substring(parsed[0].length);
                    b = -1;
                }
            }
        }
        /*//! IF String then bad parse */
        src ? console.log("NON-EMPTY RESOLUTION :\n----\n", src) : null;
    }
    parse(src, options) {
        if (this.tokens.length > 0)
            this.tokens = [];
        if (this.inlineQueue.length > 0)
            this.inlineQueue = [];
        src = src.trim();
        this.lexar(src, this.Tokenizer.blockRules);
        for (let i = 0; i < this.inlineQueue.length; i++) {
            this.lexar(this.inlineQueue[i].text, this.Tokenizer.inlineRules, this.inlineQueue[i]);
        }
        this.inlineQueue = [];
        return this.tokens;
    }
    getStringArray() {
        const stringArray = new Array();
        this.iterateTokens((token) => {
            if (token?.children) {
                const len = token.children.length;
                for (let i = 0; i < len; i++) {
                    stringArray.push(token.children[i].text);
                }
            }
            else {
                stringArray.push(token.text);
            }
        });
        return stringArray;
    }
    iterateTokens(callback, tokenArray) {
        if (!tokenArray)
            tokenArray = this.tokens;
        for (let i = 0; i < tokenArray.length; i++) {
            if (tokenArray[i]?.children) {
                this.iterateTokens(callback, tokenArray[i].children);
            }
            else {
                callback(tokenArray[i]);
            }
        }
    }
}
/* export class KeyCodeParserFactory {
  constructor( tokens: Array<Key> ) {

  }
}
export default class KeyCodeParser {

} */ 
