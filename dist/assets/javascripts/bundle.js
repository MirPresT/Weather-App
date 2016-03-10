/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "20fcf84fd69c37900a1c"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				Object.defineProperty(fn, name, (function(name) {
/******/ 					return {
/******/ 						configurable: true,
/******/ 						enumerable: true,
/******/ 						get: function() {
/******/ 							return __webpack_require__[name];
/******/ 						},
/******/ 						set: function(value) {
/******/ 							__webpack_require__[name] = value;
/******/ 						}
/******/ 					};
/******/ 				}(name)));
/******/ 			}
/******/ 		}
/******/ 		Object.defineProperty(fn, "e", {
/******/ 			enumerable: true,
/******/ 			value: function(chunkId, callback) {
/******/ 				if(hotStatus === "ready")
/******/ 					hotSetStatus("prepare");
/******/ 				hotChunksLoading++;
/******/ 				__webpack_require__.e(chunkId, function() {
/******/ 					try {
/******/ 						callback.call(null, fn);
/******/ 					} finally {
/******/ 						finishChunkLoading();
/******/ 					}
/******/ 	
/******/ 					function finishChunkLoading() {
/******/ 						hotChunksLoading--;
/******/ 						if(hotStatus === "prepare") {
/******/ 							if(!hotWaitingFilesMap[chunkId]) {
/******/ 								hotEnsureUpdateChunk(chunkId);
/******/ 							}
/******/ 							if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 								hotUpdateDownloaded();
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		});
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _loadApp = __webpack_require__(2);\n\nvar _loadApp2 = _interopRequireDefault(_loadApp);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar index = {\n  init: function init() {\n    this.beginLocationCheck();\n  },\n  beginLocationCheck: function beginLocationCheck() {\n    // check if the browser allows geolocation\n    var geolocationIsAvailable = navigator.geolocation ? true : false;\n\n    // attempt to get current position\n    if (geolocationIsAvailable) {\n      var optionsObj = { enableHighAccuracy: true };\n      // takes a success function, an error function, and an options obj\n      navigator.geolocation.getCurrentPosition(this.loadApp, this.getGeoError, optionsObj);\n    } else {\n      this.browserSupportError();\n    }\n  },\n  getGeoError: function getGeoError() {\n    /* getCurrentPosition failed because\n       1. user clicked block when prompted by browser\n      2. gps is disabled on mobile device\n      3. location services are blocked on this site\n        * If this is the case user must unblock this site in their browser or clear previous settings\n     */\n    console.error('getCurrentLocation Failed ...');\n  },\n  browserSupportError: function browserSupportError() {\n    /* navigator.geolocation did not create the location object meaning...\n      1. Browser does not support geolocation...\n    */\n    console.error(\"This browser does not support geoLocation. Please update your browser.\");\n  },\n  loadApp: function loadApp(position) {\n    (0, _loadApp2.default)(position);\n  }\n};\nindex.init();\n\n// loaaadapp: function(position) {\n\n//         // used in conversions\n//         var dIF,\n//           dIc,\n//           dIIF,\n//           dIIc,\n//           dIIIF,\n//           dIIIc;\n//\n//         function infoPageLoad(json) {\n//           // create weather object\n//\n//           var current = json.currently;\n//           var currentDay = json.daily.data[0];\n//           var weatherObj = {\n//             'day': new Date(currentDay.time*1000),\n//             // 'city': json.name,\n//             'fahrenheit': Math.round(current.temperature),\n//             'celcius': Math.round((current.temperature - 32) * 5 / 9),\n//             'wind': Math.round(current.windSpeed),\n//             'dcr': current.summary,\n//             'cloudiness': current.cloudCover, // 0 clear .4 scattered .75 broken // 1 completely overcast syls\n//             'icon': current.icon,\n//             // 'dayNight': json.weather[0].icon.slice(-1),\n//             'sunrise': new Date(currentDay.sunriseTime * 1000),\n//             'sunset': new Date(currentDay.sunsetTime * 1000),\n//             'humidity': Math.round(current.humidity)\n//           };\n//\n//\n//           // set default temp to display and insert into html depending on check\n//           // have to use a different temp if bottom button is checked\n//           if ($('#switch').hasClass('is-checked')) {\n//             var tempC = weatherObj.celcius;\n//           }\n//           $('#temp-cell-number h2').html(tempC || weatherObj.fahrenheit);\n//           // insert weather icon where I want;\n//           $('#image-cell').html(setIcon(\"weatherImage\", 'NULL', weatherObj.icon));\n//           // insert city under temp\n//           $('#temp-cell-city p').html(weatherObj.city)\n//\n//           // insert content into info panel\n//           $('#box-wind-spd h3').html(weatherObj.wind + ' mph');\n//           $('#box-humidity-percent h3').html(weatherObj.humidity + '%');\n//\n//           // turn time object into a string and get only the time for both sunrise and sunset\n//           var sunrise = weatherObj.sunrise.toString().split(' ')[4].slice(0, -3);\n//           var sunset = weatherObj.sunset.toString().split(' ')[4].slice(0, -3);\n//           // if first number is 0 ignore\n//           sunrise = parseInt(sunrise.charAt(0)) === 0 ? sunrise.slice(1) : sunrise.slice(0, sunrise.length);\n//           sunset = parseInt(sunrise.charAt(0)) === 0 ? sunset.slice(1) : sunset.slice(0, sunset.length);\n//           // convert from 24 hour time to normal\n//           var hr = parseInt(sunset.slice(0, 2)) // get just first two digits\n//             // if the hour is larger than 12 subtract 12 and add it back to rest of string\n//           sunset = hr > 12 ? hr - 12 + sunset.slice(2) : sunset;\n//           // if search is done the request still comes back based on user timezone not search timezone ... Include the timeZone in description for clarity\n//           $('#box-sunrise-time h3').html(sunrise + ' am');\n//           $('#box-sunset-time h3').html(sunset + ' pm');\n//\n//           // fade in info panel with add class jquery\n//           $('.info-card').addClass('animate-fadein');\n//\n//           // set speed of wind tourbine\n//           function setWind(spd) {\n//             [\n//               [20, 3],\n//               [40, 1.5],\n//               [60, 1],\n//               [80, .8],\n//               [100, .5]\n//             ].reduce(function(a, b) {\n//               if (spd > a[0] && spd <= b[0]) {\n//                 var duration = b[1] + \"s\";\n//                 $('#tSpinner').css(\"animation-duration\", duration);\n//               }\n//               return b;\n//             }, [0]);\n//           }\n//\n//           setWind(weatherObj.wind);\n//\n//         }\n//         infoPageLoad(data); // initial load of top data\n//\n//         function setIcon(htmlId, htmlClass, iconId) {\n//           // match designed icon to provided icon\n//           var weatherIcons = [{\n//             '01': \"<img id='\" + htmlId + \"' class='\" + htmlClass + \"' src='src/assets/images/svg-sun.svg'>\",\n//             'description': 'clear sky'\n//           }, {\n//             '02': \"<img id='\" + htmlId + \"' class='\" + htmlClass + \"' src='src/assets/images/svg-sun-clouds.svg'>\",\n//             'description': 'few clouds'\n//           }, {\n//             '03': \"<img id='\" + htmlId + \"'  class='\" + htmlClass + \"' src='src/assets/images/svg-clouds.svg'>\",\n//             'description': 'scattered clouds'\n//           }, {\n//             '04': \"<img id='\" + htmlId + \"'  class='\" + htmlClass + \"' src='src/assets/images/svg-clouds.svg'>\",\n//             'description': 'broken clouds'\n//           }, {\n//             '09': \"<img id='\" + htmlId + \"' class='\" + htmlClass + \"' src='src/assets/images/svg-rain.svg'>\",\n//             'description': 'shower rain'\n//           }, {\n//             '10': \"<img id='\" + htmlId + \"' class='\" + htmlClass + \"' src='src/assets/images/svg-rain.svg'>\",\n//             'description': 'rain'\n//           }, {\n//             '11': \"<img id='\" + htmlId + \"' class='\" + htmlClass + \"' src='src/assets/images/svg-lightning.svg'>\",\n//             'description': 'thunderstorm'\n//           }, {\n//             '13': \"<img id='\" + htmlId + \"' class='\" + htmlClass + \"' src='src/assets/images/svg-snow.svg'>\",\n//             'description': 'snow'\n//           }, {\n//             '50': \"<img id='\" + htmlId + \"' class='\" + htmlClass + \"' src='src/assets/images/svg-mist.svg'>\",\n//             'description': 'mist'\n//           }];\n//           var imageToReturn;\n//           //  iterate over array of image tag objects into single url\n//           var imageToDisplayObj = weatherIcons.map(function(obj) {\n//             var prop = Object.keys(obj)[0];\n//             if (iconId === prop) {\n//               // set image to display because we found a match\n//               imageToReturn = obj[prop];\n//             }\n//           });\n//           return imageToReturn\n//         }\n//         // initial forecast api request using lat and lon used on page load\n//         var forecast_coord_url = \"http://api.openweathermap.org/data/2.5/forecast?lat=\" + userLat + \"&lon=\" + userLon + \"&units=imperial\" + \"&APPID=7527372a21655cf99344e83d9c657864\";\n//\n//         function loadForecast(requestUrl) {\n//           $.ajax({\n//\n//             type: 'GET',\n//             url: requestUrl,\n//             success: function(data) {\n//\n//               var forcastArr = [];\n//\n//               var arr = Array(data);\n//               arr.map(function(a) {\n//                 a[\"list\"].map(function(b) {\n//                   var date = new Date(b.dt * 1000);\n//                   var dayOfMonth = date.getDate();\n//                   var time = date.getHours();\n//                   var dayOfWeekNumber = date.getDay();\n//                   var dayOfWeekWord;\n//                   var days = [\n//                     [0, 'Sunday'],\n//                     [1, 'Monday'],\n//                     [2, 'Tuesday'],\n//                     [3, 'Wednesday'],\n//                     [4, 'Thursday'],\n//                     [5, 'Friday'],\n//                     [6, 'Saturday']\n//                   ];\n//                   // convert day of week number to word\n//                   days.map(function(a) {\n//                     if (a[0] === dayOfWeekNumber) {\n//                       dayOfWeekWord = a[1];\n//                     }\n//                   })\n//                   // we only want to act on parts of information given to us in the list\n//                   if (dayOfMonth !== currentDate && time === 13) {\n//                     var temp = Math.round(b.main.temp);\n//                     var fullIcon = b.weather[0].icon; // full icon include (d)ay /(n)ight\n//                     icon = fullIcon.slice(0, -1);\n//                     forcastArr.push(Array(temp, dayOfWeekWord + ' ' + dayOfMonth,\n//                       setIcon(null, 'box-icon-svg', icon)));\n//                   }\n//                 });\n//               });\n//\n//               // if Celcius button is checked  convert values\n//               if ($('#switch').hasClass('is-checked')) {\n//                 var tempI = convert(forcastArr[0][0]);\n//                 var tempII = convert(forcastArr[1][0]);\n//                 var tempIII = convert(forcastArr[2][0]);\n//               }\n//\n//\n//               $('#day-1 .box-temp h3').html(tempI || forcastArr[0][0]);\n//               $('#day-1 .box-date p').html(forcastArr[0][1]);\n//               $('#day-1 .box-icon').html(forcastArr[0][2]);\n//               // day 2\n//               $('#day-2 .box-temp h3').html(tempII || forcastArr[1][0]);\n//               $('#day-2 .box-date p').html(forcastArr[1][1]);\n//               $('#day-2 .box-icon').html(forcastArr[1][2]);\n//               // day 3\n//               $('#day-3 .box-temp h3').html(tempIII || forcastArr[2][0]);\n//               $('#day-3 .box-date p').html(forcastArr[2][1]);\n//               $('#day-3 .box-icon').html(forcastArr[2][2]);\n//\n//\n//               // avoid making second request for info\n//               dIF = forcastArr[0][0];\n//               dIc = convert(dIF);\n//\n//               dIIF = forcastArr[1][0];\n//               dIIc = convert(dIIF);\n//\n//               dIIIF = forcastArr[2][0];\n//               dIIIc = convert(dIIIF);\n//\n//             }\n//           });\n//         }\n//         loadForecast(forecast_coord_url); // initial load of forecast\n//\n//         // search function to grab new weather data all the information\n//         $('input').on('keydown', function(e) {\n//           // remove animated fade in so I can add it again on content load\n//           $('.info-card').removeClass('animate-fadein');\n//           if (event.which == 13 || event.keyCode == 13) {\n//             var userInput = document.getElementById('sample1').value;\n//             var userArray = userInput.split(\",\");\n//             var cityName = userArray[0];\n//             var countryCode = userArray[1];\n//             e.preventDefault();\n//             var searchUrl = \"http://api.openweathermap.org/data/2.5/weather?q=\" + cityName + \",\" + countryCode + \"&units=imperial&APPID=7527372a21655cf99344e83d9c657864\";\n//             var forecastUrl = \"http://api.openweathermap.org/data/2.5/forecast?q=\" + cityName + \",\" + countryCode + \"&units=imperial&APPID=7527372a21655cf99344e83d9c657864\";\n//\n//             $.ajax({\n//               type: 'GET',\n//               url: searchUrl, //url generated from search\n//               success: function(data) {\n//                 infoPageLoad(data); // load info with new data being passed in\n//                 loadForecast(forecastUrl); // load forecast based on city from search\n//               }\n//             });\n//           }\n//         });\n//\n//         function convert(n) {\n//           return Math.round((n - 32) * .555555);\n//         }\n//         // grab initial value from dom and convert for celcius version\n//         var mTempF = $('#temperature-cell h2').html();\n//         var Mc = convert(mTempF);\n//\n//         // change temperature on switch\n//         $('#switch-1').click(function() {\n//           if ($('#switch').hasClass('is-checked')) { // convert to F\n//\n//             $('#temperature-cell h2').html(mTempF);\n//             $('#day-1 .box-temp h3').html(dIF);\n//             $('#day-2 .box-temp h3').html(dIIF);\n//             $('#day-3 .box-temp h3').html(dIIIF);\n//             $(\"#switcher h4\").html(\"F\");\n//\n//           } else {\n//             $('#temperature-cell h2').html(Mc);\n//             // convert forecast temps\n//             $('#day-1 .box-temp h3').html(dIc);\n//             $('#day-2 .box-temp h3').html(dIIc);\n//             $('#day-3 .box-temp h3').html(dIIIc);\n//             // change display text-text\n//             $(\"#switcher h4\").html(\"C\");\n//\n//           }\n//         });\n//\n//       }//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvYXNzZXRzL2phdmFzY3JpcHRzL2VudHJ5LmpzPzA5MTgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vZHVsZV9sb2FkQXBwIGZyb20gJy4vbG9hZEFwcC5qcyc7XG5cbiAgY29uc3QgaW5kZXggPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmJlZ2luTG9jYXRpb25DaGVjaygpO1xuICAgIH0sXG4gICAgYmVnaW5Mb2NhdGlvbkNoZWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGNoZWNrIGlmIHRoZSBicm93c2VyIGFsbG93cyBnZW9sb2NhdGlvblxuICAgICAgdmFyIGdlb2xvY2F0aW9uSXNBdmFpbGFibGUgPSAobmF2aWdhdG9yLmdlb2xvY2F0aW9uKSA/IHRydWUgOiBmYWxzZTtcblxuICAgICAgLy8gYXR0ZW1wdCB0byBnZXQgY3VycmVudCBwb3NpdGlvblxuICAgICAgaWYgKGdlb2xvY2F0aW9uSXNBdmFpbGFibGUpe1xuICAgICAgICB2YXIgb3B0aW9uc09iaiA9IHtlbmFibGVIaWdoQWNjdXJhY3k6dHJ1ZX07XG4gICAgICAgIC8vIHRha2VzIGEgc3VjY2VzcyBmdW5jdGlvbiwgYW4gZXJyb3IgZnVuY3Rpb24sIGFuZCBhbiBvcHRpb25zIG9ialxuICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKHRoaXMubG9hZEFwcCx0aGlzLmdldEdlb0Vycm9yLG9wdGlvbnNPYmopO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5icm93c2VyU3VwcG9ydEVycm9yKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRHZW9FcnJvcjogZnVuY3Rpb24oKXtcbiAgICAgIC8qIGdldEN1cnJlbnRQb3NpdGlvbiBmYWlsZWQgYmVjYXVzZVxuXG4gICAgICAgIDEuIHVzZXIgY2xpY2tlZCBibG9jayB3aGVuIHByb21wdGVkIGJ5IGJyb3dzZXJcbiAgICAgICAgMi4gZ3BzIGlzIGRpc2FibGVkIG9uIG1vYmlsZSBkZXZpY2VcbiAgICAgICAgMy4gbG9jYXRpb24gc2VydmljZXMgYXJlIGJsb2NrZWQgb24gdGhpcyBzaXRlXG4gICAgICAgICAgKiBJZiB0aGlzIGlzIHRoZSBjYXNlIHVzZXIgbXVzdCB1bmJsb2NrIHRoaXMgc2l0ZSBpbiB0aGVpciBicm93c2VyIG9yIGNsZWFyIHByZXZpb3VzIHNldHRpbmdzXG5cbiAgICAgICovXG4gICAgICBjb25zb2xlLmVycm9yKCdnZXRDdXJyZW50TG9jYXRpb24gRmFpbGVkIC4uLicpO1xuICAgIH0sXG4gICAgYnJvd3NlclN1cHBvcnRFcnJvcjogZnVuY3Rpb24oKXtcbiAgICAgIC8qIG5hdmlnYXRvci5nZW9sb2NhdGlvbiBkaWQgbm90IGNyZWF0ZSB0aGUgbG9jYXRpb24gb2JqZWN0IG1lYW5pbmcuLi5cbiAgICAgICAgMS4gQnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGdlb2xvY2F0aW9uLi4uXG4gICAgICAqL1xuICAgICAgY29uc29sZS5lcnJvcihcIlRoaXMgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGdlb0xvY2F0aW9uLiBQbGVhc2UgdXBkYXRlIHlvdXIgYnJvd3Nlci5cIik7XG4gICAgfSxcbiAgICBsb2FkQXBwOiBmdW5jdGlvbihwb3NpdGlvbil7XG4gICAgICBtb2R1bGVfbG9hZEFwcChwb3NpdGlvbik7XG4gICAgfVxuICB9XG4gIGluZGV4LmluaXQoKTtcblxuXG4gIC8vIGxvYWFhZGFwcDogZnVuY3Rpb24ocG9zaXRpb24pIHtcblxuLy8gICAgICAgICAvLyB1c2VkIGluIGNvbnZlcnNpb25zXG4vLyAgICAgICAgIHZhciBkSUYsXG4vLyAgICAgICAgICAgZEljLFxuLy8gICAgICAgICAgIGRJSUYsXG4vLyAgICAgICAgICAgZElJYyxcbi8vICAgICAgICAgICBkSUlJRixcbi8vICAgICAgICAgICBkSUlJYztcbi8vXG4vLyAgICAgICAgIGZ1bmN0aW9uIGluZm9QYWdlTG9hZChqc29uKSB7XG4vLyAgICAgICAgICAgLy8gY3JlYXRlIHdlYXRoZXIgb2JqZWN0XG4vL1xuLy8gICAgICAgICAgIHZhciBjdXJyZW50ID0ganNvbi5jdXJyZW50bHk7XG4vLyAgICAgICAgICAgdmFyIGN1cnJlbnREYXkgPSBqc29uLmRhaWx5LmRhdGFbMF07XG4vLyAgICAgICAgICAgdmFyIHdlYXRoZXJPYmogPSB7XG4vLyAgICAgICAgICAgICAnZGF5JzogbmV3IERhdGUoY3VycmVudERheS50aW1lKjEwMDApLFxuLy8gICAgICAgICAgICAgLy8gJ2NpdHknOiBqc29uLm5hbWUsXG4vLyAgICAgICAgICAgICAnZmFocmVuaGVpdCc6IE1hdGgucm91bmQoY3VycmVudC50ZW1wZXJhdHVyZSksXG4vLyAgICAgICAgICAgICAnY2VsY2l1cyc6IE1hdGgucm91bmQoKGN1cnJlbnQudGVtcGVyYXR1cmUgLSAzMikgKiA1IC8gOSksXG4vLyAgICAgICAgICAgICAnd2luZCc6IE1hdGgucm91bmQoY3VycmVudC53aW5kU3BlZWQpLFxuLy8gICAgICAgICAgICAgJ2Rjcic6IGN1cnJlbnQuc3VtbWFyeSxcbi8vICAgICAgICAgICAgICdjbG91ZGluZXNzJzogY3VycmVudC5jbG91ZENvdmVyLCAvLyAwIGNsZWFyIC40IHNjYXR0ZXJlZCAuNzUgYnJva2VuIC8vIDEgY29tcGxldGVseSBvdmVyY2FzdCBzeWxzXG4vLyAgICAgICAgICAgICAnaWNvbic6IGN1cnJlbnQuaWNvbixcbi8vICAgICAgICAgICAgIC8vICdkYXlOaWdodCc6IGpzb24ud2VhdGhlclswXS5pY29uLnNsaWNlKC0xKSxcbi8vICAgICAgICAgICAgICdzdW5yaXNlJzogbmV3IERhdGUoY3VycmVudERheS5zdW5yaXNlVGltZSAqIDEwMDApLFxuLy8gICAgICAgICAgICAgJ3N1bnNldCc6IG5ldyBEYXRlKGN1cnJlbnREYXkuc3Vuc2V0VGltZSAqIDEwMDApLFxuLy8gICAgICAgICAgICAgJ2h1bWlkaXR5JzogTWF0aC5yb3VuZChjdXJyZW50Lmh1bWlkaXR5KVxuLy8gICAgICAgICAgIH07XG4vL1xuLy9cbi8vICAgICAgICAgICAvLyBzZXQgZGVmYXVsdCB0ZW1wIHRvIGRpc3BsYXkgYW5kIGluc2VydCBpbnRvIGh0bWwgZGVwZW5kaW5nIG9uIGNoZWNrXG4vLyAgICAgICAgICAgLy8gaGF2ZSB0byB1c2UgYSBkaWZmZXJlbnQgdGVtcCBpZiBib3R0b20gYnV0dG9uIGlzIGNoZWNrZWRcbi8vICAgICAgICAgICBpZiAoJCgnI3N3aXRjaCcpLmhhc0NsYXNzKCdpcy1jaGVja2VkJykpIHtcbi8vICAgICAgICAgICAgIHZhciB0ZW1wQyA9IHdlYXRoZXJPYmouY2VsY2l1cztcbi8vICAgICAgICAgICB9XG4vLyAgICAgICAgICAgJCgnI3RlbXAtY2VsbC1udW1iZXIgaDInKS5odG1sKHRlbXBDIHx8IHdlYXRoZXJPYmouZmFocmVuaGVpdCk7XG4vLyAgICAgICAgICAgLy8gaW5zZXJ0IHdlYXRoZXIgaWNvbiB3aGVyZSBJIHdhbnQ7XG4vLyAgICAgICAgICAgJCgnI2ltYWdlLWNlbGwnKS5odG1sKHNldEljb24oXCJ3ZWF0aGVySW1hZ2VcIiwgJ05VTEwnLCB3ZWF0aGVyT2JqLmljb24pKTtcbi8vICAgICAgICAgICAvLyBpbnNlcnQgY2l0eSB1bmRlciB0ZW1wXG4vLyAgICAgICAgICAgJCgnI3RlbXAtY2VsbC1jaXR5IHAnKS5odG1sKHdlYXRoZXJPYmouY2l0eSlcbi8vXG4vLyAgICAgICAgICAgLy8gaW5zZXJ0IGNvbnRlbnQgaW50byBpbmZvIHBhbmVsXG4vLyAgICAgICAgICAgJCgnI2JveC13aW5kLXNwZCBoMycpLmh0bWwod2VhdGhlck9iai53aW5kICsgJyBtcGgnKTtcbi8vICAgICAgICAgICAkKCcjYm94LWh1bWlkaXR5LXBlcmNlbnQgaDMnKS5odG1sKHdlYXRoZXJPYmouaHVtaWRpdHkgKyAnJScpO1xuLy9cbi8vICAgICAgICAgICAvLyB0dXJuIHRpbWUgb2JqZWN0IGludG8gYSBzdHJpbmcgYW5kIGdldCBvbmx5IHRoZSB0aW1lIGZvciBib3RoIHN1bnJpc2UgYW5kIHN1bnNldFxuLy8gICAgICAgICAgIHZhciBzdW5yaXNlID0gd2VhdGhlck9iai5zdW5yaXNlLnRvU3RyaW5nKCkuc3BsaXQoJyAnKVs0XS5zbGljZSgwLCAtMyk7XG4vLyAgICAgICAgICAgdmFyIHN1bnNldCA9IHdlYXRoZXJPYmouc3Vuc2V0LnRvU3RyaW5nKCkuc3BsaXQoJyAnKVs0XS5zbGljZSgwLCAtMyk7XG4vLyAgICAgICAgICAgLy8gaWYgZmlyc3QgbnVtYmVyIGlzIDAgaWdub3JlXG4vLyAgICAgICAgICAgc3VucmlzZSA9IHBhcnNlSW50KHN1bnJpc2UuY2hhckF0KDApKSA9PT0gMCA/IHN1bnJpc2Uuc2xpY2UoMSkgOiBzdW5yaXNlLnNsaWNlKDAsIHN1bnJpc2UubGVuZ3RoKTtcbi8vICAgICAgICAgICBzdW5zZXQgPSBwYXJzZUludChzdW5yaXNlLmNoYXJBdCgwKSkgPT09IDAgPyBzdW5zZXQuc2xpY2UoMSkgOiBzdW5zZXQuc2xpY2UoMCwgc3Vuc2V0Lmxlbmd0aCk7XG4vLyAgICAgICAgICAgLy8gY29udmVydCBmcm9tIDI0IGhvdXIgdGltZSB0byBub3JtYWxcbi8vICAgICAgICAgICB2YXIgaHIgPSBwYXJzZUludChzdW5zZXQuc2xpY2UoMCwgMikpIC8vIGdldCBqdXN0IGZpcnN0IHR3byBkaWdpdHNcbi8vICAgICAgICAgICAgIC8vIGlmIHRoZSBob3VyIGlzIGxhcmdlciB0aGFuIDEyIHN1YnRyYWN0IDEyIGFuZCBhZGQgaXQgYmFjayB0byByZXN0IG9mIHN0cmluZ1xuLy8gICAgICAgICAgIHN1bnNldCA9IGhyID4gMTIgPyBociAtIDEyICsgc3Vuc2V0LnNsaWNlKDIpIDogc3Vuc2V0O1xuLy8gICAgICAgICAgIC8vIGlmIHNlYXJjaCBpcyBkb25lIHRoZSByZXF1ZXN0IHN0aWxsIGNvbWVzIGJhY2sgYmFzZWQgb24gdXNlciB0aW1lem9uZSBub3Qgc2VhcmNoIHRpbWV6b25lIC4uLiBJbmNsdWRlIHRoZSB0aW1lWm9uZSBpbiBkZXNjcmlwdGlvbiBmb3IgY2xhcml0eVxuLy8gICAgICAgICAgICQoJyNib3gtc3VucmlzZS10aW1lIGgzJykuaHRtbChzdW5yaXNlICsgJyBhbScpO1xuLy8gICAgICAgICAgICQoJyNib3gtc3Vuc2V0LXRpbWUgaDMnKS5odG1sKHN1bnNldCArICcgcG0nKTtcbi8vXG4vLyAgICAgICAgICAgLy8gZmFkZSBpbiBpbmZvIHBhbmVsIHdpdGggYWRkIGNsYXNzIGpxdWVyeVxuLy8gICAgICAgICAgICQoJy5pbmZvLWNhcmQnKS5hZGRDbGFzcygnYW5pbWF0ZS1mYWRlaW4nKTtcbi8vXG4vLyAgICAgICAgICAgLy8gc2V0IHNwZWVkIG9mIHdpbmQgdG91cmJpbmVcbi8vICAgICAgICAgICBmdW5jdGlvbiBzZXRXaW5kKHNwZCkge1xuLy8gICAgICAgICAgICAgW1xuLy8gICAgICAgICAgICAgICBbMjAsIDNdLFxuLy8gICAgICAgICAgICAgICBbNDAsIDEuNV0sXG4vLyAgICAgICAgICAgICAgIFs2MCwgMV0sXG4vLyAgICAgICAgICAgICAgIFs4MCwgLjhdLFxuLy8gICAgICAgICAgICAgICBbMTAwLCAuNV1cbi8vICAgICAgICAgICAgIF0ucmVkdWNlKGZ1bmN0aW9uKGEsIGIpIHtcbi8vICAgICAgICAgICAgICAgaWYgKHNwZCA+IGFbMF0gJiYgc3BkIDw9IGJbMF0pIHtcbi8vICAgICAgICAgICAgICAgICB2YXIgZHVyYXRpb24gPSBiWzFdICsgXCJzXCI7XG4vLyAgICAgICAgICAgICAgICAgJCgnI3RTcGlubmVyJykuY3NzKFwiYW5pbWF0aW9uLWR1cmF0aW9uXCIsIGR1cmF0aW9uKTtcbi8vICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICByZXR1cm4gYjtcbi8vICAgICAgICAgICAgIH0sIFswXSk7XG4vLyAgICAgICAgICAgfVxuLy9cbi8vICAgICAgICAgICBzZXRXaW5kKHdlYXRoZXJPYmoud2luZCk7XG4vL1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIGluZm9QYWdlTG9hZChkYXRhKTsgLy8gaW5pdGlhbCBsb2FkIG9mIHRvcCBkYXRhXG4vL1xuLy8gICAgICAgICBmdW5jdGlvbiBzZXRJY29uKGh0bWxJZCwgaHRtbENsYXNzLCBpY29uSWQpIHtcbi8vICAgICAgICAgICAvLyBtYXRjaCBkZXNpZ25lZCBpY29uIHRvIHByb3ZpZGVkIGljb25cbi8vICAgICAgICAgICB2YXIgd2VhdGhlckljb25zID0gW3tcbi8vICAgICAgICAgICAgICcwMSc6IFwiPGltZyBpZD0nXCIgKyBodG1sSWQgKyBcIicgY2xhc3M9J1wiICsgaHRtbENsYXNzICsgXCInIHNyYz0nc3JjL2Fzc2V0cy9pbWFnZXMvc3ZnLXN1bi5zdmcnPlwiLFxuLy8gICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJ2NsZWFyIHNreSdcbi8vICAgICAgICAgICB9LCB7XG4vLyAgICAgICAgICAgICAnMDInOiBcIjxpbWcgaWQ9J1wiICsgaHRtbElkICsgXCInIGNsYXNzPSdcIiArIGh0bWxDbGFzcyArIFwiJyBzcmM9J3NyYy9hc3NldHMvaW1hZ2VzL3N2Zy1zdW4tY2xvdWRzLnN2Zyc+XCIsXG4vLyAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnZmV3IGNsb3Vkcydcbi8vICAgICAgICAgICB9LCB7XG4vLyAgICAgICAgICAgICAnMDMnOiBcIjxpbWcgaWQ9J1wiICsgaHRtbElkICsgXCInICBjbGFzcz0nXCIgKyBodG1sQ2xhc3MgKyBcIicgc3JjPSdzcmMvYXNzZXRzL2ltYWdlcy9zdmctY2xvdWRzLnN2Zyc+XCIsXG4vLyAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnc2NhdHRlcmVkIGNsb3Vkcydcbi8vICAgICAgICAgICB9LCB7XG4vLyAgICAgICAgICAgICAnMDQnOiBcIjxpbWcgaWQ9J1wiICsgaHRtbElkICsgXCInICBjbGFzcz0nXCIgKyBodG1sQ2xhc3MgKyBcIicgc3JjPSdzcmMvYXNzZXRzL2ltYWdlcy9zdmctY2xvdWRzLnN2Zyc+XCIsXG4vLyAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnYnJva2VuIGNsb3Vkcydcbi8vICAgICAgICAgICB9LCB7XG4vLyAgICAgICAgICAgICAnMDknOiBcIjxpbWcgaWQ9J1wiICsgaHRtbElkICsgXCInIGNsYXNzPSdcIiArIGh0bWxDbGFzcyArIFwiJyBzcmM9J3NyYy9hc3NldHMvaW1hZ2VzL3N2Zy1yYWluLnN2Zyc+XCIsXG4vLyAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAnc2hvd2VyIHJhaW4nXG4vLyAgICAgICAgICAgfSwge1xuLy8gICAgICAgICAgICAgJzEwJzogXCI8aW1nIGlkPSdcIiArIGh0bWxJZCArIFwiJyBjbGFzcz0nXCIgKyBodG1sQ2xhc3MgKyBcIicgc3JjPSdzcmMvYXNzZXRzL2ltYWdlcy9zdmctcmFpbi5zdmcnPlwiLFxuLy8gICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJ3JhaW4nXG4vLyAgICAgICAgICAgfSwge1xuLy8gICAgICAgICAgICAgJzExJzogXCI8aW1nIGlkPSdcIiArIGh0bWxJZCArIFwiJyBjbGFzcz0nXCIgKyBodG1sQ2xhc3MgKyBcIicgc3JjPSdzcmMvYXNzZXRzL2ltYWdlcy9zdmctbGlnaHRuaW5nLnN2Zyc+XCIsXG4vLyAgICAgICAgICAgICAnZGVzY3JpcHRpb24nOiAndGh1bmRlcnN0b3JtJ1xuLy8gICAgICAgICAgIH0sIHtcbi8vICAgICAgICAgICAgICcxMyc6IFwiPGltZyBpZD0nXCIgKyBodG1sSWQgKyBcIicgY2xhc3M9J1wiICsgaHRtbENsYXNzICsgXCInIHNyYz0nc3JjL2Fzc2V0cy9pbWFnZXMvc3ZnLXNub3cuc3ZnJz5cIixcbi8vICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICdzbm93J1xuLy8gICAgICAgICAgIH0sIHtcbi8vICAgICAgICAgICAgICc1MCc6IFwiPGltZyBpZD0nXCIgKyBodG1sSWQgKyBcIicgY2xhc3M9J1wiICsgaHRtbENsYXNzICsgXCInIHNyYz0nc3JjL2Fzc2V0cy9pbWFnZXMvc3ZnLW1pc3Quc3ZnJz5cIixcbi8vICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICdtaXN0J1xuLy8gICAgICAgICAgIH1dO1xuLy8gICAgICAgICAgIHZhciBpbWFnZVRvUmV0dXJuO1xuLy8gICAgICAgICAgIC8vICBpdGVyYXRlIG92ZXIgYXJyYXkgb2YgaW1hZ2UgdGFnIG9iamVjdHMgaW50byBzaW5nbGUgdXJsXG4vLyAgICAgICAgICAgdmFyIGltYWdlVG9EaXNwbGF5T2JqID0gd2VhdGhlckljb25zLm1hcChmdW5jdGlvbihvYmopIHtcbi8vICAgICAgICAgICAgIHZhciBwcm9wID0gT2JqZWN0LmtleXMob2JqKVswXTtcbi8vICAgICAgICAgICAgIGlmIChpY29uSWQgPT09IHByb3ApIHtcbi8vICAgICAgICAgICAgICAgLy8gc2V0IGltYWdlIHRvIGRpc3BsYXkgYmVjYXVzZSB3ZSBmb3VuZCBhIG1hdGNoXG4vLyAgICAgICAgICAgICAgIGltYWdlVG9SZXR1cm4gPSBvYmpbcHJvcF07XG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgcmV0dXJuIGltYWdlVG9SZXR1cm5cbi8vICAgICAgICAgfVxuLy8gICAgICAgICAvLyBpbml0aWFsIGZvcmVjYXN0IGFwaSByZXF1ZXN0IHVzaW5nIGxhdCBhbmQgbG9uIHVzZWQgb24gcGFnZSBsb2FkXG4vLyAgICAgICAgIHZhciBmb3JlY2FzdF9jb29yZF91cmwgPSBcImh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZvcmVjYXN0P2xhdD1cIiArIHVzZXJMYXQgKyBcIiZsb249XCIgKyB1c2VyTG9uICsgXCImdW5pdHM9aW1wZXJpYWxcIiArIFwiJkFQUElEPTc1MjczNzJhMjE2NTVjZjk5MzQ0ZTgzZDljNjU3ODY0XCI7XG4vL1xuLy8gICAgICAgICBmdW5jdGlvbiBsb2FkRm9yZWNhc3QocmVxdWVzdFVybCkge1xuLy8gICAgICAgICAgICQuYWpheCh7XG4vL1xuLy8gICAgICAgICAgICAgdHlwZTogJ0dFVCcsXG4vLyAgICAgICAgICAgICB1cmw6IHJlcXVlc3RVcmwsXG4vLyAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4vL1xuLy8gICAgICAgICAgICAgICB2YXIgZm9yY2FzdEFyciA9IFtdO1xuLy9cbi8vICAgICAgICAgICAgICAgdmFyIGFyciA9IEFycmF5KGRhdGEpO1xuLy8gICAgICAgICAgICAgICBhcnIubWFwKGZ1bmN0aW9uKGEpIHtcbi8vICAgICAgICAgICAgICAgICBhW1wibGlzdFwiXS5tYXAoZnVuY3Rpb24oYikge1xuLy8gICAgICAgICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShiLmR0ICogMTAwMCk7XG4vLyAgICAgICAgICAgICAgICAgICB2YXIgZGF5T2ZNb250aCA9IGRhdGUuZ2V0RGF0ZSgpO1xuLy8gICAgICAgICAgICAgICAgICAgdmFyIHRpbWUgPSBkYXRlLmdldEhvdXJzKCk7XG4vLyAgICAgICAgICAgICAgICAgICB2YXIgZGF5T2ZXZWVrTnVtYmVyID0gZGF0ZS5nZXREYXkoKTtcbi8vICAgICAgICAgICAgICAgICAgIHZhciBkYXlPZldlZWtXb3JkO1xuLy8gICAgICAgICAgICAgICAgICAgdmFyIGRheXMgPSBbXG4vLyAgICAgICAgICAgICAgICAgICAgIFswLCAnU3VuZGF5J10sXG4vLyAgICAgICAgICAgICAgICAgICAgIFsxLCAnTW9uZGF5J10sXG4vLyAgICAgICAgICAgICAgICAgICAgIFsyLCAnVHVlc2RheSddLFxuLy8gICAgICAgICAgICAgICAgICAgICBbMywgJ1dlZG5lc2RheSddLFxuLy8gICAgICAgICAgICAgICAgICAgICBbNCwgJ1RodXJzZGF5J10sXG4vLyAgICAgICAgICAgICAgICAgICAgIFs1LCAnRnJpZGF5J10sXG4vLyAgICAgICAgICAgICAgICAgICAgIFs2LCAnU2F0dXJkYXknXVxuLy8gICAgICAgICAgICAgICAgICAgXTtcbi8vICAgICAgICAgICAgICAgICAgIC8vIGNvbnZlcnQgZGF5IG9mIHdlZWsgbnVtYmVyIHRvIHdvcmRcbi8vICAgICAgICAgICAgICAgICAgIGRheXMubWFwKGZ1bmN0aW9uKGEpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgaWYgKGFbMF0gPT09IGRheU9mV2Vla051bWJlcikge1xuLy8gICAgICAgICAgICAgICAgICAgICAgIGRheU9mV2Vla1dvcmQgPSBhWzFdO1xuLy8gICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgICB9KVxuLy8gICAgICAgICAgICAgICAgICAgLy8gd2Ugb25seSB3YW50IHRvIGFjdCBvbiBwYXJ0cyBvZiBpbmZvcm1hdGlvbiBnaXZlbiB0byB1cyBpbiB0aGUgbGlzdFxuLy8gICAgICAgICAgICAgICAgICAgaWYgKGRheU9mTW9udGggIT09IGN1cnJlbnREYXRlICYmIHRpbWUgPT09IDEzKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gTWF0aC5yb3VuZChiLm1haW4udGVtcCk7XG4vLyAgICAgICAgICAgICAgICAgICAgIHZhciBmdWxsSWNvbiA9IGIud2VhdGhlclswXS5pY29uOyAvLyBmdWxsIGljb24gaW5jbHVkZSAoZClheSAvKG4paWdodFxuLy8gICAgICAgICAgICAgICAgICAgICBpY29uID0gZnVsbEljb24uc2xpY2UoMCwgLTEpO1xuLy8gICAgICAgICAgICAgICAgICAgICBmb3JjYXN0QXJyLnB1c2goQXJyYXkodGVtcCwgZGF5T2ZXZWVrV29yZCArICcgJyArIGRheU9mTW9udGgsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgc2V0SWNvbihudWxsLCAnYm94LWljb24tc3ZnJywgaWNvbikpKTtcbi8vICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgICAgfSk7XG4vL1xuLy8gICAgICAgICAgICAgICAvLyBpZiBDZWxjaXVzIGJ1dHRvbiBpcyBjaGVja2VkICBjb252ZXJ0IHZhbHVlc1xuLy8gICAgICAgICAgICAgICBpZiAoJCgnI3N3aXRjaCcpLmhhc0NsYXNzKCdpcy1jaGVja2VkJykpIHtcbi8vICAgICAgICAgICAgICAgICB2YXIgdGVtcEkgPSBjb252ZXJ0KGZvcmNhc3RBcnJbMF1bMF0pO1xuLy8gICAgICAgICAgICAgICAgIHZhciB0ZW1wSUkgPSBjb252ZXJ0KGZvcmNhc3RBcnJbMV1bMF0pO1xuLy8gICAgICAgICAgICAgICAgIHZhciB0ZW1wSUlJID0gY29udmVydChmb3JjYXN0QXJyWzJdWzBdKTtcbi8vICAgICAgICAgICAgICAgfVxuLy9cbi8vXG4vLyAgICAgICAgICAgICAgICQoJyNkYXktMSAuYm94LXRlbXAgaDMnKS5odG1sKHRlbXBJIHx8IGZvcmNhc3RBcnJbMF1bMF0pO1xuLy8gICAgICAgICAgICAgICAkKCcjZGF5LTEgLmJveC1kYXRlIHAnKS5odG1sKGZvcmNhc3RBcnJbMF1bMV0pO1xuLy8gICAgICAgICAgICAgICAkKCcjZGF5LTEgLmJveC1pY29uJykuaHRtbChmb3JjYXN0QXJyWzBdWzJdKTtcbi8vICAgICAgICAgICAgICAgLy8gZGF5IDJcbi8vICAgICAgICAgICAgICAgJCgnI2RheS0yIC5ib3gtdGVtcCBoMycpLmh0bWwodGVtcElJIHx8IGZvcmNhc3RBcnJbMV1bMF0pO1xuLy8gICAgICAgICAgICAgICAkKCcjZGF5LTIgLmJveC1kYXRlIHAnKS5odG1sKGZvcmNhc3RBcnJbMV1bMV0pO1xuLy8gICAgICAgICAgICAgICAkKCcjZGF5LTIgLmJveC1pY29uJykuaHRtbChmb3JjYXN0QXJyWzFdWzJdKTtcbi8vICAgICAgICAgICAgICAgLy8gZGF5IDNcbi8vICAgICAgICAgICAgICAgJCgnI2RheS0zIC5ib3gtdGVtcCBoMycpLmh0bWwodGVtcElJSSB8fCBmb3JjYXN0QXJyWzJdWzBdKTtcbi8vICAgICAgICAgICAgICAgJCgnI2RheS0zIC5ib3gtZGF0ZSBwJykuaHRtbChmb3JjYXN0QXJyWzJdWzFdKTtcbi8vICAgICAgICAgICAgICAgJCgnI2RheS0zIC5ib3gtaWNvbicpLmh0bWwoZm9yY2FzdEFyclsyXVsyXSk7XG4vL1xuLy9cbi8vICAgICAgICAgICAgICAgLy8gYXZvaWQgbWFraW5nIHNlY29uZCByZXF1ZXN0IGZvciBpbmZvXG4vLyAgICAgICAgICAgICAgIGRJRiA9IGZvcmNhc3RBcnJbMF1bMF07XG4vLyAgICAgICAgICAgICAgIGRJYyA9IGNvbnZlcnQoZElGKTtcbi8vXG4vLyAgICAgICAgICAgICAgIGRJSUYgPSBmb3JjYXN0QXJyWzFdWzBdO1xuLy8gICAgICAgICAgICAgICBkSUljID0gY29udmVydChkSUlGKTtcbi8vXG4vLyAgICAgICAgICAgICAgIGRJSUlGID0gZm9yY2FzdEFyclsyXVswXTtcbi8vICAgICAgICAgICAgICAgZElJSWMgPSBjb252ZXJ0KGRJSUlGKTtcbi8vXG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgfSk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgbG9hZEZvcmVjYXN0KGZvcmVjYXN0X2Nvb3JkX3VybCk7IC8vIGluaXRpYWwgbG9hZCBvZiBmb3JlY2FzdFxuLy9cbi8vICAgICAgICAgLy8gc2VhcmNoIGZ1bmN0aW9uIHRvIGdyYWIgbmV3IHdlYXRoZXIgZGF0YSBhbGwgdGhlIGluZm9ybWF0aW9uXG4vLyAgICAgICAgICQoJ2lucHV0Jykub24oJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4vLyAgICAgICAgICAgLy8gcmVtb3ZlIGFuaW1hdGVkIGZhZGUgaW4gc28gSSBjYW4gYWRkIGl0IGFnYWluIG9uIGNvbnRlbnQgbG9hZFxuLy8gICAgICAgICAgICQoJy5pbmZvLWNhcmQnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZS1mYWRlaW4nKTtcbi8vICAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT0gMTMgfHwgZXZlbnQua2V5Q29kZSA9PSAxMykge1xuLy8gICAgICAgICAgICAgdmFyIHVzZXJJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzYW1wbGUxJykudmFsdWU7XG4vLyAgICAgICAgICAgICB2YXIgdXNlckFycmF5ID0gdXNlcklucHV0LnNwbGl0KFwiLFwiKTtcbi8vICAgICAgICAgICAgIHZhciBjaXR5TmFtZSA9IHVzZXJBcnJheVswXTtcbi8vICAgICAgICAgICAgIHZhciBjb3VudHJ5Q29kZSA9IHVzZXJBcnJheVsxXTtcbi8vICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICAgICAgIHZhciBzZWFyY2hVcmwgPSBcImh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/cT1cIiArIGNpdHlOYW1lICsgXCIsXCIgKyBjb3VudHJ5Q29kZSArIFwiJnVuaXRzPWltcGVyaWFsJkFQUElEPTc1MjczNzJhMjE2NTVjZjk5MzQ0ZTgzZDljNjU3ODY0XCI7XG4vLyAgICAgICAgICAgICB2YXIgZm9yZWNhc3RVcmwgPSBcImh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZvcmVjYXN0P3E9XCIgKyBjaXR5TmFtZSArIFwiLFwiICsgY291bnRyeUNvZGUgKyBcIiZ1bml0cz1pbXBlcmlhbCZBUFBJRD03NTI3MzcyYTIxNjU1Y2Y5OTM0NGU4M2Q5YzY1Nzg2NFwiO1xuLy9cbi8vICAgICAgICAgICAgICQuYWpheCh7XG4vLyAgICAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxuLy8gICAgICAgICAgICAgICB1cmw6IHNlYXJjaFVybCwgLy91cmwgZ2VuZXJhdGVkIGZyb20gc2VhcmNoXG4vLyAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbi8vICAgICAgICAgICAgICAgICBpbmZvUGFnZUxvYWQoZGF0YSk7IC8vIGxvYWQgaW5mbyB3aXRoIG5ldyBkYXRhIGJlaW5nIHBhc3NlZCBpblxuLy8gICAgICAgICAgICAgICAgIGxvYWRGb3JlY2FzdChmb3JlY2FzdFVybCk7IC8vIGxvYWQgZm9yZWNhc3QgYmFzZWQgb24gY2l0eSBmcm9tIHNlYXJjaFxuLy8gICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICB9XG4vLyAgICAgICAgIH0pO1xuLy9cbi8vICAgICAgICAgZnVuY3Rpb24gY29udmVydChuKSB7XG4vLyAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoKG4gLSAzMikgKiAuNTU1NTU1KTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICAvLyBncmFiIGluaXRpYWwgdmFsdWUgZnJvbSBkb20gYW5kIGNvbnZlcnQgZm9yIGNlbGNpdXMgdmVyc2lvblxuLy8gICAgICAgICB2YXIgbVRlbXBGID0gJCgnI3RlbXBlcmF0dXJlLWNlbGwgaDInKS5odG1sKCk7XG4vLyAgICAgICAgIHZhciBNYyA9IGNvbnZlcnQobVRlbXBGKTtcbi8vXG4vLyAgICAgICAgIC8vIGNoYW5nZSB0ZW1wZXJhdHVyZSBvbiBzd2l0Y2hcbi8vICAgICAgICAgJCgnI3N3aXRjaC0xJykuY2xpY2soZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgaWYgKCQoJyNzd2l0Y2gnKS5oYXNDbGFzcygnaXMtY2hlY2tlZCcpKSB7IC8vIGNvbnZlcnQgdG8gRlxuLy9cbi8vICAgICAgICAgICAgICQoJyN0ZW1wZXJhdHVyZS1jZWxsIGgyJykuaHRtbChtVGVtcEYpO1xuLy8gICAgICAgICAgICAgJCgnI2RheS0xIC5ib3gtdGVtcCBoMycpLmh0bWwoZElGKTtcbi8vICAgICAgICAgICAgICQoJyNkYXktMiAuYm94LXRlbXAgaDMnKS5odG1sKGRJSUYpO1xuLy8gICAgICAgICAgICAgJCgnI2RheS0zIC5ib3gtdGVtcCBoMycpLmh0bWwoZElJSUYpO1xuLy8gICAgICAgICAgICAgJChcIiNzd2l0Y2hlciBoNFwiKS5odG1sKFwiRlwiKTtcbi8vXG4vLyAgICAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICAgICQoJyN0ZW1wZXJhdHVyZS1jZWxsIGgyJykuaHRtbChNYyk7XG4vLyAgICAgICAgICAgICAvLyBjb252ZXJ0IGZvcmVjYXN0IHRlbXBzXG4vLyAgICAgICAgICAgICAkKCcjZGF5LTEgLmJveC10ZW1wIGgzJykuaHRtbChkSWMpO1xuLy8gICAgICAgICAgICAgJCgnI2RheS0yIC5ib3gtdGVtcCBoMycpLmh0bWwoZElJYyk7XG4vLyAgICAgICAgICAgICAkKCcjZGF5LTMgLmJveC10ZW1wIGgzJykuaHRtbChkSUlJYyk7XG4vLyAgICAgICAgICAgICAvLyBjaGFuZ2UgZGlzcGxheSB0ZXh0LXRleHRcbi8vICAgICAgICAgICAgICQoXCIjc3dpdGNoZXIgaDRcIikuaHRtbChcIkNcIik7XG4vL1xuLy8gICAgICAgICAgIH1cbi8vICAgICAgICAgfSk7XG4vL1xuLy8gICAgICAgfVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogc3JjL2Fzc2V0cy9qYXZhc2NyaXB0cy9lbnRyeS5qc1xuICoqLyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFEQTtBQUdBOztBQUVBO0FBQ0E7O0FBSEE7QUFNQTs7QUFEQTtBQUFBO0FBS0E7QUFMQTtBQUxBO0FBYUE7Ozs7Ozs7QUFTQTtBQVRBO0FBV0E7Ozs7QUFJQTtBQUpBO0FBTUE7QUFDQTtBQURBO0FBbENBO0FBc0NBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Iiwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("'use strict';\n\nvar _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"]) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError(\"Invalid attempt to destructure non-iterable instance\"); } }; }();\n\n// load app\nmodule.exports = function (position) {\n\n  var app = {\n    start: function start() {\n      this.cacheDom();\n      var _position$coords = position.coords;\n      var lat = _position$coords.latitude;\n      var lon = _position$coords.longitude;\n      // Get location name then Get current weather and forecast\n\n      var gettingLocationName = new Promise(this.getLocationName.bind(this, lat, lon));\n      var gettingWeather = new Promise(this.getWeatherAndForecast.bind(this, lat, lon));\n\n      var tasks = Promise.all([gettingLocationName, gettingWeather]).then(this.handleJSON.bind(this));\n    },\n    cacheDom: function cacheDom() {\n      this.header = document.querySelector('#header');\n      this.headerTempCell = document.querySelector('#temp-cell-number h2');\n      this.infoPanel = document.querySelector('#info-panel');\n      this.forecastPanel = document.querySelector(\"#forecast-panel\");\n    },\n    handleJSON: function handleJSON(response) {\n      // big destructuing of data .. just have to take a second to follow it\n      // this function also passes the required information to smaller functions to update ui\n\n      var _response = _slicedToArray(response, 2);\n\n      var locationName = _response[0];\n      var _response$ = _response[1];\n      var _response$$currently = _response$.currently;\n      var windSpeed = _response$$currently.windSpeed;\n      var temperature = _response$$currently.temperature;\n      var humidity = _response$$currently.humidity;\n      var cloudCover = _response$$currently.cloudCover;\n      var icon = _response$$currently.icon;\n      var summery = _response$$currently.summery;\n\n      var _response$$daily$data = _slicedToArray(_response$.daily.data, 1);\n\n      var _response$$daily$data2 = _response$$daily$data[0];\n      var sunsetTime = _response$$daily$data2.sunsetTime;\n      var sunriseTime = _response$$daily$data2.sunriseTime;\n\n      // sending in payloads with only relevant info\n\n      this.setHeaderInfo({ locationName: locationName, temperature: temperature, icon: icon });\n      this.setInfoTab({ windSpeed: windSpeed, humidity: humidity, sunriseTime: sunriseTime, sunsetTime: sunsetTime });\n      this.setForecast({ \"days\": response[1].daily.data });\n    },\n    getLocationName: function getLocationName(lat, lon, res, rej) {\n      // get the current location ie neighborhood or city based on lat & long using google maps api\n      var urlBase = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';\n      var googleKey = '&key=AIzaSyArtLLZvhmNHbUOL7DJKyO7TBwArl1jPE0';\n      var urlRestrictions = window.screen.width < 415 ? '' // nothing if we are on mobile\n      : '&location_type=APPROXIMATE';\n      var fullApiUrl = urlBase + lat + ',' + lon + googleKey + urlRestrictions;\n\n      $.getJSON(fullApiUrl, function (data) {\n        if (data.error_message) {\n          console.log(data.status + '|' + data.error_message);\n          rej();\n        } else if (data.status === \"OK\") {\n          console.log('successful location found using google\\n');\n          res(data.results[0].formatted_address);\n        } else {\n          console.log('other error..', data.status);\n          rej(data);\n        }\n      });\n    },\n    getWeatherAndForecast: function getWeatherAndForecast(lat, lon, res, rej) {\n      var baseUrl = 'https://api.forecast.io/forecast';\n      var forecastKey = 'e10af8d470cd4b3567a15eb36ed235bb';\n      var clBk = '?callback=?';\n      var url_api = baseUrl + '/' + forecastKey + '/' + lat + ',' + lon + clBk;\n\n      $.getJSON(url_api, function (data) {\n        res(data);\n      });\n    },\n    setHeaderInfo: function setHeaderInfo(data) {\n      var temp = data.temperature;\n      var name = data.locationName;\n      var icon = data.icon;\n\n      this.headerTempCell.innerHTML = Math.round(temp);\n      $('#image-cell').html(this.setIcon('weatherImage', null, icon));\n    },\n    setInfoTab: function setInfoTab(data) {\n      var windSpeed = data.windSpeed;\n      var humidity = data.humidity;\n      var sunriseTime = data.sunriseTime;\n      var sunsetTime = data.sunsetTime;\n\n      var info = this.infoPanel.children;\n      var infoToPlace = [Math.round(windSpeed) + '<span id=\"mph\">mph</span>', Math.round(humidity * 100) + '<span id=\"percent\">%</span>', formatTime(sunriseTime).time + '<span id=\"period\">' + formatTime(sunriseTime).when + '</span>', formatTime(sunsetTime).time + '<span id=\"period\">' + formatTime(sunsetTime).when + '</span>'];\n      var counter = 0;\n      for (var i = 0; i < info.length; i++) {\n        var boxes = info[i].children;\n        for (var x = 0; x < boxes.length; x++) {\n          if (boxes[x].classList.contains('box-left')) {\n            boxes[x].firstElementChild.innerHTML = infoToPlace[counter];\n            counter++;\n          }\n        }\n      }\n\n      function formatTime(unixTime) {\n        var time = new Date(unixTime * 1000).toString().split(' ')[4].slice(0, -3);\n        // if there is a zero remove it\n        var hr = parseInt(time.slice(0, 2));\n        if (parseInt(time.charAt(0)) === 0) {\n          time = time.slice(1);\n          // time is in the am\n          return { when: 'am', time: time };\n        } else if (hr > 12) {\n          time = hr - 12 + time.slice(2);\n          // time is in the pm\n          return { when: 'pm', time: time };\n        }\n      }\n\n      function setWind(spd) {\n        [[20, 3], [40, 1.5], [60, 1], [80, .8], [100, .5]].reduce(function (a, b) {\n          if (spd > a[0] && spd <= b[0]) {\n            var duration = b[1] + \"s\";\n            $('#tSpinner').css(\"animation-duration\", duration);\n          }\n          return b;\n        }, [0]);\n      }\n\n      setWind(windSpeed);\n    },\n    setForecast: function setForecast(data) {\n      var days = data.days;\n      var threeDayForecast = days.filter(function (day, index) {\n        return index > 0 && index < 4;\n      });\n      var dayElems = this.forecastPanel.children;\n      for (var i = 0; i < dayElems.length; i++) {\n        var boxes = dayElems[i].children;\n        for (var x = 0; x < boxes.length; x++) {\n          var box = boxes[x];\n          if (box.children[0] !== undefined) {\n            if (box.children[0].tagName === \"H3\") {\n              box.children[0].innerHTML = Math.round(threeDayForecast[i].temperatureMax);\n            }\n          }\n        }\n      }\n    },\n    setIcon: function setIcon(htmlId, htmlClass, str) {\n      // match designed icon to provided icon\n      var weatherIcons = [{\n        'ids': ['clear-night', 'clear-day'],\n        'tag': \"<img id='\" + htmlId + \"' class='\" + htmlClass + \"' src='src/assets/images/svg-sun.svg'>\",\n        'description': 'clear sky'\n      }, {\n        'ids': ['partly-cloudy-day'],\n        'tag': \"<img id='\" + htmlId + \"' class='\" + htmlClass + \"' src='src/assets/images/svg-sun-clouds.svg'>\",\n        'description': 'few clouds'\n      }, {\n        'ids': ['partly-cloudy-night', 'cloudy'],\n        'tag': \"<img id='\" + htmlId + \"'  class='\" + htmlClass + \"' src='src/assets/images/svg-clouds.svg'>\",\n        'description': 'cloudy'\n      }, {\n        'ids': ['rain', 'hail'],\n        'tag': \"<img id='\" + htmlId + \"' class='\" + htmlClass + \"' src='src/assets/images/svg-rain.svg'>\",\n        'description': 'shower rain'\n      }, {\n        'ids': ['thunderstorm'],\n        'tag': \"<img id='\" + htmlId + \"' class='\" + htmlClass + \"' src='src/assets/images/svg-lightning.svg'>\",\n        'description': 'thunderstorm'\n      }, {\n        'ids': ['hail'],\n        'tag': \"<img id='\" + htmlId + \"' class='\" + htmlClass + \"' src='src/assets/images/svg-snow.svg'>\",\n        'description': 'snow'\n      }, {\n        'ids': ['fog', 'wind'],\n        'tag': \"<img id='\" + htmlId + \"' class='\" + htmlClass + \"' src='src/assets/images/svg-mist.svg'>\",\n        'description': 'mist'\n      }];\n      //  iterate over array of image tag objects into single url\n\n      for (var i = 0; i < weatherIcons.length; i++) {\n        var obj = weatherIcons[i];\n        var idMatches = obj.ids.filter(function (IDstr) {\n          return str === IDstr;\n        });\n        if (idMatches.length >= 1) {\n          return obj.tag;\n        }\n      };\n    }\n  };\n\n  app.start();\n};//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvYXNzZXRzL2phdmFzY3JpcHRzL2xvYWRBcHAuanM/OTllMiJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsb2FkIGFwcFxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHBvc2l0aW9uKXtcclxuXHJcbiAgdmFyIGFwcCA9IHtcclxuICAgIHN0YXJ0OiBmdW5jdGlvbigpe1xyXG4gICAgICB0aGlzLmNhY2hlRG9tKCk7XHJcbiAgICAgIHZhciB7IGNvb3Jkczp7IGxhdGl0dWRlOmxhdCwgbG9uZ2l0dWRlOmxvbiB9IH0gPSBwb3NpdGlvbjtcclxuICAgICAgLy8gR2V0IGxvY2F0aW9uIG5hbWUgdGhlbiBHZXQgY3VycmVudCB3ZWF0aGVyIGFuZCBmb3JlY2FzdFxyXG4gICAgICB2YXIgZ2V0dGluZ0xvY2F0aW9uTmFtZSA9IG5ldyBQcm9taXNlKCB0aGlzLmdldExvY2F0aW9uTmFtZS5iaW5kKHRoaXMsbGF0LGxvbikgKVxyXG4gICAgICB2YXIgZ2V0dGluZ1dlYXRoZXIgPSBuZXcgUHJvbWlzZSggdGhpcy5nZXRXZWF0aGVyQW5kRm9yZWNhc3QuYmluZCh0aGlzLGxhdCxsb24pIClcclxuXHJcbiAgICAgIHZhciB0YXNrcyA9IFByb21pc2UuYWxsKFtnZXR0aW5nTG9jYXRpb25OYW1lLGdldHRpbmdXZWF0aGVyXSkudGhlbih0aGlzLmhhbmRsZUpTT04uYmluZCh0aGlzKSlcclxuICAgIH0sXHJcbiAgICBjYWNoZURvbTogZnVuY3Rpb24oKXtcclxuICAgICAgdGhpcy5oZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaGVhZGVyJyk7XHJcbiAgICAgIHRoaXMuaGVhZGVyVGVtcENlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGVtcC1jZWxsLW51bWJlciBoMicpO1xyXG4gICAgICB0aGlzLmluZm9QYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNpbmZvLXBhbmVsJyk7XHJcbiAgICAgIHRoaXMuZm9yZWNhc3RQYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZm9yZWNhc3QtcGFuZWxcIik7XHJcblxyXG4gICAgfSxcclxuICAgIGhhbmRsZUpTT046IGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgLy8gYmlnIGRlc3RydWN0dWluZyBvZiBkYXRhIC4uIGp1c3QgaGF2ZSB0byB0YWtlIGEgc2Vjb25kIHRvIGZvbGxvdyBpdFxyXG4gICAgICAvLyB0aGlzIGZ1bmN0aW9uIGFsc28gcGFzc2VzIHRoZSByZXF1aXJlZCBpbmZvcm1hdGlvbiB0byBzbWFsbGVyIGZ1bmN0aW9ucyB0byB1cGRhdGUgdWlcclxuICAgICAgY29uc3QgW1xyXG4gICAgICAgIGxvY2F0aW9uTmFtZSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBjdXJyZW50bHk6e1xyXG4gICAgICAgICAgICB3aW5kU3BlZWQsdGVtcGVyYXR1cmUsaHVtaWRpdHksY2xvdWRDb3ZlcixpY29uLHN1bW1lcnlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBkYWlseTp7XHJcbiAgICAgICAgICAgIGRhdGE6W1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHN1bnNldFRpbWUsXHJcbiAgICAgICAgICAgICAgICBzdW5yaXNlVGltZVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgXSA9IHJlc3BvbnNlO1xyXG5cclxuICAgICAgLy8gc2VuZGluZyBpbiBwYXlsb2FkcyB3aXRoIG9ubHkgcmVsZXZhbnQgaW5mb1xyXG4gICAgICB0aGlzLnNldEhlYWRlckluZm8oe2xvY2F0aW9uTmFtZSx0ZW1wZXJhdHVyZSxpY29ufSk7XHJcbiAgICAgIHRoaXMuc2V0SW5mb1RhYih7d2luZFNwZWVkLGh1bWlkaXR5LHN1bnJpc2VUaW1lLHN1bnNldFRpbWV9KTtcclxuICAgICAgdGhpcy5zZXRGb3JlY2FzdCh7XCJkYXlzXCI6cmVzcG9uc2VbMV0uZGFpbHkuZGF0YX0pO1xyXG4gICAgfSxcclxuICAgIGdldExvY2F0aW9uTmFtZTogZnVuY3Rpb24obGF0LGxvbixyZXMscmVqKXtcclxuICAgICAgLy8gZ2V0IHRoZSBjdXJyZW50IGxvY2F0aW9uIGllIG5laWdoYm9yaG9vZCBvciBjaXR5IGJhc2VkIG9uIGxhdCAmIGxvbmcgdXNpbmcgZ29vZ2xlIG1hcHMgYXBpXHJcbiAgICAgIHZhciB1cmxCYXNlID0gJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9nZW9jb2RlL2pzb24/bGF0bG5nPSc7XHJcbiAgICAgIHZhciBnb29nbGVLZXkgPSAnJmtleT1BSXphU3lBcnRMTFp2aG1OSGJVT0w3REpLeU83VEJ3QXJsMWpQRTAnO1xyXG4gICAgICB2YXIgdXJsUmVzdHJpY3Rpb25zID0gKHdpbmRvdy5zY3JlZW4ud2lkdGggPCA0MTUpXHJcbiAgICAgICAgPyAnJyAvLyBub3RoaW5nIGlmIHdlIGFyZSBvbiBtb2JpbGVcclxuICAgICAgICA6ICcmbG9jYXRpb25fdHlwZT1BUFBST1hJTUFURSc7XHJcbiAgICAgIHZhciBmdWxsQXBpVXJsID0gdXJsQmFzZSArIGxhdCArICcsJysgbG9uICsgZ29vZ2xlS2V5ICsgdXJsUmVzdHJpY3Rpb25zO1xyXG5cclxuICAgICAgJC5nZXRKU09OKGZ1bGxBcGlVcmwsIGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgIGlmIChkYXRhLmVycm9yX21lc3NhZ2Upe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZGF0YS5zdGF0dXMgKyAnfCcgKyBkYXRhLmVycm9yX21lc3NhZ2UpXHJcbiAgICAgICAgICByZWooKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YS5zdGF0dXMgPT09IFwiT0tcIikge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3N1Y2Nlc3NmdWwgbG9jYXRpb24gZm91bmQgdXNpbmcgZ29vZ2xlXFxuJyk7XHJcbiAgICAgICAgICByZXMoZGF0YS5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnb3RoZXIgZXJyb3IuLicsZGF0YS5zdGF0dXMpO1xyXG4gICAgICAgICAgcmVqKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBnZXRXZWF0aGVyQW5kRm9yZWNhc3Q6IGZ1bmN0aW9uKGxhdCxsb24scmVzLHJlail7XHJcbiAgICAgIHZhciBiYXNlVXJsID0gJ2h0dHBzOi8vYXBpLmZvcmVjYXN0LmlvL2ZvcmVjYXN0JztcclxuICAgICAgdmFyIGZvcmVjYXN0S2V5ID0gJ2UxMGFmOGQ0NzBjZDRiMzU2N2ExNWViMzZlZDIzNWJiJztcclxuICAgICAgdmFyIGNsQmsgPSAnP2NhbGxiYWNrPT8nO1xyXG4gICAgICB2YXIgdXJsX2FwaSA9IGJhc2VVcmwgKyAnLycgKyBmb3JlY2FzdEtleSArICcvJyArIGxhdCArICcsJyArIGxvbiArIGNsQms7XHJcblxyXG4gICAgICAkLmdldEpTT04odXJsX2FwaSwgZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgcmVzKGRhdGEpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB9LFxyXG4gICAgc2V0SGVhZGVySW5mbzogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgIGNvbnN0IHt0ZW1wZXJhdHVyZTp0ZW1wLGxvY2F0aW9uTmFtZTpuYW1lLGljb259ID0gZGF0YTtcclxuICAgICAgdGhpcy5oZWFkZXJUZW1wQ2VsbC5pbm5lckhUTUwgPSBNYXRoLnJvdW5kKHRlbXApO1xyXG4gICAgICAgJCgnI2ltYWdlLWNlbGwnKS5odG1sKHRoaXMuc2V0SWNvbignd2VhdGhlckltYWdlJyxudWxsLGljb24pKTtcclxuICAgIH0sXHJcbiAgICBzZXRJbmZvVGFiOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgbGV0IHt3aW5kU3BlZWQsaHVtaWRpdHksc3VucmlzZVRpbWUsc3Vuc2V0VGltZX0gPSBkYXRhO1xyXG4gICAgICB2YXIgaW5mbyA9IHRoaXMuaW5mb1BhbmVsLmNoaWxkcmVuO1xyXG4gICAgICB2YXIgaW5mb1RvUGxhY2UgPSBbXHJcbiAgICAgIGAke01hdGgucm91bmQod2luZFNwZWVkKX08c3BhbiBpZD1cIm1waFwiPm1waDwvc3Bhbj5gLFxyXG4gICAgICAgIGAke01hdGgucm91bmQoaHVtaWRpdHkgKiAxMDApfTxzcGFuIGlkPVwicGVyY2VudFwiPiU8L3NwYW4+YCxcclxuICAgICAgICBgJHtmb3JtYXRUaW1lKHN1bnJpc2VUaW1lKS50aW1lfTxzcGFuIGlkPVwicGVyaW9kXCI+JHtmb3JtYXRUaW1lKHN1bnJpc2VUaW1lKS53aGVufTwvc3Bhbj5gLFxyXG4gICAgICAgIGAke2Zvcm1hdFRpbWUoc3Vuc2V0VGltZSkudGltZX08c3BhbiBpZD1cInBlcmlvZFwiPiR7Zm9ybWF0VGltZShzdW5zZXRUaW1lKS53aGVufTwvc3Bhbj5gXHJcbiAgICAgIF07XHJcbiAgICAgIHZhciBjb3VudGVyID0gMDtcclxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGluZm8ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgdmFyIGJveGVzID0gaW5mb1tpXS5jaGlsZHJlbjtcclxuICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYm94ZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICBpZihib3hlc1t4XS5jbGFzc0xpc3QuY29udGFpbnMoJ2JveC1sZWZ0Jykpe1xyXG4gICAgICAgICAgICAgICAgYm94ZXNbeF0uZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gaW5mb1RvUGxhY2VbY291bnRlcl07XHJcbiAgICAgICAgICAgICAgICBjb3VudGVyKys7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBmb3JtYXRUaW1lKHVuaXhUaW1lKXtcclxuICAgICAgICB2YXIgdGltZSA9IG5ldyBEYXRlKCB1bml4VGltZSAqIDEwMDApLnRvU3RyaW5nKCkuc3BsaXQoJyAnKVs0XS5zbGljZSgwLCAtMyk7XHJcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgYSB6ZXJvIHJlbW92ZSBpdFxyXG4gICAgICAgIGNvbnN0IGhyID0gcGFyc2VJbnQodGltZS5zbGljZSgwLCAyKSk7XHJcbiAgICAgICAgaWYocGFyc2VJbnQodGltZS5jaGFyQXQoMCkpID09PSAwKSB7XHJcbiAgICAgICAgICB0aW1lID0gdGltZS5zbGljZSgxKTtcclxuICAgICAgICAgIC8vIHRpbWUgaXMgaW4gdGhlIGFtXHJcbiAgICAgICAgICByZXR1cm4ge3doZW46J2FtJyx0aW1lOnRpbWV9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIGhyID4gMTIpIHtcclxuICAgICAgICAgIHRpbWUgPSBociAtIDEyICsgdGltZS5zbGljZSgyKTtcclxuICAgICAgICAgIC8vIHRpbWUgaXMgaW4gdGhlIHBtXHJcbiAgICAgICAgICByZXR1cm4ge3doZW46J3BtJyx0aW1lOnRpbWV9O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gc2V0V2luZChzcGQpIHtcclxuICAgICAgICBbXHJcbiAgICAgICAgICBbMjAsIDNdLFxyXG4gICAgICAgICAgWzQwLCAxLjVdLFxyXG4gICAgICAgICAgWzYwLCAxXSxcclxuICAgICAgICAgIFs4MCwgLjhdLFxyXG4gICAgICAgICAgWzEwMCwgLjVdXHJcbiAgICAgICAgXS5yZWR1Y2UoZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgICAgaWYgKHNwZCA+IGFbMF0gJiYgc3BkIDw9IGJbMF0pIHtcclxuICAgICAgICAgICAgdmFyIGR1cmF0aW9uID0gYlsxXSArIFwic1wiO1xyXG4gICAgICAgICAgICAkKCcjdFNwaW5uZXInKS5jc3MoXCJhbmltYXRpb24tZHVyYXRpb25cIiwgZHVyYXRpb24pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGI7XHJcbiAgICAgICAgfSwgWzBdKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2V0V2luZCh3aW5kU3BlZWQpO1xyXG4gICAgfSxcclxuICAgIHNldEZvcmVjYXN0OiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgY29uc3QgZGF5cyA9IGRhdGEuZGF5cztcclxuICAgICAgY29uc3QgdGhyZWVEYXlGb3JlY2FzdCA9IGRheXMuZmlsdGVyKCAoZGF5LGluZGV4KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGluZGV4ID4gMCAmJiBpbmRleCA8IDRcclxuICAgICAgfSlcclxuICAgICAgY29uc3QgZGF5RWxlbXMgPSB0aGlzLmZvcmVjYXN0UGFuZWwuY2hpbGRyZW47XHJcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBkYXlFbGVtcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgbGV0IGJveGVzID0gZGF5RWxlbXNbaV0uY2hpbGRyZW47XHJcbiAgICAgICAgZm9yKHZhciB4ID0gMDsgeCA8IGJveGVzLmxlbmd0aDsgeCsrKXtcclxuICAgICAgICAgIGNvbnN0IGJveCA9IGJveGVzW3hdO1xyXG4gICAgICAgICAgaWYgKGJveC5jaGlsZHJlblswXSAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICBpZiAoYm94LmNoaWxkcmVuWzBdLnRhZ05hbWUgPT09IFwiSDNcIil7XHJcbiAgICAgICAgICAgICAgYm94LmNoaWxkcmVuWzBdLmlubmVySFRNTCA9IE1hdGgucm91bmQodGhyZWVEYXlGb3JlY2FzdFtpXS50ZW1wZXJhdHVyZU1heClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgc2V0SWNvbjogZnVuY3Rpb24oaHRtbElkLCBodG1sQ2xhc3MsIHN0cikge1xyXG4gICAgICAvLyBtYXRjaCBkZXNpZ25lZCBpY29uIHRvIHByb3ZpZGVkIGljb25cclxuICAgICAgdmFyIHdlYXRoZXJJY29ucyA9IFt7XHJcbiAgICAgICAgJ2lkcyc6IFsnY2xlYXItbmlnaHQnLCdjbGVhci1kYXknXSxcclxuICAgICAgICAndGFnJzogXCI8aW1nIGlkPSdcIiArIGh0bWxJZCArIFwiJyBjbGFzcz0nXCIgKyBodG1sQ2xhc3MgKyBcIicgc3JjPSdzcmMvYXNzZXRzL2ltYWdlcy9zdmctc3VuLnN2Zyc+XCIsXHJcbiAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJ2NsZWFyIHNreSdcclxuICAgICAgfSwge1xyXG4gICAgICAgICdpZHMnOiBbJ3BhcnRseS1jbG91ZHktZGF5J10sXHJcbiAgICAgICAgJ3RhZyc6IFwiPGltZyBpZD0nXCIgKyBodG1sSWQgKyBcIicgY2xhc3M9J1wiICsgaHRtbENsYXNzICsgXCInIHNyYz0nc3JjL2Fzc2V0cy9pbWFnZXMvc3ZnLXN1bi1jbG91ZHMuc3ZnJz5cIixcclxuICAgICAgICAnZGVzY3JpcHRpb24nOiAnZmV3IGNsb3VkcydcclxuICAgICAgfSwge1xyXG4gICAgICAgICdpZHMnOiBbJ3BhcnRseS1jbG91ZHktbmlnaHQnLCdjbG91ZHknXSxcclxuICAgICAgICAndGFnJzogXCI8aW1nIGlkPSdcIiArIGh0bWxJZCArIFwiJyAgY2xhc3M9J1wiICsgaHRtbENsYXNzICsgXCInIHNyYz0nc3JjL2Fzc2V0cy9pbWFnZXMvc3ZnLWNsb3Vkcy5zdmcnPlwiLFxyXG4gICAgICAgICdkZXNjcmlwdGlvbic6ICdjbG91ZHknXHJcbiAgICAgIH0sIHtcclxuICAgICAgICAnaWRzJzogWydyYWluJywnaGFpbCddLFxyXG4gICAgICAgICd0YWcnOiBcIjxpbWcgaWQ9J1wiICsgaHRtbElkICsgXCInIGNsYXNzPSdcIiArIGh0bWxDbGFzcyArIFwiJyBzcmM9J3NyYy9hc3NldHMvaW1hZ2VzL3N2Zy1yYWluLnN2Zyc+XCIsXHJcbiAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJ3Nob3dlciByYWluJ1xyXG4gICAgICB9LHtcclxuICAgICAgICAnaWRzJzogWyd0aHVuZGVyc3Rvcm0nXSxcclxuICAgICAgICAndGFnJzogXCI8aW1nIGlkPSdcIiArIGh0bWxJZCArIFwiJyBjbGFzcz0nXCIgKyBodG1sQ2xhc3MgKyBcIicgc3JjPSdzcmMvYXNzZXRzL2ltYWdlcy9zdmctbGlnaHRuaW5nLnN2Zyc+XCIsXHJcbiAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJ3RodW5kZXJzdG9ybSdcclxuICAgICAgfSwge1xyXG4gICAgICAgICdpZHMnOiBbJ2hhaWwnXSxcclxuICAgICAgICAndGFnJzogXCI8aW1nIGlkPSdcIiArIGh0bWxJZCArIFwiJyBjbGFzcz0nXCIgKyBodG1sQ2xhc3MgKyBcIicgc3JjPSdzcmMvYXNzZXRzL2ltYWdlcy9zdmctc25vdy5zdmcnPlwiLFxyXG4gICAgICAgICdkZXNjcmlwdGlvbic6ICdzbm93J1xyXG4gICAgICB9LCB7XHJcbiAgICAgICAgJ2lkcyc6IFsnZm9nJywnd2luZCddLFxyXG4gICAgICAgICd0YWcnOiBcIjxpbWcgaWQ9J1wiICsgaHRtbElkICsgXCInIGNsYXNzPSdcIiArIGh0bWxDbGFzcyArIFwiJyBzcmM9J3NyYy9hc3NldHMvaW1hZ2VzL3N2Zy1taXN0LnN2Zyc+XCIsXHJcbiAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJ21pc3QnXHJcbiAgICAgIH1dO1xyXG4gICAgICAvLyAgaXRlcmF0ZSBvdmVyIGFycmF5IG9mIGltYWdlIHRhZyBvYmplY3RzIGludG8gc2luZ2xlIHVybFxyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3ZWF0aGVySWNvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgb2JqID0gd2VhdGhlckljb25zW2ldO1xyXG4gICAgICAgIHZhciBpZE1hdGNoZXMgPSBvYmouaWRzLmZpbHRlcihmdW5jdGlvbihJRHN0cil7XHJcbiAgICAgICAgICByZXR1cm4gc3RyID09PSBJRHN0cjtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoaWRNYXRjaGVzLmxlbmd0aCA+PSAxKXtcclxuICAgICAgICAgIHJldHVybiBvYmoudGFnO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhcHAuc3RhcnQoKTtcclxufVxyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBzcmMvYXNzZXRzL2phdmFzY3JpcHRzL2xvYWRBcHAuanNcbiAqKi8iXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTs7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFPQTs7OztBQWtCQTtBQUNBO0FBZkE7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQWRBO0FBcUJBO0FBQ0E7QUFDQTtBQXZCQTtBQXlCQTs7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUxBO0FBSkE7QUFUQTtBQXNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFOQTtBQVdBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQURBO0FBRkE7QUFDQTtBQVNBO0FBQ0E7O0FBREE7QUFJQTtBQUNBOztBQURBO0FBQUE7QUFLQTs7QUFEQTtBQUFBO0FBUkE7QUFDQTtBQWNBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBTEE7QUFQQTtBQUNBO0FBZUE7QUFuREE7QUFxREE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQURBO0FBRkE7QUFGQTtBQU5BO0FBb0JBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFQQTtBQVNBO0FBQ0E7QUFDQTtBQVhBO0FBYUE7QUFDQTtBQUNBO0FBZkE7QUFpQkE7QUFDQTtBQUNBO0FBbkJBO0FBcUJBO0FBQ0E7QUFDQTtBQXZCQTtBQXlCQTtBQUNBO0FBQ0E7QUEzQkE7OztBQUZBO0FBa0NBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQURBO0FBTEE7QUFqQ0E7QUF6SkE7QUFDQTtBQXNNQTtBQXpNQSIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ }
/******/ ]);