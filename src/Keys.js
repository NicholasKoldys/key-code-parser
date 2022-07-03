export var keyable;
(function (keyable) {
    keyable["Fencing"] = "fencing";
    keyable["HeaderPrimaryKey"] = "headerPrimary";
    keyable["HeaderSecondaryKey"] = "headerSecondary";
    keyable["Highlight"] = "highlight";
    keyable["Bold"] = "bold";
    keyable["Redact"] = "redact";
    keyable["Interrupt"] = "interrupt";
})(keyable || (keyable = {}));
export const defaultKeys = Object.fromEntries(new Map([
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
