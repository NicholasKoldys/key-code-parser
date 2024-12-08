/**
 * 
 * @param { { callback: Function, args: Array<any> } } param0 
 * @param { number } iter 
 * @returns 
 */
export function justRun( { callback, args }, iter = 10000 ) {
  const dur = Date.now();
  for( let i = 0; i < iter; i++ ) {
    if( callback(...args) ) continue;
    else break;
  }
  return (Date.now() - dur);
}

/**
 * 
 * @param { Array<{ callback: Function, args: Array<any> }> } arrayOfFunctions 
 * @returns { { duration: number, returnArray: Array<any> } }
 */
export function runBetween( arrayOfFunctions ) {
  const dur = Date.now();

  let returnArray = new Array();

  for( let i=0; i < arrayOfFunctions.length; i++) {
    returnArray.push( arrayOfFunctions[i].callback( ...arrayOfFunctions[i].args ) );
  }

  return {
    duration: Date.now() - dur,
    returnArray: returnArray,
  };
}