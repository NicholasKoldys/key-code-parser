/* NicholasKoldys.dev
All rights reserved (c) 2024

KEY-CODE-PARSER

Keys.ts/js

Constains Key types for API for user customization.

History
-------
2024/10/18 - Nicholas.K. - 1.0.0
  Initial creation.
 */
export enum Keyable {
  Fencing = 'fencing',
  HeaderPrimaryKey = 'headerPrimary',
  HeaderSecondaryKey = 'headerSecondary',
  Highlight = 'highlight',
  Bold = 'bold',
  Redact = 'redact',
  Interrupt = 'interrupt'
}

export interface Key {
  key: string, 
  repeated: number, 
  rule: Keyable, 
}

export type DefinedKeys = {
  [ keyableName: string ] : Key
}

export const defaultKeys: DefinedKeys = Object.fromEntries( new Map([
  [Keyable.Fencing, {
    key: '\`',
    repeated: 3,
    rule: Keyable.Fencing
  }],
  [Keyable.HeaderPrimaryKey, {
    key: '\\-',
    repeated: 3,
    rule: Keyable.HeaderPrimaryKey
  }],
  [Keyable.HeaderSecondaryKey, {
    key: '\\=',
    repeated: 3,
    rule: Keyable.HeaderSecondaryKey
  }],
  [Keyable.Highlight, {
    key: '\\`',
    repeated: 2,
    rule: Keyable.Highlight
  }],
  [Keyable.Bold, {
    key: '\\*',
    repeated: 2,
    rule: Keyable.Bold
  }],
  [Keyable.Redact, {
    key: '\\~',
    repeated: 2,
    rule: Keyable.Redact
  }],
  [Keyable.Interrupt, {
    key: '\\',
    repeated: 2,
    rule: Keyable.Interrupt
  }],
]));