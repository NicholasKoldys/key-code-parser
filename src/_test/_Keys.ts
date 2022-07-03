import { assertEquals, TestsOf } from "utils/test-lib";
import { Key, keyable } from "../Keys";

// const HeaderPrimaryKey = `${keys[keyable.HeaderPrimaryKey].key}{${keys[keyable.HeaderPrimaryKey].repeated}}` 
//   || '\-{3}';

TestsOf({
  'Keyable: Fencing ': function() {
    assertEquals( 'fencing', keyable.Fencing, 'is key Fence' );
  },
  // 'Keyable: HeaderPrimaryKey ': function() {
  //   assertEquals(6, add(2, 4));
  //   assertEquals(6.6, add(2.6, 4));
  // },
});

const key = {
  [ keyable.Interrupt ] : {
    key: '\=',
    repeated: 2,
  }
}

TestsOf({
  'Key has field: key ': function() {

  },
  'Key has field: repeated ': function() {

  },
});