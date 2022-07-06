/* const LibraryTest = TestsOf( "TestSectionTitle: ", {
    'Assert w equals': [(res) => assert(2.6 == 2.6), 'assert is checking'],
    'Assert w !equal': [(res) => assert(2 == 1), 'assert is Failing'],
    'Assert Solution': [(res) => assertEquals(9, 3*3), 'assertEquals is checking'],
    'Assert Wrong ==': [(res) => assertEquals(null, !null), 'assertEquals is Failing']
});*/
type TestSuite = {
    [ TestName: string ]: [ assertion: () => void, testCase: string ];
}

interface TestResult {
    [ TestName: string ]: string;
}

export function TestsOf( SectionTitle: string = "Tests of :", suite: TestSuite, 
    options: { cmd: { tabbedCMDline: boolean } } = { cmd: { tabbedCMDline: true }} ): TestResult 
{
    let failures = 0;
    let results: TestResult = {};
    const logg = new DecoratedConsole( { tabbedCMDline: true }); 
    logg.noteLog( SectionTitle );
    for( let test in suite ) {
        let [ assertion, testCase ] = suite[ test ];
        try {
            assertion();
            results[test] = logg.cLog( test, testCase, options?.cmd );
        } catch (err) {
            failures++;
            if( err instanceof Error ) {
                results[test] = logg.fLog( test, testCase );
                if( err.cause == false ) {
                    console.log(err.message);
                    console.error(err.stack);
                }
            }
        }
    }
    return results;
}

export function FastTestOf( suite: TestSuite ) {
    const logg = new DecoratedConsole( { tabbedCMDline: true }); 
    try {
        for( let test in suite ) {
            let [ assertion, testCase ] = suite[ test ];
            try {
                assertion();
                logg.cLog( test, testCase );
            } catch (err) {
                if( err instanceof Error ) {
                    throw new Error( err.message, { cause: test } );
                }
            }
        }
    } catch (err) {
        if( err instanceof Error ) {
            logg.fLog( err.cause as string, ' ' );
            console.log(err.message);
            console.error(err.stack);
        }
    }
}


export function assert( expression: boolean, isFailureCheck: boolean = false ) {
    if ( !expression ) {
        throw new Error( 'assert(): FAILED', { cause: isFailureCheck } );
    }
}

export function assertEquals( actual: any, expected: any, isFailureCheck: boolean = false ) {
    const comparableActual = actual?.constructor?.name === "Object" 
        ? JSON.stringify( actual ) : actual;
    const comparableExpected = expected?.constructor?.name === "Object" 
        ? JSON.stringify( expected ) : expected;
    if ( comparableExpected != comparableActual ) {
        // throw new Error( 'assertEquals() "' + comparableExpected + '" != "' + comparableActual + '"', { cause: isFailureCheck } );
        throw new Error( `assertEquals() "${comparableActual}" != "${comparableExpected}"`, { cause: isFailureCheck } );
    }
}

export function assertStrictEquals( actual: any, expected: any, isFailureCheck: boolean = false ) {
    if ( expected !== actual ) {
        throw new Error( 'assertStrictEquals() "' + expected + '" !== "' + actual + '"', { cause: isFailureCheck } );
    }
}

const redMsg = '\u001b[1;31m';
const greenMsg = '\u001b[1;32m';
const yellowMsg = '\u001b[1;33m';
const blueMsg = '\u001b[1;34m';
const purpleMsg = '\u001b[1;35m';
// const resetLogColor = '\u001b[0m';

class DecoratedConsole {
    private preStr: string = '';
    private postStr: string = '';
    private endSection: string = '';
    private endLog: string = '';

    constructor( options: any ) {
        if( options.tabbedCMDline ) this.preStr += '├';
        if( options.tabbedCMDline ) this.endSection += '└';
    }

    cLog( title: string, msg: string, options?: any ) {
        console.log( `${this.preStr}\u001b[1;34m${ title } :\u001b[1;32m   OK   \u001b[0m ${ msg }` );
        return title + ':   OK   ' + msg;
    }

    fLog( title: string, msg: string, options?: any ) {
        console.log( `${this.preStr}\u001b[1;33m${ title } :\u001b[1;31m FAILED \u001b[0m ${ msg }` );
        return title + ': FAILED ' + msg;
    }

    noteLog( msg: string, options?: any ) {
        console.log( `\u001b[1;35m${ msg } \u001b[0m` );
    }
}