/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./assets/js/indexDb.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/js/indexDb.js":
/*!******************************!*\
  !*** ./assets/js/indexDb.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var db;\nvar budgetVersion; //create new db request for budget\n\nvar request = indexedDB.open('budgetDb', budgetVersion || 21);\n\nrequest.onupgradeneeded = function (evt) {\n  console.log('upgrade needed in indexDb');\n  var oldVersion = evt.oldVersion;\n  var newVersion = evt.newVersion || db.version;\n  console.log(\"DB updated from version \".concat(oldVersion, \" to \").concat(newVersion));\n  db = evt.target.result;\n\n  if (db.objectStoreNames.length === 0) {\n    db.createObjectStore('BudgetStore', {\n      autoIncrement: true\n    });\n  }\n};\n\nrequest.onerror = function (evt) {\n  console.log(\"oh no, \".concat(evt.target.errorCode));\n};\n\nfunction checkDatabase() {\n  console.log('checkDatabase-----');\n  var transaction = db.transaction(['BudgetStore'], 'readwrite');\n  var store = transaction.objectStore('BudgetStore');\n  var getAll = store.getAll(); // if request was successful\n\n  getAll.onsuccess = function () {\n    if (getAll.result.length > 0) {\n      fetch(\"/api/transaction/bulk\", {\n        method: 'POST',\n        body: JSON.stringify(getAll.result),\n        headers: {\n          Accept: 'application/json, text/plain, */*',\n          'Content-Type': 'application/json'\n        }\n      }).then(function (response) {\n        return response.json();\n      }).then(function (res) {\n        if (res.length !== 0) {\n          // Open another transaction to BudgetStore with the ability to read and write\n          transaction = db.transaction(['BudgetStore'], 'readwrite'); // Assign the current store to a variable\n\n          var currentStore = transaction.objectStore('BudgetStore'); // Clear existing entries because our bulk add was successful\n\n          currentStore.clear();\n          console.log('Clearing store');\n        }\n      });\n    }\n  };\n}\n\nrequest.onsuccess = function (evt) {\n  console.log('you did it');\n  db = evt.target.result;\n\n  if (navigator.onLine) {\n    console.log('Backend online!');\n    checkDatabase();\n  }\n};\n\nvar saveRecord = function saveRecord(record) {\n  console.log('save record invoked');\n  var transaction = db.transaction(['BudgetStore', 'readwrite']);\n  var store = transaction.objectStore('BudgetStore');\n  store.add(record);\n};\n\nwindow.addEventListener('online', checkDatabase);\n\n//# sourceURL=webpack:///./assets/js/indexDb.js?");

/***/ })

/******/ });