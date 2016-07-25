/******/ (function(modules) { // webpackBootstrap
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
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

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

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _window = __webpack_require__(1);

	var _window2 = _interopRequireDefault(_window);

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var electron = __webpack_require__(15);
	var remote = electron.remote;
	var Menu = remote.Menu;

	_mithril2.default.mount(document.body, _window2.default);

	var InputMenu = Menu.buildFromTemplate([{
	    label: 'Undo',
	    role: 'undo'
	}, {
	    label: 'Redo',
	    role: 'redo'
	}, {
	    type: 'separator'
	}, {
	    label: 'Cut',
	    role: 'cut'
	}, {
	    label: 'Copy',
	    role: 'copy'
	}, {
	    label: 'Paste',
	    role: 'paste'
	}, {
	    type: 'separator'
	}, {
	    label: 'Select all',
	    role: 'selectall'
	}]);

	document.body.addEventListener('contextmenu', function (e) {
	    e.preventDefault();
	    e.stopPropagation();

	    var node = e.target;

	    while (node) {
	        if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
	            InputMenu.popup(remote.getCurrentWindow());
	            break;
	        }
	        node = node.parentNode;
	    }
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	__webpack_require__(4);

	__webpack_require__(8);

	__webpack_require__(10);

	__webpack_require__(12);

	var _header = __webpack_require__(14);

	var _header2 = _interopRequireDefault(_header);

	var _menu = __webpack_require__(16);

	var _menu2 = _interopRequireDefault(_menu);

	var _explorer = __webpack_require__(17);

	var _explorer2 = _interopRequireDefault(_explorer);

	var _project = __webpack_require__(21);

	var _project2 = _interopRequireDefault(_project);

	var _quickEdit = __webpack_require__(22);

	var _quickEdit2 = _interopRequireDefault(_quickEdit);

	var _targetProcess = __webpack_require__(24);

	var _targetProcess2 = _interopRequireDefault(_targetProcess);

	var _notifications = __webpack_require__(25);

	var _notifications2 = _interopRequireDefault(_notifications);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _require = __webpack_require__(15);

	var ipcRenderer = _require.ipcRenderer;

	// Other modules

	var target = null;
	ipcRenderer.on('set-target', function (event, resultTarget) {
		if (resultTarget.result) {
			_notifications2.default.doNotify({ title: 'Injection', body: 'APE injection was successful' }, true);
			target = resultTarget;
		} else {
			_notifications2.default.doNotify({ title: 'Injection', body: 'APE could not inject the DLL' }, true);
			target = null;
		}

		_mithril2.default.endComputation();
	});

	ipcRenderer.on('lost-target', function (event, lostTarget) {
		_notifications2.default.doNotify({ title: 'Injection', body: 'APE lost connection with ' + lostTarget.name }, true);
		target = lostTarget;
		_mithril2.default.redraw();
	});

	ipcRenderer.on('save-result', function (event, result) {
		if (result) {
			_notifications2.default.doNotify({ title: 'Injection', body: 'Saved file' }, true);
		} else {
			_notifications2.default.doNotify({ title: 'Injection', body: 'Could not save file' }, true);
		}
	});

	exports.default = {
		controller: function controller() {
			return {
				inputValue: _mithril2.default.prop(""),
				showing: [false, false, false, false, false]
			};
		},

		changeFrame: function changeFrame(e) {
			this.showing = [false, false, false, false, false];
			this.showing[e.target.dataset.target] = true;
		},

		overlayFrame: function overlayFrame(e) {
			this.showing[e.target.dataset.target] = true;
		},

		closeOverlayFrame: function closeOverlayFrame(which, e) {
			this.showing[which] = false;
		},

		view: function view(ctrl) {
			return (0, _mithril2.default)("div.height100.showing-explorer", (0, _mithril2.default)(_header2.default, { target: target }), (0, _mithril2.default)(_menu2.default, {
				showing: ctrl.showing,
				default: 2,
				changeFrame: this.changeFrame.bind(ctrl),
				overlayFrame: this.overlayFrame.bind(ctrl),
				closeOverlayFrame: this.closeOverlayFrame.bind(ctrl)
			}), (0, _mithril2.default)(_project2.default, {
				showing: ctrl.showing[1]
			}), (0, _mithril2.default)(_quickEdit2.default, { showing: ctrl.showing[3] }), (0, _mithril2.default)(_targetProcess2.default, { showing: ctrl.showing[0], closeOverlayFrame: this.closeOverlayFrame.bind(ctrl, 0) }), (0, _mithril2.default)(_explorer2.default, {
				changeFrame: this.changeFrame.bind(ctrl)
			}));
		}
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {;(function (global, factory) { // eslint-disable-line
		"use strict"
		/* eslint-disable no-undef */
		var m = factory(global)
		if (typeof module === "object" && module != null && module.exports) {
			module.exports = m
		} else if (true) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function () { return m }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
		} else {
			global.m = m
		}
		/* eslint-enable no-undef */
	})(typeof window !== "undefined" ? window : this, function (global, undefined) { // eslint-disable-line
		"use strict"

		m.version = function () {
			return "v0.2.5"
		}

		var hasOwn = {}.hasOwnProperty
		var type = {}.toString

		function isFunction(object) {
			return typeof object === "function"
		}

		function isObject(object) {
			return type.call(object) === "[object Object]"
		}

		function isString(object) {
			return type.call(object) === "[object String]"
		}

		var isArray = Array.isArray || function (object) {
			return type.call(object) === "[object Array]"
		}

		function noop() {}

		var voidElements = {
			AREA: 1,
			BASE: 1,
			BR: 1,
			COL: 1,
			COMMAND: 1,
			EMBED: 1,
			HR: 1,
			IMG: 1,
			INPUT: 1,
			KEYGEN: 1,
			LINK: 1,
			META: 1,
			PARAM: 1,
			SOURCE: 1,
			TRACK: 1,
			WBR: 1
		}

		// caching commonly used variables
		var $document, $location, $requestAnimationFrame, $cancelAnimationFrame

		// self invoking function needed because of the way mocks work
		function initialize(mock) {
			$document = mock.document
			$location = mock.location
			$cancelAnimationFrame = mock.cancelAnimationFrame || mock.clearTimeout
			$requestAnimationFrame = mock.requestAnimationFrame || mock.setTimeout
		}

		// testing API
		m.deps = function (mock) {
			initialize(global = mock || window)
			return global
		}

		m.deps(global)

		/**
		 * @typedef {String} Tag
		 * A string that looks like -> div.classname#id[param=one][param2=two]
		 * Which describes a DOM node
		 */

		function parseTagAttrs(cell, tag) {
			var classes = []
			var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g
			var match

			while ((match = parser.exec(tag))) {
				if (match[1] === "" && match[2]) {
					cell.tag = match[2]
				} else if (match[1] === "#") {
					cell.attrs.id = match[2]
				} else if (match[1] === ".") {
					classes.push(match[2])
				} else if (match[3][0] === "[") {
					var pair = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/.exec(match[3])
					cell.attrs[pair[1]] = pair[3] || ""
				}
			}

			return classes
		}

		function getVirtualChildren(args, hasAttrs) {
			var children = hasAttrs ? args.slice(1) : args

			if (children.length === 1 && isArray(children[0])) {
				return children[0]
			} else {
				return children
			}
		}

		function assignAttrs(target, attrs, classes) {
			var classAttr = "class" in attrs ? "class" : "className"

			for (var attrName in attrs) {
				if (hasOwn.call(attrs, attrName)) {
					if (attrName === classAttr &&
							attrs[attrName] != null &&
							attrs[attrName] !== "") {
						classes.push(attrs[attrName])
						// create key in correct iteration order
						target[attrName] = ""
					} else {
						target[attrName] = attrs[attrName]
					}
				}
			}

			if (classes.length) target[classAttr] = classes.join(" ")
		}

		/**
		 *
		 * @param {Tag} The DOM node tag
		 * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
		 * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array,
		 *                      or splat (optional)
		 */
		function m(tag, pairs) {
			var args = []

			for (var i = 1, length = arguments.length; i < length; i++) {
				args[i - 1] = arguments[i]
			}

			if (isObject(tag)) return parameterize(tag, args)

			if (!isString(tag)) {
				throw new Error("selector in m(selector, attrs, children) should " +
					"be a string")
			}

			var hasAttrs = pairs != null && isObject(pairs) &&
				!("tag" in pairs || "view" in pairs || "subtree" in pairs)

			var attrs = hasAttrs ? pairs : {}
			var cell = {
				tag: "div",
				attrs: {},
				children: getVirtualChildren(args, hasAttrs)
			}

			assignAttrs(cell.attrs, attrs, parseTagAttrs(cell, tag))
			return cell
		}

		function forEach(list, f) {
			for (var i = 0; i < list.length && !f(list[i], i++);) {
				// function called in condition
			}
		}

		function forKeys(list, f) {
			forEach(list, function (attrs, i) {
				return (attrs = attrs && attrs.attrs) &&
					attrs.key != null &&
					f(attrs, i)
			})
		}
		// This function was causing deopts in Chrome.
		function dataToString(data) {
			// data.toString() might throw or return null if data is the return
			// value of Console.log in some versions of Firefox (behavior depends on
			// version)
			try {
				if (data != null && data.toString() != null) return data
			} catch (e) {
				// silently ignore errors
			}
			return ""
		}

		// This function was causing deopts in Chrome.
		function injectTextNode(parentElement, first, index, data) {
			try {
				insertNode(parentElement, first, index)
				first.nodeValue = data
			} catch (e) {
				// IE erroneously throws error when appending an empty text node
				// after a null
			}
		}

		function flatten(list) {
			// recursively flatten array
			for (var i = 0; i < list.length; i++) {
				if (isArray(list[i])) {
					list = list.concat.apply([], list)
					// check current index again and flatten until there are no more
					// nested arrays at that index
					i--
				}
			}
			return list
		}

		function insertNode(parentElement, node, index) {
			parentElement.insertBefore(node,
				parentElement.childNodes[index] || null)
		}

		var DELETION = 1
		var INSERTION = 2
		var MOVE = 3

		function handleKeysDiffer(data, existing, cached, parentElement) {
			forKeys(data, function (key, i) {
				existing[key = key.key] = existing[key] ? {
					action: MOVE,
					index: i,
					from: existing[key].index,
					element: cached.nodes[existing[key].index] ||
						$document.createElement("div")
				} : {action: INSERTION, index: i}
			})

			var actions = []
			for (var prop in existing) {
				if (hasOwn.call(existing, prop)) {
					actions.push(existing[prop])
				}
			}

			var changes = actions.sort(sortChanges)
			var newCached = new Array(cached.length)

			newCached.nodes = cached.nodes.slice()

			forEach(changes, function (change) {
				var index = change.index
				if (change.action === DELETION) {
					clear(cached[index].nodes, cached[index])
					newCached.splice(index, 1)
				}
				if (change.action === INSERTION) {
					var dummy = $document.createElement("div")
					dummy.key = data[index].attrs.key
					insertNode(parentElement, dummy, index)
					newCached.splice(index, 0, {
						attrs: {key: data[index].attrs.key},
						nodes: [dummy]
					})
					newCached.nodes[index] = dummy
				}

				if (change.action === MOVE) {
					var changeElement = change.element
					var maybeChanged = parentElement.childNodes[index]
					if (maybeChanged !== changeElement && changeElement !== null) {
						parentElement.insertBefore(changeElement,
							maybeChanged || null)
					}
					newCached[index] = cached[change.from]
					newCached.nodes[index] = changeElement
				}
			})

			return newCached
		}

		function diffKeys(data, cached, existing, parentElement) {
			var keysDiffer = data.length !== cached.length

			if (!keysDiffer) {
				forKeys(data, function (attrs, i) {
					var cachedCell = cached[i]
					return keysDiffer = cachedCell &&
						cachedCell.attrs &&
						cachedCell.attrs.key !== attrs.key
				})
			}

			if (keysDiffer) {
				return handleKeysDiffer(data, existing, cached, parentElement)
			} else {
				return cached
			}
		}

		function diffArray(data, cached, nodes) {
			// diff the array itself

			// update the list of DOM nodes by collecting the nodes from each item
			forEach(data, function (_, i) {
				if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes)
			})
			// remove items from the end of the array if the new array is shorter
			// than the old one. if errors ever happen here, the issue is most
			// likely a bug in the construction of the `cached` data structure
			// somewhere earlier in the program
			forEach(cached.nodes, function (node, i) {
				if (node.parentNode != null && nodes.indexOf(node) < 0) {
					clear([node], [cached[i]])
				}
			})

			if (data.length < cached.length) cached.length = data.length
			cached.nodes = nodes
		}

		function buildArrayKeys(data) {
			var guid = 0
			forKeys(data, function () {
				forEach(data, function (attrs) {
					if ((attrs = attrs && attrs.attrs) && attrs.key == null) {
						attrs.key = "__mithril__" + guid++
					}
				})
				return 1
			})
		}

		function isDifferentEnough(data, cached, dataAttrKeys) {
			if (data.tag !== cached.tag) return true

			if (dataAttrKeys.sort().join() !==
					Object.keys(cached.attrs).sort().join()) {
				return true
			}

			if (data.attrs.id !== cached.attrs.id) {
				return true
			}

			if (data.attrs.key !== cached.attrs.key) {
				return true
			}

			if (m.redraw.strategy() === "all") {
				return !cached.configContext || cached.configContext.retain !== true
			}

			if (m.redraw.strategy() === "diff") {
				return cached.configContext && cached.configContext.retain === false
			}

			return false
		}

		function maybeRecreateObject(data, cached, dataAttrKeys) {
			// if an element is different enough from the one in cache, recreate it
			if (isDifferentEnough(data, cached, dataAttrKeys)) {
				if (cached.nodes.length) clear(cached.nodes)

				if (cached.configContext &&
						isFunction(cached.configContext.onunload)) {
					cached.configContext.onunload()
				}

				if (cached.controllers) {
					forEach(cached.controllers, function (controller) {
						if (controller.onunload) {
							controller.onunload({preventDefault: noop})
						}
					})
				}
			}
		}

		function getObjectNamespace(data, namespace) {
			if (data.attrs.xmlns) return data.attrs.xmlns
			if (data.tag === "svg") return "http://www.w3.org/2000/svg"
			if (data.tag === "math") return "http://www.w3.org/1998/Math/MathML"
			return namespace
		}

		var pendingRequests = 0
		m.startComputation = function () { pendingRequests++ }
		m.endComputation = function () {
			if (pendingRequests > 1) {
				pendingRequests--
			} else {
				pendingRequests = 0
				m.redraw()
			}
		}

		function unloadCachedControllers(cached, views, controllers) {
			if (controllers.length) {
				cached.views = views
				cached.controllers = controllers
				forEach(controllers, function (controller) {
					if (controller.onunload && controller.onunload.$old) {
						controller.onunload = controller.onunload.$old
					}

					if (pendingRequests && controller.onunload) {
						var onunload = controller.onunload
						controller.onunload = noop
						controller.onunload.$old = onunload
					}
				})
			}
		}

		function scheduleConfigsToBeCalled(configs, data, node, isNew, cached) {
			// schedule configs to be called. They are called after `build` finishes
			// running
			if (isFunction(data.attrs.config)) {
				var context = cached.configContext = cached.configContext || {}

				// bind
				configs.push(function () {
					return data.attrs.config.call(data, node, !isNew, context,
						cached)
				})
			}
		}

		function buildUpdatedNode(
			cached,
			data,
			editable,
			hasKeys,
			namespace,
			views,
			configs,
			controllers
		) {
			var node = cached.nodes[0]

			if (hasKeys) {
				setAttributes(node, data.tag, data.attrs, cached.attrs, namespace)
			}

			cached.children = build(
				node,
				data.tag,
				undefined,
				undefined,
				data.children,
				cached.children,
				false,
				0,
				data.attrs.contenteditable ? node : editable,
				namespace,
				configs
			)

			cached.nodes.intact = true

			if (controllers.length) {
				cached.views = views
				cached.controllers = controllers
			}

			return node
		}

		function handleNonexistentNodes(data, parentElement, index) {
			var nodes
			if (data.$trusted) {
				nodes = injectHTML(parentElement, index, data)
			} else {
				nodes = [$document.createTextNode(data)]
				if (!(parentElement.nodeName in voidElements)) {
					insertNode(parentElement, nodes[0], index)
				}
			}

			var cached

			if (typeof data === "string" ||
					typeof data === "number" ||
					typeof data === "boolean") {
				cached = new data.constructor(data)
			} else {
				cached = data
			}

			cached.nodes = nodes
			return cached
		}

		function reattachNodes(
			data,
			cached,
			parentElement,
			editable,
			index,
			parentTag
		) {
			var nodes = cached.nodes
			if (!editable || editable !== $document.activeElement) {
				if (data.$trusted) {
					clear(nodes, cached)
					nodes = injectHTML(parentElement, index, data)
				} else if (parentTag === "textarea") {
					// <textarea> uses `value` instead of `nodeValue`.
					parentElement.value = data
				} else if (editable) {
					// contenteditable nodes use `innerHTML` instead of `nodeValue`.
					editable.innerHTML = data
				} else {
					// was a trusted string
					if (nodes[0].nodeType === 1 || nodes.length > 1 ||
							(nodes[0].nodeValue.trim &&
								!nodes[0].nodeValue.trim())) {
						clear(cached.nodes, cached)
						nodes = [$document.createTextNode(data)]
					}

					injectTextNode(parentElement, nodes[0], index, data)
				}
			}
			cached = new data.constructor(data)
			cached.nodes = nodes
			return cached
		}

		function handleTextNode(
			cached,
			data,
			index,
			parentElement,
			shouldReattach,
			editable,
			parentTag
		) {
			if (!cached.nodes.length) {
				return handleNonexistentNodes(data, parentElement, index)
			} else if (cached.valueOf() !== data.valueOf() || shouldReattach) {
				return reattachNodes(data, cached, parentElement, editable, index,
					parentTag)
			} else {
				return (cached.nodes.intact = true, cached)
			}
		}

		function getSubArrayCount(item) {
			if (item.$trusted) {
				// fix offset of next element if item was a trusted string w/ more
				// than one html element
				// the first clause in the regexp matches elements
				// the second clause (after the pipe) matches text nodes
				var match = item.match(/<[^\/]|\>\s*[^<]/g)
				if (match != null) return match.length
			} else if (isArray(item)) {
				return item.length
			}
			return 1
		}

		function buildArray(
			data,
			cached,
			parentElement,
			index,
			parentTag,
			shouldReattach,
			editable,
			namespace,
			configs
		) {
			data = flatten(data)
			var nodes = []
			var intact = cached.length === data.length
			var subArrayCount = 0

			// keys algorithm: sort elements without recreating them if keys are
			// present
			//
			// 1) create a map of all existing keys, and mark all for deletion
			// 2) add new keys to map and mark them for addition
			// 3) if key exists in new list, change action from deletion to a move
			// 4) for each key, handle its corresponding action as marked in
			//    previous steps

			var existing = {}
			var shouldMaintainIdentities = false

			forKeys(cached, function (attrs, i) {
				shouldMaintainIdentities = true
				existing[cached[i].attrs.key] = {action: DELETION, index: i}
			})

			buildArrayKeys(data)
			if (shouldMaintainIdentities) {
				cached = diffKeys(data, cached, existing, parentElement)
			}
			// end key algorithm

			var cacheCount = 0
			// faster explicitly written
			for (var i = 0, len = data.length; i < len; i++) {
				// diff each item in the array
				var item = build(
					parentElement,
					parentTag,
					cached,
					index,
					data[i],
					cached[cacheCount],
					shouldReattach,
					index + subArrayCount || subArrayCount,
					editable,
					namespace,
					configs)

				if (item !== undefined) {
					intact = intact && item.nodes.intact
					subArrayCount += getSubArrayCount(item)
					cached[cacheCount++] = item
				}
			}

			if (!intact) diffArray(data, cached, nodes)
			return cached
		}

		function makeCache(data, cached, index, parentIndex, parentCache) {
			if (cached != null) {
				if (type.call(cached) === type.call(data)) return cached

				if (parentCache && parentCache.nodes) {
					var offset = index - parentIndex
					var end = offset + (isArray(data) ? data : cached.nodes).length
					clear(
						parentCache.nodes.slice(offset, end),
						parentCache.slice(offset, end))
				} else if (cached.nodes) {
					clear(cached.nodes, cached)
				}
			}

			cached = new data.constructor()
			// if constructor creates a virtual dom element, use a blank object as
			// the base cached node instead of copying the virtual el (#277)
			if (cached.tag) cached = {}
			cached.nodes = []
			return cached
		}

		function constructNode(data, namespace) {
			if (data.attrs.is) {
				if (namespace == null) {
					return $document.createElement(data.tag, data.attrs.is)
				} else {
					return $document.createElementNS(namespace, data.tag,
						data.attrs.is)
				}
			} else if (namespace == null) {
				return $document.createElement(data.tag)
			} else {
				return $document.createElementNS(namespace, data.tag)
			}
		}

		function constructAttrs(data, node, namespace, hasKeys) {
			if (hasKeys) {
				return setAttributes(node, data.tag, data.attrs, {}, namespace)
			} else {
				return data.attrs
			}
		}

		function constructChildren(
			data,
			node,
			cached,
			editable,
			namespace,
			configs
		) {
			if (data.children != null && data.children.length > 0) {
				return build(
					node,
					data.tag,
					undefined,
					undefined,
					data.children,
					cached.children,
					true,
					0,
					data.attrs.contenteditable ? node : editable,
					namespace,
					configs)
			} else {
				return data.children
			}
		}

		function reconstructCached(
			data,
			attrs,
			children,
			node,
			namespace,
			views,
			controllers
		) {
			var cached = {
				tag: data.tag,
				attrs: attrs,
				children: children,
				nodes: [node]
			}

			unloadCachedControllers(cached, views, controllers)

			if (cached.children && !cached.children.nodes) {
				cached.children.nodes = []
			}

			// edge case: setting value on <select> doesn't work before children
			// exist, so set it again after children have been created
			if (data.tag === "select" && "value" in data.attrs) {
				setAttributes(node, data.tag, {value: data.attrs.value}, {},
					namespace)
			}

			return cached
		}

		function getController(views, view, cachedControllers, controller) {
			var controllerIndex

			if (m.redraw.strategy() === "diff" && views) {
				controllerIndex = views.indexOf(view)
			} else {
				controllerIndex = -1
			}

			if (controllerIndex > -1) {
				return cachedControllers[controllerIndex]
			} else if (isFunction(controller)) {
				return new controller()
			} else {
				return {}
			}
		}

		var unloaders = []

		function updateLists(views, controllers, view, controller) {
			if (controller.onunload != null &&
					unloaders.map(function (u) { return u.handler })
						.indexOf(controller.onunload) < 0) {
				unloaders.push({
					controller: controller,
					handler: controller.onunload
				})
			}

			views.push(view)
			controllers.push(controller)
		}

		var forcing = false
		function checkView(
			data,
			view,
			cached,
			cachedControllers,
			controllers,
			views
		) {
			var controller = getController(
				cached.views,
				view,
				cachedControllers,
				data.controller)

			var key = data && data.attrs && data.attrs.key

			if (pendingRequests === 0 ||
					forcing ||
					cachedControllers &&
						cachedControllers.indexOf(controller) > -1) {
				data = data.view(controller)
			} else {
				data = {tag: "placeholder"}
			}

			if (data.subtree === "retain") return data
			data.attrs = data.attrs || {}
			data.attrs.key = key
			updateLists(views, controllers, view, controller)
			return data
		}

		function markViews(data, cached, views, controllers) {
			var cachedControllers = cached && cached.controllers

			while (data.view != null) {
				data = checkView(
					data,
					data.view.$original || data.view,
					cached,
					cachedControllers,
					controllers,
					views)
			}

			return data
		}

		function buildObject( // eslint-disable-line max-statements
			data,
			cached,
			editable,
			parentElement,
			index,
			shouldReattach,
			namespace,
			configs
		) {
			var views = []
			var controllers = []

			data = markViews(data, cached, views, controllers)

			if (data.subtree === "retain") return cached

			if (!data.tag && controllers.length) {
				throw new Error("Component template must return a virtual " +
					"element, not an array, string, etc.")
			}

			data.attrs = data.attrs || {}
			cached.attrs = cached.attrs || {}

			var dataAttrKeys = Object.keys(data.attrs)
			var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0)

			maybeRecreateObject(data, cached, dataAttrKeys)

			if (!isString(data.tag)) return

			var isNew = cached.nodes.length === 0

			namespace = getObjectNamespace(data, namespace)

			var node
			if (isNew) {
				node = constructNode(data, namespace)
				// set attributes first, then create children
				var attrs = constructAttrs(data, node, namespace, hasKeys)

				// add the node to its parent before attaching children to it
				insertNode(parentElement, node, index)

				var children = constructChildren(data, node, cached, editable,
					namespace, configs)

				cached = reconstructCached(
					data,
					attrs,
					children,
					node,
					namespace,
					views,
					controllers)
			} else {
				node = buildUpdatedNode(
					cached,
					data,
					editable,
					hasKeys,
					namespace,
					views,
					configs,
					controllers)
			}

			if (!isNew && shouldReattach === true && node != null) {
				insertNode(parentElement, node, index)
			}

			// The configs are called after `build` finishes running
			scheduleConfigsToBeCalled(configs, data, node, isNew, cached)

			return cached
		}

		function build(
			parentElement,
			parentTag,
			parentCache,
			parentIndex,
			data,
			cached,
			shouldReattach,
			index,
			editable,
			namespace,
			configs
		) {
			/*
			 * `build` is a recursive function that manages creation/diffing/removal
			 * of DOM elements based on comparison between `data` and `cached` the
			 * diff algorithm can be summarized as this:
			 *
			 * 1 - compare `data` and `cached`
			 * 2 - if they are different, copy `data` to `cached` and update the DOM
			 *     based on what the difference is
			 * 3 - recursively apply this algorithm for every array and for the
			 *     children of every virtual element
			 *
			 * The `cached` data structure is essentially the same as the previous
			 * redraw's `data` data structure, with a few additions:
			 * - `cached` always has a property called `nodes`, which is a list of
			 *    DOM elements that correspond to the data represented by the
			 *    respective virtual element
			 * - in order to support attaching `nodes` as a property of `cached`,
			 *    `cached` is *always* a non-primitive object, i.e. if the data was
			 *    a string, then cached is a String instance. If data was `null` or
			 *    `undefined`, cached is `new String("")`
			 * - `cached also has a `configContext` property, which is the state
			 *    storage object exposed by config(element, isInitialized, context)
			 * - when `cached` is an Object, it represents a virtual element; when
			 *    it's an Array, it represents a list of elements; when it's a
			 *    String, Number or Boolean, it represents a text node
			 *
			 * `parentElement` is a DOM element used for W3C DOM API calls
			 * `parentTag` is only used for handling a corner case for textarea
			 * values
			 * `parentCache` is used to remove nodes in some multi-node cases
			 * `parentIndex` and `index` are used to figure out the offset of nodes.
			 * They're artifacts from before arrays started being flattened and are
			 * likely refactorable
			 * `data` and `cached` are, respectively, the new and old nodes being
			 * diffed
			 * `shouldReattach` is a flag indicating whether a parent node was
			 * recreated (if so, and if this node is reused, then this node must
			 * reattach itself to the new parent)
			 * `editable` is a flag that indicates whether an ancestor is
			 * contenteditable
			 * `namespace` indicates the closest HTML namespace as it cascades down
			 * from an ancestor
			 * `configs` is a list of config functions to run after the topmost
			 * `build` call finishes running
			 *
			 * there's logic that relies on the assumption that null and undefined
			 * data are equivalent to empty strings
			 * - this prevents lifecycle surprises from procedural helpers that mix
			 *   implicit and explicit return statements (e.g.
			 *   function foo() {if (cond) return m("div")}
			 * - it simplifies diffing code
			 */
			data = dataToString(data)
			if (data.subtree === "retain") return cached
			cached = makeCache(data, cached, index, parentIndex, parentCache)

			if (isArray(data)) {
				return buildArray(
					data,
					cached,
					parentElement,
					index,
					parentTag,
					shouldReattach,
					editable,
					namespace,
					configs)
			} else if (data != null && isObject(data)) {
				return buildObject(
					data,
					cached,
					editable,
					parentElement,
					index,
					shouldReattach,
					namespace,
					configs)
			} else if (!isFunction(data)) {
				return handleTextNode(
					cached,
					data,
					index,
					parentElement,
					shouldReattach,
					editable,
					parentTag)
			} else {
				return cached
			}
		}

		function sortChanges(a, b) {
			return a.action - b.action || a.index - b.index
		}

		function copyStyleAttrs(node, dataAttr, cachedAttr) {
			for (var rule in dataAttr) {
				if (hasOwn.call(dataAttr, rule)) {
					if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) {
						node.style[rule] = dataAttr[rule]
					}
				}
			}

			for (rule in cachedAttr) {
				if (hasOwn.call(cachedAttr, rule)) {
					if (!hasOwn.call(dataAttr, rule)) node.style[rule] = ""
				}
			}
		}

		var shouldUseSetAttribute = {
			list: 1,
			style: 1,
			form: 1,
			type: 1,
			width: 1,
			height: 1
		}

		function setSingleAttr(
			node,
			attrName,
			dataAttr,
			cachedAttr,
			tag,
			namespace
		) {
			if (attrName === "config" || attrName === "key") {
				// `config` isn't a real attribute, so ignore it
				return true
			} else if (isFunction(dataAttr) && attrName.slice(0, 2) === "on") {
				// hook event handlers to the auto-redrawing system
				node[attrName] = autoredraw(dataAttr, node)
			} else if (attrName === "style" && dataAttr != null &&
					isObject(dataAttr)) {
				// handle `style: {...}`
				copyStyleAttrs(node, dataAttr, cachedAttr)
			} else if (namespace != null) {
				// handle SVG
				if (attrName === "href") {
					node.setAttributeNS("http://www.w3.org/1999/xlink",
						"href", dataAttr)
				} else {
					node.setAttribute(
						attrName === "className" ? "class" : attrName,
						dataAttr)
				}
			} else if (attrName in node && !shouldUseSetAttribute[attrName]) {
				// handle cases that are properties (but ignore cases where we
				// should use setAttribute instead)
				//
				// - list and form are typically used as strings, but are DOM
				//   element references in js
				//
				// - when using CSS selectors (e.g. `m("[style='']")`), style is
				//   used as a string, but it's an object in js
				//
				// #348 don't set the value if not needed - otherwise, cursor
				// placement breaks in Chrome
				try {
					if (tag !== "input" || node[attrName] !== dataAttr) {
						node[attrName] = dataAttr
					}
				} catch (e) {
					node.setAttribute(attrName, dataAttr)
				}
			}
			else node.setAttribute(attrName, dataAttr)
		}

		function trySetAttr(
			node,
			attrName,
			dataAttr,
			cachedAttr,
			cachedAttrs,
			tag,
			namespace
		) {
			if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr) || ($document.activeElement === node)) {
				cachedAttrs[attrName] = dataAttr
				try {
					return setSingleAttr(
						node,
						attrName,
						dataAttr,
						cachedAttr,
						tag,
						namespace)
				} catch (e) {
					// swallow IE's invalid argument errors to mimic HTML's
					// fallback-to-doing-nothing-on-invalid-attributes behavior
					if (e.message.indexOf("Invalid argument") < 0) throw e
				}
			} else if (attrName === "value" && tag === "input" &&
					node.value !== dataAttr) {
				// #348 dataAttr may not be a string, so use loose comparison
				node.value = dataAttr
			}
		}

		function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
			for (var attrName in dataAttrs) {
				if (hasOwn.call(dataAttrs, attrName)) {
					if (trySetAttr(
							node,
							attrName,
							dataAttrs[attrName],
							cachedAttrs[attrName],
							cachedAttrs,
							tag,
							namespace)) {
						continue
					}
				}
			}
			return cachedAttrs
		}

		function clear(nodes, cached) {
			for (var i = nodes.length - 1; i > -1; i--) {
				if (nodes[i] && nodes[i].parentNode) {
					try {
						nodes[i].parentNode.removeChild(nodes[i])
					} catch (e) {
						/* eslint-disable max-len */
						// ignore if this fails due to order of events (see
						// http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
						/* eslint-enable max-len */
					}
					cached = [].concat(cached)
					if (cached[i]) unload(cached[i])
				}
			}
			// release memory if nodes is an array. This check should fail if nodes
			// is a NodeList (see loop above)
			if (nodes.length) {
				nodes.length = 0
			}
		}

		function unload(cached) {
			if (cached.configContext && isFunction(cached.configContext.onunload)) {
				cached.configContext.onunload()
				cached.configContext.onunload = null
			}
			if (cached.controllers) {
				forEach(cached.controllers, function (controller) {
					if (isFunction(controller.onunload)) {
						controller.onunload({preventDefault: noop})
					}
				})
			}
			if (cached.children) {
				if (isArray(cached.children)) forEach(cached.children, unload)
				else if (cached.children.tag) unload(cached.children)
			}
		}

		function appendTextFragment(parentElement, data) {
			try {
				parentElement.appendChild(
					$document.createRange().createContextualFragment(data))
			} catch (e) {
				parentElement.insertAdjacentHTML("beforeend", data)
				replaceScriptNodes(parentElement)
			}
		}

		// Replace script tags inside given DOM element with executable ones.
		// Will also check children recursively and replace any found script
		// tags in same manner.
		function replaceScriptNodes(node) {
			if (node.tagName === "SCRIPT") {
				node.parentNode.replaceChild(buildExecutableNode(node), node)
			} else {
				var children = node.childNodes
				if (children && children.length) {
					for (var i = 0; i < children.length; i++) {
						replaceScriptNodes(children[i])
					}
				}
			}

			return node
		}

		// Replace script element with one whose contents are executable.
		function buildExecutableNode(node){
			var scriptEl = document.createElement("script")
			var attrs = node.attributes

			for (var i = 0; i < attrs.length; i++) {
				scriptEl.setAttribute(attrs[i].name, attrs[i].value)
			}

			scriptEl.text = node.innerHTML
			return scriptEl
		}

		function injectHTML(parentElement, index, data) {
			var nextSibling = parentElement.childNodes[index]
			if (nextSibling) {
				var isElement = nextSibling.nodeType !== 1
				var placeholder = $document.createElement("span")
				if (isElement) {
					parentElement.insertBefore(placeholder, nextSibling || null)
					placeholder.insertAdjacentHTML("beforebegin", data)
					parentElement.removeChild(placeholder)
				} else {
					nextSibling.insertAdjacentHTML("beforebegin", data)
				}
			} else {
				appendTextFragment(parentElement, data)
			}

			var nodes = []

			while (parentElement.childNodes[index] !== nextSibling) {
				nodes.push(parentElement.childNodes[index])
				index++
			}

			return nodes
		}

		function autoredraw(callback, object) {
			return function (e) {
				e = e || event
				m.redraw.strategy("diff")
				m.startComputation()
				try {
					return callback.call(object, e)
				} finally {
					endFirstComputation()
				}
			}
		}

		var html
		var documentNode = {
			appendChild: function (node) {
				if (html === undefined) html = $document.createElement("html")
				if ($document.documentElement &&
						$document.documentElement !== node) {
					$document.replaceChild(node, $document.documentElement)
				} else {
					$document.appendChild(node)
				}

				this.childNodes = $document.childNodes
			},

			insertBefore: function (node) {
				this.appendChild(node)
			},

			childNodes: []
		}

		var nodeCache = []
		var cellCache = {}

		m.render = function (root, cell, forceRecreation) {
			if (!root) {
				throw new Error("Ensure the DOM element being passed to " +
					"m.route/m.mount/m.render is not undefined.")
			}
			var configs = []
			var id = getCellCacheKey(root)
			var isDocumentRoot = root === $document
			var node

			if (isDocumentRoot || root === $document.documentElement) {
				node = documentNode
			} else {
				node = root
			}

			if (isDocumentRoot && cell.tag !== "html") {
				cell = {tag: "html", attrs: {}, children: cell}
			}

			if (cellCache[id] === undefined) clear(node.childNodes)
			if (forceRecreation === true) reset(root)

			cellCache[id] = build(
				node,
				null,
				undefined,
				undefined,
				cell,
				cellCache[id],
				false,
				0,
				null,
				undefined,
				configs)

			forEach(configs, function (config) { config() })
		}

		function getCellCacheKey(element) {
			var index = nodeCache.indexOf(element)
			return index < 0 ? nodeCache.push(element) - 1 : index
		}

		m.trust = function (value) {
			value = new String(value) // eslint-disable-line no-new-wrappers
			value.$trusted = true
			return value
		}

		function gettersetter(store) {
			function prop() {
				if (arguments.length) store = arguments[0]
				return store
			}

			prop.toJSON = function () {
				return store
			}

			return prop
		}

		m.prop = function (store) {
			if ((store != null && (isObject(store) || isFunction(store)) || ((typeof Promise !== "undefined") && (store instanceof Promise))) &&
					isFunction(store.then)) {
				return propify(store)
			}

			return gettersetter(store)
		}

		var roots = []
		var components = []
		var controllers = []
		var lastRedrawId = null
		var lastRedrawCallTime = 0
		var computePreRedrawHook = null
		var computePostRedrawHook = null
		var topComponent
		var FRAME_BUDGET = 16 // 60 frames per second = 1 call per 16 ms

		function parameterize(component, args) {
			function controller() {
				/* eslint-disable no-invalid-this */
				return (component.controller || noop).apply(this, args) || this
				/* eslint-enable no-invalid-this */
			}

			if (component.controller) {
				controller.prototype = component.controller.prototype
			}

			function view(ctrl) {
				var currentArgs = [ctrl].concat(args)
				for (var i = 1; i < arguments.length; i++) {
					currentArgs.push(arguments[i])
				}

				return component.view.apply(component, currentArgs)
			}

			view.$original = component.view
			var output = {controller: controller, view: view}
			if (args[0] && args[0].key != null) output.attrs = {key: args[0].key}
			return output
		}

		m.component = function (component) {
			var args = new Array(arguments.length - 1)

			for (var i = 1; i < arguments.length; i++) {
				args[i - 1] = arguments[i]
			}

			return parameterize(component, args)
		}

		function checkPrevented(component, root, index, isPrevented) {
			if (!isPrevented) {
				m.redraw.strategy("all")
				m.startComputation()
				roots[index] = root
				var currentComponent

				if (component) {
					currentComponent = topComponent = component
				} else {
					currentComponent = topComponent = component = {controller: noop}
				}

				var controller = new (component.controller || noop)()

				// controllers may call m.mount recursively (via m.route redirects,
				// for example)
				// this conditional ensures only the last recursive m.mount call is
				// applied
				if (currentComponent === topComponent) {
					controllers[index] = controller
					components[index] = component
				}
				endFirstComputation()
				if (component === null) {
					removeRootElement(root, index)
				}
				return controllers[index]
			} else if (component == null) {
				removeRootElement(root, index)
			}
		}

		m.mount = m.module = function (root, component) {
			if (!root) {
				throw new Error("Please ensure the DOM element exists before " +
					"rendering a template into it.")
			}

			var index = roots.indexOf(root)
			if (index < 0) index = roots.length

			var isPrevented = false
			var event = {
				preventDefault: function () {
					isPrevented = true
					computePreRedrawHook = computePostRedrawHook = null
				}
			}

			forEach(unloaders, function (unloader) {
				unloader.handler.call(unloader.controller, event)
				unloader.controller.onunload = null
			})

			if (isPrevented) {
				forEach(unloaders, function (unloader) {
					unloader.controller.onunload = unloader.handler
				})
			} else {
				unloaders = []
			}

			if (controllers[index] && isFunction(controllers[index].onunload)) {
				controllers[index].onunload(event)
			}

			return checkPrevented(component, root, index, isPrevented)
		}

		function removeRootElement(root, index) {
			roots.splice(index, 1)
			controllers.splice(index, 1)
			components.splice(index, 1)
			reset(root)
			nodeCache.splice(getCellCacheKey(root), 1)
		}

		var redrawing = false
		m.redraw = function (force) {
			if (redrawing) return
			redrawing = true
			if (force) forcing = true

			try {
				// lastRedrawId is a positive number if a second redraw is requested
				// before the next animation frame
				// lastRedrawId is null if it's the first redraw and not an event
				// handler
				if (lastRedrawId && !force) {
					// when setTimeout: only reschedule redraw if time between now
					// and previous redraw is bigger than a frame, otherwise keep
					// currently scheduled timeout
					// when rAF: always reschedule redraw
					if ($requestAnimationFrame === global.requestAnimationFrame ||
							new Date() - lastRedrawCallTime > FRAME_BUDGET) {
						if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId)
						lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET)
					}
				} else {
					redraw()
					lastRedrawId = $requestAnimationFrame(function () {
						lastRedrawId = null
					}, FRAME_BUDGET)
				}
			} finally {
				redrawing = forcing = false
			}
		}

		m.redraw.strategy = m.prop()
		function redraw() {
			if (computePreRedrawHook) {
				computePreRedrawHook()
				computePreRedrawHook = null
			}
			forEach(roots, function (root, i) {
				var component = components[i]
				if (controllers[i]) {
					var args = [controllers[i]]
					m.render(root,
						component.view ? component.view(controllers[i], args) : "")
				}
			})
			// after rendering within a routed context, we need to scroll back to
			// the top, and fetch the document title for history.pushState
			if (computePostRedrawHook) {
				computePostRedrawHook()
				computePostRedrawHook = null
			}
			lastRedrawId = null
			lastRedrawCallTime = new Date()
			m.redraw.strategy("diff")
		}

		function endFirstComputation() {
			if (m.redraw.strategy() === "none") {
				pendingRequests--
				m.redraw.strategy("diff")
			} else {
				m.endComputation()
			}
		}

		m.withAttr = function (prop, withAttrCallback, callbackThis) {
			return function (e) {
				e = e || window.event
				/* eslint-disable no-invalid-this */
				var currentTarget = e.currentTarget || this
				var _this = callbackThis || this
				/* eslint-enable no-invalid-this */
				var target = prop in currentTarget ?
					currentTarget[prop] :
					currentTarget.getAttribute(prop)
				withAttrCallback.call(_this, target)
			}
		}

		// routing
		var modes = {pathname: "", hash: "#", search: "?"}
		var redirect = noop
		var isDefaultRoute = false
		var routeParams, currentRoute

		m.route = function (root, arg1, arg2, vdom) { // eslint-disable-line
			// m.route()
			if (arguments.length === 0) return currentRoute
			// m.route(el, defaultRoute, routes)
			if (arguments.length === 3 && isString(arg1)) {
				redirect = function (source) {
					var path = currentRoute = normalizeRoute(source)
					if (!routeByValue(root, arg2, path)) {
						if (isDefaultRoute) {
							throw new Error("Ensure the default route matches " +
								"one of the routes defined in m.route")
						}

						isDefaultRoute = true
						m.route(arg1, true)
						isDefaultRoute = false
					}
				}

				var listener = m.route.mode === "hash" ?
					"onhashchange" :
					"onpopstate"

				global[listener] = function () {
					var path = $location[m.route.mode]
					if (m.route.mode === "pathname") path += $location.search
					if (currentRoute !== normalizeRoute(path)) redirect(path)
				}

				computePreRedrawHook = setScroll
				global[listener]()

				return
			}

			// config: m.route
			if (root.addEventListener || root.attachEvent) {
				var base = m.route.mode !== "pathname" ? $location.pathname : ""
				root.href = base + modes[m.route.mode] + vdom.attrs.href
				if (root.addEventListener) {
					root.removeEventListener("click", routeUnobtrusive)
					root.addEventListener("click", routeUnobtrusive)
				} else {
					root.detachEvent("onclick", routeUnobtrusive)
					root.attachEvent("onclick", routeUnobtrusive)
				}

				return
			}
			// m.route(route, params, shouldReplaceHistoryEntry)
			if (isString(root)) {
				var oldRoute = currentRoute
				currentRoute = root

				var args = arg1 || {}
				var queryIndex = currentRoute.indexOf("?")
				var params

				if (queryIndex > -1) {
					params = parseQueryString(currentRoute.slice(queryIndex + 1))
				} else {
					params = {}
				}

				for (var i in args) {
					if (hasOwn.call(args, i)) {
						params[i] = args[i]
					}
				}

				var querystring = buildQueryString(params)
				var currentPath

				if (queryIndex > -1) {
					currentPath = currentRoute.slice(0, queryIndex)
				} else {
					currentPath = currentRoute
				}

				if (querystring) {
					currentRoute = currentPath +
						(currentPath.indexOf("?") === -1 ? "?" : "&") +
						querystring
				}

				var replaceHistory =
					(arguments.length === 3 ? arg2 : arg1) === true ||
					oldRoute === root

				if (global.history.pushState) {
					var method = replaceHistory ? "replaceState" : "pushState"
					computePreRedrawHook = setScroll
					computePostRedrawHook = function () {
						try {
							global.history[method](null, $document.title,
								modes[m.route.mode] + currentRoute)
						} catch (err) {
							// In the event of a pushState or replaceState failure,
							// fallback to a standard redirect. This is specifically
							// to address a Safari security error when attempting to
							// call pushState more than 100 times.
							$location[m.route.mode] = currentRoute
						}
					}
					redirect(modes[m.route.mode] + currentRoute)
				} else {
					$location[m.route.mode] = currentRoute
					redirect(modes[m.route.mode] + currentRoute)
				}
			}
		}

		m.route.param = function (key) {
			if (!routeParams) {
				throw new Error("You must call m.route(element, defaultRoute, " +
					"routes) before calling m.route.param()")
			}

			if (!key) {
				return routeParams
			}

			return routeParams[key]
		}

		m.route.mode = "search"

		function normalizeRoute(route) {
			return route.slice(modes[m.route.mode].length)
		}

		function routeByValue(root, router, path) {
			routeParams = {}

			var queryStart = path.indexOf("?")
			if (queryStart !== -1) {
				routeParams = parseQueryString(
					path.substr(queryStart + 1, path.length))
				path = path.substr(0, queryStart)
			}

			// Get all routes and check if there's
			// an exact match for the current path
			var keys = Object.keys(router)
			var index = keys.indexOf(path)

			if (index !== -1){
				m.mount(root, router[keys [index]])
				return true
			}

			for (var route in router) {
				if (hasOwn.call(router, route)) {
					if (route === path) {
						m.mount(root, router[route])
						return true
					}

					var matcher = new RegExp("^" + route
						.replace(/:[^\/]+?\.{3}/g, "(.*?)")
						.replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$")

					if (matcher.test(path)) {
						/* eslint-disable no-loop-func */
						path.replace(matcher, function () {
							var keys = route.match(/:[^\/]+/g) || []
							var values = [].slice.call(arguments, 1, -2)
							forEach(keys, function (key, i) {
								routeParams[key.replace(/:|\./g, "")] =
									decodeURIComponent(values[i])
							})
							m.mount(root, router[route])
						})
						/* eslint-enable no-loop-func */
						return true
					}
				}
			}
		}

		function routeUnobtrusive(e) {
			e = e || event
			if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return

			if (e.preventDefault) {
				e.preventDefault()
			} else {
				e.returnValue = false
			}

			var currentTarget = e.currentTarget || e.srcElement
			var args

			if (m.route.mode === "pathname" && currentTarget.search) {
				args = parseQueryString(currentTarget.search.slice(1))
			} else {
				args = {}
			}

			while (currentTarget && !/a/i.test(currentTarget.nodeName)) {
				currentTarget = currentTarget.parentNode
			}

			// clear pendingRequests because we want an immediate route change
			pendingRequests = 0
			m.route(currentTarget[m.route.mode]
				.slice(modes[m.route.mode].length), args)
		}

		function setScroll() {
			if (m.route.mode !== "hash" && $location.hash) {
				$location.hash = $location.hash
			} else {
				global.scrollTo(0, 0)
			}
		}

		function buildQueryString(object, prefix) {
			var duplicates = {}
			var str = []

			for (var prop in object) {
				if (hasOwn.call(object, prop)) {
					var key = prefix ? prefix + "[" + prop + "]" : prop
					var value = object[prop]

					if (value === null) {
						str.push(encodeURIComponent(key))
					} else if (isObject(value)) {
						str.push(buildQueryString(value, key))
					} else if (isArray(value)) {
						var keys = []
						duplicates[key] = duplicates[key] || {}
						/* eslint-disable no-loop-func */
						forEach(value, function (item) {
							/* eslint-enable no-loop-func */
							if (!duplicates[key][item]) {
								duplicates[key][item] = true
								keys.push(encodeURIComponent(key) + "=" +
									encodeURIComponent(item))
							}
						})
						str.push(keys.join("&"))
					} else if (value !== undefined) {
						str.push(encodeURIComponent(key) + "=" +
							encodeURIComponent(value))
					}
				}
			}

			return str.join("&")
		}

		function parseQueryString(str) {
			if (str === "" || str == null) return {}
			if (str.charAt(0) === "?") str = str.slice(1)

			var pairs = str.split("&")
			var params = {}

			forEach(pairs, function (string) {
				var pair = string.split("=")
				var key = decodeURIComponent(pair[0])
				var value = pair.length === 2 ? decodeURIComponent(pair[1]) : null
				if (params[key] != null) {
					if (!isArray(params[key])) params[key] = [params[key]]
					params[key].push(value)
				}
				else params[key] = value
			})

			return params
		}

		m.route.buildQueryString = buildQueryString
		m.route.parseQueryString = parseQueryString

		function reset(root) {
			var cacheKey = getCellCacheKey(root)
			clear(root.childNodes, cellCache[cacheKey])
			cellCache[cacheKey] = undefined
		}

		m.deferred = function () {
			var deferred = new Deferred()
			deferred.promise = propify(deferred.promise)
			return deferred
		}

		function propify(promise, initialValue) {
			var prop = m.prop(initialValue)
			promise.then(prop)
			prop.then = function (resolve, reject) {
				return propify(promise.then(resolve, reject), initialValue)
			}

			prop.catch = prop.then.bind(null, null)
			return prop
		}
		// Promiz.mithril.js | Zolmeister | MIT
		// a modified version of Promiz.js, which does not conform to Promises/A+
		// for two reasons:
		//
		// 1) `then` callbacks are called synchronously (because setTimeout is too
		//    slow, and the setImmediate polyfill is too big
		//
		// 2) throwing subclasses of Error cause the error to be bubbled up instead
		//    of triggering rejection (because the spec does not account for the
		//    important use case of default browser error handling, i.e. message w/
		//    line number)

		var RESOLVING = 1
		var REJECTING = 2
		var RESOLVED = 3
		var REJECTED = 4

		function Deferred(onSuccess, onFailure) {
			var self = this
			var state = 0
			var promiseValue = 0
			var next = []

			self.promise = {}

			self.resolve = function (value) {
				if (!state) {
					promiseValue = value
					state = RESOLVING

					fire()
				}

				return self
			}

			self.reject = function (value) {
				if (!state) {
					promiseValue = value
					state = REJECTING

					fire()
				}

				return self
			}

			self.promise.then = function (onSuccess, onFailure) {
				var deferred = new Deferred(onSuccess, onFailure)

				if (state === RESOLVED) {
					deferred.resolve(promiseValue)
				} else if (state === REJECTED) {
					deferred.reject(promiseValue)
				} else {
					next.push(deferred)
				}

				return deferred.promise
			}

			function finish(type) {
				state = type || REJECTED
				next.map(function (deferred) {
					if (state === RESOLVED) {
						deferred.resolve(promiseValue)
					} else {
						deferred.reject(promiseValue)
					}
				})
			}

			function thennable(then, success, failure, notThennable) {
				if (((promiseValue != null && isObject(promiseValue)) ||
						isFunction(promiseValue)) && isFunction(then)) {
					try {
						// count protects against abuse calls from spec checker
						var count = 0
						then.call(promiseValue, function (value) {
							if (count++) return
							promiseValue = value
							success()
						}, function (value) {
							if (count++) return
							promiseValue = value
							failure()
						})
					} catch (e) {
						m.deferred.onerror(e)
						promiseValue = e
						failure()
					}
				} else {
					notThennable()
				}
			}

			function fire() {
				// check if it's a thenable
				var then
				try {
					then = promiseValue && promiseValue.then
				} catch (e) {
					m.deferred.onerror(e)
					promiseValue = e
					state = REJECTING
					return fire()
				}

				if (state === REJECTING) {
					m.deferred.onerror(promiseValue)
				}

				thennable(then, function () {
					state = RESOLVING
					fire()
				}, function () {
					state = REJECTING
					fire()
				}, function () {
					try {
						if (state === RESOLVING && isFunction(onSuccess)) {
							promiseValue = onSuccess(promiseValue)
						} else if (state === REJECTING && isFunction(onFailure)) {
							promiseValue = onFailure(promiseValue)
							state = RESOLVING
						}
					} catch (e) {
						m.deferred.onerror(e)
						promiseValue = e
						return finish()
					}

					if (promiseValue === self) {
						promiseValue = TypeError()
						finish()
					} else {
						thennable(then, function () {
							finish(RESOLVED)
						}, finish, function () {
							finish(state === RESOLVING && RESOLVED)
						})
					}
				})
			}
		}

		m.deferred.onerror = function (e) {
			if (type.call(e) === "[object Error]" &&
					!/ Error/.test(e.constructor.toString())) {
				pendingRequests = 0
				throw e
			}
		}

		m.sync = function (args) {
			var deferred = m.deferred()
			var outstanding = args.length
			var results = []
			var method = "resolve"

			function synchronizer(pos, resolved) {
				return function (value) {
					results[pos] = value
					if (!resolved) method = "reject"
					if (--outstanding === 0) {
						deferred.promise(results)
						deferred[method](results)
					}
					return value
				}
			}

			if (args.length > 0) {
				forEach(args, function (arg, i) {
					arg.then(synchronizer(i, true), synchronizer(i, false))
				})
			} else {
				deferred.resolve([])
			}

			return deferred.promise
		}

		function identity(value) { return value }

		function handleJsonp(options) {
			var callbackKey = options.callbackName || "mithril_callback_" +
				new Date().getTime() + "_" +
				(Math.round(Math.random() * 1e16)).toString(36)

			var script = $document.createElement("script")

			global[callbackKey] = function (resp) {
				script.parentNode.removeChild(script)
				options.onload({
					type: "load",
					target: {
						responseText: resp
					}
				})
				global[callbackKey] = undefined
			}

			script.onerror = function () {
				script.parentNode.removeChild(script)

				options.onerror({
					type: "error",
					target: {
						status: 500,
						responseText: JSON.stringify({
							error: "Error making jsonp request"
						})
					}
				})
				global[callbackKey] = undefined

				return false
			}

			script.onload = function () {
				return false
			}

			script.src = options.url +
				(options.url.indexOf("?") > 0 ? "&" : "?") +
				(options.callbackKey ? options.callbackKey : "callback") +
				"=" + callbackKey +
				"&" + buildQueryString(options.data || {})

			$document.body.appendChild(script)
		}

		function createXhr(options) {
			var xhr = new global.XMLHttpRequest()
			xhr.open(options.method, options.url, true, options.user,
				options.password)

			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					if (xhr.status >= 200 && xhr.status < 300) {
						options.onload({type: "load", target: xhr})
					} else {
						options.onerror({type: "error", target: xhr})
					}
				}
			}

			if (options.serialize === JSON.stringify &&
					options.data &&
					options.method !== "GET") {
				xhr.setRequestHeader("Content-Type",
					"application/json; charset=utf-8")
			}

			if (options.deserialize === JSON.parse) {
				xhr.setRequestHeader("Accept", "application/json, text/*")
			}

			if (isFunction(options.config)) {
				var maybeXhr = options.config(xhr, options)
				if (maybeXhr != null) xhr = maybeXhr
			}

			var data = options.method === "GET" || !options.data ? "" : options.data

			if (data && !isString(data) && data.constructor !== global.FormData) {
				throw new Error("Request data should be either be a string or " +
					"FormData. Check the `serialize` option in `m.request`")
			}

			xhr.send(data)
			return xhr
		}

		function ajax(options) {
			if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
				return handleJsonp(options)
			} else {
				return createXhr(options)
			}
		}

		function bindData(options, data, serialize) {
			if (options.method === "GET" && options.dataType !== "jsonp") {
				var prefix = options.url.indexOf("?") < 0 ? "?" : "&"
				var querystring = buildQueryString(data)
				options.url += (querystring ? prefix + querystring : "")
			} else {
				options.data = serialize(data)
			}
		}

		function parameterizeUrl(url, data) {
			if (data) {
				url = url.replace(/:[a-z]\w+/gi, function (token){
					var key = token.slice(1)
					var value = data[key] || token
					delete data[key]
					return value
				})
			}
			return url
		}

		m.request = function (options) {
			if (options.background !== true) m.startComputation()
			var deferred = new Deferred()
			var isJSONP = options.dataType &&
				options.dataType.toLowerCase() === "jsonp"

			var serialize, deserialize, extract

			if (isJSONP) {
				serialize = options.serialize =
				deserialize = options.deserialize = identity

				extract = function (jsonp) { return jsonp.responseText }
			} else {
				serialize = options.serialize = options.serialize || JSON.stringify

				deserialize = options.deserialize =
					options.deserialize || JSON.parse
				extract = options.extract || function (xhr) {
					if (xhr.responseText.length || deserialize !== JSON.parse) {
						return xhr.responseText
					} else {
						return null
					}
				}
			}

			options.method = (options.method || "GET").toUpperCase()
			options.url = parameterizeUrl(options.url, options.data)
			bindData(options, options.data, serialize)
			options.onload = options.onerror = function (ev) {
				try {
					ev = ev || event
					var response = deserialize(extract(ev.target, options))
					if (ev.type === "load") {
						if (options.unwrapSuccess) {
							response = options.unwrapSuccess(response, ev.target)
						}

						if (isArray(response) && options.type) {
							forEach(response, function (res, i) {
								response[i] = new options.type(res)
							})
						} else if (options.type) {
							response = new options.type(response)
						}

						deferred.resolve(response)
					} else {
						if (options.unwrapError) {
							response = options.unwrapError(response, ev.target)
						}

						deferred.reject(response)
					}
				} catch (e) {
					deferred.reject(e)
					m.deferred.onerror(e)
				} finally {
					if (options.background !== true) m.endComputation()
				}
			}

			ajax(options)
			deferred.promise = propify(deferred.promise, options.initialValue)
			return deferred.promise
		}

		return m
	}); // eslint-disable-line

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(5);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./main.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./main.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "*,\n*:before,\n*:after {\n  -webkit-user-select: none;\n  box-sizing: border-box;\n}\nhtml,\nbody,\n.height100 {\n  width: 1000px;\n  height: 600px;\n  max-height: 1000px;\n}\nbody.dark {\n  background-color: #37474f;\n}\n.height100 {\n  position: relative;\n}\n.dark input {\n  background-color: #ccc;\n  width: 100%;\n}\n.dark .title-frame {\n  position: relative;\n  width: 100%;\n  height: 23px;\n  background-color: #2E2E2E;\n  text-align: right;\n  color: white;\n}\n.dark .title-frame .title {\n  position: relative;\n  text-align: center;\n  -webkit-app-region: drag;\n  line-height: 23px;\n}\n.dark .title-frame .buttons {\n  position: relative;\n  top: -23px;\n  z-index: 2;\n  padding-right: 3px;\n}\n.dark .title-frame .buttons > button {\n  -webkit-app-region: no-drag;\n}\n.dark .title-frame .close-button {\n  position: relative;\n  box-shadow: inset 0px -3px 7px 0px #29bbff;\n  background-color: #2dabf9;\n  border-radius: 3px;\n  border: 1px solid #0b0e07;\n  display: inline-block;\n  cursor: pointer;\n  color: #ffffff;\n  font-family: Arial;\n  font-size: 10px;\n  padding: 1px 4px;\n  text-decoration: none;\n  text-shadow: 0px 1px 0px #263666;\n}\n.dark .title-frame .close-button:hover {\n  background-color: #0688fa;\n}\n.dark .title-frame .close-button:active {\n  position: relative;\n  top: 1px;\n}\n.dark .menu-frame {\n  position: relative;\n  height: 23px;\n  background-color: #232323;\n}\n.dark .menu-frame .buttons {\n  position: relative;\n  top: 2px;\n}\n.dark .menu-frame .buttons > a {\n  color: white;\n  padding: 12px;\n}\n.dark .menu-frame .target-info {\n  position: relative;\n  top: -20px;\n  z-index: 2;\n  padding-right: 3px;\n  line-height: 23px;\n  text-align: right;\n  color: #c13434;\n  font-weight: bold;\n}\n.dark .menu-lateral {\n  position: relative;\n  float: left;\n  height: 554px;\n  width: 134px;\n  background-color: #263238;\n  border-style: solid;\n  border-right: 2px solid #000000;\n  border-left: 0px;\n  border-top: 0px;\n  border-bottom: 0px;\n}\n.dark .menu-lateral ul {\n  position: relative;\n  top: 50%;\n  transform: translateY(-50%);\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.dark .menu-lateral ul li:first-child {\n  margin-top: 0;\n}\n.dark .menu-lateral ul li:last-child {\n  margin-bottom: 0;\n}\n.dark .menu-lateral li {\n  margin: 15px;\n  margin-left: 0px;\n  padding-left: 15px;\n  position: relative;\n  list-style-type: none;\n  font-weight: bold;\n  text-align: left;\n}\n.dark .menu-lateral li > a {\n  color: #fafafa;\n  text-decoration: none;\n  font-weight: bold;\n  font-variant: small-caps;\n  cursor: pointer;\n}\n.dark .menu-lateral li > a:hover {\n  color: #cacaca;\n  text-decoration: none;\n}\n.dark .menu-lateral li.menu-active {\n  width: 134px;\n  height: 40px;\n  background-color: white;\n  line-height: 40px;\n}\n.dark .menu-lateral li.menu-active > a {\n  color: black;\n}\n.dark .menu-lateral li.menu-active > a:hover {\n  color: black;\n}\n.dark .menu-lateral li.menu-active::after {\n  position: relative;\n  left: 105px;\n  top: -34px;\n  display: block;\n  width: 28.28px;\n  height: 28.28px;\n  background-color: white;\n  transform: rotate(45deg);\n  content: ' ';\n  z-index: -1;\n}\n.dark .body-frame {\n  position: relative;\n  float: left;\n  width: 866px;\n  height: 554px;\n  padding: 15px 30px 15px 30px;\n}\n.dark .body-frame h1 {\n  color: #cfd8dc;\n}\n.dark .explorer {\n  display: none;\n  position: relative;\n  float: left;\n  width: 150px;\n  height: 554px;\n  border-left: 2px solid black;\n  background: #263238;\n  text-align: center;\n  padding-top: 10px;\n}\n.dark .explorer span {\n  color: #c3c3c3;\n  font-size: 18px;\n  font-weight: bold;\n}\n.dark .explorer .treeview {\n  margin-top: 10px;\n}\n.dark .explorer .treeview ul,\n.dark .explorer .treeview li {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  text-align: left;\n  font-size: 14px;\n  font-weight: normal;\n}\n.dark .explorer .treeview li {\n  margin-bottom: 3px;\n  color: #c3c3c3;\n}\n.dark .explorer .treeview li.active {\n  background-color: #888;\n}\n.dark .explorer .treeview li img {\n  height: 13px;\n  margin-right: 5px;\n  vertical-align: baseline;\n}\n.dark .explorer .treeview li[data-type=\"file\"] {\n  cursor: pointer;\n}\n.dark .explorer .treeview > ul > li {\n  font-size: 18px;\n  font-weight: bold;\n}\n.dark .explorer .buttons {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  margin-bottom: 20px;\n}\n.dark .explorer .buttons button {\n  width: 80%;\n  border: 1px solid #333;\n  border-radius: 5px;\n}\n.dark .showing-explorer .body-frame {\n  width: 716px;\n}\n.dark .showing-explorer .explorer {\n  display: block;\n  float: left;\n}\n.dark .quick-edit-body .buttons {\n  margin: 0 auto;\n  text-align: right;\n  width: 100%;\n}\n.dark .quick-edit-body .buttons > button {\n  margin-top: 10px;\n  margin-left: 15px;\n}\n.dark .quick-edit-body #jseditor > textarea {\n  color: #ccc;\n  text-shadow: 0px 0px 0px #000;\n  -webkit-text-fill-color: transparent;\n  position: relative;\n  width: 100%;\n  height: 404px;\n  border: 1px solid #000;\n  background: #263238;\n}\n.dark .quick-edit-body input::-webkit-input-placeholder,\n.dark .quick-edit-body textarea::-webkit-input-placeholder {\n  color: #ccc;\n  text-shadow: none;\n  -webkit-text-fill-color: initial;\n}\n.dark .quick-edit-body textarea::selection {\n  background: #B9B9B9;\n  color: transparent;\n}\n.dark .quick-edit-body textarea::-webkit-selection {\n  background: #B9B9B9;\n  color: transparent;\n}\n.dark .quick-edit-body #jseditor > pre > code {\n  color: #c3c3c3;\n  text-shadow: 0 1px #263238;\n}\n.dark .quick-edit-body #jseditor > pre > code > .token.function {\n  color: #ff3e65;\n}\n.dark .quick-edit-body #jseditor > pre > code > .token.keyword {\n  color: #16b9ff;\n}\n.dark .quick-edit-body #jseditor > pre > code > .token.number {\n  color: #ff008e;\n}\n.dark .quick-edit-body #jseditor > pre > code > .token.operator {\n  background: rgba(0, 0, 0, 0.2);\n}\n.dark .modal {\n  top: 23px;\n}\n.dark .modal .modal-dialog {\n  top: -23px;\n}\n.dark .modal .modal-body {\n  color: black;\n  overflow: auto;\n  height: 390px;\n}\n.dark .target-body {\n  background-color: rgba(0, 0, 0, 0.6);\n}\n.dark .target-body .modal-content {\n  background-color: #263238;\n  color: white;\n}\n.dark .target-body .process-search {\n  color: #000;\n  padding: 0 5px 0 5px;\n  margin-bottom: 5px;\n}\n.dark .target-body .process-search::-webkit-input-placeholder {\n  color: #444;\n}\n.dark .target-body .process-list {\n  color: black;\n  font-size: 12px;\n  width: 100%;\n  height: 70%;\n}\n.dark .target-body .list-group {\n  padding-left: 0;\n  margin-bottom: 20px;\n  height: 400px;\n}\n.dark .target-body .modal-content {\n  width: 400px;\n  margin: auto;\n}\n.dark .target-body .list-group-item {\n  margin-botton: -5%;\n  margin: 0px;\n  cursor: pointer;\n}\n.dark .project-body div.inputfile {\n  font-weight: 700;\n  color: #333;\n  border-radius: 5px;\n  border: 1px solid black;\n  background-color: #c3c3c3;\n  display: inline-block;\n  width: 100%;\n  height: 25px;\n  line-height: 25px;\n  padding-left: 10px;\n}\n.dark .project-body div.inputfile:hover {\n  background-color: #b2b2b2;\n}\n.dark .project-body div.inputfile {\n  cursor: pointer;\n}\n.dark .project-body div.inputfile {\n  outline: 1px dotted #000;\n  outline: -webkit-focus-ring-color auto 5px;\n}\n.dark .project-body div.inputfile * {\n  pointer-events: none;\n}\n.dark .project-body div.button {\n  position: relative;\n  top: -25px;\n  height: 25px;\n  line-height: 25px;\n  left: calc(100% - 150px);\n  width: 150px;\n  border: 1px solid #000;\n  border-top-right-radius: 5px;\n  border-bottom-right-radius: 5px;\n  background: #666;\n  text-align: center;\n  color: #e3e3e3;\n  cursor: pointer;\n}\n.dark .project-body ul,\n.dark .project-body li {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.dark .project-body li {\n  font-size: 16px;\n  border: 1px solid #333;\n  border-radius: 2px;\n  height: 35px;\n  line-height: 35px;\n  padding-left: 10px;\n  background: #546e7a;\n  color: #e3e3e3;\n  cursor: pointer;\n}\n.dark .project-body li:hover {\n  background: #455a64;\n}\n.dark .project-body li.active {\n  background: #263238;\n  color: #FFF;\n}\n", ""]);

	// exports


