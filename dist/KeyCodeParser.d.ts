/** declared module "KeyCodeParser"*/

//* ../src/Keys.d.ts 
export enum Keyable {
    Fencing = "fencing",
    HeaderPrimaryKey = "headerPrimary",
    HeaderSecondaryKey = "headerSecondary",
    Highlight = "highlight",
    Bold = "bold",
    Redact = "redact",
    Interrupt = "interrupt"
}
export interface Key {
    key: string;
    repeated: number;
    rule: Keyable;
}
export type DefinedKeys = {
    [keyableName: string]: Key;
};
export function mapToKeyable(...keys: Array<Key>): any;
export const defaultKeys: DefinedKeys;

//* ../src/Parser.d.ts 
export interface Token {
    keyName: string | number;
    raw: string;
    text: string;
    depth: number;
    type?: string;
    children?: Array<Token>;
}
export class KeyCodeParser {
    tokens: Array<Token>;
    private interpretter;
    constructor(userKeys?: DefinedKeys | Array<Key>);
    parse(src: string, options?: Object): Array<Token>;
    getOrderedChildren(): IterableIterator<Token>;
    getStringArray(): Array<string>;
    iterateTokens(callback: (t: Token) => any, tokenArray?: Array<Token>): void;
}

//* ../src/RegexTemplate.d.ts 
export class RegexTemplate {
    source: string;
    opts: string;
    expr: RegExp | undefined;
    groups: Groups;
    constructor(regex: string | RegExp, opt?: string);
    replace(positionId: string | RegExp, value: string | RegExp): this;
    createRegex(groups?: Groups): this;
    get regex(): RegExp;
}
export type Groups = {
    [key: string]: number;
};

//* ../src/Rules.d.ts 
export type Rules = {
    patterns: RegexTemplate;
    hasTokens: boolean;
};
export enum GroupsNames {
    TYPE = "TYPE",
    RESULT = "RESULT"
}
export enum Ruleable {
    AllowableSpace = "AllowableSpace",
    Fencing = "Fencing",
    HeadingSect = "HeadingSect",
    TextBlock = "TextBlock",
    Paragraph = "Paragraph",
    Highlight = "Highlight",
    Span = "Span"
}
export type BlockRules = {
    [key: string]: Rules;
};
export type InlineRules = {
    [key: string]: Rules;
};
/**
 * Sorted List of Rules most sectionable to least.
 * The most sectionable are profiled first and will be styled before the least.
 *  * Map is used to ensure preserved order.
 */
export const BlockOrderedRules: (keys: DefinedKeys) => BlockRules;
/**
 * Sorted List of Rules most applicable to least. ~think big contains small
 *  * Map is used to ensure preserved order.
 */
export const InlineOrderedRules: (keys: DefinedKeys) => InlineRules;

