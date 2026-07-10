(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all3) => {
    for (var name in all3)
      __defProp(target, name, { get: all3[name], enumerable: true });
  };

  // lang/is.js
  function number(candidate) {
    return typeof candidate === "number" && !isNaN(candidate);
  }
  function nan(candidate) {
    return typeof candidate === "number" && isNaN(candidate);
  }
  function integer(candidate) {
    return typeof candidate === "number" && !isNaN(candidate) && (candidate | 0) === candidate;
  }
  function large(candidate) {
    return typeof candidate === "number" && !isNaN(candidate) && isFinite(candidate) && Math.floor(candidate) === candidate;
  }
  function positive(candidate) {
    return number(candidate) && candidate > 0;
  }
  function negative(candidate) {
    return number(candidate) && candidate < 0;
  }
  function iterable(candidate) {
    return !nil(candidate) && !undef(candidate) && fn(candidate[Symbol.iterator]);
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
  function object(candidate) {
    return typeof candidate === "object" && candidate !== null;
  }
  function nil(candidate) {
    return candidate === null;
  }
  function undef(candidate) {
    return candidate === void 0;
  }
  function zeroLengthString(candidate) {
    return string(candidate) && candidate.length === 0;
  }
  function extension(parent, child) {
    return fn(parent) && fn(child) && child.prototype instanceof parent;
  }

  // lang/assert.js
  var nativeTypes = [String, Number, Function, Boolean, Date, Array, Object, RegExp];
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
  function argumentIsArray(variable, variableName, itemConstraint, itemConstraintDescription) {
    argumentIsRequired(variable, variableName, Array);
    if (itemConstraint) {
      let itemValidator;
      if (nativeTypes.includes(itemConstraint)) {
        itemValidator = (value, index) => checkArgumentType(value, variableName, itemConstraint, itemConstraintDescription, index);
      } else {
        itemValidator = (value, index) => {
          if (itemConstraint.prototype !== void 0 && value instanceof itemConstraint) {
            return;
          }
          itemConstraint(value, `${variableName}[${index}]`);
        };
      }
      variable.forEach((v, i) => {
        itemValidator(v, i);
      });
    }
  }
  function argumentIsValid(variable, variableName, predicate, predicateDescription) {
    if (!predicate(variable)) {
      throwCustomValidationError(variableName, predicateDescription);
    }
  }
  function areEqual(a, b, descriptionA, descriptionB) {
    if (a !== b) {
      throw new Error(`The objects must be equal [${descriptionA || a.toString()}] and [${descriptionB || b.toString()}]`);
    }
  }
  function areNotEqual(a, b, descriptionA, descriptionB) {
    if (a === b) {
      throw new Error(`The objects cannot be equal [${descriptionA || a.toString()}] and [${descriptionB || b.toString()}]`);
    }
  }

  // lang/Enum.js
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

  // lang/attributes.js
  function getPropertyNameArray(propertyNames, separator = ".") {
    let returnRef;
    if (array(propertyNames)) {
      returnRef = propertyNames;
    } else {
      returnRef = propertyNames.split(separator);
    }
    return returnRef;
  }
  function getPropertyTarget(target, propertyNameArray, create2) {
    let propertyTarget = target;
    for (let i = 0; i < propertyNameArray.length - 1; i++) {
      let propertyName = propertyNameArray[i];
      if (Object.prototype.hasOwnProperty.call(propertyTarget, propertyName) && !nil(propertyTarget[propertyName]) && !undef(propertyTarget[propertyName])) {
        propertyTarget = propertyTarget[propertyName];
      } else if (create2) {
        propertyTarget = propertyTarget[propertyName] = {};
      } else {
        propertyTarget = null;
        break;
      }
    }
    return propertyTarget;
  }
  function last(array2) {
    if (array2.length !== 0) {
      return array2[array2.length - 1];
    } else {
      return null;
    }
  }
  function has(target, propertyNames, separator) {
    argumentIsRequired(target, "target", Object);
    if (array(propertyNames)) {
      argumentIsArray(propertyNames, "propertyNames", String);
    } else {
      argumentIsRequired(propertyNames, "propertyNames", String);
    }
    const propertyNameArray = getPropertyNameArray(propertyNames, separator);
    const propertyTarget = getPropertyTarget(target, propertyNameArray, false);
    return propertyTarget !== null && Object.prototype.hasOwnProperty.call(propertyTarget, last(propertyNameArray));
  }
  function read(target, propertyNames, separator) {
    argumentIsRequired(target, "target", Object);
    if (array(propertyNames)) {
      argumentIsArray(propertyNames, "propertyNames", String);
    } else {
      argumentIsRequired(propertyNames, "propertyNames", String);
    }
    const propertyNameArray = getPropertyNameArray(propertyNames, separator);
    const propertyTarget = getPropertyTarget(target, propertyNameArray, false);
    let returnRef;
    if (propertyTarget) {
      const propertyName = last(propertyNameArray);
      returnRef = propertyTarget[propertyName];
    } else {
      returnRef = void 0;
    }
    return returnRef;
  }
  function write(target, propertyNames, value, separator) {
    argumentIsRequired(target, "target", Object);
    if (array(propertyNames)) {
      argumentIsArray(propertyNames, "propertyNames", String);
    } else {
      argumentIsRequired(propertyNames, "propertyNames", String);
    }
    const propertyNameArray = getPropertyNameArray(propertyNames, separator);
    const propertyTarget = getPropertyTarget(target, propertyNameArray, true);
    const propertyName = last(propertyNameArray);
    propertyTarget[propertyName] = value;
  }
  function erase(target, propertyNames, separator) {
    if (!has(target, propertyNames)) {
      return;
    }
    const propertyNameArray = getPropertyNameArray(propertyNames, separator);
    const propertyTarget = getPropertyTarget(target, propertyNameArray, true);
    const propertyName = last(propertyNameArray);
    delete propertyTarget[propertyName];
  }

  // api/failures/FailureType.js
  var FailureType = class _FailureType extends Enum {
    #template;
    #severe;
    #error;
    #verbose;
    /**
     * @param {string} code - The enumeration code (and description).
     * @param {string} template - The template string for formatting human-readable messages.
     * @param {boolean=} severe - Indicates if the failure is severe (default is true).
     * @param {number=} error - The HTTP error code which should be used as part of an HTTP response.
     * @param {boolean=} verbose - Indicates if data object should be included when serialized.
     */
    constructor(code, template, severe, error, verbose) {
      super(code, code);
      argumentIsRequired(template, "template", String);
      argumentIsOptional(severe, "severe", Boolean);
      argumentIsOptional(error, "error", Number);
      argumentIsOptional(verbose, "verbose", Boolean);
      this.#template = template;
      if (boolean(severe)) {
        this.#severe = severe;
      } else {
        this.#severe = true;
      }
      this.#error = error || null;
      this.#verbose = verbose || false;
    }
    /**
     * The template string for formatting human-readable messages.
     *
     * @public
     * @returns {string}
     */
    get template() {
      return this.#template;
    }
    /**
     * Indicates if the failure is serious.
     *
     * @public
     * @return {boolean}
     */
    get severe() {
      return this.#severe;
    }
    /**
     * The HTTP error code which should be used as part of an HTTP response.
     *
     * @public
     * @return {number|null}
     */
    get error() {
      return this.#error;
    }
    /**
     * Indicates if data object should be included when serialized.
     *
     * @public
     * @return {boolean}
     */
    get verbose() {
      return this.#verbose;
    }
    /**
     * One or more data points is missing.
     *
     * @public
     * @static
     * @returns {FailureType}
     */
    static get REQUEST_CONSTRUCTION_FAILURE() {
      return requestConstructionFailure;
    }
    /**
     * A data point is missing.
     *
     * @public
     * @static
     * @returns {FailureType}
     */
    static get REQUEST_PARAMETER_MISSING() {
      return requestParameterMissing;
    }
    /**
     * A data point is malformed.
     *
     * @public
     * @static
     * @returns {FailureType}
     */
    static get REQUEST_PARAMETER_MALFORMED() {
      return requestParameterMalformed;
    }
    /**
     * User identity could not be determined.
     *
     * @public
     * @static
     * @returns {FailureType}
     */
    static get REQUEST_IDENTITY_FAILURE() {
      return requestIdentifyFailure;
    }
    /**
     * User authorization failed.
     *
     * @public
     * @static
     * @returns {FailureType}
     */
    static get REQUEST_AUTHORIZATION_FAILURE() {
      return requestAuthorizationFailure;
    }
    /**
     * The request data cannot be parsed or interpreted.
     *
     * @public
     * @static
     * @returns {FailureType}
     */
    static get REQUEST_INPUT_MALFORMED() {
      return requestInputMalformed;
    }
    /**
     * The request failed for unspecified reasons.
     *
     * @public
     * @static
     * @returns {FailureType}
     */
    static get SCHEMA_VALIDATION_FAILURE() {
      return schemaValidationFailure;
    }
    /**
     * The request failed for unspecified reasons.
     *
     * @public
     * @static
     * @returns {FailureType}
     */
    static get REQUEST_GENERAL_FAILURE() {
      return requestGeneralFailure;
    }
    /**
     * Insufficient permission level to access the resource.
     *
     * @public
     * @static
     * @returns {FailureType}
     */
    static get ENTITLEMENTS_FAILED() {
      return entitlementsFailed;
    }
    /**
     * Returns an HTTP status code that would be suitable for use with the
     * failure type.
     *
     * @public
     * @static
     * @param {FailureType} type
     * @returns {number}
     */
    static getHttpStatusCode(type) {
      argumentIsRequired(type, "type", _FailureType, "FailureType");
      let returnVal;
      if (type === _FailureType.REQUEST_IDENTITY_FAILURE) {
        returnVal = 401;
      } else if (type === _FailureType.REQUEST_AUTHORIZATION_FAILURE) {
        returnVal = 403;
      } else {
        returnVal = 400;
      }
      return returnVal;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[FailureType (code=${this.code})]`;
    }
  };
  var requestConstructionFailure = new FailureType("REQUEST_CONSTRUCTION_FAILURE", "An attempt to {L|root.endpoint.description} failed because some required information is missing.");
  var requestParameterMissing = new FailureType("REQUEST_PARAMETER_MISSING", 'The "{L|name}" field is required.');
  var requestParameterMalformed = new FailureType("REQUEST_PARAMETER_MALFORMED", 'The "{L|name}" field cannot be interpreted.');
  var requestIdentifyFailure = new FailureType("REQUEST_IDENTITY_FAILURE", "An attempt to {L|root.endpoint.description} failed because your identity could not be determined.");
  var requestAuthorizationFailure = new FailureType("REQUEST_AUTHORIZATION_FAILURE", "An attempt to {L|root.endpoint.description} failed. You are not authorized to perform this action.");
  var requestInputMalformed = new FailureType("REQUEST_INPUT_MALFORMED", "An attempt to {L|root.endpoint.description} failed, the data structure is invalid.");
  var schemaValidationFailure = new FailureType("SCHEMA_VALIDATION_FAILURE", 'An attempt to read {U|schema} data failed (found "{L|key}" when expecting "{L|name}")');
  var requestGeneralFailure = new FailureType("REQUEST_GENERAL_FAILURE", "An attempt to {L|root.endpoint.description} failed for unspecified reason(s).");
  var entitlementsFailed = new FailureType("ENTITLEMENTS_FAILED", "Action blocked. The current user requires elevated permissions or the current user has exceeded a quota.", false, 403, true);

  // api/failures/FailureReasonItem.js
  var FailureReasonItem = class {
    #type;
    #data;
    /**
     * @param {FailureType} type
     * @param {object=} data
     */
    constructor(type, data) {
      argumentIsRequired(type, "type", FailureType, "FailureType");
      this.#type = type;
      this.#data = data || null;
    }
    /**
     * The {@link FailureType} of the item.
     *
     * @public
     * @returns {FailureType}
     */
    get type() {
      return this.#type;
    }
    /**
     * The data.
     *
     * @public
     * @return {object}
     */
    get data() {
      return this.#data;
    }
    /**
     * Formats a human-readable message, describing the failure.
     *
     * @public
     * @param {object=} root - Root data from the {@link FailureReason}.
     * @returns {string}
     */
    format(root) {
      return this.#type.template.replace(tokenRegex, (full, ignored, casing, token) => {
        let tokenToUse;
        let dataToRead;
        if (token.startsWith(rootPrefix)) {
          tokenToUse = token.slice(rootLength);
          dataToRead = root;
        } else {
          tokenToUse = token;
          dataToRead = this.#data;
        }
        let replacement = read(dataToRead, tokenToUse);
        if (replacement) {
          if (casing === "l") {
            replacement = `${replacement.slice(0, 1).toLowerCase()}${replacement.slice(1)}`;
          } else if (casing === "u") {
            replacement = `${replacement.slice(0, 1).toUpperCase()}${replacement.slice(1)}`;
          } else if (casing === "U") {
            replacement = `${replacement.toUpperCase()}`;
          } else if (casing === "L") {
            replacement = `${replacement.toLowerCase()}`;
          }
        }
        return replacement;
      });
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[FailureReasonItem]";
    }
  };
  var tokenRegex = /{(([U|L|l|u])\|)?([a-zA-Z.]*)}/g;
  var rootPrefix = "root.";
  var rootLength = rootPrefix.length;

  // test/specs/api/failures/FailureReasonItemSpec.js
  describe("When a FailureType is created with a template string that references root level data", () => {
    "use strict";
    let code;
    let template;
    let type;
    beforeEach(() => {
      code = "TEST_ROOT";
      template = "This is a test of the {root.system} system.";
      type = Enum.fromCode(FailureType, code) || new FailureType(code, template);
    });
    describe("and a FailureReasonItem is created using this FailureType", () => {
      let item;
      let root;
      beforeEach(() => {
        root = {
          system: "Emergency Broadcast"
        };
        item = new FailureReasonItem(type, {});
      });
      describe("and the item is formatted", () => {
        let formatted;
        beforeEach(() => {
          formatted = item.format(root);
        });
        it("should match the expected output", () => {
          expect(formatted).toEqual("This is a test of the Emergency Broadcast system.");
        });
      });
    });
  });
  describe("When a FailureType is created with a template string that references with data points", () => {
    "use strict";
    let code;
    let template;
    let type;
    beforeEach(() => {
      code = "TEST_MULTIPLE";
      template = 'I believe that "{argument.thesis}" is a {argument.conclusion} statement.';
      type = Enum.fromCode(FailureType, code) || new FailureType(code, template);
    });
    describe("and a FailureReasonItem is created using this FailureType", () => {
      let item;
      let root;
      let data;
      beforeEach(() => {
        root = {};
        data = {
          argument: {
            thesis: "all cats are animals",
            conclusion: "true"
          }
        };
        item = new FailureReasonItem(type, data);
      });
      describe("and the item is formatted", () => {
        let formatted;
        beforeEach(() => {
          formatted = item.format(root);
        });
        it("should match the expected output", () => {
          expect(formatted).toEqual('I believe that "all cats are animals" is a true statement.');
        });
      });
    });
  });
  describe("When a FailureType is created with a template string that references data points with casing changes", () => {
    "use strict";
    let code;
    let template;
    let type;
    beforeEach(() => {
      code = "TEST_CASING";
      template = "The first letter is lowercase: {l|name}. The first letter is uppercase: {u|name}. All letters are lowercase: {L|name}. All letters are uppercase: {U|name}.";
      type = Enum.fromCode(FailureType, code) || new FailureType(code, template);
    });
    describe("and a FailureReasonItem is created using this FailureType", () => {
      let item;
      let root;
      let data;
      beforeEach(() => {
        root = {};
        data = {
          name: "Abraham Lincoln"
        };
        item = new FailureReasonItem(type, data);
      });
      describe("and the item is formatted", () => {
        let formatted;
        beforeEach(() => {
          formatted = item.format(root);
        });
        it("should match the expected output", () => {
          expect(formatted).toEqual("The first letter is lowercase: abraham Lincoln. The first letter is uppercase: Abraham Lincoln. All letters are lowercase: abraham lincoln. All letters are uppercase: ABRAHAM LINCOLN.");
        });
      });
    });
  });

  // lang/functions.js
  function tautology(x) {
    return x;
  }
  function getTautology() {
    return tautology;
  }

  // collections/LinkedList.js
  var LinkedList = class _LinkedList {
    #value;
    #next;
    /**
     * @param {*} value - The value of current node.
     */
    constructor(value) {
      this.#value = value;
      this.#next = null;
    }
    /**
     * Returns the value associated with the current node.
     *
     * @public
     * @returns {*}
     */
    getValue() {
      return this.#value;
    }
    /**
     * Returns the next node, if it exists; otherwise a null value is returned.
     *
     * @public
     * @returns {LinkedList|null}
     */
    getNext() {
      return this.#next;
    }
    /**
     * Returns true, if the node is the last one in the list.
     *
     * @public
     * @returns {boolean}
     */
    getIsTail() {
      return this.#next === null;
    }
    /**
     * Adds (or inserts) a value after the current node and returns
     * the newly added node.
     *
     * @public
     * @param {*} value
     * @returns {LinkedList}
     */
    insert(value) {
      const next = new _LinkedList(value);
      if (this.#next) {
        next.#next = this.#next;
      }
      this.#next = next;
      return next;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[LinkedList]";
    }
  };

  // collections/Tree.js
  var Tree = class _Tree {
    /**
     * @param {*} value - The value of the node.
     * @param {Tree=} parent - The parent node. If not supplied, this will be the root node.
     */
    constructor(value, parent) {
      this._value = value;
      this._parent = parent || null;
      this._children = [];
    }
    /**
     * Gets the root node.
     *
     * @public
     * @returns {Tree}
     */
    getRoot() {
      if (this.getIsRoot()) {
        return this;
      } else {
        return this._parent.getRoot();
      }
    }
    /**
     * Returns the parent node. If this is the root node, a null value is returned.
     *
     * @public
     * @returns {Tree|null}
     */
    getParent() {
      return this._parent;
    }
    /**
     * Returns the collection of children nodes.
     *
     * @public
     * @returns {Array<Tree>}
     */
    getChildren() {
      return this._children;
    }
    /**
     * Returns the value associated with the current node.
     *
     * @public
     * @returns {*}
     */
    getValue() {
      return this._value;
    }
    /**
     * Returns true if this node has no children; otherwise false.
     *
     * @public
     * @returns {boolean}
     */
    getIsLeaf() {
      return this._children.length === 0;
    }
    /**
     * Returns true if this node has children; otherwise false.
     *
     * @public
     * @returns {boolean}
     */
    getIsInner() {
      return this._children.length !== 0;
    }
    /**
     * Returns true if this node has no parent; otherwise false.
     *
     * @public
     * @returns {boolean}
     */
    getIsRoot() {
      return this._parent === null;
    }
    /**
     * Adds a child node to the current node and returns a reference
     * to the child node.
     *
     * @public
     * @param {*} value - The value of the child.
     * @returns {Tree}
     */
    addChild(value) {
      const returnRef = new _Tree(value, this);
      this._children.push(returnRef);
      return returnRef;
    }
    /**
     * Removes a child node.
     *
     * @public
     * @param {Tree} node - The child to remove.
     */
    removeChild(node) {
      for (let i = this._children.length - 1; !(i < 0); i--) {
        const child = this._children[i];
        if (child === node) {
          this._children.splice(i, 1);
          child._parent = null;
          child._children = [];
          break;
        }
      }
    }
    /**
     * Removes the current node from the parent tree. Use on a root node
     * has no effect.
     *
     * @public
     */
    sever() {
      if (this.getIsRoot()) {
        return;
      }
      this.getParent().removeChild(this);
    }
    /**
     * Searches the children nodes for the first child node that matches the
     * predicate.
     *
     * @public
     * @param {nodePredicate} predicate - A predicate that tests each child node. The predicate takes two arguments -- the node's value, and the node itself.
     * @returns {Tree|null}
     */
    findChild(predicate) {
      let returnRef = null;
      for (let i = 0; i < this._children.length; i++) {
        let child = this._children[i];
        if (predicate(child.getValue(), child)) {
          returnRef = child;
          break;
        }
      }
      return returnRef;
    }
    /**
     * Searches the tree recursively, starting with the current node.
     *
     * @public
     * @param {nodePredicate} predicate - A predicate that tests each child node. The predicate takes two arguments -- the node's value, and the node itself.
     * @param {boolean=} parentFirst - If true, the tree will be searched from parent-to-child (breadth first). Otherwise, child-to-parent (depth first).
     * @param {boolean=} includeCurrentNode - True, if the current node should be checked against the predicate.
     * @returns {Tree|null}
     */
    search(predicate, parentFirst, includeCurrentNode) {
      let returnRef = null;
      if (parentFirst && includeCurrentNode && predicate(this.getValue(), this)) {
        returnRef = this;
      }
      if (returnRef === null) {
        for (let i = 0; i < this._children.length; i++) {
          const child = this._children[i];
          returnRef = child.search(predicate, parentFirst, true);
          if (returnRef !== null) {
            break;
          }
        }
      }
      if (returnRef === null && !parentFirst && includeCurrentNode && predicate(this.getValue(), this)) {
        returnRef = this;
      }
      return returnRef;
    }
    /**
     * Walks the children of the current node, running an action on each node.
     *
     * @public
     * @param {nodeAction} walkAction - A action to apply to each node. The action takes two arguments -- the node's value, and the node itself.
     * @param {boolean=} parentFirst - If true, the tree will be searched from parent-to-child (breadth first). Otherwise, child-to-parent (depth first).
     * @param {boolean=} includeCurrentNode - True if the current node should be applied to the action.
     */
    walk(walkAction, parentFirst, includeCurrentNode) {
      const predicate = (value, node) => {
        walkAction(value, node);
        return false;
      };
      this.search(predicate, parentFirst, includeCurrentNode);
    }
    /**
     * Returns the count of all descendant nodes by walking the tree. Consequently, this
     * function is not efficient.
     *
     * @public
     * @returns {number}
     */
    count() {
      let count = 0;
      this.walk(() => count++, true, true);
      return count;
    }
    /**
     * Climbs the parents of the current node -- current node up to the root node, running an action on each node.
     *
     * @public
     * @param {nodeAction} climbAction - A action to apply to each node. The action takes two arguments -- the node's value, and the node itself.
     * @param {boolean=} includeCurrentNode - True if the current node should be applied to the action.
     */
    climb(climbAction, includeCurrentNode) {
      if (includeCurrentNode) {
        climbAction(this.getValue(), this);
      }
      if (this._parent !== null) {
        this._parent.climb(climbAction, true);
      }
    }
    /**
     * Climbs the tree, evaluating each parent until a predicate is matched. Once matched,
     * the {@link Tree} node is returned. Otherwise, if the predicate cannot be matched,
     * a null value is returned.
     *
     * @public
     * @param {nodePredicate} predicate - A predicate that tests each child node. The predicate takes two arguments -- the node's value, and the node itself.
     * @param {boolean=} includeCurrentNode - If true, the predicate will be applied to the current node.
     * @returns {Tree|null}
     */
    findParent(predicate, includeCurrentNode) {
      let returnRef;
      if (boolean(includeCurrentNode) && includeCurrentNode && predicate(this.getValue(), this)) {
        returnRef = this;
      } else if (this._parent !== null) {
        returnRef = this._parent.findParent(predicate, true);
      } else {
        returnRef = null;
      }
      return returnRef;
    }
    /**
     * Creates a representation of the tree using JavaScript objects and arrays.
     *
     * @public
     * @param {Function=} valueConverter - An optional function for converting the value of each node.
     * @param {boolean=} omitEmptyChildren - If true, empty children arrays will be excluded from output.
     * @returns {object}
     */
    toJSObj(valueConverter, omitEmptyChildren) {
      let valueConverterToUse;
      if (fn(valueConverter)) {
        valueConverterToUse = valueConverter;
      } else {
        valueConverterToUse = (x) => x;
      }
      const converted = {
        value: valueConverterToUse(this._value)
      };
      if (!(boolean(omitEmptyChildren) && omitEmptyChildren && this._children.length === 0)) {
        converted.children = this._children.map((child) => child.toJSObj(valueConverter, omitEmptyChildren));
      }
      return converted;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Tree]";
    }
  };

  // serialization/json/Schema.js
  var Schema = class {
    #name;
    #fields;
    #components;
    #strict;
    #revivers;
    /**
     * @param {string} name - The name of the schema
     * @param {Field[]=} fields
     * @param {Component[]=} components
     * @param {boolean=} strict
     */
    constructor(name, fields, components, strict) {
      this.#name = name;
      this.#fields = fields || [];
      this.#components = components || [];
      this.#strict = boolean(strict) && strict;
      this.#revivers = getReviverItems(this.#fields, this.#components);
    }
    /**
     * Accepts data and returns a new object which (should) conform to
     * the schema.
     *
     * @public
     * @param {object} data
     * @returns {object}
     */
    format(data) {
      const returnRef = {};
      this.#fields.forEach((field) => {
        formatField(returnRef, field, data);
      });
      this.#components.forEach((component) => {
        component.fields.forEach((field) => {
          formatField(returnRef, field, data);
        });
      });
      return returnRef;
    }
    /**
     * Name of the table.
     *
     * @public
     * @returns {string}
     */
    get name() {
      return this.#name;
    }
    /**
     * The fields of the table.
     *
     * @public
     * @returns {Array<Field>}
     */
    get fields() {
      return [...this.#fields];
    }
    /**
     * The components of the table.
     *
     * @public
     * @returns {Array<Component>}
     */
    get components() {
      return [...this.#components];
    }
    /**
     * If true, only the explicitly defined fields and components will
     * be serialized.
     *
     * @public
     * @returns {boolean}
     */
    get strict() {
      return this.#strict;
    }
    /**
     * Returns true, if an object complies with the schema.
     *
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    validate(candidate) {
      return !getCandidateIsInvalid(candidate) && this.getInvalidFields(candidate).length === 0;
    }
    /**
     * Returns an array of {@link Field} objects from the schema for which the
     * candidate object does not comply with.
     *
     * @public
     * @param {*} candidate
     * @returns {Field[]}
     */
    getInvalidFields(candidate) {
      if (getCandidateIsInvalid(candidate)) {
        return this.fields.filter((f) => !f.optional);
      }
      return this.fields.reduce((problems, field) => {
        let check = !field.optional || has(candidate, field.name);
        if (check) {
          const valid = field.dataType.validator.call(this, read(candidate, field.name));
          if (!valid) {
            problems.push(field);
          }
        }
        return problems;
      }, []);
    }
    /**
     * Generates a function suitable for use by {@link JSON.parse}.
     *
     * @public
     * @returns {Function}
     */
    getReviver() {
      let head = this.#revivers;
      let node = null;
      const advance = (key) => {
        const previous = node;
        if (node === null) {
          node = head;
        } else {
          node = node.getNext();
        }
        const item = node.getValue();
        if (key === item.name) {
          return item;
        } else if (item.reset || key === "" && node === head) {
          node = null;
          return item;
        } else if (item.array && integer(parseInt(key))) {
          node = previous;
          return item;
        } else if (item.optional) {
          return advance(key);
        } else {
          throw new SchemaError(key, item.name, `Schema parsing is using strict mode, unexpected key found [ found: ${key}, expected: ${item.name} ]`);
        }
      };
      return (key, value) => {
        const item = advance(key);
        if (key === "" || item.array && key === item.name) {
          return value;
        } else {
          return item.reviver(value);
        }
      };
    }
    /**
     * Returns a function that will generate a *new* reviver function
     * (see {@link Schema#getReviver}).
     *
     * @public
     * @returns {Function}
     */
    getReviverFactory() {
      return () => this.getReviver();
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[Schema (name=${this.#name})]`;
    }
  };
  var SchemaError = class extends Error {
    constructor(key, name, message) {
      super(message);
      this.key = key;
      this.name = name;
    }
    toString() {
      return `[SchemaError]`;
    }
  };
  var ReviverItem = class {
    #name;
    #reviver;
    #optional;
    #reset;
    #array;
    constructor(name, reviver, optional, reset, array2) {
      this.#name = name;
      this.#reviver = reviver || getTautology();
      this.#optional = boolean(optional) && optional;
      this.#reset = boolean(reset) && reset;
      this.#array = boolean(array2) && array2;
    }
    get name() {
      return this.#name;
    }
    get reviver() {
      return this.#reviver;
    }
    get optional() {
      return this.#optional;
    }
    get reset() {
      return this.#reset;
    }
    get array() {
      return this.#array;
    }
  };
  function getReviverItems(fields, components) {
    const root = new Tree(new ReviverItem(null, null, false, true));
    fields.forEach((field) => {
      const names = field.name.split(".");
      let node = root;
      names.forEach((name, i) => {
        if (names.length === i + 1) {
          node.addChild(new ReviverItem(name, field.dataType.reviver, field.optional, false, field.array));
        } else {
          let child = node.findChild((n) => n.name === name);
          if (!child) {
            child = node.addChild(new ReviverItem(name));
          }
          node = child;
        }
      });
    });
    components.forEach((component) => {
      let node = root;
      const names = component.name.split(".");
      names.forEach((name, i) => {
        if (names.length === i + 1) {
          node = node.addChild(new ReviverItem(name, component.reviver));
        } else {
          let child = node.findChild((n) => n.name === name);
          if (!child) {
            child = node.addChild(new ReviverItem(name));
          }
          node = child;
        }
      });
      component.fields.forEach((f) => node.addChild(new ReviverItem(f.name, f.dataType.reviver)));
    });
    let head = null;
    let current = null;
    const addItemToList = (item, node) => {
      let itemToUse = item;
      if (!node.getIsLeaf()) {
        const required = node.search((i, n) => n.getIsLeaf() && !i.optional, true, false) !== null;
        if (!required) {
          itemToUse = new ReviverItem(item.name, item.reviver, true, item.reset, item.array);
        }
      } else {
        itemToUse = item;
      }
      if (current === null) {
        current = head = new LinkedList(itemToUse);
      } else {
        current = current.insert(itemToUse);
      }
    };
    root.walk(addItemToList, false, true);
    return head;
  }
  function formatField(target, field, data) {
    if (has(data, field.name)) {
      write(target, field.name, field.dataType.convert(read(data, field.name)));
    }
  }
  function getCandidateIsInvalid(candidate) {
    return undef(candidate) || nil(candidate) || !object(candidate);
  }

  // api/failures/FailureReason.js
  var FailureReason = class _FailureReason {
    #data;
    #root;
    #current;
    /**
     * @param {object=} data - Data regarding the API request itself, likely independent of the failure data maintained in the tree structure.
     */
    constructor(data) {
      this.#data = data || null;
      this.#root = new Tree(null);
      this.#current = this.#root;
    }
    /**
     * Adds a {@link FailureReasonItem} to the tree of reasons at the current node.
     *
     * @public
     * @param {FailureType} type - The failure type.
     * @param {object=} data - The data associated with the failure type.
     * @param {boolean=} group - Whether the newly added item is expected to have children.
     * @returns {FailureReason} The current instance, allowing for method chaining.
     */
    addItem(type, data, group) {
      argumentIsRequired(type, "type", FailureType, "FailureType");
      argumentIsOptional(group, "group", Boolean);
      const node = this.#current.addChild(new FailureReasonItem(type, data));
      if (boolean(group) && group) {
        this.#current = node;
      }
      return this;
    }
    /**
     * Resets the current node to the head of the tree.
     *
     * @public
     * @param {boolean=} previous
     * @returns {FailureReason} The current instance, allowing for method chaining.
     */
    reset(previous) {
      argumentIsOptional(previous, "previous", Boolean);
      let node;
      if (previous && this.#current.getIsInner()) {
        node = this.#current.getParent();
      } else {
        node = this.#root;
      }
      this.#current = node;
      return this;
    }
    /**
     * Returns a tree of strings describing the reasons for API failure.
     *
     * @public
     * @returns {Array}
     */
    format() {
      const reasons = this.#root.toJSObj((item) => {
        const formatted = {};
        formatted.code = item ? item.type.code : null;
        formatted.message = item ? item.format(this.#data) : null;
        if (item && item.type.verbose) {
          formatted.data = item.data;
        }
        return formatted;
      }, true);
      return reasons.children;
    }
    /**
     * Indicates whether the tree of {@link FailureReasonItem} instances
     * contains at least one item with a matching {@link FailureType}.
     *
     * @public
     * @param {FailureType} type
     * @returns {boolean}
     */
    hasFailureType(type) {
      argumentIsRequired(type, "type", FailureType, "FailureType");
      return this.#root.search((item) => item.type === type, false, false) !== null;
    }
    /**
     * Indicates whether the tree of {@link FailureReasonItem} instances
     * contains at least one item considered severe.
     *
     * @public
     * @returns {boolean}
     */
    getIsSevere() {
      return this.#root.search((item) => item.type.severe, false, false) !== null;
    }
    /**
     * Searches the tree of {@link FailureReasonItem} instances for a
     * non-standard HTTP error code.
     *
     * @public
     * @returns {number|null}
     */
    getErrorCode() {
      const node = this.#root.search((item) => item.type.error !== null, true, false);
      if (node === null) {
        return null;
      }
      return node.getValue().type.error;
    }
    /**
     * A convenience function for creating a new {@link FailureReason}
     * with a single {@link FailureType}.
     *
     * @public
     * @static
     * @param {FailureType} type
     * @param {object=} data
     * @returns {FailureReason}
     */
    static from(type, data) {
      const reason = new _FailureReason();
      return reason.addItem(type, data);
    }
    /**
     * Factory function for creating instances of {@link FailureReason}.
     *
     * @public
     * @static
     * @param {object=} data
     * @returns {FailureReason}
     */
    static forRequest(data) {
      return new _FailureReason(data);
    }
    /**
     * Returns a JSON representation of the failure reason.
     *
     * @public
     * @returns {Array}
     */
    toJSON() {
      return this.format();
    }
    /**
     * Returns an HTTP status code suitable for use with the failure reason.
     *
     * @public
     * @static
     * @param {FailureReason} reason
     * @returns {number|null}
     */
    static getHttpStatusCode(reason) {
      argumentIsRequired(reason, "reason", _FailureReason, "FailureReason");
      let returnValue = null;
      reason.#root.walk((item) => {
        const code = FailureType.getHttpStatusCode(item.type);
        if (returnValue === null || returnValue !== 400) {
          returnValue = code;
        }
      }, false, false);
      return returnValue;
    }
    /**
     * Validates that a candidate conforms to a schema, returning a rejected
     * promise with a serialized {@link FailureReason} if a problem exists.
     *
     * The schema argument can be either a {@link Schema} instance or an
     * {@link Enum} instance that exposes a Schema through its schema property.
     *
     * @public
     * @static
     * @async
     * @param {Schema|EnumWithSchema} schema
     * @param {object} candidate
     * @param {string=} description
     * @returns {Promise<null>}
     */
    static async validateSchema(schema, candidate, description) {
      let schemaToUse;
      if (schema instanceof Schema) {
        schemaToUse = schema;
      } else if (schema.schema && schema.schema instanceof Schema) {
        schemaToUse = schema.schema;
      } else {
        throw new TypeError("The schema argument must be a Schema instance or an Enum instance containing a Schema.");
      }
      const fields = schemaToUse.getInvalidFields(candidate);
      if (fields.length === 0) {
        return null;
      }
      let failure = _FailureReason.forRequest({ endpoint: { description: description || `serialize data into ${schemaToUse.name}` } }).addItem(FailureType.REQUEST_INPUT_MALFORMED, {}, true);
      failure = fields.reduce((accumulator, field) => {
        accumulator.addItem(FailureType.REQUEST_PARAMETER_MALFORMED, { name: field.name });
        return accumulator;
      }, failure);
      throw failure.format();
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[FailureReason]";
    }
  };

  // lang/AdHoc.js
  var AdHoc = class _AdHoc {
    #data;
    /**
     * @param {object} data
     */
    constructor(data) {
      this.#data = data || {};
    }
    /**
     * The data.
     *
     * @public
     * @returns {object}
     */
    get data() {
      return this.#data;
    }
    /**
     * The data.
     *
     * @public
     * @param {object} data
     */
    set data(data) {
      argumentIsRequired(data, "data", Object);
      this.#data = data;
    }
    /**
     * Returns the JSON representation.
     *
     * @public
     * @returns {*}
     */
    toJSON() {
      return JSON.stringify(this.#data);
    }
    /**
     * Converts a JSON-serialized object into an {@link AdHoc} instance.
     *
     * @public
     * @static
     * @param {string} serialized
     * @returns {AdHoc}
     */
    static parse(serialized) {
      return new _AdHoc(JSON.parse(serialized));
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[AdHoc]";
    }
  };

  // collections/sorting/comparators.js
  function compareDates(a, b) {
    argumentIsRequired(a, "a", Date);
    argumentIsRequired(b, "b", Date);
    return a.getTime() - b.getTime();
  }
  function compareNumbers(a, b) {
    argumentIsRequired(a, "a", Number);
    argumentIsRequired(b, "b", Number);
    return a - b;
  }
  function compareStrings(a, b) {
    argumentIsRequired(a, "a", String);
    argumentIsRequired(b, "b", String);
    return a.localeCompare(b);
  }
  function compareBooleans(a, b) {
    argumentIsRequired(a, "a", Boolean);
    argumentIsRequired(b, "b", Boolean);
    if (a === b) {
      return 0;
    } else if (a) {
      return 1;
    } else {
      return -1;
    }
  }
  function compareNull(a, b) {
    if (a === null && b !== null) {
      return -1;
    } else if (a !== null && b === null) {
      return 1;
    } else {
      return 0;
    }
  }
  function empty(a, b) {
    return 0;
  }

  // collections/sorting/ComparatorBuilder.js
  var ComparatorBuilder = class _ComparatorBuilder {
    #comparator;
    #invert;
    #previous;
    /**
     * @param {Function} comparator - The initial comparator.
     * @param {boolean=} invert - Indicates if the comparator should sort in descending order.
     * @param {ComparatorBuilder=} previous - The previous comparator builder in the chain.
     */
    constructor(comparator2, invert, previous) {
      argumentIsRequired(comparator2, "comparator", Function);
      argumentIsOptional(invert, "invert", Boolean);
      this.#comparator = comparator2;
      this.#invert = invert || false;
      this.#previous = previous || null;
    }
    /**
     * Adds a new comparator to the list of comparators to use.
     *
     * @public
     * @param {Function} comparator - The next comparator function.
     * @param {boolean=} invert - Indicates if the comparator should sort in descending order.
     * @returns {ComparatorBuilder}
     */
    thenBy(comparator2, invert) {
      argumentIsRequired(comparator2, "comparator", Function);
      argumentIsOptional(invert, "invert", Boolean);
      return new _ComparatorBuilder(comparator2, invert, this);
    }
    /**
     * Flips the order of the comparator (e.g. ascending to descending).
     *
     * @public
     * @returns {ComparatorBuilder}
     */
    invert() {
      let previous;
      if (this.#previous) {
        previous = this.#previous.invert();
      } else {
        previous = null;
      }
      return new _ComparatorBuilder(this.#comparator, !this.#invert, previous);
    }
    /**
     * Returns the comparator function.
     *
     * @public
     * @returns {Function}
     */
    toComparator() {
      let previousComparator;
      if (this.#previous) {
        previousComparator = this.#previous.toComparator();
      } else {
        previousComparator = empty;
      }
      return (a, b) => {
        let result = previousComparator(a, b);
        if (result === 0) {
          let sortA;
          let sortB;
          if (this.#invert) {
            sortA = b;
            sortB = a;
          } else {
            sortA = a;
            sortB = b;
          }
          result = this.#comparator(sortA, sortB);
        }
        return result;
      };
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[ComparatorBuilder]";
    }
    /**
     * Creates a {@link ComparatorBuilder}, given an initial comparator function.
     *
     * @public
     * @static
     * @param {Function} comparator - The initial comparator.
     * @param {boolean=} invert - Indicates if the comparator should sort in descending order.
     * @returns {ComparatorBuilder}
     */
    static startWith(comparator2, invert) {
      return new _ComparatorBuilder(comparator2, invert);
    }
  };

  // lang/DayFormatType.js
  var DayFormatType = class extends Enum {
    #regex;
    #yearIndex;
    #monthIndex;
    #dayIndex;
    #yearShift;
    /**
        * @param {string} description
        * @param {RegExp} regex
        * @param {number} yearIndex
        * @param {number} monthIndex
        * @param {number} dayIndex
        * @param {number} yearShift
        */
    constructor(description, regex3, yearIndex, monthIndex, dayIndex, yearShift) {
      super(description, description);
      this.#regex = regex3;
      this.#yearIndex = yearIndex;
      this.#monthIndex = monthIndex;
      this.#dayIndex = dayIndex;
      this.#yearShift = yearShift;
    }
    /**
     * A regular expression for parsing the day type.
     *
     * @public
     * @returns {RegExp}
     */
    get regex() {
      return this.#regex;
    }
    /**
     * The index used to read the year from a regular expression match.
     *
     * @public
     * @returns {number}
     */
    get yearIndex() {
      return this.#yearIndex;
    }
    /**
     * The index used to read the month from a regular expression match.
     *
     * @public
     * @returns {number}
     */
    get monthIndex() {
      return this.#monthIndex;
    }
    /**
     * The index used to read the day from a regular expression match.
     *
     * @public
     * @returns {number}
     */
    get dayIndex() {
      return this.#dayIndex;
    }
    /**
     * The amount to add to the year (extracted from a formatted string) to get the
     * full year (e.g. for "11-31-25" of an MM-DD-YY string, the value will be 2000).
     *
     * @public
     * @returns {number}
     */
    get yearShift() {
      return this.#yearShift;
    }
    /**
     * Specifies date formatting as four-digit year, then month, then day (e.g. 2025-11-31).
     *
     * @public
     * @static
     * @returns {DayFormatType}
     */
    static get YYYY_MM_DD() {
      return yyyymmdd;
    }
    /**
     * Specifies date formatting as month, then day, then four-digit year (e.g. 11-31-2025).
     *
     * @public
     * @static
     * @returns {DayFormatType}
     */
    static get MM_DD_YYYY() {
      return mmddyyyy;
    }
    /**
     * Specifies date formatting as month, then day, then two-digit year (e.g. 11-31-25).
     *
     * @public
     * @static
     * @returns {DayFormatType}
     */
    static get MM_DD_YY() {
      return mmddyy;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[DayFormatType (description=${this.description})]`;
    }
  };
  function getMillenniumShift() {
    const today = /* @__PURE__ */ new Date();
    return Math.floor(today.getFullYear() / 100) * 100;
  }
  var yyyymmdd = new DayFormatType("YYYY_MM_DD", /^([0-9]{4})[-/.]?([0-9]{1,2})[-/.]?([0-9]{1,2})$/, 1, 2, 3, 0);
  var mmddyyyy = new DayFormatType("MM_DD_YYYY", /^([0-9]{1,2})[-/.]?([0-9]{1,2})[-/.]?([0-9]{4})$/, 3, 1, 2, 0);
  var mmddyy = new DayFormatType("MM_DD_YY", /^([0-9]{1,2})[-/.]?([0-9]{1,2})[-/.]?([0-9]{2})$/, 3, 1, 2, getMillenniumShift());

  // lang/Day.js
  var Day = class _Day {
    #year;
    #month;
    #day;
    /**
     * @param {number} year
     * @param {number} month
     * @param {number} day
     */
    constructor(year, month, day) {
      if (!_Day.validate(year, month, day)) {
        throw new Error(`Unable to instantiate [ Day ], input is invalid [ ${year} ], [ ${month} ], [ ${day} ]`);
      }
      this.#year = year;
      this.#month = month;
      this.#day = day;
    }
    /**
     * Calculates a new {@link Day} in the future (or past).
     *
     * @public
     * @param {number} days - The number of days to add (negative numbers can be used for subtraction).
     * @param {boolean=} inverse - If true, the sign of the "days" value will be flipped.
     * @returns {Day}
     */
    addDays(days2, inverse) {
      argumentIsRequired(days2, "days", Number);
      argumentIsOptional(inverse, "inverse", Boolean);
      argumentIsValid(days2, "days", large, "is an integer");
      let totalDaysToShift;
      if (boolean(inverse) && inverse) {
        totalDaysToShift = days2 * -1;
      } else {
        totalDaysToShift = days2;
      }
      const positive2 = positive(totalDaysToShift);
      let shiftedDay = this.#day;
      let shiftedMonth = this.#month;
      let shiftedYear = this.#year;
      while (totalDaysToShift !== 0) {
        let monthDaysAvailable;
        let monthDaysToShift;
        if (positive2) {
          monthDaysAvailable = _Day.getDaysInMonth(shiftedYear, shiftedMonth) - shiftedDay;
          monthDaysToShift = Math.min(totalDaysToShift, monthDaysAvailable);
        } else {
          monthDaysAvailable = 1 - shiftedDay;
          monthDaysToShift = Math.max(totalDaysToShift, monthDaysAvailable);
        }
        totalDaysToShift = totalDaysToShift - monthDaysToShift;
        if (totalDaysToShift === 0) {
          shiftedDay = shiftedDay + monthDaysToShift;
        } else if (positive2) {
          shiftedMonth++;
          if (shiftedMonth > 12) {
            shiftedYear++;
            shiftedMonth = 1;
          }
          shiftedDay = 0;
        } else {
          shiftedMonth--;
          if (shiftedMonth < 1) {
            shiftedYear--;
            shiftedMonth = 12;
          }
          shiftedDay = _Day.getDaysInMonth(shiftedYear, shiftedMonth) + 1;
        }
      }
      return new _Day(shiftedYear, shiftedMonth, shiftedDay);
    }
    /**
     * Calculates a new {@link Day} in the past (or future).
     *
     * @public
     * @param {number} days - The number of days to subtract (negative numbers can be used for addition).
     * @returns {Day}
     */
    subtractDays(days2) {
      return this.addDays(days2, true);
    }
    /**
     * Calculates a new {@link Day} in the future (or past). If the new date is at the end of
     * the month and the new month has fewer days than the current month, days will be subtracted
     * as necessary (e.g. adding one month to March 31 will return April 30).
     *
     * @public
     * @param {number} months - The number of months to add (negative numbers can be used for subtraction).
     * @param {boolean=} inverse - If true, the sign of the "days" value will be flipped.
     * @returns {Day}
     */
    addMonths(months2, inverse) {
      argumentIsRequired(months2, "months", Number);
      argumentIsOptional(inverse, "inverse", Boolean);
      argumentIsValid(months2, "months", large, "is an integer");
      let totalMonthsToShift;
      if (boolean(inverse) && inverse) {
        totalMonthsToShift = months2 * -1;
      } else {
        totalMonthsToShift = months2;
      }
      const monthsToShift = totalMonthsToShift % 12;
      const yearsToShift = (totalMonthsToShift - monthsToShift) / 12;
      let shiftedYear = this.year + yearsToShift;
      let shiftedMonth = this.month + monthsToShift;
      let shiftedDay = this.day;
      if (shiftedMonth > 12) {
        shiftedYear = shiftedYear + 1;
        shiftedMonth = shiftedMonth - 12;
      }
      if (shiftedMonth < 1) {
        shiftedYear = shiftedYear - 1;
        shiftedMonth = shiftedMonth + 12;
      }
      while (!_Day.validate(shiftedYear, shiftedMonth, shiftedDay)) {
        shiftedDay = shiftedDay - 1;
      }
      return new _Day(shiftedYear, shiftedMonth, shiftedDay);
    }
    /**
     * Calculates a new {@link Day} in the past (or future).
     *
     * @public
     * @param {number} months - The number of months to subtract (negative numbers can be used for addition).
     * @returns {Day}
     */
    subtractMonths(months2) {
      return this.addMonths(months2, true);
    }
    /**
     * Calculates a new {@link Day} in the future (or past). If the new date is at the end of
     * the month and the new month has fewer days than the current month, days will be subtracted
     * as necessary (e.g. adding one year to February 29 will return February 28).
     *
     * @public
     * @param {number} years - The number of years to add (negative numbers can be used for subtraction).
     * @param {boolean=} inverse - If true, the sign of the "days" value will be flipped.
     * @returns {Day}
     */
    addYears(years, inverse) {
      argumentIsRequired(years, "years", Number);
      argumentIsOptional(inverse, "inverse", Boolean);
      argumentIsValid(years, "years", large, "is an integer");
      let yearsToShift;
      if (boolean(inverse) && inverse) {
        yearsToShift = years * -1;
      } else {
        yearsToShift = years;
      }
      let shiftedYear = this.year + yearsToShift;
      let shiftedMonth = this.month;
      let shiftedDay = this.day;
      while (!_Day.validate(shiftedYear, shiftedMonth, shiftedDay)) {
        shiftedDay = shiftedDay - 1;
      }
      return new _Day(shiftedYear, shiftedMonth, shiftedDay);
    }
    /**
     * Calculates a new {@link Day} in the past (or future).
     *
     * @public
     * @param {number} years - The number of years to subtract (negative numbers can be used for addition).
     * @returns {Day}
     */
    subtractYears(years) {
      return this.addYears(years, true);
    }
    /**
     * Returns a new {@link Day} instance for the start of the month referenced by the current instance.
     *
     * @public
     * @returns {Day}
     */
    getStartOfMonth() {
      return new _Day(this.year, this.month, 1);
    }
    /**
     * Returns a new instance for the {@link Day} end of the month referenced by the current instance.
     *
     * @public
     * @returns {Day}
     */
    getEndOfMonth() {
      return new _Day(this.year, this.month, _Day.getDaysInMonth(this.year, this.month));
    }
    /**
     * Indicates if the current {@link Day} instance occurs before another day.
     *
     * @public
     * @param {Day} other
     * @returns {boolean}
     */
    getIsBefore(other) {
      return _Day.compareDays(this, other) < 0;
    }
    /**
     * Indicates if the current {@link Day} instance occurs after another day.
     *
     * @public
     * @param {Day} other
     * @returns {boolean}
     */
    getIsAfter(other) {
      return _Day.compareDays(this, other) > 0;
    }
    /**
     * Indicates the current day falls between two other days, inclusive
     * of the range boundaries.
     *
     * @public
     * @param {Day=} first
     * @param {Day=} last
     * @returns {boolean}
     */
    getIsContained(first3, last3) {
      argumentIsOptional(first3, "first", _Day, "Day");
      argumentIsOptional(last3, "last", _Day, "Day");
      let notAfter;
      let notBefore;
      if (first3 && last3 && first3.getIsAfter(last3)) {
        notBefore = false;
        notAfter = false;
      } else {
        notAfter = !(last3 instanceof _Day) || !this.getIsAfter(last3);
        notBefore = !(first3 instanceof _Day) || !this.getIsBefore(first3);
      }
      return notAfter && notBefore;
    }
    /**
     * Indicates if another {@link Day} refers to the same moment.
     *
     * @public
     * @param {Day} other
     * @returns {boolean}
     */
    getIsEqual(other) {
      return _Day.compareDays(this, other) === 0;
    }
    /**
     * Calculates and returns name of the day of the week (e.g. Monday, Tuesday, Wednesday, etc.).
     *
     * @public
     * @returns {string}
     */
    getName() {
      const count = _Day.countDaysBetween(REFERENCE_MONDAY, this);
      let index = count % NAMES_OF_DAYS.length;
      if (index < 0) {
        index = index + NAMES_OF_DAYS.length;
      }
      return NAMES_OF_DAYS[index];
    }
    /**
     * The year.
     *
     * @public
     * @returns {number}
     */
    get year() {
      return this.#year;
    }
    /**
     * The month of the year (January is one, December is twelve).
     *
     * @public
     * @returns {number}
     */
    get month() {
      return this.#month;
    }
    /**
     * The day of the month.
     *
     * @public
     * @returns {number}
     */
    get day() {
      return this.#day;
    }
    /**
     * Outputs the date as the formatted string: {year}-{month}-{day}.
     *
     * @public
     * @returns {string}
     */
    format() {
      return `${leftPad(this.#year, 4, "0")}-${leftPad(this.#month, 2, "0")}-${leftPad(this.#day, 2, "0")}`;
    }
    /**
     * Returns the JSON representation.
     *
     * @public
     * @returns {string}
     */
    toJSON() {
      return this.format();
    }
    /**
     * Clones a {@link Day} instance.
     *
     * @public
     * @static
     * @param {Day} value
     * @returns {Day}
     */
    static clone(value) {
      argumentIsRequired(value, "value", _Day, "Day");
      return new _Day(value.year, value.month, value.day);
    }
    /**
     * Converts a string (which matches the output of {@link Day#format}) into
     * a {@link Day} instance.
     *
     * @public
     * @static
     * @param {string} value
     * @param {DayFormatType=} type
     * @returns {Day}
     */
    static parse(value, type) {
      argumentIsRequired(value, "value", String);
      let t;
      if (type instanceof DayFormatType) {
        t = type;
      } else {
        t = DayFormatType.YYYY_MM_DD;
      }
      const match = value.match(t.regex);
      if (match === null) {
        throw new Error(`Unable to parse value as Day [ ${value} ]`);
      }
      return new _Day(parseInt(match[t.yearIndex]) + t.yearShift, parseInt(match[t.monthIndex]), parseInt(match[t.dayIndex]));
    }
    /**
     * Creates a {@link Day} from the year, month, and day properties (in local time)
     * of the {@link Date} argument.
     *
     * @public
     * @static
     * @param {Date} date
     * @returns {Day}
     */
    static fromDate(date2) {
      argumentIsRequired(date2, "date", Date);
      return new _Day(date2.getFullYear(), date2.getMonth() + 1, date2.getDate());
    }
    /**
     * Creates a {@link Day} from the year, month, and day properties (in UTC)
     * of the {@link Date} argument.
     *
     * @public
     * @static
     * @param {Date} date
     * @returns {Day}
     */
    static fromDateUtc(date2) {
      argumentIsRequired(date2, "date", Date);
      return new _Day(date2.getUTCFullYear(), date2.getUTCMonth() + 1, date2.getUTCDate());
    }
    /**
     * Returns a {@link Day} instance using today's local date.
     *
     * @public
     * @static
     * @returns {Day}
     */
    static getToday() {
      return _Day.fromDate(/* @__PURE__ */ new Date());
    }
    /**
     * Returns true if the year, month, and day combination is valid; otherwise false.
     *
     * @public
     * @static
     * @param {number} year
     * @param {number} month
     * @param {number} day
     * @returns {boolean}
     */
    static validate(year, month, day) {
      return integer(year) && integer(month) && integer(day) && !(month < 1) && !(month > 12) && !(day < 1) && !(day > _Day.getDaysInMonth(year, month));
    }
    /**
     * Returns the number of days in a given month.
     *
     * @public
     * @static
     * @param {number} year - The year number (e.g. 2017)
     * @param {number} month - The month number (e.g. 2 is February)
     * @returns {number}
     */
    static getDaysInMonth(year, month) {
      switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12: {
          return 31;
        }
        case 4:
        case 6:
        case 9:
        case 11: {
          return 30;
        }
        case 2: {
          if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
            return 29;
          } else {
            return 28;
          }
        }
      }
    }
    /**
     * A comparator function for {@link Day} instances.
     *
     * @public
     * @static
     * @param {Day} a
     * @param {Day} b
     * @returns {number}
     */
    static compareDays(a, b) {
      argumentIsRequired(a, "a", _Day, "Day");
      argumentIsRequired(b, "b", _Day, "Day");
      return comparator(a, b);
    }
    /**
     * Calculates the number of days between two {@link Day} instances (may return
     * a negative value).
     *
     * @public
     * @static
     * @param {Day} a
     * @param {Day} b
     * @returns {number}
     */
    static countDaysBetween(a, b) {
      argumentIsRequired(a, "a", _Day, "Day");
      argumentIsRequired(b, "b", _Day, "Day");
      if (a.getIsEqual(b)) {
        return 0;
      }
      let start;
      let end;
      let reversed = b.getIsBefore(a);
      if (reversed) {
        start = b;
        end = a;
      } else {
        start = a;
        end = b;
      }
      let currentMonth = start.month;
      let currentYear = start.year;
      let counter = 0 - start.day;
      while (!(currentMonth === end.month && currentYear === end.year)) {
        counter = counter + _Day.getDaysInMonth(currentYear, currentMonth);
        if (currentMonth === 12) {
          currentMonth = 1;
          currentYear = currentYear + 1;
        } else {
          currentMonth = currentMonth + 1;
        }
      }
      counter = counter + end.day;
      if (reversed) {
        counter = counter * -1;
      }
      return counter;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Day]";
    }
  };
  function leftPad(value, digits, character) {
    let string2 = value.toString();
    let padding = digits - string2.length;
    return `${character.repeat(padding)}${string2}`;
  }
  var comparator = ComparatorBuilder.startWith((a, b) => compareNumbers(a.year, b.year)).thenBy((a, b) => compareNumbers(a.month, b.month)).thenBy((a, b) => compareNumbers(a.day, b.day)).toComparator();
  var NAMES_OF_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  var REFERENCE_MONDAY = new Day(2024, 1, 1);

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

  // lang/Decimal.js
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
    getIsZero(approximate2, places) {
      argumentIsOptional(approximate2, "approximate", Boolean);
      argumentIsOptional(places, "places", Number);
      return this.#big.eq(zero) || boolean(approximate2) && approximate2 && this.round(places || big_default.DP, RoundingMode.NORMAL).getIsZero();
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
      const difference2 = this.subtract(other).absolute();
      const tolerance = _Decimal.ONE.divide(new _Decimal(10).raise(places));
      return difference2.getIsLessThan(tolerance);
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

  // lang/Timestamp.js
  var MILLISECONDS_PER_SECOND = 1e3;
  var Timestamp = class _Timestamp {
    #timestamp;
    /**
     * @param {number} timestamp
     */
    constructor(timestamp) {
      argumentIsValid(timestamp, "timestamp", large, "is an integer");
      this.#timestamp = timestamp;
    }
    /**
     * The timestamp (milliseconds since epoch).
     *
     * @public
     * @returns {number}
     */
    get timestamp() {
      return this.#timestamp;
    }
    /**
     * Returns a new {@link Timestamp} instance shifted forward by a specific
     * number of milliseconds.
     *
     * @public
     * @param {number} milliseconds
     * @returns {Timestamp}
     */
    add(milliseconds) {
      argumentIsRequired(milliseconds, "milliseconds", Number);
      return new _Timestamp(this.#timestamp + milliseconds);
    }
    /**
     * Returns a new {@link Timestamp} instance shifted backwards by a specific
     * number of milliseconds.
     *
     * @public
     * @param {number} milliseconds
     * @returns {Timestamp}
     */
    subtract(milliseconds) {
      argumentIsRequired(milliseconds, "milliseconds", Number);
      return new _Timestamp(this.#timestamp - milliseconds);
    }
    /**
     * Returns a new {@link Timestamp} instance shifted forward by a specific
     * number of seconds.
     *
     * @public
     * @param {number} seconds
     * @returns {Timestamp}
     */
    addSeconds(seconds) {
      argumentIsRequired(seconds, "seconds", Number);
      return this.add(seconds * MILLISECONDS_PER_SECOND);
    }
    /**
     * Returns a new {@link Timestamp} instance shifted backwards by a specific
     * number of seconds.
     *
     * @public
     * @param {number} seconds
     * @returns {Timestamp}
     */
    subtractSeconds(seconds) {
      argumentIsRequired(seconds, "seconds", Number);
      return this.subtract(seconds * MILLISECONDS_PER_SECOND);
    }
    /**
     * Indicates if the current {@link Timestamp} instance occurs before another timestamp.
     *
     * @public
     * @param {Timestamp} other
     * @returns {boolean}
     */
    getIsBefore(other) {
      return _Timestamp.compareTimestamps(this, other) < 0;
    }
    /**
     * Indicates if the current {@link Timestamp} instance occurs after another timestamp.
     *
     * @public
     * @param {Timestamp} other
     * @returns {boolean}
     */
    getIsAfter(other) {
      return _Timestamp.compareTimestamps(this, other) > 0;
    }
    /**
     * Indicates if another {@link Timestamp} refers to the same moment.
     *
     * @public
     * @param {Timestamp} other
     * @returns {boolean}
     */
    getIsEqual(other) {
      return _Timestamp.compareTimestamps(this, other) === 0;
    }
    /**
     * Returns the JSON representation.
     *
     * @public
     * @returns {number}
     */
    toJSON() {
      return this.timestamp;
    }
    /**
     * Clones a {@link Timestamp} instance.
     *
     * @public
     * @static
     * @param {Timestamp} other
     * @returns {Timestamp}
     */
    static clone(other) {
      argumentIsRequired(other, "other", _Timestamp, "Timestamp");
      return new _Timestamp(other.#timestamp);
    }
    /**
     * Parses the value emitted by {@link Timestamp#toJSON}.
     *
     * @public
     * @static
     * @param {number} value
     * @returns {Timestamp}
     */
    static parse(value) {
      return new _Timestamp(value);
    }
    /**
     * Returns a new {@link Timestamp} instance, representing the current moment.
     *
     * @public
     * @static
     * @returns {Timestamp}
     */
    static now() {
      return new _Timestamp((/* @__PURE__ */ new Date()).getTime());
    }
    /**
     * A comparator function for {@link Timestamp} instances.
     *
     * @public
     * @static
     * @param {Timestamp} a
     * @param {Timestamp} b
     * @returns {number}
     */
    static compareTimestamps(a, b) {
      argumentIsRequired(a, "a", _Timestamp, "Timestamp");
      argumentIsRequired(b, "b", _Timestamp, "Timestamp");
      return a.timestamp - b.timestamp;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Timestamp]";
    }
  };

  // serialization/json/DataType.js
  var DataType = class _DataType {
    #description;
    #enumerationType;
    #reviver;
    #validator;
    #builder;
    /**
     * @param {string} description
     * @param {Function=} enumerationType
     * @param {Function=} reviver
     * @param {Function=} validator
     * @param {Function=} builder
     */
    constructor(description, enumerationType, reviver, validator, builder) {
      argumentIsRequired(description, "description", String);
      argumentIsOptional(enumerationType, "enumerationType", Function);
      argumentIsOptional(reviver, "reviver", Function);
      argumentIsOptional(validator, "validator", Function);
      argumentIsOptional(builder, "builder", Function);
      if (enumerationType) {
        argumentIsValid(enumerationType, "enumerationType", extendsEnumeration, "is an enumeration");
      }
      this.#description = description;
      this.#enumerationType = enumerationType || null;
      let reviverToUse;
      if (reviver) {
        reviverToUse = reviver;
      } else if (enumerationType) {
        reviverToUse = (x) => Enum.fromCode(enumerationType, x);
      } else {
        reviverToUse = (x) => x;
      }
      this.#reviver = reviverToUse;
      let validatorToUse;
      if (validator) {
        validatorToUse = validator;
      } else {
        validatorToUse = (candidate) => true;
      }
      this.#validator = validatorToUse;
      let builderToUse;
      if (builder) {
        builderToUse = builder;
      } else {
        builderToUse = (data) => data;
      }
      this.#builder = builderToUse;
    }
    /**
     * A function that converts data into the desired format.
     *
     * @public
     * @param {*} data
     * @returns {*}
     */
    convert(data) {
      return this.#builder(data);
    }
    /**
     * Description of the data type.
     *
     * @public
     * @returns {string}
     */
    get description() {
      return this.#description;
    }
    /**
     * The {@Enum} type, if applicable.
     *
     * @public
     * @returns {Function|null}
     */
    get enumerationType() {
      return this.#enumerationType;
    }
    /**
     * A function which "revives" a value after serialization to JSON.
     *
     * @public
     * @returns {Function}
     */
    get reviver() {
      return this.#reviver;
    }
    /**
     * A function validates data, returning true or false.
     *
     * @public
     * @returns {Function}
     */
    get validator() {
      return this.#validator;
    }
    /**
     * Return a {@link DataType} instance for use with an {@link @Enum}.
     *
     * @public
     * @static
     * @param {Function} enumerationType - A class that extends {@link Enum}
     * @param description - The description
     * @returns {DataType}
     */
    static forEnum(enumerationType, description) {
      return new _DataType(description, enumerationType, null, (x) => x instanceof enumerationType, getBuilder(getEnumerationBuilder(enumerationType)));
    }
    /**
     * References a string.
     *
     * @public
     * @static
     * @returns {DataType}
     */
    static get STRING() {
      return dataTypeString;
    }
    /**
     * References a number.
     *
     * @public
     * @static
     * @returns {DataType}
     */
    static get NUMBER() {
      return dataTypeNumber;
    }
    /**
     * References a boolean value.
     *
     * @public
     * @static
     * @returns {DataType}
     */
    static get BOOLEAN() {
      return dataTypeBoolean;
    }
    /**
     * References an object (serialized as JSON).
     *
     * @public
     * @static
     * @returns {DataType}
     */
    static get OBJECT() {
      return dataTypeObject;
    }
    /**
     * References an array.
     *
     * @public
     * @static
     * @returns {DataType}
     */
    static get ARRAY() {
      return dataTypeArray;
    }
    /**
     * References a {@link Decimal} instance.
     *
     * @public
     * @static
     * @returns {DataType}
     */
    static get DECIMAL() {
      return dataTypeDecimal;
    }
    /**
     * References a {@link Day} instance.
     *
     * @public
     * @static
     * @returns {DataType}
     */
    static get DAY() {
      return dataTypeDay;
    }
    /**
     * References a {@link Timestamp} instance.
     *
     * @public
     * @static
     * @returns {DataType}
     */
    static get TIMESTAMP() {
      return dataTypeTimestamp;
    }
    /**
     * References an object whose internal properties are not important (for
     * serialization and deserialization purposes).
     *
     * @public
     * @static
     * @returns {DataType}
     */
    static get AD_HOC() {
      return dataTypeAdHoc;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[DataType (description=${this.#description})]`;
    }
  };
  function extendsEnumeration(EnumerationType) {
    return extension(Enum, EnumerationType);
  }
  var dataTypeString = new DataType("String", null, null, string);
  var dataTypeNumber = new DataType("Number", null, null, number);
  var dataTypeBoolean = new DataType("Boolean", null, null, boolean);
  var dataTypeObject = new DataType("Object", null, null, object);
  var dataTypeArray = new DataType("Array", null, null, array);
  var dataTypeDecimal = new DataType("Decimal", null, (x) => Decimal.parse(x), (x) => x instanceof Decimal, getBuilder(buildDecimal));
  var dataTypeDay = new DataType("Day", null, (x) => Day.parse(x), (x) => x instanceof Day, getBuilder(buildDay));
  var dataTypeTimestamp = new DataType("Timestamp", null, (x) => Timestamp.parse(x), (x) => x instanceof Timestamp, getBuilder(buildTimestamp));
  var dataTypeAdHoc = new DataType("AdHoc", null, (x) => AdHoc.parse(x), (x) => x instanceof AdHoc, getBuilder(buildAdHoc));
  function getBuilder(builder) {
    return (data) => {
      try {
        return builder(data);
      } catch (e) {
        return data;
      }
    };
  }
  function buildDecimal(data) {
    return new Decimal(data);
  }
  function buildDay(data) {
    if (data instanceof Day) {
      return new Day(data.year, data.month, data.day);
    } else if (date(data)) {
      return Day.fromDate(data);
    } else if (string(data)) {
      return Day.parse(data);
    } else {
      return data;
    }
  }
  function buildTimestamp(data) {
    return new Timestamp(data);
  }
  function buildAdHoc(data) {
    if (data instanceof AdHoc) {
      return new AdHoc(data.data);
    } else if (object(data)) {
      return new AdHoc(data);
    }
  }
  function getEnumerationBuilder(enumerationType) {
    return (data) => {
      if (string(data)) {
        return Enum.fromCode(enumerationType, data);
      } else {
        return data;
      }
    };
  }

  // serialization/json/Field.js
  var Field = class {
    #name;
    #dataType;
    #optional;
    #array;
    /**
     * @param {string} name
     * @param {DataType} dataType
     * @param {boolean=} optional
     * @param {boolean=} array
     */
    constructor(name, dataType, optional, array2) {
      argumentIsRequired(name, "name", String);
      argumentIsRequired(dataType, "dataType", DataType, "DataType");
      argumentIsOptional(optional, "optional", Boolean);
      argumentIsOptional(array2, "array", Boolean);
      this.#name = name;
      this.#dataType = dataType;
      this.#optional = boolean(optional) && optional;
      this.#array = boolean(array2) && array2;
    }
    /**
     * Name of the field.
     *
     * @public
     * @returns {string}
     */
    get name() {
      return this.#name;
    }
    /**
     * Type of the field.
     *
     * @public
     * @returns {DataType}
     */
    get dataType() {
      return this.#dataType;
    }
    /**
     * Indicates if the field can be omitted without violating the schema.
     *
     * @public
     * @returns {boolean}
     */
    get optional() {
      return this.#optional;
    }
    /**
     * Indicates if the field is an array.
     *
     * @public
     * @returns {boolean}
     */
    get array() {
      return this.#array;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[Field (name=${this.#name})]`;
    }
  };

  // test/specs/api/failures/FailureReasonSpec.js
  describe("When a FailureReason is created with a verbose failure type", () => {
    "use strict";
    let reason;
    beforeEach(() => {
      reason = FailureReason.forRequest({ endpoint: { description: "do stuff" } }).addItem(FailureType.ENTITLEMENTS_FAILED, { name: "1" });
    });
    describe("and the FailureReason is converted to a human-readable form", () => {
      let human;
      beforeEach(() => {
        human = reason.format();
      });
      it("should have data", () => {
        expect(human[0].value.hasOwnProperty("data")).toEqual(true);
      });
      it("should have the correct data name", () => {
        expect(human[0].value.data.name).toEqual("1");
      });
    });
  });
  describe("When a FailureReason is created", () => {
    "use strict";
    let reason;
    beforeEach(() => {
      reason = FailureReason.forRequest({ endpoint: { description: "do stuff" } }).addItem(FailureType.REQUEST_CONSTRUCTION_FAILURE, {}, true).addItem(FailureType.REQUEST_PARAMETER_MISSING, { name: "First" }).addItem(FailureType.REQUEST_PARAMETER_MISSING, { name: "Second" });
    });
    describe("and the FailureReason is checked for severity", () => {
      it("should be considered severe", () => {
        expect(reason.getIsSevere()).toEqual(true);
      });
    });
    describe("and the FailureReason error code is checked", () => {
      it("it should return a null value", () => {
        expect(reason.getErrorCode()).toEqual(null);
      });
    });
    describe("and the FailureReason is converted to a human-readable form", () => {
      let human;
      beforeEach(() => {
        human = reason.format();
      });
      it("should have one primary reason", () => {
        expect(human.length).toEqual(1);
      });
      it("should have two secondary reasons", () => {
        expect(human[0].children.length).toEqual(2);
      });
      it("should have the correct primary code", () => {
        expect(human[0].value.code).toEqual(FailureType.REQUEST_CONSTRUCTION_FAILURE.code);
      });
      it("should have the correct primary message", () => {
        expect(human[0].value.message).toEqual("An attempt to do stuff failed because some required information is missing.");
      });
      it("should have the correct secondary message (1)", () => {
        expect(human[0].children[0].value.message).toEqual('The "first" field is required.');
      });
      it("should have the correct secondary code (1)", () => {
        expect(human[0].children[0].value.code).toEqual(FailureType.REQUEST_PARAMETER_MISSING.code);
      });
      it("should not have verbose data for the secondary message (1)", () => {
        expect(human[0].children[0].value.hasOwnProperty("data")).toEqual(false);
      });
      it("should have the correct secondary message (2)", () => {
        expect(human[0].children[1].value.message).toEqual('The "second" field is required.');
      });
      it("should have the correct secondary code (2)", () => {
        expect(human[0].children[1].value.code).toEqual(FailureType.REQUEST_PARAMETER_MISSING.code);
      });
      it("should not have verbose data for the secondary message (2)", () => {
        expect(human[0].children[1].value.hasOwnProperty("data")).toEqual(false);
      });
    });
  });
  describe("A FailureReason is created with a FailureType that has a non-standard error code", () => {
    "use strict";
    let type;
    let reason;
    beforeEach(() => {
      const code = "TEST_ERROR_CODE";
      const template = "This is an error with a non-standard error code";
      type = Enum.fromCode(FailureType, code) || new FailureType(code, template, false, 403);
      reason = new FailureReason().addItem(type, {});
    });
    describe("and the FailureReason error code is checked", () => {
      it("it should return the non-standard error code", () => {
        expect(reason.getErrorCode()).toEqual(403);
      });
    });
  });
  describe("When a schema is validated", () => {
    let schema;
    beforeEach(() => {
      schema = new Schema("person", [new Field("first", DataType.STRING), new Field("last", DataType.STRING)]);
    });
    describe("and a valid schema is processed", () => {
      let result;
      beforeEach(async () => {
        result = await FailureReason.validateSchema(schema, { first: "bryan", last: "ingle" });
      });
      it("should return null (not a FailureReason)", () => {
        expect(result).toEqual(null);
      });
    });
    describe("and an invalid schema is processed (with one invalid property)", () => {
      let successResult = null;
      let failureResult = null;
      beforeEach(async () => {
        try {
          successResult = await FailureReason.validateSchema(schema, { first: "bryan" });
        } catch (e) {
          failureResult = e;
        }
      });
      it("should fail with a formatted failure reason", () => {
        expect(failureResult).not.toEqual(null);
      });
      it("should fail with a formatted failure reason, having one child", () => {
        expect(failureResult[0].children.length).toEqual(1);
      });
    });
    describe("and an invalid schema is processed (with two invalid properties)", () => {
      let successResult = null;
      let failureResult = null;
      beforeEach(async () => {
        try {
          successResult = await FailureReason.validateSchema(schema, {});
        } catch (e) {
          failureResult = e;
        }
      });
      it("should fail with a formatted failure reason", () => {
        expect(failureResult).not.toEqual(null);
      });
      it("should fail with a formatted failure reason, having two children", () => {
        expect(failureResult[0].children.length).toEqual(2);
      });
    });
  });
  describe("When FailureReason public helpers are used", () => {
    "use strict";
    let reason;
    beforeEach(() => {
      reason = new FailureReason({ endpoint: { description: "request" } }).addItem(FailureType.REQUEST_CONSTRUCTION_FAILURE, null, true).addItem(FailureType.REQUEST_PARAMETER_MISSING, { name: "first" });
    });
    it("should report that an existing failure type exists", () => {
      expect(reason.hasFailureType(FailureType.REQUEST_PARAMETER_MISSING)).toEqual(true);
    });
    it("should report that a non-existing failure type does not exist", () => {
      expect(reason.hasFailureType(FailureType.REQUEST_AUTHORIZATION_FAILURE)).toEqual(false);
    });
    it("should reset to the previous node when requested", () => {
      reason.addItem(FailureType.REQUEST_INPUT_MALFORMED, null, true).reset(true).addItem(FailureType.REQUEST_PARAMETER_MISSING, { name: "second" });
      expect(reason.format()[0].children.length).toEqual(2);
    });
    it("should reset to the root node by default", () => {
      reason.reset().addItem(FailureType.REQUEST_GENERAL_FAILURE);
      expect(reason.format().length).toEqual(2);
    });
    it("should serialize to JSON using the formatted reason", () => {
      expect(reason.toJSON()).toEqual(reason.format());
    });
    it("should return HTTP status code 400 for the current failure reason", () => {
      expect(FailureReason.getHttpStatusCode(reason)).toEqual(400);
    });
    it("should return HTTP status code 403 for authorization failure", () => {
      expect(FailureReason.getHttpStatusCode(FailureReason.from(FailureType.REQUEST_AUTHORIZATION_FAILURE))).toEqual(403);
    });
  });

  // test/specs/api/failures/FailureTypeSpec.js
  describe("When FailureType values are used", () => {
    "use strict";
    const failureTypes = [
      "REQUEST_CONSTRUCTION_FAILURE",
      "REQUEST_PARAMETER_MISSING",
      "REQUEST_PARAMETER_MALFORMED",
      "REQUEST_IDENTITY_FAILURE",
      "REQUEST_AUTHORIZATION_FAILURE",
      "REQUEST_INPUT_MALFORMED",
      "SCHEMA_VALIDATION_FAILURE",
      "REQUEST_GENERAL_FAILURE",
      "ENTITLEMENTS_FAILED"
    ];
    failureTypes.forEach((name) => {
      describe(`for ${name}`, () => {
        it("should be a FailureType instance", () => {
          expect(FailureType[name] instanceof FailureType).toEqual(true);
        });
        it("should have correct code", () => {
          expect(FailureType[name].code).toEqual(name);
        });
        it("should have a string template", () => {
          expect(typeof FailureType[name].template).toEqual("string");
        });
      });
    });
    describe("with custom constructor metadata", () => {
      let type;
      beforeEach(() => {
        type = new FailureType("CUSTOM", "Template", false, 409, true);
      });
      it("should have the correct template", () => {
        expect(type.template).toEqual("Template");
      });
      it("should have the correct severe value", () => {
        expect(type.severe).toEqual(false);
      });
      it("should have the correct error code", () => {
        expect(type.error).toEqual(409);
      });
      it("should have the correct verbose value", () => {
        expect(type.verbose).toEqual(true);
      });
    });
    describe("with default optional constructor metadata", () => {
      let type;
      beforeEach(() => {
        type = new FailureType("CUSTOM", "Template");
      });
      it("should default severe to true", () => {
        expect(type.severe).toEqual(true);
      });
      it("should default error to null", () => {
        expect(type.error).toBeNull();
      });
      it("should default verbose to false", () => {
        expect(type.verbose).toEqual(false);
      });
    });
    it("should return HTTP status code 401 for identity failure", () => {
      expect(FailureType.getHttpStatusCode(FailureType.REQUEST_IDENTITY_FAILURE)).toEqual(401);
    });
    it("should return HTTP status code 403 for authorization failure", () => {
      expect(FailureType.getHttpStatusCode(FailureType.REQUEST_AUTHORIZATION_FAILURE)).toEqual(403);
    });
    it("should return a default HTTP status code for other failures", () => {
      expect(FailureType.getHttpStatusCode(FailureType.REQUEST_GENERAL_FAILURE)).toEqual(400);
    });
    it("should validate getHttpStatusCode arguments", () => {
      expect(() => FailureType.getHttpStatusCode(null)).toThrow();
    });
  });

  // ../../node_modules/axios/lib/helpers/bind.js
  function bind(fn2, thisArg) {
    return function wrap() {
      return fn2.apply(thisArg, arguments);
    };
  }

  // ../../node_modules/axios/lib/utils.js
  var { toString } = Object.prototype;
  var { getPrototypeOf } = Object;
  var { iterator, toStringTag } = Symbol;
  var hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
  var hasOwnInPrototypeChain = (thing, prop) => {
    let obj = thing;
    const seen = [];
    while (obj != null && obj !== Object.prototype) {
      if (seen.indexOf(obj) !== -1) {
        return false;
      }
      seen.push(obj);
      if (hasOwnProperty(obj, prop)) {
        return true;
      }
      obj = getPrototypeOf(obj);
    }
    return false;
  };
  var getSafeProp = (obj, prop) => obj != null && hasOwnInPrototypeChain(obj, prop) ? obj[prop] : void 0;
  var kindOf = /* @__PURE__ */ ((cache2) => (thing) => {
    const str = toString.call(thing);
    return cache2[str] || (cache2[str] = str.slice(8, -1).toLowerCase());
  })(/* @__PURE__ */ Object.create(null));
  var kindOfTest = (type) => {
    type = type.toLowerCase();
    return (thing) => kindOf(thing) === type;
  };
  var typeOfTest = (type) => (thing) => typeof thing === type;
  var { isArray } = Array;
  var isUndefined = typeOfTest("undefined");
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }
  var isArrayBuffer = kindOfTest("ArrayBuffer");
  function isArrayBufferView(val) {
    let result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result;
  }
  var isString = typeOfTest("string");
  var isFunction = typeOfTest("function");
  var isNumber = typeOfTest("number");
  var isObject = (thing) => thing !== null && typeof thing === "object";
  var isBoolean = (thing) => thing === true || thing === false;
  var isPlainObject = (val) => {
    if (!isObject(val)) {
      return false;
    }
    const prototype2 = getPrototypeOf(val);
    return (prototype2 === null || prototype2 === Object.prototype || getPrototypeOf(prototype2) === null) && // Treat any genuine (non-Object.prototype-polluted) Symbol.toStringTag or
    // Symbol.iterator as evidence the value is a tagged/iterable type rather
    // than a plain object, while ignoring keys injected onto Object.prototype.
    !hasOwnInPrototypeChain(val, toStringTag) && !hasOwnInPrototypeChain(val, iterator);
  };
  var isEmptyObject = (val) => {
    if (!isObject(val) || isBuffer(val)) {
      return false;
    }
    try {
      return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
    } catch (e) {
      return false;
    }
  };
  var isDate = kindOfTest("Date");
  var isFile = kindOfTest("File");
  var isReactNativeBlob = (value) => {
    return !!(value && typeof value.uri !== "undefined");
  };
  var isReactNative = (formData) => formData && typeof formData.getParts !== "undefined";
  var isBlob = kindOfTest("Blob");
  var isFileList = kindOfTest("FileList");
  var isStream = (val) => isObject(val) && isFunction(val.pipe);
  function getGlobal() {
    if (typeof globalThis !== "undefined") return globalThis;
    if (typeof self !== "undefined") return self;
    if (typeof window !== "undefined") return window;
    if (typeof global !== "undefined") return global;
    return {};
  }
  var G = getGlobal();
  var FormDataCtor = typeof G.FormData !== "undefined" ? G.FormData : void 0;
  var isFormData = (thing) => {
    if (!thing) return false;
    if (FormDataCtor && thing instanceof FormDataCtor) return true;
    const proto = getPrototypeOf(thing);
    if (!proto || proto === Object.prototype) return false;
    if (!isFunction(thing.append)) return false;
    const kind = kindOf(thing);
    return kind === "formdata" || // detect form-data instance
    kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]";
  };
  var isURLSearchParams = kindOfTest("URLSearchParams");
  var [isReadableStream, isRequest, isResponse, isHeaders] = [
    "ReadableStream",
    "Request",
    "Response",
    "Headers"
  ].map(kindOfTest);
  var trim = (str) => {
    return str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  };
  function forEach(obj, fn2, { allOwnKeys = false } = {}) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    let i;
    let l;
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (i = 0, l = obj.length; i < l; i++) {
        fn2.call(null, obj[i], i, obj);
      }
    } else {
      if (isBuffer(obj)) {
        return;
      }
      const keys2 = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      const len = keys2.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys2[i];
        fn2.call(null, obj[key], key, obj);
      }
    }
  }
  function findKey(obj, key) {
    if (isBuffer(obj)) {
      return null;
    }
    key = key.toLowerCase();
    const keys2 = Object.keys(obj);
    let i = keys2.length;
    let _key;
    while (i-- > 0) {
      _key = keys2[i];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }
  var _global = (() => {
    if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
  })();
  var isContextDefined = (context) => !isUndefined(context) && context !== _global;
  function merge(...objs) {
    const { caseless, skipUndefined } = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key) => {
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        return;
      }
      const targetKey = caseless && typeof key === "string" && findKey(result, key) || key;
      const existing = hasOwnProperty(result, targetKey) ? result[targetKey] : void 0;
      if (isPlainObject(existing) && isPlainObject(val)) {
        result[targetKey] = merge(existing, val);
      } else if (isPlainObject(val)) {
        result[targetKey] = merge({}, val);
      } else if (isArray(val)) {
        result[targetKey] = val.slice();
      } else if (!skipUndefined || !isUndefined(val)) {
        result[targetKey] = val;
      }
    };
    for (let i = 0, l = objs.length; i < l; i++) {
      const source = objs[i];
      if (!source || isBuffer(source)) {
        continue;
      }
      forEach(source, assignValue);
      if (typeof source !== "object" || isArray(source)) {
        continue;
      }
      const symbols = Object.getOwnPropertySymbols(source);
      for (let j = 0; j < symbols.length; j++) {
        const symbol = symbols[j];
        if (propertyIsEnumerable.call(source, symbol)) {
          assignValue(source[symbol], symbol);
        }
      }
    }
    return result;
  }
  var extend = (a, b, thisArg, { allOwnKeys } = {}) => {
    forEach(
      b,
      (val, key) => {
        if (thisArg && isFunction(val)) {
          Object.defineProperty(a, key, {
            // Null-proto descriptor so a polluted Object.prototype.get cannot
            // hijack defineProperty's accessor-vs-data resolution.
            __proto__: null,
            value: bind(val, thisArg),
            writable: true,
            enumerable: true,
            configurable: true
          });
        } else {
          Object.defineProperty(a, key, {
            __proto__: null,
            value: val,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      },
      { allOwnKeys }
    );
    return a;
  };
  var stripBOM = (content) => {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  };
  var inherits = (constructor, superConstructor, props, descriptors) => {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors);
    Object.defineProperty(constructor.prototype, "constructor", {
      __proto__: null,
      value: constructor,
      writable: true,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(constructor, "super", {
      __proto__: null,
      value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
  };
  var toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
    let props;
    let i;
    let prop;
    const merged = {};
    destObj = destObj || {};
    if (sourceObj == null) return destObj;
    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i = props.length;
      while (i-- > 0) {
        prop = props[i];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
  };
  var endsWith = (str, searchString, position) => {
    str = String(str);
    if (position === void 0 || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
  var toArray = (thing) => {
    if (!thing) return null;
    if (isArray(thing)) return thing;
    let i = thing.length;
    if (!isNumber(i)) return null;
    const arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  };
  var isTypedArray = /* @__PURE__ */ ((TypedArray) => {
    return (thing) => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
  var forEachEntry = (obj, fn2) => {
    const generator = obj && obj[iterator];
    const _iterator = generator.call(obj);
    let result;
    while ((result = _iterator.next()) && !result.done) {
      const pair = result.value;
      fn2.call(obj, pair[0], pair[1]);
    }
  };
  var matchAll = (regExp, str) => {
    let matches;
    const arr = [];
    while ((matches = regExp.exec(str)) !== null) {
      arr.push(matches);
    }
    return arr;
  };
  var isHTMLForm = kindOfTest("HTMLFormElement");
  var toCamelCase = (str) => {
    return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    });
  };
  var { propertyIsEnumerable } = Object.prototype;
  var isRegExp = kindOfTest("RegExp");
  var reduceDescriptors = (obj, reducer) => {
    const descriptors = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach(descriptors, (descriptor, name) => {
      let ret;
      if ((ret = reducer(descriptor, name, obj)) !== false) {
        reducedDescriptors[name] = ret || descriptor;
      }
    });
    Object.defineProperties(obj, reducedDescriptors);
  };
  var freezeMethods = (obj) => {
    reduceDescriptors(obj, (descriptor, name) => {
      if (isFunction(obj) && ["arguments", "caller", "callee"].includes(name)) {
        return false;
      }
      const value = obj[name];
      if (!isFunction(value)) return;
      descriptor.enumerable = false;
      if ("writable" in descriptor) {
        descriptor.writable = false;
        return;
      }
      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error("Can not rewrite read-only method '" + name + "'");
        };
      }
    });
  };
  var toObjectSet = (arrayOrString, delimiter) => {
    const obj = {};
    const define = (arr) => {
      arr.forEach((value) => {
        obj[value] = true;
      });
    };
    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
    return obj;
  };
  var noop = () => {
  };
  var toFiniteNumber = (value, defaultValue) => {
    return value != null && Number.isFinite(value = +value) ? value : defaultValue;
  };
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
  }
  var toJSONObject = (obj) => {
    const visited = /* @__PURE__ */ new WeakSet();
    const visit = (source) => {
      if (isObject(source)) {
        if (visited.has(source)) {
          return;
        }
        if (isBuffer(source)) {
          return source;
        }
        if (!("toJSON" in source)) {
          visited.add(source);
          const target = isArray(source) ? [] : {};
          forEach(source, (value, key) => {
            const reducedValue = visit(value);
            !isUndefined(reducedValue) && (target[key] = reducedValue);
          });
          visited.delete(source);
          return target;
        }
      }
      return source;
    };
    return visit(obj);
  };
  var isAsyncFn = kindOfTest("AsyncFunction");
  var isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
  var _setImmediate = ((setImmediateSupported, postMessageSupported) => {
    if (setImmediateSupported) {
      return setImmediate;
    }
    return postMessageSupported ? ((token, callbacks) => {
      _global.addEventListener(
        "message",
        ({ source, data }) => {
          if (source === _global && data === token) {
            callbacks.length && callbacks.shift()();
          }
        },
        false
      );
      return (cb) => {
        callbacks.push(cb);
        _global.postMessage(token, "*");
      };
    })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
  })(typeof setImmediate === "function", isFunction(_global.postMessage));
  var asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
  var isIterable = (thing) => thing != null && isFunction(thing[iterator]);
  var isSafeIterable = (thing) => thing != null && hasOwnInPrototypeChain(thing, iterator) && isIterable(thing);
  var utils_default = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isEmptyObject,
    isReadableStream,
    isRequest,
    isResponse,
    isHeaders,
    isUndefined,
    isDate,
    isFile,
    isReactNativeBlob,
    isReactNative,
    isBlob,
    isRegExp,
    isFunction,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty,
    // an alias to avoid ESLint no-prototype-builtins detection
    hasOwnInPrototypeChain,
    getSafeProp,
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable,
    setImmediate: _setImmediate,
    asap,
    isIterable,
    isSafeIterable
  };

  // ../../node_modules/axios/lib/helpers/parseHeaders.js
  var ignoreDuplicateOf = utils_default.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ]);
  var parseHeaders_default = (rawHeaders) => {
    const parsed = {};
    let key;
    let val;
    let i;
    rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
      i = line.indexOf(":");
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();
      if (!key || parsed[key] && ignoreDuplicateOf[key]) {
        return;
      }
      if (key === "set-cookie") {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    });
    return parsed;
  };

  // ../../node_modules/axios/lib/helpers/sanitizeHeaderValue.js
  function trimSPorHTAB(str) {
    let start = 0;
    let end = str.length;
    while (start < end) {
      const code = str.charCodeAt(start);
      if (code !== 9 && code !== 32) {
        break;
      }
      start += 1;
    }
    while (end > start) {
      const code = str.charCodeAt(end - 1);
      if (code !== 9 && code !== 32) {
        break;
      }
      end -= 1;
    }
    return start === 0 && end === str.length ? str : str.slice(start, end);
  }
  var INVALID_UNICODE_HEADER_VALUE_CHARS = new RegExp("[\\u0000-\\u0008\\u000a-\\u001f\\u007f]+", "g");
  var INVALID_BYTE_STRING_HEADER_VALUE_CHARS = new RegExp("[^\\u0009\\u0020-\\u007e\\u0080-\\u00ff]+", "g");
  function sanitizeValue(value, invalidChars) {
    if (utils_default.isArray(value)) {
      return value.map((item) => sanitizeValue(item, invalidChars));
    }
    return trimSPorHTAB(String(value).replace(invalidChars, ""));
  }
  var sanitizeHeaderValue = (value) => sanitizeValue(value, INVALID_UNICODE_HEADER_VALUE_CHARS);
  var sanitizeByteStringHeaderValue = (value) => sanitizeValue(value, INVALID_BYTE_STRING_HEADER_VALUE_CHARS);
  function toByteStringHeaderObject(headers) {
    const byteStringHeaders = /* @__PURE__ */ Object.create(null);
    utils_default.forEach(headers.toJSON(), (value, header) => {
      byteStringHeaders[header] = sanitizeByteStringHeaderValue(value);
    });
    return byteStringHeaders;
  }

  // ../../node_modules/axios/lib/core/AxiosHeaders.js
  var $internals = /* @__PURE__ */ Symbol("internals");
  function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
  }
  function normalizeValue(value) {
    if (value === false || value == null) {
      return value;
    }
    return utils_default.isArray(value) ? value.map(normalizeValue) : sanitizeHeaderValue(String(value));
  }
  function parseTokens(str) {
    const tokens = /* @__PURE__ */ Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while (match = tokensRE.exec(str)) {
      tokens[match[1]] = match[2];
    }
    return tokens;
  }
  var isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
  function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
    if (utils_default.isFunction(filter2)) {
      return filter2.call(this, value, header);
    }
    if (isHeaderNameFilter) {
      value = header;
    }
    if (!utils_default.isString(value)) return;
    if (utils_default.isString(filter2)) {
      return value.indexOf(filter2) !== -1;
    }
    if (utils_default.isRegExp(filter2)) {
      return filter2.test(value);
    }
  }
  function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
  }
  function buildAccessors(obj, header) {
    const accessorName = utils_default.toCamelCase(" " + header);
    ["get", "set", "has"].forEach((methodName) => {
      Object.defineProperty(obj, methodName + accessorName, {
        // Null-proto descriptor so a polluted Object.prototype.get cannot turn
        // this data descriptor into an accessor descriptor on the way in.
        __proto__: null,
        value: function(arg1, arg2, arg3) {
          return this[methodName].call(this, header, arg1, arg2, arg3);
        },
        configurable: true
      });
    });
  }
  var AxiosHeaders = class {
    constructor(headers) {
      headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
      const self2 = this;
      function setHeader(_value, _header, _rewrite) {
        const lHeader = normalizeHeader(_header);
        if (!lHeader) {
          return;
        }
        const key = utils_default.findKey(self2, lHeader);
        if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
          self2[key || _header] = normalizeValue(_value);
        }
      }
      const setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
      if (utils_default.isPlainObject(header) || header instanceof this.constructor) {
        setHeaders(header, valueOrRewrite);
      } else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
        setHeaders(parseHeaders_default(header), valueOrRewrite);
      } else if (utils_default.isObject(header) && utils_default.isSafeIterable(header)) {
        let obj = /* @__PURE__ */ Object.create(null), dest, key;
        for (const entry of header) {
          if (!utils_default.isArray(entry)) {
            throw new TypeError("Object iterator must return a key-value pair");
          }
          key = entry[0];
          if (utils_default.hasOwnProp(obj, key)) {
            dest = obj[key];
            obj[key] = utils_default.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]];
          } else {
            obj[key] = entry[1];
          }
        }
        setHeaders(obj, valueOrRewrite);
      } else {
        header != null && setHeader(valueOrRewrite, header, rewrite);
      }
      return this;
    }
    get(header, parser) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils_default.findKey(this, header);
        if (key) {
          const value = this[key];
          if (!parser) {
            return value;
          }
          if (parser === true) {
            return parseTokens(value);
          }
          if (utils_default.isFunction(parser)) {
            return parser.call(this, value, key);
          }
          if (utils_default.isRegExp(parser)) {
            return parser.exec(value);
          }
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(header, matcher) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils_default.findKey(this, header);
        return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }
      return false;
    }
    delete(header, matcher) {
      const self2 = this;
      let deleted = false;
      function deleteHeader(_header) {
        _header = normalizeHeader(_header);
        if (_header) {
          const key = utils_default.findKey(self2, _header);
          if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
            delete self2[key];
            deleted = true;
          }
        }
      }
      if (utils_default.isArray(header)) {
        header.forEach(deleteHeader);
      } else {
        deleteHeader(header);
      }
      return deleted;
    }
    clear(matcher) {
      const keys2 = Object.keys(this);
      let i = keys2.length;
      let deleted = false;
      while (i--) {
        const key = keys2[i];
        if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
          delete this[key];
          deleted = true;
        }
      }
      return deleted;
    }
    normalize(format3) {
      const self2 = this;
      const headers = {};
      utils_default.forEach(this, (value, header) => {
        const key = utils_default.findKey(headers, header);
        if (key) {
          self2[key] = normalizeValue(value);
          delete self2[header];
          return;
        }
        const normalized = format3 ? formatHeader(header) : String(header).trim();
        if (normalized !== header) {
          delete self2[header];
        }
        self2[normalized] = normalizeValue(value);
        headers[normalized] = true;
      });
      return this;
    }
    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
      const obj = /* @__PURE__ */ Object.create(null);
      utils_default.forEach(this, (value, header) => {
        value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
      });
      return obj;
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
    }
    getSetCookie() {
      return this.get("set-cookie") || [];
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }
    static concat(first3, ...targets) {
      const computed = new this(first3);
      targets.forEach((target) => computed.set(target));
      return computed;
    }
    static accessor(header) {
      const internals = this[$internals] = this[$internals] = {
        accessors: {}
      };
      const accessors = internals.accessors;
      const prototype2 = this.prototype;
      function defineAccessor(_header) {
        const lHeader = normalizeHeader(_header);
        if (!accessors[lHeader]) {
          buildAccessors(prototype2, _header);
          accessors[lHeader] = true;
        }
      }
      utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
      return this;
    }
  };
  AxiosHeaders.accessor([
    "Content-Type",
    "Content-Length",
    "Accept",
    "Accept-Encoding",
    "User-Agent",
    "Authorization"
  ]);
  utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
    let mapped = key[0].toUpperCase() + key.slice(1);
    return {
      get: () => value,
      set(headerValue) {
        this[mapped] = headerValue;
      }
    };
  });
  utils_default.freezeMethods(AxiosHeaders);
  var AxiosHeaders_default = AxiosHeaders;

  // ../../node_modules/axios/lib/core/AxiosError.js
  var REDACTED = "[REDACTED ****]";
  function hasOwnOrPrototypeToJSON(source) {
    if (utils_default.hasOwnProp(source, "toJSON")) {
      return true;
    }
    let prototype2 = Object.getPrototypeOf(source);
    while (prototype2 && prototype2 !== Object.prototype) {
      if (utils_default.hasOwnProp(prototype2, "toJSON")) {
        return true;
      }
      prototype2 = Object.getPrototypeOf(prototype2);
    }
    return false;
  }
  function redactConfig(config, redactKeys) {
    const lowerKeys = new Set(redactKeys.map((k) => String(k).toLowerCase()));
    const seen = [];
    const visit = (source) => {
      if (source === null || typeof source !== "object") return source;
      if (utils_default.isBuffer(source)) return source;
      if (seen.indexOf(source) !== -1) return void 0;
      if (source instanceof AxiosHeaders_default) {
        source = source.toJSON();
      }
      seen.push(source);
      let result;
      if (utils_default.isArray(source)) {
        result = [];
        source.forEach((v, i) => {
          const reducedValue = visit(v);
          if (!utils_default.isUndefined(reducedValue)) {
            result[i] = reducedValue;
          }
        });
      } else {
        if (!utils_default.isPlainObject(source) && hasOwnOrPrototypeToJSON(source)) {
          seen.pop();
          return source;
        }
        result = /* @__PURE__ */ Object.create(null);
        for (const [key, value] of Object.entries(source)) {
          const reducedValue = lowerKeys.has(key.toLowerCase()) ? REDACTED : visit(value);
          if (!utils_default.isUndefined(reducedValue)) {
            result[key] = reducedValue;
          }
        }
      }
      seen.pop();
      return result;
    };
    return visit(config);
  }
  var AxiosError = class _AxiosError extends Error {
    static from(error, code, config, request, response, customProps) {
      const axiosError = new _AxiosError(error.message, code || error.code, config, request, response);
      axiosError.cause = error;
      axiosError.name = error.name;
      if (error.status != null && axiosError.status == null) {
        axiosError.status = error.status;
      }
      customProps && Object.assign(axiosError, customProps);
      return axiosError;
    }
    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [config] The config.
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     *
     * @returns {Error} The created error.
     */
    constructor(message, code, config, request, response) {
      super(message);
      Object.defineProperty(this, "message", {
        // Null-proto descriptor so a polluted Object.prototype.get cannot turn
        // this data descriptor into an accessor descriptor on the way in.
        __proto__: null,
        value: message,
        enumerable: true,
        writable: true,
        configurable: true
      });
      this.name = "AxiosError";
      this.isAxiosError = true;
      code && (this.code = code);
      config && (this.config = config);
      request && (this.request = request);
      if (response) {
        this.response = response;
        this.status = response.status;
      }
    }
    toJSON() {
      const config = this.config;
      const redactKeys = config && utils_default.hasOwnProp(config, "redact") ? config.redact : void 0;
      const serializedConfig = utils_default.isArray(redactKeys) && redactKeys.length > 0 ? redactConfig(config, redactKeys) : utils_default.toJSONObject(config);
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: serializedConfig,
        code: this.code,
        status: this.status
      };
    }
  };
  AxiosError.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
  AxiosError.ERR_BAD_OPTION = "ERR_BAD_OPTION";
  AxiosError.ECONNABORTED = "ECONNABORTED";
  AxiosError.ETIMEDOUT = "ETIMEDOUT";
  AxiosError.ECONNREFUSED = "ECONNREFUSED";
  AxiosError.ERR_NETWORK = "ERR_NETWORK";
  AxiosError.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS";
  AxiosError.ERR_DEPRECATED = "ERR_DEPRECATED";
  AxiosError.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
  AxiosError.ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
  AxiosError.ERR_CANCELED = "ERR_CANCELED";
  AxiosError.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT";
  AxiosError.ERR_INVALID_URL = "ERR_INVALID_URL";
  AxiosError.ERR_FORM_DATA_DEPTH_EXCEEDED = "ERR_FORM_DATA_DEPTH_EXCEEDED";
  var AxiosError_default = AxiosError;

  // ../../node_modules/axios/lib/helpers/null.js
  var null_default = null;

  // ../../node_modules/axios/lib/helpers/toFormData.js
  var DEFAULT_FORM_DATA_MAX_DEPTH = 100;
  function isVisitable(thing) {
    return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
  }
  function removeBrackets(key) {
    return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
  }
  function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token, i) {
      token = removeBrackets(token);
      return !dots && i ? "[" + token + "]" : token;
    }).join(dots ? "." : "");
  }
  function isFlatArray(arr) {
    return utils_default.isArray(arr) && !arr.some(isVisitable);
  }
  var predicates = utils_default.toFlatObject(utils_default, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
  });
  function toFormData(obj, formData, options) {
    if (!utils_default.isObject(obj)) {
      throw new TypeError("target must be an object");
    }
    formData = formData || new (null_default || FormData)();
    options = utils_default.toFlatObject(
      options,
      {
        metaTokens: true,
        dots: false,
        indexes: false
      },
      false,
      function defined(option, source) {
        return !utils_default.isUndefined(source[option]);
      }
    );
    const metaTokens = options.metaTokens;
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
    const maxDepth = options.maxDepth === void 0 ? DEFAULT_FORM_DATA_MAX_DEPTH : options.maxDepth;
    const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
    const stack = [];
    if (!utils_default.isFunction(visitor)) {
      throw new TypeError("visitor must be a function");
    }
    function convertValue(value) {
      if (value === null) return "";
      if (utils_default.isDate(value)) {
        return value.toISOString();
      }
      if (utils_default.isBoolean(value)) {
        return value.toString();
      }
      if (!useBlob && utils_default.isBlob(value)) {
        throw new AxiosError_default("Blob is not supported. Use a Buffer instead.");
      }
      if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) {
        return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }
    function throwIfMaxDepthExceeded(depth) {
      if (depth > maxDepth) {
        throw new AxiosError_default(
          "Object is too deeply nested (" + depth + " levels). Max depth: " + maxDepth,
          AxiosError_default.ERR_FORM_DATA_DEPTH_EXCEEDED
        );
      }
    }
    function stringifyWithDepthLimit(value, depth) {
      if (maxDepth === Infinity) {
        return JSON.stringify(value);
      }
      const ancestors = [];
      return JSON.stringify(value, function limitDepth(_key, currentValue) {
        if (!utils_default.isObject(currentValue)) {
          return currentValue;
        }
        while (ancestors.length && ancestors[ancestors.length - 1] !== this) {
          ancestors.pop();
        }
        ancestors.push(currentValue);
        throwIfMaxDepthExceeded(depth + ancestors.length - 1);
        return currentValue;
      });
    }
    function defaultVisitor(value, key, path) {
      let arr = value;
      if (utils_default.isReactNative(formData) && utils_default.isReactNativeBlob(value)) {
        formData.append(renderKey(path, key, dots), convertValue(value));
        return false;
      }
      if (value && !path && typeof value === "object") {
        if (utils_default.endsWith(key, "{}")) {
          key = metaTokens ? key : key.slice(0, -2);
          value = stringifyWithDepthLimit(value, 1);
        } else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {
          key = removeBrackets(key);
          arr.forEach(function each(el, index) {
            !(utils_default.isUndefined(el) || el === null) && formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
              convertValue(el)
            );
          });
          return false;
        }
      }
      if (isVisitable(value)) {
        return true;
      }
      formData.append(renderKey(path, key, dots), convertValue(value));
      return false;
    }
    const exposedHelpers = Object.assign(predicates, {
      defaultVisitor,
      convertValue,
      isVisitable
    });
    function build2(value, path, depth = 0) {
      if (utils_default.isUndefined(value)) return;
      throwIfMaxDepthExceeded(depth);
      if (stack.indexOf(value) !== -1) {
        throw new Error("Circular reference detected in " + path.join("."));
      }
      stack.push(value);
      utils_default.forEach(value, function each(el, key) {
        const result = !(utils_default.isUndefined(el) || el === null) && visitor.call(formData, el, utils_default.isString(key) ? key.trim() : key, path, exposedHelpers);
        if (result === true) {
          build2(el, path ? path.concat(key) : [key], depth + 1);
        }
      });
      stack.pop();
    }
    if (!utils_default.isObject(obj)) {
      throw new TypeError("data must be an object");
    }
    build2(obj);
    return formData;
  }
  var toFormData_default = toFormData;

  // ../../node_modules/axios/lib/helpers/AxiosURLSearchParams.js
  function encode(str) {
    const charMap = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+"
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20/g, function replacer(match) {
      return charMap[match];
    });
  }
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && toFormData_default(params, this, options);
  }
  var prototype = AxiosURLSearchParams.prototype;
  prototype.append = function append(name, value) {
    this._pairs.push([name, value]);
  };
  prototype.toString = function toString2(encoder) {
    const _encode = encoder ? function(value) {
      return encoder.call(this, value, encode);
    } : encode;
    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
  };
  var AxiosURLSearchParams_default = AxiosURLSearchParams;

  // ../../node_modules/axios/lib/helpers/buildURL.js
  function encode2(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
  }
  function buildURL(url, params, options) {
    if (!params) {
      return url;
    }
    const _options = utils_default.isFunction(options) ? {
      serialize: options
    } : options;
    const _encode = utils_default.getSafeProp(_options, "encode") || encode2;
    const serializeFn = utils_default.getSafeProp(_options, "serialize");
    let serializedParams;
    if (serializeFn) {
      serializedParams = serializeFn(params, _options);
    } else {
      serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams_default(params, _options).toString(_encode);
    }
    if (serializedParams) {
      const hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  }

  // ../../node_modules/axios/lib/core/InterceptorManager.js
  var InterceptorManager = class {
    constructor() {
      this.handlers = [];
    }
    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     * @param {Object} options The options for the interceptor, synchronous and runWhen
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    }
    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     *
     * @returns {void}
     */
    eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    }
    /**
     * Clear all interceptors from the stack
     *
     * @returns {void}
     */
    clear() {
      if (this.handlers) {
        this.handlers = [];
      }
    }
    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     *
     * @returns {void}
     */
    forEach(fn2) {
      utils_default.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn2(h);
        }
      });
    }
  };
  var InterceptorManager_default = InterceptorManager;

  // ../../node_modules/axios/lib/defaults/transitional.js
  var transitional_default = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false,
    legacyInterceptorReqResOrdering: true,
    advertiseZstdAcceptEncoding: false,
    validateStatusUndefinedResolves: true
  };

  // ../../node_modules/axios/lib/platform/browser/classes/URLSearchParams.js
  var URLSearchParams_default = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams_default;

  // ../../node_modules/axios/lib/platform/browser/classes/FormData.js
  var FormData_default = typeof FormData !== "undefined" ? FormData : null;

  // ../../node_modules/axios/lib/platform/browser/classes/Blob.js
  var Blob_default = typeof Blob !== "undefined" ? Blob : null;

  // ../../node_modules/axios/lib/platform/browser/index.js
  var browser_default = {
    isBrowser: true,
    classes: {
      URLSearchParams: URLSearchParams_default,
      FormData: FormData_default,
      Blob: Blob_default
    },
    protocols: ["http", "https", "file", "blob", "url", "data"]
  };

  // ../../node_modules/axios/lib/platform/common/utils.js
  var utils_exports = {};
  __export(utils_exports, {
    hasBrowserEnv: () => hasBrowserEnv,
    hasStandardBrowserEnv: () => hasStandardBrowserEnv,
    hasStandardBrowserWebWorkerEnv: () => hasStandardBrowserWebWorkerEnv,
    navigator: () => _navigator,
    origin: () => origin
  });
  var hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
  var _navigator = typeof navigator === "object" && navigator || void 0;
  var hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
  var hasStandardBrowserWebWorkerEnv = (() => {
    return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
  })();
  var origin = hasBrowserEnv && window.location.href || "http://localhost";

  // ../../node_modules/axios/lib/platform/index.js
  var platform_default = {
    ...utils_exports,
    ...browser_default
  };

  // ../../node_modules/axios/lib/helpers/toURLEncodedForm.js
  function toURLEncodedForm(data, options) {
    return toFormData_default(data, new platform_default.classes.URLSearchParams(), {
      visitor: function(value, key, path, helpers) {
        if (platform_default.isNode && utils_default.isBuffer(value)) {
          this.append(key, value.toString("base64"));
          return false;
        }
        return helpers.defaultVisitor.apply(this, arguments);
      },
      ...options
    });
  }

  // ../../node_modules/axios/lib/helpers/formDataToJSON.js
  var MAX_DEPTH = DEFAULT_FORM_DATA_MAX_DEPTH;
  function throwIfDepthExceeded(index) {
    if (index > MAX_DEPTH) {
      throw new AxiosError_default(
        "FormData field is too deeply nested (" + index + " levels). Max depth: " + MAX_DEPTH,
        AxiosError_default.ERR_FORM_DATA_DEPTH_EXCEEDED
      );
    }
  }
  function parsePropPath(name) {
    const path = [];
    const pattern = /\w+|\[(\w*)]/g;
    let match;
    while ((match = pattern.exec(name)) !== null) {
      throwIfDepthExceeded(path.length);
      path.push(match[0] === "[]" ? "" : match[1] || match[0]);
    }
    return path;
  }
  function arrayToObject(arr) {
    const obj = {};
    const keys2 = Object.keys(arr);
    let i;
    const len = keys2.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys2[i];
      obj[key] = arr[key];
    }
    return obj;
  }
  function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
      throwIfDepthExceeded(index);
      let name = path[index++];
      if (name === "__proto__") return true;
      const isNumericKey = Number.isFinite(+name);
      const isLast = index >= path.length;
      name = !name && utils_default.isArray(target) ? target.length : name;
      if (isLast) {
        if (utils_default.hasOwnProp(target, name)) {
          target[name] = utils_default.isArray(target[name]) ? target[name].concat(value) : [target[name], value];
        } else {
          target[name] = value;
        }
        return !isNumericKey;
      }
      if (!utils_default.hasOwnProp(target, name) || !utils_default.isObject(target[name])) {
        target[name] = [];
      }
      const result = buildPath(path, value, target[name], index);
      if (result && utils_default.isArray(target[name])) {
        target[name] = arrayToObject(target[name]);
      }
      return !isNumericKey;
    }
    if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
      const obj = {};
      utils_default.forEachEntry(formData, (name, value) => {
        buildPath(parsePropPath(name), value, obj, 0);
      });
      return obj;
    }
    return null;
  }
  var formDataToJSON_default = formDataToJSON;

  // ../../node_modules/axios/lib/defaults/index.js
  var own = (obj, key) => obj != null && utils_default.hasOwnProp(obj, key) ? obj[key] : void 0;
  function stringifySafely(rawValue, parser, encoder) {
    if (utils_default.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils_default.trim(rawValue);
      } catch (e) {
        if (e.name !== "SyntaxError") {
          throw e;
        }
      }
    }
    return (encoder || JSON.stringify)(rawValue);
  }
  var defaults = {
    transitional: transitional_default,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [
      function transformRequest(data, headers) {
        const contentType = headers.getContentType() || "";
        const hasJSONContentType = contentType.indexOf("application/json") > -1;
        const isObjectPayload = utils_default.isObject(data);
        if (isObjectPayload && utils_default.isHTMLForm(data)) {
          data = new FormData(data);
        }
        const isFormData2 = utils_default.isFormData(data);
        if (isFormData2) {
          return hasJSONContentType ? JSON.stringify(formDataToJSON_default(data)) : data;
        }
        if (utils_default.isArrayBuffer(data) || utils_default.isBuffer(data) || utils_default.isStream(data) || utils_default.isFile(data) || utils_default.isBlob(data) || utils_default.isReadableStream(data)) {
          return data;
        }
        if (utils_default.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils_default.isURLSearchParams(data)) {
          headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
          return data.toString();
        }
        let isFileList2;
        if (isObjectPayload) {
          const formSerializer = own(this, "formSerializer");
          if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
            return toURLEncodedForm(data, formSerializer).toString();
          }
          if ((isFileList2 = utils_default.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
            const env = own(this, "env");
            const _FormData = env && env.FormData;
            return toFormData_default(
              isFileList2 ? { "files[]": data } : data,
              _FormData && new _FormData(),
              formSerializer
            );
          }
        }
        if (isObjectPayload || hasJSONContentType) {
          headers.setContentType("application/json", false);
          return stringifySafely(data);
        }
        return data;
      }
    ],
    transformResponse: [
      function transformResponse(data) {
        const transitional2 = own(this, "transitional") || defaults.transitional;
        const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
        const responseType = own(this, "responseType");
        const JSONRequested = responseType === "json";
        if (utils_default.isResponse(data) || utils_default.isReadableStream(data)) {
          return data;
        }
        if (data && utils_default.isString(data) && (forcedJSONParsing && !responseType || JSONRequested)) {
          const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
          const strictJSONParsing = !silentJSONParsing && JSONRequested;
          try {
            return JSON.parse(data, own(this, "parseReviver"));
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === "SyntaxError") {
                throw AxiosError_default.from(e, AxiosError_default.ERR_BAD_RESPONSE, this, null, own(this, "response"));
              }
              throw e;
            }
          }
        }
        return data;
      }
    ],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: platform_default.classes.FormData,
      Blob: platform_default.classes.Blob
    },
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": void 0
      }
    }
  };
  utils_default.forEach(["delete", "get", "head", "post", "put", "patch", "query"], (method) => {
    defaults.headers[method] = {};
  });
  var defaults_default = defaults;

  // ../../node_modules/axios/lib/core/transformData.js
  function transformData(fns, response) {
    const config = this || defaults_default;
    const context = response || config;
    const headers = AxiosHeaders_default.from(context.headers);
    let data = context.data;
    utils_default.forEach(fns, function transform(fn2) {
      data = fn2.call(config, data, headers.normalize(), response ? response.status : void 0);
    });
    headers.normalize();
    return data;
  }

  // ../../node_modules/axios/lib/cancel/isCancel.js
  function isCancel(value) {
    return !!(value && value.__CANCEL__);
  }

  // ../../node_modules/axios/lib/cancel/CanceledError.js
  var CanceledError = class extends AxiosError_default {
    /**
     * A `CanceledError` is an object that is thrown when an operation is canceled.
     *
     * @param {string=} message The message.
     * @param {Object=} config The config.
     * @param {Object=} request The request.
     *
     * @returns {CanceledError} The created error.
     */
    constructor(message, config, request) {
      super(message == null ? "canceled" : message, AxiosError_default.ERR_CANCELED, config, request);
      this.name = "CanceledError";
      this.__CANCEL__ = true;
    }
  };
  var CanceledError_default = CanceledError;

  // ../../node_modules/axios/lib/core/settle.js
  function settle(resolve, reject, response) {
    const validateStatus2 = response.config.validateStatus;
    if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError_default(
        "Request failed with status code " + response.status,
        response.status >= 400 && response.status < 500 ? AxiosError_default.ERR_BAD_REQUEST : AxiosError_default.ERR_BAD_RESPONSE,
        response.config,
        response.request,
        response
      ));
    }
  }

  // ../../node_modules/axios/lib/helpers/parseProtocol.js
  function parseProtocol(url) {
    const match = /^([-+\w]{1,25}):(?:\/\/)?/.exec(url);
    return match && match[1] || "";
  }

  // ../../node_modules/axios/lib/helpers/speedometer.js
  function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;
    min = min !== void 0 ? min : 1e3;
    return function push(chunkLength) {
      const now = Date.now();
      const startedAt = timestamps[tail];
      if (!firstSampleTS) {
        firstSampleTS = now;
      }
      bytes[head] = chunkLength;
      timestamps[head] = now;
      let i = tail;
      let bytesCount = 0;
      while (i !== head) {
        bytesCount += bytes[i++];
        i = i % samplesCount;
      }
      head = (head + 1) % samplesCount;
      if (head === tail) {
        tail = (tail + 1) % samplesCount;
      }
      if (now - firstSampleTS < min) {
        return;
      }
      const passed = startedAt && now - startedAt;
      return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
    };
  }
  var speedometer_default = speedometer;

  // ../../node_modules/axios/lib/helpers/throttle.js
  function throttle(fn2, freq) {
    let timestamp = 0;
    let threshold = 1e3 / freq;
    let lastArgs;
    let timer;
    const invoke = (args, now = Date.now()) => {
      timestamp = now;
      lastArgs = null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn2(...args);
    };
    const throttled = (...args) => {
      const now = Date.now();
      const passed = now - timestamp;
      if (passed >= threshold) {
        invoke(args, now);
      } else {
        lastArgs = args;
        if (!timer) {
          timer = setTimeout(() => {
            timer = null;
            invoke(lastArgs);
          }, threshold - passed);
        }
      }
    };
    const flush = () => lastArgs && invoke(lastArgs);
    return [throttled, flush];
  }
  var throttle_default = throttle;

  // ../../node_modules/axios/lib/helpers/progressEventReducer.js
  var progressEventReducer = (listener, isDownloadStream, freq = 3) => {
    let bytesNotified = 0;
    const _speedometer = speedometer_default(50, 250);
    return throttle_default((e) => {
      if (!e || typeof e.loaded !== "number") {
        return;
      }
      const rawLoaded = e.loaded;
      const total = e.lengthComputable ? e.total : void 0;
      const loaded = total != null ? Math.min(rawLoaded, total) : rawLoaded;
      const progressBytes = Math.max(0, loaded - bytesNotified);
      const rate = _speedometer(progressBytes);
      bytesNotified = Math.max(bytesNotified, loaded);
      const data = {
        loaded,
        total,
        progress: total ? loaded / total : void 0,
        bytes: progressBytes,
        rate: rate ? rate : void 0,
        estimated: rate && total ? (total - loaded) / rate : void 0,
        event: e,
        lengthComputable: total != null,
        [isDownloadStream ? "download" : "upload"]: true
      };
      listener(data);
    }, freq);
  };
  var progressEventDecorator = (total, throttled) => {
    const lengthComputable = total != null;
    return [
      (loaded) => throttled[0]({
        lengthComputable,
        total,
        loaded
      }),
      throttled[1]
    ];
  };
  var asyncDecorator = (fn2) => (...args) => utils_default.asap(() => fn2(...args));

  // ../../node_modules/axios/lib/helpers/isURLSameOrigin.js
  var isURLSameOrigin_default = platform_default.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url) => {
    url = new URL(url, platform_default.origin);
    return origin2.protocol === url.protocol && origin2.host === url.host && (isMSIE || origin2.port === url.port);
  })(
    new URL(platform_default.origin),
    platform_default.navigator && /(msie|trident)/i.test(platform_default.navigator.userAgent)
  ) : () => true;

  // ../../node_modules/axios/lib/helpers/cookies.js
  var cookies_default = platform_default.hasStandardBrowserEnv ? (
    // Standard browser envs support document.cookie
    {
      write(name, value, expires, path, domain, secure, sameSite) {
        if (typeof document === "undefined") return;
        const cookie = [`${name}=${encodeURIComponent(value)}`];
        if (utils_default.isNumber(expires)) {
          cookie.push(`expires=${new Date(expires).toUTCString()}`);
        }
        if (utils_default.isString(path)) {
          cookie.push(`path=${path}`);
        }
        if (utils_default.isString(domain)) {
          cookie.push(`domain=${domain}`);
        }
        if (secure === true) {
          cookie.push("secure");
        }
        if (utils_default.isString(sameSite)) {
          cookie.push(`SameSite=${sameSite}`);
        }
        document.cookie = cookie.join("; ");
      },
      read(name) {
        if (typeof document === "undefined") return null;
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].replace(/^\s+/, "");
          const eq = cookie.indexOf("=");
          if (eq !== -1 && cookie.slice(0, eq) === name) {
            return decodeURIComponent(cookie.slice(eq + 1));
          }
        }
        return null;
      },
      remove(name) {
        this.write(name, "", Date.now() - 864e5, "/");
      }
    }
  ) : (
    // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {
      },
      read() {
        return null;
      },
      remove() {
      }
    }
  );

  // ../../node_modules/axios/lib/helpers/isAbsoluteURL.js
  function isAbsoluteURL(url) {
    if (typeof url !== "string") {
      return false;
    }
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  }

  // ../../node_modules/axios/lib/helpers/combineURLs.js
  function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  }

  // ../../node_modules/axios/lib/core/buildFullPath.js
  var malformedHttpProtocol = /^https?:(?!\/\/)/i;
  var httpProtocolControlCharacters = /[\t\n\r]/g;
  function stripLeadingC0ControlOrSpace(url) {
    let i = 0;
    while (i < url.length && url.charCodeAt(i) <= 32) {
      i++;
    }
    return url.slice(i);
  }
  function normalizeURLForProtocolCheck(url) {
    return stripLeadingC0ControlOrSpace(url).replace(httpProtocolControlCharacters, "");
  }
  function assertValidHttpProtocolURL(url, config) {
    if (typeof url === "string" && malformedHttpProtocol.test(normalizeURLForProtocolCheck(url))) {
      throw new AxiosError_default(
        'Invalid URL: missing "//" after protocol',
        AxiosError_default.ERR_INVALID_URL,
        config
      );
    }
  }
  function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls, config) {
    assertValidHttpProtocolURL(requestedURL, config);
    let isRelativeUrl = !isAbsoluteURL(requestedURL);
    if (baseURL && (isRelativeUrl || allowAbsoluteUrls === false)) {
      assertValidHttpProtocolURL(baseURL, config);
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }

  // ../../node_modules/axios/lib/core/mergeConfig.js
  var headersToObject = (thing) => thing instanceof AxiosHeaders_default ? { ...thing } : thing;
  function mergeConfig(config1, config2) {
    config2 = config2 || {};
    const config = /* @__PURE__ */ Object.create(null);
    Object.defineProperty(config, "hasOwnProperty", {
      // Null-proto descriptor so a polluted Object.prototype.get cannot turn
      // this data descriptor into an accessor descriptor on the way in.
      __proto__: null,
      value: Object.prototype.hasOwnProperty,
      enumerable: false,
      writable: true,
      configurable: true
    });
    function getMergedValue(target, source, prop, caseless) {
      if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) {
        return utils_default.merge.call({ caseless }, target, source);
      } else if (utils_default.isPlainObject(source)) {
        return utils_default.merge({}, source);
      } else if (utils_default.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(a, b, prop, caseless) {
      if (!utils_default.isUndefined(b)) {
        return getMergedValue(a, b, prop, caseless);
      } else if (!utils_default.isUndefined(a)) {
        return getMergedValue(void 0, a, prop, caseless);
      }
    }
    function valueFromConfig2(a, b) {
      if (!utils_default.isUndefined(b)) {
        return getMergedValue(void 0, b);
      }
    }
    function defaultToConfig2(a, b) {
      if (!utils_default.isUndefined(b)) {
        return getMergedValue(void 0, b);
      } else if (!utils_default.isUndefined(a)) {
        return getMergedValue(void 0, a);
      }
    }
    function getMergedTransitionalOption(prop) {
      const transitional2 = utils_default.hasOwnProp(config2, "transitional") ? config2.transitional : void 0;
      if (!utils_default.isUndefined(transitional2)) {
        if (utils_default.isPlainObject(transitional2)) {
          if (utils_default.hasOwnProp(transitional2, prop)) {
            return transitional2[prop];
          }
        } else {
          return void 0;
        }
      }
      const transitional1 = utils_default.hasOwnProp(config1, "transitional") ? config1.transitional : void 0;
      if (utils_default.isPlainObject(transitional1) && utils_default.hasOwnProp(transitional1, prop)) {
        return transitional1[prop];
      }
      return void 0;
    }
    function mergeDirectKeys(a, b, prop) {
      if (utils_default.hasOwnProp(config2, prop)) {
        return getMergedValue(a, b);
      } else if (utils_default.hasOwnProp(config1, prop)) {
        return getMergedValue(void 0, a);
      }
    }
    const mergeMap = {
      url: valueFromConfig2,
      method: valueFromConfig2,
      data: valueFromConfig2,
      baseURL: defaultToConfig2,
      transformRequest: defaultToConfig2,
      transformResponse: defaultToConfig2,
      paramsSerializer: defaultToConfig2,
      timeout: defaultToConfig2,
      timeoutMessage: defaultToConfig2,
      withCredentials: defaultToConfig2,
      withXSRFToken: defaultToConfig2,
      adapter: defaultToConfig2,
      responseType: defaultToConfig2,
      xsrfCookieName: defaultToConfig2,
      xsrfHeaderName: defaultToConfig2,
      onUploadProgress: defaultToConfig2,
      onDownloadProgress: defaultToConfig2,
      decompress: defaultToConfig2,
      maxContentLength: defaultToConfig2,
      maxBodyLength: defaultToConfig2,
      beforeRedirect: defaultToConfig2,
      transport: defaultToConfig2,
      httpAgent: defaultToConfig2,
      httpsAgent: defaultToConfig2,
      cancelToken: defaultToConfig2,
      socketPath: defaultToConfig2,
      allowedSocketPaths: defaultToConfig2,
      responseEncoding: defaultToConfig2,
      validateStatus: mergeDirectKeys,
      headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
    };
    utils_default.forEach(Object.keys({ ...config1, ...config2 }), function computeConfigValue(prop) {
      if (prop === "__proto__" || prop === "constructor" || prop === "prototype") return;
      const merge3 = utils_default.hasOwnProp(mergeMap, prop) ? mergeMap[prop] : mergeDeepProperties;
      const a = utils_default.hasOwnProp(config1, prop) ? config1[prop] : void 0;
      const b = utils_default.hasOwnProp(config2, prop) ? config2[prop] : void 0;
      const configValue = merge3(a, b, prop);
      utils_default.isUndefined(configValue) && merge3 !== mergeDirectKeys || (config[prop] = configValue);
    });
    if (utils_default.hasOwnProp(config2, "validateStatus") && utils_default.isUndefined(config2.validateStatus) && getMergedTransitionalOption("validateStatusUndefinedResolves") === false) {
      if (utils_default.hasOwnProp(config1, "validateStatus")) {
        config.validateStatus = getMergedValue(void 0, config1.validateStatus);
      } else {
        delete config.validateStatus;
      }
    }
    return config;
  }

  // ../../node_modules/axios/lib/helpers/resolveConfig.js
  var FORM_DATA_CONTENT_HEADERS = ["content-type", "content-length"];
  function setFormDataHeaders(headers, formHeaders, policy) {
    if (policy !== "content-only") {
      headers.set(formHeaders);
      return;
    }
    Object.entries(formHeaders).forEach(([key, val]) => {
      if (FORM_DATA_CONTENT_HEADERS.includes(key.toLowerCase())) {
        headers.set(key, val);
      }
    });
  }
  var encodeUTF8 = (str) => encodeURIComponent(str).replace(
    /%([0-9A-F]{2})/gi,
    (_, hex) => String.fromCharCode(parseInt(hex, 16))
  );
  function resolveConfig(config) {
    const newConfig = mergeConfig({}, config);
    const own2 = (key) => utils_default.hasOwnProp(newConfig, key) ? newConfig[key] : void 0;
    const data = own2("data");
    let withXSRFToken = own2("withXSRFToken");
    const xsrfHeaderName = own2("xsrfHeaderName");
    const xsrfCookieName = own2("xsrfCookieName");
    let headers = own2("headers");
    const auth = own2("auth");
    const baseURL = own2("baseURL");
    const allowAbsoluteUrls = own2("allowAbsoluteUrls");
    const url = own2("url");
    newConfig.headers = headers = AxiosHeaders_default.from(headers);
    newConfig.url = buildURL(
      buildFullPath(baseURL, url, allowAbsoluteUrls, newConfig),
      own2("params"),
      own2("paramsSerializer")
    );
    if (auth) {
      const username = utils_default.getSafeProp(auth, "username") || "";
      const password = utils_default.getSafeProp(auth, "password") || "";
      headers.set(
        "Authorization",
        "Basic " + btoa(username + ":" + (password ? encodeUTF8(password) : ""))
      );
    }
    if (utils_default.isFormData(data)) {
      if (platform_default.hasStandardBrowserEnv || platform_default.hasStandardBrowserWebWorkerEnv || utils_default.isReactNative(data)) {
        headers.setContentType(void 0);
      } else if (utils_default.isFunction(data.getHeaders)) {
        setFormDataHeaders(headers, data.getHeaders(), own2("formDataHeaderPolicy"));
      }
    }
    if (platform_default.hasStandardBrowserEnv) {
      if (utils_default.isFunction(withXSRFToken)) {
        withXSRFToken = withXSRFToken(newConfig);
      }
      const shouldSendXSRF = withXSRFToken === true || withXSRFToken == null && isURLSameOrigin_default(newConfig.url);
      if (shouldSendXSRF) {
        const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies_default.read(xsrfCookieName);
        if (xsrfValue) {
          headers.set(xsrfHeaderName, xsrfValue);
        }
      }
    }
    return newConfig;
  }
  var resolveConfig_default = resolveConfig;

  // ../../node_modules/axios/lib/adapters/xhr.js
  var isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
  var xhr_default = isXHRAdapterSupported && function(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      const _config = resolveConfig_default(config);
      let requestData = _config.data;
      const requestHeaders = AxiosHeaders_default.from(_config.headers).normalize();
      let { responseType, onUploadProgress, onDownloadProgress } = _config;
      let onCanceled;
      let uploadThrottled, downloadThrottled;
      let flushUpload, flushDownload;
      function done() {
        flushUpload && flushUpload();
        flushDownload && flushDownload();
        _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
        _config.signal && _config.signal.removeEventListener("abort", onCanceled);
      }
      let request = new XMLHttpRequest();
      request.open(_config.method.toUpperCase(), _config.url, true);
      request.timeout = _config.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        const responseHeaders = AxiosHeaders_default.from(
          "getAllResponseHeaders" in request && request.getAllResponseHeaders()
        );
        const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        };
        settle(
          function _resolve(value) {
            resolve(value);
            done();
          },
          function _reject(err) {
            reject(err);
            done();
          },
          response
        );
        request = null;
      }
      if ("onloadend" in request) {
        request.onloadend = onloadend;
      } else {
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }
          if (request.status === 0 && !(request.responseURL && request.responseURL.startsWith("file:"))) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(new AxiosError_default("Request aborted", AxiosError_default.ECONNABORTED, config, request));
        done();
        request = null;
      };
      request.onerror = function handleError(event) {
        const msg = event && event.message ? event.message : "Network Error";
        const err = new AxiosError_default(msg, AxiosError_default.ERR_NETWORK, config, request);
        err.event = event || null;
        reject(err);
        done();
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
        const transitional2 = _config.transitional || transitional_default;
        if (_config.timeoutErrorMessage) {
          timeoutErrorMessage = _config.timeoutErrorMessage;
        }
        reject(
          new AxiosError_default(
            timeoutErrorMessage,
            transitional2.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED,
            config,
            request
          )
        );
        done();
        request = null;
      };
      requestData === void 0 && requestHeaders.setContentType(null);
      if ("setRequestHeader" in request) {
        utils_default.forEach(toByteStringHeaderObject(requestHeaders), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }
      if (!utils_default.isUndefined(_config.withCredentials)) {
        request.withCredentials = !!_config.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request.responseType = _config.responseType;
      }
      if (onDownloadProgress) {
        [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
        request.addEventListener("progress", downloadThrottled);
      }
      if (onUploadProgress && request.upload) {
        [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
        request.upload.addEventListener("progress", uploadThrottled);
        request.upload.addEventListener("loadend", flushUpload);
      }
      if (_config.cancelToken || _config.signal) {
        onCanceled = (cancel) => {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError_default(null, config, request) : cancel);
          request.abort();
          done();
          request = null;
        };
        _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
        if (_config.signal) {
          _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
        }
      }
      const protocol = parseProtocol(_config.url);
      if (protocol && !platform_default.protocols.includes(protocol)) {
        reject(
          new AxiosError_default(
            "Unsupported protocol " + protocol + ":",
            AxiosError_default.ERR_BAD_REQUEST,
            config
          )
        );
        return;
      }
      request.send(requestData || null);
    });
  };

  // ../../node_modules/axios/lib/helpers/composeSignals.js
  var composeSignals = (signals, timeout2) => {
    signals = signals ? signals.filter(Boolean) : [];
    if (!timeout2 && !signals.length) {
      return;
    }
    const controller = new AbortController();
    let aborted = false;
    const onabort = function(reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(
          err instanceof AxiosError_default ? err : new CanceledError_default(err instanceof Error ? err.message : err)
        );
      }
    };
    let timer = timeout2 && setTimeout(() => {
      timer = null;
      onabort(new AxiosError_default(`timeout of ${timeout2}ms exceeded`, AxiosError_default.ETIMEDOUT));
    }, timeout2);
    const unsubscribe = () => {
      if (!signals) {
        return;
      }
      timer && clearTimeout(timer);
      timer = null;
      signals.forEach((signal2) => {
        signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
      });
      signals = null;
    };
    signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
    const { signal } = controller;
    signal.unsubscribe = () => utils_default.asap(unsubscribe);
    return signal;
  };
  var composeSignals_default = composeSignals;

  // ../../node_modules/axios/lib/helpers/trackStream.js
  var streamChunk = function* (chunk, chunkSize) {
    let len = chunk.byteLength;
    if (!chunkSize || len < chunkSize) {
      yield chunk;
      return;
    }
    let pos = 0;
    let end;
    while (pos < len) {
      end = pos + chunkSize;
      yield chunk.slice(pos, end);
      pos = end;
    }
  };
  var readBytes = async function* (iterable2, chunkSize) {
    for await (const chunk of readStream(iterable2)) {
      yield* streamChunk(chunk, chunkSize);
    }
  };
  var readStream = async function* (stream) {
    if (stream[Symbol.asyncIterator]) {
      yield* stream;
      return;
    }
    const reader = stream.getReader();
    try {
      for (; ; ) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        yield value;
      }
    } finally {
      await reader.cancel();
    }
  };
  var trackStream = (stream, chunkSize, onProgress, onFinish) => {
    const iterator2 = readBytes(stream, chunkSize);
    let bytes = 0;
    let done;
    let _onFinish = (e) => {
      if (!done) {
        done = true;
        onFinish && onFinish(e);
      }
    };
    return new ReadableStream(
      {
        async pull(controller) {
          try {
            const { done: done2, value } = await iterator2.next();
            if (done2) {
              _onFinish();
              controller.close();
              return;
            }
            let len = value.byteLength;
            if (onProgress) {
              let loadedBytes = bytes += len;
              onProgress(loadedBytes);
            }
            controller.enqueue(new Uint8Array(value));
          } catch (err) {
            _onFinish(err);
            throw err;
          }
        },
        cancel(reason) {
          _onFinish(reason);
          return iterator2.return();
        }
      },
      {
        highWaterMark: 2
      }
    );
  };

  // ../../node_modules/axios/lib/helpers/estimateDataURLDecodedBytes.js
  var isHexDigit = (charCode) => charCode >= 48 && charCode <= 57 || charCode >= 65 && charCode <= 70 || charCode >= 97 && charCode <= 102;
  var isPercentEncodedByte = (str, i, len) => i + 2 < len && isHexDigit(str.charCodeAt(i + 1)) && isHexDigit(str.charCodeAt(i + 2));
  function estimateDataURLDecodedBytes(url) {
    if (!url || typeof url !== "string") return 0;
    if (!url.startsWith("data:")) return 0;
    const comma = url.indexOf(",");
    if (comma < 0) return 0;
    const meta = url.slice(5, comma);
    const body = url.slice(comma + 1);
    const isBase64 = /;base64/i.test(meta);
    if (isBase64) {
      let effectiveLen = body.length;
      const len = body.length;
      for (let i = 0; i < len; i++) {
        if (body.charCodeAt(i) === 37 && i + 2 < len) {
          const a = body.charCodeAt(i + 1);
          const b = body.charCodeAt(i + 2);
          const isHex = isHexDigit(a) && isHexDigit(b);
          if (isHex) {
            effectiveLen -= 2;
            i += 2;
          }
        }
      }
      let pad = 0;
      let idx = len - 1;
      const tailIsPct3D = (j) => j >= 2 && body.charCodeAt(j - 2) === 37 && // '%'
      body.charCodeAt(j - 1) === 51 && // '3'
      (body.charCodeAt(j) === 68 || body.charCodeAt(j) === 100);
      if (idx >= 0) {
        if (body.charCodeAt(idx) === 61) {
          pad++;
          idx--;
        } else if (tailIsPct3D(idx)) {
          pad++;
          idx -= 3;
        }
      }
      if (pad === 1 && idx >= 0) {
        if (body.charCodeAt(idx) === 61) {
          pad++;
        } else if (tailIsPct3D(idx)) {
          pad++;
        }
      }
      const groups = Math.floor(effectiveLen / 4);
      const bytes2 = groups * 3 - (pad || 0);
      return bytes2 > 0 ? bytes2 : 0;
    }
    let bytes = 0;
    for (let i = 0, len = body.length; i < len; i++) {
      const c = body.charCodeAt(i);
      if (c === 37 && isPercentEncodedByte(body, i, len)) {
        bytes += 1;
        i += 2;
      } else if (c < 128) {
        bytes += 1;
      } else if (c < 2048) {
        bytes += 2;
      } else if (c >= 55296 && c <= 56319 && i + 1 < len) {
        const next = body.charCodeAt(i + 1);
        if (next >= 56320 && next <= 57343) {
          bytes += 4;
          i++;
        } else {
          bytes += 3;
        }
      } else {
        bytes += 3;
      }
    }
    return bytes;
  }

  // ../../node_modules/axios/lib/env/data.js
  var VERSION = "1.18.0";

  // ../../node_modules/axios/lib/adapters/fetch.js
  var DEFAULT_CHUNK_SIZE = 64 * 1024;
  var { isFunction: isFunction2 } = utils_default;
  var encodeUTF82 = (str) => encodeURIComponent(str).replace(
    /%([0-9A-F]{2})/gi,
    (_, hex) => String.fromCharCode(parseInt(hex, 16))
  );
  var decodeURIComponentSafe = (value) => {
    if (!utils_default.isString(value)) {
      return value;
    }
    try {
      return decodeURIComponent(value);
    } catch (error) {
      return value;
    }
  };
  var test = (fn2, ...args) => {
    try {
      return !!fn2(...args);
    } catch (e) {
      return false;
    }
  };
  var maybeWithAuthCredentials = (url) => {
    const protocolIndex = url.indexOf("://");
    let urlToCheck = url;
    if (protocolIndex !== -1) {
      urlToCheck = urlToCheck.slice(protocolIndex + 3);
    }
    return urlToCheck.includes("@") || urlToCheck.includes(":");
  };
  var factory = (env) => {
    const globalObject = utils_default.global !== void 0 && utils_default.global !== null ? utils_default.global : globalThis;
    const { ReadableStream: ReadableStream2, TextEncoder } = globalObject;
    env = utils_default.merge.call(
      {
        skipUndefined: true
      },
      {
        Request: globalObject.Request,
        Response: globalObject.Response
      },
      env
    );
    const { fetch: envFetch, Request, Response } = env;
    const isFetchSupported = envFetch ? isFunction2(envFetch) : typeof fetch === "function";
    const isRequestSupported = isFunction2(Request);
    const isResponseSupported = isFunction2(Response);
    if (!isFetchSupported) {
      return false;
    }
    const isReadableStreamSupported = isFetchSupported && isFunction2(ReadableStream2);
    const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Request(str).arrayBuffer()));
    const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
      let duplexAccessed = false;
      const request = new Request(platform_default.origin, {
        body: new ReadableStream2(),
        method: "POST",
        get duplex() {
          duplexAccessed = true;
          return "half";
        }
      });
      const hasContentType = request.headers.has("Content-Type");
      if (request.body != null) {
        request.body.cancel();
      }
      return duplexAccessed && !hasContentType;
    });
    const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils_default.isReadableStream(new Response("").body));
    const resolvers = {
      stream: supportsResponseStream && ((res) => res.body)
    };
    isFetchSupported && (() => {
      ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
        !resolvers[type] && (resolvers[type] = (res, config) => {
          let method = res && res[type];
          if (method) {
            return method.call(res);
          }
          throw new AxiosError_default(
            `Response type '${type}' is not supported`,
            AxiosError_default.ERR_NOT_SUPPORT,
            config
          );
        });
      });
    })();
    const getBodyLength = async (body) => {
      if (body == null) {
        return 0;
      }
      if (utils_default.isBlob(body)) {
        return body.size;
      }
      if (utils_default.isSpecCompliantForm(body)) {
        const _request = new Request(platform_default.origin, {
          method: "POST",
          body
        });
        return (await _request.arrayBuffer()).byteLength;
      }
      if (utils_default.isArrayBufferView(body) || utils_default.isArrayBuffer(body)) {
        return body.byteLength;
      }
      if (utils_default.isURLSearchParams(body)) {
        body = body + "";
      }
      if (utils_default.isString(body)) {
        return (await encodeText(body)).byteLength;
      }
    };
    const resolveBodyLength = async (headers, body) => {
      const length = utils_default.toFiniteNumber(headers.getContentLength());
      return length == null ? getBodyLength(body) : length;
    };
    return async (config) => {
      let {
        url,
        method,
        data,
        signal,
        cancelToken,
        timeout: timeout2,
        onDownloadProgress,
        onUploadProgress,
        responseType,
        headers,
        withCredentials = "same-origin",
        fetchOptions,
        maxContentLength,
        maxBodyLength
      } = resolveConfig_default(config);
      const hasMaxContentLength = utils_default.isNumber(maxContentLength) && maxContentLength > -1;
      const hasMaxBodyLength = utils_default.isNumber(maxBodyLength) && maxBodyLength > -1;
      const own2 = (key) => utils_default.hasOwnProp(config, key) ? config[key] : void 0;
      let _fetch = envFetch || fetch;
      responseType = responseType ? (responseType + "").toLowerCase() : "text";
      let composedSignal = composeSignals_default(
        [signal, cancelToken && cancelToken.toAbortSignal()],
        timeout2
      );
      let request = null;
      const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
        composedSignal.unsubscribe();
      });
      let requestContentLength;
      let pendingBodyError = null;
      const maxBodyLengthError = () => new AxiosError_default(
        "Request body larger than maxBodyLength limit",
        AxiosError_default.ERR_BAD_REQUEST,
        config,
        request
      );
      try {
        let auth = void 0;
        const configAuth = own2("auth");
        if (configAuth) {
          const username = utils_default.getSafeProp(configAuth, "username") || "";
          const password = utils_default.getSafeProp(configAuth, "password") || "";
          auth = {
            username,
            password
          };
        }
        if (maybeWithAuthCredentials(url)) {
          const parsedURL = new URL(url, platform_default.origin);
          if (!auth && (parsedURL.username || parsedURL.password)) {
            const urlUsername = decodeURIComponentSafe(parsedURL.username);
            const urlPassword = decodeURIComponentSafe(parsedURL.password);
            auth = {
              username: urlUsername,
              password: urlPassword
            };
          }
          if (parsedURL.username || parsedURL.password) {
            parsedURL.username = "";
            parsedURL.password = "";
            url = parsedURL.href;
          }
        }
        if (auth) {
          headers.delete("authorization");
          headers.set(
            "Authorization",
            "Basic " + btoa(encodeUTF82((auth.username || "") + ":" + (auth.password || "")))
          );
        }
        if (hasMaxContentLength && typeof url === "string" && url.startsWith("data:")) {
          const estimated = estimateDataURLDecodedBytes(url);
          if (estimated > maxContentLength) {
            throw new AxiosError_default(
              "maxContentLength size of " + maxContentLength + " exceeded",
              AxiosError_default.ERR_BAD_RESPONSE,
              config,
              request
            );
          }
        }
        if (hasMaxBodyLength && method !== "get" && method !== "head") {
          const outboundLength = await getBodyLength(data);
          if (typeof outboundLength === "number" && isFinite(outboundLength)) {
            requestContentLength = outboundLength;
            if (outboundLength > maxBodyLength) {
              throw maxBodyLengthError();
            }
          }
        }
        const mustEnforceStreamBody = hasMaxBodyLength && (utils_default.isReadableStream(data) || utils_default.isStream(data));
        const trackRequestStream = (stream, onProgress, flush) => trackStream(
          stream,
          DEFAULT_CHUNK_SIZE,
          (loadedBytes) => {
            if (hasMaxBodyLength && loadedBytes > maxBodyLength) {
              throw pendingBodyError = maxBodyLengthError();
            }
            onProgress && onProgress(loadedBytes);
          },
          flush
        );
        if (supportsRequestStream && method !== "get" && method !== "head" && (onUploadProgress || mustEnforceStreamBody)) {
          requestContentLength = requestContentLength == null ? await resolveBodyLength(headers, data) : requestContentLength;
          if (requestContentLength !== 0 || mustEnforceStreamBody) {
            let _request = new Request(url, {
              method: "POST",
              body: data,
              duplex: "half"
            });
            let contentTypeHeader;
            if (utils_default.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
              headers.setContentType(contentTypeHeader);
            }
            if (_request.body) {
              const [onProgress, flush] = onUploadProgress && progressEventDecorator(
                requestContentLength,
                progressEventReducer(asyncDecorator(onUploadProgress))
              ) || [];
              data = trackRequestStream(_request.body, onProgress, flush);
            }
          }
        } else if (mustEnforceStreamBody && !isRequestSupported && isReadableStreamSupported && method !== "get" && method !== "head") {
          data = trackRequestStream(data);
        } else if (mustEnforceStreamBody && isRequestSupported && !supportsRequestStream && method !== "get" && method !== "head") {
          throw new AxiosError_default(
            "Stream request bodies are not supported by the current fetch implementation",
            AxiosError_default.ERR_NOT_SUPPORT,
            config,
            request
          );
        }
        if (!utils_default.isString(withCredentials)) {
          withCredentials = withCredentials ? "include" : "omit";
        }
        const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
        if (utils_default.isFormData(data)) {
          const contentType = headers.getContentType();
          if (contentType && /^multipart\/form-data/i.test(contentType) && !/boundary=/i.test(contentType)) {
            headers.delete("content-type");
          }
        }
        headers.set("User-Agent", "axios/" + VERSION, false);
        const resolvedOptions = {
          ...fetchOptions,
          signal: composedSignal,
          method: method.toUpperCase(),
          headers: toByteStringHeaderObject(headers.normalize()),
          body: data,
          duplex: "half",
          credentials: isCredentialsSupported ? withCredentials : void 0
        };
        request = isRequestSupported && new Request(url, resolvedOptions);
        let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions));
        const responseHeaders = AxiosHeaders_default.from(response.headers);
        if (hasMaxContentLength) {
          const declaredLength = utils_default.toFiniteNumber(responseHeaders.getContentLength());
          if (declaredLength != null && declaredLength > maxContentLength) {
            throw new AxiosError_default(
              "maxContentLength size of " + maxContentLength + " exceeded",
              AxiosError_default.ERR_BAD_RESPONSE,
              config,
              request
            );
          }
        }
        const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
        if (supportsResponseStream && response.body && (onDownloadProgress || hasMaxContentLength || isStreamResponse && unsubscribe)) {
          const options = {};
          ["status", "statusText", "headers"].forEach((prop) => {
            options[prop] = response[prop];
          });
          const responseContentLength = utils_default.toFiniteNumber(responseHeaders.getContentLength());
          const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
            responseContentLength,
            progressEventReducer(asyncDecorator(onDownloadProgress), true)
          ) || [];
          let bytesRead = 0;
          const onChunkProgress = (loadedBytes) => {
            if (hasMaxContentLength) {
              bytesRead = loadedBytes;
              if (bytesRead > maxContentLength) {
                throw new AxiosError_default(
                  "maxContentLength size of " + maxContentLength + " exceeded",
                  AxiosError_default.ERR_BAD_RESPONSE,
                  config,
                  request
                );
              }
            }
            onProgress && onProgress(loadedBytes);
          };
          response = new Response(
            trackStream(response.body, DEFAULT_CHUNK_SIZE, onChunkProgress, () => {
              flush && flush();
              unsubscribe && unsubscribe();
            }),
            options
          );
        }
        responseType = responseType || "text";
        let responseData = await resolvers[utils_default.findKey(resolvers, responseType) || "text"](
          response,
          config
        );
        if (hasMaxContentLength && !supportsResponseStream && !isStreamResponse) {
          let materializedSize;
          if (responseData != null) {
            if (typeof responseData.byteLength === "number") {
              materializedSize = responseData.byteLength;
            } else if (typeof responseData.size === "number") {
              materializedSize = responseData.size;
            } else if (typeof responseData === "string") {
              materializedSize = typeof TextEncoder === "function" ? new TextEncoder().encode(responseData).byteLength : responseData.length;
            }
          }
          if (typeof materializedSize === "number" && materializedSize > maxContentLength) {
            throw new AxiosError_default(
              "maxContentLength size of " + maxContentLength + " exceeded",
              AxiosError_default.ERR_BAD_RESPONSE,
              config,
              request
            );
          }
        }
        !isStreamResponse && unsubscribe && unsubscribe();
        return await new Promise((resolve, reject) => {
          settle(resolve, reject, {
            data: responseData,
            headers: AxiosHeaders_default.from(response.headers),
            status: response.status,
            statusText: response.statusText,
            config,
            request
          });
        });
      } catch (err) {
        unsubscribe && unsubscribe();
        if (composedSignal && composedSignal.aborted && composedSignal.reason instanceof AxiosError_default) {
          const canceledError = composedSignal.reason;
          canceledError.config = config;
          request && (canceledError.request = request);
          err !== canceledError && (canceledError.cause = err);
          throw canceledError;
        }
        if (pendingBodyError) {
          request && !pendingBodyError.request && (pendingBodyError.request = request);
          throw pendingBodyError;
        }
        if (err instanceof AxiosError_default) {
          request && !err.request && (err.request = request);
          throw err;
        }
        if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
          throw Object.assign(
            new AxiosError_default(
              "Network Error",
              AxiosError_default.ERR_NETWORK,
              config,
              request,
              err && err.response
            ),
            {
              cause: err.cause || err
            }
          );
        }
        throw AxiosError_default.from(err, err && err.code, config, request, err && err.response);
      }
    };
  };
  var seedCache = /* @__PURE__ */ new Map();
  var getFetch = (config) => {
    let env = config && config.env || {};
    const { fetch: fetch2, Request, Response } = env;
    const seeds = [Request, Response, fetch2];
    let len = seeds.length, i = len, seed, target, map2 = seedCache;
    while (i--) {
      seed = seeds[i];
      target = map2.get(seed);
      target === void 0 && map2.set(seed, target = i ? /* @__PURE__ */ new Map() : factory(env));
      map2 = target;
    }
    return target;
  };
  var adapter = getFetch();

  // ../../node_modules/axios/lib/adapters/adapters.js
  var knownAdapters = {
    http: null_default,
    xhr: xhr_default,
    fetch: {
      get: getFetch
    }
  };
  utils_default.forEach(knownAdapters, (fn2, value) => {
    if (fn2) {
      try {
        Object.defineProperty(fn2, "name", { __proto__: null, value });
      } catch (e) {
      }
      Object.defineProperty(fn2, "adapterName", { __proto__: null, value });
    }
  });
  var renderReason = (reason) => `- ${reason}`;
  var isResolvedHandle = (adapter2) => utils_default.isFunction(adapter2) || adapter2 === null || adapter2 === false;
  function getAdapter(adapters, config) {
    adapters = utils_default.isArray(adapters) ? adapters : [adapters];
    const { length } = adapters;
    let nameOrAdapter;
    let adapter2;
    const rejectedReasons = {};
    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;
      adapter2 = nameOrAdapter;
      if (!isResolvedHandle(nameOrAdapter)) {
        adapter2 = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
        if (adapter2 === void 0) {
          throw new AxiosError_default(`Unknown adapter '${id}'`);
        }
      }
      if (adapter2 && (utils_default.isFunction(adapter2) || (adapter2 = adapter2.get(config)))) {
        break;
      }
      rejectedReasons[id || "#" + i] = adapter2;
    }
    if (!adapter2) {
      const reasons = Object.entries(rejectedReasons).map(
        ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
      );
      let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
      throw new AxiosError_default(
        `There is no suitable adapter to dispatch the request ` + s,
        "ERR_NOT_SUPPORT"
      );
    }
    return adapter2;
  }
  var adapters_default = {
    /**
     * Resolve an adapter from a list of adapter names or functions.
     * @type {Function}
     */
    getAdapter,
    /**
     * Exposes all known adapters
     * @type {Object<string, Function|Object>}
     */
    adapters: knownAdapters
  };

  // ../../node_modules/axios/lib/core/dispatchRequest.js
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
      throw new CanceledError_default(null, config);
    }
  }
  function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    config.headers = AxiosHeaders_default.from(config.headers);
    config.data = transformData.call(config, config.transformRequest);
    if (["post", "put", "patch"].indexOf(config.method) !== -1) {
      config.headers.setContentType("application/x-www-form-urlencoded", false);
    }
    const adapter2 = adapters_default.getAdapter(config.adapter || defaults_default.adapter, config);
    return adapter2(config).then(
      function onAdapterResolution(response) {
        throwIfCancellationRequested(config);
        config.response = response;
        try {
          response.data = transformData.call(config, config.transformResponse, response);
        } finally {
          delete config.response;
        }
        response.headers = AxiosHeaders_default.from(response.headers);
        return response;
      },
      function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);
          if (reason && reason.response) {
            config.response = reason.response;
            try {
              reason.response.data = transformData.call(
                config,
                config.transformResponse,
                reason.response
              );
            } finally {
              delete config.response;
            }
            reason.response.headers = AxiosHeaders_default.from(reason.response.headers);
          }
        }
        return Promise.reject(reason);
      }
    );
  }

  // ../../node_modules/axios/lib/helpers/validator.js
  var validators = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
    validators[type] = function validator(thing) {
      return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
  });
  var deprecatedWarnings = {};
  validators.transitional = function transitional(validator, version, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return (value, opt, opts) => {
      if (validator === false) {
        throw new AxiosError_default(
          formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
          AxiosError_default.ERR_DEPRECATED
        );
      }
      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(
          formatMessage(
            opt,
            " has been deprecated since v" + version + " and will be removed in the near future"
          )
        );
      }
      return validator ? validator(value, opt, opts) : true;
    };
  };
  validators.spelling = function spelling(correctSpelling) {
    return (value, opt) => {
      console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
      return true;
    };
  };
  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
      throw new AxiosError_default("options must be an object", AxiosError_default.ERR_BAD_OPTION_VALUE);
    }
    const keys2 = Object.keys(options);
    let i = keys2.length;
    while (i-- > 0) {
      const opt = keys2[i];
      const validator = Object.prototype.hasOwnProperty.call(schema, opt) ? schema[opt] : void 0;
      if (validator) {
        const value = options[opt];
        const result = value === void 0 || validator(value, opt, options);
        if (result !== true) {
          throw new AxiosError_default(
            "option " + opt + " must be " + result,
            AxiosError_default.ERR_BAD_OPTION_VALUE
          );
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError_default("Unknown option " + opt, AxiosError_default.ERR_BAD_OPTION);
      }
    }
  }
  var validator_default = {
    assertOptions,
    validators
  };

  // ../../node_modules/axios/lib/core/Axios.js
  var validators2 = validator_default.validators;
  var Axios = class {
    constructor(instanceConfig) {
      this.defaults = instanceConfig || {};
      this.interceptors = {
        request: new InterceptorManager_default(),
        response: new InterceptorManager_default()
      };
    }
    /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    async request(configOrUrl, config) {
      try {
        return await this._request(configOrUrl, config);
      } catch (err) {
        if (err instanceof Error) {
          let dummy = {};
          Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
          const stack = (() => {
            if (!dummy.stack) {
              return "";
            }
            const firstNewlineIndex = dummy.stack.indexOf("\n");
            return firstNewlineIndex === -1 ? "" : dummy.stack.slice(firstNewlineIndex + 1);
          })();
          try {
            if (!err.stack) {
              err.stack = stack;
            } else if (stack) {
              const firstNewlineIndex = stack.indexOf("\n");
              const secondNewlineIndex = firstNewlineIndex === -1 ? -1 : stack.indexOf("\n", firstNewlineIndex + 1);
              const stackWithoutTwoTopLines = secondNewlineIndex === -1 ? "" : stack.slice(secondNewlineIndex + 1);
              if (!String(err.stack).endsWith(stackWithoutTwoTopLines)) {
                err.stack += "\n" + stack;
              }
            }
          } catch (e) {
          }
        }
        throw err;
      }
    }
    _request(configOrUrl, config) {
      if (typeof configOrUrl === "string") {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }
      config = mergeConfig(this.defaults, config);
      const { transitional: transitional2, paramsSerializer, headers } = config;
      if (transitional2 !== void 0) {
        validator_default.assertOptions(
          transitional2,
          {
            silentJSONParsing: validators2.transitional(validators2.boolean),
            forcedJSONParsing: validators2.transitional(validators2.boolean),
            clarifyTimeoutError: validators2.transitional(validators2.boolean),
            legacyInterceptorReqResOrdering: validators2.transitional(validators2.boolean),
            advertiseZstdAcceptEncoding: validators2.transitional(validators2.boolean),
            validateStatusUndefinedResolves: validators2.transitional(validators2.boolean)
          },
          false
        );
      }
      if (paramsSerializer != null) {
        if (utils_default.isFunction(paramsSerializer)) {
          config.paramsSerializer = {
            serialize: paramsSerializer
          };
        } else {
          validator_default.assertOptions(
            paramsSerializer,
            {
              encode: validators2.function,
              serialize: validators2.function
            },
            true
          );
        }
      }
      if (config.allowAbsoluteUrls !== void 0) {
      } else if (this.defaults.allowAbsoluteUrls !== void 0) {
        config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
      } else {
        config.allowAbsoluteUrls = true;
      }
      validator_default.assertOptions(
        config,
        {
          baseUrl: validators2.spelling("baseURL"),
          withXsrfToken: validators2.spelling("withXSRFToken")
        },
        true
      );
      config.method = (config.method || this.defaults.method || "get").toLowerCase();
      let contextHeaders = headers && utils_default.merge(headers.common, headers[config.method]);
      headers && utils_default.forEach(["delete", "get", "head", "post", "put", "patch", "query", "common"], (method) => {
        delete headers[method];
      });
      config.headers = AxiosHeaders_default.concat(contextHeaders, headers);
      const requestInterceptorChain = [];
      let synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        const transitional3 = config.transitional || transitional_default;
        const legacyInterceptorReqResOrdering = transitional3 && transitional3.legacyInterceptorReqResOrdering;
        if (legacyInterceptorReqResOrdering) {
          requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
        } else {
          requestInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
        }
      });
      const responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      let promise;
      let i = 0;
      let len;
      if (!synchronousRequestInterceptors) {
        const chain = [dispatchRequest.bind(this), void 0];
        chain.unshift(...requestInterceptorChain);
        chain.push(...responseInterceptorChain);
        len = chain.length;
        promise = Promise.resolve(config);
        while (i < len) {
          promise = promise.then(chain[i++], chain[i++]);
        }
        return promise;
      }
      len = requestInterceptorChain.length;
      let newConfig = config;
      while (i < len) {
        const onFulfilled = requestInterceptorChain[i++];
        const onRejected = requestInterceptorChain[i++];
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected.call(this, error);
          break;
        }
      }
      try {
        promise = dispatchRequest.call(this, newConfig);
      } catch (error) {
        return Promise.reject(error);
      }
      i = 0;
      len = responseInterceptorChain.length;
      while (i < len) {
        promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
      }
      return promise;
    }
    getUri(config) {
      config = mergeConfig(this.defaults, config);
      const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls, config);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    }
  };
  utils_default.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios.prototype[method] = function(url, config) {
      return this.request(
        mergeConfig(config || {}, {
          method,
          url,
          data: config && utils_default.hasOwnProp(config, "data") ? config.data : void 0
        })
      );
    };
  });
  utils_default.forEach(["post", "put", "patch", "query"], function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data, config) {
        return this.request(
          mergeConfig(config || {}, {
            method,
            headers: isForm ? {
              "Content-Type": "multipart/form-data"
            } : {},
            url,
            data
          })
        );
      };
    }
    Axios.prototype[method] = generateHTTPMethod();
    if (method !== "query") {
      Axios.prototype[method + "Form"] = generateHTTPMethod(true);
    }
  });
  var Axios_default = Axios;

  // ../../node_modules/axios/lib/cancel/CancelToken.js
  var CancelToken = class _CancelToken {
    constructor(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      let resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      const token = this;
      this.promise.then((cancel) => {
        if (!token._listeners) return;
        let i = token._listeners.length;
        while (i-- > 0) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = (onfulfilled) => {
        let _resolve;
        const promise = new Promise((resolve) => {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message, config, request) {
        if (token.reason) {
          return;
        }
        token.reason = new CanceledError_default(message, config, request);
        resolvePromise(token.reason);
      });
    }
    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    }
    /**
     * Subscribe to the cancel signal
     */
    subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    }
    /**
     * Unsubscribe from the cancel signal
     */
    unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      const index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    }
    toAbortSignal() {
      const controller = new AbortController();
      const abort = (err) => {
        controller.abort(err);
      };
      this.subscribe(abort);
      controller.signal.unsubscribe = () => this.unsubscribe(abort);
      return controller.signal;
    }
    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    static source() {
      let cancel;
      const token = new _CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    }
  };
  var CancelToken_default = CancelToken;

  // ../../node_modules/axios/lib/helpers/spread.js
  function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  }

  // ../../node_modules/axios/lib/helpers/isAxiosError.js
  function isAxiosError(payload) {
    return utils_default.isObject(payload) && payload.isAxiosError === true;
  }

  // ../../node_modules/axios/lib/helpers/HttpStatusCode.js
  var HttpStatusCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
    WebServerIsDown: 521,
    ConnectionTimedOut: 522,
    OriginIsUnreachable: 523,
    TimeoutOccurred: 524,
    SslHandshakeFailed: 525,
    InvalidSslCertificate: 526
  };
  Object.entries(HttpStatusCode).forEach(([key, value]) => {
    HttpStatusCode[value] = key;
  });
  var HttpStatusCode_default = HttpStatusCode;

  // ../../node_modules/axios/lib/axios.js
  function createInstance(defaultConfig) {
    const context = new Axios_default(defaultConfig);
    const instance = bind(Axios_default.prototype.request, context);
    utils_default.extend(instance, Axios_default.prototype, context, { allOwnKeys: true });
    utils_default.extend(instance, context, null, { allOwnKeys: true });
    instance.create = function create2(instanceConfig) {
      return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };
    return instance;
  }
  var axios = createInstance(defaults_default);
  axios.Axios = Axios_default;
  axios.CanceledError = CanceledError_default;
  axios.CancelToken = CancelToken_default;
  axios.isCancel = isCancel;
  axios.VERSION = VERSION;
  axios.toFormData = toFormData_default;
  axios.AxiosError = AxiosError_default;
  axios.Cancel = axios.CanceledError;
  axios.all = function all(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread;
  axios.isAxiosError = isAxiosError;
  axios.mergeConfig = mergeConfig;
  axios.AxiosHeaders = AxiosHeaders_default;
  axios.formToJSON = (thing) => formDataToJSON_default(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
  axios.getAdapter = adapters_default.getAdapter;
  axios.HttpStatusCode = HttpStatusCode_default;
  axios.default = axios;
  var axios_default = axios;

  // ../../node_modules/axios/index.js
  var {
    Axios: Axios2,
    AxiosError: AxiosError2,
    CanceledError: CanceledError2,
    isCancel: isCancel2,
    CancelToken: CancelToken2,
    VERSION: VERSION2,
    all: all2,
    Cancel,
    isAxiosError: isAxiosError2,
    spread: spread2,
    toFormData: toFormData2,
    AxiosHeaders: AxiosHeaders2,
    HttpStatusCode: HttpStatusCode2,
    formToJSON,
    getAdapter: getAdapter2,
    mergeConfig: mergeConfig2,
    create
  } = axios_default;

  // lang/array.js
  function unique(a) {
    argumentIsArray(a, "a");
    return uniqueBy(a, (item) => item);
  }
  function uniqueBy(a, keySelector) {
    argumentIsArray(a, "a");
    return a.filter((item, index, array2) => {
      const key = keySelector(item);
      return array2.findIndex((candidate) => key === keySelector(candidate)) === index;
    });
  }
  function groupBy(a, keySelector) {
    argumentIsArray(a, "a");
    argumentIsRequired(keySelector, "keySelector", Function);
    return a.reduce((groups, item) => {
      const key = keySelector(item);
      if (!Object.prototype.hasOwnProperty.call(groups, key)) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  }
  function batchBy(a, keySelector) {
    argumentIsArray(a, "a");
    argumentIsRequired(keySelector, "keySelector", Function);
    let currentKey = null;
    let currentBatch = null;
    return a.reduce((batches, item) => {
      const key = keySelector(item);
      if (currentBatch === null || currentKey !== key) {
        currentKey = key;
        currentBatch = [];
        batches.push(currentBatch);
      }
      currentBatch.push(item);
      return batches;
    }, []);
  }
  function indexBy(a, keySelector) {
    argumentIsArray(a, "a");
    argumentIsRequired(keySelector, "keySelector", Function);
    return a.reduce((map2, item) => {
      const key = keySelector(item);
      if (Object.prototype.hasOwnProperty.call(map2, key)) {
        throw new Error("Unable to index array. A duplicate key exists.");
      }
      map2[key] = item;
      return map2;
    }, {});
  }
  function first(a) {
    argumentIsArray(a, "a");
    let returnRef;
    if (a.length !== 0) {
      returnRef = a[0];
    } else {
      returnRef = void 0;
    }
    return returnRef;
  }
  function last2(a) {
    argumentIsArray(a, "a");
    let returnRef;
    if (a.length !== 0) {
      returnRef = a[a.length - 1];
    } else {
      returnRef = void 0;
    }
    return returnRef;
  }
  function flatten(a, recursive) {
    argumentIsArray(a, "a");
    argumentIsOptional(recursive, "recursive", Boolean);
    const empty4 = [];
    let flat = empty4.concat.apply(empty4, a);
    if (recursive && flat.some((x) => array(x))) {
      flat = flatten(flat, true);
    }
    return flat;
  }
  function partition(a, size) {
    argumentIsArray(a, "a");
    argumentIsOptional(size, "size", Number);
    const copy = a.slice(0);
    const partitions = [];
    while (copy.length !== 0) {
      partitions.push(copy.splice(0, size));
    }
    return partitions;
  }
  function difference(a, b) {
    return differenceBy(a, b, (item) => item);
  }
  function differenceBy(a, b, keySelector) {
    argumentIsArray(a, "a");
    argumentIsArray(b, "b");
    argumentIsRequired(keySelector, "keySelector", Function);
    const returnRef = [];
    a.forEach((candidate) => {
      const candidateKey = keySelector(candidate);
      const exclude = b.some((comparison) => candidateKey === keySelector(comparison));
      if (!exclude) {
        returnRef.push(candidate);
      }
    });
    return returnRef;
  }
  function differenceSymmetric(a, b) {
    return differenceSymmetricBy(a, b, (item) => item);
  }
  function differenceSymmetricBy(a, b, keySelector) {
    return unionBy(differenceBy(a, b, keySelector), differenceBy(b, a, keySelector), keySelector);
  }
  function union(a, b) {
    return unionBy(a, b, (item) => item);
  }
  function unionBy(a, b, keySelector) {
    argumentIsArray(a, "a");
    argumentIsArray(b, "b");
    argumentIsRequired(keySelector, "keySelector", Function);
    const returnRef = a.slice();
    b.forEach((candidate) => {
      const candidateKey = keySelector(candidate);
      const exclude = returnRef.some((comparison) => candidateKey === keySelector(comparison));
      if (!exclude) {
        returnRef.push(candidate);
      }
    });
    return returnRef;
  }
  function intersection(a, b) {
    return intersectionBy(a, b, (item) => item);
  }
  function intersectionBy(a, b, keySelector) {
    argumentIsArray(a, "a");
    argumentIsArray(b, "b");
    const returnRef = [];
    a.forEach((candidate) => {
      const candidateKey = keySelector(candidate);
      const include = b.some((comparison) => candidateKey === keySelector(comparison));
      if (include) {
        returnRef.push(candidate);
      }
    });
    return returnRef;
  }
  function remove(a, predicate) {
    argumentIsArray(a, "a");
    argumentIsRequired(predicate, "predicate", Function);
    const index = a.findIndex(predicate);
    const found = !(index < 0);
    if (found) {
      a.splice(index, 1);
    }
    return found;
  }
  function insert(a, item, comparator2) {
    argumentIsArray(a, "a");
    argumentIsRequired(comparator2, "comparator", Function);
    if (a.length === 0 || !(comparator2(item, a[a.length - 1]) < 0)) {
      a.push(item);
    } else if (comparator2(item, a[0]) < 0) {
      a.unshift(item);
    } else {
      a.splice(binarySearchForInsert(a, item, comparator2, 0, a.length - 1), 0, item);
    }
    return a;
  }
  function binarySearch(a, key, comparator2, start, end) {
    argumentIsArray(a, "a");
    argumentIsRequired(comparator2, "comparator", Function);
    argumentIsOptional(start, "start", Number);
    argumentIsOptional(end, "end", Number);
    if (a.length === 0) {
      return null;
    }
    return binarySearchForMatch(a, key, comparator2, start || 0, end || a.length - 1);
  }
  function binarySearchForMatch(a, key, comparator2, start, end) {
    const size = end - start;
    const midpointIndex = start + Math.floor(size / 2);
    const midpointItem = a[midpointIndex];
    const comparison = comparator2(key, midpointItem);
    if (comparison === 0) {
      return midpointItem;
    } else if (size < 2) {
      const finalIndex = a.length - 1;
      const finalItem = a[finalIndex];
      if (end === finalIndex && comparator2(key, finalItem) === 0) {
        return finalItem;
      } else {
        return null;
      }
    } else if (comparison > 0) {
      return binarySearchForMatch(a, key, comparator2, midpointIndex, end);
    } else {
      return binarySearchForMatch(a, key, comparator2, start, midpointIndex);
    }
  }
  function binarySearchForInsert(a, item, comparator2, start, end) {
    const size = end - start;
    const midpointIndex = start + Math.floor(size / 2);
    const midpointItem = a[midpointIndex];
    const comparison = comparator2(item, midpointItem);
    if (size < 2) {
      if (comparison > 0) {
        const finalIndex = a.length - 1;
        if (end === finalIndex && comparator2(item, a[finalIndex]) > 0) {
          return end + 1;
        }
        return end;
      }
      return start;
    }
    if (comparison > 0) {
      return binarySearchForInsert(a, item, comparator2, midpointIndex, end);
    }
    return binarySearchForInsert(a, item, comparator2, start, midpointIndex);
  }

  // lang/promise.js
  async function timeout(promise, milliseconds, description) {
    argumentIsRequired(promise, "promise", Promise, "Promise");
    argumentIsRequired(milliseconds, "milliseconds", Number);
    argumentIsOptional(description, "description", String);
    if (!(milliseconds > 0)) {
      throw 'Unable to configure promise timeout, the "milliseconds" argument must be positive';
    }
    let timeoutToken = null;
    const timeoutPromise = build((resolveCallback, rejectCallback) => {
      timeoutToken = setTimeout(() => {
        rejectCallback(description || `Promise timed out after ${milliseconds} milliseconds`);
      }, milliseconds);
    });
    const userPromise = (async () => {
      try {
        const result = await promise;
        if (timeoutToken !== null) {
          clearTimeout(timeoutToken);
        }
        return result;
      } catch (e) {
        if (timeoutToken !== null) {
          clearTimeout(timeoutToken);
        }
        throw e;
      }
    })();
    return Promise.race([userPromise, timeoutPromise]);
  }
  async function map(items, mapper, concurrency) {
    argumentIsArray(items, "items");
    argumentIsRequired(mapper, "mapper", Function);
    argumentIsOptional(concurrency, "concurrency", Number);
    const c = Math.max(0, concurrency || 0);
    let mapPromise;
    if (c === 0 || items.length === 0) {
      mapPromise = Promise.all(items.map((item) => mapper(item)));
    } else {
      const total = items.length;
      let active = 0;
      let complete = 0;
      let failure = false;
      const results = Array.of(total);
      const executors = items.map((item, index) => {
        return async () => {
          const result = await mapper(item);
          results[index] = result;
        };
      });
      mapPromise = build((resolveCallback, rejectCallback) => {
        const execute = () => {
          if (!(executors.length > 0 && c > active && !failure)) {
            return;
          }
          active = active + 1;
          const executor = executors.shift();
          (async () => {
            try {
              await executor();
              if (failure) {
                return;
              }
              active = active - 1;
              complete = complete + 1;
              if (complete < total) {
                execute();
              } else {
                resolveCallback(results);
              }
            } catch (error) {
              failure = true;
              rejectCallback(error);
            }
          })();
          execute();
        };
        execute();
      });
    }
    return mapPromise;
  }
  async function pipeline(functions, input) {
    argumentIsArray(functions, "functions", Function);
    let result = input;
    for (let i = 0; i < functions.length; i++) {
      result = await functions[i](result);
    }
    return result;
  }
  async function first2(executors) {
    argumentIsArray(executors, "executors", Function);
    let result = null;
    for (let i = 0; i < executors.length && result === null; i++) {
      try {
        result = await executors[i]();
      } catch {
        result = null;
      }
    }
    return result;
  }
  async function build(executor) {
    return new Promise((resolve, reject) => {
      try {
        executor(resolve, reject);
      } catch (e) {
        reject(e);
      }
    });
  }

  // api/http/definitions/Parameter.js
  var Parameter = class {
    #description;
    #key;
    #extractor;
    #optional;
    /**
     * @param {string} description
     * @param {string} key
     * @param {parameterValueCallback} extractor
     * @param {boolean=} optional
     */
    constructor(description, key, extractor, optional) {
      this.#description = description || null;
      this.#key = key || null;
      this.#extractor = extractor || null;
      this.#optional = boolean(optional) && optional;
    }
    /**
     * The human-readable description of the parameter.
     *
     * @public
     * @returns {string}
     */
    get description() {
      return this.#description;
    }
    /**
     * The name of the parameter.
     *
     * @public
     * @returns {string}
     */
    get key() {
      return this.#key;
    }
    /**
     * A function for extracting the parameter's value.
     *
     * @public
     * @returns {parameterValueCallback}
     */
    get extractor() {
      return this.#extractor;
    }
    /**
     * Indicates if the parameter is required.
     *
     * @public
     * @returns {boolean}
     */
    get optional() {
      return this.#optional;
    }
    /**
     * Throws an {@link Error} if the instance is invalid.
     *
     * @public
     */
    validate() {
      if (!string(this.key) || this.key.length === 0) {
        throw new Error("Parameter key must be a non-zero length string");
      }
      if (!fn(this.#extractor)) {
        throw new Error("Parameter extractor must be a function.");
      }
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[Parameter]`;
    }
  };

  // api/http/definitions/Parameters.js
  var Parameters = class _Parameters {
    #parameters;
    /**
     * @param {Parameter[]=} parameters
     */
    constructor(parameters) {
      this.#parameters = parameters || [];
    }
    /**
     * The list of {@link Parameter} items.
     *
     * @public
     * @returns {Parameter[]}
     */
    get parameters() {
      return this.#parameters;
    }
    /**
     * Throws an {@link Error} if the instance is invalid.
     *
     * @public
     */
    validate() {
      if (!array(this.#parameters)) {
        throw new Error("Parameters must be an array.");
      }
      if (this.#parameters.some((p) => !(p instanceof Parameter))) {
        throw new Error("All parameter items must be instances of Parameters.");
      }
      this.#parameters.forEach((p) => p.validate());
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[Parameters]`;
    }
    /**
     * Merges two {@link Parameters} collections.
     *
     * @public
     * @static
     * @param {Parameters} a
     * @param {Parameters} b
     * @returns {Parameters}
     */
    static merge(a, b) {
      return new _Parameters(a.parameters.slice(0).concat(b.parameters.filter((candidate) => !a.parameters.some((existing) => existing.key === candidate.key))));
    }
  };

  // api/http/definitions/ProtocolType.js
  var ProtocolType = class _ProtocolType extends Enum {
    #defaultPort;
    #prefix;
    /**
     * @param {string} code
     * @param {number} defaultPort
     * @param {string} prefix
     */
    constructor(code, defaultPort, prefix) {
      super(code, code);
      argumentIsRequired(prefix, "prefix", String);
      argumentIsValid(defaultPort, "defaultPort", (p) => integer(p) && !(p < 0 || p > 65535));
      this.#defaultPort = defaultPort;
      this.#prefix = prefix;
    }
    /**
     * Returns the default TCP port used by the protocol.
     *
     * @public
     * @returns {number}
     */
    get defaultPort() {
      return this.#defaultPort;
    }
    /**
     * Returns the prefix used to compose a URL.
     *
     * @public
     * @returns {string}
     */
    get prefix() {
      return this.#prefix;
    }
    /**
     * Returns the {@link ProtocolType} associated with a specific code.
     *
     * @public
     * @static
     * @param {string} code
     * @returns {ProtocolType|null}
     */
    static parse(code) {
      const value = Enum.fromCode(_ProtocolType, code);
      return value instanceof _ProtocolType ? value : null;
    }
    /**
     * HTTP.
     *
     * @static
     * @returns {ProtocolType}
     */
    static get HTTP() {
      return protocolTypeHttp;
    }
    /**
     * HTTPS.
     *
     * @static
     * @returns {ProtocolType}
     */
    static get HTTPS() {
      return protocolTypeHttps;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[ProtocolType (description=${this.description})]`;
    }
  };
  var protocolTypeHttp = new ProtocolType("HTTP", 80, "http://");
  var protocolTypeHttps = new ProtocolType("HTTPS", 443, "https://");

  // api/http/definitions/VerbType.js
  var VerbType = class extends Enum {
    /**
     * @param {string} description
     */
    constructor(description) {
      super(description, description);
    }
    /**
     * DELETE.
     *
     * @static
     * @returns {VerbType}
     */
    static get DELETE() {
      return verbTypeDelete;
    }
    /**
     * GET.
     *
     * @static
     * @returns {VerbType}
     */
    static get GET() {
      return verbTypeGet;
    }
    /**
     * POST.
     *
     * @static
     * @returns {VerbType}
     */
    static get POST() {
      return verbTypePost;
    }
    /**
     * PUT.
     *
     * @static
     * @returns {VerbType}
     */
    static get PUT() {
      return verbTypePut;
    }
    /**
     * PATCH.
     *
     * @static
     * @returns {VerbType}
     */
    static get PATCH() {
      return verbTypePatch;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[VerbType (description=${this.description})]`;
    }
  };
  var verbTypeDelete = new VerbType("DELETE");
  var verbTypeGet = new VerbType("GET");
  var verbTypePost = new VerbType("POST");
  var verbTypePut = new VerbType("PUT");
  var verbTypePatch = new VerbType("PATCH");

  // api/http/interceptors/ErrorInterceptor.js
  var ErrorInterceptor = class {
    constructor() {
    }
    /**
     * Adjusts incoming error before the response is forwarded
     * back to the original caller.
     *
     * @public
     * @async
     * @param {object} error
     * @param {Endpoint} endpoint - The endpoint which is originating the request.
     * @returns {Promise<*>}
     */
    async process(error, endpoint) {
      return this._onProcess(error, endpoint);
    }
    /**
     * @protected
     * @async
     * @param {object} error
     * @param {Endpoint} endpoint
     * @returns {Promise<*>}
     */
    async _onProcess(error, endpoint) {
      throw error;
    }
    /**
     * A no-op error interceptor which rejects using raw response data.
     *
     * @public
     * @static
     * @returns {ErrorInterceptor}
     */
    static get EMPTY() {
      return errorInterceptorEmpty;
    }
    /**
     * An error interceptor that handles most server-side issues and rejects
     * using formatted {@link FailureReason} when an error is detected.
     *
     * @public
     * @static
     * @returns {ErrorInterceptor}
     */
    static get GENERAL() {
      return errorInterceptorGeneral;
    }
    /**
     * Returns a new {@link ErrorInterceptor} which delegates its work to another function.
     *
     * @public
     * @static
     * @param {Function} delegate
     * @returns {ErrorInterceptor}
     */
    static fromDelegate(delegate) {
      return new DelegateErrorInterceptor(delegate);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[ErrorInterceptor]";
    }
  };
  var DelegateErrorInterceptor = class extends ErrorInterceptor {
    #delegate;
    /**
     * @param {Function} delegate
     */
    constructor(delegate) {
      super();
      argumentIsRequired(delegate, "delegate", Function);
      this.#delegate = delegate;
    }
    /**
     * @protected
     * @override
     * @param {object} error
     * @param {Endpoint} endpoint
     * @returns {*}
     */
    _onProcess(error, endpoint) {
      return this.#delegate(error, endpoint);
    }
    toString() {
      return "[DelegateErrorInterceptor]";
    }
  };
  var errorInterceptorEmpty = new ErrorInterceptor();
  var errorInterceptorGeneral = new DelegateErrorInterceptor(async (error, endpoint) => {
    const response = error.response;
    let rejection = null;
    if (object(response) && object(response.headers) && response.headers["content-type"] === "application/json") {
      let deserialized = null;
      if (object(response.data)) {
        deserialized = response.data;
      } else {
        try {
          deserialized = JSON.parse(response.data);
        } catch {
          deserialized = null;
        }
      }
      if (deserialized !== null) {
        rejection = deserialized;
      }
    }
    if (rejection === null && undef(response) && error.message === "Network Error") {
      rejection = FailureReason.forRequest({ endpoint }).addItem(FailureType.REQUEST_AUTHORIZATION_FAILURE).format();
    }
    if (rejection === null) {
      rejection = FailureReason.forRequest({ endpoint }).addItem(FailureType.REQUEST_GENERAL_FAILURE).format();
    }
    throw rejection;
  });

  // api/http/interceptors/RequestInterceptor.js
  var RequestInterceptor = class {
    constructor() {
    }
    /**
     * Adjusts outgoing requests data before the request is transmitted.
     *
     * @public
     * @async
     * @param {object} request
     * @param {Endpoint} endpoint - The endpoint which is originating the request.
     * @returns {Promise<*>}
     */
    async process(request, endpoint) {
      return this._onProcess(request, endpoint);
    }
    /**
     * @protected
     * @param {object} request
     * @param {Endpoint} endpoint
     * @returns {*}
     */
    _onProcess(request, endpoint) {
      return request;
    }
    /**
     * A no-op request interceptor.
     *
     * @public
     * @static
     * @returns {RequestInterceptor}
     */
    static get EMPTY() {
      return requestInterceptorEmpty;
    }
    /**
     * Returns a new {@link RequestInterceptor} which delegates its work to another function.
     *
     * @public
     * @static
     * @param {Function} delegate
     * @returns {RequestInterceptor}
     */
    static fromDelegate(delegate) {
      return new DelegateRequestInterceptor(delegate);
    }
    /**
     * A request interceptor that instructs the framework to skip parsing
     * of the response's data.
     *
     * @public
     * @static
     * @returns {RequestInterceptor}
     */
    static get PLAIN_TEXT_RESPONSE() {
      return requestInterceptorPlain;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[RequestInterceptor]";
    }
  };
  var DelegateRequestInterceptor = class extends RequestInterceptor {
    #delegate;
    /**
     * @param {Function} delegate
     */
    constructor(delegate) {
      super();
      argumentIsRequired(delegate, "delegate", Function);
      this.#delegate = delegate;
    }
    /**
     * @protected
     * @override
     * @param {object} request
     * @param {Endpoint} endpoint
     * @returns {*}
     */
    _onProcess(request, endpoint) {
      return this.#delegate(request, endpoint);
    }
    toString() {
      return "[DelegateRequestInterceptor]";
    }
  };
  var requestInterceptorEmpty = new RequestInterceptor();
  var requestInterceptorPlain = new DelegateRequestInterceptor((request) => {
    request.transformResponse = (data) => data;
    return request;
  });

  // api/http/interceptors/ResponseInterceptor.js
  var ResponseInterceptor = class {
    constructor() {
    }
    /**
     * Adjusts incoming response data before the response is forwarded
     * back to the original caller.
     *
     * @public
     * @async
     * @param {object} response
     * @param {Endpoint} endpoint - The endpoint which is originating the request.
     * @returns {Promise<*>}
     */
    async process(response, endpoint) {
      return this._onProcess(response, endpoint);
    }
    /**
     * @protected
     * @param {object} response
     * @param {Endpoint} endpoint
     * @returns {*}
     */
    _onProcess(response, endpoint) {
      return response;
    }
    /**
     * A no-op request interceptor (which will return the raw response).
     *
     * @public
     * @static
     * @returns {ResponseInterceptor}
     */
    static get EMPTY() {
      return responseInterceptorEmpty;
    }
    /**
     * A response interceptor returns only the data payload in the format
     * specified by the response's "content-type" header.
     *
     * @public
     * @static
     * @returns {ResponseInterceptor}
     */
    static get DATA() {
      return responseInterceptorData;
    }
    /**
     * Returns a new {@link ResponseInterceptor} which delegates its work to another function.
     *
     * @public
     * @static
     * @param {Function} delegate
     * @returns {ResponseInterceptor}
     */
    static fromDelegate(delegate) {
      return new DelegateResponseInterceptor(delegate);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[ResponseInterceptor]";
    }
  };
  var DelegateResponseInterceptor = class extends ResponseInterceptor {
    #delegate;
    /**
     * @param {Function} delegate
     */
    constructor(delegate) {
      super();
      argumentIsRequired(delegate, "delegate", Function);
      this.#delegate = delegate;
    }
    /**
     * @protected
     * @override
     * @param {object} response
     * @param {Endpoint} endpoint
     * @returns {*}
     */
    _onProcess(response, endpoint) {
      return this.#delegate(response, endpoint);
    }
    toString() {
      return "[DelegateResponseInterceptor]";
    }
  };
  var responseInterceptorEmpty = new ResponseInterceptor();
  var responseInterceptorData = new DelegateResponseInterceptor((response, ignored) => {
    return response.data;
  });

  // api/http/definitions/Endpoint.js
  var Endpoint = class {
    #name;
    #description;
    #verb;
    #protocol;
    #host;
    #port;
    #path;
    #query;
    #headers;
    #body;
    #credentials;
    #requestInterceptor;
    #responseInterceptor;
    #errorInterceptor;
    /**
     * @param {string=} name
     * @param {string=} description
     * @param {VerbType=} verb
     * @param {ProtocolType=} protocol
     * @param {string=} host
     * @param {number=} port
     * @param {Parameters=} path
     * @param {Parameters=} query
     * @param {Parameters=} headers
     * @param {Parameters=} body
     * @param {Credentials=} credentials
     * @param {RequestInterceptor=} requestInterceptor
     * @param {ResponseInterceptor=} responseInterceptor
     * @param {ErrorInterceptor=} errorInterceptor
     */
    constructor(name, description, verb, protocol, host, port, path, query, headers, body, credentials, requestInterceptor, responseInterceptor, errorInterceptor) {
      this.#name = name || null;
      this.#description = description || null;
      this.#verb = verb || VerbType.GET;
      this.#protocol = protocol || ProtocolType.HTTPS;
      this.#host = host || null;
      this.#port = port || this.#protocol.defaultPort;
      this.#path = path || new Parameters();
      this.#query = query || new Parameters();
      this.#headers = headers || new Parameters();
      this.#body = body || new Parameters();
      this.#credentials = credentials || null;
      this.#requestInterceptor = requestInterceptor || RequestInterceptor.EMPTY;
      this.#responseInterceptor = responseInterceptor || ResponseInterceptor.EMPTY;
      this.#errorInterceptor = errorInterceptor || ErrorInterceptor.EMPTY;
    }
    /**
     * The name of the endpoint (used for internal purposes only).
     *
     * @public
     * @returns {string}
     */
    get name() {
      return this.#name;
    }
    /**
     * A description of the action performed by the endpoint, suitable for display to users.
     *
     * @public
     * @returns {string}
     */
    get description() {
      return this.#description;
    }
    /**
     * The verb to use when making the request.
     *
     * @public
     * @returns {VerbType}
     */
    get verb() {
      return this.#verb;
    }
    /**
     * The protocol to use with the endpoint.
     *
     * @public
     * @returns {ProtocolType}
     */
    get protocol() {
      return this.#protocol;
    }
    /**
     * The host of the endpoint.
     *
     * @public
     * @returns {string}
     */
    get host() {
      return this.#host;
    }
    /**
     * The host of the endpoint.
     *
     * @public
     * @returns {number}
     */
    get port() {
      return this.#port;
    }
    /**
     * The path definition of the endpoint.
     *
     * @public
     * @returns {Parameters}
     */
    get path() {
      return this.#path;
    }
    /**
     * The query definition of the endpoint.
     *
     * @public
     * @returns {Parameters}
     */
    get query() {
      return this.#query;
    }
    /**
     * The header definition of the endpoint.
     *
     * @public
     * @returns {Parameters}
     */
    get headers() {
      return this.#headers;
    }
    /**
     * The body definition of the endpoint.
     *
     * @public
     * @returns {Parameters}
     */
    get body() {
      return this.#body;
    }
    /**
     * Credentials for the request.
     *
     * @public
     * @return {Credentials}
     */
    get credentials() {
      return this.#credentials;
    }
    /**
     * The request interceptor of the endpoint.
     *
     * @public
     * @returns {RequestInterceptor|null}
     */
    get requestInterceptor() {
      return this.#requestInterceptor;
    }
    /**
     * The response interceptor of the endpoint.
     *
     * @public
     * @returns {ResponseInterceptor|null}
     */
    get responseInterceptor() {
      return this.#responseInterceptor;
    }
    /**
     * The error interceptor of the endpoint.
     *
     * @public
     * @returns {ErrorInterceptor|null}
     */
    get errorInterceptor() {
      return this.#errorInterceptor;
    }
    /**
     * Throws an {@link Error} if the instance is invalid.
     *
     * @public
     */
    validate() {
      if (!(this.protocol instanceof ProtocolType)) {
        throw new Error("Endpoint protocol must be an instance of ProtocolType.");
      }
      if (!string(this.#host) || this.#host.length === 0) {
        throw new Error("Endpoint host is invalid.");
      }
      if (!integer(this.#port) || this.#port < 0 || this.#port > 65535) {
        throw new Error("Endpoint port range is invalid.");
      }
      if (!(this.path instanceof Parameters)) {
        throw new Error("The path must be a Parameters collection.");
      }
      this.path.validate();
      if (!(this.query instanceof Parameters)) {
        throw new Error("The query must be a Parameters collection.");
      }
      this.query.validate();
      if (!(this.headers instanceof Parameters)) {
        throw new Error("The headers must be a Parameters collection.");
      }
      this.headers.validate();
      if (!(this.body instanceof Parameters)) {
        throw new Error("The body must be a Parameters collection.");
      }
      this.body.validate();
      if (this.credentials) {
        this.credentials.validate();
      }
      if (this.requestInterceptor && !(this.requestInterceptor instanceof RequestInterceptor)) {
        throw new Error("Endpoint request interceptor must be an instance of RequestInterceptor.");
      }
      if (this.responseInterceptor && !(this.responseInterceptor instanceof ResponseInterceptor)) {
        throw new Error("Endpoint response interceptor must be an instance of ResponseInterceptor.");
      }
      if (this.errorInterceptor && !(this.errorInterceptor instanceof ErrorInterceptor)) {
        throw new Error("Endpoint error interceptor must be an instance of ErrorInterceptor.");
      }
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[Endpoint (name=${this.#name})]`;
    }
  };

  // api/http/Gateway.js
  var Gateway = class {
    constructor() {
    }
    /**
     * Invokes a web service endpoint, given the payload supplied.
     *
     * @public
     * @static
     * @async
     * @param {Endpoint} endpoint
     * @param {*=} payload
     * @returns {Promise<object>}
     */
    static async invoke(endpoint, payload) {
      argumentIsRequired(endpoint, "endpoint", Endpoint, "Endpoint");
      const pathParameters = endpoint.path.parameters;
      const headerParameters = endpoint.headers.parameters;
      const queryParameters = endpoint.query.parameters;
      const bodyParameters = endpoint.body.parameters;
      const extractParameter = async (parameter) => {
        try {
          const value = await parameter.extractor(payload);
          return value;
        } catch {
          return null;
        }
      };
      const groups = await Promise.all([
        map(pathParameters, extractParameter),
        map(headerParameters, extractParameter),
        map(queryParameters, extractParameter),
        map(bodyParameters, extractParameter)
      ]);
      const pathValues = groups[0];
      const headerValues = groups[1];
      const queryValues = groups[2];
      const bodyValues = groups[3];
      const parameters = flatten([pathParameters, headerParameters, queryParameters, bodyParameters]);
      const values = flatten([pathValues, headerValues, queryValues, bodyValues]);
      const failure = values.reduce((accumulator, value, index) => {
        let updatedFailure = accumulator;
        const parameter = parameters[index];
        if (value === null && !parameter.optional) {
          if (accumulator === null) {
            updatedFailure = FailureReason.forRequest({ endpoint }).addItem(FailureType.REQUEST_CONSTRUCTION_FAILURE, null, true);
          }
          updatedFailure.addItem(FailureType.REQUEST_PARAMETER_MISSING, { name: parameter.description });
        }
        return updatedFailure;
      }, null);
      if (failure !== null) {
        throw failure.format();
      }
      const options = {};
      const url = [];
      url.push(endpoint.protocol.prefix);
      url.push(endpoint.host);
      if (endpoint.port !== endpoint.protocol.defaultPort) {
        url.push(":");
        url.push(endpoint.port);
      }
      url.push("/");
      const paths = await pipeline(pathValues.map((value) => (previous) => {
        let encodedValue;
        if (nil(value) || undef(value)) {
          encodedValue = value;
        } else {
          encodedValue = value.toString().replace(/\//g, "%2F");
        }
        previous.push(encodedValue);
        return previous;
      }), []);
      url.push(paths.join("/"));
      options.method = verbs.get(endpoint.verb);
      options.url = url.join("");
      if (headerParameters.length !== 0) {
        const headers = await pipeline(headerValues.map((value, i) => (accumulator) => {
          const parameter = headerParameters[i];
          accumulator[parameter.key] = value;
          return accumulator;
        }), {});
        if (headers.length !== 0) {
          options.headers = headers;
        }
      }
      if (queryParameters.length !== 0) {
        const query = await pipeline(queryValues.map((value, i) => (accumulator) => {
          const parameter = queryParameters[i];
          accumulator[parameter.key] = value;
          return accumulator;
        }), {});
        if (query.length !== 0) {
          options.params = query;
        }
      }
      if (bodyParameters.length !== 0) {
        const body = await pipeline(bodyValues.map((value, i) => (accumulator) => {
          const parameter = bodyParameters[i];
          write(accumulator, parameter.key, value);
          return accumulator;
        }), {});
        options.data = body.body;
      }
      if (endpoint.credentials) {
        const credentials = await Promise.all([
          endpoint.credentials.usernameExtractor(payload),
          endpoint.credentials.passwordExtractor(payload)
        ]);
        options.auth = {
          username: credentials[0],
          password: credentials[1]
        };
      }
      const request = endpoint.requestInterceptor ? await endpoint.requestInterceptor.process(options, endpoint) : options;
      try {
        const response = await axios_default.request(request);
        if (endpoint.responseInterceptor) {
          return endpoint.responseInterceptor.process(response, endpoint);
        }
        return response;
      } catch (error) {
        if (endpoint.errorInterceptor) {
          return endpoint.errorInterceptor.process(error, endpoint);
        }
        throw error;
      }
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Gateway]";
    }
  };
  var verbs = /* @__PURE__ */ new Map();
  verbs.set(VerbType.GET, "get");
  verbs.set(VerbType.DELETE, "delete");
  verbs.set(VerbType.POST, "post");
  verbs.set(VerbType.PUT, "put");
  verbs.set(VerbType.PATCH, "patch");

  // api/http/definitions/Credentials.js
  var Credentials = class {
    #usernameExtractor;
    #passwordExtractor;
    /**
     * @param {Function=} usernameExtractor
     * @param {Function=} passwordExtractor
     */
    constructor(usernameExtractor, passwordExtractor) {
      this.#usernameExtractor = usernameExtractor;
      this.#passwordExtractor = passwordExtractor;
    }
    /**
     * The password extractor.
     *
     * @public
     * @returns {Function}
     */
    get usernameExtractor() {
      return this.#usernameExtractor;
    }
    /**
     * The password extractor.
     *
     * @public
     * @returns {Function}
     */
    get passwordExtractor() {
      return this.#passwordExtractor;
    }
    /**
     * Throws an {@link Error} if the instance is invalid.
     *
     * @public
     */
    validate() {
      if (!fn(this.usernameExtractor)) {
        throw new Error("Credentials username extractor must be a function.");
      }
      if (!fn(this.passwordExtractor)) {
        throw new Error("Credentials password extractor must be a function.");
      }
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[Credentials]`;
    }
  };

  // test/specs/api/http/GatewaySpec.js
  describe("When Gateway is used", () => {
    "use strict";
    let axiosRequestSpy;
    beforeEach(() => {
      axiosRequestSpy = spyOn(axios_default, "request").and.callFake(async () => ({ data: { ok: true } }));
    });
    it("should invoke axios with composed request options and return data", async () => {
      const endpoint = new Endpoint(
        "quotes",
        "Quotes",
        VerbType.POST,
        ProtocolType.HTTPS,
        "example.com",
        8443,
        new Parameters([new Parameter("Symbol", "symbol", async (payload) => payload.symbol)]),
        new Parameters([new Parameter("Mode", "mode", async (payload) => payload.mode)]),
        new Parameters([new Parameter("Token", "x-token", async (payload) => payload.token)]),
        new Parameters([new Parameter("Body", "body.value", async (payload) => payload.value)]),
        new Credentials((payload) => payload.user, (payload) => payload.pass),
        RequestInterceptor.fromDelegate((options) => {
          options.requestIntercepted = true;
          return options;
        }),
        ResponseInterceptor.DATA,
        ErrorInterceptor.EMPTY
      );
      const result = await Gateway.invoke(endpoint, {
        symbol: "A/B",
        mode: "full",
        token: "abc",
        value: 123,
        user: "u",
        pass: "p"
      });
      expect(result).toEqual({ ok: true });
    });
    it("should invoke axios with correct request options structure", async () => {
      const endpoint = new Endpoint(
        "quotes",
        "Quotes",
        VerbType.POST,
        ProtocolType.HTTPS,
        "example.com",
        8443,
        new Parameters([new Parameter("Symbol", "symbol", async (payload) => payload.symbol)]),
        new Parameters([new Parameter("Mode", "mode", async (payload) => payload.mode)]),
        new Parameters([new Parameter("Token", "x-token", async (payload) => payload.token)]),
        new Parameters([new Parameter("Body", "body.value", async (payload) => payload.value)]),
        new Credentials((payload) => payload.user, (payload) => payload.pass),
        RequestInterceptor.fromDelegate((options) => {
          options.requestIntercepted = true;
          return options;
        }),
        ResponseInterceptor.DATA,
        ErrorInterceptor.EMPTY
      );
      await Gateway.invoke(endpoint, {
        symbol: "A/B",
        mode: "full",
        token: "abc",
        value: 123,
        user: "u",
        pass: "p"
      });
      expect(axiosRequestSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        method: "post",
        url: "https://example.com:8443/A%2FB",
        headers: { "x-token": "abc" },
        params: { mode: "full" },
        data: { value: 123 },
        auth: { username: "u", password: "p" },
        requestIntercepted: true
      }));
    });
    it("should omit the default port from the request URL", async () => {
      const endpoint = new Endpoint("quotes", "Quotes", VerbType.GET, ProtocolType.HTTPS, "example.com");
      await Gateway.invoke(endpoint, {});
      expect(axiosRequestSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        method: "get",
        url: "https://example.com/"
      }));
    });
    it("should reject missing required parameter values", async () => {
      const endpoint = new Endpoint(
        "quotes",
        "Quotes",
        VerbType.GET,
        ProtocolType.HTTPS,
        "example.com",
        443,
        new Parameters([new Parameter("Symbol", "symbol", async () => null)])
      );
      await expectAsync(Gateway.invoke(endpoint, {})).toBeRejected();
    });
    it("should not call axios when required parameter values are missing", async () => {
      const endpoint = new Endpoint(
        "quotes",
        "Quotes",
        VerbType.GET,
        ProtocolType.HTTPS,
        "example.com",
        443,
        new Parameters([new Parameter("Symbol", "symbol", async () => null)])
      );
      try {
        await Gateway.invoke(endpoint, {});
      } catch (e) {
      }
      expect(axiosRequestSpy).not.toHaveBeenCalled();
    });
    it("should allow missing optional parameter values", async () => {
      const endpoint = new Endpoint(
        "quotes",
        "Quotes",
        VerbType.GET,
        ProtocolType.HTTPS,
        "example.com",
        443,
        new Parameters([new Parameter("Symbol", "symbol", async () => null, true)])
      );
      await Gateway.invoke(endpoint, {});
      expect(axiosRequestSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        url: "https://example.com/"
      }));
    });
    it("should delegate axios errors to the endpoint error interceptor", async () => {
      const remoteError = new Error("remote");
      const endpoint = new Endpoint(
        "quotes",
        "Quotes",
        VerbType.GET,
        ProtocolType.HTTPS,
        "example.com",
        443,
        new Parameters(),
        new Parameters(),
        new Parameters(),
        new Parameters(),
        null,
        RequestInterceptor.EMPTY,
        ResponseInterceptor.EMPTY,
        ErrorInterceptor.fromDelegate(async (error) => {
          throw { wrapped: error.message };
        })
      );
      axiosRequestSpy.and.callFake(async () => {
        throw remoteError;
      });
      await expectAsync(Gateway.invoke(endpoint, {})).toBeRejectedWith({ wrapped: "remote" });
    });
    it("should validate endpoint arguments", async () => {
      await expectAsync(Gateway.invoke(null, {})).toBeRejected();
    });
  });

  // api/http/builders/CredentialsBuilder.js
  var CredentialsBuilder = class {
    #credentials;
    constructor() {
      this.#credentials = new Credentials();
    }
    /**
     * The {@link Credentials} object, given all the information provided thus far.
     *
     * @public
     * @returns {Credentials}
     */
    get credentials() {
      return this.#credentials;
    }
    /**
     * Sets a literal username.
     *
     * @public
     * @param {string} username
     * @returns {CredentialsBuilder}
     */
    withLiteralUsername(username) {
      argumentIsOptional(username, "username", String);
      return this.withDelegateUsername((ignored) => username);
    }
    /**
     * Sets a function which returns a username.
     *
     * @public
     * @param {Function} delegate
     * @returns {CredentialsBuilder}
     */
    withDelegateUsername(delegate) {
      this.#credentials = new Credentials(delegate, this.#credentials.passwordExtractor);
      return this;
    }
    /**
     * Sets a literal password.
     *
     * @public
     * @param {string} password
     * @returns {CredentialsBuilder}
     */
    withLiteralPassword(password) {
      argumentIsOptional(password, "password", String);
      return this.withDelegatePassword((ignored) => password);
    }
    /**
     * Sets a function which returns a password.
     *
     * @public
     * @param {Function} delegate
     * @returns {CredentialsBuilder}
     */
    withDelegatePassword(delegate) {
      this.#credentials = new Credentials(this.#credentials.usernameExtractor, delegate);
      return this;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[CredentialsBuilder]";
    }
  };

  // test/specs/api/http/builders/CredentialsBuilderSpec.js
  describe("When a CredentialsBuilder is used", () => {
    "use strict";
    let builder;
    beforeEach(() => {
      builder = new CredentialsBuilder();
    });
    it("should expose a Credentials instance", () => {
      expect(builder.credentials instanceof Credentials).toEqual(true);
    });
    it("should set literal credentials", async () => {
      const usernameBuilder = builder.withLiteralUsername("user");
      const passwordBuilder = builder.withLiteralPassword("pass");
      expect({
        usernameBuilder,
        passwordBuilder,
        username: builder.credentials.usernameExtractor({}),
        password: builder.credentials.passwordExtractor({})
      }).toEqual({
        usernameBuilder: builder,
        passwordBuilder: builder,
        username: "user",
        password: "pass"
      });
    });
    it("should set delegate credentials", () => {
      const payload = { user: "luka", pass: "secret" };
      builder.withDelegateUsername((p) => p.user).withDelegatePassword((p) => p.pass);
      expect({
        username: builder.credentials.usernameExtractor(payload),
        password: builder.credentials.passwordExtractor(payload)
      }).toEqual({
        username: "luka",
        password: "secret"
      });
    });
  });

  // api/http/builders/ParametersBuilder.js
  var ParametersBuilder = class {
    #parameters;
    #required;
    /**
     * @param {boolean=} required - If true, all parameters will be marked as required.
     */
    constructor(required) {
      this.#parameters = new Parameters();
      this.#required = boolean(required) && required;
    }
    /**
     * The {@link Parameters} collection, given all the information provided thus far.
     *
     * @public
     * @returns {Parameters}
     */
    get parameters() {
      return this.#parameters;
    }
    /**
     * Adds a new parameter that extracts its value from a delegate.
     *
     * @param {string} description
     * @param {string} key
     * @param {Function} delegate
     * @param {boolean=} optional
     * @param {Function=} serializer
     * @returns {ParametersBuilder}
     */
    withDelegateParameter(description, key, delegate, optional, serializer) {
      this.#addParameter(new Parameter(description, key, buildDelegateExtractor(delegate, buildSerializer(serializer)), optional || this.#required));
      return this;
    }
    /**
     * Adds a new parameter with a literal value.
     *
     * @param {string} description
     * @param {string} key
     * @param {*=} value
     * @param {boolean=} optional
     * @returns {ParametersBuilder}
     */
    withLiteralParameter(description, key, value, optional) {
      this.#addParameter(new Parameter(description, key, buildLiteralExtractor(value || key), optional || this.#required));
      return this;
    }
    /**
     * Adds a new parameter that reads its value from the variable
     * on the request payload.
     *
     * @param {string} description
     * @param {string} key
     * @param {string} variable
     * @param {boolean=} optional
     * @param {Function=} serializer
     * @returns {ParametersBuilder}
     */
    withVariableParameter(description, key, variable, optional, serializer) {
      this.#addParameter(new Parameter(description, key, buildVariableExtractor(variable, buildSerializer(serializer)), optional || this.#required));
      return this;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[ParametersBuilder]";
    }
    #addParameter(parameter) {
      const items = this.#parameters.parameters.slice(0);
      items.push(parameter);
      this.#parameters = new Parameters(items);
    }
  };
  function buildSerializer(serializer) {
    let returnRef;
    if (fn(serializer)) {
      returnRef = serializer;
    } else {
      returnRef = (x) => x;
    }
    return returnRef;
  }
  function buildDelegateExtractor(fn2, serializer) {
    argumentIsRequired(fn2, "fn", Function);
    return async (payload) => {
      return serializer(fn2(payload));
    };
  }
  function buildLiteralExtractor(value) {
    argumentIsRequired(value, "value", String);
    return async () => value;
  }
  function buildVariableExtractor(variable, serializer) {
    argumentIsRequired(variable, "variable", String);
    return buildDelegateExtractor((payload) => {
      if (object(payload) && has(payload, variable)) {
        return read(payload, variable);
      } else {
        return null;
      }
    }, serializer);
  }

  // api/http/interceptors/CompositeErrorInterceptor.js
  var CompositeErrorInterceptor = class extends ErrorInterceptor {
    #a;
    #b;
    /**
     * @param {ErrorInterceptor} a - The first interceptor to process.
     * @param {ErrorInterceptor} b - The second interceptor to process.
     */
    constructor(a, b) {
      super();
      argumentIsRequired(a, "a", ErrorInterceptor, "ErrorInterceptor");
      argumentIsRequired(b, "b", ErrorInterceptor, "ErrorInterceptor");
      this.#a = a;
      this.#b = b;
    }
    /**
     * @protected
     * @override
     * @async
     * @param {object} error
     * @param {*} endpoint
     * @returns {Promise<*>}
     */
    async _onProcess(error, endpoint) {
      try {
        const result = await this.#a.process(error, endpoint);
        return result;
      } catch (adjusted) {
        return this.#b.process(adjusted, endpoint);
      }
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[CompositeErrorInterceptor]";
    }
  };

  // api/http/interceptors/CompositeResponseInterceptor.js
  var CompositeResponseInterceptor = class extends ResponseInterceptor {
    #a;
    #b;
    /**
     * @param {ResponseInterceptor} a - The first interceptor to process.
     * @param {ResponseInterceptor} b - The second interceptor to process.
     */
    constructor(a, b) {
      super();
      argumentIsRequired(a, "a", ResponseInterceptor, "ResponseInterceptor");
      argumentIsRequired(b, "b", ResponseInterceptor, "ResponseInterceptor");
      this.#a = a;
      this.#b = b;
    }
    /**
     * @protected
     * @override
     * @async
     * @param {object} response
     * @param {Endpoint} endpoint
     * @returns {Promise<*>}
     */
    async _onProcess(response, endpoint) {
      const adjusted = await this.#a.process(response, endpoint);
      return this.#b.process(adjusted, endpoint);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[CompositeResponseInterceptor]";
    }
  };

  // api/http/interceptors/CompositeRequestInterceptor.js
  var CompositeRequestInterceptor = class extends RequestInterceptor {
    #a;
    #b;
    /**
     * @param {RequestInterceptor} a - The first interceptor to process.
     * @param {RequestInterceptor} b - The second interceptor to process.
     */
    constructor(a, b) {
      super();
      argumentIsRequired(a, "a", RequestInterceptor, "RequestInterceptor");
      argumentIsRequired(b, "b", RequestInterceptor, "RequestInterceptor");
      this.#a = a;
      this.#b = b;
    }
    /**
     * @protected
     * @override
     * @async
     * @param {object} request
     * @param {Endpoint} endpoint
     * @returns {Promise<*>}
     */
    async _onProcess(request, endpoint) {
      const adjusted = await this.#a.process(request, endpoint);
      return this.#b.process(adjusted, endpoint);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[CompositeRequestInterceptor]";
    }
  };

  // api/http/builders/EndpointBuilder.js
  var EndpointBuilder = class _EndpointBuilder {
    #endpoint;
    /**
     * @param {string} name
     * @param {string=} description
     */
    constructor(name, description) {
      argumentIsRequired(name, "name", String);
      argumentIsOptional(description, "description", String);
      this.#endpoint = new Endpoint(name, description);
    }
    /**
     * The {@link Endpoint}, given all the information provided thus far.
     *
     * @public
     * @returns {Endpoint}
     */
    get endpoint() {
      return this.#endpoint;
    }
    /**
     * Sets the verb.
     *
     * @public
     * @param {VerbType} verb
     * @returns {EndpointBuilder}
     */
    withVerb(verb) {
      argumentIsRequired(verb, "verb", VerbType, "VerbType");
      this.#endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
      return this;
    }
    /**
     * Sets the host.
     *
     * @public
     * @param {ProtocolType} protocol
     * @returns {EndpointBuilder}
     */
    withProtocol(protocol) {
      argumentIsRequired(protocol, "protocol", ProtocolType, "ProtocolType");
      this.#endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
      return this;
    }
    /**
     * Sets the host.
     *
     * @public
     * @param {string} host
     * @returns {EndpointBuilder}
     */
    withHost(host) {
      argumentIsRequired(host, "host", String);
      this.#endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
      return this;
    }
    /**
     * Sets the port.
     *
     * @public
     * @param {number} port
     * @returns {EndpointBuilder}
     */
    withPort(port) {
      argumentIsRequired(port, "port", Number);
      this.#endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
      return this;
    }
    /**
     * Adds a {@link Parameters} collection, describing the request headers, using a callback.
     *
     * @public
     * @param {parametersBuilderCallback} callback
     * @returns {EndpointBuilder}
     */
    withHeadersBuilder(callback) {
      argumentIsRequired(callback, "callback", Function);
      const builder = new ParametersBuilder();
      callback(builder);
      const headers = builder.parameters;
      this.#endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
      return this;
    }
    /**
     * Adds a {@link Parameters} collection, describing the request path, using a callback.
     *
     * @public
     * @param {parametersBuilderCallback} callback
     * @returns {EndpointBuilder}
     */
    withPathBuilder(callback) {
      argumentIsRequired(callback, "callback", Function);
      const builder = new ParametersBuilder(true);
      callback(builder);
      const path = builder.parameters;
      this.#endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
      return this;
    }
    /**
     * Adds a {@link Parameters} collection, describing the request querystring, using a callback.
     *
     * @public
     * @param {parametersBuilderCallback} callback
     * @returns {EndpointBuilder}
     */
    withQueryBuilder(callback) {
      argumentIsRequired(callback, "callback", Function);
      const builder = new ParametersBuilder();
      callback(builder);
      const query = builder.parameters;
      this.#endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
      return this;
    }
    /**
     * Adds a {@link Parameters} collection, describing the request body, using a callback.
     *
     * @public
     * @param {parametersBuilderCallback} callback
     * @returns {EndpointBuilder}
     */
    withBodyBuilder(callback) {
      argumentIsRequired(callback, "callback", Function);
      const builder = new ParametersBuilder();
      callback(builder);
      const body = builder.parameters;
      this.#endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
      return this;
    }
    /**
     * Adds a body to the request.
     *
     * @public
     * @param {string=} description - The human-readable description of the request body.
     * @returns {EndpointBuilder}
     */
    withBody(description) {
      argumentIsOptional(description, "description", String);
      return this.withBodyBuilder((bodyBuilder) => {
        bodyBuilder.withDelegateParameter(description || "request payload", "body", (x) => x);
      });
    }
    /**
     * Adds basic authentication to the request.
     *
     * @public
     * @param {string} username
     * @param {string} password
     * @returns {EndpointBuilder}
     */
    withBasicAuthentication(username, password) {
      argumentIsRequired(username, "username", String);
      argumentIsRequired(password, "password", String);
      return this.withBasicAuthenticationBuilder((credentialsBuilder) => {
        credentialsBuilder.withLiteralUsername(username);
        credentialsBuilder.withLiteralPassword(password);
      });
    }
    /**
     * Adds basic authentication to the request, using a callback.
     *
     * @public
     * @param {Function} callback
     * @returns {EndpointBuilder}
     */
    withBasicAuthenticationBuilder(callback) {
      argumentIsRequired(callback, "callback", Function);
      const builder = new CredentialsBuilder();
      callback(builder);
      const credentials = builder.credentials;
      this.#endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
      return this;
    }
    /**
     * Adds a {@link RequestInterceptor}.
     *
     * @public
     * @param {RequestInterceptor} requestInterceptor
     * @returns {EndpointBuilder}
     */
    withRequestInterceptor(requestInterceptor) {
      argumentIsRequired(requestInterceptor, "requestInterceptor", RequestInterceptor, "RequestInterceptor");
      let existingRequestInterceptor = this.endpoint.requestInterceptor;
      let updatedRequestInterceptor;
      if (existingRequestInterceptor && existingRequestInterceptor !== RequestInterceptor.EMPTY) {
        updatedRequestInterceptor = new CompositeRequestInterceptor(existingRequestInterceptor, requestInterceptor);
      } else {
        updatedRequestInterceptor = requestInterceptor;
      }
      this.#endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, updatedRequestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);
      return this;
    }
    /**
     * Adds a {@link ResponseInterceptor} for successful web service responses.
     *
     * @public
     * @param {ResponseInterceptor} responseInterceptor
     * @returns {EndpointBuilder}
     */
    withResponseInterceptor(responseInterceptor) {
      argumentIsRequired(responseInterceptor, "responseInterceptor", ResponseInterceptor, "ResponseInterceptor");
      let existingResponseInterceptor = this.endpoint.responseInterceptor;
      let updatedResponseInterceptor;
      if (existingResponseInterceptor && existingResponseInterceptor !== ResponseInterceptor.EMPTY) {
        updatedResponseInterceptor = new CompositeResponseInterceptor(existingResponseInterceptor, responseInterceptor);
      } else {
        updatedResponseInterceptor = responseInterceptor;
      }
      this.#endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, updatedResponseInterceptor, this.endpoint.errorInterceptor);
      return this;
    }
    /**
     * Adds a {@link ErrorInterceptor} for handling remote web service errors.
     *
     * @public
     * @param {ErrorInterceptor} errorInterceptor
     * @returns {EndpointBuilder}
     */
    withErrorInterceptor(errorInterceptor) {
      argumentIsRequired(errorInterceptor, "errorInterceptor", ErrorInterceptor, "ErrorInterceptor");
      let existingErrorInterceptor = this.endpoint.errorInterceptor;
      let updatedErrorInterceptor;
      if (existingErrorInterceptor && existingErrorInterceptor !== ErrorInterceptor.EMPTY) {
        updatedErrorInterceptor = new CompositeErrorInterceptor(existingErrorInterceptor, errorInterceptor);
      } else {
        updatedErrorInterceptor = errorInterceptor;
      }
      this.#endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, updatedErrorInterceptor);
      return this;
    }
    /**
     * Factory function for creating an {@link EndpointBuilder} instance.
     *
     * @public
     * @static
     * @param {string} name
     * @param {string=} description
     * @returns {EndpointBuilder}
     */
    static for(name, description) {
      return new _EndpointBuilder(name, description);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[EndpointBuilder]";
    }
  };

  // test/specs/api/http/builders/EndpointBuilderSpec.js
  describe("When an EndpointBuilder is used", () => {
    "use strict";
    let builder;
    beforeEach(() => {
      builder = new EndpointBuilder("quotes", "Quotes endpoint");
    });
    it("should expose an Endpoint instance", () => {
      expect(builder.endpoint instanceof Endpoint).toEqual(true);
    });
    it("should have correct endpoint name", () => {
      expect(builder.endpoint.name).toEqual("quotes");
    });
    it("should have correct endpoint description", () => {
      expect(builder.endpoint.description).toEqual("Quotes endpoint");
    });
    it("should return builder when setting verb", () => {
      expect(builder.withVerb(VerbType.POST)).toBe(builder);
    });
    it("should return builder when setting protocol", () => {
      expect(builder.withProtocol(ProtocolType.HTTP)).toBe(builder);
    });
    it("should return builder when setting host", () => {
      expect(builder.withHost("example.com")).toBe(builder);
    });
    it("should return builder when setting port", () => {
      expect(builder.withPort(8080)).toBe(builder);
    });
    it("should set verb correctly", () => {
      builder.withVerb(VerbType.POST);
      expect(builder.endpoint.verb).toBe(VerbType.POST);
    });
    it("should set protocol correctly", () => {
      builder.withProtocol(ProtocolType.HTTP);
      expect(builder.endpoint.protocol).toBe(ProtocolType.HTTP);
    });
    it("should set host correctly", () => {
      builder.withHost("example.com");
      expect(builder.endpoint.host).toEqual("example.com");
    });
    it("should set port correctly", () => {
      builder.withPort(8080);
      expect(builder.endpoint.port).toEqual(8080);
    });
    it("should build path parameters", () => {
      builder.withPathBuilder((path) => path.withVariableParameter("Symbol", "symbol", "symbol"));
      expect(builder.endpoint.path.parameters.length).toEqual(1);
    });
    it("should build query parameters", () => {
      builder.withQueryBuilder((query) => query.withLiteralParameter("Mode", "mode", "full"));
      expect(builder.endpoint.query.parameters.length).toEqual(1);
    });
    it("should build header parameters", () => {
      builder.withHeadersBuilder((headers) => headers.withLiteralParameter("Token", "token", "abc"));
      expect(builder.endpoint.headers.parameters.length).toEqual(1);
    });
    it("should build body parameters", () => {
      builder.withBodyBuilder((body) => body.withLiteralParameter("Payload", "payload", "value"));
      expect(builder.endpoint.body.parameters.length).toEqual(1);
    });
    it("should build a body parameter with correct description", () => {
      builder.withBody("Payload");
      expect(builder.endpoint.body.parameters[0].description).toEqual("Payload");
    });
    it("should build a body parameter with correct key", () => {
      builder.withBody("Payload");
      expect(builder.endpoint.body.parameters[0].key).toEqual("body");
    });
    it("should build basic authentication username extractor", () => {
      builder.withBasicAuthentication("user", "pass");
      expect(builder.endpoint.credentials.usernameExtractor({})).toEqual("user");
    });
    it("should build basic authentication password extractor", () => {
      builder.withBasicAuthentication("user", "pass");
      expect(builder.endpoint.credentials.passwordExtractor({})).toEqual("pass");
    });
    it("should build basic authentication with callback for username", () => {
      builder.withBasicAuthenticationBuilder((credentials) => {
        credentials.withDelegateUsername((payload) => payload.user);
        credentials.withDelegatePassword((payload) => payload.pass);
      });
      expect(builder.endpoint.credentials.usernameExtractor({ user: "u" })).toEqual("u");
    });
    it("should build basic authentication with callback for password", () => {
      builder.withBasicAuthenticationBuilder((credentials) => {
        credentials.withDelegateUsername((payload) => payload.user);
        credentials.withDelegatePassword((payload) => payload.pass);
      });
      expect(builder.endpoint.credentials.passwordExtractor({ pass: "p" })).toEqual("p");
    });
    it("should compose request interceptors", async () => {
      builder.withRequestInterceptor(RequestInterceptor.fromDelegate((request) => {
        request.a = true;
        return request;
      })).withRequestInterceptor(RequestInterceptor.fromDelegate((request) => {
        request.b = true;
        return request;
      }));
      await expectAsync(builder.endpoint.requestInterceptor.process({}, builder.endpoint)).toBeResolvedTo({ a: true, b: true });
    });
    it("should compose response interceptors", async () => {
      builder.withResponseInterceptor(ResponseInterceptor.fromDelegate((response) => {
        response.a = true;
        return response;
      })).withResponseInterceptor(ResponseInterceptor.fromDelegate((response) => {
        response.b = true;
        return response;
      }));
      await expectAsync(builder.endpoint.responseInterceptor.process({}, builder.endpoint)).toBeResolvedTo({ a: true, b: true });
    });
    it("should compose error interceptors", async () => {
      builder.withErrorInterceptor(ErrorInterceptor.fromDelegate((error) => {
        throw { a: error };
      })).withErrorInterceptor(ErrorInterceptor.fromDelegate((error) => {
        throw { b: error };
      }));
      await expectAsync(builder.endpoint.errorInterceptor.process("x", builder.endpoint)).toBeRejectedWith({ b: { a: "x" } });
    });
    it("should call interceptors in order", async () => {
      const calls = [];
      builder.withRequestInterceptor(RequestInterceptor.fromDelegate((request) => {
        calls.push("request:a");
        return request;
      })).withRequestInterceptor(RequestInterceptor.fromDelegate((request) => {
        calls.push("request:b");
        return request;
      })).withResponseInterceptor(ResponseInterceptor.fromDelegate((response) => {
        calls.push("response:a");
        return response;
      })).withResponseInterceptor(ResponseInterceptor.fromDelegate((response) => {
        calls.push("response:b");
        return response;
      })).withErrorInterceptor(ErrorInterceptor.fromDelegate((error) => {
        calls.push("error:a");
        throw error;
      })).withErrorInterceptor(ErrorInterceptor.fromDelegate((error) => {
        calls.push("error:b");
        throw error;
      }));
      await builder.endpoint.requestInterceptor.process({}, builder.endpoint);
      await builder.endpoint.responseInterceptor.process({}, builder.endpoint);
      try {
        await builder.endpoint.errorInterceptor.process("x", builder.endpoint);
      } catch (e) {
      }
      expect(calls).toEqual(["request:a", "request:b", "response:a", "response:b", "error:a", "error:b"]);
    });
    it("should create a builder from the static factory", () => {
      expect(EndpointBuilder.for("name") instanceof EndpointBuilder).toEqual(true);
    });
  });

  // test/specs/api/http/builders/ParametersBuilderSpec.js
  describe("When a ParametersBuilder is used", () => {
    "use strict";
    let builder;
    beforeEach(() => {
      builder = new ParametersBuilder();
    });
    it("should expose a Parameters instance", () => {
      expect(builder.parameters instanceof Parameters).toEqual(true);
    });
    it("should return builder when adding delegate parameter", () => {
      expect(builder.withDelegateParameter("Name", "name", (payload) => payload.name, false, (value) => value.toUpperCase())).toBe(builder);
    });
    it("should set delegate parameter description correctly", () => {
      builder.withDelegateParameter("Name", "name", (payload) => payload.name, false, (value) => value.toUpperCase());
      expect(builder.parameters.parameters[0].description).toEqual("Name");
    });
    it("should set delegate parameter key correctly", () => {
      builder.withDelegateParameter("Name", "name", (payload) => payload.name, false, (value) => value.toUpperCase());
      expect(builder.parameters.parameters[0].key).toEqual("name");
    });
    it("should set delegate parameter optional correctly", () => {
      builder.withDelegateParameter("Name", "name", (payload) => payload.name, false, (value) => value.toUpperCase());
      expect(builder.parameters.parameters[0].optional).toEqual(false);
    });
    it("should apply delegate parameter extractor with formatter", async () => {
      builder.withDelegateParameter("Name", "name", (payload) => payload.name, false, (value) => value.toUpperCase());
      await expectAsync(builder.parameters.parameters[0].extractor({ name: "luka" })).toBeResolvedTo("LUKA");
    });
    it("should set literal parameter optional correctly", () => {
      builder.withLiteralParameter("Token", "token", "abc", true);
      expect(builder.parameters.parameters[0].optional).toEqual(true);
    });
    it("should apply literal parameter extractor", async () => {
      builder.withLiteralParameter("Token", "token", "abc", true);
      await expectAsync(builder.parameters.parameters[0].extractor({})).toBeResolvedTo("abc");
    });
    it("should use the key as the literal parameter value when no value is supplied", async () => {
      builder.withLiteralParameter("Token", "token");
      await expectAsync(builder.parameters.parameters[0].extractor({})).toBeResolvedTo("token");
    });
    it("should apply variable parameter extractor with nested path", async () => {
      builder.withVariableParameter("Identifier", "id", "nested.id", false, (value) => `#${value}`);
      await expectAsync(builder.parameters.parameters[0].extractor({ nested: { id: 42 } })).toBeResolvedTo("#42");
    });
    it("should apply variable parameter extractor with missing path", async () => {
      builder.withVariableParameter("Identifier", "id", "nested.id", false, (value) => `#${value}`);
      await expectAsync(builder.parameters.parameters[0].extractor({})).toBeResolvedTo("#null");
    });
    it("should mark parameters optional when the builder is required", () => {
      const requiredBuilder = new ParametersBuilder(true);
      requiredBuilder.withLiteralParameter("Id", "id");
      expect(requiredBuilder.parameters.parameters[0].optional).toEqual(true);
    });
  });

  // test/specs/api/http/definitions/CredentialsSpec.js
  describe("When Credentials are constructed", () => {
    "use strict";
    let usernameExtractor;
    let passwordExtractor;
    let credentials;
    beforeEach(() => {
      usernameExtractor = () => "user";
      passwordExtractor = () => "pass";
      credentials = new Credentials(usernameExtractor, passwordExtractor);
    });
    it("should expose the username extractor", () => {
      expect(credentials.usernameExtractor).toBe(usernameExtractor);
    });
    it("should expose the password extractor", () => {
      expect(credentials.passwordExtractor).toBe(passwordExtractor);
    });
    it("should validate successfully", () => {
      expect(() => credentials.validate()).not.toThrow();
    });
    it("should reject a missing username extractor", () => {
      expect(() => new Credentials(null, passwordExtractor).validate()).toThrow();
    });
    it("should reject a missing password extractor", () => {
      expect(() => new Credentials(usernameExtractor, null).validate()).toThrow();
    });
  });

  // test/specs/api/http/definitions/EndpointSpec.js
  describe("When an Endpoint is constructed", () => {
    "use strict";
    let path;
    let query;
    let headers;
    let body;
    let credentials;
    let requestInterceptor;
    let responseInterceptor;
    let errorInterceptor;
    let endpoint;
    beforeEach(() => {
      path = new Parameters([new Parameter("Id", "id", async () => "1")]);
      query = new Parameters();
      headers = new Parameters();
      body = new Parameters();
      credentials = new Credentials(() => "user", () => "pass");
      requestInterceptor = RequestInterceptor.fromDelegate((request) => request);
      responseInterceptor = ResponseInterceptor.fromDelegate((response) => response);
      errorInterceptor = ErrorInterceptor.fromDelegate(async (error) => {
        throw error;
      });
      endpoint = new Endpoint("name", "Description", VerbType.POST, ProtocolType.HTTP, "example.com", 8080, path, query, headers, body, credentials, requestInterceptor, responseInterceptor, errorInterceptor);
    });
    it("should expose name through getter", () => {
      expect(endpoint.name).toEqual("name");
    });
    it("should expose description through getter", () => {
      expect(endpoint.description).toEqual("Description");
    });
    it("should expose verb through getter", () => {
      expect(endpoint.verb).toBe(VerbType.POST);
    });
    it("should expose protocol through getter", () => {
      expect(endpoint.protocol).toBe(ProtocolType.HTTP);
    });
    it("should expose host through getter", () => {
      expect(endpoint.host).toEqual("example.com");
    });
    it("should expose port through getter", () => {
      expect(endpoint.port).toEqual(8080);
    });
    it("should expose path through getter", () => {
      expect(endpoint.path).toBe(path);
    });
    it("should expose query through getter", () => {
      expect(endpoint.query).toBe(query);
    });
    it("should expose headers through getter", () => {
      expect(endpoint.headers).toBe(headers);
    });
    it("should expose body through getter", () => {
      expect(endpoint.body).toBe(body);
    });
    it("should expose credentials through getter", () => {
      expect(endpoint.credentials).toBe(credentials);
    });
    it("should expose requestInterceptor through getter", () => {
      expect(endpoint.requestInterceptor).toBe(requestInterceptor);
    });
    it("should expose responseInterceptor through getter", () => {
      expect(endpoint.responseInterceptor).toBe(responseInterceptor);
    });
    it("should expose errorInterceptor through getter", () => {
      expect(endpoint.errorInterceptor).toBe(errorInterceptor);
    });
    describe("with default values", () => {
      let defaulted;
      beforeEach(() => {
        defaulted = new Endpoint("name", "Description");
      });
      it("should default verb to GET", () => {
        expect(defaulted.verb).toBe(VerbType.GET);
      });
      it("should default protocol to HTTPS", () => {
        expect(defaulted.protocol).toBe(ProtocolType.HTTPS);
      });
      it("should default port to 443", () => {
        expect(defaulted.port).toEqual(443);
      });
      it("should default path to Parameters instance", () => {
        expect(defaulted.path instanceof Parameters).toEqual(true);
      });
      it("should default requestInterceptor to EMPTY", () => {
        expect(defaulted.requestInterceptor).toBe(RequestInterceptor.EMPTY);
      });
      it("should default responseInterceptor to EMPTY", () => {
        expect(defaulted.responseInterceptor).toBe(ResponseInterceptor.EMPTY);
      });
      it("should default errorInterceptor to EMPTY", () => {
        expect(defaulted.errorInterceptor).toBe(ErrorInterceptor.EMPTY);
      });
    });
    it("should validate successfully", () => {
      expect(() => endpoint.validate()).not.toThrow();
    });
    it("should reject empty host value", () => {
      expect(() => new Endpoint("name", null, VerbType.GET, ProtocolType.HTTP, "", 80).validate()).toThrow();
    });
    it("should reject invalid port value", () => {
      expect(() => new Endpoint("name", null, VerbType.GET, ProtocolType.HTTP, "example.com", 7e4).validate()).toThrow();
    });
    it("should reject invalid parameter collections", () => {
      expect(() => new Endpoint("name", null, VerbType.GET, ProtocolType.HTTP, "example.com", 80, {}).validate()).toThrow();
    });
    it("should reject invalid credentials", () => {
      expect(() => new Endpoint("name", null, VerbType.GET, ProtocolType.HTTP, "example.com", 80, path, query, headers, body, {}).validate()).toThrow();
    });
    it("should reject invalid requestInterceptor", () => {
      expect(() => new Endpoint("name", null, VerbType.GET, ProtocolType.HTTP, "example.com", 80, path, query, headers, body, null, {}).validate()).toThrow();
    });
    it("should reject invalid responseInterceptor", () => {
      expect(() => new Endpoint("name", null, VerbType.GET, ProtocolType.HTTP, "example.com", 80, path, query, headers, body, null, null, {}).validate()).toThrow();
    });
    it("should reject invalid errorInterceptor", () => {
      expect(() => new Endpoint("name", null, VerbType.GET, ProtocolType.HTTP, "example.com", 80, path, query, headers, body, null, null, null, {}).validate()).toThrow();
    });
  });

  // test/specs/api/http/definitions/ParameterSpec.js
  describe("When a Parameter is constructed", () => {
    "use strict";
    let extractor;
    let parameter;
    beforeEach(() => {
      extractor = async () => "value";
      parameter = new Parameter("Description", "name", extractor, true);
    });
    it("should expose the description", () => {
      expect(parameter.description).toEqual("Description");
    });
    it("should expose the key", () => {
      expect(parameter.key).toEqual("name");
    });
    it("should expose the extractor", () => {
      expect(parameter.extractor).toBe(extractor);
    });
    it("should expose the optional flag", () => {
      expect(parameter.optional).toEqual(true);
    });
    it("should validate successfully", () => {
      expect(() => parameter.validate()).not.toThrow();
    });
    it("should reject an empty key", () => {
      expect(() => new Parameter("Description", "", extractor).validate()).toThrow();
    });
    it("should reject a missing extractor", () => {
      expect(() => new Parameter("Description", "name", null).validate()).toThrow();
    });
  });

  // test/specs/api/http/definitions/ParametersSpec.js
  describe("When Parameters are constructed", () => {
    "use strict";
    let parameterA;
    let parameterB;
    let parameters;
    beforeEach(() => {
      parameterA = new Parameter("A", "a", async () => "a");
      parameterB = new Parameter("B", "b", async () => "b");
      parameters = new Parameters([parameterA]);
    });
    it("should expose the parameter list", () => {
      expect(parameters.parameters).toEqual([parameterA]);
    });
    it("should validate successfully", () => {
      expect(() => parameters.validate()).not.toThrow();
    });
    it("should reject non-Parameter items", () => {
      expect(() => new Parameters([{}]).validate()).toThrow();
    });
    describe("and two parameter collections are merged", () => {
      let merged;
      beforeEach(() => {
        merged = Parameters.merge(parameters, new Parameters([
          new Parameter("A duplicate", "a", async () => "duplicate"),
          parameterB
        ]));
      });
      it("should keep existing parameters first", () => {
        expect(merged.parameters[0]).toBe(parameterA);
      });
      it("should add parameters with new keys", () => {
        expect(merged.parameters[1]).toBe(parameterB);
      });
      it("should not duplicate parameters with existing keys", () => {
        expect(merged.parameters.length).toEqual(2);
      });
    });
  });

  // test/specs/api/http/definitions/ProtocolTypeSpec.js
  describe("When ProtocolType values are used", () => {
    "use strict";
    it("should expose HTTP default port", () => {
      expect(ProtocolType.HTTP.defaultPort).toEqual(80);
    });
    it("should expose HTTP prefix", () => {
      expect(ProtocolType.HTTP.prefix).toEqual("http://");
    });
    it("should expose HTTPS default port", () => {
      expect(ProtocolType.HTTPS.defaultPort).toEqual(443);
    });
    it("should expose HTTPS prefix", () => {
      expect(ProtocolType.HTTPS.prefix).toEqual("https://");
    });
    it("should parse HTTP protocol code", () => {
      expect(ProtocolType.parse("HTTP")).toBe(ProtocolType.HTTP);
    });
    it("should parse HTTPS protocol code", () => {
      expect(ProtocolType.parse("HTTPS")).toBe(ProtocolType.HTTPS);
    });
    it("should return null for unknown protocol codes", () => {
      expect(ProtocolType.parse("FTP")).toBeNull();
    });
    it("should allow valid constructor arguments", () => {
      expect(() => new ProtocolType("CUSTOM", 1234, "custom://")).not.toThrow();
    });
    it("should reject negative port numbers", () => {
      expect(() => new ProtocolType("CUSTOM", -1, "custom://")).toThrow();
    });
    it("should reject null prefix", () => {
      expect(() => new ProtocolType("CUSTOM", 1234, null)).toThrow();
    });
  });

  // test/specs/api/http/definitions/VerbTypeSpec.js
  describe("When VerbType values are used", () => {
    "use strict";
    const verbs2 = [
      ["DELETE", () => VerbType.DELETE],
      ["GET", () => VerbType.GET],
      ["POST", () => VerbType.POST],
      ["PUT", () => VerbType.PUT],
      ["PATCH", () => VerbType.PATCH]
    ];
    verbs2.forEach(([description, getVerb]) => {
      it(`should expose ${description}`, () => {
        expect({
          description: getVerb().description,
          code: getVerb().code
        }).toEqual({
          description,
          code: description
        });
      });
    });
  });

  // test/specs/api/http/interceptors/CompositeErrorInterceptorSpec.js
  describe("When a CompositeErrorInterceptor is used", () => {
    "use strict";
    it("should process rejected errors through both interceptors in order", async () => {
      const interceptor = new CompositeErrorInterceptor(
        ErrorInterceptor.fromDelegate(async (error) => {
          throw { first: error };
        }),
        ErrorInterceptor.fromDelegate(async (error) => {
          throw { second: error };
        })
      );
      await expectAsync(interceptor.process("raw", null)).toBeRejectedWith({ second: { first: "raw" } });
    });
    it("should validate constructor arguments", () => {
      expect([() => new CompositeErrorInterceptor(null, ErrorInterceptor.EMPTY), () => new CompositeErrorInterceptor(ErrorInterceptor.EMPTY, null)].map(throws)).toEqual([true, true]);
    });
  });
  function throws(action) {
    try {
      action();
      return false;
    } catch {
      return true;
    }
  }

  // test/specs/api/http/interceptors/CompositeRequestInterceptorSpec.js
  describe("When a CompositeRequestInterceptor is used", () => {
    "use strict";
    it("should process requests through both interceptors in order", async () => {
      const interceptor = new CompositeRequestInterceptor(
        RequestInterceptor.fromDelegate((request) => {
          request.first = true;
          return request;
        }),
        RequestInterceptor.fromDelegate((request) => {
          request.second = request.first;
          return request;
        })
      );
      await expectAsync(interceptor.process({}, null)).toBeResolvedTo({ first: true, second: true });
    });
    it("should validate constructor arguments", () => {
      expect([() => new CompositeRequestInterceptor(null, RequestInterceptor.EMPTY), () => new CompositeRequestInterceptor(RequestInterceptor.EMPTY, null)].map(throws2)).toEqual([true, true]);
    });
  });
  function throws2(action) {
    try {
      action();
      return false;
    } catch {
      return true;
    }
  }

  // test/specs/api/http/interceptors/CompositeResponseInterceptorSpec.js
  describe("When a CompositeResponseInterceptor is used", () => {
    "use strict";
    it("should process responses through both interceptors in order", async () => {
      const interceptor = new CompositeResponseInterceptor(
        ResponseInterceptor.fromDelegate((response) => {
          response.first = true;
          return response;
        }),
        ResponseInterceptor.fromDelegate((response) => {
          response.second = response.first;
          return response;
        })
      );
      await expectAsync(interceptor.process({}, null)).toBeResolvedTo({ first: true, second: true });
    });
    it("should validate constructor arguments", () => {
      expect([() => new CompositeResponseInterceptor(null, ResponseInterceptor.EMPTY), () => new CompositeResponseInterceptor(ResponseInterceptor.EMPTY, null)].map(throws3)).toEqual([true, true]);
    });
  });
  function throws3(action) {
    try {
      action();
      return false;
    } catch {
      return true;
    }
  }

  // test/specs/api/http/interceptors/ErrorInterceptorSpec.js
  describe("When ErrorInterceptor is used", () => {
    "use strict";
    let endpoint;
    beforeEach(() => {
      endpoint = { description: "Endpoint" };
    });
    it("should reject errors using the base implementation", async () => {
      await expectAsync(new ErrorInterceptor().process("raw", endpoint)).toBeRejectedWith("raw");
    });
    it("should expose an empty interceptor", async () => {
      await expectAsync(ErrorInterceptor.EMPTY.process("raw", endpoint)).toBeRejectedWith("raw");
    });
    it("should create delegate interceptors that reject with delegated values", async () => {
      const delegate = jasmine.createSpy("delegate").and.callFake(async () => {
        throw "done";
      });
      const interceptor = ErrorInterceptor.fromDelegate(delegate);
      await expectAsync(interceptor.process("raw", endpoint)).toBeRejectedWith("done");
    });
    it("should create delegate interceptors that call the delegate with correct arguments", async () => {
      const delegate = jasmine.createSpy("delegate").and.callFake(async () => {
        throw "done";
      });
      const interceptor = ErrorInterceptor.fromDelegate(delegate);
      try {
        await interceptor.process("raw", endpoint);
      } catch (e) {
      }
      expect(delegate).toHaveBeenCalledWith("raw", endpoint);
    });
    it("should reject deserialized JSON response data from the general interceptor", async () => {
      await expectAsync(ErrorInterceptor.GENERAL.process({
        response: {
          headers: { "content-type": "application/json" },
          data: '{"message":"bad"}'
        }
      }, endpoint)).toBeRejectedWith({ message: "bad" });
    });
    it("should reject object JSON response data from the general interceptor", async () => {
      await expectAsync(ErrorInterceptor.GENERAL.process({
        response: {
          headers: { "content-type": "application/json" },
          data: { message: "bad" }
        }
      }, endpoint)).toBeRejectedWith({ message: "bad" });
    });
    it("should convert network errors with no response into authorization failures", async () => {
      await expectAsync(ErrorInterceptor.GENERAL.process({ message: "Network Error" }, endpoint)).toBeRejected();
    });
    it("should convert general errors into general failures", async () => {
      await expectAsync(ErrorInterceptor.GENERAL.process({ message: "Other Error" }, endpoint)).toBeRejected();
    });
    it("should validate delegate arguments", () => {
      expect(() => ErrorInterceptor.fromDelegate(null)).toThrow();
    });
  });

  // test/specs/api/http/interceptors/RequestInterceptorSpec.js
  describe("When RequestInterceptor is used", () => {
    "use strict";
    it("should process requests using the base implementation", async () => {
      const request = {};
      await expectAsync(new RequestInterceptor().process(request, null)).toBeResolvedTo(request);
    });
    it("should expose an empty interceptor", async () => {
      const request = {};
      await expectAsync(RequestInterceptor.EMPTY.process(request, null)).toBeResolvedTo(request);
    });
    it("should create delegate interceptors", async () => {
      const endpoint = { name: "endpoint" };
      const delegate = jasmine.createSpy("delegate").and.returnValue({ ok: true });
      const interceptor = RequestInterceptor.fromDelegate(delegate);
      const result = await interceptor.process({}, endpoint);
      expect({
        result,
        calls: delegate.calls.allArgs()
      }).toEqual({
        result: { ok: true },
        calls: [[{}, endpoint]]
      });
    });
    it("should create a plain text response interceptor", async () => {
      const request = await RequestInterceptor.PLAIN_TEXT_RESPONSE.process({}, null);
      expect(request.transformResponse("text")).toEqual("text");
    });
    it("should validate delegate arguments", () => {
      expect(() => RequestInterceptor.fromDelegate(null)).toThrow();
    });
  });

  // test/specs/api/http/interceptors/ResponseInterceptorSpec.js
  describe("When ResponseInterceptor is used", () => {
    "use strict";
    it("should process responses using the base implementation", async () => {
      const response = { data: "raw" };
      await expectAsync(new ResponseInterceptor().process(response, null)).toBeResolvedTo(response);
    });
    it("should expose an empty interceptor", async () => {
      const response = { data: "raw" };
      await expectAsync(ResponseInterceptor.EMPTY.process(response, null)).toBeResolvedTo(response);
    });
    it("should expose a data interceptor", async () => {
      await expectAsync(ResponseInterceptor.DATA.process({ data: "payload" }, null)).toBeResolvedTo("payload");
    });
    it("should create delegate interceptors", async () => {
      const endpoint = { name: "endpoint" };
      const delegate = jasmine.createSpy("delegate").and.returnValue("done");
      const interceptor = ResponseInterceptor.fromDelegate(delegate);
      const result = await interceptor.process({ data: "raw" }, endpoint);
      expect({
        result,
        calls: delegate.calls.allArgs()
      }).toEqual({
        result: "done",
        calls: [[{ data: "raw" }, endpoint]]
      });
    });
    it("should validate delegate arguments", () => {
      expect(() => ResponseInterceptor.fromDelegate(null)).toThrow();
    });
  });

  // test/specs/collections/LinkedListSpec.js
  describe('When "doe" is used to start a linked list', () => {
    "use strict";
    let doe;
    beforeEach(() => {
      doe = new LinkedList("doe");
    });
    describe('and "me" is added to "doe"', () => {
      let me;
      beforeEach(() => {
        me = doe.insert("me");
      });
      describe('and "ray" is inserted between "doe" and "me"', () => {
        let ray;
        beforeEach(() => {
          ray = doe.insert("ray");
        });
        it('the "ray" node should not be the the tail', () => {
          expect(me.getIsTail()).toEqual(true);
        });
        it('the "ray" node should have a value of "ray"', () => {
          expect(ray.getValue()).toEqual("ray");
        });
        it('the "me" node should still be the the tail', () => {
          expect(me.getIsTail()).toEqual(true);
        });
        it('the "doe" node should reference the "ray" node', () => {
          expect(doe.getNext()).toBe(ray);
        });
        it('the "ray" node should reference the "me" node', () => {
          expect(ray.getNext()).toBe(me);
        });
      });
      it('the "me" node should be the the tail', () => {
        expect(me.getIsTail()).toEqual(true);
      });
      it('the "me" node should have a value of "me"', () => {
        expect(me.getValue()).toEqual("me");
      });
      it('the "doe" node should not be the tail', () => {
        expect(doe.getIsTail()).toEqual(false);
      });
      it('the "doe" node should still have the correct value', () => {
        expect(doe.getValue()).toEqual("doe");
      });
      it('the "doe" node should reference the "me" node', () => {
        expect(doe.getNext()).toBe(me);
      });
    });
    it("should be the the tail", () => {
      expect(doe.getIsTail()).toEqual(true);
    });
    it('should have a value of "doe"', () => {
      expect(doe.getValue()).toEqual("doe");
    });
  });

  // collections/Queue.js
  var Queue = class {
    #array;
    constructor() {
      this.#array = [];
    }
    /**
     * Adds an item to the end of the queue.
     *
     * @public
     * @param {*} item - The item to add.
     * @returns {*} The item added to the queue.
     */
    enqueue(item) {
      this.#array.push(item);
      return item;
    }
    /**
     * Removes the next item from the queue and returns it. Throws if the queue is empty.
     *
     * @public
     * @returns {*} The item removed from the queue.
     * @throws {Error} If the queue is empty.
     */
    dequeue() {
      if (this.empty()) {
        throw new Error("Queue is empty");
      }
      return this.#array.shift();
    }
    /**
     * Returns the next item in the queue without removing it.
     *
     * @public
     * @returns {*} The next item in the queue.
     * @throws {Error} If the queue is empty.
     */
    peek() {
      if (this.empty()) {
        throw new Error("Queue is empty");
      }
      return this.#array[0];
    }
    /**
     * Indicates whether the queue is empty.
     *
     * @public
     * @returns {boolean} True if the queue is empty; otherwise, false.
     */
    empty() {
      return this.#array.length === 0;
    }
    /**
     * Runs an action on each item in the queue.
     *
     * @public
     * @param {Function} action - The action to run.
     */
    scan(action) {
      argumentIsRequired(action, "action", Function);
      this.#array.forEach((item) => action(item));
    }
    /**
     * Returns a copy of the queue's items without affecting its internal state.
     *
     * @public
     * @returns {Array<*>} A copy of the queue's items.
     */
    toArray() {
      return this.#array.slice(0);
    }
    /**
     * Returns the queue's internal array for use by derived classes.
     *
     * @protected
     * @returns {Array<*>} The internal array.
     */
    _getArray() {
      return this.#array;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Queue]";
    }
  };

  // test/specs/collections/QueueSpec.js
  describe("When a Queue is constructed", () => {
    "use strict";
    let queue;
    beforeEach(() => {
      queue = new Queue();
    });
    it("should be empty", () => {
      expect(queue.empty()).toEqual(true);
    });
    it('should throw if "peek" is called', () => {
      expect(() => {
        queue.peek();
      }).toThrow(new Error("Queue is empty"));
    });
    it('should throw if "dequeue" is called', () => {
      expect(() => {
        queue.peek();
      }).toThrow(new Error("Queue is empty"));
    });
    describe("and an object is enqueued", () => {
      let first3 = 1;
      beforeEach(() => {
        queue.enqueue(first3);
      });
      it("should not be empty", () => {
        expect(queue.empty()).toEqual(false);
      });
      describe("and we peek at the top of the queue", () => {
        let peek;
        beforeEach(() => {
          peek = queue.peek();
        });
        it("the peek result should be the item enqueued", () => {
          expect(peek).toBe(first3);
        });
        it("should not be empty", () => {
          expect(queue.empty()).toEqual(false);
        });
      });
      describe("and an object is dequeued", () => {
        let dequeue;
        beforeEach(() => {
          dequeue = queue.dequeue();
        });
        it("the dequeue result should be the item enqueued", () => {
          expect(dequeue).toBe(first3);
        });
        it("should be empty", () => {
          expect(queue.empty()).toEqual(true);
        });
      });
      describe("and a second object is enqueued", () => {
        let second = { name: "second" };
        beforeEach(() => {
          queue.enqueue(second);
        });
        it("should not be empty", () => {
          expect(queue.empty()).toEqual(false);
        });
        describe("and we peek at the top of the queue", () => {
          let peek;
          beforeEach(() => {
            peek = queue.peek();
          });
          it("the peek result should be the first item enqueued", () => {
            expect(peek).toBe(first3);
          });
          it("should not be empty", () => {
            expect(queue.empty()).toEqual(false);
          });
        });
        describe("and an object is dequeued", () => {
          let dequeue;
          beforeEach(() => {
            dequeue = queue.dequeue();
          });
          it("the dequeue result should be the first item enqueued", () => {
            expect(dequeue).toBe(first3);
          });
          it("should not be empty", () => {
            expect(queue.empty()).toEqual(false);
          });
        });
        describe("and the queue is exported to an array", () => {
          let a;
          beforeEach(() => {
            a = queue.toArray();
          });
          it("should return an array with two items", () => {
            expect(a.length).toEqual(2);
          });
          it("the first item should be the first item enqueued", () => {
            expect(a[0]).toBe(first3);
          });
          it("the second item should be the second item enqueued", () => {
            expect(a[1]).toBe(second);
          });
          it("should not be empty", () => {
            expect(queue.empty()).toEqual(false);
          });
        });
        describe("and the queue is scanned", () => {
          let spy;
          beforeEach(() => {
            spy = jasmine.createSpy();
            queue.scan(spy);
          });
          it("should call the delegate one time for each item in the queue", () => {
            expect(spy.calls.count()).toEqual(2);
          });
          it("should pass the first item to be pushed to the delegate first", () => {
            expect(spy.calls.argsFor(0)[0]).toBe(first3);
          });
          it("should pass the second item to be pushed to the delegate second", () => {
            expect(spy.calls.argsFor(1)[0]).toBe(second);
          });
          it("should not be empty", () => {
            expect(queue.empty()).toEqual(false);
          });
        });
      });
    });
  });

  // collections/Stack.js
  var Stack = class {
    #array;
    constructor() {
      this.#array = [];
    }
    /**
     * Adds an item to the stack.
     *
     * @public
     * @param {object} item
     * @returns {object} - The item added to the stack.
     */
    push(item) {
      this.#array.push(item);
      return item;
    }
    /**
     * Removes and returns an item from the stack. Throws if the stack is empty.
     *
     * @public
     * @returns {object} - The removed from the stack.
     */
    pop() {
      if (this.empty()) {
        throw new Error("Stack is empty");
      }
      return this.#array.pop();
    }
    /**
     * Returns the next item in the stack (without removing it). Throws if the stack is empty.
     *
     * @public
     * @returns {object} - The item added to the stack.
     */
    peek() {
      if (this.empty()) {
        throw new Error("Stack is empty");
      }
      return this.#array[this.#array.length - 1];
    }
    /**
     * Returns true if the stack is empty; otherwise false.
     *
     * @public
     * @returns {boolean}
     */
    empty() {
      return this.#array.length === 0;
    }
    /**
     * Runs an action on each item in the stack.
     *
     * @public
     * @param {Function} action - The action to run.
     */
    scan(action) {
      argumentIsRequired(action, "action", Function);
      for (let i = this.#array.length - 1; i >= 0; i--) {
        action(this.#array[i]);
      }
    }
    /**
     * Outputs an array of the stack's items; without affecting the
     * stack's internal state;
     *
     * @public
     * @returns {Array}
     */
    toArray() {
      return this.#array.slice(0).reverse();
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Stack]";
    }
  };

  // test/specs/collections/StackSpec.js
  describe("When a Stack is constructed", () => {
    "use strict";
    let stack;
    beforeEach(() => {
      stack = new Stack();
    });
    it("should be empty", () => {
      expect(stack.empty()).toEqual(true);
    });
    it('should throw if "peek" is called', () => {
      expect(() => {
        stack.peek();
      }).toThrow(new Error("Stack is empty"));
    });
    it('should throw if "pop" is called', () => {
      expect(() => {
        stack.peek();
      }).toThrow(new Error("Stack is empty"));
    });
    describe("and an object is pushed onto the stack", () => {
      let first3 = 1;
      beforeEach(() => {
        stack.push(first3);
      });
      it("should not be empty", () => {
        expect(stack.empty()).toEqual(false);
      });
      describe("and we peek at the top of the stack", () => {
        let peek;
        beforeEach(() => {
          peek = stack.peek();
        });
        it("the peek result should be the item pushed onto the stack", () => {
          expect(peek).toBe(first3);
        });
        it("should not be empty", () => {
          expect(stack.empty()).toEqual(false);
        });
      });
      describe("and an object is popped from the stack", () => {
        let pop;
        beforeEach(() => {
          pop = stack.pop();
        });
        it("the pop result should be the item pushed onto the stack", () => {
          expect(pop).toBe(first3);
        });
        it("should be empty", () => {
          expect(stack.empty()).toEqual(true);
        });
      });
      describe("and a second object is pushed onto the stack", () => {
        let second = { name: "second" };
        beforeEach(() => {
          stack.push(second);
        });
        it("should not be empty", () => {
          expect(stack.empty()).toEqual(false);
        });
        describe("and we peek at the top of the stack", () => {
          let peek;
          beforeEach(() => {
            peek = stack.peek();
          });
          it("the peek result should be the second item pushed onto the stack", () => {
            expect(peek).toBe(second);
          });
          it("should not be empty", () => {
            expect(stack.empty()).toEqual(false);
          });
        });
        describe("and an object is popped from the stack", () => {
          let pop;
          beforeEach(() => {
            pop = stack.pop();
          });
          it("the pop result should be the second item pushed onto the stack", () => {
            expect(pop).toBe(second);
          });
          it("should not be empty", () => {
            expect(stack.empty()).toEqual(false);
          });
        });
        describe("and the queue is exported to an array", () => {
          let a;
          beforeEach(() => {
            a = stack.toArray();
          });
          it("should return an array with two items", () => {
            expect(a.length).toEqual(2);
          });
          it("the first item should be the second item pushed", () => {
            expect(a[0]).toBe(second);
          });
          it("the second item should be the first item pushed", () => {
            expect(a[1]).toBe(first3);
          });
          it("should not be empty", () => {
            expect(stack.empty()).toEqual(false);
          });
        });
        describe("and the stack is scanned", () => {
          let spy;
          beforeEach(() => {
            spy = jasmine.createSpy();
            stack.scan(spy);
          });
          it("should call the delegate one time for each item in the queue", () => {
            expect(spy.calls.count()).toEqual(2);
          });
          it("should pass the second item to be pushed to the delegate first", () => {
            expect(spy.calls.argsFor(0)[0]).toBe(second);
          });
          it("should pass the first item to be pushed to the delegate second", () => {
            expect(spy.calls.argsFor(1)[0]).toBe(first3);
          });
        });
      });
    });
  });

  // test/specs/collections/TreeSpec.js
  describe("When a Tree is constructed", () => {
    "use strict";
    let root;
    let one;
    beforeEach(() => {
      root = new Tree(one = {});
    });
    it("should be the root node", () => {
      expect(root.getIsRoot()).toEqual(true);
    });
    it("should not be an inner node", () => {
      expect(root.getIsInner()).toEqual(false);
    });
    it("should be a leaf node", () => {
      expect(root.getIsLeaf()).toEqual(true);
    });
    it("should have to correct node value", () => {
      expect(root.getValue()).toBe(one);
    });
    it("the (root) descendant count should be one", () => {
      expect(root.count()).toEqual(1);
    });
    describe("and the root node is retrieved from root node", () => {
      it("should be itself", () => {
        expect(root.getRoot()).toBe(root);
      });
    });
    describe("and a child is added", () => {
      let child;
      let two;
      beforeEach(() => {
        child = root.addChild(two = {});
      });
      it("should not be a leaf node", () => {
        expect(child.getIsInner()).toEqual(false);
      });
      it("should be a leaf node", () => {
        expect(child.getIsLeaf()).toEqual(true);
      });
      it("should have to correct node value", () => {
        expect(child.getValue()).toBe(two);
      });
      it("should should be the child of the root node", () => {
        expect(child.getParent()).toBe(root);
      });
      it("should not have a parent which is considered a leaf node", () => {
        expect(root.getIsLeaf()).toEqual(false);
      });
      it("should not a parent which is considered an inner node", () => {
        expect(root.getIsInner()).toEqual(true);
      });
      it("should be in the parents collection of children", () => {
        expect(root.getChildren().find((c) => c === child)).toBe(child);
      });
      it("the (root) descendant count should be two", () => {
        expect(root.count()).toEqual(2);
      });
      it("the (child) descendant count should be one", () => {
        expect(child.count()).toEqual(1);
      });
      describe("and a second child is added", () => {
        let secondChild;
        let three;
        beforeEach(() => {
          secondChild = root.addChild(three = {});
        });
        it("the (root) descendant count should be three", () => {
          expect(root.count()).toEqual(3);
        });
        it("the (child) descendant count should be one", () => {
          expect(secondChild.count()).toEqual(1);
        });
        describe("and the second child is severed", () => {
          beforeEach(() => {
            secondChild.sever();
          });
          it("the severed tree should no longer have a parent", () => {
            expect(secondChild.getIsRoot()).toEqual(true);
          });
          it("the original tree should only contain one child", () => {
            expect(root.getChildren().length).toEqual(1);
          });
          it("the original tree should not be the severed node", () => {
            expect(root.getChildren()[0]).not.toBe(secondChild);
          });
        });
        describe("and the tree is converted to a JavaScript object", () => {
          let object2;
          beforeEach(() => {
            object2 = root.toJSObj();
          });
          it("should have the correct root value", () => {
            expect(object2.value).toBe(one);
          });
          it("should have two children", () => {
            expect(object2.children.length).toEqual(2);
          });
          it("should have the correct value for the first child", () => {
            expect(object2.children[0].value).toBe(two);
          });
          it("should have the correct value for the second child", () => {
            expect(object2.children[1].value).toBe(three);
          });
        });
      });
      describe("and the root node is retrieved from the child", () => {
        it("should be the root node", () => {
          expect(child.getRoot()).toBe(root);
        });
      });
    });
  });
  describe("When a binary tree, having three levels, is constructed", () => {
    let root;
    let rootLeft;
    let rootRight;
    let rootLeftLeft;
    let rootLeftRight;
    let rootRightLeft;
    let rootRightRight;
    beforeEach(() => {
      root = new Tree(1);
      rootLeft = root.addChild(2);
      rootRight = root.addChild(3);
      rootLeftLeft = rootLeft.addChild(4);
      rootLeftRight = rootLeft.addChild(5);
      rootRightLeft = rootRight.addChild(6);
      rootRightRight = rootRight.addChild(7);
    });
    describe("and searching for a value greater than zero", () => {
      it('using default options, the "rootLeftLeft"" node should be identified', () => {
        expect(root.search((v) => v > 0)).toBe(rootLeftLeft);
      });
      it('using `parentFirst=true` and `includeCurrent=true`, the "root" node should be identified', () => {
        expect(root.search((v) => v > 0, true, true)).toBe(root);
      });
      it('using `parentFirst=true` and `includeCurrent=false`, the "rootLeft" node should be identified', () => {
        expect(root.search((v) => v > 0, true, false)).toBe(rootLeft);
      });
      it('using `parentFirst=false` and `includeCurrent=true`, the "rootLeftLeft" node should be identified', () => {
        expect(root.search((v) => v > 0, false, true)).toBe(rootLeftLeft);
      });
      it('using `parentFirst=false` and `includeCurrent=false`, the "rootLeftLeft" node should be identified', () => {
        expect(root.search((v) => v > 0, false, false)).toBe(rootLeftLeft);
      });
    });
  });
  describe("When Tree traversal helpers are used directly", () => {
    "use strict";
    let root;
    let left;
    let right;
    let leftLeft;
    beforeEach(() => {
      root = new Tree("root");
      left = root.addChild("left");
      right = root.addChild("right");
      leftLeft = left.addChild("left-left");
    });
    it("should find a direct child", () => {
      expect(root.findChild((value) => value === "right")).toBe(right);
    });
    it("should return null when child is not found", () => {
      expect(root.findChild((value) => value === "missing")).toBeNull();
    });
    it("should walk the tree", () => {
      const visited = [];
      root.walk((value) => visited.push(value), true, true);
      expect(visited).toEqual(["root", "left", "left-left", "right"]);
    });
    it("should climb parent nodes", () => {
      const visited = [];
      leftLeft.climb((value) => visited.push(value), true);
      expect(visited).toEqual(["left-left", "left", "root"]);
    });
    it("should find parent nodes", () => {
      expect(leftLeft.findParent((value) => value === "left", true)).toBe(left);
    });
    it("should return null when parent is not found", () => {
      expect(leftLeft.findParent((value) => value === "missing", true)).toBeNull();
    });
    it("should remove a child directly", () => {
      root.removeChild(right);
      expect(root.getChildren()).toEqual([left]);
    });
    it("should clear parent reference when child is removed", () => {
      root.removeChild(right);
      expect(right.getParent()).toBeNull();
    });
  });
  describe("When Tree is extended", () => {
    "use strict";
    class SpecializedTree extends Tree {
      getProtectedState() {
        return {
          value: this._value,
          parent: this._parent,
          children: this._children
        };
      }
    }
    it("should expose protected state to subclasses", () => {
      const parent = new SpecializedTree("parent");
      const child = new SpecializedTree("child", parent);
      const state = child.getProtectedState();
      expect(state).toEqual({
        value: "child",
        parent,
        children: []
      });
    });
  });

  // collections/graph/Edge.js
  var Edge = class {
    #from;
    #to;
    #data;
    /**
     * @param {Vertex} from
     * @param {Vertex} to
     * @param {*=} data
     */
    constructor(from, to, data) {
      this.#from = from;
      this.#to = to;
      this.#data = data || null;
    }
    /**
     * The starting vertex.
     *
     * @public
     * @returns {Vertex}
     */
    get from() {
      return this.#from;
    }
    /**
     * The end vertex.
     *
     * @public
     * @returns {Vertex}
     */
    get to() {
      return this.#to;
    }
    /**
     * Ad hoc data associated with the edge (in other words the "value"
     * of the edge).
     *
     * @public
     * @returns {*|null}
     */
    get data() {
      return this.#data;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[Edge (from=${this.from.data.toString()}, to=${this.to.data.toString()}})]`;
    }
  };

  // collections/graph/Vertex.js
  var Vertex = class _Vertex {
    #data;
    #edges;
    /**
     * @param {*=} data
     */
    constructor(data) {
      this.#data = data || null;
      this.#edges = [];
    }
    /**
     * Ad hoc data associated with the vertex (in other words the "value"
     * of the vertex).
     *
     * @public
     * @returns {*}
     */
    get data() {
      return this.#data;
    }
    /**
     * Returns all edges from this vertex to other vertices.
     *
     * @public
     * @returns {Edge[]}
     */
    getEdges() {
      return this.#edges;
    }
    /**
     * Adds an edge.
     *
     * @public
     * @param {Vertex} other
     * @param {*=} data
     * @returns {Edge}
     */
    addEdge(other, data) {
      argumentIsRequired(other, "other", _Vertex, "Vertex");
      if (other === this) {
        throw new Error("Graph vertex cannot connect to itself.");
      }
      if (this.hasEdge(other)) {
        throw new Error(`Graph already has edge between [ ${this.data.toString()} ] and [ ${other.data.toString()} ]`);
      }
      const edge = new Edge(this, other, data);
      this.#edges.push(edge);
      return edge;
    }
    /**
     * Locates an edge.
     *
     * @public
     * @param {Vertex} other
     * @returns {Edge|null}
     */
    getEdge(other) {
      return this.#edges.find((e) => e.to === other) || null;
    }
    /**
     * Indicates if this vertex has an edge.
     *
     * @public
     * @param {Vertex} other
     * @returns {boolean}
     */
    hasEdge(other) {
      return this.getEdge(other) !== null;
    }
    /**
     * Finds all possible paths from this vertex (node) to another vertex (node).
     *
     * @public
     * @param {Vertex} other
     * @param {Edge[]=} walk
     * @returns {Edge[][]}
     */
    getPaths(other, walk) {
      if (walk && this === other) {
        return [walk];
      }
      if (walk && walk.some((edge) => edge.from === this)) {
        return [];
      }
      let paths = [];
      this.#edges.forEach((edge) => {
        let current;
        if (walk) {
          current = walk.slice(0);
        } else {
          current = [];
        }
        current.push(edge);
        paths = paths.concat(edge.to.getPaths(other, current));
      });
      return paths;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[Vertex (data=${this.data.toString()})]`;
    }
  };

  // test/specs/collections/graph/EdgeSpec.js
  describe("When an Edge is constructed", () => {
    "use strict";
    let from;
    let to;
    let data;
    let edge;
    beforeEach(() => {
      from = new Vertex("from");
      to = new Vertex("to");
      data = { weight: 1 };
      edge = new Edge(from, to, data);
    });
    it("should expose the from vertex", () => {
      expect(edge.from).toBe(from);
    });
    it("should expose the to vertex", () => {
      expect(edge.to).toBe(to);
    });
    it("should expose the edge data", () => {
      expect(edge.data).toBe(data);
    });
    it("should default missing data to null", () => {
      expect(new Edge(from, to).data).toBeNull();
    });
  });

  // test/specs/collections/graph/VertexSpec.js
  describe("When graph vertex (a) is initialized", () => {
    "use strict";
    let vertexA;
    let vertexDataA;
    beforeEach(() => {
      vertexA = new Vertex(vertexDataA = "a");
    });
    it("the data for vertex (a) matches the data passed at construction", () => {
      expect(vertexA.data).toEqual(vertexDataA);
    });
    it("the vertex (a) has no connected edges", () => {
      expect(vertexA.getEdges().length).toEqual(0);
    });
    it("the vertex (a) should not have an edge to itself", () => {
      expect(vertexA.hasEdge(vertexA)).toEqual(false);
    });
    describe("and vertex (b) is attached", () => {
      let vertexB;
      let vertexDataB;
      let edgeAB;
      let edgeDataAB;
      beforeEach(() => {
        edgeAB = vertexA.addEdge(vertexB = new Vertex(vertexDataB = "b"), edgeDataAB = "a-to-b");
      });
      it("the data for edge (between a and b) matches the data passed at construction", () => {
        expect(edgeAB.data).toEqual(edgeDataAB);
      });
      it("the new edge starts at vertex (a)", () => {
        expect(edgeAB.from).toEqual(vertexA);
      });
      it("the new edge ends at vertex (a)", () => {
        expect(edgeAB.to).toEqual(vertexB);
      });
      it("the vertex (a) has one edge", () => {
        expect(vertexA.getEdges().length).toEqual(1);
      });
      it("the vertex (a) has an edge to vertex (b)", () => {
        expect(vertexA.getEdge(vertexB)).toEqual(edgeAB);
      });
      it("the vertex (a) should have an edge to vertex (b)", () => {
        expect(vertexA.hasEdge(vertexB)).toEqual(true);
      });
      it("the vertex (b) has no edges", () => {
        expect(vertexB.getEdges().length).toEqual(0);
      });
      describe("and the paths between vertex (a) and vertex (b) are calculated", () => {
        let paths;
        beforeEach(() => {
          paths = vertexA.getPaths(vertexB);
        });
        it("only one path should exist", () => {
          expect(paths.length).toEqual(1);
        });
        it("the path should have one edge", () => {
          expect(paths[0].length).toEqual(1);
        });
        it("the path should start at vertex (a)", () => {
          expect(paths[0][0].from).toEqual(vertexA);
        });
        it("the path should end at vertex (B)", () => {
          expect(paths[0][0].to).toEqual(vertexB);
        });
      });
      describe("and vertex (b) is attached (again)", () => {
        it("an error should be thrown", () => {
          expect(() => {
            vertexA.addEdge(vertexB);
          }).toThrow();
        });
      });
      describe("and a path from vertex (a) to vertex (b) is added through a new vertex (x)", () => {
        let vertexX;
        beforeEach(() => {
          vertexX = new Vertex();
          vertexA.addEdge(vertexX);
          vertexX.addEdge(vertexB);
        });
        describe("and the paths between vertex (a) and vertex (b) are calculated", () => {
          let paths;
          beforeEach(() => {
            paths = vertexA.getPaths(vertexB);
          });
          it("only two paths should exist", () => {
            expect(paths.length).toEqual(2);
          });
          it("a direct path from vertex (a) to vertex (b) should exist", () => {
            expect(paths.some((path) => {
              return path.length === 1 && path[0].from === vertexA && path[0].to === vertexB;
            })).toBeTrue();
          });
          it("an indirect path from vertex (a) to vertex (b) through vertex (x) should exist", () => {
            expect(paths.some((path) => {
              return path.length === 2 && path[0].from === vertexA && path[0].to === vertexX && path[1].from === vertexX && path[1].to === vertexB;
            })).toBeTrue();
          });
        });
      });
    });
    describe("and vertex (a) is attached to itself", () => {
      it("an error should be thrown", () => {
        expect(() => {
          vertexA.addEdge(vertexA);
        }).toThrow();
      });
    });
  });

  // test/specs/collections/sorting/ComparatorBuilderSpec.js
  describe("When a ComparatorBuilder is composed with two comparators", () => {
    "use strict";
    let comparatorBuilder;
    let comparatorOne;
    let comparatorTwo;
    let first3 = { x: 0, y: 0, toString: () => {
      return "[first]";
    } };
    let second = { x: 1, y: 0, toString: () => {
      return "[second]";
    } };
    let third = { x: 1, y: 1, toString: () => {
      return "[third]";
    } };
    beforeEach(() => {
      comparatorOne = jasmine.createSpy("comparatorOne").and.callFake((a, b) => {
        return a.x - b.x;
      });
      comparatorTwo = jasmine.createSpy("comparatorTwo").and.callFake((a, b) => {
        return a.y - b.y;
      });
      comparatorBuilder = ComparatorBuilder.startWith(comparatorOne).thenBy(comparatorTwo);
    });
    describe("and the ComparatorBuilder sorts an array (which requires both comparators)", () => {
      let arrayToSort;
      beforeEach(() => {
        arrayToSort = [third, first3, second];
        arrayToSort.sort(comparatorBuilder.toComparator());
      });
      it("the first comparator should be invoked", () => {
        expect(comparatorOne).toHaveBeenCalled();
      });
      it("the second comparator should be invoked", () => {
        expect(comparatorTwo).toHaveBeenCalled();
      });
      it("the sorted array should be in the correct order", () => {
        expect(arrayToSort).toEqual([first3, second, third]);
      });
    });
    describe("and the ComparatorBuilder is inverted", () => {
      beforeEach(() => {
        comparatorBuilder = comparatorBuilder.invert();
      });
      describe("and the ComparatorBuilder sorts an array (which requires both comparators)", () => {
        let arrayToSort;
        beforeEach(() => {
          arrayToSort = [third, first3, second];
          arrayToSort.sort(comparatorBuilder.toComparator());
        });
        it("the first comparator should be invoked", () => {
          expect(comparatorOne).toHaveBeenCalled();
        });
        it("the second comparator should be invoked", () => {
          expect(comparatorTwo).toHaveBeenCalled();
        });
        it("the sorted array should be in the correct order", () => {
          expect(arrayToSort).toEqual([third, second, first3]);
        });
      });
    });
  });

  // test/specs/collections/sorting/comparatorsSpec.js
  describe('When using the "compareDates" comparator', () => {
    "use strict";
    let first3 = new Date(2015, 12, 1);
    let second = new Date(2015, 12, 31);
    let third = new Date(2016, 1, 31);
    describe("to rank Date instances", () => {
      it("comparing 2019-08-27 with 2019-07-31 should return a positive value", () => {
        expect(compareDates(new Date(2019, 7, 27), new Date(2019, 6, 31)) > 0).toEqual(true);
      });
      it("comparing 2019-08-27 with 2019-07-31 should return a negative value", () => {
        expect(compareDates(new Date(2019, 6, 31), new Date(2019, 7, 27)) < 0).toEqual(true);
      });
      it("comparing 2019-08-27 with 2019-08-27 should return a zero value", () => {
        expect(compareDates(new Date(2019, 7, 27), new Date(2019, 7, 27))).toEqual(0);
      });
    });
    describe("to sort an array of Date instances", () => {
      let arrayToSort;
      beforeEach(() => {
        arrayToSort = [second, first3, third];
        arrayToSort.sort(compareDates);
      });
      it("the array should be in the correct order", () => {
        expect(arrayToSort).toEqual([first3, second, third]);
      });
    });
    describe("to sort an array that contains something other than Date instances", () => {
      it("an error should be thrown", () => {
        expect(() => {
          let arrayToSort = [second, first3, third, "1-1-2017"];
          arrayToSort.sort(compareDates);
        }).toThrow();
      });
    });
  });
  describe('When using the "compareNumbers" comparator', () => {
    "use strict";
    let first3 = -1;
    let second = Math.E;
    let third = Math.PI;
    describe("to rank numbers", () => {
      it("comparing 22 with 11 should return a positive value", () => {
        expect(compareNumbers(22, 11) > 0).toEqual(true);
      });
      it("comparing 11 with 22 should return a negative value", () => {
        expect(compareNumbers(11, 22) < 0).toEqual(true);
      });
      it("comparing 11 with 11 should return a zero value", () => {
        expect(compareNumbers(11, 11)).toEqual(0);
      });
    });
    describe("to sort an array of numbers", () => {
      let arrayToSort;
      beforeEach(() => {
        arrayToSort = [second, first3, third];
        arrayToSort.sort(compareNumbers);
      });
      it("the array should be in the correct order", () => {
        expect(arrayToSort).toEqual([first3, second, third]);
      });
    });
    describe("to sort an array that contains something other than numbers", () => {
      it("an error should be thrown", () => {
        expect(() => {
          let arrayToSort = [second, first3, third, null];
          arrayToSort.sort(compareNumbers);
        }).toThrow();
      });
    });
  });
  describe('When using the "compareStrings" comparator', () => {
    "use strict";
    let first3 = "";
    let second = "Bye now";
    let third = "Hi there";
    describe("to rank strings", () => {
      it('comparing "abd" with "abc" should return a positive value', () => {
        expect(compareStrings("abd", "abc") > 0).toEqual(true);
      });
      it('comparing "abc" with "abd" should return a negative value', () => {
        expect(compareStrings("abc", "abd") < 0).toEqual(true);
      });
      it('comparing "abc" with "abc" should return a zero value', () => {
        expect(compareStrings("abc", "abc")).toEqual(0);
      });
    });
    describe("to sort an array of strings", () => {
      let arrayToSort;
      beforeEach(() => {
        arrayToSort = [third, first3, second];
        arrayToSort.sort(compareStrings);
      });
      it("the array should be in the correct order", () => {
        expect(arrayToSort).toEqual([first3, second, third]);
      });
    });
    describe("to sort an array that contains something other than strings", () => {
      it("an error should be thrown", () => {
        expect(() => {
          let arrayToSort = [second, first3, third, 7];
          arrayToSort.sort(compareStrings);
        }).toThrow();
      });
    });
  });
  describe('When using the "compareBoolean" comparator', () => {
    "use strict";
    let a = true;
    let b = false;
    let c = true;
    describe("to rank boolean values", () => {
      it('comparing "true" with "false" should return a positive value', () => {
        expect(compareBooleans(true, false) > 0).toEqual(true);
      });
      it('comparing "false" with "true" should return a negative value', () => {
        expect(compareBooleans(false, true) < 0).toEqual(true);
      });
      it('comparing "true" with "true" should return a zero value', () => {
        expect(compareBooleans(true, true)).toEqual(0);
      });
    });
    describe("to sort an array of booleans", () => {
      let arrayToSort;
      beforeEach(() => {
        arrayToSort = [a, b, c];
        arrayToSort.sort(compareBooleans);
      });
      it("the array should be in the correct order", () => {
        expect(arrayToSort).toEqual([b, a, c]);
      });
    });
  });
  describe('When using the "compareNull" comparator', () => {
    "use strict";
    describe("to rank values which are not null", () => {
      it('comparing "1" with "2" should return a zero value', () => {
        expect(compareNull("1", "2")).toEqual(0);
      });
      it('comparing "false" with "true" should return a zero value', () => {
        expect(compareNull(false, true)).toEqual(0);
      });
      it("comparing two null values should return a zero value", () => {
        expect(compareNull(null, null)).toEqual(0);
      });
      it('comparing a null value with "1" should return a negative value', () => {
        expect(compareNull(null, 1) < 0).toEqual(true);
      });
      it('comparing "1"" with a null value should return a positive value', () => {
        expect(compareNull(1, null) > 0).toEqual(true);
      });
    });
    describe("to sort an array", () => {
      let arrayToSort;
      let a = 1;
      let b = null;
      let c = "2";
      beforeEach(() => {
        arrayToSort = [a, b, c];
        arrayToSort.sort(compareNull);
      });
      it("the array should be in the correct order", () => {
        expect(arrayToSort).toEqual([b, a, c]);
      });
    });
  });
  describe('When using the "empty" comparator', () => {
    "use strict";
    it("comparing any two values should return a zero value", () => {
      expect(empty("a", 1)).toEqual(0);
    });
  });

  // collections/specialized/CompoundMap.js
  var CompoundMap = class {
    #depth;
    #map;
    /**
     * @param {number} depth - The number of keys.
     */
    constructor(depth) {
      argumentIsRequired(depth, "depth", Number);
      this.#depth = depth;
      this.#map = {};
    }
    /**
     * Returns true if the map has a value (or a grouping of values) at the
     * given key.
     *
     * @public
     * @param {...string} keys
     * @returns {boolean}
     */
    has(...keys2) {
      validateKeys(keys2, this.#depth, false);
      let target = this.#map;
      return keys2.every((k) => {
        const returnVal = Object.prototype.hasOwnProperty.call(target, k);
        if (returnVal) {
          target = target[k];
        }
        return returnVal;
      });
    }
    /**
     * Puts a value into the map, overwriting any preexisting value.
     *
     * @public
     * @param {*} value
     * @param {...string} keys
     */
    put(value, ...keys2) {
      validateKeys(keys2, this.#depth, true);
      let target = this.#map;
      let final = keys2.length - 1;
      keys2.forEach((k, i) => {
        if (i === final) {
          target[k] = value;
        } else {
          if (!Object.prototype.hasOwnProperty.call(target, k)) {
            target[k] = {};
          }
          target = target[k];
        }
      });
    }
    /**
     * Gets a value from the map, returning null if the value does not exist.
     *
     * @public
     * @param {...string} keys
     * @returns {*}
     */
    get(...keys2) {
      validateKeys(keys2, this.#depth, true);
      return keys2.reduce((target, k) => {
        let next;
        if (object(target) && Object.prototype.hasOwnProperty.call(target, k)) {
          next = target[k];
        } else {
          next = null;
        }
        return next;
      }, this.#map);
    }
    /**
     * Deletes a value (or a group of values) from the tree.
     *
     * @public
     * @param {...string} keys
     * @returns {boolean}
     */
    remove(...keys2) {
      validateKeys(keys2, this.#depth, false);
      let returnVal = this.has(...keys2);
      if (returnVal) {
        keys2.reduce((target, k, i) => {
          let next;
          if (keys2.length === i + 1) {
            delete target[k];
          } else {
            next = target[k];
          }
          return next;
        }, this.#map);
      }
      return returnVal;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[CompoundMap]";
    }
  };
  function validateKeys(keys2, depth, exact) {
    argumentIsValid(keys2, "keys", (k) => exact && k.length === depth || !exact && !(k.length > depth), "incorrect number of keys");
  }

  // test/specs/collections/specialized/CompoundMapSpec.js
  describe("When an CompoundMap is constructed", () => {
    "use strict";
    describe("with a depth of one", () => {
      let map2;
      beforeEach(() => {
        map2 = new CompoundMap(1);
      });
      describe("and an item with too many keys is put into the map", () => {
        let value;
        let key;
        beforeEach(() => {
          map2.put(value = "bryan", key = "b");
        });
        it("should have the item", () => {
          expect(map2.has(key)).toEqual(true);
        });
        it("should return the value when asked", () => {
          expect(map2.get(key)).toEqual(value);
        });
      });
      describe("and an item with one key is put into the map", () => {
        it("should throw an error", () => {
          expect(() => {
            map2.put("bryan", "b", "r");
          }).toThrow();
        });
      });
    });
    describe("with a depth of two", () => {
      let map2;
      beforeEach(() => {
        map2 = new CompoundMap(2);
      });
      describe("and an item with two keys is put into the map", () => {
        let value;
        let keyOne;
        let keyTwo;
        beforeEach(() => {
          map2.put(value = "bryan", keyOne = "b", keyTwo = "r");
        });
        it("should have the group", () => {
          expect(map2.has(keyOne)).toEqual(true);
        });
        it("should have the item", () => {
          expect(map2.has(keyOne, keyTwo)).toEqual(true);
        });
        it("should return the value when asked", () => {
          expect(map2.get(keyOne, keyTwo)).toEqual(value);
        });
        describe("and another item, with the same keys, is put into the map", () => {
          let replaced;
          beforeEach(() => {
            map2.put(replaced = "brock", keyOne, keyTwo);
          });
          it("should have the item", () => {
            expect(map2.has(keyOne, keyTwo)).toEqual(true);
          });
          it("should return the value when asked", () => {
            expect(map2.get(keyOne, keyTwo)).toEqual(replaced);
          });
        });
        describe("and another item, with the same first key, is put into the map", () => {
          let valueB;
          let keyOneB;
          let keyTwoB;
          beforeEach(() => {
            map2.put(valueB = "bob", keyOneB = keyOne, keyTwoB = "o");
          });
          it("should have the item", () => {
            expect(map2.has(keyOneB, keyTwoB)).toEqual(true);
          });
          it("should return the value when asked", () => {
            expect(map2.get(keyOneB, keyTwoB)).toEqual(valueB);
          });
          it("should still have the original item", () => {
            expect(map2.has(keyOne, keyTwo)).toEqual(true);
          });
          it("should still return the original value when asked", () => {
            expect(map2.get(keyOne, keyTwo)).toEqual(value);
          });
          describe("and that item is deleted", () => {
            let result;
            beforeEach(() => {
              result = map2.remove(keyOneB, keyTwoB);
            });
            it("should be a successful operation", () => {
              expect(result).toEqual(true);
            });
            it("should not have the item", () => {
              expect(map2.has(keyOneB, keyTwoB)).toEqual(false);
            });
            it("should still have the original item", () => {
              expect(map2.has(keyOne, keyTwo)).toEqual(true);
            });
          });
          describe("and the entire group is deleted", () => {
            let result;
            beforeEach(() => {
              result = map2.remove(keyOneB);
            });
            it("should be a successful operation", () => {
              expect(result).toEqual(true);
            });
            it("should not have the item", () => {
              expect(map2.has(keyOneB, keyTwoB)).toEqual(false);
            });
            it("should not have the original item", () => {
              expect(map2.has(keyOne, keyTwo)).toEqual(false);
            });
          });
          describe("and an attempt to delete a non-existent key is made", () => {
            let result;
            beforeEach(() => {
              result = map2.remove(keyOneB, "xxx");
            });
            it("should be a failed operation", () => {
              expect(result).toEqual(false);
            });
          });
        });
      });
      describe("and an item with one key is put into the map", () => {
        it("should throw an error", () => {
          expect(() => {
            map2.put("bryan", "b");
          }).toThrow();
        });
      });
    });
  });

  // lang/Disposable.js
  var Disposable = class _Disposable {
    #disposed;
    constructor() {
      this.#disposed = false;
    }
    /**
     * Indicates if the dispose action has been executed.
     *
     * @public
     * @returns {boolean}
     */
    get disposed() {
      return this.#disposed;
    }
    /**
     * Invokes end-of-life logic. Once this function has been
     * invoked, further interaction with the object is not
     * recommended.
     *
     * @public
     */
    dispose() {
      if (this.#disposed) {
        return;
      }
      this.#disposed = true;
      this._onDispose();
    }
    /**
     * @protected
     * @abstract
     * @ignore
     */
    _onDispose() {
    }
    /**
     * Returns true if the {@link Disposable#dispose} function has been invoked.
     *
     * @public
     * @deprecated
     * @returns {boolean}
     */
    getIsDisposed() {
      return this.#disposed;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Disposable]";
    }
    /**
     * Creates and returns a {@link Disposable} object with end-of-life logic
     * delegated to a function.
     *
     * @public
     * @static
     * @param {Function} disposeAction
     * @returns {Disposable}
     */
    static fromAction(disposeAction) {
      argumentIsRequired(disposeAction, "disposeAction", Function);
      return new DisposableAction(disposeAction);
    }
    /**
     * Creates and returns a {@link Disposable} object whose end-of-life
     * logic does nothing.
     *
     * @public
     * @static
     * @returns {Disposable}
     */
    static getEmpty() {
      return _Disposable.fromAction(() => {
      });
    }
  };
  var DisposableAction = class extends Disposable {
    #disposeAction;
    /**
        * @param {Function} disposeAction
        */
    constructor(disposeAction) {
      super();
      this.#disposeAction = disposeAction;
    }
    /**
     * @protected
     * @override
     */
    _onDispose() {
      this.#disposeAction();
      this.#disposeAction = null;
    }
    toString() {
      return "[DisposableAction]";
    }
  };

  // collections/specialized/DisposableStack.js
  var DisposableStack = class _DisposableStack extends Disposable {
    #stack;
    constructor() {
      super();
      this.#stack = new Stack();
    }
    /**
     * Adds a new {@link Disposable} instance to the stack.
     *
     * @public
     * @param {Disposable} disposable - The item to add.
     */
    push(disposable) {
      argumentIsRequired(disposable, "disposable", Disposable, "Disposable");
      if (this.disposed) {
        throw new Error("Unable to push item onto DisposableStack because it has been disposed.");
      }
      this.#stack.push(disposable);
    }
    /**
     * @protected
     * @override
     */
    _onDispose() {
      while (!this.#stack.empty()) {
        this.#stack.pop().dispose();
      }
    }
    /**
     * @public
     * @static
     * @param {*} bindings
     * @returns {DisposableStack}
     */
    static fromArray(bindings) {
      argumentIsArray(bindings, "bindings", Disposable, "Disposable");
      const returnRef = new _DisposableStack();
      for (let i = 0; i < bindings.length; i++) {
        returnRef.push(bindings[i]);
      }
      return returnRef;
    }
    /**
     * @public
     * @static
     * @async
     * @param {*} stack
     * @param {*} promise
     * @returns {Promise}
     */
    static async pushPromise(stack, promise) {
      argumentIsRequired(stack, "stack", _DisposableStack, "DisposableStack");
      argumentIsRequired(promise, "promise");
      const b = await promise;
      let bindings;
      if (array(b)) {
        bindings = b;
      } else {
        bindings = [b];
      }
      bindings.forEach((binding) => stack.push(binding));
    }
  };

  // test/specs/collections/specialized/DisposableStackSpec.js
  describe("When an DisposableStack is constructed", () => {
    "use strict";
    let disposeStack;
    beforeEach(() => {
      disposeStack = new DisposableStack();
    });
    it("should be disposable", () => {
      expect(disposeStack instanceof Disposable).toEqual(true);
    });
    describe("and a stack is created from an array of Disposable items", () => {
      let disposableOne;
      let disposableTwo;
      let spyOne;
      let spyTwo;
      let stackFromArray;
      beforeEach(() => {
        disposableOne = Disposable.fromAction(spyOne = jasmine.createSpy("spyOne"));
        disposableTwo = Disposable.fromAction(spyTwo = jasmine.createSpy("spyTwo"));
        stackFromArray = DisposableStack.fromArray([disposableOne, disposableTwo]);
      });
      describe("and the stack is disposed", () => {
        beforeEach(() => {
          stackFromArray.dispose();
        });
        it("the first item should be disposed", () => {
          expect(disposableOne.getIsDisposed()).toEqual(true);
        });
        it("the second item should be disposed", () => {
          expect(disposableTwo.getIsDisposed()).toEqual(true);
        });
        it("the dispose logic should have been triggered", () => {
          expect({
            one: spyOne.calls.count(),
            two: spyTwo.calls.count()
          }).toEqual({
            one: 1,
            two: 1
          });
        });
      });
    });
    describe("and a Disposable item is added to the stack", () => {
      let disposableOne;
      let spyOne;
      let disposeOrder;
      beforeEach(() => {
        disposeStack.push(disposableOne = Disposable.fromAction(spyOne = jasmine.createSpy("spyOne").and.callFake(() => {
          disposeOrder.push(disposableOne);
        })));
      });
      describe("and the stack is disposed", () => {
        beforeEach(() => {
          disposeOrder = [];
          disposeStack.dispose();
        });
        it("the item should be disposed", () => {
          expect(disposableOne.getIsDisposed()).toEqual(true);
        });
        it("the dispose logic should have been triggered", () => {
          expect(spyOne).toHaveBeenCalled();
        });
        describe("and another item is added to the stack", () => {
          it("should throw an error", () => {
            expect(() => {
              disposeStack.push(Disposable.fromAction(() => {
              }));
            }).toThrow();
          });
        });
      });
      describe("and the another item is added to the stack", () => {
        let disposableTwo;
        let spyTwo;
        beforeEach(() => {
          disposeStack.push(disposableTwo = Disposable.fromAction(spyTwo = jasmine.createSpy("spyTwo").and.callFake(() => {
            disposeOrder.push(disposableTwo);
          })));
        });
        describe("and the stack is disposed", () => {
          beforeEach(() => {
            disposeOrder = [];
            disposeStack.dispose();
          });
          it("the first item should be disposed", () => {
            expect(disposableOne.getIsDisposed()).toEqual(true);
          });
          it("the dispose logic for the first item have been triggered", () => {
            expect(spyOne).toHaveBeenCalled();
          });
          it("the second item should be disposed", () => {
            expect(disposableTwo.getIsDisposed()).toEqual(true);
          });
          it("the dispose logic for the second item have been triggered", () => {
            expect(spyTwo).toHaveBeenCalled();
          });
          it('the second item should be disposed first (per "stack" rules)', () => {
            expect(disposeOrder[0]).toBe(disposableTwo);
          });
          it('the first item should be disposed next (per "stack" rules)', () => {
            expect(disposeOrder[1]).toBe(disposableOne);
          });
        });
      });
    });
    describe('and the "pushPromise" function is used to add a DisposableItem to the stack', () => {
      let promise;
      let resolveAction;
      beforeEach(() => {
        promise = new Promise((resolveCallback) => {
          resolveAction = resolveCallback;
        });
        DisposableStack.pushPromise(disposeStack, promise);
      });
      describe("and the promise resolves", () => {
        let spyOne;
        let disposableOne;
        beforeEach(async () => {
          resolveAction(disposableOne = Disposable.fromAction(spyOne = jasmine.createSpy("spyOne")));
          await promise;
        });
        describe("and the stack is disposed", () => {
          beforeEach(() => {
            disposeStack.dispose();
          });
          it("the dispose logic should have been triggered", () => {
            expect(spyOne).toHaveBeenCalled();
          });
        });
      });
    });
    describe('and the "pushPromise" function is used to add two DisposableItems to the stack', () => {
      let promise;
      let resolveActionOne;
      let resolveActionTwo;
      beforeEach(() => {
        promise = Promise.all([
          new Promise((resolveCallback) => {
            resolveActionOne = resolveCallback;
          }),
          new Promise((resolveCallback) => {
            resolveActionTwo = resolveCallback;
          })
        ]);
        DisposableStack.pushPromise(disposeStack, promise);
      });
      describe("and the promise resolves", () => {
        let spyOne;
        let disposableOne;
        let spyTwo;
        let disposableTwo;
        let disposeOrder;
        beforeEach(async () => {
          disposeOrder = [];
          resolveActionTwo(disposableTwo = Disposable.fromAction(spyTwo = jasmine.createSpy("spyTwo").and.callFake(() => {
            disposeOrder.push(disposableTwo);
          })));
          setTimeout(
            () => {
              resolveActionOne(disposableOne = Disposable.fromAction(spyOne = jasmine.createSpy("spyOne").and.callFake(() => {
                disposeOrder.push(disposableOne);
              })));
            },
            5
          );
          await promise;
        });
        describe("and the stack is disposed", () => {
          beforeEach(() => {
            disposeStack.dispose();
          });
          it("the first item should be disposed", () => {
            expect(disposableOne.getIsDisposed()).toEqual(true);
          });
          it("the dispose logic for the first item have been triggered", () => {
            expect(spyOne).toHaveBeenCalled();
          });
          it("the second item should be disposed", () => {
            expect(disposableTwo.getIsDisposed()).toEqual(true);
          });
          it("the dispose logic for the second item have been triggered", () => {
            expect(spyTwo).toHaveBeenCalled();
          });
          it('the second item should be disposed first (per "stack" rules)', () => {
            expect(disposeOrder[0]).toBe(disposableTwo);
          });
          it('the first item should be disposed next (per "stack" rules)', () => {
            expect(disposeOrder[1]).toBe(disposableOne);
          });
        });
      });
    });
  });

  // collections/specialized/EvictingList.js
  var empty2 = {};
  var EvictingList = class {
    #capacity;
    #array;
    #head;
    /**
     * @param {number=} capacity - The maximum number of items the list can contain (defaults to ten).
     */
    constructor(capacity) {
      argumentIsOptional(capacity, "capacity", Number);
      this.#capacity = Math.max(capacity || 0, 0) || 10;
      this.#array = [];
      for (let i = 0; i < this.#capacity; i++) {
        this.#array[i] = empty2;
      }
      this.#head = null;
    }
    /**
     * Adds an item to the list (possibly causing eviction, if the size of the
     * list exceeds the capacity).
     *
     * @public
     * @param {*} item
     */
    add(item) {
      this.#array[this.#head = getNextIndex(this.#head, this.#capacity)] = item;
    }
    /**
     * Returns the first item in the list, throwing an error if the list is empty.
     *
     * @public
     * @returns {*}
     */
    peek() {
      if (this.empty()) {
        throw new Error("EvictingList is empty");
      }
      return this.#array[this.#head];
    }
    /**
     * Returns true, if the list is empty; otherwise false.
     *
     * @public
     * @returns {boolean}
     */
    empty() {
      return this.#head === null;
    }
    /**
     * The capacity of the list.
     *
     * @public
     * @returns {number}
     */
    getCapacity() {
      return this.#capacity;
    }
    /**
     * Copies the items in the list to a new array.
     *
     * @returns {Array}
     */
    toArray() {
      let returnRef = [];
      if (!this.empty()) {
        let current = this.#head;
        for (let i = 0; i < this.#capacity; i++) {
          const item = this.#array[current];
          if (item === empty2) {
            break;
          }
          returnRef.push(item);
          current = getPreviousIndex(current, this.#capacity);
        }
      }
      return returnRef;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[EvictingList]";
    }
  };
  var getNextIndex = (current, capacity) => {
    let returnVal;
    if (current === null) {
      returnVal = 0;
    } else {
      returnVal = current + 1;
      if (returnVal === capacity) {
        returnVal = 0;
      }
    }
    return returnVal;
  };
  var getPreviousIndex = (current, capacity) => {
    let returnVal;
    if (current === null) {
      returnVal = 0;
    } else {
      returnVal = current - 1;
      if (returnVal < 0) {
        returnVal = capacity - 1;
      }
    }
    return returnVal;
  };

  // test/specs/collections/specialized/EvictingListSpec.js
  describe("When an EvictingList is constructed (with no capacity)", () => {
    "use strict";
    let list;
    beforeEach(() => {
      list = new EvictingList();
    });
    it("should be empty", () => {
      expect(list.empty()).toEqual(true);
    });
    it("should have a capacity of 10", () => {
      expect(list.getCapacity()).toEqual(10);
    });
    describe("when dumped to an array", () => {
      let array2;
      beforeEach(() => {
        array2 = list.toArray();
      });
      it("should be empty", () => {
        expect(array2.length).toEqual(0);
      });
    });
  });
  describe("When an EvictingList is constructed (with a capacity of 1)", () => {
    "use strict";
    let list;
    beforeEach(() => {
      list = new EvictingList(1);
    });
    it("should be empty", () => {
      expect(list.empty()).toEqual(true);
    });
    it("should have a capacity of 1", () => {
      expect(list.getCapacity()).toEqual(1);
    });
    describe("when dumped to an array", () => {
      let array2;
      beforeEach(() => {
        array2 = list.toArray();
      });
      it("should be empty", () => {
        expect(array2.length).toEqual(0);
      });
    });
    describe("when the an item is added to the list", () => {
      let a;
      beforeEach(() => {
        list.add(a = {});
      });
      it("peek should return the item", () => {
        expect(list.peek()).toBe(a);
      });
      it("should not be empty", () => {
        expect(list.empty()).toEqual(false);
      });
      describe("when dumped to an array", () => {
        let array2;
        beforeEach(() => {
          array2 = list.toArray();
        });
        it("should contain one item", () => {
          expect(array2.length).toEqual(1);
        });
        it("the first item should be the item added", () => {
          expect(array2[0]).toEqual(a);
        });
      });
      describe("when a second item is added to the list", () => {
        let b;
        beforeEach(() => {
          list.add(b = {});
        });
        it("should not be empty", () => {
          expect(list.empty()).toEqual(false);
        });
        it("peek should return the second item", () => {
          expect(list.peek()).toBe(b);
        });
        describe("when dumped to an array", () => {
          let array2;
          beforeEach(() => {
            array2 = list.toArray();
          });
          it("should contain one item", () => {
            expect(array2.length).toEqual(1);
          });
          it("the first item in the array should be the most recent item", () => {
            expect(array2[0]).toBe(b);
          });
        });
      });
    });
  });
  describe("When an EvictingList is constructed (with a capacity of 3)", () => {
    "use strict";
    let list;
    beforeEach(() => {
      list = new EvictingList(3);
    });
    it("should be empty", () => {
      expect(list.empty()).toEqual(true);
    });
    it("should have a capacity of 3", () => {
      expect(list.getCapacity()).toEqual(3);
    });
    describe("and five items are added to the list", () => {
      let a;
      let b;
      let c;
      let d;
      let e;
      beforeEach(() => {
        list.add(a = {});
        list.add(b = {});
        list.add(c = {});
        list.add(d = {});
        list.add(e = {});
      });
      it("should not be empty", () => {
        expect(list.empty()).toEqual(false);
      });
      describe("when dumped to an array", () => {
        let array2;
        beforeEach(() => {
          array2 = list.toArray();
        });
        it("should contain three items", () => {
          expect(array2.length).toEqual(3);
        });
        it("the first item should be the most recent item added", () => {
          expect(array2[0]).toBe(e);
        });
        it("the second item should be the second most recent item added", () => {
          expect(array2[1]).toBe(d);
        });
        it("the third item should be the third most recent item addedd", () => {
          expect(array2[2]).toBe(c);
        });
      });
      describe("and 100 more items are added to the list", () => {
        let items = [];
        beforeEach(() => {
          for (let i = 0; i < 100; i++) {
            list.add(items[i] = {});
          }
        });
        describe("when dumped to an array", () => {
          let array2;
          beforeEach(() => {
            array2 = list.toArray();
          });
          it("should contain three items", () => {
            expect(array2.length).toEqual(3);
          });
          it("the first item should be the most recent item added", () => {
            expect(array2[0]).toBe(items[99]);
          });
          it("the second item should be the second most recent item added", () => {
            expect(array2[1]).toBe(items[98]);
          });
          it("the third item should be the third most recent item addedd", () => {
            expect(array2[2]).toBe(items[97]);
          });
        });
      });
    });
  });

  // collections/specialized/EvictingMap.js
  var EvictingMap = class {
    #capacity;
    #map;
    #head;
    #tail;
    #size;
    /**
     * @param {number=} capacity - The maximum number of items the map can contain (defaults to ten).
     */
    constructor(capacity) {
      argumentIsOptional(capacity, "capacity", Number);
      this.#capacity = Math.max(capacity || 0, 0) || 10;
      this.#map = {};
      this.#head = null;
      this.#tail = null;
      this.#size = 0;
    }
    /**
     * Returns true, if the map contains the item; otherwise false.
     *
     * @public
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
      return Object.prototype.hasOwnProperty.call(this.#map, key);
    }
    /**
     * Puts an item into the map (possibly causing eviction, if the size of the
     * list exceeds the capacity).
     *
     * @public
     * @param {string} key
     * @param {*} value
     */
    put(key, value) {
      this.remove(key);
      let node;
      if (this.#head !== null) {
        node = this.#head.insertBefore(key);
        this.#head = node;
      } else {
        node = new Node(key);
        this.#head = node;
        this.#tail = node;
      }
      this.#map[key] = new Item(node, key, value);
      this.#size++;
      while (this.#size > this.#capacity) {
        this.remove(this.#tail.getItem());
      }
    }
    /**
     * Puts an item into the map (possibly causing eviction, if the size of the
     * list exceeds the capacity).
     *
     * @public
     * @param {string} key
     * @param {*} value
     */
    set(key, value) {
      this.put(key, value);
    }
    /**
     * Gets an item from the map, returning a null value if the no item
     * for the given key exists.
     *
     * @public
     * @param {string} key
     * @returns {*|null}
     */
    get(key) {
      let returnRef;
      const item = this.#map[key];
      if (item) {
        returnRef = item.getValue();
        const node = item.getNode();
        if (node !== this.#head) {
          if (node === this.#tail) {
            this.#tail = node.getPrevious();
          }
          node.remove();
          this.#head = this.#head.insertBefore(key);
          item.setNode(this.#head);
        }
      } else {
        returnRef = null;
      }
      return returnRef;
    }
    /**
     * Removes an item from the map.
     *
     * @public
     * @param {string} key
     */
    remove(key) {
      const item = this.#map[key];
      if (item) {
        const node = item.getNode();
        const next = node.getNext();
        const previous = node.getPrevious();
        node.remove();
        if (this.#head === node) {
          this.#head = next;
        }
        if (this.#tail === node) {
          this.#tail = previous;
        }
        delete this.#map[key];
        this.#size--;
      }
    }
    /**
     * Removes an item from the map.
     *
     * @public
     * @param {string} key
     */
    delete(key) {
      this.remove(key);
    }
    /**
     * Returns true, if the map contains no items; otherwise false.
     *
     * @public
     * @returns {boolean}
     */
    empty() {
      return this.#size === 0;
    }
    /**
     * Returns the number of items stored in the map.
     *
     * @public
     * @returns {number}
     */
    getSize() {
      return this.#size;
    }
    /**
     * The capacity of the map.
     *
     * @public
     * @returns {number}
     */
    getCapacity() {
      return this.#capacity;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[EvictingMap]";
    }
  };
  var Item = class {
    #node;
    #key;
    #value;
    constructor(node, key, value) {
      this.#node = node;
      this.#key = key;
      this.#value = value;
    }
    getKey() {
      return this.#key;
    }
    getValue() {
      return this.#value;
    }
    getNode() {
      return this.#node;
    }
    setNode(node) {
      this.#node = node;
    }
  };
  var Node = class _Node {
    #item;
    #previous;
    #next;
    constructor(item) {
      this.#item = item;
      this.#previous = null;
      this.#next = null;
    }
    insertBefore(item) {
      const node = new _Node(item);
      node.#next = this;
      if (this.#previous !== null) {
        node.#previous = this.#previous;
        this.#previous.#next = node;
      }
      this.#previous = node;
      return node;
    }
    insertAfter(item) {
      const node = new _Node(item);
      node.#previous = this;
      if (this.#next !== null) {
        node.#next = this.#next;
        this.#next.#previous = node;
      }
      this.#next = node;
      return node;
    }
    remove() {
      const next = this.#next;
      const previous = this.#previous;
      this.#next = null;
      this.#previous = null;
      if (next && previous) {
        previous.#next = next;
        next.#previous = previous;
      } else if (next) {
        next.#previous = null;
      } else if (previous) {
        previous.#next = null;
      }
      return this;
    }
    getItem() {
      return this.#item;
    }
    hasNext() {
      return this.#next !== null;
    }
    getNext() {
      return this.#next;
    }
    hasPrevious() {
      return this.#previous !== null;
    }
    getPrevious() {
      return this.#previous;
    }
  };

  // test/specs/collections/specialized/EvictingMapSpec.js
  describe("When an EvictingMap is constructed (with no capacity)", () => {
    "use strict";
    let map2;
    beforeEach(() => {
      map2 = new EvictingMap();
    });
    it("should be empty", () => {
      expect(map2.empty()).toEqual(true);
    });
    it("should have a capacity of 10", () => {
      expect(map2.getCapacity()).toEqual(10);
    });
  });
  describe("When an EvictingMap is constructed (with a capacity of 1)", () => {
    "use strict";
    let map2;
    beforeEach(() => {
      map2 = new EvictingMap(1);
    });
    it("should be empty", () => {
      expect(map2.empty()).toEqual(true);
    });
    it("should have a capacity of 1", () => {
      expect(map2.getCapacity()).toEqual(1);
    });
    describe("when an item is added to the map", () => {
      let a;
      beforeEach(() => {
        a = { key: "a" };
        map2.put(a.key, a);
      });
      it("get should return the item", () => {
        expect(map2.get(a.key)).toBe(a);
      });
      it("has should return true for the item key", () => {
        expect(map2.has(a.key)).toEqual(true);
      });
      it("should not be empty", () => {
        expect(map2.empty()).toEqual(false);
      });
      it("should have one item", () => {
        expect(map2.getSize()).toEqual(1);
      });
      describe("when a second item is added to the map", () => {
        let b;
        beforeEach(() => {
          b = { key: "b" };
          map2.put(b.key, b);
        });
        it("get should return the second item", () => {
          expect(map2.get(b.key)).toBe(b);
        });
        it("get should not return the first item", () => {
          expect(map2.get(a.key)).toEqual(null);
        });
        it("should not be empty", () => {
          expect(map2.empty()).toEqual(false);
        });
        it("should have one item", () => {
          expect(map2.getSize()).toEqual(1);
        });
        describe("when a third item is added to the map", () => {
          let c;
          beforeEach(() => {
            c = { key: "c" };
            map2.put(c.key, c);
          });
          it("get should return the third item", () => {
            expect(map2.get(c.key)).toBe(c);
          });
          it("get should not return the first item", () => {
            expect(map2.get(a.key)).toEqual(null);
          });
          it("get should not return the second item", () => {
            expect(map2.get(b.key)).toEqual(null);
          });
          it("should not be empty", () => {
            expect(map2.empty()).toEqual(false);
          });
          it("should have one item", () => {
            expect(map2.getSize()).toEqual(1);
          });
        });
      });
      describe("when the first item is removed from the map", () => {
        beforeEach(() => {
          map2.remove("a");
        });
        it("should be empty", () => {
          expect(map2.empty()).toEqual(true);
        });
        it("should have zero items", () => {
          expect(map2.getSize()).toEqual(0);
        });
        describe("when the item is added to the map again", () => {
          beforeEach(() => {
            map2.put(a.key, a);
          });
          it("get should return the item", () => {
            expect(map2.get(a.key)).toBe(a);
          });
          it("should not be empty", () => {
            expect(map2.empty()).toEqual(false);
          });
          it("should have one item", () => {
            expect(map2.getSize()).toEqual(1);
          });
        });
      });
      describe("when the first item is deleted from the map", () => {
        beforeEach(() => {
          map2.delete("a");
        });
        it("should be empty", () => {
          expect(map2.empty()).toEqual(true);
        });
      });
    });
  });
  describe("When an EvictingMap is constructed (with a capacity of 3)", () => {
    "use strict";
    let map2;
    beforeEach(() => {
      map2 = new EvictingMap(3);
    });
    it("should be empty", () => {
      expect(map2.empty()).toEqual(true);
    });
    it("should have a capacity of 3", () => {
      expect(map2.getCapacity()).toEqual(3);
    });
    describe("when three items are added to the map", () => {
      let a;
      let b;
      let c;
      beforeEach(() => {
        a = { key: "a" };
        b = { key: "b" };
        c = { key: "c" };
        map2.put(a.key, a);
        map2.put(b.key, b);
        map2.put(c.key, c);
      });
      it('get "a" should return the first item', () => {
        expect(map2.get(a.key)).toBe(a);
      });
      it('get "b" should return the second item', () => {
        expect(map2.get(b.key)).toBe(b);
      });
      it('get "c" should return the third item', () => {
        expect(map2.get(c.key)).toBe(c);
      });
      it("should not be empty", () => {
        expect(map2.empty()).toEqual(false);
      });
      it("should have three items", () => {
        expect(map2.getSize()).toEqual(3);
      });
      describe("when a fourth item is added to the map", () => {
        let d;
        beforeEach(() => {
          d = { key: "d" };
          map2.put(d.key, d);
        });
        it('get "a" should not return the first item', () => {
          expect(map2.get(a.key)).toEqual(null);
        });
        it('get "b" should return the second item', () => {
          expect(map2.get(b.key)).toBe(b);
        });
        it('get "c" should return the third item', () => {
          expect(map2.get(c.key)).toBe(c);
        });
        it('get "d" should return the fourth item', () => {
          expect(map2.get(d.key)).toBe(d);
        });
        it("should not be empty", () => {
          expect(map2.empty()).toEqual(false);
        });
        it("should have three items", () => {
          expect(map2.getSize()).toEqual(3);
        });
        describe('after getting item "b" from map', () => {
          beforeEach(() => {
            map2.get(b.key);
          });
          describe("when a fifth item is added to the list", () => {
            let e;
            beforeEach(() => {
              e = { key: "e" };
              map2.put(e.key, e);
            });
            it('get "a" should not return the first item', () => {
              expect(map2.get(a.key)).toEqual(null);
            });
            it('get "b" should return the second item', () => {
              expect(map2.get(b.key)).toBe(b);
            });
            it('get "c" should not return the third item', () => {
              expect(map2.get(c.key)).toEqual(null);
            });
            it('get "d" should return the fourth item', () => {
              expect(map2.get(d.key)).toBe(d);
            });
            it('get "e" should return the fifth item', () => {
              expect(map2.get(e.key)).toBe(e);
            });
            it("should not be empty", () => {
              expect(map2.empty()).toEqual(false);
            });
            it("should have three items", () => {
              expect(map2.getSize()).toEqual(3);
            });
          });
        });
      });
    });
  });
  describe("When an EvictingMap uses set to add an item", () => {
    "use strict";
    let map2;
    let item;
    beforeEach(() => {
      map2 = new EvictingMap(1);
      item = { key: "a" };
      map2.set(item.key, item);
    });
    it("get should return the item", () => {
      expect(map2.get(item.key)).toBe(item);
    });
  });
  describe("When an EvictingMap is constructed", () => {
    "use strict";
    let map2;
    beforeEach(() => {
      map2 = new EvictingMap(3);
    });
    describe("and used in a write-read-write pattern", () => {
      let a;
      let b;
      let c;
      let x;
      let y;
      beforeEach(() => {
        a = { key: "a" };
        b = { key: "b" };
        c = { key: "c" };
        x = { key: "x" };
        y = { key: "y" };
        map2.put(a.key, a);
        map2.put(b.key, b);
        map2.put(c.key, c);
        map2.get(c.key);
        map2.get(a.key);
        map2.get(c.key);
        map2.put(a.key, a);
        map2.put(b.key, b);
        map2.put(c.key, c);
        map2.put(x.key, x);
        map2.put(y.key, y);
      });
      it('get "a" should not return the first item', () => {
        expect(map2.get(a.key)).toEqual(null);
      });
      it('get "b" should not return the second item', () => {
        expect(map2.get(b.key)).toEqual(null);
      });
      it('get "c" should return the third item', () => {
        expect(map2.get(c.key)).toBe(c);
      });
      it('get "x" should return the fourth item', () => {
        expect(map2.get(x.key)).toBe(x);
      });
      it('get "y" should return the fourth item', () => {
        expect(map2.get(y.key)).toBe(y);
      });
      it("should not be empty", () => {
        expect(map2.empty()).toEqual(false);
      });
      it("should have three items", () => {
        expect(map2.getSize()).toEqual(3);
      });
    });
  });

  // collections/specialized/PriorityQueue.js
  var PriorityQueue = class extends Queue {
    #comparator;
    /**
     * @param {(a: *, b: *) => number} comparator - The comparator used to sort items.
     */
    constructor(comparator2) {
      super();
      argumentIsRequired(comparator2, "comparator", Function);
      this.#comparator = comparator2;
    }
    /**
     * Adds an item to the queue according to its priority.
     *
     * @public
     * @param {*} item - The item to add.
     * @returns {*} The item added to the queue.
     */
    enqueue(item) {
      insert(this._getArray(), item, this.#comparator);
      return item;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[PriorityQueue]";
    }
  };

  // test/specs/collections/specialized/PriorityQueueSpec.js
  describe('When a Queue is constructed, using a "ladies first" comparator', () => {
    "use strict";
    let queue;
    let comparator2 = (a, b) => {
      let aLady = a.lady ? -1 : 0;
      let bLady = b.lady ? -1 : 0;
      let result = aLady - bLady;
      if (result === 0) {
        result = a.name.localeCompare(b.name);
      }
      return result;
    };
    beforeEach(() => {
      queue = new PriorityQueue(comparator2);
    });
    it("should be empty", () => {
      expect(queue.empty()).toEqual(true);
    });
    it('should throw if "peek" is called', () => {
      expect(() => {
        queue.peek();
      }).toThrow(new Error("Queue is empty"));
    });
    it('should throw if "dequeue" is called', () => {
      expect(() => {
        queue.peek();
      }).toThrow(new Error("Queue is empty"));
    });
    describe("and an three objects are enqueued: Kim, Bryan, and Erica", () => {
      let kim, bryan, erica;
      beforeEach(() => {
        queue.enqueue(kim = { name: "kim", lady: true });
        queue.enqueue(bryan = { name: "bryan", lady: false });
        queue.enqueue(erica = { name: "erica", lady: true });
      });
      it("should not be empty", () => {
        expect(queue.empty()).toEqual(false);
      });
      describe("and we peek at the top of the queue", () => {
        let peek;
        beforeEach(() => {
          peek = queue.peek();
        });
        it("the peek result should be erica", () => {
          expect(peek).toBe(erica);
        });
        it("should not be empty", () => {
          expect(queue.empty()).toEqual(false);
        });
      });
      describe("and an object is dequeued", () => {
        let dequeue;
        beforeEach(() => {
          dequeue = queue.dequeue();
        });
        it("the dequeue result should be erica", () => {
          expect(dequeue).toBe(erica);
        });
        it("should not be empty", () => {
          expect(queue.empty()).toEqual(false);
        });
        describe("and an second object is dequeued", () => {
          let dequeue2;
          beforeEach(() => {
            dequeue2 = queue.dequeue();
          });
          it("the dequeue result should be kim", () => {
            expect(dequeue2).toBe(kim);
          });
          it("should not be empty", () => {
            expect(queue.empty()).toEqual(false);
          });
          describe("and a third object is dequeued", () => {
            let dequeue3;
            beforeEach(() => {
              dequeue3 = queue.dequeue();
            });
            it("the dequeue result should be bryan", () => {
              expect(dequeue3).toBe(bryan);
            });
            it("should be empty", () => {
              expect(queue.empty()).toEqual(true);
            });
          });
        });
      });
      describe("and the queue is exported to an array", () => {
        let a;
        beforeEach(() => {
          a = queue.toArray();
        });
        it("should return an array with three items", () => {
          expect(a.length).toEqual(3);
        });
        it("the first item should be erica", () => {
          expect(a[0]).toBe(erica);
        });
        it("the second item should be kim", () => {
          expect(a[1]).toBe(kim);
        });
        it("the third item should be bryan", () => {
          expect(a[2]).toBe(bryan);
        });
        it("should not be empty", () => {
          expect(queue.empty()).toEqual(false);
        });
      });
      describe("and the queue is scanned", () => {
        let spy;
        beforeEach(() => {
          spy = jasmine.createSpy();
          queue.scan(spy);
        });
        it("should call the delegate one time for each item in the queue", () => {
          expect(spy.calls.count()).toEqual(3);
        });
        it("should pass erica to the delegate first", () => {
          expect(spy.calls.argsFor(0)[0]).toBe(erica);
        });
        it("should pass kim to the delegate second", () => {
          expect(spy.calls.argsFor(1)[0]).toBe(kim);
        });
        it("should pass bryan to the delegate thrid", () => {
          expect(spy.calls.argsFor(2)[0]).toBe(bryan);
        });
        it("should not be empty", () => {
          expect(queue.empty()).toEqual(false);
        });
      });
    });
  });
  describe("When a Queue is constructed, using a simple (ascending) numeric comparator", () => {
    "use strict";
    let queue;
    let comparator2 = (a, b) => {
      return a - b;
    };
    beforeEach(() => {
      queue = new PriorityQueue(comparator2);
    });
    describe("and the following values are enqueued: 3, 2, and 1", () => {
      beforeEach(() => {
        queue.enqueue(3);
        queue.enqueue(2);
        queue.enqueue(1);
      });
      describe("and all items are dequeued", () => {
        let a, b, c;
        beforeEach(() => {
          a = queue.dequeue();
          b = queue.dequeue();
          c = queue.dequeue();
        });
        it("the dequeued items should be ordered property", () => {
          expect([a, b, c]).toEqual([1, 2, 3]);
        });
      });
    });
    describe("and the following values are enqueued: 1, 2, and 3", () => {
      beforeEach(() => {
        queue.enqueue(1);
        queue.enqueue(2);
        queue.enqueue(3);
      });
      describe("and all items are dequeued", () => {
        let a, b, c;
        beforeEach(() => {
          a = queue.dequeue();
          b = queue.dequeue();
          c = queue.dequeue();
        });
        it("the dequeued items should be ordered property", () => {
          expect([a, b, c]).toEqual([1, 2, 3]);
        });
      });
    });
    describe("and the following values are enqueued: 2, 3, and 1", () => {
      beforeEach(() => {
        queue.enqueue(2);
        queue.enqueue(3);
        queue.enqueue(1);
      });
      describe("and all items are dequeued", () => {
        let a, b, c;
        beforeEach(() => {
          a = queue.dequeue();
          b = queue.dequeue();
          c = queue.dequeue();
        });
        it("the dequeued items should be ordered property", () => {
          expect([a, b, c]).toEqual([1, 2, 3]);
        });
      });
    });
    describe("and the following values are enqueued: 8, 7, 9, 3, 1, 2, 4, 6, 5", () => {
      beforeEach(() => {
        queue.enqueue(3);
        queue.enqueue(1);
        queue.enqueue(2);
      });
      describe("and all items are dequeued", () => {
        let a, b, c;
        beforeEach(() => {
          a = queue.dequeue();
          b = queue.dequeue();
          c = queue.dequeue();
        });
        it("the dequeued items should be ordered property", () => {
          expect([a, b, c]).toEqual([1, 2, 3]);
        });
      });
    });
    describe("and the following values are enqueued: 3, 1, 2", () => {
      beforeEach(() => {
        queue.enqueue(8);
        queue.enqueue(7);
        queue.enqueue(9);
        queue.enqueue(3);
        queue.enqueue(1);
        queue.enqueue(2);
        queue.enqueue(4);
        queue.enqueue(6);
        queue.enqueue(5);
      });
      describe("and all items are dequeued", () => {
        let a, b, c, d, e, f, g, h, i;
        beforeEach(() => {
          a = queue.dequeue();
          b = queue.dequeue();
          c = queue.dequeue();
          d = queue.dequeue();
          e = queue.dequeue();
          f = queue.dequeue();
          g = queue.dequeue();
          h = queue.dequeue();
          i = queue.dequeue();
        });
        it("the dequeued items should be ordered property", () => {
          expect([a, b, c, d, e, f, g, h, i]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });
      });
    });
  });

  // collections/specialized/SortedTree.js
  var SortedTree = class _SortedTree extends Tree {
    /**
     * @param {*} value - The value of the node.
     * @param {Tree=} parent - The parent node. If not supplied, this will be the root node.
     * @param {(a: any, b: any) => number=} comparator - The comparator function used to sort nodes.
     */
    constructor(value, parent, comparator2) {
      super(value, parent);
      if (parent) {
        argumentIsOptional(comparator2, "comparator", Function);
      } else {
        argumentIsRequired(comparator2, "comparator", Function);
      }
      this._comparator = comparator2 || null;
    }
    /**
     * Adds a child node to the current node, inserting it at the correct position,
     * and returns a reference to the child node.
     *
     * @public
     * @param {*} value - The value of the child.
     * @returns {Tree}
     */
    addChild(value) {
      const child = new _SortedTree(value, this);
      const comparatorNode = this.findParent((value2, node) => node instanceof _SortedTree && node._comparator !== null, true);
      if (!(comparatorNode instanceof _SortedTree) || comparatorNode._comparator === null) {
        throw new Error("Unable to find a comparator for the sorted tree.");
      }
      insert(this._children, child, comparatorNode._comparator);
      return child;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[SortedTree]";
    }
  };

  // test/specs/collections/specialized/SortedTreeSpec.js
  describe("When a SortedTree is constructed", () => {
    "use strict";
    let tree;
    beforeEach(() => {
      tree = new SortedTree("root", null, (a, b) => a.getValue() - b.getValue());
    });
    it("should require a comparator for the root node", () => {
      expect(() => new SortedTree("root")).toThrow();
    });
    it("should insert children in sorted order", () => {
      const three = tree.addChild(3);
      const one = tree.addChild(1);
      const two = tree.addChild(2);
      expect(tree.getChildren()).toEqual([one, two, three]);
    });
    it("should allow descendants to reuse the root comparator", () => {
      const child = tree.addChild(2);
      const nestedThree = child.addChild(3);
      const nestedOne = child.addChild(1);
      expect(child.getChildren()).toEqual([nestedOne, nestedThree]);
    });
    it("should return SortedTree child instances", () => {
      expect(tree.addChild(1) instanceof SortedTree).toEqual(true);
    });
  });

  // collections/specialized/TimeMap.js
  var TimeMap = class {
    #duration;
    #map;
    /**
     * @param {number} duration - The time to live, in milliseconds.
     */
    constructor(duration) {
      argumentIsValid(duration, "duration", (x) => positive(x), "is positive");
      this.#duration = duration;
      this.#map = {};
    }
    /**
     * Returns true, if the map contains the item; otherwise false.
     *
     * @public
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
      argumentIsRequired(key, "key", String);
      let exists = Object.prototype.hasOwnProperty.call(this.#map, key);
      if (exists) {
        const item = this.#map[key];
        if (!item.valid) {
          this.remove(key);
          exists = false;
        }
      }
      return exists;
    }
    /**
     * Puts an item into the map.
     *
     * @public
     * @param {string} key
     * @param {*} value
     */
    put(key, value) {
      argumentIsRequired(key, "key", String);
      this.#map[key] = new Item2(key, value, (/* @__PURE__ */ new Date()).getTime() + this.#duration);
    }
    /**
     * Puts an item into the map.
     *
     * @public
     * @param {string} key
     * @param {*} value
     */
    set(key, value) {
      this.put(key, value);
    }
    /**
     * Gets an item from the map, returning a null value if the no item
     * for the given key exists.
     *
     * @public
     * @param {string} key
     * @returns {*|null}
     */
    get(key) {
      argumentIsRequired(key, "key", String);
      let returnRef = null;
      if (this.has(key)) {
        returnRef = this.#map[key].value;
      }
      return returnRef;
    }
    /**
     * Removes an item from the map.
     *
     * @public
     * @param {string} key
     */
    remove(key) {
      argumentIsRequired(key, "key", String);
      delete this.#map[key];
    }
    /**
     * Removes an item from the map.
     *
     * @public
     * @param {string} key
     */
    delete(key) {
      this.remove(key);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[TimeMap]";
    }
  };
  var Item2 = class {
    #key;
    #value;
    #expiration;
    constructor(key, value, expiration) {
      this.#key = key;
      this.#value = value;
      this.#expiration = expiration;
    }
    get key() {
      return this.#key;
    }
    get value() {
      return this.#value;
    }
    get valid() {
      return this.#expiration > (/* @__PURE__ */ new Date()).getTime();
    }
  };

  // test/specs/collections/specialized/TimeMapSpec.js
  describe("When an TimeMap is constructed (with a 10 millisecond time to live)", () => {
    "use strict";
    let map2;
    beforeEach(() => {
      map2 = new TimeMap(10);
    });
    describe("and an item is added to the map", () => {
      let key;
      let item;
      beforeEach(() => {
        map2.set(key = "a", item = {});
      });
      it("should contain the key", () => {
        expect(map2.has(key)).toEqual(true);
      });
      it("should return the original value", () => {
        expect(map2.get(key)).toBe(item);
      });
      describe("and the item is removed", () => {
        beforeEach(() => {
          map2.remove(key);
        });
        it("should not contain the key", () => {
          expect(map2.has(key)).toEqual(false);
        });
      });
      describe("and the item is deleted", () => {
        beforeEach(() => {
          map2.delete(key);
        });
        it("should not contain the key", () => {
          expect(map2.has(key)).toEqual(false);
        });
      });
      describe("and 15 milliseconds elapses", () => {
        beforeEach((done) => {
          setTimeout(() => {
            done();
          }, 15);
        });
        it("should not contain the key", () => {
          expect(map2.has(key)).toEqual(false);
        });
        it("should not return the original value", () => {
          expect(map2.get(key)).toEqual(null);
        });
      });
    });
    describe("and an item is put into the map", () => {
      let key;
      let item;
      beforeEach(() => {
        map2.put(key = "a", item = {});
      });
      it("should return the original value", () => {
        expect(map2.get(key)).toBe(item);
      });
    });
  });

  // commands/CommandHandler.js
  var CommandHandler = class _CommandHandler {
    constructor() {
    }
    /**
     * Execute the action.
     *
     * @public
     * @param {*} data
     * @returns {*}
     */
    process(data) {
      return this._process(data);
    }
    /**
     * @protected
     * @param {*} data
     * @returns {*}
     */
    _process(data) {
      return true;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[CommandHandler]";
    }
    /**
     * Returns a function which executes the command.
     *
     * @public
     * @static
     * @param {CommandHandler} commandHandler
     * @returns {Function}
     */
    static toFunction(commandHandler) {
      argumentIsRequired(commandHandler, "commandHandler", _CommandHandler, "CommandHandler");
      return (data) => {
        return commandHandler.process(data);
      };
    }
    /**
     * Returns a {@link CommandHandler} that delegates execution to a function.
     *
     * @public
     * @static
     * @param {Function} handler - The function which the command delegates to.
     * @returns {CommandHandler}
     */
    static fromFunction(handler) {
      argumentIsRequired(handler, "handler", Function);
      return new DelegateCommandHandler(handler);
    }
  };
  var DelegateCommandHandler = class extends CommandHandler {
    #handler;
    /**
        * @param {Function} handler
        */
    constructor(handler) {
      super();
      this.#handler = handler;
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {*}
     */
    _process(data) {
      return this.#handler(data);
    }
  };

  // test/specs/commands/CommandHandlerSpec.js
  describe("When a CommandHandler is created from a function", () => {
    "use strict";
    let commandHandler;
    let spy;
    let result;
    beforeEach(() => {
      commandHandler = CommandHandler.fromFunction(spy = jasmine.createSpy("spy").and.returnValue(result = 123));
    });
    it("returns a CommandHandler instance", () => {
      expect(commandHandler instanceof CommandHandler).toEqual(true);
    });
    describe("and the command is executed", () => {
      let commandData;
      let commandResult;
      beforeEach(() => {
        commandResult = commandHandler.process(commandData = {});
      });
      it("should invoke the wrapped function", () => {
        expect(spy).toHaveBeenCalledWith(commandData);
      });
      it("should return the wrapped function's result", () => {
        expect(commandResult).toEqual(result);
      });
    });
    describe("and the command processor is converted to a function", () => {
      let commandFunction;
      beforeEach(() => {
        commandFunction = CommandHandler.toFunction(commandHandler);
      });
      it("returns a function", () => {
        expect(typeof commandFunction).toEqual("function");
      });
      describe("and the converted function is invoked", () => {
        let commandData;
        let commandResult;
        beforeEach(() => {
          commandResult = commandFunction(commandData = {});
        });
        it("should invoke the wrapped function", () => {
          expect(spy).toHaveBeenCalledWith(commandData);
        });
        it("should return the wrapped function's result", () => {
          expect(commandResult).toEqual(result);
        });
      });
    });
  });

  // commands/CompositeCommandHandler.js
  var CompositeCommandHandler = class extends CommandHandler {
    #commandHandlerA;
    #commandHandlerB;
    /**
     * @param {*} commandHandlerA
     * @param {*} commandHandlerB
     */
    constructor(commandHandlerA, commandHandlerB) {
      super();
      argumentIsRequired(commandHandlerA, "commandHandlerA", CommandHandler, "CommandHandler");
      argumentIsRequired(commandHandlerB, "commandHandlerB", CommandHandler, "CommandHandler");
      areNotEqual(commandHandlerA, commandHandlerB, "commandHandlerA", "commandHandlerB");
      this.#commandHandlerA = commandHandlerA;
      this.#commandHandlerB = commandHandlerB;
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {*}
     */
    _process(data) {
      return this.#commandHandlerA.process(data) && this.#commandHandlerB.process(data);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[CompositeCommandHandler]";
    }
  };

  // test/specs/commands/CompositeCommandHandlerSpec.js
  describe("When a CompositeCommandHandler is created", () => {
    "use strict";
    let commandHandler;
    let spyOne;
    let spyTwo;
    let resultOne;
    let resultTwo;
    beforeEach(() => {
      resultOne = true;
      resultTwo = true;
      commandHandler = new CompositeCommandHandler(
        CommandHandler.fromFunction(spyOne = jasmine.createSpy("spyOne").and.callFake(() => {
          return resultOne;
        })),
        CommandHandler.fromFunction(spyTwo = jasmine.createSpy("spyTwo").and.callFake(() => {
          return resultTwo;
        }))
      );
    });
    describe("and the command is executed", () => {
      let commandData;
      let commandResult;
      beforeEach(() => {
        commandResult = commandHandler.process(commandData = {});
      });
      it("should invoke the wrapped functions", () => {
        expect({
          spyOne: spyOne.calls.allArgs(),
          spyTwo: spyTwo.calls.allArgs()
        }).toEqual({
          spyOne: [[commandData]],
          spyTwo: [[commandData]]
        });
      });
    });
    describe("and the command is executed, but the first command fails", () => {
      let commandData;
      let commandResult;
      beforeEach(() => {
        resultOne = false;
        resultTwo = false;
        commandResult = commandHandler.process(commandData = {});
      });
      it("should invoke the first command", () => {
        expect(spyOne).toHaveBeenCalledWith(commandData);
      });
      it("should not invoke the first command", () => {
        expect(spyTwo).not.toHaveBeenCalledWith(commandData);
      });
    });
  });

  // commands/MappedCommandHandler.js
  var MappedCommandHandler = class extends CommandHandler {
    #handlerMap;
    #defaultHandler;
    #nameExtractor;
    /**
     * @public
     * @param {*} nameExtractor
     */
    constructor(nameExtractor) {
      super();
      argumentIsRequired(nameExtractor, "nameFunction", Function);
      this.#handlerMap = {};
      this.#defaultHandler = null;
      this.#nameExtractor = nameExtractor;
    }
    /**
     * @public
     * @param {*} name
     * @param {*} commandHandler
     * @returns {MappedCommandHandler}
     */
    addCommandHandler(name, commandHandler) {
      argumentIsRequired(name, "name", String);
      argumentIsRequired(commandHandler, "commandHandler", CommandHandler, "CommandHandler");
      if (Object.prototype.hasOwnProperty.call(this.#handlerMap, name)) {
        throw new Error("A handler with the same name already exists in the map");
      }
      if (commandHandler === this) {
        throw new Error("Recursive use of mapped command handlers is prohibited");
      }
      this.#handlerMap[name] = commandHandler;
      return this;
    }
    /**
     * @public
     * @param {*} commandHandler
     * @returns {MappedCommandHandler}
     */
    setDefaultCommandHandler(commandHandler) {
      argumentIsRequired(commandHandler, "commandHandler", CommandHandler, "CommandHandler");
      this.#defaultHandler = commandHandler;
      return this;
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {*}
     */
    _process(data) {
      const handlerName = this.#nameExtractor(data);
      const handler = this.#handlerMap[handlerName] || this.#defaultHandler;
      let returnRef;
      if (handler) {
        returnRef = handler.process(data);
      } else {
        returnRef = null;
      }
      return returnRef;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[MappedCommandHandler]";
    }
  };

  // test/specs/commands/MappedCommandHandlerSpec.js
  describe("When a MappedCommandHandler is created with two mapped commands", () => {
    "use strict";
    let commandHandler;
    let spyOne;
    let spyTwo;
    let selectorOne;
    let selectorTwo;
    let resultOne;
    let resultTwo;
    beforeEach(() => {
      selectorOne = "one";
      selectorTwo = "two";
      resultOne = "a";
      resultTwo = "b";
      commandHandler = new MappedCommandHandler((data) => {
        return data.commandType || null;
      });
      commandHandler.addCommandHandler(selectorOne, CommandHandler.fromFunction(spyOne = jasmine.createSpy("spyOne").and.callFake(() => {
        return resultOne;
      })));
      commandHandler.addCommandHandler(selectorTwo, CommandHandler.fromFunction(spyTwo = jasmine.createSpy("spyTwo").and.callFake(() => {
        return resultTwo;
      })));
    });
    describe("and a default command handler is configured", () => {
      let defaultResult;
      let defaultSpy;
      let commandData;
      let commandResult;
      beforeEach(() => {
        defaultResult = "default";
        commandResult = commandHandler.setDefaultCommandHandler(CommandHandler.fromFunction(defaultSpy = jasmine.createSpy("defaultSpy").and.returnValue(defaultResult))).process(commandData = { commandType: "unknown" });
      });
      it("should invoke the default command handler", () => {
        expect(defaultSpy).toHaveBeenCalledWith(commandData);
      });
      it("should return the default command handler result", () => {
        expect(commandResult).toEqual(defaultResult);
      });
    });
    describe("and the command is process with data for the first handler", () => {
      let commandData;
      let commandResult;
      beforeEach(() => {
        commandResult = commandHandler.process(commandData = { commandType: selectorOne });
      });
      it("should invoke wrapped function for the first handler", () => {
        expect(spyOne).toHaveBeenCalledWith(commandData);
      });
      it("should return the result from the first handler", () => {
        expect(commandResult).toEqual(resultOne);
      });
      it("should not invoke wrapped function for the secoond handler", () => {
        expect(spyTwo).not.toHaveBeenCalledWith(commandData);
      });
    });
    describe("and the command is process with data for the second handler", () => {
      let commandData;
      let commandResult;
      beforeEach(() => {
        commandResult = commandHandler.process(commandData = { commandType: selectorTwo });
      });
      it("should invoke wrapped function for the second handler", () => {
        expect(spyTwo).toHaveBeenCalledWith(commandData);
      });
      it("should return the result from the second handler", () => {
        expect(commandResult).toEqual(resultTwo);
      });
      it("should not invoke wrapped function for the first handler", () => {
        expect(spyOne).not.toHaveBeenCalledWith(commandData);
      });
    });
  });

  // test/specs/lang/AdHocSpec.js
  describe("When wrapping an object in an ad hoc serialization container", () => {
    "use strict";
    let data;
    let adHoc;
    beforeEach(() => {
      adHoc = new AdHoc(data = { a: 1, b: "two" });
    });
    it("should contain the wrapped object", () => {
      expect(adHoc.data).toBe(data);
    });
    describe("and container is serialized", () => {
      let serialized;
      beforeEach(() => {
        serialized = adHoc.toJSON();
      });
      it("should be an escaped string", () => {
        expect(serialized).toEqual('{"a":1,"b":"two"}');
      });
      describe("and container is deserialized", () => {
        let deserialized;
        beforeEach(() => {
          deserialized = AdHoc.parse(serialized);
        });
        it("should be an ad hoc container", () => {
          expect(deserialized instanceof AdHoc).toEqual(true);
        });
        it('should contain a clone of the original data property "a"', () => {
          expect(deserialized.data.a).toEqual(data.a);
        });
        it('should contain a clone of the original data property "b"', () => {
          expect(deserialized.data.b).toEqual(data.b);
        });
      });
    });
  });

  // lang/Currency.js
  var Currency = class _Currency extends Enum {
    #precision;
    #alternateDescription;
    /**
        * @param {string} code - Currency code (e.g. "USD")
        * @param {string} description - The description (e.g. "US Dollar")
        * @param {number} precision - The number of decimal places possible for by a real world transaction.
        * @param {string=} alternateDescription
        */
    constructor(code, description, precision, alternateDescription) {
      super(code, description);
      argumentIsRequired(precision, "precision", Number);
      argumentIsValid(precision, "precision", integer, "is an integer");
      argumentIsOptional(alternateDescription, "alternateDescription", String);
      this.#precision = precision;
      this.#alternateDescription = alternateDescription || description;
    }
    /**
     * The maximum number of decimal places supported by a real world transaction.
     *
     * @public
     * @returns {number}
     */
    get precision() {
      return this.#precision;
    }
    /**
     * An alternate human-readable description.
     *
     * @public
     * @returns {string}
     */
    get alternateDescription() {
      return this.#alternateDescription;
    }
    /**
     * Given a code, returns the enumeration item.
     *
     * @public
     * @static
     * @param {string} code
     * @returns {Currency|null}
     */
    static parse(code) {
      const value = Enum.fromCode(_Currency, code);
      return value instanceof _Currency ? value : null;
    }
    /**
     * The Argentine Peso.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get ARS() {
      return ars;
    }
    /**
     * The Australian Dollar.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get AUD() {
      return aud;
    }
    /**
     * The Bermudian Dollar.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get BMD() {
      return bmd;
    }
    /**
     * The Brazilian Real.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get BRL() {
      return brl;
    }
    /**
     * The Bahamian Dollar.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get BSD() {
      return bsd;
    }
    /**
     * The Canadian Dollar.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get CAD() {
      return cad;
    }
    /**
     * The Swiss Franc.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get CHF() {
      return chf;
    }
    /**
     * The Chinese Yuan.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get CNY() {
      return cny;
    }
    /**
     * The Czech Koruna.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get CZK() {
      return czk;
    }
    /**
     * The Danish Krone.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get DKK() {
      return dkk;
    }
    /**
     * The Euro.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get EUR() {
      return eur;
    }
    /**
     * The Fijian Dollar.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get FJD() {
      return fjd;
    }
    /**
     * The British Pound.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get GBP() {
      return gbp;
    }
    /**
     * The British Penny.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get GBX() {
      return gbx;
    }
    /**
     * The Ghanaian Cedi.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get GHS() {
      return ghs;
    }
    /**
     * The Hong Kong Dollar.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get HKD() {
      return hkd;
    }
    /**
     * The Hungarian Forint.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get HUF() {
      return huf;
    }
    /**
     * The Indonesian Rupiah.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get IDR() {
      return idr;
    }
    /**
     * The Israeli New Shekel.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get ILS() {
      return ils;
    }
    /**
     * The Jordanian Dinar.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get JOD() {
      return jod;
    }
    /**
     * The Japanese Yen.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get JPY() {
      return jpy;
    }
    /**
     * The South Korean Won.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get KRW() {
      return krw;
    }
    /**
     * The Lebanese Pound.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get LBP() {
      return lbp;
    }
    /**
     * The Mexican Peso.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get MXN() {
      return mxn;
    }
    /**
     * The Malaysian Ringgit.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get MYR() {
      return myr;
    }
    /**
     * The Namibian Dollar.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get NAD() {
      return nad;
    }
    /**
     * The Nigerian Naira.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get NGN() {
      return ngn;
    }
    /**
     * The Norwegian Krone.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get NOK() {
      return nok;
    }
    /**
     * The New Zealand Dollar.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get NZD() {
      return nzd;
    }
    /**
     * The Peruvian Sol.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get PEN() {
      return pen;
    }
    /**
     * The Papua New Guinean Kina.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get PGK() {
      return pgk;
    }
    /**
     * The Philippine peso.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get PHP() {
      return php;
    }
    /**
     * The Polish Zloty.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get PLN() {
      return pln;
    }
    /**
     * The Russian Ruble.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get RUB() {
      return rub;
    }
    /**
     * The Russian Ruble (Old).
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get RUR() {
      return rur;
    }
    /**
     * The Swedish Krona.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get SEK() {
      return sek;
    }
    /**
     * The Singapore Dollar.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get SGD() {
      return sgd;
    }
    /**
     * The Thai Baht.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get THB() {
      return thb;
    }
    /**
     * The Turkish Lira.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get TRY() {
      return trx;
    }
    /**
     * The New Taiwan Dollar.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get TWD() {
      return twd;
    }
    /**
     * The US Dollar.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get USD() {
      return usd;
    }
    /**
     * The Uruguay Peso.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get UYI() {
      return uyi;
    }
    /**
     * The South African Rand.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get ZAR() {
      return zar;
    }
    /**
     * The Zambian Kwacha.
     *
     * @public
     * @static
     * @returns {Currency}
     */
    static get ZMW() {
      return zmw;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[Currency (code=${this.code})]`;
    }
  };
  var ars = new Currency("ARS", "Argentine Peso", 2, "ARS");
  var aud = new Currency("AUD", "Australian Dollar", 2, "AUD$");
  var bmd = new Currency("BMD", "Bermudian Dollar", 2, "BMD");
  var brl = new Currency("BRL", "Brazilian Real", 2, "BRL");
  var bsd = new Currency("BSD", "Bahamian Dollar", 2, "BSD");
  var cad = new Currency("CAD", "Canadian Dollar", 2, "CAD$");
  var chf = new Currency("CHF", "Swiss Franc", 2, "CHF");
  var cny = new Currency("CNY", "Chinese Yuan", 2, "CNY");
  var czk = new Currency("CZK", "Czech Koruna", 2, "CZK");
  var dkk = new Currency("DKK", "Danish Krone", 2, "DKK");
  var eur = new Currency("EUR", "Euro", 2, "EUR");
  var fjd = new Currency("FJD", "Fijian Dollar", 2, "FJD");
  var gbp = new Currency("GBP", "British Pound", 2, "GBP");
  var gbx = new Currency("GBX", "British Penny", 2, "GBX");
  var ghs = new Currency("GHS", "Ghanaian Cedi", 2, "GHS");
  var hkd = new Currency("HKD", "Hong Kong Dollar", 2, "HK$");
  var huf = new Currency("HUF", "Hungarian Forint", 2, "HUF");
  var idr = new Currency("IDR", "Indonesian Rupiah", 2, "IDR");
  var ils = new Currency("ILS", "Israeli New Shekel", 2, "ILS");
  var jod = new Currency("JOD", "Jordanian Dinar", 2, "JOD");
  var jpy = new Currency("JPY", "Japanese Yen", 2, "JPY");
  var krw = new Currency("KRW", "South Korean Won", 2, "KRW");
  var lbp = new Currency("LBP", "Lebanese Pound", 2, "LBP");
  var mxn = new Currency("MXN", "Mexican Peso", 2, "MXN");
  var myr = new Currency("MYR", "Malaysian Ringgit", 2, "MYR");
  var nad = new Currency("NAD", "Namibian Dollar", 2, "NAD");
  var ngn = new Currency("NGN", "Nigerian Naira", 2, "NGN");
  var nok = new Currency("NOK", "Norwegian Krone", 2, "Nkr");
  var nzd = new Currency("NZD", "New Zealand Dollar", 2, "NZD");
  var pen = new Currency("PEN", "Peruvian Sol", 2, "PEN");
  var pgk = new Currency("PGK", "Papua New Guinean Kina", 2, "PGK");
  var php = new Currency("PHP", "Philippine peso", 2, "PHP");
  var pln = new Currency("PLN", "Polish Zloty", 2, "PLN");
  var rub = new Currency("RUB", "Russian Ruble", 2, "RUB");
  var rur = new Currency("RUR", "Russian Ruble (Old)", 2, "RUR");
  var sek = new Currency("SEK", "Swedish Krona", 2, "SEK");
  var sgd = new Currency("SGD", "Singapore Dollar", 2, "SGD");
  var thb = new Currency("THB", "Thai Baht", 2, "THB");
  var trx = new Currency("TRY", "Turkish Lira", 2, "TRY");
  var twd = new Currency("TWD", "New Taiwan Dollar", 2, "TWD");
  var usd = new Currency("USD", "US Dollar", 2, "US$");
  var uyi = new Currency("UYI", "Uruguay Peso", 2, "UYI");
  var zar = new Currency("ZAR", "South African Rand", 2, "ZAR");
  var zmw = new Currency("ZMW", "Zambian Kwacha", 2, "ZMW");

  // test/specs/lang/CurrencySpec.js
  describe("When Currency values are used", () => {
    "use strict";
    const codes = [
      "ARS",
      "AUD",
      "BMD",
      "BRL",
      "BSD",
      "CAD",
      "CHF",
      "CNY",
      "CZK",
      "DKK",
      "EUR",
      "FJD",
      "GBP",
      "GBX",
      "GHS",
      "HKD",
      "HUF",
      "IDR",
      "ILS",
      "JOD",
      "JPY",
      "KRW",
      "LBP",
      "MXN",
      "MYR",
      "NAD",
      "NGN",
      "NOK",
      "NZD",
      "PEN",
      "PGK",
      "PHP",
      "PLN",
      "RUB",
      "RUR",
      "SEK",
      "SGD",
      "THB",
      "TRY",
      "TWD",
      "USD",
      "UYI",
      "ZAR",
      "ZMW"
    ];
    codes.forEach((code) => {
      it(`should expose ${code}`, () => {
        expect({
          instance: Currency[code] instanceof Currency,
          code: Currency[code].code,
          parsed: Currency.parse(code)
        }).toEqual({
          instance: true,
          code,
          parsed: Currency[code]
        });
      });
    });
    it("should expose precision and alternate description", () => {
      expect({
        precision: Currency.USD.precision,
        alternateDescription: Currency.USD.alternateDescription
      }).toEqual({
        precision: 2,
        alternateDescription: "US$"
      });
    });
    it("should return null for unknown codes", () => {
      expect(Currency.parse("UNKNOWN")).toBeNull();
    });
    it("should accept valid constructor arguments", () => {
      expect(() => new Currency("XTS", "Test", 2, "Test$")).not.toThrow();
    });
    it("should reject invalid precision", () => {
      expect(() => new Currency("XTS", "Test", 2.5)).toThrow();
    });
  });

  // lang/memoize.js
  function simple(fn2) {
    const cache2 = {};
    return (x) => {
      if (!Object.prototype.hasOwnProperty.call(cache2, x)) {
        cache2[x] = fn2(x);
      }
      return cache2[x];
    };
  }
  function cache(fn2, duration) {
    argumentIsRequired(fn2, "fn", Function);
    argumentIsOptional(duration, "duration", Number);
    const durationToUse = duration || 0;
    let executionTime = null;
    let cacheResult = null;
    return () => {
      const currentTime = (/* @__PURE__ */ new Date()).getTime();
      if (executionTime === null || durationToUse > 0 && currentTime > executionTime + durationToUse) {
        executionTime = currentTime;
        cacheResult = fn2();
      }
      return cacheResult;
    };
  }

  // lang/Rate.js
  var Rate = class _Rate {
    #decimal;
    #float;
    #numerator;
    #denominator;
    /**
     * @param {number|string|Decimal} value - The rate
     * @param {Currency} numerator - The quote currency
     * @param {Currency} denominator - The base currency
     */
    constructor(value, numerator, denominator) {
      argumentIsRequired(numerator, "numerator", Currency, "Currency");
      argumentIsRequired(denominator, "denominator", Currency, "Currency");
      if (numerator === denominator) {
        throw new Error("A rate cannot use two identical currencies.");
      }
      if (number(value)) {
        this.#decimal = null;
        this.#float = value;
      } else if (value instanceof Decimal) {
        this.#decimal = value;
        this.#float = null;
      } else {
        this.#decimal = new Decimal(value);
        this.#float = null;
      }
      if (this.#float !== null && !(this.#float > 0) || this.#decimal !== null && !this.#decimal.getIsPositive()) {
        throw new Error("Rate value must be positive.");
      }
      this.#numerator = numerator;
      this.#denominator = denominator;
    }
    /**
     * The rate (as a {@link Decimal}) instance.
     *
     * @public
     * @returns {Decimal}
     */
    get decimal() {
      if (this.#decimal === null) {
        this.#decimal = new Decimal(this.float);
      }
      return this.#decimal;
    }
    /**
     * The rate (as a floating point number).
     *
     * @public
     * @returns {number}
     */
    get float() {
      if (this.#float === null) {
        this.#float = this.#decimal.toNumber();
      }
      return this.#float;
    }
    /**
     * The numerator (i.e. quote) currency. In other words,
     * this is EUR of the EURUSD pair.
     *
     * @public
     * @returns {Currency}
     */
    get numerator() {
      return this.#numerator;
    }
    /**
     * The quote (i.e. numerator) currency. In other words,
     * this is EUR of the EURUSD pair.
     *
     * @public
     * @returns {Currency}
     */
    get quote() {
      return this.#numerator;
    }
    /**
     * The denominator (i.e. base) currency. In other words,
     * this is USD of the EURUSD pair.
     *
     * @public
     * @returns {Currency}
     */
    get denominator() {
      return this.#denominator;
    }
    /**
     * The base (i.e. denominator) currency. In other words,
     * this is USD of the EURUSD pair.
     *
     * @public
     * @returns {Currency}
     */
    get base() {
      return this.#denominator;
    }
    /**
     * Returns the equivalent rate with the numerator and denominator (i.e. the quote and base)
     * currencies.
     *
     * @public
     * @returns {Rate}
     */
    invert() {
      let inverted;
      if (this.#decimal === null) {
        inverted = 1 / this.#float;
      } else {
        inverted = Decimal.ONE.divide(this.decimal);
      }
      return new _Rate(inverted, this.#denominator, this.#numerator);
    }
    /**
     * Formats the currency pair as a string (e.g. "EURUSD" or "^EURUSD").
     *
     * @public
     * @param {boolean=} useCarat - If true, a carat is used as a prefix to the resulting string.
     * @returns {string}
     */
    formatPair(useCarat) {
      argumentIsOptional(useCarat, "useCarat", Boolean);
      return `${useCarat ? "^" : ""}${this.#numerator.code}${this.#denominator.code}`;
    }
    /**
     * Returns the Barchart symbol for the exchange rate.
     *
     * @public
     * @return {string}
     */
    getSymbol() {
      return `^${this.denominator.code}${this.numerator.code}`;
    }
    /**
     * Creates a {@link Rate} instance, when given a value
     *
     * @public
     * @static
     * @param {number|string|Decimal} value - The rate.
     * @param {string} symbol - A string that can be parsed as a currency pair.
     * @returns {Rate}
     */
    static fromPair(value, symbol) {
      argumentIsRequired(symbol, "symbol", String);
      const pair = parsePair(symbol);
      return new _Rate(value, Currency.parse(pair.numerator), Currency.parse(pair.denominator));
    }
    /**
     * Given a {@link Decimal} value in a known currency, output
     * a {@link Decimal} converted to an alternate currency.
     *
     * @public
     * @static
     * @param {Decimal} amount - The amount to convert.
     * @param {Currency} currency - The currency of the amount.
     * @param {Currency} desiredCurrency - The currency to convert to.
     * @param {...Rate} rates - A list of exchange rates to be used for the conversion.
     * @returns {Decimal}
     */
    static convert(amount, currency, desiredCurrency, ...rates) {
      argumentIsRequired(amount, "amount", Decimal, "Decimal");
      argumentIsRequired(currency, "currency", Currency, "Currency");
      argumentIsRequired(desiredCurrency, "desiredCurrency", Currency, "Currency");
      if (currency === desiredCurrency) {
        return amount;
      }
      if (currency === Currency.GBX) {
        const gbp2 = convert(amount, Currency.GBX, Currency.GBP, [GBPGBX]);
        return convert(gbp2, Currency.GBP, desiredCurrency, rates);
      }
      if (desiredCurrency === Currency.GBX) {
        const gbp2 = convert(amount, currency, Currency.GBP, [GBXGBP, ...rates]);
        return convert(gbp2, Currency.GBP, Currency.GBX, [GBXGBP]);
      }
      return convert(amount, currency, desiredCurrency, rates);
    }
    /**
     * Returns a list of rates which do no change.
     *
     * @public
     * @static
     * @returns {Rate[]}
     */
    static getStaticRates() {
      return [new _Rate(GBXGBP.float, GBXGBP.numerator, GBXGBP.denominator)];
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[Rate]`;
    }
  };
  var pairExpression = /^\^?([A-Z]{3})([A-Z]{3})$/;
  var parsePair = simple((symbol) => {
    const match = symbol.match(pairExpression);
    if (match === null) {
      throw new Error('The "pair" argument cannot be parsed.');
    }
    return {
      numerator: match[2],
      denominator: match[1]
    };
  });
  function convert(amount, currency, desiredCurrency, rates) {
    if (currency === desiredCurrency) {
      return amount;
    }
    const numerator = desiredCurrency;
    const denominator = currency;
    let rate = rates.find((r) => r.numerator === numerator && r.denominator === denominator || r.numerator === denominator && r.denominator === numerator);
    if (rate && rate.numerator === denominator) {
      rate = rate.invert();
    }
    if (!rate) {
      throw new Error("Unable to perform conversion, given the rates provided.");
    }
    return amount.multiply(rate.decimal);
  }
  var GBPGBX = Rate.fromPair(100, "^GBPGBX");
  var GBXGBP = Rate.fromPair(0.01, "^GBXGBP");

  // lang/CurrencyTranslator.js
  var CurrencyTranslator = class {
    #translators;
    #maps;
    /**
     * @param {string[]} symbols - Forex symbols which will be used for translations.
     */
    constructor(symbols) {
      argumentIsArray(symbols, "symbols", String);
      this.#translators = solve(symbols);
      this.#maps = {};
      this.#maps.rates = /* @__PURE__ */ new Map();
      this.#maps.translation = /* @__PURE__ */ new Map();
      this.#translators.forEach((translator) => {
        const path = translator.path;
        path.forEach((edge) => {
          const from = edge.from.data;
          const to = edge.to.data;
          if (!this.#maps.rates.has(from)) {
            this.#maps.rates.set(from, /* @__PURE__ */ new Map());
          }
          if (!this.#maps.rates.get(from).has(to)) {
            this.#maps.rates.get(from).set(to, { edge, translators: [] });
          }
          this.#maps.rates.get(from).get(to).translators.push(translator);
        });
      });
      this.#translators.forEach((translator) => {
        const from = translator.from;
        const to = translator.to;
        if (!this.#maps.translation.has(from)) {
          this.#maps.translation.set(from, /* @__PURE__ */ new Map());
        }
        this.#maps.translation.get(from).set(to, translator);
      });
    }
    /**
     * Updates the calculator with new rates.
     *
     * @public
     * @param {Rate[]} rates
     */
    setRates(rates) {
      rates.forEach((rate) => {
        this.setRate(rate);
      });
    }
    /**
     * Updates the calculator with a new rate.
     *
     * @public
     * @param {Rate} rate
     */
    setRate(rate) {
      argumentIsRequired(rate, "rate", Rate, "Rate");
      this.#updateRate(rate);
      this.#updateRate(rate.invert());
    }
    /**
     * Performs a currency translation, using the rates previously supplied to
     * the calculator.
     *
     * @public
     * @param {number|Decimal} amount
     * @param {Currency} current
     * @param {Currency} desired
     * @returns {number|Decimal}
     */
    translate(amount, current, desired) {
      argumentIsRequired(current, "current", Currency, "Currency");
      argumentIsRequired(desired, "desired", Currency, "Currency");
      if (current === desired) {
        return amount;
      }
      return this.#maps.translation.get(current).get(desired).translate(amount);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[CurrencyTranslator]`;
    }
    #updateRate(rate) {
      const from = rate.base;
      const to = rate.quote;
      const data = this.#maps.rates.get(from).get(to);
      const current = data.edge.data.rate;
      if (current !== null && current === rate.float) {
        return;
      }
      data.edge.data.rate = rate.float;
      data.translators.forEach((t) => t.clear());
    }
  };
  var pairExpression2 = /^\^?([A-Z]{3})([A-Z]{3})$/;
  var parsePair2 = simple((symbol) => {
    const match = symbol.match(pairExpression2);
    if (match === null) {
      throw new Error('The "pair" argument cannot be parsed.');
    }
    return {
      quote: Currency.parse(match[1]),
      base: Currency.parse(match[2])
    };
  });
  var solve = (symbols) => {
    const vertices = /* @__PURE__ */ new Map();
    const getVertex = (currency, create2) => {
      if (create2 && !vertices.has(currency)) {
        vertices.set(currency, new Vertex(currency));
      }
      return vertices.get(currency) || null;
    };
    const graph = (currencyA, currencyB) => {
      const vertexA = getVertex(currencyA, true);
      const vertexB = getVertex(currencyB, true);
      if (!vertexA.hasEdge(vertexB)) {
        vertexA.addEdge(vertexB, { rate: null });
      }
    };
    const currencies = /* @__PURE__ */ new Set();
    symbols.forEach((symbol) => {
      const pair = parsePair2(symbol);
      currencies.add(pair.quote);
      currencies.add(pair.base);
      graph(pair.quote, pair.base);
      graph(pair.base, pair.quote);
    });
    const translators = [];
    currencies.forEach((currencyA) => {
      currencies.forEach((currencyB) => {
        if (currencyA === currencyB) {
          return;
        }
        const vertexA = getVertex(currencyA, false);
        const vertexB = getVertex(currencyB, false);
        const candidates = vertexA.getPaths(vertexB);
        if (candidates.length === 0) {
          console.warn(`Unable to find path for [ ${currencyA.code} ] to [ ${currencyB.code} ]`);
          return;
        }
        candidates.sort(pathComparator);
        translators.push(new Translator(candidates[0]));
      });
    });
    return translators;
  };
  var Translator = class {
    #path;
    #factors;
    constructor(path) {
      argumentIsArray(path, "path", Edge, "Edge");
      this.#path = path;
      this.#factors = {};
      this.#factors.float = null;
      this.#factors.decimal = null;
    }
    /**
     * The currency of the input value.
     *
     * @public
     * @returns {Currency}
     */
    get from() {
      return first(this.#path).from.data;
    }
    /**
     * The currency of the output value.
     *
     * @public
     * @returns {Currency}
     */
    get to() {
      return last2(this.#path).to.data;
    }
    /**
     * The graph edges (steps) used to convert from the source
     * currency to the desired currency.
     *
     * @public
     * @returns {Edge[]}
     */
    get path() {
      return this.#path.slice(0);
    }
    /**
     * Clears the cached factor used to convert values.
     *
     * @public
     */
    clear() {
      this.#factors.float = null;
      this.#factors.decimal = null;
    }
    /**
     * Translates an amount in the source currency to the desired currency.
     *
     * @public
     * @param {number|Decimal} amount
     * @returns {number|Decimal}
     */
    translate(amount) {
      const ready = this.#checkFactors();
      if (!ready) {
        throw new Error(`Unable to translate from [ ${this.from.code} ] to [ ${this.to.code} ], exchange rate is unknown.`);
      }
      if (amount instanceof Decimal) {
        return amount.multiply(this.#factors.decimal);
      } else {
        return amount * this.#factors.float;
      }
    }
    toString() {
      return `[Translator (path=${this.#path.map((edge) => `${edge.from.code} > ${edge.to.code}`).join()})]`;
    }
    #checkFactors() {
      if (this.#factors.float !== null) {
        return true;
      }
      let factor = 1;
      for (let i = 0; i < this.#path.length; i++) {
        const edge = this.#path[i];
        if (edge.data.rate === null) {
          return false;
        }
        factor = factor * edge.data.rate;
      }
      this.#factors.float = factor;
      this.#factors.decimal = Decimal.parse(factor);
      return true;
    }
  };
  var pathComparator = ComparatorBuilder.startWith((a, b) => compareNumbers(a.length, b.length)).toComparator();

  // test/specs/lang/CurrencyTranslatorSpec.js
  describe("When a CurrencyTranslator is created with ^AUDUSD and ^CADUSD", () => {
    "use strict";
    let translator;
    beforeEach(() => {
      translator = new CurrencyTranslator(["^AUDUSD", "^CADUSD"]);
    });
    describe("and translations are performed before rates are initialized", () => {
      it("Direct translation of 0 AUD to USD should yield 0 USD", () => {
        expect(() => translator.translate(0, Currency.AUD, Currency.USD)).toThrow();
      });
    });
    describe("and rates are initialized (^AUDUSD to 0.6656 and ^CADUSD to 0.7230)", () => {
      beforeEach(() => {
        translator.setRates([
          Rate.fromPair(0.6656, "^AUDUSD"),
          Rate.fromPair(0.723, "^CADUSD")
        ]);
      });
      it("clear should allow rates to be recomputed on the next translation", () => {
        translator.setRate(Rate.fromPair(0.68, "^AUDUSD"));
        expect(translator.translate(1, Currency.AUD, Currency.USD)).toBeCloseTo(0.68, 4);
      });
      describe("and translations are performed (on floats)", () => {
        it("Direct translation of of a float should return a float", () => {
          expect(typeof translator.translate(123.456, Currency.AUD, Currency.USD)).toEqual("number");
        });
        it("Direct translation of 0 AUD to USD should yield 0 USD", () => {
          expect(translator.translate(0, Currency.AUD, Currency.USD)).toBeCloseTo(0, 4);
        });
        it("Direct translation of 1 AUD to USD should yield 0.6656 USD", () => {
          expect(translator.translate(1, Currency.AUD, Currency.USD)).toBeCloseTo(0.6656, 4);
        });
        it("Direct translation of 1 USD to AUD should yield 1.3831 AUD", () => {
          expect(translator.translate(1, Currency.USD, Currency.AUD)).toBeCloseTo(1.5024, 4);
        });
        it("Direct translation of 1 CAD to USD should yield 0.7230 USD", () => {
          expect(translator.translate(1, Currency.CAD, Currency.USD)).toBeCloseTo(0.723, 4);
        });
        it("Direct translation of 1 USD to CAD should yield 1.3831 CAD", () => {
          expect(translator.translate(1, Currency.USD, Currency.CAD)).toBeCloseTo(1.3831, 4);
        });
        it("Indirect translation of 0 AUD to CAD should yield 0 CAD", () => {
          expect(translator.translate(0, Currency.AUD, Currency.CAD)).toBeCloseTo(0, 4);
        });
        it("Indirect translation of 1 AUD to CAD should yield 0.9206 CAD", () => {
          expect(translator.translate(1, Currency.AUD, Currency.CAD)).toBeCloseTo(0.9206, 4);
        });
        it("Indirect translation of 1 CAD to AUD should yield 1.0862 AUD", () => {
          expect(translator.translate(1, Currency.CAD, Currency.AUD)).toBeCloseTo(1.0862, 4);
        });
      });
      describe("and translations are performed (on Decimal instances)", () => {
        it("Direct translation of of a Decimal should return a Decimal", () => {
          expect(translator.translate(new Decimal(123.456), Currency.AUD, Currency.USD) instanceof Decimal).toBeTrue();
        });
        it("Direct translation of 0 AUD to USD should yield 0 USD", () => {
          expect(translator.translate(new Decimal(0), Currency.AUD, Currency.USD).toNumber()).toBeCloseTo(0, 4);
        });
        it("Direct translation of 1 AUD to USD should yield 0.6656 USD", () => {
          expect(translator.translate(new Decimal(1), Currency.AUD, Currency.USD).toNumber()).toBeCloseTo(0.6656, 4);
        });
        it("Direct translation of 1 USD to AUD should yield 1.3831 AUD", () => {
          expect(translator.translate(new Decimal(1), Currency.USD, Currency.AUD).toNumber()).toBeCloseTo(1.5024, 4);
        });
        it("Direct translation of 1 CAD to USD should yield 0.7230 USD", () => {
          expect(translator.translate(new Decimal(1), Currency.CAD, Currency.USD).toNumber()).toBeCloseTo(0.723, 4);
        });
        it("Direct translation of 1 USD to CAD should yield 1.3831 CAD", () => {
          expect(translator.translate(new Decimal(1), Currency.USD, Currency.CAD).toNumber()).toBeCloseTo(1.3831, 4);
        });
        it("Indirect translation of 0 AUD to CAD should yield 0 CAD", () => {
          expect(translator.translate(new Decimal(0), Currency.AUD, Currency.CAD).toNumber()).toBeCloseTo(0, 4);
        });
        it("Indirect translation of 1 AUD to CAD should yield 0.9206 CAD", () => {
          expect(translator.translate(new Decimal(1), Currency.AUD, Currency.CAD).toNumber()).toBeCloseTo(0.9206, 4);
        });
        it("Indirect translation of 1 CAD to AUD should yield 1.0862 AUD", () => {
          expect(translator.translate(new Decimal(1), Currency.CAD, Currency.AUD).toNumber()).toBeCloseTo(1.0862, 4);
        });
      });
      describe("and one rate changes (^AUDUSD to 0.6800)", () => {
        beforeEach(() => {
          translator.setRates([
            Rate.fromPair(0.68, "^AUDUSD")
          ]);
        });
        describe("and translations are performed (on floats)", () => {
          it("Direct translation of 0 AUD to USD should yield 0.6800 USD", () => {
            expect(translator.translate(0, Currency.AUD, Currency.USD)).toBeCloseTo(0, 4);
          });
          it("Direct translation of 1 AUD to USD should yield 0.6800 USD", () => {
            expect(translator.translate(1, Currency.AUD, Currency.USD)).toBeCloseTo(0.68, 4);
          });
          it("Direct translation of 1 USD to AUD should yield 1.4706 CAD", () => {
            expect(translator.translate(1, Currency.USD, Currency.AUD)).toBeCloseTo(1.4706, 4);
          });
          it("Direct translation of 1 CAD to USD should yield 0.7230 USD", () => {
            expect(translator.translate(1, Currency.CAD, Currency.USD)).toBeCloseTo(0.723, 4);
          });
          it("Direct translation of 1 USD to CAD should yield 1.3831 CAD", () => {
            expect(translator.translate(1, Currency.USD, Currency.CAD)).toBeCloseTo(1.3831, 4);
          });
          it("Indirect translation of 0 AUD to CAD should yield 0.9405 CAD", () => {
            expect(translator.translate(0, Currency.AUD, Currency.CAD)).toBeCloseTo(0, 4);
          });
          it("Indirect translation of 1 AUD to CAD should yield 0.9405 CAD", () => {
            expect(translator.translate(1, Currency.AUD, Currency.CAD)).toBeCloseTo(0.9405, 4);
          });
          it("Indirect translation of 1 CAD to AUD should yield 1.0632 AUD", () => {
            expect(translator.translate(1, Currency.CAD, Currency.AUD)).toBeCloseTo(1.0632, 4);
          });
        });
        describe("and translations are performed (on Decimal instances)", () => {
          it("Direct translation of 0 AUD to USD should yield 0.6800 USD", () => {
            expect(translator.translate(new Decimal(0), Currency.AUD, Currency.USD).toNumber()).toBeCloseTo(0, 4);
          });
          it("Direct translation of 1 AUD to USD should yield 0.6800 USD", () => {
            expect(translator.translate(new Decimal(1), Currency.AUD, Currency.USD).toNumber()).toBeCloseTo(0.68, 4);
          });
          it("Direct translation of 1 USD to AUD should yield 1.4706 CAD", () => {
            expect(translator.translate(new Decimal(1), Currency.USD, Currency.AUD).toNumber()).toBeCloseTo(1.4706, 4);
          });
          it("Direct translation of 1 CAD to USD should yield 0.7230 USD", () => {
            expect(translator.translate(new Decimal(1), Currency.CAD, Currency.USD).toNumber()).toBeCloseTo(0.723, 4);
          });
          it("Direct translation of 1 USD to CAD should yield 1.3831 CAD", () => {
            expect(translator.translate(new Decimal(1), Currency.USD, Currency.CAD).toNumber()).toBeCloseTo(1.3831, 4);
          });
          it("Indirect translation of 0 AUD to CAD should yield 0.9405 CAD", () => {
            expect(translator.translate(new Decimal(0), Currency.AUD, Currency.CAD).toNumber()).toBeCloseTo(0, 4);
          });
          it("Indirect translation of 1 AUD to CAD should yield 0.9405 CAD", () => {
            expect(translator.translate(new Decimal(1), Currency.AUD, Currency.CAD).toNumber()).toBeCloseTo(0.9405, 4);
          });
          it("Indirect translation of 1 CAD to AUD should yield 1.0632 AUD", () => {
            expect(translator.translate(new Decimal(1), Currency.CAD, Currency.AUD).toNumber()).toBeCloseTo(1.0632, 4);
          });
        });
      });
    });
  });
  describe("When a CurrencyTranslator is created with ^AUDUSD and ^USDEUR", () => {
    "use strict";
    let translator;
    beforeEach(() => {
      translator = new CurrencyTranslator(["^AUDUSD", "^USDEUR"]);
    });
    describe("and rates are initialized (^AUDUSD to 0.6 and ^USDEUR to 0.9)", () => {
      beforeEach(() => {
        translator.setRates([
          Rate.fromPair(0.6, "^AUDUSD"),
          Rate.fromPair(0.9, "^USDEUR")
        ]);
      });
      describe("and translations are performed (on floats)", () => {
        it("Direct translation of 1 AUD to USD should yield 0.6 USD", () => {
          expect(translator.translate(1, Currency.AUD, Currency.USD)).toBeCloseTo(0.6, 4);
        });
        it("Indirect translation of 1 AUD to EUR should yield 0.54 EUR", () => {
          expect(translator.translate(1, Currency.AUD, Currency.EUR)).toBeCloseTo(0.54, 4);
        });
      });
      describe("and one rate changes (^AUDUSD to 0.7)", () => {
        beforeEach(() => {
          translator.setRates([
            Rate.fromPair(0.7, "^AUDUSD")
          ]);
        });
        describe("and translations are performed (on floats)", () => {
          it("Direct translation of 1 AUD to USD should yield 0.7 USD", () => {
            expect(translator.translate(1, Currency.AUD, Currency.USD)).toBeCloseTo(0.7, 4);
          });
          it("Indirect translation of 1 AUD to EUR should yield 0.63 EUR", () => {
            expect(translator.translate(1, Currency.AUD, Currency.EUR)).toBeCloseTo(0.63, 4);
          });
        });
      });
    });
  });

  // test/specs/lang/DayFormatTypeSpec.js
  describe("When DayFormatType values are used", () => {
    "use strict";
    describe("for YYYY_MM_DD format", () => {
      let match;
      beforeEach(() => {
        match = DayFormatType.YYYY_MM_DD.regex.exec("2026-06-17");
      });
      it("should parse year correctly", () => {
        expect(match[DayFormatType.YYYY_MM_DD.yearIndex]).toEqual("2026");
      });
      it("should parse month correctly", () => {
        expect(match[DayFormatType.YYYY_MM_DD.monthIndex]).toEqual("06");
      });
      it("should parse day correctly", () => {
        expect(match[DayFormatType.YYYY_MM_DD.dayIndex]).toEqual("17");
      });
      it("should have zero year shift", () => {
        expect(DayFormatType.YYYY_MM_DD.yearShift).toEqual(0);
      });
    });
    describe("for MM_DD_YYYY format", () => {
      let match;
      beforeEach(() => {
        match = DayFormatType.MM_DD_YYYY.regex.exec("06/17/2026");
      });
      it("should parse year correctly", () => {
        expect(match[DayFormatType.MM_DD_YYYY.yearIndex]).toEqual("2026");
      });
      it("should parse month correctly", () => {
        expect(match[DayFormatType.MM_DD_YYYY.monthIndex]).toEqual("06");
      });
      it("should parse day correctly", () => {
        expect(match[DayFormatType.MM_DD_YYYY.dayIndex]).toEqual("17");
      });
      it("should have zero year shift", () => {
        expect(DayFormatType.MM_DD_YYYY.yearShift).toEqual(0);
      });
    });
    describe("for MM_DD_YY format", () => {
      let match;
      beforeEach(() => {
        match = DayFormatType.MM_DD_YY.regex.exec("06/17/26");
      });
      it("should parse year correctly", () => {
        expect(match[DayFormatType.MM_DD_YY.yearIndex]).toEqual("26");
      });
      it("should parse month correctly", () => {
        expect(match[DayFormatType.MM_DD_YY.monthIndex]).toEqual("06");
      });
      it("should parse day correctly", () => {
        expect(match[DayFormatType.MM_DD_YY.dayIndex]).toEqual("17");
      });
      it("should have century-based year shift", () => {
        expect(DayFormatType.MM_DD_YY.yearShift).toEqual(Math.floor((/* @__PURE__ */ new Date()).getFullYear() / 100) * 100);
      });
    });
  });

  // test/specs/lang/DaySpec.js
  describe('When "2017-08-31 is parsed as a Day', () => {
    "use strict";
    let day;
    beforeEach(() => {
      day = Day.parse("2017-08-31");
    });
    it("the year should be 2017", () => {
      expect(day.year).toEqual(2017);
    });
    it("the month should be 8", () => {
      expect(day.month).toEqual(8);
    });
    it("the day should be 31", () => {
      expect(day.day).toEqual(31);
    });
    describe("and the Day instance is formatted", () => {
      it('should output be "2017-08-31"', () => {
        expect(day.format()).toEqual("2017-08-31");
      });
    });
  });
  describe('When "2017-08-31 is parsed as a Day (using DayFormatType.YYYY_MM_DD)', () => {
    "use strict";
    let day;
    beforeEach(() => {
      day = Day.parse("2017-08-31", DayFormatType.YYYY_MM_DD);
    });
    it("the year should be 2017", () => {
      expect(day.year).toEqual(2017);
    });
    it("the month should be 8", () => {
      expect(day.month).toEqual(8);
    });
    it("the day should be 31", () => {
      expect(day.day).toEqual(31);
    });
    describe("and the Day instance is formatted", () => {
      it('should output be "2017-08-31"', () => {
        expect(day.format()).toEqual("2017-08-31");
      });
    });
  });
  describe('When "08-31-2017 is parsed as a Day (using DayFormatType.MM_DD_YYYY)', () => {
    "use strict";
    let day;
    beforeEach(() => {
      day = Day.parse("08-31-2017", DayFormatType.MM_DD_YYYY);
    });
    it("the year should be 2017", () => {
      expect(day.year).toEqual(2017);
    });
    it("the month should be 8", () => {
      expect(day.month).toEqual(8);
    });
    it("the day should be 31", () => {
      expect(day.day).toEqual(31);
    });
    describe("and the Day instance is formatted", () => {
      it('should output be "2017-08-31"', () => {
        expect(day.format()).toEqual("2017-08-31");
      });
    });
  });
  describe('When "08-31-17 is parsed as a Day (using DayFormatType.MM_DD_YY)', () => {
    "use strict";
    let day;
    beforeEach(() => {
      day = Day.parse("08-31-17", DayFormatType.MM_DD_YY);
    });
    it("the year should be 2017", () => {
      expect(day.year).toEqual(2017);
    });
    it("the month should be 8", () => {
      expect(day.month).toEqual(8);
    });
    it("the day should be 31", () => {
      expect(day.day).toEqual(31);
    });
    describe("and the Day instance is formatted", () => {
      it('should output be "2017-08-31"', () => {
        expect(day.format()).toEqual("2017-08-31");
      });
    });
  });
  describe("When converting a Date (2017-11-16 at 17:40:01.002 local) to a Day", () => {
    "use strict";
    let date2;
    let day;
    beforeEach(() => {
      day = Day.fromDate(date2 = new Date(2017, 10, 16, 17, 40, 1, 2));
    });
    it("the year should be 2017", () => {
      expect(day.year).toEqual(2017);
    });
    it("the month should be 11", () => {
      expect(day.month).toEqual(11);
    });
    it("the day should be 16", () => {
      expect(day.day).toEqual(16);
    });
  });
  describe("When converting a Date (2017-11-16 at 23:40:01.002 local) to a UTC Day", () => {
    "use strict";
    let date2;
    let day;
    beforeEach(() => {
      day = Day.fromDateUtc(date2 = new Date(2017, 10, 16, 23, 40, 1, 2));
    });
    it("the year should be correct", () => {
      expect(day.year).toEqual(date2.getUTCFullYear());
    });
    it("the month should be correct", () => {
      expect(day.month).toEqual(date2.getUTCMonth() + 1);
    });
    it("the day should be correct", () => {
      expect(day.day).toEqual(date2.getUTCDate());
    });
  });
  describe("When an invalid string is parsed as a Day", () => {
    function parseDay(value) {
      return () => {
        Day.parse(value);
      };
    }
    it("an error should be thrown parsing a null value", () => {
      expect(parseDay(null)).toThrow();
    });
    it("an error should be thrown parsing a undefined value", () => {
      expect(parseDay(null)).toThrow();
    });
    it("an error should be thrown parsing a Date instance", () => {
      expect(parseDay(/* @__PURE__ */ new Date())).toThrow();
    });
    it("an error should be thrown parsing an object", () => {
      expect(parseDay({})).toThrow();
    });
    it("an error should be thrown parsing an number", () => {
      expect(parseDay((/* @__PURE__ */ new Date()).getTime())).toThrow();
    });
    it("an should be thrown when using 13 months", () => {
      expect(parseDay("2017-13-01")).toThrow();
    });
    it("an should be thrown when using 32 days in January", () => {
      expect(parseDay("2017-01-32")).toThrow();
    });
    it("an should be thrown when using 30 days in February", () => {
      expect(parseDay("2017-02-30")).toThrow();
    });
    it("an should be thrown when using 32 days in March", () => {
      expect(parseDay("2017-03-32")).toThrow();
    });
    it("an should be thrown when using 31 days in April", () => {
      expect(parseDay("2017-04-31")).toThrow();
    });
    it("an should be thrown when using 32 days in May", () => {
      expect(parseDay("2017-05-32")).toThrow();
    });
    it("an should be thrown when using 31 days in June", () => {
      expect(parseDay("2017-06-31")).toThrow();
    });
    it("an should be thrown when using 32 days in July", () => {
      expect(parseDay("2017-07-32")).toThrow();
    });
    it("an should be thrown when using 32 days in August", () => {
      expect(parseDay("2017-08-32")).toThrow();
    });
    it("an should be thrown when using 31 days in September", () => {
      expect(parseDay("2017-02-31")).toThrow();
    });
    it("an should be thrown when using 32 days in October", () => {
      expect(parseDay("2017-10-32")).toThrow();
    });
    it("an should be thrown when using 31 days in November", () => {
      expect(parseDay("2017-11-31")).toThrow();
    });
    it("an should be thrown when using 32 days in December", () => {
      expect(parseDay("2017-12-32")).toThrow();
    });
  });
  describe("When checking to see if a Day is valid", () => {
    "use strict";
    it("getDaysInMonth should return the expected number of days", () => {
      expect({
        jan: Day.getDaysInMonth(2017, 1),
        febCommon: Day.getDaysInMonth(2017, 2),
        febLeap: Day.getDaysInMonth(2020, 2),
        apr: Day.getDaysInMonth(2017, 4)
      }).toEqual({
        jan: 31,
        febCommon: 28,
        febLeap: 29,
        apr: 30
      });
    });
    it("should consider Jan 1, 2017 to be valid", () => {
      expect(Day.validate(2017, 1, 1)).toEqual(true);
    });
    it("should consider Dec 31, 2017 to be valid", () => {
      expect(Day.validate(2017, 12, 31)).toEqual(true);
    });
    it("should not consider Feb 29, 2017 to be valid", () => {
      expect(Day.validate(2017, 2, 29)).toEqual(false);
    });
    it("should not consider Feb 29, 2018 to be valid", () => {
      expect(Day.validate(2018, 2, 29)).toEqual(false);
    });
    it("should not consider Feb 29, 2019 to be valid", () => {
      expect(Day.validate(2019, 2, 29)).toEqual(false);
    });
    it("should consider Feb 29, 2020 to be valid", () => {
      expect(Day.validate(2020, 2, 29)).toEqual(true);
    });
  });
  describe("When adding (or subtracting) days to (or from) a Day", () => {
    "use strict";
    describe("when adding 1 day to January 1, 2017", () => {
      let then;
      beforeEach(() => {
        then = new Day(2017, 1, 1).addDays(1);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2017);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(1);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(2);
      });
    });
    describe("when adding 1 day to Feb 28, 2017", () => {
      let then;
      beforeEach(() => {
        then = new Day(2017, 2, 28).addDays(1);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2017);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(3);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(1);
      });
    });
    describe("when adding 1 day to Feb 28, 2020", () => {
      let then;
      beforeEach(() => {
        then = new Day(2020, 2, 28).addDays(1);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2020);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(2);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(29);
      });
    });
    describe("when adding 400 days to Jul 14, 2017", () => {
      let then;
      beforeEach(() => {
        then = new Day(2017, 7, 14).addDays(400);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2018);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(8);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(18);
      });
    });
    describe("when subtracting 1 day from Aug 19, 2017", () => {
      let then;
      beforeEach(() => {
        then = new Day(2017, 8, 19).subtractDays(1);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2017);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(8);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(18);
      });
    });
    describe("when adding 1 inverse day to Aug 19, 2017", () => {
      let then;
      beforeEach(() => {
        then = new Day(2017, 8, 19).addDays(1, true);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2017);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(8);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(18);
      });
    });
    describe("when adding -1 day to Aug 19, 2017", () => {
      let then;
      beforeEach(() => {
        then = new Day(2017, 8, 19).addDays(-1);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2017);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(8);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(18);
      });
    });
    describe("when subtracting 2 days from Aug 1, 2017", () => {
      let then;
      beforeEach(() => {
        then = new Day(2017, 8, 1).addDays(2, true);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2017);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(7);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(30);
      });
    });
    describe("when subtracting 10 days from Jan 10, 2018", () => {
      let then;
      beforeEach(() => {
        then = new Day(2018, 1, 10).addDays(10, true);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2017);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(12);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(31);
      });
    });
    describe("when subtracting 1 day from Mar 1, 2020", () => {
      let then;
      beforeEach(() => {
        then = new Day(2020, 3, 1).addDays(1, true);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2020);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(2);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(29);
      });
    });
    describe("when adding 0 days to Mar 1, 2020", () => {
      let then;
      beforeEach(() => {
        then = new Day(2020, 3, 1).addDays(0);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2020);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(3);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(1);
      });
    });
  });
  describe("When adding (or subtracting) months to (or from) a Day", () => {
    "use strict";
    describe("when adding 13 months to December 2, 2015", () => {
      let then;
      beforeEach(() => {
        then = new Day(2015, 12, 2).addMonths(13);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2017);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(1);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(2);
      });
    });
    describe("when subtracting 13 months from January 2, 2017", () => {
      let then;
      beforeEach(() => {
        then = new Day(2017, 1, 2).subtractMonths(13);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2015);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(12);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(2);
      });
    });
    describe("when adding a month to January 30, 2018", () => {
      let then;
      beforeEach(() => {
        then = new Day(2018, 1, 30).addMonths(1);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2018);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(2);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(28);
      });
    });
    describe("when subtracting a month from March 29, 2018", () => {
      let then;
      beforeEach(() => {
        then = new Day(2018, 3, 29).subtractMonths(1);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2018);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(2);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(28);
      });
    });
    describe("when adding a month to March 29, 2018", () => {
      let then;
      beforeEach(() => {
        then = new Day(2018, 3, 29).addMonths(1);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2018);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(4);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(29);
      });
    });
    describe("when subtracting a month from May 31, 2018", () => {
      let then;
      beforeEach(() => {
        then = new Day(2018, 5, 31).subtractMonths(1);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2018);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(4);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(30);
      });
    });
  });
  describe("When adding (or subtracting) years to (or from) a Day", () => {
    "use strict";
    describe("when adding 3 years to January 2, 2014", () => {
      let then;
      beforeEach(() => {
        then = new Day(2014, 1, 2).addYears(3);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2017);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(1);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(2);
      });
    });
    describe("when subtracting 3 years from January 2, 2017", () => {
      let then;
      beforeEach(() => {
        then = new Day(2017, 1, 2).subtractYears(3);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2014);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(1);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(2);
      });
    });
    describe("when adding 4 years to February 29, 2016", () => {
      let then;
      beforeEach(() => {
        then = new Day(2016, 2, 29).addYears(4);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2020);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(2);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(29);
      });
    });
    describe("when subtracting 4 years from February 29, 2020", () => {
      let then;
      beforeEach(() => {
        then = new Day(2020, 2, 29).subtractYears(4);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2016);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(2);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(29);
      });
    });
    describe("when adding 3 years to February 29, 2016", () => {
      let then;
      beforeEach(() => {
        then = new Day(2016, 2, 29).addYears(3);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2019);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(2);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(28);
      });
    });
    describe("when subtracting 3 years from February 28, 2019", () => {
      let then;
      beforeEach(() => {
        then = new Day(2019, 2, 28).subtractYears(3);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2016);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(2);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(28);
      });
    });
    describe("when subtracting 1 year from February 29, 2020", () => {
      let then;
      beforeEach(() => {
        then = new Day(2020, 2, 29).subtractYears(1);
      });
      it("should return the correct year", () => {
        expect(then.year).toEqual(2019);
      });
      it("should return the correct month", () => {
        expect(then.month).toEqual(2);
      });
      it("should return the correct day", () => {
        expect(then.day).toEqual(28);
      });
    });
  });
  describe('When "1900-01-01 is parsed as a Day', () => {
    "use strict";
    let day;
    beforeEach(() => {
      day = Day.parse("1900-01-01");
    });
    it("the year should be 1900", () => {
      expect(day.year).toEqual(1900);
    });
    it("the month should be 1", () => {
      expect(day.month).toEqual(1);
    });
    it("the day should be 1", () => {
      expect(day.day).toEqual(1);
    });
    describe("and 41635 days are added", () => {
      let future;
      beforeEach(() => {
        future = day.addDays(41635);
      });
      it("the year should be 2013", () => {
        expect(future.year).toEqual(2013);
      });
      it("the month should be 12", () => {
        expect(future.month).toEqual(12);
      });
      it("the day should be 29", () => {
        expect(future.day).toEqual(29);
      });
    });
  });
  describe("When comparing days", () => {
    it("toJSON should return the formatted day", () => {
      expect(Day.parse("2017-07-18").toJSON()).toEqual("2017-07-18");
    });
    it("compareDays should compare two Day instances", () => {
      expect({
        before: Day.compareDays(Day.parse("2017-07-18"), Day.parse("2017-07-19")) < 0,
        equal: Day.compareDays(Day.parse("2017-07-18"), Day.parse("2017-07-18")),
        after: Day.compareDays(Day.parse("2017-07-19"), Day.parse("2017-07-18")) > 0
      }).toEqual({
        before: true,
        equal: 0,
        after: true
      });
    });
    it('The day "2017-07-18" should be before "2017-07-19"', () => {
      expect(Day.parse("2017-07-18").getIsBefore(Day.parse("2017-07-19"))).toEqual(true);
    });
    it('The day "2017-07-18" should be before "2017-08-18"', () => {
      expect(Day.parse("2017-07-18").getIsBefore(Day.parse("2017-08-18"))).toEqual(true);
    });
    it('The day "2017-07-18" should be before "2018-07-18"', () => {
      expect(Day.parse("2017-07-18").getIsBefore(Day.parse("2018-07-18"))).toEqual(true);
    });
    it('The day "2017-07-18" should not be after "2017-07-19"', () => {
      expect(Day.parse("2017-07-18").getIsAfter(Day.parse("2017-07-19"))).toEqual(false);
    });
    it('The day "2017-07-18" should not be after "2017-08-18"', () => {
      expect(Day.parse("2017-07-18").getIsAfter(Day.parse("2017-08-18"))).toEqual(false);
    });
    it('The day "2017-07-18" should bit be after "2018-07-18"', () => {
      expect(Day.parse("2017-07-18").getIsAfter(Day.parse("2018-07-18"))).toEqual(false);
    });
    it('The day "2017-07-18" should not be before "2017-07-17"', () => {
      expect(Day.parse("2017-07-18").getIsBefore(Day.parse("2017-07-17"))).toEqual(false);
    });
    it('The day "2017-07-18" should not be before "2017-06-18"', () => {
      expect(Day.parse("2017-07-18").getIsBefore(Day.parse("2017-06-18"))).toEqual(false);
    });
    it('The day "2017-07-18" should not be before "2016-07-18"', () => {
      expect(Day.parse("2017-07-18").getIsBefore(Day.parse("2016-07-18"))).toEqual(false);
    });
    it('The day "2017-07-18" should be after "2017-07-17"', () => {
      expect(Day.parse("2017-07-18").getIsAfter(Day.parse("2017-07-17"))).toEqual(true);
    });
    it('The day "2017-07-18" should be after "2017-06-18"', () => {
      expect(Day.parse("2017-07-18").getIsAfter(Day.parse("2017-06-18"))).toEqual(true);
    });
    it('The day "2017-07-18" should be after "2016-07-18"', () => {
      expect(Day.parse("2017-07-18").getIsAfter(Day.parse("2016-07-18"))).toEqual(true);
    });
  });
  describe("When checking a days containment in a range of days", () => {
    let day;
    beforeEach(() => {
      day = new Day(2018, 3, 11);
    });
    it("should return true when the date is between the range boundaries", () => {
      expect(day.getIsContained(new Day(2018, 3, 10), new Day(2018, 3, 12))).toEqual(true);
    });
    it("should return true when the date is on the beginning boundary of the range", () => {
      expect(day.getIsContained(new Day(2018, 3, 11), new Day(2018, 3, 12))).toEqual(true);
    });
    it("should return true when the date is on the end boundary of the range", () => {
      expect(day.getIsContained(new Day(2018, 3, 10), new Day(2018, 3, 11))).toEqual(true);
    });
    it("should return true when no end boundary is specified, but the date is after the beginning boundary", () => {
      expect(day.getIsContained(new Day(2018, 3, 10))).toEqual(true);
    });
    it("should return true when no beginning boundary is specified, but the date is before the end boundary", () => {
      expect(day.getIsContained(null, new Day(2018, 3, 12))).toEqual(true);
    });
    it("should return true when no end boundary is specified, but the date is on the beginning boundary", () => {
      expect(day.getIsContained(new Day(2018, 3, 11))).toEqual(true);
    });
    it("should return true when no beginning boundary is specified, but the date is on the end boundary", () => {
      expect(day.getIsContained(null, new Day(2018, 3, 11))).toEqual(true);
    });
    it("should return false when the date is after range boundaries", () => {
      expect(day.getIsContained(new Day(2018, 3, 8), new Day(2018, 3, 10))).toEqual(false);
    });
    it("should return false when the date is after before boundaries", () => {
      expect(day.getIsContained(new Day(2018, 3, 12), new Day(2018, 3, 14))).toEqual(false);
    });
    it("should return false when no end boundary is specified, but the date is before the beginning boundary", () => {
      expect(day.getIsContained(new Day(2018, 3, 12))).toEqual(false);
    });
    it("should return false when no beginning boundary is specified, but the date is after the end boundary", () => {
      expect(day.getIsContained(null, new Day(2018, 3, 10))).toEqual(false);
    });
    it("should return false when the range is invalid", () => {
      expect(day.getIsContained(new Day(2018, 3, 12), new Day(2018, 3, 10))).toEqual(false);
    });
  });
  describe("When cloning a day", () => {
    let source;
    let clone2;
    beforeEach(() => {
      source = new Day(2018, 3, 11);
      clone2 = Day.clone(source);
    });
    it("the cloned instance should not be the same as the source instance", () => {
      expect(clone2).not.toBe(source);
    });
    it("the cloned year should be equal to the source year", () => {
      expect(clone2.year).toEqual(source.year);
    });
    it("the cloned month should be equal to the source month", () => {
      expect(clone2.year).toEqual(source.year);
    });
    it("the cloned day should be equal to the source day", () => {
      expect(clone2.year).toEqual(source.year);
    });
    it("the cloned instance should equal the source instance", () => {
      expect(source.getIsEqual(clone2)).toEqual(true);
    });
  });
  describe("When getting start of the month", () => {
    it("for 2018-02-28 should be 2018-02-01", () => {
      expect(new Day(2018, 2, 28).getStartOfMonth().getIsEqual(new Day(2018, 2, 1))).toEqual(true);
    });
    it("for 2018-03-30 should be 2018-03-01", () => {
      expect(new Day(2018, 3, 30).getStartOfMonth().getIsEqual(new Day(2018, 3, 1))).toEqual(true);
    });
    it("should not return the same object", () => {
      const d = new Day(2018, 2, 1);
      expect(d.getStartOfMonth()).not.toBe(d);
    });
  });
  describe("When getting end of the month", () => {
    it("for 2018-02-28 should be 2018-02-28", () => {
      expect(new Day(2018, 2, 28).getEndOfMonth().getIsEqual(new Day(2018, 2, 28))).toEqual(true);
    });
    it("for 2018-03-30 should be 2018-03-31", () => {
      expect(new Day(2018, 3, 30).getEndOfMonth().getIsEqual(new Day(2018, 3, 31))).toEqual(true);
    });
    it("should not return the same object", () => {
      const d = new Day(2018, 2, 28);
      expect(d.getEndOfMonth()).not.toBe(d);
    });
  });
  describe("When counting days between two Days", () => {
    it("the number of days between today and today should be zero", () => {
      expect(Day.countDaysBetween(Day.getToday(), Day.getToday())).toEqual(0);
    });
    it("the number of days between today and tomorrow should be one", () => {
      expect(Day.countDaysBetween(Day.getToday(), Day.getToday().addDays(1))).toEqual(1);
    });
    it("the number of days between yesterday and today should be one", () => {
      expect(Day.countDaysBetween(Day.getToday().subtractDays(1), Day.getToday())).toEqual(1);
    });
    it("the number of days between tomorrow and yesterday should be negative two", () => {
      expect(Day.countDaysBetween(Day.getToday().addDays(1), Day.getToday().subtractDays(1))).toEqual(-2);
    });
    it("the number of days between 2024-04-29 and 2024-04-30 should be one", () => {
      expect(Day.countDaysBetween(new Day(2024, 4, 29), new Day(2024, 4, 30))).toEqual(1);
    });
    it("the number of days between 2024-04-29 and 2024-05-01 should be two", () => {
      expect(Day.countDaysBetween(new Day(2024, 4, 29), new Day(2024, 5, 1))).toEqual(2);
    });
    it("the number of days between 2023-12-01 and 2023-12-31 should be 30", () => {
      expect(Day.countDaysBetween(new Day(2023, 12, 1), new Day(2023, 12, 31))).toEqual(30);
    });
    it("the number of days between 2023-12-01 and 2024-01-01 should be 31", () => {
      expect(Day.countDaysBetween(new Day(2023, 12, 1), new Day(2024, 1, 1))).toEqual(31);
    });
    it("the number of days between 2023-12-01 and 2024-02-01 should be 62", () => {
      expect(Day.countDaysBetween(new Day(2023, 12, 1), new Day(2024, 2, 1))).toEqual(62);
    });
    it("the number of days between 2000-01-01 and 2024-04-29 should be 8885", () => {
      expect(Day.countDaysBetween(new Day(2e3, 1, 1), new Day(2024, 4, 29))).toEqual(8885);
    });
    it("the number of days between 2024-04-29 and 2000-01-01 should be -8885", () => {
      expect(Day.countDaysBetween(new Day(2024, 4, 29), new Day(2e3, 1, 1))).toEqual(-8885);
    });
  });
  describe("When checking the name of a day", () => {
    it('the name of 2024-04-28 should be "Sunday"', () => {
      expect(new Day(2024, 4, 28).getName()).toEqual("Sunday");
    });
    it('the name of 2024-04-29 should be "Monday"', () => {
      expect(new Day(2024, 4, 29).getName()).toEqual("Monday");
    });
    it('the name of 2024-04-30 should be "Tuesday"', () => {
      expect(new Day(2024, 4, 30).getName()).toEqual("Tuesday");
    });
    it('the name of 2024-05-01 should be "Wednesday"', () => {
      expect(new Day(2024, 5, 1).getName()).toEqual("Wednesday");
    });
    it('the name of 2000-01-01 should be "Saturday"', () => {
      expect(new Day(2e3, 1, 1).getName()).toEqual("Saturday");
    });
    it('the name of 2013-08-21 should be "Wednesday"', () => {
      expect(new Day(2013, 8, 21).getName()).toEqual("Wednesday");
    });
  });

  // test/specs/lang/DecimalSpec.js
  describe("When adding values that cause floating point problems (e.g. 1.1 + 2.2 != 3.3)", () => {
    "use strict";
    let a;
    let b;
    let c;
    beforeEach(() => {
      a = new Decimal(1.1);
      b = new Decimal(2.2);
      c = a.add(b);
    });
    describe("and exported to a floating point value", () => {
      let f;
      beforeEach(() => {
        f = c.toFloat();
      });
      it("should sum to 3.3 (not 3.3000000000000003)", () => {
        expect(f).toEqual(3.3);
      });
    });
  });
  describe("When using Decimal arithmetic methods", () => {
    "use strict";
    it("subtract should return the difference", () => {
      expect(new Decimal(10).subtract(3).toNumber()).toEqual(7);
    });
    it("multiply should return the product", () => {
      expect(new Decimal(6).multiply(7).toNumber()).toEqual(42);
    });
    it("absolute should return a positive value", () => {
      expect(new Decimal(-5).absolute().toNumber()).toEqual(5);
    });
    it("opposite should return the opposite sign", () => {
      expect(new Decimal(5).opposite().toNumber()).toEqual(-5);
    });
  });
  describe("When using Decimal comparison methods", () => {
    "use strict";
    it("getIsGreaterThan should identify a greater value", () => {
      expect(new Decimal(10).getIsGreaterThan(9)).toEqual(true);
    });
    it("getIsGreaterThanOrEqual should identify an equal value", () => {
      expect(new Decimal(10).getIsGreaterThanOrEqual(10)).toEqual(true);
    });
    it("getIsLessThan should identify a lesser value", () => {
      expect(new Decimal(9).getIsLessThan(10)).toEqual(true);
    });
    it("getIsLessThanOrEqual should identify an equal value", () => {
      expect(new Decimal(10).getIsLessThanOrEqual(10)).toEqual(true);
    });
  });
  describe("When using Decimal JSON, constants, and static helpers", () => {
    "use strict";
    it("toJSON should return the fixed string value", () => {
      expect(new Decimal("1.23").toJSON()).toEqual("1.23");
    });
    it("ONE should equal one", () => {
      expect(Decimal.ONE.getIsEqual(1)).toEqual(true);
    });
    it("NEGATIVE_ONE should equal negative one", () => {
      expect(Decimal.NEGATIVE_ONE.getIsEqual(-1)).toEqual(true);
    });
    it("getIsNotZero should identify a non-zero value", () => {
      expect(Decimal.getIsNotZero(new Decimal(1))).toEqual(true);
    });
    it("getIsNotPositive should identify zero", () => {
      expect(Decimal.getIsNotPositive(Decimal.ZERO)).toEqual(true);
    });
    it("getIsNotNegative should identify zero", () => {
      expect(Decimal.getIsNotNegative(Decimal.ZERO)).toEqual(true);
    });
    it("compareDecimals should compare two Decimal instances", () => {
      expect({
        less: Decimal.compareDecimals(new Decimal(1), new Decimal(2)) < 0,
        equal: Decimal.compareDecimals(new Decimal(2), new Decimal(2)),
        greater: Decimal.compareDecimals(new Decimal(3), new Decimal(2)) > 0
      }).toEqual({
        less: true,
        equal: 0,
        greater: true
      });
    });
  });
  describe("When working with values that loss of precision occurs with floating point math (e.g. 100 trillion plus one third)", () => {
    "use strict";
    let a;
    let b;
    let c;
    beforeEach(() => {
      a = new Decimal(1e14);
      b = new Decimal(1 / 8);
      c = a.add(b);
    });
    describe("and exported to a fixed string", () => {
      let f;
      beforeEach(() => {
        f = c.toFixed();
      });
      it("should maintain precision", () => {
        expect(f).toEqual("100000000000000.125");
      });
    });
  });
  describe('When accessing the "Zero" singleton', () => {
    "use strict";
    let zero2;
    beforeEach(() => {
      zero2 = Decimal.ZERO;
    });
    it("should not be positive", () => {
      expect(zero2.getIsPositive()).toEqual(false);
    });
    it("should not be negative", () => {
      expect(zero2.getIsNegative()).toEqual(false);
    });
    it("should be zero", () => {
      expect(zero2.getIsZero()).toEqual(true);
    });
    it("should approximate zero", () => {
      expect(zero2.getIsZero(true)).toEqual(true);
    });
    it("the floating point export should equal zero", () => {
      expect(zero2.toFloat()).toEqual(0);
    });
    it('the fixed export should equal "0"', () => {
      expect(zero2.toFixed()).toEqual("0");
    });
    it('the number export should equal "0"', () => {
      expect(zero2.toNumber()).toEqual(0);
    });
  });
  describe("When instantiating a Decimal", () => {
    "use strict";
    describe("from an object", () => {
      it("should throw", () => {
        expect(() => {
          let d = new Decimal({});
        }).toThrow();
      });
    });
    describe("from a null value", () => {
      it("should throw", () => {
        expect(() => {
          let d = new Decimal(null);
        }).toThrow();
      });
    });
    describe("from an undefined value", () => {
      it("should throw", () => {
        expect(() => {
          let d = new Decimal(void 0);
        }).toThrow();
      });
    });
    describe("from the number forty two", () => {
      let d;
      beforeEach(() => {
        d = new Decimal(42);
      });
      it("should not be positive", () => {
        expect(d.getIsPositive()).toEqual(true);
      });
      it("should not be negative", () => {
        expect(d.getIsNegative()).toEqual(false);
      });
      it("should be zero", () => {
        expect(d.getIsZero()).toEqual(false);
      });
      it("should approximate zero", () => {
        expect(d.getIsZero(true)).toEqual(false);
      });
      it("the floating point export should equal the meaning of life", () => {
        expect(d.toFloat()).toEqual(42);
      });
      it('the fixed export should equal "42"', () => {
        expect(d.toFixed()).toEqual("42");
      });
      it('the number export should equal "0"', () => {
        expect(d.toNumber()).toEqual(42);
      });
      describe("and adding the number one", () => {
        let e;
        beforeEach(() => {
          e = d.add(1);
        });
        it("should return a Decimal instance", () => {
          expect(e instanceof Decimal).toEqual(true);
        });
        it("should be a different instance", () => {
          expect(e).not.toBe(d);
        });
        it("should equal forty three", () => {
          expect(e.toFloat()).toEqual(43);
        });
        it("should not mutate the original instance", () => {
          expect(d.toFloat()).toEqual(42);
        });
      });
      describe("and adding a Decimal having a value of one", () => {
        let e;
        let x;
        beforeEach(() => {
          e = d.add(x = new Decimal(1));
        });
        it("should return a Decimal instance", () => {
          expect(e instanceof Decimal).toEqual(true);
        });
        it("should be a different instance", () => {
          expect(e).not.toBe(d);
        });
        it("should equal forty three", () => {
          expect(e.toFloat()).toEqual(43);
        });
        it("should not mutate the original instance", () => {
          expect(d.toFloat()).toEqual(42);
        });
        it("should not mutate the operand", () => {
          expect(x.toFloat()).toEqual(1);
        });
      });
      describe("and dividing by zero", () => {
        it("should throw", () => {
          expect(() => {
            let e = d.divideBy(0);
          }).toThrow();
        });
      });
      describe("and modulo by zero", () => {
        it("should throw", () => {
          expect(() => {
            let e = d.mod(0);
          }).toThrow();
        });
      });
    });
    describe('from the string "1"', () => {
      let d;
      beforeEach(() => {
        d = new Decimal("1");
      });
      it("should be positive", () => {
        expect(d.getIsPositive()).toEqual(true);
      });
      it("should not be negative", () => {
        expect(d.getIsNegative()).toEqual(false);
      });
      it("should be zero", () => {
        expect(d.getIsZero()).toEqual(false);
      });
      it('the fixed export should equal "1"', () => {
        expect(d.toFixed()).toEqual("1");
      });
    });
    describe("from another Decimal", () => {
      let original;
      let copy;
      beforeEach(() => {
        original = new Decimal("1.234");
        copy = new Decimal(original);
      });
      it("the copied value should be equal to the original value", () => {
        expect(copy.getIsEqual(original)).toEqual(true);
      });
      it("the original value should be equal to the copied value", () => {
        expect(original.getIsEqual(copy)).toEqual(true);
      });
      it("the copied value should not be a reference to the original value", () => {
        expect(original === copy).toEqual(false);
      });
    });
  });
  describe("When checking for integers", () => {
    "use strict";
    it("should indicate a zero value is an integer", () => {
      expect(new Decimal("0").getIsInteger()).toEqual(true);
    });
    it("should indicate a value of one is an integer", () => {
      expect(new Decimal("1").getIsInteger()).toEqual(true);
    });
    it("should indicate a value of negative one is an integer", () => {
      expect(new Decimal("-1").getIsInteger()).toEqual(true);
    });
    it("should indicate a value of one and a half is not an integer", () => {
      expect(new Decimal("1.5").getIsInteger()).toEqual(false);
    });
    it("should indicate a value of slightly less than one is an not integer", () => {
      const numerator = new Decimal("999999999");
      const denominator = new Decimal("1000000000");
      expect(numerator.divide(denominator).getIsInteger()).toEqual(false);
    });
    it("should indicate a value of slightly greater than one is an not integer", () => {
      const numerator = new Decimal("1000000000");
      const denominator = new Decimal("999999999");
      expect(numerator.divide(denominator).getIsInteger()).toEqual(false);
    });
  });
  describe("When counting the number of decimal places", () => {
    "use strict";
    it("should indicate a value of zero has no decimal places", () => {
      expect(new Decimal("0").getDecimalPlaces()).toEqual(0);
    });
    it("should indicate a value of one has no decimal places", () => {
      expect(new Decimal("1").getDecimalPlaces()).toEqual(0);
    });
    it("should indicate a value of negative one has no decimal places", () => {
      expect(new Decimal("-1").getDecimalPlaces()).toEqual(0);
    });
    it("should indicate a value of negative twenty three has no decimal places", () => {
      expect(new Decimal("23").getDecimalPlaces()).toEqual(0);
    });
    it("should indicate a value of twenty three has no decimal places", () => {
      expect(new Decimal("-23").getDecimalPlaces()).toEqual(0);
    });
    it("should indicate a value of one tenth has one decimal places", () => {
      expect(new Decimal("0.1").getDecimalPlaces()).toEqual(1);
    });
    it("should indicate a value of negative one tenth has one decimal places", () => {
      expect(new Decimal("-0.1").getDecimalPlaces()).toEqual(1);
    });
    it("should indicate a value of one eighth has one decimal places", () => {
      expect(new Decimal("0.125").getDecimalPlaces()).toEqual(3);
    });
    it("should indicate a value of negative one eighth has one decimal places", () => {
      expect(new Decimal("-0.125").getDecimalPlaces()).toEqual(3);
    });
    it("should indicate a value of one hundredth has one decimal places", () => {
      expect(new Decimal("0.01").getDecimalPlaces()).toEqual(2);
    });
    it("should indicate a value of negative one hundredth has one decimal places", () => {
      expect(new Decimal("-0.01").getDecimalPlaces()).toEqual(2);
    });
    it('should indicate a value of "123.123456789012345678901234 has 24 decimal places', () => {
      expect(new Decimal("123.123456789012345678901234").getDecimalPlaces()).toEqual(24);
    });
    it('should indicate a value of "-123.123456789012345678901234 has 24 decimal places', () => {
      expect(new Decimal("-123.123456789012345678901234").getDecimalPlaces()).toEqual(24);
    });
  });
  describe("When checking for values that approximate zero", () => {
    "use strict";
    it('A value of "0.01" should approximate zero, when rounding to one decimal places', () => {
      expect(new Decimal("0.01").getIsZero(true, 1)).toEqual(true);
    });
    it('A value of "0.09" should not approximate zero, when rounding to one decimal places', () => {
      expect(new Decimal("0.09").getIsZero(true, 1)).toEqual(false);
    });
    it('A value of "0.01" should not approximate zero, when rounding is not specified', () => {
      expect(new Decimal("0.01").getIsZero(true)).toEqual(false);
    });
    it('A value of "0.09" should not approximate zero, when rounding is not specified', () => {
      expect(new Decimal("0.09").getIsZero(true)).toEqual(false);
    });
  });
  describe("When raising to a power", () => {
    "use strict";
    it("The value of 2 raised to 8 should be 256", () => {
      expect(new Decimal(2).raise(8).getIsEqual(256)).toEqual(true);
    });
    it("The value of 2 raised to -1 should be 0.5", () => {
      expect(new Decimal(2).raise(-1).getIsEqual(0.5)).toEqual(true);
    });
    it("The value of 2 raised to 0 should be 1", () => {
      expect(new Decimal(2).raise(0).getIsEqual(1)).toEqual(true);
    });
  });
  describe("When checking for values that approximate each other", () => {
    "use strict";
    it('A value of "1" should approximate a value of "1" (when using ten significant digits)', () => {
      expect(new Decimal("1").getIsApproximate(new Decimal("1"), 10)).toEqual(true);
    });
    it('A value of "10" should approximate a value of "10" (when using zero significant digits)', () => {
      expect(new Decimal("10").getIsApproximate(new Decimal("10"), 0)).toEqual(true);
    });
    it('A value of "10" should not approximate a value of "10.0001" (when using zero significant digits)', () => {
      expect(new Decimal("10").getIsApproximate(new Decimal("10.0001"), 0)).toEqual(false);
    });
    it('A value of "10.0001" should not approximate a value of "10" (when using zero significant digits)', () => {
      expect(new Decimal("10.0001").getIsApproximate(new Decimal("10"), 0)).toEqual(false);
    });
    it('A value of "0.01" should approximate a value of "0.019" (when using two significant digits)', () => {
      expect(new Decimal("0.01").getIsApproximate(new Decimal("0.019"), 2)).toEqual(true);
    });
    it('A value of "0.019" should approximate a value of "0.01" (when using two significant digits)', () => {
      expect(new Decimal("0.019").getIsApproximate(new Decimal("0.01"), 2)).toEqual(true);
    });
    it('A value of "-0.01" should approximate a value of "-0.019" (when using two significant digits)', () => {
      expect(new Decimal("-0.01").getIsApproximate(new Decimal("-0.019"), 2)).toEqual(true);
    });
    it('A value of "-0.019" should approximate a value of "-0.01" (when using two significant digits)', () => {
      expect(new Decimal("-0.019").getIsApproximate(new Decimal("-0.01"), 2)).toEqual(true);
    });
    it('A value of "0.01" should approximate a value of "0.009" (when using two significant digits)', () => {
      expect(new Decimal("0.01").getIsApproximate(new Decimal("0.009"), 2)).toEqual(true);
    });
    it('A value of "0.009" should approximate a value of "0.01" (when using two significant digits)', () => {
      expect(new Decimal("0.009").getIsApproximate(new Decimal("0.01"), 2)).toEqual(true);
    });
    it('A value of "0.01" should not approximate a value of "0.02" (when using two significant digits)', () => {
      expect(new Decimal("0.01").getIsApproximate(new Decimal("0.02"), 2)).toEqual(false);
    });
    it('A value of "0.02" should not approximate a value of "0.01" (when using two significant digits)', () => {
      expect(new Decimal("0.02").getIsApproximate(new Decimal("0.01"), 2)).toEqual(false);
    });
    it('A value of "0.01" should not approximate a value of "-0.01" (when using two significant digits)', () => {
      expect(new Decimal("0.01").getIsApproximate(new Decimal("-0.01"), 2)).toEqual(false);
    });
    it('A value of "-0.01" should not approximate a value of "0.01" (when using two significant digits)', () => {
      expect(new Decimal("-0.01").getIsApproximate(new Decimal("0.01"), 2)).toEqual(false);
    });
    it('A value of "0.00001" should approximate a value of Decimal.ZERO (when using four significant digits)', () => {
      expect(new Decimal("0.00001").getIsApproximate(Decimal.ZERO, 4)).toEqual(true);
    });
    it('A value of "0.00001" should not approximate a value of Decimal.ZERO (when using five significant digits)', () => {
      expect(new Decimal("0.00001").getIsApproximate(Decimal.ZERO, 5)).toEqual(false);
    });
  });
  describe("When cloning a decimal", () => {
    "use strict";
    let source;
    let clone2;
    beforeEach(() => {
      source = new Decimal(Math.PI);
      clone2 = Decimal.clone(source);
    });
    it("the cloned instance should not be the same as the source instance", () => {
      expect(clone2).not.toBe(source);
    });
    it("the cloned instance should equal the source instance", () => {
      expect(source.getIsEqual(clone2)).toEqual(true);
    });
  });
  describe("When checking for containment", () => {
    let d;
    beforeEach(() => {
      d = new Decimal("1.234");
    });
    describe("with inclusivity", () => {
      it("The value of 1.234 should be between -2 and 2", () => {
        expect(d.getIsBetween(-2, 2)).toEqual(true);
      });
      it("The value of 1.234 should be between 1.234 and 1.235", () => {
        expect(d.getIsBetween(1.234, 1.235)).toEqual(true);
      });
      it("The value of 1.234 should be between 1.233 and 1.234", () => {
        expect(d.getIsBetween(1.233, 1.234)).toEqual(true);
      });
      it("The value of 1.234 should be between 1.234 and 1.234", () => {
        expect(d.getIsBetween(1.234, 1.234)).toEqual(true);
      });
      it("The value of 1.234 should not be between 0 and 1", () => {
        expect(d.getIsBetween(0, 1)).toEqual(false);
      });
      it("The value of 1.234 should not be between 2 and 1", () => {
        expect(d.getIsBetween(2, 1)).toEqual(false);
      });
    });
    describe("with exclusivity", () => {
      it("The value of 1.234 should be between -2 and 2", () => {
        expect(d.getIsBetween(-2, 2, true)).toEqual(true);
      });
      it("The value of 1.234 should not be between 1.234 and 1.235", () => {
        expect(d.getIsBetween(1.234, 1.235, true)).toEqual(false);
      });
      it("The value of 1.234 should not be between 1.233 and 1.234", () => {
        expect(d.getIsBetween(1.233, 1.234, true)).toEqual(false);
      });
      it("The value of 1.234 should not be between 1.234 and 1.234", () => {
        expect(d.getIsBetween(1.234, 1.234, true)).toEqual(false);
      });
      it("The value of 1.234 should not be between 0 and 1", () => {
        expect(d.getIsBetween(0, 1, true)).toEqual(false);
      });
      it("The value of 1.234 should not be between 2 and 1", () => {
        expect(d.getIsBetween(2, 1, true)).toEqual(false);
      });
    });
  });
  describe("When parsing string values", () => {
    "use strict";
    it('Parsing the string "1.234" should yield a valid decimal', () => {
      expect(Decimal.parse("1.234") instanceof Decimal).toEqual(true);
    });
    it('Parsing the string "-1.234" should yield a valid decimal', () => {
      expect(Decimal.parse("-1.234") instanceof Decimal).toEqual(true);
    });
    it('Parsing the string "1.234abcd" should not yield a valid decimal', () => {
      expect(() => Decimal.parse("1.234abcd")).toThrow();
    });
  });

  // test/specs/lang/DisposableSpec.js
  describe("When a Disposable is extended", () => {
    "use strict";
    class TestDisposable extends Disposable {
      constructor() {
        super();
        this._disposeSpy = jasmine.createSpy("disposeAction");
      }
      getDisposeSpy() {
        return this._disposeSpy;
      }
      _onDispose() {
        this._disposeSpy();
      }
    }
    let testDisposable;
    beforeEach(() => {
      testDisposable = new TestDisposable();
    });
    it("should not indicate that it has been disposed", () => {
      expect(testDisposable.getIsDisposed()).toEqual(false);
    });
    it("should not indicate that it has been disposed (using disposed property)", () => {
      expect(testDisposable.disposed).toEqual(false);
    });
    it("should not have triggered the dispose action", () => {
      expect(testDisposable.getDisposeSpy()).not.toHaveBeenCalled();
    });
    describe("and the instance is disposed", () => {
      beforeEach(() => {
        testDisposable.dispose();
      });
      it("should indicate that it has been disposed", () => {
        expect(testDisposable.getIsDisposed()).toEqual(true);
      });
      it("should indicate that it has been disposed (using disposed property)", () => {
        expect(testDisposable.disposed).toEqual(true);
      });
      it("should have triggered the dispose action", () => {
        expect(testDisposable.getDisposeSpy().calls.count()).toEqual(1);
      });
      describe("and the instance is disposed again", () => {
        beforeEach(() => {
          testDisposable.dispose();
        });
        it("should indicate that it has been disposed", () => {
          expect(testDisposable.getIsDisposed()).toEqual(true);
        });
        it("should indicate that it has been disposed (using the disposed property)", () => {
          expect(testDisposable.disposed).toEqual(true);
        });
        it("should not dispose action again", () => {
          expect(testDisposable.getDisposeSpy().calls.count()).toEqual(1);
        });
      });
    });
  });
  describe("When a Disposable.getEmpty creates a Disposable", () => {
    "use strict";
    let testDisposable;
    beforeEach(() => {
      testDisposable = Disposable.getEmpty();
    });
    it("should be an instance of Disposable", () => {
      expect(testDisposable instanceof Disposable).toEqual(true);
    });
    it("should dispose without custom action", () => {
      expect(() => testDisposable.dispose()).not.toThrow();
    });
  });
  describe("When a Disposable.fromAction creates a Disposable", () => {
    "use strict";
    let testDisposable;
    let testDisposableSpy;
    beforeEach(() => {
      testDisposable = Disposable.fromAction(testDisposableSpy = jasmine.createSpy("testDisposableSpy"));
    });
    it("should be an instance of Disposable", () => {
      expect(testDisposable instanceof Disposable).toEqual(true);
    });
    it("should not indicate that it has been disposed", () => {
      expect(testDisposable.getIsDisposed()).toEqual(false);
    });
    it("should not indicate that it has been disposed (using the disposed property)", () => {
      expect(testDisposable.disposed).toEqual(false);
    });
    it("should not have triggered the dispose action", () => {
      expect(testDisposableSpy).not.toHaveBeenCalled();
    });
    describe("and the instance is disposed", () => {
      beforeEach(() => {
        testDisposable.dispose();
      });
      it("should indicate that it has been disposed", () => {
        expect(testDisposable.getIsDisposed()).toEqual(true);
      });
      it("should indicate that it has been disposed (using the disposed proeprty)", () => {
        expect(testDisposable.disposed).toEqual(true);
      });
      it("should have triggered the dispose action", () => {
        expect(testDisposableSpy.calls.count()).toEqual(1);
      });
      describe("and the instance is disposed again", () => {
        beforeEach(() => {
          testDisposable.dispose();
        });
        it("should indicate that it has been disposed", () => {
          expect(testDisposable.getIsDisposed()).toEqual(true);
        });
        it("should indicate that it has been disposed (using the disposed property)", () => {
          expect(testDisposable.disposed).toEqual(true);
        });
        it("should not dispose action again", () => {
          expect(testDisposableSpy.calls.count()).toEqual(1);
        });
      });
    });
  });

  // test/specs/lang/EnumSpec.js
  describe("When Enum is extended (as types EnumA and EnumB) and type items are added to each (X and Y)", () => {
    "use strict";
    class EnumA extends Enum {
      constructor(code, description) {
        super(code, description);
      }
    }
    class EnumB extends Enum {
      constructor(code, description) {
        super(code, description);
      }
    }
    let ax = new EnumA("x", "A-X");
    let ay = new EnumA("y", "A-Y");
    let bx = new EnumB("x", "B-X");
    let by = new EnumB("y", "B-Y");
    it("should be able to find X in EnumA using the code", () => {
      expect(Enum.fromCode(EnumA, "x")).toBe(ax);
    });
    it("toJSON should return the enum code", () => {
      expect(ax.toJSON()).toEqual("x");
    });
    it("should be able to find Y in EnumA using the code", () => {
      expect(Enum.fromCode(EnumA, "y")).toBe(ay);
    });
    it("should be able to find X in EnumB using the code", () => {
      expect(Enum.fromCode(EnumB, "x")).toBe(bx);
    });
    it("should be able to find Y in EnumB using the code", () => {
      expect(Enum.fromCode(EnumB, "y")).toBe(by);
    });
    describe("and a duplicate item (A-x) is added", () => {
      let invalid = new EnumA("x", "A-XX");
      it("should still only have two items", () => {
        expect(Enum.getItems(EnumA).length).toEqual(2);
      });
      it("should still able to find the original instance in EnumA for X", () => {
        expect(Enum.fromCode(EnumA, "x")).toBe(ax);
      });
      it("should not be able to find the mapping for the duplicated item", () => {
        expect(Enum.getItems(EnumA).some((x) => x === invalid)).toEqual(false);
      });
      it("should should equal the original instance (for X)", () => {
        expect(Enum.fromCode(EnumA, "x").equals(ax)).toBe(true);
      });
    });
  });
  describe("When Enum is extended (as types EnumA and EnumB) and type items are added to each (X and Y) which include mapping values", () => {
    "use strict";
    class EnumA extends Enum {
      constructor(code, description, mapping) {
        super(code, description, mapping);
      }
    }
    class EnumB extends Enum {
      constructor(code, description, mapping) {
        super(code, description, mapping);
      }
    }
    let ax = new EnumA("x", "A-X", 0);
    let ay = new EnumA("y", "A-Y", 1);
    let bx = new EnumB("x", "B-X", 0);
    let by = new EnumB("y", "B-Y", 1);
    it("should be able to find X in EnumA using the mapping value", () => {
      expect(Enum.fromMapping(EnumA, 0)).toBe(ax);
    });
    it("should be able to find Y in EnumA using the mapping value", () => {
      expect(Enum.fromMapping(EnumA, 1)).toBe(ay);
    });
    it("should be able to find X in EnumB using the mapping value", () => {
      expect(Enum.fromMapping(EnumB, 0)).toBe(bx);
    });
    it("should be able to find Y in EnumB using the mapping value", () => {
      expect(Enum.fromMapping(EnumB, 1)).toBe(by);
    });
    describe("and a duplicate mapping value is added", () => {
      let invalid = new EnumA("z", "A-Z", 1);
      it("should still only have two items", () => {
        expect(Enum.getItems(EnumA).length).toEqual(2);
      });
      it("should still able to find the original instance in EnumA for Y", () => {
        expect(Enum.fromMapping(EnumA, 1)).toBe(ay);
      });
      it("should not be able to find the mapping for the duplicated item", () => {
        expect(Enum.getItems(EnumA).some((x) => x === invalid)).toEqual(false);
      });
    });
  });

  // lang/Money.js
  var Money = class _Money {
    #decimal;
    #currency;
    /**
     * @param {Decimal|number|string} value - A amount, which can be parsed as a {@link Decimal}
     * @param {Currency} currency - The currency.
     */
    constructor(value, currency) {
      argumentIsRequired(currency, "currency", Currency, "Currency");
      this.#decimal = getDecimal(value);
      this.#currency = currency;
    }
    /**
     * The currency amount.
     *
     * @public
     * @returns {Decimal}
     */
    get decimal() {
      return this.#decimal;
    }
    /**
     * The currency.
     *
     * @public
     * @returns {Currency}
     */
    get currency() {
      return this.#currency;
    }
    /**
     * @public
     * @param {*} places
     * @param {*} mode
     * @returns {Money}
     */
    toAmount(places, mode) {
      return new _Money(this.#decimal.round(getPlaces(places), mode), this.#currency);
    }
    /**
     * Returns the JSON representation.
     *
     * @public
     * @returns {object}
     */
    toJSON() {
      return {
        decimal: this.#decimal,
        currency: this.#currency
      };
    }
    /**
     * Parses the value emitted by {@link Decimal#toJSON}.
     *
     * @public
     * @static
     * @param {object} value
     * @returns {Money}
     */
    static parse(value) {
      return new _Money(value.decimal, value.currency);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[Money]`;
    }
  };
  function getDecimal(value) {
    if (value instanceof Decimal) {
      return value;
    } else {
      return new Decimal(value);
    }
  }
  function getPlaces(value) {
    if (integer(value) && !(value < 0)) {
      return value;
    } else {
      return 2;
    }
  }

  // test/specs/lang/MoneySpec.js
  describe("When Money is constructed", () => {
    "use strict";
    let money;
    beforeEach(() => {
      money = new Money("12.345", Currency.USD);
    });
    it("should expose the decimal value", () => {
      expect({
        decimal: money.decimal instanceof Decimal,
        value: money.decimal.toFixed()
      }).toEqual({
        decimal: true,
        value: "12.345"
      });
    });
    it("should expose the currency", () => {
      expect(money.currency).toBe(Currency.USD);
    });
    it("should round to the supplied amount places", () => {
      expect(money.toAmount(2).decimal.toFixed()).toEqual("12.35");
    });
    it("should default amount rounding to two places", () => {
      expect(money.toAmount().decimal.toFixed()).toEqual("12.35");
    });
    it("should serialize to JSON", () => {
      expect(money.toJSON()).toEqual({
        decimal: money.decimal,
        currency: Currency.USD
      });
    });
    it("should parse serialized money decimal", () => {
      const parsed = Money.parse(money.toJSON());
      expect(parsed.decimal.toFixed()).toEqual("12.345");
    });
    it("should parse serialized money currency", () => {
      const parsed = Money.parse(money.toJSON());
      expect(parsed.currency).toBe(Currency.USD);
    });
    it("should accept Decimal values", () => {
      const decimal = new Decimal("1.23");
      expect(new Money(decimal, Currency.USD).decimal).toBe(decimal);
    });
    it("should validate currency arguments", () => {
      expect(() => new Money("1.23", null)).toThrow();
    });
  });

  // test/specs/lang/RateSpec.js
  describe('When parsing an "^EURUSD" rate of 1.2', () => {
    "use strict";
    let rate;
    beforeEach(() => {
      rate = Rate.fromPair(1.2, "^EURUSD");
    });
    it("the quote currency should be USD", () => {
      expect(rate.quote.code).toEqual("USD");
    });
    it("the base currency should be EUR", () => {
      expect(rate.base.code).toEqual("EUR");
    });
    it("the numerator currency should be USD", () => {
      expect(rate.numerator.code).toEqual("USD");
    });
    it("the denominator currency should be EUR", () => {
      expect(rate.denominator.code).toEqual("EUR");
    });
    it("the reconstructed symbols should be ^EURUSD", () => {
      expect(rate.getSymbol()).toEqual("^EURUSD");
    });
    it("the value should be 1.2", () => {
      expect(rate.decimal.getIsEqual(1.2)).toEqual(true);
    });
    it("the float value should be 1.2", () => {
      expect(rate.float).toEqual(1.2);
    });
    it("formatPair should return the numerator and denominator codes", () => {
      expect({
        plain: rate.formatPair(),
        carat: rate.formatPair(true)
      }).toEqual({
        plain: "USDEUR",
        carat: "^USDEUR"
      });
    });
    it("invert should return the inverse rate", () => {
      const inverted = rate.invert();
      expect({
        numerator: inverted.numerator,
        denominator: inverted.denominator,
        value: inverted.decimal.round(4).toNumber()
      }).toEqual({
        numerator: Currency.EUR,
        denominator: Currency.USD,
        value: 0.8333
      });
    });
    it("getStaticRates should return static Rate instances", () => {
      expect(Rate.getStaticRates().every((staticRate) => staticRate instanceof Rate)).toEqual(true);
    });
    describe("When converting 10 USD to EUR", () => {
      it("should be 8.33 EUR", () => {
        expect(Rate.convert(new Decimal(10), Currency.USD, Currency.EUR, rate).round(2).getIsEqual(8.33)).toEqual(true);
      });
    });
    describe("When converting 10 EUR to USD", () => {
      it("should be 12 USD", () => {
        expect(Rate.convert(new Decimal(10), Currency.EUR, Currency.USD, rate).round(2).getIsEqual(12)).toEqual(true);
      });
    });
  });
  describe('When parsing an "^USDEUR" rate of 0.8333', () => {
    "use strict";
    let rate;
    beforeEach(() => {
      rate = Rate.fromPair(0.8333, "^USDEUR");
    });
    it("the quote currency should be EUR", () => {
      expect(rate.quote.code).toEqual("EUR");
    });
    it("the base currency should be USD", () => {
      expect(rate.base.code).toEqual("USD");
    });
    it("the numerator currency should be EUR", () => {
      expect(rate.numerator.code).toEqual("EUR");
    });
    it("the denominator currency should be USD", () => {
      expect(rate.denominator.code).toEqual("USD");
    });
    it("the reconstructed symbols should be ^USDEUR", () => {
      expect(rate.getSymbol()).toEqual("^USDEUR");
    });
    it("the value should be 0.8333", () => {
      expect(rate.decimal.getIsEqual(0.8333)).toEqual(true);
    });
    describe("When converting 10 USD to EUR", () => {
      it("should be 8.33 EUR", () => {
        expect(Rate.convert(new Decimal(10), Currency.USD, Currency.EUR, rate).round(2).getIsEqual(8.33)).toEqual(true);
      });
    });
    describe("When converting 10 EUR to USD", () => {
      it("should be 12 USD", () => {
        expect(Rate.convert(new Decimal(10), Currency.EUR, Currency.USD, rate).round(2).getIsEqual(12)).toEqual(true);
      });
    });
  });
  describe('When parsing a "^GBPUSD" rate of 1.25882', () => {
    "use strict";
    let rate;
    beforeEach(() => {
      rate = Rate.fromPair(1.25882, "^GBPUSD");
    });
    it("the quote currency should be USD", () => {
      expect(rate.quote.code).toEqual("USD");
    });
    it("the base currency should be GBP", () => {
      expect(rate.base.code).toEqual("GBP");
    });
    it("the numerator currency should be USD", () => {
      expect(rate.numerator.code).toEqual("USD");
    });
    it("the denominator currency should be GBP", () => {
      expect(rate.denominator.code).toEqual("GBP");
    });
    it("the reconstructed symbols should be ^GBPUSD", () => {
      expect(rate.getSymbol()).toEqual("^GBPUSD");
    });
    it("the value should be 1.25882", () => {
      expect(rate.decimal.getIsEqual(1.25882)).toEqual(true);
    });
    describe("When converting 10 GBP to USD", () => {
      it("should be 12.59 USD", () => {
        expect(Rate.convert(new Decimal(10), Currency.GBP, Currency.USD, rate).round(2).getIsEqual(12.59)).toEqual(true);
      });
    });
    describe("When converting 1000 GBX to USD", () => {
      it("should be 12.59 USD", () => {
        expect(Rate.convert(new Decimal(1e3), Currency.GBX, Currency.USD, rate).round(2).getIsEqual(12.59)).toEqual(true);
      });
    });
    describe("When converting 1 USD to GBX", () => {
      it("should be 79.44 USD", () => {
        expect(Rate.convert(new Decimal(1), Currency.USD, Currency.GBX, rate).round(2).getIsEqual(79.44)).toEqual(true);
      });
    });
    it("1 GBP should be 100 GBX", () => {
      expect(Rate.convert(Decimal.ONE, Currency.GBP, Currency.GBX).round(2).getIsEqual(100)).toEqual(true);
    });
    it("1 GBX should be 0.01 GBP", () => {
      expect(Rate.convert(Decimal.ONE, Currency.GBX, Currency.GBP).round(2).getIsEqual(0.01)).toEqual(true);
    });
  });

  // lang/Time.js
  var SECONDS_PER_MINUTE = 60;
  var MINUTES_PER_HOUR = 60;
  var HOURS_PER_DAY = 24;
  var Time = class _Time {
    #hours;
    #minutes;
    #seconds;
    /**
     * @param {number} hours
     * @param {number} minutes
     * @param {number} seconds
     */
    constructor(hours, minutes, seconds) {
      if (!_Time.validate(hours, minutes, seconds)) {
        throw new Error(`Unable to instantiate [ Time ], input is invalid [ ${hours} ], [ ${minutes} ], [ ${seconds} ]`);
      }
      this.#hours = hours;
      this.#minutes = minutes;
      this.#seconds = seconds;
    }
    /**
     * The hours (0–23).
     *
     * @public
     * @returns {number}
     */
    get hours() {
      return this.#hours;
    }
    /**
     * The minutes (0–59).
     *
     * @public
     * @returns {number}
     */
    get minutes() {
      return this.#minutes;
    }
    /**
     * The seconds (0–59).
     *
     * @public
     * @returns {number}
     */
    get seconds() {
      return this.#seconds;
    }
    /**
     * @public
     * @param {*} seconds
     * @returns {Time}
     */
    addSeconds(seconds) {
      argumentIsValid(seconds, "seconds", integer, "must be an integer");
      let negative2 = seconds < 0;
      let secondsToAdd = seconds % SECONDS_PER_MINUTE;
      let minutesToAdd = seconds / SECONDS_PER_MINUTE % MINUTES_PER_HOUR;
      let hoursToAdd = seconds / (SECONDS_PER_MINUTE * MINUTES_PER_HOUR) % HOURS_PER_DAY;
      if (negative2) {
        minutesToAdd = Math.ceil(minutesToAdd);
        hoursToAdd = Math.ceil(hoursToAdd);
      } else {
        minutesToAdd = Math.floor(minutesToAdd);
        hoursToAdd = Math.floor(hoursToAdd);
      }
      let secondsShifted = this.#seconds + secondsToAdd;
      if (negative2 && secondsShifted < 0) {
        secondsShifted += SECONDS_PER_MINUTE;
        minutesToAdd--;
      }
      if (!negative2 && !(secondsShifted < SECONDS_PER_MINUTE)) {
        secondsShifted -= SECONDS_PER_MINUTE;
        minutesToAdd++;
      }
      let minutesShifted = this.#minutes + minutesToAdd;
      if (negative2 && minutesShifted < 0) {
        minutesShifted += MINUTES_PER_HOUR;
        hoursToAdd--;
      }
      if (!negative2 && !(minutesShifted < MINUTES_PER_HOUR)) {
        minutesShifted -= MINUTES_PER_HOUR;
        hoursToAdd++;
      }
      let hoursShifted = (this.#hours + hoursToAdd) % HOURS_PER_DAY;
      if (hoursShifted < 0) {
        hoursShifted += HOURS_PER_DAY;
      }
      return new _Time(hoursShifted, minutesShifted, secondsShifted);
    }
    /**
     * Returns a new {@link Time} instance with some number of seconds subtracted.
     *
     * @public
     * @param {number} seconds
     * @returns {Time}
     */
    subtractSeconds(seconds) {
      return this.addSeconds(~seconds + 1);
    }
    /**
     * Returns a new {@link Time} instance with some number of minutes added.
     *
     * @public
     * @param {number} minutes
     * @returns {Time}
     */
    addMinutes(minutes) {
      return this.addSeconds(minutes * SECONDS_PER_MINUTE);
    }
    /**
     * Returns a new {@link Time} instance with some number of minutes subtracted.
     *
     * @public
     * @param {number} minutes
     * @returns {Time}
     */
    subtractMinutes(minutes) {
      return this.addMinutes(~minutes + 1);
    }
    /**
     * Returns a new {@link Time} instance with some number of minutes added.
     *
     * @public
     * @param {number} hours
     * @returns {Time}
     */
    addHours(hours) {
      return this.addMinutes(hours * MINUTES_PER_HOUR);
    }
    /**
     * Returns a new {@link Time} instance with some number of minutes subtracted.
     *
     * @public
     * @param {number} hours
     * @returns {Time}
     */
    subtractHours(hours) {
      return this.addHours(~hours + 1);
    }
    /**
     * Indicates if the current {@link Time} instance is before another time.
     *
     * @public
     * @param {Time} other
     * @returns {boolean}
     */
    getIsBefore(other) {
      argumentIsRequired(other, "other", _Time, "Time");
      return this.hours < other.hours || this.hours === other.hours && this.minutes < other.minutes || this.hours === other.hours && this.minutes === other.minutes && this.seconds < other.seconds;
    }
    /**
     * Indicates if the current {@link Time} instance is after another time.
     *
     * @public
     * @param {Time} other
     * @returns {boolean}
     */
    getIsAfter(other) {
      argumentIsRequired(other, "other", _Time, "Time");
      return !this.getIsBefore(other) && !this.getIsEqual(other);
    }
    /**
     * Indicates if the current {@link Time} instance is the same as another time.
     *
     * @public
     * @param {Time} other
     * @returns {boolean}
     */
    getIsEqual(other) {
      argumentIsRequired(other, "other", _Time, "Time");
      return this.#hours === other.hours && this.#minutes === other.minutes && this.#seconds === other.seconds;
    }
    /**
     * Outputs the time as the formatted string: {hh}:{mm}:{ss}.
     *
     * @public
     * @returns {string}
     */
    format() {
      return `${leftPad2(this.#hours, 2, "0")}:${leftPad2(this.#minutes, 2, "0")}:${leftPad2(this.#seconds, 2, "0")}`;
    }
    /**
     * Returns the JSON representation.
     *
     * @public
     * @returns {string}
     */
    toJSON() {
      return this.format();
    }
    /**
     * Returns true if the hours, minutes, and seconds combination is valid.
     *
     * @public
     * @static
     * @param {number} hours
     * @param {number} minutes
     * @param {number} seconds
     * @returns {boolean}
     */
    static validate(hours, minutes, seconds) {
      return Number.isInteger(hours) && Number.isInteger(minutes) && Number.isInteger(seconds) && hours >= 0 && hours < HOURS_PER_DAY && minutes >= 0 && minutes < MINUTES_PER_HOUR && seconds >= 0 && seconds < SECONDS_PER_MINUTE;
    }
    /**
     * Parses a string in the format "hh:mm:ss" and returns a Time instance.
     *
     * @public
     * @static
     * @param {string} time
     * @returns {Time}
     */
    static parse(time) {
      argumentIsRequired(time, "time", String);
      const match = time.match(regex);
      if (match === null) {
        throw new Error(`Unable to parse [ Time ], invalid format [ ${time} ]`);
      }
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const seconds = match[4] ? parseInt(match[4]) : 0;
      return new _Time(hours, minutes, seconds);
    }
    /**
     * Creates a {@link Time} from the hours, minutes, and seconds properties (in local time)
     * of the {@link Date} argument.
     *
     * @public
     * @static
     * @param {Date} date
     * @returns {Time}
     */
    static fromDate(date2) {
      argumentIsRequired(date2, "date", Date);
      return new _Time(date2.getHours(), date2.getMinutes(), date2.getSeconds());
    }
    /**
     * Creates a {@link Time} from the hours, minutes, and seconds properties (in UTC)
     * of the {@link Date} argument.
     *
     * @public
     * @static
     * @param {Date} date
     * @returns {Time}
     */
    static fromDateUtc(date2) {
      argumentIsRequired(date2, "date", Date);
      return new _Time(date2.getUTCHours(), date2.getUTCMinutes(), date2.getUTCSeconds());
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Time]";
    }
  };
  var regex = /^([0-2]?[0-9]):([0-5][0-9])(:([0-5][0-9]))?$/i;
  function leftPad2(value, digits, character) {
    const string2 = value.toString();
    const padding = digits - string2.length;
    return `${character.repeat(padding)}${string2}`;
  }

  // test/specs/lang/TimeSpec.js
  describe('When "12:34:56" is parsed as a Time', () => {
    "use strict";
    let time;
    beforeEach(() => {
      time = Time.parse("12:34:56");
    });
    it("the hours should be 12", () => {
      expect(time.hours).toEqual(12);
    });
    it("the minutes should be 34", () => {
      expect(time.minutes).toEqual(34);
    });
    it("the seconds should be 56", () => {
      expect(time.seconds).toEqual(56);
    });
    describe("and the Time instance is formatted", () => {
      it('should output be "12:34:56"', () => {
        expect(time.format()).toEqual("12:34:56");
      });
    });
  });
  describe('When "07:05:09" is parsed as a Time', () => {
    "use strict";
    let time;
    beforeEach(() => {
      time = Time.parse("07:05:09");
    });
    it("the hours should be 7", () => {
      expect(time.hours).toEqual(7);
    });
    it("the minutes should be 5", () => {
      expect(time.minutes).toEqual(5);
    });
    it("the seconds should be 9", () => {
      expect(time.seconds).toEqual(9);
    });
    describe("and the Time instance is formatted", () => {
      it('should output be "07:05:09"', () => {
        expect(time.format()).toEqual("07:05:09");
      });
    });
  });
  describe("When an invalid string is parsed as a Time", () => {
    function parseTime(value) {
      return () => {
        Time.parse(value);
      };
    }
    it("should throw on null", () => {
      expect(parseTime(null)).toThrow();
    });
    it("should throw on undefined", () => {
      expect(parseTime(void 0)).toThrow();
    });
    it("should throw on object", () => {
      expect(parseTime({})).toThrow();
    });
    it("should throw on number", () => {
      expect(parseTime(12345)).toThrow();
    });
    it('should throw on "25:00:00" (invalid hour)', () => {
      expect(parseTime("25:00:00")).toThrow();
    });
    it('should throw on "12:60:00" (invalid minute)', () => {
      expect(parseTime("12:60:00")).toThrow();
    });
    it('should throw on "12:30:60" (invalid second)', () => {
      expect(parseTime("12:30:60")).toThrow();
    });
  });
  describe("When checking if a Time is valid", () => {
    it("should consider 00:00:00 valid", () => {
      expect(Time.validate(0, 0, 0)).toEqual(true);
    });
    it("should consider 23:59:59 valid", () => {
      expect(Time.validate(23, 59, 59)).toEqual(true);
    });
    it("should not consider 24:00:00 valid", () => {
      expect(Time.validate(24, 0, 0)).toEqual(false);
    });
    it("should not consider 12:60:00 valid", () => {
      expect(Time.validate(12, 60, 0)).toEqual(false);
    });
    it("should not consider 12:30:60 valid", () => {
      expect(Time.validate(12, 30, 60)).toEqual(false);
    });
  });
  describe("When comparing two Time instances", () => {
    let earlier, later, equal;
    beforeEach(() => {
      earlier = Time.parse("10:15:30");
      later = Time.parse("12:45:00");
      equal = Time.parse("10:15:30");
    });
    it("earlier should be before later", () => {
      expect(earlier.getIsBefore(later)).toEqual(true);
    });
    it("later should be after earlier", () => {
      expect(later.getIsAfter(earlier)).toEqual(true);
    });
    it("earlier should not be after later", () => {
      expect(earlier.getIsAfter(later)).toEqual(false);
    });
    it("equal times should be equal", () => {
      expect(earlier.getIsEqual(equal)).toEqual(true);
    });
    it("equal times should not be before each other", () => {
      expect(earlier.getIsBefore(equal)).toEqual(false);
    });
    it("equal times should not be after each other", () => {
      expect(earlier.getIsAfter(equal)).toEqual(false);
    });
  });
  describe("When creating Time from Date", () => {
    describe("from local time", () => {
      let time;
      beforeEach(() => {
        const date2 = new Date(2020, 0, 1, 15, 45, 20);
        time = Time.fromDate(date2);
      });
      it("should have the correct hours", () => {
        expect(time.hours).toEqual(15);
      });
      it("should have the correct minutes", () => {
        expect(time.minutes).toEqual(45);
      });
      it("should have the correct seconds", () => {
        expect(time.seconds).toEqual(20);
      });
    });
    describe("from UTC time", () => {
      let time;
      beforeEach(() => {
        const date2 = new Date(Date.UTC(2020, 0, 1, 8, 30, 50));
        time = Time.fromDateUtc(date2);
      });
      it("should have the correct hours", () => {
        expect(time.hours).toEqual(8);
      });
      it("should have the correct minutes", () => {
        expect(time.minutes).toEqual(30);
      });
      it("should have the correct seconds", () => {
        expect(time.seconds).toEqual(50);
      });
    });
  });
  describe("When converting Time to JSON", () => {
    it("should output the same as format()", () => {
      const time = Time.parse("06:07:08");
      expect(time.toJSON()).toEqual("06:07:08");
    });
  });
  describe("When adding seconds to 12:34:56", () => {
    let time;
    beforeEach(() => {
      time = Time.parse("12:34:56");
    });
    it("adding 0 seconds should return 12:34:56", () => {
      expect(time.addSeconds(0).getIsEqual(Time.parse("12:34:56"))).toBeTrue();
    });
    it("adding 1 second should return 12:34:57", () => {
      expect(time.addSeconds(1).getIsEqual(Time.parse("12:34:57"))).toBeTrue();
    });
    it("adding 4 seconds should return 12:35:00", () => {
      expect(time.addSeconds(4).getIsEqual(Time.parse("12:35:00"))).toBeTrue();
    });
    it("adding 5 seconds should return 12:35:01", () => {
      expect(time.addSeconds(5).getIsEqual(Time.parse("12:35:01"))).toBeTrue();
    });
    it("adding 41104 seconds should return 00:00:00", () => {
      expect(time.addSeconds(4 + 25 * 60 + 11 * 60 * 60).getIsEqual(Time.parse("00:00:00"))).toBeTrue();
    });
    it("adding 127504 seconds should return 00:00:00", () => {
      expect(time.addSeconds(4 + 25 * 60 + 35 * 60 * 60).getIsEqual(Time.parse("00:00:00"))).toBeTrue();
    });
  });
  describe("When subtracting seconds from 12:34:56", () => {
    let time;
    beforeEach(() => {
      time = Time.parse("12:34:56");
    });
    it("subtracting 0 seconds should return 12:34:56", () => {
      expect(time.subtractSeconds(0).getIsEqual(Time.parse("12:34:56"))).toBeTrue();
    });
    it("subtracting 1 second should return 12:34:55", () => {
      expect(time.subtractSeconds(1).getIsEqual(Time.parse("12:34:55"))).toBeTrue();
    });
    it("subtracting 6 seconds should return 12:34:50", () => {
      expect(time.subtractSeconds(6).getIsEqual(Time.parse("12:34:50"))).toBeTrue();
    });
    it("subtracting 7 seconds should return 12:34:49", () => {
      expect(time.subtractSeconds(7).getIsEqual(Time.parse("12:34:49"))).toBeTrue();
    });
    it("subtracting 45296 seconds should return 12:34:49", () => {
      expect(time.subtractSeconds(56 + 34 * 60 + 12 * 60 * 60).getIsEqual(Time.parse("00:00:00"))).toBeTrue();
    });
    it("subtracting 45297 seconds should return 12:34:49", () => {
      expect(time.subtractSeconds(56 + 34 * 60 + 12 * 60 * 60 + 1).getIsEqual(Time.parse("23:59:59"))).toBeTrue();
    });
    it("subtracting 131696 seconds should return 12:34:49", () => {
      expect(time.subtractSeconds(56 + 34 * 60 + 36 * 60 * 60).getIsEqual(Time.parse("00:00:00"))).toBeTrue();
    });
  });
  describe("When adding minutes to 12:34:56", () => {
    let time;
    beforeEach(() => {
      time = Time.parse("12:34:56");
    });
    it("adding 0 minutes should return 12:34:56", () => {
      expect(time.addMinutes(0).getIsEqual(Time.parse("12:34:56"))).toBeTrue();
    });
    it("adding 1 minute should return 12:35:56", () => {
      expect(time.addMinutes(1).getIsEqual(Time.parse("12:35:56"))).toBeTrue();
    });
    it("adding 6 minutes should return 12:40:56", () => {
      expect(time.addMinutes(6).getIsEqual(Time.parse("12:40:56"))).toBeTrue();
    });
    it("adding 26 minutes should return 13:00:56", () => {
      expect(time.addMinutes(26).getIsEqual(Time.parse("13:00:56"))).toBeTrue();
    });
    it("adding 87 minutes should return 14:01:56", () => {
      expect(time.addMinutes(87).getIsEqual(Time.parse("14:01:56"))).toBeTrue();
    });
  });
  describe("When subtracting minutes from 12:34:56", () => {
    let time;
    beforeEach(() => {
      time = Time.parse("12:34:56");
    });
    it("subtracting 0 minutes should return 12:34:56", () => {
      expect(time.subtractMinutes(0).getIsEqual(Time.parse("12:34:56"))).toBeTrue();
    });
    it("subtracting 1 minute should return 12:35:56", () => {
      expect(time.subtractMinutes(1).getIsEqual(Time.parse("12:33:56"))).toBeTrue();
    });
    it("subtracting 5 minutes should return 12:29:56", () => {
      expect(time.subtractMinutes(5).getIsEqual(Time.parse("12:29:56"))).toBeTrue();
    });
    it("subtracting 34 minutes should return 12:00:56", () => {
      expect(time.subtractMinutes(34).getIsEqual(Time.parse("12:00:56"))).toBeTrue();
    });
    it("subtracting 35 minutes should return 11:59:56", () => {
      expect(time.subtractMinutes(35).getIsEqual(Time.parse("11:59:56"))).toBeTrue();
    });
  });
  describe("When adding hours seconds to 12:34:56", () => {
    let time;
    beforeEach(() => {
      time = Time.parse("12:34:56");
    });
    it("adding 0 hours should return 12:34:56", () => {
      expect(time.addHours(0).getIsEqual(Time.parse("12:34:56"))).toBeTrue();
    });
    it("adding 1 hour should return 13:34:56", () => {
      expect(time.addHours(1).getIsEqual(Time.parse("13:34:56"))).toBeTrue();
    });
    it("adding 6 hours should return 18:34:56", () => {
      expect(time.addHours(6).getIsEqual(Time.parse("18:34:56"))).toBeTrue();
    });
    it("adding 12 hours should return 00:34:56", () => {
      expect(time.addHours(12).getIsEqual(Time.parse("00:34:56"))).toBeTrue();
    });
    it("adding 13 hours should return 01:34:56", () => {
      expect(time.addHours(13).getIsEqual(Time.parse("01:34:56"))).toBeTrue();
    });
  });
  describe("When subtracting hours from 12:34:56", () => {
    let time;
    beforeEach(() => {
      time = Time.parse("12:34:56");
    });
    it("subtracting 0 hours should return 12:34:56", () => {
      expect(time.subtractHours(0).getIsEqual(Time.parse("12:34:56"))).toBeTrue();
    });
    it("subtracting 1 hours should return 11:34:56", () => {
      expect(time.subtractHours(1).getIsEqual(Time.parse("11:34:56"))).toBeTrue();
    });
    it("subtracting 5 hours should return 07:34:56", () => {
      expect(time.subtractHours(5).getIsEqual(Time.parse("07:34:56"))).toBeTrue();
    });
    it("subtracting 34 hours should return 02:34:56", () => {
      expect(time.subtractHours(34).getIsEqual(Time.parse("02:34:56"))).toBeTrue();
    });
    it("subtracting 37 hours should return 23:34:56", () => {
      expect(time.subtractHours(37).getIsEqual(Time.parse("23:34:56"))).toBeTrue();
    });
  });

  // lang/Timespan.js
  var MILLISECONDS_PER_SECOND2 = 1e3;
  var SECONDS_PER_MINUTE2 = 60;
  var MINUTES_PER_HOUR2 = 60;
  var HOURS_PER_DAY2 = 24;
  var MAX_HOURS = 23;
  var MAX_MINUTES = 59;
  var MAX_SECONDS = 59;
  var Timespan = class _Timespan {
    #start;
    #end;
    /**
     * @param {number} start
     * @param {number} end
     */
    constructor(start, end) {
      argumentIsValid(start, "start", large, "is an integer");
      argumentIsValid(end, "end", large, "is an integer");
      if (start > end) {
        throw new Error('The "start" parameter cannot be after the "end" parameter');
      }
      this.#start = start;
      this.#end = end;
    }
    /**
     * The start time (as milliseconds since epoch).
     *
     * @public
     * @returns {number}
     */
    get start() {
      return this.#start;
    }
    /**
     * The start time (as milliseconds since epoch).
     *
     * @public
     * @returns {number}
     */
    get end() {
      return this.#end;
    }
    /**
     * The total number of days between the start and end times (rounded down to the nearest integer).
     *
     * @public
     * @returns {number}
     */
    get days() {
      return Math.floor(this.milliseconds / (MILLISECONDS_PER_SECOND2 * SECONDS_PER_MINUTE2 * MINUTES_PER_HOUR2 * HOURS_PER_DAY2));
    }
    /**
     * The total number of hours between the start and end times (rounded down to the nearest integer).
     *
     * @public
     * @returns {number}
     */
    get hours() {
      return Math.floor(this.milliseconds / (MILLISECONDS_PER_SECOND2 * SECONDS_PER_MINUTE2 * MINUTES_PER_HOUR2));
    }
    /**
     * The total number of minutes between the start and end times (rounded down to the nearest integer).
     *
     * @public
     * @returns {number}
     */
    get minutes() {
      return Math.floor(this.milliseconds / (MILLISECONDS_PER_SECOND2 * SECONDS_PER_MINUTE2));
    }
    /**
     * The total number of seconds between the start and end times (rounded down to the nearest integer).
     *
     * @public
     * @returns {number}
     */
    get seconds() {
      return Math.floor(this.milliseconds / MILLISECONDS_PER_SECOND2);
    }
    /**
     * The total number of milliseconds between the start and end times.
     *
     * @public
     * @returns {number}
     */
    get milliseconds() {
      return this.#end - this.#start;
    }
    /**
     * Returns the duration between the start and end times as days, hours, minutes, seconds, and
     * milliseconds.
     *
     * @public
     * @param {boolean} days
     * @param {boolean} hours
     * @param {boolean} minutes
     * @param {boolean} seconds
     * @returns {{days: number, hours: number, minutes: *, seconds: number, milliseconds: number}}
     */
    getDuration(days2, hours, minutes, seconds) {
      argumentIsOptional(days2, "days", Boolean);
      argumentIsOptional(hours, "hours", Boolean);
      argumentIsOptional(seconds, "minutes", Boolean);
      argumentIsOptional(seconds, "seconds", Boolean);
      let milliseconds = this.milliseconds;
      let d = 0, h = 0, m = 0, s = 0;
      if (days2) {
        const factor = MILLISECONDS_PER_SECOND2 * SECONDS_PER_MINUTE2 * MINUTES_PER_HOUR2 * HOURS_PER_DAY2;
        d = Math.floor(milliseconds / factor);
        milliseconds = milliseconds - d * factor;
      }
      if (hours) {
        const factor = MILLISECONDS_PER_SECOND2 * SECONDS_PER_MINUTE2 * MINUTES_PER_HOUR2;
        h = Math.floor(milliseconds / factor);
        if (days2 && h > MAX_HOURS) {
          h = 23;
        }
        milliseconds = milliseconds - h * factor;
      }
      if (minutes) {
        const factor = MILLISECONDS_PER_SECOND2 * SECONDS_PER_MINUTE2;
        m = Math.floor(milliseconds / factor);
        if (hours && m > MAX_MINUTES) {
          m = MAX_MINUTES;
        }
        milliseconds = milliseconds - m * factor;
      }
      if (seconds) {
        const factor = MILLISECONDS_PER_SECOND2;
        s = Math.floor(milliseconds / factor);
        if (minutes && s > MAX_SECONDS) {
          s = MAX_SECONDS;
        }
        milliseconds = milliseconds - s * factor;
      }
      return { days: d, hours: h, minutes: m, seconds: s, milliseconds };
    }
    /**
     * Creates a new {@link Timespan} instance from dates.
     *
     * @public
     * @static
     * @param {Date} start
     * @param {Date} end
     * @returns {Timespan}
     */
    static fromDates(start, end) {
      argumentIsRequired(start, "start", Date, "Date");
      argumentIsRequired(end, "end", Date, "Date");
      return new _Timespan(start.getTime(), end.getTime());
    }
    /**
     * Returns the JSON representation.
     *
     * @public
     * @returns {object}
     */
    toJSON() {
      const start = this.#start;
      const end = this.#end;
      return { start, end };
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Timespan]";
    }
  };

  // test/specs/lang/TimespanSpec.js
  describe("When a timespan is created with an elapsed time of 2 days, 3 hours, 4 minutes, 5 seconds, and 6 milliseconds", () => {
    "use strict";
    let start;
    let end;
    let ts;
    beforeEach(() => {
      start = /* @__PURE__ */ new Date();
      end = new Date(start.getTime() + 1e3 * 60 * 60 * 24 * 2 + 1e3 * 60 * 60 * 3 + 1e3 * 60 * 4 + 1e3 * 5 + 6);
      ts = new Timespan(start.getTime(), end.getTime());
    });
    it("fromDates should create a Timespan from Date instances", () => {
      const fromDates = Timespan.fromDates(start, end);
      expect({
        start: fromDates.start,
        end: fromDates.end
      }).toEqual({
        start: start.getTime(),
        end: end.getTime()
      });
    });
    it("toJSON should return start and end timestamps", () => {
      expect(ts.toJSON()).toEqual({
        start: start.getTime(),
        end: end.getTime()
      });
    });
    it("the days should be 2", () => {
      expect(ts.days).toEqual(2);
    });
    it("the hours should be 51", () => {
      expect(ts.hours).toEqual(51);
    });
    it("the minutes should be 3064", () => {
      expect(ts.minutes).toEqual(3064);
    });
    it("the seconds should be 183845", () => {
      expect(ts.seconds).toEqual(183845);
    });
    it("the milliseconds should be 183845006", () => {
      expect(ts.milliseconds).toEqual(183845006);
    });
    describe("When calculating the duration for days, hours, minutes and seconds", () => {
      let duration;
      beforeEach(() => {
        duration = ts.getDuration(true, true, true, true);
      });
      it("the days should be 2", () => {
        expect(duration.days).toEqual(2);
      });
      it("the hours should be 3", () => {
        expect(duration.hours).toEqual(3);
      });
      it("the minutes should be 4", () => {
        expect(duration.minutes).toEqual(4);
      });
      it("the seconds should be 5", () => {
        expect(duration.seconds).toEqual(5);
      });
      it("the milliseconds should be 6", () => {
        expect(duration.milliseconds).toEqual(6);
      });
    });
    describe("When calculating the duration hours and minutes", () => {
      let duration;
      beforeEach(() => {
        duration = ts.getDuration(false, true, true, false);
      });
      it("the days should be 0", () => {
        expect(duration.days).toEqual(0);
      });
      it("the hours should be 51", () => {
        expect(duration.hours).toEqual(51);
      });
      it("the minutes should be 4", () => {
        expect(duration.minutes).toEqual(4);
      });
      it("the seconds should be 0", () => {
        expect(duration.seconds).toEqual(0);
      });
      it("the milliseconds should be 5006", () => {
        expect(duration.milliseconds).toEqual(5006);
      });
    });
    describe("When calculating the duration minutes and seconds", () => {
      let duration;
      beforeEach(() => {
        duration = ts.getDuration(false, false, true, true);
      });
      it("the days should be 0", () => {
        expect(duration.days).toEqual(0);
      });
      it("the hours should be 0", () => {
        expect(duration.hours).toEqual(0);
      });
      it("the minutes should be 3064", () => {
        expect(duration.minutes).toEqual(3064);
      });
      it("the seconds should be 5", () => {
        expect(duration.seconds).toEqual(5);
      });
      it("the milliseconds should be 6", () => {
        expect(duration.milliseconds).toEqual(6);
      });
    });
    describe("When calculating the duration hours and seconds", () => {
      let duration;
      beforeEach(() => {
        duration = ts.getDuration(false, true, false, true);
      });
      it("the days should be 0", () => {
        expect(duration.days).toEqual(0);
      });
      it("the hours should be 51", () => {
        expect(duration.hours).toEqual(51);
      });
      it("the minutes should be 0", () => {
        expect(duration.minutes).toEqual(0);
      });
      it("the seconds should be 245", () => {
        expect(duration.seconds).toEqual(245);
      });
      it("the milliseconds should be 6", () => {
        expect(duration.milliseconds).toEqual(6);
      });
    });
  });

  // test/specs/lang/TimestampSpec.js
  describe("When Timestamp is created from a timestamp (1502372574350)", () => {
    "use strict";
    let instance;
    beforeEach(() => {
      instance = new Timestamp(1502372574350);
    });
    it("should know the timestamp", () => {
      expect(instance.timestamp).toEqual(1502372574350);
    });
    it("toJSON should return the timestamp", () => {
      expect(instance.toJSON()).toEqual(1502372574350);
    });
    it("clone should return an equal Timestamp instance", () => {
      const clone2 = Timestamp.clone(instance);
      expect({
        instance: clone2 instanceof Timestamp,
        same: clone2 === instance,
        timestamp: clone2.timestamp
      }).toEqual({
        instance: true,
        same: false,
        timestamp: 1502372574350
      });
    });
    it("parse should return a Timestamp instance", () => {
      expect(Timestamp.parse(1502372574350).timestamp).toEqual(1502372574350);
    });
    describe("and two seconds are added", () => {
      let result;
      beforeEach(() => {
        result = instance.addSeconds(2);
      });
      it("should return a Timestamp instance", () => {
        expect(result instanceof Timestamp).toEqual(true);
      });
      it("should not be the same instance as the original timestamp", () => {
        expect(result).not.toBe(instance);
      });
      it("should reflect the correct timestamp (2000 milliseconds in the future)", () => {
        expect(result.timestamp).toEqual(1502372576350);
      });
      it("should not have changed the timestamp of the original instance", () => {
        expect(instance.timestamp).toEqual(1502372574350);
      });
    });
    describe("and ten milliseconds are added", () => {
      let result;
      beforeEach(() => {
        result = instance.add(10);
      });
      it("should return a Timestamp instance", () => {
        expect(result instanceof Timestamp).toEqual(true);
      });
      it("should not be the same instance as the original timestamp", () => {
        expect(result).not.toBe(instance);
      });
      it("should reflect the correct timestamp (10 milliseconds in the future)", () => {
        expect(result.timestamp).toEqual(1502372574360);
      });
      it("should not have changed the timestamp of the original instance", () => {
        expect(instance.timestamp).toEqual(1502372574350);
      });
    });
    describe("and two seconds are subtracted", () => {
      let result;
      beforeEach(() => {
        result = instance.subtractSeconds(2);
      });
      it("should return a Timestamp instance", () => {
        expect(result instanceof Timestamp).toEqual(true);
      });
      it("should not be the same instance as the original timestamp", () => {
        expect(result).not.toBe(instance);
      });
      it("should reflect the correct timestamp (2000 milliseconds in the past)", () => {
        expect(result.timestamp).toEqual(1502372572350);
      });
      it("should not have changed the timestamp of the original instance", () => {
        expect(instance.timestamp).toEqual(1502372574350);
      });
    });
    describe("and ten milliseconds are subtracted", () => {
      let result;
      beforeEach(() => {
        result = instance.subtract(10);
      });
      it("should return a Timestamp instance", () => {
        expect(result instanceof Timestamp).toEqual(true);
      });
      it("should not be the same instance as the original timestamp", () => {
        expect(result).not.toBe(instance);
      });
      it("should reflect the correct timestamp (10 milliseconds in the past)", () => {
        expect(result.timestamp).toEqual(1502372574340);
      });
      it("should not have changed the timestamp of the original instance", () => {
        expect(instance.timestamp).toEqual(1502372574350);
      });
    });
  });
  describe("When Timestamp is created for the current moment", () => {
    "use strict";
    let instance;
    beforeEach(() => {
      instance = Timestamp.now();
    });
    it("should not be close to the current time", () => {
      const milliseconds = (/* @__PURE__ */ new Date()).getTime();
      expect(milliseconds - instance.timestamp < 500).toEqual(true);
    });
  });
  describe("When comparing two unequal Timestamp instances", () => {
    "use strict";
    let earlier;
    let later;
    beforeEach(() => {
      earlier = new Timestamp(123);
      later = new Timestamp(456);
    });
    it('The earlier timestamp should be considered "before" the later timestamp', () => {
      expect(earlier.getIsBefore(later)).toEqual(true);
    });
    it('The earlier timestamp should not be considered "after" the later timestamp', () => {
      expect(earlier.getIsAfter(later)).toEqual(false);
    });
    it('The earlier timestamp should not be considered "equal to" the later timestamp', () => {
      expect(earlier.getIsEqual(later)).toEqual(false);
    });
    it('The later timestamp should be considered "after" the earlier timestamp', () => {
      expect(later.getIsAfter(earlier)).toEqual(true);
    });
    it('The later timestamp should not be considered "before" the earlier timestamp', () => {
      expect(later.getIsBefore(earlier)).toEqual(false);
    });
    it('The later timestamp should not be considered "equal to" the earlier timestamp', () => {
      expect(later.getIsEqual(earlier)).toEqual(false);
    });
    it("compareTimestamps should sort the timestamps", () => {
      expect(Timestamp.compareTimestamps(earlier, later) < 0).toEqual(true);
    });
  });
  describe("When comparing two equal Timestamp instances", () => {
    let a;
    let b;
    beforeEach(() => {
      a = new Timestamp(789);
      b = new Timestamp(789);
    });
    it('Timestamp a should not be considered "before" timestamp b', () => {
      expect(a.getIsBefore(b)).toEqual(false);
    });
    it('Timestamp a should not not be considered "after" timestamp b', () => {
      expect(a.getIsAfter(b)).toEqual(false);
    });
    it('Timestamp a should be considered "equal to" timestamp b', () => {
      expect(a.getIsEqual(b)).toEqual(true);
    });
    it('Timestamp b should not be considered "after" timestamp a', () => {
      expect(b.getIsAfter(a)).toEqual(false);
    });
    it('Timestamp b should not be considered "before" timestamp a', () => {
      expect(b.getIsBefore(a)).toEqual(false);
    });
    it('Timestamp b should be considered "equal to" timestamp a', () => {
      expect(b.getIsEqual(a)).toEqual(true);
    });
  });
  describe("When comparing the same Timestamp instances", () => {
    let ts;
    beforeEach(() => {
      ts = new Timestamp(12345678);
    });
    it("The timestamp should be considered equal to itself", () => {
      expect(ts.getIsEqual(ts)).toEqual(true);
    });
    it('The timestamp should not be considered "after" itself', () => {
      expect(ts.getIsAfter(ts)).toEqual(false);
    });
    it('The timestamp should not be considered "before" itself', () => {
      expect(ts.getIsBefore(ts)).toEqual(false);
    });
  });

  // lang/timezone.js
  function getTimezones() {
    return timezoneNames;
  }
  function hasTimezone(name) {
    argumentIsRequired(name, "name", String);
    return getTimezones().some((candidate) => {
      return candidate === name;
    });
  }
  function guessTimezone() {
    let guess;
    try {
      guess = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      guess = null;
    }
    return guess;
  }
  var timezoneData = [
    [
      "Africa",
      "Abidjan",
      "Accra",
      "Addis_Ababa",
      "Algiers",
      "Asmara",
      "Asmera",
      "Bamako",
      "Bangui",
      "Banjul",
      "Bissau",
      "Blantyre",
      "Brazzaville",
      "Bujumbura",
      "Cairo",
      "Casablanca",
      "Ceuta",
      "Conakry",
      "Dakar",
      "Dar_es_Salaam",
      "Djibouti",
      "Douala",
      "El_Aaiun",
      "Freetown",
      "Gaborone",
      "Harare",
      "Johannesburg",
      "Juba",
      "Kampala",
      "Khartoum",
      "Kigali",
      "Kinshasa",
      "Lagos",
      "Libreville",
      "Lome",
      "Luanda",
      "Lubumbashi",
      "Lusaka",
      "Malabo",
      "Maputo",
      "Maseru",
      "Mbabane",
      "Mogadishu",
      "Monrovia",
      "Nairobi",
      "Ndjamena",
      "Niamey",
      "Nouakchott",
      "Ouagadougou",
      "Porto-Novo",
      "Sao_Tome",
      "Timbuktu",
      "Tripoli",
      "Tunis",
      "Windhoek"
    ],
    [
      "America",
      "Adak",
      "Anchorage",
      "Anguilla",
      "Antigua",
      "Araguaina",
      "Argentina/Buenos_Aires",
      "Argentina/Catamarca",
      "Argentina/ComodRivadavia",
      "Argentina/Cordoba",
      "Argentina/Jujuy",
      "Argentina/La_Rioja",
      "Argentina/Mendoza",
      "Argentina/Rio_Gallegos",
      "Argentina/Salta",
      "Argentina/San_Juan",
      "Argentina/San_Luis",
      "Argentina/Tucuman",
      "Argentina/Ushuaia",
      "Aruba",
      "Asuncion",
      "Atikokan",
      "Atka",
      "Bahia",
      "Bahia_Banderas",
      "Barbados",
      "Belem",
      "Belize",
      "Blanc-Sablon",
      "Boa_Vista",
      "Bogota",
      "Boise",
      "Buenos_Aires",
      "Cambridge_Bay",
      "Campo_Grande",
      "Cancun",
      "Caracas",
      "Catamarca",
      "Cayenne",
      "Cayman",
      "Chicago",
      "Chihuahua",
      "Ciudad_Juarez",
      "Coral_Harbour",
      "Cordoba",
      "Costa_Rica",
      "Creston",
      "Cuiaba",
      "Curacao",
      "Danmarkshavn",
      "Dawson",
      "Dawson_Creek",
      "Denver",
      "Detroit",
      "Dominica",
      "Edmonton",
      "Eirunepe",
      "El_Salvador",
      "Ensenada",
      "Fort_Nelson",
      "Fort_Wayne",
      "Fortaleza",
      "Glace_Bay",
      "Godthab",
      "Goose_Bay",
      "Grand_Turk",
      "Grenada",
      "Guadeloupe",
      "Guatemala",
      "Guayaquil",
      "Guyana",
      "Halifax",
      "Havana",
      "Hermosillo",
      "Indiana/Indianapolis",
      "Indiana/Knox",
      "Indiana/Marengo",
      "Indiana/Petersburg",
      "Indiana/Tell_City",
      "Indiana/Vevay",
      "Indiana/Vincennes",
      "Indiana/Winamac",
      "Indianapolis",
      "Inuvik",
      "Iqaluit",
      "Jamaica",
      "Jujuy",
      "Juneau",
      "Kentucky/Louisville",
      "Kentucky/Monticello",
      "Knox_IN",
      "Kralendijk",
      "La_Paz",
      "Lima",
      "Los_Angeles",
      "Louisville",
      "Lower_Princes",
      "Maceio",
      "Managua",
      "Manaus",
      "Marigot",
      "Martinique",
      "Matamoros",
      "Mazatlan",
      "Mendoza",
      "Menominee",
      "Merida",
      "Metlakatla",
      "Mexico_City",
      "Miquelon",
      "Moncton",
      "Monterrey",
      "Montevideo",
      "Montreal",
      "Montserrat",
      "Nassau",
      "New_York",
      "Nipigon",
      "Nome",
      "Noronha",
      "North_Dakota/Beulah",
      "North_Dakota/Center",
      "North_Dakota/New_Salem",
      "Nuuk",
      "Ojinaga",
      "Panama",
      "Pangnirtung",
      "Paramaribo",
      "Phoenix",
      "Port-au-Prince",
      "Port_of_Spain",
      "Porto_Acre",
      "Porto_Velho",
      "Puerto_Rico",
      "Punta_Arenas",
      "Rainy_River",
      "Rankin_Inlet",
      "Recife",
      "Regina",
      "Resolute",
      "Rio_Branco",
      "Rosario",
      "Santa_Isabel",
      "Santarem",
      "Santiago",
      "Santo_Domingo",
      "Sao_Paulo",
      "Scoresbysund",
      "Shiprock",
      "Sitka",
      "St_Barthelemy",
      "St_Johns",
      "St_Kitts",
      "St_Lucia",
      "St_Thomas",
      "St_Vincent",
      "Swift_Current",
      "Tegucigalpa",
      "Thule",
      "Thunder_Bay",
      "Tijuana",
      "Toronto",
      "Tortola",
      "Vancouver",
      "Virgin",
      "Whitehorse",
      "Winnipeg",
      "Yakutat",
      "Yellowknife"
    ],
    [
      "Antarctica",
      "Casey",
      "Davis",
      "DumontDUrville",
      "Macquarie",
      "Mawson",
      "McMurdo",
      "Palmer",
      "Rothera",
      "South_Pole",
      "Syowa",
      "Troll",
      "Vostok"
    ],
    [
      "Arctic",
      "Longyearbyen"
    ],
    [
      "Asia",
      "Aden",
      "Almaty",
      "Amman",
      "Anadyr",
      "Aqtau",
      "Aqtobe",
      "Ashgabat",
      "Ashkhabad",
      "Atyrau",
      "Baghdad",
      "Bahrain",
      "Baku",
      "Bangkok",
      "Barnaul",
      "Beirut",
      "Bishkek",
      "Brunei",
      "Calcutta",
      "Chita",
      "Choibalsan",
      "Chongqing",
      "Chungking",
      "Colombo",
      "Dacca",
      "Damascus",
      "Dhaka",
      "Dili",
      "Dubai",
      "Dushanbe",
      "Famagusta",
      "Gaza",
      "Harbin",
      "Hebron",
      "Ho_Chi_Minh",
      "Hong_Kong",
      "Hovd",
      "Irkutsk",
      "Istanbul",
      "Jakarta",
      "Jayapura",
      "Jerusalem",
      "Kabul",
      "Kamchatka",
      "Karachi",
      "Kashgar",
      "Kathmandu",
      "Katmandu",
      "Khandyga",
      "Kolkata",
      "Krasnoyarsk",
      "Kuala_Lumpur",
      "Kuching",
      "Kuwait",
      "Macao",
      "Macau",
      "Magadan",
      "Makassar",
      "Manila",
      "Muscat",
      "Nicosia",
      "Novokuznetsk",
      "Novosibirsk",
      "Omsk",
      "Oral",
      "Phnom_Penh",
      "Pontianak",
      "Pyongyang",
      "Qatar",
      "Qostanay",
      "Qyzylorda",
      "Rangoon",
      "Riyadh",
      "Saigon",
      "Sakhalin",
      "Samarkand",
      "Seoul",
      "Shanghai",
      "Singapore",
      "Srednekolymsk",
      "Taipei",
      "Tashkent",
      "Tbilisi",
      "Tehran",
      "Tel_Aviv",
      "Thimbu",
      "Thimphu",
      "Tokyo",
      "Tomsk",
      "Ujung_Pandang",
      "Ulaanbaatar",
      "Ulan_Bator",
      "Urumqi",
      "Ust-Nera",
      "Vientiane",
      "Vladivostok",
      "Yakutsk",
      "Yangon",
      "Yekaterinburg",
      "Yerevan"
    ],
    [
      "Atlantic",
      "Azores",
      "Bermuda",
      "Canary",
      "Cape_Verde",
      "Faeroe",
      "Faroe",
      "Jan_Mayen",
      "Madeira",
      "Reykjavik",
      "South_Georgia",
      "St_Helena",
      "Stanley"
    ],
    [
      "Australia",
      "ACT",
      "Adelaide",
      "Brisbane",
      "Broken_Hill",
      "Canberra",
      "Currie",
      "Darwin",
      "Eucla",
      "Hobart",
      "LHI",
      "Lindeman",
      "Lord_Howe",
      "Melbourne",
      "NSW",
      "North",
      "Perth",
      "Queensland",
      "South",
      "Sydney",
      "Tasmania",
      "Victoria",
      "West",
      "Yancowinna"
    ],
    [
      "Brazil",
      "Acre",
      "DeNoronha",
      "East",
      "West"
    ],
    [
      "Canada",
      "Atlantic",
      "Central",
      "Eastern",
      "Mountain",
      "Newfoundland",
      "Pacific",
      "Saskatchewan",
      "Yukon"
    ],
    ["CET"],
    [
      "Chile",
      "Continental",
      "EasterIsland"
    ],
    ["CST6CDT"],
    ["Cuba"],
    ["EET"],
    ["Egypt"],
    ["Eire"],
    ["EST"],
    ["EST5EDT"],
    [
      "Etc",
      "GMT",
      "GMT+0",
      "GMT+1",
      "GMT+10",
      "GMT+11",
      "GMT+12",
      "GMT+2",
      "GMT+3",
      "GMT+4",
      "GMT+5",
      "GMT+6",
      "GMT+7",
      "GMT+8",
      "GMT+9",
      "GMT-0",
      "GMT-1",
      "GMT-10",
      "GMT-11",
      "GMT-12",
      "GMT-13",
      "GMT-14",
      "GMT-2",
      "GMT-3",
      "GMT-4",
      "GMT-5",
      "GMT-6",
      "GMT-7",
      "GMT-8",
      "GMT-9",
      "GMT0",
      "Greenwich",
      "UCT",
      "UTC",
      "Universal",
      "Zulu"
    ],
    [
      "Europe",
      "Amsterdam",
      "Andorra",
      "Astrakhan",
      "Athens",
      "Belfast",
      "Belgrade",
      "Berlin",
      "Bratislava",
      "Brussels",
      "Bucharest",
      "Budapest",
      "Busingen",
      "Chisinau",
      "Copenhagen",
      "Dublin",
      "Gibraltar",
      "Guernsey",
      "Helsinki",
      "Isle_of_Man",
      "Istanbul",
      "Jersey",
      "Kaliningrad",
      "Kiev",
      "Kirov",
      "Kyiv",
      "Lisbon",
      "Ljubljana",
      "London",
      "Luxembourg",
      "Madrid",
      "Malta",
      "Mariehamn",
      "Minsk",
      "Monaco",
      "Moscow",
      "Nicosia",
      "Oslo",
      "Paris",
      "Podgorica",
      "Prague",
      "Riga",
      "Rome",
      "Samara",
      "San_Marino",
      "Sarajevo",
      "Saratov",
      "Simferopol",
      "Skopje",
      "Sofia",
      "Stockholm",
      "Tallinn",
      "Tirane",
      "Tiraspol",
      "Ulyanovsk",
      "Uzhgorod",
      "Vaduz",
      "Vatican",
      "Vienna",
      "Vilnius",
      "Volgograd",
      "Warsaw",
      "Zagreb",
      "Zaporozhye",
      "Zurich"
    ],
    ["GB"],
    ["GB-Eire"],
    ["GMT"],
    ["GMT-0"],
    ["GMT+0"],
    ["GMT0"],
    ["Greenwich"],
    ["Hongkong"],
    ["HST"],
    ["Iceland"],
    [
      "Indian",
      "Antananarivo",
      "Chagos",
      "Christmas",
      "Cocos",
      "Comoro",
      "Kerguelen",
      "Mahe",
      "Maldives",
      "Mauritius",
      "Mayotte",
      "Reunion"
    ],
    ["Iran"],
    ["Israel"],
    ["Jamaica"],
    ["Japan"],
    ["Kwajalein"],
    ["Libya"],
    ["MET"],
    [
      "Mexico",
      "BajaNorte",
      "BajaSur",
      "General"
    ],
    ["MST"],
    ["MST7MDT"],
    ["Navajo"],
    ["NZ"],
    ["NZ-CHAT"],
    [
      "Pacific",
      "Apia",
      "Auckland",
      "Bougainville",
      "Chatham",
      "Chuuk",
      "Easter",
      "Efate",
      "Enderbury",
      "Fakaofo",
      "Fiji",
      "Funafuti",
      "Galapagos",
      "Gambier",
      "Guadalcanal",
      "Guam",
      "Honolulu",
      "Johnston",
      "Kanton",
      "Kiritimati",
      "Kosrae",
      "Kwajalein",
      "Majuro",
      "Marquesas",
      "Midway",
      "Nauru",
      "Niue",
      "Norfolk",
      "Noumea",
      "Pago_Pago",
      "Palau",
      "Pitcairn",
      "Pohnpei",
      "Ponape",
      "Port_Moresby",
      "Rarotonga",
      "Saipan",
      "Samoa",
      "Tahiti",
      "Tarawa",
      "Tongatapu",
      "Truk",
      "Wake",
      "Wallis",
      "Yap"
    ],
    ["Poland"],
    ["Portugal"],
    ["PRC"],
    ["PST8PDT"],
    ["ROC"],
    ["ROK"],
    ["Singapore"],
    ["Turkey"],
    ["UCT"],
    ["Universal"],
    [
      "US",
      "Alaska",
      "Aleutian",
      "Arizona",
      "Central",
      "East-Indiana",
      "Eastern",
      "Hawaii",
      "Indiana-Starke",
      "Michigan",
      "Mountain",
      "Pacific",
      "Samoa"
    ],
    ["UTC"],
    ["W-SU"],
    ["WET"],
    ["Zulu"]
  ];
  var timezoneNames = timezoneData.reduce((accumulator, a) => {
    if (a.length === 1) {
      accumulator.push(a[0]);
    } else {
      a.forEach((b, i) => {
        if (i === 0) {
          return;
        }
        accumulator.push(`${a[0]}/${b}`);
      });
    }
    return accumulator;
  }, []);

  // ../../node_modules/date-fns-tz/dist/esm/_lib/tzTokenizeDate/index.js
  function tzTokenizeDate(date2, timeZone) {
    const dtf = getDateTimeFormat(timeZone);
    return "formatToParts" in dtf ? partsOffset(dtf, date2) : hackyOffset(dtf, date2);
  }
  var typeToPos = {
    year: 0,
    month: 1,
    day: 2,
    hour: 3,
    minute: 4,
    second: 5
  };
  function partsOffset(dtf, date2) {
    try {
      const formatted = dtf.formatToParts(date2);
      const filled = [];
      for (let i = 0; i < formatted.length; i++) {
        const pos = typeToPos[formatted[i].type];
        if (pos !== void 0) {
          filled[pos] = parseInt(formatted[i].value, 10);
        }
      }
      return filled;
    } catch (error) {
      if (error instanceof RangeError) {
        return [NaN];
      }
      throw error;
    }
  }
  function hackyOffset(dtf, date2) {
    const formatted = dtf.format(date2);
    const parsed = /(\d+)\/(\d+)\/(\d+),? (\d+):(\d+):(\d+)/.exec(formatted);
    return [
      parseInt(parsed[3], 10),
      parseInt(parsed[1], 10),
      parseInt(parsed[2], 10),
      parseInt(parsed[4], 10),
      parseInt(parsed[5], 10),
      parseInt(parsed[6], 10)
    ];
  }
  var dtfCache = {};
  var testDateFormatted = new Intl.DateTimeFormat("en-US", {
    hourCycle: "h23",
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(/* @__PURE__ */ new Date("2014-06-25T04:00:00.123Z"));
  var hourCycleSupported = testDateFormatted === "06/25/2014, 00:00:00" || testDateFormatted === "\u200E06\u200E/\u200E25\u200E/\u200E2014\u200E \u200E00\u200E:\u200E00\u200E:\u200E00";
  function getDateTimeFormat(timeZone) {
    if (!dtfCache[timeZone]) {
      dtfCache[timeZone] = hourCycleSupported ? new Intl.DateTimeFormat("en-US", {
        hourCycle: "h23",
        timeZone,
        year: "numeric",
        month: "numeric",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }) : new Intl.DateTimeFormat("en-US", {
        hour12: false,
        timeZone,
        year: "numeric",
        month: "numeric",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    }
    return dtfCache[timeZone];
  }

  // ../../node_modules/date-fns-tz/dist/esm/_lib/newDateUTC/index.js
  function newDateUTC(fullYear, month, day, hour, minute, second, millisecond) {
    const utcDate = /* @__PURE__ */ new Date(0);
    utcDate.setUTCFullYear(fullYear, month, day);
    utcDate.setUTCHours(hour, minute, second, millisecond);
    return utcDate;
  }

  // ../../node_modules/date-fns-tz/dist/esm/_lib/tzParseTimezone/index.js
  var MILLISECONDS_IN_HOUR = 36e5;
  var MILLISECONDS_IN_MINUTE = 6e4;
  var patterns = {
    timezone: /([Z+-].*)$/,
    timezoneZ: /^(Z)$/,
    timezoneHH: /^([+-]\d{2})$/,
    timezoneHHMM: /^([+-])(\d{2}):?(\d{2})$/
  };
  function tzParseTimezone(timezoneString, date2, isUtcDate) {
    if (!timezoneString) {
      return 0;
    }
    let token = patterns.timezoneZ.exec(timezoneString);
    if (token) {
      return 0;
    }
    let hours;
    let absoluteOffset;
    token = patterns.timezoneHH.exec(timezoneString);
    if (token) {
      hours = parseInt(token[1], 10);
      if (!validateTimezone(hours)) {
        return NaN;
      }
      return -(hours * MILLISECONDS_IN_HOUR);
    }
    token = patterns.timezoneHHMM.exec(timezoneString);
    if (token) {
      hours = parseInt(token[2], 10);
      const minutes = parseInt(token[3], 10);
      if (!validateTimezone(hours, minutes)) {
        return NaN;
      }
      absoluteOffset = Math.abs(hours) * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE;
      return token[1] === "+" ? -absoluteOffset : absoluteOffset;
    }
    if (isValidTimezoneIANAString(timezoneString)) {
      date2 = new Date(date2 || Date.now());
      const utcDate = isUtcDate ? date2 : toUtcDate(date2);
      const offset = calcOffset(utcDate, timezoneString);
      const fixedOffset = isUtcDate ? offset : fixOffset(date2, offset, timezoneString);
      return -fixedOffset;
    }
    return NaN;
  }
  function toUtcDate(date2) {
    return newDateUTC(date2.getFullYear(), date2.getMonth(), date2.getDate(), date2.getHours(), date2.getMinutes(), date2.getSeconds(), date2.getMilliseconds());
  }
  function calcOffset(date2, timezoneString) {
    const tokens = tzTokenizeDate(date2, timezoneString);
    const asUTC = newDateUTC(tokens[0], tokens[1] - 1, tokens[2], tokens[3] % 24, tokens[4], tokens[5], 0).getTime();
    let asTS = date2.getTime();
    const over = asTS % 1e3;
    asTS -= over >= 0 ? over : 1e3 + over;
    return asUTC - asTS;
  }
  function fixOffset(date2, offset, timezoneString) {
    const localTS = date2.getTime();
    let utcGuess = localTS - offset;
    const o2 = calcOffset(new Date(utcGuess), timezoneString);
    if (offset === o2) {
      return offset;
    }
    utcGuess -= o2 - offset;
    const o3 = calcOffset(new Date(utcGuess), timezoneString);
    if (o2 === o3) {
      return o2;
    }
    return Math.max(o2, o3);
  }
  function validateTimezone(hours, minutes) {
    return -23 <= hours && hours <= 23 && (minutes == null || 0 <= minutes && minutes <= 59);
  }
  var validIANATimezoneCache = {};
  function isValidTimezoneIANAString(timeZoneString) {
    if (validIANATimezoneCache[timeZoneString])
      return true;
    try {
      new Intl.DateTimeFormat(void 0, { timeZone: timeZoneString });
      validIANATimezoneCache[timeZoneString] = true;
      return true;
    } catch (error) {
      return false;
    }
  }

  // ../../node_modules/date-fns-tz/dist/esm/format/formatters/index.js
  var MILLISECONDS_IN_MINUTE2 = 60 * 1e3;

  // ../../node_modules/date-fns-tz/dist/esm/getTimezoneOffset/index.js
  function getTimezoneOffset(timeZone, date2) {
    return -tzParseTimezone(timeZone, date2);
  }

  // lang/Timezones.js
  var Timezones = class _Timezones extends Enum {
    /**
     * @param {string} code - The timezone name.
     */
    constructor(code) {
      super(code, code);
    }
    /**
     * Attempts to determine whether daylight saving time is in effect.
     *
     * @public
     * @param {number=} timestamp - The moment at which daylight saving time is checked; otherwise, the current time is used.
     * @returns {boolean}
     */
    getIsDaylightSavingsTime(timestamp) {
      argumentIsOptional(timestamp, "timestamp", Number);
      const now = /* @__PURE__ */ new Date();
      let baseline = Date.UTC(now.getFullYear(), 0, 1);
      let candidate;
      if (timestamp) {
        candidate = timestamp;
      } else {
        candidate = now.getTime();
      }
      const baselineOffset = this.getUtcOffset(baseline);
      const candidateOffset = this.getUtcOffset(candidate);
      return baselineOffset !== candidateOffset;
    }
    /**
     * Calculates and returns the offset of a timezone from UTC.
     *
     * @public
     * @param {number=} timestamp - The moment at which the offset is calculated; otherwise, the current time is used.
     * @param {boolean=} milliseconds - Whether the offset should be returned in milliseconds instead of minutes.
     * @returns {number}
     */
    getUtcOffset(timestamp, milliseconds) {
      argumentIsOptional(timestamp, "timestamp", Number);
      argumentIsOptional(milliseconds, "milliseconds", Boolean);
      let timestampToUse;
      if (number(timestamp)) {
        timestampToUse = timestamp;
      } else {
        timestampToUse = (/* @__PURE__ */ new Date()).getTime();
      }
      let divisor;
      if (boolean(milliseconds) && milliseconds) {
        divisor = 1;
      } else {
        divisor = 60 * 1e3;
      }
      return getTimezoneOffset(this.code, new Date(timestampToUse)) / divisor;
    }
    /**
     * Given a code, returns the corresponding enumeration item.
     *
     * @public
     * @static
     * @param {string} code
     * @returns {Timezones|null}
     */
    static parse(code) {
      const value = Enum.fromCode(_Timezones, code);
      return value instanceof _Timezones ? value : null;
    }
    /**
     * UTC.
     *
     * @public
     * @static
     * @returns {Timezones}
     */
    static get UTC() {
      return utc;
    }
    /**
     * America/Chicago.
     *
     * @public
     * @static
     * @returns {Timezones}
     */
    static get AMERICA_CHICAGO() {
      return america_chicago;
    }
    /**
     * America/New_York.
     *
     * @public
     * @static
     * @returns {Timezones}
     */
    static get AMERICA_NEW_YORK() {
      return america_new_york;
    }
    /**
     * America/Denver.
     *
     * @public
     * @static
     * @returns {Timezones}
     */
    static get AMERICA_DENVER() {
      return america_denver;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[Timezone (name=${this.code})]`;
    }
  };
  getTimezones().forEach((name) => {
    new Timezones(name);
  });
  var utc = getRequiredTimezone("UTC");
  var america_chicago = getRequiredTimezone("America/Chicago");
  var america_new_york = getRequiredTimezone("America/New_York");
  var america_denver = getRequiredTimezone("America/Denver");
  function getRequiredTimezone(code) {
    const value = Timezones.parse(code);
    if (value === null) {
      throw new Error(`Timezone "${code}" is not registered.`);
    }
    return value;
  }

  // test/specs/lang/TimezonesSpec.js
  describe("When accessing static items", () => {
    "use strict";
    it("The timezone for Chicago should return the expected item", () => {
      expect(Timezones.AMERICA_CHICAGO.code).toEqual("America/Chicago");
    });
    it("The timezone for New York should return the expected item", () => {
      expect(Timezones.AMERICA_NEW_YORK.code).toEqual("America/New_York");
    });
    it("The timezone for Denver should return the expected item", () => {
      expect(Timezones.AMERICA_DENVER.code).toEqual("America/Denver");
    });
  });
  describe("When calculating timezone offset on 2019-10-02 UTC", () => {
    let timestamp;
    beforeEach(() => {
      timestamp = new Date(2019, 9, 2, 0, 0, 0).getTime();
    });
    describe("in minutes", () => {
      it("The UTC offset should be 0", () => {
        expect(Timezones.UTC.getUtcOffset(timestamp)).toEqual(0);
      });
      it("The AMERICA_CHICAGO offset should be -300", () => {
        expect(Timezones.AMERICA_CHICAGO.getUtcOffset(timestamp)).toEqual(-300);
      });
      it("The AMERICA_NEW_YORK offset should be -240", () => {
        expect(Timezones.AMERICA_NEW_YORK.getUtcOffset(timestamp)).toEqual(-240);
      });
      it("The Europe/Minsk offset should be 180", () => {
        expect(Timezones.parse("Europe/Minsk").getUtcOffset(timestamp)).toEqual(180);
      });
    });
    describe("in milliseconds", () => {
      it("The UTC offset should be 0", () => {
        expect(Timezones.UTC.getUtcOffset(timestamp)).toEqual(0);
      });
      it("The AMERICA_CHICAGO offset should be -300", () => {
        expect(Timezones.AMERICA_CHICAGO.getUtcOffset(timestamp, true)).toEqual(-18e6);
      });
      it("The AMERICA_NEW_YORK offset should be -240", () => {
        expect(Timezones.AMERICA_NEW_YORK.getUtcOffset(timestamp, true)).toEqual(-144e5);
      });
      it("The Europe/Minsk offset should be 180", () => {
        expect(Timezones.parse("Europe/Minsk").getUtcOffset(timestamp, true)).toEqual(108e5);
      });
    });
  });
  describe("When calculating timezone offset on 2019-11-04 UTC", () => {
    let timestamp;
    beforeEach(() => {
      timestamp = new Date(2019, 10, 4, 0, 0, 0).getTime();
    });
    describe("in minutes", () => {
      it("The UTC offset should be 0", () => {
        expect(Timezones.UTC.getUtcOffset(timestamp)).toEqual(0);
      });
      it("The AMERICA_CHICAGO offset should be -360", () => {
        expect(Timezones.AMERICA_CHICAGO.getUtcOffset(timestamp)).toEqual(-360);
      });
      it("The AMERICA_NEW_YORK offset should be -300", () => {
        expect(Timezones.AMERICA_NEW_YORK.getUtcOffset(timestamp)).toEqual(-300);
      });
      it("The Europe/Minsk offset should be 180", () => {
        expect(Timezones.parse("Europe/Minsk").getUtcOffset(timestamp)).toEqual(180);
      });
    });
    describe("in milliseconds", () => {
      it("The UTC offset should be 0", () => {
        expect(Timezones.UTC.getUtcOffset(timestamp, true)).toEqual(0);
      });
      it("The AMERICA_CHICAGO offset should be -360", () => {
        expect(Timezones.AMERICA_CHICAGO.getUtcOffset(timestamp, true)).toEqual(-216e5);
      });
      it("The AMERICA_NEW_YORK offset should be -300", () => {
        expect(Timezones.AMERICA_NEW_YORK.getUtcOffset(timestamp, true)).toEqual(-18e6);
      });
      it("The Europe/Minsk offset should be 180", () => {
        expect(Timezones.parse("Europe/Minsk").getUtcOffset(timestamp, true)).toEqual(108e5);
      });
    });
  });
  describe("When attempting to determine if daylight savings time is in effect", () => {
    it("should be in effect on 2020-07-01 at 00:00 in AMERICA_CHICAGO", () => {
      expect(Timezones.AMERICA_CHICAGO.getIsDaylightSavingsTime(1593666e6)).toEqual(true);
    });
    it("should not be in effect on 2020-12-01 at 00:00 in AMERICA_CHICAGO", () => {
      expect(Timezones.AMERICA_CHICAGO.getIsDaylightSavingsTime(16068024e5)).toEqual(false);
    });
  });

  // test/specs/lang/arraySpec.js
  describe("when reducing an array to unique values", () => {
    "use strict";
    describe("and using the first four rows of pascals triangle", () => {
      let unique2;
      beforeEach(() => {
        unique2 = unique([1, 1, 1, 1, 2, 1, 1, 3, 3, 1]);
      });
      it("should only contain 3 unique elements", () => {
        expect(unique2.length).toEqual(3);
      });
      it("should contain 1", () => {
        expect(unique2.indexOf(1)).toEqual(0);
      });
      it("should contain 2", () => {
        expect(unique2.indexOf(2)).toEqual(1);
      });
      it("should contain 3", () => {
        expect(unique2.indexOf(3)).toEqual(2);
      });
    });
  });
  describe("when reducing an array of objects to unique values", () => {
    "use strict";
    describe("and using the first four rows of pascals triangle", () => {
      let unique2;
      let one;
      let two;
      let three;
      let four;
      let five;
      let six;
      beforeEach(() => {
        unique2 = uniqueBy([one = { x: 1 }, two = { x: 2 }, three = { x: 3 }, four = { x: 1 }, five = { x: 2 }, six = { x: 3 }], (obj) => {
          return obj.x;
        });
      });
      it("should only contain 3 unique elements", () => {
        expect(unique2.length).toEqual(3);
      });
      it("should contain the first item whose value is one", () => {
        expect(unique2[0]).toBe(one);
      });
      it("should contain the first item whose value is two", () => {
        expect(unique2[1]).toBe(two);
      });
      it("should contain the first item whose value is three", () => {
        expect(unique2[2]).toBe(three);
      });
    });
  });
  describe("when partitioning an array of three items", () => {
    "use strict";
    let original;
    beforeEach(() => {
      original = [1, 2, 3];
    });
    describe("using a partition size of 10", () => {
      let partitions;
      beforeEach(() => {
        partitions = partition(original, 10);
      });
      it("should return an array", () => {
        expect(partitions instanceof Array).toEqual(true);
      });
      it("should return a copy of the original array", () => {
        expect(partitions).not.toBe(original);
      });
      it("should contain one partition", () => {
        expect(partitions.length).toEqual(1);
      });
      it("the first partition should contain three items", () => {
        expect(partitions[0].length).toEqual(3);
      });
      it("the first partition item should be the first item", () => {
        expect(partitions[0][0]).toBe(original[0]);
      });
      it("the second partition item should be the first item", () => {
        expect(partitions[0][1]).toBe(original[1]);
      });
      it("the third partition item should be the first item", () => {
        expect(partitions[0][2]).toBe(original[2]);
      });
    });
    describe("using a partition size of two", () => {
      let partitions;
      beforeEach(() => {
        partitions = partition(original, 2);
      });
      it("should return an array", () => {
        expect(partitions instanceof Array).toEqual(true);
      });
      it("should return a copy of the original array", () => {
        expect(partitions).not.toBe(original);
      });
      it("should contain two partition", () => {
        expect(partitions.length).toEqual(2);
      });
      it("the first partition should contain two items", () => {
        expect(partitions[0].length).toEqual(2);
      });
      it("the second partition should contain one item", () => {
        expect(partitions[1].length).toEqual(1);
      });
      it("the first item of the first partition should be the first item", () => {
        expect(partitions[0][0]).toBe(original[0]);
      });
      it("the second item of the first partition should be the second item", () => {
        expect(partitions[0][1]).toBe(original[1]);
      });
      it("the first item of the second partition should be the third item", () => {
        expect(partitions[1][0]).toBe(original[2]);
      });
    });
  });
  describe("when partitioning empty array", () => {
    "use strict";
    let original;
    beforeEach(() => {
      original = [];
    });
    describe("using a partition size of 10", () => {
      let partitions;
      beforeEach(() => {
        partitions = partition(original, 10);
      });
      it("an empty array should be returned", () => {
        expect(partitions.length).toEqual(0);
      });
    });
  });
  describe("when flattening an array", () => {
    "use strict";
    let arrayOne;
    let arrayTwo;
    let itemA;
    let itemB;
    let itemC;
    let itemD;
    beforeEach(() => {
      arrayOne = [itemA = "a", itemB = "b", itemC = ["c"]];
      arrayTwo = [itemD = "d"];
    });
    describe("without using recursion", () => {
      let result;
      beforeEach(() => {
        result = flatten([arrayOne, arrayTwo], false);
      });
      it('the first item should be "a"', () => {
        expect(result[0]).toBe(itemA);
      });
      it('the second item should be "b"', () => {
        expect(result[1]).toBe(itemB);
      });
      it('the third item should be "c"', () => {
        expect(result[2]).toBe(itemC);
      });
      it('the forth item should be "d"', () => {
        expect(result[3]).toBe(itemD);
      });
    });
    describe("and using recursion", () => {
      let result;
      beforeEach(() => {
        result = flatten([arrayOne, arrayTwo], true);
      });
      it('the first item should be "a"', () => {
        expect(result[0]).toBe(itemA);
      });
      it('the second item should be "b"', () => {
        expect(result[1]).toBe(itemB);
      });
      it('the third item should be "c"', () => {
        expect(result[2]).toBe("c");
      });
      it('the forth item should be "d"', () => {
        expect(result[3]).toBe(itemD);
      });
    });
  });
  describe("when grouping an array", () => {
    "use strict";
    describe("and using objects containing the first three rows of pascals triangle", () => {
      let groups;
      beforeEach(() => {
        groups = groupBy([{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 2 }, { value: 1 }], (item) => {
          return item.value;
        });
      });
      it("should only contain 2 keys", () => {
        expect(Object.keys(groups).length).toEqual(2);
      });
      it("should have a key for number one", () => {
        expect(groups.hasOwnProperty(1)).toEqual(true);
      });
      it("should have five items grouped for the number one", () => {
        expect(groups[1].length).toEqual(5);
      });
      it("should an object with a value of one for each item grouped for the number one", () => {
        let group = groups[1];
        for (let i = 0; i < group.length; i++) {
          expect(group[i].value).toEqual(1);
        }
      });
      it("should have one item grouped for the number two", () => {
        expect(groups[2].length).toEqual(1);
      });
      it("should an object with a value of two for each item grouped for the number two", () => {
        let group = groups[2];
        for (let i = 0; i < group.length; i++) {
          expect(group[i].value).toEqual(2);
        }
      });
    });
    describe("when indexing an array", () => {
      describe("and using objects containing the first three prime numbers", () => {
        let groups;
        let one;
        let two;
        let three;
        beforeEach(() => {
          groups = indexBy([one = { value: 1 }, two = { value: 2 }, three = { value: 3 }], (item) => {
            return item.value;
          });
        });
        it("should contain 3 keys", () => {
          expect(Object.keys(groups).length).toEqual(3);
        });
        it("should have a key for number one", () => {
          expect(groups.hasOwnProperty(1)).toEqual(true);
        });
        it("should have a key for number two", () => {
          expect(groups.hasOwnProperty(2)).toEqual(true);
        });
        it("should have a key for number three", () => {
          expect(groups.hasOwnProperty(3)).toEqual(true);
        });
        it("should have the first object at key one", () => {
          expect(groups[1]).toBe(one);
        });
        it("should have the second object at key two", () => {
          expect(groups[2]).toBe(two);
        });
        it("should have the third object at key three", () => {
          expect(groups[3]).toBe(three);
        });
      });
    });
  });
  describe("when batching an array", () => {
    describe("when keys are sorted", () => {
      let batches;
      let one, two, three, four, five;
      beforeEach(() => {
        batches = batchBy([one = { value: "a" }, two = { value: "b" }, three = { value: "b" }, four = { value: "c" }, five = { value: "c" }], (item) => {
          return item.value;
        });
      });
      it("should contain 3 batches", () => {
        expect(batches.length).toEqual(3);
      });
      it("should have 1 item in first batch", () => {
        expect(batches[0].length).toEqual(1);
      });
      it("should have 2 items in second batch", () => {
        expect(batches[1].length).toEqual(2);
      });
      it("should have 2 items in third batch", () => {
        expect(batches[2].length).toEqual(2);
      });
    });
    describe("when keys are not sorted", () => {
      let batches;
      let one, two, three, four, five;
      beforeEach(() => {
        batches = batchBy([one = { value: "a" }, two = { value: "b" }, three = { value: "c" }, four = { value: "a" }, five = { value: "a" }], (item) => {
          return item.value;
        });
      });
      it("should contain 4 batches", () => {
        expect(batches.length).toEqual(4);
      });
      it("should have 1 item in first batch", () => {
        expect(batches[0].length).toEqual(1);
      });
      it("should have 1 item in second batch", () => {
        expect(batches[1].length).toEqual(1);
      });
      it("should have 1 item in third batch", () => {
        expect(batches[2].length).toEqual(1);
      });
      it("should have 2 items in fourth batch", () => {
        expect(batches[3].length).toEqual(2);
      });
    });
  });
  describe('when calculating the "difference" between two arrays', () => {
    describe("and the arrays are empty", () => {
      let difference2;
      beforeEach(() => {
        difference2 = difference([], []);
      });
      it("should be an array", () => {
        expect(difference2 instanceof Array).toEqual(true);
      });
      it("should be empty", () => {
        expect(difference2.length).toEqual(0);
      });
    });
    describe("and first array is [1,2] and the second array is [2,3]", () => {
      let difference2;
      beforeEach(() => {
        difference2 = difference([1, 2], [2, 3]);
      });
      it("should be an array", () => {
        expect(difference2 instanceof Array).toEqual(true);
      });
      it("should contain one element", () => {
        expect(difference2.length).toEqual(1);
      });
      it("the first element should be 1", () => {
        expect(difference2[0]).toEqual(1);
      });
    });
    describe("and first array is [2,3] and the second array is [1,2]", () => {
      let difference2;
      beforeEach(() => {
        difference2 = difference([2, 3], [1, 2]);
      });
      it("should be an array", () => {
        expect(difference2 instanceof Array).toEqual(true);
      });
      it("should contain one element", () => {
        expect(difference2.length).toEqual(1);
      });
      it("the first element should be 3", () => {
        expect(difference2[0]).toEqual(3);
      });
    });
    describe("and first array has a unique object and both arrays share an object", () => {
      let same;
      let unique2;
      let difference2;
      beforeEach(() => {
        same = {};
        difference2 = difference([same, unique2 = {}], [same]);
      });
      it("should be an array", () => {
        expect(difference2 instanceof Array).toEqual(true);
      });
      it("should contain one element", () => {
        expect(difference2.length).toEqual(1);
      });
      it("the first element should be the unique object", () => {
        expect(difference2[0]).toBe(unique2);
      });
    });
    describe("and second array has a unique object and both arrays share an object", () => {
      let same;
      let unique2;
      let difference2;
      beforeEach(() => {
        same = {};
        difference2 = difference([same], [same, unique2 = {}]);
      });
      it("should be an array", () => {
        expect(difference2 instanceof Array).toEqual(true);
      });
      it("should contain zero elements", () => {
        expect(difference2.length).toEqual(0);
      });
    });
  });
  describe('when calculating the "difference" between two arrays using key selectors', () => {
    describe("and the arrays are empty", () => {
      let difference2;
      beforeEach(() => {
        difference2 = differenceBy([], [], (x) => x.key);
      });
      it("should be an array", () => {
        expect(difference2 instanceof Array).toEqual(true);
      });
      it("should be empty", () => {
        expect(difference2.length).toEqual(0);
      });
    });
    describe("and first array is [{key:1}, {key:2}] and the second array is [{key:2}, {key:3}]", () => {
      let difference2;
      beforeEach(() => {
        difference2 = differenceBy([{ key: 1 }, { key: 2 }], [{ key: 2 }, { key: 3 }], (x) => x.key);
      });
      it("should be an array", () => {
        expect(difference2 instanceof Array).toEqual(true);
      });
      it("should contain one element", () => {
        expect(difference2.length).toEqual(1);
      });
      it("the first element key should be 1", () => {
        expect(difference2[0].key).toEqual(1);
      });
    });
    describe("and first array is [{key:2}, {key:3}] and the second array is [{key:1}, {key:2}] ", () => {
      let difference2;
      beforeEach(() => {
        difference2 = differenceBy([{ key: 2 }, { key: 3 }], [{ key: 1 }, { key: 2 }], (x) => x.key);
      });
      it("should be an array", () => {
        expect(difference2 instanceof Array).toEqual(true);
      });
      it("should contain one element", () => {
        expect(difference2.length).toEqual(1);
      });
      it("the first element key should be 3", () => {
        expect(difference2[0].key).toEqual(3);
      });
    });
  });
  describe('when calculating the "union" of two arrays', () => {
    describe("and the arrays are empty", () => {
      let union2;
      beforeEach(() => {
        union2 = union([], []);
      });
      it("should be an array", () => {
        expect(union2 instanceof Array).toEqual(true);
      });
      it("should be empty", () => {
        expect(union2.length).toEqual(0);
      });
    });
    describe("and first array is [1,2] and the second array is [2,3]", () => {
      let union2;
      beforeEach(() => {
        union2 = union([1, 2], [2, 3]);
      });
      it("should be an array", () => {
        expect(union2 instanceof Array).toEqual(true);
      });
      it("should contain three elements", () => {
        expect(union2.length).toEqual(3);
      });
      it("the first element should be 1", () => {
        expect(union2[0]).toEqual(1);
      });
      it("the second element should be 2", () => {
        expect(union2[1]).toEqual(2);
      });
      it("the third element should be 3", () => {
        expect(union2[2]).toEqual(3);
      });
    });
    describe("and first array has a unique object and both arrays share an object", () => {
      let same;
      let unique2;
      let union2;
      beforeEach(() => {
        same = {};
        union2 = union([same, unique2 = {}], [same]);
      });
      it("should be an array", () => {
        expect(union2 instanceof Array).toEqual(true);
      });
      it("should contain two elements", () => {
        expect(union2.length).toEqual(2);
      });
      it('the first element the should be "same" object', () => {
        expect(union2[0]).toBe(same);
      });
      it('the second element the should be "unique" object', () => {
        expect(union2[1]).toBe(unique2);
      });
    });
  });
  describe('when calculating the "union" of two arrays using key selectors', () => {
    describe("and the arrays are empty", () => {
      let union2;
      beforeEach(() => {
        union2 = unionBy([], [], (x) => x.key);
      });
      it("should be an array", () => {
        expect(union2 instanceof Array).toEqual(true);
      });
      it("should be empty", () => {
        expect(union2.length).toEqual(0);
      });
    });
    describe("and first array is [{key:1}, {key:2}] and the second array is [{key:2}, {key:3}]", () => {
      let union2;
      beforeEach(() => {
        union2 = unionBy([{ key: 1 }, { key: 2 }], [{ key: 2 }, { key: 3 }], (x) => x.key);
      });
      it("should be an array", () => {
        expect(union2 instanceof Array).toEqual(true);
      });
      it("should contain three elements", () => {
        expect(union2.length).toEqual(3);
      });
      it("the first element key should be 1", () => {
        expect(union2[0].key).toEqual(1);
      });
      it("the second element key should be 2", () => {
        expect(union2[1].key).toEqual(2);
      });
      it("the third element key should be 3", () => {
        expect(union2[2].key).toEqual(3);
      });
    });
    describe("and first array has a unique object and both arrays share an object", () => {
      let union2;
      beforeEach(() => {
        union2 = unionBy([{ key: 1 }, { key: 2 }], [{ key: 2 }], (x) => x.key);
      });
      it("should be an array", () => {
        expect(union2 instanceof Array).toEqual(true);
      });
      it("should contain two elements", () => {
        expect(union2.length).toEqual(2);
      });
      it('the first element key the should be "same" object key', () => {
        expect(union2[0].key).toEqual(1);
      });
      it('the second element key the should be "unique" object key', () => {
        expect(union2[1].key).toEqual(2);
      });
    });
  });
  describe('when calculating the "intersection" of two arrays', () => {
    describe("and the arrays are empty", () => {
      let intersection2;
      beforeEach(() => {
        intersection2 = intersection([], []);
      });
      it("should be an array", () => {
        expect(intersection2 instanceof Array).toEqual(true);
      });
      it("should be empty", () => {
        expect(intersection2.length).toEqual(0);
      });
    });
    describe("and first array is [1,2] and the second array is [2,3]", () => {
      let intersection2;
      beforeEach(() => {
        intersection2 = intersection([1, 2], [2, 3]);
      });
      it("should be an array", () => {
        expect(intersection2 instanceof Array).toEqual(true);
      });
      it("should contain one element", () => {
        expect(intersection2.length).toEqual(1);
      });
      it("the first element should be 2", () => {
        expect(intersection2[0]).toEqual(2);
      });
    });
    describe("and first array has a unique object and both arrays share an object", () => {
      let same;
      let unique2;
      let intersection2;
      beforeEach(() => {
        same = {};
        intersection2 = intersection([same, unique2 = {}], [same]);
      });
      it("should be an array", () => {
        expect(intersection2 instanceof Array).toEqual(true);
      });
      it("should contain one elements", () => {
        expect(intersection2.length).toEqual(1);
      });
      it('the first element the "same" object', () => {
        expect(intersection2[0]).toBe(same);
      });
    });
  });
  describe('when calculating the "intersection" of two arrays using key selectors', () => {
    describe("and the arrays are empty", () => {
      let intersection2;
      beforeEach(() => {
        intersection2 = intersectionBy([], [], (x) => x.key);
      });
      it("should be an array", () => {
        expect(intersection2 instanceof Array).toEqual(true);
      });
      it("should be empty", () => {
        expect(intersection2.length).toEqual(0);
      });
    });
    describe("and first array is [{key:1}, {key:2}] and the second array is [{key:2}, {key:3}]", () => {
      let intersection2;
      beforeEach(() => {
        intersection2 = intersectionBy([{ key: 1 }, { key: 2 }], [{ key: 2 }, { key: 3 }], (x) => x.key);
      });
      it("should be an array", () => {
        expect(intersection2 instanceof Array).toEqual(true);
      });
      it("should contain one element", () => {
        expect(intersection2.length).toEqual(1);
      });
      it("the first element should have key 2", () => {
        expect(intersection2[0].key).toEqual(2);
      });
    });
    describe("and first array has a unique object and both arrays share an object", () => {
      let same;
      let unique2;
      let intersection2;
      beforeEach(() => {
        intersection2 = intersectionBy([{ key: 1 }, { key: 2 }], [{ key: 2 }], (x) => x.key);
      });
      it("should be an array", () => {
        expect(intersection2 instanceof Array).toEqual(true);
      });
      it("should contain one elements", () => {
        expect(intersection2.length).toEqual(1);
      });
      it('the first element key should the "same" object key', () => {
        expect(intersection2[0].key).toEqual(2);
      });
    });
  });
  describe('when calculating the "symmetric difference" of two arrays', () => {
    describe("and the arrays are empty", () => {
      let difference2;
      beforeEach(() => {
        difference2 = differenceSymmetric([], []);
      });
      it("should be an array", () => {
        expect(difference2 instanceof Array).toEqual(true);
      });
      it("should be empty", () => {
        expect(difference2.length).toEqual(0);
      });
    });
    describe("and first array is [1,2] and the second array is [2,3]", () => {
      let difference2;
      beforeEach(() => {
        difference2 = differenceSymmetric([1, 2], [2, 3]);
      });
      it("should be an array", () => {
        expect(difference2 instanceof Array).toEqual(true);
      });
      it("should contain two elements", () => {
        expect(difference2.length).toEqual(2);
      });
      it("the first element should be 1", () => {
        expect(difference2[0]).toEqual(1);
      });
      it("the second element should be 3", () => {
        expect(difference2[1]).toEqual(3);
      });
    });
    describe("and first array has a unique object and both arrays share an object", () => {
      let same;
      let unique2;
      let difference2;
      beforeEach(() => {
        same = {};
        difference2 = differenceSymmetric([same, unique2 = {}], [same]);
      });
      it("should be an array", () => {
        expect(difference2 instanceof Array).toEqual(true);
      });
      it("should contain one elements", () => {
        expect(difference2.length).toEqual(1);
      });
      it('the first element the "unique" object', () => {
        expect(difference2[0]).toBe(unique2);
      });
    });
  });
  describe('when calculating the "symmetric difference" of two arrays using key selectors', () => {
    describe("and the arrays are empty", () => {
      let difference2;
      beforeEach(() => {
        difference2 = differenceSymmetricBy([], [], (x) => x.key);
      });
      it("should be an array", () => {
        expect(difference2 instanceof Array).toEqual(true);
      });
      it("should be empty", () => {
        expect(difference2.length).toEqual(0);
      });
    });
    describe("and first array is [{key:1}, {key:2}] and the second array is [{key:2}, {key:3}]", () => {
      let difference2;
      beforeEach(() => {
        difference2 = differenceSymmetricBy([{ key: 1 }, { key: 2 }], [{ key: 2 }, { key: 3 }], (x) => x.key);
      });
      it("should be an array", () => {
        expect(difference2 instanceof Array).toEqual(true);
      });
      it("should contain two elements", () => {
        expect(difference2.length).toEqual(2);
      });
      it("the first element should have key 1", () => {
        expect(difference2[0].key).toEqual(1);
      });
      it("the second element should be 3", () => {
        expect(difference2[1].key).toEqual(3);
      });
    });
    describe("and first array has a unique object and both arrays share an object", () => {
      let difference2;
      beforeEach(() => {
        difference2 = differenceSymmetricBy([{ key: 1 }, { key: 2 }], [{ key: 2 }], (x) => x.key);
      });
      it("should be an array", () => {
        expect(difference2 instanceof Array).toEqual(true);
      });
      it("should contain one elements", () => {
        expect(difference2.length).toEqual(1);
      });
      it('the first element the "unique" object', () => {
        expect(difference2[0].key).toEqual(1);
      });
    });
  });
  describe("when taking the first item of an array", () => {
    it("an undefined value should be returned from an empty array", () => {
      let value = first([]);
      expect(value).toEqual(void 0);
    });
    it("the first value should be returned from a non-empty array", () => {
      let a = {};
      let b = {};
      let value = first([a, b]);
      expect(value).toBe(a);
    });
  });
  describe("when taking the last item of an array", () => {
    it("an undefined value should be returned from an empty array", () => {
      let value = last2([]);
      expect(value).toEqual(void 0);
    });
    it("the last value should be returned from a non-empty array", () => {
      let a = {};
      let b = {};
      let value = last2([a, b]);
      expect(value).toBe(b);
    });
  });
  describe("when removing an item from an array using a predicate", () => {
    let a;
    let item;
    beforeEach(() => {
      a = [{}, item = {}, {}];
      let predicate = (i) => {
        return i === item;
      };
      remove(a, predicate);
    });
    it("should have two items", () => {
      expect(a.length).toEqual(2);
    });
    it("the first item should not be the removed item", () => {
      expect(a[0]).not.toBe(item);
    });
    it("the second item should not be the removed item", () => {
      expect(a[1]).not.toBe(item);
    });
  });
  describe("when inserting into an empty array", () => {
    let a;
    let b;
    let item;
    let comparator2;
    beforeEach(() => {
      a = [];
      comparator2 = (a2, b2) => a2.localeCompare(b2);
      b = insert(a, item = "bryan", comparator2);
    });
    it("the array length should be 1", () => {
      expect(a.length).toEqual(1);
    });
    it("the resulting array should be the same array", () => {
      expect(a).toBe(a);
    });
    it("the first item should be the inserted item", () => {
      expect(a[0]).toEqual(item);
    });
  });
  describe("when inserting into an array with one item", () => {
    let a;
    let one;
    let comparator2;
    beforeEach(() => {
      a = [one = "imogen"];
      comparator2 = (a2, b) => a2.localeCompare(b);
    });
    describe("and the item will be sorted before the existing item", () => {
      let two;
      beforeEach(() => {
        insert(a, two = "bryan", comparator2);
      });
      it("the array length should be 2", () => {
        expect(a.length).toEqual(2);
      });
      it("the inserted item should be first", () => {
        expect(a[0]).toEqual(two);
      });
      it("the existing item should be last", () => {
        expect(a[1]).toEqual(one);
      });
    });
    describe("and the item will be sorted after the existing item", () => {
      let two;
      beforeEach(() => {
        insert(a, two = "rachel", comparator2);
      });
      it("the array length should be 2", () => {
        expect(a.length).toEqual(2);
      });
      it("the existing item should be first", () => {
        expect(a[0]).toEqual(one);
      });
      it("the inserted item should be last", () => {
        expect(a[1]).toEqual(two);
      });
    });
  });
  describe("when performing a binary search on an empty array", () => {
    let a;
    let comparator2;
    beforeEach(() => {
      a = [];
      comparator2 = (a2, b) => a2.value - b.value;
    });
    it("for an item that is not in the array", () => {
      expect(binarySearch(a, { value: 42 }, comparator2)).toEqual(null);
    });
  });
  describe("when performing a binary search on an array with one item", () => {
    let a;
    let comparator2;
    beforeEach(() => {
      a = [42];
      comparator2 = (a2, b) => a2 - b;
    });
    it("for an item that would be before the first item in the array", () => {
      expect(binarySearch(a, 41, comparator2)).toEqual(null);
    });
    it("for the first item in the array", () => {
      expect(binarySearch(a, 42, comparator2)).toEqual(42);
    });
    it("for an item that would be after the last item in the array", () => {
      expect(binarySearch(a, 43, comparator2)).toEqual(null);
    });
  });
  describe("when performing a binary search on an array with two items", () => {
    let a;
    let comparator2;
    beforeEach(() => {
      a = [123, 456];
      comparator2 = (a2, b) => a2 - b;
    });
    it("for an item that would be before the first item in the array", () => {
      expect(binarySearch(a, 122, comparator2)).toEqual(null);
    });
    it("for the first item in the array", () => {
      expect(binarySearch(a, 123, comparator2)).toEqual(123);
    });
    it("for an item that would be between the first and middle items in the array", () => {
      expect(binarySearch(a, 250, comparator2)).toEqual(null);
    });
    it("for the last item in the array", () => {
      expect(binarySearch(a, 456, comparator2)).toEqual(456);
    });
    it("for an item that would be after the last item in the array", () => {
      expect(binarySearch(a, 457, comparator2)).toEqual(null);
    });
  });
  describe("when performing a binary search on an array with three items", () => {
    let a;
    let comparator2;
    beforeEach(() => {
      a = [123, 456, 789];
      comparator2 = (a2, b) => a2 - b;
    });
    it("for an item that would be before the first item in the array", () => {
      expect(binarySearch(a, 122, comparator2)).toEqual(null);
    });
    it("for the first item in the array", () => {
      expect(binarySearch(a, 123, comparator2)).toEqual(123);
    });
    it("for an item that would be between the middle and last items in the array", () => {
      expect(binarySearch(a, 455, comparator2)).toEqual(null);
    });
    it("for an item that would be in the middle the array", () => {
      expect(binarySearch(a, 457, comparator2)).toEqual(null);
    });
    it("for the middle item in the array", () => {
      expect(binarySearch(a, 456, comparator2)).toEqual(456);
    });
    it("for the last item in the array", () => {
      expect(binarySearch(a, 789, comparator2)).toEqual(789);
    });
    it("for an item that would be after the last item in the array", () => {
      expect(binarySearch(a, 790, comparator2)).toEqual(null);
    });
  });
  describe("when performing a binary search on an array with twenty contiguous items", () => {
    let a;
    let comparator2;
    beforeEach(() => {
      a = [];
      for (let i = 1; i < 21; i++) {
        a.push(i);
      }
      comparator2 = (a2, b) => a2 - b;
    });
    it("for an item that would be before the first item in the array", () => {
      expect(binarySearch(a, 0, comparator2)).toEqual(null);
    });
    it("for the first item in the array", () => {
      expect(binarySearch(a, 1, comparator2)).toEqual(1);
    });
    it("for an item at the beginning of the array (2)", () => {
      expect(binarySearch(a, 2, comparator2)).toEqual(2);
    });
    it("for an an item in the middle of the array (9)", () => {
      expect(binarySearch(a, 9, comparator2)).toEqual(9);
    });
    it("for an an item in the middle of the array (10)", () => {
      expect(binarySearch(a, 10, comparator2)).toEqual(10);
    });
    it("for an an item in the middle of the array (11)", () => {
      expect(binarySearch(a, 11, comparator2)).toEqual(11);
    });
    it("for an item at the end of the array (19)", () => {
      expect(binarySearch(a, 2, comparator2)).toEqual(2);
    });
    it("for the last item in the array", () => {
      expect(binarySearch(a, 19, comparator2)).toEqual(19);
    });
    it("for an item that would be after the last item in the array", () => {
      expect(binarySearch(a, 21, comparator2)).toEqual(null);
    });
  });
  describe("when performing a binary search on an array with twenty one sparse items", () => {
    let a;
    let comparator2;
    beforeEach(() => {
      a = [];
      for (let i = 1; i < 22; i++) {
        a.push(i * 2);
      }
      comparator2 = (a2, b) => a2 - b;
    });
    it("for an item that would be before the first item in the array", () => {
      expect(binarySearch(a, 1, comparator2)).toEqual(null);
    });
    it("for the first item in the array", () => {
      expect(binarySearch(a, 2, comparator2)).toEqual(2);
    });
    it("for an item that would be after the first item in the array (3)", () => {
      expect(binarySearch(a, 3, comparator2)).toEqual(null);
    });
    it("for an item that would be after the first item in the array (5)", () => {
      expect(binarySearch(a, 5, comparator2)).toEqual(null);
    });
    it("for an item at the beginning of the array (4)", () => {
      expect(binarySearch(a, 4, comparator2)).toEqual(4);
    });
    it("for an item that would be around the the middle of the array (17)", () => {
      expect(binarySearch(a, 17, comparator2)).toEqual(null);
    });
    it("for an item that would be around the the middle of the array (19)", () => {
      expect(binarySearch(a, 19, comparator2)).toEqual(null);
    });
    it("for an item that would be around the the middle of the array (21)", () => {
      expect(binarySearch(a, 21, comparator2)).toEqual(null);
    });
    it("for an item that would be around the the middle of the array (23)", () => {
      expect(binarySearch(a, 23, comparator2)).toEqual(null);
    });
    it("for an an item in the middle of the array (18)", () => {
      expect(binarySearch(a, 18, comparator2)).toEqual(18);
    });
    it("for an an item in the middle of the array (20)", () => {
      expect(binarySearch(a, 20, comparator2)).toEqual(20);
    });
    it("for an an item in the middle of the array (22)", () => {
      expect(binarySearch(a, 22, comparator2)).toEqual(22);
    });
    it("for an item that would be before the last item in the array (39)", () => {
      expect(binarySearch(a, 39, comparator2)).toEqual(null);
    });
    it("for an item that would be before the last item in the array (41)", () => {
      expect(binarySearch(a, 41, comparator2)).toEqual(null);
    });
    it("for an item at the end of the array (40)", () => {
      expect(binarySearch(a, 40, comparator2)).toEqual(40);
    });
    it("for the last item in the array", () => {
      expect(binarySearch(a, 42, comparator2)).toEqual(42);
    });
    it("for an item that would be after the last item in the array", () => {
      expect(binarySearch(a, 43, comparator2)).toEqual(null);
    });
  });

  // test/specs/lang/assertSpec.js
  describe("when validating a required argument", () => {
    "use strict";
    it("should not throw when the argument has the expected type", () => {
      expect(() => argumentIsRequired("abc", "value", String)).not.toThrow();
    });
    it("should throw when the argument has the wrong type", () => {
      expect(() => argumentIsRequired(123, "value", String)).toThrow();
    });
  });
  describe("when checking two values for equality", () => {
    "use strict";
    it("should not throw when values are equal", () => {
      expect(() => areEqual("abc", "abc", "a", "b")).not.toThrow();
    });
    it("should throw when values are not equal", () => {
      expect(() => areEqual("abc", "def", "a", "b")).toThrow();
    });
  });
  describe("when checking two values for inequality", () => {
    "use strict";
    it("should not throw when values are not equal", () => {
      expect(() => areNotEqual("abc", "def", "a", "b")).not.toThrow();
    });
    it("should throw when values are equal", () => {
      expect(() => areNotEqual("abc", "abc", "a", "b")).toThrow();
    });
  });
  describe("when attempting to validate an array", () => {
    "use strict";
    class A {
      constructor() {
      }
    }
    class B extends A {
      constructor() {
        super();
      }
    }
    class C {
      constructor() {
      }
    }
    describe("that contains instances of the same ES6 class", () => {
      let value;
      beforeEach(() => {
        value = [new A()];
      });
      it("should be valid without a type constraint", () => {
        expect(() => argumentIsArray(value, "value")).not.toThrow();
      });
      it("should be valid with a type constraint", () => {
        expect(() => argumentIsArray(value, "value", A, "A")).not.toThrow();
      });
    });
    describe("that contains instances of an ES6 class and its subclasses", () => {
      let value;
      beforeEach(() => {
        value = [new A(), new B()];
      });
      it("should be valid without a type constraint", () => {
        expect(() => argumentIsArray(value, "value")).not.toThrow();
      });
      it("should be valid with the superclass type constraint", () => {
        expect(() => argumentIsArray(value, "value", A, "A")).not.toThrow();
      });
      it("should not be valid with the subclass type constraint", () => {
        expect(() => argumentIsArray(value, "value", B, "B")).toThrow();
      });
    });
    describe("that contains instances of an ES6 class, its subclasses, and unrelated classes", () => {
      let value;
      beforeEach(() => {
        value = [new A(), new B(), new C()];
      });
      it("should be valid without a type constraint", () => {
        expect(() => argumentIsArray(value, "value")).not.toThrow();
      });
      it("should not be valid with the superclass type constraint", () => {
        expect(() => argumentIsArray(value, "value", A, "A")).toThrow();
      });
      it("should not be valid with the subclass type constraint", () => {
        expect(() => argumentIsArray(value, "value", B, "B")).toThrow();
      });
    });
    describe("that uses a String type constraint", () => {
      it("should be valid when all items are strings", () => {
        const value = ["first", "second"];
        expect(() => argumentIsArray(value, "value", String)).not.toThrow();
      });
      it("should not be valid when an item is not a string", () => {
        const value = ["first", { value: "second" }];
        expect(() => argumentIsArray(value, "value", String)).toThrow();
      });
    });
    describe("that uses a Number type constraint", () => {
      it("should be valid when all items are numbers", () => {
        const value = [1, 2];
        expect(() => argumentIsArray(value, "value", Number)).not.toThrow();
      });
      it("should not be valid when an item is not a number", () => {
        const value = [1, "2"];
        expect(() => argumentIsArray(value, "value", Number)).toThrow();
      });
    });
    describe("that uses a Boolean type constraint", () => {
      it("should be valid when all items are booleans", () => {
        const value = [true, false];
        expect(() => argumentIsArray(value, "value", Boolean)).not.toThrow();
      });
      it("should not be valid when an item is not a boolean", () => {
        const value = [true, 1];
        expect(() => argumentIsArray(value, "value", Boolean)).toThrow();
      });
    });
    describe("that uses a Date type constraint", () => {
      it("should be valid when all items are dates", () => {
        const value = [/* @__PURE__ */ new Date(), /* @__PURE__ */ new Date()];
        expect(() => argumentIsArray(value, "value", Date)).not.toThrow();
      });
      it("should not be valid when an item is not a date", () => {
        const value = [/* @__PURE__ */ new Date(), "2026-06-12"];
        expect(() => argumentIsArray(value, "value", Date)).toThrow();
      });
    });
    describe("that uses a RegExp type constraint", () => {
      it("should be valid when all items are regular expressions", () => {
        const value = [/first/, /second/];
        expect(() => argumentIsArray(value, "value", RegExp)).not.toThrow();
      });
      it("should not be valid when an item is not a regular expression", () => {
        const value = [/first/, "second"];
        expect(() => argumentIsArray(value, "value", RegExp)).toThrow();
      });
    });
    describe("that uses an Array type constraint", () => {
      it("should be valid when all items are arrays", () => {
        const value = [[1], [2]];
        expect(() => argumentIsArray(value, "value", Array)).not.toThrow();
      });
      it("should not be valid when an item is not an array", () => {
        const value = [[1], { value: 2 }];
        expect(() => argumentIsArray(value, "value", Array)).toThrow();
      });
    });
    describe("that uses a Function type constraint", () => {
      it("should be valid when all items are functions", () => {
        const value = [
          () => null,
          function() {
            return null;
          }
        ];
        expect(() => argumentIsArray(value, "value", Function)).not.toThrow();
      });
      it("should not be valid when an item is not a function", () => {
        const value = [() => null, {}];
        expect(() => argumentIsArray(value, "value", Function)).toThrow();
      });
    });
    describe("that uses an Object type constraint", () => {
      it("should be valid when all items are objects", () => {
        const value = [{ first: true }, { second: true }];
        expect(() => argumentIsArray(value, "value", Object)).not.toThrow();
      });
      it("should not be valid when an item is not an object", () => {
        const value = [{ first: true }, "second"];
        expect(() => argumentIsArray(value, "value", Object)).toThrow();
      });
    });
    describe("that uses a custom item validator", () => {
      function isPositive(value) {
        if (value <= 0) {
          throw new Error("not positive");
        }
      }
      it("should be valid when every item passes the validator", () => {
        const value = [1, 2];
        expect(() => argumentIsArray(value, "value", isPositive, "positive")).not.toThrow();
      });
      it("should not be valid when the validator throws", () => {
        const value = [1, -2];
        expect(() => argumentIsArray(value, "value", isPositive, "positive")).toThrow();
      });
    });
    describe("that is not an array", () => {
      it("should not be valid", () => {
        expect(() => argumentIsArray({}, "value")).toThrow();
      });
    });
  });

  // test/specs/lang/attributesSpec.js
  describe('When "attributes.has" is used to check a top-level property', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        test: 123
      };
    });
    describe("and the property exists", () => {
      it("should return true", () => {
        expect(has(target, "test")).toEqual(true);
      });
    });
    describe("and the property does not exist", () => {
      it("should return true", () => {
        expect(has(target, "name")).toEqual(false);
      });
    });
  });
  describe('When "attributes.has" is used to check a top-level property (with an array)', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        test: 123
      };
    });
    describe("and the property exists", () => {
      it("should return true", () => {
        expect(has(target, ["test"])).toEqual(true);
      });
    });
    describe("and the property does not exist", () => {
      it("should return true", () => {
        expect(has(target, ["name"])).toEqual(false);
      });
    });
  });
  describe('When "attributes.has" is used to check a second-level property', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        nested: {
          test: 123
        },
        a: void 0,
        b: null
      };
    });
    describe("and the property exists", () => {
      it("should return true", () => {
        expect(has(target, "nested.test")).toEqual(true);
      });
    });
    describe("and the property does not exist", () => {
      it("should return true", () => {
        expect(has(target, "nested.name")).toEqual(false);
      });
    });
    describe("and the top-level property does not exist", () => {
      it("should return true", () => {
        expect(has(target, "wrong.name")).toEqual(false);
      });
    });
    describe("and the top-level property exists, but is undefined", () => {
      it("should return true", () => {
        expect(has(target, "a.name")).toEqual(false);
      });
    });
    describe("and the top-level property exists, but is null", () => {
      it("should return true", () => {
        expect(has(target, "b.name")).toEqual(false);
      });
    });
  });
  describe('When "attributes.has" is used to check a second-level property (with an array)', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        nested: {
          test: 123
        }
      };
    });
    describe("and the property exists", () => {
      it("should return true", () => {
        expect(has(target, ["nested", "test"])).toEqual(true);
      });
    });
    describe("and the property does not exist", () => {
      it("should return true", () => {
        expect(has(target, ["nested", "name"])).toEqual(false);
      });
    });
    describe("and the top-level property does not exist", () => {
      it("should return true", () => {
        expect(has(target, ["wrong", "name"])).toEqual(false);
      });
    });
  });
  describe('When "attributes.has" is called with an empty string', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        test: 123
      };
    });
    it("should return false", () => {
      expect(has(target, "")).toEqual(false);
    });
  });
  describe('When "attributes.has" is called with a zero-length array', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        test: 123
      };
    });
    it("should return false", () => {
      expect(has(target, [])).toEqual(false);
    });
  });
  describe('When "attributes.read" is used to get a top-level property', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        nested: {
          test: 123
        }
      };
    });
    describe("and the property exists", () => {
      it("should return the property value", () => {
        expect(read(target, "nested.test")).toEqual(123);
      });
    });
    describe("and the property does not exist", () => {
      it("should be undefined", () => {
        expect(read(target, "nested.name")).toBe(void 0);
      });
    });
  });
  describe('When "attributes.read" is used to get a top-level property (with an array)', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        nested: {
          test: 123
        }
      };
    });
    describe("and the property exists", () => {
      it("should return the property value", () => {
        expect(read(target, ["nested", "test"])).toEqual(123);
      });
    });
    describe("and the property does not exist", () => {
      it("should be undefined", () => {
        expect(read(target, ["nested", "name"])).toBe(void 0);
      });
    });
  });
  describe('When "attributes.read" is used to get a second-level property', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        nested: {
          test: 123
        }
      };
    });
    describe("and the property exists", () => {
      it("should return the property value", () => {
        expect(read(target, "nested.test")).toEqual(123);
      });
    });
    describe("and the property does not exist", () => {
      it("should be undefined", () => {
        expect(read(target, "nested.name")).toBe(void 0);
      });
    });
    describe("and the top-level property does not exist", () => {
      it("should be undefined", () => {
        expect(read(target, "wrong.name")).toBe(void 0);
      });
    });
  });
  describe('When "attributes.read" is used to get a second-level property (with an array)', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        nested: {
          test: 123
        }
      };
    });
    describe("and the property exists", () => {
      it("should return the property value", () => {
        expect(read(target, ["nested", "test"])).toEqual(123);
      });
    });
    describe("and the property does not exist", () => {
      it("should be undefined", () => {
        expect(read(target, ["nested", "name"])).toBe(void 0);
      });
    });
    describe("and the top-level property does not exist", () => {
      it("should be undefined", () => {
        expect(read(target, ["wrong", "name"])).toBe(void 0);
      });
    });
  });
  describe('When "attributes.read" is called with an empty string', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        test: 123
      };
    });
    it("should return an undefined value", () => {
      expect(read(target, "")).toBe(void 0);
    });
  });
  describe('When "attributes.read" is called with a zero-length array', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        test: 123
      };
    });
    it("should return an undefined value", () => {
      expect(read(target, [])).toBe(void 0);
    });
  });
  describe('When "attributes.write" is used to set a top-level property', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        test: 123
      };
    });
    describe("and the property exists", () => {
      beforeEach(() => {
        write(target, "test", "four-five-six");
      });
      it("the property value should be overwritten", () => {
        expect(target.test).toEqual("four-five-six");
      });
    });
    describe("and the property does not exist", () => {
      beforeEach(() => {
        write(target, "name", "Alice");
      });
      it("the property value should be created and set", () => {
        expect(target.name).toEqual("Alice");
      });
    });
  });
  describe('When "attributes.write" is used to set a top-level property (with an array)', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        test: 123
      };
    });
    describe("and the property exists", () => {
      beforeEach(() => {
        write(target, ["test"], "four-five-six");
      });
      it("the property value should be overwritten", () => {
        expect(target.test).toEqual("four-five-six");
      });
    });
    describe("and the property does not exist", () => {
      beforeEach(() => {
        write(target, ["name"], "Alice");
      });
      it("the property value should be created and set", () => {
        expect(target.name).toEqual("Alice");
      });
    });
  });
  describe('When "attributes.write" is used to set a second-level property', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        nested: {
          test: 123
        }
      };
    });
    describe("and the property exists", () => {
      beforeEach(() => {
        write(target, "nested.test", "four-five-six");
      });
      it("the property value should be overwritten", () => {
        expect(target.nested.test).toEqual("four-five-six");
      });
    });
    describe("and the second-level property does not exist", () => {
      beforeEach(() => {
        write(target, "nested.name", "Alice");
      });
      it("the property value should be created and set", () => {
        expect(target.nested.name).toEqual("Alice");
      });
    });
    describe("and the top-level property does not exist", () => {
      beforeEach(() => {
        write(target, "x.y", "z");
      });
      it("the top-level and second properties value should be created and set", () => {
        expect(target.x.y).toEqual("z");
      });
    });
  });
  describe('When "attributes.write" is used to set a second-level property (using an array)', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        nested: {
          test: 123
        }
      };
    });
    describe("and the property exists", () => {
      beforeEach(() => {
        write(target, ["nested", "test"], "four-five-six");
      });
      it("the property value should be overwritten", () => {
        expect(target.nested.test).toEqual("four-five-six");
      });
    });
    describe("and the second-level property does not exist", () => {
      beforeEach(() => {
        write(target, ["nested", "name"], "Alice");
      });
      it("the property value should be created and set", () => {
        expect(target.nested.name).toEqual("Alice");
      });
    });
    describe("and the top-level property does not exist", () => {
      beforeEach(() => {
        write(target, ["x", "y"], "z");
      });
      it("the top-level and second properties value should be created and set", () => {
        expect(target.x.y).toEqual("z");
      });
    });
  });
  describe('When "attributes.erase" is used to remove a top-level property', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        test: 123
      };
    });
    describe("and the property exists", () => {
      beforeEach(() => {
        erase(target, "test");
      });
      it("the property value not exist", () => {
        expect(target.hasOwnProperty("test")).toEqual(false);
      });
    });
    describe("and the property does not exist", () => {
      beforeEach(() => {
        erase(target, "name");
      });
      it("the target should be unaffected", () => {
        expect(target.hasOwnProperty("test")).toEqual(true);
      });
    });
  });
  describe('When "attributes.erase" is used to remove a top-level property (using an array)', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        test: 123
      };
    });
    describe("and the property exists", () => {
      beforeEach(() => {
        erase(target, ["test"]);
      });
      it("the property value not exist", () => {
        expect(target.hasOwnProperty("test")).toEqual(false);
      });
    });
    describe("and the property does not exist", () => {
      beforeEach(() => {
        erase(target, ["name"]);
      });
      it("the target should be unaffected", () => {
        expect(target.hasOwnProperty("test")).toEqual(true);
      });
    });
  });
  describe('When "attributes.erase" is used to remove a second-level property', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        nested: {
          test: 123
        }
      };
    });
    describe("and the property exists", () => {
      beforeEach(() => {
        erase(target, "nested.test");
      });
      it("the property value not exist", () => {
        expect({
          nested: target.hasOwnProperty("nested"),
          test: target.nested.hasOwnProperty("test")
        }).toEqual({
          nested: true,
          test: false
        });
      });
    });
    describe("and the second-level property does not exist", () => {
      beforeEach(() => {
        erase(target, "nested.name");
      });
      it("the target should be unaffected", () => {
        expect({
          nested: target.hasOwnProperty("nested"),
          test: target.nested.hasOwnProperty("test")
        }).toEqual({
          nested: true,
          test: true
        });
      });
    });
    describe("and the top-level property does not exist", () => {
      beforeEach(() => {
        erase(target, "x.y");
      });
      it("the target should be unaffected", () => {
        expect({
          nested: target.hasOwnProperty("nested"),
          test: target.nested.hasOwnProperty("test")
        }).toEqual({
          nested: true,
          test: true
        });
      });
    });
  });
  describe('When "attributes.erase" is used to remove a second-level property (using an array)', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        nested: {
          test: 123
        }
      };
    });
    describe("and the property exists", () => {
      beforeEach(() => {
        erase(target, ["nested", "test"]);
      });
      it("the property value not exist", () => {
        expect({
          nested: target.hasOwnProperty("nested"),
          test: target.nested.hasOwnProperty("test")
        }).toEqual({
          nested: true,
          test: false
        });
      });
    });
    describe("and the second-level property does not exist", () => {
      beforeEach(() => {
        erase(target, ["nested", "name"]);
      });
      it("the target should be unaffected", () => {
        expect({
          nested: target.hasOwnProperty("nested"),
          test: target.nested.hasOwnProperty("test")
        }).toEqual({
          nested: true,
          test: true
        });
      });
    });
    describe("and the top-level property does not exist", () => {
      beforeEach(() => {
        erase(target, ["x", "y"]);
      });
      it("the target should be unaffected", () => {
        expect({
          nested: target.hasOwnProperty("nested"),
          test: target.nested.hasOwnProperty("test")
        }).toEqual({
          nested: true,
          test: true
        });
      });
    });
  });
  describe('When "attributes.read" is used with a null separator', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        "some.key": 1
      };
    });
    describe("and the property exists", () => {
      it("should return the property value", () => {
        expect(read(target, "some.key", null)).toEqual(1);
      });
    });
    describe("and the property does not exist", () => {
      it("should be undefined", () => {
        expect(read(target, "another.key", null)).toEqual(void 0);
      });
    });
  });
  describe('When "attributes.read" is used with a non-default separator', () => {
    "use strict";
    let target;
    beforeEach(() => {
      target = {
        nested: {
          test: 1
        }
      };
    });
    describe("and the property exists", () => {
      it("should return the property value", () => {
        expect(read(target, "nested|test", "|")).toEqual(1);
      });
    });
    describe("and the property does not exist", () => {
      it("should be undefined", () => {
        expect(read(target, "another|key", "|")).toEqual(void 0);
      });
    });
  });

  // lang/base52.js
  var BASE = 52;
  var characters = [];
  for (let c = 97; c < 123; c++) {
    characters.push(String.fromCharCode(c));
  }
  for (let c = 65; c < 91; c++) {
    characters.push(String.fromCharCode(c));
  }
  function fromBaseTen(value, places) {
    argumentIsValid(value, "value", large, "must be an integer");
    if (places) {
      argumentIsValid(places, "places", integer, "must be an integer");
      argumentIsValid(places, "places", positive, "must be positive");
    }
    const absolute = Math.abs(value);
    const negative2 = value < 0;
    let placesToUse;
    if (places) {
      placesToUse = places;
    } else {
      placesToUse = 1;
      while (true) {
        if (absolute < Math.pow(BASE, placesToUse)) {
          break;
        }
        placesToUse = placesToUse + 1;
      }
    }
    const builder = [];
    if (negative2) {
      builder.push("-");
    }
    let remaining = absolute;
    for (let place = placesToUse; place > 0; place--) {
      const magnitude = Math.pow(BASE, place - 1);
      const multiples = Math.floor(remaining / magnitude);
      const character = characters[multiples];
      remaining = remaining - multiples * magnitude;
      builder.push(character);
    }
    return builder.join("");
  }

  // test/specs/lang/base52Spec.js
  describe("when converting base ten numbers to base fifty-two strings", () => {
    "use strict";
    it('the value of 0 (in base ten) should convert to "a"', () => {
      expect(fromBaseTen(0)).toEqual("a");
    });
    it('the value of 1 (in base ten) should convert to "b"', () => {
      expect(fromBaseTen(1)).toEqual("b");
    });
    it('the value of 24 (in base ten) should convert to "y"', () => {
      expect(fromBaseTen(24)).toEqual("y");
    });
    it('the value of 25 (in base ten) should convert to "z"', () => {
      expect(fromBaseTen(25)).toEqual("z");
    });
    it('the value of 26 (in base ten) should convert to "A"', () => {
      expect(fromBaseTen(26)).toEqual("A");
    });
    it('the value of 27 (in base ten) should convert to "B"', () => {
      expect(fromBaseTen(27)).toEqual("B");
    });
    it('the value of 51 (in base ten) should convert to "Z"', () => {
      expect(fromBaseTen(51)).toEqual("Z");
    });
    it('the value of 52 (in base ten) should convert to "ba"', () => {
      expect(fromBaseTen(52)).toEqual("ba");
    });
    it('the value of 53 (in base ten) should convert to "bb"', () => {
      expect(fromBaseTen(53)).toEqual("bb");
    });
    it('the value of 2703 (in base ten) should convert to "Za"', () => {
      expect(fromBaseTen(2703)).toEqual("ZZ");
    });
    it('the value of 2704 (in base ten) should convert to "baa"', () => {
      expect(fromBaseTen(2704)).toEqual("baa");
    });
    it('the value of 2705 (in base ten) should convert to "bab"', () => {
      expect(fromBaseTen(2705)).toEqual("bab");
    });
    it('the value of 140608 (in base ten) should convert to "baaa"', () => {
      expect(fromBaseTen(140608)).toEqual("baaa");
    });
    it('the value of -140608 (in base ten) should convert to "baaa"', () => {
      expect(fromBaseTen(-140608)).toEqual("-baaa");
    });
    it('the value of 5427 (in base ten) should convert to "cat"', () => {
      expect(fromBaseTen(5427)).toEqual("cat");
    });
    it('the value of 75731 (in base ten) should convert to "Cat"', () => {
      expect(fromBaseTen(75731)).toEqual("Cat");
    });
    it('the value of 75731 (in base ten) should convert to "CAT"', () => {
      expect(fromBaseTen(77109)).toEqual("CAT");
    });
    it('the value of 8846 (in base ten) should convert to "dog"', () => {
      expect(fromBaseTen(8846)).toEqual("dog");
    });
    it('the value of 79150 (in base ten) should convert to "Dog"', () => {
      expect(fromBaseTen(79150)).toEqual("Dog");
    });
    it('the value of 80528 (in base ten) should convert to "DOG"', () => {
      expect(fromBaseTen(80528)).toEqual("DOG");
    });
    it('the value of 19770609663 (in base ten) should convert to "ZZZZZZ"', () => {
      expect(fromBaseTen(19770609663)).toEqual("ZZZZZZ");
    });
  });

  // lang/connection.js
  function getIsSecure(secure) {
    return boolean(secure) && secure;
  }

  // test/specs/lang/connectionSpec.js
  describe('When "getIsSecure is invoked', () => {
    "use strict";
    it("should return true, if passed true", () => {
      expect(getIsSecure(true)).toEqual(true);
    });
    it("should return false, if passed false", () => {
      expect(getIsSecure(false)).toEqual(false);
    });
    it("should return false, if passed undefined", () => {
      expect(getIsSecure(void 0)).toEqual(false);
    });
    it("should return false, if passed null", () => {
      expect(getIsSecure(void 0)).toEqual(false);
    });
  });

  // lang/converters.js
  function toDate2(object2) {
    return new Date(object2);
  }
  function empty3(object2) {
    return object2;
  }

  // test/specs/lang/convertersSpec.js
  describe("When converters are used", () => {
    "use strict";
    it("should convert values to dates", () => {
      const date2 = toDate2("2026-06-17T00:00:00.000Z");
      expect({
        instance: date2 instanceof Date,
        value: date2.toISOString()
      }).toEqual({
        instance: true,
        value: "2026-06-17T00:00:00.000Z"
      });
    });
    it("should return values unchanged for the empty converter", () => {
      const value = { id: 1 };
      expect(empty3(value)).toBe(value);
    });
  });

  // lang/date.js
  function getTimestamp() {
    return (/* @__PURE__ */ new Date()).getTime();
  }
  function getShortDay(date2) {
    const day = date2.getDay();
    return days[day].short;
  }
  function getDate(date2) {
    return date2.getDate();
  }
  function getDateOrdinal(date2) {
    const d = getDate(date2);
    const remainder = d % 10;
    let returnRef;
    if (remainder === 1 && d !== 11) {
      returnRef = "st";
    } else if (remainder === 2 && d !== 12) {
      returnRef = "nd";
    } else if (remainder === 3 && d !== 13) {
      returnRef = "rd";
    } else {
      returnRef = "th";
    }
    return returnRef;
  }
  function getShortMonth(date2) {
    const month = date2.getMonth();
    return months[month].short;
  }
  function getYear(date2) {
    return date2.getFullYear();
  }
  var days = [
    { short: "Sun" },
    { short: "Mon" },
    { short: "Tue" },
    { short: "Wed" },
    { short: "Thu" },
    { short: "Fri" },
    { short: "Sat" }
  ];
  var months = [
    { short: "Jan" },
    { short: "Feb" },
    { short: "Mar" },
    { short: "Apr" },
    { short: "May" },
    { short: "Jun" },
    { short: "Jul" },
    { short: "Aug" },
    { short: "Sep" },
    { short: "Oct" },
    { short: "Nov" },
    { short: "Dec" }
  ];

  // test/specs/lang/dateSpec.js
  describe("When requesting the current timestamp", () => {
    "use strict";
    it("should be a number", () => {
      expect(typeof getTimestamp()).toEqual("number");
    });
  });
  describe('When extracting the "short" day of week', () => {
    "use strict";
    const july = 7 - 1;
    it("07/27/2016 should resolve to 'Wed'", () => {
      expect(getShortDay(new Date(2016, july, 27))).toEqual("Wed");
    });
  });
  describe('When extracting the "short" month', () => {
    "use strict";
    const july = 7 - 1;
    it("07/27/2016 should resolve to 'Jul'", () => {
      expect(getShortMonth(new Date(2016, july, 27))).toEqual("Jul");
    });
  });
  describe("When extracting the year", () => {
    "use strict";
    const july = 7 - 1;
    it("07/27/2016 should resolve to 2016", () => {
      expect(getYear(new Date(2016, july, 27))).toEqual(2016);
    });
  });
  describe("When determining the ordinal for a date", () => {
    "use strict";
    const july = 7 - 1;
    it('should return "st" for the first of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 1))).toEqual("st");
    });
    it('should return "nd" for the second of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 2))).toEqual("nd");
    });
    it('should return "rd" for the third of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 3))).toEqual("rd");
    });
    it('should return "th" for the fourth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 4))).toEqual("th");
    });
    it('should return "th" for the fifth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 5))).toEqual("th");
    });
    it('should return "th" for the sixth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 6))).toEqual("th");
    });
    it('should return "th" for the seventh of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 7))).toEqual("th");
    });
    it('should return "th" for the eighth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 8))).toEqual("th");
    });
    it('should return "th" for the ninth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 9))).toEqual("th");
    });
    it('should return "th" for the tenth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 10))).toEqual("th");
    });
    it('should return "th" for the eleventh of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 11))).toEqual("th");
    });
    it('should return "th" for the twelfth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 12))).toEqual("th");
    });
    it('should return "th" for the thirteenth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 13))).toEqual("th");
    });
    it('should return "th" for the fourteenth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 14))).toEqual("th");
    });
    it('should return "th" for the fifteenth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 15))).toEqual("th");
    });
    it('should return "th" for the sixteenth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 16))).toEqual("th");
    });
    it('should return "th" for the seventeenth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 17))).toEqual("th");
    });
    it('should return "th" for the eighteenth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 18))).toEqual("th");
    });
    it('should return "th" for the nineteenth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 19))).toEqual("th");
    });
    it('should return "th" for the twentieth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 20))).toEqual("th");
    });
    it('should return "th" for the twenty first of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 21))).toEqual("st");
    });
    it('should return "th" for the twenty second of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 22))).toEqual("nd");
    });
    it('should return "th" for the twenty third of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 23))).toEqual("rd");
    });
    it('should return "th" for the twenty fourth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 24))).toEqual("th");
    });
    it('should return "th" for the twenty fifth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 25))).toEqual("th");
    });
    it('should return "th" for the twenty sixth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 26))).toEqual("th");
    });
    it('should return "th" for the twenty seventh of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 27))).toEqual("th");
    });
    it('should return "th" for the twenty eighth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 28))).toEqual("th");
    });
    it('should return "th" for the twenty ninth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 29))).toEqual("th");
    });
    it('should return "th" for the thirtieth of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 30))).toEqual("th");
    });
    it('should return "th" for the thirty first of the month', () => {
      expect(getDateOrdinal(new Date(2017, july, 31))).toEqual("st");
    });
  });

  // lang/formatter.js
  function numberToString(value, digits, thousandsSeparator, useParenthesis) {
    if (value === void 0 || value === null || Number.isNaN(value)) {
      return "";
    }
    const applyParenthesis = value < 0 && useParenthesis === true;
    if (applyParenthesis) {
      value = 0 - value;
    }
    let returnRef = value.toFixed(digits);
    if (thousandsSeparator && !(value > -1e3 && value < 1e3)) {
      const length = returnRef.length;
      const negative2 = value < 0;
      let found = digits === 0;
      let counter = 0;
      const buffer = [];
      for (let i = length - 1; !(i < 0); i--) {
        if (counter === 3 && !(negative2 && i === 0)) {
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

  // test/specs/lang/formatterSpec.js
  describe("When formatting numbers", () => {
    "use strict";
    it("formatting 123 with six digits (no separator, no parenthesis)", () => {
      expect(numberToString(123, 6)).toEqual("123.000000");
    });
  });

  // test/specs/lang/functionsSpec.js
  describe("when using the tautology function", () => {
    "use strict";
    let tautology2;
    beforeEach(() => {
      tautology2 = getTautology();
    });
    it("if null is passed, null should be returned", () => {
      expect(tautology2(null)).toEqual(null);
    });
    it("if undefined is passed, undefined should be returned", () => {
      expect(tautology2(void 0)).toEqual(void 0);
    });
    it("if Math.PI is passed, Math.PI should be returned", () => {
      expect(tautology2(Math.PI)).toEqual(Math.PI);
    });
    it("if an object is passed, the object should be returned", () => {
      let x;
      expect(tautology2(x = {})).toBe(x);
    });
  });

  // test/specs/lang/isSpec.js
  describe("When checking a regular expression", () => {
    "use strict";
    it("it should be a regexp", () => {
      expect(regexp(/abc/)).toEqual(true);
    });
    it("a string should not be a regexp", () => {
      expect(regexp("abc")).toEqual(false);
    });
  });
  describe("When checking the number 3", () => {
    "use strict";
    let candidate;
    beforeEach(() => {
      candidate = 3;
    });
    it("it should be a number", () => {
      expect(number(candidate)).toEqual(true);
    });
    it("it should not be nan", () => {
      expect(nan(candidate)).toEqual(false);
    });
    it("it should be an integer", () => {
      expect(integer(candidate)).toEqual(true);
    });
    it("it should be an large integer", () => {
      expect(large(candidate)).toEqual(true);
    });
    it("it should be positive", () => {
      expect(positive(candidate)).toEqual(true);
    });
    it("it should not be negative", () => {
      expect(negative(candidate)).toEqual(false);
    });
    it("it should not be iterable", () => {
      expect(iterable(candidate)).toEqual(false);
    });
    it("it should not be a string", () => {
      expect(string(candidate)).toEqual(false);
    });
    it("it should not be a Date", () => {
      expect(date(candidate)).toEqual(false);
    });
    it("it should not be a function", () => {
      expect(fn(candidate)).toEqual(false);
    });
    it("it should not be an array", () => {
      expect(array(candidate)).toEqual(false);
    });
    it("it should not be a boolean", () => {
      expect(boolean(candidate)).toEqual(false);
    });
    it("it should not be an object", () => {
      expect(object(candidate)).toEqual(false);
    });
    it("it should not be null", () => {
      expect(nil(candidate)).toEqual(false);
    });
    it("it should not be undefined", () => {
      expect(undef(candidate)).toEqual(false);
    });
    it("it should not be a zero-length string", () => {
      expect(zeroLengthString(candidate)).toEqual(false);
    });
  });
  describe("When checking the Math.PI", () => {
    "use strict";
    let candidate;
    beforeEach(() => {
      candidate = Math.PI;
    });
    it("it should be a number", () => {
      expect(number(candidate)).toEqual(true);
    });
    it("it should not be nan", () => {
      expect(nan(candidate)).toEqual(false);
    });
    it("it should not be an integer", () => {
      expect(integer(candidate)).toEqual(false);
    });
    it("it should not be an large integer", () => {
      expect(large(candidate)).toEqual(false);
    });
    it("it should be positive", () => {
      expect(positive(candidate)).toEqual(true);
    });
    it("it should not be negative", () => {
      expect(negative(candidate)).toEqual(false);
    });
    it("it should not be iterable", () => {
      expect(iterable(candidate)).toEqual(false);
    });
    it("it should not be a string", () => {
      expect(string(candidate)).toEqual(false);
    });
    it("it should not be a Date", () => {
      expect(date(candidate)).toEqual(false);
    });
    it("it should not be a function", () => {
      expect(fn(candidate)).toEqual(false);
    });
    it("it should not be an array", () => {
      expect(array(candidate)).toEqual(false);
    });
    it("it should not be a boolean", () => {
      expect(boolean(candidate)).toEqual(false);
    });
    it("it should not be an object", () => {
      expect(object(candidate)).toEqual(false);
    });
    it("it should not be null", () => {
      expect(nil(candidate)).toEqual(false);
    });
    it("it should not be undefined", () => {
      expect(undef(candidate)).toEqual(false);
    });
    it("it should not be a zero-length string", () => {
      expect(zeroLengthString(candidate)).toEqual(false);
    });
  });
  describe("When checking the Number.NaN", () => {
    "use strict";
    let candidate;
    beforeEach(() => {
      candidate = Number.NaN;
    });
    it("it should not be a number", () => {
      expect(number(candidate)).toEqual(false);
    });
    it("it should be nan", () => {
      expect(nan(candidate)).toEqual(true);
    });
    it("it should not be an integer", () => {
      expect(integer(candidate)).toEqual(false);
    });
    it("it should not be an large integer", () => {
      expect(large(candidate)).toEqual(false);
    });
    it("it should not be positive", () => {
      expect(positive(candidate)).toEqual(false);
    });
    it("it should not be negative", () => {
      expect(negative(candidate)).toEqual(false);
    });
    it("it should not be iterable", () => {
      expect(iterable(candidate)).toEqual(false);
    });
    it("it should not be a string", () => {
      expect(string(candidate)).toEqual(false);
    });
    it("it should not be a Date", () => {
      expect(date(candidate)).toEqual(false);
    });
    it("it should not be a function", () => {
      expect(fn(candidate)).toEqual(false);
    });
    it("it should not be an array", () => {
      expect(array(candidate)).toEqual(false);
    });
    it("it should not be a boolean", () => {
      expect(boolean(candidate)).toEqual(false);
    });
    it("it should not be an object", () => {
      expect(object(candidate)).toEqual(false);
    });
    it("it should not be null", () => {
      expect(nil(candidate)).toEqual(false);
    });
    it("it should not be undefined", () => {
      expect(undef(candidate)).toEqual(false);
    });
    it("it should not be a zero-length string", () => {
      expect(zeroLengthString(candidate)).toEqual(false);
    });
  });
  describe('When checking the string "3"', () => {
    "use strict";
    let candidate;
    beforeEach(() => {
      candidate = "3";
    });
    it("it should not be a number", () => {
      expect(number(candidate)).toEqual(false);
    });
    it("it should not be nan", () => {
      expect(nan(candidate)).toEqual(false);
    });
    it("it should not be an integer", () => {
      expect(integer(candidate)).toEqual(false);
    });
    it("it should not be an large integer", () => {
      expect(large(candidate)).toEqual(false);
    });
    it("it should not be positive", () => {
      expect(positive(candidate)).toEqual(false);
    });
    it("it should not be negative", () => {
      expect(negative(candidate)).toEqual(false);
    });
    it("it should be iterable", () => {
      expect(iterable(candidate)).toEqual(true);
    });
    it("it should be a string", () => {
      expect(string(candidate)).toEqual(true);
    });
    it("it should not be a Date", () => {
      expect(date(candidate)).toEqual(false);
    });
    it("it should not be a function", () => {
      expect(fn(candidate)).toEqual(false);
    });
    it("it should not be an array", () => {
      expect(array(candidate)).toEqual(false);
    });
    it("it should not be a boolean", () => {
      expect(boolean(candidate)).toEqual(false);
    });
    it("it should not be an object", () => {
      expect(object(candidate)).toEqual(false);
    });
    it("it should not be null", () => {
      expect(nil(candidate)).toEqual(false);
    });
    it("it should not be undefined", () => {
      expect(undef(candidate)).toEqual(false);
    });
    it("it should not be a zero-length string", () => {
      expect(zeroLengthString(candidate)).toEqual(false);
    });
  });
  describe("When checking the date 08/29/2016", () => {
    "use strict";
    let candidate;
    beforeEach(() => {
      candidate = new Date(2016, 7, 29);
    });
    it("it should not be a number", () => {
      expect(number(candidate)).toEqual(false);
    });
    it("it should not be nan", () => {
      expect(nan(candidate)).toEqual(false);
    });
    it("it should not be an integer", () => {
      expect(integer(candidate)).toEqual(false);
    });
    it("it should not be an large integer", () => {
      expect(large(candidate)).toEqual(false);
    });
    it("it should not be positive", () => {
      expect(positive(candidate)).toEqual(false);
    });
    it("it should not be negative", () => {
      expect(negative(candidate)).toEqual(false);
    });
    it("it should not be iterable", () => {
      expect(iterable(candidate)).toEqual(false);
    });
    it("it should not be a string", () => {
      expect(string(candidate)).toEqual(false);
    });
    it("it should be a Date", () => {
      expect(date(candidate)).toEqual(true);
    });
    it("it should be an object", () => {
      expect(object(candidate)).toEqual(true);
    });
    it("it should not be a function", () => {
      expect(fn(candidate)).toEqual(false);
    });
    it("it should not be an array", () => {
      expect(array(candidate)).toEqual(false);
    });
    it("it should not be a boolean", () => {
      expect(boolean(candidate)).toEqual(false);
    });
    it("it should not be null", () => {
      expect(nil(candidate)).toEqual(false);
    });
    it("it should not be undefined", () => {
      expect(undef(candidate)).toEqual(false);
    });
    it("it should not be a zero-length string", () => {
      expect(zeroLengthString(candidate)).toEqual(false);
    });
  });
  describe('When checking the "expect" function', () => {
    "use strict";
    let candidate;
    beforeEach(() => {
      candidate = expect;
    });
    it("it should not be a number", () => {
      expect(number(candidate)).toEqual(false);
    });
    it("it should not be nan", () => {
      expect(nan(candidate)).toEqual(false);
    });
    it("it should not be an integer", () => {
      expect(integer(candidate)).toEqual(false);
    });
    it("it should not be an large integer", () => {
      expect(large(candidate)).toEqual(false);
    });
    it("it should not be positive", () => {
      expect(positive(candidate)).toEqual(false);
    });
    it("it should not be iterable", () => {
      expect(iterable(candidate)).toEqual(false);
    });
    it("it should not be negative", () => {
      expect(negative(candidate)).toEqual(false);
    });
    it("it should not be a string", () => {
      expect(string(candidate)).toEqual(false);
    });
    it("it should not be a Date", () => {
      expect(date(candidate)).toEqual(false);
    });
    it("it should be a function", () => {
      expect(fn(candidate)).toEqual(true);
    });
    it("it should not be an array", () => {
      expect(array(candidate)).toEqual(false);
    });
    it("it should not be a boolean", () => {
      expect(boolean(candidate)).toEqual(false);
    });
    it("it should not be an object", () => {
      expect(object(candidate)).toEqual(false);
    });
    it("it should not be null", () => {
      expect(nil(candidate)).toEqual(false);
    });
    it("it should not be undefined", () => {
      expect(undef(candidate)).toEqual(false);
    });
    it("it should not be a zero-length string", () => {
      expect(zeroLengthString(candidate)).toEqual(false);
    });
  });
  describe("When checking an empty object", () => {
    "use strict";
    let candidate;
    beforeEach(() => {
      candidate = {};
    });
    it("it should not be a number", () => {
      expect(number(candidate)).toEqual(false);
    });
    it("it should not be nan", () => {
      expect(nan(candidate)).toEqual(false);
    });
    it("it should not be an integer", () => {
      expect(integer(candidate)).toEqual(false);
    });
    it("it should not be an large integer", () => {
      expect(large(candidate)).toEqual(false);
    });
    it("it should not be positive", () => {
      expect(positive(candidate)).toEqual(false);
    });
    it("it should not be negative", () => {
      expect(negative(candidate)).toEqual(false);
    });
    it("it should not be iterable", () => {
      expect(iterable(candidate)).toEqual(false);
    });
    it("it should not be a string", () => {
      expect(string(candidate)).toEqual(false);
    });
    it("it should not be a Date", () => {
      expect(date(candidate)).toEqual(false);
    });
    it("it should not be a function", () => {
      expect(fn(candidate)).toEqual(false);
    });
    it("it should not be an array", () => {
      expect(array(candidate)).toEqual(false);
    });
    it("it should not be a boolean", () => {
      expect(boolean(candidate)).toEqual(false);
    });
    it("it should be an object", () => {
      expect(object(candidate)).toEqual(true);
    });
    it("it should not be null", () => {
      expect(nil(candidate)).toEqual(false);
    });
    it("it should not be undefined", () => {
      expect(undef(candidate)).toEqual(false);
    });
    it("it should not be a zero-length string", () => {
      expect(zeroLengthString(candidate)).toEqual(false);
    });
  });
  describe("When checking an empty array", () => {
    "use strict";
    let candidate;
    beforeEach(() => {
      candidate = [];
    });
    it("it should not be a number", () => {
      expect(number(candidate)).toEqual(false);
    });
    it("it should not be nan", () => {
      expect(nan(candidate)).toEqual(false);
    });
    it("it should not be an integer", () => {
      expect(integer(candidate)).toEqual(false);
    });
    it("it should not be an large integer", () => {
      expect(large(candidate)).toEqual(false);
    });
    it("it should not be positive", () => {
      expect(positive(candidate)).toEqual(false);
    });
    it("it should not be negative", () => {
      expect(negative(candidate)).toEqual(false);
    });
    it("it should be iterable", () => {
      expect(iterable(candidate)).toEqual(true);
    });
    it("it should not be a string", () => {
      expect(string(candidate)).toEqual(false);
    });
    it("it should not be a Date", () => {
      expect(date(candidate)).toEqual(false);
    });
    it("it should not be a function", () => {
      expect(fn(candidate)).toEqual(false);
    });
    it("it should be an array", () => {
      expect(array(candidate)).toEqual(true);
    });
    it("it should not be a boolean", () => {
      expect(boolean(candidate)).toEqual(false);
    });
    it("it should be an object", () => {
      expect(object(candidate)).toEqual(true);
    });
    it("it should not be null", () => {
      expect(nil(candidate)).toEqual(false);
    });
    it("it should not be undefined", () => {
      expect(undef(candidate)).toEqual(false);
    });
    it("it should not be a zero-length string", () => {
      expect(zeroLengthString(candidate)).toEqual(false);
    });
  });
  describe("When checking a null value", () => {
    "use strict";
    let candidate;
    beforeEach(() => {
      candidate = null;
    });
    it("it should not be a number", () => {
      expect(number(candidate)).toEqual(false);
    });
    it("it should not be nan", () => {
      expect(nan(candidate)).toEqual(false);
    });
    it("it should not be an integer", () => {
      expect(integer(candidate)).toEqual(false);
    });
    it("it should not be an large integer", () => {
      expect(large(candidate)).toEqual(false);
    });
    it("it should not be positive", () => {
      expect(positive(candidate)).toEqual(false);
    });
    it("it should not be negative", () => {
      expect(negative(candidate)).toEqual(false);
    });
    it("it should not be iterable", () => {
      expect(iterable(candidate)).toEqual(false);
    });
    it("it should not be a string", () => {
      expect(string(candidate)).toEqual(false);
    });
    it("it should not be a Date", () => {
      expect(date(candidate)).toEqual(false);
    });
    it("it should not be a function", () => {
      expect(fn(candidate)).toEqual(false);
    });
    it("it should not be an array", () => {
      expect(array(candidate)).toEqual(false);
    });
    it("it should not be a boolean", () => {
      expect(boolean(candidate)).toEqual(false);
    });
    it("it should not be an object", () => {
      expect(object(candidate)).toEqual(false);
    });
    it("it should be null", () => {
      expect(nil(candidate)).toEqual(true);
    });
    it("it should not be undefined", () => {
      expect(undef(candidate)).toEqual(false);
    });
    it("it should not be a zero-length string", () => {
      expect(zeroLengthString(candidate)).toEqual(false);
    });
  });
  describe("When checking an undefined value", () => {
    "use strict";
    let candidate;
    beforeEach(() => {
      candidate = void 0;
    });
    it("it should not be a number", () => {
      expect(number(candidate)).toEqual(false);
    });
    it("it should not be nan", () => {
      expect(nan(candidate)).toEqual(false);
    });
    it("it should not be an integer", () => {
      expect(integer(candidate)).toEqual(false);
    });
    it("it should not be an large integer", () => {
      expect(large(candidate)).toEqual(false);
    });
    it("it should not be positive", () => {
      expect(positive(candidate)).toEqual(false);
    });
    it("it should not be negative", () => {
      expect(negative(candidate)).toEqual(false);
    });
    it("it should not be iterable", () => {
      expect(iterable(candidate)).toEqual(false);
    });
    it("it should not be a string", () => {
      expect(string(candidate)).toEqual(false);
    });
    it("it should not be a Date", () => {
      expect(date(candidate)).toEqual(false);
    });
    it("it should not be a function", () => {
      expect(fn(candidate)).toEqual(false);
    });
    it("it should not be an array", () => {
      expect(array(candidate)).toEqual(false);
    });
    it("it should not be a boolean", () => {
      expect(boolean(candidate)).toEqual(false);
    });
    it("it should not be an object", () => {
      expect(object(candidate)).toEqual(false);
    });
    it("it should not be null", () => {
      expect(nil(candidate)).toEqual(false);
    });
    it("it should be undefined", () => {
      expect(undef(candidate)).toEqual(true);
    });
    it("it should not be a zero-length string", () => {
      expect(zeroLengthString(candidate)).toEqual(false);
    });
  });
  describe("When checking a large integer (exceeding 32-bits)", () => {
    "use strict";
    let candidate;
    beforeEach(() => {
      candidate = 1502373984424;
    });
    it("it should be a number", () => {
      expect(number(candidate)).toEqual(true);
    });
    it("it should not be nan", () => {
      expect(nan(candidate)).toEqual(false);
    });
    it("it should not be an integer", () => {
      expect(integer(candidate)).toEqual(false);
    });
    it("it should be an large integer", () => {
      expect(large(candidate)).toEqual(true);
    });
    it("it should be positive", () => {
      expect(positive(candidate)).toEqual(true);
    });
    it("it should not be negative", () => {
      expect(negative(candidate)).toEqual(false);
    });
    it("it should not be iterable", () => {
      expect(iterable(candidate)).toEqual(false);
    });
    it("it should not be a string", () => {
      expect(string(candidate)).toEqual(false);
    });
    it("it should not be a Date", () => {
      expect(date(candidate)).toEqual(false);
    });
    it("it should not be a function", () => {
      expect(fn(candidate)).toEqual(false);
    });
    it("it should not be an array", () => {
      expect(array(candidate)).toEqual(false);
    });
    it("it should not be a boolean", () => {
      expect(boolean(candidate)).toEqual(false);
    });
    it("it should not be an object", () => {
      expect(object(candidate)).toEqual(false);
    });
    it("it should not be null", () => {
      expect(nil(candidate)).toEqual(false);
    });
    it("it should not be undefined", () => {
      expect(undef(candidate)).toEqual(false);
    });
    it("it should not be a zero-length string", () => {
      expect(zeroLengthString(candidate)).toEqual(false);
    });
  });
  describe("When checking a zero-length string", () => {
    "use strict";
    let candidate;
    beforeEach(() => {
      candidate = "";
    });
    it("it should not be a number", () => {
      expect(number(candidate)).toEqual(false);
    });
    it("it should not be nan", () => {
      expect(nan(candidate)).toEqual(false);
    });
    it("it should not be an integer", () => {
      expect(integer(candidate)).toEqual(false);
    });
    it("it should not be an large integer", () => {
      expect(large(candidate)).toEqual(false);
    });
    it("it should not be positive", () => {
      expect(positive(candidate)).toEqual(false);
    });
    it("it should not be negative", () => {
      expect(negative(candidate)).toEqual(false);
    });
    it("it should be iterable", () => {
      expect(iterable(candidate)).toEqual(true);
    });
    it("it should be a string", () => {
      expect(string(candidate)).toEqual(true);
    });
    it("it should not be a Date", () => {
      expect(date(candidate)).toEqual(false);
    });
    it("it should not be a function", () => {
      expect(fn(candidate)).toEqual(false);
    });
    it("it should not be an array", () => {
      expect(array(candidate)).toEqual(false);
    });
    it("it should not be a boolean", () => {
      expect(boolean(candidate)).toEqual(false);
    });
    it("it should not be an object", () => {
      expect(object(candidate)).toEqual(false);
    });
    it("it should not be null", () => {
      expect(nil(candidate)).toEqual(false);
    });
    it("it should not be undefined", () => {
      expect(undef(candidate)).toEqual(false);
    });
    it("it should be a zero-length string", () => {
      expect(zeroLengthString(candidate)).toEqual(true);
    });
  });
  describe("When checking inheritance", () => {
    class Grandparent {
      constructor() {
      }
    }
    class Parent extends Grandparent {
      constructor() {
        super();
      }
    }
    class Child extends Parent {
      constructor() {
        super();
      }
    }
    class Uncle extends Grandparent {
      constructor() {
        super();
      }
    }
    class Unrelated {
      constructor() {
      }
    }
    it('it should indicate that "Child" extends "Parent"', () => {
      expect(extension(Parent, Child)).toEqual(true);
    });
    it('it should indicate that "Child" extends "Grandparent"', () => {
      expect(extension(Grandparent, Child)).toEqual(true);
    });
    it('it should not indicate that "Child" extends "Uncle"', () => {
      expect(extension(Uncle, Child)).toEqual(false);
    });
    it('it should not indicate that "Child" extends "Unrelated"', () => {
      expect(extension(Unrelated, Child)).toEqual(false);
    });
    it('it should not indicate that "Parent" extends "Child"', () => {
      expect(extension(Child, Parent)).toEqual(false);
    });
  });

  // lang/iterate.js
  async function iterate(iterable2, processor) {
    return build((resolveCallback, rejectCallback) => {
      if (!iterable(iterable2)) {
        rejectCallback('Unable to iterate, the "iterable" argument must have an iterator.');
        return;
      }
      if (!fn(processor)) {
        rejectCallback('Unable to iterate, the "processor" argument must be a function.');
        return;
      }
      const processNext = (i, p, r) => {
        const next = i.next();
        if (next.done) {
          return r();
        }
        const c = (interrupt) => {
          if (interrupt === false) {
            return r();
          }
          processNext(i, p, r);
        };
        p(next.value, c);
      };
      processNext(iterable2[Symbol.iterator](), processor, resolveCallback);
    });
  }

  // test/specs/lang/iterateSpec.js
  describe("When using the iterate function", () => {
    let a;
    let b;
    let c;
    let iterable2;
    beforeEach(() => {
      a = {};
      b = {};
      c = {};
      iterable2 = [a, b, c];
    });
    describe("to synchronously iterate over an array with three items", () => {
      let processor;
      beforeEach(async () => {
        processor = jasmine.createSpy("processor").and.callFake((item, callback) => {
          callback();
        });
        await iterate(iterable2, processor);
      });
      it('the "processor" should have been called three times', () => {
        expect(processor).toHaveBeenCalledTimes(3);
      });
      it('the "processor" should have been called first with the first item', () => {
        expect(processor.calls.argsFor(0)[0]).toBe(a);
      });
      it('the "processor" should have been called second with the second item', () => {
        expect(processor.calls.argsFor(1)[0]).toBe(b);
      });
      it('the "processor" should have been called third with the third item', () => {
        expect(processor.calls.argsFor(2)[0]).toBe(c);
      });
    });
    describe("to synchronously iterate over an array with three items, breaking after the second item", () => {
      let processor;
      beforeEach(async () => {
        processor = jasmine.createSpy("processor").and.callFake((item, callback) => {
          callback(item !== b);
        });
        await iterate(iterable2, processor);
      });
      it('the "processor" should have been called two times', () => {
        expect(processor).toHaveBeenCalledTimes(2);
      });
      it('the "processor" should have been called first with the first item', () => {
        expect(processor.calls.argsFor(0)[0]).toBe(a);
      });
      it('the "processor" should have been called second with the second item', () => {
        expect(processor.calls.argsFor(1)[0]).toBe(b);
      });
    });
    describe("to asynchronously iterate over an array with three items", () => {
      let processor;
      let invocations = [];
      beforeEach(() => {
        jasmine.clock().install();
        jasmine.clock().mockDate(new Date(2020, 0, 1));
      });
      afterEach(() => {
        jasmine.clock().uninstall();
      });
      beforeEach(async () => {
        processor = jasmine.createSpy("processor").and.callFake((item, callback) => {
          invocations.push((/* @__PURE__ */ new Date()).getTime());
          setTimeout(() => {
            callback();
          }, 5);
        });
        const promise = iterate(iterable2, processor);
        jasmine.clock().tick(15);
        await promise;
      });
      it('the "processor" should have been called three times', () => {
        expect(processor).toHaveBeenCalledTimes(3);
      });
      it('the "processor" should have been called first with the first item', () => {
        expect(processor.calls.argsFor(0)[0]).toBe(a);
      });
      it('the "processor" should have been called second, at least 5ms after the first call', () => {
        expect(invocations[1] - invocations[0] > 4).toEqual(true);
      });
      it('the "processor" should have been called second with the second item', () => {
        expect(processor.calls.argsFor(1)[0]).toBe(b);
      });
      it('the "processor" should have been called thrid, at least 5ms after the second call', () => {
        expect(invocations[2] - invocations[1] > 4).toEqual(true);
      });
      it('the "processor" should have been called third with the third item', () => {
        expect(processor.calls.argsFor(2)[0]).toBe(c);
      });
    });
    describe("to asynchronously iterate over an array with three items, breaking after the second item", () => {
      let processor;
      let invocations = [];
      beforeEach(() => {
        jasmine.clock().install();
        jasmine.clock().mockDate(new Date(2020, 0, 1));
      });
      afterEach(() => {
        jasmine.clock().uninstall();
      });
      beforeEach(async () => {
        processor = jasmine.createSpy("processor").and.callFake((item, callback) => {
          invocations.push((/* @__PURE__ */ new Date()).getTime());
          setTimeout(() => {
            callback(item !== b);
          }, 5);
        });
        const promise = iterate(iterable2, processor);
        jasmine.clock().tick(10);
        await promise;
      });
      it('the "processor" should have been called two times', () => {
        expect(processor).toHaveBeenCalledTimes(2);
      });
      it('the "processor" should have been called first with the first item', () => {
        expect(processor.calls.argsFor(0)[0]).toBe(a);
      });
      it('the "processor" should have been called second, at least 5ms after the first call', () => {
        expect(invocations[1] - invocations[0] > 4).toEqual(true);
      });
      it('the "processor" should have been called second with the second item', () => {
        expect(processor.calls.argsFor(1)[0]).toBe(b);
      });
    });
  });

  // lang/mask.js
  function getEmpty() {
    return 0;
  }
  function add(existing, itemToAdd) {
    argumentIsRequired(existing, "existing", Number);
    argumentIsRequired(itemToAdd, "itemToAdd", Number);
    if (checkItem(itemToAdd)) {
      return existing | itemToAdd;
    } else {
      return existing;
    }
  }
  function remove2(existing, itemToRemove) {
    argumentIsRequired(existing, "existing", Number);
    argumentIsRequired(itemToRemove, "itemToRemove", Number);
    if (checkItem(itemToRemove)) {
      return existing & ~itemToRemove;
    } else {
      return existing;
    }
  }
  function has2(existing, itemToCheck) {
    argumentIsRequired(existing, "existing", Number);
    argumentIsRequired(itemToCheck, "itemToCheck", Number);
    return checkItem(itemToCheck) && (existing & itemToCheck) === itemToCheck;
  }
  function checkItem(itemToCheck) {
    return number(itemToCheck) && (itemToCheck === 0 || (itemToCheck & ~itemToCheck + 1) === itemToCheck);
  }

  // test/specs/lang/maskSpec.js
  describe("When testing the suitability of an bit-based enumeration item", () => {
    it("zero should be valid", () => {
      expect(checkItem(0)).toEqual(true);
    });
    it("one should be valid", () => {
      expect(checkItem(1)).toEqual(true);
    });
    it("two should be valid", () => {
      expect(checkItem(2)).toEqual(true);
    });
    it("three should not be valid", () => {
      expect(checkItem(3)).toEqual(false);
    });
    it("four should be valid", () => {
      expect(checkItem(4)).toEqual(true);
    });
    it("five should not be valid", () => {
      expect(checkItem(5)).toEqual(false);
    });
    it("4095 should not be valid", () => {
      expect(checkItem(4095)).toEqual(false);
    });
    it("4096 should be valid", () => {
      expect(checkItem(4096)).toEqual(true);
    });
    it("4097 should not be valid", () => {
      expect(checkItem(4097)).toEqual(false);
    });
  });
  describe("When working with an empty flags collection", () => {
    "use strict";
    let FLAG_ONE = 1;
    let FLAG_TWO = 16;
    let FLAG_THREE = 512;
    let flags;
    beforeEach(() => {
      flags = getEmpty();
    });
    it("should not contain flag one", () => {
      expect(has2(flags, FLAG_ONE)).toEqual(false);
    });
    it("should not contain flag two", () => {
      expect(has2(flags, FLAG_TWO)).toEqual(false);
    });
    it("should not contain flag three", () => {
      expect(has2(flags, FLAG_THREE)).toEqual(false);
    });
    describe("and adding the first flag", () => {
      let updated;
      beforeEach(() => {
        updated = add(flags, FLAG_ONE);
      });
      it("should contain flag one", () => {
        expect(has2(updated, FLAG_ONE)).toEqual(true);
      });
      it("should not contain flag two", () => {
        expect(has2(updated, FLAG_TWO)).toEqual(false);
      });
      it("should not contain flag three", () => {
        expect(has2(updated, FLAG_THREE)).toEqual(false);
      });
      describe("and adding the third flag", () => {
        let again;
        beforeEach(() => {
          again = add(updated, FLAG_THREE);
        });
        it("should contain flag one", () => {
          expect(has2(again, FLAG_ONE)).toEqual(true);
        });
        it("should not contain flag two", () => {
          expect(has2(again, FLAG_TWO)).toEqual(false);
        });
        it("should contain flag three", () => {
          expect(has2(again, FLAG_THREE)).toEqual(true);
        });
      });
      describe("and removing the first flag", () => {
        let again;
        beforeEach(() => {
          again = remove2(updated, FLAG_ONE);
        });
        it("should be empty", () => {
          expect(again).toEqual(getEmpty());
        });
        it("should not contain flag one", () => {
          expect(has2(again, FLAG_ONE)).toEqual(false);
        });
        it("should not contain flag two", () => {
          expect(has2(again, FLAG_TWO)).toEqual(false);
        });
        it("should not contain flag three", () => {
          expect(has2(again, FLAG_THREE)).toEqual(false);
        });
      });
      describe("and adding the first flag again", () => {
        let again;
        beforeEach(() => {
          again = add(updated, FLAG_ONE);
        });
        it("should be unchanged", () => {
          expect(again).toEqual(updated);
        });
        it("should contain flag one", () => {
          expect(has2(again, FLAG_ONE)).toEqual(true);
        });
        it("should not contain flag two", () => {
          expect(has2(again, FLAG_TWO)).toEqual(false);
        });
        it("should not contain flag three", () => {
          expect(has2(again, FLAG_THREE)).toEqual(false);
        });
      });
    });
  });

  // lang/math.js
  function approximate(a, b) {
    if (!number(a) || !number(b)) {
      return false;
    }
    if (a === b) {
      return true;
    }
    if (isFinite(a) && isFinite(b)) {
      const absoluteDifference = Math.abs(a - b);
      if (absoluteDifference < Number.EPSILON) {
        return true;
      } else {
        return !(absoluteDifference > Math.max(Math.abs(a), Math.abs(b)) * Number.EPSILON);
      }
    } else {
      return false;
    }
  }

  // test/specs/lang/mathSpec.js
  describe("When using math.approximate", () => {
    "use strict";
    describe("and comparing identical integers", () => {
      it("should return true", () => {
        expect(approximate(12, 12)).toEqual(true);
      });
    });
    describe("and comparing identical decimals literals", () => {
      it("should return true", () => {
        expect(approximate(0.3, 0.3)).toEqual(true);
      });
    });
    describe("and comparing identical derived decimals derived with addition", () => {
      it("should return true", () => {
        expect(approximate(0.1 + 0.2, 0.3)).toEqual(true);
      });
    });
    describe("and comparing identical derived decimals derived with division and multiplication", () => {
      it("should return true", () => {
        expect(approximate(100.33 / 3 * 3, 100.33)).toEqual(true);
      });
    });
    describe("and comparing an integer with undefined", () => {
      it("should return false", () => {
        expect(approximate(123, void 0)).toEqual(false);
      });
    });
    describe("and comparing a decimal with undefined", () => {
      it("should return false", () => {
        expect(approximate(123.45, void 0)).toEqual(false);
      });
    });
    describe("and comparing an integer with null", () => {
      it("should return false", () => {
        expect(approximate(123, null)).toEqual(false);
      });
    });
    describe("and comparing a decimal with null", () => {
      it("should return false", () => {
        expect(approximate(123.45, null)).toEqual(false);
      });
    });
    describe("and comparing strings", () => {
      it("should return false", () => {
        expect(approximate("hi", "there")).toEqual(false);
      });
    });
  });

  // test/specs/lang/memoizeSpec.js
  describe("When using memoize.simple", () => {
    "use strict";
    describe("on a function that takes a tenth of second to complete", () => {
      let spy;
      let memo;
      let counter;
      beforeEach(() => {
        counter = 0;
        spy = jasmine.createSpy("spy").and.callFake((x) => {
          counter = counter + 1;
          return counter;
        });
        memo = simple(spy);
      });
      it("the memoized function should not have been called", () => {
        expect(spy).not.toHaveBeenCalled();
      });
      describe("and the memoized function is called", () => {
        let paramOne;
        let resultOne;
        beforeEach(() => {
          resultOne = memo(paramOne = "a");
        });
        it("the memoized function to have been called", () => {
          expect(spy.calls.count()).toEqual(1);
        });
        it("the memoized function to have been called with the correct parameters", () => {
          expect(spy).toHaveBeenCalledWith(paramOne);
        });
        it("the result should be a number", () => {
          expect(typeof resultOne).toEqual("number");
        });
        describe("and the memoized function is with the same value again", () => {
          let resultTwo;
          beforeEach(() => {
            resultTwo = memo(paramOne);
          });
          it("the memoized function not to have been called again", () => {
            expect(spy.calls.count()).toEqual(1);
          });
          it("the memoized function should have returned the cached value", () => {
            expect(resultTwo).toEqual(resultOne);
          });
        });
        describe("and the memoized function is called with another value", () => {
          let paramTwo;
          let resultTwo;
          beforeEach(() => {
            resultTwo = memo(paramTwo = "b");
          });
          it("the memoized function to have been called", () => {
            expect(spy.calls.count()).toEqual(2);
          });
          it("the memoized function to have been called with the correct parameters", () => {
            expect(spy).toHaveBeenCalledWith(paramTwo);
          });
          it("the result should be a number", () => {
            expect(typeof resultTwo).toEqual("number");
          });
        });
      });
    });
  });
  describe("When using memoize.cache", () => {
    "use strict";
    describe("with a 10 millisecond cache duration", () => {
      let spy;
      let memo;
      let counter;
      beforeEach(() => {
        counter = 0;
        spy = jasmine.createSpy("spy").and.callFake((x) => {
          counter = counter + 1;
          return counter;
        });
        memo = cache(spy, 10);
      });
      it("the memoized function should not have been called", () => {
        expect(spy).not.toHaveBeenCalled();
      });
      describe("and the memoized function is called", () => {
        let paramOne;
        let resultOne;
        beforeEach(() => {
          resultOne = memo();
        });
        it("the memoized function to have been called", () => {
          expect(spy.calls.count()).toEqual(1);
        });
        it("the result should be one", () => {
          expect(resultOne).toEqual(1);
        });
        describe("and the memoized function is with the same value again", () => {
          let resultTwo;
          beforeEach(() => {
            resultTwo = memo(paramOne);
          });
          it("the memoized function not to have been called again", () => {
            expect(spy.calls.count()).toEqual(1);
          });
          it("the memoized function should have returned the cached value", () => {
            expect(resultTwo).toEqual(1);
          });
        });
        describe("and the memoized function is called after the cache expires", () => {
          let resultThree;
          beforeEach((done) => {
            setTimeout(() => {
              resultThree = memo();
              done();
            }, 15);
          });
          it("the memoized function to have been called again", () => {
            expect(spy.calls.count()).toEqual(2);
          });
          it("the result should be two", () => {
            expect(resultThree).toEqual(2);
          });
        });
      });
    });
  });

  // lang/object.js
  function equals(a, b) {
    let returnVal;
    if (a === b) {
      returnVal = true;
    } else if (array(a) && array(b)) {
      if (a.length === b.length) {
        returnVal = a.length === 0 || a.every((x, i) => equals(x, b[i]));
      } else {
        returnVal = false;
      }
    } else if (object(a) && object(b)) {
      if (fn(a.equals) && fn(b.equals)) {
        returnVal = a.equals(b);
      } else {
        const keysA = keys(a);
        const keysB = keys(b);
        returnVal = differenceSymmetric(keysA, keysB).length === 0 && keysA.every((key) => {
          const valueA = a[key];
          const valueB = b[key];
          return equals(valueA, valueB);
        });
      }
    } else {
      returnVal = false;
    }
    return returnVal;
  }
  function clone(source, canExtract, extractor) {
    let c;
    if (fn(canExtract) && canExtract(source)) {
      c = extractor(source);
    } else if (date(source)) {
      c = new Date(source.getTime());
    } else if (array(source)) {
      c = source.map((sourceItem) => {
        return clone(sourceItem, canExtract, extractor);
      });
    } else if (object(source)) {
      c = keys(source).reduce((accumulator, key) => {
        accumulator[key] = clone(source[key], canExtract, extractor);
        return accumulator;
      }, {});
    } else {
      c = source;
    }
    return c;
  }
  function merge2(a, b) {
    let m;
    const mergeTarget = object(a) && !array(a);
    const mergeSource = object(b) && !array(b);
    if (mergeTarget && mergeSource) {
      const properties = unique(keys(a).concat(keys(b)));
      m = properties.reduce((accumulator, property) => {
        accumulator[property] = merge2(a[property], b[property]);
        return accumulator;
      }, {});
    } else if (undef(b)) {
      m = clone(a);
    } else {
      m = clone(b);
    }
    return m;
  }
  function keys(target) {
    const keys2 = [];
    for (let k in target) {
      if (Object.prototype.hasOwnProperty.call(target, k)) {
        keys2.push(k);
      }
    }
    return keys2;
  }

  // test/specs/lang/objectSpec.js
  describe("When cloning an object", () => {
    "use strict";
    let target;
    let clone2;
    describe("that is empty", () => {
      beforeEach(() => {
        clone2 = clone(target = {});
      });
      it("the clone should be an object", () => {
        expect(typeof clone2).toEqual("object");
      });
      it("the clone should not reference the source object", () => {
        expect(clone2).not.toBe(target);
      });
    });
    describe("that has a string-based property", () => {
      beforeEach(() => {
        clone2 = clone(target = { property: "hi" });
      });
      it("the property value should equal the source property value", () => {
        expect(clone2.property).toEqual(target.property);
      });
    });
    describe("that has a number-based property", () => {
      beforeEach(() => {
        clone2 = clone(target = { property: 23 });
      });
      it("the property value should equal the source property value", () => {
        expect(clone2.property).toEqual(target.property);
      });
    });
    describe("that has a Date property", () => {
      beforeEach(() => {
        clone2 = clone(target = { property: /* @__PURE__ */ new Date() });
      });
      it("the property value should equal the source property value", () => {
        expect(clone2.property).toEqual(target.property);
      });
    });
    describe("that has an object-based property", () => {
      beforeEach(() => {
        clone2 = clone(target = { property: {} });
      });
      it("the clone should be an object", () => {
        expect(typeof clone2.property).toEqual("object");
      });
      it("the property value should not be a reference to the property value on the source object", () => {
        expect(clone2.property).not.toBe(target.property);
      });
    });
    describe("that has an array-based property", () => {
      beforeEach(() => {
        clone2 = clone(target = { property: [] });
      });
      it("the clone should be an object", () => {
        expect(typeof clone2.property).toEqual("object");
      });
      it("the property value should not be a reference to the property value on the source object", () => {
        expect(clone2.property).not.toBe(target.property);
      });
    });
  });
  describe("When merging objects", () => {
    let a;
    let b;
    let merged;
    describe("that are flat", () => {
      beforeEach(() => {
        merged = merge2(a = { a: 1, b: 0 }, b = { b: 2, z: 26 });
      });
      it("should not provide a reference to the first source", () => {
        expect(merged).not.toBe(a);
      });
      it("should not provide a reference to the second source", () => {
        expect(merged).not.toBe(b);
      });
      it("should take exclusive properties from the first source", () => {
        expect(merged.a).toEqual(a.a);
      });
      it("should take exclusive properties from the second source", () => {
        expect(merged.z).toEqual(b.z);
      });
      it("should take shared properties from the second source", () => {
        expect(merged.b).toEqual(b.b);
      });
    });
    describe("that have nesting", () => {
      beforeEach(() => {
        merged = merge2(a = { a: { a: 1, b: 0 } }, b = { a: { b: 2, z: 26 } });
      });
      it("should not provide a reference to the (nested) first source", () => {
        expect(merged.a).not.toBe(a.a);
      });
      it("should not provide a reference to the (nested) second source", () => {
        expect(merged.a).not.toBe(b.a);
      });
      it("should take exclusive properties from the (nested) first source", () => {
        expect(merged.a.a).toEqual(a.a.a);
      });
      it("should take exclusive properties from the (nested) second source", () => {
        expect(merged.a.z).toEqual(b.a.z);
      });
      it("should take shared properties from the (nested) second source", () => {
        expect(merged.a.b).toEqual(b.a.b);
      });
    });
  });
  describe("When when extracting keys", () => {
    describe('from an object that has "a" and "b" properties', () => {
      let keys2;
      beforeEach(() => {
        keys2 = keys({ a: 1, b: 1 });
      });
      it("should have with two items", () => {
        expect(keys2.length).toEqual(2);
      });
      it('should contain an "a" value', () => {
        expect(keys2[0] === "a" || keys2[1] === "a").toEqual(true);
      });
      it('should contain a "b" value', () => {
        expect(keys2[0] === "b" || keys2[1] === "b").toEqual(true);
      });
      it('should not contain a "toString" value', () => {
        expect(keys2[0] === "toString" || keys2[1] === "toString").toEqual(false);
      });
    });
  });
  describe("When running a deep comparison", () => {
    describe("against two matching strings", () => {
      it("the result should be true", () => {
        expect(equals("abc", "abc")).toEqual(true);
      });
    });
    describe("against two different strings", () => {
      it("the result should be true", () => {
        expect(equals("abc", "xyz")).toEqual(false);
      });
    });
    describe("against an array containing the same strings", () => {
      it("the result should be false", () => {
        expect(equals(["a", "b"], ["a", "b"])).toEqual(true);
      });
    });
    describe("against an array of different sizes", () => {
      it("the result should be false", () => {
        expect(equals(["a", "b"], ["a", "b", "c"])).toEqual(false);
      });
    });
    describe("against objects where one object has an extra property", () => {
      it("the result should be false", () => {
        expect(equals({ first: "bryan" }, { first: "bryan", last: "ingle" })).toEqual(false);
      });
    });
    describe("against a complex object, with the same properties and values", () => {
      it("the result should be true", () => {
        let a = {
          hi: {
            my: {
              name: [
                "Elvis",
                "Presley"
              ],
              home: "Graceland"
            }
          }
        };
        let b = {
          hi: {
            my: {
              name: [
                "Elvis",
                "Presley"
              ],
              home: "Graceland"
            }
          }
        };
        expect(equals(a, b)).toEqual(true);
      });
    });
    describe("against a complex object, with the different properties and values", () => {
      it("the result should be false", () => {
        let a = {
          hi: {
            my: {
              name: [
                "Elvis",
                "Presley"
              ],
              home: "Graceland"
            }
          }
        };
        let b = {
          hi: {
            my: {
              name: [
                "Johnny",
                "Cash"
              ],
              home: "Tennessee"
            }
          }
        };
        expect(equals(a, b)).toEqual(false);
      });
    });
    describe("against a complex object, where both objects have equals methods (somewhere in the object model tree)", () => {
      it("the result should be true", () => {
        let a = {
          hi: {
            my: {
              name: [
                "Elvis",
                "Presley"
              ],
              home: {
                name: "Graceland",
                equals: (other) => {
                  return other.name === "Graceland";
                }
              }
            }
          }
        };
        let b = {
          hi: {
            my: {
              name: [
                "Elvis",
                "Presley"
              ],
              home: {
                name: "Graceland",
                equals: (other) => {
                  return other.name === "Graceland";
                }
              }
            }
          }
        };
        expect(equals(a, b)).toEqual(true);
      });
    });
    describe("against two empty arrays", () => {
      it("the result should be true", () => {
        expect(equals([], [])).toEqual(true);
      });
    });
  });
  describe("When cloning a simple object (using a custom value extractor)", () => {
    let source;
    let clone2;
    let canExtract;
    let extractor;
    beforeEach(() => {
      source = 42;
      canExtract = (value) => true;
      extractor = (value) => ++value;
      clone2 = clone(source, canExtract, extractor);
    });
    it("the cloned object should be 43", () => {
      expect(clone2).toBe(43);
    });
  });
  describe("When cloning a complex object (using a custom value extractor)", () => {
    let source;
    let clone2;
    let canExtract;
    let extractor;
    beforeEach(() => {
      source = { examples: { one: 1, two: 2, three: 3 }, game: { name: "fizz" }, numbers: [0, 1, 2, 3, 4] };
      canExtract = (value) => typeof value === "number";
      extractor = (value) => value > 0 && value % 3 === 0 ? "fizz" : value;
      clone2 = clone(source, canExtract, extractor);
    });
    it("the cloned object should not be the source object", () => {
      expect(clone2).not.toBe(source);
    });
    it("the clone object's child objects should not be the same", () => {
      expect({
        examples: clone2.examples === source.examples,
        game: clone2.game === source.game
      }).toEqual({
        examples: false,
        game: false
      });
    });
    it("the clone object's child arrays should not be the same", () => {
      expect(clone2.numbers).not.toBe(source.numbers);
    });
    it('the numbers divisible by three should be replaced with "fizz" (for object properties)', () => {
      expect({
        example: clone2.examples.three,
        array: clone2.numbers[3]
      }).toEqual({
        example: "fizz",
        array: "fizz"
      });
    });
    it("the numbers not divisible should be the same value (for object properties)", () => {
      expect({
        one: clone2.examples.one,
        two: clone2.examples.two,
        numbers: [clone2.numbers[0], clone2.numbers[1], clone2.numbers[2], clone2.numbers[4]]
      }).toEqual({
        one: 1,
        two: 2,
        numbers: [0, 1, 2, 4]
      });
    });
  });

  // test/specs/lang/promiseSpec.js
  describe("When a timeout is set for a promise", () => {
    "use strict";
    describe("on a promise that has already been resolved", () => {
      let originalPromise;
      let timeoutPromise;
      let result;
      beforeEach(() => {
        originalPromise = (async () => result = "instant")();
        timeoutPromise = timeout(originalPromise, 10);
      });
      it("it will resolve", async () => {
        const r = await timeoutPromise;
        expect(r).toBe(result);
      });
    });
    describe("on a promise that has already been rejected", () => {
      let originalPromise;
      let timeoutPromise;
      let result;
      beforeEach(() => {
        originalPromise = (async () => {
          throw result = "instant";
        })();
        timeoutPromise = timeout(originalPromise, 10);
      });
      it("it reject normally", async () => {
        let r;
        try {
          await timeoutPromise;
        } catch (e) {
          r = e;
        }
        expect(r).toBe(result);
      });
    });
    describe("on a promise that resolves quickly", () => {
      let originalPromise;
      let timeoutPromise;
      let result;
      beforeEach(() => {
        originalPromise = new Promise((resolveCallback, rejectCallback) => {
          setTimeout(() => {
            resolveCallback(result = "quick");
          }, 5);
        });
        timeoutPromise = timeout(originalPromise, 10);
      });
      it("it will resolve", async () => {
        const r = await timeoutPromise;
        expect(r).toBe(result);
      });
    });
    describe("on a promise that rejects quickly", () => {
      let originalPromise;
      let timeoutPromise;
      let result;
      beforeEach(() => {
        originalPromise = new Promise((resolveCallback, rejectCallback) => {
          setTimeout(() => {
            rejectCallback(result = "quick");
          }, 5);
        });
        timeoutPromise = timeout(originalPromise, 10);
      });
      it("it reject normally", async () => {
        const r = await getRejected(timeoutPromise);
        expect(r).toBe(result);
      });
    });
    describe("on a promise that resolves slowly", () => {
      let originalPromise;
      let timeoutPromise;
      let result;
      beforeEach(() => {
        originalPromise = new Promise((resolveCallback, rejectCallback) => {
          setTimeout(() => {
            resolveCallback(result = "slow");
          }, 20);
        });
        timeoutPromise = timeout(originalPromise, 10);
      });
      it("will reject due to timeout", async () => {
        await getRejected(timeoutPromise);
        expect(true).toBe(true);
      });
    });
    describe("on a promise that rejects slowly", () => {
      let originalPromise;
      let timeoutPromise;
      let result;
      beforeEach(() => {
        originalPromise = new Promise((resolveCallback, rejectCallback) => {
          setTimeout(() => {
            rejectCallback(result = "slow");
          }, 20);
        });
        timeoutPromise = timeout(originalPromise, 10);
      });
      it("it reject normally", async () => {
        const r = await getRejected(timeoutPromise);
        expect(r).not.toBe(result);
      });
    });
    describe("on a promise that will never resolve", () => {
      let originalPromise;
      let timeoutPromise;
      beforeEach(() => {
        originalPromise = new Promise((resolveCallback, rejectCallback) => {
          return;
        });
        timeoutPromise = timeout(originalPromise, 10);
      });
      it("will reject due to timeout", async () => {
        await getRejected(timeoutPromise);
        expect(true).toBe(true);
      });
    });
  });
  describe('When using the "promise.map" function', () => {
    "use strict";
    describe("with an asynchronous, promise-based mapper", () => {
      describe("and the array has zero items", () => {
        let mapPromise;
        let mapItems;
        let mapSpy;
        beforeEach(() => {
          mapItems = [];
        });
        describe("and the concurrency level is zero", () => {
          beforeEach(() => {
            mapPromise = map(mapItems, mapSpy = jasmine.createSpy("mapSpy"), 0);
          });
          it("the result should be an empty array", async () => {
            const results = await mapPromise;
            expect(results.length).toEqual(0);
          });
          it("the mapping function should not have been called", async () => {
            await mapPromise;
            expect(mapSpy).not.toHaveBeenCalled();
          });
        });
        describe("and the concurrency level is six", () => {
          beforeEach(() => {
            mapPromise = map(mapItems, mapSpy = jasmine.createSpy("mapSpy"), 6);
          });
          it("the result should be an empty array", async () => {
            const results = await mapPromise;
            expect(results.length).toEqual(0);
          });
          it("the mapping function should not have been called", async () => {
            await mapPromise;
            expect(mapSpy).not.toHaveBeenCalled();
          });
        });
      });
      describe("and the array has three items", () => {
        let mapPromise;
        let mapItems;
        let mapSpy;
        let first3;
        let second;
        let third;
        beforeEach(() => {
          mapItems = [first3 = {}, second = {}, third = {}];
        });
        describe("and the concurrency level is zero", () => {
          beforeEach(() => {
            mapPromise = map(mapItems, mapSpy = getMapSpy(), 0);
          });
          it("the maximum concurrency level should be three", async () => {
            const results = await mapPromise;
            expect(getMaximumConcurrency(results)).toEqual(3);
          });
          it("the actual concurrency for the first item should be three", async () => {
            const results = await mapPromise;
            expect(getConcurrency(results, 0)).toEqual(3);
          });
          it("the result for the first item should be first", async () => {
            const results = await mapPromise;
            expect(results[0].item).toBe(first3);
          });
          it("the result for the second item should be second", async () => {
            const results = await mapPromise;
            expect(results[1].item).toBe(second);
          });
          it("the result for the third item should be third", async () => {
            const results = await mapPromise;
            expect(results[2].item).toBe(third);
          });
        });
        describe("and the concurrency level is one", () => {
          beforeEach(() => {
            mapPromise = map(mapItems, mapSpy = getMapSpy(), 1);
          });
          it("the maximum concurrency level should be one", async () => {
            const results = await mapPromise;
            expect(getMaximumConcurrency(results)).toEqual(1);
          });
          it("the actual concurrency for the first item should be one", async () => {
            const results = await mapPromise;
            expect(getConcurrency(results, 0)).toEqual(1);
          });
          it("the result for the first item should be first", async () => {
            const results = await mapPromise;
            expect(results[0].item).toBe(first3);
          });
          it("the result for the second item should be second", async () => {
            const results = await mapPromise;
            expect(results[1].item).toBe(second);
          });
          it("the result for the third item should be third", async () => {
            const results = await mapPromise;
            expect(results[2].item).toBe(third);
          });
        });
        describe("and the concurrency level is two", () => {
          beforeEach(() => {
            mapPromise = map(mapItems, mapSpy = getMapSpy(), 2);
          });
          it("the maximum concurrency level should be two", async () => {
            const results = await mapPromise;
            expect(getMaximumConcurrency(results)).toEqual(2);
          });
          it("the actual concurrency for the first item should be two", async () => {
            const results = await mapPromise;
            expect(getConcurrency(results, 0)).toEqual(2);
          });
          it("the result for the first item should be first", async () => {
            const results = await mapPromise;
            expect(results[0].item).toBe(first3);
          });
          it("the result for the second item should be second", async () => {
            const results = await mapPromise;
            expect(results[1].item).toBe(second);
          });
          it("the result for the third item should be third", async () => {
            const results = await mapPromise;
            expect(results[2].item).toBe(third);
          });
        });
        describe("and the concurrency level is three", () => {
          beforeEach(() => {
            mapPromise = map(mapItems, mapSpy = getMapSpy(), 3);
          });
          it("the maximum concurrency level should be three", async () => {
            const results = await mapPromise;
            expect(getMaximumConcurrency(results)).toEqual(3);
          });
          it("the actual concurrency for the first item should be three", async () => {
            const results = await mapPromise;
            expect(getConcurrency(results, 0)).toEqual(3);
          });
          it("the result for the first item should be first", async () => {
            const results = await mapPromise;
            expect(results[0].item).toBe(first3);
          });
          it("the result for the second item should be second", async () => {
            const results = await mapPromise;
            expect(results[1].item).toBe(second);
          });
          it("the result for the third item should be third", async () => {
            const results = await mapPromise;
            expect(results[2].item).toBe(third);
          });
        });
        describe("and the concurrency level is four", () => {
          beforeEach(() => {
            mapPromise = map(mapItems, mapSpy = getMapSpy(), 4);
          });
          it("the maximum concurrency level should be three", async () => {
            const results = await mapPromise;
            expect(getMaximumConcurrency(results)).toEqual(3);
          });
          it("the actual concurrency for the first item should be three", async () => {
            const results = await mapPromise;
            expect(getConcurrency(results, 0)).toEqual(3);
          });
          it("the result for the first item should be first", async () => {
            const results = await mapPromise;
            expect(results[0].item).toBe(first3);
          });
          it("the result for the second item should be second", async () => {
            const results = await mapPromise;
            expect(results[1].item).toBe(second);
          });
          it("the result for the third item should be third", async () => {
            const results = await mapPromise;
            expect(results[2].item).toBe(third);
          });
        });
      });
      describe("and the array has four items (with a concurrency level of two)", () => {
        let mapPromise;
        let mapItems;
        let mapSpy;
        let first3;
        let second;
        let third;
        let fourth;
        beforeEach(() => {
          mapItems = [first3 = {}, second = {}, third = {}, fourth = {}];
        });
        describe("and the first item takes a long time to process", () => {
          beforeEach(() => {
            mapPromise = map(mapItems, mapSpy = jasmine.createSpy("mapSpy").and.callFake((item) => {
              let delay;
              if (item === first3) {
                delay = 30;
              } else {
                delay = 5;
              }
              let startDate = /* @__PURE__ */ new Date();
              return new Promise((resolveCallback, rejectCallback) => {
                setTimeout(() => {
                  let endDate = /* @__PURE__ */ new Date();
                  resolveCallback({
                    item,
                    start: startDate.getTime(),
                    end: endDate.getTime()
                  });
                }, delay);
              });
            }), 2);
          });
          it("the result for the first item should be first", async () => {
            const results = await mapPromise;
            expect(results[0].item).toBe(first3);
          });
          it("the result for the second item should be second", async () => {
            const results = await mapPromise;
            expect(results[1].item).toBe(second);
          });
          it("the result for the third item should be third", async () => {
            const results = await mapPromise;
            expect(results[2].item).toBe(third);
          });
          it("the result for the fourth item should be fourth", async () => {
            const results = await mapPromise;
            expect(results[3].item).toBe(fourth);
          });
        });
      });
      let getMapSpy = () => {
        return jasmine.createSpy("mapSpy").and.callFake((item) => {
          let startDate = /* @__PURE__ */ new Date();
          return new Promise((resolveCallback, rejectCallback) => {
            setTimeout(() => {
              let endDate = /* @__PURE__ */ new Date();
              resolveCallback({
                item,
                start: startDate.getTime(),
                end: endDate.getTime()
              });
            }, 5);
          });
        });
      };
    });
    describe("with an synchronous mapper", () => {
      describe("and the array has no items (with an infinite concurrency level)", () => {
        let mapPromise;
        let mapItems;
        let mapSpy;
        beforeEach(() => {
          mapPromise = map(mapItems = [], mapSpy = jasmine.createSpy("mapSpy"));
        });
        it("the result will be an array", async () => {
          const results = await mapPromise;
          expect(results instanceof Array).toEqual(true);
        });
        it("the resulting array will be the same size as the input array", async () => {
          const results = await mapPromise;
          expect(results.length).toEqual(mapItems.length);
        });
        it("the mapper function will be not have been called", async () => {
          await mapPromise;
          expect(mapSpy.calls.count()).toEqual(0);
        });
      });
      describe("and the array has two items (with an infinite concurrency level)", () => {
        let mapPromise;
        let mapItems;
        let mapSpy;
        beforeEach(() => {
          mapPromise = map(mapItems = ["x", "y"], mapSpy = jasmine.createSpy("mapSpy"));
        });
        it("the result will be an array", async () => {
          const results = await mapPromise;
          expect(results instanceof Array).toEqual(true);
        });
        it("the resulting array have two items", async () => {
          const results = await mapPromise;
          expect(results.length).toEqual(2);
        });
        it("the mapper function to have been called twice", async () => {
          await mapPromise;
          expect(mapSpy.calls.count()).toEqual(2);
        });
        it("the mapper function will have been called once with the first item", async () => {
          await mapPromise;
          expect(mapSpy).toHaveBeenCalledWith(mapItems[0]);
        });
        it("the mapper function will have been called once with the second item", async () => {
          await mapPromise;
          expect(mapSpy).toHaveBeenCalledWith(mapItems[1]);
        });
      });
    });
    let getConcurrency = (results, index) => {
      let current = results[index];
      let concurrency = 0;
      for (let i = 0; i < results.length; i++) {
        let other = results[i];
        if (!(other.end <= current.start || other.start >= current.end)) {
          concurrency = concurrency + 1;
        }
      }
      return concurrency;
    };
    let getMaximumConcurrency = (results) => {
      let maximum = 0;
      for (let i = 0; i < results.length; i++) {
        maximum = Math.max(getConcurrency(results, i), maximum);
      }
      return maximum;
    };
  });
  describe('When processing a "pipeline" of promises', () => {
    "use strict";
    describe("and no executors are specified", () => {
      let input;
      let p;
      beforeEach(() => {
        p = pipeline([], input = {});
      });
      it("should return the original input", async () => {
        const result = await p;
        expect(result).toBe(input);
      });
    });
    describe("and one asynchronous executor is specified", () => {
      let input;
      let spyOne;
      let p;
      beforeEach(() => {
        let delayedSquare = (x) => {
          return new Promise((resolveCallback) => {
            setTimeout(() => {
              resolveCallback(x * x);
            }, 10);
          });
        };
        spyOne = jasmine.createSpy("spyOne").and.callFake(delayedSquare);
        p = pipeline([spyOne], input = 2);
      });
      it("the first executor should be called with the input", async () => {
        await p;
        expect(spyOne).toHaveBeenCalledWith(2);
      });
      it("the promise should return the correct result", async () => {
        const result = await p;
        expect(result).toEqual(4);
      });
    });
    describe("and two asynchronous executors are specified", () => {
      let input;
      let spyOne;
      let spyTwo;
      let p;
      beforeEach(() => {
        let delayedSquare = (x) => {
          return new Promise((resolveCallback) => {
            setTimeout(() => {
              resolveCallback(x * x);
            }, 10);
          });
        };
        spyOne = jasmine.createSpy("spyOne").and.callFake(delayedSquare);
        spyTwo = jasmine.createSpy("spyTwo").and.callFake(delayedSquare);
        p = pipeline([spyOne, spyTwo], input = 2);
      });
      it("the first executor should be called with the input", async () => {
        await p;
        expect(spyOne).toHaveBeenCalledWith(2);
      });
      it("the second executor should be called with the result of the first executor", async () => {
        await p;
        expect(spyTwo).toHaveBeenCalledWith(4);
      });
      it("the promise should return the correct result", async () => {
        const result = await p;
        expect(result).toEqual(16);
      });
    });
    describe("and one synchronous executor is specified", () => {
      let input;
      let spyOne;
      let p;
      beforeEach(() => {
        let synchronousSquare = (x) => {
          return x * x;
        };
        spyOne = jasmine.createSpy("spyOne").and.callFake(synchronousSquare);
        p = pipeline([spyOne], input = 2);
      });
      it("the first executor should be called with the input", async () => {
        await p;
        expect(spyOne).toHaveBeenCalledWith(2);
      });
      it("the promise should return the correct result", async () => {
        const result = await p;
        expect(result).toEqual(4);
      });
    });
    describe("and two synchronous executors are specified", () => {
      let input;
      let spyOne;
      let spyTwo;
      let p;
      beforeEach(() => {
        let synchronousSquare = (x) => {
          return x * x;
        };
        spyOne = jasmine.createSpy("spyOne").and.callFake(synchronousSquare);
        spyTwo = jasmine.createSpy("spyTwo").and.callFake(synchronousSquare);
        p = pipeline([spyOne, spyTwo], input = 2);
      });
      it("the first executor should be called with the input", async () => {
        await p;
        expect(spyOne).toHaveBeenCalledWith(2);
      });
      it("the second executor should be called with the result of the first executor", async () => {
        await p;
        expect(spyTwo).toHaveBeenCalledWith(4);
      });
      it("the promise should return the correct result", async () => {
        const result = await p;
        expect(result).toEqual(16);
      });
    });
    describe("and an executor throws an exception", () => {
      let input;
      let spyOne;
      let spyTwo;
      let p;
      beforeEach(() => {
        let synchronousException = (x) => {
          throw new Error("oops");
        };
        let synchronousSquare = (x) => {
          return x * x;
        };
        spyOne = jasmine.createSpy("spyOne").and.callFake(synchronousException);
        spyTwo = jasmine.createSpy("spyTwo").and.callFake(synchronousSquare);
        p = pipeline([spyOne, spyTwo], input = 2);
      });
      it("the promise should reject", async () => {
        const error = await getRejected(p);
        expect(error instanceof Error).toEqual(true);
      });
      it("the first executor should be called with the input", async () => {
        await getRejected(p);
        expect(spyOne).toHaveBeenCalledWith(2);
      });
      it("the second executor not have should be called with the result of the first executor", async () => {
        await getRejected(p);
        expect(spyTwo).not.toHaveBeenCalled();
      });
    });
  });
  describe('When searching for the "first" valid promise', () => {
    describe("with an empty array", () => {
      let result;
      beforeEach(async () => {
        result = await first2([]);
      });
      it("the result should be a null value", () => {
        expect(result).toEqual(null);
      });
    });
    describe("with an array of two executors, where both return null", () => {
      let one;
      let two;
      let result;
      beforeEach(async () => {
        one = jasmine.createSpy("one").and.callFake(async () => null);
        two = jasmine.createSpy("two").and.callFake(async () => null);
        result = await first2([one, two]);
      });
      it("the result should be a null value", () => {
        expect(result).toEqual(null);
      });
      it("the first executor should have been invoked", () => {
        expect(one).toHaveBeenCalled();
      });
      it("the second executor should have been invoked", () => {
        expect(two).toHaveBeenCalled();
      });
    });
    describe("with an array of two executors, where both return values", () => {
      let one;
      let two;
      let valueOne;
      let valueTwo;
      let result;
      beforeEach(async () => {
        valueOne = {};
        valueTwo = {};
        one = jasmine.createSpy("one").and.callFake(async () => valueOne);
        two = jasmine.createSpy("two").and.callFake(async () => valueTwo);
        result = await first2([one, two]);
      });
      it("the result the value from the first executor", () => {
        expect(result).toBe(valueOne);
      });
      it("the first executor should have been invoked", () => {
        expect(one).toHaveBeenCalled();
      });
      it("the second executor should not have been invoked", () => {
        expect(two).not.toHaveBeenCalled();
      });
    });
    describe("with an array of two executors, where only the last returns a value", () => {
      let one;
      let two;
      let valueOne;
      let valueTwo;
      let result;
      beforeEach(async () => {
        valueOne = null;
        valueTwo = {};
        one = jasmine.createSpy("one").and.callFake(async () => valueOne);
        two = jasmine.createSpy("two").and.callFake(async () => valueTwo);
        result = await first2([one, two]);
      });
      it("the result the value from the second executor", () => {
        expect(result).toBe(valueTwo);
      });
      it("the first executor should have been invoked", () => {
        expect(one).toHaveBeenCalled();
      });
      it("the second executor should have been invoked", () => {
        expect(two).toHaveBeenCalled();
      });
    });
    describe("with an array of two executors, where the first returns a rejected promise", () => {
      let one;
      let two;
      let valueTwo;
      let result;
      beforeEach(async () => {
        valueTwo = {};
        one = jasmine.createSpy("one").and.callFake(async () => {
          throw "Oops";
        });
        two = jasmine.createSpy("two").and.callFake(async () => valueTwo);
        result = await first2([one, two]);
      });
      it("the result the value from the second executor", () => {
        expect(result).toBe(valueTwo);
      });
      it("the first executor should have been invoked", () => {
        expect(one).toHaveBeenCalled();
      });
      it("the second executor should have been invoked", () => {
        expect(two).toHaveBeenCalled();
      });
    });
  });
  describe('When "promise.build" is used to create a promise', () => {
    "use strict";
    describe("and the executor resolves", () => {
      let p;
      beforeEach(() => {
        p = build((r, x) => {
          r("ok");
        });
      });
      it("the promise should be fulfilled", async () => {
        const result = await p;
        expect(result).toEqual("ok");
      });
    });
    describe("and the executor rejects", () => {
      let p;
      beforeEach(() => {
        p = build((r, x) => {
          x("not ok");
        });
      });
      it("the promise should be fulfilled", async () => {
        let result;
        try {
          await p;
        } catch (e) {
          result = e;
        }
        expect(result).toEqual("not ok");
      });
    });
    describe("and the executor throws an error", () => {
      let p;
      let e;
      beforeEach(() => {
        p = build((r, x) => {
          e = new Error("oops");
          throw e;
        });
      });
      it("the promise should be rejected", async () => {
        let error;
        try {
          await p;
        } catch (caught) {
          error = caught;
        }
        expect(error).toBe(e);
      });
    });
  });
  async function getRejected(promiseToReject) {
    try {
      await promiseToReject;
    } catch (e) {
      return e;
    }
    throw new Error("Expected promise to reject.");
  }

  // lang/random.js
  function range(minimum, maximum) {
    argumentIsRequired(minimum, "minimum", Number);
    argumentIsRequired(maximum, "maximum", Number);
    const mn = Math.trunc(minimum);
    const mx = Math.trunc(maximum);
    return Math.min(mn, mx) + Math.floor(Math.random() * Math.abs(mx - mn));
  }

  // test/specs/lang/randomSpec.js
  describe("When generating a random number, restricting the range to one integer", () => {
    "use strict";
    let result;
    let value;
    beforeEach(() => {
      result = range(value = 42, value);
    });
    it("should be the value", () => {
      expect(result).toEqual(value);
    });
  });
  describe("When generating a random number with a range of values", () => {
    "use strict";
    let minimum;
    let maximum;
    beforeEach(() => {
      minimum = -2;
      maximum = 1;
    });
    it("should generate a value within the range", () => {
      const results = Array.from({ length: 100 }, () => range(minimum, maximum));
      expect(results.every((result) => result >= minimum && result < maximum)).toEqual(true);
    });
    it("should generate an integer", () => {
      for (let i = 0; i < 100; i++) {
        const result = range(minimum, maximum);
        expect(result | 0).toEqual(result);
      }
    });
  });
  describe("When generating a random number using an invalid range, the range is automatically corrected", () => {
    "use strict";
    let minimum;
    let maximum;
    beforeEach(() => {
      minimum = 9;
      maximum = 4;
    });
    it("should generate a value within the range", () => {
      const results = Array.from({ length: 100 }, () => range(minimum, maximum));
      expect(results.every((result) => result >= maximum && result < minimum)).toEqual(true);
    });
    it("should generate an integer", () => {
      for (let i = 0; i < 100; i++) {
        const result = range(minimum, maximum);
        expect(result | 0).toEqual(result);
      }
    });
  });

  // lang/string.js
  var regex2 = {};
  regex2.camel = {};
  regex2.camel.violations = /\b[A-Z]/g;
  function startCase(s) {
    return s.split(" ").reduce((phrase, word) => {
      if (word.length !== 0) {
        phrase.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
      }
      return phrase;
    }, []).join(" ");
  }
  function camelCase(s) {
    argumentIsRequired(s, "s", String);
    return s.replace(regex2.camel.violations, (m) => m.toLocaleLowerCase());
  }
  function truncate(s, length) {
    if (string(s) && s.length > length) {
      return s.substring(0, length) + " ...";
    } else {
      return s;
    }
  }
  function padLeft(s, length, character) {
    argumentIsRequired(s, "s", String);
    argumentIsRequired(length, "length", Number);
    argumentIsRequired(character, "character", String);
    if (character.length !== 1) {
      throw new Error('The "character" argument must be one character in length.');
    }
    return character.repeat(length - s.length) + s;
  }
  function mask(s, mask2, show, length) {
    argumentIsRequired(s, "s", String);
    argumentIsRequired(mask2, "mask", String);
    argumentIsRequired(show, "show", Number);
    argumentIsOptional(length, "length", Number);
    if (number(length) && !(length > 0)) {
      return "";
    }
    const countShown = Math.min(s.length, Math.max(show, 0));
    const countMasked = Math.max(s.length, Math.max(length || 0), 0) - countShown;
    let masked = `${mask2.slice(-1).repeat(countMasked)}${countShown > 0 ? s.slice(~countShown + 1) : ""}`;
    if (number(length) && !(length < 0) && length < s.length) {
      masked = masked.slice(~length + 1);
    }
    return masked;
  }
  function format2(s, ...data) {
    argumentIsRequired(s, "s", String);
    return s.replace(/{(\d+)}/g, (match, i) => {
      let replacement;
      if (i < data.length) {
        const item = data[i];
        if (!undef(item) && !nil(item)) {
          replacement = item.toString();
        } else {
          replacement = match;
        }
      } else {
        replacement = match;
      }
      return replacement;
    });
  }

  // test/specs/lang/stringSpec.js
  describe('When converting a sentence to "start" casing', () => {
    let result;
    beforeEach(() => {
      result = startCase("The quick brown Fox");
    });
    it("should convert the first character (after each space) to an uppercase letter", () => {
      expect(result).toEqual("The Quick Brown Fox");
    });
  });
  describe('When converting a sentence to "camel" casing', () => {
    let result;
    beforeEach(() => {
      result = camelCase("The quick brown Fox");
    });
    it("should convert the first character (after each space) to a lowercase letter", () => {
      expect(result).toEqual("the quick brown fox");
    });
  });
  describe('When converting a word to "start" casing', () => {
    let result;
    beforeEach(() => {
      result = startCase("myLittlePony");
    });
    it("should convert the first character (after each space) to a uppercase letter", () => {
      expect(result).toEqual("Mylittlepony");
    });
  });
  describe('When converting a word to "camel" casing', () => {
    let result;
    beforeEach(() => {
      result = camelCase("MyLittlePony");
    });
    it("should convert the first character (after each space) to a lowercase letter", () => {
      expect(result).toEqual("myLittlePony");
    });
  });
  describe("When truncating a string", () => {
    let base;
    beforeEach(() => {
      base = "1234567890";
    });
    describe("to more characters than the base string", () => {
      let result;
      beforeEach(() => {
        result = truncate(base, base.length + 1);
      });
      it("should return the base string", () => {
        expect(result).toEqual(base);
      });
    });
    describe("to the same number of characters than the base string", () => {
      let result;
      beforeEach(() => {
        result = truncate(base, base.length);
      });
      it("should return the base string", () => {
        expect(result).toEqual(base);
      });
    });
    describe("to fewer characters than the base string", () => {
      let result;
      let length;
      beforeEach(() => {
        result = truncate(base, length = 2);
      });
      it("the result should be the correct number of characters", () => {
        expect(result.length).toEqual(length + 4);
      });
      it("the first characters should be from the base string", () => {
        for (let i = 0; i < length; i++) {
          expect(result.substring(i, i + 1)).toEqual(base.substring(i, i + 1));
        }
      });
      it("the final characters should be the base string", () => {
        expect(result.substring(result.length - 4, result.length)).toEqual(" ...");
      });
    });
  });
  describe("When left padding a string", () => {
    let base;
    beforeEach(() => {
      base = "base";
    });
    describe("with fewer characters than the base string", () => {
      let result;
      beforeEach(() => {
        result = padLeft(base, base.length, "x");
      });
      it("should return the base string", () => {
        expect(result).toEqual(base);
      });
    });
    describe("with one more character than the base string", () => {
      let result;
      let repeat;
      beforeEach(() => {
        result = padLeft(base, base.length + 1, repeat = "x");
      });
      it("the result should be the correct number of characters", () => {
        expect(result.length).toEqual(base.length + 1);
      });
      it("the first character should be the repeating character", () => {
        expect(result.substring(0, 1)).toEqual(repeat);
      });
      it("the final characters should be the base string", () => {
        expect(result.substring(1, result.length)).toEqual(base);
      });
    });
    describe("with many more character than the base string", () => {
      let result;
      let repeat;
      let count;
      beforeEach(() => {
        result = padLeft(base, count = 10, repeat = "x");
      });
      it("the result should be the correct number of characters", () => {
        expect(result.length).toEqual(count);
      });
      it("the first characters should be the repeating character", () => {
        let prefix = count - base.length;
        for (let i = 0; i < prefix; i++) {
          expect(result.substring(i, i + 1)).toEqual(repeat);
        }
      });
      it("the final characters should be the base string", () => {
        expect(result.substring(count - base.length, result.length)).toEqual(base);
      });
    });
  });
  describe('When masking a string the string "12345678"', () => {
    let s;
    beforeEach(() => {
      s = "12345678";
    });
    it('with zero characters shown and a mask of "*" should be "********"', () => {
      expect(mask(s, "*", 0)).toEqual("********");
    });
    it('with four characters shown and a mask of "*" should be "****5678"', () => {
      expect(mask(s, "*", 4)).toEqual("****5678");
    });
    it('with eight characters shown and a mask of "*" should be "12345678"', () => {
      expect(mask(s, "*", 8)).toEqual("12345678");
    });
    it('with nine characters shown and a mask of "*" should be "12345678"', () => {
      expect(mask(s, "*", 9)).toEqual("12345678");
    });
    it('with four characters shown and a mask of "*" and a final length of six should be "**5678"', () => {
      expect(mask(s, "*", 4, 6)).toEqual("**5678");
    });
    it('with four characters shown and a mask of "*" and a final length of ten should be "******5678"', () => {
      expect(mask(s, "*", 4, 10)).toEqual("******5678");
    });
    it('with four characters shown and a mask of "*" and a final length of three should be 678"', () => {
      expect(mask(s, "*", 4, 3)).toEqual("678");
    });
    it('with zero characters shown and a mask of "*" and a final length of ten should be "**********"', () => {
      expect(mask(s, "*", 0, 10)).toEqual("**********");
    });
    it('with four characters shown and a mask of "*" and a final length of one should be "8"', () => {
      expect(mask(s, "*", 4, 1)).toEqual("8");
    });
    it('with four characters shown and a mask of "*" and a final length of zero should be a zero-length string', () => {
      expect(mask(s, "*", 4, 0)).toEqual("");
    });
    it('with negative characters shown and a mask of "*" should be "********"', () => {
      expect(mask(s, "*", -1)).toEqual("********");
    });
    it('with negative characters shown and a mask of "*" and a final negative length should be a zero-length string', () => {
      expect(mask(s, "*", -1, -1)).toEqual("");
    });
  });
  describe('When a format pattern is used ("&startDate={0}&endDate={1})"', () => {
    let stringToFormat;
    beforeEach(() => {
      stringToFormat = "&startDate={0}&endDate={1}";
    });
    it('formatted with ("2017-08-31" and  "2017-09-30")', () => {
      expect(format2(stringToFormat, "2017-08-31", "2017-09-30")).toEqual("&startDate=2017-08-31&endDate=2017-09-30");
    });
    it('formatted with ("0" and  "0")', () => {
      expect(format2(stringToFormat, 0, 0)).toEqual("&startDate=0&endDate=0");
    });
    it('formatted with ("hello")', () => {
      expect(format2(stringToFormat, "hello")).toEqual("&startDate=hello&endDate={1}");
    });
    it('formatted with ("xin" and "bryan" and "dave")', () => {
      expect(format2(stringToFormat, "xin", "bryan", "dave")).toEqual("&startDate=xin&endDate=bryan");
    });
    it("formatted with nothing", () => {
      expect(format2(stringToFormat)).toEqual("&startDate={0}&endDate={1}");
    });
  });

  // test/specs/lang/timezoneSpec.js
  describe("When timezone utilities are used", () => {
    "use strict";
    it("should return timezone names", () => {
      const timezones = getTimezones();
      expect({
        nonEmpty: timezones.length > 0,
        belgrade: timezones.includes("Europe/Belgrade")
      }).toEqual({
        nonEmpty: true,
        belgrade: true
      });
    });
    it("should detect known timezone names", () => {
      expect({
        known: hasTimezone("Europe/Belgrade"),
        unknown: hasTimezone("Not/AZone")
      }).toEqual({
        known: true,
        unknown: false
      });
    });
    it("should validate timezone lookup arguments", () => {
      expect(() => hasTimezone()).toThrow();
    });
    it("should guess a timezone or null", () => {
      const guess = guessTimezone();
      expect(typeof guess === "string" || guess === null).toEqual(true);
    });
  });

  // messaging/Event.js
  var Event = class extends Disposable {
    #sender;
    #observers;
    /**
     * @param {*} sender - The object which owns the event.
     */
    constructor(sender) {
      super();
      this.#sender = sender || null;
      this.#observers = [];
    }
    /**
     * Registers an event handler which will receive a notification when
     * {@link Event#fire} is called.
     *
     * @public
     * @param {Function} handler - The function which will be called each time the event fires. The first argument will be the event data. The second argument will be the event owner (i.e. sender).
     * @returns {Disposable}
     */
    register(handler) {
      argumentIsRequired(handler, "handler", Function);
      this.#addRegistration(handler);
      return Disposable.fromAction(() => {
        if (this.disposed) {
          return;
        }
        this.#removeRegistration(handler);
      });
    }
    /**
     * Removes registration for an event handler. That is, the handler will
     * no longer be called if the event fires.
     *
     * @public
     * @param {Function} handler
     */
    unregister(handler) {
      argumentIsRequired(handler, "handler", Function);
      this.#removeRegistration(handler);
    }
    /**
     * Removes all handlers from the event.
     *
     * @public
     */
    clear() {
      this.#observers = [];
    }
    /**
     * Triggers the event, calling all previously registered handlers.
     *
     * @public
     * @param {*} data - The data to pass each handler.
     */
    fire(data) {
      let observers = this.#observers;
      for (let i = 0; i < observers.length; i++) {
        let observer = observers[i];
        observer(data, this.#sender);
      }
    }
    /**
     * Returns true if no handlers are currently registered.
     *
     * @public
     * @returns {boolean}
     */
    getIsEmpty() {
      return this.#observers.length === 0;
    }
    /**
     * @protected
     * @override
     */
    _onDispose() {
      this.#observers = null;
    }
    #addRegistration(handler) {
      let copiedObservers = this.#observers.slice();
      copiedObservers.push(handler);
      this.#observers = copiedObservers;
    }
    #removeRegistration(handler) {
      const indicesToRemove = [];
      for (let i = 0; i < this.#observers.length; i++) {
        let candidate = this.#observers[i];
        if (candidate === handler) {
          indicesToRemove.push(i);
        }
      }
      if (indicesToRemove.length > 0) {
        const copiedObservers = this.#observers.slice();
        for (let j = indicesToRemove.length - 1; !(j < 0); j--) {
          copiedObservers.splice(indicesToRemove[j], 1);
        }
        this.#observers = copiedObservers;
      }
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Event]";
    }
  };

  // messaging/EventMap.js
  var EventMap = class extends Disposable {
    #events;
    constructor() {
      super();
      this.#events = {};
    }
    /**
     * Fires the appropriate event which is mapped to the event name.
     * See {@link Event#fire} for more information.
     *
     * @public
     * @param {string} eventName - The event's name.
     * @param {*} data - The data to provide to observers.
     */
    fire(eventName, data) {
      const event = this.#events[eventName];
      if (event) {
        event.fire(data);
      }
    }
    /**
     * Registers a handler. See {@link Event#register} for more information.
     *
     * @public
     * @param {string} eventName - The event's name.
     * @param {Function} handler
     * @returns {Disposable}
     */
    register(eventName, handler) {
      argumentIsRequired(eventName, "eventName", String);
      if (this.disposed) {
        throw new Error("The event has been disposed.");
      }
      let event = this.#events[eventName];
      if (!event) {
        event = this.#events[eventName] = new Event(this);
      }
      return event.register(handler);
    }
    /**
     * Removes a handler. See {@link Event#unregister} for more information.
     *
     * @public
     * @param {string} eventName - The event's name.
     * @param {Function} handler
     */
    unregister(eventName, handler) {
      argumentIsRequired(eventName, "eventName", String);
      const event = this.#events[eventName];
      if (event) {
        event.unregister(handler);
        if (event.getIsEmpty()) {
          delete this.#events[eventName];
        }
      }
    }
    /**
     * Clears an event's handlers. See {@link Event#clear} for more information.
     *
     * @public
     * @param {string} eventName - The event's name.
     */
    clear(eventName) {
      argumentIsRequired(eventName, "eventName", String);
      const event = this.#events[eventName];
      if (event) {
        event.clear();
        delete this.#events[eventName];
      }
    }
    /**
     * Returns true, if no handlers are currently registered for the
     * specified event. See {@link Event#getIsEmpty} for more information.
     *
     * @public
     * @param {string} eventName
     * @returns {boolean}
     */
    getIsEmpty(eventName) {
      const event = this.#events[eventName];
      let returnVal;
      if (event) {
        returnVal = event.getIsEmpty();
      } else {
        returnVal = true;
      }
      return returnVal;
    }
    /**
     * Returns an array of all the event names.
     *
     * @public
     * @returns {Array<string>}
     */
    getKeys() {
      const keys2 = [];
      for (let key in this.#events) {
        if (Object.prototype.hasOwnProperty.call(this.#events, key)) {
          keys2.push(key);
        }
      }
      return keys2;
    }
    /**
     * Returns true, if an event with the given name exists.
     *
     * @public
     * @param {string} key
     * @returns {boolean}
     */
    hasKey(key) {
      return Object.prototype.hasOwnProperty.call(this.#events, key);
    }
    /**
     * @protected
     * @override
     */
    _onDispose() {
      let keys2 = this.getKeys();
      for (let i = 0; i < keys2.length; i++) {
        let key = keys2[i];
        this.#events[key].dispose();
      }
      this.#events = {};
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[EventMap]";
    }
  };

  // test/specs/messaging/EventMapSpec.js
  describe("When an EventMap is constructed", () => {
    "use strict";
    let eventMap;
    beforeEach(() => {
      eventMap = new EventMap();
    });
    it("should not have keys", () => {
      expect(eventMap.getKeys()).toEqual([]);
    });
    it("should not have an unknown key", () => {
      expect(eventMap.hasKey("hi")).toEqual(false);
    });
    describe("and a handler is registered", () => {
      let eventName;
      let eventHandler;
      beforeEach(() => {
        eventMap.register(eventName = "hi", eventHandler = jasmine.createSpy("eventHandler"));
      });
      it("should report the event as not empty", () => {
        expect(eventMap.getIsEmpty(eventName)).toBe(false);
      });
      it("should expose the event key", () => {
        expect({
          keys: eventMap.getKeys(),
          hasKey: eventMap.hasKey(eventName)
        }).toEqual({
          keys: [eventName],
          hasKey: true
        });
      });
      describe("and the event is cleared", () => {
        beforeEach(() => {
          eventMap.clear(eventName);
        });
        it("should report the event as empty", () => {
          expect(eventMap.getIsEmpty(eventName)).toBe(true);
        });
        it("should remove the event key", () => {
          expect(eventMap.hasKey(eventName)).toEqual(false);
        });
      });
      describe("and the event fires", () => {
        let eventData;
        beforeEach(() => {
          eventMap.fire(eventName, eventData = {});
        });
        it("should notify the handler", () => {
          expect(eventHandler).toHaveBeenCalledWith(eventData, eventMap);
        });
      });
      describe("and the an unrelated event fires", () => {
        let eventData;
        beforeEach(() => {
          eventMap.fire("blah", eventData = {});
        });
        it("should not notify the handler", () => {
          expect(eventHandler).not.toHaveBeenCalled();
        });
      });
      describe("and the handler is unregistered", () => {
        beforeEach(() => {
          eventMap.unregister(eventName, eventHandler);
        });
        it("should report the event as empty", () => {
          expect(eventMap.getIsEmpty(eventName)).toBe(true);
        });
      });
      describe("and the handler is unregistered (using the wrong event name)", () => {
        beforeEach(() => {
          eventMap.unregister("blah", eventHandler);
        });
        it("should not report the event as empty", () => {
          expect(eventMap.getIsEmpty(eventName)).toBe(false);
        });
      });
      describe("and the handler is unregistered (using the wrong handler)", () => {
        beforeEach(() => {
          eventMap.unregister(eventName, () => {
          });
        });
        it("should not report the event as empty", () => {
          expect(eventMap.getIsEmpty(eventName)).toBe(false);
        });
      });
      describe("and another handler is registered", () => {
        let eventHandlerTwo;
        beforeEach(() => {
          eventMap.register(eventName, eventHandlerTwo = jasmine.createSpy("eventHandlerTwo"));
        });
        it("should report the event as not empty", () => {
          expect(eventMap.getIsEmpty(eventName)).toBe(false);
        });
        describe("and the event fires", () => {
          let eventData;
          beforeEach(() => {
            eventMap.fire(eventName, eventData = {});
          });
          it("should notify the first handler", () => {
            expect(eventHandler).toHaveBeenCalledWith(eventData, eventMap);
          });
          it("should notify the second handler", () => {
            expect(eventHandlerTwo).toHaveBeenCalledWith(eventData, eventMap);
          });
        });
        describe("and the an unrelated event fires", () => {
          let eventData;
          beforeEach(() => {
            eventMap.fire("blah", eventData = {});
          });
          it("should not notify the first handler", () => {
            expect(eventHandler).not.toHaveBeenCalled();
          });
          it("should not notify the second handler", () => {
            expect(eventHandlerTwo).not.toHaveBeenCalled();
          });
        });
        describe("and the handler is unregistered", () => {
          beforeEach(() => {
            eventMap.unregister(eventName, eventHandler);
          });
          it("should report the event as empty", () => {
            expect(eventMap.getIsEmpty(eventName)).toBe(false);
          });
          describe("and the event fires", () => {
            let eventData;
            beforeEach(() => {
              eventMap.fire(eventName, eventData = {});
            });
            it("should not notify the first handler", () => {
              expect(eventHandler).not.toHaveBeenCalledWith(eventData, eventMap);
            });
            it("should notify the second handler", () => {
              expect(eventHandlerTwo).toHaveBeenCalledWith(eventData, eventMap);
            });
          });
          describe("and the second handler is unregistered", () => {
            beforeEach(() => {
              eventMap.unregister(eventName, eventHandlerTwo);
            });
            it("should report the event as empty", () => {
              expect(eventMap.getIsEmpty(eventName)).toBe(true);
            });
            describe("and the event fires", () => {
              let eventData;
              beforeEach(() => {
                eventMap.fire(eventName, eventData = {});
              });
              it("should not notify the first handler", () => {
                expect(eventHandler).not.toHaveBeenCalledWith(eventData, eventMap);
              });
              it("should not notify the second handler", () => {
                expect(eventHandlerTwo).not.toHaveBeenCalledWith(eventData, eventMap);
              });
            });
          });
        });
      });
    });
  });

  // test/specs/messaging/EventSpec.js
  describe("When an Event is constructed", () => {
    "use strict";
    let event;
    let context;
    beforeEach(() => {
      event = new Event(context = {});
    });
    it("should report a new event as empty", () => {
      expect(event.getIsEmpty()).toEqual(true);
    });
    describe("and an event handler is registered", () => {
      let spyOne;
      let bindingOne;
      beforeEach(() => {
        bindingOne = event.register(spyOne = jasmine.createSpy("spyOne"));
      });
      it("should return a Disposable instance", () => {
        expect(bindingOne instanceof Disposable).toEqual(true);
      });
      it("should report the event as not empty", () => {
        expect(event.getIsEmpty()).toEqual(false);
      });
      describe("and the event handler is unregistered", () => {
        beforeEach(() => {
          event.unregister(spyOne);
        });
        it("should report the event as empty", () => {
          expect(event.getIsEmpty()).toEqual(true);
        });
        describe("and the event fires", () => {
          beforeEach(() => {
            event.fire("payload");
          });
          it("should not notify the observer", () => {
            expect(spyOne).not.toHaveBeenCalled();
          });
        });
      });
      describe("and the event is cleared", () => {
        beforeEach(() => {
          event.clear();
        });
        it("should report the event as empty", () => {
          expect(event.getIsEmpty()).toEqual(true);
        });
      });
      describe("and the event fires", () => {
        let data;
        beforeEach(() => {
          event.fire(data = {});
        });
        it("should notify the observer", () => {
          expect(spyOne).toHaveBeenCalledWith(context, data);
        });
        it("should pass the event data before the sender", () => {
          event.fire("payload");
          expect(spyOne).toHaveBeenCalledWith("payload", context);
        });
      });
      describe("and another event handler is registered", () => {
        let spyTwo;
        let bindingTwo;
        beforeEach(() => {
          bindingTwo = event.register(spyTwo = jasmine.createSpy("spyTwo"));
        });
        it("should return a Disposable instance", () => {
          expect(bindingTwo instanceof Disposable).toEqual(true);
        });
        describe("and the event fires", () => {
          let data;
          beforeEach(() => {
            event.fire(data = {});
          });
          it("should notify both observers", () => {
            expect({
              spyOne: spyOne.calls.allArgs(),
              spyTwo: spyTwo.calls.allArgs()
            }).toEqual({
              spyOne: [[context, data]],
              spyTwo: [[context, data]]
            });
          });
        });
        describe("and the first observer is disposed ", () => {
          beforeEach(() => {
            bindingOne.dispose();
          });
          describe("and the event fires", () => {
            let data;
            beforeEach(() => {
              event.fire(data = {});
            });
            it("should not notify the first observer", () => {
              expect(spyOne).not.toHaveBeenCalledWith(context, data);
            });
            it("should notify the second observer", () => {
              expect(spyTwo).toHaveBeenCalledWith(context, data);
            });
          });
        });
      });
    });
    describe("and multiple observers are added which dispose themselves", () => {
      let spyOne;
      let spyTwo;
      let bindingOne;
      let bindingTwo;
      beforeEach(() => {
        bindingOne = event.register(spyOne = jasmine.createSpy("spyOne").and.callFake(() => {
          bindingOne.dispose();
        }));
        bindingTwo = event.register(spyTwo = jasmine.createSpy("spyTwo").and.callFake(() => {
          bindingTwo.dispose();
        }));
      });
      describe("and the event fires", () => {
        let data;
        beforeEach(() => {
          event.fire(data = {});
        });
        it("should notify the first observer", () => {
          expect(spyOne).toHaveBeenCalledWith(context, data);
        });
        it("should notify the second observer", () => {
          expect(spyTwo).toHaveBeenCalledWith(context, data);
        });
        describe("and the event fires again", () => {
          let data2;
          beforeEach(() => {
            spyOne.calls.reset();
            spyTwo.calls.reset();
            event.fire(data2 = {});
          });
          it("should not notify the first observer", () => {
            expect(spyOne).not.toHaveBeenCalledWith(context, data2);
          });
          it("should not notify the second observer", () => {
            expect(spyTwo).not.toHaveBeenCalledWith(context, data2);
          });
        });
      });
    });
    describe("and two observers are added which dispose each other", () => {
      let spyOne;
      let spyTwo;
      let bindingOne;
      let bindingTwo;
      beforeEach(() => {
        bindingOne = event.register(spyOne = jasmine.createSpy("spyOne").and.callFake(() => {
          bindingTwo.dispose();
        }));
        bindingTwo = event.register(spyTwo = jasmine.createSpy("spyTwo").and.callFake(() => {
          bindingOne.dispose();
        }));
      });
      describe("and the event fires", () => {
        let data;
        beforeEach(() => {
          event.fire(data = {});
        });
        it("should notify the first observer", () => {
          expect(spyOne).toHaveBeenCalledWith(context, data);
        });
        it("should notify the second observer", () => {
          expect(spyTwo).toHaveBeenCalledWith(context, data);
        });
        describe("and the event fires again", () => {
          let data2;
          beforeEach(() => {
            spyOne.calls.reset();
            spyTwo.calls.reset();
            event.fire(data2 = {});
          });
          it("should not notify the first observer", () => {
            expect(spyOne).not.toHaveBeenCalledWith(context, data2);
          });
          it("should not notify the second observer", () => {
            expect(spyTwo).not.toHaveBeenCalledWith(context, data2);
          });
        });
      });
    });
  });

  // models/Model.js
  var Model = class extends Disposable {
    #propertyNames;
    #transactionCommit;
    #transactionOpen;
    #transactionData;
    #trackerOpen;
    #trackerData;
    #sequence;
    /**
     * @param {string[]} propertyNames
     * @param {object=} propertyObservers
     * @param {object=} equalityPredicates
     */
    constructor(propertyNames, propertyObservers, equalityPredicates) {
      super();
      this.#propertyNames = propertyNames;
      this.#transactionCommit = new Event(this);
      this.#transactionOpen = false;
      this.#transactionData = null;
      this.#trackerOpen = false;
      this.#trackerData = null;
      this.#sequence = 0;
      const observers = propertyObservers || {};
      const predicates2 = equalityPredicates || {};
      for (let i = 0; i < this.#propertyNames.length; i++) {
        const propertyName = propertyNames[i];
        this.#createProperty(propertyName, observers[propertyName] || emptyFunction, predicates2[propertyName] || checkEquals);
      }
    }
    /**
     * @public
     */
    beginTransaction() {
      if (this.#transactionOpen) {
        return;
      }
      this.#transactionOpen = true;
    }
    /**
     * @public
     */
    endTransaction() {
      if (!this.#transactionOpen) {
        return;
      }
      if (this.disposed) {
        return;
      }
      this.#transactionOpen = false;
      if (this.#transactionData !== null) {
        this._formatTransactionData(this.#transactionData);
        this.#transactionData.sequence = this.#sequence++;
        if (this.#trackerOpen) {
          this.#trackerData = this.#trackerData || {};
          for (let propertyName in this.#transactionData) {
            this.#trackerData[propertyName] = this.#transactionData[propertyName];
          }
        }
        this.#transactionCommit.fire(this.#transactionData);
        this.#transactionData = null;
      }
    }
    /**
     * @protected
     * @param {object} transactionData
     */
    _formatTransactionData(transactionData) {
      return;
    }
    /**
     * @public
     * @param {Function} processor
     */
    executeTransaction(processor) {
      argumentIsRequired(processor, "processor", Function);
      this.beginTransaction();
      processor(this);
      this.endTransaction();
    }
    /**
     * @public
     * @param {Function} observer
     * @returns {*}
     */
    onTransactionCommitted(observer) {
      if (this.disposed) {
        return;
      }
      return this.#transactionCommit.register(observer);
    }
    /**
     * @public
     */
    startTracker() {
      if (this.#trackerOpen) {
        return;
      }
      this.#trackerOpen = true;
    }
    /**
     * @public
     * @returns {object|null}
     */
    resetTracker() {
      if (!this.#trackerOpen) {
        return null;
      }
      if (this.disposed) {
        return null;
      }
      const returnRef = this.#trackerData;
      this.#trackerData = null;
      return returnRef;
    }
    /**
     * @public
     */
    stopTracking() {
      if (!this.#trackerOpen) {
        return;
      }
      if (this.disposed) {
        return;
      }
      this.#trackerOpen = false;
      this.#trackerData = null;
    }
    /**
     * @public
     * @returns {object}
     */
    getSnapshot() {
      const snapshot = {};
      for (let i = 0; i < this.#propertyNames.length; i++) {
        const propertyName = this.#propertyNames[i];
        snapshot[propertyName] = this[propertyName];
      }
      snapshot.sequence = this.#sequence;
      return snapshot;
    }
    /**
     * @protected
     * @override
     */
    _onDispose() {
      this.#transactionCommit.dispose();
      this.#transactionCommit = null;
    }
    #createProperty(propertyName, propertyObserver, equalityPredicate) {
      let propertyValue = null;
      Object.defineProperty(this, propertyName, {
        get: () => {
          return propertyValue;
        },
        set: (value) => {
          const valueToAssign = undef(value) ? null : value;
          if (equalityPredicate(propertyValue, valueToAssign)) {
            return;
          }
          propertyValue = valueToAssign;
          const implicit = !this.#transactionOpen;
          if (implicit) {
            this.beginTransaction();
          }
          this.#transactionData = this.#transactionData || {};
          this.#transactionData[propertyName] = propertyValue;
          propertyObserver(this);
          if (implicit) {
            this.endTransaction();
          }
        }
      });
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Model]";
    }
  };
  function emptyFunction() {
    return;
  }
  function checkEquals(a, b) {
    return a === b;
  }

  // test/specs/models/ModelSpec.js
  describe('When an Model is constructed with "firstName" and "lastName" properties', () => {
    "use strict";
    let model;
    beforeEach(() => {
      model = new Model(["firstName", "lastName"]);
    });
    it("should return a snapshot of the current model state", () => {
      model.firstName = "Bryan";
      model.lastName = "Ingle";
      expect(model.getSnapshot()).toEqual({
        firstName: "Bryan",
        lastName: "Ingle",
        sequence: 2
      });
    });
    describe("and a transaction observer is registered", () => {
      let spy;
      let binding;
      beforeEach(() => {
        binding = model.onTransactionCommitted(spy = jasmine.createSpy("spy"));
      });
      describe("and a manual transaction is completed", () => {
        beforeEach(() => {
          model.beginTransaction();
          model.firstName = "Bryan";
          model.lastName = "Ingle";
          model.endTransaction();
        });
        it("should commit one transaction", () => {
          expect(spy.calls.count()).toEqual(1);
        });
        it("should include both updates in the transaction", () => {
          expect(spy.calls.argsFor(0)[0]).toEqual({
            firstName: "Bryan",
            lastName: "Ingle",
            sequence: 0
          });
        });
      });
      describe("and tracking is used around a transaction", () => {
        let trackedData;
        beforeEach(() => {
          model.startTracker();
          model.executeTransaction((m) => {
            m.firstName = "Bryan";
            m.lastName = "Ingle";
          });
          trackedData = model.resetTracker();
          model.stopTracking();
        });
        it("should return tracked transaction data", () => {
          expect(trackedData).toEqual({
            firstName: "Bryan",
            lastName: "Ingle",
            sequence: 0
          });
        });
        it("should clear tracking when tracking is stopped", () => {
          model.firstName = "Luka";
          expect(model.resetTracker()).toEqual(null);
        });
      });
      it("should return a Disposable instance", () => {
        expect(binding instanceof Disposable).toEqual(true);
      });
      it("should return null values for each property", () => {
        expect({
          firstName: model.firstName,
          lastName: model.lastName
        }).toEqual({
          firstName: null,
          lastName: null
        });
      });
      describe("and both properties are updated", () => {
        let data;
        beforeEach(() => {
          model.firstName = "Bryan";
          model.lastName = "Ingle";
        });
        it("two transactions should occur", () => {
          expect(spy.calls.count()).toEqual(2);
        });
        it('the first transaction should have updated the "first name" property', () => {
          let argsOne = spy.calls.argsFor(0);
          expect({
            firstName: argsOne[0].firstName,
            sequence: argsOne[0].sequence,
            model: argsOne[1]
          }).toEqual({
            firstName: "Bryan",
            sequence: 0,
            model
          });
        });
        it('the second transaction should have updated the "last name" property', () => {
          let argsOne = spy.calls.argsFor(1);
          expect({
            lastName: argsOne[0].lastName,
            sequence: argsOne[0].sequence,
            model: argsOne[1]
          }).toEqual({
            lastName: "Ingle",
            sequence: 1,
            model
          });
        });
      });
      describe("and both properties are updated with an explicit transaction", () => {
        let data;
        beforeEach(() => {
          model.executeTransaction((m) => {
            m.firstName = "Bryan";
            m.lastName = "Ingle";
          });
        });
        it("one transaction should occur", () => {
          expect(spy.calls.count()).toEqual(1);
        });
        it('the first transaction should have updated the "first name" property', () => {
          let argsOne = spy.calls.argsFor(0);
          expect({
            firstName: argsOne[0].firstName,
            lastName: argsOne[0].lastName,
            sequence: argsOne[0].sequence,
            model: argsOne[1]
          }).toEqual({
            firstName: "Bryan",
            lastName: "Ingle",
            sequence: 0,
            model
          });
        });
      });
      describe("and both properties are to undefined values", () => {
        let data;
        beforeEach(() => {
          model.firstName = void 0;
          model.lastName = void 0;
        });
        it("no transactions should occur", () => {
          expect(spy.calls.count()).toEqual(0);
        });
        it("the properties should return null values", () => {
          expect({
            firstName: model.firstName,
            lastName: model.lastName
          }).toEqual({
            firstName: null,
            lastName: null
          });
        });
        describe("and both are updated to non-null values", () => {
          beforeEach(() => {
            model.firstName = 0;
            model.lastName = "";
          });
          it("two transactions should occur", () => {
            expect(spy.calls.count()).toEqual(2);
          });
          it('the first transaction should have updated the "first name" property to zero', () => {
            let argsOne = spy.calls.argsFor(0);
            expect({
              firstName: argsOne[0].firstName,
              sequence: argsOne[0].sequence,
              model: argsOne[1]
            }).toEqual({
              firstName: 0,
              sequence: 0,
              model
            });
          });
          it('the second transaction should have updated the "last name" property to a zero-length string', () => {
            let argsOne = spy.calls.argsFor(1);
            expect({
              lastName: argsOne[0].lastName,
              sequence: argsOne[0].sequence,
              model: argsOne[1]
            }).toEqual({
              lastName: "",
              sequence: 1,
              model
            });
          });
        });
      });
    });
  });

  // serialization/json/Component.js
  var Component = class _Component {
    #name;
    #fields;
    #reviver;
    /**
     * @param {string} name
     * @param {Array<Field>=} fields
     * @param {Function=} reviver
     */
    constructor(name, fields, reviver) {
      this.#name = name;
      this.#fields = fields || [];
      this.#reviver = reviver;
    }
    /**
     * Name of the component.
     *
     * @public
     * @returns {string}
     */
    get name() {
      return this.#name;
    }
    /**
     * Type of the component.
     *
     * @public
     * @returns {Array<Field>}
     */
    get fields() {
      return this.#fields;
    }
    /**
     * The reviver used to rebuild the entire component.
     *
     * @returns {Function}
     */
    get reviver() {
      return this.#reviver;
    }
    /**
     * The builds a {@link Component} for {@link Money}.
     *
     * @public
     * @static
     * @param {string} name
     * @returns {Component}
     */
    static forMoney(name) {
      return new _Component(name, [new Field("decimal", DataType.DECIMAL), new Field("currency", DataType.forEnum(Currency, "Currency"))], (x) => Money.parse(x));
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[Component (name=${this.#name})]`;
    }
  };

  // test/specs/serialization/json/ComponentSpec.js
  describe("When a Component is constructed", () => {
    "use strict";
    let fields;
    let reviver;
    let component;
    beforeEach(() => {
      fields = [new Field("name", DataType.STRING)];
      reviver = (value) => value;
      component = new Component("person", fields, reviver);
    });
    it("should expose constructor values", () => {
      expect({
        name: component.name,
        fields: component.fields,
        reviver: component.reviver
      }).toEqual({
        name: "person",
        fields,
        reviver
      });
    });
    it("should create a money component", () => {
      const moneyComponent = Component.forMoney("amount");
      const money = moneyComponent.reviver({
        decimal: new Decimal("12.34"),
        currency: Currency.USD
      });
      expect({
        name: moneyComponent.name,
        fields: moneyComponent.fields.length,
        money: money instanceof Money,
        currency: money.currency
      }).toEqual({
        name: "amount",
        fields: 2,
        money: true,
        currency: Currency.USD
      });
    });
  });

  // test/specs/serialization/json/DataTypeSpec.js
  var Letter = class extends Enum {
    constructor(code) {
      super(code, code);
    }
    static get A() {
      return letterA;
    }
  };
  var letterA = new Letter("A");
  describe("When DataType is constructed", () => {
    "use strict";
    describe("with custom delegates", () => {
      let dataType;
      beforeEach(() => {
        const reviver = (value) => `revived:${value}`;
        const validator = (value) => value === "ok";
        const builder = (value) => `built:${value}`;
        dataType = new DataType("Custom", null, reviver, validator, builder);
      });
      it("should have the correct description", () => {
        expect(dataType.description).toEqual("Custom");
      });
      it("should have null enumeration type", () => {
        expect(dataType.enumerationType).toBeNull();
      });
      it("should use the provided reviver", () => {
        expect(dataType.reviver("x")).toEqual("revived:x");
      });
      it("should use the provided validator", () => {
        expect(dataType.validator("ok")).toEqual(true);
      });
      it("should use the provided builder", () => {
        expect(dataType.convert("x")).toEqual("built:x");
      });
    });
    describe("with enum data types", () => {
      let dataType;
      beforeEach(() => {
        dataType = DataType.forEnum(Letter, "Letter");
      });
      it("should have the correct description", () => {
        expect(dataType.description).toEqual("Letter");
      });
      it("should have the correct enumeration type", () => {
        expect(dataType.enumerationType).toBe(Letter);
      });
      it("should revive enum values correctly", () => {
        expect(dataType.reviver("A")).toBe(Letter.A);
      });
      it("should validate enum instances", () => {
        expect(dataType.validator(Letter.A)).toEqual(true);
      });
      it("should not validate string codes", () => {
        expect(dataType.validator("A")).toEqual(false);
      });
      it("should convert string codes to enum instances", () => {
        expect(dataType.convert("A")).toBe(Letter.A);
      });
    });
    it("should validate enum data type arguments", () => {
      expect(() => DataType.forEnum(class NotEnum {
      }, "Bad")).toThrow();
    });
    describe("with primitive data types", () => {
      it("should validate STRING type", () => {
        expect(DataType.STRING.validator("value")).toEqual(true);
      });
      it("should validate NUMBER type", () => {
        expect(DataType.NUMBER.validator(1)).toEqual(true);
      });
      it("should validate BOOLEAN type", () => {
        expect(DataType.BOOLEAN.validator(false)).toEqual(true);
      });
      it("should validate OBJECT type", () => {
        expect(DataType.OBJECT.validator({})).toEqual(true);
      });
      it("should validate ARRAY type", () => {
        expect(DataType.ARRAY.validator([])).toEqual(true);
      });
    });
    describe("with object data types", () => {
      it("should convert DECIMAL values", () => {
        expect(DataType.DECIMAL.convert("1.23") instanceof Decimal).toEqual(true);
      });
      it("should revive DECIMAL values", () => {
        expect(DataType.DECIMAL.reviver("1.23") instanceof Decimal).toEqual(true);
      });
      it("should convert DAY values", () => {
        expect(DataType.DAY.convert("2026-06-17") instanceof Day).toEqual(true);
      });
      it("should revive DAY values", () => {
        expect(DataType.DAY.reviver("2026-06-17") instanceof Day).toEqual(true);
      });
      it("should convert TIMESTAMP values", () => {
        expect(DataType.TIMESTAMP.convert(17816544e5) instanceof Timestamp).toEqual(true);
      });
      it("should revive TIMESTAMP values", () => {
        expect(DataType.TIMESTAMP.reviver(17816544e5) instanceof Timestamp).toEqual(true);
      });
      it("should convert AD_HOC values", () => {
        expect(DataType.AD_HOC.convert({ value: 1 }) instanceof AdHoc).toEqual(true);
      });
      it("should revive AD_HOC values", () => {
        expect(DataType.AD_HOC.reviver('{"value":1}') instanceof AdHoc).toEqual(true);
      });
    });
    it("should leave unbuildable values unchanged", () => {
      const value = /* @__PURE__ */ Symbol("value");
      expect(DataType.DECIMAL.convert(value)).toBe(value);
    });
  });

  // test/specs/serialization/json/FieldSpec.js
  describe("When a Field is constructed", () => {
    "use strict";
    let field;
    beforeEach(() => {
      field = new Field("name", DataType.STRING, true, true);
    });
    it("should expose constructor values", () => {
      expect({
        name: field.name,
        dataType: field.dataType,
        optional: field.optional,
        array: field.array
      }).toEqual({
        name: "name",
        dataType: DataType.STRING,
        optional: true,
        array: true
      });
    });
    it("should default boolean flags to false", () => {
      const defaulted = new Field("name", DataType.STRING);
      expect({
        optional: defaulted.optional,
        array: defaulted.array
      }).toEqual({
        optional: false,
        array: false
      });
    });
    it("should validate constructor arguments", () => {
      expect([() => new Field(null, DataType.STRING), () => new Field("name", null)].map(throws4)).toEqual([true, true]);
    });
  });
  function throws4(action) {
    try {
      action();
      return false;
    } catch {
      return true;
    }
  }

  // test/specs/serialization/json/SchemaSpec.js
  var Letter2 = class extends Enum {
    constructor(name) {
      super(name, name);
    }
  };
  var LETTER_A = new Letter2("A");
  var LETTER_B = new Letter2("B");
  describe("When a person schema is created (first and last names)", () => {
    "use strict";
    let schema;
    beforeEach(() => {
      schema = new Schema("person", [
        new Field("first", DataType.STRING),
        new Field("last", DataType.STRING)
      ]);
    });
    describe("and a schema-compliant object is created", () => {
      let object2;
      beforeEach(() => {
        object2 = {
          first: "bryan",
          last: "ingle"
        };
      });
      describe('and the object is "stringified" as JSON', () => {
        let serialized;
        beforeEach(() => {
          serialized = JSON.stringify(object2);
        });
        describe("and the object is rehydrated using the schema reviver", () => {
          let deserialized;
          beforeEach(() => {
            deserialized = JSON.parse(serialized, schema.getReviver());
          });
          it('should have a "first" property with the expected value', () => {
            expect(deserialized.first).toEqual("bryan");
          });
          it('should have a "last" property with the expected value', () => {
            expect(deserialized.last).toEqual("ingle");
          });
        });
      });
      describe("and the object is validated", () => {
        it("the object should be valid", () => {
          expect(schema.validate(object2)).toEqual(true);
        });
        it("no invalid fields should be reported by the schema", () => {
          expect(schema.getInvalidFields(object2).length).toEqual(0);
        });
      });
      describe("and various invalid objects are validated", () => {
        it("a null object should be invalid", () => {
          expect(schema.validate(null)).toEqual(false);
        });
        it("a undefined object should be invalid", () => {
          expect(schema.validate()).toEqual(false);
        });
        it("an empty object should be invalid", () => {
          expect(schema.validate({})).toEqual(false);
        });
        it("an object with only a first name should be invalid", () => {
          expect(schema.validate({ first: "bryan" })).toEqual(false);
        });
        it("an object with only a last name should be invalid", () => {
          expect(schema.validate({ last: "ingle" })).toEqual(false);
        });
        it("an object with with invalid first and last names should be invalid", () => {
          expect(schema.validate({ first: 1, last: {} })).toEqual(false);
        });
      });
      describe("and various objects are checked for invalid fields", () => {
        it("a null object should have two invalid fields", () => {
          expect(schema.getInvalidFields(null).length).toEqual(2);
        });
        it("a undefined object should have two invalid fields", () => {
          expect(schema.getInvalidFields().length).toEqual(2);
        });
        it("an empty object should have two invalid fields", () => {
          expect(schema.getInvalidFields({}).length).toEqual(2);
        });
        it("an object with only a first name should have one invalid fields", () => {
          expect(schema.getInvalidFields({ first: "bryan" }).length).toEqual(1);
        });
        it("an object with only a last name should have one invalid fields", () => {
          expect(schema.getInvalidFields({ last: "ingle" }).length).toEqual(1);
        });
        it("an object with with invalid first and last names should have two invalid fields", () => {
          expect(schema.getInvalidFields({ first: 1, last: {} }).length).toEqual(2);
        });
      });
    });
    describe("and a schema-compliant array is created", () => {
      let object2;
      beforeEach(() => {
        object2 = [{
          first: "bryan",
          last: "ingle"
        }, {
          first: "borja",
          last: "yanes"
        }];
      });
      describe('and the object is "stringified" as JSON', () => {
        let serialized;
        beforeEach(() => {
          serialized = JSON.stringify(object2);
        });
        describe("and the object is rehydrated using the schema reviver", () => {
          let deserialized;
          beforeEach(() => {
            try {
              deserialized = JSON.parse(serialized, schema.getReviver());
            } catch (e) {
              console.log(e);
            }
          });
          it("should be an array with two items", () => {
            expect(deserialized.length).toEqual(2);
          });
          it('the first item should have a "first" property with the expected value', () => {
            expect(deserialized[0].first).toEqual("bryan");
          });
          it('the first item should have a "last" property with the expected value', () => {
            expect(deserialized[0].last).toEqual("ingle");
          });
          it('the second item should have a "first" property with the expected value', () => {
            expect(deserialized[1].first).toEqual("borja");
          });
          it('the second item should have a "last" property with the expected value', () => {
            expect(deserialized[1].last).toEqual("yanes");
          });
        });
      });
    });
  });
  describe("When a person schema is created (first and last names, with optional middle name)", () => {
    "use strict";
    let schema;
    beforeEach(() => {
      schema = new Schema("person", [
        new Field("first", DataType.STRING),
        new Field("middle", DataType.STRING, true),
        new Field("last", DataType.STRING)
      ]);
    });
    describe("and a schema-compliant object is created (with middle name)", () => {
      let object2;
      beforeEach(() => {
        object2 = {
          first: "bryan",
          middle: "ray",
          last: "ingle"
        };
      });
      describe('and the object is "stringified" as JSON', () => {
        let serialized;
        beforeEach(() => {
          serialized = JSON.stringify(object2);
        });
        describe("and the object is rehydrated using the schema reviver", () => {
          let deserialized;
          beforeEach(() => {
            deserialized = JSON.parse(serialized, schema.getReviver());
          });
          it('should have a "first" property with the expected value', () => {
            expect(deserialized.first).toEqual("bryan");
          });
          it('should have a "middle" property with the expected value', () => {
            expect(deserialized.middle).toEqual("ray");
          });
          it('should have a "last" property with the expected value', () => {
            expect(deserialized.last).toEqual("ingle");
          });
        });
      });
      describe("and the object is validated", () => {
        it("the object should be valid", () => {
          expect(schema.validate(object2)).toEqual(true);
        });
        it("no invalid fields should be reported by the schema", () => {
          expect(schema.getInvalidFields(object2).length).toEqual(0);
        });
      });
      describe("and various invalid objects are validated", () => {
        it("a null object should be invalid", () => {
          expect(schema.validate(null)).toEqual(false);
        });
        it("a undefined object should be invalid", () => {
          expect(schema.validate()).toEqual(false);
        });
        it("an empty object should be invalid", () => {
          expect(schema.validate({})).toEqual(false);
        });
        it("an object with only a first name should be invalid", () => {
          expect(schema.validate({ first: "bryan" })).toEqual(false);
        });
        it("an object with only a last name should be invalid", () => {
          expect(schema.validate({ last: "ingle" })).toEqual(false);
        });
        it("an object with with invalid first and last names should be invalid", () => {
          expect(schema.validate({ first: 1, last: {} })).toEqual(false);
        });
        it("an object with with invalid middle should be invalid", () => {
          expect(schema.validate({ first: "bryan", middle: null, last: "ingle" })).toEqual(false);
        });
      });
      describe("and various are checked for invalid fields", () => {
        it("a null object should have two invalid fields", () => {
          expect(schema.getInvalidFields(null).length).toEqual(2);
        });
        it("a undefined object should have two invalid fields", () => {
          expect(schema.getInvalidFields().length).toEqual(2);
        });
        it("an empty object should have two invalid fields", () => {
          expect(schema.getInvalidFields({}).length).toEqual(2);
        });
        it("an object with only a first name should have one invalid fields", () => {
          expect(schema.getInvalidFields({ first: "bryan" }).length).toEqual(1);
        });
        it("an object with only a last name should have one invalid fields", () => {
          expect(schema.getInvalidFields({ last: "ingle" }).length).toEqual(1);
        });
        it("an object with with invalid first and last names should have two invalid fields", () => {
          expect(schema.getInvalidFields({ first: 1, last: {} }).length).toEqual(2);
        });
      });
    });
    describe("and a schema-compliant object is created (without middle name)", () => {
      let object2;
      beforeEach(() => {
        object2 = {
          first: "bryan",
          last: "ingle"
        };
      });
      describe('and the object is "stringified" as JSON', () => {
        let serialized;
        beforeEach(() => {
          serialized = JSON.stringify(object2);
        });
        describe("and the object is rehydrated using the schema reviver", () => {
          let deserialized;
          beforeEach(() => {
            deserialized = JSON.parse(serialized, schema.getReviver());
          });
          it('should have a "first" property with the expected value', () => {
            expect(deserialized.first).toEqual("bryan");
          });
          it('should not have a "middle" property', () => {
            expect(deserialized.hasOwnProperty("middle")).toEqual(false);
          });
          it('should have a "last" property with the expected value', () => {
            expect(deserialized.last).toEqual("ingle");
          });
        });
      });
      describe("and the object is validated", () => {
        it("the object should be valid", () => {
          expect(schema.validate(object2)).toEqual(true);
        });
        it("no invalid fields should be reported by the schema", () => {
          expect(schema.getInvalidFields(object2).length).toEqual(0);
        });
      });
    });
  });
  describe("When a person schema is created (grouped first and last names with a birthday)", () => {
    "use strict";
    let schema;
    beforeEach(() => {
      schema = new Schema("person", [
        new Field("name.first", DataType.STRING),
        new Field("name.last", DataType.STRING),
        new Field("birthday", DataType.DAY)
      ]);
    });
    describe("and a schema-compliant object is created", () => {
      let object2;
      beforeEach(() => {
        object2 = {
          name: {
            first: "bryan",
            last: "ingle"
          },
          birthday: new Day(1974, 10, 20)
        };
      });
      describe('and the object is "stringified" as JSON', () => {
        let serialized;
        beforeEach(() => {
          serialized = JSON.stringify(object2);
        });
        describe("and the object is rehydrated using the schema reviver", () => {
          let deserialized;
          beforeEach(() => {
            try {
              deserialized = JSON.parse(serialized, schema.getReviver());
            } catch (e) {
              console.log(e);
            }
          });
          it('should have a "name.first" property with the expected value', () => {
            expect(deserialized.name.first).toEqual("bryan");
          });
          it('should have a "name.last" property with the expected value', () => {
            expect(deserialized.name.last).toEqual("ingle");
          });
          it('should have a "birthday" property with the expected value', () => {
            expect({
              year: deserialized.birthday.year,
              month: deserialized.birthday.month,
              day: deserialized.birthday.day
            }).toEqual({
              year: 1974,
              month: 10,
              day: 20
            });
          });
        });
      });
    });
  });
  describe("When an account schema is created (using the AdHoc field)", () => {
    "use strict";
    let schema;
    beforeEach(() => {
      schema = new Schema("account", [
        new Field("number", DataType.NUMBER),
        new Field("junk", DataType.AD_HOC)
      ]);
    });
    describe("and a schema-compliant object is created", () => {
      let object2;
      beforeEach(() => {
        object2 = {
          number: 123456789,
          junk: new AdHoc({
            address: "209 W. Jackson",
            city: "Chicago",
            zip: "60603"
          })
        };
      });
      describe('and the object is "stringified" as JSON', () => {
        let serialized;
        beforeEach(() => {
          serialized = JSON.stringify(object2);
        });
        describe("and the object is rehydrated using the schema reviver", () => {
          let deserialized;
          beforeEach(() => {
            try {
              deserialized = JSON.parse(serialized, schema.getReviver());
            } catch (e) {
              console.log(e);
            }
          });
          it('should have a "number" property with the expected value', () => {
            expect(deserialized.number).toEqual(123456789);
          });
          it('should have a "junk" property with the expected value', () => {
            expect({
              address: deserialized.junk.data.address,
              city: deserialized.junk.data.city,
              zip: deserialized.junk.data.zip
            }).toEqual({
              address: "209 W. Jackson",
              city: "Chicago",
              zip: "60603"
            });
          });
        });
      });
    });
  });
  describe("When an account schema is created (using the Money component)", () => {
    "use strict";
    let schema;
    beforeEach(() => {
      schema = new Schema("account", [
        new Field("number", DataType.NUMBER)
      ], [
        Component.forMoney("balance")
      ]);
    });
    describe("and a schema-compliant object is created", () => {
      let object2;
      beforeEach(() => {
        object2 = {
          number: 123456789,
          balance: new Money(314.15, Currency.USD)
        };
      });
      describe('and the object is "stringified" as JSON', () => {
        let serialized;
        beforeEach(() => {
          serialized = JSON.stringify(object2);
        });
        describe("and the object is rehydrated using the schema reviver", () => {
          let deserialized;
          beforeEach(() => {
            try {
              deserialized = JSON.parse(serialized, schema.getReviver());
            } catch (e) {
              console.log(e);
            }
          });
          it('should have a "number" property with the expected value', () => {
            expect(deserialized.number).toEqual(123456789);
          });
          it('should have a "balance" property with the expected value', () => {
            expect({
              currency: deserialized.balance.currency,
              decimal: deserialized.balance.decimal.getIsEqual(314.15)
            }).toEqual({
              currency: Currency.USD,
              decimal: true
            });
          });
        });
      });
    });
  });
  describe("When an account schema is created (using the Money component with nesting)", () => {
    "use strict";
    let schema;
    beforeEach(() => {
      schema = new Schema("account", [
        new Field("number", DataType.NUMBER)
      ], [
        Component.forMoney("balances.yesterday"),
        Component.forMoney("balances.today")
      ]);
    });
    describe("and a schema-compliant object is created", () => {
      let object2;
      beforeEach(() => {
        object2 = {
          number: 987654321,
          balances: {
            yesterday: new Money(314.15, Currency.USD),
            today: new Money(271.83, Currency.USD)
          }
        };
      });
      describe('and the object is "stringified" as JSON', () => {
        let serialized;
        beforeEach(() => {
          serialized = JSON.stringify(object2);
        });
        describe("and the object is rehydrated using the schema reviver", () => {
          let deserialized;
          beforeEach(() => {
            try {
              deserialized = JSON.parse(serialized, schema.getReviver());
            } catch (e) {
              console.log(e);
            }
          });
          it('should have a "number" property with the expected value', () => {
            expect(deserialized.number).toEqual(987654321);
          });
          it('should have a "balances.yesterday" property with the expected value', () => {
            expect({
              currency: deserialized.balances.yesterday.currency,
              decimal: deserialized.balances.yesterday.decimal.getIsEqual(314.15)
            }).toEqual({
              currency: Currency.USD,
              decimal: true
            });
          });
          it('should have a "balances.today" property with the expected value', () => {
            expect({
              currency: deserialized.balances.today.currency,
              decimal: deserialized.balances.today.decimal.getIsEqual(271.83)
            }).toEqual({
              currency: Currency.USD,
              decimal: true
            });
          });
        });
      });
    });
    describe("and a schema-compliant array is created", () => {
      let object2;
      beforeEach(() => {
        object2 = [{
          number: 987654321,
          balances: {
            yesterday: new Money(314.15, Currency.USD),
            today: new Money(271.83, Currency.USD)
          }
        }, {
          number: 123456789,
          balances: {
            yesterday: new Money(141.42, Currency.USD),
            today: new Money(173.2, Currency.USD)
          }
        }];
      });
      describe('and the object is "stringified" as JSON', () => {
        let serialized;
        beforeEach(() => {
          serialized = JSON.stringify(object2);
        });
        describe("and the object is rehydrated using the schema reviver", () => {
          let deserialized;
          beforeEach(() => {
            try {
              deserialized = JSON.parse(serialized, schema.getReviver());
            } catch (e) {
              console.log(e);
            }
          });
          it("should be an array with two items", () => {
            expect(deserialized.length).toEqual(2);
          });
          it('the first item should have a "number" property with the expected value', () => {
            expect(deserialized[0].number).toEqual(987654321);
          });
          it('the first item should have a "balances.yesterday" property with the expected value', () => {
            expect({
              currency: deserialized[0].balances.yesterday.currency,
              decimal: deserialized[0].balances.yesterday.decimal.getIsEqual(314.15)
            }).toEqual({
              currency: Currency.USD,
              decimal: true
            });
          });
          it('the first item should have a "balances.today" property with the expected value', () => {
            expect({
              currency: deserialized[0].balances.today.currency,
              decimal: deserialized[0].balances.today.decimal.getIsEqual(271.83)
            }).toEqual({
              currency: Currency.USD,
              decimal: true
            });
          });
          it('the second item should have a "number" property with the expected value', () => {
            expect(deserialized[1].number).toEqual(123456789);
          });
          it('the second item should have a "balances.yesterday" property with the expected value', () => {
            expect({
              currency: deserialized[1].balances.yesterday.currency,
              decimal: deserialized[1].balances.yesterday.decimal.getIsEqual(141.42)
            }).toEqual({
              currency: Currency.USD,
              decimal: true
            });
          });
          it('the second item should have a "balances.today" property with the expected value', () => {
            expect({
              currency: deserialized[1].balances.today.currency,
              decimal: deserialized[1].balances.today.decimal.getIsEqual(173.2)
            }).toEqual({
              currency: Currency.USD,
              decimal: true
            });
          });
        });
      });
    });
  });
  describe("When a schema is created (having a nested group of optional fields)", () => {
    "use strict";
    let schema;
    beforeEach(() => {
      schema = new Schema("thing", [
        new Field("required.a", DataType.NUMBER),
        new Field("optional.b", DataType.NUMBER, true),
        new Field("optional.c", DataType.NUMBER, true),
        new Field("name", DataType.STRING)
      ]);
    });
    describe("and a schema-compliant object is created (using one optional field)", () => {
      let object2;
      beforeEach(() => {
        object2 = {
          required: {
            a: 1
          },
          optional: {
            b: 2
          },
          name: "swamp"
        };
      });
      describe('and the object is "stringified" as JSON', () => {
        let serialized;
        beforeEach(() => {
          serialized = JSON.stringify(object2);
        });
        describe("and the object is rehydrated using the schema reviver", () => {
          let deserialized;
          beforeEach(() => {
            deserialized = JSON.parse(serialized, schema.getReviver());
          });
          it('should have a "required" property', () => {
            expect(deserialized.hasOwnProperty("required")).toEqual(true);
          });
          it('should have a "required.a" property, with the expected value', () => {
            expect(deserialized.required.a).toEqual(1);
          });
          it('should have an "optional" property', () => {
            expect(deserialized.hasOwnProperty("optional")).toEqual(true);
          });
          it('should have a "optional.b" property, with the expected value', () => {
            expect(deserialized.optional.b).toEqual(2);
          });
          it('should not have a "optional.c" property', () => {
            expect(deserialized.optional.hasOwnProperty("c")).toEqual(false);
          });
          it('should have a "name" property, with the expected value', () => {
            expect(deserialized.name).toEqual("swamp");
          });
        });
      });
    });
    describe("and a schema-compliant object is created (using no optional fields)", () => {
      let object2;
      beforeEach(() => {
        object2 = {
          required: {
            a: 1
          },
          name: "swamp"
        };
      });
      describe('and the object is "stringified" as JSON', () => {
        let serialized;
        beforeEach(() => {
          serialized = JSON.stringify(object2);
        });
        describe("and the object is rehydrated using the schema reviver", () => {
          let deserialized;
          beforeEach(() => {
            deserialized = JSON.parse(serialized, schema.getReviver());
          });
          it('should have a "required" property', () => {
            expect(deserialized.hasOwnProperty("required")).toEqual(true);
          });
          it('should have a "required.a" property, with the expected value', () => {
            expect(deserialized.required.a).toEqual(1);
          });
          it('should not have an "optional" property', () => {
            expect(deserialized.hasOwnProperty("optional")).toEqual(false);
          });
          it('should have a "name" property, with the expected value', () => {
            expect(deserialized.name).toEqual("swamp");
          });
        });
      });
    });
  });
  describe("When a complex schema is created (using custom data types)", () => {
    "use strict";
    let schema;
    beforeEach(() => {
      schema = new Schema("complex", [
        new Field("number", DataType.NUMBER),
        new Field("string", DataType.STRING),
        new Field("letter", DataType.forEnum(Letter2, "Letter")),
        new Field("day", DataType.DAY),
        new Field("decimal", DataType.DECIMAL),
        new Field("miscellany", DataType.AD_HOC)
      ]);
    });
    describe("and data is basic data is formatted", () => {
      let original;
      let conversion;
      beforeEach(() => {
        conversion = schema.format(original = {
          number: 1,
          string: "two",
          letter: "A",
          day: "2018-06-09",
          decimal: 12.34,
          miscellany: {
            stuff: "is good"
          }
        });
      });
      it("the conversion to be a new object", () => {
        expect(conversion).not.toBe(original);
      });
      it("the conversion should have copied the number value", () => {
        expect(conversion.number).toEqual(original.number);
      });
      it("the conversion should have copied the string value", () => {
        expect(conversion.string).toEqual(original.string);
      });
      it("the conversion should have converted the letter value into an enumeration", () => {
        expect(conversion.letter).toBe(LETTER_A);
      });
      it("the conversion should have converted the day value into an Day instance", () => {
        expect({
          instance: conversion.day instanceof Day,
          value: conversion.day.format()
        }).toEqual({
          instance: true,
          value: original.day
        });
      });
      it("the conversion should have converted the decimal value into an Decimal instance", () => {
        expect({
          instance: conversion.decimal instanceof Decimal,
          value: conversion.decimal.getIsEqual(original.decimal)
        }).toEqual({
          instance: true,
          value: true
        });
      });
      it("the conversion should have converted the miscellany value into an AdHoc instance", () => {
        expect({
          instance: conversion.miscellany instanceof AdHoc,
          stuff: conversion.miscellany.data.stuff
        }).toEqual({
          instance: true,
          stuff: original.miscellany.stuff
        });
      });
      describe("and the converted object is serialized", () => {
        let serialized;
        beforeEach(() => {
          serialized = JSON.stringify(conversion);
        });
        describe("and the object is rehydrated using the schema reviver", () => {
          let deserialized;
          beforeEach(() => {
            deserialized = JSON.parse(serialized, schema.getReviver());
          });
          it("the number field should be match the conversion", () => {
            expect(deserialized.number).toEqual(conversion.number);
          });
          it("the string field should be match the conversion", () => {
            expect(deserialized.string).toEqual(conversion.string);
          });
          it("the letter field should be match the conversion", () => {
            expect(deserialized.letter).toBe(conversion.letter);
          });
          it("the day field should be match the conversion", () => {
            expect(deserialized.day.format()).toEqual(conversion.day.format());
          });
          it("the decimal field should be match the conversion", () => {
            expect(deserialized.decimal.getIsEqual(conversion.decimal)).toEqual(true);
          });
          it("the miscellany field should be match the conversion", () => {
            expect(deserialized.miscellany.data.stuff).toEqual(conversion.miscellany.data.stuff);
          });
        });
      });
    });
  });
  describe("When a schema is created with only two days", () => {
    "use strict";
    let schema;
    beforeEach(() => {
      schema = new Schema("days", [
        new Field("first", DataType.DAY),
        new Field("last", DataType.DAY)
      ]);
    });
    describe("and a schema-compliant object is created", () => {
      let object2;
      beforeEach(() => {
        object2 = {
          first: Day.getToday(),
          last: Day.getToday()
        };
      });
      describe('and the object is "stringified" as JSON', () => {
        let serialized;
        beforeEach(() => {
          serialized = JSON.stringify(object2);
        });
        describe("and the object is rehydrated using the schema reviver", () => {
          let deserialized;
          beforeEach(() => {
            deserialized = JSON.parse(serialized, schema.getReviver());
          });
          it('should have a "first" property with the expected value', () => {
            expect(deserialized.first.getIsEqual(object2.first)).toEqual(true);
          });
          it('should have a "last" property with the expected value', () => {
            expect(deserialized.last.getIsEqual(object2.last)).toEqual(true);
          });
        });
      });
    });
    describe("and a schema-compliant array is created", () => {
      let object2;
      beforeEach(() => {
        object2 = [{
          first: Day.getToday(),
          last: Day.getToday()
        }, {
          first: Day.getToday(),
          last: Day.getToday()
        }];
      });
      describe('and the object is "stringified" as JSON', () => {
        let serialized;
        beforeEach(() => {
          serialized = JSON.stringify(object2);
        });
        describe("and the object is rehydrated using the schema reviver", () => {
          let deserialized;
          beforeEach(() => {
            deserialized = JSON.parse(serialized, schema.getReviver());
          });
          it("should be an array with two items", () => {
            expect(deserialized.length).toEqual(2);
          });
        });
      });
    });
  });
  describe("When a schema is created with an array (that contains an enumeration)", () => {
    "use strict";
    let schema;
    beforeEach(() => {
      schema = new Schema("array-letters", [
        new Field("letters", DataType.forEnum(Letter2, "Letter"), true, true)
      ]);
    });
    describe("and a schema-compliant object is created (where both arrays are empty)", () => {
      let object2;
      beforeEach(() => {
        object2 = {
          letters: [LETTER_B, LETTER_A]
        };
      });
      describe('and the object is "stringified" as JSON', () => {
        let serialized;
        beforeEach(() => {
          serialized = JSON.stringify(object2);
        });
        describe("and the object is rehydrated using the schema reviver", () => {
          let deserialized;
          beforeEach(() => {
            deserialized = JSON.parse(serialized, schema.getReviver());
          });
          it('should have a "letters" array', () => {
            expect(Array.isArray(deserialized.letters)).toEqual(true);
          });
          it('the "letters" array should have two items', () => {
            expect(deserialized.letters.length).toEqual(2);
          });
          it('the "letters" array should have a LETTER_B item', () => {
            expect(deserialized.letters[0]).toBe(LETTER_B);
          });
          it('the "letters" array should have a LETTER_A item', () => {
            expect(deserialized.letters[1]).toBe(LETTER_A);
          });
        });
      });
    });
    describe("and a schema-compliant array is created", () => {
      let object2;
      beforeEach(() => {
        object2 = [
          {
            letters: [LETTER_A]
          },
          {
            letters: [LETTER_B]
          },
          {
            letters: [LETTER_A, LETTER_B]
          }
        ];
      });
      describe('and the object is "stringified" as JSON', () => {
        let serialized;
        beforeEach(() => {
          serialized = JSON.stringify(object2);
        });
        describe("and the object is rehydrated using the schema reviver", () => {
          let deserialized;
          beforeEach(() => {
            deserialized = JSON.parse(serialized, schema.getReviver());
          });
          it("should be an array with three items", () => {
            expect(deserialized.length).toEqual(3);
          });
        });
      });
    });
  });
  describe("When a schema is created with two nested arrays", () => {
    "use strict";
    let schema;
    beforeEach(() => {
      schema = new Schema("nested-arrays", [
        new Field("arr.a", DataType.forEnum(Letter2, "Letter"), true, true),
        new Field("arr.b", DataType.NUMBER, true, true)
      ]);
    });
    describe("and a schema-compliant object is created (where both arrays are empty)", () => {
      let object2;
      beforeEach(() => {
        object2 = {
          arr: {
            a: [],
            b: []
          }
        };
      });
      describe('and the object is "stringified" as JSON', () => {
        let serialized;
        beforeEach(() => {
          serialized = JSON.stringify(object2);
        });
        describe("and the object is rehydrated using the schema reviver", () => {
          let deserialized;
          beforeEach(() => {
            deserialized = JSON.parse(serialized, schema.getReviver());
          });
          it('should have a "arr" object', () => {
            expect(typeof deserialized.arr).toEqual("object");
          });
          it('should have an "arr.a" array', () => {
            expect(Array.isArray(deserialized.arr.a)).toEqual(true);
          });
          it('the "arr.a" array should be empty', () => {
            expect(deserialized.arr.a.length).toEqual(0);
          });
          it('should have an "arr.b" array', () => {
            expect(Array.isArray(deserialized.arr.b)).toEqual(true);
          });
          it('the "arr.b" array should be empty', () => {
            expect(deserialized.arr.b.length).toEqual(0);
          });
        });
      });
    });
    describe("and a schema-compliant array is created", () => {
      let object2;
      beforeEach(() => {
        object2 = [
          {
            arr: {
              a: [],
              b: []
            }
          },
          {
            arr: {
              a: [LETTER_A],
              b: [1]
            }
          }
        ];
      });
      describe('and the object is "stringified" as JSON', () => {
        let serialized;
        beforeEach(() => {
          serialized = JSON.stringify(object2);
        });
        describe("and the object is rehydrated using the schema reviver", () => {
          let deserialized;
          beforeEach(() => {
            deserialized = JSON.parse(serialized, schema.getReviver());
          });
          it("should be an array with two items", () => {
            expect(deserialized.length).toEqual(2);
          });
        });
      });
    });
  });
  describe("When Schema accessors and factories are used", () => {
    "use strict";
    let schema;
    beforeEach(() => {
      schema = new Schema("person", [new Field("name", DataType.STRING)], [Component.forMoney("wallet")]);
    });
    it("should expose components without allowing array mutation", () => {
      const components = schema.components;
      components.pop();
      expect(schema.components.length).toEqual(1);
    });
    it("should expose the correct component name", () => {
      expect(schema.components[0].name).toEqual("wallet");
    });
    it("should create reviver functions from the reviver factory", () => {
      const simpleSchema = new Schema("person", [
        new Field("name", DataType.STRING)
      ]);
      const reviver = simpleSchema.getReviverFactory()();
      const deserialized = JSON.parse('{"name":"Luka"}', reviver);
      expect(deserialized.name).toEqual("Luka");
    });
  });

  // serialization/json/builders/ComponentBuilder.js
  var ComponentBuilder = class {
    #component;
    #name;
    /**
     * @param {string} name - The name of the schema
     */
    constructor(name) {
      this.#component = new Component(name);
    }
    /**
     * The {@link Schema} current schema instance.
     *
     * @public
     * @returns {Component}
     */
    get component() {
      return this.#component;
    }
    /**
     * Adds a new {@link Field} to the schema and returns the current instance.
     *
     * @public
     * @param {string} name
     * @param {DataType} dataType
     * @returns {ComponentBuilder}
     */
    withField(name, dataType) {
      argumentIsRequired(name, "name", String);
      argumentIsRequired(dataType, "dataType", DataType, "DataType");
      const fields = this.#component.fields.concat([new Field(name, dataType)]);
      this.#component = new Component(this.#component.name, fields, this.#component.reviver);
      return this;
    }
    /**
     * Adds a "reviver" function for use with JSON.parse.
     *
     * @public
     * @param {Function} reviver
     * @returns {ComponentBuilder}
     */
    withReviver(reviver) {
      argumentIsRequired(reviver, "reviver", Function);
      this.#component = new Component(this.#component.name, this.#component.fields, reviver);
      return this;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[ComponentBuilder (name=${this.#name})]`;
    }
  };

  // test/specs/serialization/json/builders/ComponentBuilderSpec.js
  describe("When a ComponentBuilder is used", () => {
    "use strict";
    let builder;
    beforeEach(() => {
      builder = new ComponentBuilder("person");
    });
    it("should expose a Component instance", () => {
      expect({
        component: builder.component instanceof Component,
        name: builder.component.name
      }).toEqual({
        component: true,
        name: "person"
      });
    });
    it("should add fields", () => {
      const returned = builder.withField("first", DataType.STRING);
      expect({
        returned,
        fields: builder.component.fields.length,
        name: builder.component.fields[0].name
      }).toEqual({
        returned: builder,
        fields: 1,
        name: "first"
      });
    });
    it("should add a reviver", () => {
      const reviver = (value) => value;
      expect({
        returned: builder.withReviver(reviver),
        reviver: builder.component.reviver
      }).toEqual({
        returned: builder,
        reviver
      });
    });
    it("should validate method arguments", () => {
      expect([() => builder.withField(null, DataType.STRING), () => builder.withField("first", null), () => builder.withReviver(null)].map(throws5)).toEqual([true, true, true]);
    });
  });
  function throws5(action) {
    try {
      action();
      return false;
    } catch {
      return true;
    }
  }

  // serialization/json/builders/SchemaBuilder.js
  var SchemaBuilder = class _SchemaBuilder {
    #schema;
    #name;
    /**
     * @param {string} name - The name of the schema
     */
    constructor(name) {
      this.#name = name;
      this.#schema = new Schema(name);
    }
    /**
     * The {@link Schema} current schema instance.
     *
     * @public
     * @returns {Schema}
     */
    get schema() {
      return this.#schema;
    }
    /**
     * Adds a new {@link Field} to the schema and returns the current instance.
     *
     * @public
     * @param {string} name - The name of the new field.
     * @param {DataType} dataType - The type of the new field.
     * @param {boolean=} optional - If true, the field is not required and may be omitted.
     * @returns {SchemaBuilder}
     */
    withField(name, dataType, optional) {
      argumentIsRequired(name, "name", String);
      argumentIsRequired(dataType, "dataType", DataType, "DataType");
      argumentIsOptional(optional, "optional", Boolean);
      const fields = this.#schema.fields.concat([new Field(name, dataType, optional, false)]);
      this.#schema = new Schema(this.#schema.name, fields, this.#schema.components, this.#schema.strict);
      return this;
    }
    /**
     * Adds a new {@link Field} to the schema (where the field is an array) and returns the current instance.
     *
     * @public
     * @param {string} name - The name of the new field.
     * @param {DataType} dataType - The type of the new field.
     * @param {boolean=} optional - If true, the field is not required and may be omitted.
     * @returns {SchemaBuilder}
     */
    withArray(name, dataType, optional) {
      argumentIsRequired(name, "name", String);
      argumentIsRequired(dataType, "dataType", DataType, "DataType");
      argumentIsOptional(optional, "optional", Boolean);
      const fields = this.#schema.fields.concat([new Field(name, dataType, optional, true)]);
      this.#schema = new Schema(this.#schema.name, fields, this.#schema.components, this.#schema.strict);
      return this;
    }
    /**
     * Adds a new {@link Component} to the schema and returns the current instance.
     *
     * @public
     * @param {Component} component - The new component to add.
     * @returns {SchemaBuilder}
     */
    withComponent(component) {
      argumentIsRequired(component, "component", Component, "Component");
      const components = this.#schema.components.concat([component]);
      this.#schema = new Schema(this.#schema.name, this.#schema.fields, components, this.#schema.strict);
      return this;
    }
    /**
     * Adds a new {@link Component} to the schema, using a {@link ComponentBuilder}
     * and returns the current instance.
     *
     * @public
     * @param {string} name - The name of the new component.
     * @param {Function} callback - A callback to which the {@link ComponentBuilder} is passed synchronously.
     * @returns {SchemaBuilder}
     */
    withComponentBuilder(name, callback) {
      argumentIsRequired(name, "name", String);
      const componentBuilder = new ComponentBuilder(name);
      callback(componentBuilder);
      return this.withComponent(componentBuilder.component);
    }
    /**
     * Creates a new {@link SchemaBuilder}.
     *
     * @public
     * @static
     * @param {string} name
     * @returns {SchemaBuilder}
     */
    static withName(name) {
      argumentIsRequired(name, "name", String);
      return new _SchemaBuilder(name);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return `[SchemaBuilder (name=${this.#name})]`;
    }
  };

  // test/specs/serialization/json/builders/SchemaBuilderSpec.js
  describe('When using the schema builder to create a "Person" schema', () => {
    "use strict";
    let schemaBuilder;
    beforeEach(() => {
      schemaBuilder = SchemaBuilder.withName("person");
    });
    describe('that has a string-typed "name" field and a number-typed "age" field', () => {
      beforeEach(() => {
        schemaBuilder = schemaBuilder.withField("name", DataType.STRING).withField("age", DataType.NUMBER);
      });
      describe("and the schema is pulled", () => {
        let schema;
        beforeEach(() => {
          schema = schemaBuilder.schema;
        });
        it('the name should be "person"', () => {
          expect(schema.name).toEqual("person");
        });
        it("there should be two fields", () => {
          expect(schema.fields.length).toEqual(2);
        });
        it('the first field should be called "name"', () => {
          expect(schema.fields[0].name).toEqual("name");
        });
        it("the first field should be string-typed", () => {
          expect(schema.fields[0].dataType).toEqual(DataType.STRING);
        });
        it('the second field should be called "age"', () => {
          expect(schema.fields[1].name).toEqual("age");
        });
        it("the second field should be number-typed", () => {
          expect(schema.fields[1].dataType).toEqual(DataType.NUMBER);
        });
        it("there should be no components", () => {
          expect(schema.components.length).toEqual(0);
        });
      });
      describe('and a "wallet" component is added to the schema', () => {
        beforeEach(() => {
          schemaBuilder = schemaBuilder.withComponent(Component.forMoney("wallet"));
        });
        describe("and the schema is pulled", () => {
          let schema;
          beforeEach(() => {
            schema = schemaBuilder.schema;
          });
          it('the name should be "person"', () => {
            expect(schema.name).toEqual("person");
          });
          it("there should be two fields", () => {
            expect(schema.fields.length).toEqual(2);
          });
          it('the first field should be called "name"', () => {
            expect(schema.fields[0].name).toEqual("name");
          });
          it("the first field should be string-typed", () => {
            expect(schema.fields[0].dataType).toEqual(DataType.STRING);
          });
          it('the second field should be called "age"', () => {
            expect(schema.fields[1].name).toEqual("age");
          });
          it("the second field should be number-typed", () => {
            expect(schema.fields[1].dataType).toEqual(DataType.NUMBER);
          });
          it("there should be one component", () => {
            expect(schema.components.length).toEqual(1);
          });
          it('the component should be named "wallet"', () => {
            expect(schema.components[0].name).toEqual("wallet");
          });
        });
      });
      describe("and an array field is added to the schema", () => {
        beforeEach(() => {
          schemaBuilder = schemaBuilder.withArray("tags", DataType.STRING, true);
        });
        it("the array field should have correct name", () => {
          const schema = schemaBuilder.schema;
          const field = schema.fields[schema.fields.length - 1];
          expect(field.name).toEqual("tags");
        });
        it("the array field should have correct dataType", () => {
          const schema = schemaBuilder.schema;
          const field = schema.fields[schema.fields.length - 1];
          expect(field.dataType).toBe(DataType.STRING);
        });
        it("the array field should be optional", () => {
          const schema = schemaBuilder.schema;
          const field = schema.fields[schema.fields.length - 1];
          expect(field.optional).toEqual(true);
        });
        it("the array field should be marked as array", () => {
          const schema = schemaBuilder.schema;
          const field = schema.fields[schema.fields.length - 1];
          expect(field.array).toEqual(true);
        });
      });
      describe('and a "custom" component is added to the schema (using a component builder)', () => {
        let reviver;
        beforeEach(() => {
          schemaBuilder = schemaBuilder.withComponentBuilder("custom", (cb) => {
            cb.withField("b", DataType.STRING).withField("a", DataType.NUMBER).withReviver(reviver = (x) => {
              return "hola amigo";
            });
          });
        });
        describe("and the schema is pulled", () => {
          let schema;
          beforeEach(() => {
            schema = schemaBuilder.schema;
          });
          it('the name should be "person"', () => {
            expect(schema.name).toEqual("person");
          });
          it("there should be two fields", () => {
            expect(schema.fields.length).toEqual(2);
          });
          it('the first field should be called "name"', () => {
            expect(schema.fields[0].name).toEqual("name");
          });
          it("the first field should be string-typed", () => {
            expect(schema.fields[0].dataType).toEqual(DataType.STRING);
          });
          it('the second field should be called "age"', () => {
            expect(schema.fields[1].name).toEqual("age");
          });
          it("the second field should be number-typed", () => {
            expect(schema.fields[1].dataType).toEqual(DataType.NUMBER);
          });
          it("there should be one component", () => {
            expect(schema.components.length).toEqual(1);
          });
          it('the component should be named "custom"', () => {
            expect(schema.components[0].name).toEqual("custom");
          });
          it("there component should have two fields", () => {
            expect(schema.components[0].fields.length).toEqual(2);
          });
          it(`the component's first field should be called "b"`, () => {
            expect(schema.components[0].fields[0].name).toEqual("b");
          });
          it("the component's first field should be string-typed", () => {
            expect(schema.components[0].fields[0].dataType).toEqual(DataType.STRING);
          });
          it(`the component's second field should be called "a"`, () => {
            expect(schema.components[0].fields[1].name).toEqual("a");
          });
          it("the component's second field should be number-typed", () => {
            expect(schema.components[0].fields[1].dataType).toEqual(DataType.NUMBER);
          });
          it("there component reviver function should be correct", () => {
            expect(schema.components[0].reviver).toBe(reviver);
          });
        });
      });
    });
  });

  // specifications/Specification.js
  var Specification = class _Specification {
    constructor() {
    }
    /**
     * Evaluates the specification, returning true or false.
     *
     * @public
     * @param {*=} data
     * @returns {boolean}
     */
    evaluate(data) {
      return this._evaluate(data);
    }
    /**
     * @protected
     * @param {*=} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return false;
    }
    /**
     * Wraps the current instance and another {@link Specification} into a new
     * specification which only evaluates to true when both wrapped specifications
     * evaluate to true.
     *
     * @public
     * @param {Specification} other
     * @returns {And}
     */
    and(other) {
      argumentIsRequired(other, "other", _Specification, "Specification");
      return new And(this, other);
    }
    /**
     * Wraps the current instance and another {@link Specification} into a new
     * specification which only evaluates to true when either of the wrapped
     * specifications evaluate to true.
     *
     * @public
     * @param {Specification} other
     * @returns {Or}
     */
    or(other) {
      argumentIsRequired(other, "other", _Specification, "Specification");
      return new Or(this, other);
    }
    /**
     * Wraps the current instance in a new {@link Specification} which evaluates
     * to the inverse result of the wrapped specification.
     *
     * @public
     * @returns {Not}
     */
    not() {
      return new Not(this);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Specification]";
    }
  };
  var And = class extends Specification {
    #specificationOne;
    #specificationTwo;
    /**
     * @param {Specification} specificationOne
     * @param {Specification} specificationTwo
     */
    constructor(specificationOne, specificationTwo) {
      super();
      argumentIsRequired(specificationOne, "specificationOne", Specification, "Specification");
      argumentIsRequired(specificationTwo, "specificationTwo", Specification, "Specification");
      this.#specificationOne = specificationOne;
      this.#specificationTwo = specificationTwo;
    }
    /**
     * @protected
     * @override
     * @param {*=} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return this.#specificationOne.evaluate(data) && this.#specificationTwo.evaluate(data);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[And]";
    }
  };
  var Or = class extends Specification {
    #specificationOne;
    #specificationTwo;
    /**
     * @param {Specification} specificationOne
     * @param {Specification} specificationTwo
     */
    constructor(specificationOne, specificationTwo) {
      super();
      argumentIsRequired(specificationOne, "specificationOne", Specification, "Specification");
      argumentIsRequired(specificationTwo, "specificationTwo", Specification, "Specification");
      this.#specificationOne = specificationOne;
      this.#specificationTwo = specificationTwo;
    }
    /**
     * @protected
     * @override
     * @param {*=} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return this.#specificationOne.evaluate(data) || this.#specificationTwo.evaluate(data);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Or]";
    }
  };
  var Not = class extends Specification {
    #otherSpecification;
    /**
     * @param {Specification} otherSpecification
     */
    constructor(otherSpecification) {
      super();
      argumentIsRequired(otherSpecification, "otherSpecification", Specification, "Specification");
      this.#otherSpecification = otherSpecification;
    }
    /**
     * @protected
     * @override
     * @param {*=} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return !this.#otherSpecification.evaluate(data);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Not]";
    }
  };
  Specification.And = And;
  Specification.Or = Or;
  Specification.Not = Not;

  // test/specs/specifications/AndSpec.js
  describe("When an And specification is constructed", () => {
    "use strict";
    class SpecPass extends Specification {
      constructor() {
        super();
        this._spy = jasmine.createSpy("spyPass").and.returnValue(true);
      }
      _evaluate(data) {
        return this._spy(data);
      }
    }
    class SpecFail extends Specification {
      constructor() {
        super();
        this._spy = jasmine.createSpy("spyPass").and.returnValue(false);
      }
      _evaluate(data) {
        return this._spy(data);
      }
    }
    describe("with two specifications that will pass", () => {
      let specification;
      let specPassOne;
      let specPassTwo;
      let data;
      let result;
      beforeEach(() => {
        specification = new And(specPassOne = new SpecPass(), specPassTwo = new SpecPass());
        result = specification.evaluate(data = {});
      });
      it("should call the first specification", () => {
        expect(specPassOne._spy).toHaveBeenCalledWith(data);
      });
      it("should call the second specification", () => {
        expect(specPassTwo._spy).toHaveBeenCalledWith(data);
      });
      it("should evaluate to true", () => {
        expect(result).toEqual(true);
      });
    });
    describe("where the first specifications will fail", () => {
      let specification;
      let specPassOne;
      let specPassTwo;
      let data;
      let result;
      beforeEach(() => {
        specification = new And(specPassOne = new SpecFail(), specPassTwo = new SpecPass());
        result = specification.evaluate(data = {});
      });
      it("should call the first specification", () => {
        expect(specPassOne._spy).toHaveBeenCalledWith(data);
      });
      it("should not call the second specification", () => {
        expect(specPassTwo._spy).not.toHaveBeenCalledWith(data);
      });
      it("should evaluate to false", () => {
        expect(result).toEqual(false);
      });
    });
  });

  // specifications/Between.js
  var Between = class extends Specification {
    #values;
    /**
     * @param {number[]} values
     */
    constructor(values) {
      super();
      argumentIsArray(values, "values", Number);
      this.#values = values;
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      argumentIsRequired(data, "data", Number);
      return data > this.#values[0] && data < this.#values[1];
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Between]";
    }
  };

  // test/specs/specifications/BetweenSpec.js
  describe("When a Between specification is constructed (with a range of 17 to 42)", () => {
    "use strict";
    let specification;
    beforeEach(() => {
      specification = new Between([17, 42]);
    });
    it("should pass not pass when 16 is evaluated", () => {
      expect(specification.evaluate(16)).toBe(false);
    });
    it("should pass not pass when 17 is evaluated", () => {
      expect(specification.evaluate(17)).toBe(false);
    });
    it("should pass pass when 18 is evaluated", () => {
      expect(specification.evaluate(18)).toBe(true);
    });
    it("should pass pass when 41 is evaluated", () => {
      expect(specification.evaluate(41)).toBe(true);
    });
    it("should pass not pass when 42 is evaluated", () => {
      expect(specification.evaluate(42)).toBe(false);
    });
    it("should pass not pass when 43 is evaluated", () => {
      expect(specification.evaluate(43)).toBe(false);
    });
  });

  // specifications/Changes.js
  var Changes = class extends Specification {
    #previous;
    constructor() {
      super();
      this.#previous = null;
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      if (nil(data) || undef(data)) {
        return false;
      }
      const current = data;
      const previous = this.#previous;
      const changed = !nil(previous) && previous !== current;
      this.#previous = current;
      return changed;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Changes]";
    }
  };

  // test/specs/specifications/ChangesSpec.js
  describe("When a Changes specification is used to evaluate strings", () => {
    "use strict";
    describe("and the first string is evaluated", () => {
      let specification;
      let r1;
      beforeEach(() => {
        specification = new Changes();
        r1 = specification.evaluate("abc");
      });
      it("should not pass", () => {
        expect(r1).toEqual(false);
      });
      describe("and a second string, different from the first, is evaluated", () => {
        let r2;
        beforeEach(() => {
          r2 = specification.evaluate("def");
        });
        it("should pass", () => {
          expect(r2).toEqual(true);
        });
      });
      describe("and a second string, same as the first, is evaluated", () => {
        let r2;
        beforeEach(() => {
          r2 = specification.evaluate("abc");
        });
        it("should not pass", () => {
          expect(r2).toEqual(false);
        });
      });
    });
  });
  describe("When a Changes specification is used to evaluate numbers", () => {
    "use strict";
    describe("and the first number is evaluated", () => {
      let specification;
      let r1;
      beforeEach(() => {
        specification = new Changes();
        r1 = specification.evaluate(1);
      });
      it("should not pass", () => {
        expect(r1).toEqual(false);
      });
      describe("and a second number, different from the first, is evaluated", () => {
        let r2;
        beforeEach(() => {
          r2 = specification.evaluate(0);
        });
        it("should pass", () => {
          expect(r2).toEqual(true);
        });
      });
      describe("and a second number, same as the first, is evaluated", () => {
        let r2;
        beforeEach(() => {
          r2 = specification.evaluate(1);
        });
        it("should not pass", () => {
          expect(r2).toEqual(false);
        });
      });
    });
  });

  // specifications/Contained.js
  var Contained = class extends Specification {
    #value;
    /**
     * @param {Array} value
     */
    constructor(value) {
      super();
      argumentIsArray(value, "value");
      this.#value = value;
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return this.#value.some((candidate) => candidate === data);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Contained]";
    }
  };

  // test/specs/specifications/ContainedSpec.js
  describe("When a Contained specifciation is constructed", () => {
    "use strict";
    let specification;
    let specificationValue;
    beforeEach(() => {
      specification = new Contained(specificationValue = ["xyz", 123]);
    });
    describe("and a string, contained in the array, is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate("xyz");
      });
      it("should pass", () => {
        expect(result).toEqual(true);
      });
    });
    describe("and a string, not contained in the array, is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate("abc");
      });
      it("should not pass", () => {
        expect(result).toEqual(false);
      });
    });
    describe("and a number, contained in the array, is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate(123);
      });
      it("should pass", () => {
        expect(result).toEqual(true);
      });
    });
    describe("and a number, not contained in the array, is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate(1);
      });
      it("should not pass", () => {
        expect(result).toEqual(false);
      });
    });
  });

  // specifications/Contains.js
  var Contains = class extends Specification {
    #value;
    /**
     * @param {*} value
     */
    constructor(value) {
      super();
      this.#value = value;
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return Array.isArray(data) && data.some((candidate) => candidate === this.#value);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Contains]";
    }
  };

  // test/specs/specifications/ContainsSpec.js
  describe("When a Contains specification is constructed", () => {
    "use strict";
    let specification;
    let specificationValue;
    beforeEach(() => {
      specification = new Contains(specificationValue = "xyz");
    });
    describe("and an array, containing the desired value, is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate(["abc", "def", specificationValue, 1, 2, 3]);
      });
      it("should pass", () => {
        expect(result).toEqual(true);
      });
    });
    describe("and an array, missing the desired value, is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate(["abc", "def", 1, 2, 3]);
      });
      it("should fail", () => {
        expect(result).toEqual(false);
      });
    });
    describe("and an object is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate({ abc: "xyz", xyz: "abc" });
      });
      it("should fail", () => {
        expect(result).toEqual(false);
      });
    });
  });

  // specifications/Crosses.js
  var CrossesSpecification = class extends Specification {
    #threshold;
    #previous;
    /**
     * @param {number} threshold
     */
    constructor(threshold) {
      super();
      argumentIsRequired(threshold, "threshold", Number);
      this.#threshold = threshold;
      this.#previous = null;
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      if (!number(data)) {
        return false;
      }
      const current = data;
      const previous = this.#previous;
      const crossed = previous !== null && (previous > this.#threshold && !(current > this.#threshold) || previous < this.#threshold && !(current < this.#threshold));
      this.#previous = current;
      return crossed;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[CrossesSpecification]";
    }
  };

  // test/specs/specifications/CrossesSpec.js
  describe("When a Crosses specification is initialized with a threshold of 1000", () => {
    "use strict";
    let specification;
    beforeEach(() => {
      specification = new CrossesSpecification(1e3);
    });
    describe("and the first value evaluated is 900", () => {
      let r1;
      beforeEach(() => {
        r1 = specification.evaluate(900);
      });
      it("should not pass", () => {
        expect(r1).toEqual(false);
      });
      describe("and the second value evaluated is 1100", () => {
        let r2;
        beforeEach(() => {
          r2 = specification.evaluate(1100);
        });
        it("should pass", () => {
          expect(r2).toEqual(true);
        });
        describe("and the third value evaluated is 999", () => {
          let r3;
          beforeEach(() => {
            r3 = specification.evaluate(999);
          });
          it("should pass", () => {
            expect(r3).toEqual(true);
          });
        });
        describe("and the third value evaluated is 1001", () => {
          let r3;
          beforeEach(() => {
            r3 = specification.evaluate(1001);
          });
          it("should not pass", () => {
            expect(r3).toEqual(false);
          });
        });
      });
      describe("and the second value evaluated is 950", () => {
        let r2;
        beforeEach(() => {
          r2 = specification.evaluate(950);
        });
        it("should not pass", () => {
          expect(r2).toEqual(false);
        });
      });
    });
    describe("and the first value evaluated is 1200", () => {
      let r1;
      beforeEach(() => {
        r1 = specification.evaluate(1200);
      });
      it("should not pass", () => {
        expect(r1).toEqual(false);
      });
      describe("and the second value evaluated is 1100", () => {
        let r2;
        beforeEach(() => {
          r2 = specification.evaluate(1100);
        });
        it("should not pass", () => {
          expect(r2).toEqual(false);
        });
      });
      describe("and the second value evaluated is 950", () => {
        let r2;
        beforeEach(() => {
          r2 = specification.evaluate(950);
        });
        it("should pass", () => {
          expect(r2).toEqual(true);
        });
      });
    });
  });
  describe("When a Crosses specification is initialized with a threshold of zero", () => {
    "use strict";
    let specification;
    beforeEach(() => {
      specification = new CrossesSpecification(0);
    });
    describe("and the first value evaluated is 1", () => {
      let r1;
      beforeEach(() => {
        r1 = specification.evaluate(1);
      });
      it("should not pass", () => {
        expect(r1).toEqual(false);
      });
      describe("and the second value evaluated is -1", () => {
        let r2;
        beforeEach(() => {
          r2 = specification.evaluate(-1);
        });
        it("should pass", () => {
          expect(r2).toEqual(true);
        });
      });
      describe("and the second value evaluated is 0.5", () => {
        let r2;
        beforeEach(() => {
          r2 = specification.evaluate(0.5);
        });
        it("should not pass", () => {
          expect(r2).toEqual(false);
        });
      });
    });
    describe("and the first value evaluated is -1", () => {
      let r1;
      beforeEach(() => {
        r1 = specification.evaluate(-1);
      });
      it("should not pass", () => {
        expect(r1).toEqual(false);
      });
      describe("and the second value evaluated is -0.5", () => {
        let r2;
        beforeEach(() => {
          r2 = specification.evaluate(-0.5);
        });
        it("should not pass", () => {
          expect(r2).toEqual(false);
        });
      });
      describe("and the second value evaluated is 1", () => {
        let r2;
        beforeEach(() => {
          r2 = specification.evaluate(1);
        });
        it("should pass", () => {
          expect(r2).toEqual(true);
        });
      });
    });
  });

  // specifications/Equals.js
  var Equals = class extends Specification {
    #value;
    /**
     * @param {*} value
     */
    constructor(value) {
      super();
      this.#value = value;
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return data === this.#value;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Equals]";
    }
  };

  // test/specs/specifications/EqualsSpec.js
  describe("When a Equals specification is constructed", () => {
    "use strict";
    let specification;
    let value;
    beforeEach(() => {
      specification = new Equals(value = {});
    });
    describe("and the same object is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate(value);
      });
      it("should pass", () => {
        expect(result).toEqual(true);
      });
    });
    describe("and a different same object is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate({});
      });
      it("should not pass", () => {
        expect(result).toEqual(false);
      });
    });
  });

  // specifications/Null.js
  var Null = class extends Specification {
    constructor() {
      super();
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return nil(data);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Null]";
    }
  };

  // specifications/Undefined.js
  var Undefined = class extends Specification {
    constructor() {
      super();
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return undef(data);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Undefined]";
    }
  };

  // specifications/Exists.js
  var Exists = class extends Specification {
    #wrapped;
    constructor() {
      super();
      const n = new Null();
      const u = new Undefined();
      this.#wrapped = n.or(u).not();
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return this.#wrapped.evaluate(data);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Exists]";
    }
  };

  // test/specs/specifications/ExistsSpec.js
  describe("When a Exists specification is constructed", () => {
    "use strict";
    let specification;
    beforeEach(() => {
      specification = new Exists();
    });
    it("should not pass a null value", () => {
      expect(specification.evaluate(null)).toEqual(false);
    });
    it("should not pass an implicit undefined value", () => {
      expect(specification.evaluate()).toEqual(false);
    });
    it("should not pass an explicit undefined value", () => {
      expect(specification.evaluate(void 0)).toEqual(false);
    });
    it("should pass a zero value", () => {
      expect(specification.evaluate(0)).toEqual(true);
    });
    it("should pass an empty-length string value", () => {
      expect(specification.evaluate("")).toEqual(true);
    });
    it("should pass an object value", () => {
      expect(specification.evaluate({})).toEqual(true);
    });
  });

  // specifications/Fail.js
  var Fail = class extends Specification {
    constructor() {
      super();
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return false;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Fail]";
    }
  };

  // test/specs/specifications/FailSpec.js
  describe("When a Fail specification is constructed", () => {
    "use strict";
    let specification;
    let specificationValue;
    beforeEach(() => {
      specification = new Fail(specificationValue = "ignored");
    });
    describe("and a string is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate("abc");
      });
      it("should not pass", () => {
        expect(result).toEqual(false);
      });
    });
    describe("and a null value is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate(null);
      });
      it("should not pass", () => {
        expect(result).toEqual(false);
      });
    });
    describe("and an undefined value is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate(void 0);
      });
      it("should not pass", () => {
        expect(result).toEqual(false);
      });
    });
  });

  // specifications/GreaterThan.js
  var GreaterThan = class extends Specification {
    #value;
    /**
     * @param {number} value
     */
    constructor(value) {
      super();
      argumentIsRequired(value, "value", Number);
      this.#value = value;
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      argumentIsRequired(data, "data", Number);
      return data > this.#value;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[GreaterThan]";
    }
  };

  // test/specs/specifications/GreaterThanSpec.js
  describe("When a GreaterThan specification is used", () => {
    "use strict";
    let specification;
    beforeEach(() => {
      specification = new GreaterThan(10);
    });
    it("should pass when data is greater than the configured value", () => {
      expect(specification.evaluate(11)).toEqual(true);
    });
    it("should fail when data is equal to the configured value", () => {
      expect(specification.evaluate(10)).toEqual(false);
    });
    it("should fail when data is less than the configured value", () => {
      expect(specification.evaluate(9)).toEqual(false);
    });
    it("should validate constructor arguments", () => {
      expect(() => new GreaterThan()).toThrow();
    });
    it("should validate evaluate arguments", () => {
      expect(() => specification.evaluate()).toThrow();
    });
  });

  // specifications/LessThan.js
  var LessThan = class extends Specification {
    #value;
    /**
     * @param {number} value
     */
    constructor(value) {
      super();
      argumentIsRequired(value, "value", Number);
      this.#value = value;
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      argumentIsRequired(data, "data", Number);
      return data < this.#value;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[LessThan]";
    }
  };

  // test/specs/specifications/LessThanSpec.js
  describe("When a LessThan specification is used", () => {
    "use strict";
    let specification;
    beforeEach(() => {
      specification = new LessThan(10);
    });
    it("should pass when data is less than the configured value", () => {
      expect(specification.evaluate(9)).toEqual(true);
    });
    it("should fail when data is equal to the configured value", () => {
      expect(specification.evaluate(10)).toEqual(false);
    });
    it("should fail when data is greater than the configured value", () => {
      expect(specification.evaluate(11)).toEqual(false);
    });
    it("should validate constructor arguments", () => {
      expect(() => new LessThan()).toThrow();
    });
    it("should validate evaluate arguments", () => {
      expect(() => specification.evaluate()).toThrow();
    });
  });

  // specifications/Nan.js
  var Nan = class extends Specification {
    constructor() {
      super();
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return nan(data);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Nan]";
    }
  };

  // test/specs/specifications/NanSpec.js
  describe("When a NaN specification is constructed", () => {
    "use strict";
    let specification;
    beforeEach(() => {
      specification = new Nan();
    });
    describe("and a string is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate("abc");
      });
      it("should not pass", () => {
        expect(result).toEqual(false);
      });
    });
    describe("and a null value is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate(null);
      });
      it("should not pass", () => {
        expect(result).toEqual(false);
      });
    });
    describe("and an undefined value is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate(void 0);
      });
      it("should not pass", () => {
        expect(result).toEqual(false);
      });
    });
    describe("and an integer value is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate(1);
      });
      it("should not pass", () => {
        expect(result).toEqual(false);
      });
    });
    describe("and a NaN value is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate(parseFloat(null));
      });
      it("should pass", () => {
        expect(result).toEqual(true);
      });
    });
  });

  // test/specs/specifications/NotSpec.js
  describe("When a Not specification is constructed", () => {
    "use strict";
    class DelegateSpecification extends Specification {
      constructor(fn2) {
        super();
        this._fn = fn2;
      }
      _evaluate(data) {
        return this._fn(data);
      }
    }
    describe("with a specification that always fails", () => {
      let specification;
      let spy;
      let result;
      beforeEach(() => {
        specification = new Not(
          new DelegateSpecification(
            spy = jasmine.createSpy("fn").and.callFake((data) => {
              return false;
            })
          )
        );
        result = specification.evaluate("abc");
      });
      it("should call the wrapped specification", () => {
        expect(spy).toHaveBeenCalled();
      });
      it("should pass", () => {
        expect(result).toEqual(true);
      });
    });
    describe("with a specification that always passes", () => {
      let specification;
      let spy;
      let result;
      beforeEach(() => {
        specification = new Not(
          new DelegateSpecification(
            spy = jasmine.createSpy("fn").and.callFake((data) => {
              return true;
            })
          )
        );
        result = specification.evaluate("abc");
      });
      it("should call the wrapped specification", () => {
        expect(spy).toHaveBeenCalled();
      });
      it("should pass", () => {
        expect(result).toEqual(false);
      });
    });
  });
  describe("When a Specification (that always fails) is constructed", () => {
    "use strict";
    class DelegateSpecification extends Specification {
      constructor(fn2) {
        super();
        this._fn = fn2;
      }
      _evaluate(data) {
        return this._fn(data);
      }
    }
    describe("and inverted", () => {
      let specification;
      let spy;
      let result;
      beforeEach(() => {
        specification = new DelegateSpecification(
          spy = jasmine.createSpy("fn").and.callFake((data) => {
            return false;
          })
        );
        specification = specification.not();
        result = specification.evaluate("abc");
      });
      it("should call the original specification", () => {
        expect(spy).toHaveBeenCalled();
      });
      it("should pass", () => {
        expect(result).toEqual(true);
      });
    });
  });
  describe("When a Specification (that always succeeds) is constructed", () => {
    "use strict";
    class DelegateSpecification extends Specification {
      constructor(fn2) {
        super();
        this._fn = fn2;
      }
      _evaluate(data) {
        return this._fn(data);
      }
    }
    describe("and inverted", () => {
      let specification;
      let spy;
      let result;
      beforeEach(() => {
        specification = new DelegateSpecification(
          spy = jasmine.createSpy("fn").and.callFake((data) => {
            return true;
          })
        );
        specification = specification.not();
        result = specification.evaluate("abc");
      });
      it("should call the original specification", () => {
        expect(spy).toHaveBeenCalled();
      });
      it("should pass", () => {
        expect(result).toEqual(false);
      });
    });
  });

  // test/specs/specifications/NullSpec.js
  describe("When a Null specification is constructed", () => {
    "use strict";
    let specification;
    beforeEach(() => {
      specification = new Null();
    });
    it("should pass a null value", () => {
      expect(specification.evaluate(null)).toEqual(true);
    });
    it("should not pass an implicit undefined value", () => {
      expect(specification.evaluate()).toEqual(false);
    });
    it("should not pass an explicit undefined value", () => {
      expect(specification.evaluate(void 0)).toEqual(false);
    });
    it("should not pass a zero value", () => {
      expect(specification.evaluate(0)).toEqual(false);
    });
    it("should not pass an empty-length string value", () => {
      expect(specification.evaluate("")).toEqual(false);
    });
  });

  // specifications/Numeric.js
  var Numeric = class extends Specification {
    constructor() {
      super();
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return number(data);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Numeric]";
    }
  };

  // test/specs/specifications/NumericSpec.js
  describe("When a Numeric specification is constructed", () => {
    "use strict";
    let specification;
    beforeEach(() => {
      specification = new Numeric();
    });
    describe("and a string is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate("abc");
      });
      it("should not pass", () => {
        expect(result).toEqual(false);
      });
    });
    describe("and a null value is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate(null);
      });
      it("should not pass", () => {
        expect(result).toEqual(false);
      });
    });
    describe("and an undefined value is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate(void 0);
      });
      it("should not pass", () => {
        expect(result).toEqual(false);
      });
    });
    describe("and a number value is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate(0);
      });
      it("should pass", () => {
        expect(result).toEqual(true);
      });
    });
  });

  // test/specs/specifications/OrSpec.js
  describe("When an Or specification is constructed", () => {
    "use strict";
    class SpecPass extends Specification {
      constructor() {
        super();
        this._spy = jasmine.createSpy("spyPass").and.returnValue(true);
      }
      _evaluate(data) {
        return this._spy(data);
      }
    }
    class SpecFail extends Specification {
      constructor() {
        super();
        this._spy = jasmine.createSpy("spyPass").and.returnValue(false);
      }
      _evaluate(data) {
        return this._spy(data);
      }
    }
    describe("with two specifications that will pass", () => {
      let specification;
      let specPassOne;
      let specPassTwo;
      let data;
      let result;
      beforeEach(() => {
        specification = new Or(specPassOne = new SpecPass(), specPassTwo = new SpecPass());
        result = specification.evaluate(data = {});
      });
      it("should call the first specification", () => {
        expect(specPassOne._spy).toHaveBeenCalledWith(data);
      });
      it("should not call the second specification", () => {
        expect(specPassTwo._spy).not.toHaveBeenCalledWith(data);
      });
      it("should evaluate to false", () => {
        expect(result).toEqual(true);
      });
    });
    describe("with two specifications that will fail", () => {
      let specification;
      let specPassOne;
      let specPassTwo;
      let data;
      let result;
      beforeEach(() => {
        specification = new Or(specPassOne = new SpecFail(), specPassTwo = new SpecFail());
        result = specification.evaluate(data = {});
      });
      it("should call the first specification", () => {
        expect(specPassOne._spy).toHaveBeenCalledWith(data);
      });
      it("should call the second specification", () => {
        expect(specPassTwo._spy).toHaveBeenCalledWith(data);
      });
      it("should evaluate to false", () => {
        expect(result).toEqual(false);
      });
    });
  });

  // specifications/Pass.js
  var Pass = class extends Specification {
    constructor() {
      super();
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return true;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Pass]";
    }
  };

  // test/specs/specifications/PassSpec.js
  describe("When a Pass specification is constructed", () => {
    "use strict";
    let specification;
    let specificationValue;
    beforeEach(() => {
      specification = new Pass(specificationValue = "ignored");
    });
    describe("and a string is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate("abc");
      });
      it("should pass", () => {
        expect(result).toEqual(true);
      });
    });
    describe("and a null value is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate(null);
      });
      it("should pass", () => {
        expect(result).toEqual(true);
      });
    });
    describe("and an undefined value is evaluated", () => {
      let result;
      beforeEach(() => {
        result = specification.evaluate(void 0);
      });
      it("should pass", () => {
        expect(result).toEqual(true);
      });
    });
  });

  // test/specs/specifications/SpecificationSpec.js
  var PassingSpecification = class extends Specification {
    _evaluate() {
      return true;
    }
  };
  var FailingSpecification = class extends Specification {
    _evaluate() {
      return false;
    }
  };
  describe("When Specification is used", () => {
    "use strict";
    it("should evaluate false by default", () => {
      expect(new Specification().evaluate({})).toEqual(false);
    });
    it("should combine two passing specifications with and", () => {
      expect(new PassingSpecification().and(new PassingSpecification()).evaluate({})).toEqual(true);
    });
    it("should combine passing and failing specifications with and", () => {
      expect(new PassingSpecification().and(new FailingSpecification()).evaluate({})).toEqual(false);
    });
    it("should combine failing and passing specifications with or", () => {
      expect(new FailingSpecification().or(new PassingSpecification()).evaluate({})).toEqual(true);
    });
    it("should combine two failing specifications with or", () => {
      expect(new FailingSpecification().or(new FailingSpecification()).evaluate({})).toEqual(false);
    });
    it("should invert passing specification with not", () => {
      expect(new PassingSpecification().not().evaluate({})).toEqual(false);
    });
    it("should invert failing specification with not", () => {
      expect(new FailingSpecification().not().evaluate({})).toEqual(true);
    });
    it("should validate and specification argument", () => {
      expect(() => new Specification().and(null)).toThrow();
    });
    it("should validate or specification argument", () => {
      expect(() => new Specification().or(null)).toThrow();
    });
  });

  // test/specs/specifications/UndefinedSpec.js
  describe("When a Undefined specification is constructed", () => {
    "use strict";
    let specification;
    beforeEach(() => {
      specification = new Undefined();
    });
    it("should not pass a null value", () => {
      expect(specification.evaluate(null)).toEqual(false);
    });
    it("should pass an implicit undefined value", () => {
      expect(specification.evaluate()).toEqual(true);
    });
    it("should pass an explicit undefined value", () => {
      expect(specification.evaluate(void 0)).toEqual(true);
    });
    it("should not pass a zero value", () => {
      expect(specification.evaluate(0)).toEqual(false);
    });
    it("should not pass an empty-length string value", () => {
      expect(specification.evaluate("")).toEqual(false);
    });
  });

  // specifications/compound/After.js
  var After = class extends Specification {
    constructor() {
      super();
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return array(data) && data.length === 2 && data[0].getIsAfter(data[1]);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[After]";
    }
  };

  // test/specs/specifications/compound/AfterSpec.js
  describe("When evaluating a compound After specification", () => {
    "use strict";
    let specification;
    beforeEach(() => {
      specification = new After();
    });
    it("should pass when the first item is after than the second item", () => {
      expect(specification.evaluate([Day.getToday(), Day.getToday().subtractDays(1)])).toBe(true);
    });
    it("should not pass when the first item is before than the second item", () => {
      expect(specification.evaluate([Day.getToday(), Day.getToday().addDays(1)])).toBe(false);
    });
    it("should not pass when the first and second items the same", () => {
      expect(specification.evaluate([Day.getToday(), Day.getToday()])).toBe(false);
    });
  });

  // specifications/compound/Before.js
  var Before = class extends Specification {
    constructor() {
      super();
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return array(data) && data.length === 2 && data[0].getIsBefore(data[1]);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Before]";
    }
  };

  // test/specs/specifications/compound/BeforeSpec.js
  describe("When evaluating a compound Before specification", () => {
    "use strict";
    let specification;
    beforeEach(() => {
      specification = new Before();
    });
    it("should not pass when the first item is after than the second item", () => {
      expect(specification.evaluate([Day.getToday(), Day.getToday().subtractDays(1)])).toBe(false);
    });
    it("should pass when the first item is before than the second item", () => {
      expect(specification.evaluate([Day.getToday(), Day.getToday().addDays(1)])).toBe(true);
    });
    it("should not pass when the first and second items the same", () => {
      expect(specification.evaluate([Day.getToday(), Day.getToday()])).toBe(false);
    });
  });

  // specifications/compound/Day.js
  var Day2 = class extends Specification {
    constructor() {
      super();
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return array(data) && data.every((item) => item instanceof Day);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Day]";
    }
  };

  // test/specs/specifications/compound/DaySpec.js
  describe("When evaluating a compound Day specification", () => {
    "use strict";
    let specification;
    beforeEach(() => {
      specification = new Day2();
    });
    it("should not pass when passed something other than an array", () => {
      expect(specification.evaluate(Day.getToday())).toBe(false);
    });
    it("should pass when passed an array where both items are Day instances", () => {
      expect(specification.evaluate([Day.getToday(), Day.getToday()])).toBe(true);
    });
    it("should not pass when passed an array where the first item is not a Day instance", () => {
      expect(specification.evaluate(["2020-09-19", Day.getToday()])).toBe(false);
    });
    it("should not pass when passed an array where the second item is not a Day instance", () => {
      expect(specification.evaluate([Day.getToday(), "2020-09-19"])).toBe(false);
    });
    it("should not pass when passed an array where neither item is a Day instance", () => {
      expect(specification.evaluate(["2020-09-19", 123456789])).toBe(false);
    });
  });

  // specifications/compound/GreaterThan.js
  var GreaterThan2 = class extends Specification {
    constructor() {
      super();
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return array(data) && data.length === 2 && data[0] > data[1];
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[GreaterThan]";
    }
  };

  // test/specs/specifications/compound/GreaterThanSpec.js
  describe("When evaluating a compound GreaterThan specification", () => {
    "use strict";
    let specification;
    beforeEach(() => {
      specification = new GreaterThan2();
    });
    it("should pass when the first item is larger than the second item", () => {
      expect(specification.evaluate([2, 1])).toBe(true);
    });
    it("should not pass when the first item is smaller than the second item", () => {
      expect(specification.evaluate([1, 2])).toBe(false);
    });
    it("should not pass when the first and second items are equal", () => {
      expect(specification.evaluate([1, 1])).toBe(false);
    });
  });

  // specifications/compound/LessThan.js
  var LessThan2 = class extends Specification {
    constructor() {
      super();
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return array(data) && data.length === 2 && data[0] < data[1];
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[LessThan]";
    }
  };

  // test/specs/specifications/compound/LessThanSpec.js
  describe("When evaluating a compound LessThan specification", () => {
    "use strict";
    let specification;
    beforeEach(() => {
      specification = new LessThan2();
    });
    it("should pass when the first item is smaller than the second item", () => {
      expect(specification.evaluate([1, 2])).toBe(true);
    });
    it("should not pass when the first item is larger than the second item", () => {
      expect(specification.evaluate([2, 1])).toBe(false);
    });
    it("should not pass when the first and second items are equal", () => {
      expect(specification.evaluate([1, 1])).toBe(false);
    });
  });

  // specifications/compound/Numeric.js
  var Numeric2 = class extends Specification {
    constructor() {
      super();
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return array(data) && data.every((item) => number(item));
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Numeric]";
    }
  };

  // test/specs/specifications/compound/NumericSpec.js
  describe("When evaluating a compound Numeric specification", () => {
    "use strict";
    let specification;
    beforeEach(() => {
      specification = new Numeric2();
    });
    it("should not pass when passed something other than an array", () => {
      expect(specification.evaluate(1)).toBe(false);
    });
    it("should pass when passed an array where both items are numbers", () => {
      expect(specification.evaluate([1, 2])).toBe(true);
    });
    it("should not pass when passed an array where the first item is not a number", () => {
      expect(specification.evaluate(["1", 2])).toBe(false);
    });
    it("should not pass when passed an array where the second item is not a number", () => {
      expect(specification.evaluate([1, "2"])).toBe(false);
    });
    it("should not pass when passed an array where neither item is a number", () => {
      expect(specification.evaluate(["1", "2"])).toBe(false);
    });
  });

  // specifications/compound/SameDay.js
  var SameDay = class extends Specification {
    constructor() {
      super();
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return array(data) && data.length === 2 && data[0].getIsEqual(data[1]);
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[SameDay]";
    }
  };

  // test/specs/specifications/compound/SameDaySpec.js
  describe("When evaluating a compound SameDay specification", () => {
    "use strict";
    let specification;
    beforeEach(() => {
      specification = new SameDay();
    });
    it("should not pass when the first item is after than the second item", () => {
      expect(specification.evaluate([Day.getToday(), Day.getToday().subtractDays(1)])).toBe(false);
    });
    it("should not pass when the first item is before than the second item", () => {
      expect(specification.evaluate([Day.getToday(), Day.getToday().addDays(1)])).toBe(false);
    });
    it("should pass when the first and second items the same", () => {
      expect(specification.evaluate([Day.getToday(), Day.getToday()])).toBe(true);
    });
  });

  // specifications/compound/Within.js
  var Within = class extends Specification {
    #tolerance;
    /**
     * @param {number} tolerance
     */
    constructor(tolerance) {
      super();
      this.#tolerance = tolerance;
    }
    /**
     * @protected
     * @override
     * @param {*} data
     * @returns {boolean}
     */
    _evaluate(data) {
      return array(data) && data.length === 2 && Math.abs(data[0] - data[1]) <= this.#tolerance;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Within]";
    }
  };

  // test/specs/specifications/compound/WithinSpec.js
  describe("When evaluating a compound Within specification (with a tolerance of 5)", () => {
    "use strict";
    let specification;
    let tolerance;
    beforeEach(() => {
      specification = new Within(tolerance = 5);
    });
    it("should not pass when passed something other than an array", () => {
      expect(specification.evaluate()).toBe(false);
    });
    it("should pass when passed an array where the first item is -1 and the second item is 3", () => {
      expect(specification.evaluate([-1, 3])).toBe(true);
    });
    it("should pass when passed an array where the first item is 3 and the second item is -1", () => {
      expect(specification.evaluate([3, -1])).toBe(true);
    });
    it("should pass when passed an array where the first item is -1 and the second item is 4", () => {
      expect(specification.evaluate([-1, 4])).toBe(true);
    });
    it("should pass when passed an array where the first item is 4 and the second item is -1", () => {
      expect(specification.evaluate([4, -1])).toBe(true);
    });
    it("should not pass when passed an array where the first item is -1 and the second item is 5", () => {
      expect(specification.evaluate([-1, 5])).toBe(false);
    });
    it("should not pass when passed an array where the first item is 5 and the second item is -1", () => {
      expect(specification.evaluate([5, -1])).toBe(false);
    });
    it("should pass when passed an array where the first item is 6 and the second item is 11", () => {
      expect(specification.evaluate([6, 11])).toBe(true);
    });
    it("should pass when passed an array where the first item is 11 and the second item is 6", () => {
      expect(specification.evaluate([11, 6])).toBe(true);
    });
    it("should pass when passed an array where the first item is 5 and the second item is 11", () => {
      expect(specification.evaluate([5, 11])).toBe(false);
    });
    it("should pass when passed an array where the first item is 11 and the second item is 5", () => {
      expect(specification.evaluate([11, 5])).toBe(false);
    });
  });

  // timing/Scheduler.js
  var Scheduler = class _Scheduler extends Disposable {
    #timeoutBindings;
    #intervalBindings;
    constructor() {
      super();
      this.#timeoutBindings = {};
      this.#intervalBindings = {};
    }
    /**
     * Schedules an action to execute in the future, returning a Promise.
     *
     * @public
     * @async
     * @param {Function} actionToSchedule - The action to execute.
     * @param {number} millisecondDelay - Milliseconds before the action can be started.
     * @param {string=} actionDescription - A description of the action, used for logging purposes.
     * @returns {Promise}
     */
    async schedule(actionToSchedule, millisecondDelay, actionDescription) {
      argumentIsRequired(actionToSchedule, "actionToSchedule", Function);
      argumentIsRequired(millisecondDelay, "millisecondDelay", Number);
      argumentIsOptional(actionDescription, "actionDescription", String);
      if (this.disposed) {
        throw new Error("The Scheduler has been disposed.");
      }
      let token;
      const schedulePromise = build((resolveCallback, rejectCallback) => {
        const wrappedAction = () => {
          const disposable = this.#timeoutBindings[token];
          if (disposable) {
            disposable.dispose();
          }
          try {
            resolveCallback(actionToSchedule());
          } catch (e) {
            rejectCallback(e);
          }
        };
        token = setTimeout(wrappedAction, millisecondDelay);
        this.#timeoutBindings[token] = Disposable.fromAction(() => {
          clearTimeout(token);
          delete this.#timeoutBindings[token];
        });
      });
      return schedulePromise;
    }
    /**
     * @public
     * @param {Function} actionToRepeat
     * @param {number} millisecondInterval
     * @param {string=} actionDescription
     * @returns {Disposable}
     */
    repeat(actionToRepeat, millisecondInterval, actionDescription) {
      argumentIsRequired(actionToRepeat, "actionToRepeat", Function);
      argumentIsRequired(millisecondInterval, "millisecondInterval", Number);
      argumentIsOptional(actionDescription, "actionDescription", String);
      if (this.disposed) {
        throw new Error("The Scheduler has been disposed.");
      }
      const wrappedAction = () => {
        try {
          actionToRepeat();
        } catch {
        }
      };
      const token = setInterval(wrappedAction, millisecondInterval);
      this.#intervalBindings[token] = Disposable.fromAction(() => {
        clearInterval(token);
        delete this.#intervalBindings[token];
      });
      return this.#intervalBindings[token];
    }
    /**
     * Attempts an action, repeating if necessary, using an exponential backoff.
     *
     * @public
     * @async
     * @param {Function} actionToBackoff - The action to attempt. If it fails -- because an error is thrown, a promise is rejected, or the function returns a falsey value -- the action will be invoked again.
     * @param {number=} millisecondDelay - The amount of time to wait to execute the action. Subsequent failures are multiply this value by 2 ^ [number of failures]. So, a 1000 millisecond backoff would schedule attempts using the following delays: 0, 1000, 2000, 4000, 8000, etc. If not specified, the first attempt will execute immediately, then a value of 1000 will be used.
     * @param {string=} actionDescription - Description of the action to attempt, used for logging purposes.
     * @param {number=} maximumAttempts - The number of attempts to before giving up.
     * @param {Function=} failureCallback - If provided, will be invoked if a function is considered to be failing.
     * @param {object=} failureValue - If provided, will consider the result to have failed, if this value is returned (a deep equality check is used). If not provided, an undefined value will trigger a retry.
     * @param {number=} maximumDelay - The maximum delay that can be used for the backoff. If not provided, the delay will continue to double until the maximum number of attempts is reached.
     * @returns {Promise}
     */
    async backoff(actionToBackoff, millisecondDelay, actionDescription, maximumAttempts, failureCallback, failureValue, maximumDelay) {
      argumentIsRequired(actionToBackoff, "actionToBackoff", Function);
      argumentIsOptional(millisecondDelay, "millisecondDelay", Number);
      argumentIsOptional(actionDescription, "actionDescription", String);
      argumentIsOptional(maximumAttempts, "maximumAttempts", Number);
      argumentIsOptional(failureCallback, "failureCallback", Function);
      argumentIsOptional(maximumDelay, "maximumDelay", Number);
      if (this.disposed) {
        throw new Error("The Scheduler has been disposed.");
      }
      const processAction = async (attempts2) => {
        let delay;
        if (attempts2 === 0) {
          delay = 0;
        } else {
          delay = (millisecondDelay || 1e3) * Math.pow(2, attempts2 - 1);
          if (maximumDelay && delay > maximumDelay) {
            delay = maximumDelay;
          }
        }
        try {
          let result;
          if (delay === 0) {
            result = await actionToBackoff();
          } else {
            result = await this.schedule(actionToBackoff, delay, `Attempt [ ${attempts2} ] for [ ${actionDescription || "unnamed action"} ]`);
          }
          if (!undef(failureValue) && equals(result, failureValue)) {
            throw `Attempt [ ${attempts2} ] for [ ${actionDescription || "unnamed action"} ] failed due to invalid result`;
          }
          return result;
        } catch (e) {
          if (fn(failureCallback)) {
            failureCallback(attempts2);
          }
          throw e;
        }
      };
      let attempts = 0;
      const processActionRecursive = async () => {
        try {
          const result = await processAction(attempts++);
          return result;
        } catch (e) {
          if (maximumAttempts > 0 && attempts === maximumAttempts) {
            const message = `Maximum failures reached for ${actionDescription || "unnamed action"}`;
            if (object(e)) {
              e.backoff = message;
              throw e;
            }
            throw message;
          }
          return processActionRecursive();
        }
      };
      return processActionRecursive();
    }
    /**
     * @protected
     * @override
     */
    _onDispose() {
      keys(this.#timeoutBindings).forEach((key) => {
        this.#timeoutBindings[key].dispose();
      });
      keys(this.#intervalBindings).forEach((key) => {
        this.#intervalBindings[key].dispose();
      });
      this.#timeoutBindings = null;
      this.#intervalBindings = null;
    }
    /**
     * @public
     * @static
     * @async
     * @param {Function} actionToSchedule
     * @param {number} millisecondDelay
     * @param {string=} actionDescription
     * @returns {Promise}
     */
    static async schedule(actionToSchedule, millisecondDelay, actionDescription) {
      const scheduler = new _Scheduler();
      let result;
      try {
        result = await scheduler.schedule(actionToSchedule, millisecondDelay, actionDescription);
      } finally {
        scheduler.dispose();
      }
      return result;
    }
    /**
     * @public
     * @static
     * @async
     * @param {Function} actionToBackoff
     * @param {number} millisecondDelay
     * @param {string=} actionDescription
     * @param {number=} maximumAttempts
     * @param {Function=} failureCallback
     * @param {object=} failureValue
     * @param {number=} maximumDelay
     * @returns {Promise}
     */
    static async backoff(actionToBackoff, millisecondDelay, actionDescription, maximumAttempts, failureCallback, failureValue, maximumDelay) {
      const scheduler = new _Scheduler();
      let result;
      try {
        result = await scheduler.backoff(actionToBackoff, millisecondDelay, actionDescription, maximumAttempts, failureCallback, failureValue, maximumDelay);
      } finally {
        scheduler.dispose();
      }
      return result;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Scheduler]";
    }
  };

  // timing/RateLimiter.js
  var RateLimiter = class extends Disposable {
    #windowMaximumCount;
    #windowDurationMilliseconds;
    #scheduler;
    #workQueue;
    #windowStart;
    #windowCounter;
    /**
     * @param {number} windowMaximumCount - The maximum number of items which can be processed during a timeframe (positive integer).
     * @param {number} windowDurationMilliseconds - The number of milliseconds in the timeframe (positive integer).
     */
    constructor(windowMaximumCount, windowDurationMilliseconds) {
      super();
      argumentIsValid(windowMaximumCount, "windowMaximumCount", (x) => integer(x) && positive(x));
      argumentIsValid(windowDurationMilliseconds, "windowDurationMilliseconds", (x) => integer(x) && positive(x));
      this.#windowMaximumCount = windowMaximumCount;
      this.#windowDurationMilliseconds = windowDurationMilliseconds;
      this.#scheduler = new Scheduler();
      this.#workQueue = new Queue();
      this.#windowStart = null;
      this.#windowCounter = 0;
    }
    /**
     * Adds an item to the work queue and returns a promise that will
     * resolve after the item completes execution.
     *
     * @public
     * @param {Function} actionToEnqueue - The action to execute.
     * @returns {Promise}
     */
    enqueue(actionToEnqueue) {
      return build((resolveCallback, rejectCallback) => {
        argumentIsRequired(actionToEnqueue, "actionToEnqueue", Function);
        if (this.disposed) {
          throw new Error("Unable to enqueue action, the rate limiter has been disposed.");
        }
        this.#workQueue.enqueue(async () => {
          try {
            const result = await actionToEnqueue();
            resolveCallback(result);
          } catch (error) {
            rejectCallback(error);
          } finally {
            this.#checkStart();
          }
        });
        this.#checkStart();
      });
    }
    /**
     * @protected
     * @override
     */
    _onDispose() {
      this.#scheduler.dispose();
      this.#workQueue = null;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[RateLimiter]";
    }
    #checkStart() {
      if (this.disposed) {
        return;
      }
      if (this.#workQueue.empty()) {
        return;
      }
      if (this.#windowStart === null) {
        const timestamp = /* @__PURE__ */ new Date();
        this.#windowStart = timestamp.getTime();
        this.#windowCounter = 0;
        const resetWindow = () => {
          this.#windowStart = null;
          this.#windowCounter = 0;
          this.#checkStart();
        };
        this.#scheduler.schedule(resetWindow, this.#windowDurationMilliseconds, "Rate Limiter Window Reset");
      }
      if (this.#windowCounter < this.#windowMaximumCount) {
        this.#windowCounter = this.#windowCounter + 1;
        const actionToExecute = this.#workQueue.dequeue();
        actionToExecute();
      }
    }
  };

  // test/specs/timing/RateLimiterSpec.js
  describe("When a RateLimiter is constructed (1 execution per 25 milliseconds)", () => {
    "use strict";
    let limiter;
    let windowMaximumCount;
    let windowDurationMilliseconds;
    let concurrency;
    beforeEach(() => {
      limiter = new RateLimiter(windowMaximumCount = 1, windowDurationMilliseconds = 25, concurrency = null);
    });
    describe("and tasks are scheduled", () => {
      let spies;
      let promises;
      let start;
      beforeEach(() => {
        start = /* @__PURE__ */ new Date();
        spies = [];
        promises = [];
        for (let i = 0; i < 10; i++) {
          let spy = jasmine.createSpy("spy");
          spies.push(spy);
          promises.push(limiter.enqueue(spy));
        }
      });
      it("the tasks should serialized", async () => {
        for (let i = 0; i < promises.length; i++) {
          await promises[i];
          for (let j = 0; j < spies.length; j++) {
            let count;
            if (j > i) {
              count = 0;
            } else {
              count = 1;
            }
            expect(spies[j].calls.count()).toEqual(count);
          }
        }
      });
      it("the tasks not finish before the earliest possible moment", async () => {
        for (let i = 0; i < promises.length; i++) {
          await promises[i];
          let end = /* @__PURE__ */ new Date();
          let duration = end.getTime() - start.getTime();
          let shortestPossibleDuration = Math.floor(i / windowMaximumCount) * windowDurationMilliseconds;
          expect(duration + 1).not.toBeLessThan(shortestPossibleDuration);
        }
      });
    });
    describe("and failing tasks are scheduled", () => {
      let spies;
      let promises;
      let error;
      let start;
      beforeEach(() => {
        start = /* @__PURE__ */ new Date();
        spies = [];
        promises = [];
        error = new Error("oops");
        const createSpy = () => {
          return jasmine.createSpy("spy").and.callFake(() => {
            throw error;
          });
        };
        for (let i = 0; i < 2; i++) {
          let spy = createSpy();
          spies.push(spy);
          promises.push(limiter.enqueue(spy));
        }
      });
      it("each task should be executed with correct timing", async () => {
        for (let i = 0; i < promises.length; i++) {
          try {
            await promises[i];
          } catch (e) {
            let end = /* @__PURE__ */ new Date();
            let duration = end.getTime() - start.getTime();
            let shortestPossibleDuration = Math.floor(i / windowMaximumCount) * windowDurationMilliseconds;
            expect(duration + 1).not.toBeLessThan(shortestPossibleDuration);
          }
        }
      });
    });
  });
  describe("When a RateLimiter is constructed (2 execution per 25 milliseconds)", () => {
    "use strict";
    let limiter;
    let windowMaximumCount;
    let windowDurationMilliseconds;
    let concurrency;
    beforeEach(() => {
      limiter = new RateLimiter(windowMaximumCount = 2, windowDurationMilliseconds = 25, concurrency = null);
    });
    describe("and tasks are scheduled", () => {
      let spies;
      let promises;
      let start;
      beforeEach(() => {
        start = /* @__PURE__ */ new Date();
        spies = [];
        promises = [];
        for (let i = 0; i < 10; i++) {
          let spy = jasmine.createSpy("spy");
          spies.push(spy);
          promises.push(limiter.enqueue(spy));
        }
      });
      it("the tasks not finish before the earliest possible moment", async () => {
        for (let i = 0; i < promises.length; i++) {
          await promises[i];
          let end = /* @__PURE__ */ new Date();
          let duration = end.getTime() - start.getTime();
          let shortestPossibleDuration = Math.floor(i / windowMaximumCount) * windowDurationMilliseconds;
          expect(duration + 1).not.toBeLessThan(shortestPossibleDuration);
        }
      });
    });
  });

  // test/specs/timing/SchedulerSpec.js
  describe("When a Scheduler is constructed", () => {
    "use strict";
    let scheduler;
    beforeEach(() => {
      scheduler = new Scheduler();
    });
    describe("and task is scheduled", () => {
      let spy;
      let milliseconds;
      let promise;
      beforeEach(() => {
        promise = scheduler.schedule(spy = jasmine.createSpy("spy"), milliseconds = 10, "A scheduled task");
      });
      it("should not execute the task synchronously", () => {
        expect(spy).not.toHaveBeenCalled();
      });
      it("should execute the task asynchronously", async () => {
        await promise;
        expect(spy.calls.count()).toEqual(1);
      });
    });
    describe("and a task is repeated", () => {
      let binding;
      let spy;
      beforeEach(async () => {
        spy = jasmine.createSpy("spy");
        binding = scheduler.repeat(spy, 5, "A repeated task");
        await new Promise((resolve) => setTimeout(resolve, 15));
        binding.dispose();
      });
      it("should return a Disposable instance", () => {
        expect(binding instanceof Disposable).toEqual(true);
      });
      it("should execute the task repeatedly", () => {
        expect(spy.calls.count() > 0).toEqual(true);
      });
    });
    describe("and is disposed", () => {
      beforeEach(() => {
        scheduler.dispose();
      });
      describe("and a task is scheduled", () => {
        let spy;
        let success;
        beforeEach(async () => {
          try {
            await scheduler.schedule(spy = jasmine.createSpy("spy"), 10, "A scheduled task");
            success = true;
          } catch (e) {
            success = false;
          }
        });
        it("should reject the promise", () => {
          expect(success).toEqual(false);
        });
        it("should not invoke the underlying task", () => {
          expect(spy).not.toHaveBeenCalled();
        });
      });
    });
  });
  describe("When a backoff is used", () => {
    "use strict";
    let scheduler;
    beforeEach(() => {
      scheduler = new Scheduler();
    });
    describe("that succeeds immediately", () => {
      let spyAction;
      let spyFailure;
      let actualResult;
      let successfulResult;
      beforeEach(async () => {
        spyAction = jasmine.createSpy("spyAction").and.callFake(() => {
          successfulResult = "ok computer";
          return successfulResult;
        });
        spyFailure = jasmine.createSpy("spyFailure");
        actualResult = await scheduler.backoff(spyAction, 5, "succeeds immediately", 1, spyFailure, void 0, 100);
      });
      it('should call the "backoff" action one time', () => {
        expect(spyAction.calls.count()).toEqual(1);
      });
      it("the promise result should match the expected result", () => {
        expect(actualResult).toEqual(successfulResult);
      });
      it('should never call the "failure" action', () => {
        expect(spyFailure.calls.count()).toEqual(0);
      });
    });
    describe("that fails once before succeeding (by throwing error)", () => {
      let spyAction;
      let spyFailure;
      let actualResult;
      let successfulResult;
      let x;
      beforeEach(async () => {
        x = 0;
        spyAction = jasmine.createSpy("spyAction").and.callFake(() => {
          if (++x > 1) {
            successfulResult = "ok computer";
            return successfulResult;
          } else {
            throw new Error("nope...");
          }
        });
        spyFailure = jasmine.createSpy("spyFailure");
        actualResult = await scheduler.backoff(spyAction, 5, "succeeds immediately", 5, spyFailure, void 0, 100);
      });
      it('should call the "backoff" action two times', () => {
        expect(spyAction.calls.count()).toEqual(2);
      });
      it("the promise result should match the expected result", () => {
        expect(actualResult).toEqual(successfulResult);
      });
      it('the "failure" action should be called once', () => {
        expect(spyFailure.calls.count()).toEqual(1);
      });
    });
    describe('that fails twice before succeeding (by returning a specific "failure" value)', () => {
      let spyAction;
      let spyFailure;
      let actualResult;
      let successfulResult;
      let x;
      beforeEach(async () => {
        x = 0;
        spyAction = jasmine.createSpy("spyAction").and.callFake(() => {
          if (++x > 2) {
            successfulResult = ["ok computer"];
            return successfulResult;
          } else {
            return [];
          }
        });
        spyFailure = jasmine.createSpy("spyFailure");
        actualResult = await scheduler.backoff(spyAction, 5, "succeeds immediately", 5, spyFailure, [], 100);
      });
      it('should call the "backoff" action three times', () => {
        expect(spyAction.calls.count()).toEqual(3);
      });
      it("the promise result should match the expected result", () => {
        expect(actualResult).toEqual(successfulResult);
      });
      it('the "failure" action should be called twice', () => {
        expect(spyFailure.calls.count()).toEqual(2);
      });
    });
    describe("final failure is declared after three attempts", () => {
      let spyAction;
      let spyFailure;
      let actualResult;
      beforeEach(async () => {
        spyAction = jasmine.createSpy("spyAction").and.callFake(() => {
          throw new Error("not gonna happen");
        });
        spyFailure = jasmine.createSpy("spyFailure");
        try {
          await scheduler.backoff(spyAction, 5, "succeeds immediately", 3, spyFailure, [], 100);
        } catch (r) {
          actualResult = r;
        }
      });
      it('should call the "backoff" action three times', () => {
        expect(spyAction.calls.count()).toEqual(3);
      });
      it('the "failure" action should be called three times', () => {
        expect(spyFailure.calls.count()).toEqual(3);
      });
      it("the promise should be rejected (with an Error instance)", () => {
        expect(actualResult instanceof Error).toEqual(true);
      });
    });
    describe('final failure is declared after three attempts (using the "failureValue" argument)', () => {
      let spyAction;
      let spyFailure;
      let actualResult;
      beforeEach(async () => {
        spyAction = jasmine.createSpy("spyAction").and.callFake(() => {
          return "boom";
        });
        spyFailure = jasmine.createSpy("spyFailure");
        try {
          await scheduler.backoff(spyAction, 5, "detonate", 3, spyFailure, "boom", 100);
        } catch (r) {
          actualResult = r;
        }
      });
      it('should call the "backoff" action three times', () => {
        expect(spyAction.calls.count()).toEqual(3);
      });
      it('the "failure" action should be called three times', () => {
        expect(spyFailure.calls.count()).toEqual(3);
      });
      it("the promise should be rejected", () => {
        expect(actualResult).toEqual("Maximum failures reached for detonate");
      });
    });
    describe("that respects the maximum delay", () => {
      let spyAction;
      let spyFailure;
      let delays;
      beforeEach(async () => {
        delays = [];
        spyAction = jasmine.createSpy("spyAction").and.callFake(() => {
          throw new Error("nope...");
        });
        spyFailure = jasmine.createSpy("spyFailure");
        spyOn(scheduler, "schedule").and.callFake((action, delay) => {
          delays.push(delay);
          return action();
        });
        try {
          await scheduler.backoff(spyAction, 5, "test max delay", 5, spyFailure, void 0, 20);
        } catch (e) {
        }
      });
      it("should not exceed the maximum delay", () => {
        expect(delays.every((delay) => delay <= 20)).toBe(true);
      });
    });
  });

  // timing/Serializer.js
  var Serializer = class extends Disposable {
    #workQueue;
    #enqueued;
    #processed;
    #running;
    constructor() {
      super();
      this.#workQueue = new Queue();
      this.#enqueued = 0;
      this.#processed = 0;
      this.#running = false;
    }
    /**
     * Gets the sequence of the item that was last processed.
     *
     * @public
     * @returns {number}
     */
    getCurrent() {
      return this.#processed;
    }
    /**
     * The total number of items that have been added to the queue.
     *
     * @public
     * @returns {number}
     */
    getTotal() {
      return this.#enqueued;
    }
    /**
     * The number of items that are currently pending.
     *
     * @public
     * @returns {number}
     */
    getPending() {
      return this.#enqueued - this.#processed;
    }
    /**
     * Indicates if a work item is currently being processed.
     *
     * @public
     * @returns {boolean}
     */
    getRunning() {
      return this.#running;
    }
    /**
     * Adds a new action to the processing queue. If the action
     * is asynchronous, the action should return a promise.
     *
     * @public
     * @param {Function} actionToEnqueue
     * @returns {Promise} - A promise which resolves once the action has been processed.
     */
    enqueue(actionToEnqueue) {
      return build((resolveCallback, rejectCallback) => {
        argumentIsRequired(actionToEnqueue, "actionToEnqueue", Function);
        if (this.getIsDisposed()) {
          throw new Error("Unable to add action to the Serializer, it has been disposed.");
        }
        this.#enqueued = this.#enqueued + 1;
        this._getWorkQueue().enqueue(async () => {
          try {
            if (this.getIsDisposed()) {
              throw new Error("Unable to process Serializer action, the serializer has been disposed.");
            }
            this.#processed = this.#processed + 1;
            const result = await actionToEnqueue();
            resolveCallback(result);
          } catch (error) {
            rejectCallback(error);
          }
        });
        this.#checkStart();
      });
    }
    /**
     * Allows an inheriting class to override the internal {@link Queue} implementation.
     *
     * @protected
     * @returns {Queue|*}
     */
    _getWorkQueue() {
      return this.#workQueue;
    }
    #checkStart() {
      const workQueue = this._getWorkQueue();
      if (workQueue.empty() || this.#running) {
        return;
      }
      this.#running = true;
      const actionToExecute = workQueue.dequeue();
      const run = async () => {
        await actionToExecute();
        this.#running = false;
        this.#checkStart();
      };
      run();
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Serializer]";
    }
  };

  // test/specs/timing/SerializerSpec.js
  describe("When a Serializer is used to schedule four tasks", () => {
    "use strict";
    let serializer;
    let spies;
    let promises;
    let results;
    beforeEach(() => {
      serializer = new Serializer();
      spies = [];
      promises = [];
      results = [];
      for (let i = 0; i < 4; i++) {
        let spy = getSpy(results, false);
        spies.push(spy);
        promises.push(serializer.enqueue(spy));
      }
    });
    it("should expose the initial counters", () => {
      expect({
        current: serializer.getCurrent(),
        total: serializer.getTotal(),
        pending: serializer.getPending(),
        running: serializer.getRunning()
      }).toEqual({
        current: 1,
        total: 4,
        pending: 3,
        running: true
      });
    });
    describe("and the tasks complete", () => {
      beforeEach(async () => {
        await Promise.all(promises);
      });
      it("should expose the completed counters", () => {
        expect({
          current: serializer.getCurrent(),
          total: serializer.getTotal(),
          pending: serializer.getPending(),
          running: serializer.getRunning()
        }).toEqual({
          current: 4,
          total: 4,
          pending: 0,
          running: false
        });
      });
      it("the first task should have been executed", () => {
        expect(spies[0]).toHaveBeenCalled();
      });
      it("the second task should have been executed", () => {
        expect(spies[1]).toHaveBeenCalled();
      });
      it("the third task should have been executed", () => {
        expect(spies[2]).toHaveBeenCalled();
      });
      it("the fourth task should have been executed", () => {
        expect(spies[3]).toHaveBeenCalled();
      });
      it("the first task should complete before the second task starts", () => {
        expect(results[0].end <= results[1].start).toEqual(true);
      });
      it("the second task should complete before the third task starts", () => {
        expect(results[1].end <= results[2].start).toEqual(true);
      });
      it("the third task should complete before the fourth task starts", () => {
        expect(results[2].end <= results[3].start).toEqual(true);
      });
    });
  });
  describe("When a Serializer is used to schedule a task that throws", () => {
    let serializer;
    let reject;
    beforeEach(async () => {
      serializer = new Serializer();
      reject = false;
      try {
        await serializer.enqueue(() => {
          throw new Error("Boom");
        });
      } catch (e) {
        reject = true;
      }
    });
    it("should reject the promise", () => {
      expect(reject).toEqual(true);
    });
  });
  describe("When a Serializer is used to schedule a task that rejects", () => {
    let serializer;
    let reject;
    beforeEach(async () => {
      serializer = new Serializer();
      reject = false;
      try {
        await serializer.enqueue(async () => {
          throw "Boom Boom";
        });
      } catch (e) {
        reject = true;
      }
    });
    it("should reject the promise", () => {
      expect(reject).toEqual(true);
    });
  });
  function getSpy(results, fail) {
    return jasmine.createSpy("spy").and.callFake(() => {
      return new Promise((resolveCallback, rejectCallback) => {
        let start = /* @__PURE__ */ new Date();
        setTimeout(() => {
          let end = /* @__PURE__ */ new Date();
          results.push({
            start: start.getTime(),
            end: end.getTime()
          });
          if (fail) {
            rejectCallback();
          } else {
            resolveCallback();
          }
        }, 5);
      });
    });
  }

  // timing/WindowCounter.js
  var WindowCounter = class {
    #duration;
    #windows;
    #maximum;
    #previousCount;
    /**
     * @param {number} duration
     * @param {number} windows
     */
    constructor(duration, windows) {
      argumentIsRequired(duration, "duration", Number);
      argumentIsRequired(windows, "windows", Number);
      this.#duration = duration;
      this.#windows = [new Window(getTime(), this.#duration)];
      this.#maximum = Math.max(windows, 2);
      this.#previousCount = 0;
    }
    /**
     * @public
     * @param {number} count
     */
    increment(count) {
      argumentIsRequired(count, "count", Number);
      this.#advance().increment(count);
    }
    /**
     * @public
     * @returns {number}
     */
    getCurrent() {
      return this.#advance().getCount();
    }
    /**
     * @public
     * @returns {number}
     */
    getPrevious() {
      this.#advance();
      let returnVal;
      if (this.#windows.length > 1) {
        returnVal = this.#windows[1].getCount();
      } else {
        returnVal = 0;
      }
      return returnVal;
    }
    /**
     * @public
     * @returns {number}
     */
    getAverage() {
      const previousWindows = this.#windows.length - 1;
      let returnVal;
      if (previousWindows > 0) {
        returnVal = this.#previousCount / previousWindows;
      } else {
        returnVal = 0;
      }
      return returnVal;
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[WindowCounter]";
    }
    #advance() {
      const now = getTime();
      while (!this.#windows[0].contains(now)) {
        const previous = this.#windows[0];
        const current = new Window(previous.getEnd(), this.#duration);
        this.#windows.unshift(current);
        this.#previousCount = this.#previousCount + previous.getCount();
        if (this.#windows.length > this.#maximum) {
          const removed = this.#windows.pop();
          this.#previousCount = this.#previousCount - removed.getCount();
        }
      }
      return this.#windows[0];
    }
  };
  function getTime() {
    return (/* @__PURE__ */ new Date()).getTime();
  }
  var Window = class {
    #start;
    #end;
    #count;
    constructor(start, duration) {
      this.#start = start;
      this.#end = start + duration;
      this.#count = 0;
    }
    contains(now) {
      return !(now < this.#start || now > this.#end);
    }
    increment(count) {
      this.#count = this.#count + count;
    }
    getStart() {
      return this.#start;
    }
    getEnd() {
      return this.#end;
    }
    getCount() {
      return this.#count;
    }
  };

  // test/specs/timing/WindowCounterSpec.js
  describe("When a WindowCounter is constructed", () => {
    "use strict";
    let duration;
    let windows;
    let counter;
    beforeEach(() => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2020, 0, 1));
    });
    afterEach(() => {
      jasmine.clock().uninstall();
    });
    beforeEach(() => {
      counter = new WindowCounter(duration = 15, windows = 100);
    });
    describe("and the counter is immediately incremented", () => {
      let a;
      beforeEach(() => {
        counter.increment(a = 42);
      });
      it("the current count should be the amount added", () => {
        expect(counter.getCurrent()).toEqual(a);
      });
      describe("and the counter is immediately incremented, again", () => {
        let b;
        beforeEach(() => {
          counter.increment(b = 99);
        });
        it("the current count should be the sum of the amounts added", () => {
          expect(counter.getCurrent()).toEqual(a + b);
        });
      });
      describe("and the counter is incremented after the current window expires", () => {
        let b;
        beforeEach((done) => {
          setTimeout(() => {
            counter.increment(b = 3);
            done();
          }, duration + duration / 2);
          jasmine.clock().tick(duration + duration / 2);
        });
        it("the previous count should be the sum of the previous window", () => {
          expect(counter.getPrevious()).toEqual(a);
        });
        it("the current count should be the amount added", () => {
          expect(counter.getCurrent()).toEqual(b);
        });
        it("the average count should be the sum of the previous window", () => {
          expect(counter.getAverage()).toEqual(a);
        });
      });
    });
  });
})();
