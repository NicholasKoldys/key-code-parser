import { defaultKeys, Key, Keyable } from "../Keys.js";
import { assert, assertEquals, TestsOf } from "./test-lib.js";

TestsOf("Keyable: ", {
  "Object Field Sanity   ": [
    () => assertEquals(Object(Keyable).hasOwnProperty("Fencing"), true),
    "continue with sound mind.",
  ],

  "field:         fencing": [
    () => assert(Keyable.Fencing == "fencing"),
    "has Fencing.",
  ],

  "field:   headerPrimary": [
    () => assert(Keyable.HeaderPrimaryKey == "headerPrimary"),
    "has HeaderPrimaryKey.",
  ],

  "field: headerSecondary": [
    () => assert(Keyable.HeaderSecondaryKey == "headerSecondary"),
    "has HeaderSecondaryKey.",
  ],

  "field:       highlight": [
    () => assert(Keyable.Highlight == "highlight"),
    "has Highlight.",
  ],

  "field:            bold": [() => assert(Keyable.Bold == "bold"), "has Bold."],

  "field:          redact": [
    () => assert(Keyable.Redact == "redact"),
    "has Redact.",
  ],

  "field:       interrupt": [
    () => assert(Keyable.Interrupt == "interrupt"),
    "has Interrupt.",
  ],

  "field:      HelloWorld": [
    () =>
      assertEquals(Object(Keyable).hasOwnProperty("HelloWorld"), true, true),
    "has no HelloWorld key.",
  ],
});

TestsOf("DefinedKeys: ", {
  "rule:          fencing": [
    () => assertEquals(defaultKeys[Keyable.Fencing].rule, Keyable.Fencing),
    "has Fencing.",
  ],

  "rule:    headerPrimary": [
    () =>
      assertEquals(
        defaultKeys[Keyable.HeaderPrimaryKey].rule,
        Keyable.HeaderPrimaryKey
      ),
    "has HeaderPrimaryKey.",
  ],

  "rule:  headerSecondary": [
    () =>
      assertEquals(
        defaultKeys[Keyable.HeaderSecondaryKey].rule,
        Keyable.HeaderSecondaryKey
      ),
    "has HeaderSecondaryKey.",
  ],

  "rule:        highlight": [
    () => assertEquals(defaultKeys[Keyable.Highlight].rule, Keyable.Highlight),
    "has Highlight.",
  ],

  "rule:             bold": [
    () => assertEquals(defaultKeys[Keyable.Bold].rule, Keyable.Bold),
    "has Bold.",
  ],

  "rule:           redact": [
    () => assertEquals(defaultKeys[Keyable.Redact].rule, Keyable.Redact),
    "has Redact.",
  ],

  "rule:        interrupt": [
    () => assertEquals(defaultKeys[Keyable.Interrupt].rule, Keyable.Interrupt),
    "has Interrupt.",
  ],
});

const TestKey: Key = {
  key: "'",
  repeated: 5,
  rule: Keyable.Highlight,
};

TestsOf("Testing the key creation: ", {

  "Is TestKey     created": [
    () =>
      assertEquals(
        Object(TestKey).toString(),
        Object({
          key: "'",
          repeated: 5,
          rule: Keyable.Highlight,
        }).toString()
      ),
    "",
  ],

  "TestKey has key =  \\'": [
    () => assertEquals(TestKey.key, "'"),
    ""
  ],

  "TestKey has      rep 5": [
    () => assertEquals(TestKey.repeated, 5), 
    ""
  ],

  "TestKey has       rule": [
    () => assertEquals(TestKey.rule, Keyable.Highlight),
    "",
  ],
});