/***/ },
/* 6 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(9);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./light.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./light.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "*,\n*:before,\n*:after {\n  -webkit-user-select: none;\n  box-sizing: border-box;\n}\nhtml,\nbody,\n.height100 {\n  width: 1000px;\n  height: 600px;\n  max-height: 1000px;\n}\nbody.light {\n  background-color: #FFFFFF;\n}\n.height100 {\n  position: relative;\n}\n.light input {\n  background-color: #ccc;\n  width: 100%;\n}\n.light .title-frame {\n  position: relative;\n  width: 100%;\n  height: 23px;\n  background-color: #127FA3;\n  text-align: right;\n  color: white;\n}\n.light .title-frame .title {\n  position: relative;\n  text-align: center;\n  -webkit-app-region: drag;\n  line-height: 23px;\n}\n.light .title-frame .buttons {\n  position: relative;\n  top: -23px;\n  z-index: 2;\n  padding-right: 3px;\n}\n.light .title-frame .buttons > button {\n  -webkit-app-region: no-drag;\n}\n.light .title-frame .close-button {\n  position: relative;\n  box-shadow: inset 0px -3px 7px 0px #29bbff;\n  background-color: #2dabf9;\n  border-radius: 3px;\n  border: 1px solid #0b0e07;\n  display: inline-block;\n  cursor: pointer;\n  color: #ffffff;\n  font-family: Arial;\n  font-size: 10px;\n  padding: 1px 4px;\n  text-decoration: none;\n  text-shadow: 0px 1px 0px #263666;\n}\n.light .title-frame .close-button:hover {\n  background-color: #0688fa;\n}\n.light .title-frame .close-button:active {\n  position: relative;\n  top: 1px;\n}\n.light .menu-frame {\n  position: relative;\n  height: 23px;\n  background-color: #1BA4D1;\n}\n.light .menu-frame .buttons {\n  position: relative;\n  top: 2px;\n}\n.light .menu-frame .buttons > a {\n  color: white;\n  padding: 12px;\n}\n.light .menu-frame .target-info {\n  position: relative;\n  top: -20px;\n  z-index: 2;\n  padding-right: 3px;\n  line-height: 23px;\n  text-align: right;\n  color: #c13434;\n  font-weight: bold;\n}\n.light .menu-lateral {\n  position: relative;\n  float: left;\n  height: 554px;\n  width: 134px;\n  background-color: #EBFAFF;\n  border-style: solid;\n  border-right: 2px solid #000000;\n  border-left: 0px;\n  border-top: 0px;\n  border-bottom: 0px;\n}\n.light .menu-lateral ul {\n  position: relative;\n  top: 50%;\n  transform: translateY(-50%);\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.light .menu-lateral ul li:first-child {\n  margin-top: 0;\n}\n.light .menu-lateral ul li:last-child {\n  margin-bottom: 0;\n}\n.light .menu-lateral li {\n  margin: 15px;\n  margin-left: 0px;\n  padding-left: 15px;\n  position: relative;\n  list-style-type: none;\n  font-weight: bold;\n  text-align: left;\n}\n.light .menu-lateral li > a {\n  color: #545454;\n  text-decoration: none;\n  font-weight: bold;\n  font-variant: small-caps;\n  cursor: pointer;\n}\n.light .menu-lateral li > a:hover {\n  color: #cacaca;\n  text-decoration: none;\n}\n.light .menu-lateral li.menu-active {\n  width: 134px;\n  height: 40px;\n  background-color: #9EE7FF;\n  line-height: 40px;\n}\n.light .menu-lateral li.menu-active > a {\n  color: black;\n}\n.light .menu-lateral li.menu-active > a:hover {\n  color: black;\n}\n.light .menu-lateral li.menu-active::after {\n  position: relative;\n  left: 105px;\n  top: -34px;\n  display: block;\n  width: 28.28px;\n  height: 28.28px;\n  background-color: #9EE7FF;\n  transform: rotate(45deg);\n  content: ' ';\n  z-index: -1;\n}\n.light .body-frame {\n  position: relative;\n  float: left;\n  width: 866px;\n  height: 554px;\n  padding: 15px 30px 15px 30px;\n}\n.light .body-frame h1 {\n  color: #000000;\n}\n.light .explorer {\n  display: none;\n  position: relative;\n  float: left;\n  width: 150px;\n  height: 554px;\n  border-left: 2px solid black;\n  background: #EBFAFF;\n  text-align: center;\n  padding-top: 10px;\n}\n.light .explorer span {\n  color: #111;\n  font-size: 18px;\n  font-weight: bold;\n}\n.light .explorer .treeview {\n  margin-top: 10px;\n}\n.light .explorer .treeview ul,\n.light .explorer .treeview li {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  text-align: left;\n  font-size: 14px;\n  font-weight: normal;\n}\n.light .explorer .treeview li {\n  margin-bottom: 3px;\n  color: #333;\n}\n.light .explorer .treeview li.active {\n  background-color: #888;\n}\n.light .explorer .treeview li img {\n  height: 13px;\n  margin-right: 5px;\n  vertical-align: baseline;\n}\n.light .explorer .treeview li[data-type=\"file\"] {\n  cursor: pointer;\n}\n.light .explorer .treeview > ul > li {\n  font-size: 18px;\n  font-weight: bold;\n}\n.light .explorer .buttons {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  margin-bottom: 20px;\n}\n.light .explorer .buttons button {\n  width: 80%;\n  border: 1px solid #333;\n  border-radius: 5px;\n}\n.light .showing-explorer .body-frame {\n  width: 716px;\n}\n.light .showing-explorer .explorer {\n  display: block;\n  float: left;\n}\n.light .quick-edit-body .buttons {\n  margin: 0 auto;\n  text-align: right;\n  width: 100%;\n}\n.light .quick-edit-body .buttons > button {\n  margin-top: 10px;\n  margin-left: 15px;\n}\n.light .quick-edit-body #jseditor > textarea {\n  color: #ccc;\n  text-shadow: 0px 0px 0px #000;\n  -webkit-text-fill-color: transparent;\n  position: relative;\n  width: 100%;\n  height: 404px;\n  border: 1px solid #000;\n  background: #EBFAFF;\n}\n.light .quick-edit-body input::-webkit-input-placeholder,\n.light .quick-edit-body textarea::-webkit-input-placeholder {\n  color: #ccc;\n  text-shadow: none;\n  -webkit-text-fill-color: initial;\n}\n.light .quick-edit-body textarea::selection {\n  background: #B9B9B9;\n  color: transparent;\n}\n.light .quick-edit-body textarea::-webkit-selection {\n  background: #B9B9B9;\n  color: transparent;\n}\n.light .quick-edit-body #jseditor > pre > code {\n  text-shadow: 0 1px #263238;\n}\n.light .modal {\n  top: 23px;\n}\n.light .modal .modal-dialog {\n  top: -23px;\n}\n.light .modal .modal-body {\n  color: black;\n  overflow: auto;\n  height: 390px;\n}\n.light .target-body {\n  background-color: rgba(0, 0, 0, 0.6);\n}\n.light .target-body .modal-content {\n  background-color: #EBFAFF;\n  color: black;\n}\n.light .target-body .process-search {\n  color: #000;\n  padding: 0 5px 0 5px;\n  margin-bottom: 5px;\n}\n.light .target-body .process-search::-webkit-input-placeholder {\n  color: #444;\n}\n.light .target-body .process-list {\n  color: black;\n  font-size: 12px;\n  width: 100%;\n  height: 70%;\n}\n.light .target-body .list-group {\n  padding-left: 0;\n  margin-bottom: 20px;\n  height: 400px;\n}\n.light .target-body .modal-content {\n  width: 400px;\n  margin: auto;\n}\n.light .target-body .list-group-item {\n  margin-botton: -5%;\n  margin: 0px;\n  cursor: pointer;\n}\n.light .project-body div.inputfile {\n  font-weight: 700;\n  color: #333;\n  border-radius: 5px;\n  border: 1px solid black;\n  background-color: #c3c3c3;\n  display: inline-block;\n  width: 100%;\n  height: 25px;\n  line-height: 25px;\n  padding-left: 10px;\n}\n.light .project-body div.inputfile:hover {\n  background-color: #b2b2b2;\n}\n.light .project-body div.inputfile {\n  cursor: pointer;\n}\n.light .project-body div.inputfile {\n  outline: 1px dotted #000;\n  outline: -webkit-focus-ring-color auto 5px;\n}\n.light .project-body div.inputfile * {\n  pointer-events: none;\n}\n.light .project-body div.button {\n  position: relative;\n  top: -25px;\n  height: 25px;\n  line-height: 25px;\n  left: calc(100% - 150px);\n  width: 150px;\n  border: 1px solid #000;\n  border-top-right-radius: 5px;\n  border-bottom-right-radius: 5px;\n  background: #666;\n  text-align: center;\n  color: #e3e3e3;\n  cursor: pointer;\n}\n.light .project-body ul,\n.light .project-body li {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.light .project-body li {\n  font-size: 16px;\n  border: 1px solid #333;\n  border-radius: 2px;\n  height: 35px;\n  line-height: 35px;\n  padding-left: 10px;\n  background: #546e7a;\n  color: #e3e3e3;\n  cursor: pointer;\n}\n.light .project-body li:hover {\n  background: #455a64;\n}\n.light .project-body li.active {\n  background: #263238;\n  color: #FFF;\n}\n", ""]);

	// exports


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(11);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./codeflask.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./codeflask.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, ".CodeFlask {\n  position: relative;\n  overflow: hidden;\n}\n.CodeFlask__textarea,\n.CodeFlask__pre {\n  box-sizing: border-box;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  padding: 1rem !important;\n  border: none;\n  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n  font-size: 13px;\n  background: transparent;\n  white-space: pre-wrap;\n  line-height: 1.5em;\n  word-wrap: break-word;\n}\n.CodeFlask__textarea {\n  border: none;\n  background: transparent;\n  outline: none;\n  resize: none;\n  opacity: 0.4;\n  color: #000;\n  margin: 0;\n  z-index: 1;\n  height: 100%;\n  -webkit-overflow-scrolling: touch;\n}\n.CodeFlask__pre {\n  z-index: 2;\n  pointer-events: none;\n  overflow-y: auto;\n  margin: 0;\n  min-height: 100%;\n  margin: 0 !important;\n  background: transparent !important;\n}\n.CodeFlask__code {\n  font-size: inherit;\n  font-family: inherit;\n  color: inherit;\n  display: block;\n}\n", ""]);

	// exports


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(13);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./prism.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./prism.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "/* http://prismjs.com/download.html?themes=prism&languages=clike+javascript */\n/**\n * prism.js default theme for JavaScript, CSS and HTML\n * Based on dabblet (http://dabblet.com)\n * @author Lea Verou\n */\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: black;\n  background: none;\n  text-shadow: 0 1px white;\n  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n  text-align: left;\n  white-space: pre;\n  word-spacing: normal;\n  word-break: normal;\n  word-wrap: normal;\n  line-height: 1.5;\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n  tab-size: 4;\n  -webkit-hyphens: none;\n  -moz-hyphens: none;\n  -ms-hyphens: none;\n  hyphens: none;\n}\npre[class*=\"language-\"]::-moz-selection,\npre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection,\ncode[class*=\"language-\"] ::-moz-selection {\n  text-shadow: none;\n  background: #b3d4fc;\n}\npre[class*=\"language-\"]::selection,\npre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection,\ncode[class*=\"language-\"] ::selection {\n  text-shadow: none;\n  background: #b3d4fc;\n}\n@media print {\n  code[class*=\"language-\"],\n  pre[class*=\"language-\"] {\n    text-shadow: none;\n  }\n}\n/* Code blocks */\npre[class*=\"language-\"] {\n  padding: 1em;\n  margin: .5em 0;\n  overflow: auto;\n}\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n  background: #f5f2f0;\n}\n/* Inline code */\n:not(pre) > code[class*=\"language-\"] {\n  padding: .1em;\n  border-radius: .3em;\n  white-space: normal;\n}\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n  color: slategray;\n}\n.token.punctuation {\n  color: #999;\n}\n.namespace {\n  opacity: .7;\n}\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n  color: #905;\n}\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n  color: #690;\n}\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n  color: #a67f59;\n  background: rgba(255, 255, 255, 0.5);\n}\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n  color: #07a;\n}\n.token.function {\n  color: #DD4A68;\n}\n.token.regex,\n.token.important,\n.token.variable {\n  color: #e90;\n}\n.token.important,\n.token.bold {\n  font-weight: bold;\n}\n.token.italic {\n  font-style: italic;\n}\n.token.entity {\n  cursor: help;\n}\n", ""]);

	// exports


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _require = __webpack_require__(15);

	var remote = _require.remote;
	exports.default = {
	    closeApp: function closeApp() {
	        remote.getCurrentWindow().close();
	    },

	    view: function view(ctrl, attrs) {

	        return (0, _mithril2.default)("div", (0, _mithril2.default)('div.title-frame', (0, _mithril2.default)('div.title', (0, _mithril2.default)('span', 'APE')), (0, _mithril2.default)('div.buttons', (0, _mithril2.default)('button.close-button', { onclick: this.closeApp.bind(this) }, 'X'))), (0, _mithril2.default)('div.menu-frame', (0, _mithril2.default)('div.buttons', (0, _mithril2.default)('a', 'File'), (0, _mithril2.default)('a', 'Edit'), (0, _mithril2.default)('a', 'About')), attrs.target ? (0, _mithril2.default)('div.target-info', 'Target: ' + attrs.target.name + (attrs.target.lost ? ' <lost>' : '')) : null));
	    }
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require('electron');

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	    controller: function controller(attrs) {
	        return {
	            default: attrs.default,
	            showing: attrs.showing,
	            changeFrame: attrs.changeFrame,
	            overlayFrame: attrs.overlayFrame,
	            closeOverlayFrame: attrs.closeOverlayFrame
	        };
	    },

	    view: function view(ctrl, attrs) {
	        ctrl.showing = attrs.showing;
	        if (ctrl.showing.every(function (x) {
	            return x == false;
	        })) {
	            ctrl.overlayFrame({ target: { dataset: { target: ctrl.default } } });
	        }

	        return (0, _mithril2.default)('div', { class: 'menu-lateral' }, //col-sm-3 col-md-2 sidebar
	        (0, _mithril2.default)("ul", //nav nav-sidebar
	        (0, _mithril2.default)('li', { className: ctrl.showing[0] ? 'menu-active' : '' }, (0, _mithril2.default)('a#menuLeft', {
	            onclick: ctrl.overlayFrame,
	            'data-target': 0
	        }, 'Target')), (0, _mithril2.default)('li', { className: ctrl.showing[1] ? 'menu-active' : '' }, (0, _mithril2.default)('a#menuLeft', {
	            onclick: ctrl.changeFrame,
	            'data-target': 1
	        }, 'Project')), (0, _mithril2.default)('li', { className: ctrl.showing[2] ? 'menu-active' : '' }, (0, _mithril2.default)('a#menuLeft', {
	            onclick: ctrl.changeFrame,
	            'data-target': 2
	        }, 'Console')), (0, _mithril2.default)('li', { className: ctrl.showing[3] ? 'menu-active' : '' }, (0, _mithril2.default)('a#menuLeft', {
	            onclick: ctrl.changeFrame,
	            'data-target': 3
	        }, 'Quick Edit')), (0, _mithril2.default)('li', { className: ctrl.showing[4] ? 'menu-active' : '' }, (0, _mithril2.default)('a#menuLeft', {
	            onclick: ctrl.changeFrame,
	            'data-target': 4
	        }, 'Something'))));
	    }
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _require = __webpack_require__(15);

	var ipcRenderer = _require.ipcRenderer;

	var _require2 = __webpack_require__(18);

	var TreeView = _require2.component;
	var TreeElement = _require2.TreeElement;

	var path = __webpack_require__(19);

	var config = ipcRenderer.sendSync('get-config');
	var files = [];

	ipcRenderer.on('reload-config', function (event, newConfig) {
	    config = newConfig;
	    _mithril2.default.redraw();
	});

	ipcRenderer.on('reload-project-files', function (event, newFiles) {
	    console.log(newFiles);

	    var recurse = function recurse(what, acc, root) {
	        if (!Array.isArray(what) && (typeof what === 'undefined' ? 'undefined' : _typeof(what)) == "object") {
	            var key = Object.keys(what)[0];
	            var children = recurse(what[key], [], path.join(root, key));
	            acc.push(new TreeElement(key, path.join(root, key), children));
	        } else if (Array.isArray(what)) {
	            for (var i = 0; i < what.length; ++i) {
	                acc.push(recurse(what[i], [], root)[0]);
	            }
	        } else {
	            acc.push(new TreeElement(what, root));
	        }

	        return acc;
	    };

	    files = recurse(newFiles.files, [], newFiles.root);
	    _mithril2.default.redraw();
	});

	ipcRenderer.send('request-project-files');

	exports.default = {
	    controller: function controller(attrs) {
	        return {
	            changeFrame: attrs.changeFrame
	        };
	    },

	    fileClicked: function fileClicked(ctrl, e) {
	        // Broadcast edition
	        ipcRenderer.send('quick-edit-file', path.join(e.target.dataset.root, e.target.dataset.name));

	        // Set active
	        ctrl.lastActive && (ctrl.lastActive.className = '');
	        e.target.className = 'active';
	        ctrl.lastActive = e.target;

	        // Goto quick-edit
	        ctrl.changeFrame({ target: { dataset: { target: 3 } } });
	    },

	    view: function view(ctrl, attrs) {
	        return (0, _mithril2.default)('div.explorer', (0, _mithril2.default)('div.treeview', (0, _mithril2.default)(TreeView, { treeRoot: files, fileClick: this.fileClicked.bind(this, ctrl) })), (0, _mithril2.default)('div.buttons', (0, _mithril2.default)('button', 'Send')));
	    }
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var folderIco = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU4IDU4IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1OCA1ODsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxwYXRoIHN0eWxlPSJmaWxsOiNFRkNFNEE7IiBkPSJNNTUuOTgxLDU0LjVIMi4wMTlDMC45MDQsNTQuNSwwLDUzLjU5NiwwLDUyLjQ4MVYyMC41aDU4djMxLjk4MUM1OCw1My41OTYsNTcuMDk2LDU0LjUsNTUuOTgxLDU0LjV6ICAiLz4KPHBhdGggc3R5bGU9ImZpbGw6I0VCQkExNjsiIGQ9Ik0yNi4wMTksMTEuNVY1LjUxOUMyNi4wMTksNC40MDQsMjUuMTE1LDMuNSwyNCwzLjVIMi4wMTlDMC45MDQsMy41LDAsNC40MDQsMCw1LjUxOVYxMC41djEwaDU4ICB2LTYuOTgxYzAtMS4xMTUtMC45MDQtMi4wMTktMi4wMTktMi4wMTlIMjYuMDE5eiIvPgo8Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNFQjc5Mzc7IiBkPSJNMTgsMzIuNWgxNGMwLjU1MiwwLDEtMC40NDcsMS0xcy0wLjQ0OC0xLTEtMUgxOGMtMC41NTIsMC0xLDAuNDQ3LTEsMVMxNy40NDgsMzIuNSwxOCwzMi41eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0VCNzkzNzsiIGQ9Ik0xOCwzOC41aDIyYzAuNTUyLDAsMS0wLjQ0NywxLTFzLTAuNDQ4LTEtMS0xSDE4Yy0wLjU1MiwwLTEsMC40NDctMSwxUzE3LjQ0OCwzOC41LDE4LDM4LjV6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRUI3OTM3OyIgZD0iTTQwLDQyLjVIMThjLTAuNTUyLDAtMSwwLjQ0Ny0xLDFzMC40NDgsMSwxLDFoMjJjMC41NTIsMCwxLTAuNDQ3LDEtMVM0MC41NTIsNDIuNSw0MCw0Mi41eiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=";
	var fileIco = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDYwIDYwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MCA2MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIzMnB4IiBoZWlnaHQ9IjMycHgiPgo8Zz4KCTxwYXRoIGQ9Ik00Mi41LDIyaC0yNWMtMC41NTIsMC0xLDAuNDQ3LTEsMXMwLjQ0OCwxLDEsMWgyNWMwLjU1MiwwLDEtMC40NDcsMS0xUzQzLjA1MiwyMiw0Mi41LDIyeiIgZmlsbD0iI0ZGRkZGRiIvPgoJPHBhdGggZD0iTTE3LjUsMTZoMTBjMC41NTIsMCwxLTAuNDQ3LDEtMXMtMC40NDgtMS0xLTFoLTEwYy0wLjU1MiwwLTEsMC40NDctMSwxUzE2Ljk0OCwxNiwxNy41LDE2eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPHBhdGggZD0iTTQyLjUsMzBoLTI1Yy0wLjU1MiwwLTEsMC40NDctMSwxczAuNDQ4LDEsMSwxaDI1YzAuNTUyLDAsMS0wLjQ0NywxLTFTNDMuMDUyLDMwLDQyLjUsMzB6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8cGF0aCBkPSJNNDIuNSwzOGgtMjVjLTAuNTUyLDAtMSwwLjQ0Ny0xLDFzMC40NDgsMSwxLDFoMjVjMC41NTIsMCwxLTAuNDQ3LDEtMVM0My4wNTIsMzgsNDIuNSwzOHoiIGZpbGw9IiNGRkZGRkYiLz4KCTxwYXRoIGQ9Ik00Mi41LDQ2aC0yNWMtMC41NTIsMC0xLDAuNDQ3LTEsMXMwLjQ0OCwxLDEsMWgyNWMwLjU1MiwwLDEtMC40NDcsMS0xUzQzLjA1Miw0Niw0Mi41LDQ2eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPHBhdGggZD0iTTM4LjkxNCwwSDYuNXY2MGg0N1YxNC41ODZMMzguOTE0LDB6IE0zOS41LDMuNDE0TDUwLjA4NiwxNEgzOS41VjMuNDE0eiBNOC41LDU4VjJoMjl2MTRoMTR2NDJIOC41eiIgZmlsbD0iI0ZGRkZGRiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=";

	module.exports = {
	    component: {
	        controller: function controller(attrs) {
	            return {
	                treeRoot: _mithril2.default.prop(attrs.treeRoot),
	                fileClick: attrs.fileClick
	            };
	        },

	        view: function view(ctrl, attrs) {
	            ctrl.treeRoot = _mithril2.default.prop(attrs.treeRoot);

	            var recurse = function recurse(list, level) {
	                return list.map(function (item) {
	                    return (0, _mithril2.default)('li', {
	                        'data-type': item.type,
	                        'data-name': item.name(),
	                        'data-root': item.root(),
	                        style: { 'text-indent': 15 * level + 'px' },
	                        onclick: item.type == 'file' ? ctrl.fileClick : null
	                    }, [(0, _mithril2.default)('img', { src: item.type == 'folder' ? folderIco : fileIco }), item.name(), item.children() ? (0, _mithril2.default)('ul', recurse(item.children(), level + 1)) : null]);
	                });
	            };
	            return (0, _mithril2.default)('ul', [recurse(ctrl.treeRoot(), 1)]);
	        }
	    },

	    TreeElement: function TreeElement(name, root, children) {
	        this.children = _mithril2.default.prop(children || []);
	        this.name = _mithril2.default.prop(name);
	        this.root = _mithril2.default.prop(root);
	        this.type = this.children().length > 0 ? 'folder' : 'file';
	    }
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20)))

