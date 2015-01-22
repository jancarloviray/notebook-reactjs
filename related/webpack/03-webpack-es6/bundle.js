/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _prototypeProperties = function (child, staticProps, instanceProps) {
	  if (staticProps) Object.defineProperties(child, staticProps);
	  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
	};

	var _get = function get(object, property, receiver) {
	  var desc = Object.getOwnPropertyDescriptor(object, property);

	  if (desc === undefined) {
	    var parent = Object.getPrototypeOf(object);

	    if (parent === null) {
	      return undefined;
	    } else {
	      return get(parent, property, receiver);
	    }
	  } else if ("value" in desc && desc.writable) {
	    return desc.value;
	  } else {
	    var getter = desc.get;
	    if (getter === undefined) {
	      return undefined;
	    }
	    return getter.call(receiver);
	  }
	};

	var _inherits = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }
	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) subClass.__proto__ = superClass;
	};

	var _interopRequire = function (obj) {
	  return obj && (obj["default"] || obj);
	};

	var Person = _interopRequire(__webpack_require__(1));

	var Employee = (function (Person) {
	  function Employee() {
	    var name = arguments[0] === undefined ? "Jan Carlo" : arguments[0];
	    var title = arguments[1] === undefined ? "Software Engineer" : arguments[1];
	    _get(Object.getPrototypeOf(Employee.prototype), "constructor", this).call(this, name);
	    this.title = title;
	  }

	  _inherits(Employee, Person);

	  _prototypeProperties(Employee, null, {
	    info: {
	      value: function info() {
	        return this.name + ", " + this.title;
	      },
	      writable: true,
	      enumerable: true,
	      configurable: true
	    }
	  });

	  return Employee;
	})(Person);

	var jc = new Employee();
	console.log(jc.info());

	console.log("hi");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _prototypeProperties = function (child, staticProps, instanceProps) {
	  if (staticProps) Object.defineProperties(child, staticProps);
	  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
	};

	var Person = (function () {
	  function Person() {
	    var name = arguments[0] === undefined ? "Joe" : arguments[0];
	    this.name = name;
	  }

	  _prototypeProperties(Person, null, {
	    info: {
	      value: function info() {
	        return this.name;
	      },
	      writable: true,
	      enumerable: true,
	      configurable: true
	    }
	  });

	  return Person;
	})();

	module.exports = Person;

/***/ }
/******/ ])