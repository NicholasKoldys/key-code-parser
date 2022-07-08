import { TestsOf, assert, assertEquals } from "./test-lib.js";

const LibraryTest = TestsOf( "TestSectionTitle: ", {
  'Assert w equals': [() => assert(2.6 == 2.6), 'assert is checking'],
  'Assert w !equal': [() => assert(undefined == 1), 'assert is Failing'],
  'Assert Solution': [() => assertEquals(9, 3*3), 'assertEquals is checking'],
  'Assert Wrong ==': [() => assertEquals(null, 1), 'assertEquals is Failing']
});

console.log( 'All Results: ' );
for( let [test, res ] of Object.entries(LibraryTest) ) {
  console.log( test, ': ', res );
}