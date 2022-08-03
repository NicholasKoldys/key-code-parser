const Caret = /(^|[^\[])\^/g;

export class RegexTemplate {
  source: string;
  opts: string;
  expr: RegExp|undefined;
  groups: Groups;

  constructor(regex: string|RegExp, opt = '') {
    this.source = typeof regex === "string" ? regex : regex.source;
    this.opts = opt;
    this.expr = undefined;
    this.groups = {};
  }

  replace(positionId: string | RegExp, value: string | RegExp) {
    let regEx = typeof value === "string" ? value : value.source;
        regEx = regEx.replace(Caret, "$1");

    this.source = this.source.replaceAll(positionId, regEx);
    return this;
  };
  
  createRegex( groups: Groups = {} ) {
    this.expr = new RegExp(this.source, this.opts);
    this.groups = groups;
    return this;
  };

  get regex() {
    if(!this.expr) this.createRegex();
    return this.expr ? this.expr : /()/;
  }
}

export type Groups = {
  [ key: string ]: number
}