(() => {
  // ../common-js/lang/is.js
  function number(candidate) {
    return typeof candidate === "number" && !isNaN(candidate);
  }
  function integer(candidate) {
    return typeof candidate === "number" && !isNaN(candidate) && (candidate | 0) === candidate;
  }
  function string(candidate) {
    return typeof candidate === "string";
  }
  function date(candidate) {
    return candidate instanceof Date;
  }
  function regexp(candidate) {
    return candidate instanceof RegExp;
  }
  function fn(candidate) {
    return typeof candidate === "function";
  }
  function array(candidate) {
    return Array.isArray(candidate);
  }
  function boolean(candidate) {
    return typeof candidate === "boolean";
  }

  // ../common-js/lang/assert.js
  function checkArgumentType(variable, variableName, type, typeDescription, index) {
    if (type === String) {
      if (!string(variable)) {
        throwInvalidTypeError(variableName, "string", index);
      }
    } else if (type === Number) {
      if (!number(variable)) {
        throwInvalidTypeError(variableName, "number", index);
      }
    } else if (type === Function) {
      if (!fn(variable)) {
        throwInvalidTypeError(variableName, "function", index);
      }
    } else if (type === Boolean) {
      if (!boolean(variable)) {
        throwInvalidTypeError(variableName, "boolean", index);
      }
    } else if (type === Date) {
      if (!date(variable)) {
        throwInvalidTypeError(variableName, "date", index);
      }
    } else if (type === RegExp) {
      if (!regexp(variable)) {
        throwInvalidTypeError(variableName, "RegExp", index);
      }
    } else if (type === Array) {
      if (!array(variable)) {
        throwInvalidTypeError(variableName, "array", index);
      }
    } else if (!(variable instanceof (type || Object))) {
      throwInvalidTypeError(variableName, typeDescription, index);
    }
  }
  function throwInvalidTypeError(variableName, typeDescription, index) {
    let message;
    if (typeof index === "number") {
      message = `The argument [ ${variableName || "unspecified"} ], at index [ ${index.toString()} ] must be a [ ${typeDescription || "unknown"} ]`;
    } else {
      message = `The argument [ ${variableName || "unspecified"} ] must be a [ ${typeDescription || "Object"} ]`;
    }
    throw new Error(message);
  }
  function throwCustomValidationError(variableName, predicateDescription) {
    throw new Error(`The argument [ ${variableName || "unspecified"} ] failed a validation check [ ${predicateDescription || "No description available"} ]`);
  }
  function argumentIsRequired(variable, variableName, type, typeDescription) {
    checkArgumentType(variable, variableName, type, typeDescription);
  }
  function argumentIsOptional(variable, variableName, type, typeDescription, predicate, predicateDescription) {
    if (variable === null || variable === void 0) {
      return;
    }
    checkArgumentType(variable, variableName, type, typeDescription);
    if (fn(predicate) && !predicate(variable)) {
      throwCustomValidationError(variableName, predicateDescription);
    }
  }
  function argumentIsValid(variable, variableName, predicate, predicateDescription) {
    if (!predicate(variable)) {
      throwCustomValidationError(variableName, predicateDescription);
    }
  }

  // ../common-js/lang/Enum.js
  var types = /* @__PURE__ */ new Map();
  var Enum = class _Enum {
    #code;
    #description;
    #mapping;
    /**
     * @param {string} code - The unique code of the enumeration item.
     * @param {string} description - A description of the enumeration item.
     * @param {number=} mapping - An alternate key value (used when external systems identify enumeration items using integer values).
     */
    constructor(code, description, mapping) {
      argumentIsRequired(code, "code", String);
      argumentIsRequired(description, "description", String);
      argumentIsOptional(mapping, "mapping", Number);
      if (number(mapping)) {
        argumentIsValid(mapping, "mapping", integer, "must be an integer");
      }
      this.#code = code;
      this.#description = description;
      if (number(mapping)) {
        this.#mapping = mapping;
      } else {
        this.#mapping = null;
      }
      const c = this.constructor;
      if (!types.has(c)) {
        types.set(c, []);
      }
      const valid = _Enum.fromCode(c, this.#code) === null && (this.#mapping === null || _Enum.fromMapping(c, this.#mapping) === null);
      if (valid) {
        types.get(c).push(this);
      }
    }
    /**
     * The unique code.
     *
     * @public
     * @returns {string}
     */
    get code() {
      return this.#code;
    }
    /**
     * The description.
     *
     * @public
     * @returns {string}
     */
    get description() {
      return this.#description;
    }
    /**
     * An alternate key value (used when external systems identify enumeration items
     * using numeric values). This value will not be present for all enumerations.
     *
     * @public
     * @returns {number|null}
     */
    get mapping() {
      return this.#mapping;
    }
    /**
     * Returns true if the provided {@link Enum} argument is equal
     * to the instance.
     *
     * @public
     * @param {Enum} other
     * @returns {boolean}
     */
    equals(other) {
      return other === this || other instanceof _Enum && other.constructor === this.constructor && other.code === this.code;
    }
    /**
     * Returns the JSON representation.
     *
     * @public
     * @returns {string}
     */
    toJSON() {
      return this.code;
    }
    /**
     * Looks up an enumeration item; given the enumeration type and the enumeration
     * item's value. If no matching item can be found, a null value is returned.
     *
     * @public
     * @static
     * @param {Function} type - The enumeration type.
     * @param {string} code - The enumeration item's code.
     * @returns {Enum|null}
     */
    static fromCode(type, code) {
      return _Enum.getItems(type).find((x) => x.code === code) || null;
    }
    /**
     * Looks up an enumeration item; given the enumeration type and the enumeration
     * item's value. If no matching item can be found, a null value is returned.
     *
     * @public
     * @static
     * @param {Function} type - The enumeration type.
     * @param {number} mapping - The enumeration item's mapping value.
     * @returns {Enum|null}
     */
    static fromMapping(type, mapping) {
      if (mapping === null) {
        return null;
      }
      return _Enum.getItems(type).find((x) => x.mapping === mapping) || null;
    }
    /**
     * Returns the enumeration's items (given an enumeration type).
     *
     * @public
     * @static
     * @param {Function} type - The enumeration to list.
     * @returns {Array}
     */
    static getItems(type) {
      return types.get(type) || [];
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Enum]";
    }
  };

  // ../../node_modules/big.js/big.mjs
  var DP = 20;
  var RM = 1;
  var MAX_DP = 1e6;
  var MAX_POWER = 1e6;
  var NE = -7;
  var PE = 21;
  var STRICT = false;
  var NAME = "[big.js] ";
  var INVALID = NAME + "Invalid ";
  var INVALID_DP = INVALID + "decimal places";
  var INVALID_RM = INVALID + "rounding mode";
  var DIV_BY_ZERO = NAME + "Division by zero";
  var P = {};
  var UNDEFINED = void 0;
  var NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
  function _Big_() {
    function Big2(n) {
      var x = this;
      if (!(x instanceof Big2)) {
        return n === UNDEFINED && arguments.length === 0 ? _Big_() : new Big2(n);
      }
      if (n instanceof Big2) {
        x.s = n.s;
        x.e = n.e;
        x.c = n.c.slice();
      } else {
        if (typeof n !== "string") {
          if (Big2.strict === true && typeof n !== "bigint") {
            throw TypeError(INVALID + "value");
          }
          n = n === 0 && 1 / n < 0 ? "-0" : String(n);
        }
        parse(x, n);
      }
      x.constructor = Big2;
    }
    Big2.prototype = P;
    Big2.DP = DP;
    Big2.RM = RM;
    Big2.NE = NE;
    Big2.PE = PE;
    Big2.strict = STRICT;
    Big2.roundDown = 0;
    Big2.roundHalfUp = 1;
    Big2.roundHalfEven = 2;
    Big2.roundUp = 3;
    return Big2;
  }
  function parse(x, n) {
    var e, i, nl;
    if (!NUMERIC.test(n)) {
      throw Error(INVALID + "number");
    }
    x.s = n.charAt(0) == "-" ? (n = n.slice(1), -1) : 1;
    if ((e = n.indexOf(".")) > -1) n = n.replace(".", "");
    if ((i = n.search(/e/i)) > 0) {
      if (e < 0) e = i;
      e += +n.slice(i + 1);
      n = n.substring(0, i);
    } else if (e < 0) {
      e = n.length;
    }
    nl = n.length;
    for (i = 0; i < nl && n.charAt(i) == "0"; ) ++i;
    if (i == nl) {
      x.c = [x.e = 0];
    } else {
      for (; nl > 0 && n.charAt(--nl) == "0"; ) ;
      x.e = e - i - 1;
      x.c = [];
      for (e = 0; i <= nl; ) x.c[e++] = +n.charAt(i++);
    }
    return x;
  }
  function round(x, sd, rm, more) {
    var xc = x.c;
    if (rm === UNDEFINED) rm = x.constructor.RM;
    if (rm !== 0 && rm !== 1 && rm !== 2 && rm !== 3) {
      throw Error(INVALID_RM);
    }
    if (sd < 1) {
      more = rm === 3 && (more || !!xc[0]) || sd === 0 && (rm === 1 && xc[0] >= 5 || rm === 2 && (xc[0] > 5 || xc[0] === 5 && (more || xc[1] !== UNDEFINED)));
      xc.length = 1;
      if (more) {
        x.e = x.e - sd + 1;
        xc[0] = 1;
      } else {
        xc[0] = x.e = 0;
      }
    } else if (sd < xc.length) {
      more = rm === 1 && xc[sd] >= 5 || rm === 2 && (xc[sd] > 5 || xc[sd] === 5 && (more || xc[sd + 1] !== UNDEFINED || xc[sd - 1] & 1)) || rm === 3 && (more || !!xc[0]);
      xc.length = sd;
      if (more) {
        for (; ++xc[--sd] > 9; ) {
          xc[sd] = 0;
          if (sd === 0) {
            ++x.e;
            xc.unshift(1);
            break;
          }
        }
      }
      for (sd = xc.length; !xc[--sd]; ) xc.pop();
    }
    return x;
  }
  function stringify(x, doExponential, isNonzero) {
    var e = x.e, s = x.c.join(""), n = s.length;
    if (doExponential) {
      s = s.charAt(0) + (n > 1 ? "." + s.slice(1) : "") + (e < 0 ? "e" : "e+") + e;
    } else if (e < 0) {
      for (; ++e; ) s = "0" + s;
      s = "0." + s;
    } else if (e > 0) {
      if (++e > n) {
        for (e -= n; e--; ) s += "0";
      } else if (e < n) {
        s = s.slice(0, e) + "." + s.slice(e);
      }
    } else if (n > 1) {
      s = s.charAt(0) + "." + s.slice(1);
    }
    return x.s < 0 && isNonzero ? "-" + s : s;
  }
  P.abs = function() {
    var x = new this.constructor(this);
    x.s = 1;
    return x;
  };
  P.cmp = function(y) {
    var isneg, x = this, xc = x.c, yc = (y = new x.constructor(y)).c, i = x.s, j = y.s, k = x.e, l = y.e;
    if (!xc[0] || !yc[0]) return !xc[0] ? !yc[0] ? 0 : -j : i;
    if (i != j) return i;
    isneg = i < 0;
    if (k != l) return k > l ^ isneg ? 1 : -1;
    j = (k = xc.length) < (l = yc.length) ? k : l;
    for (i = -1; ++i < j; ) {
      if (xc[i] != yc[i]) return xc[i] > yc[i] ^ isneg ? 1 : -1;
    }
    return k == l ? 0 : k > l ^ isneg ? 1 : -1;
  };
  P.div = function(y) {
    var x = this, Big2 = x.constructor, a = x.c, b = (y = new Big2(y)).c, k = x.s == y.s ? 1 : -1, dp = Big2.DP;
    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }
    if (!b[0]) {
      throw Error(DIV_BY_ZERO);
    }
    if (!a[0]) {
      y.s = k;
      y.c = [y.e = 0];
      return y;
    }
    var bl, bt, n, cmp, ri, bz = b.slice(), ai = bl = b.length, al = a.length, r = a.slice(0, bl), rl = r.length, q = y, qc = q.c = [], qi = 0, p = dp + (q.e = x.e - y.e) + 1;
    q.s = k;
    k = p < 0 ? 0 : p;
    bz.unshift(0);
    for (; rl++ < bl; ) r.push(0);
    do {
      for (n = 0; n < 10; n++) {
        if (bl != (rl = r.length)) {
          cmp = bl > rl ? 1 : -1;
        } else {
          for (ri = -1, cmp = 0; ++ri < bl; ) {
            if (b[ri] != r[ri]) {
              cmp = b[ri] > r[ri] ? 1 : -1;
              break;
            }
          }
        }
        if (cmp < 0) {
          for (bt = rl == bl ? b : bz; rl; ) {
            if (r[--rl] < bt[rl]) {
              ri = rl;
              for (; ri && !r[--ri]; ) r[ri] = 9;
              --r[ri];
              r[rl] += 10;
            }
            r[rl] -= bt[rl];
          }
          for (; !r[0]; ) r.shift();
        } else {
          break;
        }
      }
      qc[qi++] = cmp ? n : ++n;
      if (r[0] && cmp) r[rl] = a[ai] || 0;
      else r = [a[ai]];
    } while ((ai++ < al || r[0] !== UNDEFINED) && k--);
    if (!qc[0] && qi != 1) {
      qc.shift();
      q.e--;
      p--;
    }
    if (qi > p) round(q, p, Big2.RM, r[0] !== UNDEFINED);
    return q;
  };
  P.eq = function(y) {
    return this.cmp(y) === 0;
  };
  P.gt = function(y) {
    return this.cmp(y) > 0;
  };
  P.gte = function(y) {
    return this.cmp(y) > -1;
  };
  P.lt = function(y) {
    return this.cmp(y) < 0;
  };
  P.lte = function(y) {
    return this.cmp(y) < 1;
  };
  P.minus = P.sub = function(y) {
    var i, j, t, xlty, x = this, Big2 = x.constructor, a = x.s, b = (y = new Big2(y)).s;
    if (a != b) {
      y.s = -b;
      return x.plus(y);
    }
    var xc = x.c.slice(), xe = x.e, yc = y.c, ye = y.e;
    if (!xc[0] || !yc[0]) {
      if (yc[0]) {
        y.s = -b;
      } else if (xc[0]) {
        y = new Big2(x);
      } else {
        y.s = 1;
      }
      return y;
    }
    if (a = xe - ye) {
      if (xlty = a < 0) {
        a = -a;
        t = xc;
      } else {
        ye = xe;
        t = yc;
      }
      t.reverse();
      for (b = a; b--; ) t.push(0);
      t.reverse();
    } else {
      j = ((xlty = xc.length < yc.length) ? xc : yc).length;
      for (a = b = 0; b < j; b++) {
        if (xc[b] != yc[b]) {
          xlty = xc[b] < yc[b];
          break;
        }
      }
    }
    if (xlty) {
      t = xc;
      xc = yc;
      yc = t;
      y.s = -y.s;
    }
    if ((b = (j = yc.length) - (i = xc.length)) > 0) for (; b--; ) xc[i++] = 0;
    for (b = i; j > a; ) {
      if (xc[--j] < yc[j]) {
        for (i = j; i && !xc[--i]; ) xc[i] = 9;
        --xc[i];
        xc[j] += 10;
      }
      xc[j] -= yc[j];
    }
    for (; xc[--b] === 0; ) xc.pop();
    for (; xc[0] === 0; ) {
      xc.shift();
      --ye;
    }
    if (!xc[0]) {
      y.s = 1;
      xc = [ye = 0];
    }
    y.c = xc;
    y.e = ye;
    return y;
  };
  P.mod = function(y) {
    var ygtx, x = this, Big2 = x.constructor, a = x.s, b = (y = new Big2(y)).s;
    if (!y.c[0]) {
      throw Error(DIV_BY_ZERO);
    }
    x.s = y.s = 1;
    ygtx = y.cmp(x) == 1;
    x.s = a;
    y.s = b;
    if (ygtx) return new Big2(x);
    a = Big2.DP;
    b = Big2.RM;
    Big2.DP = Big2.RM = 0;
    x = x.div(y);
    Big2.DP = a;
    Big2.RM = b;
    return this.minus(x.times(y));
  };
  P.neg = function() {
    var x = new this.constructor(this);
    x.s = -x.s;
    return x;
  };
  P.plus = P.add = function(y) {
    var e, k, t, x = this, Big2 = x.constructor;
    y = new Big2(y);
    if (x.s != y.s) {
      y.s = -y.s;
      return x.minus(y);
    }
    var xe = x.e, xc = x.c, ye = y.e, yc = y.c;
    if (!xc[0] || !yc[0]) {
      if (!yc[0]) {
        if (xc[0]) {
          y = new Big2(x);
        } else {
          y.s = x.s;
        }
      }
      return y;
    }
    xc = xc.slice();
    if (e = xe - ye) {
      if (e > 0) {
        ye = xe;
        t = yc;
      } else {
        e = -e;
        t = xc;
      }
      t.reverse();
      for (; e--; ) t.push(0);
      t.reverse();
    }
    if (xc.length - yc.length < 0) {
      t = yc;
      yc = xc;
      xc = t;
    }
    e = yc.length;
    for (k = 0; e; xc[e] %= 10) k = (xc[--e] = xc[e] + yc[e] + k) / 10 | 0;
    if (k) {
      xc.unshift(k);
      ++ye;
    }
    for (e = xc.length; xc[--e] === 0; ) xc.pop();
    y.c = xc;
    y.e = ye;
    return y;
  };
  P.pow = function(n) {
    var x = this, one = new x.constructor("1"), y = one, isneg = n < 0;
    if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) {
      throw Error(INVALID + "exponent");
    }
    if (isneg) n = -n;
    for (; ; ) {
      if (n & 1) y = y.times(x);
      n >>= 1;
      if (!n) break;
      x = x.times(x);
    }
    return isneg ? one.div(y) : y;
  };
  P.prec = function(sd, rm) {
    if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
      throw Error(INVALID + "precision");
    }
    return round(new this.constructor(this), sd, rm);
  };
  P.round = function(dp, rm) {
    if (dp === UNDEFINED) dp = 0;
    else if (dp !== ~~dp || dp < -MAX_DP || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }
    return round(new this.constructor(this), dp + this.e + 1, rm);
  };
  P.sqrt = function() {
    var r, c, t, x = this, Big2 = x.constructor, s = x.s, e = x.e, half = new Big2("0.5");
    if (!x.c[0]) return new Big2(x);
    if (s < 0) {
      throw Error(NAME + "No square root");
    }
    s = Math.sqrt(+stringify(x, true, true));
    if (s === 0 || s === 1 / 0) {
      c = x.c.join("");
      if (!(c.length + e & 1)) c += "0";
      s = Math.sqrt(c);
      e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
      r = new Big2((s == 1 / 0 ? "5e" : (s = s.toExponential()).slice(0, s.indexOf("e") + 1)) + e);
    } else {
      r = new Big2(s + "");
    }
    e = r.e + (Big2.DP += 4);
    do {
      t = r;
      r = half.times(t.plus(x.div(t)));
    } while (t.c.slice(0, e).join("") !== r.c.slice(0, e).join(""));
    return round(r, (Big2.DP -= 4) + r.e + 1, Big2.RM);
  };
  P.times = P.mul = function(y) {
    var c, x = this, Big2 = x.constructor, xc = x.c, yc = (y = new Big2(y)).c, a = xc.length, b = yc.length, i = x.e, j = y.e;
    y.s = x.s == y.s ? 1 : -1;
    if (!xc[0] || !yc[0]) {
      y.c = [y.e = 0];
      return y;
    }
    y.e = i + j;
    if (a < b) {
      c = xc;
      xc = yc;
      yc = c;
      j = a;
      a = b;
      b = j;
    }
    for (c = new Array(j = a + b); j--; ) c[j] = 0;
    for (i = b; i--; ) {
      b = 0;
      for (j = a + i; j > i; ) {
        b = c[j] + yc[i] * xc[j - i - 1] + b;
        c[j--] = b % 10;
        b = b / 10 | 0;
      }
      c[j] = b;
    }
    if (b) ++y.e;
    else c.shift();
    for (i = c.length; !c[--i]; ) c.pop();
    y.c = c;
    return y;
  };
  P.toExponential = function(dp, rm) {
    var x = this, n = x.c[0];
    if (dp !== UNDEFINED) {
      if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
        throw Error(INVALID_DP);
      }
      x = round(new x.constructor(x), ++dp, rm);
      for (; x.c.length < dp; ) x.c.push(0);
    }
    return stringify(x, true, !!n);
  };
  P.toFixed = function(dp, rm) {
    var x = this, n = x.c[0];
    if (dp !== UNDEFINED) {
      if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
        throw Error(INVALID_DP);
      }
      x = round(new x.constructor(x), dp + x.e + 1, rm);
      for (dp = dp + x.e + 1; x.c.length < dp; ) x.c.push(0);
    }
    return stringify(x, false, !!n);
  };
  P.toJSON = P.toString = function() {
    var x = this, Big2 = x.constructor;
    return stringify(x, x.e <= Big2.NE || x.e >= Big2.PE, !!x.c[0]);
  };
  if (typeof Symbol !== "undefined") {
    P[/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")] = P.toJSON;
  }
  P.toNumber = function() {
    var n = +stringify(this, true, true);
    if (this.constructor.strict === true && !this.eq(n.toString())) {
      throw Error(NAME + "Imprecise conversion");
    }
    return n;
  };
  P.toPrecision = function(sd, rm) {
    var x = this, Big2 = x.constructor, n = x.c[0];
    if (sd !== UNDEFINED) {
      if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
        throw Error(INVALID + "precision");
      }
      x = round(new Big2(x), sd, rm);
      for (; x.c.length < sd; ) x.c.push(0);
    }
    return stringify(x, sd <= x.e || x.e <= Big2.NE || x.e >= Big2.PE, !!n);
  };
  P.valueOf = function() {
    var x = this, Big2 = x.constructor;
    if (Big2.strict === true) {
      throw Error(NAME + "valueOf disallowed");
    }
    return stringify(x, x.e <= Big2.NE || x.e >= Big2.PE, true);
  };
  var Big = _Big_();
  var big_default = Big;

  // ../common-js/lang/Decimal.js
  var Decimal = class _Decimal {
    #big;
    /**
     * @param {Decimal|number|string} value - The value.
     */
    constructor(value) {
      this.#big = _Decimal.#getBig(value);
    }
    /**
     * Returns a new {@link Decimal} instance that is the sum of the
     * current instance's value and the value supplied.
     *
     * @public
     * @param {Decimal|number|string} other - The value to add.
     * @returns {Decimal}
     */
    add(other) {
      return new _Decimal(this.#big.plus(_Decimal.#getBig(other)));
    }
    /**
     * Returns a new {@link Decimal} instance with a value that results
     * from the subtraction of the value supplied from the current instance's
     * value.
     *
     * @public
     * @param {Decimal|number|string} other - The value to subtract.
     * @returns {Decimal}
     */
    subtract(other) {
      return new _Decimal(this.#big.minus(_Decimal.#getBig(other)));
    }
    /**
     * Returns a new {@link Decimal} instance that is the product of the
     * current instance's value and the value supplied.
     *
     * @public
     * @param {Decimal|number|string} other - The value to multiply the current instance by.
     * @returns {Decimal}
     */
    multiply(other) {
      return new _Decimal(this.#big.times(_Decimal.#getBig(other)));
    }
    /**
     * Returns a new {@link Decimal} instance with a value that results
     * from the division of the current instance's value by the value
     * supplied.
     *
     * @public
     * @param {Decimal|number|string} other - The value to divide the current instance by.
     * @returns {Decimal}
     */
    divide(other) {
      return new _Decimal(this.#big.div(_Decimal.#getBig(other)));
    }
    /**
     * Returns a new {@link Decimal} instance with a value that results
     * from raising the current instance to the power of the exponent
     * provided.
     *
     * @public
     * @param {number} exponent
     * @returns {Decimal}
     */
    raise(exponent) {
      argumentIsRequired(exponent, "exponent", Number);
      return new _Decimal(this.#big.pow(exponent));
    }
    /**
     * Returns a new {@link Decimal} with a value resulting from a rounding
     * operation on the current value.
     *
     * @public
     * @param {number} places - The number of decimal places to retain.
     * @param {RoundingMode=} mode - The strategy to use for rounding.
     * @returns {Decimal}
     */
    round(places, mode) {
      argumentIsRequired(places, "places", Number);
      argumentIsOptional(mode, "mode", RoundingMode, "RoundingMode");
      const modeToUse = mode || RoundingMode.NORMAL;
      return new _Decimal(this.#big.round(places, modeToUse.value));
    }
    /**
     * Returns a new {@link Decimal} instance with of the remainder when
     * dividing the current instance by the value supplied.
     *
     * @public
     * @param {Decimal|number|string} other
     * @returns {Decimal}
     */
    mod(other) {
      return new _Decimal(this.#big.mod(_Decimal.#getBig(other)));
    }
    /**
     * Returns a new {@link Decimal} instance having the absolute value of
     * the current instance's value.
     *
     * @public
     * @returns {Decimal}
     */
    absolute() {
      return new _Decimal(this.#big.abs());
    }
    /**
     * Returns a new {@link Decimal} instance the opposite sign as the
     * current instance's value.
     *
     * @public
     * @returns {Decimal}
     */
    opposite() {
      return this.multiply(-1);
    }
    /**
     * Returns a boolean value, indicating if the current instance's value is
     * equal to zero (or approximately equal to zero).
     *
     * @public
     * @param {boolean=} approximate
     * @param {number=} places
     * @returns {boolean}
     */
    getIsZero(approximate, places) {
      argumentIsOptional(approximate, "approximate", Boolean);
      argumentIsOptional(places, "places", Number);
      return this.#big.eq(zero) || boolean(approximate) && approximate && this.round(places || big_default.DP, RoundingMode.NORMAL).getIsZero();
    }
    /**
     * Returns true if the current instance is positive; otherwise false.
     *
     * @public
     * @returns {boolean}
     */
    getIsPositive() {
      return this.#big.gt(zero);
    }
    /**
     * Returns true if the current instance is negative; otherwise false.
     *
     * @public
     * @returns {boolean}
     */
    getIsNegative() {
      return this.#big.lt(zero);
    }
    /**
     * Returns true if the current instance is greater than the value.
     *
     * @public
     * @param {Decimal|number|string} other - The value to compare.
     * @returns {boolean}
     */
    getIsGreaterThan(other) {
      return this.#big.gt(_Decimal.#getBig(other));
    }
    /**
     * Returns true if the current instance is greater than or equal to the value.
     *
     * @public
     * @param {Decimal|number|string} other - The value to compare.
     * @returns {boolean}
     */
    getIsGreaterThanOrEqual(other) {
      return this.#big.gte(_Decimal.#getBig(other));
    }
    /**
     * Returns true if the current instance is less than the value.
     *
     * @public
     * @param {Decimal|number|string} other - The value to compare.
     * @returns {boolean}
     */
    getIsLessThan(other) {
      return this.#big.lt(_Decimal.#getBig(other));
    }
    /**
     * Returns true if the current instance is less than or equal to the value.
     *
     * @public
     * @param {Decimal|number|string} other - The value to compare.
     * @returns {boolean}
     */
    getIsLessThanOrEqual(other) {
      return this.#big.lte(_Decimal.#getBig(other));
    }
    /**
     * Returns true if the current instance between two other values. The
     * test is inclusive, by default.
     *
     * @public
     * @param {Decimal|number|string} minimum - The minimum value.
     * @param {Decimal|number|string} maximum - The maximum value.
     * @param {boolean=} exclusive - If true, the value cannot equal the minimum or maximum value and still be considered "between" the other values.
     * @returns {boolean}
     */
    getIsBetween(minimum, maximum, exclusive) {
      argumentIsOptional(exclusive, "exclusive", Boolean);
      if (boolean(exclusive) && exclusive) {
        return this.getIsGreaterThan(minimum) && this.getIsLessThan(maximum);
      } else {
        return this.getIsGreaterThanOrEqual(minimum) && this.getIsLessThanOrEqual(maximum);
      }
    }
    /**
     * Returns true if the current instance is equal to the value.
     *
     * @public
     * @param {Decimal|number|string} other - The value to compare.
     * @returns {boolean}
     */
    getIsEqual(other) {
      return this.#big.eq(_Decimal.#getBig(other));
    }
    /**
     * Returns true is close to another value.
     *
     * @public
     * @param {Decimal|number|string} other - The value to compare.
     * @param {number} places - The significant digits.
     * @returns {boolean}
     */
    getIsApproximate(other, places) {
      if (places === 0) {
        return this.getIsEqual(other);
      }
      const difference = this.subtract(other).absolute();
      const tolerance = _Decimal.ONE.divide(new _Decimal(10).raise(places));
      return difference.getIsLessThan(tolerance);
    }
    /**
     * Returns true if the current instance is an integer (i.e. has no decimal
     * component).
     *
     * @public
     * @return {boolean}
     */
    getIsInteger() {
      return this.getIsEqual(this.round(0));
    }
    /**
     * Returns the number of decimal places used.
     *
     * @public
     * @returns {number}
     */
    getDecimalPlaces() {
      const matches = this.toFixed().match(/-?\d*\.(\d*)/);
      let returnVal;
      if (matches === null) {
        returnVal = 0;
      } else {
        returnVal = matches[1].length;
      }
      return returnVal;
    }
    /**
     * Emits a floating point value that approximates the value of the current
     * instance.
     *
     * @public
     * @param {number=} places
     * @returns {number}
     */
    toFloat(places) {
      argumentIsOptional(places, "places", Number);
      return parseFloat(this.#big.toFixed(places || 16));
    }
    /**
     * Returns a string-based representation of the instance's value.
     *
     * @public
     * @returns {string}
     */
    toFixed() {
      return this.#big.toFixed();
    }
    /**
     * Returns a {@link number} that is approximately equal to the value of
     * this {@link Decimal} instance.
     *
     * @public
     * @returns {number}
     */
    toNumber() {
      return this.#big.toNumber();
    }
    /**
     * Returns the JSON representation.
     *
     * @public
     * @returns {string}
     */
    toJSON() {
      return this.toFixed();
    }
    /**
     * Clones a {@link Decimal} instance.
     *
     * @public
     * @static
     * @param {Decimal} value
     * @returns {Decimal}
     */
    static clone(value) {
      argumentIsRequired(value, "value", _Decimal, "Decimal");
      return new _Decimal(value.#big);
    }
    /**
     * An alias for the constructor. Creates a new instance. Suitable for
     * use with the value emitted by {@link Decimal#toJSON}.
     *
     * @public
     * @static
     * @param {Decimal|number|string} value
     * @returns {Decimal}
     */
    static parse(value) {
      return new _Decimal(value);
    }
    /**
     * Returns an instance with the value of zero.
     *
     * @public
     * @static
     * @returns {Decimal}
     */
    static get ZERO() {
      return decimalZero;
    }
    /**
     * Returns an instance with the value of one.
     *
     * @public
     * @static
     * @returns {Decimal}
     */
    static get ONE() {
      return decimalOne;
    }
    /**
     * Returns an instance with the value of one.
     *
     * @public
     * @static
     * @returns {Decimal}
     */
    static get NEGATIVE_ONE() {
      return decimalNegativeOne;
    }
    /**
     * Returns the {@link RoundingMode} enumeration type.
     *
     * @public
     * @static
     * @returns {typeof RoundingMode}
     */
    static get ROUNDING_MODE() {
      return RoundingMode;
    }
    /**
     * Runs {@link Decimal#getIsZero} and returns the result.
     *
     * @public
     * @static
     * @param {Decimal} instance
     * @returns {boolean}
     */
    static getIsZero(instance) {
      argumentIsRequired(instance, "instance", _Decimal, "Decimal");
      return instance.getIsZero();
    }
    /**
     * Runs {@link Decimal#getIsZero} and returns the inverse.
     *
     * @public
     * @static
     * @param {Decimal} instance
     * @returns {boolean}
     */
    static getIsNotZero(instance) {
      argumentIsRequired(instance, "instance", _Decimal, "Decimal");
      return !instance.getIsZero();
    }
    /**
     * Runs {@link Decimal#getIsPositive} and returns the result.
     *
     * @public
     * @static
     * @param {Decimal} instance
     * @returns {boolean}
     */
    static getIsPositive(instance) {
      argumentIsRequired(instance, "instance", _Decimal, "Decimal");
      return instance.getIsPositive();
    }
    /**
     * Checks an instance to see if its negative or zero.
     *
     * @public
     * @static
     * @param {Decimal} instance
     * @returns {boolean}
     */
    static getIsNotPositive(instance) {
      argumentIsRequired(instance, "instance", _Decimal, "Decimal");
      return instance.getIsNegative() || instance.getIsZero();
    }
    /**
     * Runs {@link Decimal#getIsNegative} and returns the result.
     *
     * @public
     * @static
     * @param {Decimal} instance
     * @returns {boolean}
     */
    static getIsNegative(instance) {
      argumentIsRequired(instance, "instance", _Decimal, "Decimal");
      return instance.getIsNegative();
    }
    /**
     * Checks an instance to see if its positive or zero.
     *
     * @public
     * @static
     * @param {Decimal} instance
     * @returns {boolean}
     */
    static getIsNotNegative(instance) {
      argumentIsRequired(instance, "instance", _Decimal, "Decimal");
      return instance.getIsPositive() || instance.getIsZero();
    }
    /**
     * A comparator function for {@link Decimal} instances.
     *
     * @public
     * @static
     * @param {Decimal} a
     * @param {Decimal} b
     * @returns {number}
     */
    static compareDecimals(a, b) {
      argumentIsRequired(a, "a", _Decimal, "Decimal");
      argumentIsRequired(b, "b", _Decimal, "Decimal");
      if (a.#big.gt(b.#big)) {
        return 1;
      } else if (a.#big.lt(b.#big)) {
        return -1;
      } else {
        return 0;
      }
    }
    static #getBig(value) {
      if (value instanceof big_default) {
        return value;
      } else if (value instanceof _Decimal) {
        return value.#big;
      } else {
        return new big_default(value);
      }
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Decimal]";
    }
  };
  var zero = new big_default(0);
  var positiveOne = new big_default(1);
  var negativeOne = new big_default(-1);
  var decimalZero = new Decimal(zero);
  var decimalOne = new Decimal(positiveOne);
  var decimalNegativeOne = new Decimal(negativeOne);
  var RoundingMode = class extends Enum {
    #value;
    /**
        * @param {number} value
        * @param {string} description
        */
    constructor(value, description) {
      super(value.toString(), description);
      this.#value = value;
    }
    /**
     * The code used by the Big.js library.
     *
     * @ignore
     * @returns {number}
     */
    get value() {
      return this.#value;
    }
    /**
     * Rounds away from zero.
     *
     * @public
     * @static
     * @returns {RoundingMode}
     */
    static get UP() {
      return up;
    }
    /**
     * Rounds towards zero.
     *
     * @public
     * @static
     * @returns {RoundingMode}
     */
    static get DOWN() {
      return down;
    }
    /**
     * Rounds towards nearest neighbor. If equidistant, rounds away from zero.
     *
     * @public
     * @static
     * @returns {RoundingMode}
     */
    static get NORMAL() {
      return normal;
    }
    toString() {
      return "[RoundingMode]";
    }
  };
  var up = new RoundingMode(3, "up");
  var down = new RoundingMode(0, "down");
  var normal = new RoundingMode(1, "normal");

  // data/UnitCode.js
  var UnitCode = class _UnitCode extends Enum {
    #baseCode;
    #decimalDigits;
    #supportsFractions;
    #fractionFactor;
    #fractionDigits;
    #fractionFactorSpecial;
    #fractionDigitsSpecial;
    /**
     * @param {string} code
     * @param {number} baseCode
     * @param {number} decimalDigits - When formatting a price as a decimal value, the number of decimal places to display.
     * @param {boolean} supportsFractions - As an alternative to decimal-formatted prices, some instruments support fractional representations.
     * @param {number=} fractionFactor - The count of discrete prices which a unit can be divided into (e.g. a US dollar can be divided into 100 cents). By default, this is also the implied denominator in fractional notation (e.g. 3.6875 equals 3 and 22/32 — which is represented in fractional notation as "3-22", where the denominator of 32 is implied).
     * @param {number=} fractionDigits - The number of digits of the fraction's numerator to display (e.g. using two digits, the fraction 22/32 is shown as "0-22"; using three digits, the fraction 22.375/32 is shown as "0-223").
     * @param {number=} fractionFactorSpecial - Special fraction factors refer to the CME tick notation scheme (read more [here](https://www.cmegroup.com/confluence/display/EPICSANDBOX/Fractional+Pricing+-+Tick+and+Decimal+Conversions)). For example, the CME notation for 0.51171875 (in 1/8ths of 1/32nds) is "0-163", where the numerator of "163" means 16 thirty-seconds and 3 eighths of a thirty-second, where the actual fraction is 16.3[75] / 32, which equals 0.51171875.
     * @param {number=} fractionDigitsSpecial - The number of digits of the fraction's numerator to display, when formatting in CME tick notation. For example, the notation "0-163" (in 1/8ths of 1/32nds) equates to the fraction of 16.375/32. This notation is limited to three digits (163) and omits the trailing two digits (75).
     */
    constructor(code, baseCode, decimalDigits, supportsFractions, fractionFactor, fractionDigits, fractionFactorSpecial, fractionDigitsSpecial) {
      super(code, code);
      this.#baseCode = baseCode;
      this.#decimalDigits = decimalDigits;
      this.#supportsFractions = supportsFractions;
      if (supportsFractions) {
        this.#fractionFactor = fractionFactor;
        this.#fractionDigits = fractionDigits;
        this.#fractionFactorSpecial = fractionFactorSpecial || fractionFactor;
        this.#fractionDigitsSpecial = fractionDigitsSpecial || fractionDigits;
      } else {
        this.#fractionFactor = void 0;
        this.#fractionDigits = void 0;
        this.#fractionFactorSpecial = void 0;
        this.#fractionDigitsSpecial = void 0;
      }
    }
    /**
     * The numeric counterpart of a "unit" code.
     *
     * @public
     * @returns {number}
     */
    get baseCode() {
      return this.#baseCode;
    }
    /**
     * The single character "unit" code.
     *
     * @public
     * @returns {string}
     */
    get unitCode() {
      return this.code;
    }
    /**
     * When formatting in decimal mode, the number of digits to show after the
     * decimal point.
     *
     * @public
     * @returns {number}
     */
    get decimalDigits() {
      return this.#decimalDigits;
    }
    /**
     * Indicates if formatting can use the alternative to decimal notation -- that
     * is, fractional notation.
     *
     * @public
     * @returns {boolean}
     */
    get supportsFractions() {
      return this.#supportsFractions;
    }
    /**
     * The count of discrete prices which a unit can be divided into (e.g. a US dollar can be divided
     * into 100 cents). By default, this is also the implied denominator in fractional notation (e.g. 3.6875
     * equals 3 and 22/32 — which is represented in fractional notation as "3-22", where the denominator of 32
     * is implied).
     *
     * @public
     * @returns {number|undefined}
     */
    get fractionFactor() {
      return this.#fractionFactor;
    }
    /**
     * The number of digits of the fraction's numerator to display (e.g. using two digits, the fraction 22/32 is
     * shown as "0-22"; using three digits, the fraction 22.375/32 is shown as "0-223").
     *
     * @public
     * @returns {number|undefined}
     */
    get fractionDigits() {
      return this.#fractionDigits;
    }
    /**
     * Special fraction factors refer to the CME tick notation scheme (read more [here](https://www.cmegroup.com/confluence/display/EPICSANDBOX/Fractional+Pricing+-+Tick+and+Decimal+Conversions)).
     *
     * @public
     * @returns {number|undefined}
     */
    get fractionFactorSpecial() {
      return this.#fractionFactorSpecial;
    }
    /**
     * Same as {@link UnitCode#fractionDigits} for "special" fractions.
     *
     * @public
     * @returns {number|undefined}
     */
    get fractionDigitsSpecial() {
      return this.#fractionDigitsSpecial;
    }
    /**
     * The number of digits of the fraction's numerator to display, when formatting
     * in CME tick notation. For example, the notation "0-163" (in 1/8ths of 1/32nds) equates
     * to the fraction of 16.375/32. This notation is limited to three digits (163)
     * and omits the trailing two digits (75).
     *
     * @public
     * @param {boolean=} special
     * @returns {number|undefined}
     */
    getFractionFactor(special) {
      return special === true ? this.#fractionFactorSpecial : this.#fractionFactor;
    }
    /**
     * Returns the {@link UnitCode#fractionDigits} or {@link UnitCode#fractionDigitsSpecial} value.
     *
     * @public
     * @param {boolean=} special
     * @returns {number|undefined}
     */
    getFractionDigits(special) {
      return special === true ? this.#fractionDigitsSpecial : this.#fractionDigits;
    }
    /**
     * Determines the minimum price fluctuation. In other words, multiples
     * of this value determine the set of valid quote and trade prices
     * for an instrument.
     *
     * @public
     * @param {number} tickIncrement - The instrument tick increment.
     * @returns {number}
     */
    getMinimumTick(tickIncrement) {
      argumentIsValid(tickIncrement, "tickIncrement", integer, "must be an integer");
      const one = new Decimal(1);
      const ten = new Decimal(10);
      let discretePrice;
      if (this.supportsFractions) {
        discretePrice = one.divide(this.#fractionFactor);
      } else {
        discretePrice = one.divide(ten.raise(this.#decimalDigits));
      }
      const minimumTick = discretePrice.multiply(tickIncrement);
      return minimumTick.toFloat();
    }
    /**
     * Returns the change in value of a position when the instrument's price moves
     * up by the minimum tick.
     *
     * @public
     * @param {number} tickIncrement - The instrument tick increment.
     * @param {number} pointValue - The value of a one-point price change.
     * @returns {number}
     */
    getMinimumTickValue(tickIncrement, pointValue) {
      argumentIsValid(tickIncrement, "tickIncrement", integer, "must be an integer");
      argumentIsValid(pointValue, "pointValue", number, "must be a number");
      const minimumTick = new Decimal(this.getMinimumTick(tickIncrement));
      const minimumTickValue = minimumTick.multiply(pointValue);
      return minimumTickValue.toFloat();
    }
    /**
     * Rounds a value to the nearest valid tick.
     *
     * @param {number|Decimal} value - The price to round.
     * @param {number|Decimal} minimumTick - The minimum tick size (see {@link UnitCode#getMinimumTick})
     * @param {boolean=} roundToZero - When true, the rounding will always go towards zero.
     * @returns {number}
     */
    roundToNearestTick(value, minimumTick, roundToZero) {
      argumentIsValid(value, "value", (x) => number(x) || x instanceof Decimal, "must be a number primitive or a Decimal instance");
      argumentIsValid(minimumTick, "minimumTick", (x) => number(x) || x instanceof Decimal, "must be a number primitive or a Decimal instance");
      argumentIsOptional(roundToZero, "roundToZero", Boolean);
      let valueToUse;
      if (value instanceof Decimal) {
        valueToUse = value;
      } else {
        valueToUse = new Decimal(value);
      }
      let ticks = valueToUse.divide(minimumTick);
      let remainder = valueToUse.mod(minimumTick);
      if (!remainder.getIsZero()) {
        ticks = ticks.round(0, boolean(roundToZero) && roundToZero ? Decimal.ROUNDING_MODE.DOWN : Decimal.ROUNDING_MODE.NORMAL);
      }
      return ticks.multiply(minimumTick).toFloat();
    }
    /**
     * @returns {string}
     */
    toString() {
      return `[UnitCode (code=${this.code})]`;
    }
    /**
     * Converts a unit code character into a {@link UnitCode} enumeration item.
     *
     * @public
     * @static
     * @param {string} code
     * @returns {UnitCode|null}
     */
    static parse(code) {
      return Enum.fromCode(_UnitCode, code);
    }
    /**
     * Converts a numeric "base" code into a {@link UnitCode} item.
     *
     * @public
     * @static
     * @param {number} code
     * @returns {UnitCode|null}
     */
    static fromBaseCode(code) {
      return Enum.getItems(_UnitCode).find((x) => x.baseCode === code) || null;
    }
  };
  var TWO = new UnitCode("2", -1, 3, true, 8, 1);
  var THREE = new UnitCode("3", -2, 4, true, 16, 2);
  var FOUR = new UnitCode("4", -3, 5, true, 32, 2);
  var FIVE = new UnitCode("5", -4, 6, true, 64, 2, 320, 3);
  var SIX = new UnitCode("6", -5, 7, true, 128, 3, 320, 3);
  var SEVEN = new UnitCode("7", -6, 8, true, 256, 3, 320, 3);
  var EIGHT = new UnitCode("8", 0, 0, false);
  var NINE = new UnitCode("9", 1, 1, false);
  var A = new UnitCode("A", 2, 2, false);
  var B = new UnitCode("B", 3, 3, false);
  var C = new UnitCode("C", 4, 4, false);
  var D = new UnitCode("D", 5, 5, false);
  var E = new UnitCode("E", 6, 6, false);
  var F = new UnitCode("F", 7, 7, false);

  // convert/unitCodeToBaseCode.js
  function convertUnitCodeToBaseCode(unitCode) {
    if (!string(unitCode) || unitCode.length !== 1) {
      return 0;
    }
    const unitCodeItem = UnitCode.parse(unitCode);
    return unitCodeItem === null ? 0 : unitCodeItem.baseCode;
  }

  // test/specs/convert/unitCodeToBaseCodeSpec.js
  describe("When converting a unitCode to a baseCode", () => {
    it('"2" should translate to -1', () => {
      expect(convertUnitCodeToBaseCode("2")).toEqual(-1);
    });
    it('"3" should translate to -2', () => {
      expect(convertUnitCodeToBaseCode("3")).toEqual(-2);
    });
    it('"4" should translate to -3', () => {
      expect(convertUnitCodeToBaseCode("4")).toEqual(-3);
    });
    it('"5" should translate to -4', () => {
      expect(convertUnitCodeToBaseCode("5")).toEqual(-4);
    });
    it('"6" should translate to -5', () => {
      expect(convertUnitCodeToBaseCode("6")).toEqual(-5);
    });
    it('"7" should translate to -6', () => {
      expect(convertUnitCodeToBaseCode("7")).toEqual(-6);
    });
    it('"8" should translate to 0', () => {
      expect(convertUnitCodeToBaseCode("8")).toEqual(0);
    });
    it('"9" should translate to 1', () => {
      expect(convertUnitCodeToBaseCode("9")).toEqual(1);
    });
    it('"A" should translate to 1', () => {
      expect(convertUnitCodeToBaseCode("A")).toEqual(2);
    });
    it('"B" should translate to 3', () => {
      expect(convertUnitCodeToBaseCode("B")).toEqual(3);
    });
    it('"C" should translate to 4', () => {
      expect(convertUnitCodeToBaseCode("C")).toEqual(4);
    });
    it('"D" should translate to 5', () => {
      expect(convertUnitCodeToBaseCode("D")).toEqual(5);
    });
    it('"E" should translate to 6', () => {
      expect(convertUnitCodeToBaseCode("E")).toEqual(6);
    });
    it('"F" should translate to 6', () => {
      expect(convertUnitCodeToBaseCode("F")).toEqual(7);
    });
    it("2 should translate to ", () => {
      expect(convertUnitCodeToBaseCode(2)).toEqual(0);
    });
    it("A null value should translate to 0", () => {
      expect(convertUnitCodeToBaseCode(null)).toEqual(0);
    });
    it("An undefined value should translate to 0", () => {
      expect(convertUnitCodeToBaseCode(void 0)).toEqual(0);
    });
  });

  // data/AssetClass.js
  var AssetClass = class _AssetClass extends Enum {
    #id;
    /**
     * @param {string} code
     * @param {string} description
     * @param {number} id
     */
    constructor(code, description, id) {
      super(code, description);
      this.#id = id;
    }
    /**
     * A unique numeric identifier assigned by Barchart.
     *
     * @public
     * @returns {number}
     */
    get id() {
      return this.#id;
    }
    /**
     * @returns {number}
     */
    toJSON() {
      return this.#id;
    }
    /**
     * Converts a string-based identifier into an enumeration item.
     *
     * @public
     * @static
     * @param {string} code
     * @returns {AssetClass|null}
     */
    static parse(code) {
      return Enum.fromCode(_AssetClass, code);
    }
    /**
     * Converts a numeric identifier into an enumeration item.
     *
     * @public
     * @static
     * @param {number} id
     * @returns {AssetClass|null}
     */
    static fromId(id) {
      return Enum.getItems(_AssetClass).find((x) => x.id === id) || null;
    }
    /**
     * A stock.
     *
     * @public
     * @static
     * @returns {AssetClass}
     */
    static get STOCK() {
      return STOCK;
    }
    /**
     * A stock option.
     *
     * @public
     * @static
     * @returns {AssetClass}
     */
    static get STOCK_OPTION() {
      return STOCK_OPTION;
    }
    /**
     * A future.
     *
     * @public
     * @static
     * @returns {AssetClass}
     */
    static get FUTURE() {
      return FUTURE;
    }
    /**
     * A future option.
     *
     * @public
     * @static
     * @returns {AssetClass}
     */
    static get FUTURE_OPTION() {
      return FUTURE_OPTION;
    }
    /**
     * A foreign exchange instrument.
     *
     * @public
     * @static
     * @returns {AssetClass}
     */
    static get FOREX() {
      return FOREX;
    }
    /**
     * A cmdtyStats instrument.
     *
     * @public
     * @static
     * @returns {AssetClass}
     */
    static get CMDTY_STATS() {
      return CMDTY_STATS;
    }
    /**
     * @returns {string}
     */
    toString() {
      return `[AssetClass (id=${this.id}, code=${this.code})]`;
    }
  };
  var STOCK = new AssetClass("STK", "U.S. Equity", 1);
  var STOCK_OPTION = new AssetClass("STKOPT", "Equity Option", 34);
  var FUTURE = new AssetClass("FUT", "Future", 2);
  var FUTURE_OPTION = new AssetClass("FUTOPT", "Future Option", 12);
  var FOREX = new AssetClass("FOREX", "FOREX", 10);
  var CMDTY_STATS = new AssetClass("CMDTY", "cmdtyStats", 24);

  // test/specs/data/AssetClassSpec.js
  describe("AssetClass", () => {
    it("exposes the stock asset class", () => {
      expect(AssetClass.STOCK.code).toEqual("STK");
    });
    it("exposes the stock option asset class", () => {
      expect(AssetClass.STOCK_OPTION.code).toEqual("STKOPT");
    });
    it("exposes the future asset class", () => {
      expect(AssetClass.FUTURE.code).toEqual("FUT");
    });
    it("exposes the future option asset class", () => {
      expect(AssetClass.FUTURE_OPTION.code).toEqual("FUTOPT");
    });
    it("exposes the foreign exchange asset class", () => {
      expect(AssetClass.FOREX.code).toEqual("FOREX");
    });
    it("exposes the cmdtyStats asset class", () => {
      expect(AssetClass.CMDTY_STATS.code).toEqual("CMDTY");
    });
    it("looks up an asset class by code", () => {
      expect(AssetClass.parse("FUT")).toBe(AssetClass.FUTURE);
    });
    it("looks up an asset class by id", () => {
      expect(AssetClass.fromId(12)).toBe(AssetClass.FUTURE_OPTION);
    });
    it("returns null for an unknown code", () => {
      expect(AssetClass.parse("UNKNOWN")).toBeNull();
    });
    it("returns null for an unknown id", () => {
      expect(AssetClass.fromId(-1)).toBeNull();
    });
    it("exposes the Barchart numeric id", () => {
      expect(AssetClass.STOCK_OPTION.id).toEqual(34);
    });
    it("serializes to the Barchart numeric id", () => {
      expect(AssetClass.STOCK_OPTION.toJSON()).toEqual(34);
    });
  });

  // test/specs/data/UnitCodeSpec.js
  describe("When parsing an invalid argument", () => {
    it('should parse "1" as null', () => {
      expect(UnitCode.parse("1")).toEqual(null);
    });
    it('should parse "G" as null', () => {
      expect(UnitCode.parse("G")).toEqual(null);
    });
    it('should parse "a" as null', () => {
      expect(UnitCode.parse("a")).toEqual(null);
    });
    it("should parse the number two as null", () => {
      expect(UnitCode.parse(2)).toEqual(null);
    });
    it('should parse the string "AA" as null', () => {
      expect(UnitCode.parse("AA")).toEqual(null);
    });
    it("should parse null as null", () => {
      expect(UnitCode.parse(null)).toEqual(null);
    });
  });
  describe("When parsing a valid character as a unit code", () => {
    describe('When parsing "2"', () => {
      let unitCode;
      beforeEach(() => {
        unitCode = UnitCode.parse("2");
      });
      it('should have a code of "2"', () => {
        expect(unitCode.code).toEqual("2");
      });
      it('should have a "unit" code of "2"', () => {
        expect(unitCode.unitCode).toEqual("2");
      });
      it('should have a "base" code of -1', () => {
        expect(unitCode.baseCode).toEqual(-1);
      });
      it('should be the same instance as resolving "base" code -1', () => {
        expect(UnitCode.fromBaseCode(-1)).toBe(unitCode);
      });
      it("should use three decimal places", () => {
        expect(unitCode.decimalDigits).toEqual(3);
      });
      it("does support fraction notation", () => {
        expect(unitCode.supportsFractions).toEqual(true);
      });
      it("the fraction factor should be 8", () => {
        expect(unitCode.fractionFactor).toEqual(8);
      });
      it('the "special" fraction factor should be 8', () => {
        expect(unitCode.fractionFactorSpecial).toEqual(8);
      });
      it("getting the fraction factor should return 8", () => {
        expect(unitCode.getFractionFactor()).toEqual(8);
      });
      it('getting the "special" fraction factor should return 8', () => {
        expect(unitCode.getFractionFactor(true)).toEqual(8);
      });
      it("the fraction digits should be 1", () => {
        expect(unitCode.fractionDigits).toEqual(1);
      });
      it('the "special" fraction digits should be 1', () => {
        expect(unitCode.fractionDigitsSpecial).toEqual(1);
      });
      it("getting the fraction digits should return 1", () => {
        expect(unitCode.getFractionDigits()).toEqual(1);
      });
      it('getting the "special" fraction digits should return 1', () => {
        expect(unitCode.getFractionDigits(true)).toEqual(1);
      });
    });
    describe('When parsing "3"', () => {
      let unitCode;
      beforeEach(() => {
        unitCode = UnitCode.parse("3");
      });
      it('should have a code of "3"', () => {
        expect(unitCode.code).toEqual("3");
      });
      it('should have a "unit" code of "3"', () => {
        expect(unitCode.unitCode).toEqual("3");
      });
      it('should have a "base" code of -2', () => {
        expect(unitCode.baseCode).toEqual(-2);
      });
      it('should be the same instance as resolving "base" code -2', () => {
        expect(UnitCode.fromBaseCode(-2)).toBe(unitCode);
      });
      it("should use four decimal places", () => {
        expect(unitCode.decimalDigits).toEqual(4);
      });
      it("does support fraction notation", () => {
        expect(unitCode.supportsFractions).toEqual(true);
      });
      it("the fraction factor should be 16", () => {
        expect(unitCode.fractionFactor).toEqual(16);
      });
      it('the "special" fraction factor should be 16', () => {
        expect(unitCode.fractionFactorSpecial).toEqual(16);
      });
      it("getting the fraction factor should return 16", () => {
        expect(unitCode.getFractionFactor()).toEqual(16);
      });
      it('getting the "special" fraction factor should return 16', () => {
        expect(unitCode.getFractionFactor(true)).toEqual(16);
      });
      it("the fraction digits should be 2", () => {
        expect(unitCode.fractionDigits).toEqual(2);
      });
      it('the "special" fraction digits should be 2', () => {
        expect(unitCode.fractionDigitsSpecial).toEqual(2);
      });
      it("getting the fraction digits should return 2", () => {
        expect(unitCode.getFractionDigits()).toEqual(2);
      });
      it('getting the "special" fraction digits should return 2', () => {
        expect(unitCode.getFractionDigits(true)).toEqual(2);
      });
    });
    describe('When parsing "4"', () => {
      let unitCode;
      beforeEach(() => {
        unitCode = UnitCode.parse("4");
      });
      it('should have a code of "4"', () => {
        expect(unitCode.code).toEqual("4");
      });
      it('should have a "unit" code of "4"', () => {
        expect(unitCode.unitCode).toEqual("4");
      });
      it('should have a "base" code of -3', () => {
        expect(unitCode.baseCode).toEqual(-3);
      });
      it('should be the same instance as resolving "base" code -3', () => {
        expect(UnitCode.fromBaseCode(-3)).toBe(unitCode);
      });
      it("should use five decimal places", () => {
        expect(unitCode.decimalDigits).toEqual(5);
      });
      it("does support fraction notation", () => {
        expect(unitCode.supportsFractions).toEqual(true);
      });
      it("the fraction factor should be 32", () => {
        expect(unitCode.fractionFactor).toEqual(32);
      });
      it('the "special" fraction factor should be 32', () => {
        expect(unitCode.fractionFactorSpecial).toEqual(32);
      });
      it("getting the fraction factor should return 32", () => {
        expect(unitCode.getFractionFactor()).toEqual(32);
      });
      it('getting the "special" fraction factor should return 32', () => {
        expect(unitCode.getFractionFactor(true)).toEqual(32);
      });
      it("the fraction digits should be 2", () => {
        expect(unitCode.fractionDigits).toEqual(2);
      });
      it('the "special" fraction digits should be 2', () => {
        expect(unitCode.fractionDigitsSpecial).toEqual(2);
      });
      it("getting the fraction digits should return 2", () => {
        expect(unitCode.getFractionDigits()).toEqual(2);
      });
      it('getting the "special" fraction digits should return 2', () => {
        expect(unitCode.getFractionDigits(true)).toEqual(2);
      });
    });
    describe('When parsing "5"', () => {
      let unitCode;
      beforeEach(() => {
        unitCode = UnitCode.parse("5");
      });
      it('should have a code of "5"', () => {
        expect(unitCode.code).toEqual("5");
      });
      it('should have a "unit" code of "5"', () => {
        expect(unitCode.unitCode).toEqual("5");
      });
      it('should have a "base" code of -4', () => {
        expect(unitCode.baseCode).toEqual(-4);
      });
      it('should be the same instance as resolving "base" code -4', () => {
        expect(UnitCode.fromBaseCode(-4)).toBe(unitCode);
      });
      it("should use six decimal places", () => {
        expect(unitCode.decimalDigits).toEqual(6);
      });
      it("does support fraction notation", () => {
        expect(unitCode.supportsFractions).toEqual(true);
      });
      it("the fraction factor should be 64", () => {
        expect(unitCode.fractionFactor).toEqual(64);
      });
      it('the "special" fraction factor should be 320', () => {
        expect(unitCode.fractionFactorSpecial).toEqual(320);
      });
      it("getting the fraction factor should return 64", () => {
        expect(unitCode.getFractionFactor()).toEqual(64);
      });
      it('getting the "special" fraction factor should return 320', () => {
        expect(unitCode.getFractionFactor(true)).toEqual(320);
      });
      it("the fraction digits should be 2", () => {
        expect(unitCode.fractionDigits).toEqual(2);
      });
      it('the "special" fraction digits should be 3', () => {
        expect(unitCode.fractionDigitsSpecial).toEqual(3);
      });
      it("getting the fraction digits should return 2", () => {
        expect(unitCode.getFractionDigits()).toEqual(2);
      });
      it('getting the "special" fraction digits should return 3', () => {
        expect(unitCode.getFractionDigits(true)).toEqual(3);
      });
    });
    describe('When parsing "6"', () => {
      let unitCode;
      beforeEach(() => {
        unitCode = UnitCode.parse("6");
      });
      it('should have a code of "6"', () => {
        expect(unitCode.code).toEqual("6");
      });
      it('should have a "unit" code of "6"', () => {
        expect(unitCode.unitCode).toEqual("6");
      });
      it('should have a "base" code of -5', () => {
        expect(unitCode.baseCode).toEqual(-5);
      });
      it('should be the same instance as resolving "base" code -5', () => {
        expect(UnitCode.fromBaseCode(-5)).toBe(unitCode);
      });
      it("should use seven decimal places", () => {
        expect(unitCode.decimalDigits).toEqual(7);
      });
      it("does support fraction notation", () => {
        expect(unitCode.supportsFractions).toEqual(true);
      });
      it("the fraction factor should be 128", () => {
        expect(unitCode.fractionFactor).toEqual(128);
      });
      it('the "special" fraction factor should be 320', () => {
        expect(unitCode.fractionFactorSpecial).toEqual(320);
      });
      it("getting the fraction factor should return 128", () => {
        expect(unitCode.getFractionFactor()).toEqual(128);
      });
      it('getting the "special" fraction factor should return 320', () => {
        expect(unitCode.getFractionFactor(true)).toEqual(320);
      });
      it("the fraction digits should be 3", () => {
        expect(unitCode.fractionDigits).toEqual(3);
      });
      it('the "special" fraction digits should be 3', () => {
        expect(unitCode.fractionDigitsSpecial).toEqual(3);
      });
      it("getting the fraction digits should return 3", () => {
        expect(unitCode.getFractionDigits()).toEqual(3);
      });
      it('getting the "special" fraction digits should return 3', () => {
        expect(unitCode.getFractionDigits(true)).toEqual(3);
      });
    });
    describe('When parsing "7"', () => {
      let unitCode;
      beforeEach(() => {
        unitCode = UnitCode.parse("7");
      });
      it('should have a code of "7"', () => {
        expect(unitCode.code).toEqual("7");
      });
      it('should have a "unit" code of "7"', () => {
        expect(unitCode.unitCode).toEqual("7");
      });
      it('should have a "base" code of -6', () => {
        expect(unitCode.baseCode).toEqual(-6);
      });
      it('should be the same instance as resolving "base" code -6', () => {
        expect(UnitCode.fromBaseCode(-6)).toBe(unitCode);
      });
      it("should use eight decimal places", () => {
        expect(unitCode.decimalDigits).toEqual(8);
      });
      it("does support fraction notation", () => {
        expect(unitCode.supportsFractions).toEqual(true);
      });
      it("the fraction factor should be 256", () => {
        expect(unitCode.fractionFactor).toEqual(256);
      });
      it('the "special" fraction factor should be 320', () => {
        expect(unitCode.fractionFactorSpecial).toEqual(320);
      });
      it("getting the fraction factor should return 256", () => {
        expect(unitCode.getFractionFactor()).toEqual(256);
      });
      it('getting the "special" fraction factor should return 320', () => {
        expect(unitCode.getFractionFactor(true)).toEqual(320);
      });
      it("the fraction digits should be 3", () => {
        expect(unitCode.fractionDigits).toEqual(3);
      });
      it('the "special" fraction digits should be 3', () => {
        expect(unitCode.fractionDigitsSpecial).toEqual(3);
      });
      it("getting the fraction digits should return 3", () => {
        expect(unitCode.getFractionDigits()).toEqual(3);
      });
      it('getting the "special" fraction digits should return 3', () => {
        expect(unitCode.getFractionDigits(true)).toEqual(3);
      });
    });
    describe('When parsing "8"', () => {
      let unitCode;
      beforeEach(() => {
        unitCode = UnitCode.parse("8");
      });
      it('should have a code of "8"', () => {
        expect(unitCode.code).toEqual("8");
      });
      it('should have a "unit" code of "8"', () => {
        expect(unitCode.unitCode).toEqual("8");
      });
      it('should have a "base" code of 0', () => {
        expect(unitCode.baseCode).toEqual(0);
      });
      it('should be the same instance as resolving "base" code 0', () => {
        expect(UnitCode.fromBaseCode(0)).toBe(unitCode);
      });
      it("should use zero decimal places", () => {
        expect(unitCode.decimalDigits).toEqual(0);
      });
      it("does not support fraction notation", () => {
        expect(unitCode.supportsFractions).toEqual(false);
      });
      it("the fraction factor should be undefined", () => {
        expect(unitCode.fractionFactor).toEqual(void 0);
      });
      it('the "special" fraction factor should be undefined', () => {
        expect(unitCode.fractionFactorSpecial).toEqual(void 0);
      });
      it("getting the fraction factor should return undefined", () => {
        expect(unitCode.getFractionFactor()).toEqual(void 0);
      });
      it('getting the "special" fraction factor should return undefined', () => {
        expect(unitCode.getFractionFactor(true)).toEqual(void 0);
      });
      it("the fraction digits should be undefined", () => {
        expect(unitCode.fractionDigits).toEqual(void 0);
      });
      it('the "special" fraction digits should be undefined', () => {
        expect(unitCode.fractionDigitsSpecial).toEqual(void 0);
      });
      it("getting the fraction digits should return undefined", () => {
        expect(unitCode.getFractionDigits()).toEqual(void 0);
      });
      it('getting the "special" fraction digits should return undefined', () => {
        expect(unitCode.getFractionDigits(true)).toEqual(void 0);
      });
    });
    describe('When parsing "9"', () => {
      let unitCode;
      beforeEach(() => {
        unitCode = UnitCode.parse("9");
      });
      it('should have a code of "9"', () => {
        expect(unitCode.code).toEqual("9");
      });
      it('should have a "unit" code of "9"', () => {
        expect(unitCode.unitCode).toEqual("9");
      });
      it('should have a "base" code of 1', () => {
        expect(unitCode.baseCode).toEqual(1);
      });
      it('should be the same instance as resolving "base" code 1', () => {
        expect(UnitCode.fromBaseCode(1)).toBe(unitCode);
      });
      it("should use one decimal places", () => {
        expect(unitCode.decimalDigits).toEqual(1);
      });
      it("does not support fraction notation", () => {
        expect(unitCode.supportsFractions).toEqual(false);
      });
      it("the fraction factor should be undefined", () => {
        expect(unitCode.fractionFactor).toEqual(void 0);
      });
      it('the "special" fraction factor should be undefined', () => {
        expect(unitCode.fractionFactorSpecial).toEqual(void 0);
      });
      it("getting the fraction factor should return undefined", () => {
        expect(unitCode.getFractionFactor()).toEqual(void 0);
      });
      it('getting the "special" fraction factor should return undefined', () => {
        expect(unitCode.getFractionFactor(true)).toEqual(void 0);
      });
      it("the fraction digits should be undefined", () => {
        expect(unitCode.fractionDigits).toEqual(void 0);
      });
      it('the "special" fraction digits should be undefined', () => {
        expect(unitCode.fractionDigitsSpecial).toEqual(void 0);
      });
      it("getting the fraction digits should return undefined", () => {
        expect(unitCode.getFractionDigits()).toEqual(void 0);
      });
      it('getting the "special" fraction digits should return undefined', () => {
        expect(unitCode.getFractionDigits(true)).toEqual(void 0);
      });
    });
    describe('When parsing "A"', () => {
      let unitCode;
      beforeEach(() => {
        unitCode = UnitCode.parse("A");
      });
      it('should have a code of "A"', () => {
        expect(unitCode.code).toEqual("A");
      });
      it('should have a "unit" code of "A"', () => {
        expect(unitCode.unitCode).toEqual("A");
      });
      it('should have a "base" code of 2', () => {
        expect(unitCode.baseCode).toEqual(2);
      });
      it('should be the same instance as resolving "base" code 2', () => {
        expect(UnitCode.fromBaseCode(2)).toBe(unitCode);
      });
      it("should use two decimal places", () => {
        expect(unitCode.decimalDigits).toEqual(2);
      });
      it("does not support fraction notation", () => {
        expect(unitCode.supportsFractions).toEqual(false);
      });
      it("the fraction factor should be undefined", () => {
        expect(unitCode.fractionFactor).toEqual(void 0);
      });
      it('the "special" fraction factor should be undefined', () => {
        expect(unitCode.fractionFactorSpecial).toEqual(void 0);
      });
      it("getting the fraction factor should return undefined", () => {
        expect(unitCode.getFractionFactor()).toEqual(void 0);
      });
      it('getting the "special" fraction factor should return undefined', () => {
        expect(unitCode.getFractionFactor(true)).toEqual(void 0);
      });
      it("the fraction digits should be undefined", () => {
        expect(unitCode.fractionDigits).toEqual(void 0);
      });
      it('the "special" fraction digits should be undefined', () => {
        expect(unitCode.fractionDigitsSpecial).toEqual(void 0);
      });
      it("getting the fraction digits should return undefined", () => {
        expect(unitCode.getFractionDigits()).toEqual(void 0);
      });
      it('getting the "special" fraction digits should return undefined', () => {
        expect(unitCode.getFractionDigits(true)).toEqual(void 0);
      });
    });
    describe('When parsing "B"', () => {
      let unitCode;
      beforeEach(() => {
        unitCode = UnitCode.parse("B");
      });
      it('should have a code of "B"', () => {
        expect(unitCode.code).toEqual("B");
      });
      it('should have a "unit" code of "B"', () => {
        expect(unitCode.unitCode).toEqual("B");
      });
      it('should have a "base" code of 3', () => {
        expect(unitCode.baseCode).toEqual(3);
      });
      it('should be the same instance as resolving "base" code 3', () => {
        expect(UnitCode.fromBaseCode(3)).toBe(unitCode);
      });
      it("should use three decimal places", () => {
        expect(unitCode.decimalDigits).toEqual(3);
      });
      it("does not support fraction notation", () => {
        expect(unitCode.supportsFractions).toEqual(false);
      });
      it("the fraction factor should be undefined", () => {
        expect(unitCode.fractionFactor).toEqual(void 0);
      });
      it('the "special" fraction factor should be undefined', () => {
        expect(unitCode.fractionFactorSpecial).toEqual(void 0);
      });
      it("getting the fraction factor should return undefined", () => {
        expect(unitCode.getFractionFactor()).toEqual(void 0);
      });
      it('getting the "special" fraction factor should return undefined', () => {
        expect(unitCode.getFractionFactor(true)).toEqual(void 0);
      });
      it("the fraction digits should be undefined", () => {
        expect(unitCode.fractionDigits).toEqual(void 0);
      });
      it('the "special" fraction digits should be undefined', () => {
        expect(unitCode.fractionDigitsSpecial).toEqual(void 0);
      });
      it("getting the fraction digits should return undefined", () => {
        expect(unitCode.getFractionDigits()).toEqual(void 0);
      });
      it('getting the "special" fraction digits should return undefined', () => {
        expect(unitCode.getFractionDigits(true)).toEqual(void 0);
      });
    });
    describe('When parsing "C"', () => {
      let unitCode;
      beforeEach(() => {
        unitCode = UnitCode.parse("C");
      });
      it('should have a code of "C"', () => {
        expect(unitCode.code).toEqual("C");
      });
      it('should have a "unit" code of "C"', () => {
        expect(unitCode.unitCode).toEqual("C");
      });
      it('should have a "base" code of 4', () => {
        expect(unitCode.baseCode).toEqual(4);
      });
      it('should be the same instance as resolving "base" code 4', () => {
        expect(UnitCode.fromBaseCode(4)).toBe(unitCode);
      });
      it("should use four decimal places", () => {
        expect(unitCode.decimalDigits).toEqual(4);
      });
      it("does not support fraction notation", () => {
        expect(unitCode.supportsFractions).toEqual(false);
      });
      it("the fraction factor should be undefined", () => {
        expect(unitCode.fractionFactor).toEqual(void 0);
      });
      it('the "special" fraction factor should be undefined', () => {
        expect(unitCode.fractionFactorSpecial).toEqual(void 0);
      });
      it("getting the fraction factor should return undefined", () => {
        expect(unitCode.getFractionFactor()).toEqual(void 0);
      });
      it('getting the "special" fraction factor should return undefined', () => {
        expect(unitCode.getFractionFactor(true)).toEqual(void 0);
      });
      it("the fraction digits should be undefined", () => {
        expect(unitCode.fractionDigits).toEqual(void 0);
      });
      it('the "special" fraction digits should be undefined', () => {
        expect(unitCode.fractionDigitsSpecial).toEqual(void 0);
      });
      it("getting the fraction digits should return undefined", () => {
        expect(unitCode.getFractionDigits()).toEqual(void 0);
      });
      it('getting the "special" fraction digits should return undefined', () => {
        expect(unitCode.getFractionDigits(true)).toEqual(void 0);
      });
    });
    describe('When parsing "D"', () => {
      let unitCode;
      beforeEach(() => {
        unitCode = UnitCode.parse("D");
      });
      it('should have a code of "D"', () => {
        expect(unitCode.code).toEqual("D");
      });
      it('should have a "unit" code of "D"', () => {
        expect(unitCode.unitCode).toEqual("D");
      });
      it('should have a "base" code of 5', () => {
        expect(unitCode.baseCode).toEqual(5);
      });
      it('should be the same instance as resolving "base" code 5', () => {
        expect(UnitCode.fromBaseCode(5)).toBe(unitCode);
      });
      it("should use five decimal places", () => {
        expect(unitCode.decimalDigits).toEqual(5);
      });
      it("does not support fraction notation", () => {
        expect(unitCode.supportsFractions).toEqual(false);
      });
      it("the fraction factor should be undefined", () => {
        expect(unitCode.fractionFactor).toEqual(void 0);
      });
      it('the "special" fraction factor should be undefined', () => {
        expect(unitCode.fractionFactorSpecial).toEqual(void 0);
      });
      it("getting the fraction factor should return undefined", () => {
        expect(unitCode.getFractionFactor()).toEqual(void 0);
      });
      it('getting the "special" fraction factor should return undefined', () => {
        expect(unitCode.getFractionFactor(true)).toEqual(void 0);
      });
      it("the fraction digits should be undefined", () => {
        expect(unitCode.fractionDigits).toEqual(void 0);
      });
      it('the "special" fraction digits should be undefined', () => {
        expect(unitCode.fractionDigitsSpecial).toEqual(void 0);
      });
      it("getting the fraction digits should return undefined", () => {
        expect(unitCode.getFractionDigits()).toEqual(void 0);
      });
      it('getting the "special" fraction digits should return undefined', () => {
        expect(unitCode.getFractionDigits(true)).toEqual(void 0);
      });
    });
    describe('When parsing "E"', () => {
      let unitCode;
      beforeEach(() => {
        unitCode = UnitCode.parse("E");
      });
      it('should have a code of "E"', () => {
        expect(unitCode.code).toEqual("E");
      });
      it('should have a "unit" code of "E"', () => {
        expect(unitCode.unitCode).toEqual("E");
      });
      it('should have a "base" code of 6', () => {
        expect(unitCode.baseCode).toEqual(6);
      });
      it('should be the same instance as resolving "base" code 6', () => {
        expect(UnitCode.fromBaseCode(6)).toBe(unitCode);
      });
      it("should use six decimal places", () => {
        expect(unitCode.decimalDigits).toEqual(6);
      });
      it("does not support fraction notation", () => {
        expect(unitCode.supportsFractions).toEqual(false);
      });
      it("the fraction factor should be undefined", () => {
        expect(unitCode.fractionFactor).toEqual(void 0);
      });
      it('the "special" fraction factor should be undefined', () => {
        expect(unitCode.fractionFactorSpecial).toEqual(void 0);
      });
      it("getting the fraction factor should return undefined", () => {
        expect(unitCode.getFractionFactor()).toEqual(void 0);
      });
      it('getting the "special" fraction factor should return undefined', () => {
        expect(unitCode.getFractionFactor(true)).toEqual(void 0);
      });
      it("the fraction digits should be undefined", () => {
        expect(unitCode.fractionDigits).toEqual(void 0);
      });
      it('the "special" fraction digits should be undefined', () => {
        expect(unitCode.fractionDigitsSpecial).toEqual(void 0);
      });
      it("getting the fraction digits should return undefined", () => {
        expect(unitCode.getFractionDigits()).toEqual(void 0);
      });
      it('getting the "special" fraction digits should return undefined', () => {
        expect(unitCode.getFractionDigits(true)).toEqual(void 0);
      });
    });
    describe('When parsing "F"', () => {
      let unitCode;
      beforeEach(() => {
        unitCode = UnitCode.parse("F");
      });
      it('should have a code of "F"', () => {
        expect(unitCode.code).toEqual("F");
      });
      it('should have a "unit" code of "F"', () => {
        expect(unitCode.unitCode).toEqual("F");
      });
      it('should have a "base" code of 7', () => {
        expect(unitCode.baseCode).toEqual(7);
      });
      it("should use seven decimal places", () => {
        expect(unitCode.decimalDigits).toEqual(7);
      });
      it("does not support fraction notation", () => {
        expect(unitCode.supportsFractions).toEqual(false);
      });
      it("the fraction factor should be undefined", () => {
        expect(unitCode.fractionFactor).toEqual(void 0);
      });
      it('the "special" fraction factor should be undefined', () => {
        expect(unitCode.fractionFactorSpecial).toEqual(void 0);
      });
      it("getting the fraction factor should return undefined", () => {
        expect(unitCode.getFractionFactor()).toEqual(void 0);
      });
      it('getting the "special" fraction factor should return undefined', () => {
        expect(unitCode.getFractionFactor(true)).toEqual(void 0);
      });
      it("the fraction digits should be undefined", () => {
        expect(unitCode.fractionDigits).toEqual(void 0);
      });
      it('the "special" fraction digits should be undefined', () => {
        expect(unitCode.fractionDigitsSpecial).toEqual(void 0);
      });
      it("getting the fraction digits should return undefined", () => {
        expect(unitCode.getFractionDigits()).toEqual(void 0);
      });
      it('getting the "special" fraction digits should return undefined', () => {
        expect(unitCode.getFractionDigits(true)).toEqual(void 0);
      });
    });
  });
  describe("When calculating minimum ticks and minimum tick values", () => {
    describe('For unit code "2" and with a tickIncrement of 2 and a pointValue of 50 (e.g. corn)', () => {
      let uc;
      beforeEach(() => {
        uc = UnitCode.parse("2");
      });
      it("The minimum tick should be 0.25", () => {
        expect(uc.getMinimumTick(2)).toEqual(0.25);
      });
      it("The minimum tick value should be 12.50", () => {
        expect(uc.getMinimumTickValue(2, 50)).toEqual(12.5);
      });
    });
    describe('For unit code "A" and with a tickIncrement of 25 and a pointValue of 50 (e.g. e-mini)', () => {
      let uc;
      beforeEach(() => {
        uc = UnitCode.parse("A");
      });
      it("The minimum tick should be 0.25", () => {
        expect(uc.getMinimumTick(25)).toEqual(0.25);
      });
      it("The minimum tick value should be 12.50", () => {
        expect(uc.getMinimumTickValue(25, 50)).toEqual(12.5);
      });
    });
    describe('For unit code "A" and with a tickIncrement of 1 and a pointValue of 1000 (e.g. crude)', () => {
      let uc;
      beforeEach(() => {
        uc = UnitCode.parse("A");
      });
      it("The minimum tick should be 0.01", () => {
        expect(uc.getMinimumTick(1)).toEqual(0.01);
      });
      it("The minimum tick value should be 10", () => {
        expect(uc.getMinimumTickValue(1, 1e3)).toEqual(10);
      });
    });
    describe('For unit code "9" and with a tickIncrement of 1 and a pointValue of 100 (e.g. gold)', () => {
      let uc;
      beforeEach(() => {
        uc = UnitCode.parse("9");
      });
      it("The minimum tick should be 0.1", () => {
        expect(uc.getMinimumTick(1)).toEqual(0.1);
      });
      it("The minimum tick value should be 10", () => {
        expect(uc.getMinimumTickValue(1, 100)).toEqual(10);
      });
    });
    describe('For unit code "5" and with a tickIncrement of 1 and a pointValue of 1,000 (e.g. t-notes)', () => {
      let uc;
      beforeEach(() => {
        uc = UnitCode.parse("5");
      });
      it("The minimum tick should be 0.015625", () => {
        expect(uc.getMinimumTick(1)).toEqual(0.015625);
      });
      it("The minimum tick value should be 15.625", () => {
        expect(uc.getMinimumTickValue(1, 1e3)).toEqual(15.625);
      });
    });
    describe('For unit code "E" and with a tickIncrement of 10 and a pointValue of 500,000 (e.g. mexican pesos)', () => {
      let uc;
      beforeEach(() => {
        uc = UnitCode.parse("E");
      });
      it("The minimum tick should be 0.015625", () => {
        expect(uc.getMinimumTick(10)).toEqual(1e-5);
      });
      it("The minimum tick value should be 15.625", () => {
        expect(uc.getMinimumTickValue(10, 5e5)).toEqual(5);
      });
    });
  });
  describe("When rounding a value to the nearest tick value", () => {
    describe('For unit code "2" and with a tickIncrement of 2 (e.g. corn)', () => {
      let uc;
      let mt;
      beforeEach(() => {
        uc = UnitCode.parse("2");
        mt = uc.getMinimumTick(2);
      });
      it("A value of 0 should be rounded to 0", () => {
        expect(uc.roundToNearestTick(0, mt)).toEqual(0);
      });
      it("A value of 488.5 should be rounded to 488.5", () => {
        expect(uc.roundToNearestTick(488.5, mt)).toEqual(488.5);
      });
      it("A value of 488.51 should be rounded to 488.5", () => {
        expect(uc.roundToNearestTick(488.51, mt)).toEqual(488.5);
      });
      it("A value of 488.74 should be rounded to 488.75", () => {
        expect(uc.roundToNearestTick(488.74, mt)).toEqual(488.75);
      });
      it("A value of 488.625 should be rounded to 488.75", () => {
        expect(uc.roundToNearestTick(488.625, mt)).toEqual(488.75);
      });
      it('A value of 488.625 should be rounded to 488.5 (when using "roundDown" option)', () => {
        expect(uc.roundToNearestTick(488.625, mt, true)).toEqual(488.5);
      });
    });
    describe('For unit code "A" and with a tickIncrement of 25 (e.g. e-mini)', () => {
      let uc;
      let mt;
      beforeEach(() => {
        uc = UnitCode.parse("A");
        mt = uc.getMinimumTick(25);
      });
      it("A value of 4455.5 should be rounded to 4455.5", () => {
        expect(uc.roundToNearestTick(4455.5, mt)).toEqual(4455.5);
      });
      it("A value of 4455.51 should be rounded to 4455.5", () => {
        expect(uc.roundToNearestTick(4455.51, mt)).toEqual(4455.5);
      });
      it("A value of 4455.74 should be rounded to 4455.75", () => {
        expect(uc.roundToNearestTick(4455.74, mt)).toEqual(4455.75);
      });
      it("A value of 4455.625 should be rounded to 4455.75", () => {
        expect(uc.roundToNearestTick(4455.625, mt)).toEqual(4455.75);
      });
      it('A value of 4455.625 should be rounded to 4455.5 (when using "roundDown" option)', () => {
        expect(uc.roundToNearestTick(4455.625, mt, true)).toEqual(4455.5);
      });
    });
    describe('For unit code "A" and with a tickIncrement of 1 (e.g. crude)', () => {
      let uc;
      let mt;
      beforeEach(() => {
        uc = UnitCode.parse("A");
        mt = uc.getMinimumTick(1);
      });
      it("A value of 87.30 should be rounded to 87.30", () => {
        expect(uc.roundToNearestTick(87.3, mt)).toEqual(87.3);
      });
      it("A value of 87.31 should be rounded to 87.31", () => {
        expect(uc.roundToNearestTick(87.31, mt)).toEqual(87.31);
      });
      it("A value of 87.312 should be rounded to 87.31", () => {
        expect(uc.roundToNearestTick(87.312, mt)).toEqual(87.31);
      });
      it("A value of 87.318 should be rounded to 87.32", () => {
        expect(uc.roundToNearestTick(87.318, mt)).toEqual(87.32);
      });
      it("A value of 87.325 should be rounded to 87.33", () => {
        expect(uc.roundToNearestTick(87.325, mt)).toEqual(87.33);
      });
      it('A value of 87.325 should be rounded to 87.32 (when using "roundDown" option)', () => {
        expect(uc.roundToNearestTick(87.325, mt, true)).toEqual(87.32);
      });
    });
    describe('For unit code "9" and with a tickIncrement of 1 (e.g. gold)', () => {
      let uc;
      let mt;
      beforeEach(() => {
        uc = UnitCode.parse("9");
        mt = uc.getMinimumTick(1);
      });
      it("A value of 1922.5 should be rounded to 1922.5", () => {
        expect(uc.roundToNearestTick(1922.5, mt)).toEqual(1922.5);
      });
      it("A value of 1922.6 should be rounded to 1922.6", () => {
        expect(uc.roundToNearestTick(1922.6, mt)).toEqual(1922.6);
      });
      it("A value of 1922.51 should be rounded to 1922.5", () => {
        expect(uc.roundToNearestTick(1922.51, mt)).toEqual(1922.5);
      });
      it("A value of 1922.59 should be rounded to 1922.6", () => {
        expect(uc.roundToNearestTick(1922.59, mt)).toEqual(1922.6);
      });
      it("A value of 1922.55 should be rounded to 1922.6", () => {
        expect(uc.roundToNearestTick(1922.55, mt)).toEqual(1922.6);
      });
      it('A value of 1922.55 should be rounded to 1922.5 (when using "roundDown" option)', () => {
        expect(uc.roundToNearestTick(1922.55, mt, true)).toEqual(1922.5);
      });
    });
    describe('For unit code "5" and with a tickIncrement of 1 (e.g. t-notes)', () => {
      let uc;
      let mt;
      beforeEach(() => {
        uc = UnitCode.parse("5");
        mt = uc.getMinimumTick(1);
      });
      it("A value of 110.328125 should be rounded to 110.328125", () => {
        expect(uc.roundToNearestTick(110.328125, mt)).toEqual(110.328125);
      });
      it("A value of 110.34375 should be rounded to 110.34375", () => {
        expect(uc.roundToNearestTick(110.34375, mt)).toEqual(110.34375);
      });
      it("A value of 110.328126 should be rounded to 110.328125", () => {
        expect(uc.roundToNearestTick(110.328126, mt)).toEqual(110.328125);
      });
      it("A value of 110.34374 should be rounded to 110.34375", () => {
        expect(uc.roundToNearestTick(110.34374, mt)).toEqual(110.34375);
      });
      it('A value of 110.34374 should be rounded to 110.328125 (when using "roundDown" option)', () => {
        expect(uc.roundToNearestTick(110.34374, mt, true)).toEqual(110.328125);
      });
    });
  });

  // data/monthCodes.js
  var monthMap = {};
  var numberMap = {};
  function addMonth(code, name, number2) {
    monthMap[code] = name;
    numberMap[code] = number2;
  }
  addMonth("F", "January", 1);
  addMonth("G", "February", 2);
  addMonth("H", "March", 3);
  addMonth("J", "April", 4);
  addMonth("K", "May", 5);
  addMonth("M", "June", 6);
  addMonth("N", "July", 7);
  addMonth("Q", "August", 8);
  addMonth("U", "September", 9);
  addMonth("V", "October", 10);
  addMonth("X", "November", 11);
  addMonth("Z", "December", 12);
  addMonth("Y", "Cash", 0);
  function getCodeToNameMap() {
    return Object.assign({}, monthMap);
  }
  function getCodeToNumberMap() {
    return Object.assign({}, numberMap);
  }

  // test/specs/data/monthCodesSpec.js
  describe("When looking up a month name by code", () => {
    let map;
    beforeEach(() => {
      map = getCodeToNameMap();
    });
    it('"F" should map to "January"', () => {
      expect(map.F).toEqual("January");
    });
    it('"G" should map to "February"', () => {
      expect(map.G).toEqual("February");
    });
    it('"H" should map to "March"', () => {
      expect(map.H).toEqual("March");
    });
    it('"J" should map to "April"', () => {
      expect(map.J).toEqual("April");
    });
    it('"K" should map to "May"', () => {
      expect(map.K).toEqual("May");
    });
    it('"M" should map to "June"', () => {
      expect(map.M).toEqual("June");
    });
    it('"N" should map to "July"', () => {
      expect(map.N).toEqual("July");
    });
    it('"Q" should map to "August"', () => {
      expect(map.Q).toEqual("August");
    });
    it('"U" should map to "September"', () => {
      expect(map.U).toEqual("September");
    });
    it('"V" should map to "October"', () => {
      expect(map.V).toEqual("October");
    });
    it('"X" should map to "November"', () => {
      expect(map.X).toEqual("November");
    });
    it('"Z" should map to "December"', () => {
      expect(map.Z).toEqual("December");
    });
  });
  describe("When looking up a month number by code", () => {
    let map;
    beforeEach(() => {
      map = getCodeToNumberMap();
    });
    it('"F" should map to 1', () => {
      expect(map.F).toEqual(1);
    });
    it('"G" should map to 2', () => {
      expect(map.G).toEqual(2);
    });
    it('"H" should map to 3', () => {
      expect(map.H).toEqual(3);
    });
    it('"J" should map to 4', () => {
      expect(map.J).toEqual(4);
    });
    it('"K" should map to 5', () => {
      expect(map.K).toEqual(5);
    });
    it('"M" should map to 6', () => {
      expect(map.M).toEqual(6);
    });
    it('"N" should map to 7', () => {
      expect(map.N).toEqual(7);
    });
    it('"Q" should map to 8', () => {
      expect(map.Q).toEqual(8);
    });
    it('"U" should map to 9', () => {
      expect(map.U).toEqual(9);
    });
    it('"V" should map to 10', () => {
      expect(map.V).toEqual(10);
    });
    it('"X" should map to 11', () => {
      expect(map.X).toEqual(11);
    });
    it('"Z" should map to 12', () => {
      expect(map.Z).toEqual(12);
    });
  });
  describe("Month lookup isolation", () => {
    it("returns copies so consumers cannot change shared month definitions", () => {
      getCodeToNumberMap().F = 99;
      getCodeToNameMap().Y = "Changed";
      expect(getCodeToNumberMap().F).toBe(1);
      expect(getCodeToNumberMap().Y).toBe(0);
      expect(getCodeToNameMap().Y).toBe("Cash");
    });
  });

  // ../common-js/lang/string.js
  var regex = {};
  regex.camel = {};
  regex.camel.violations = /\b[A-Z]/g;
  function padLeft(s, length, character) {
    argumentIsRequired(s, "s", String);
    argumentIsRequired(length, "length", Number);
    argumentIsRequired(character, "character", String);
    if (character.length !== 1) {
      throw new Error('The "character" argument must be one character in length.');
    }
    return character.repeat(length - s.length) + s;
  }

  // ../common-js/lang/formatter.js
  function numberToString(value, digits, thousandsSeparator, useParenthesis) {
    if (value === void 0 || value === null || Number.isNaN(value)) {
      return "";
    }
    const applyParenthesis = value < 0 && useParenthesis === true;
    if (applyParenthesis) {
      value = 0 - value;
    }
    let returnRef = value.toFixed(digits);
    if (thousandsSeparator && Math.abs(Number(returnRef)) >= 1e3) {
      const length = returnRef.length;
      const negative = value < 0;
      let found = digits === 0;
      let counter = 0;
      const buffer = [];
      for (let i = length - 1; !(i < 0); i--) {
        if (counter === 3 && !(negative && i === 0)) {
          buffer.unshift(thousandsSeparator);
          counter = 0;
        }
        const character = returnRef.charAt(i);
        buffer.unshift(character);
        if (found) {
          counter = counter + 1;
        } else if (character === ".") {
          found = true;
        }
      }
      if (applyParenthesis) {
        buffer.unshift("(");
        buffer.push(")");
      }
      returnRef = buffer.join("");
    } else if (applyParenthesis) {
      returnRef = "(" + returnRef + ")";
    }
    return returnRef;
  }

  // format/decimal.js
  function formatDecimal(value, digits, thousandsSeparator, useParenthesis) {
    if (!number(value)) {
      return "";
    }
    if (!string(thousandsSeparator) || thousandsSeparator.length > 1) {
      thousandsSeparator = "";
    }
    return numberToString(value, digits, thousandsSeparator, useParenthesis);
  }

  // format/fraction.js
  function getIntegerPart(value, fractionSeparator) {
    const floor = Math.floor(value);
    if (floor === 0 && fractionSeparator === "") {
      return "";
    } else {
      return floor;
    }
  }
  function getDecimalPart(absoluteValue) {
    return absoluteValue - Math.floor(absoluteValue);
  }
  function frontPad(value, digits) {
    return ["000", Math.floor(value)].join("").substr(-1 * digits);
  }
  function formatFraction(value, fractionFactor, fractionDigits, fractionSeparator, useParenthesis) {
    if (!number(value)) {
      return "";
    }
    if (!number(fractionFactor)) {
      return "";
    }
    if (!number(fractionDigits)) {
      return "";
    }
    if (!string(fractionSeparator) || fractionSeparator.length > 1) {
      fractionSeparator = ".";
    }
    const absoluteValue = Math.abs(value);
    const integerPart = getIntegerPart(absoluteValue, fractionSeparator);
    const decimalPart = getDecimalPart(absoluteValue);
    const denominator = fractionFactor;
    const numerator = decimalPart * denominator;
    const roundedNumerator = Math.floor(parseFloat(numerator.toFixed(1)));
    const formattedNumerator = frontPad(roundedNumerator, fractionDigits);
    let prefix;
    let suffix;
    if (value < 0) {
      useParenthesis = boolean(useParenthesis) && useParenthesis;
      if (useParenthesis) {
        prefix = "(";
        suffix = ")";
      } else {
        prefix = "-";
        suffix = "";
      }
    } else {
      prefix = "";
      suffix = "";
    }
    return [prefix, integerPart, fractionSeparator, formattedNumerator, suffix].join("");
  }

  // format/price.js
  function formatPrice(value, unitCode, fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {
    if (!number(value)) {
      return "";
    }
    const unitCodeItem = UnitCode.parse(unitCode);
    if (unitCodeItem === null) {
      return "";
    }
    if (!string(fractionSeparator) || fractionSeparator.length > 1) {
      fractionSeparator = ".";
    }
    specialFractions = boolean(specialFractions) && specialFractions;
    useParenthesis = boolean(useParenthesis) && useParenthesis;
    if (!unitCodeItem.supportsFractions || fractionSeparator === ".") {
      return formatDecimal(value, unitCodeItem.decimalDigits, thousandsSeparator, useParenthesis);
    } else {
      const fractionFactor = unitCodeItem.getFractionFactor(specialFractions);
      const fractionDigits = unitCodeItem.getFractionDigits(specialFractions);
      return formatFraction(value, fractionFactor, fractionDigits, fractionSeparator, useParenthesis);
    }
  }

  // test/specs/format/cmeSpec.js
  describe("when formatting decimals as ticks", () => {
    it("should be formatted correctly (each tick = 1/32, e.g. root=ZB)", () => {
      const rules = THIRTY_SECONDS;
      const code = "4";
      rules.forEach((rule) => {
        const decimal = rule[1];
        const expected = `0-${padLeft(rule[0].toString(), 2, "0")}`;
        expect(formatPrice(decimal, code, "-", true)).toEqual(expected);
      });
    });
    it("should be formatted correctly (each tick = 1/2 of a 1/32, e.g. root=ZN)", () => {
      const rules = HALVES_OF_THIRTY_SECONDS;
      const code = "5";
      rules.forEach((rule) => {
        const decimal = rule[1];
        const expected = `0-${padLeft(rule[0].toString(), 3, "0")}`;
        expect(formatPrice(decimal, code, "-", true)).toEqual(expected);
      });
    });
    it("should be formatted correctly (each tick = 1/4 of a 1/32, e.g. root=ZF)", () => {
      const rules = QUARTERS_OF_THIRTY_SECONDS;
      const code = "5";
      rules.forEach((rule) => {
        const decimal = rule[1];
        const expected = `0-${padLeft(rule[0].toString(), 3, "0")}`;
        expect(formatPrice(decimal, code, "-", true)).toEqual(expected);
      });
    });
    it("should be formatted correctly (each tick = 1/8 of a 1/32, e.g. root=ZT)", () => {
      const rules = EIGHTHS_OF_THIRTY_SECONDS;
      const code = "7";
      rules.forEach((rule) => {
        const decimal = rule[1];
        const expected = `0-${padLeft(rule[0].toString(), 3, "0")}`;
        expect(formatPrice(decimal, code, "-", true)).toEqual(expected);
      });
    });
  });
  var THIRTY_SECONDS = [
    // 1/32nd = 0-01 (numerator shown, denominator implied) = 1/32 = 0.3125,
    // 2/32nd = 0-02 (numerator shown, denominator implied) = 2/32 = 0.0625...
    [0, 0],
    [1, 0.03125],
    [2, 0.0625],
    [3, 0.09375],
    [4, 0.125],
    [5, 0.15625],
    [6, 0.1875],
    [7, 0.21875],
    [8, 0.25],
    [9, 0.28125],
    [10, 0.3125],
    [11, 0.34375],
    [12, 0.375],
    [13, 0.40625],
    [14, 0.4375],
    [15, 0.46875],
    [16, 0.5],
    [17, 0.53125],
    [18, 0.5625],
    [19, 0.59375],
    [20, 0.625],
    [21, 0.65625],
    [22, 0.6875],
    [23, 0.71875],
    [24, 0.75],
    [25, 0.78125],
    [26, 0.8125],
    [27, 0.84375],
    [28, 0.875],
    [29, 0.90625],
    [30, 0.9375],
    [31, 0.96875]
  ];
  var HALVES_OF_THIRTY_SECONDS = [
    // 0/32nds + 1/2 of a 32nd = 0.5/32nd = 0-005 (numerator shown without decimal point, denominator implied) = 0.5/32 = 0.015625,
    // 1/32nds + 0/2 of a 32nd = 1.0/32nd = 0-010 (numerator shown without decimal point, denominator implied) = 1/32 = 0.32125,
    // 1/32nds + 1/2 of a 32nd = 1.5/32nd = 0-015 (numerator shown without decimal point, denominator implied) = 1.5/32 = 0.046875...
    [0, 0],
    [5, 0.015625],
    [10, 0.03125],
    [15, 0.046875],
    [20, 0.0625],
    [25, 0.078125],
    [30, 0.09375],
    [35, 0.109375],
    [40, 0.125],
    [45, 0.140625],
    [50, 0.15625],
    [55, 0.171875],
    [60, 0.1875],
    [65, 0.203125],
    [70, 0.21875],
    [75, 0.234375],
    [80, 0.25],
    [85, 0.265625],
    [90, 0.28125],
    [95, 0.296875],
    [100, 0.3125],
    [105, 0.328125],
    [110, 0.34375],
    [115, 0.359375],
    [120, 0.375],
    [125, 0.390625],
    [130, 0.40625],
    [135, 0.421875],
    [140, 0.4375],
    [145, 0.453125],
    [150, 0.46875],
    [155, 0.484375],
    [160, 0.5],
    [165, 0.515625],
    [170, 0.53125],
    [175, 0.546875],
    [180, 0.5625],
    [185, 0.578125],
    [190, 0.59375],
    [195, 0.609375],
    [200, 0.625],
    [205, 0.640625],
    [210, 0.65625],
    [215, 0.671875],
    [220, 0.6875],
    [225, 0.703125],
    [230, 0.71875],
    [235, 0.734375],
    [240, 0.75],
    [245, 0.765625],
    [250, 0.78125],
    [255, 0.796875],
    [260, 0.8125],
    [265, 0.828125],
    [270, 0.84375],
    [275, 0.859375],
    [280, 0.875],
    [285, 0.890625],
    [290, 0.90625],
    [295, 0.921875],
    [300, 0.9375],
    [305, 0.953125],
    [310, 0.96875],
    [315, 0.984375]
  ];
  var QUARTERS_OF_THIRTY_SECONDS = [
    // 0/32nds + 1/4 of a 32nd = 0.25/32nd = 0-002[5] = 0-002 (numerator shown without decimal point and omitting last digit, denominator implied) = 0.25/32 = 0.0078125,
    // 0/32nds + 2/4 of a 32nd = 0.50/32nd = 0-005[0] = 0-005 (numerator shown without decimal point and omitting last digit, denominator implied) = 0.50/32 = 0.015625,
    // 0/32nds + 3/4 of a 32nd = 0.75/32nd = 0-007[5] = 0-007 (numerator shown without decimal point and omitting last digit, denominator implied) = 0.75/32 = 0.0234375,
    // 1/32nds + 0/4 of a 32nd = 1.00/32nd = 0-010[0] = 0-010 (numerator shown without decimal point and omitting last digit, denominator implied) = 1/32 = 0.03125,
    // 1/32nds + 1/4 of a 32nd = 1.25/32nd = 0-012[5] = 0-012 (numerator shown without decimal point and omitting last digit, denominator implied) = 1.25/32 = 0.0390625 ...
    [0, 0],
    [2, 78125e-7],
    [5, 0.015625],
    [7, 0.0234375],
    [10, 0.03125],
    [12, 0.0390625],
    [15, 0.046875],
    [17, 0.0546875],
    [20, 0.0625],
    [22, 0.0703125],
    [25, 0.078125],
    [27, 0.0859375],
    [30, 0.09375],
    [32, 0.1015625],
    [35, 0.109375],
    [37, 0.1171875],
    [40, 0.125],
    [42, 0.1328125],
    [45, 0.140625],
    [47, 0.1484375],
    [50, 0.15625],
    [52, 0.1640625],
    [55, 0.171875],
    [57, 0.1796875],
    [60, 0.1875],
    [62, 0.1953125],
    [65, 0.203125],
    [67, 0.2109375],
    [70, 0.21875],
    [72, 0.2265625],
    [75, 0.234375],
    [77, 0.2421875],
    [80, 0.25],
    [82, 0.2578125],
    [85, 0.265625],
    [87, 0.2734375],
    [90, 0.28125],
    [92, 0.2890625],
    [95, 0.296875],
    [97, 0.3046875],
    [100, 0.3125],
    [102, 0.3203125],
    [105, 0.328125],
    [107, 0.3359375],
    [110, 0.34375],
    [112, 0.3515625],
    [115, 0.359375],
    [117, 0.3671875],
    [120, 0.375],
    [122, 0.3828125],
    [125, 0.390625],
    [127, 0.3984375],
    [130, 0.40625],
    [132, 0.4140625],
    [135, 0.421875],
    [137, 0.4296875],
    [140, 0.4375],
    [142, 0.4453125],
    [145, 0.453125],
    [147, 0.4609375],
    [150, 0.46875],
    [152, 0.4765625],
    [155, 0.484375],
    [157, 0.4921875],
    [160, 0.5],
    [162, 0.5078125],
    [165, 0.515625],
    [167, 0.5234375],
    [170, 0.53125],
    [172, 0.5390625],
    [175, 0.546875],
    [177, 0.5546875],
    [180, 0.5625],
    [182, 0.5703125],
    [185, 0.578125],
    [187, 0.5859375],
    [190, 0.59375],
    [192, 0.6015625],
    [195, 0.609375],
    [197, 0.6171875],
    [200, 0.625],
    [202, 0.6328125],
    [205, 0.640625],
    [207, 0.6484375],
    [210, 0.65625],
    [212, 0.6640625],
    [215, 0.671875],
    [217, 0.6796875],
    [220, 0.6875],
    [222, 0.6953125],
    [225, 0.703125],
    [227, 0.7109375],
    [230, 0.71875],
    [232, 0.7265625],
    [235, 0.734375],
    [237, 0.7421875],
    [240, 0.75],
    [242, 0.7578125],
    [245, 0.765625],
    [247, 0.7734375],
    [250, 0.78125],
    [252, 0.7890625],
    [255, 0.796875],
    [257, 0.8046875],
    [260, 0.8125],
    [262, 0.8203125],
    [265, 0.828125],
    [267, 0.8359375],
    [270, 0.84375],
    [272, 0.8515625],
    [275, 0.859375],
    [277, 0.8671875],
    [280, 0.875],
    [282, 0.8828125],
    [285, 0.890625],
    [287, 0.8984375],
    [290, 0.90625],
    [292, 0.9140625],
    [295, 0.921875],
    [297, 0.9296875],
    [300, 0.9375],
    [302, 0.9453125],
    [305, 0.953125],
    [307, 0.9609375],
    [310, 0.96875],
    [312, 0.9765625],
    [315, 0.984375],
    [317, 0.9921875]
  ];
  var EIGHTHS_OF_THIRTY_SECONDS = [
    // 0/32nds + 1/8 of a 32nd = 0.125/32nd = 0-001[25] = 0-001 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.125/32 = 0.00390625,
    // 0/32nds + 2/8 of a 32nd = 0.250/32nd = 0-002[50] = 0-002 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.250/32 = 0.0078125,
    // 0/32nds + 3/8 of a 32nd = 0.75/32nd = 0-003[75] = 0-003 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.375/32 = 0.01171875,
    // 0/32nds + 4/8 of a 32nd = 1.00/32nd = 0-005[00] = 0-005 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.500/32 = 0.015625,
    // 0/32nds + 5/8 of a 32nd = 1.25/32nd = 0-006[25] = 0-006 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.625/32 = 0.01953125,
    // 0/32nds + 6/8 of a 32nd = 0.25/32nd = 0-007[50] = 0-007 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.750/32 = 0.0234375,
    // 0/32nds + 7/8 of a 32nd = 0.50/32nd = 0-008[75] = 0-008 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.875/32 = 0.02734375,
    // 0/32nds + 0/8 of a 32nd = 0.75/32nd = 0-010[00] = 0-010 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 1.000/32 = 0.03125,
    // 0/32nds + 1/8 of a 32nd = 1.00/32nd = 0-011[25] = 0-011 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 1.125/32 = 0.03515625...
    [0, 0],
    [1, 390625e-8],
    [2, 78125e-7],
    [3, 0.01171875],
    [5, 0.015625],
    [6, 0.01953125],
    [7, 0.0234375],
    [8, 0.02734375],
    [10, 0.03125],
    [11, 0.03515625],
    [12, 0.0390625],
    [13, 0.04296875],
    [15, 0.046875],
    [16, 0.05078125],
    [17, 0.0546875],
    [18, 0.05859375],
    [20, 0.0625],
    [21, 0.06640625],
    [22, 0.0703125],
    [23, 0.07421875],
    [25, 0.078125],
    [26, 0.08203125],
    [27, 0.0859375],
    [28, 0.08984375],
    [30, 0.09375],
    [31, 0.09765625],
    [32, 0.1015625],
    [33, 0.10546875],
    [35, 0.109375],
    [36, 0.11328125],
    [37, 0.1171875],
    [38, 0.12109375],
    [40, 0.125],
    [41, 0.12890625],
    [42, 0.1328125],
    [43, 0.13671875],
    [45, 0.140625],
    [46, 0.14453125],
    [47, 0.1484375],
    [48, 0.15234375],
    [50, 0.15625],
    [51, 0.16015625],
    [52, 0.1640625],
    [53, 0.16796875],
    [55, 0.171875],
    [56, 0.17578125],
    [57, 0.1796875],
    [58, 0.18359375],
    [60, 0.1875],
    [61, 0.19140625],
    [62, 0.1953125],
    [63, 0.19921875],
    [65, 0.203125],
    [66, 0.20703125],
    [67, 0.2109375],
    [68, 0.21484375],
    [70, 0.21875],
    [71, 0.22265625],
    [72, 0.2265625],
    [73, 0.23046875],
    [75, 0.234375],
    [76, 0.23828125],
    [77, 0.2421875],
    [78, 0.24609375],
    [80, 0.25],
    [81, 0.25390625],
    [82, 0.2578125],
    [83, 0.26171875],
    [85, 0.265625],
    [86, 0.26953125],
    [87, 0.2734375],
    [88, 0.27734375],
    [90, 0.28125],
    [91, 0.28515625],
    [92, 0.2890625],
    [93, 0.29296875],
    [95, 0.296875],
    [96, 0.30078125],
    [97, 0.3046875],
    [98, 0.30859375],
    [100, 0.3125],
    [101, 0.31640625],
    [102, 0.3203125],
    [103, 0.32421875],
    [105, 0.328125],
    [106, 0.33203125],
    [107, 0.3359375],
    [108, 0.33984375],
    [110, 0.34375],
    [111, 0.34765625],
    [112, 0.3515625],
    [113, 0.35546875],
    [115, 0.359375],
    [116, 0.36328125],
    [117, 0.3671875],
    [118, 0.37109375],
    [120, 0.375],
    [121, 0.37890625],
    [122, 0.3828125],
    [123, 0.38671875],
    [125, 0.390625],
    [126, 0.39453125],
    [127, 0.3984375],
    [128, 0.40234375],
    [130, 0.40625],
    [131, 0.41015625],
    [132, 0.4140625],
    [133, 0.41796875],
    [135, 0.421875],
    [136, 0.42578125],
    [137, 0.4296875],
    [138, 0.43359375],
    [140, 0.4375],
    [141, 0.44140625],
    [142, 0.4453125],
    [143, 0.44921875],
    [145, 0.453125],
    [146, 0.45703125],
    [147, 0.4609375],
    [148, 0.46484375],
    [150, 0.46875],
    [151, 0.47265625],
    [152, 0.4765625],
    [153, 0.48046875],
    [155, 0.484375],
    [156, 0.48828125],
    [157, 0.4921875],
    [158, 0.49609375],
    [160, 0.5],
    [161, 0.50390625],
    [162, 0.5078125],
    [163, 0.51171875],
    [165, 0.515625],
    [166, 0.51953125],
    [167, 0.5234375],
    [168, 0.52734375],
    [170, 0.53125],
    [171, 0.53515625],
    [172, 0.5390625],
    [173, 0.54296875],
    [175, 0.546875],
    [176, 0.55078125],
    [177, 0.5546875],
    [178, 0.55859375],
    [180, 0.5625],
    [181, 0.56640625],
    [182, 0.5703125],
    [183, 0.57421875],
    [185, 0.578125],
    [186, 0.58203125],
    [187, 0.5859375],
    [188, 0.58984375],
    [190, 0.59375],
    [191, 0.59765625],
    [192, 0.6015625],
    [193, 0.60546875],
    [195, 0.609375],
    [196, 0.61328125],
    [197, 0.6171875],
    [198, 0.62109375],
    [200, 0.625],
    [201, 0.62890625],
    [202, 0.6328125],
    [203, 0.63671875],
    [205, 0.640625],
    [206, 0.64453125],
    [207, 0.6484375],
    [208, 0.65234375],
    [210, 0.65625],
    [211, 0.66015625],
    [212, 0.6640625],
    [213, 0.66796875],
    [215, 0.671875],
    [216, 0.67578125],
    [217, 0.6796875],
    [218, 0.68359375],
    [220, 0.6875],
    [221, 0.69140625],
    [222, 0.6953125],
    [223, 0.69921875],
    [225, 0.703125],
    [226, 0.70703125],
    [227, 0.7109375],
    [228, 0.71484375],
    [230, 0.71875],
    [231, 0.72265625],
    [232, 0.7265625],
    [233, 0.73046875],
    [235, 0.734375],
    [236, 0.73828125],
    [237, 0.7421875],
    [238, 0.74609375],
    [240, 0.75],
    [241, 0.75390625],
    [242, 0.7578125],
    [243, 0.76171875],
    [245, 0.765625],
    [246, 0.76953125],
    [247, 0.7734375],
    [248, 0.77734375],
    [250, 0.78125],
    [251, 0.78515625],
    [252, 0.7890625],
    [253, 0.79296875],
    [255, 0.796875],
    [256, 0.80078125],
    [257, 0.8046875],
    [258, 0.80859375],
    [260, 0.8125],
    [261, 0.81640625],
    [262, 0.8203125],
    [263, 0.82421875],
    [265, 0.828125],
    [266, 0.83203125],
    [267, 0.8359375],
    [268, 0.83984375],
    [270, 0.84375],
    [271, 0.84765625],
    [272, 0.8515625],
    [273, 0.85546875],
    [275, 0.859375],
    [276, 0.86328125],
    [277, 0.8671875],
    [278, 0.87109375],
    [280, 0.875],
    [281, 0.87890625],
    [282, 0.8828125],
    [283, 0.88671875],
    [285, 0.890625],
    [286, 0.89453125],
    [287, 0.8984375],
    [288, 0.90234375],
    [290, 0.90625],
    [291, 0.91015625],
    [292, 0.9140625],
    [293, 0.91796875],
    [295, 0.921875],
    [296, 0.92578125],
    [297, 0.9296875],
    [298, 0.93359375],
    [300, 0.9375],
    [301, 0.94140625],
    [302, 0.9453125],
    [303, 0.94921875],
    [305, 0.953125],
    [306, 0.95703125],
    [307, 0.9609375],
    [308, 0.96484375],
    [310, 0.96875],
    [311, 0.97265625],
    [312, 0.9765625],
    [313, 0.98046875],
    [315, 0.984375],
    [316, 0.98828125],
    [317, 0.9921875],
    [318, 0.99609375]
  ];

  // test/specs/format/decimalSpec.js
  describe("when formatting invalid values", () => {
    it("formats a null value as a zero-length string", () => {
      expect(formatDecimal(null, 0, ",")).toEqual("");
    });
    it("formats an undefined value as a zero-length string", () => {
      expect(formatDecimal(void 0, 0, ",")).toEqual("");
    });
    it("formats Number.NaN as a zero-length string", () => {
      expect(formatDecimal(Number.NaN, 0, ",")).toEqual("");
    });
  });
  describe("when formatting decimal values with zero decimals and thousands separator", () => {
    it('formats 0 as "0"', () => {
      expect(formatDecimal(0, 0, ",")).toEqual("0");
    });
    it('formats 0.1 as "0"', () => {
      expect(formatDecimal(0.1, 0, ",")).toEqual("0");
    });
    it('formats 0.9 as "0"', () => {
      expect(formatDecimal(0.9, 0, ",")).toEqual("1");
    });
    it('formats 377 as "377"', () => {
      expect(formatDecimal(377, 0, ",")).toEqual("377");
    });
    it('formats -377 as "-377"', () => {
      expect(formatDecimal(-377, 0, ",")).toEqual("-377");
    });
    it('formats 377.99 as "378"', () => {
      expect(formatDecimal(377.99, 0, ",")).toEqual("378");
    });
    it('formats -377.99 as "-378"', () => {
      expect(formatDecimal(-377.99, 0, ",")).toEqual("-378");
    });
    it('formats 377.49 as "377"', () => {
      expect(formatDecimal(377.49, 0, ",")).toEqual("377");
    });
    it('formats -377.49 as "-377"', () => {
      expect(formatDecimal(-377.49, 0, ",")).toEqual("-377");
    });
    it('formats 377377 as "377,377"', () => {
      expect(formatDecimal(377377, 0, ",")).toEqual("377,377");
    });
    it('formats -377377 as "-377,377"', () => {
      expect(formatDecimal(-377377, 0, ",")).toEqual("-377,377");
    });
    it('formats 377377.49 as "377,377"', () => {
      expect(formatDecimal(377377.49, 0, ",")).toEqual("377,377");
    });
    it('formats -377377.49 as "-377,377"', () => {
      expect(formatDecimal(-377377.49, 0, ",")).toEqual("-377,377");
    });
    it('formats 377377.99 as "377,378"', () => {
      expect(formatDecimal(377377.99, 0, ",")).toEqual("377,378");
    });
    it('formats -377377.99 as "-377,378"', () => {
      expect(formatDecimal(-377377.99, 0, ",")).toEqual("-377,378");
    });
  });
  describe("when formatting decimal values with two decimals and thousands separator", () => {
    it('formats 0 as "0.00"', () => {
      expect(formatDecimal(0, 2, ",")).toEqual("0.00");
    });
    it('formats 0.001 as "0.00"', () => {
      expect(formatDecimal(1e-3, 2, ",")).toEqual("0.00");
    });
    it('formats 0.009 as "0.01"', () => {
      expect(formatDecimal(9e-3, 2, ",")).toEqual("0.01");
    });
    it('formats 123.45 as "123.45"', () => {
      expect(formatDecimal(123.45, 2, ",")).toEqual("123.45");
    });
    it('formats -123.45 as "-123.45"', () => {
      expect(formatDecimal(-123.45, 2, ",")).toEqual("-123.45");
    });
    it('formats 1234.5 as "1234.50"', () => {
      expect(formatDecimal(1234.5, 2, ",")).toEqual("1,234.50");
    });
    it('formats -1234.5 as "-1234.50"', () => {
      expect(formatDecimal(-1234.5, 2, ",")).toEqual("-1,234.50");
    });
    it('formats 123456.789 as "123,456.79"', () => {
      expect(formatDecimal(123456.789, 2, ",")).toEqual("123,456.79");
    });
    it('formats -123456.789 as "-123,456.79"', () => {
      expect(formatDecimal(-123456.789, 2, ",")).toEqual("-123,456.79");
    });
  });
  describe("when formatting decimal values with four decimals and thousands separator", () => {
    it('formats 1234.56789 as "1,234.5679"', function() {
      expect(formatDecimal(1234.56789, 4, ",")).toEqual("1,234.5679");
    });
    it('formats -1234.56789 as "-1,234.5679"', function() {
      expect(formatDecimal(-1234.56789, 4, ",")).toEqual("-1,234.5679");
    });
  });
  describe("when formatting decimal values to format negative numbers with a thousands separator", () => {
    it('formats -123.456789 as "-123.45"', function() {
      expect(formatDecimal(-123.456789, 2, ",")).toEqual("-123.46");
    });
    it('formats -123456.789 as "-123,456.79', function() {
      expect(formatDecimal(-123456.789, 2, ",")).toEqual("-123,456.79");
    });
  });
  describe("when formatting decimal values to format with parenthesis and a thousands separator", () => {
    it('formats 123.456789 as "-23.45"', function() {
      expect(formatDecimal(123.456789, 2, ",", true)).toEqual("123.46");
    });
    it('formats -123.456789 as "-123.45"', function() {
      expect(formatDecimal(-123.456789, 2, ",", true)).toEqual("(123.46)");
    });
    it('formats 123456.789 as "-123,456.79', function() {
      expect(formatDecimal(123456.789, 2, ",", true)).toEqual("123,456.79");
    });
    it('formats -123456.789 as "-123,456.79', function() {
      expect(formatDecimal(-123456.789, 2, ",", true)).toEqual("(123,456.79)");
    });
    it('formats -3770.75, to three decimal places, as "(3,770.750)', function() {
      expect(formatDecimal(-3770.75, 3, ",", true)).toEqual("(3,770.750)");
    });
  });
  describe("when formatting decimal values to format with parenthesis and no thousands separator", () => {
    it('formats 123.456789 as "-23.45"', function() {
      expect(formatDecimal(123.456789, 2, "", true)).toEqual("123.46");
    });
    it('formats -123.456789 as "-123.45"', function() {
      expect(formatDecimal(-123.456789, 2, "", true)).toEqual("(123.46)");
    });
    it('formats 123456.789 as "-123,456.79', function() {
      expect(formatDecimal(123456.789, 2, "", true)).toEqual("123456.79");
    });
    it('formats -123456.789 as "-123,456.79', function() {
      expect(formatDecimal(-123456.789, 2, "", true)).toEqual("(123456.79)");
    });
  });
  describe("Decimal compatibility boundaries", () => {
    it("groups numbers that round to one thousand", () => {
      expect(formatDecimal(999.999, 2, ",")).toEqual("1,000.00");
      expect(formatDecimal(-999.999, 2, ",", true)).toEqual("(1,000.00)");
    });
    it("rejects non-numeric values and ignores invalid separators", () => {
      for (const value of [null, void 0, NaN, "12", {}, true]) {
        expect(formatDecimal(value, 2, ",")).toEqual("");
      }
      for (const separator of [null, void 0, 123, true, "--"]) {
        expect(formatDecimal(1234.5, 2, separator)).toEqual("1234.50");
      }
    });
  });

  // test/specs/format/fractionSpec.js
  describe("when formatting in halves of thirty-seconds", () => {
    it("formats 0.984375 as 0-315", () => {
      expect(formatFraction(0.984375, 320, 3, "-")).toEqual("0-315");
    });
  });
  describe("when formatting in quarters of thirty-seconds", () => {
    it("formats 0.9921875 as 0-317", () => {
      expect(formatFraction(0.9921875, 320, 3, "-")).toEqual("0-317");
    });
  });
  describe("when formatting in sixty-fourths", () => {
    it("formats 0.984375 as 0-315", () => {
      expect(formatFraction(0.984375, 64, 2, "-")).toEqual("0-63");
    });
  });
  describe("when formatting in halves of sixty-fourths", () => {
    it("formats 0.9921875 as 0-317", () => {
      expect(formatFraction(0.9921875, 640, 3, "-")).toEqual("0-635");
    });
  });

  // test/specs/format/priceSpec.js
  describe("when invalid prices are formatted (regardless of other settings)", () => {
    it("formats an undefined value as a zero-length string", () => {
      expect(formatPrice()).toEqual("");
    });
    it("formats a null value as a zero-length string", () => {
      expect(formatPrice(null)).toEqual("");
    });
    it("formats a Number.NaN value as a zero-length string", () => {
      expect(formatPrice(Number.NaN)).toEqual("");
    });
    it("formats a zero-length string as a zero-length string", () => {
      expect(formatPrice("")).toEqual("");
    });
    it('formats the string "bob" as a zero-length string', () => {
      expect(formatPrice("bob")).toEqual("");
    });
    it('formats the string "123" as a zero-length string', () => {
      expect(formatPrice("123")).toEqual("");
    });
    it("formats an empty object as a zero-length string", () => {
      expect(formatPrice({})).toEqual("");
    });
  });
  describe("when valid prices are formatted", () => {
    describe('with a unit code of "A"', () => {
      describe("with a decimal fraction separator", () => {
        it('formats 0 as "0.00"', () => {
          expect(formatPrice(0, "A", ".", false)).toEqual("0.00");
        });
        it('formats 123 as "123.00"', () => {
          expect(formatPrice(123, "A", ".", false)).toEqual("123.00");
        });
        it('formats 123.5 as "123.50"', () => {
          expect(formatPrice(123.5, "A", ".", false)).toEqual("123.50");
        });
        it('formats 123.555 as "123.56"', () => {
          expect(formatPrice(123.555, "A", ".", false)).toEqual("123.56");
        });
      });
      describe("with a dash fraction separator", () => {
        it('formats 0 as "0.00"', () => {
          expect(formatPrice(0, "A", "-", false)).toEqual("0.00");
        });
        it('formats 123 as "123.00"', () => {
          expect(formatPrice(123, "A", "-", false)).toEqual("123.00");
        });
        it('formats 123.5 as "123.50"', () => {
          expect(formatPrice(123.5, "A", "-", false)).toEqual("123.50");
        });
        it('formats 123.555 as "123.56"', () => {
          expect(formatPrice(123.555, "A", "-", false)).toEqual("123.56");
        });
      });
    });
    describe('with a unit code of "F"', () => {
      describe("with a decimal fraction separator", () => {
        it('formats 0 as "0"', () => {
          expect(formatPrice(0, "F", ".")).toEqual("0.0000000");
        });
        it('formats 0.007312 as "0.0073120"', () => {
          expect(formatPrice(7312e-6, "F", ".")).toEqual("0.0073120");
        });
      });
    });
    describe('with a unit code of "2"', () => {
      describe("with default arguments", () => {
        it('formats 0 as "0.000"', () => {
          expect(formatPrice(0, "2")).toEqual("0.000");
        });
        it('formats 377 as "377.000"', () => {
          expect(formatPrice(377, "2")).toEqual("377.000");
        });
      });
      describe("with a dash fraction separator (whole and half values)", () => {
        it('formats 123.0 as "123-0"', () => {
          expect(formatPrice(123, "2", "-")).toEqual("123-0");
        });
        it('formats 123.5 as "123-4"', () => {
          expect(formatPrice(123.5, "2", "-")).toEqual("123-4");
        });
      });
      describe("with a decimal fraction separator", () => {
        it('formats 0 as "0.000"', () => {
          expect(formatPrice(0, "2", ".")).toEqual("0.000");
        });
        it('formats 9.5432 as "9.543"', () => {
          expect(formatPrice(9.5432, "2", ".")).toEqual("9.543");
        });
        it('formats 377 as "377.000"', () => {
          expect(formatPrice(377, "2", ".")).toEqual("377.000");
        });
        it('formats -377 as "-377.000"', () => {
          expect(formatPrice(-377, "2", ".")).toEqual("-377.000");
        });
        it('formats 377.5 as "377.500"', () => {
          expect(formatPrice(377.5, "2", ".")).toEqual("377.500");
        });
        it('formats 377.75 as "377.750"', () => {
          expect(formatPrice(377.75, "2", ".")).toEqual("377.750");
        });
        it('formats 3770.75 as "3770.750"', () => {
          expect(formatPrice(3770.75, "2", ".")).toEqual("3770.750");
        });
        it('formats 37700.75 as "37700.750"', () => {
          expect(formatPrice(37700.75, "2", ".")).toEqual("37700.750");
        });
        it('formats 377000.75 as "377000.750"', () => {
          expect(formatPrice(377000.75, "2", ".")).toEqual("377000.750");
        });
        it('formats 3770000.75 as "3770000.750"', () => {
          expect(formatPrice(377000075e-2, "2", ".")).toEqual("3770000.750");
        });
        it('formats 3770000 as "3770000.000"', () => {
          expect(formatPrice(377e4, "2", ".")).toEqual("3770000.000");
        });
      });
      describe("with a decimal fraction separator and a thousands separator", () => {
        it('formats 0 as "0.000"', () => {
          expect(formatPrice(0, "2", ".", false, ",")).toEqual("0.000");
        });
        it('formats 377 as "377.000"', () => {
          expect(formatPrice(377, "2", ".", false, ",")).toEqual("377.000");
        });
        it('formats -377 as "-377.000"', () => {
          expect(formatPrice(-377, "2", ".", false, ",")).toEqual("-377.000");
        });
        it('formats 377.5 as "377.500"', () => {
          expect(formatPrice(377.5, "2", ".", false, ",")).toEqual("377.500");
        });
        it('formats 377.75 as "377.750"', () => {
          expect(formatPrice(377.75, "2", ".", false, ",")).toEqual("377.750");
        });
        it('formats 3770.75 as "3,770.750"', () => {
          expect(formatPrice(3770.75, "2", ".", false, ",")).toEqual("3,770.750");
        });
        it('formats 37700.75 as "37,700.750"', () => {
          expect(formatPrice(37700.75, "2", ".", false, ",")).toEqual("37,700.750");
        });
        it('formats 377000.75 as "377,000.750"', () => {
          expect(formatPrice(377000.75, "2", ".", false, ",")).toEqual("377,000.750");
        });
        it('formats -377000.75 as "-377,000.750"', () => {
          expect(formatPrice(-377000.75, "2", ".", false, ",")).toEqual("-377,000.750");
        });
        it('formats 3770000.75 as "3,770,000.750"', () => {
          expect(formatPrice(377000075e-2, "2", ".", false, ",")).toEqual("3,770,000.750");
        });
        it('formats 3770000 as "3,770,000.000"', () => {
          expect(formatPrice(377e4, "2", ".", false, ",")).toEqual("3,770,000.000");
        });
      });
      describe("with a decimal fraction separator and a thousands separator and parenthetical negatives", () => {
        it('formats 3770.75 as "3,770.750"', () => {
          expect(formatPrice(3770.75, "2", ".", false, ",", true)).toEqual("3,770.750");
        });
        it('formats -3770.75 as "(3,770.750)"', () => {
          expect(formatPrice(-3770.75, "2", ".", false, ",", true)).toEqual("(3,770.750)");
        });
        it('formats 0 as "0.000"', () => {
          expect(formatPrice(0, "2", ".", false, ",", true)).toEqual("0.000");
        });
      });
      describe("with a decimal fraction separator and parenthetical negatives", () => {
        it('formats 3770.75 as "3770.750"', () => {
          expect(formatPrice(3770.75, "2", ".", false, "", true)).toEqual("3770.750");
        });
        it('formats -3770.75 as "(3770.750)"', () => {
          expect(formatPrice(-3770.75, "2", ".", false, "", true)).toEqual("(3770.750)");
        });
        it('formats 0 as "0.000"', () => {
          expect(formatPrice(0, "2", ".", false, "", true)).toEqual("0.000");
        });
      });
      describe("with a dash fraction separator", () => {
        it('formats 9.5432 as "9.543"', () => {
          expect(formatPrice(9.5432, "2", "-")).toEqual("9-4");
        });
        it('formats 123 as "123-0"', () => {
          expect(formatPrice(123, "2", "-")).toEqual("123-0");
        });
        it('formats -123 as "-123-0"', () => {
          expect(formatPrice(-123, "2", "-")).toEqual("-123-0");
        });
        it('formats 123.5 as "123-4"', () => {
          expect(formatPrice(123.5, "2", "-")).toEqual("123-4");
        });
        it('formats -123.5 as "-123-4"', () => {
          expect(formatPrice(-123.5, "2", "-")).toEqual("-123-4");
        });
        it('formats 0.5 as "0-4"', () => {
          expect(formatPrice(0.5, "2", "-")).toEqual("0-4");
        });
        it('formats 0 as "0-0"', () => {
          expect(formatPrice(0, "2", "-")).toEqual("0-0");
        });
      });
      describe("with a dash fraction separator and parenthetical negatives", () => {
        it('formats 123 as "123-0"', () => {
          expect(formatPrice(123, "2", "-", false, "", true)).toEqual("123-0");
        });
        it('formats -123 as "(123-0)"', () => {
          expect(formatPrice(-123, "2", "-", false, "", true)).toEqual("(123-0)");
        });
        it('formats 123.5 as "123-4"', () => {
          expect(formatPrice(123.5, "2", "-", false, "", true)).toEqual("123-4");
        });
        it('formats -123.5 as "(123-4)"', () => {
          expect(formatPrice(-123.5, "2", "-", false, "", true)).toEqual("(123-4)");
        });
        it('formats 0.5 as "0-4"', () => {
          expect(formatPrice(0.5, "2", "-", false, "", true)).toEqual("0-4");
        });
        it('formats -0.5 as "(0-4)"', () => {
          expect(formatPrice(-0.5, "2", "-", false, "", true)).toEqual("(0-4)");
        });
        it('formats 0 as "0"', () => {
          expect(formatPrice(0, "2", "-", false, "", true)).toEqual("0-0");
        });
      });
      describe("with a tick separator", () => {
        it(`formats 123 as "123'0"`, () => {
          expect(formatPrice(123, "2", "'")).toEqual("123'0");
        });
        it(`formats 123.5 as "123'4"`, () => {
          expect(formatPrice(123.5, "2", "'")).toEqual("123'4");
        });
        it(`formats -123.5 as "-123'4"`, () => {
          expect(formatPrice(-123.5, "2", "'")).toEqual("-123'4");
        });
        it(`formats 0.5 as "0'4"`, () => {
          expect(formatPrice(0.5, "2", "'")).toEqual("0'4");
        });
        it(`formats -0.5 as "-0'4"`, () => {
          expect(formatPrice(-0.5, "2", "'")).toEqual("-0'4");
        });
        it(`formats 0 as "0'0"`, () => {
          expect(formatPrice(0, "2", "'")).toEqual("0'0");
        });
      });
      describe("with a tick separator and parenthetical negatives", () => {
        it(`formats 123.5 as "123'4"`, () => {
          expect(formatPrice(123.5, "2", "'", false, "", true)).toEqual("123'4");
        });
        it(`formats -123.5 as "(123'4)"`, () => {
          expect(formatPrice(-123.5, "2", "'", false, "", true)).toEqual("(123'4)");
        });
        it(`formats 0.5 as "0'4"`, () => {
          expect(formatPrice(0.5, "2", "'", false, "", true)).toEqual("0'4");
        });
        it(`formats -0.5 as "(0'4)"`, () => {
          expect(formatPrice(-0.5, "2", "'", false, "", true)).toEqual("(0'4)");
        });
        it(`formats 0 as "0'0"`, () => {
          expect(formatPrice(0, "2", "'", false, "", true)).toEqual("0'0");
        });
      });
      describe("with a zero-length separator", () => {
        it('formats 123 as "1230"', () => {
          expect(formatPrice(123, "2", "")).toEqual("1230");
        });
        it('formats 123.5 as "1234"', () => {
          expect(formatPrice(123.5, "2", "")).toEqual("1234");
        });
        it('formats 0.5 as "4"', () => {
          expect(formatPrice(0.5, "2", "")).toEqual("4");
        });
        it('formats 0 as "0"', () => {
          expect(formatPrice(0, "2", "")).toEqual("0");
        });
      });
      describe("with a zero-length separator and parenthetical negatives", () => {
        describe("with no separator and no special fractions", () => {
          it('formats 0.5 as "4"', () => {
            expect(formatPrice(0.5, "2", "", false, "", true)).toEqual("4");
          });
          it('formats -0.5 as "(4)"', () => {
            expect(formatPrice(-0.5, "2", "", false, "", true)).toEqual("(4)");
          });
          it('formats 0 as "0"', () => {
            expect(formatPrice(0, "2", "", false, "", true)).toEqual("0");
          });
        });
      });
    });
    describe('with a unit code of "3"', () => {
      describe("with a dash fraction separator", () => {
        it('formats 123.0 as "123-00"', () => {
          expect(formatPrice(123, "3", "-")).toEqual("123-00");
        });
        it('formats 123.5 as "123-4"', () => {
          expect(formatPrice(123.5, "3", "-")).toEqual("123-08");
        });
      });
    });
    describe('with a unit code of "4"', () => {
      describe("with a dash fraction separator", () => {
        it('formats 123.0 as "123-00"', () => {
          expect(formatPrice(123, "4", "-")).toEqual("123-00");
        });
        it('formats 123.5 as "123-4"', () => {
          expect(formatPrice(123.5, "4", "-")).toEqual("123-16");
        });
      });
    });
    describe('with a unit code of "5"', () => {
      describe("with a dash fraction separator", () => {
        it('formats 123.0 as "123-00"', () => {
          expect(formatPrice(123, "5", "-")).toEqual("123-00");
        });
        it('formats 123.5 as "123-32"', () => {
          expect(formatPrice(123.5, "5", "-")).toEqual("123-32");
        });
      });
      describe("with a dash fraction separator and special fractions", () => {
        it('formats 123.625 as "123-200"', () => {
          expect(formatPrice(123.625, "5", "-", true)).toEqual("123-200");
        });
        it('formats -123.625 as "-123-200"', () => {
          expect(formatPrice(-123.625, "5", "-", true)).toEqual("-123-200");
        });
        it('formats 123.640625 as "123-205"', () => {
          expect(formatPrice(123.640625, "5", "-", true)).toEqual("123-205");
        });
        it('formats -123.640625 as "-123-205"', () => {
          expect(formatPrice(-123.640625, "5", "-", true)).toEqual("-123-205");
        });
        it('formats 122.7031 as "122-225"', () => {
          expect(formatPrice(122.7031, "5", "-", true)).toEqual("122-225");
        });
        it('formats 0 as "0-000"', () => {
          expect(formatPrice(0, "5", "-", true)).toEqual("0-000");
        });
      });
      describe("with a dash fraction separator and special fractions and parenthetical negatives", () => {
        it('formats 123.625 as "123-200"', () => {
          expect(formatPrice(123.625, "5", "-", true, "", true)).toEqual("123-200");
        });
        it('formats -123.625 as "(123-200)"', () => {
          expect(formatPrice(-123.625, "5", "-", true, "", true)).toEqual("(123-200)");
        });
        it('formats 123.640625 as "123-205"', () => {
          expect(formatPrice(123.640625, "5", "-", true, "", true)).toEqual("123-205");
        });
        it('formats -123.640625 as "(123-205)"', () => {
          expect(formatPrice(-123.640625, "5", "-", true, "", true)).toEqual("(123-205)");
        });
      });
    });
    describe('with a unit code of "6"', () => {
      describe("with a dash fraction separator", () => {
        it('formats 123.0 as "123-000"', () => {
          expect(formatPrice(123, "6", "-")).toEqual("123-000");
        });
        it('formats 123.5 as "123-064"', () => {
          expect(formatPrice(123.5, "6", "-")).toEqual("123-064");
        });
      });
      describe("with a dash fraction separator and special fractions", () => {
        it('formats 114.5156 as "114-165"', () => {
          expect(formatPrice(114.5156, "6", "-", true)).toEqual("114-165");
        });
        it('formats 114.7891 as "114-252"', () => {
          expect(formatPrice(114.7891, "6", "-", true)).toEqual("114-252");
        });
        it('formats 114.8438 as "114-270"', () => {
          expect(formatPrice(114.8438, "6", "-", true)).toEqual("114-270");
        });
        it('formats 114.75 as "114-240"', () => {
          expect(formatPrice(114.75, "6", "-", true)).toEqual("114-240");
        });
        it('formats 0 as "0-000"', () => {
          expect(formatPrice(0, "6", "-", true)).toEqual("0-000");
        });
      });
    });
    describe('with a unit code of "7"', () => {
      describe("with a dash fraction separator", () => {
        it('formats 123.0 as "123-000"', () => {
          expect(formatPrice(123, "7", "-")).toEqual("123-000");
        });
        it('formats 123.5 as "123-128"', () => {
          expect(formatPrice(123.5, "7", "-")).toEqual("123-128");
        });
      });
    });
    describe('with a unit code of "8"', () => {
      describe("with a decimal fraction separator", () => {
        it('formats 0 as "0"', () => {
          expect(formatPrice(0, "8", ".")).toEqual("0");
        });
        it('formats 1000 as "1000"', () => {
          expect(formatPrice(1e3, "8", ".")).toEqual("1000");
        });
      });
      describe("with a decimal separator and a thousands separator", () => {
        it('formats 0 as "0"', () => {
          expect(formatPrice(0, "8", ".", false, ",")).toEqual("0");
        });
        it('formats 1000 as "1,000"', () => {
          expect(formatPrice(1e3, "8", ".", false, ",")).toEqual("1,000");
        });
      });
    });
    describe("with an invalid unit code", () => {
      it('formats 377 as "" (when unit code is omitted)', () => {
        expect(formatPrice(377)).toEqual("");
      });
      it('formats 377 as "" (when unit code is null)', () => {
        expect(formatPrice(377, null)).toEqual("");
      });
      it('formats 377 as "" (when unit code is numeric)', () => {
        expect(formatPrice(377, 2)).toEqual("");
      });
      it('formats 377 as "" (when unit code has multiple characters are used)', () => {
        expect(formatPrice(377, "999")).toEqual("");
      });
      it('formats 377 as "" (when unit code is a a single character -- but an invalid unit code -- "1")', () => {
        expect(formatPrice(377, "1")).toEqual("");
      });
      it('formats 377 as "" (when unit code is a single character -- but an invalid unit code -- "G")', () => {
        expect(formatPrice(377, "G")).toEqual("");
      });
      it('formats 377 as "" (when unit code is a single character -- but an invalid unit code -- "a")', () => {
        expect(formatPrice(377, "a")).toEqual("");
      });
    });
  });

  // format/specialized/cmdtyView.js
  var regex2 = {};
  regex2.ZB = /^BB\d$/;
  regex2.ZT = /^BT\d$/;
  regex2.ZF = /^BF\d$/;
  regex2.ZN = /^BN\d$/;
  function formatForCmdtyView(value, unitCode, profile) {
    if (profile.asset?.id === AssetClass.FUTURE_OPTION.id) {
      const root = profile.root;
      if (root === "ZB" || root === "ZN" || regex2.ZB.test(root) || regex2.ZN.test(root)) {
        return formatFraction(value, 64, 2, "-", false);
      }
      if (root === "ZT" || root === "ZF" || regex2.ZT.test(root) || regex2.ZF.test(root)) {
        return formatFraction(value, 640, 3, "-", false);
      }
    }
    return formatPrice(value, unitCode, "-", true, ",");
  }

  // symbology/SymbolParser.js
  var SymbolParser = class _SymbolParser {
    constructor() {
    }
    // PREDICATES THAT IDENTIFY A SYMBOL AS A SPECIFIC ASSET CLASS.
    /**
     * Returns true when a symbol is listed on the BATS/BZX exchange.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsBats(symbol) {
      return string(symbol) && predicates.bats.test(symbol);
    }
    /**
     * Returns true when a symbol represents a Commodity3 instrument.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsC3(symbol) {
      return string(symbol) && (types2.c3.concrete.test(symbol) || types2.c3.alias.test(symbol));
    }
    /**
     * Returns true when a symbol represents a Canadian mutual fund.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsCanadianFund(symbol) {
      return string(symbol) && types2.funds.canadian.test(symbol);
    }
    /**
     * Returns true when a symbol represents a cmdty-branded instrument.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsCmdty(symbol) {
      return string(symbol) && (types2.cmdty.stats.test(symbol) || types2.cmdty.internal.test(symbol) || types2.cmdty.external.test(symbol));
    }
    /**
     * Returns true when a symbol represents a cmdtyStats instrument.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsCmdtyStats(symbol) {
      return string(symbol) && types2.cmdty.stats.test(symbol);
    }
    /**
     * Returns true when a symbol represents a cryptocurrency.
     * Foreign exchange symbols can use the same pattern.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsCrypto(symbol) {
      return string(symbol) && types2.crypto.test(symbol);
    }
    /**
     * Returns true when a symbol represents an option on an equity or index.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsEquityOption(symbol) {
      return string(symbol) && types2.equities.options.test(symbol);
    }
    /**
     * Returns true when a symbol represents a futures contract.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsFuture(symbol) {
      return string(symbol) && (types2.futures.concrete.test(symbol) || types2.futures.alias.test(symbol));
    }
    /**
     * Returns true when a symbol represents a cash futures contract.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsFutureCash(symbol) {
      return _SymbolParser.getIsFuture(symbol) && types2.futures.cash.test(symbol);
    }
    /**
     * Returns true when a symbol represents an option on a futures contract.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsFutureOption(symbol) {
      return string(symbol) && (types2.futures.options.short.test(symbol) || types2.futures.options.long.test(symbol) || types2.futures.options.historical.test(symbol));
    }
    /**
     * Returns true when a symbol represents a futures spread.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsFutureSpread(symbol) {
      return string(symbol) && types2.futures.spread.test(symbol);
    }
    /**
     * Returns true when a symbol represents a foreign exchange currency pair.
     * Cryptocurrency symbols can use the same pattern.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsForex(symbol) {
      return string(symbol) && types2.forex.test(symbol);
    }
    /**
     * Returns true when a symbol represents a grain bid instrument.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsGrainBid(symbol) {
      return string(symbol) && types2.bids.test(symbol);
    }
    /**
     * Returns true when a symbol represents an external index.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsIndex(symbol) {
      return string(symbol) && types2.indicies.external.test(symbol);
    }
    /**
     * Returns true when a symbol represents a Platts instrument.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsPlatts(symbol) {
      return string(symbol) && (types2.platts.concrete.test(symbol) || types2.platts.alias.test(symbol));
    }
    /**
     * Returns true when a symbol represents a Barchart sector.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsSector(symbol) {
      return string(symbol) && types2.indicies.sector.test(symbol);
    }
    // PREDICATES THAT IDENTIFY A SYMBOL AS HAVING AN ATTRIBUTE (BUT NOT NECESSARILY A SPECIFIC ASSET CLASS).
    /**
     * Returns true when a symbol is not an alias.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsConcrete(symbol) {
      return string(symbol) && !_SymbolParser.getIsReference(symbol);
    }
    /**
     * Returns true when a symbol is an alias (e.g. ZC*1).
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsReference(symbol) {
      return string(symbol) && types2.futures.alias.test(symbol);
    }
    /**
     * Returns true when a symbol appears to be expired (e.g. ZCZ6 or IBM).
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsExpired(symbol) {
      const parsed = _SymbolParser.parseInstrumentType(symbol);
      if (parsed === null || !parsed.year || !parsed.month) {
        return false;
      }
      const currentYear = getCurrentYear();
      if (parsed.year < currentYear) {
        return true;
      }
      if (parsed.year === currentYear && Object.hasOwn(futuresMonthNumbers, parsed.month)) {
        return getCurrentMonth() > futuresMonthNumbers[parsed.month];
      }
      return false;
    }
    /**
     * Returns true when the name identifies a pit-traded instrument.
     *
     * @public
     * @static
     * @param {string} symbol
     * @param {string} name
     * @returns {boolean}
     */
    static getIsPit(symbol, name) {
      return string(symbol) && string(name) && predicates.pit.test(name);
    }
    // OTHER NON-PREDICATE UTILITY FUNCTIONS.
    /**
     * Returns a definition containing information inferred from the symbol.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {Object|null}
     */
    static parseInstrumentType(symbol) {
      if (!string(symbol)) {
        return null;
      }
      for (const parser of parsers) {
        const parsed = parser(symbol);
        if (parsed !== null) {
          return parsed;
        }
      }
      return null;
    }
    // SYMBOL CONVERSION FUNCTIONS.
    /**
     * Returns the equivalent symbol recognized by internal quote producers.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {string|null}
     */
    static getProducerSymbol(symbol) {
      if (!string(symbol)) {
        return null;
      }
      for (const converter of converters) {
        const converted = converter(symbol);
        if (converted !== null) {
          return converted;
        }
      }
      return null;
    }
    /**
     * Converts a concrete futures symbol to a two-digit-year format.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {string|null}
     */
    static getFuturesExplicitFormat(symbol) {
      if (!(_SymbolParser.getIsFuture(symbol) && _SymbolParser.getIsConcrete(symbol))) {
        return null;
      }
      const parsed = _SymbolParser.parseInstrumentType(symbol);
      if (parsed === null) {
        return null;
      }
      return `${parsed.root}${parsed.month}${padLeft(Math.floor(parsed.year % 100).toString(), 2, "0")}`;
    }
    /**
     * Converts a futures option symbol from database format to pipeline format.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {string|null}
     */
    static getFuturesOptionPipelineFormat(symbol) {
      const parsed = _SymbolParser.parseInstrumentType(symbol);
      if (parsed === null || parsed.type !== "future_option") {
        return null;
      }
      const putCallCharacter = getPutCallCharacter(parsed.option_type);
      return `${parsed.root}${parsed.month}${getYearDigits(parsed.year, 1)}|${parsed.strike}${putCallCharacter}`;
    }
    /**
     * Determines the expiration year represented by a futures year and month code.
     *
     * @public
     * @static
     * @param {string} yearString
     * @param {string=} monthCode
     * @returns {number}
     */
    static getFuturesYear(yearString, monthCode) {
      return getFuturesYear(yearString, monthCode);
    }
    /**
     * Returns true when prices for a symbol should be displayed as percentages.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static displayUsingPercent(symbol) {
      return string(symbol) && predicates.percent.test(symbol);
    }
    /**
     * @returns {string}
     */
    toString() {
      return "[SymbolParser]";
    }
  };
  var distantFuturesMonths = {
    F: "A",
    G: "B",
    H: "C",
    J: "D",
    K: "E",
    M: "I",
    N: "L",
    Q: "O",
    U: "P",
    V: "R",
    X: "S",
    Z: "T"
  };
  var alternateFuturesMonths = {
    A: "F",
    B: "G",
    C: "H",
    D: "J",
    E: "K",
    I: "M",
    L: "N",
    O: "Q",
    P: "U",
    R: "V",
    S: "X",
    T: "Z"
  };
  var futuresMonthNumbers = {
    F: 1,
    G: 2,
    H: 3,
    J: 4,
    K: 5,
    M: 6,
    N: 7,
    Q: 8,
    U: 9,
    V: 10,
    X: 11,
    Z: 12
  };
  var predicates = {};
  predicates.bats = /^(.*)\.BZ$/i;
  predicates.percent = /(\.RT)$/;
  predicates.pit = /\(P(it)?\)/;
  var types2 = {};
  types2.bids = /^([A-Z]{2})([B|P])([A-Z\d]{3,4})-(\d+)-(\d+)(\.CM)$/i;
  types2.c3 = {};
  types2.c3.alias = /^(C3:)(.*)$/i;
  types2.c3.concrete = /(\.C3)$/i;
  types2.cmdty = {};
  types2.cmdty.stats = /(\.CS)$/i;
  types2.cmdty.internal = /(\.CM)$/i;
  types2.cmdty.external = /(\.CP)$/i;
  types2.crypto = /^\^([A-Z]{3})([A-Z]{3,4})$/i;
  types2.equities = {};
  types2.equities.options = /^([A-Z$][A-Z-]{0,}(\.[A-Z]{1})?)([0-9]?)(\.[A-Z]{2})?\|([0-9]{4})([0-9]{2})([0-9]{2})\|([0-9]+\.[0-9]+)[P|W]?([CP])/i;
  types2.forex = /^\^([A-Z]{3})([A-Z]{3})$/i;
  types2.funds = {};
  types2.funds.canadian = /(.*)(\.CF)$/i;
  types2.futures = {};
  types2.futures.alias = /^([A-Z][A-Z0-9$!.-]{0,3})(\*)([0-9]{1,2})$/i;
  types2.futures.concrete = /^([A-Z][A-Z0-9$!.-]{0,3})([A-Z])([0-9]{4}|[0-9]{1,2})$/i;
  types2.futures.spread = /^_S_/i;
  types2.futures.cash = /(.*)(Y00)$/;
  types2.futures.options = {};
  types2.futures.options.historical = /^([A-Z][A-Z0-9$!.-]{0,3})([A-Z])([0-9]{2})([0-9]{1,5})([CP])$/i;
  types2.futures.options.long = /^([A-Z][A-Z0-9$!.-]{0,3})([A-Z])([0-9]{1,4})\|(-?[0-9]{1,5})([CP])$/i;
  types2.futures.options.short = /^([A-Z][A-Z0-9$!.-]?)([A-Z])([0-9]{1,4})([A-Z])$/i;
  types2.indicies = {};
  types2.indicies.external = /^\$(.*)$/i;
  types2.indicies.sector = /^-(.*)$/i;
  types2.platts = {};
  types2.platts.alias = /^(PLATTS:)(.*)$/i;
  types2.platts.concrete = /^(.*)(\.PT)$/i;
  function getCurrentMonth() {
    return (/* @__PURE__ */ new Date()).getMonth() + 1;
  }
  function getCurrentYear() {
    return (/* @__PURE__ */ new Date()).getFullYear();
  }
  function getYearDigits(year, digits) {
    const yearString = year.toString();
    return yearString.substring(yearString.length - digits, yearString.length);
  }
  function getFuturesMonth(monthString) {
    return alternateFuturesMonths[monthString] || monthString;
  }
  function getFuturesYear(yearString, monthCode) {
    const currentYear = getCurrentYear();
    let year = parseInt(yearString);
    if (year === 0 && monthCode === "Y") {
      year = Math.floor(currentYear / 100) * 100 + 100;
    } else if (year < 10 && yearString.length === 1) {
      const bump = year < currentYear % 10 ? 1 : 0;
      year = Math.floor(currentYear / 10) * 10 + year + bump * 10;
    } else if (year < 100) {
      year = Math.floor(currentYear / 100) * 100 + year;
      if (currentYear + 25 < year) {
        year = year - 100;
      }
    }
    return year;
  }
  function getPutCallCharacter(optionType) {
    if (optionType === "call") {
      return "C";
    } else if (optionType === "put") {
      return "P";
    }
    return null;
  }
  var parsers = [
    (symbol) => {
      if (!types2.futures.spread.test(symbol)) {
        return null;
      }
      return { symbol, type: "future_spread" };
    },
    (symbol) => {
      const match = symbol.match(types2.futures.concrete);
      if (match === null) {
        return null;
      }
      return { symbol, type: "future", asset: AssetClass.FUTURE, dynamic: false, root: match[1], month: match[2], year: getFuturesYear(match[3], match[2]) };
    },
    (symbol) => {
      const match = symbol.match(types2.futures.alias);
      if (match === null) {
        return null;
      }
      return { symbol, type: "future", asset: AssetClass.FUTURE, dynamic: true, root: match[1], dynamicCode: match[3] };
    },
    (symbol) => {
      const match = symbol.match(types2.futures.options.short);
      if (match === null) {
        return null;
      }
      const putCallCharacterCode = match[4].charCodeAt(0);
      const putCharacterCode = 80;
      const callCharacterCode = 67;
      const call = putCallCharacterCode < putCharacterCode;
      return { symbol, type: "future_option", asset: AssetClass.FUTURE_OPTION, option_type: call ? "call" : "put", strike: parseInt(match[3]), root: match[1], month: match[2], year: getCurrentYear() + putCallCharacterCode - (call ? callCharacterCode : putCharacterCode) };
    },
    (symbol) => {
      const match = symbol.match(types2.futures.options.long) || symbol.match(types2.futures.options.historical);
      if (match === null) {
        return null;
      }
      return { symbol, type: "future_option", asset: AssetClass.FUTURE_OPTION, option_type: match[5] === "C" ? "call" : "put", strike: parseInt(match[4]), root: match[1], month: getFuturesMonth(match[2]), year: getFuturesYear(match[3]) };
    },
    (symbol) => {
      if (!types2.forex.test(symbol)) {
        return null;
      }
      return { symbol, type: "forex", asset: AssetClass.FOREX };
    },
    (symbol) => {
      const match = symbol.match(types2.equities.options);
      if (match === null) {
        return null;
      }
      const suffix = typeof match[4] !== "undefined" ? match[4] : "";
      return { symbol, type: "equity_option", asset: AssetClass.STOCK_OPTION, option_type: match[9] === "C" ? "call" : "put", strike: parseFloat(match[8]), root: `${match[1]}${suffix}`, month: parseInt(match[6]), day: parseInt(match[7]), year: parseInt(match[5]), adjusted: match[3] !== "" };
    },
    (symbol) => {
      if (!types2.indicies.external.test(symbol)) {
        return null;
      }
      return { symbol, type: "index" };
    },
    (symbol) => {
      if (!types2.indicies.sector.test(symbol)) {
        return null;
      }
      return { symbol, type: "sector" };
    },
    (symbol) => {
      if (!types2.cmdty.stats.test(symbol)) {
        return null;
      }
      return { symbol, type: "cmdtyStats", asset: AssetClass.CMDTY_STATS };
    }
  ];
  var converters = [
    (symbol) => {
      if (!(SymbolParser.getIsFuture(symbol) && SymbolParser.getIsConcrete(symbol))) {
        return null;
      }
      const matches = symbol.match(types2.futures.concrete);
      if (matches === null) {
        return null;
      }
      const root = matches[1];
      const month = matches[2];
      const year = getFuturesYear(matches[3], month);
      if (year > getCurrentYear() + 9) {
        const distant = distantFuturesMonths[month];
        if (distant) {
          return `${root}${distant}${getYearDigits(year, 1)}`;
        }
      }
      return null;
    },
    (symbol) => {
      if (!(SymbolParser.getIsFuture(symbol) && SymbolParser.getIsConcrete(symbol))) {
        return null;
      }
      return symbol.replace(/(.{1,4})([A-Z]{1})([0-9]{3}|[0-9]{1})?([0-9]{1})$/i, "$1$2$4") || null;
    },
    (symbol) => {
      if (!SymbolParser.getIsFutureOption(symbol)) {
        return null;
      }
      const parsed = SymbolParser.parseInstrumentType(symbol);
      if (parsed === null) {
        return null;
      }
      const putCallCharacter = getPutCallCharacter(parsed.option_type);
      if (parsed.root.length < 3) {
        const putCallCharacterCode = putCallCharacter.charCodeAt(0);
        return `${parsed.root}${parsed.month}${parsed.strike}${String.fromCharCode(putCallCharacterCode + parsed.year - getCurrentYear())}`;
      }
      return `${parsed.root}${parsed.month}${getYearDigits(parsed.year, 1)}|${parsed.strike}${putCallCharacter}`;
    },
    (symbol) => {
      return types2.c3.alias.test(symbol) ? symbol.replace(types2.c3.alias, "$2.C3") : null;
    },
    (symbol) => {
      return types2.platts.alias.test(symbol) ? symbol.replace(types2.platts.alias, "$2.PT") : null;
    },
    (symbol) => {
      return symbol;
    }
  ];
  var SymbolParser_default = SymbolParser;

  // test/specs/format/specialized/cmdtyViewSpec.js
  var ZBM2_1500C = { ...SymbolParser_default.parseInstrumentType("ZBM2|1500C"), unitCode: "5" };
  var ZNM2_1230C = { ...SymbolParser_default.parseInstrumentType("ZNM2|1230C"), unitCode: "5" };
  var ZTM2_1060C = { ...SymbolParser_default.parseInstrumentType("ZTM2|1060C"), unitCode: "6" };
  var ZFM2_1147C = { ...SymbolParser_default.parseInstrumentType("ZFM2|1147C"), unitCode: "6" };
  describe("when formatting prices for a ZB options", () => {
    it("formats 0.5 as 0-32 (using sixty-fourths)", () => {
      expect(formatForCmdtyView(0.5, ZBM2_1500C.unitCode, ZBM2_1500C)).toEqual("0-32");
    });
    it("formats 0.984375 as 0-63 (using sixty-fourths)", () => {
      expect(formatForCmdtyView(0.984375, ZBM2_1500C.unitCode, ZBM2_1500C)).toEqual("0-63");
    });
  });
  describe("when formatting prices for a ZN option", () => {
    it("formats 0.5 as 0-32 (using sixty-fourths)", () => {
      expect(formatForCmdtyView(0.5, ZNM2_1230C.unitCode, ZNM2_1230C)).toEqual("0-32");
    });
    it("formats 0.984375 as 0-63 (using sixty-fourths)", () => {
      expect(formatForCmdtyView(0.984375, ZNM2_1230C.unitCode, ZNM2_1230C)).toEqual("0-63");
    });
  });
  describe("when formatting prices for a ZT options", () => {
    it("formats 0.5 as 0-320 (using halves of sixty-fourths)", () => {
      expect(formatForCmdtyView(0.5, ZTM2_1060C.unitCode, ZTM2_1060C)).toEqual("0-320");
    });
    it("formats 0.9921875 as 0-635 (using halves of sixty-fourths)", () => {
      expect(formatForCmdtyView(0.9921875, ZTM2_1060C.unitCode, ZTM2_1060C)).toEqual("0-635");
    });
  });
  describe("when formatting prices for a ZF options", () => {
    it("formats 0.5 as 0-320 (using halves of sixty-fourths)", () => {
      expect(formatForCmdtyView(0.5, ZFM2_1147C.unitCode, ZFM2_1147C)).toEqual("0-320");
    });
    it("formats 0.9921875 as 0-635 (using halves of sixty-fourths)", () => {
      expect(formatForCmdtyView(0.9921875, ZFM2_1147C.unitCode, ZFM2_1147C)).toEqual("0-635");
    });
  });
  describe("Independent instrument metadata", () => {
    it("recognizes legacy enum instances by their asset identifier", () => {
      expect(formatForCmdtyView(0.984375, "5", { asset: { id: 12 }, root: "ZB" })).toEqual("0-63");
    });
    it("applies Treasury rules to weekly option roots", () => {
      for (const root of ["BB1", "BN2"]) {
        expect(formatForCmdtyView(0.984375, "5", { asset: { id: 12 }, root })).toEqual("0-63");
      }
      for (const root of ["BT1", "BF2"]) {
        expect(formatForCmdtyView(0.9921875, "6", { asset: { id: 12 }, root })).toEqual("0-635");
      }
    });
    it("uses normal tick notation without a matching future-option asset", () => {
      for (const asset of [void 0, null, { id: 2 }]) {
        expect(formatForCmdtyView(0.984375, "5", { asset, root: "ZB" })).toEqual("0-315");
      }
    });
  });

  // test/specs/symbology/SymbolParserSpec.js
  describe("SymbolParser", () => {
    describe("parseInstrumentType", () => {
      it("parses concrete futures", () => {
        expect(SymbolParser_default.parseInstrumentType("ESM08")).toEqual({
          symbol: "ESM08",
          type: "future",
          asset: AssetClass.FUTURE,
          dynamic: false,
          root: "ES",
          month: "M",
          year: 2008
        });
      });
      it("parses reference futures", () => {
        expect(SymbolParser_default.parseInstrumentType("NG*13")).toEqual({
          symbol: "NG*13",
          type: "future",
          asset: AssetClass.FUTURE,
          dynamic: true,
          root: "NG",
          dynamicCode: "13"
        });
      });
      it("parses futures with four-character roots", () => {
        expect(SymbolParser_default.parseInstrumentType("SAAPU26")).toEqual({
          symbol: "SAAPU26",
          type: "future",
          asset: AssetClass.FUTURE,
          dynamic: false,
          root: "SAAP",
          month: "U",
          year: 2026
        });
      });
      it("parses cash futures", () => {
        expect(SymbolParser_default.parseInstrumentType("SPY00")).toEqual({
          symbol: "SPY00",
          type: "future",
          asset: AssetClass.FUTURE,
          dynamic: false,
          root: "SP",
          month: "Y",
          year: 2100
        });
      });
      it("parses foreign exchange symbols", () => {
        expect(SymbolParser_default.parseInstrumentType("^EURUSD")).toEqual({
          symbol: "^EURUSD",
          type: "forex",
          asset: AssetClass.FOREX
        });
      });
      it("parses indexes", () => {
        expect(SymbolParser_default.parseInstrumentType("$DOWI")).toEqual({
          symbol: "$DOWI",
          type: "index"
        });
      });
      it("parses sectors", () => {
        expect(SymbolParser_default.parseInstrumentType("-001A")).toEqual({
          symbol: "-001A",
          type: "sector"
        });
      });
      it("parses futures spreads", () => {
        expect(SymbolParser_default.parseInstrumentType("_S_SP_ZCH7_ZCK7")).toEqual({
          symbol: "_S_SP_ZCH7_ZCK7",
          type: "future_spread"
        });
      });
      it("parses futures options in database format", () => {
        expect(SymbolParser_default.parseInstrumentType("ESZ2660Q")).toEqual(jasmine.objectContaining({
          symbol: "ESZ2660Q",
          type: "future_option",
          asset: AssetClass.FUTURE_OPTION,
          option_type: "put",
          strike: 2660,
          root: "ES",
          month: "Z"
        }));
      });
      it("parses futures options in pipeline format", () => {
        expect(SymbolParser_default.parseInstrumentType("ZWH9|470C")).toEqual(jasmine.objectContaining({
          symbol: "ZWH9|470C",
          type: "future_option",
          asset: AssetClass.FUTURE_OPTION,
          option_type: "call",
          strike: 470,
          root: "ZW",
          month: "H",
          year: 2029
        }));
      });
      it("parses equity options", () => {
        expect(SymbolParser_default.parseInstrumentType("AAPL|20200515|250.00P")).toEqual({
          symbol: "AAPL|20200515|250.00P",
          type: "equity_option",
          asset: AssetClass.STOCK_OPTION,
          option_type: "put",
          strike: 250,
          root: "AAPL",
          month: 5,
          day: 15,
          year: 2020,
          adjusted: false
        });
      });
      it("parses adjusted equity options", () => {
        expect(SymbolParser_default.parseInstrumentType("HBM2.TO|20220121|1.00C")).toEqual(jasmine.objectContaining({
          type: "equity_option",
          root: "HBM.TO",
          adjusted: true
        }));
      });
      it("parses cmdtyStats instruments", () => {
        expect(SymbolParser_default.parseInstrumentType("AE030UBX.CS")).toEqual({
          symbol: "AE030UBX.CS",
          type: "cmdtyStats",
          asset: AssetClass.CMDTY_STATS
        });
      });
      it("returns null when a symbol type cannot be inferred", () => {
        expect(SymbolParser_default.parseInstrumentType("IBM")).toBeNull();
      });
      it("returns null for a non-string symbol", () => {
        expect(SymbolParser_default.parseInstrumentType(null)).toBeNull();
      });
    });
    describe("type predicates", () => {
      it("identifies concrete symbols", () => {
        expect(SymbolParser_default.getIsConcrete("ESZ6")).toEqual(true);
      });
      it("rejects reference symbols as concrete", () => {
        expect(SymbolParser_default.getIsConcrete("ES*1")).toEqual(false);
      });
      it("identifies reference symbols", () => {
        expect(SymbolParser_default.getIsReference("ES*1")).toEqual(true);
      });
      it("identifies futures", () => {
        expect(SymbolParser_default.getIsFuture("O!H2017")).toEqual(true);
      });
      it("rejects non-futures", () => {
        expect(SymbolParser_default.getIsFuture("IBM")).toEqual(false);
      });
      it("identifies cash futures", () => {
        expect(SymbolParser_default.getIsFutureCash("ESY00")).toEqual(true);
      });
      it("identifies futures spreads", () => {
        expect(SymbolParser_default.getIsFutureSpread("_S_SP_ZCH7_ZCK7")).toEqual(true);
      });
      it("identifies futures options", () => {
        expect(SymbolParser_default.getIsFutureOption("ZWH9|470C")).toEqual(true);
      });
      it("identifies foreign exchange symbols", () => {
        expect(SymbolParser_default.getIsForex("^EURUSD")).toEqual(true);
      });
      it("identifies cryptocurrency symbols", () => {
        expect(SymbolParser_default.getIsCrypto("^BTCUSDT")).toEqual(true);
      });
      it("identifies indexes", () => {
        expect(SymbolParser_default.getIsIndex("$DOWI")).toEqual(true);
      });
      it("identifies sectors", () => {
        expect(SymbolParser_default.getIsSector("-001A")).toEqual(true);
      });
      it("identifies Canadian funds", () => {
        expect(SymbolParser_default.getIsCanadianFund("VIC400.CF")).toEqual(true);
      });
      it("identifies internal cmdty symbols", () => {
        expect(SymbolParser_default.getIsCmdty("ZCPAUS.CM")).toEqual(true);
      });
      it("identifies external cmdty symbols", () => {
        expect(SymbolParser_default.getIsCmdty("SCB001.CP")).toEqual(true);
      });
      it("identifies cmdtyStats symbols", () => {
        expect(SymbolParser_default.getIsCmdtyStats("AE030UBX.CS")).toEqual(true);
      });
      it("identifies BATS symbols", () => {
        expect(SymbolParser_default.getIsBats("AAPL.BZ")).toEqual(true);
      });
      it("identifies equity options", () => {
        expect(SymbolParser_default.getIsEquityOption("AAPL|20200515|250.00P")).toEqual(true);
      });
      it("identifies Commodity3 aliases", () => {
        expect(SymbolParser_default.getIsC3("C3:AL79MRM1")).toEqual(true);
      });
      it("identifies concrete Commodity3 symbols", () => {
        expect(SymbolParser_default.getIsC3("AL79MRM1.C3")).toEqual(true);
      });
      it("identifies Platts aliases", () => {
        expect(SymbolParser_default.getIsPlatts("PLATTS:AAVSV00")).toEqual(true);
      });
      it("identifies concrete Platts symbols", () => {
        expect(SymbolParser_default.getIsPlatts("AAVSV00.PT")).toEqual(true);
      });
      it("identifies grain bid symbols", () => {
        expect(SymbolParser_default.getIsGrainBid("USBCORN-123-456.CM")).toEqual(true);
      });
      it("identifies pit instruments using their names", () => {
        expect(SymbolParser_default.getIsPit("ZCZ6", "Corn (Pit)")).toEqual(true);
      });
      it("rejects non-pit instruments using their names", () => {
        expect(SymbolParser_default.getIsPit("ZCZ6", "Corn")).toEqual(false);
      });
      it("identifies percentage symbols", () => {
        expect(SymbolParser_default.displayUsingPercent("US10Y.RT")).toEqual(true);
      });
      it("rejects non-percentage symbols", () => {
        expect(SymbolParser_default.displayUsingPercent("US10Y")).toEqual(false);
      });
      it("identifies expired symbols", () => {
        expect(SymbolParser_default.getIsExpired("ESM08")).toEqual(true);
      });
      it("identifies unexpired symbols", () => {
        expect(SymbolParser_default.getIsExpired("ESZ47")).toEqual(false);
      });
      it("does not identify undated symbols as expired", () => {
        expect(SymbolParser_default.getIsExpired("IBM")).toEqual(false);
      });
    });
    describe("normalization", () => {
      it("converts futures to explicit format", () => {
        expect(SymbolParser_default.getFuturesExplicitFormat("ESZ9")).toEqual("ESZ29");
      });
      it("does not convert reference futures to explicit format", () => {
        expect(SymbolParser_default.getFuturesExplicitFormat("ES*1")).toBeNull();
      });
      it("does not convert non-futures to explicit format", () => {
        expect(SymbolParser_default.getFuturesExplicitFormat("IBM")).toBeNull();
      });
      it("normalizes producer symbols with four-digit years", () => {
        expect(SymbolParser_default.getProducerSymbol("ESZ2029")).toEqual("ESZ9");
      });
      it("normalizes four-character producer symbols with four-digit years", () => {
        expect(SymbolParser_default.getProducerSymbol("SAAPU2026")).toEqual("SAAPU6");
      });
      it("normalizes four-character producer symbols with two-digit years", () => {
        expect(SymbolParser_default.getProducerSymbol("SAAPU26")).toEqual("SAAPU6");
      });
      it("preserves normalized producer symbols", () => {
        expect(SymbolParser_default.getProducerSymbol("SAAPU6")).toEqual("SAAPU6");
      });
      it("normalizes Commodity3 aliases", () => {
        expect(SymbolParser_default.getProducerSymbol("C3:AL79MRM1")).toEqual("AL79MRM1.C3");
      });
      it("normalizes Platts aliases", () => {
        expect(SymbolParser_default.getProducerSymbol("PLATTS:AAVSV00")).toEqual("AAVSV00.PT");
      });
      it("preserves symbols without a specialized producer format", () => {
        expect(SymbolParser_default.getProducerSymbol("IBM")).toEqual("IBM");
      });
      it("returns null when normalizing a non-string producer symbol", () => {
        expect(SymbolParser_default.getProducerSymbol(null)).toBeNull();
      });
      it("converts futures options to pipeline format", () => {
        expect(SymbolParser_default.getFuturesOptionPipelineFormat("ZWH29|470C")).toEqual("ZWH9|470C");
      });
      it("calculates a future year from a two-digit year", () => {
        spyOn(Date.prototype, "getFullYear").and.returnValue(2022);
        expect(SymbolParser_default.getFuturesYear("29", "Z")).toEqual(2029);
      });
      it("calculates a past year from a two-digit year", () => {
        spyOn(Date.prototype, "getFullYear").and.returnValue(2022);
        expect(SymbolParser_default.getFuturesYear("48", "Z")).toEqual(1948);
      });
      it("preserves a four-digit futures year", () => {
        spyOn(Date.prototype, "getFullYear").and.returnValue(2022);
        expect(SymbolParser_default.getFuturesYear("2032", "Z")).toEqual(2032);
      });
    });
    it("has a useful string representation", () => {
      expect(new SymbolParser_default().toString()).toEqual("[SymbolParser]");
    });
  });
})();
