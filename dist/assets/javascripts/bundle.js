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
/******/ 	var hotCurrentHash = "263562a8db506f9f8324"; // eslint-disable-line no-unused-vars
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

	eval("'use strict';\n\nvar _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"]) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError(\"Invalid attempt to destructure non-iterable instance\"); } }; }();\n\n// load app\nmodule.exports = function (position) {\n\n  var app = {\n    start: function start() {\n      var _position$coords = position.coords;\n      var lat = _position$coords.latitude;\n      var lon = _position$coords.longitude;\n      // Get location name then Get current weather and forecast\n\n      var gettingLocationName = new Promise(this.getLocationName.bind(this, lat, lon));\n      var gettingWeather = new Promise(this.getWeatherAndForecast.bind(this, lat, lon));\n\n      var tasks = Promise.all([gettingLocationName, gettingWeather]).then(this.handleJSON.bind(this));\n    },\n    handleJSON: function handleJSON(response) {\n      // big destructuing of data .. just have to take a second to follow it\n      // this function also passes the required information to smaller functions to update ui\n\n      var _response = _slicedToArray(response, 2);\n\n      var locationName = _response[0];\n      var _response$ = _response[1];\n      var _response$$currently = _response$.currently;\n      var windSpeed = _response$$currently.windSpeed;\n      var temperature = _response$$currently.temperature;\n      var humidity = _response$$currently.humidity;\n      var cloudCover = _response$$currently.cloudCover;\n      var icon = _response$$currently.icon;\n      var summery = _response$$currently.summery;\n\n      var _response$$daily$data = _slicedToArray(_response$.daily.data, 1);\n\n      var _response$$daily$data2 = _response$$daily$data[0];\n      var sunsetTime = _response$$daily$data2.sunsetTime;\n      var sunriseTime = _response$$daily$data2.sunriseTime;\n\n      // sending in payloads with only relevant info\n\n      this.setHeaderInfo({ locationName: locationName, temperature: temperature, icon: icon });\n      this.setInfoTab({ windSpeed: windSpeed, humidity: humidity, sunriseTime: sunriseTime, sunsetTime: sunsetTime });\n      this.setForecast();\n    },\n    getLocationName: function getLocationName(lat, lon, res, rej) {\n      // get the current location ie neighborhood or city based on lat & long using google maps api\n      var urlBase = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';\n      var googleKey = '&key=AIzaSyArtLLZvhmNHbUOL7DJKyO7TBwArl1jPE0';\n      var urlRestrictions = window.screen.width < 415 ? '' // nothing if we are on mobile\n      : '&location_type=APPROXIMATE';\n      var fullApiUrl = urlBase + lat + ',' + lon + googleKey + urlRestrictions;\n\n      $.getJSON(fullApiUrl, function (data) {\n        if (data.error_message) {\n          console.log(data.status + '|' + data.error_message);\n          rej();\n        } else if (data.status === \"OK\") {\n          console.log('successful location found using google\\n');\n          res(data.results[0].formatted_address);\n        } else {\n          console.log('other error..', data.status);\n          rej(data);\n        }\n      });\n    },\n    getWeatherAndForecast: function getWeatherAndForecast(lat, lon, res, rej) {\n      var baseUrl = 'https://api.forecast.io/forecast';\n      var forecastKey = 'e10af8d470cd4b3567a15eb36ed235bb';\n      var clBk = '?callback=?';\n      var url_api = baseUrl + '/' + forecastKey + '/' + lat + ',' + lon + clBk;\n\n      $.getJSON(url_api, function (data) {\n        res(data);\n      });\n    },\n    setHeaderInfo: function setHeaderInfo(data) {\n      var temp = data.temperature;\n      var name = data.locationName;\n      var icon = data.icon;\n\n      console.log('Header: ', temp, name, icon);\n    },\n    setInfoTab: function setInfoTab(data) {\n      var windSpeed = data.windSpeed;\n      var humidity = data.humidity;\n      var sunriseTime = data.sunriseTime;\n      var sunsetTime = data.sunsetTime;\n\n\n      function formatTime(unixTime) {\n        var time = new Date(unixTime * 1000).toString().split(' ')[4].slice(0, -3);\n        // if there is a zero remove it\n        var hr = parseInt(time.slice(0, 2));\n        if (parseInt(time.charAt(0)) === 0) {\n          time = time.slice(1);\n          // time is in the am\n          return { when: 'am', time: time };\n        } else if (hr > 12) {\n          time = hr - 12 + time.slice(2);\n          // time is in the pm\n          return { when: 'pm', time: time };\n        }\n      }\n      console.log('Info-Tab: ', windSpeed, humidity * 100, formatTime(sunriseTime), formatTime(sunsetTime));\n    },\n    setForecast: function setForecast(data) {\n      // need\n      // {temp , day of week and number, icon} X 3\n    }\n  };\n\n  app.start();\n};//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvYXNzZXRzL2phdmFzY3JpcHRzL2xvYWRBcHAuanM/OTllMiJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsb2FkIGFwcFxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHBvc2l0aW9uKXtcclxuXHJcbiAgdmFyIGFwcCA9IHtcclxuICAgIHN0YXJ0OiBmdW5jdGlvbigpe1xyXG4gICAgICB2YXIgeyBjb29yZHM6eyBsYXRpdHVkZTpsYXQsIGxvbmdpdHVkZTpsb24gfSB9ID0gcG9zaXRpb247XHJcbiAgICAgIC8vIEdldCBsb2NhdGlvbiBuYW1lIHRoZW4gR2V0IGN1cnJlbnQgd2VhdGhlciBhbmQgZm9yZWNhc3RcclxuICAgICAgdmFyIGdldHRpbmdMb2NhdGlvbk5hbWUgPSBuZXcgUHJvbWlzZSggdGhpcy5nZXRMb2NhdGlvbk5hbWUuYmluZCh0aGlzLGxhdCxsb24pIClcclxuICAgICAgdmFyIGdldHRpbmdXZWF0aGVyID0gbmV3IFByb21pc2UoIHRoaXMuZ2V0V2VhdGhlckFuZEZvcmVjYXN0LmJpbmQodGhpcyxsYXQsbG9uKSApXHJcblxyXG4gICAgICB2YXIgdGFza3MgPSBQcm9taXNlLmFsbChbZ2V0dGluZ0xvY2F0aW9uTmFtZSxnZXR0aW5nV2VhdGhlcl0pLnRoZW4odGhpcy5oYW5kbGVKU09OLmJpbmQodGhpcykpXHJcbiAgICB9LFxyXG4gICAgaGFuZGxlSlNPTjogZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAvLyBiaWcgZGVzdHJ1Y3R1aW5nIG9mIGRhdGEgLi4ganVzdCBoYXZlIHRvIHRha2UgYSBzZWNvbmQgdG8gZm9sbG93IGl0XHJcbiAgICAgIC8vIHRoaXMgZnVuY3Rpb24gYWxzbyBwYXNzZXMgdGhlIHJlcXVpcmVkIGluZm9ybWF0aW9uIHRvIHNtYWxsZXIgZnVuY3Rpb25zIHRvIHVwZGF0ZSB1aVxyXG4gICAgICBjb25zdCBbXHJcbiAgICAgICAgbG9jYXRpb25OYW1lLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGN1cnJlbnRseTp7XHJcbiAgICAgICAgICAgIHdpbmRTcGVlZCx0ZW1wZXJhdHVyZSxodW1pZGl0eSxjbG91ZENvdmVyLGljb24sc3VtbWVyeVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGRhaWx5OntcclxuICAgICAgICAgICAgZGF0YTpbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc3Vuc2V0VGltZSxcclxuICAgICAgICAgICAgICAgIHN1bnJpc2VUaW1lXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBdID0gcmVzcG9uc2U7XHJcblxyXG4gICAgICAvLyBzZW5kaW5nIGluIHBheWxvYWRzIHdpdGggb25seSByZWxldmFudCBpbmZvXHJcbiAgICAgIHRoaXMuc2V0SGVhZGVySW5mbyh7bG9jYXRpb25OYW1lLHRlbXBlcmF0dXJlLGljb259KTtcclxuICAgICAgdGhpcy5zZXRJbmZvVGFiKHt3aW5kU3BlZWQsaHVtaWRpdHksc3VucmlzZVRpbWUsc3Vuc2V0VGltZX0pO1xyXG4gICAgICB0aGlzLnNldEZvcmVjYXN0KCk7XHJcbiAgICB9LFxyXG4gICAgZ2V0TG9jYXRpb25OYW1lOiBmdW5jdGlvbihsYXQsbG9uLHJlcyxyZWope1xyXG4gICAgICAvLyBnZXQgdGhlIGN1cnJlbnQgbG9jYXRpb24gaWUgbmVpZ2hib3Job29kIG9yIGNpdHkgYmFzZWQgb24gbGF0ICYgbG9uZyB1c2luZyBnb29nbGUgbWFwcyBhcGlcclxuICAgICAgdmFyIHVybEJhc2UgPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbj9sYXRsbmc9JztcclxuICAgICAgdmFyIGdvb2dsZUtleSA9ICcma2V5PUFJemFTeUFydExMWnZobU5IYlVPTDdESkt5TzdUQndBcmwxalBFMCc7XHJcbiAgICAgIHZhciB1cmxSZXN0cmljdGlvbnMgPSAod2luZG93LnNjcmVlbi53aWR0aCA8IDQxNSlcclxuICAgICAgICA/ICcnIC8vIG5vdGhpbmcgaWYgd2UgYXJlIG9uIG1vYmlsZVxyXG4gICAgICAgIDogJyZsb2NhdGlvbl90eXBlPUFQUFJPWElNQVRFJztcclxuICAgICAgdmFyIGZ1bGxBcGlVcmwgPSB1cmxCYXNlICsgbGF0ICsgJywnKyBsb24gKyBnb29nbGVLZXkgKyB1cmxSZXN0cmljdGlvbnM7XHJcblxyXG4gICAgICAkLmdldEpTT04oZnVsbEFwaVVybCwgZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgaWYgKGRhdGEuZXJyb3JfbWVzc2FnZSl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLnN0YXR1cyArICd8JyArIGRhdGEuZXJyb3JfbWVzc2FnZSlcclxuICAgICAgICAgIHJlaigpXHJcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLnN0YXR1cyA9PT0gXCJPS1wiKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnc3VjY2Vzc2Z1bCBsb2NhdGlvbiBmb3VuZCB1c2luZyBnb29nbGVcXG4nKTtcclxuICAgICAgICAgIHJlcyhkYXRhLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3MpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdvdGhlciBlcnJvci4uJyxkYXRhLnN0YXR1cyk7XHJcbiAgICAgICAgICByZWooZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGdldFdlYXRoZXJBbmRGb3JlY2FzdDogZnVuY3Rpb24obGF0LGxvbixyZXMscmVqKXtcclxuICAgICAgdmFyIGJhc2VVcmwgPSAnaHR0cHM6Ly9hcGkuZm9yZWNhc3QuaW8vZm9yZWNhc3QnO1xyXG4gICAgICB2YXIgZm9yZWNhc3RLZXkgPSAnZTEwYWY4ZDQ3MGNkNGIzNTY3YTE1ZWIzNmVkMjM1YmInO1xyXG4gICAgICB2YXIgY2xCayA9ICc/Y2FsbGJhY2s9Pyc7XHJcbiAgICAgIHZhciB1cmxfYXBpID0gYmFzZVVybCArICcvJyArIGZvcmVjYXN0S2V5ICsgJy8nICsgbGF0ICsgJywnICsgbG9uICsgY2xCaztcclxuXHJcbiAgICAgICQuZ2V0SlNPTih1cmxfYXBpLCBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICByZXMoZGF0YSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcbiAgICBzZXRIZWFkZXJJbmZvOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgY29uc3Qge3RlbXBlcmF0dXJlOnRlbXAsbG9jYXRpb25OYW1lOm5hbWUsaWNvbn0gPSBkYXRhO1xyXG4gICAgICBjb25zb2xlLmxvZygnSGVhZGVyOiAnLHRlbXAsbmFtZSxpY29uKTtcclxuICAgIH0sXHJcbiAgICBzZXRJbmZvVGFiOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgbGV0IHt3aW5kU3BlZWQsaHVtaWRpdHksc3VucmlzZVRpbWUsc3Vuc2V0VGltZX0gPSBkYXRhO1xyXG5cclxuICAgICAgZnVuY3Rpb24gZm9ybWF0VGltZSh1bml4VGltZSl7XHJcbiAgICAgICAgdmFyIHRpbWUgPSBuZXcgRGF0ZSggdW5peFRpbWUgKiAxMDAwKS50b1N0cmluZygpLnNwbGl0KCcgJylbNF0uc2xpY2UoMCwgLTMpO1xyXG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIGEgemVybyByZW1vdmUgaXRcclxuICAgICAgICBjb25zdCBociA9IHBhcnNlSW50KHRpbWUuc2xpY2UoMCwgMikpO1xyXG4gICAgICAgIGlmKHBhcnNlSW50KHRpbWUuY2hhckF0KDApKSA9PT0gMCkge1xyXG4gICAgICAgICAgdGltZSA9IHRpbWUuc2xpY2UoMSk7XHJcbiAgICAgICAgICAvLyB0aW1lIGlzIGluIHRoZSBhbVxyXG4gICAgICAgICAgcmV0dXJuIHt3aGVuOidhbScsdGltZTp0aW1lfTtcclxuICAgICAgICB9IGVsc2UgaWYgKCBociA+IDEyKSB7XHJcbiAgICAgICAgICB0aW1lID0gaHIgLSAxMiArIHRpbWUuc2xpY2UoMik7XHJcbiAgICAgICAgICAvLyB0aW1lIGlzIGluIHRoZSBwbVxyXG4gICAgICAgICAgcmV0dXJuIHt3aGVuOidwbScsdGltZTp0aW1lfTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgJ0luZm8tVGFiOiAnLHdpbmRTcGVlZCxodW1pZGl0eSAqIDEwMCwgZm9ybWF0VGltZShzdW5yaXNlVGltZSksZm9ybWF0VGltZShzdW5zZXRUaW1lKVxyXG4gICAgICApO1xyXG5cclxuICAgIH0sXHJcbiAgICBzZXRGb3JlY2FzdDogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgIC8vIG5lZWRcclxuICAgICAgLy8ge3RlbXAgLCBkYXkgb2Ygd2VlayBhbmQgbnVtYmVyLCBpY29ufSBYIDNcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFwcC5zdGFydCgpO1xyXG59XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHNyYy9hc3NldHMvamF2YXNjcmlwdHMvbG9hZEFwcC5qc1xuICoqLyJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTs7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBTkE7QUFRQTs7OztBQWtCQTtBQUNBO0FBZkE7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQWRBO0FBcUJBO0FBQ0E7QUFDQTtBQXZCQTtBQXlCQTs7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUxBO0FBSkE7QUFUQTtBQXNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFOQTtBQVdBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUZBO0FBSUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUNBOztBQURBO0FBSUE7QUFDQTs7QUFEQTtBQUFBO0FBS0E7O0FBREE7QUFBQTtBQVJBO0FBY0E7QUFqQkE7QUFzQkE7OztBQUFBO0FBN0ZBO0FBQ0E7QUFrR0E7QUFyR0EiLCJzb3VyY2VSb290IjoiIn0=");

/***/ }
/******/ ]);