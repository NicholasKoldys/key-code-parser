/** TokenKeys - 
 * 
 * const genericKey = {
    "name": {
      key: '',
      escape: false,
      inline: false,
      delim: false,
      priority: 9
    }
  }
 */
const tokenKeys = {
  keys: {
    "interrupt": {
      key: "\/",
      repeated: 2,
      rule: "Interrupt",
      // inline: true,
      // priority: 9
    },
  }
};