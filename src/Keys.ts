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
export enum keyable {
  Fencing = 'fencing',
  HeaderPrimaryKey = 'headerPrimary',
  HeaderSecondaryKey = 'headerSecondary',
  Highlight = 'highlight',
  Bold = 'bold',
  Redact = 'redact',
  Interrupt = 'interrupt'
}

export interface KeyTemp {
  [ rule: string ] : {
    key: string,
    repeated: number,
  }
}

export interface Key {
  key: string,
  repeated: number,
  rule: keyable,
}

export type DefinedKeys = {
  [ keyableName: string ] : Key
}

export const defaultKeys: DefinedKeys = Object.fromEntries( new Map([
  [keyable.Fencing, {
    key: '\`',
    repeated: 3,
    rule: keyable.Fencing
  }],
  [keyable.HeaderPrimaryKey, {
    key: '-',
    repeated: 3,
    rule: keyable.HeaderPrimaryKey
  }],
  [keyable.HeaderSecondaryKey, {
    key: '=',
    repeated: 3,
    rule: keyable.HeaderSecondaryKey
  }],
  [keyable.Highlight, {
    key: '\`',
    repeated: 2,
    rule: keyable.Highlight
  }],
  [keyable.Bold, {
    key: '\*',
    repeated: 2,
    rule: keyable.Bold
  }],
  [keyable.Redact, {
    key: '\~',
    repeated: 2,
    rule: keyable.Redact
  }],
  [keyable.Interrupt, {
    key: '\\',
    repeated: 2,
    rule: keyable.Interrupt
  }],
]));