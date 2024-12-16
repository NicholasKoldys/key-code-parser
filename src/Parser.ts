/* NicholasKoldys.dev
All rights reserved (c) 2024

KEY-CODE-PARSER

Parser.ts/js

Constains Tokenizer - Keyinterpreter - KeyParser API

History
-------
2024/12/16 - Nicholas.K. - 1.2.3
  Add iterator methods/generators for ease of looping.
2022/07/07 - Nicholas.K. - 1.0.0
  Initial creation.
 */
import { defaultKeys, DefinedKeys, Key, mapToKeyable } from "./Keys.js";
import { Groups } from "./RegexTemplate.js";
import { 
  BlockOrderedRules, 
  InlineOrderedRules, 
  BlockRules, 
  InlineRules, 
  Rules,
  Ruleable
} from "./Rules.js";

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

  tokenize( parsedStr: RegExpMatchArray, ruleName: string | number, groups: Groups, depth: number, squashToken?: Token ): Token {
    const result = parsedStr?.groups 
      ? ( parsedStr.groups?.RESULT || parsedStr[ groups.RESULT ] || 'null' ) 
      : parsedStr[ groups.RESULT ] || parsedStr[1];
    const type = parsedStr?.groups 
      ? ( parsedStr.groups?.TYPE || parsedStr[ groups.TYPE ] || 'null' ) 
      : parsedStr[ groups.TYPE ] || '';

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
  inlineQueue: Array<Token>;

  constructor( usersKeys: DefinedKeys | Array<Key> = defaultKeys) {
    if( Array.isArray( usersKeys ) ) {
      usersKeys = mapToKeyable( ...usersKeys );
    }
    const fullKeys = Object.assign( Object.assign({}, defaultKeys), usersKeys );
    this.Tokenizer = new Tokenizer( fullKeys );
    this.inlineQueue = [];
  }

  lexalizeFrom( 
    tokens: Array<Token>,
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

      if( parsed = orderedRule.patterns.regex.exec(src) ) {

        if(parsed[0].length > 0) {
          let token: Token;
          let tokenArray: Array<Token>;

          if( parent ) {

            if(!parent?.children) parent.children = new Array();

            tokenArray = parent.children;

          } else {
            tokenArray = tokens;
          }

          //* get the last token for possible concatenation.
          const lastIter = tokenArray?.length - 1 || 0;
          const prevToken = tokenArray[ lastIter >= 0 ? lastIter : 0 ];

          //* Remove previous token + combine to make singular concatentaed token.
          if(prevToken && (prevToken.keyName == iterRule)) {
            token = this.Tokenizer.tokenize( parsed, iterRule, orderedRule.patterns.groups, depthCount, prevToken);
            tokenArray.pop();

            //* if the rule can have child tokens, remove the previous parsable entry as we are going to create a new one.
            if( orderedRule?.hasTokens ) this.inlineQueue.pop();

          } else {
            token = this.Tokenizer.tokenize( parsed, iterRule, orderedRule.patterns.groups, depthCount );
          }

          //* If parent add to inline loop
          if( orderedRule?.hasTokens ) {

            if( Ruleable.Paragraph in rules ) {
              this.lexalizeFrom( tokens, token.text, rules, token, 0, ( depthCount + 1 ) );

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
        this.lexalizeFrom( tokens, this.inlineQueue[i].text, this.Tokenizer.inlineRules, this.inlineQueue[i], 0, 1 );
      }
    }
  }
}

export class KeyCodeParser {

  public tokens: Array<Token>;
  private interpretter: KeyInterpreter;

  constructor( userKeys?: DefinedKeys | Array<Key> ) {
    this.tokens = [];
    this.interpretter = new KeyInterpreter( userKeys );
  }

  parse( src: string, options?: Object ): Array<Token> {

    this.tokens = [];

    src = src.trim();

    this.interpretter.lexalizeFrom( this.tokens, src );

    return this.tokens;
  }

  *iterateTokensHelper( tokenArray?: Array<Token>, type: { getAll: boolean } = { getAll: true } ): Generator<Token> {

    if( !tokenArray ) {

      if ( this.tokens.length > 0) 
        tokenArray = this.tokens;
      else return;

    } else if( tokenArray.length < 1 ) return;

    for(let i = 0; i < tokenArray.length; i++) {

      if( type?.getAll ) yield tokenArray[i];

      if( tokenArray[i]?.children ) {

        yield* this.iterateTokensHelper( tokenArray[i].children, type );

      } else if ( !type?.getAll ) {

        yield tokenArray[i];
      }
    }
  }

  *getOrderedChildren(): IterableIterator< Token > {

    for(const val of this.iterateTokensHelper( this.tokens, { getAll: false } )) {
      yield val;
    }
  }

  *getTokenTree(): IterableIterator< Token > {

    for(const val of this.iterateTokensHelper( this.tokens, { getAll: true } )) {
      yield val;
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

  iterateTokens( 
    callback: ( t: Token ) => any, 
    options: { fromIter?: number, callWithParents?: boolean, } = { fromIter: 0, callWithParents: false },
    tokenArray?: Array<Token>
  ) {

    if( !tokenArray ) {

      if ( this.tokens.length > 0) 
        tokenArray = this.tokens;
      else return;

    } else if( tokenArray.length < 1 ) return;

    for( let i = options.fromIter || 0; i < tokenArray.length; i++) {

      if( options.callWithParents ) callback( tokenArray[i] );

      if( tokenArray[i]?.children ) {

        this.iterateTokens( callback, { ...options, fromIter: 0 }, tokenArray[i].children );

      } else if( !options.callWithParents ){

        callback( tokenArray[i] );
      }
    }
  }
}