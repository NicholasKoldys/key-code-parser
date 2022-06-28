import { BlockOrderedRules, InlineOrderedRules } from "./Rules.js";
import type { Rules, BlockRules, InlineRules } from "./Rules.js";
import { TestsOf, assertEquals } from "./utils/test-lib.js"; /* //TODO */

/** TokenKeys - 
 * 
 * const genericKey = {
    "name": {
      key: '',
      escape: false,
      inline: false,
      delim: false,
      priority: 9
    }
  }
 */
const tokenKeys = {
  keys: {
    "interrupt": {
      key: "\/",
      repeated: 2,
      rule: "Interrupt",
      // inline: true,
      // priority: 9
    },
  }
};

interface Token {
  keyName: string | number;
  raw: string;
  text: string;
  depth?: number;
  type?: string;
  tokens?: Array<Token>;
}

class Tokenizer {
  public blockRules = BlockOrderedRules;
  public inlineRules = InlineOrderedRules;
  constructor() {}

  tokenize( parsedStr: RegExpMatchArray, ruleName: string | number, token?: Token ): Token {    
    let result = parsedStr?.groups ? ( parsedStr.groups?.RESULT || 'null' ) : parsedStr[1];
    let type = parsedStr?.groups ? ( parsedStr.groups?.TYPE || 'null' ) : '';
    return {
      keyName: ruleName,
      raw: token ? (token?.raw || '') + parsedStr[0] : parsedStr[0],
      text: token ? (token?.text || '') + ( result || '') : ( result || '' ),
      depth: 0,
      type: type,
    }
  }
}

export class KeyInterpreter {
  Tokenizer: Tokenizer;
  tokens: Array<Token>;
  inlineQueue: Array<Token>;

  constructor() {
    this.Tokenizer = new Tokenizer();
    this.tokens = [];
    this.inlineQueue = [];
  }

  private iterateTokens( callback: Function, tokenArray?: Array<Token> ) {
    if( !tokenArray ) tokenArray = this.tokens;
    for( let i = 0; i < tokenArray.length; i++) {
      if( tokenArray[i]?.tokens ) {
        this.iterateTokens( callback, tokenArray[i]!.tokens );
      } else {
        callback( tokenArray[i] );
      }
    }
  }

  lexar( src: string, rules: BlockRules | InlineRules, parent?: Token, setRule?: number ) {
    let keys = Object.keys( rules ) as Array<keyof Rules>;
    let parsed: RegExpMatchArray | null;
    let rulesLength = keys.length;

    for(let b = setRule || 0; b < rulesLength; b++) {
      let iterRule = keys[b];
      let orderedRule = rules[ iterRule ];

      if( parsed = orderedRule.regex.exec(src) ) {

        // console.log( iterRule, setRule, b, parsed );

        if(parsed[0].length > 0) {
          //* Created Token
          let token: Token;
          //* storedArray can either be parent or global KeyInt array 
          let tokenArray: Array<Token>;

          if( parent ) {
            if(!parent?.tokens) { parent.tokens = new Array(); }
            tokenArray = parent.tokens;
          } else {
            tokenArray = this.tokens;
          }

          //* get the last token for possible concatenation.
          let lastIter = tokenArray.length - 1;
          let prevToken = tokenArray[ lastIter >= 0 || !undefined ? lastIter : 0 ];

          //* Remove previous token + combine to make singular concatentaed token.
          if(prevToken && (prevToken.keyName == iterRule)) {
            token = this.Tokenizer.tokenize( parsed, iterRule, prevToken);
            tokenArray.pop();

            //* if the rule can have child tokens, remove the previous parsable entry as we are going to create a new one.
            if( orderedRule?.hasTokens ) {
              this.inlineQueue.pop();
            }
          } else {
            token = this.Tokenizer.tokenize( parsed, iterRule );
          }

          //* If parent add to inline loop
          if( orderedRule?.hasTokens ) {
            // if(  )
            if( 'Paragraph' in rules ) {
              this.lexar( token.text, rules, token, ( 0 ) );
            } else {
              this.inlineQueue.push( token );
            }
          }

          tokenArray.push( token );
          src = src.substring(parsed[0].length);
          b = -1;
        }
      }
    }

    /*//! IF String then bad parse */
    src ? console.log("NON-EMPTY RESOLUTION :\n----\n", src ) : null;
    
    return ;
  }

  parse( src: string, options?: Object ): Array<Token> {
    if(this.tokens.length > 0) this.tokens = [];
    if(this.inlineQueue.length > 0) this.inlineQueue = [];

    src = src.trim();
    this.lexar( src, this.Tokenizer.blockRules );

    for(let i = 0; i < this.inlineQueue.length; i++) {
      this.lexar( this.inlineQueue[i].text, this.Tokenizer.inlineRules, this.inlineQueue[i] );
    }

    this.inlineQueue = [];

    return this.tokens;
  }

  getStringArray(): Array<string> {
    const stringArray = new Array<string>();
    this.iterateTokens( ( token: Token ) => {
      if(token?.tokens) {
        let len = token.tokens.length;
        for (let i = 0; i < len; i++) {
          stringArray.push( token.tokens[i].text );
        }
      } else {
        stringArray.push(token.text);
      }
    } );
    return stringArray;
  }
}