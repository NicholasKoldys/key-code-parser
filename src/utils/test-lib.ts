/*
 * Example:
 *     TestsOf({
 *       'Name Of Test Suite': function() {
 *         assertEquals(6, add(2, 4));
 *         assertEquals(6.6, add(2.6, 4));
 *       },
 *      (){} ...
 *     });
 */
/**
 * @typedef {string} title
 * @typedef {string} functionSuite
 * @typedef {(void) } assertiveFunction
    // {{ title: { functionSuite: assertiveFunction }[] }} Suite
 */

    

type Suite = {
    [title: string]: () => void;
}


//TODO need to add a return result path or object storage for the results on the Suite
class TestResult {
    [testCase: string]: string[];
}

function getCaseStrings(results: TestResult) {
    const caseArray = [];
    for( const [key, value] of Object.entries(results)) {
        caseArray.push( key + ': ' + value.map(val => val).join(' with ') )
    }
    return caseArray;
}

/**
 * @param {Suite} suite 
 */
export function TestsOf( suite: Suite, isReturned = false ): TestResult | void  {
    let failures = 0;
    let results = new TestResult();
    for( /** @type {title}*/let test in suite ) {
        /** @type {assertiveFunction} */
        let testAction = suite[test];
        try {
            testAction();
            cLog('Test:', test, 'OK', ...getCaseStrings(results) );
        } catch (err) {
            failures++;
            if(err instanceof Error) {
                fLog('Test:', test, 'FAILED', ...getCaseStrings(results));
                fLog(err.message);
                console.error(err.stack);
            }
        }
    }
    if(isReturned) return results;
}

/**
 * @param {Suite} suite 
 */
export function FastTestOf( suite: Suite ) {
    try {
        for( let test in suite ) {
            let testAction = suite[test];
            try {
                testAction();
                cLog('Test:', test, 'OK');
            } catch (err) {
                if(err instanceof Error) {
                    throw new Error(err.message, { cause: test });
                }
            }
        }
    } catch (err) {
        if(err instanceof Error) {
            fLog('Test:', err.cause as string, 'FAILED', err.message);
            console.error(err.stack);
        }
    }
}

export function assignTestResults( result: TestResult, testCase: string, expression: string[] ) {
    result[testCase] = expression;
}

/**
 * @param {String} msg 
 */
export function fail(msg: string) {
    throw new Error('fail(): ' + msg);
}

/**
 * 
 * @param {boolean} expression 
 * @param {String} testCase 
 */
export function assert(expression: boolean, testCase = "test case", result?: TestResult ) {
    result ? assignTestResults(result, testCase, [String(expression)] ) : null;
    if (!expression) {
        throw new Error('assert(): ' + testCase);
    }
}

/**
 * @param {any} expected 
 * @param {any} actual 
 */
export function assertEquals(expected: any, actual: any, testCase: string, result?: TestResult ) {
    result ? assignTestResults(result, testCase, [expected, actual] ) : null;
    if (expected != actual) {
        throw new Error('assertEquals() "' + expected + '" != "' + actual + '"');
    }
}

/**
 * 
 * @param {any} expected 
 * @param {any} actual 
 */
export function assertStrictEquals(expected: any, actual: any, testCase: string, result?: TestResult ) {
    result ? assignTestResults(result, testCase, [expected, actual] ) : null;
    if (expected !== actual) {
        throw new Error('assertStrictEquals() "' + expected + '" !== "' + actual + '"');
    }
}

let stylesC = [
    "color: #00fc43",
    "font-size: 18px"
].join(";");

let stylesF = [
    "color: #fc0000",
    "font-size: 18px"
].join(";");

function cLog(...msg: string[]) {
    let fullString = msg.join(' ');
    console.log(`%c${fullString}`, stylesC);
}

function fLog(...msg: string[]) {
    let fullString = msg.join(' ');
    console.log(`%c${fullString}`, stylesF);
}