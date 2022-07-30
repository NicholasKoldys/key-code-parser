const Caret = /(^|[^\[])\^/g;

export function regExTemplate(regex: string | RegExp, opt = "") {
  let source = typeof regex === "string" ? regex : regex.source;

  const RegExObj = {
    replace: (positionId: string | RegExp, value: string | RegExp) => {
      let regEx = typeof value === "string" ? value : value.source;
      regEx = regEx.replace(Caret, "$1");
      source = source.replaceAll(positionId, regEx);
      return RegExObj;
    },

    getRegex: () => {
      return new RegExp(source, opt);
    },
  };

  return RegExObj;
}