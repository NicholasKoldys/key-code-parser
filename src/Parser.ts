/* NicholasKoldys.dev
All rights reserved (c) 2024

KEY-CODE-PARSER

Parser.ts/js

Constains Tokenizer - Keyinterpreter - KeyParser API

History
-------
2024/10/18 - Nicholas.K. - 1.0.0
  Initial creation.
 */
import { defaultKeys, DefinedKeys, Key, Keyable, mapToKeyable } from "./Keys";
import { 
  BlockOrderedRules, 
  InlineOrderedRules, 
  BlockRules, 
  InlineRules, 
  Rules,
  Ruleable
} from "./Rules";

export interface Token {
  keyName: string | number;
  raw: string;
  text: string;
  depth: number;
  type?: string;
  children?: Array<Token>; //? could be iterable via object
}

class Tokenizer {
  public blockRules;
  public inlineRules;

  constructor( keys: DefinedKeys = defaultKeys ) {
    this.blockRules = BlockOrderedRules( keys );
    this.inlineRules = InlineOrderedRules( keys );
  }

  tokenize( parsedStr: RegExpMatchArray, ruleName: string | number, depth: number, squashToken?: Token ): Token {
    const result = parsedStr?.groups ? ( parsedStr.groups?.RESULT || 'null' ) : parsedStr[1];
    const type = parsedStr?.groups ? ( parsedStr.groups?.TYPE || 'null' ) : '';

    if( ruleName == Ruleable.Span && !parsedStr?.groups?.RESULT) {
      console.log( 'Span: ', ruleName, parsedStr?.groups?.RESULT);
    }

    return {
      keyName: ruleName,
      raw: squashToken ? (squashToken?.raw || '') + parsedStr[0] : parsedStr[0],
      text: squashToken ? (squashToken?.text || '') + ( result || '') : ( result || '' ),
      depth: depth,
      type: type,
    }
  }
}

class KeyInterpreter {
  Tokenizer: Tokenizer;
  tokens: Array<Token>;
  inlineQueue: Array<Token>;

  constructor( usersKeys: DefinedKeys | Array<Key> = defaultKeys, tokenArray: Array<Token> ) {
    if( Array.isArray( usersKeys ) ) {
      usersKeys = mapToKeyable( ...usersKeys );
    }
    const fullKeys = Object.assign( Object.assign({}, defaultKeys), usersKeys );
    this.Tokenizer = new Tokenizer( fullKeys );
    this.tokens = tokenArray;
    this.inlineQueue = [];
  }

  lexalizeFrom( 
    src: string, 
    rules: BlockRules | InlineRules = this.Tokenizer.blockRules, 
    parent?: Token, 
    setRule?: number, 
    currentDepth?: number
  ) {
    const keys = Object.keys( rules ) as Array<keyof Rules>;
    const rulesLength = keys.length;
    let parsed: RegExpMatchArray | null;
    let depthCount = currentDepth || 0;

    for(let b = setRule || 0; b < rulesLength; b++) {
      const iterRule = keys[b];
      const orderedRule = rules[ iterRule ];

      if( parsed = orderedRule.regex.exec(src) ) {

        if(parsed[0].length > 0) {
          let token: Token;
          let tokenArray: Array<Token>;

          if( parent ) {

            if(!parent?.children) parent.children = new Array();

            tokenArray = parent.children;

          } else {
            tokenArray = this.tokens;
          }

          //* get the last token for possible concatenation.
          const lastIter = tokenArray?.length - 1 || 0;
          const prevToken = tokenArray[ lastIter >= 0 ? lastIter : 0 ];

          //* Remove previous token + combine to make singular concatentaed token.
          if(prevToken && (prevToken.keyName == iterRule)) {
            token = this.Tokenizer.tokenize( parsed, iterRule, depthCount, prevToken);
            tokenArray.pop();

            //* if the rule can have child tokens, remove the previous parsable entry as we are going to create a new one.
            if( orderedRule?.hasTokens ) this.inlineQueue.pop();

          } else {
            token = this.Tokenizer.tokenize( parsed, iterRule, depthCount );
          }

          //* If parent add to inline loop
          if( orderedRule?.hasTokens ) {

            if( Ruleable.Paragraph in rules ) {
              this.lexalizeFrom( token.text, rules, token, 0, ( depthCount + 1 ) );

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

    if(Ruleable.TextBlock in rules) {
      for(let i = 0; i < this.inlineQueue.length; i++) {
        this.lexalizeFrom( this.inlineQueue[i].text, this.Tokenizer.inlineRules, this.inlineQueue[i], 0, 1 );
      }
    }
  }
}

export class KeyCodeParser {

  public tokens: Array<Token>;
  private interpretter: KeyInterpreter;

  constructor( userKeys?: DefinedKeys | Array<Key> ) {
    this.tokens = [];
    this.interpretter = new KeyInterpreter( userKeys, this.tokens );
  }

  parse( src: string, options?: Object ): Array<Token> {

    if(this.tokens.length > 0) this.tokens = [];

    src = src.trim();

    this.interpretter.lexalizeFrom( src );

    return this.tokens;
  }

  *getOrderedChildren(): IterableIterator< Token > {
    for( const parent of this.tokens ) {
      if( parent?.children )
        for( const child of parent.children ) {
          yield child;
        }
    }
  }

  getStringArray(): Array<string> {
    const stringArray = new Array<string>();

    this.iterateTokens( ( token: Token ) => {

      if(token?.children) {
        const len = token.children.length;

        for (let i = 0; i < len; i++) {
          stringArray.push( token.children[i].text );
        }

      } else {
        stringArray.push(token.text);
      }
    } );

    return stringArray;
  }

  iterateTokens( callback: ( t: Token ) => any, tokenArray?: Array<Token> ) {

    if( !tokenArray ) tokenArray = this.tokens;

    for( let i = 0; i < tokenArray.length; i++) {

      if( tokenArray[i]?.children ) {
        this.iterateTokens( callback, tokenArray[i]!.children );

      } else {
        callback( tokenArray[i] );
      }
    }
  }
}