/***/ },
/* 20 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	(function () {
	  try {
	    cachedSetTimeout = setTimeout;
	  } catch (e) {
	    cachedSetTimeout = function () {
	      throw new Error('setTimeout is not defined');
	    }
	  }
	  try {
	    cachedClearTimeout = clearTimeout;
	  } catch (e) {
	    cachedClearTimeout = function () {
	      throw new Error('clearTimeout is not defined');
	    }
	  }
	} ())
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = cachedSetTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    cachedClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        cachedSetTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _require = __webpack_require__(15);

	var ipcRenderer = _require.ipcRenderer;

	var dialog = __webpack_require__(15).remote.dialog;

	var projects = [];

	var scanProjects = function scanProjects(config) {
	    ipcRenderer.send('scan-projects', config.projectFolder);
	    _mithril2.default.startComputation();
	};

	ipcRenderer.on('scanned-projects', function (event, args) {
	    projects = args;
	    _mithril2.default.endComputation();
	});

	exports.default = {
	    controller: function controller(attrs) {
	        var config = ipcRenderer.sendSync('get-config');
	        if (!config.projectFolder) {
	            config.projectFolder = ipcRenderer.sendSync('get-default-projects-path');
	            ipcRenderer.send('set-config', config);
	        }

	        return {
	            showing: attrs.showing,
	            config: config
	        };
	    },

	    showDialog: function showDialog(ctrl, e) {
	        var folder = dialog.showOpenDialog({ properties: ['openDirectory'], defaultPath: ctrl.config.projectFolder });
	        if (folder) {
	            ctrl.config.projectFolder = folder[0];
	            ipcRenderer.send('set-config', ctrl.config);
	            scanProjects(ctrl.config);
	        }
	    },

	    setActive: function setActive(ctrl, el, e) {
	        ctrl.config.activeProject = el;
	        ipcRenderer.send('set-config', ctrl.config);
	    },

	    view: function view(ctrl, attrs) {
	        var _this = this;

	        if (!ctrl.showing && attrs.showing) {
	            scanProjects(ctrl.config);
	        }

	        ctrl.showing = attrs.showing;

	        return (0, _mithril2.default)('div.project-body.body-frame', { className: ctrl.showing ? '' : 'hidden' }, (0, _mithril2.default)('h1', 'Projects root folder'), (0, _mithril2.default)('div.inputfile', { onclick: this.showDialog.bind(this, ctrl) }, ctrl.config.projectFolder), (0, _mithril2.default)('div.button', { onclick: this.showDialog.bind(this, ctrl) }, 'Click to select'), (0, _mithril2.default)('h1', 'Projects'), (0, _mithril2.default)('ul', projects.map(function (el) {
	            return (0, _mithril2.default)('li', {
	                className: ctrl.config.activeProject == el ? 'project active' : 'project',
	                onclick: _this.setActive.bind(_this, ctrl, el)
	            }, el);
	        })));
	    }
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	var _codeflask = __webpack_require__(23);

	var _codeflask2 = _interopRequireDefault(_codeflask);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _require = __webpack_require__(15);

	var ipcRenderer = _require.ipcRenderer;


	var flask = new _codeflask2.default();

	ipcRenderer.on('quick-edit-contents', function (event, data) {
	    flask.update(data);
	    _mithril2.default.redraw();
	});

	exports.default = {
	    controller: function controller(attrs) {
	        return {
	            showing: attrs.showing
	        };
	    },

	    configEditor: function configEditor(el, hasInit) {
	        if (!hasInit) {
	            flask.run('#jseditor', { language: 'js' });
	        }
	    },

	    saveCode: function saveCode(e) {
	        ipcRenderer.send('save-code', flask.textarea.value);
	    },

	    sendCode: function sendCode(e) {
	        ipcRenderer.send('send-code', flask.textarea.value);
	    },

	    view: function view(ctrl, attrs) {
	        ctrl.showing = attrs.showing;

	        return (0, _mithril2.default)('div.quick-edit-body.body-frame', { className: ctrl.showing ? '' : 'hidden' }, (0, _mithril2.default)('h1', 'Javascript Editor'), (0, _mithril2.default)("div#jseditor", { 'data-language': "javascript", config: this.configEditor.bind(this) }), (0, _mithril2.default)('div.buttons', (0, _mithril2.default)('button', { onclick: this.saveCode.bind(this), class: 'btn btn-success' }, 'Guardar'), (0, _mithril2.default)('button', { onclick: this.sendCode.bind(this), class: 'btn btn-success' }, 'Enviar')));
	    }
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	function CodeFlask() {}

	CodeFlask.prototype.run = function (selector, opts) {
	    var target = document.querySelectorAll(selector);

	    if (target.length > 1) {
	        throw 'CodeFlask.js ERROR: run() expects only one element, ' + target.length + ' given. Use .runAll() instead.';
	    } else {
	        this.scaffold(target[0], false, opts);
	    }
	};

	CodeFlask.prototype.runAll = function (selector, opts) {
	    // Remove update API for bulk rendering
	    this.update = null;
	    this.onUpdate = null;

	    var target = document.querySelectorAll(selector);

	    var i;
	    for (i = 0; i < target.length; i++) {
	        this.scaffold(target[i], true, opts);
	    }
	};

	CodeFlask.prototype.scaffold = function (target, isMultiple, opts) {
	    var textarea = document.createElement('TEXTAREA'),
	        highlightPre = document.createElement('PRE'),
	        highlightCode = document.createElement('CODE'),
	        initialCode = target.textContent,
	        lang;

	    opts.language = this.handleLanguage(opts.language);

	    this.defaultLanguage = target.dataset.language || opts.language || 'markup';

	    // Prevent these vars from being refreshed when rendering multiple
	    // instances
	    if (!isMultiple) {
	        this.textarea = textarea;
	        this.highlightCode = highlightCode;
	    }

	    target.classList.add('CodeFlask');
	    textarea.classList.add('CodeFlask__textarea');
	    highlightPre.classList.add('CodeFlask__pre');
	    highlightCode.classList.add('CodeFlask__code');
	    highlightCode.classList.add('language-' + this.defaultLanguage);

	    // Fixing iOS "drunk-text" issue
	    if (/iPad|iPhone|iPod/.test(navigator.platform)) {
	        highlightCode.style.paddingLeft = '3px';
	    }

	    // Appending editor elements to DOM
	    target.innerHTML = '';
	    target.appendChild(textarea);
	    target.appendChild(highlightPre);
	    highlightPre.appendChild(highlightCode);

	    // Render initial code inside tag
	    textarea.value = initialCode;
	    this.renderOutput(highlightCode, textarea);

	    Prism.highlightAll();

	    this.handleInput(textarea, highlightCode, highlightPre);
	    this.handleScroll(textarea, highlightPre);
	};

	CodeFlask.prototype.renderOutput = function (highlightCode, input) {
	    highlightCode.innerHTML = input.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n";
	};

	CodeFlask.prototype.handleInput = function (textarea, highlightCode, highlightPre) {
	    var self = this,
	        input,
	        selStartPos,
	        inputVal,
	        roundedScroll;

	    textarea.addEventListener('input', function (e) {
	        input = this;

	        self.renderOutput(highlightCode, input);

	        Prism.highlightAll();
	    });

	    textarea.addEventListener('keydown', function (e) {
	        input = this, selStartPos = input.selectionStart, inputVal = input.value;

	        // If TAB pressed, insert four spaces
	        if (e.keyCode === 9) {
	            input.value = inputVal.substring(0, selStartPos) + "    " + inputVal.substring(selStartPos, input.value.length);
	            input.selectionStart = selStartPos + 4;
	            input.selectionEnd = selStartPos + 4;
	            e.preventDefault();

	            highlightCode.innerHTML = input.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n";
	            Prism.highlightAll();
	        }
	    });
	};

	CodeFlask.prototype.handleScroll = function (textarea, highlightPre) {
	    textarea.addEventListener('scroll', function () {

	        var roundedScroll = Math.floor(this.scrollTop);

	        // Fixes issue of desync text on mouse wheel, fuck Firefox.
	        if (navigator.userAgent.toLowerCase().indexOf('firefox') < 0) {
	            this.scrollTop = roundedScroll;
	        }

	        highlightPre.style.top = "-" + roundedScroll + "px";
	    });
	};

	CodeFlask.prototype.handleLanguage = function (lang) {
	    if (lang.match(/html|xml|xhtml|svg/)) {
	        return 'markup';
	    } else if (lang.match(/js/)) {
	        return 'javascript';
	    } else {
	        return lang;
	    }
	};

	CodeFlask.prototype.onUpdate = function (cb) {
	    if (typeof cb == "function") {
	        this.textarea.addEventListener('input', function (e) {
	            cb(this.value);
	        });
	    } else {
	        throw 'CodeFlask.js ERROR: onUpdate() expects function, ' + (typeof cb === 'undefined' ? 'undefined' : _typeof(cb)) + ' given instead.';
	    }
	};

	CodeFlask.prototype.update = function (string) {
	    var evt = document.createEvent("HTMLEvents");

	    this.textarea.value = string;
	    this.renderOutput(this.highlightCode, this.textarea);
	    Prism.highlightAll();

	    evt.initEvent("input", false, true);
	    this.textarea.dispatchEvent(evt);
	};

	module.exports = CodeFlask;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	var _codeflask = __webpack_require__(23);

	var _codeflask2 = _interopRequireDefault(_codeflask);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _require = __webpack_require__(15);

	var ipcRenderer = _require.ipcRenderer;


	var processes = [];
	var searchProcesses = [];

	//TODO: Improve
	ipcRenderer.on('procReply', function (event, arg) {
	    var res = arg.replace(/\r/g, ",");
	    res = res.split(",");

	    // Remove quotes
	    var trim = function trim(x) {
	        return function (x) {
	            return x.substr(1, x.length - 2);
	        }(x.trim());
	    };

	    processes = [];
	    for (var i = 0; i < res.length / 5 - 1; i++) {
	        var pid = res[i * 5 + 1];
	        var name = res[i * 5];

	        processes.push({ pid: parseInt(trim(pid)), name: trim(name) });
	    }

	    reorderProcesses('name', 'pid');
	    _mithril2.default.endComputation();
	});

	function reorderProcesses(by, sec) {
	    function compare(what, a, b) {
	        var ap = isNaN(a[what]) ? a[what].toLowerCase() : a[what];
	        var bp = isNaN(b[what]) ? b[what].toLowerCase() : b[what];

	        if (ap < bp) return -1;
	        if (ap > bp) return 1;
	        return compare(sec, a, b);
	    }

	    processes = processes.sort(compare.bind(null, by));
	}

	exports.default = {
	    reloadProc: function reloadProc() {
	        _mithril2.default.startComputation();
	        ipcRenderer.send('getProc', null);
	    },

	    controller: function controller(attrs) {
	        return {
	            showing: attrs.showing,
	            closeOverlayFrame: attrs.closeOverlayFrame,
	            inputValue: _mithril2.default.prop("")
	        };
	    },

	    reloadNow: function reloadNow() {
	        this.reloadProc();
	    },

	    setTarget: function setTarget(ctrl, target, e) {
	        _mithril2.default.startComputation();
	        ipcRenderer.send('set-target', target);
	        ctrl.closeOverlayFrame();
	    },

	    search: function search(processes, str) {
	        var matches = [];
	        var re = new RegExp(str, 'i');

	        for (var i = 0; i < processes.length; ++i) {
	            if (processes[i].name.match(re)) {
	                matches.push(processes[i]);
	            }
	        }

	        return matches;
	    },

	    focusSearch: function focusSearch(el, hasInit) {
	        hasInit && el.focus();
	    },

	    view: function view(ctrl, attrs) {
	        var _this = this;

	        // Reload now if it was not showing before
	        if (!ctrl.showing && attrs.showing) {
	            this.reloadNow();
	        }

	        ctrl.showing = attrs.showing;

	        return (0, _mithril2.default)('div.target-body', { className: ctrl.showing ? 'modal fade in show' : 'modal fade hidden', role: 'dialog' }, (0, _mithril2.default)('div', { class: 'modal-dialog modal-lg' }, (0, _mithril2.default)('div', { class: 'modal-content' }, (0, _mithril2.default)('div', { class: 'modal-header' }, (0, _mithril2.default)('button', { class: 'close', onclick: ctrl.closeOverlayFrame }, 'x'), (0, _mithril2.default)('h4', 'Select Process:', { class: 'modal-title' })), (0, _mithril2.default)('input.process-search[type=text]', {
	            config: this.focusSearch.bind(this),
	            inputValue: ctrl.inputValue(),
	            oninput: _mithril2.default.withAttr('value', ctrl.inputValue),
	            placeholder: 'Search process'
	        }), (0, _mithril2.default)('div#procContainer', { class: 'modal-body' }, '', (0, _mithril2.default)('ul#processList', { class: 'list-group' }, (ctrl.inputValue() ? this.search(processes, ctrl.inputValue()) : processes).map(function (e) {
	            return (0, _mithril2.default)('li.list-group-item', { onclick: _this.setTarget.bind(_this, ctrl, e) }, (0, _mithril2.default)('span.badge', e.pid), e.name);
	        }))), (0, _mithril2.default)('div', { class: 'modal-footer' }, (0, _mithril2.default)('button', { onclick: reorderProcesses.bind(this, 'name', 'pid'), class: 'btn btn-default' }, 'By name'), (0, _mithril2.default)('button', { onclick: reorderProcesses.bind(this, 'pid', null), class: 'btn btn-default' }, 'By PID'), (0, _mithril2.default)('button', { onclick: this.reloadProc.bind(this), class: 'btn btn-default' }, 'Reload'), (0, _mithril2.default)('button', { onclick: ctrl.closeOverlayFrame, class: 'btn btn-default' }, 'Close')))));
	    }
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var path = __webpack_require__(19);

	function doNotify(options, image) {
	    if (!image) {
	        new Notification(options.title, options);
	    } else {
	        options.icon = 'LogoApe.ico';
	        new Notification(options.title, options);
	    }
	}

	module.exports = {
	    doNotify: doNotify
	};

/***/ }
/******/ ]);