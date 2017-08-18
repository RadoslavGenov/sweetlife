/**
 * Created by radoka on 8/18/17.
 */
function Slidenavigation(navigation) {
	if (navigation instanceof jQuery == !1) throw new Error("Slidenavigation expects a jquery object.");
	var windowWidth = $(window).width(),
		list = navigation.find("li"),
		totalWidth = calculateWidth(list),
		scrollDifference = totalWidth - windowWidth;
	if ($(".strokes").css({
			"overflow-x": "hidden"
		}), list.length >= 4) navigation.on("mousemove", function(e) {
		var offSetLeft = -Math.round(scrollDifference * (e.clientX / windowWidth));
		$(navigation).offset({
			left: offSetLeft
		})
	});
	else {
		var percentage = Math.round(100 / list.length);
		list.each(function(index, item) {
			$(item).css({
				width: percentage + "vw"
			})
		})
	}
}

function calculateWidth(list) {
	var totalWidth = 0;
	return list.each(function() {
		totalWidth += $(this).width()
	}), totalWidth
}! function(factory) {
	if ("function" == typeof define && define.amd) {
		if ("undefined" != typeof requirejs) {
			var rndKey = "[history" + (new Date).getTime() + "]",
				onError = requirejs.onError;
			factory.toString = function() {
				return rndKey
			}, requirejs.onError = function(err) {
				-1 === err.message.indexOf(rndKey) && onError.call(requirejs, err)
			}
		}
		define([], factory)
	}
	return "object" != typeof exports || "undefined" == typeof module ? factory() : void(module.exports = factory())
}(function() {
	function emptyFunction() {}

	function parseURL(href, isWindowLocation, isNotAPI) {
		var re = /(?:([a-zA-Z0-9\-]+\:))?(?:\/\/(?:[^@]*@)?([^\/:\?#]+)(?::([0-9]+))?)?([^\?#]*)(?:(\?[^#]+)|\?)?(?:(#.*))?/;
		if (null == href || "" === href || isWindowLocation) href = isWindowLocation ? href : windowLocation.href, (!isSupportHistoryAPI || isNotAPI) && (href = href.replace(/^[^#]*/, "") || "#", href = windowLocation.protocol.replace(/:.*$|$/, ":") + "//" + windowLocation.host + settings.basepath + href.replace(new RegExp("^#[/]?(?:" + settings.type + ")?"), ""));
		else {
			var current = parseURL(),
				base = document.getElementsByTagName("base")[0];
			!isNotAPI && base && base.getAttribute("href") && (base.href = base.href, current = parseURL(base.href, null, !0));
			var _pathname = current._pathname,
				_protocol = current._protocol;
			href = "" + href, href = /^(?:\w+\:)?\/\//.test(href) ? 0 === href.indexOf("/") ? _protocol + href : href : _protocol + "//" + current._host + (0 === href.indexOf("/") ? href : 0 === href.indexOf("?") ? _pathname + href : 0 === href.indexOf("#") ? _pathname + current._search + href : _pathname.replace(/[^\/]+$/g, "") + href)
		}
		anchorElement.href = href;
		var result = re.exec(anchorElement.href),
			host = result[2] + (result[3] ? ":" + result[3] : ""),
			pathname = result[4] || "/",
			search = result[5] || "",
			hash = "#" === result[6] ? "" : result[6] || "",
			relative = pathname + search + hash,
			nohash = pathname.replace(new RegExp("^" + settings.basepath, "i"), settings.type) + search;
		return {
			_href: result[1] + "//" + host + relative,
			_protocol: result[1],
			_host: host,
			_hostname: result[2],
			_port: result[3] || "",
			_pathname: pathname,
			_search: search,
			_hash: hash,
			_relative: relative,
			_nohash: nohash,
			_special: nohash + hash
		}
	}

	function isSupportHistoryAPIDetect() {
		var ua = global.navigator.userAgent;
		return -1 === ua.indexOf("Android 2.") && -1 === ua.indexOf("Android 4.0") || -1 === ua.indexOf("Mobile Safari") || -1 !== ua.indexOf("Chrome") || -1 !== ua.indexOf("Windows Phone") ? !!historyPushState : !1
	}

	function storageInitialize() {
		var sessionStorage;
		try {
			sessionStorage = global.sessionStorage, sessionStorage.setItem(sessionStorageKey + "t", "1"), sessionStorage.removeItem(sessionStorageKey + "t")
		} catch (_e_) {
			sessionStorage = {
				getItem: function(key) {
					var cookie = document.cookie.split(key + "=");
					return cookie.length > 1 && cookie.pop().split(";").shift() || "null"
				},
				setItem: function(key) {
					var state = {};
					(state[windowLocation.href] = historyObject.state) && (document.cookie = key + "=" + JSON.stringify(state))
				}
			}
		}
		try {
			stateStorage = JSON.parse(sessionStorage.getItem(sessionStorageKey)) || {}
		} catch (_e_) {
			stateStorage = {}
		}
		addEvent(eventNamePrefix + "unload", function() {
			sessionStorage.setItem(sessionStorageKey, JSON.stringify(stateStorage))
		}, !1)
	}

	function redefineProperty(object, prop, descriptor, onWrapped) {
		var testOnly = 0;
		descriptor || (descriptor = {
			set: emptyFunction
		}, testOnly = 1);
		var isDefinedSetter = !descriptor.set,
			isDefinedGetter = !descriptor.get,
			test = {
				configurable: !0,
				set: function() {
					isDefinedSetter = 1
				},
				get: function() {
					isDefinedGetter = 1
				}
			};
		try {
			defineProperty(object, prop, test), object[prop] = object[prop], defineProperty(object, prop, descriptor)
		} catch (_e_) {}
		if (!(isDefinedSetter && isDefinedGetter || (object.__defineGetter__ && (object.__defineGetter__(prop, test.get), object.__defineSetter__(prop, test.set), object[prop] = object[prop], descriptor.get && object.__defineGetter__(prop, descriptor.get), descriptor.set && object.__defineSetter__(prop, descriptor.set)), isDefinedSetter && isDefinedGetter))) {
			if (testOnly) return !1;
			if (object === global) {
				try {
					var originalValue = object[prop];
					object[prop] = null
				} catch (_e_) {}
				if ("execScript" in global) global.execScript("Public " + prop, "VBScript"), global.execScript("var " + prop + ";", "JavaScript");
				else try {
					defineProperty(object, prop, {
						value: emptyFunction
					})
				} catch (_e_) {
					"onpopstate" === prop && (addEvent("popstate", descriptor = function() {
						removeEvent("popstate", descriptor, !1);
						var onpopstate = object.onpopstate;
						object.onpopstate = null, setTimeout(function() {
							object.onpopstate = onpopstate
						}, 1)
					}, !1), triggerEventsInWindowAttributes = 0)
				}
				object[prop] = originalValue
			} else try {
				try {
					var temp = Object.create(object);
					defineProperty(Object.getPrototypeOf(temp) === object ? temp : object, prop, descriptor);
					for (var key in object) "function" == typeof object[key] && (temp[key] = object[key].bind(object));
					try {
						onWrapped.call(temp, temp, object)
					} catch (_e_) {}
					object = temp
				} catch (_e_) {
					defineProperty(object.constructor.prototype, prop, descriptor)
				}
			} catch (_e_) {
				return !1
			}
		}
		return object
	}

	function prepareDescriptorsForObject(object, prop, descriptor) {
		return descriptor = descriptor || {}, object = object === locationDescriptors ? windowLocation : object, descriptor.set = descriptor.set || function(value) {
			object[prop] = value
		}, descriptor.get = descriptor.get || function() {
			return object[prop]
		}, descriptor
	}

	function addEventListener(event, listener, capture) {
		event in eventsList ? eventsList[event].push(listener) : arguments.length > 3 ? addEvent(event, listener, capture, arguments[3]) : addEvent(event, listener, capture)
	}

	function removeEventListener(event, listener, capture) {
		var list = eventsList[event];
		if (list) {
			for (var i = list.length; i--;)
				if (list[i] === listener) {
					list.splice(i, 1);
					break
				}
		} else removeEvent(event, listener, capture)
	}

	function dispatchEvent(event, eventObject) {
		var eventType = ("" + ("string" == typeof event ? event : event.type)).replace(/^on/, ""),
			list = eventsList[eventType];
		if (list) {
			if (eventObject = "string" == typeof event ? eventObject : event, null == eventObject.target)
				for (var props = ["target", "currentTarget", "srcElement", "type"]; event = props.pop();) eventObject = redefineProperty(eventObject, event, {
					get: "type" === event ? function() {
						return eventType
					} : function() {
						return global
					}
				});
			triggerEventsInWindowAttributes && (("popstate" === eventType ? global.onpopstate : global.onhashchange) || emptyFunction).call(global, eventObject);
			for (var i = 0, len = list.length; len > i; i++) list[i].call(global, eventObject);
			return !0
		}
		return dispatch(event, eventObject)
	}

	function firePopState() {
		var o = document.createEvent ? document.createEvent("Event") : document.createEventObject();
		o.initEvent ? o.initEvent("popstate", !1, !1) : o.type = "popstate", o.state = historyObject.state, dispatchEvent(o)
	}

	function fireInitialState() {
		isFireInitialState && (isFireInitialState = !1, firePopState())
	}

	function changeState(state, url, replace, lastURLValue) {
		if (isSupportHistoryAPI) lastURL = windowLocation.href;
		else {
			0 === isUsedHistoryLocationFlag && (isUsedHistoryLocationFlag = 2);
			var urlObject = parseURL(url, 2 === isUsedHistoryLocationFlag && -1 !== ("" + url).indexOf("#"));
			urlObject._relative !== parseURL()._relative && (lastURL = lastURLValue, replace ? windowLocation.replace("#" + urlObject._special) : windowLocation.hash = urlObject._special)
		}!isSupportStateObjectInHistory && state && (stateStorage[windowLocation.href] = state), isFireInitialState = !1
	}

	function onHashChange(event) {
		var fireNow = lastURL;
		if (lastURL = windowLocation.href, fireNow) {
			checkUrlForPopState !== windowLocation.href && firePopState(), event = event || global.event;
			var oldURLObject = parseURL(fireNow, !0),
				newURLObject = parseURL();
			event.oldURL || (event.oldURL = oldURLObject._href, event.newURL = newURLObject._href), oldURLObject._hash !== newURLObject._hash && dispatchEvent(event)
		}
	}

	function onLoad(noScroll) {
		setTimeout(function() {
			addEvent("popstate", function(e) {
				checkUrlForPopState = windowLocation.href, isSupportStateObjectInHistory || (e = redefineProperty(e, "state", {
					get: function() {
						return historyObject.state
					}
				})), dispatchEvent(e)
			}, !1)
		}, 0), !isSupportHistoryAPI && noScroll !== !0 && "location" in historyObject && (scrollToAnchorId(locationObject.hash), fireInitialState())
	}

	function anchorTarget(target) {
		for (; target;) {
			if ("A" === target.nodeName) return target;
			target = target.parentNode
		}
	}

	function onAnchorClick(e) {
		var event = e || global.event,
			target = anchorTarget(event.target || event.srcElement),
			defaultPrevented = "defaultPrevented" in event ? event.defaultPrevented : event.returnValue === !1;
		if (target && "A" === target.nodeName && !defaultPrevented) {
			var current = parseURL(),
				expect = parseURL(target.getAttribute("href", 2)),
				isEqualBaseURL = current._href.split("#").shift() === expect._href.split("#").shift();
			isEqualBaseURL && expect._hash && (current._hash !== expect._hash && (locationObject.hash = expect._hash), scrollToAnchorId(expect._hash), event.preventDefault ? event.preventDefault() : event.returnValue = !1)
		}
	}

	function scrollToAnchorId(hash) {
		var target = document.getElementById(hash = (hash || "").replace(/^#/, ""));
		if (target && target.id === hash && "A" === target.nodeName) {
			var rect = target.getBoundingClientRect();
			global.scrollTo(documentElement.scrollLeft || 0, rect.top + (documentElement.scrollTop || 0) - (documentElement.clientTop || 0))
		}
	}

	function initialize() {
		var scripts = document.getElementsByTagName("script"),
			src = (scripts[scripts.length - 1] || {}).src || "",
			arg = -1 !== src.indexOf("?") ? src.split("?").pop() : "";
		arg.replace(/(\w+)(?:=([^&]*))?/g, function(a, key, value) {
			settings[key] = (value || "").replace(/^(0|false)$/, "")
		}), addEvent(eventNamePrefix + "hashchange", onHashChange, !1);
		var data = [locationDescriptors, locationObject, eventsDescriptors, global, historyDescriptors, historyObject];
		isSupportStateObjectInHistory && delete historyDescriptors.state;
		for (var i = 0; i < data.length; i += 2)
			for (var prop in data[i])
				if (data[i].hasOwnProperty(prop))
					if ("object" != typeof data[i][prop]) data[i + 1][prop] = data[i][prop];
					else {
						var descriptor = prepareDescriptorsForObject(data[i], prop, data[i][prop]);
						if (!redefineProperty(data[i + 1], prop, descriptor, function(n, o) {
								o === historyObject && (global.history = historyObject = data[i + 1] = n)
							})) return removeEvent(eventNamePrefix + "hashchange", onHashChange, !1), !1;
						data[i + 1] === global && (eventsList[prop] = eventsList[prop.substr(2)] = [])
					}
		return historyObject.setup(), settings.redirect && historyObject.redirect(), settings.init && (isUsedHistoryLocationFlag = 1), !isSupportStateObjectInHistory && JSON && storageInitialize(), isSupportHistoryAPI || document[addEventListenerName](eventNamePrefix + "click", onAnchorClick, !1), "complete" === document.readyState ? onLoad(!0) : (isSupportHistoryAPI || parseURL()._relative === settings.basepath || (isFireInitialState = !0), addEvent(eventNamePrefix + "load", onLoad, !1)), !0
	}
	var global = ("object" == typeof window ? window : this) || {};
	if (!global.history || "emulate" in global.history) return global.history;
	var customOrigin, document = global.document,
		documentElement = document.documentElement,
		Object = global.Object,
		JSON = global.JSON,
		windowLocation = global.location,
		windowHistory = global.history,
		historyObject = windowHistory,
		historyPushState = windowHistory.pushState,
		historyReplaceState = windowHistory.replaceState,
		isSupportHistoryAPI = isSupportHistoryAPIDetect(),
		isSupportStateObjectInHistory = "state" in windowHistory,
		defineProperty = Object.defineProperty,
		locationObject = redefineProperty({}, "t") ? {} : document.createElement("a"),
		eventNamePrefix = "",
		addEventListenerName = global.addEventListener ? "addEventListener" : (eventNamePrefix = "on") && "attachEvent",
		removeEventListenerName = global.removeEventListener ? "removeEventListener" : "detachEvent",
		dispatchEventName = global.dispatchEvent ? "dispatchEvent" : "fireEvent",
		addEvent = global[addEventListenerName],
		removeEvent = global[removeEventListenerName],
		dispatch = global[dispatchEventName],
		settings = {
			basepath: "/",
			redirect: 0,
			type: "/",
			init: 0
		},
		sessionStorageKey = "__historyAPI__",
		anchorElement = document.createElement("a"),
		lastURL = windowLocation.href,
		checkUrlForPopState = "",
		triggerEventsInWindowAttributes = 1,
		isFireInitialState = !1,
		isUsedHistoryLocationFlag = 0,
		stateStorage = {},
		eventsList = {},
		lastTitle = document.title,
		eventsDescriptors = {
			onhashchange: null,
			onpopstate: null
		},
		fastFixChrome = function(method, args) {
			var isNeedFix = global.history !== windowHistory;
			isNeedFix && (global.history = windowHistory), method.apply(windowHistory, args), isNeedFix && (global.history = historyObject)
		},
		historyDescriptors = {
			setup: function(basepath, type, redirect) {
				settings.basepath = ("" + (null == basepath ? settings.basepath : basepath)).replace(/(?:^|\/)[^\/]*$/, "/"), settings.type = null == type ? settings.type : type, settings.redirect = null == redirect ? settings.redirect : !!redirect
			},
			redirect: function(type, basepath) {
				if (historyObject.setup(basepath, type), basepath = settings.basepath, global.top == global.self) {
					var relative = parseURL(null, !1, !0)._relative,
						path = windowLocation.pathname + windowLocation.search;
					isSupportHistoryAPI ? (path = path.replace(/([^\/])$/, "$1/"), relative != basepath && new RegExp("^" + basepath + "$", "i").test(path) && windowLocation.replace(relative)) : path != basepath && (path = path.replace(/([^\/])\?/, "$1/?"), new RegExp("^" + basepath, "i").test(path) && windowLocation.replace(basepath + "#" + path.replace(new RegExp("^" + basepath, "i"), settings.type) + windowLocation.hash))
				}
			},
			pushState: function(state, title, url) {
				var t = document.title;
				null != lastTitle && (document.title = lastTitle), historyPushState && fastFixChrome(historyPushState, arguments), changeState(state, url), document.title = t, lastTitle = title
			},
			replaceState: function(state, title, url) {
				var t = document.title;
				null != lastTitle && (document.title = lastTitle), delete stateStorage[windowLocation.href], historyReplaceState && fastFixChrome(historyReplaceState, arguments), changeState(state, url, !0), document.title = t, lastTitle = title
			},
			location: {
				set: function(value) {
					0 === isUsedHistoryLocationFlag && (isUsedHistoryLocationFlag = 1), global.location = value
				},
				get: function() {
					return 0 === isUsedHistoryLocationFlag && (isUsedHistoryLocationFlag = 1), locationObject
				}
			},
			state: {
				get: function() {
					return "object" == typeof stateStorage[windowLocation.href] ? JSON.parse(JSON.stringify(stateStorage[windowLocation.href])) : "undefined" != typeof stateStorage[windowLocation.href] ? stateStorage[windowLocation.href] : null
				}
			}
		},
		locationDescriptors = {
			assign: function(url) {
				isSupportHistoryAPI || 0 !== ("" + url).indexOf("#") ? windowLocation.assign(url) : changeState(null, url)
			},
			reload: function(flag) {
				windowLocation.reload(flag)
			},
			replace: function(url) {
				isSupportHistoryAPI || 0 !== ("" + url).indexOf("#") ? windowLocation.replace(url) : changeState(null, url, !0)
			},
			toString: function() {
				return this.href
			},
			origin: {
				get: function() {
					return void 0 !== customOrigin ? customOrigin : windowLocation.origin ? windowLocation.origin : windowLocation.protocol + "//" + windowLocation.hostname + (windowLocation.port ? ":" + windowLocation.port : "")
				},
				set: function(value) {
					customOrigin = value
				}
			},
			href: isSupportHistoryAPI ? null : {
				get: function() {
					return parseURL()._href
				}
			},
			protocol: null,
			host: null,
			hostname: null,
			port: null,
			pathname: isSupportHistoryAPI ? null : {
				get: function() {
					return parseURL()._pathname
				}
			},
			search: isSupportHistoryAPI ? null : {
				get: function() {
					return parseURL()._search
				}
			},
			hash: isSupportHistoryAPI ? null : {
				set: function(value) {
					changeState(null, ("" + value).replace(/^(#|)/, "#"), !1, lastURL)
				},
				get: function() {
					return parseURL()._hash
				}
			}
		};
	return initialize() ? (historyObject.emulate = !isSupportHistoryAPI, global[addEventListenerName] = addEventListener, global[removeEventListenerName] = removeEventListener, global[dispatchEventName] = dispatchEvent, historyObject) : void 0
}),
function(window, document) {
	function is(obj, type) {
		return typeof obj === type
	}

	function testRunner() {
		var featureNames, feature, aliasIdx, result, nameIdx, featureName, featureNameSplit;
		for (var featureIdx in tests)
			if (tests.hasOwnProperty(featureIdx)) {
				if (featureNames = [], feature = tests[featureIdx], feature.name && (featureNames.push(feature.name.toLowerCase()), feature.options && feature.options.aliases && feature.options.aliases.length))
					for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
				for (result = is(feature.fn, "function") ? feature.fn() : feature.fn, nameIdx = 0; nameIdx < featureNames.length; nameIdx++) featureName = featureNames[nameIdx], featureNameSplit = featureName.split("."), 1 === featureNameSplit.length ? Modernizr[featureNameSplit[0]] = result : (!Modernizr[featureNameSplit[0]] || Modernizr[featureNameSplit[0]] instanceof Boolean || (Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]])), Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result), classes.push((result ? "" : "no-") + featureNameSplit.join("-"))
			}
	}

	function createElement() {
		return "function" != typeof document.createElement ? document.createElement(arguments[0]) : isSVG ? document.createElementNS.call(document, "http://www.w3.org/2000/svg", arguments[0]) : document.createElement.apply(document, arguments)
	}

	function getBody() {
		var body = document.body;
		return body || (body = createElement(isSVG ? "svg" : "body"), body.fake = !0), body
	}

	function injectElementWithStyles(rule, callback, nodes, testnames) {
		var style, ret, node, docOverflow, mod = "modernizr",
			div = createElement("div"),
			body = getBody();
		if (parseInt(nodes, 10))
			for (; nodes--;) node = createElement("div"), node.id = testnames ? testnames[nodes] : mod + (nodes + 1), div.appendChild(node);
		return style = createElement("style"), style.type = "text/css", style.id = "s" + mod, (body.fake ? body : div).appendChild(style), body.appendChild(div), style.styleSheet ? style.styleSheet.cssText = rule : style.appendChild(document.createTextNode(rule)), div.id = mod, body.fake && (body.style.background = "", body.style.overflow = "hidden", docOverflow = docElement.style.overflow, docElement.style.overflow = "hidden", docElement.appendChild(body)), ret = callback(div, rule), body.fake ? (body.parentNode.removeChild(body), docElement.style.overflow = docOverflow, docElement.offsetHeight) : div.parentNode.removeChild(div), !!ret
	}
	var tests = [],
		ModernizrProto = {
			_version: "3.2.0",
			_config: {
				classPrefix: "",
				enableClasses: !0,
				enableJSClass: !0,
				usePrefixes: !0
			},
			_q: [],
			on: function(test, cb) {
				var self = this;
				setTimeout(function() {
					cb(self[test])
				}, 0)
			},
			addTest: function(name, fn, options) {
				tests.push({
					name: name,
					fn: fn,
					options: options
				})
			},
			addAsyncTest: function(fn) {
				tests.push({
					name: null,
					fn: fn
				})
			}
		},
		Modernizr = function() {};
	Modernizr.prototype = ModernizrProto, Modernizr = new Modernizr;
	var classes = [],
		prefixes = ModernizrProto._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : [];
	ModernizrProto._prefixes = prefixes;
	var docElement = document.documentElement,
		isSVG = "svg" === docElement.nodeName.toLowerCase(),
		testStyles = ModernizrProto.testStyles = injectElementWithStyles;
	Modernizr.addTest("touchevents", function() {
		var bool;
		if ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch) bool = !0;
		else {
			var query = ["@media (", prefixes.join("touch-enabled),("), "heartz", ")", "{#modernizr{top:9px;position:absolute}}"].join("");
			testStyles(query, function(node) {
				bool = 9 === node.offsetTop
			})
		}
		return bool
	});
	isSVG || ! function(window, document) {
		function addStyleSheet(ownerDocument, cssText) {
			var p = ownerDocument.createElement("p"),
				parent = ownerDocument.getElementsByTagName("head")[0] || ownerDocument.documentElement;
			return p.innerHTML = "x<style>" + cssText + "</style>", parent.insertBefore(p.lastChild, parent.firstChild)
		}

		function getElements() {
			var elements = html5.elements;
			return "string" == typeof elements ? elements.split(" ") : elements
		}

		function addElements(newElements, ownerDocument) {
			var elements = html5.elements;
			"string" != typeof elements && (elements = elements.join(" ")), "string" != typeof newElements && (newElements = newElements.join(" ")), html5.elements = elements + " " + newElements, shivDocument(ownerDocument)
		}

		function getExpandoData(ownerDocument) {
			var data = expandoData[ownerDocument[expando]];
			return data || (data = {}, expanID++, ownerDocument[expando] = expanID, expandoData[expanID] = data), data
		}

		function createElement(nodeName, ownerDocument, data) {
			if (ownerDocument || (ownerDocument = document), supportsUnknownElements) return ownerDocument.createElement(nodeName);
			data || (data = getExpandoData(ownerDocument));
			var node;
			return node = data.cache[nodeName] ? data.cache[nodeName].cloneNode() : saveClones.test(nodeName) ? (data.cache[nodeName] = data.createElem(nodeName)).cloneNode() : data.createElem(nodeName), !node.canHaveChildren || reSkip.test(nodeName) || node.tagUrn ? node : data.frag.appendChild(node)
		}

		function createDocumentFragment(ownerDocument, data) {
			if (ownerDocument || (ownerDocument = document), supportsUnknownElements) return ownerDocument.createDocumentFragment();
			data = data || getExpandoData(ownerDocument);
			for (var clone = data.frag.cloneNode(), i = 0, elems = getElements(), l = elems.length; l > i; i++) clone.createElement(elems[i]);
			return clone
		}

		function shivMethods(ownerDocument, data) {
			data.cache || (data.cache = {}, data.createElem = ownerDocument.createElement, data.createFrag = ownerDocument.createDocumentFragment, data.frag = data.createFrag()), ownerDocument.createElement = function(nodeName) {
				return html5.shivMethods ? createElement(nodeName, ownerDocument, data) : data.createElem(nodeName)
			}, ownerDocument.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + getElements().join().replace(/[\w\-:]+/g, function(nodeName) {
				return data.createElem(nodeName), data.frag.createElement(nodeName), 'c("' + nodeName + '")'
			}) + ");return n}")(html5, data.frag)
		}

		function shivDocument(ownerDocument) {
			ownerDocument || (ownerDocument = document);
			var data = getExpandoData(ownerDocument);
			return !html5.shivCSS || supportsHtml5Styles || data.hasCSS || (data.hasCSS = !!addStyleSheet(ownerDocument, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")), supportsUnknownElements || shivMethods(ownerDocument, data), ownerDocument
		}
		var supportsHtml5Styles, supportsUnknownElements, version = "3.7.3",
			options = window.html5 || {},
			reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
			saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
			expando = "_html5shiv",
			expanID = 0,
			expandoData = {};
		! function() {
			try {
				var a = document.createElement("a");
				a.innerHTML = "<xyz></xyz>", supportsHtml5Styles = "hidden" in a, supportsUnknownElements = 1 == a.childNodes.length || function() {
					document.createElement("a");
					var frag = document.createDocumentFragment();
					return "undefined" == typeof frag.cloneNode || "undefined" == typeof frag.createDocumentFragment || "undefined" == typeof frag.createElement
				}()
			} catch (e) {
				supportsHtml5Styles = !0, supportsUnknownElements = !0
			}
		}();
		var html5 = {
			elements: options.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",
			version: version,
			shivCSS: options.shivCSS !== !1,
			supportsUnknownElements: supportsUnknownElements,
			shivMethods: options.shivMethods !== !1,
			type: "default",
			shivDocument: shivDocument,
			createElement: createElement,
			createDocumentFragment: createDocumentFragment,
			addElements: addElements
		};
		window.html5 = html5, shivDocument(document), "object" == typeof module && module.exports && (module.exports = html5)
	}("undefined" != typeof window ? window : this, document), testRunner(), delete ModernizrProto.addTest, delete ModernizrProto.addAsyncTest;
	for (var i = 0; i < Modernizr._q.length; i++) Modernizr._q[i]();
	window.Modernizr = Modernizr
}(window, document), ! function(e) {
	if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
	else if ("function" == typeof define && define.amd) define([], e);
	else {
		var f;
		"undefined" != typeof window ? f = window : "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self), f.page = e()
	}
}(function() {
	return function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = "function" == typeof require && require;
					if (!u && a) return a(o, !0);
					if (i) return i(o, !0);
					var f = new Error("Cannot find module '" + o + "'");
					throw f.code = "MODULE_NOT_FOUND", f
				}
				var l = n[o] = {
					exports: {}
				};
				t[o][0].call(l.exports, function(e) {
					var n = t[o][1][e];
					return s(n ? n : e)
				}, l, l.exports, e, t, n, r)
			}
			return n[o].exports
		}
		for (var i = "function" == typeof require && require, o = 0; o < r.length; o++) s(r[o]);
		return s
	}({
		1: [function(require, module) {
			(function(process) {
				"use strict";

				function page(path, fn) {
					if ("function" == typeof path) return page("*", path);
					if ("function" == typeof fn)
						for (var route = new Route(path), i = 1; i < arguments.length; ++i) page.callbacks.push(route.middleware(arguments[i]));
					else "string" == typeof path ? page["string" == typeof fn ? "redirect" : "show"](path, fn) : page.start(path)
				}

				function unhandled(ctx) {
					if (!ctx.handled) {
						var current;
						current = hashbang ? base + location.hash.replace("#!", "") : location.pathname + location.search + location.hash, current !== ctx.canonicalPath && (page.stop(), ctx.handled = !1, location.href = ctx.canonicalPath)
					}
				}

				function decodeURLEncodedURIComponent(val) {
					return "string" != typeof val ? val : decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, " ")) : val
				}

				function Context(path, state) {
					"/" === path[0] && 0 !== path.indexOf(base) && (path = base + (hashbang ? "#!" : "") + path);
					var i = path.indexOf("?");
					if (this.canonicalPath = path, this.path = path.replace(base, "") || "/", hashbang && (this.path = this.path.replace("#!", "") || "/"), this.title = document.title, this.state = state || {}, this.state.path = path, this.querystring = ~i ? decodeURLEncodedURIComponent(path.slice(i + 1)) : "", this.pathname = decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path), this.params = {}, this.hash = "", !hashbang) {
						if (!~this.path.indexOf("#")) return;
						var parts = this.path.split("#");
						this.path = parts[0], this.hash = decodeURLEncodedURIComponent(parts[1]) || "", this.querystring = this.querystring.split("#")[0]
					}
				}

				function Route(path, options) {
					options = options || {}, this.path = "*" === path ? "(.*)" : path, this.method = "GET", this.regexp = pathtoRegexp(this.path, this.keys = [], options.sensitive, options.strict)
				}

				function onclick(e) {
					if (1 === which(e) && !(e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented)) {
						for (var el = e.path ? e.path[0] : e.target; el && "A" !== el.nodeName;) el = el.parentNode;
						if (el && "A" === el.nodeName && !el.hasAttribute("download") && "external" !== el.getAttribute("rel")) {
							var link = el.getAttribute("href");
							if ((hashbang || el.pathname !== location.pathname || !el.hash && "#" !== link) && !(link && link.indexOf("mailto:") > -1) && !el.target && sameOrigin(el.href)) {
								var path = el.pathname + el.search + (el.hash || "");
								"undefined" != typeof process && path.match(/^\/[a-zA-Z]:\//) && (path = path.replace(/^\/[a-zA-Z]:\//, "/"));
								var orig = path;
								0 === path.indexOf(base) && (path = path.substr(base.length)), hashbang && (path = path.replace("#!", "")), base && orig === path || (e.preventDefault(), page.show(orig))
							}
						}
					}
				}

				function which(e) {
					return e = e || window.event, null === e.which ? e.button : e.which
				}

				function sameOrigin(href) {
					var origin = location.protocol + "//" + location.hostname;
					return location.port && (origin += ":" + location.port), href && 0 === href.indexOf(origin)
				}
				var pathtoRegexp = require("path-to-regexp");
				module.exports = page;
				var running, prevContext, clickEvent = "undefined" != typeof document && document.ontouchstart ? "touchstart" : "click",
					location = "undefined" != typeof window && (window.history.location || window.location),
					dispatch = !0,
					decodeURLComponents = !0,
					base = "",
					hashbang = !1;
				page.callbacks = [], page.exits = [], page.current = "", page.len = 0, page.base = function(path) {
					return 0 === arguments.length ? base : void(base = path)
				}, page.start = function(options) {
					if (options = options || {}, !running && (running = !0, !1 === options.dispatch && (dispatch = !1), !1 === options.decodeURLComponents && (decodeURLComponents = !1), !1 !== options.popstate && window.addEventListener("popstate", onpopstate, !1), !1 !== options.click && document.addEventListener(clickEvent, onclick, !1), !0 === options.hashbang && (hashbang = !0), dispatch)) {
						var url = hashbang && ~location.hash.indexOf("#!") ? location.hash.substr(2) + location.search : location.pathname + location.search + location.hash;
						page.replace(url, null, !0, dispatch)
					}
				}, page.stop = function() {
					running && (page.current = "", page.len = 0, running = !1, document.removeEventListener(clickEvent, onclick, !1), window.removeEventListener("popstate", onpopstate, !1))
				}, page.show = function(path, state, dispatch, push) {
					var ctx = new Context(path, state);
					return page.current = ctx.path, !1 !== dispatch && page.dispatch(ctx), !1 !== ctx.handled && !1 !== push && ctx.pushState(), ctx
				}, page.back = function(path, state) {
					page.len > 0 ? (history.back(), page.len--) : setTimeout(path ? function() {
						page.show(path, state)
					} : function() {
						page.show(base, state)
					})
				}, page.redirect = function(from, to) {
					"string" == typeof from && "string" == typeof to && page(from, function() {
						setTimeout(function() {
							page.replace(to)
						}, 0)
					}), "string" == typeof from && "undefined" == typeof to && setTimeout(function() {
						page.replace(from)
					}, 0)
				}, page.replace = function(path, state, init, dispatch) {
					var ctx = new Context(path, state);
					return page.current = ctx.path, ctx.init = init, ctx.save(), !1 !== dispatch && page.dispatch(ctx), ctx
				}, page.dispatch = function(ctx) {
					function nextExit() {
						var fn = page.exits[j++];
						return fn ? void fn(prev, nextExit) : nextEnter()
					}

					function nextEnter() {
						var fn = page.callbacks[i++];
						return ctx.path !== page.current ? void(ctx.handled = !1) : fn ? void fn(ctx, nextEnter) : unhandled(ctx)
					}
					var prev = prevContext,
						i = 0,
						j = 0;
					prevContext = ctx, prev ? nextExit() : nextEnter()
				}, page.exit = function(path) {
					if ("function" == typeof path) return page.exit("*", path);
					for (var route = new Route(path), i = 1; i < arguments.length; ++i) page.exits.push(route.middleware(arguments[i]))
				}, page.Context = Context, Context.prototype.pushState = function() {
					page.len++, history.pushState(this.state, this.title, hashbang && "/" !== this.path ? "#!" + this.path : this.canonicalPath)
				}, Context.prototype.save = function() {
					history.replaceState(this.state, this.title, hashbang && "/" !== this.path ? "#!" + this.path : this.canonicalPath)
				}, page.Route = Route, Route.prototype.middleware = function(fn) {
					var self = this;
					return function(ctx, next) {
						return self.match(ctx.path, ctx.params) ? fn(ctx, next) : void next()
					}
				}, Route.prototype.match = function(path, params) {
					var keys = this.keys,
						qsIndex = path.indexOf("?"),
						pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
						m = this.regexp.exec(decodeURIComponent(pathname));
					if (!m) return !1;
					for (var i = 1, len = m.length; len > i; ++i) {
						var key = keys[i - 1],
							val = decodeURLEncodedURIComponent(m[i]);
						void 0 === val && hasOwnProperty.call(params, key.name) || (params[key.name] = val)
					}
					return !0
				};
				var onpopstate = function() {
					var loaded = !1;
					if ("undefined" != typeof window) return "complete" === document.readyState ? loaded = !0 : window.addEventListener("load", function() {
							setTimeout(function() {
								loaded = !0
							}, 0)
						}),
						function(e) {
							if (loaded)
								if (e.state) {
									var path = e.state.path;
									page.replace(path, e.state)
								} else page.show(location.pathname + location.hash, void 0, void 0, !1)
						}
				}();
				page.sameOrigin = sameOrigin
			}).call(this, require("_process"))
		}, {
			_process: 2,
			"path-to-regexp": 3
		}],
		2: [function(require, module) {
			function noop() {}
			var process = module.exports = {};
			process.nextTick = function() {
				var canSetImmediate = "undefined" != typeof window && window.setImmediate,
					canMutationObserver = "undefined" != typeof window && window.MutationObserver,
					canPost = "undefined" != typeof window && window.postMessage && window.addEventListener;
				if (canSetImmediate) return function(f) {
					return window.setImmediate(f)
				};
				var queue = [];
				if (canMutationObserver) {
					var hiddenDiv = document.createElement("div"),
						observer = new MutationObserver(function() {
							var queueList = queue.slice();
							queue.length = 0, queueList.forEach(function(fn) {
								fn()
							})
						});
					return observer.observe(hiddenDiv, {
							attributes: !0
						}),
						function(fn) {
							queue.length || hiddenDiv.setAttribute("yes", "no"), queue.push(fn)
						}
				}
				return canPost ? (window.addEventListener("message", function(ev) {
					var source = ev.source;
					if ((source === window || null === source) && "process-tick" === ev.data && (ev.stopPropagation(), queue.length > 0)) {
						var fn = queue.shift();
						fn()
					}
				}, !0), function(fn) {
					queue.push(fn), window.postMessage("process-tick", "*")
				}) : function(fn) {
					setTimeout(fn, 0)
				}
			}(), process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], process.on = noop, process.addListener = noop, process.once = noop, process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, process.emit = noop, process.binding = function() {
				throw new Error("process.binding is not supported")
			}, process.cwd = function() {
				return "/"
			}, process.chdir = function() {
				throw new Error("process.chdir is not supported")
			}
		}, {}],
		3: [function(require, module) {
			function parse(str) {
				for (var res, tokens = [], key = 0, index = 0, path = ""; null != (res = PATH_REGEXP.exec(str));) {
					var m = res[0],
						escaped = res[1],
						offset = res.index;
					if (path += str.slice(index, offset), index = offset + m.length, escaped) path += escaped[1];
					else {
						path && (tokens.push(path), path = "");
						var prefix = res[2],
							name = res[3],
							capture = res[4],
							group = res[5],
							suffix = res[6],
							asterisk = res[7],
							repeat = "+" === suffix || "*" === suffix,
							optional = "?" === suffix || "*" === suffix,
							delimiter = prefix || "/",
							pattern = capture || group || (asterisk ? ".*" : "[^" + delimiter + "]+?");
						tokens.push({
							name: name || key++,
							prefix: prefix || "",
							delimiter: delimiter,
							optional: optional,
							repeat: repeat,
							pattern: escapeGroup(pattern)
						})
					}
				}
				return index < str.length && (path += str.substr(index)), path && tokens.push(path), tokens
			}

			function compile(str) {
				return tokensToFunction(parse(str))
			}

			function tokensToFunction(tokens) {
				for (var matches = new Array(tokens.length), i = 0; i < tokens.length; i++) "object" == typeof tokens[i] && (matches[i] = new RegExp("^" + tokens[i].pattern + "$"));
				return function(obj) {
					for (var path = "", data = obj || {}, i = 0; i < tokens.length; i++) {
						var token = tokens[i];
						if ("string" != typeof token) {
							var segment, value = data[token.name];
							if (null == value) {
								if (token.optional) continue;
								throw new TypeError('Expected "' + token.name + '" to be defined')
							}
							if (isarray(value)) {
								if (!token.repeat) throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"');
								if (0 === value.length) {
									if (token.optional) continue;
									throw new TypeError('Expected "' + token.name + '" to not be empty')
								}
								for (var j = 0; j < value.length; j++) {
									if (segment = encodeURIComponent(value[j]), !matches[i].test(segment)) throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
									path += (0 === j ? token.prefix : token.delimiter) + segment
								}
							} else {
								if (segment = encodeURIComponent(value), !matches[i].test(segment)) throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
								path += token.prefix + segment
							}
						} else path += token
					}
					return path
				}
			}

			function escapeString(str) {
				return str.replace(/([.+*?=^!:${}()[\]|\/])/g, "\\$1")
			}

			function escapeGroup(group) {
				return group.replace(/([=!:$\/()])/g, "\\$1")
			}

			function attachKeys(re, keys) {
				return re.keys = keys, re
			}

			function flags(options) {
				return options.sensitive ? "" : "i"
			}

			function regexpToRegexp(path, keys) {
				var groups = path.source.match(/\((?!\?)/g);
				if (groups)
					for (var i = 0; i < groups.length; i++) keys.push({
						name: i,
						prefix: null,
						delimiter: null,
						optional: !1,
						repeat: !1,
						pattern: null
					});
				return attachKeys(path, keys)
			}

			function arrayToRegexp(path, keys, options) {
				for (var parts = [], i = 0; i < path.length; i++) parts.push(pathToRegexp(path[i], keys, options).source);
				var regexp = new RegExp("(?:" + parts.join("|") + ")", flags(options));
				return attachKeys(regexp, keys)
			}

			function stringToRegexp(path, keys, options) {
				for (var tokens = parse(path), re = tokensToRegExp(tokens, options), i = 0; i < tokens.length; i++) "string" != typeof tokens[i] && keys.push(tokens[i]);
				return attachKeys(re, keys)
			}

			function tokensToRegExp(tokens, options) {
				options = options || {};
				for (var strict = options.strict, end = options.end !== !1, route = "", lastToken = tokens[tokens.length - 1], endsWithSlash = "string" == typeof lastToken && /\/$/.test(lastToken), i = 0; i < tokens.length; i++) {
					var token = tokens[i];
					if ("string" == typeof token) route += escapeString(token);
					else {
						var prefix = escapeString(token.prefix),
							capture = token.pattern;
						token.repeat && (capture += "(?:" + prefix + capture + ")*"), capture = token.optional ? prefix ? "(?:" + prefix + "(" + capture + "))?" : "(" + capture + ")?" : prefix + "(" + capture + ")", route += capture
					}
				}
				return strict || (route = (endsWithSlash ? route.slice(0, -2) : route) + "(?:\\/(?=$))?"), route += end ? "$" : strict && endsWithSlash ? "" : "(?=\\/|$)", new RegExp("^" + route, flags(options))
			}

			function pathToRegexp(path, keys, options) {
				return keys = keys || [], isarray(keys) ? options || (options = {}) : (options = keys, keys = []), path instanceof RegExp ? regexpToRegexp(path, keys, options) : isarray(path) ? arrayToRegexp(path, keys, options) : stringToRegexp(path, keys, options)
			}
			var isarray = require("isarray");
			module.exports = pathToRegexp, module.exports.parse = parse, module.exports.compile = compile, module.exports.tokensToFunction = tokensToFunction, module.exports.tokensToRegExp = tokensToRegExp;
			var PATH_REGEXP = new RegExp(["(\\\\.)", "([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))"].join("|"), "g")
		}, {
			isarray: 4
		}],
		4: [function(require, module) {
			module.exports = Array.isArray || function(arr) {
				return "[object Array]" == Object.prototype.toString.call(arr)
			}
		}, {}]
	}, {}, [1])(1)
}),
function(global, factory) {
	"object" == typeof module && "object" == typeof module.exports ? module.exports = global.document ? factory(global, !0) : function(w) {
		if (!w.document) throw new Error("jQuery requires a window with a document");
		return factory(w)
	} : factory(global)
}("undefined" != typeof window ? window : this, function(window, noGlobal) {
	function isArrayLike(obj) {
		var length = !!obj && "length" in obj && obj.length,
			type = jQuery.type(obj);
		return "function" === type || jQuery.isWindow(obj) ? !1 : "array" === type || 0 === length || "number" == typeof length && length > 0 && length - 1 in obj
	}

	function winnow(elements, qualifier, not) {
		if (jQuery.isFunction(qualifier)) return jQuery.grep(elements, function(elem, i) {
			return !!qualifier.call(elem, i, elem) !== not
		});
		if (qualifier.nodeType) return jQuery.grep(elements, function(elem) {
			return elem === qualifier !== not
		});
		if ("string" == typeof qualifier) {
			if (risSimple.test(qualifier)) return jQuery.filter(qualifier, elements, not);
			qualifier = jQuery.filter(qualifier, elements)
		}
		return jQuery.grep(elements, function(elem) {
			return indexOf.call(qualifier, elem) > -1 !== not
		})
	}

	function sibling(cur, dir) {
		for (;
			(cur = cur[dir]) && 1 !== cur.nodeType;);
		return cur
	}

	function createOptions(options) {
		var object = {};
		return jQuery.each(options.match(rnotwhite) || [], function(_, flag) {
			object[flag] = !0
		}), object
	}

	function completed() {
		document.removeEventListener("DOMContentLoaded", completed), window.removeEventListener("load", completed), jQuery.ready()
	}

	function Data() {
		this.expando = jQuery.expando + Data.uid++
	}

	function dataAttr(elem, key, data) {
		var name;
		if (void 0 === data && 1 === elem.nodeType)
			if (name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase(), data = elem.getAttribute(name), "string" == typeof data) {
				try {
					data = "true" === data ? !0 : "false" === data ? !1 : "null" === data ? null : +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data
				} catch (e) {}
				dataUser.set(elem, key, data)
			} else data = void 0;
		return data
	}

	function adjustCSS(elem, prop, valueParts, tween) {
		var adjusted, scale = 1,
			maxIterations = 20,
			currentValue = tween ? function() {
				return tween.cur()
			} : function() {
				return jQuery.css(elem, prop, "")
			},
			initial = currentValue(),
			unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"),
			initialInUnit = (jQuery.cssNumber[prop] || "px" !== unit && +initial) && rcssNum.exec(jQuery.css(elem, prop));
		if (initialInUnit && initialInUnit[3] !== unit) {
			unit = unit || initialInUnit[3], valueParts = valueParts || [], initialInUnit = +initial || 1;
			do scale = scale || ".5", initialInUnit /= scale, jQuery.style(elem, prop, initialInUnit + unit); while (scale !== (scale = currentValue() / initial) && 1 !== scale && --maxIterations)
		}
		return valueParts && (initialInUnit = +initialInUnit || +initial || 0, adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2], tween && (tween.unit = unit, tween.start = initialInUnit, tween.end = adjusted)), adjusted
	}

	function getAll(context, tag) {
		var ret = "undefined" != typeof context.getElementsByTagName ? context.getElementsByTagName(tag || "*") : "undefined" != typeof context.querySelectorAll ? context.querySelectorAll(tag || "*") : [];
		return void 0 === tag || tag && jQuery.nodeName(context, tag) ? jQuery.merge([context], ret) : ret
	}

	function setGlobalEval(elems, refElements) {
		for (var i = 0, l = elems.length; l > i; i++) dataPriv.set(elems[i], "globalEval", !refElements || dataPriv.get(refElements[i], "globalEval"))
	}

	function buildFragment(elems, context, scripts, selection, ignored) {
		for (var elem, tmp, tag, wrap, contains, j, fragment = context.createDocumentFragment(), nodes = [], i = 0, l = elems.length; l > i; i++)
			if (elem = elems[i], elem || 0 === elem)
				if ("object" === jQuery.type(elem)) jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
				else if (rhtml.test(elem)) {
			for (tmp = tmp || fragment.appendChild(context.createElement("div")), tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase(), wrap = wrapMap[tag] || wrapMap._default, tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2], j = wrap[0]; j--;) tmp = tmp.lastChild;
			jQuery.merge(nodes, tmp.childNodes), tmp = fragment.firstChild, tmp.textContent = ""
		} else nodes.push(context.createTextNode(elem));
		for (fragment.textContent = "", i = 0; elem = nodes[i++];)
			if (selection && jQuery.inArray(elem, selection) > -1) ignored && ignored.push(elem);
			else if (contains = jQuery.contains(elem.ownerDocument, elem), tmp = getAll(fragment.appendChild(elem), "script"), contains && setGlobalEval(tmp), scripts)
			for (j = 0; elem = tmp[j++];) rscriptType.test(elem.type || "") && scripts.push(elem);
		return fragment
	}

	function returnTrue() {
		return !0
	}

	function returnFalse() {
		return !1
	}

	function safeActiveElement() {
		try {
			return document.activeElement
		} catch (err) {}
	}

	function on(elem, types, selector, data, fn, one) {
		var origFn, type;
		if ("object" == typeof types) {
			"string" != typeof selector && (data = data || selector, selector = void 0);
			for (type in types) on(elem, type, selector, data, types[type], one);
			return elem
		}
		if (null == data && null == fn ? (fn = selector, data = selector = void 0) : null == fn && ("string" == typeof selector ? (fn = data, data = void 0) : (fn = data, data = selector, selector = void 0)), fn === !1) fn = returnFalse;
		else if (!fn) return elem;
		return 1 === one && (origFn = fn, fn = function(event) {
			return jQuery().off(event), origFn.apply(this, arguments)
		}, fn.guid = origFn.guid || (origFn.guid = jQuery.guid++)), elem.each(function() {
			jQuery.event.add(this, types, fn, data, selector)
		})
	}

	function manipulationTarget(elem, content) {
		return jQuery.nodeName(elem, "table") && jQuery.nodeName(11 !== content.nodeType ? content : content.firstChild, "tr") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem
	}

	function disableScript(elem) {
		return elem.type = (null !== elem.getAttribute("type")) + "/" + elem.type, elem
	}

	function restoreScript(elem) {
		var match = rscriptTypeMasked.exec(elem.type);
		return match ? elem.type = match[1] : elem.removeAttribute("type"), elem
	}

	function cloneCopyEvent(src, dest) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;
		if (1 === dest.nodeType) {
			if (dataPriv.hasData(src) && (pdataOld = dataPriv.access(src), pdataCur = dataPriv.set(dest, pdataOld), events = pdataOld.events)) {
				delete pdataCur.handle, pdataCur.events = {};
				for (type in events)
					for (i = 0, l = events[type].length; l > i; i++) jQuery.event.add(dest, type, events[type][i])
			}
			dataUser.hasData(src) && (udataOld = dataUser.access(src), udataCur = jQuery.extend({}, udataOld), dataUser.set(dest, udataCur))
		}
	}

	function fixInput(src, dest) {
		var nodeName = dest.nodeName.toLowerCase();
		"input" === nodeName && rcheckableType.test(src.type) ? dest.checked = src.checked : ("input" === nodeName || "textarea" === nodeName) && (dest.defaultValue = src.defaultValue)
	}

	function domManip(collection, args, callback, ignored) {
		args = concat.apply([], args);
		var fragment, first, scripts, hasScripts, node, doc, i = 0,
			l = collection.length,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction(value);
		if (isFunction || l > 1 && "string" == typeof value && !support.checkClone && rchecked.test(value)) return collection.each(function(index) {
			var self = collection.eq(index);
			isFunction && (args[0] = value.call(this, index, self.html())), domManip(self, args, callback, ignored)
		});
		if (l && (fragment = buildFragment(args, collection[0].ownerDocument, !1, collection, ignored), first = fragment.firstChild, 1 === fragment.childNodes.length && (fragment = first), first || ignored)) {
			for (scripts = jQuery.map(getAll(fragment, "script"), disableScript), hasScripts = scripts.length; l > i; i++) node = fragment, i !== iNoClone && (node = jQuery.clone(node, !0, !0), hasScripts && jQuery.merge(scripts, getAll(node, "script"))), callback.call(collection[i], node, i);
			if (hasScripts)
				for (doc = scripts[scripts.length - 1].ownerDocument, jQuery.map(scripts, restoreScript), i = 0; hasScripts > i; i++) node = scripts[i], rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc, node) && (node.src ? jQuery._evalUrl && jQuery._evalUrl(node.src) : jQuery.globalEval(node.textContent.replace(rcleanScript, "")))
		}
		return collection
	}

	function remove(elem, selector, keepData) {
		for (var node, nodes = selector ? jQuery.filter(selector, elem) : elem, i = 0; null != (node = nodes[i]); i++) keepData || 1 !== node.nodeType || jQuery.cleanData(getAll(node)), node.parentNode && (keepData && jQuery.contains(node.ownerDocument, node) && setGlobalEval(getAll(node, "script")), node.parentNode.removeChild(node));
		return elem
	}

	function actualDisplay(name, doc) {
		var elem = jQuery(doc.createElement(name)).appendTo(doc.body),
			display = jQuery.css(elem[0], "display");
		return elem.detach(), display
	}

	function defaultDisplay(nodeName) {
		var doc = document,
			display = elemdisplay[nodeName];
		return display || (display = actualDisplay(nodeName, doc), "none" !== display && display || (iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(doc.documentElement), doc = iframe[0].contentDocument, doc.write(), doc.close(), display = actualDisplay(nodeName, doc), iframe.detach()), elemdisplay[nodeName] = display), display
	}

	function curCSS(elem, name, computed) {
		var width, minWidth, maxWidth, ret, style = elem.style;
		return computed = computed || getStyles(elem), ret = computed ? computed.getPropertyValue(name) || computed[name] : void 0, "" !== ret && void 0 !== ret || jQuery.contains(elem.ownerDocument, elem) || (ret = jQuery.style(elem, name)), computed && !support.pixelMarginRight() && rnumnonpx.test(ret) && rmargin.test(name) && (width = style.width, minWidth = style.minWidth, maxWidth = style.maxWidth, style.minWidth = style.maxWidth = style.width = ret, ret = computed.width, style.width = width, style.minWidth = minWidth, style.maxWidth = maxWidth), void 0 !== ret ? ret + "" : ret
	}

	function addGetHookIf(conditionFn, hookFn) {
		return {
			get: function() {
				return conditionFn() ? void delete this.get : (this.get = hookFn).apply(this, arguments)
			}
		}
	}

	function vendorPropName(name) {
		if (name in emptyStyle) return name;
		for (var capName = name[0].toUpperCase() + name.slice(1), i = cssPrefixes.length; i--;)
			if (name = cssPrefixes[i] + capName, name in emptyStyle) return name
	}

	function setPositiveNumber(elem, value, subtract) {
		var matches = rcssNum.exec(value);
		return matches ? Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px") : value
	}

	function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
		for (var i = extra === (isBorderBox ? "border" : "content") ? 4 : "width" === name ? 1 : 0, val = 0; 4 > i; i += 2) "margin" === extra && (val += jQuery.css(elem, extra + cssExpand[i], !0, styles)), isBorderBox ? ("content" === extra && (val -= jQuery.css(elem, "padding" + cssExpand[i], !0, styles)), "margin" !== extra && (val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles))) : (val += jQuery.css(elem, "padding" + cssExpand[i], !0, styles), "padding" !== extra && (val += jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles)));
		return val
	}

	function getWidthOrHeight(elem, name, extra) {
		var valueIsBorderBox = !0,
			val = "width" === name ? elem.offsetWidth : elem.offsetHeight,
			styles = getStyles(elem),
			isBorderBox = "border-box" === jQuery.css(elem, "boxSizing", !1, styles);
		if (document.msFullscreenElement && window.top !== window && elem.getClientRects().length && (val = Math.round(100 * elem.getBoundingClientRect()[name])), 0 >= val || null == val) {
			if (val = curCSS(elem, name, styles), (0 > val || null == val) && (val = elem.style[name]), rnumnonpx.test(val)) return val;
			valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]), val = parseFloat(val) || 0
		}
		return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles) + "px"
	}

	function showHide(elements, show) {
		for (var display, elem, hidden, values = [], index = 0, length = elements.length; length > index; index++) elem = elements[index], elem.style && (values[index] = dataPriv.get(elem, "olddisplay"), display = elem.style.display, show ? (values[index] || "none" !== display || (elem.style.display = ""), "" === elem.style.display && isHidden(elem) && (values[index] = dataPriv.access(elem, "olddisplay", defaultDisplay(elem.nodeName)))) : (hidden = isHidden(elem), "none" === display && hidden || dataPriv.set(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"))));
		for (index = 0; length > index; index++) elem = elements[index], elem.style && (show && "none" !== elem.style.display && "" !== elem.style.display || (elem.style.display = show ? values[index] || "" : "none"));
		return elements
	}

	function Tween(elem, options, prop, end, easing) {
		return new Tween.prototype.init(elem, options, prop, end, easing)
	}

	function createFxNow() {
		return window.setTimeout(function() {
			fxNow = void 0
		}), fxNow = jQuery.now()
	}

	function genFx(type, includeWidth) {
		var which, i = 0,
			attrs = {
				height: type
			};
		for (includeWidth = includeWidth ? 1 : 0; 4 > i; i += 2 - includeWidth) which = cssExpand[i], attrs["margin" + which] = attrs["padding" + which] = type;
		return includeWidth && (attrs.opacity = attrs.width = type), attrs
	}

	function createTween(value, prop, animation) {
		for (var tween, collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]), index = 0, length = collection.length; length > index; index++)
			if (tween = collection[index].call(animation, prop, value)) return tween
	}

	function defaultPrefilter(elem, props, opts) {
		var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay, anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHidden(elem),
			dataShow = dataPriv.get(elem, "fxshow");
		opts.queue || (hooks = jQuery._queueHooks(elem, "fx"), null == hooks.unqueued && (hooks.unqueued = 0, oldfire = hooks.empty.fire, hooks.empty.fire = function() {
			hooks.unqueued || oldfire()
		}), hooks.unqueued++, anim.always(function() {
			anim.always(function() {
				hooks.unqueued--, jQuery.queue(elem, "fx").length || hooks.empty.fire()
			})
		})), 1 === elem.nodeType && ("height" in props || "width" in props) && (opts.overflow = [style.overflow, style.overflowX, style.overflowY], display = jQuery.css(elem, "display"), checkDisplay = "none" === display ? dataPriv.get(elem, "olddisplay") || defaultDisplay(elem.nodeName) : display, "inline" === checkDisplay && "none" === jQuery.css(elem, "float") && (style.display = "inline-block")), opts.overflow && (style.overflow = "hidden", anim.always(function() {
			style.overflow = opts.overflow[0], style.overflowX = opts.overflow[1], style.overflowY = opts.overflow[2]
		}));
		for (prop in props)
			if (value = props[prop], rfxtypes.exec(value)) {
				if (delete props[prop], toggle = toggle || "toggle" === value, value === (hidden ? "hide" : "show")) {
					if ("show" !== value || !dataShow || void 0 === dataShow[prop]) continue;
					hidden = !0
				}
				orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop)
			} else display = void 0;
		if (jQuery.isEmptyObject(orig)) "inline" === ("none" === display ? defaultDisplay(elem.nodeName) : display) && (style.display = display);
		else {
			dataShow ? "hidden" in dataShow && (hidden = dataShow.hidden) : dataShow = dataPriv.access(elem, "fxshow", {}), toggle && (dataShow.hidden = !hidden), hidden ? jQuery(elem).show() : anim.done(function() {
				jQuery(elem).hide()
			}), anim.done(function() {
				var prop;
				dataPriv.remove(elem, "fxshow");
				for (prop in orig) jQuery.style(elem, prop, orig[prop])
			});
			for (prop in orig) tween = createTween(hidden ? dataShow[prop] : 0, prop, anim), prop in dataShow || (dataShow[prop] = tween.start, hidden && (tween.end = tween.start, tween.start = "width" === prop || "height" === prop ? 1 : 0))
		}
	}

	function propFilter(props, specialEasing) {
		var index, name, easing, value, hooks;
		for (index in props)
			if (name = jQuery.camelCase(index), easing = specialEasing[name], value = props[index], jQuery.isArray(value) && (easing = value[1], value = props[index] = value[0]), index !== name && (props[name] = value, delete props[index]), hooks = jQuery.cssHooks[name], hooks && "expand" in hooks) {
				value = hooks.expand(value), delete props[name];
				for (index in value) index in props || (props[index] = value[index], specialEasing[index] = easing)
			} else specialEasing[name] = easing
	}

	function Animation(elem, properties, options) {
		var result, stopped, index = 0,
			length = Animation.prefilters.length,
			deferred = jQuery.Deferred().always(function() {
				delete tick.elem
			}),
			tick = function() {
				if (stopped) return !1;
				for (var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), temp = remaining / animation.duration || 0, percent = 1 - temp, index = 0, length = animation.tweens.length; length > index; index++) animation.tweens[index].run(percent);
				return deferred.notifyWith(elem, [animation, percent, remaining]), 1 > percent && length ? remaining : (deferred.resolveWith(elem, [animation]), !1)
			},
			animation = deferred.promise({
				elem: elem,
				props: jQuery.extend({}, properties),
				opts: jQuery.extend(!0, {
					specialEasing: {},
					easing: jQuery.easing._default
				}, options),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function(prop, end) {
					var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
					return animation.tweens.push(tween), tween
				},
				stop: function(gotoEnd) {
					var index = 0,
						length = gotoEnd ? animation.tweens.length : 0;
					if (stopped) return this;
					for (stopped = !0; length > index; index++) animation.tweens[index].run(1);
					return gotoEnd ? (deferred.notifyWith(elem, [animation, 1, 0]), deferred.resolveWith(elem, [animation, gotoEnd])) : deferred.rejectWith(elem, [animation, gotoEnd]), this
				}
			}),
			props = animation.props;
		for (propFilter(props, animation.opts.specialEasing); length > index; index++)
			if (result = Animation.prefilters[index].call(animation, elem, props, animation.opts)) return jQuery.isFunction(result.stop) && (jQuery._queueHooks(animation.elem, animation.opts.queue).stop = jQuery.proxy(result.stop, result)), result;
		return jQuery.map(props, createTween, animation), jQuery.isFunction(animation.opts.start) && animation.opts.start.call(elem, animation), jQuery.fx.timer(jQuery.extend(tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})), animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always)
	}

	function getClass(elem) {
		return elem.getAttribute && elem.getAttribute("class") || ""
	}

	function addToPrefiltersOrTransports(structure) {
		return function(dataTypeExpression, func) {
			"string" != typeof dataTypeExpression && (func = dataTypeExpression, dataTypeExpression = "*");
			var dataType, i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match(rnotwhite) || [];
			if (jQuery.isFunction(func))
				for (; dataType = dataTypes[i++];) "+" === dataType[0] ? (dataType = dataType.slice(1) || "*", (structure[dataType] = structure[dataType] || []).unshift(func)) : (structure[dataType] = structure[dataType] || []).push(func)
		}
	}

	function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
		function inspect(dataType) {
			var selected;
			return inspected[dataType] = !0, jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
				var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
				return "string" != typeof dataTypeOrTransport || seekingTransport || inspected[dataTypeOrTransport] ? seekingTransport ? !(selected = dataTypeOrTransport) : void 0 : (options.dataTypes.unshift(dataTypeOrTransport), inspect(dataTypeOrTransport), !1)
			}), selected
		}
		var inspected = {},
			seekingTransport = structure === transports;
		return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*")
	}

	function ajaxExtend(target, src) {
		var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
		for (key in src) void 0 !== src[key] && ((flatOptions[key] ? target : deep || (deep = {}))[key] = src[key]);
		return deep && jQuery.extend(!0, target, deep), target
	}

	function ajaxHandleResponses(s, jqXHR, responses) {
		for (var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes;
			"*" === dataTypes[0];) dataTypes.shift(), void 0 === ct && (ct = s.mimeType || jqXHR.getResponseHeader("Content-Type"));
		if (ct)
			for (type in contents)
				if (contents[type] && contents[type].test(ct)) {
					dataTypes.unshift(type);
					break
				}
		if (dataTypes[0] in responses) finalDataType = dataTypes[0];
		else {
			for (type in responses) {
				if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
					finalDataType = type;
					break
				}
				firstDataType || (firstDataType = type)
			}
			finalDataType = finalDataType || firstDataType
		}
		return finalDataType ? (finalDataType !== dataTypes[0] && dataTypes.unshift(finalDataType), responses[finalDataType]) : void 0
	}

	function ajaxConvert(s, response, jqXHR, isSuccess) {
		var conv2, current, conv, tmp, prev, converters = {},
			dataTypes = s.dataTypes.slice();
		if (dataTypes[1])
			for (conv in s.converters) converters[conv.toLowerCase()] = s.converters[conv];
		for (current = dataTypes.shift(); current;)
			if (s.responseFields[current] && (jqXHR[s.responseFields[current]] = response), !prev && isSuccess && s.dataFilter && (response = s.dataFilter(response, s.dataType)), prev = current, current = dataTypes.shift())
				if ("*" === current) current = prev;
				else if ("*" !== prev && prev !== current) {
			if (conv = converters[prev + " " + current] || converters["* " + current], !conv)
				for (conv2 in converters)
					if (tmp = conv2.split(" "), tmp[1] === current && (conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]])) {
						conv === !0 ? conv = converters[conv2] : converters[conv2] !== !0 && (current = tmp[0], dataTypes.unshift(tmp[1]));
						break
					}
			if (conv !== !0)
				if (conv && s["throws"]) response = conv(response);
				else try {
					response = conv(response)
				} catch (e) {
					return {
						state: "parsererror",
						error: conv ? e : "No conversion from " + prev + " to " + current
					}
				}
		}
		return {
			state: "success",
			data: response
		}
	}

	function buildParams(prefix, obj, traditional, add) {
		var name;
		if (jQuery.isArray(obj)) jQuery.each(obj, function(i, v) {
			traditional || rbracket.test(prefix) ? add(prefix, v) : buildParams(prefix + "[" + ("object" == typeof v && null != v ? i : "") + "]", v, traditional, add)
		});
		else if (traditional || "object" !== jQuery.type(obj)) add(prefix, obj);
		else
			for (name in obj) buildParams(prefix + "[" + name + "]", obj[name], traditional, add)
	}

	function getWindow(elem) {
		return jQuery.isWindow(elem) ? elem : 9 === elem.nodeType && elem.defaultView
	}
	var arr = [],
		document = window.document,
		slice = arr.slice,
		concat = arr.concat,
		push = arr.push,
		indexOf = arr.indexOf,
		class2type = {},
		toString = class2type.toString,
		hasOwn = class2type.hasOwnProperty,
		support = {},
		version = "2.2.3",
		jQuery = function(selector, context) {
			return new jQuery.fn.init(selector, context)
		},
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([\da-z])/gi,
		fcamelCase = function(all, letter) {
			return letter.toUpperCase()
		};
	jQuery.fn = jQuery.prototype = {
		jquery: version,
		constructor: jQuery,
		selector: "",
		length: 0,
		toArray: function() {
			return slice.call(this)
		},
		get: function(num) {
			return null != num ? 0 > num ? this[num + this.length] : this[num] : slice.call(this)
		},
		pushStack: function(elems) {
			var ret = jQuery.merge(this.constructor(), elems);
			return ret.prevObject = this, ret.context = this.context, ret
		},
		each: function(callback) {
			return jQuery.each(this, callback)
		},
		map: function(callback) {
			return this.pushStack(jQuery.map(this, function(elem, i) {
				return callback.call(elem, i, elem)
			}))
		},
		slice: function() {
			return this.pushStack(slice.apply(this, arguments))
		},
		first: function() {
			return this.eq(0)
		},
		last: function() {
			return this.eq(-1)
		},
		eq: function(i) {
			var len = this.length,
				j = +i + (0 > i ? len : 0);
			return this.pushStack(j >= 0 && len > j ? [this[j]] : [])
		},
		end: function() {
			return this.prevObject || this.constructor()
		},
		push: push,
		sort: arr.sort,
		splice: arr.splice
	}, jQuery.extend = jQuery.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = !1;
		for ("boolean" == typeof target && (deep = target, target = arguments[i] || {}, i++), "object" == typeof target || jQuery.isFunction(target) || (target = {}), i === length && (target = this, i--); length > i; i++)
			if (null != (options = arguments[i]))
				for (name in options) src = target[name], copy = options[name], target !== copy && (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy))) ? (copyIsArray ? (copyIsArray = !1, clone = src && jQuery.isArray(src) ? src : []) : clone = src && jQuery.isPlainObject(src) ? src : {}, target[name] = jQuery.extend(deep, clone, copy)) : void 0 !== copy && (target[name] = copy));
		return target
	}, jQuery.extend({
		expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
		isReady: !0,
		error: function(msg) {
			throw new Error(msg)
		},
		noop: function() {},
		isFunction: function(obj) {
			return "function" === jQuery.type(obj)
		},
		isArray: Array.isArray,
		isWindow: function(obj) {
			return null != obj && obj === obj.window
		},
		isNumeric: function(obj) {
			var realStringObj = obj && obj.toString();
			return !jQuery.isArray(obj) && realStringObj - parseFloat(realStringObj) + 1 >= 0
		},
		isPlainObject: function(obj) {
			var key;
			if ("object" !== jQuery.type(obj) || obj.nodeType || jQuery.isWindow(obj)) return !1;
			if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype || {}, "isPrototypeOf")) return !1;
			for (key in obj);
			return void 0 === key || hasOwn.call(obj, key)
		},
		isEmptyObject: function(obj) {
			var name;
			for (name in obj) return !1;
			return !0
		},
		type: function(obj) {
			return null == obj ? obj + "" : "object" == typeof obj || "function" == typeof obj ? class2type[toString.call(obj)] || "object" : typeof obj
		},
		globalEval: function(code) {
			var script, indirect = eval;
			code = jQuery.trim(code), code && (1 === code.indexOf("use strict") ? (script = document.createElement("script"), script.text = code, document.head.appendChild(script).parentNode.removeChild(script)) : indirect(code))
		},
		camelCase: function(string) {
			return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase)
		},
		nodeName: function(elem, name) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase()
		},
		each: function(obj, callback) {
			var length, i = 0;
			if (isArrayLike(obj))
				for (length = obj.length; length > i && callback.call(obj[i], i, obj[i]) !== !1; i++);
			else
				for (i in obj)
					if (callback.call(obj[i], i, obj[i]) === !1) break; return obj
		},
		trim: function(text) {
			return null == text ? "" : (text + "").replace(rtrim, "")
		},
		makeArray: function(arr, results) {
			var ret = results || [];
			return null != arr && (isArrayLike(Object(arr)) ? jQuery.merge(ret, "string" == typeof arr ? [arr] : arr) : push.call(ret, arr)), ret
		},
		inArray: function(elem, arr, i) {
			return null == arr ? -1 : indexOf.call(arr, elem, i)
		},
		merge: function(first, second) {
			for (var len = +second.length, j = 0, i = first.length; len > j; j++) first[i++] = second[j];
			return first.length = i, first
		},
		grep: function(elems, callback, invert) {
			for (var callbackInverse, matches = [], i = 0, length = elems.length, callbackExpect = !invert; length > i; i++) callbackInverse = !callback(elems[i], i), callbackInverse !== callbackExpect && matches.push(elems[i]);
			return matches
		},
		map: function(elems, callback, arg) {
			var length, value, i = 0,
				ret = [];
			if (isArrayLike(elems))
				for (length = elems.length; length > i; i++) value = callback(elems[i], i, arg), null != value && ret.push(value);
			else
				for (i in elems) value = callback(elems[i], i, arg), null != value && ret.push(value);
			return concat.apply([], ret)
		},
		guid: 1,
		proxy: function(fn, context) {
			var tmp, args, proxy;
			return "string" == typeof context && (tmp = fn[context], context = fn, fn = tmp), jQuery.isFunction(fn) ? (args = slice.call(arguments, 2), proxy = function() {
				return fn.apply(context || this, args.concat(slice.call(arguments)))
			}, proxy.guid = fn.guid = fn.guid || jQuery.guid++, proxy) : void 0
		},
		now: Date.now,
		support: support
	}), "function" == typeof Symbol && (jQuery.fn[Symbol.iterator] = arr[Symbol.iterator]), jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase()
	});
	var Sizzle = function(window) {
		function Sizzle(selector, context, results, seed) {
			var m, i, elem, nid, nidselect, match, groups, newSelector, newContext = context && context.ownerDocument,
				nodeType = context ? context.nodeType : 9;
			if (results = results || [], "string" != typeof selector || !selector || 1 !== nodeType && 9 !== nodeType && 11 !== nodeType) return results;
			if (!seed && ((context ? context.ownerDocument || context : preferredDoc) !== document && setDocument(context), context = context || document, documentIsHTML)) {
				if (11 !== nodeType && (match = rquickExpr.exec(selector)))
					if (m = match[1]) {
						if (9 === nodeType) {
							if (!(elem = context.getElementById(m))) return results;
							if (elem.id === m) return results.push(elem), results
						} else if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) return results.push(elem), results
					} else {
						if (match[2]) return push.apply(results, context.getElementsByTagName(selector)), results;
						if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) return push.apply(results, context.getElementsByClassName(m)), results
					}
				if (!(!support.qsa || compilerCache[selector + " "] || rbuggyQSA && rbuggyQSA.test(selector))) {
					if (1 !== nodeType) newContext = context, newSelector = selector;
					else if ("object" !== context.nodeName.toLowerCase()) {
						for ((nid = context.getAttribute("id")) ? nid = nid.replace(rescape, "\\$&") : context.setAttribute("id", nid = expando), groups = tokenize(selector), i = groups.length, nidselect = ridentifier.test(nid) ? "#" + nid : "[id='" + nid + "']"; i--;) groups[i] = nidselect + " " + toSelector(groups[i]);
						newSelector = groups.join(","), newContext = rsibling.test(selector) && testContext(context.parentNode) || context
					}
					if (newSelector) try {
						return push.apply(results, newContext.querySelectorAll(newSelector)), results
					} catch (qsaError) {} finally {
						nid === expando && context.removeAttribute("id")
					}
				}
			}
			return select(selector.replace(rtrim, "$1"), context, results, seed)
		}

		function createCache() {
			function cache(key, value) {
				return keys.push(key + " ") > Expr.cacheLength && delete cache[keys.shift()], cache[key + " "] = value
			}
			var keys = [];
			return cache
		}

		function markFunction(fn) {
			return fn[expando] = !0, fn
		}

		function assert(fn) {
			var div = document.createElement("div");
			try {
				return !!fn(div)
			} catch (e) {
				return !1
			} finally {
				div.parentNode && div.parentNode.removeChild(div), div = null
			}
		}

		function addHandle(attrs, handler) {
			for (var arr = attrs.split("|"), i = arr.length; i--;) Expr.attrHandle[arr[i]] = handler
		}

		function siblingCheck(a, b) {
			var cur = b && a,
				diff = cur && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE);
			if (diff) return diff;
			if (cur)
				for (; cur = cur.nextSibling;)
					if (cur === b) return -1;
			return a ? 1 : -1;
		}

		function createInputPseudo(type) {
			return function(elem) {
				var name = elem.nodeName.toLowerCase();
				return "input" === name && elem.type === type
			}
		}

		function createButtonPseudo(type) {
			return function(elem) {
				var name = elem.nodeName.toLowerCase();
				return ("input" === name || "button" === name) && elem.type === type
			}
		}

		function createPositionalPseudo(fn) {
			return markFunction(function(argument) {
				return argument = +argument, markFunction(function(seed, matches) {
					for (var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length; i--;) seed[j = matchIndexes[i]] && (seed[j] = !(matches[j] = seed[j]))
				})
			})
		}

		function testContext(context) {
			return context && "undefined" != typeof context.getElementsByTagName && context
		}

		function setFilters() {}

		function toSelector(tokens) {
			for (var i = 0, len = tokens.length, selector = ""; len > i; i++) selector += tokens[i].value;
			return selector
		}

		function addCombinator(matcher, combinator, base) {
			var dir = combinator.dir,
				checkNonElements = base && "parentNode" === dir,
				doneName = done++;
			return combinator.first ? function(elem, context, xml) {
				for (; elem = elem[dir];)
					if (1 === elem.nodeType || checkNonElements) return matcher(elem, context, xml)
			} : function(elem, context, xml) {
				var oldCache, uniqueCache, outerCache, newCache = [dirruns, doneName];
				if (xml) {
					for (; elem = elem[dir];)
						if ((1 === elem.nodeType || checkNonElements) && matcher(elem, context, xml)) return !0
				} else
					for (; elem = elem[dir];)
						if (1 === elem.nodeType || checkNonElements) {
							if (outerCache = elem[expando] || (elem[expando] = {}), uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {}), (oldCache = uniqueCache[dir]) && oldCache[0] === dirruns && oldCache[1] === doneName) return newCache[2] = oldCache[2];
							if (uniqueCache[dir] = newCache, newCache[2] = matcher(elem, context, xml)) return !0
						}
			}
		}

		function elementMatcher(matchers) {
			return matchers.length > 1 ? function(elem, context, xml) {
				for (var i = matchers.length; i--;)
					if (!matchers[i](elem, context, xml)) return !1;
				return !0
			} : matchers[0]
		}

		function multipleContexts(selector, contexts, results) {
			for (var i = 0, len = contexts.length; len > i; i++) Sizzle(selector, contexts[i], results);
			return results
		}

		function condense(unmatched, map, filter, context, xml) {
			for (var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = null != map; len > i; i++)(elem = unmatched[i]) && (!filter || filter(elem, context, xml)) && (newUnmatched.push(elem), mapped && map.push(i));
			return newUnmatched
		}

		function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
			return postFilter && !postFilter[expando] && (postFilter = setMatcher(postFilter)), postFinder && !postFinder[expando] && (postFinder = setMatcher(postFinder, postSelector)), markFunction(function(seed, results, context, xml) {
				var temp, i, elem, preMap = [],
					postMap = [],
					preexisting = results.length,
					elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),
					matcherIn = !preFilter || !seed && selector ? elems : condense(elems, preMap, preFilter, context, xml),
					matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
				if (matcher && matcher(matcherIn, matcherOut, context, xml), postFilter)
					for (temp = condense(matcherOut, postMap), postFilter(temp, [], context, xml), i = temp.length; i--;)(elem = temp[i]) && (matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem));
				if (seed) {
					if (postFinder || preFilter) {
						if (postFinder) {
							for (temp = [], i = matcherOut.length; i--;)(elem = matcherOut[i]) && temp.push(matcherIn[i] = elem);
							postFinder(null, matcherOut = [], temp, xml)
						}
						for (i = matcherOut.length; i--;)(elem = matcherOut[i]) && (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1 && (seed[temp] = !(results[temp] = elem))
					}
				} else matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut), postFinder ? postFinder(null, results, matcherOut, xml) : push.apply(results, matcherOut)
			})
		}

		function matcherFromTokens(tokens) {
			for (var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
					return elem === checkContext
				}, implicitRelative, !0), matchAnyContext = addCombinator(function(elem) {
					return indexOf(checkContext, elem) > -1
				}, implicitRelative, !0), matchers = [function(elem, context, xml) {
					var ret = !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
					return checkContext = null, ret
				}]; len > i; i++)
				if (matcher = Expr.relative[tokens[i].type]) matchers = [addCombinator(elementMatcher(matchers), matcher)];
				else {
					if (matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches), matcher[expando]) {
						for (j = ++i; len > j && !Expr.relative[tokens[j].type]; j++);
						return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({
							value: " " === tokens[i - 2].type ? "*" : ""
						})).replace(rtrim, "$1"), matcher, j > i && matcherFromTokens(tokens.slice(i, j)), len > j && matcherFromTokens(tokens = tokens.slice(j)), len > j && toSelector(tokens))
					}
					matchers.push(matcher)
				}
			return elementMatcher(matchers)
		}

		function matcherFromGroupMatchers(elementMatchers, setMatchers) {
			var bySet = setMatchers.length > 0,
				byElement = elementMatchers.length > 0,
				superMatcher = function(seed, context, xml, results, outermost) {
					var elem, j, matcher, matchedCount = 0,
						i = "0",
						unmatched = seed && [],
						setMatched = [],
						contextBackup = outermostContext,
						elems = seed || byElement && Expr.find.TAG("*", outermost),
						dirrunsUnique = dirruns += null == contextBackup ? 1 : Math.random() || .1,
						len = elems.length;
					for (outermost && (outermostContext = context === document || context || outermost); i !== len && null != (elem = elems[i]); i++) {
						if (byElement && elem) {
							for (j = 0, context || elem.ownerDocument === document || (setDocument(elem), xml = !documentIsHTML); matcher = elementMatchers[j++];)
								if (matcher(elem, context || document, xml)) {
									results.push(elem);
									break
								}
							outermost && (dirruns = dirrunsUnique)
						}
						bySet && ((elem = !matcher && elem) && matchedCount--, seed && unmatched.push(elem))
					}
					if (matchedCount += i, bySet && i !== matchedCount) {
						for (j = 0; matcher = setMatchers[j++];) matcher(unmatched, setMatched, context, xml);
						if (seed) {
							if (matchedCount > 0)
								for (; i--;) unmatched[i] || setMatched[i] || (setMatched[i] = pop.call(results));
							setMatched = condense(setMatched)
						}
						push.apply(results, setMatched), outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1 && Sizzle.uniqueSort(results)
					}
					return outermost && (dirruns = dirrunsUnique, outermostContext = contextBackup), unmatched
				};
			return bySet ? markFunction(superMatcher) : superMatcher
		}
		var i, support, Expr, getText, isXML, tokenize, compile, select, outermostContext, sortInput, hasDuplicate, setDocument, document, docElem, documentIsHTML, rbuggyQSA, rbuggyMatches, matches, contains, expando = "sizzle" + 1 * new Date,
			preferredDoc = window.document,
			dirruns = 0,
			done = 0,
			classCache = createCache(),
			tokenCache = createCache(),
			compilerCache = createCache(),
			sortOrder = function(a, b) {
				return a === b && (hasDuplicate = !0), 0
			},
			MAX_NEGATIVE = 1 << 31,
			hasOwn = {}.hasOwnProperty,
			arr = [],
			pop = arr.pop,
			push_native = arr.push,
			push = arr.push,
			slice = arr.slice,
			indexOf = function(list, elem) {
				for (var i = 0, len = list.length; len > i; i++)
					if (list[i] === elem) return i;
				return -1
			},
			booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
			whitespace = "[\\x20\\t\\r\\n\\f]",
			identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
			attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + "*([*^$|!~]?=)" + whitespace + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]",
			pseudos = ":(" + identifier + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|.*)\\)|)",
			rwhitespace = new RegExp(whitespace + "+", "g"),
			rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
			rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
			rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),
			rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),
			rpseudo = new RegExp(pseudos),
			ridentifier = new RegExp("^" + identifier + "$"),
			matchExpr = {
				ID: new RegExp("^#(" + identifier + ")"),
				CLASS: new RegExp("^\\.(" + identifier + ")"),
				TAG: new RegExp("^(" + identifier + "|[*])"),
				ATTR: new RegExp("^" + attributes),
				PSEUDO: new RegExp("^" + pseudos),
				CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
				bool: new RegExp("^(?:" + booleans + ")$", "i"),
				needsContext: new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
			},
			rinputs = /^(?:input|select|textarea|button)$/i,
			rheader = /^h\d$/i,
			rnative = /^[^{]+\{\s*\[native \w/,
			rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
			rsibling = /[+~]/,
			rescape = /'|\\/g,
			runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
			funescape = function(_, escaped, escapedWhitespace) {
				var high = "0x" + escaped - 65536;
				return high !== high || escapedWhitespace ? escaped : 0 > high ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, 1023 & high | 56320)
			},
			unloadHandler = function() {
				setDocument()
			};
		try {
			push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes), arr[preferredDoc.childNodes.length].nodeType
		} catch (e) {
			push = {
				apply: arr.length ? function(target, els) {
					push_native.apply(target, slice.call(els))
				} : function(target, els) {
					for (var j = target.length, i = 0; target[j++] = els[i++];);
					target.length = j - 1
				}
			}
		}
		support = Sizzle.support = {}, isXML = Sizzle.isXML = function(elem) {
			var documentElement = elem && (elem.ownerDocument || elem).documentElement;
			return documentElement ? "HTML" !== documentElement.nodeName : !1
		}, setDocument = Sizzle.setDocument = function(node) {
			var hasCompare, parent, doc = node ? node.ownerDocument || node : preferredDoc;
			return doc !== document && 9 === doc.nodeType && doc.documentElement ? (document = doc, docElem = document.documentElement, documentIsHTML = !isXML(document), (parent = document.defaultView) && parent.top !== parent && (parent.addEventListener ? parent.addEventListener("unload", unloadHandler, !1) : parent.attachEvent && parent.attachEvent("onunload", unloadHandler)), support.attributes = assert(function(div) {
				return div.className = "i", !div.getAttribute("className")
			}), support.getElementsByTagName = assert(function(div) {
				return div.appendChild(document.createComment("")), !div.getElementsByTagName("*").length
			}), support.getElementsByClassName = rnative.test(document.getElementsByClassName), support.getById = assert(function(div) {
				return docElem.appendChild(div).id = expando, !document.getElementsByName || !document.getElementsByName(expando).length
			}), support.getById ? (Expr.find.ID = function(id, context) {
				if ("undefined" != typeof context.getElementById && documentIsHTML) {
					var m = context.getElementById(id);
					return m ? [m] : []
				}
			}, Expr.filter.ID = function(id) {
				var attrId = id.replace(runescape, funescape);
				return function(elem) {
					return elem.getAttribute("id") === attrId
				}
			}) : (delete Expr.find.ID, Expr.filter.ID = function(id) {
				var attrId = id.replace(runescape, funescape);
				return function(elem) {
					var node = "undefined" != typeof elem.getAttributeNode && elem.getAttributeNode("id");
					return node && node.value === attrId
				}
			}), Expr.find.TAG = support.getElementsByTagName ? function(tag, context) {
				return "undefined" != typeof context.getElementsByTagName ? context.getElementsByTagName(tag) : support.qsa ? context.querySelectorAll(tag) : void 0
			} : function(tag, context) {
				var elem, tmp = [],
					i = 0,
					results = context.getElementsByTagName(tag);
				if ("*" === tag) {
					for (; elem = results[i++];) 1 === elem.nodeType && tmp.push(elem);
					return tmp
				}
				return results
			}, Expr.find.CLASS = support.getElementsByClassName && function(className, context) {
				return "undefined" != typeof context.getElementsByClassName && documentIsHTML ? context.getElementsByClassName(className) : void 0
			}, rbuggyMatches = [], rbuggyQSA = [], (support.qsa = rnative.test(document.querySelectorAll)) && (assert(function(div) {
				docElem.appendChild(div).innerHTML = "<a id='" + expando + "'></a><select id='" + expando + "-\r\\' msallowcapture=''><option selected=''></option></select>", div.querySelectorAll("[msallowcapture^='']").length && rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")"), div.querySelectorAll("[selected]").length || rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")"), div.querySelectorAll("[id~=" + expando + "-]").length || rbuggyQSA.push("~="), div.querySelectorAll(":checked").length || rbuggyQSA.push(":checked"), div.querySelectorAll("a#" + expando + "+*").length || rbuggyQSA.push(".#.+[+~]")
			}), assert(function(div) {
				var input = document.createElement("input");
				input.setAttribute("type", "hidden"), div.appendChild(input).setAttribute("name", "D"), div.querySelectorAll("[name=d]").length && rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?="), div.querySelectorAll(":enabled").length || rbuggyQSA.push(":enabled", ":disabled"), div.querySelectorAll("*,:x"), rbuggyQSA.push(",.*:")
			})), (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) && assert(function(div) {
				support.disconnectedMatch = matches.call(div, "div"), matches.call(div, "[s!='']:x"), rbuggyMatches.push("!=", pseudos)
			}), rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|")), rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|")), hasCompare = rnative.test(docElem.compareDocumentPosition), contains = hasCompare || rnative.test(docElem.contains) ? function(a, b) {
				var adown = 9 === a.nodeType ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !(!bup || 1 !== bup.nodeType || !(adown.contains ? adown.contains(bup) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(bup)))
			} : function(a, b) {
				if (b)
					for (; b = b.parentNode;)
						if (b === a) return !0;
				return !1
			}, sortOrder = hasCompare ? function(a, b) {
				if (a === b) return hasDuplicate = !0, 0;
				var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
				return compare ? compare : (compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & compare || !support.sortDetached && b.compareDocumentPosition(a) === compare ? a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ? -1 : b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ? 1 : sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0 : 4 & compare ? -1 : 1)
			} : function(a, b) {
				if (a === b) return hasDuplicate = !0, 0;
				var cur, i = 0,
					aup = a.parentNode,
					bup = b.parentNode,
					ap = [a],
					bp = [b];
				if (!aup || !bup) return a === document ? -1 : b === document ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;
				if (aup === bup) return siblingCheck(a, b);
				for (cur = a; cur = cur.parentNode;) ap.unshift(cur);
				for (cur = b; cur = cur.parentNode;) bp.unshift(cur);
				for (; ap[i] === bp[i];) i++;
				return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0
			}, document) : document
		}, Sizzle.matches = function(expr, elements) {
			return Sizzle(expr, null, null, elements)
		}, Sizzle.matchesSelector = function(elem, expr) {
			if ((elem.ownerDocument || elem) !== document && setDocument(elem), expr = expr.replace(rattributeQuotes, "='$1']"), !(!support.matchesSelector || !documentIsHTML || compilerCache[expr + " "] || rbuggyMatches && rbuggyMatches.test(expr) || rbuggyQSA && rbuggyQSA.test(expr))) try {
				var ret = matches.call(elem, expr);
				if (ret || support.disconnectedMatch || elem.document && 11 !== elem.document.nodeType) return ret
			} catch (e) {}
			return Sizzle(expr, document, null, [elem]).length > 0
		}, Sizzle.contains = function(context, elem) {
			return (context.ownerDocument || context) !== document && setDocument(context), contains(context, elem)
		}, Sizzle.attr = function(elem, name) {
			(elem.ownerDocument || elem) !== document && setDocument(elem);
			var fn = Expr.attrHandle[name.toLowerCase()],
				val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0;
			return void 0 !== val ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null
		}, Sizzle.error = function(msg) {
			throw new Error("Syntax error, unrecognized expression: " + msg)
		}, Sizzle.uniqueSort = function(results) {
			var elem, duplicates = [],
				j = 0,
				i = 0;
			if (hasDuplicate = !support.detectDuplicates, sortInput = !support.sortStable && results.slice(0), results.sort(sortOrder), hasDuplicate) {
				for (; elem = results[i++];) elem === results[i] && (j = duplicates.push(i));
				for (; j--;) results.splice(duplicates[j], 1)
			}
			return sortInput = null, results
		}, getText = Sizzle.getText = function(elem) {
			var node, ret = "",
				i = 0,
				nodeType = elem.nodeType;
			if (nodeType) {
				if (1 === nodeType || 9 === nodeType || 11 === nodeType) {
					if ("string" == typeof elem.textContent) return elem.textContent;
					for (elem = elem.firstChild; elem; elem = elem.nextSibling) ret += getText(elem)
				} else if (3 === nodeType || 4 === nodeType) return elem.nodeValue
			} else
				for (; node = elem[i++];) ret += getText(node);
			return ret
		}, Expr = Sizzle.selectors = {
			cacheLength: 50,
			createPseudo: markFunction,
			match: matchExpr,
			attrHandle: {},
			find: {},
			relative: {
				">": {
					dir: "parentNode",
					first: !0
				},
				" ": {
					dir: "parentNode"
				},
				"+": {
					dir: "previousSibling",
					first: !0
				},
				"~": {
					dir: "previousSibling"
				}
			},
			preFilter: {
				ATTR: function(match) {
					return match[1] = match[1].replace(runescape, funescape), match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape), "~=" === match[2] && (match[3] = " " + match[3] + " "), match.slice(0, 4)
				},
				CHILD: function(match) {
					return match[1] = match[1].toLowerCase(), "nth" === match[1].slice(0, 3) ? (match[3] || Sizzle.error(match[0]), match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * ("even" === match[3] || "odd" === match[3])), match[5] = +(match[7] + match[8] || "odd" === match[3])) : match[3] && Sizzle.error(match[0]), match
				},
				PSEUDO: function(match) {
					var excess, unquoted = !match[6] && match[2];
					return matchExpr.CHILD.test(match[0]) ? null : (match[3] ? match[2] = match[4] || match[5] || "" : unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, !0)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length) && (match[0] = match[0].slice(0, excess), match[2] = unquoted.slice(0, excess)), match.slice(0, 3))
				}
			},
			filter: {
				TAG: function(nodeNameSelector) {
					var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
					return "*" === nodeNameSelector ? function() {
						return !0
					} : function(elem) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName
					}
				},
				CLASS: function(className) {
					var pattern = classCache[className + " "];
					return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
						return pattern.test("string" == typeof elem.className && elem.className || "undefined" != typeof elem.getAttribute && elem.getAttribute("class") || "")
					})
				},
				ATTR: function(name, operator, check) {
					return function(elem) {
						var result = Sizzle.attr(elem, name);
						return null == result ? "!=" === operator : operator ? (result += "", "=" === operator ? result === check : "!=" === operator ? result !== check : "^=" === operator ? check && 0 === result.indexOf(check) : "*=" === operator ? check && result.indexOf(check) > -1 : "$=" === operator ? check && result.slice(-check.length) === check : "~=" === operator ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 : "|=" === operator ? result === check || result.slice(0, check.length + 1) === check + "-" : !1) : !0
					}
				},
				CHILD: function(type, what, argument, first, last) {
					var simple = "nth" !== type.slice(0, 3),
						forward = "last" !== type.slice(-4),
						ofType = "of-type" === what;
					return 1 === first && 0 === last ? function(elem) {
						return !!elem.parentNode
					} : function(elem, context, xml) {
						var cache, uniqueCache, outerCache, node, nodeIndex, start, dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType,
							diff = !1;
						if (parent) {
							if (simple) {
								for (; dir;) {
									for (node = elem; node = node[dir];)
										if (ofType ? node.nodeName.toLowerCase() === name : 1 === node.nodeType) return !1;
									start = dir = "only" === type && !start && "nextSibling"
								}
								return !0
							}
							if (start = [forward ? parent.firstChild : parent.lastChild], forward && useCache) {
								for (node = parent, outerCache = node[expando] || (node[expando] = {}), uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {}), cache = uniqueCache[type] || [], nodeIndex = cache[0] === dirruns && cache[1], diff = nodeIndex && cache[2], node = nodeIndex && parent.childNodes[nodeIndex]; node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop();)
									if (1 === node.nodeType && ++diff && node === elem) {
										uniqueCache[type] = [dirruns, nodeIndex, diff];
										break
									}
							} else if (useCache && (node = elem, outerCache = node[expando] || (node[expando] = {}), uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {}), cache = uniqueCache[type] || [], nodeIndex = cache[0] === dirruns && cache[1], diff = nodeIndex), diff === !1)
								for (;
									(node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) && ((ofType ? node.nodeName.toLowerCase() !== name : 1 !== node.nodeType) || !++diff || (useCache && (outerCache = node[expando] || (node[expando] = {}), uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {}), uniqueCache[type] = [dirruns, diff]), node !== elem)););
							return diff -= last, diff === first || diff % first === 0 && diff / first >= 0
						}
					}
				},
				PSEUDO: function(pseudo, argument) {
					var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);
					return fn[expando] ? fn(argument) : fn.length > 1 ? (args = [pseudo, pseudo, "", argument], Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches) {
						for (var idx, matched = fn(seed, argument), i = matched.length; i--;) idx = indexOf(seed, matched[i]), seed[idx] = !(matches[idx] = matched[i])
					}) : function(elem) {
						return fn(elem, 0, args)
					}) : fn
				}
			},
			pseudos: {
				not: markFunction(function(selector) {
					var input = [],
						results = [],
						matcher = compile(selector.replace(rtrim, "$1"));
					return matcher[expando] ? markFunction(function(seed, matches, context, xml) {
						for (var elem, unmatched = matcher(seed, null, xml, []), i = seed.length; i--;)(elem = unmatched[i]) && (seed[i] = !(matches[i] = elem))
					}) : function(elem, context, xml) {
						return input[0] = elem, matcher(input, null, xml, results), input[0] = null, !results.pop()
					}
				}),
				has: markFunction(function(selector) {
					return function(elem) {
						return Sizzle(selector, elem).length > 0
					}
				}),
				contains: markFunction(function(text) {
					return text = text.replace(runescape, funescape),
						function(elem) {
							return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1
						}
				}),
				lang: markFunction(function(lang) {
					return ridentifier.test(lang || "") || Sizzle.error("unsupported lang: " + lang), lang = lang.replace(runescape, funescape).toLowerCase(),
						function(elem) {
							var elemLang;
							do
								if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) return elemLang = elemLang.toLowerCase(), elemLang === lang || 0 === elemLang.indexOf(lang + "-");
							while ((elem = elem.parentNode) && 1 === elem.nodeType);
							return !1
						}
				}),
				target: function(elem) {
					var hash = window.location && window.location.hash;
					return hash && hash.slice(1) === elem.id
				},
				root: function(elem) {
					return elem === docElem
				},
				focus: function(elem) {
					return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex)
				},
				enabled: function(elem) {
					return elem.disabled === !1
				},
				disabled: function(elem) {
					return elem.disabled === !0
				},
				checked: function(elem) {
					var nodeName = elem.nodeName.toLowerCase();
					return "input" === nodeName && !!elem.checked || "option" === nodeName && !!elem.selected
				},
				selected: function(elem) {
					return elem.parentNode && elem.parentNode.selectedIndex, elem.selected === !0
				},
				empty: function(elem) {
					for (elem = elem.firstChild; elem; elem = elem.nextSibling)
						if (elem.nodeType < 6) return !1;
					return !0
				},
				parent: function(elem) {
					return !Expr.pseudos.empty(elem)
				},
				header: function(elem) {
					return rheader.test(elem.nodeName)
				},
				input: function(elem) {
					return rinputs.test(elem.nodeName)
				},
				button: function(elem) {
					var name = elem.nodeName.toLowerCase();
					return "input" === name && "button" === elem.type || "button" === name
				},
				text: function(elem) {
					var attr;
					return "input" === elem.nodeName.toLowerCase() && "text" === elem.type && (null == (attr = elem.getAttribute("type")) || "text" === attr.toLowerCase())
				},
				first: createPositionalPseudo(function() {
					return [0]
				}),
				last: createPositionalPseudo(function(matchIndexes, length) {
					return [length - 1]
				}),
				eq: createPositionalPseudo(function(matchIndexes, length, argument) {
					return [0 > argument ? argument + length : argument]
				}),
				even: createPositionalPseudo(function(matchIndexes, length) {
					for (var i = 0; length > i; i += 2) matchIndexes.push(i);
					return matchIndexes
				}),
				odd: createPositionalPseudo(function(matchIndexes, length) {
					for (var i = 1; length > i; i += 2) matchIndexes.push(i);
					return matchIndexes
				}),
				lt: createPositionalPseudo(function(matchIndexes, length, argument) {
					for (var i = 0 > argument ? argument + length : argument; --i >= 0;) matchIndexes.push(i);
					return matchIndexes
				}),
				gt: createPositionalPseudo(function(matchIndexes, length, argument) {
					for (var i = 0 > argument ? argument + length : argument; ++i < length;) matchIndexes.push(i);
					return matchIndexes
				})
			}
		}, Expr.pseudos.nth = Expr.pseudos.eq;
		for (i in {
				radio: !0,
				checkbox: !0,
				file: !0,
				password: !0,
				image: !0
			}) Expr.pseudos[i] = createInputPseudo(i);
		for (i in {
				submit: !0,
				reset: !0
			}) Expr.pseudos[i] = createButtonPseudo(i);
		return setFilters.prototype = Expr.filters = Expr.pseudos, Expr.setFilters = new setFilters, tokenize = Sizzle.tokenize = function(selector, parseOnly) {
			var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
			if (cached) return parseOnly ? 0 : cached.slice(0);
			for (soFar = selector, groups = [], preFilters = Expr.preFilter; soFar;) {
				(!matched || (match = rcomma.exec(soFar))) && (match && (soFar = soFar.slice(match[0].length) || soFar), groups.push(tokens = [])), matched = !1, (match = rcombinators.exec(soFar)) && (matched = match.shift(), tokens.push({
					value: matched,
					type: match[0].replace(rtrim, " ")
				}), soFar = soFar.slice(matched.length));
				for (type in Expr.filter) !(match = matchExpr[type].exec(soFar)) || preFilters[type] && !(match = preFilters[type](match)) || (matched = match.shift(), tokens.push({
					value: matched,
					type: type,
					matches: match
				}), soFar = soFar.slice(matched.length));
				if (!matched) break
			}
			return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0)
		}, compile = Sizzle.compile = function(selector, match) {
			var i, setMatchers = [],
				elementMatchers = [],
				cached = compilerCache[selector + " "];
			if (!cached) {
				for (match || (match = tokenize(selector)), i = match.length; i--;) cached = matcherFromTokens(match[i]), cached[expando] ? setMatchers.push(cached) : elementMatchers.push(cached);
				cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers)), cached.selector = selector
			}
			return cached
		}, select = Sizzle.select = function(selector, context, results, seed) {
			var i, tokens, token, type, find, compiled = "function" == typeof selector && selector,
				match = !seed && tokenize(selector = compiled.selector || selector);
			if (results = results || [], 1 === match.length) {
				if (tokens = match[0] = match[0].slice(0), tokens.length > 2 && "ID" === (token = tokens[0]).type && support.getById && 9 === context.nodeType && documentIsHTML && Expr.relative[tokens[1].type]) {
					if (context = (Expr.find.ID(token.matches[0].replace(runescape, funescape), context) || [])[0], !context) return results;
					compiled && (context = context.parentNode), selector = selector.slice(tokens.shift().value.length)
				}
				for (i = matchExpr.needsContext.test(selector) ? 0 : tokens.length; i-- && (token = tokens[i], !Expr.relative[type = token.type]);)
					if ((find = Expr.find[type]) && (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context))) {
						if (tokens.splice(i, 1), selector = seed.length && toSelector(tokens), !selector) return push.apply(results, seed), results;
						break
					}
			}
			return (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context), results
		}, support.sortStable = expando.split("").sort(sortOrder).join("") === expando, support.detectDuplicates = !!hasDuplicate, setDocument(), support.sortDetached = assert(function(div1) {
			return 1 & div1.compareDocumentPosition(document.createElement("div"))
		}), assert(function(div) {
			return div.innerHTML = "<a href='#'></a>", "#" === div.firstChild.getAttribute("href")
		}) || addHandle("type|href|height|width", function(elem, name, isXML) {
			return isXML ? void 0 : elem.getAttribute(name, "type" === name.toLowerCase() ? 1 : 2)
		}), support.attributes && assert(function(div) {
			return div.innerHTML = "<input/>", div.firstChild.setAttribute("value", ""), "" === div.firstChild.getAttribute("value")
		}) || addHandle("value", function(elem, name, isXML) {
			return isXML || "input" !== elem.nodeName.toLowerCase() ? void 0 : elem.defaultValue
		}), assert(function(div) {
			return null == div.getAttribute("disabled")
		}) || addHandle(booleans, function(elem, name, isXML) {
			var val;
			return isXML ? void 0 : elem[name] === !0 ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null
		}), Sizzle
	}(window);
	jQuery.find = Sizzle, jQuery.expr = Sizzle.selectors, jQuery.expr[":"] = jQuery.expr.pseudos, jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort, jQuery.text = Sizzle.getText, jQuery.isXMLDoc = Sizzle.isXML, jQuery.contains = Sizzle.contains;
	var dir = function(elem, dir, until) {
			for (var matched = [], truncate = void 0 !== until;
				(elem = elem[dir]) && 9 !== elem.nodeType;)
				if (1 === elem.nodeType) {
					if (truncate && jQuery(elem).is(until)) break;
					matched.push(elem)
				}
			return matched
		},
		siblings = function(n, elem) {
			for (var matched = []; n; n = n.nextSibling) 1 === n.nodeType && n !== elem && matched.push(n);
			return matched
		},
		rneedsContext = jQuery.expr.match.needsContext,
		rsingleTag = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,
		risSimple = /^.[^:#\[\.,]*$/;
	jQuery.filter = function(expr, elems, not) {
		var elem = elems[0];
		return not && (expr = ":not(" + expr + ")"), 1 === elems.length && 1 === elem.nodeType ? jQuery.find.matchesSelector(elem, expr) ? [elem] : [] : jQuery.find.matches(expr, jQuery.grep(elems, function(elem) {
			return 1 === elem.nodeType
		}))
	}, jQuery.fn.extend({
		find: function(selector) {
			var i, len = this.length,
				ret = [],
				self = this;
			if ("string" != typeof selector) return this.pushStack(jQuery(selector).filter(function() {
				for (i = 0; len > i; i++)
					if (jQuery.contains(self[i], this)) return !0
			}));
			for (i = 0; len > i; i++) jQuery.find(selector, self[i], ret);
			return ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret), ret.selector = this.selector ? this.selector + " " + selector : selector, ret
		},
		filter: function(selector) {
			return this.pushStack(winnow(this, selector || [], !1))
		},
		not: function(selector) {
			return this.pushStack(winnow(this, selector || [], !0))
		},
		is: function(selector) {
			return !!winnow(this, "string" == typeof selector && rneedsContext.test(selector) ? jQuery(selector) : selector || [], !1).length
		}
	});
	var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
		init = jQuery.fn.init = function(selector, context, root) {
			var match, elem;
			if (!selector) return this;
			if (root = root || rootjQuery, "string" == typeof selector) {
				if (match = "<" === selector[0] && ">" === selector[selector.length - 1] && selector.length >= 3 ? [null, selector, null] : rquickExpr.exec(selector), !match || !match[1] && context) return !context || context.jquery ? (context || root).find(selector) : this.constructor(context).find(selector);
				if (match[1]) {
					if (context = context instanceof jQuery ? context[0] : context, jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, !0)), rsingleTag.test(match[1]) && jQuery.isPlainObject(context))
						for (match in context) jQuery.isFunction(this[match]) ? this[match](context[match]) : this.attr(match, context[match]);
					return this
				}
				return elem = document.getElementById(match[2]), elem && elem.parentNode && (this.length = 1, this[0] = elem), this.context = document, this.selector = selector, this
			}
			return selector.nodeType ? (this.context = this[0] = selector, this.length = 1, this) : jQuery.isFunction(selector) ? void 0 !== root.ready ? root.ready(selector) : selector(jQuery) : (void 0 !== selector.selector && (this.selector = selector.selector, this.context = selector.context), jQuery.makeArray(selector, this))
		};
	init.prototype = jQuery.fn, rootjQuery = jQuery(document);
	var rparentsprev = /^(?:parents|prev(?:Until|All))/,
		guaranteedUnique = {
			children: !0,
			contents: !0,
			next: !0,
			prev: !0
		};
	jQuery.fn.extend({
		has: function(target) {
			var targets = jQuery(target, this),
				l = targets.length;
			return this.filter(function() {
				for (var i = 0; l > i; i++)
					if (jQuery.contains(this, targets[i])) return !0
			})
		},
		closest: function(selectors, context) {
			for (var cur, i = 0, l = this.length, matched = [], pos = rneedsContext.test(selectors) || "string" != typeof selectors ? jQuery(selectors, context || this.context) : 0; l > i; i++)
				for (cur = this[i]; cur && cur !== context; cur = cur.parentNode)
					if (cur.nodeType < 11 && (pos ? pos.index(cur) > -1 : 1 === cur.nodeType && jQuery.find.matchesSelector(cur, selectors))) {
						matched.push(cur);
						break
					}
			return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched)
		},
		index: function(elem) {
			return elem ? "string" == typeof elem ? indexOf.call(jQuery(elem), this[0]) : indexOf.call(this, elem.jquery ? elem[0] : elem) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
		},
		add: function(selector, context) {
			return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(), jQuery(selector, context))))
		},
		addBack: function(selector) {
			return this.add(null == selector ? this.prevObject : this.prevObject.filter(selector))
		}
	}), jQuery.each({
		parent: function(elem) {
			var parent = elem.parentNode;
			return parent && 11 !== parent.nodeType ? parent : null
		},
		parents: function(elem) {
			return dir(elem, "parentNode")
		},
		parentsUntil: function(elem, i, until) {
			return dir(elem, "parentNode", until)
		},
		next: function(elem) {
			return sibling(elem, "nextSibling")
		},
		prev: function(elem) {
			return sibling(elem, "previousSibling");
		},
		nextAll: function(elem) {
			return dir(elem, "nextSibling")
		},
		prevAll: function(elem) {
			return dir(elem, "previousSibling")
		},
		nextUntil: function(elem, i, until) {
			return dir(elem, "nextSibling", until)
		},
		prevUntil: function(elem, i, until) {
			return dir(elem, "previousSibling", until)
		},
		siblings: function(elem) {
			return siblings((elem.parentNode || {}).firstChild, elem)
		},
		children: function(elem) {
			return siblings(elem.firstChild)
		},
		contents: function(elem) {
			return elem.contentDocument || jQuery.merge([], elem.childNodes)
		}
	}, function(name, fn) {
		jQuery.fn[name] = function(until, selector) {
			var matched = jQuery.map(this, fn, until);
			return "Until" !== name.slice(-5) && (selector = until), selector && "string" == typeof selector && (matched = jQuery.filter(selector, matched)), this.length > 1 && (guaranteedUnique[name] || jQuery.uniqueSort(matched), rparentsprev.test(name) && matched.reverse()), this.pushStack(matched)
		}
	});
	var rnotwhite = /\S+/g;
	jQuery.Callbacks = function(options) {
		options = "string" == typeof options ? createOptions(options) : jQuery.extend({}, options);
		var firing, memory, fired, locked, list = [],
			queue = [],
			firingIndex = -1,
			fire = function() {
				for (locked = options.once, fired = firing = !0; queue.length; firingIndex = -1)
					for (memory = queue.shift(); ++firingIndex < list.length;) list[firingIndex].apply(memory[0], memory[1]) === !1 && options.stopOnFalse && (firingIndex = list.length, memory = !1);
				options.memory || (memory = !1), firing = !1, locked && (list = memory ? [] : "")
			},
			self = {
				add: function() {
					return list && (memory && !firing && (firingIndex = list.length - 1, queue.push(memory)), function add(args) {
						jQuery.each(args, function(_, arg) {
							jQuery.isFunction(arg) ? options.unique && self.has(arg) || list.push(arg) : arg && arg.length && "string" !== jQuery.type(arg) && add(arg)
						})
					}(arguments), memory && !firing && fire()), this
				},
				remove: function() {
					return jQuery.each(arguments, function(_, arg) {
						for (var index;
							(index = jQuery.inArray(arg, list, index)) > -1;) list.splice(index, 1), firingIndex >= index && firingIndex--
					}), this
				},
				has: function(fn) {
					return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0
				},
				empty: function() {
					return list && (list = []), this
				},
				disable: function() {
					return locked = queue = [], list = memory = "", this
				},
				disabled: function() {
					return !list
				},
				lock: function() {
					return locked = queue = [], memory || (list = memory = ""), this
				},
				locked: function() {
					return !!locked
				},
				fireWith: function(context, args) {
					return locked || (args = args || [], args = [context, args.slice ? args.slice() : args], queue.push(args), firing || fire()), this
				},
				fire: function() {
					return self.fireWith(this, arguments), this
				},
				fired: function() {
					return !!fired
				}
			};
		return self
	}, jQuery.extend({
		Deferred: function(func) {
			var tuples = [
					["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
					["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
					["notify", "progress", jQuery.Callbacks("memory")]
				],
				state = "pending",
				promise = {
					state: function() {
						return state
					},
					always: function() {
						return deferred.done(arguments).fail(arguments), this
					},
					then: function() {
						var fns = arguments;
						return jQuery.Deferred(function(newDefer) {
							jQuery.each(tuples, function(i, tuple) {
								var fn = jQuery.isFunction(fns[i]) && fns[i];
								deferred[tuple[1]](function() {
									var returned = fn && fn.apply(this, arguments);
									returned && jQuery.isFunction(returned.promise) ? returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject) : newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments)
								})
							}), fns = null
						}).promise()
					},
					promise: function(obj) {
						return null != obj ? jQuery.extend(obj, promise) : promise
					}
				},
				deferred = {};
			return promise.pipe = promise.then, jQuery.each(tuples, function(i, tuple) {
				var list = tuple[2],
					stateString = tuple[3];
				promise[tuple[1]] = list.add, stateString && list.add(function() {
					state = stateString
				}, tuples[1 ^ i][2].disable, tuples[2][2].lock), deferred[tuple[0]] = function() {
					return deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments), this
				}, deferred[tuple[0] + "With"] = list.fireWith
			}), promise.promise(deferred), func && func.call(deferred, deferred), deferred
		},
		when: function(subordinate) {
			var progressValues, progressContexts, resolveContexts, i = 0,
				resolveValues = slice.call(arguments),
				length = resolveValues.length,
				remaining = 1 !== length || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0,
				deferred = 1 === remaining ? subordinate : jQuery.Deferred(),
				updateFunc = function(i, contexts, values) {
					return function(value) {
						contexts[i] = this, values[i] = arguments.length > 1 ? slice.call(arguments) : value, values === progressValues ? deferred.notifyWith(contexts, values) : --remaining || deferred.resolveWith(contexts, values)
					}
				};
			if (length > 1)
				for (progressValues = new Array(length), progressContexts = new Array(length), resolveContexts = new Array(length); length > i; i++) resolveValues[i] && jQuery.isFunction(resolveValues[i].promise) ? resolveValues[i].promise().progress(updateFunc(i, progressContexts, progressValues)).done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject) : --remaining;
			return remaining || deferred.resolveWith(resolveContexts, resolveValues), deferred.promise()
		}
	});
	var readyList;
	jQuery.fn.ready = function(fn) {
		return jQuery.ready.promise().done(fn), this
	}, jQuery.extend({
		isReady: !1,
		readyWait: 1,
		holdReady: function(hold) {
			hold ? jQuery.readyWait++ : jQuery.ready(!0)
		},
		ready: function(wait) {
			(wait === !0 ? --jQuery.readyWait : jQuery.isReady) || (jQuery.isReady = !0, wait !== !0 && --jQuery.readyWait > 0 || (readyList.resolveWith(document, [jQuery]), jQuery.fn.triggerHandler && (jQuery(document).triggerHandler("ready"), jQuery(document).off("ready"))))
		}
	}), jQuery.ready.promise = function(obj) {
		return readyList || (readyList = jQuery.Deferred(), "complete" === document.readyState || "loading" !== document.readyState && !document.documentElement.doScroll ? window.setTimeout(jQuery.ready) : (document.addEventListener("DOMContentLoaded", completed), window.addEventListener("load", completed))), readyList.promise(obj)
	}, jQuery.ready.promise();
	var access = function(elems, fn, key, value, chainable, emptyGet, raw) {
			var i = 0,
				len = elems.length,
				bulk = null == key;
			if ("object" === jQuery.type(key)) {
				chainable = !0;
				for (i in key) access(elems, fn, i, key[i], !0, emptyGet, raw)
			} else if (void 0 !== value && (chainable = !0, jQuery.isFunction(value) || (raw = !0), bulk && (raw ? (fn.call(elems, value), fn = null) : (bulk = fn, fn = function(elem, key, value) {
					return bulk.call(jQuery(elem), value)
				})), fn))
				for (; len > i; i++) fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
			return chainable ? elems : bulk ? fn.call(elems) : len ? fn(elems[0], key) : emptyGet
		},
		acceptData = function(owner) {
			return 1 === owner.nodeType || 9 === owner.nodeType || !+owner.nodeType
		};
	Data.uid = 1, Data.prototype = {
		register: function(owner, initial) {
			var value = initial || {};
			return owner.nodeType ? owner[this.expando] = value : Object.defineProperty(owner, this.expando, {
				value: value,
				writable: !0,
				configurable: !0
			}), owner[this.expando]
		},
		cache: function(owner) {
			if (!acceptData(owner)) return {};
			var value = owner[this.expando];
			return value || (value = {}, acceptData(owner) && (owner.nodeType ? owner[this.expando] = value : Object.defineProperty(owner, this.expando, {
				value: value,
				configurable: !0
			}))), value
		},
		set: function(owner, data, value) {
			var prop, cache = this.cache(owner);
			if ("string" == typeof data) cache[data] = value;
			else
				for (prop in data) cache[prop] = data[prop];
			return cache
		},
		get: function(owner, key) {
			return void 0 === key ? this.cache(owner) : owner[this.expando] && owner[this.expando][key]
		},
		access: function(owner, key, value) {
			var stored;
			return void 0 === key || key && "string" == typeof key && void 0 === value ? (stored = this.get(owner, key), void 0 !== stored ? stored : this.get(owner, jQuery.camelCase(key))) : (this.set(owner, key, value), void 0 !== value ? value : key)
		},
		remove: function(owner, key) {
			var i, name, camel, cache = owner[this.expando];
			if (void 0 !== cache) {
				if (void 0 === key) this.register(owner);
				else {
					jQuery.isArray(key) ? name = key.concat(key.map(jQuery.camelCase)) : (camel = jQuery.camelCase(key), key in cache ? name = [key, camel] : (name = camel, name = name in cache ? [name] : name.match(rnotwhite) || [])), i = name.length;
					for (; i--;) delete cache[name[i]]
				}(void 0 === key || jQuery.isEmptyObject(cache)) && (owner.nodeType ? owner[this.expando] = void 0 : delete owner[this.expando])
			}
		},
		hasData: function(owner) {
			var cache = owner[this.expando];
			return void 0 !== cache && !jQuery.isEmptyObject(cache)
		}
	};
	var dataPriv = new Data,
		dataUser = new Data,
		rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /[A-Z]/g;
	jQuery.extend({
		hasData: function(elem) {
			return dataUser.hasData(elem) || dataPriv.hasData(elem)
		},
		data: function(elem, name, data) {
			return dataUser.access(elem, name, data)
		},
		removeData: function(elem, name) {
			dataUser.remove(elem, name)
		},
		_data: function(elem, name, data) {
			return dataPriv.access(elem, name, data)
		},
		_removeData: function(elem, name) {
			dataPriv.remove(elem, name)
		}
	}), jQuery.fn.extend({
		data: function(key, value) {
			var i, name, data, elem = this[0],
				attrs = elem && elem.attributes;
			if (void 0 === key) {
				if (this.length && (data = dataUser.get(elem), 1 === elem.nodeType && !dataPriv.get(elem, "hasDataAttrs"))) {
					for (i = attrs.length; i--;) attrs[i] && (name = attrs[i].name, 0 === name.indexOf("data-") && (name = jQuery.camelCase(name.slice(5)), dataAttr(elem, name, data[name])));
					dataPriv.set(elem, "hasDataAttrs", !0)
				}
				return data
			}
			return "object" == typeof key ? this.each(function() {
				dataUser.set(this, key)
			}) : access(this, function(value) {
				var data, camelKey;
				if (elem && void 0 === value) {
					if (data = dataUser.get(elem, key) || dataUser.get(elem, key.replace(rmultiDash, "-$&").toLowerCase()), void 0 !== data) return data;
					if (camelKey = jQuery.camelCase(key), data = dataUser.get(elem, camelKey), void 0 !== data) return data;
					if (data = dataAttr(elem, camelKey, void 0), void 0 !== data) return data
				} else camelKey = jQuery.camelCase(key), this.each(function() {
					var data = dataUser.get(this, camelKey);
					dataUser.set(this, camelKey, value), key.indexOf("-") > -1 && void 0 !== data && dataUser.set(this, key, value)
				})
			}, null, value, arguments.length > 1, null, !0)
		},
		removeData: function(key) {
			return this.each(function() {
				dataUser.remove(this, key)
			})
		}
	}), jQuery.extend({
		queue: function(elem, type, data) {
			var queue;
			return elem ? (type = (type || "fx") + "queue", queue = dataPriv.get(elem, type), data && (!queue || jQuery.isArray(data) ? queue = dataPriv.access(elem, type, jQuery.makeArray(data)) : queue.push(data)), queue || []) : void 0
		},
		dequeue: function(elem, type) {
			type = type || "fx";
			var queue = jQuery.queue(elem, type),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks(elem, type),
				next = function() {
					jQuery.dequeue(elem, type)
				};
			"inprogress" === fn && (fn = queue.shift(), startLength--), fn && ("fx" === type && queue.unshift("inprogress"), delete hooks.stop, fn.call(elem, next, hooks)), !startLength && hooks && hooks.empty.fire()
		},
		_queueHooks: function(elem, type) {
			var key = type + "queueHooks";
			return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
				empty: jQuery.Callbacks("once memory").add(function() {
					dataPriv.remove(elem, [type + "queue", key])
				})
			})
		}
	}), jQuery.fn.extend({
		queue: function(type, data) {
			var setter = 2;
			return "string" != typeof type && (data = type, type = "fx", setter--), arguments.length < setter ? jQuery.queue(this[0], type) : void 0 === data ? this : this.each(function() {
				var queue = jQuery.queue(this, type, data);
				jQuery._queueHooks(this, type), "fx" === type && "inprogress" !== queue[0] && jQuery.dequeue(this, type)
			})
		},
		dequeue: function(type) {
			return this.each(function() {
				jQuery.dequeue(this, type)
			})
		},
		clearQueue: function(type) {
			return this.queue(type || "fx", [])
		},
		promise: function(type, obj) {
			var tmp, count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function() {
					--count || defer.resolveWith(elements, [elements])
				};
			for ("string" != typeof type && (obj = type, type = void 0), type = type || "fx"; i--;) tmp = dataPriv.get(elements[i], type + "queueHooks"), tmp && tmp.empty && (count++, tmp.empty.add(resolve));
			return resolve(), defer.promise(obj)
		}
	});
	var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
		rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i"),
		cssExpand = ["Top", "Right", "Bottom", "Left"],
		isHidden = function(elem, el) {
			return elem = el || elem, "none" === jQuery.css(elem, "display") || !jQuery.contains(elem.ownerDocument, elem)
		},
		rcheckableType = /^(?:checkbox|radio)$/i,
		rtagName = /<([\w:-]+)/,
		rscriptType = /^$|\/(?:java|ecma)script/i,
		wrapMap = {
			option: [1, "<select multiple='multiple'>", "</select>"],
			thead: [1, "<table>", "</table>"],
			col: [2, "<table><colgroup>", "</colgroup></table>"],
			tr: [2, "<table><tbody>", "</tbody></table>"],
			td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
			_default: [0, "", ""]
		};
	wrapMap.optgroup = wrapMap.option, wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead, wrapMap.th = wrapMap.td;
	var rhtml = /<|&#?\w+;/;
	! function() {
		var fragment = document.createDocumentFragment(),
			div = fragment.appendChild(document.createElement("div")),
			input = document.createElement("input");
		input.setAttribute("type", "radio"), input.setAttribute("checked", "checked"), input.setAttribute("name", "t"), div.appendChild(input), support.checkClone = div.cloneNode(!0).cloneNode(!0).lastChild.checked, div.innerHTML = "<textarea>x</textarea>", support.noCloneChecked = !!div.cloneNode(!0).lastChild.defaultValue
	}();
	var rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
		rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
	jQuery.event = {
		global: {},
		add: function(elem, types, handler, data, selector) {
			var handleObjIn, eventHandle, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.get(elem);
			if (elemData)
				for (handler.handler && (handleObjIn = handler, handler = handleObjIn.handler, selector = handleObjIn.selector), handler.guid || (handler.guid = jQuery.guid++), (events = elemData.events) || (events = elemData.events = {}), (eventHandle = elemData.handle) || (eventHandle = elemData.handle = function(e) {
						return "undefined" != typeof jQuery && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : void 0
					}), types = (types || "").match(rnotwhite) || [""], t = types.length; t--;) tmp = rtypenamespace.exec(types[t]) || [], type = origType = tmp[1], namespaces = (tmp[2] || "").split(".").sort(), type && (special = jQuery.event.special[type] || {}, type = (selector ? special.delegateType : special.bindType) || type, special = jQuery.event.special[type] || {}, handleObj = jQuery.extend({
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test(selector),
					namespace: namespaces.join(".")
				}, handleObjIn), (handlers = events[type]) || (handlers = events[type] = [], handlers.delegateCount = 0, special.setup && special.setup.call(elem, data, namespaces, eventHandle) !== !1 || elem.addEventListener && elem.addEventListener(type, eventHandle)), special.add && (special.add.call(elem, handleObj), handleObj.handler.guid || (handleObj.handler.guid = handler.guid)), selector ? handlers.splice(handlers.delegateCount++, 0, handleObj) : handlers.push(handleObj), jQuery.event.global[type] = !0)
		},
		remove: function(elem, types, handler, selector, mappedTypes) {
			var j, origCount, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
			if (elemData && (events = elemData.events)) {
				for (types = (types || "").match(rnotwhite) || [""], t = types.length; t--;)
					if (tmp = rtypenamespace.exec(types[t]) || [], type = origType = tmp[1], namespaces = (tmp[2] || "").split(".").sort(), type) {
						for (special = jQuery.event.special[type] || {}, type = (selector ? special.delegateType : special.bindType) || type, handlers = events[type] || [], tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)"), origCount = j = handlers.length; j--;) handleObj = handlers[j], !mappedTypes && origType !== handleObj.origType || handler && handler.guid !== handleObj.guid || tmp && !tmp.test(handleObj.namespace) || selector && selector !== handleObj.selector && ("**" !== selector || !handleObj.selector) || (handlers.splice(j, 1), handleObj.selector && handlers.delegateCount--, special.remove && special.remove.call(elem, handleObj));
						origCount && !handlers.length && (special.teardown && special.teardown.call(elem, namespaces, elemData.handle) !== !1 || jQuery.removeEvent(elem, type, elemData.handle), delete events[type])
					} else
						for (type in events) jQuery.event.remove(elem, type + types[t], handler, selector, !0);
				jQuery.isEmptyObject(events) && dataPriv.remove(elem, "handle events")
			}
		},
		dispatch: function(event) {
			event = jQuery.event.fix(event);
			var i, j, ret, matched, handleObj, handlerQueue = [],
				args = slice.call(arguments),
				handlers = (dataPriv.get(this, "events") || {})[event.type] || [],
				special = jQuery.event.special[event.type] || {};
			if (args[0] = event, event.delegateTarget = this, !special.preDispatch || special.preDispatch.call(this, event) !== !1) {
				for (handlerQueue = jQuery.event.handlers.call(this, event, handlers), i = 0;
					(matched = handlerQueue[i++]) && !event.isPropagationStopped();)
					for (event.currentTarget = matched.elem, j = 0;
						(handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped();)(!event.rnamespace || event.rnamespace.test(handleObj.namespace)) && (event.handleObj = handleObj, event.data = handleObj.data, ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args), void 0 !== ret && (event.result = ret) === !1 && (event.preventDefault(), event.stopPropagation()));
				return special.postDispatch && special.postDispatch.call(this, event), event.result
			}
		},
		handlers: function(event, handlers) {
			var i, matches, sel, handleObj, handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;
			if (delegateCount && cur.nodeType && ("click" !== event.type || isNaN(event.button) || event.button < 1))
				for (; cur !== this; cur = cur.parentNode || this)
					if (1 === cur.nodeType && (cur.disabled !== !0 || "click" !== event.type)) {
						for (matches = [], i = 0; delegateCount > i; i++) handleObj = handlers[i], sel = handleObj.selector + " ", void 0 === matches[sel] && (matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length), matches[sel] && matches.push(handleObj);
						matches.length && handlerQueue.push({
							elem: cur,
							handlers: matches
						})
					}
			return delegateCount < handlers.length && handlerQueue.push({
				elem: this,
				handlers: handlers.slice(delegateCount)
			}), handlerQueue
		},
		props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
		fixHooks: {},
		keyHooks: {
			props: "char charCode key keyCode".split(" "),
			filter: function(event, original) {
				return null == event.which && (event.which = null != original.charCode ? original.charCode : original.keyCode), event
			}
		},
		mouseHooks: {
			props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
			filter: function(event, original) {
				var eventDoc, doc, body, button = original.button;
				return null == event.pageX && null != original.clientX && (eventDoc = event.target.ownerDocument || document, doc = eventDoc.documentElement, body = eventDoc.body, event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0), event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0)), event.which || void 0 === button || (event.which = 1 & button ? 1 : 2 & button ? 3 : 4 & button ? 2 : 0), event
			}
		},
		fix: function(event) {
			if (event[jQuery.expando]) return event;
			var i, prop, copy, type = event.type,
				originalEvent = event,
				fixHook = this.fixHooks[type];
			for (fixHook || (this.fixHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : {}), copy = fixHook.props ? this.props.concat(fixHook.props) : this.props, event = new jQuery.Event(originalEvent), i = copy.length; i--;) prop = copy[i], event[prop] = originalEvent[prop];
			return event.target || (event.target = document), 3 === event.target.nodeType && (event.target = event.target.parentNode), fixHook.filter ? fixHook.filter(event, originalEvent) : event
		},
		special: {
			load: {
				noBubble: !0
			},
			focus: {
				trigger: function() {
					return this !== safeActiveElement() && this.focus ? (this.focus(), !1) : void 0
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					return this === safeActiveElement() && this.blur ? (this.blur(), !1) : void 0
				},
				delegateType: "focusout"
			},
			click: {
				trigger: function() {
					return "checkbox" === this.type && this.click && jQuery.nodeName(this, "input") ? (this.click(), !1) : void 0
				},
				_default: function(event) {
					return jQuery.nodeName(event.target, "a")
				}
			},
			beforeunload: {
				postDispatch: function(event) {
					void 0 !== event.result && event.originalEvent && (event.originalEvent.returnValue = event.result)
				}
			}
		}
	}, jQuery.removeEvent = function(elem, type, handle) {
		elem.removeEventListener && elem.removeEventListener(type, handle)
	}, jQuery.Event = function(src, props) {
		return this instanceof jQuery.Event ? (src && src.type ? (this.originalEvent = src, this.type = src.type, this.isDefaultPrevented = src.defaultPrevented || void 0 === src.defaultPrevented && src.returnValue === !1 ? returnTrue : returnFalse) : this.type = src, props && jQuery.extend(this, props), this.timeStamp = src && src.timeStamp || jQuery.now(), void(this[jQuery.expando] = !0)) : new jQuery.Event(src, props)
	}, jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
		preventDefault: function() {
			var e = this.originalEvent;
			this.isDefaultPrevented = returnTrue, e && e.preventDefault()
		},
		stopPropagation: function() {
			var e = this.originalEvent;
			this.isPropagationStopped = returnTrue, e && e.stopPropagation()
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;
			this.isImmediatePropagationStopped = returnTrue, e && e.stopImmediatePropagation(), this.stopPropagation()
		}
	}, jQuery.each({
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function(orig, fix) {
		jQuery.event.special[orig] = {
			delegateType: fix,
			bindType: fix,
			handle: function(event) {
				var ret, target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;
				return (!related || related !== target && !jQuery.contains(target, related)) && (event.type = handleObj.origType, ret = handleObj.handler.apply(this, arguments), event.type = fix), ret
			}
		}
	}), jQuery.fn.extend({
		on: function(types, selector, data, fn) {
			return on(this, types, selector, data, fn)
		},
		one: function(types, selector, data, fn) {
			return on(this, types, selector, data, fn, 1)
		},
		off: function(types, selector, fn) {
			var handleObj, type;
			if (types && types.preventDefault && types.handleObj) return handleObj = types.handleObj, jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler), this;
			if ("object" == typeof types) {
				for (type in types) this.off(type, selector, types[type]);
				return this
			}
			return (selector === !1 || "function" == typeof selector) && (fn = selector, selector = void 0), fn === !1 && (fn = returnFalse), this.each(function() {
				jQuery.event.remove(this, types, fn, selector)
			})
		}
	});
	var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
		rnoInnerhtml = /<script|<style|<link/i,
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptTypeMasked = /^true\/(.*)/,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
	jQuery.extend({
		htmlPrefilter: function(html) {
			return html.replace(rxhtmlTag, "<$1></$2>")
		},
		clone: function(elem, dataAndEvents, deepDataAndEvents) {
			var i, l, srcElements, destElements, clone = elem.cloneNode(!0),
				inPage = jQuery.contains(elem.ownerDocument, elem);
			if (!(support.noCloneChecked || 1 !== elem.nodeType && 11 !== elem.nodeType || jQuery.isXMLDoc(elem)))
				for (destElements = getAll(clone), srcElements = getAll(elem), i = 0, l = srcElements.length; l > i; i++) fixInput(srcElements[i], destElements[i]);
			if (dataAndEvents)
				if (deepDataAndEvents)
					for (srcElements = srcElements || getAll(elem), destElements = destElements || getAll(clone), i = 0, l = srcElements.length; l > i; i++) cloneCopyEvent(srcElements[i], destElements[i]);
				else cloneCopyEvent(elem, clone);
			return destElements = getAll(clone, "script"), destElements.length > 0 && setGlobalEval(destElements, !inPage && getAll(elem, "script")), clone
		},
		cleanData: function(elems) {
			for (var data, elem, type, special = jQuery.event.special, i = 0; void 0 !== (elem = elems[i]); i++)
				if (acceptData(elem)) {
					if (data = elem[dataPriv.expando]) {
						if (data.events)
							for (type in data.events) special[type] ? jQuery.event.remove(elem, type) : jQuery.removeEvent(elem, type, data.handle);
						elem[dataPriv.expando] = void 0
					}
					elem[dataUser.expando] && (elem[dataUser.expando] = void 0)
				}
		}
	}), jQuery.fn.extend({
		domManip: domManip,
		detach: function(selector) {
			return remove(this, selector, !0)
		},
		remove: function(selector) {
			return remove(this, selector)
		},
		text: function(value) {
			return access(this, function(value) {
				return void 0 === value ? jQuery.text(this) : this.empty().each(function() {
					(1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = value)
				})
			}, null, value, arguments.length)
		},
		append: function() {
			return domManip(this, arguments, function(elem) {
				if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
					var target = manipulationTarget(this, elem);
					target.appendChild(elem)
				}
			})
		},
		prepend: function() {
			return domManip(this, arguments, function(elem) {
				if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
					var target = manipulationTarget(this, elem);
					target.insertBefore(elem, target.firstChild)
				}
			})
		},
		before: function() {
			return domManip(this, arguments, function(elem) {
				this.parentNode && this.parentNode.insertBefore(elem, this)
			})
		},
		after: function() {
			return domManip(this, arguments, function(elem) {
				this.parentNode && this.parentNode.insertBefore(elem, this.nextSibling)
			})
		},
		empty: function() {
			for (var elem, i = 0; null != (elem = this[i]); i++) 1 === elem.nodeType && (jQuery.cleanData(getAll(elem, !1)), elem.textContent = "");
			return this
		},
		clone: function(dataAndEvents, deepDataAndEvents) {
			return dataAndEvents = null == dataAndEvents ? !1 : dataAndEvents, deepDataAndEvents = null == deepDataAndEvents ? dataAndEvents : deepDataAndEvents, this.map(function() {
				return jQuery.clone(this, dataAndEvents, deepDataAndEvents)
			})
		},
		html: function(value) {
			return access(this, function(value) {
				var elem = this[0] || {},
					i = 0,
					l = this.length;
				if (void 0 === value && 1 === elem.nodeType) return elem.innerHTML;
				if ("string" == typeof value && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {
					value = jQuery.htmlPrefilter(value);
					try {
						for (; l > i; i++) elem = this[i] || {}, 1 === elem.nodeType && (jQuery.cleanData(getAll(elem, !1)), elem.innerHTML = value);
						elem = 0
					} catch (e) {}
				}
				elem && this.empty().append(value)
			}, null, value, arguments.length)
		},
		replaceWith: function() {
			var ignored = [];
			return domManip(this, arguments, function(elem) {
				var parent = this.parentNode;
				jQuery.inArray(this, ignored) < 0 && (jQuery.cleanData(getAll(this)), parent && parent.replaceChild(elem, this))
			}, ignored)
		}
	}), jQuery.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function(name, original) {
		jQuery.fn[name] = function(selector) {
			for (var elems, ret = [], insert = jQuery(selector), last = insert.length - 1, i = 0; last >= i; i++) elems = i === last ? this : this.clone(!0), jQuery(insert[i])[original](elems), push.apply(ret, elems.get());
			return this.pushStack(ret)
		}
	});
	var iframe, elemdisplay = {
			HTML: "block",
			BODY: "block"
		},
		rmargin = /^margin/,
		rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i"),
		getStyles = function(elem) {
			var view = elem.ownerDocument.defaultView;
			return view && view.opener || (view = window), view.getComputedStyle(elem)
		},
		swap = function(elem, options, callback, args) {
			var ret, name, old = {};
			for (name in options) old[name] = elem.style[name], elem.style[name] = options[name];
			ret = callback.apply(elem, args || []);
			for (name in options) elem.style[name] = old[name];
			return ret
		},
		documentElement = document.documentElement;
	! function() {
		function computeStyleTests() {
			div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", div.innerHTML = "", documentElement.appendChild(container);
			var divStyle = window.getComputedStyle(div);
			pixelPositionVal = "1%" !== divStyle.top, reliableMarginLeftVal = "2px" === divStyle.marginLeft, boxSizingReliableVal = "4px" === divStyle.width, div.style.marginRight = "50%", pixelMarginRightVal = "4px" === divStyle.marginRight, documentElement.removeChild(container)
		}
		var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal, container = document.createElement("div"),
			div = document.createElement("div");
		div.style && (div.style.backgroundClip = "content-box", div.cloneNode(!0).style.backgroundClip = "", support.clearCloneStyle = "content-box" === div.style.backgroundClip, container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", container.appendChild(div), jQuery.extend(support, {
			pixelPosition: function() {
				return computeStyleTests(), pixelPositionVal
			},
			boxSizingReliable: function() {
				return null == boxSizingReliableVal && computeStyleTests(), boxSizingReliableVal
			},
			pixelMarginRight: function() {
				return null == boxSizingReliableVal && computeStyleTests(), pixelMarginRightVal
			},
			reliableMarginLeft: function() {
				return null == boxSizingReliableVal && computeStyleTests(), reliableMarginLeftVal
			},
			reliableMarginRight: function() {
				var ret, marginDiv = div.appendChild(document.createElement("div"));
				return marginDiv.style.cssText = div.style.cssText = "-webkit-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", marginDiv.style.marginRight = marginDiv.style.width = "0", div.style.width = "1px", documentElement.appendChild(container), ret = !parseFloat(window.getComputedStyle(marginDiv).marginRight), documentElement.removeChild(container), div.removeChild(marginDiv), ret
			}
		}))
	}();
	var rdisplayswap = /^(none|table(?!-c[ea]).+)/,
		cssShow = {
			position: "absolute",
			visibility: "hidden",
			display: "block"
		},
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		},
		cssPrefixes = ["Webkit", "O", "Moz", "ms"],
		emptyStyle = document.createElement("div").style;
	jQuery.extend({
		cssHooks: {
			opacity: {
				get: function(elem, computed) {
					if (computed) {
						var ret = curCSS(elem, "opacity");
						return "" === ret ? "1" : ret
					}
				}
			}
		},
		cssNumber: {
			animationIterationCount: !0,
			columnCount: !0,
			fillOpacity: !0,
			flexGrow: !0,
			flexShrink: !0,
			fontWeight: !0,
			lineHeight: !0,
			opacity: !0,
			order: !0,
			orphans: !0,
			widows: !0,
			zIndex: !0,
			zoom: !0
		},
		cssProps: {
			"float": "cssFloat"
		},
		style: function(elem, name, value, extra) {
			if (elem && 3 !== elem.nodeType && 8 !== elem.nodeType && elem.style) {
				var ret, type, hooks, origName = jQuery.camelCase(name),
					style = elem.style;
				return name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(origName) || origName), hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName], void 0 === value ? hooks && "get" in hooks && void 0 !== (ret = hooks.get(elem, !1, extra)) ? ret : style[name] : (type = typeof value, "string" === type && (ret = rcssNum.exec(value)) && ret[1] && (value = adjustCSS(elem, name, ret), type = "number"), null != value && value === value && ("number" === type && (value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px")), support.clearCloneStyle || "" !== value || 0 !== name.indexOf("background") || (style[name] = "inherit"), hooks && "set" in hooks && void 0 === (value = hooks.set(elem, value, extra)) || (style[name] = value)), void 0)
			}
		},
		css: function(elem, name, extra, styles) {
			var val, num, hooks, origName = jQuery.camelCase(name);
			return name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(origName) || origName), hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName], hooks && "get" in hooks && (val = hooks.get(elem, !0, extra)), void 0 === val && (val = curCSS(elem, name, styles)), "normal" === val && name in cssNormalTransform && (val = cssNormalTransform[name]), "" === extra || extra ? (num = parseFloat(val), extra === !0 || isFinite(num) ? num || 0 : val) : val
		}
	}), jQuery.each(["height", "width"], function(i, name) {
		jQuery.cssHooks[name] = {
			get: function(elem, computed, extra) {
				return computed ? rdisplayswap.test(jQuery.css(elem, "display")) && 0 === elem.offsetWidth ? swap(elem, cssShow, function() {
					return getWidthOrHeight(elem, name, extra)
				}) : getWidthOrHeight(elem, name, extra) : void 0
			},
			set: function(elem, value, extra) {
				var matches, styles = extra && getStyles(elem),
					subtract = extra && augmentWidthOrHeight(elem, name, extra, "border-box" === jQuery.css(elem, "boxSizing", !1, styles), styles);
				return subtract && (matches = rcssNum.exec(value)) && "px" !== (matches[3] || "px") && (elem.style[name] = value, value = jQuery.css(elem, name)), setPositiveNumber(elem, value, subtract)
			}
		}
	}), jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft, function(elem, computed) {
		return computed ? (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, {
			marginLeft: 0
		}, function() {
			return elem.getBoundingClientRect().left
		})) + "px" : void 0
	}), jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight, function(elem, computed) {
		return computed ? swap(elem, {
			display: "inline-block"
		}, curCSS, [elem, "marginRight"]) : void 0
	}), jQuery.each({
		margin: "",
		padding: "",
		border: "Width"
	}, function(prefix, suffix) {
		jQuery.cssHooks[prefix + suffix] = {
			expand: function(value) {
				for (var i = 0, expanded = {}, parts = "string" == typeof value ? value.split(" ") : [value]; 4 > i; i++) expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
				return expanded
			}
		}, rmargin.test(prefix) || (jQuery.cssHooks[prefix + suffix].set = setPositiveNumber)
	}), jQuery.fn.extend({
		css: function(name, value) {
			return access(this, function(elem, name, value) {
				var styles, len, map = {},
					i = 0;
				if (jQuery.isArray(name)) {
					for (styles = getStyles(elem), len = name.length; len > i; i++) map[name[i]] = jQuery.css(elem, name[i], !1, styles);
					return map
				}
				return void 0 !== value ? jQuery.style(elem, name, value) : jQuery.css(elem, name)
			}, name, value, arguments.length > 1)
		},
		show: function() {
			return showHide(this, !0)
		},
		hide: function() {
			return showHide(this)
		},
		toggle: function(state) {
			return "boolean" == typeof state ? state ? this.show() : this.hide() : this.each(function() {
				isHidden(this) ? jQuery(this).show() : jQuery(this).hide()
			})
		}
	}), jQuery.Tween = Tween, Tween.prototype = {
		constructor: Tween,
		init: function(elem, options, prop, end, easing, unit) {
			this.elem = elem, this.prop = prop, this.easing = easing || jQuery.easing._default, this.options = options, this.start = this.now = this.cur(), this.end = end, this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px")
		},
		cur: function() {
			var hooks = Tween.propHooks[this.prop];
			return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this)
		},
		run: function(percent) {
			var eased, hooks = Tween.propHooks[this.prop];
			return this.pos = eased = this.options.duration ? jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration) : percent, this.now = (this.end - this.start) * eased + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), hooks && hooks.set ? hooks.set(this) : Tween.propHooks._default.set(this), this
		}
	}, Tween.prototype.init.prototype = Tween.prototype, Tween.propHooks = {
		_default: {
			get: function(tween) {
				var result;
				return 1 !== tween.elem.nodeType || null != tween.elem[tween.prop] && null == tween.elem.style[tween.prop] ? tween.elem[tween.prop] : (result = jQuery.css(tween.elem, tween.prop, ""), result && "auto" !== result ? result : 0)
			},
			set: function(tween) {
				jQuery.fx.step[tween.prop] ? jQuery.fx.step[tween.prop](tween) : 1 !== tween.elem.nodeType || null == tween.elem.style[jQuery.cssProps[tween.prop]] && !jQuery.cssHooks[tween.prop] ? tween.elem[tween.prop] = tween.now : jQuery.style(tween.elem, tween.prop, tween.now + tween.unit)
			}
		}
	}, Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function(tween) {
			tween.elem.nodeType && tween.elem.parentNode && (tween.elem[tween.prop] = tween.now)
		}
	}, jQuery.easing = {
		linear: function(p) {
			return p
		},
		swing: function(p) {
			return .5 - Math.cos(p * Math.PI) / 2
		},
		_default: "swing"
	}, jQuery.fx = Tween.prototype.init, jQuery.fx.step = {};
	var fxNow, timerId, rfxtypes = /^(?:toggle|show|hide)$/,
		rrun = /queueHooks$/;
	jQuery.Animation = jQuery.extend(Animation, {
			tweeners: {
				"*": [function(prop, value) {
					var tween = this.createTween(prop, value);
					return adjustCSS(tween.elem, prop, rcssNum.exec(value), tween), tween
				}]
			},
			tweener: function(props, callback) {
				jQuery.isFunction(props) ? (callback = props, props = ["*"]) : props = props.match(rnotwhite);
				for (var prop, index = 0, length = props.length; length > index; index++) prop = props[index], Animation.tweeners[prop] = Animation.tweeners[prop] || [], Animation.tweeners[prop].unshift(callback)
			},
			prefilters: [defaultPrefilter],
			prefilter: function(callback, prepend) {
				prepend ? Animation.prefilters.unshift(callback) : Animation.prefilters.push(callback)
			}
		}), jQuery.speed = function(speed, easing, fn) {
			var opt = speed && "object" == typeof speed ? jQuery.extend({}, speed) : {
				complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
				duration: speed,
				easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
			};
			return opt.duration = jQuery.fx.off ? 0 : "number" == typeof opt.duration ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default, (null == opt.queue || opt.queue === !0) && (opt.queue = "fx"), opt.old = opt.complete, opt.complete = function() {
				jQuery.isFunction(opt.old) && opt.old.call(this), opt.queue && jQuery.dequeue(this, opt.queue)
			}, opt
		}, jQuery.fn.extend({
			fadeTo: function(speed, to, easing, callback) {
				return this.filter(isHidden).css("opacity", 0).show().end().animate({
					opacity: to
				}, speed, easing, callback)
			},
			animate: function(prop, speed, easing, callback) {
				var empty = jQuery.isEmptyObject(prop),
					optall = jQuery.speed(speed, easing, callback),
					doAnimation = function() {
						var anim = Animation(this, jQuery.extend({}, prop), optall);
						(empty || dataPriv.get(this, "finish")) && anim.stop(!0)
					};
				return doAnimation.finish = doAnimation, empty || optall.queue === !1 ? this.each(doAnimation) : this.queue(optall.queue, doAnimation)
			},
			stop: function(type, clearQueue, gotoEnd) {
				var stopQueue = function(hooks) {
					var stop = hooks.stop;
					delete hooks.stop, stop(gotoEnd)
				};
				return "string" != typeof type && (gotoEnd = clearQueue, clearQueue = type, type = void 0), clearQueue && type !== !1 && this.queue(type || "fx", []), this.each(function() {
					var dequeue = !0,
						index = null != type && type + "queueHooks",
						timers = jQuery.timers,
						data = dataPriv.get(this);
					if (index) data[index] && data[index].stop && stopQueue(data[index]);
					else
						for (index in data) data[index] && data[index].stop && rrun.test(index) && stopQueue(data[index]);
					for (index = timers.length; index--;) timers[index].elem !== this || null != type && timers[index].queue !== type || (timers[index].anim.stop(gotoEnd), dequeue = !1, timers.splice(index, 1));
					(dequeue || !gotoEnd) && jQuery.dequeue(this, type)
				})
			},
			finish: function(type) {
				return type !== !1 && (type = type || "fx"), this.each(function() {
					var index, data = dataPriv.get(this),
						queue = data[type + "queue"],
						hooks = data[type + "queueHooks"],
						timers = jQuery.timers,
						length = queue ? queue.length : 0;
					for (data.finish = !0, jQuery.queue(this, type, []), hooks && hooks.stop && hooks.stop.call(this, !0), index = timers.length; index--;) timers[index].elem === this && timers[index].queue === type && (timers[index].anim.stop(!0), timers.splice(index, 1));
					for (index = 0; length > index; index++) queue[index] && queue[index].finish && queue[index].finish.call(this);
					delete data.finish
				})
			}
		}), jQuery.each(["toggle", "show", "hide"], function(i, name) {
			var cssFn = jQuery.fn[name];
			jQuery.fn[name] = function(speed, easing, callback) {
				return null == speed || "boolean" == typeof speed ? cssFn.apply(this, arguments) : this.animate(genFx(name, !0), speed, easing, callback)
			}
		}), jQuery.each({
			slideDown: genFx("show"),
			slideUp: genFx("hide"),
			slideToggle: genFx("toggle"),
			fadeIn: {
				opacity: "show"
			},
			fadeOut: {
				opacity: "hide"
			},
			fadeToggle: {
				opacity: "toggle"
			}
		}, function(name, props) {
			jQuery.fn[name] = function(speed, easing, callback) {
				return this.animate(props, speed, easing, callback)
			}
		}), jQuery.timers = [], jQuery.fx.tick = function() {
			var timer, i = 0,
				timers = jQuery.timers;
			for (fxNow = jQuery.now(); i < timers.length; i++) timer = timers[i], timer() || timers[i] !== timer || timers.splice(i--, 1);
			timers.length || jQuery.fx.stop(), fxNow = void 0
		}, jQuery.fx.timer = function(timer) {
			jQuery.timers.push(timer), timer() ? jQuery.fx.start() : jQuery.timers.pop()
		}, jQuery.fx.interval = 13, jQuery.fx.start = function() {
			timerId || (timerId = window.setInterval(jQuery.fx.tick, jQuery.fx.interval))
		}, jQuery.fx.stop = function() {
			window.clearInterval(timerId), timerId = null
		}, jQuery.fx.speeds = {
			slow: 600,
			fast: 200,
			_default: 400
		}, jQuery.fn.delay = function(time, type) {
			return time = jQuery.fx ? jQuery.fx.speeds[time] || time : time, type = type || "fx", this.queue(type, function(next, hooks) {
				var timeout = window.setTimeout(next, time);
				hooks.stop = function() {
					window.clearTimeout(timeout)
				}
			})
		},
		function() {
			var input = document.createElement("input"),
				select = document.createElement("select"),
				opt = select.appendChild(document.createElement("option"));
			input.type = "checkbox", support.checkOn = "" !== input.value, support.optSelected = opt.selected, select.disabled = !0, support.optDisabled = !opt.disabled, input = document.createElement("input"), input.value = "t", input.type = "radio", support.radioValue = "t" === input.value
		}();
	var boolHook, attrHandle = jQuery.expr.attrHandle;
	jQuery.fn.extend({
		attr: function(name, value) {
			return access(this, jQuery.attr, name, value, arguments.length > 1)
		},
		removeAttr: function(name) {
			return this.each(function() {
				jQuery.removeAttr(this, name)
			})
		}
	}), jQuery.extend({
		attr: function(elem, name, value) {
			var ret, hooks, nType = elem.nodeType;
			if (3 !== nType && 8 !== nType && 2 !== nType) return "undefined" == typeof elem.getAttribute ? jQuery.prop(elem, name, value) : (1 === nType && jQuery.isXMLDoc(elem) || (name = name.toLowerCase(), hooks = jQuery.attrHooks[name] || (jQuery.expr.match.bool.test(name) ? boolHook : void 0)), void 0 !== value ? null === value ? void jQuery.removeAttr(elem, name) : hooks && "set" in hooks && void 0 !== (ret = hooks.set(elem, value, name)) ? ret : (elem.setAttribute(name, value + ""), value) : hooks && "get" in hooks && null !== (ret = hooks.get(elem, name)) ? ret : (ret = jQuery.find.attr(elem, name), null == ret ? void 0 : ret))
		},
		attrHooks: {
			type: {
				set: function(elem, value) {
					if (!support.radioValue && "radio" === value && jQuery.nodeName(elem, "input")) {
						var val = elem.value;
						return elem.setAttribute("type", value), val && (elem.value = val), value
					}
				}
			}
		},
		removeAttr: function(elem, value) {
			var name, propName, i = 0,
				attrNames = value && value.match(rnotwhite);
			if (attrNames && 1 === elem.nodeType)
				for (; name = attrNames[i++];) propName = jQuery.propFix[name] || name, jQuery.expr.match.bool.test(name) && (elem[propName] = !1), elem.removeAttribute(name)
		}
	}), boolHook = {
		set: function(elem, value, name) {
			return value === !1 ? jQuery.removeAttr(elem, name) : elem.setAttribute(name, name), name
		}
	}, jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(i, name) {
		var getter = attrHandle[name] || jQuery.find.attr;
		attrHandle[name] = function(elem, name, isXML) {
			var ret, handle;
			return isXML || (handle = attrHandle[name], attrHandle[name] = ret, ret = null != getter(elem, name, isXML) ? name.toLowerCase() : null, attrHandle[name] = handle), ret
		}
	});
	var rfocusable = /^(?:input|select|textarea|button)$/i,
		rclickable = /^(?:a|area)$/i;
	jQuery.fn.extend({
		prop: function(name, value) {
			return access(this, jQuery.prop, name, value, arguments.length > 1)
		},
		removeProp: function(name) {
			return this.each(function() {
				delete this[jQuery.propFix[name] || name]
			})
		}
	}), jQuery.extend({
		prop: function(elem, name, value) {
			var ret, hooks, nType = elem.nodeType;
			if (3 !== nType && 8 !== nType && 2 !== nType) return 1 === nType && jQuery.isXMLDoc(elem) || (name = jQuery.propFix[name] || name, hooks = jQuery.propHooks[name]), void 0 !== value ? hooks && "set" in hooks && void 0 !== (ret = hooks.set(elem, value, name)) ? ret : elem[name] = value : hooks && "get" in hooks && null !== (ret = hooks.get(elem, name)) ? ret : elem[name]
		},
		propHooks: {
			tabIndex: {
				get: function(elem) {
					var tabindex = jQuery.find.attr(elem, "tabindex");
					return tabindex ? parseInt(tabindex, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : -1
				}
			}
		},
		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	}), support.optSelected || (jQuery.propHooks.selected = {
		get: function(elem) {
			var parent = elem.parentNode;
			return parent && parent.parentNode && parent.parentNode.selectedIndex, null
		},
		set: function(elem) {
			var parent = elem.parentNode;
			parent && (parent.selectedIndex, parent.parentNode && parent.parentNode.selectedIndex)
		}
	}), jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
		jQuery.propFix[this.toLowerCase()] = this
	});
	var rclass = /[\t\r\n\f]/g;
	jQuery.fn.extend({
		addClass: function(value) {
			var classes, elem, cur, curValue, clazz, j, finalValue, i = 0;
			if (jQuery.isFunction(value)) return this.each(function(j) {
				jQuery(this).addClass(value.call(this, j, getClass(this)))
			});
			if ("string" == typeof value && value)
				for (classes = value.match(rnotwhite) || []; elem = this[i++];)
					if (curValue = getClass(elem), cur = 1 === elem.nodeType && (" " + curValue + " ").replace(rclass, " ")) {
						for (j = 0; clazz = classes[j++];) cur.indexOf(" " + clazz + " ") < 0 && (cur += clazz + " ");
						finalValue = jQuery.trim(cur), curValue !== finalValue && elem.setAttribute("class", finalValue)
					}
			return this
		},
		removeClass: function(value) {
			var classes, elem, cur, curValue, clazz, j, finalValue, i = 0;
			if (jQuery.isFunction(value)) return this.each(function(j) {
				jQuery(this).removeClass(value.call(this, j, getClass(this)))
			});
			if (!arguments.length) return this.attr("class", "");
			if ("string" == typeof value && value)
				for (classes = value.match(rnotwhite) || []; elem = this[i++];)
					if (curValue = getClass(elem), cur = 1 === elem.nodeType && (" " + curValue + " ").replace(rclass, " ")) {
						for (j = 0; clazz = classes[j++];)
							for (; cur.indexOf(" " + clazz + " ") > -1;) cur = cur.replace(" " + clazz + " ", " ");
						finalValue = jQuery.trim(cur), curValue !== finalValue && elem.setAttribute("class", finalValue)
					}
			return this
		},
		toggleClass: function(value, stateVal) {
			var type = typeof value;
			return "boolean" == typeof stateVal && "string" === type ? stateVal ? this.addClass(value) : this.removeClass(value) : this.each(jQuery.isFunction(value) ? function(i) {
				jQuery(this).toggleClass(value.call(this, i, getClass(this), stateVal), stateVal)
			} : function() {
				var className, i, self, classNames;
				if ("string" === type)
					for (i = 0, self = jQuery(this), classNames = value.match(rnotwhite) || []; className = classNames[i++];) self.hasClass(className) ? self.removeClass(className) : self.addClass(className);
				else(void 0 === value || "boolean" === type) && (className = getClass(this), className && dataPriv.set(this, "__className__", className), this.setAttribute && this.setAttribute("class", className || value === !1 ? "" : dataPriv.get(this, "__className__") || ""))
			})
		},
		hasClass: function(selector) {
			var className, elem, i = 0;
			for (className = " " + selector + " "; elem = this[i++];)
				if (1 === elem.nodeType && (" " + getClass(elem) + " ").replace(rclass, " ").indexOf(className) > -1) return !0;
			return !1
		}
	});
	var rreturn = /\r/g,
		rspaces = /[\x20\t\r\n\f]+/g;
	jQuery.fn.extend({
		val: function(value) {
			var hooks, ret, isFunction, elem = this[0]; {
				if (arguments.length) return isFunction = jQuery.isFunction(value), this.each(function(i) {
					var val;
					1 === this.nodeType && (val = isFunction ? value.call(this, i, jQuery(this).val()) : value, null == val ? val = "" : "number" == typeof val ? val += "" : jQuery.isArray(val) && (val = jQuery.map(val, function(value) {
						return null == value ? "" : value + ""
					})), hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()], hooks && "set" in hooks && void 0 !== hooks.set(this, val, "value") || (this.value = val))
				});
				if (elem) return hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()], hooks && "get" in hooks && void 0 !== (ret = hooks.get(elem, "value")) ? ret : (ret = elem.value, "string" == typeof ret ? ret.replace(rreturn, "") : null == ret ? "" : ret)
			}
		}
	}), jQuery.extend({
		valHooks: {
			option: {
				get: function(elem) {
					var val = jQuery.find.attr(elem, "value");
					return null != val ? val : jQuery.trim(jQuery.text(elem)).replace(rspaces, " ")
				}
			},
			select: {
				get: function(elem) {
					for (var value, option, options = elem.options, index = elem.selectedIndex, one = "select-one" === elem.type || 0 > index, values = one ? null : [], max = one ? index + 1 : options.length, i = 0 > index ? max : one ? index : 0; max > i; i++)
						if (option = options[i], !(!option.selected && i !== index || (support.optDisabled ? option.disabled : null !== option.getAttribute("disabled")) || option.parentNode.disabled && jQuery.nodeName(option.parentNode, "optgroup"))) {
							if (value = jQuery(option).val(), one) return value;
							values.push(value)
						}
					return values
				},
				set: function(elem, value) {
					for (var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i = options.length; i--;) option = options[i], (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) && (optionSet = !0);
					return optionSet || (elem.selectedIndex = -1), values
				}
			}
		}
	}), jQuery.each(["radio", "checkbox"], function() {
		jQuery.valHooks[this] = {
			set: function(elem, value) {
				return jQuery.isArray(value) ? elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1 : void 0
			}
		}, support.checkOn || (jQuery.valHooks[this].get = function(elem) {
			return null === elem.getAttribute("value") ? "on" : elem.value
		})
	});
	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;
	jQuery.extend(jQuery.event, {
		trigger: function(event, data, elem, onlyHandlers) {
			var i, cur, tmp, bubbleType, ontype, handle, special, eventPath = [elem || document],
				type = hasOwn.call(event, "type") ? event.type : event,
				namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
			if (cur = tmp = elem = elem || document, 3 !== elem.nodeType && 8 !== elem.nodeType && !rfocusMorph.test(type + jQuery.event.triggered) && (type.indexOf(".") > -1 && (namespaces = type.split("."), type = namespaces.shift(), namespaces.sort()), ontype = type.indexOf(":") < 0 && "on" + type, event = event[jQuery.expando] ? event : new jQuery.Event(type, "object" == typeof event && event), event.isTrigger = onlyHandlers ? 2 : 3, event.namespace = namespaces.join("."), event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, event.result = void 0, event.target || (event.target = elem), data = null == data ? [event] : jQuery.makeArray(data, [event]), special = jQuery.event.special[type] || {}, onlyHandlers || !special.trigger || special.trigger.apply(elem, data) !== !1)) {
				if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
					for (bubbleType = special.delegateType || type, rfocusMorph.test(bubbleType + type) || (cur = cur.parentNode); cur; cur = cur.parentNode) eventPath.push(cur), tmp = cur;
					tmp === (elem.ownerDocument || document) && eventPath.push(tmp.defaultView || tmp.parentWindow || window)
				}
				for (i = 0;
					(cur = eventPath[i++]) && !event.isPropagationStopped();) event.type = i > 1 ? bubbleType : special.bindType || type, handle = (dataPriv.get(cur, "events") || {})[event.type] && dataPriv.get(cur, "handle"), handle && handle.apply(cur, data), handle = ontype && cur[ontype], handle && handle.apply && acceptData(cur) && (event.result = handle.apply(cur, data), event.result === !1 && event.preventDefault());
				return event.type = type, onlyHandlers || event.isDefaultPrevented() || special._default && special._default.apply(eventPath.pop(), data) !== !1 || !acceptData(elem) || ontype && jQuery.isFunction(elem[type]) && !jQuery.isWindow(elem) && (tmp = elem[ontype], tmp && (elem[ontype] = null), jQuery.event.triggered = type, elem[type](), jQuery.event.triggered = void 0, tmp && (elem[ontype] = tmp)), event.result
			}
		},
		simulate: function(type, elem, event) {
			var e = jQuery.extend(new jQuery.Event, event, {
				type: type,
				isSimulated: !0
			});
			jQuery.event.trigger(e, null, elem), e.isDefaultPrevented() && event.preventDefault()
		}
	}), jQuery.fn.extend({
		trigger: function(type, data) {
			return this.each(function() {
				jQuery.event.trigger(type, data, this)
			})
		},
		triggerHandler: function(type, data) {
			var elem = this[0];
			return elem ? jQuery.event.trigger(type, data, elem, !0) : void 0
		}
	}), jQuery.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(i, name) {
		jQuery.fn[name] = function(data, fn) {
			return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name)
		}
	}), jQuery.fn.extend({
		hover: function(fnOver, fnOut) {
			return this.mouseenter(fnOver).mouseleave(fnOut || fnOver)
		}
	}), support.focusin = "onfocusin" in window, support.focusin || jQuery.each({
		focus: "focusin",
		blur: "focusout"
	}, function(orig, fix) {
		var handler = function(event) {
			jQuery.event.simulate(fix, event.target, jQuery.event.fix(event))
		};
		jQuery.event.special[fix] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access(doc, fix);
				attaches || doc.addEventListener(orig, handler, !0), dataPriv.access(doc, fix, (attaches || 0) + 1)
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access(doc, fix) - 1;
				attaches ? dataPriv.access(doc, fix, attaches) : (doc.removeEventListener(orig, handler, !0), dataPriv.remove(doc, fix))
			}
		}
	});
	var location = window.location,
		nonce = jQuery.now(),
		rquery = /\?/;
	jQuery.parseJSON = function(data) {
		return JSON.parse(data + "")
	}, jQuery.parseXML = function(data) {
		var xml;
		if (!data || "string" != typeof data) return null;
		try {
			xml = (new window.DOMParser).parseFromString(data, "text/xml")
		} catch (e) {
			xml = void 0
		}
		return (!xml || xml.getElementsByTagName("parsererror").length) && jQuery.error("Invalid XML: " + data), xml
	};
	var rhash = /#.*$/,
		rts = /([?&])_=[^&]*/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)$/gm,
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,
		prefilters = {},
		transports = {},
		allTypes = "*/".concat("*"),
		originAnchor = document.createElement("a");
	originAnchor.href = location.href, jQuery.extend({
		active: 0,
		lastModified: {},
		etag: {},
		ajaxSettings: {
			url: location.href,
			type: "GET",
			isLocal: rlocalProtocol.test(location.protocol),
			global: !0,
			processData: !0,
			async: !0,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},
			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},
			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},
			converters: {
				"* text": String,
				"text html": !0,
				"text json": jQuery.parseJSON,
				"text xml": jQuery.parseXML
			},
			flatOptions: {
				url: !0,
				context: !0
			}
		},
		ajaxSetup: function(target, settings) {
			return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target)
		},
		ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
		ajaxTransport: addToPrefiltersOrTransports(transports),
		ajax: function(url, options) {
			function done(status, nativeStatusText, responses, headers) {
				var isSuccess, success, error, response, modified, statusText = nativeStatusText;
				2 !== state && (state = 2, timeoutTimer && window.clearTimeout(timeoutTimer), transport = void 0, responseHeadersString = headers || "", jqXHR.readyState = status > 0 ? 4 : 0, isSuccess = status >= 200 && 300 > status || 304 === status, responses && (response = ajaxHandleResponses(s, jqXHR, responses)), response = ajaxConvert(s, response, jqXHR, isSuccess), isSuccess ? (s.ifModified && (modified = jqXHR.getResponseHeader("Last-Modified"), modified && (jQuery.lastModified[cacheURL] = modified), modified = jqXHR.getResponseHeader("etag"), modified && (jQuery.etag[cacheURL] = modified)), 204 === status || "HEAD" === s.type ? statusText = "nocontent" : 304 === status ? statusText = "notmodified" : (statusText = response.state, success = response.data, error = response.error, isSuccess = !error)) : (error = statusText, (status || !statusText) && (statusText = "error", 0 > status && (status = 0))), jqXHR.status = status, jqXHR.statusText = (nativeStatusText || statusText) + "", isSuccess ? deferred.resolveWith(callbackContext, [success, statusText, jqXHR]) : deferred.rejectWith(callbackContext, [jqXHR, statusText, error]), jqXHR.statusCode(statusCode), statusCode = void 0, fireGlobals && globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error]), completeDeferred.fireWith(callbackContext, [jqXHR, statusText]), fireGlobals && (globalEventContext.trigger("ajaxComplete", [jqXHR, s]), --jQuery.active || jQuery.event.trigger("ajaxStop")))
			}
			"object" == typeof url && (options = url, url = void 0), options = options || {};
			var transport, cacheURL, responseHeadersString, responseHeaders, timeoutTimer, urlAnchor, fireGlobals, i, s = jQuery.ajaxSetup({}, options),
				callbackContext = s.context || s,
				globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event,
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks("once memory"),
				statusCode = s.statusCode || {},
				requestHeaders = {},
				requestHeadersNames = {},
				state = 0,
				strAbort = "canceled",
				jqXHR = {
					readyState: 0,
					getResponseHeader: function(key) {
						var match;
						if (2 === state) {
							if (!responseHeaders)
								for (responseHeaders = {}; match = rheaders.exec(responseHeadersString);) responseHeaders[match[1].toLowerCase()] = match[2];
							match = responseHeaders[key.toLowerCase()]
						}
						return null == match ? null : match
					},
					getAllResponseHeaders: function() {
						return 2 === state ? responseHeadersString : null
					},
					setRequestHeader: function(name, value) {
						var lname = name.toLowerCase();
						return state || (name = requestHeadersNames[lname] = requestHeadersNames[lname] || name, requestHeaders[name] = value), this
					},
					overrideMimeType: function(type) {
						return state || (s.mimeType = type), this
					},
					statusCode: function(map) {
						var code;
						if (map)
							if (2 > state)
								for (code in map) statusCode[code] = [statusCode[code], map[code]];
							else jqXHR.always(map[jqXHR.status]);
						return this
					},
					abort: function(statusText) {
						var finalText = statusText || strAbort;
						return transport && transport.abort(finalText), done(0, finalText), this
					}
				};
			if (deferred.promise(jqXHR).complete = completeDeferred.add, jqXHR.success = jqXHR.done, jqXHR.error = jqXHR.fail, s.url = ((url || s.url || location.href) + "").replace(rhash, "").replace(rprotocol, location.protocol + "//"), s.type = options.method || options.type || s.method || s.type, s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(rnotwhite) || [""], null == s.crossDomain) {
				urlAnchor = document.createElement("a");
				try {
					urlAnchor.href = s.url, urlAnchor.href = urlAnchor.href, s.crossDomain = originAnchor.protocol + "//" + originAnchor.host != urlAnchor.protocol + "//" + urlAnchor.host
				} catch (e) {
					s.crossDomain = !0
				}
			}
			if (s.data && s.processData && "string" != typeof s.data && (s.data = jQuery.param(s.data, s.traditional)), inspectPrefiltersOrTransports(prefilters, s, options, jqXHR), 2 === state) return jqXHR;
			fireGlobals = jQuery.event && s.global, fireGlobals && 0 === jQuery.active++ && jQuery.event.trigger("ajaxStart"), s.type = s.type.toUpperCase(), s.hasContent = !rnoContent.test(s.type), cacheURL = s.url, s.hasContent || (s.data && (cacheURL = s.url += (rquery.test(cacheURL) ? "&" : "?") + s.data, delete s.data), s.cache === !1 && (s.url = rts.test(cacheURL) ? cacheURL.replace(rts, "$1_=" + nonce++) : cacheURL + (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce++)), s.ifModified && (jQuery.lastModified[cacheURL] && jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]), jQuery.etag[cacheURL] && jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL])), (s.data && s.hasContent && s.contentType !== !1 || options.contentType) && jqXHR.setRequestHeader("Content-Type", s.contentType), jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + ("*" !== s.dataTypes[0] ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);
			for (i in s.headers) jqXHR.setRequestHeader(i, s.headers[i]);
			if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === !1 || 2 === state)) return jqXHR.abort();
			strAbort = "abort";
			for (i in {
					success: 1,
					error: 1,
					complete: 1
				}) jqXHR[i](s[i]);
			if (transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR)) {
				if (jqXHR.readyState = 1, fireGlobals && globalEventContext.trigger("ajaxSend", [jqXHR, s]), 2 === state) return jqXHR;
				s.async && s.timeout > 0 && (timeoutTimer = window.setTimeout(function() {
					jqXHR.abort("timeout")
				}, s.timeout));
				try {
					state = 1, transport.send(requestHeaders, done)
				} catch (e) {
					if (!(2 > state)) throw e;
					done(-1, e)
				}
			} else done(-1, "No Transport");
			return jqXHR
		},
		getJSON: function(url, data, callback) {
			return jQuery.get(url, data, callback, "json")
		},
		getScript: function(url, callback) {
			return jQuery.get(url, void 0, callback, "script")
		}
	}), jQuery.each(["get", "post"], function(i, method) {
		jQuery[method] = function(url, data, callback, type) {
			return jQuery.isFunction(data) && (type = type || callback, callback = data, data = void 0), jQuery.ajax(jQuery.extend({
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject(url) && url))
		}
	}), jQuery._evalUrl = function(url) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: !1,
			global: !1,
			"throws": !0
		})
	}, jQuery.fn.extend({
		wrapAll: function(html) {
			var wrap;
			return jQuery.isFunction(html) ? this.each(function(i) {
				jQuery(this).wrapAll(html.call(this, i))
			}) : (this[0] && (wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && wrap.insertBefore(this[0]), wrap.map(function() {
				for (var elem = this; elem.firstElementChild;) elem = elem.firstElementChild;
				return elem
			}).append(this)), this)
		},
		wrapInner: function(html) {
			return this.each(jQuery.isFunction(html) ? function(i) {
				jQuery(this).wrapInner(html.call(this, i))
			} : function() {
				var self = jQuery(this),
					contents = self.contents();
				contents.length ? contents.wrapAll(html) : self.append(html)
			})
		},
		wrap: function(html) {
			var isFunction = jQuery.isFunction(html);
			return this.each(function(i) {
				jQuery(this).wrapAll(isFunction ? html.call(this, i) : html)
			})
		},
		unwrap: function() {
			return this.parent().each(function() {
				jQuery.nodeName(this, "body") || jQuery(this).replaceWith(this.childNodes)
			}).end()
		}
	}), jQuery.expr.filters.hidden = function(elem) {
		return !jQuery.expr.filters.visible(elem)
	}, jQuery.expr.filters.visible = function(elem) {
		return elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0
	};
	var r20 = /%20/g,
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;
	jQuery.param = function(a, traditional) {
		var prefix, s = [],
			add = function(key, value) {
				value = jQuery.isFunction(value) ? value() : null == value ? "" : value, s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value)
			};
		if (void 0 === traditional && (traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional), jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) jQuery.each(a, function() {
			add(this.name, this.value)
		});
		else
			for (prefix in a) buildParams(prefix, a[prefix], traditional, add);
		return s.join("&").replace(r20, "+")
	}, jQuery.fn.extend({
		serialize: function() {
			return jQuery.param(this.serializeArray())
		},
		serializeArray: function() {
			return this.map(function() {
				var elements = jQuery.prop(this, "elements");
				return elements ? jQuery.makeArray(elements) : this
			}).filter(function() {
				var type = this.type;
				return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type))
			}).map(function(i, elem) {
				var val = jQuery(this).val();
				return null == val ? null : jQuery.isArray(val) ? jQuery.map(val, function(val) {
					return {
						name: elem.name,
						value: val.replace(rCRLF, "\r\n")
					}
				}) : {
					name: elem.name,
					value: val.replace(rCRLF, "\r\n")
				}
			}).get()
		}
	}), jQuery.ajaxSettings.xhr = function() {
		try {
			return new window.XMLHttpRequest
		} catch (e) {}
	};
	var xhrSuccessStatus = {
			0: 200,
			1223: 204
		},
		xhrSupported = jQuery.ajaxSettings.xhr();
	support.cors = !!xhrSupported && "withCredentials" in xhrSupported, support.ajax = xhrSupported = !!xhrSupported, jQuery.ajaxTransport(function(options) {
		var callback, errorCallback;
		return support.cors || xhrSupported && !options.crossDomain ? {
			send: function(headers, complete) {
				var i, xhr = options.xhr();
				if (xhr.open(options.type, options.url, options.async, options.username, options.password), options.xhrFields)
					for (i in options.xhrFields) xhr[i] = options.xhrFields[i];
				options.mimeType && xhr.overrideMimeType && xhr.overrideMimeType(options.mimeType), options.crossDomain || headers["X-Requested-With"] || (headers["X-Requested-With"] = "XMLHttpRequest");
				for (i in headers) xhr.setRequestHeader(i, headers[i]);
				callback = function(type) {
					return function() {
						callback && (callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.onreadystatechange = null, "abort" === type ? xhr.abort() : "error" === type ? "number" != typeof xhr.status ? complete(0, "error") : complete(xhr.status, xhr.statusText) : complete(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText, "text" !== (xhr.responseType || "text") || "string" != typeof xhr.responseText ? {
							binary: xhr.response
						} : {
							text: xhr.responseText
						}, xhr.getAllResponseHeaders()))
					}
				}, xhr.onload = callback(), errorCallback = xhr.onerror = callback("error"), void 0 !== xhr.onabort ? xhr.onabort = errorCallback : xhr.onreadystatechange = function() {
					4 === xhr.readyState && window.setTimeout(function() {
						callback && errorCallback()
					})
				}, callback = callback("abort");
				try {
					xhr.abort();
					xhr.send(options.hasContent && options.data || null)
				} catch (e) {
					if (callback) throw e
				}
			},
			abort: function() {
				callback && callback()
			}
		} : void 0
	}), jQuery.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function(text) {
				return jQuery.globalEval(text), text
			}
		}
	}), jQuery.ajaxPrefilter("script", function(s) {
		void 0 === s.cache && (s.cache = !1), s.crossDomain && (s.type = "GET")
	}), jQuery.ajaxTransport("script", function(s) {
		if (s.crossDomain) {
			var script, callback;
			return {
				send: function(_, complete) {
					script = jQuery("<script>").prop({
						charset: s.scriptCharset,
						src: s.url
					}).on("load error", callback = function(evt) {
						script.remove(), callback = null, evt && complete("error" === evt.type ? 404 : 200, evt.type)
					}), document.head.appendChild(script[0])
				},
				abort: function() {
					callback && callback()
				}
			}
		}
	});
	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;
	jQuery.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function() {
			var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce++;
			return this[callback] = !0, callback
		}
	}), jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
		var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== !1 && (rjsonp.test(s.url) ? "url" : "string" == typeof s.data && 0 === (s.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(s.data) && "data");
		return jsonProp || "jsonp" === s.dataTypes[0] ? (callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, jsonProp ? s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName) : s.jsonp !== !1 && (s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName), s.converters["script json"] = function() {
			return responseContainer || jQuery.error(callbackName + " was not called"), responseContainer[0]
		}, s.dataTypes[0] = "json", overwritten = window[callbackName], window[callbackName] = function() {
			responseContainer = arguments
		}, jqXHR.always(function() {
			void 0 === overwritten ? jQuery(window).removeProp(callbackName) : window[callbackName] = overwritten, s[callbackName] && (s.jsonpCallback = originalSettings.jsonpCallback, oldCallbacks.push(callbackName)), responseContainer && jQuery.isFunction(overwritten) && overwritten(responseContainer[0]), responseContainer = overwritten = void 0
		}), "script") : void 0
	}), jQuery.parseHTML = function(data, context, keepScripts) {
		if (!data || "string" != typeof data) return null;
		"boolean" == typeof context && (keepScripts = context, context = !1), context = context || document;
		var parsed = rsingleTag.exec(data),
			scripts = !keepScripts && [];
		return parsed ? [context.createElement(parsed[1])] : (parsed = buildFragment([data], context, scripts), scripts && scripts.length && jQuery(scripts).remove(), jQuery.merge([], parsed.childNodes))
	};
	var _load = jQuery.fn.load;
	jQuery.fn.load = function(url, params, callback) {
		if ("string" != typeof url && _load) return _load.apply(this, arguments);
		var selector, type, response, self = this,
			off = url.indexOf(" ");
		return off > -1 && (selector = jQuery.trim(url.slice(off)), url = url.slice(0, off)), jQuery.isFunction(params) ? (callback = params, params = void 0) : params && "object" == typeof params && (type = "POST"), self.length > 0 && jQuery.ajax({
			url: url,
			type: type || "GET",
			dataType: "html",
			data: params
		}).done(function(responseText) {
			response = arguments, self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText)
		}).always(callback && function(jqXHR, status) {
			self.each(function() {
				callback.apply(this, response || [jqXHR.responseText, status, jqXHR])
			})
		}), this
	}, jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(i, type) {
		jQuery.fn[type] = function(fn) {
			return this.on(type, fn)
		}
	}), jQuery.expr.filters.animated = function(elem) {
		return jQuery.grep(jQuery.timers, function(fn) {
			return elem === fn.elem
		}).length
	}, jQuery.offset = {
		setOffset: function(elem, options, i) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery.css(elem, "position"),
				curElem = jQuery(elem),
				props = {};
			"static" === position && (elem.style.position = "relative"), curOffset = curElem.offset(), curCSSTop = jQuery.css(elem, "top"), curCSSLeft = jQuery.css(elem, "left"), calculatePosition = ("absolute" === position || "fixed" === position) && (curCSSTop + curCSSLeft).indexOf("auto") > -1, calculatePosition ? (curPosition = curElem.position(), curTop = curPosition.top, curLeft = curPosition.left) : (curTop = parseFloat(curCSSTop) || 0, curLeft = parseFloat(curCSSLeft) || 0), jQuery.isFunction(options) && (options = options.call(elem, i, jQuery.extend({}, curOffset))), null != options.top && (props.top = options.top - curOffset.top + curTop), null != options.left && (props.left = options.left - curOffset.left + curLeft), "using" in options ? options.using.call(elem, props) : curElem.css(props)
		}
	}, jQuery.fn.extend({
		offset: function(options) {
			if (arguments.length) return void 0 === options ? this : this.each(function(i) {
				jQuery.offset.setOffset(this, options, i)
			});
			var docElem, win, elem = this[0],
				box = {
					top: 0,
					left: 0
				},
				doc = elem && elem.ownerDocument;
			if (doc) return docElem = doc.documentElement, jQuery.contains(docElem, elem) ? (box = elem.getBoundingClientRect(), win = getWindow(doc), {
				top: box.top + win.pageYOffset - docElem.clientTop,
				left: box.left + win.pageXOffset - docElem.clientLeft
			}) : box
		},
		position: function() {
			if (this[0]) {
				var offsetParent, offset, elem = this[0],
					parentOffset = {
						top: 0,
						left: 0
					};
				return "fixed" === jQuery.css(elem, "position") ? offset = elem.getBoundingClientRect() : (offsetParent = this.offsetParent(), offset = this.offset(), jQuery.nodeName(offsetParent[0], "html") || (parentOffset = offsetParent.offset()), parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", !0), parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", !0)), {
					top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", !0),
					left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", !0)
				}
			}
		},
		offsetParent: function() {
			return this.map(function() {
				for (var offsetParent = this.offsetParent; offsetParent && "static" === jQuery.css(offsetParent, "position");) offsetParent = offsetParent.offsetParent;
				return offsetParent || documentElement
			})
		}
	}), jQuery.each({
		scrollLeft: "pageXOffset",
		scrollTop: "pageYOffset"
	}, function(method, prop) {
		var top = "pageYOffset" === prop;
		jQuery.fn[method] = function(val) {
			return access(this, function(elem, method, val) {
				var win = getWindow(elem);
				return void 0 === val ? win ? win[prop] : elem[method] : void(win ? win.scrollTo(top ? win.pageXOffset : val, top ? val : win.pageYOffset) : elem[method] = val)
			}, method, val, arguments.length)
		}
	}), jQuery.each(["top", "left"], function(i, prop) {
		jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function(elem, computed) {
			return computed ? (computed = curCSS(elem, prop), rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed) : void 0
		})
	}), jQuery.each({
		Height: "height",
		Width: "width"
	}, function(name, type) {
		jQuery.each({
			padding: "inner" + name,
			content: type,
			"": "outer" + name
		}, function(defaultExtra, funcName) {
			jQuery.fn[funcName] = function(margin, value) {
				var chainable = arguments.length && (defaultExtra || "boolean" != typeof margin),
					extra = defaultExtra || (margin === !0 || value === !0 ? "margin" : "border");
				return access(this, function(elem, type, value) {
					var doc;
					return jQuery.isWindow(elem) ? elem.document.documentElement["client" + name] : 9 === elem.nodeType ? (doc = elem.documentElement, Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name])) : void 0 === value ? jQuery.css(elem, type, extra) : jQuery.style(elem, type, value, extra)
				}, type, chainable ? margin : void 0, chainable, null)
			}
		})
	}), jQuery.fn.extend({
		bind: function(types, data, fn) {
			return this.on(types, null, data, fn)
		},
		unbind: function(types, fn) {
			return this.off(types, null, fn)
		},
		delegate: function(selector, types, data, fn) {
			return this.on(types, selector, data, fn)
		},
		undelegate: function(selector, types, fn) {
			return 1 === arguments.length ? this.off(selector, "**") : this.off(types, selector || "**", fn)
		},
		size: function() {
			return this.length
		}
	}), jQuery.fn.andSelf = jQuery.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
		return jQuery
	});
	var _jQuery = window.jQuery,
		_$ = window.$;
	return jQuery.noConflict = function(deep) {
		return window.$ === jQuery && (window.$ = _$), deep && window.jQuery === jQuery && (window.jQuery = _jQuery), jQuery
	}, noGlobal || (window.jQuery = window.$ = jQuery), jQuery
}),
function($, window) {
	"use strict";
	var defaults = {
			ratio: 16 / 9,
			videoId: "116244713",
			mute: !0,
			repeat: !0,
			width: $(window).width(),
			start: 0,
			end: !1,
			videoQuality: "hd1080",
			relatedVideos: 0,
			wrapperZindex: 99
		},
		backgroundvideo = function(node, options) {
			function determineProvider() {
				var a = document.createElement("a");
				if (a.href = options.videoId, /youtube.com/.test(options.videoId)) setupYoutube();
				else if (/vimeo.com/.test(options.videoId)) setupVimeo();
				else {
					if (!/[-A-Za-z0-9_]+/.test(options.videoId)) throw "backgroundVideo: Invalid video source";
					var id = new String(options.videoId.match(/[-A-Za-z0-9_]+/));
					11 == id.length ? setupYoutube() : setupVimeo()
				}
			}

			function setupYoutube() {
				window.onYouTubeIframeAPIReady = function() {
					window.player = new YT.Player("background-player", {
						width: options.width,
						height: Math.ceil(options.width / options.ratio),
						videoId: options.videoId,
						playerVars: {
							controls: 0,
							showinfo: 0,
							modestbranding: 1,
							iv_load_policy: 3,
							wmode: "transparent",
							vq: options.videoQuality,
							rel: options.relatedVideos,
							end: options.end
						},
						events: {
							onReady: onPlayerReady,
							onStateChange: onPlayerStateChange
						}
					})
				}, window.onPlayerReady = function(e) {
					resize(), options.mute && e.target.mute(), e.target.seekTo(options.start), e.target.playVideo()
				}, window.onPlayerStateChange = function(state) {
					0 === state.data && options.repeat && player.seekTo(options.start)
				}, addScript("https://www.youtube.com/iframe_api")
			}

			function setupVimeo() {
				$("#background-player").replaceWith(function() {
					return '<iframe src="//player.vimeo.com/video/' + options.videoId + "?api=1&title=0&byline=0&portrait=0&playbar=0&loop=" + options.repeat + '&autoplay=1&player_id=background-player" frameborder="0" id="background-player"></iframe>'
				}), resize(), $("#background-player").on("load", function() {
					addScript("//origin-assets.vimeo.com/js/froogaloop2.min.js", vimeoReady)
				})
			}

			function vimeoReady() {
				var iframe = $("#background-player")[0],
					player = $f(iframe);
				player.api("setVolume", 0)
			}

			function addScript(source, callback) {
				var tag = document.createElement("script");
				callback && (tag.readyState ? tag.onreadystatechange = function() {
					("loaded" === tag.readyState || "complete" === tag.readyState) && (tag.onreadystatechange = null, callback())
				} : tag.onload = function() {
					callback()
				}), tag.src = source;
				var firstScriptTag = document.getElementsByTagName("script")[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
			}

			function resize() {
				var playerWidth, playerHeight, width = $(window).width(),
					height = $(window).height(),
					player = $("#background-player");
				width / options.ratio < height ? (playerWidth = Math.ceil(height * options.ratio), player.width(playerWidth).height(height).css({
					left: (width - playerWidth) / 2,
					top: 0
				})) : (playerHeight = Math.ceil(width / options.ratio), player.width(width).height(playerHeight).css({
					left: 0,
					top: (height - playerHeight) / 2
				}))
			}
			var options = $.extend({}, defaults, options),
				body = $("body"),
				node = $("node"),
				backgroundContainer = '<div id="background-container"style="overflow: hidden; position: fixed; z-index: 1; width: 100%; height: 100%"><div id="background-player" style="position: absolute"></div></div>';
			$("html, body").css({
				width: "100%",
				height: "100%"
			}), body.prepend(backgroundContainer), node.css({
				position: "relative",
				"z-index": options.wrapperZindex
			}), determineProvider(), $(window).on("resize.backgroundvideo", resize)
		};
	$.fn.backgroundvideo = function(options) {
		return this.each(function() {
			$.data(this, "backgroundvideo_instantiated") || $.data(this, "backgroundvideo_instantiated", backgroundvideo(this, options))
		})
	}
}(jQuery, window),
function(root, factory) {
	"function" == typeof define && define.amd ? define(factory) : "object" == typeof exports ? module.exports = factory() : root.PhotoSwipe = factory()
}(this, function() {
	"use strict";
	var PhotoSwipe = function(template, UiClass, items, options) {
		var framework = {
			features: null,
			bind: function(target, type, listener, unbind) {
				var methodName = (unbind ? "remove" : "add") + "EventListener";
				type = type.split(" ");
				for (var i = 0; i < type.length; i++) type[i] && target[methodName](type[i], listener, !1)
			},
			isArray: function(obj) {
				return obj instanceof Array
			},
			createEl: function(classes, tag) {
				var el = document.createElement(tag || "div");
				return classes && (el.className = classes), el
			},
			getScrollY: function() {
				var yOffset = window.pageYOffset;
				return void 0 !== yOffset ? yOffset : document.documentElement.scrollTop
			},
			unbind: function(target, type, listener) {
				framework.bind(target, type, listener, !0)
			},
			removeClass: function(el, className) {
				var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
				el.className = el.className.replace(reg, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "")
			},
			addClass: function(el, className) {
				framework.hasClass(el, className) || (el.className += (el.className ? " " : "") + className)
			},
			hasClass: function(el, className) {
				return el.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(el.className)
			},
			getChildByClass: function(parentEl, childClassName) {
				for (var node = parentEl.firstChild; node;) {
					if (framework.hasClass(node, childClassName)) return node;
					node = node.nextSibling
				}
			},
			arraySearch: function(array, value, key) {
				for (var i = array.length; i--;)
					if (array[i][key] === value) return i;
				return -1
			},
			extend: function(o1, o2, preventOverwrite) {
				for (var prop in o2)
					if (o2.hasOwnProperty(prop)) {
						if (preventOverwrite && o1.hasOwnProperty(prop)) continue;
						o1[prop] = o2[prop]
					}
			},
			easing: {
				sine: {
					out: function(k) {
						return Math.sin(k * (Math.PI / 2))
					},
					inOut: function(k) {
						return -(Math.cos(Math.PI * k) - 1) / 2
					}
				},
				cubic: {
					out: function(k) {
						return --k * k * k + 1
					}
				}
			},
			detectFeatures: function() {
				if (framework.features) return framework.features;
				var helperEl = framework.createEl(),
					helperStyle = helperEl.style,
					vendor = "",
					features = {};
				if (features.oldIE = document.all && !document.addEventListener, features.touch = "ontouchstart" in window, window.requestAnimationFrame && (features.raf = window.requestAnimationFrame, features.caf = window.cancelAnimationFrame), features.pointerEvent = navigator.pointerEnabled || navigator.msPointerEnabled, !features.pointerEvent) {
					var ua = navigator.userAgent;
					if (/iP(hone|od)/.test(navigator.platform)) {
						var v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
						v && v.length > 0 && (v = parseInt(v[1], 10), v >= 1 && 8 > v && (features.isOldIOSPhone = !0))
					}
					var match = ua.match(/Android\s([0-9\.]*)/),
						androidversion = match ? match[1] : 0;
					androidversion = parseFloat(androidversion), androidversion >= 1 && (4.4 > androidversion && (features.isOldAndroid = !0), features.androidVersion = androidversion), features.isMobileOpera = /opera mini|opera mobi/i.test(ua)
				}
				for (var styleCheckItem, styleName, styleChecks = ["transform", "perspective", "animationName"], vendors = ["", "webkit", "Moz", "ms", "O"], i = 0; 4 > i; i++) {
					vendor = vendors[i];
					for (var a = 0; 3 > a; a++) styleCheckItem = styleChecks[a], styleName = vendor + (vendor ? styleCheckItem.charAt(0).toUpperCase() + styleCheckItem.slice(1) : styleCheckItem), !features[styleCheckItem] && styleName in helperStyle && (features[styleCheckItem] = styleName);
					vendor && !features.raf && (vendor = vendor.toLowerCase(), features.raf = window[vendor + "RequestAnimationFrame"], features.raf && (features.caf = window[vendor + "CancelAnimationFrame"] || window[vendor + "CancelRequestAnimationFrame"]))
				}
				if (!features.raf) {
					var lastTime = 0;
					features.raf = function(fn) {
						var currTime = (new Date).getTime(),
							timeToCall = Math.max(0, 16 - (currTime - lastTime)),
							id = window.setTimeout(function() {
								fn(currTime + timeToCall)
							}, timeToCall);
						return lastTime = currTime + timeToCall, id
					}, features.caf = function(id) {
						clearTimeout(id)
					}
				}
				return features.svg = !!document.createElementNS && !!document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect, framework.features = features, features
			}
		};
		framework.detectFeatures(), framework.features.oldIE && (framework.bind = function(target, type, listener, unbind) {
			type = type.split(" ");
			for (var evName, methodName = (unbind ? "detach" : "attach") + "Event", _handleEv = function() {
					listener.handleEvent.call(listener)
				}, i = 0; i < type.length; i++)
				if (evName = type[i])
					if ("object" == typeof listener && listener.handleEvent) {
						if (unbind) {
							if (!listener["oldIE" + evName]) return !1
						} else listener["oldIE" + evName] = _handleEv;
						target[methodName]("on" + evName, listener["oldIE" + evName])
					} else target[methodName]("on" + evName, listener)
		});
		var self = this,
			DOUBLE_TAP_RADIUS = 25,
			NUM_HOLDERS = 3,
			_options = {
				allowPanToNext: !0,
				spacing: .12,
				bgOpacity: 1,
				mouseUsed: !1,
				loop: !0,
				pinchToClose: !0,
				closeOnScroll: !0,
				closeOnVerticalDrag: !0,
				verticalDragRange: .75,
				hideAnimationDuration: 333,
				showAnimationDuration: 333,
				showHideOpacity: !1,
				focus: !0,
				escKey: !0,
				arrowKeys: !0,
				mainScrollEndFriction: .35,
				panEndFriction: .35,
				isClickableElement: function(el) {
					return "A" === el.tagName
				},
				getDoubleTapZoom: function(isMouseClick, item) {
					return isMouseClick ? 1 : item.initialZoomLevel < .7 ? 1 : 1.33
				},
				maxSpreadZoom: 1.33,
				modal: !0,
				scaleMode: "fit"
			};
		framework.extend(_options, options);
		var _isOpen, _isDestroying, _closedByScroll, _currentItemIndex, _containerStyle, _containerShiftIndex, _upMoveEvents, _downEvents, _globalEventHandlers, _currZoomLevel, _startZoomLevel, _translatePrefix, _translateSufix, _updateSizeInterval, _itemsNeedUpdate, _itemHolders, _prevItemIndex, _dragStartEvent, _dragMoveEvent, _dragEndEvent, _dragCancelEvent, _transformKey, _pointerEventEnabled, _likelyTouchDevice, _requestAF, _cancelAF, _initalClassName, _initalWindowScrollY, _oldIE, _currentWindowScrollY, _features, _gestureStartTime, _gestureCheckSpeedTime, _releaseAnimData, _isZoomingIn, _verticalDragInitiated, _oldAndroidTouchEndTimeout, _isDragging, _isMultitouch, _zoomStarted, _moved, _dragAnimFrame, _mainScrollShifted, _currentPoints, _isZooming, _currPointsDistance, _startPointsDistance, _currPanBounds, _currZoomElementStyle, _mainScrollAnimating, _direction, _isFirstMove, _opacityChanged, _bgOpacity, _wasOverInitialZoom, _tempCounter, _getEmptyPoint = function() {
				return {
					x: 0,
					y: 0
				}
			},
			_currPanDist = _getEmptyPoint(),
			_startPanOffset = _getEmptyPoint(),
			_panOffset = _getEmptyPoint(),
			_viewportSize = {},
			_currPositionIndex = 0,
			_offset = {},
			_slideSize = _getEmptyPoint(),
			_indexDiff = 0,
			_isFixedPosition = !0,
			_modules = [],
			_windowVisibleSize = {},
			_renderMaxResolution = !1,
			_registerModule = function(name, module) {
				framework.extend(self, module.publicMethods), _modules.push(name)
			},
			_getLoopedId = function(index) {
				var numSlides = _getNumItems();
				return index > numSlides - 1 ? index - numSlides : 0 > index ? numSlides + index : index
			},
			_listeners = {},
			_listen = function(name, fn) {
				return _listeners[name] || (_listeners[name] = []), _listeners[name].push(fn)
			},
			_shout = function(name) {
				var listeners = _listeners[name];
				if (listeners) {
					var args = Array.prototype.slice.call(arguments);
					args.shift();
					for (var i = 0; i < listeners.length; i++) listeners[i].apply(self, args)
				}
			},
			_getCurrentTime = function() {
				return (new Date).getTime()
			},
			_applyBgOpacity = function(opacity) {
				_bgOpacity = opacity, self.bg.style.opacity = opacity * _options.bgOpacity
			},
			_applyZoomTransform = function(styleObj, x, y, zoom, item) {
				(!_renderMaxResolution || item && item !== self.currItem) && (zoom /= item ? item.fitRatio : self.currItem.fitRatio), styleObj[_transformKey] = _translatePrefix + x + "px, " + y + "px" + _translateSufix + " scale(" + zoom + ")"
			},
			_applyCurrentZoomPan = function(allowRenderResolution) {
				_currZoomElementStyle && (allowRenderResolution && (_currZoomLevel > self.currItem.fitRatio ? _renderMaxResolution || (_setImageSize(self.currItem, !1, !0), _renderMaxResolution = !0) : _renderMaxResolution && (_setImageSize(self.currItem), _renderMaxResolution = !1)), _applyZoomTransform(_currZoomElementStyle, _panOffset.x, _panOffset.y, _currZoomLevel))
			},
			_applyZoomPanToItem = function(item) {
				item.container && _applyZoomTransform(item.container.style, item.initialPosition.x, item.initialPosition.y, item.initialZoomLevel, item)
			},
			_setTranslateX = function(x, elStyle) {
				elStyle[_transformKey] = _translatePrefix + x + "px, 0px" + _translateSufix
			},
			_moveMainScroll = function(x, dragging) {
				if (!_options.loop && dragging) {
					var newSlideIndexOffset = _currentItemIndex + (_slideSize.x * _currPositionIndex - x) / _slideSize.x,
						delta = Math.round(x - _mainScrollPos.x);
					(0 > newSlideIndexOffset && delta > 0 || newSlideIndexOffset >= _getNumItems() - 1 && 0 > delta) && (x = _mainScrollPos.x + delta * _options.mainScrollEndFriction)
				}
				_mainScrollPos.x = x, _setTranslateX(x, _containerStyle)
			},
			_calculatePanOffset = function(axis, zoomLevel) {
				var m = _midZoomPoint[axis] - _offset[axis];
				return _startPanOffset[axis] + _currPanDist[axis] + m - m * (zoomLevel / _startZoomLevel)
			},
			_equalizePoints = function(p1, p2) {
				p1.x = p2.x, p1.y = p2.y, p2.id && (p1.id = p2.id)
			},
			_roundPoint = function(p) {
				p.x = Math.round(p.x), p.y = Math.round(p.y)
			},
			_mouseMoveTimeout = null,
			_onFirstMouseMove = function() {
				_mouseMoveTimeout && (framework.unbind(document, "mousemove", _onFirstMouseMove), framework.addClass(template, "pswp--has_mouse"), _options.mouseUsed = !0, _shout("mouseUsed")), _mouseMoveTimeout = setTimeout(function() {
					_mouseMoveTimeout = null
				}, 100)
			},
			_bindEvents = function() {
				framework.bind(document, "keydown", self), _features.transform && framework.bind(self.scrollWrap, "click", self), _options.mouseUsed || framework.bind(document, "mousemove", _onFirstMouseMove), framework.bind(window, "resize scroll", self), _shout("bindEvents")
			},
			_unbindEvents = function() {
				framework.unbind(window, "resize", self), framework.unbind(window, "scroll", _globalEventHandlers.scroll), framework.unbind(document, "keydown", self), framework.unbind(document, "mousemove", _onFirstMouseMove), _features.transform && framework.unbind(self.scrollWrap, "click", self), _isDragging && framework.unbind(window, _upMoveEvents, self), _shout("unbindEvents")
			},
			_calculatePanBounds = function(zoomLevel, update) {
				var bounds = _calculateItemSize(self.currItem, _viewportSize, zoomLevel);
				return update && (_currPanBounds = bounds), bounds
			},
			_getMinZoomLevel = function(item) {
				return item || (item = self.currItem), item.initialZoomLevel
			},
			_getMaxZoomLevel = function(item) {
				return item || (item = self.currItem), item.w > 0 ? _options.maxSpreadZoom : 1
			},
			_modifyDestPanOffset = function(axis, destPanBounds, destPanOffset, destZoomLevel) {
				return destZoomLevel === self.currItem.initialZoomLevel ? (destPanOffset[axis] = self.currItem.initialPosition[axis], !0) : (destPanOffset[axis] = _calculatePanOffset(axis, destZoomLevel), destPanOffset[axis] > destPanBounds.min[axis] ? (destPanOffset[axis] = destPanBounds.min[axis], !0) : destPanOffset[axis] < destPanBounds.max[axis] ? (destPanOffset[axis] = destPanBounds.max[axis], !0) : !1)
			},
			_setupTransforms = function() {
				if (_transformKey) {
					var allow3dTransform = _features.perspective && !_likelyTouchDevice;
					return _translatePrefix = "translate" + (allow3dTransform ? "3d(" : "("), void(_translateSufix = _features.perspective ? ", 0px)" : ")")
				}
				_transformKey = "left", framework.addClass(template, "pswp--ie"), _setTranslateX = function(x, elStyle) {
					elStyle.left = x + "px"
				}, _applyZoomPanToItem = function(item) {
					var zoomRatio = item.fitRatio > 1 ? 1 : item.fitRatio,
						s = item.container.style,
						w = zoomRatio * item.w,
						h = zoomRatio * item.h;
					s.width = w + "px", s.height = h + "px", s.left = item.initialPosition.x + "px", s.top = item.initialPosition.y + "px"
				}, _applyCurrentZoomPan = function() {
					if (_currZoomElementStyle) {
						var s = _currZoomElementStyle,
							item = self.currItem,
							zoomRatio = item.fitRatio > 1 ? 1 : item.fitRatio,
							w = zoomRatio * item.w,
							h = zoomRatio * item.h;
						s.width = w + "px", s.height = h + "px", s.left = _panOffset.x + "px", s.top = _panOffset.y + "px"
					}
				}
			},
			_onKeyDown = function(e) {
				var keydownAction = "";
				_options.escKey && 27 === e.keyCode ? keydownAction = "close" : _options.arrowKeys && (37 === e.keyCode ? keydownAction = "prev" : 39 === e.keyCode && (keydownAction = "next")), keydownAction && (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey || (e.preventDefault ? e.preventDefault() : e.returnValue = !1, self[keydownAction]()))
			},
			_onGlobalClick = function(e) {
				e && (_moved || _zoomStarted || _mainScrollAnimating || _verticalDragInitiated) && (e.preventDefault(), e.stopPropagation())
			},
			_updatePageScrollOffset = function() {
				self.setScrollOffset(0, framework.getScrollY())
			},
			_animations = {},
			_numAnimations = 0,
			_stopAnimation = function(name) {
				_animations[name] && (_animations[name].raf && _cancelAF(_animations[name].raf), _numAnimations--, delete _animations[name])
			},
			_registerStartAnimation = function(name) {
				_animations[name] && _stopAnimation(name), _animations[name] || (_numAnimations++, _animations[name] = {})
			},
			_stopAllAnimations = function() {
				for (var prop in _animations) _animations.hasOwnProperty(prop) && _stopAnimation(prop)
			},
			_animateProp = function(name, b, endProp, d, easingFn, onUpdate, onComplete) {
				var t, startAnimTime = _getCurrentTime();
				_registerStartAnimation(name);
				var animloop = function() {
					if (_animations[name]) {
						if (t = _getCurrentTime() - startAnimTime, t >= d) return _stopAnimation(name), onUpdate(endProp), void(onComplete && onComplete());
						onUpdate((endProp - b) * easingFn(t / d) + b), _animations[name].raf = _requestAF(animloop)
					}
				};
				animloop()
			},
			publicMethods = {
				shout: _shout,
				listen: _listen,
				viewportSize: _viewportSize,
				options: _options,
				isMainScrollAnimating: function() {
					return _mainScrollAnimating
				},
				getZoomLevel: function() {
					return _currZoomLevel
				},
				getCurrentIndex: function() {
					return _currentItemIndex
				},
				isDragging: function() {
					return _isDragging
				},
				isZooming: function() {
					return _isZooming
				},
				setScrollOffset: function(x, y) {
					_offset.x = x, _currentWindowScrollY = _offset.y = y, _shout("updateScrollOffset", _offset)
				},
				applyZoomPan: function(zoomLevel, panX, panY, allowRenderResolution) {
					_panOffset.x = panX, _panOffset.y = panY, _currZoomLevel = zoomLevel, _applyCurrentZoomPan(allowRenderResolution)
				},
				init: function() {
					if (!_isOpen && !_isDestroying) {
						var i;
						self.framework = framework, self.template = template, self.bg = framework.getChildByClass(template, "pswp__bg"), _initalClassName = template.className, _isOpen = !0, _features = framework.detectFeatures(), _requestAF = _features.raf, _cancelAF = _features.caf, _transformKey = _features.transform, _oldIE = _features.oldIE, self.scrollWrap = framework.getChildByClass(template, "pswp__scroll-wrap"), self.container = framework.getChildByClass(self.scrollWrap, "pswp__container"), _containerStyle = self.container.style, self.itemHolders = _itemHolders = [{
							el: self.container.children[0],
							wrap: 0,
							index: -1
						}, {
							el: self.container.children[1],
							wrap: 0,
							index: -1
						}, {
							el: self.container.children[2],
							wrap: 0,
							index: -1
						}], _itemHolders[0].el.style.display = _itemHolders[2].el.style.display = "none", _setupTransforms(), _globalEventHandlers = {
							resize: self.updateSize,
							scroll: _updatePageScrollOffset,
							keydown: _onKeyDown,
							click: _onGlobalClick
						};
						var oldPhone = _features.isOldIOSPhone || _features.isOldAndroid || _features.isMobileOpera;
						for (_features.animationName && _features.transform && !oldPhone || (_options.showAnimationDuration = _options.hideAnimationDuration = 0), i = 0; i < _modules.length; i++) self["init" + _modules[i]]();
						if (UiClass) {
							var ui = self.ui = new UiClass(self, framework);
							ui.init()
						}
						_shout("firstUpdate"), _currentItemIndex = _currentItemIndex || _options.index || 0, (isNaN(_currentItemIndex) || 0 > _currentItemIndex || _currentItemIndex >= _getNumItems()) && (_currentItemIndex = 0), self.currItem = _getItemAt(_currentItemIndex), (_features.isOldIOSPhone || _features.isOldAndroid) && (_isFixedPosition = !1), template.setAttribute("aria-hidden", "false"), _options.modal && (_isFixedPosition ? template.style.position = "fixed" : (template.style.position = "absolute", template.style.top = framework.getScrollY() + "px")), void 0 === _currentWindowScrollY && (_shout("initialLayout"), _currentWindowScrollY = _initalWindowScrollY = framework.getScrollY());
						var rootClasses = "pswp--open ";
						for (_options.mainClass && (rootClasses += _options.mainClass + " "), _options.showHideOpacity && (rootClasses += "pswp--animate_opacity "), rootClasses += _likelyTouchDevice ? "pswp--touch" : "pswp--notouch", rootClasses += _features.animationName ? " pswp--css_animation" : "", rootClasses += _features.svg ? " pswp--svg" : "", framework.addClass(template, rootClasses), self.updateSize(), _containerShiftIndex = -1, _indexDiff = null, i = 0; NUM_HOLDERS > i; i++) _setTranslateX((i + _containerShiftIndex) * _slideSize.x, _itemHolders[i].el.style);
						_oldIE || framework.bind(self.scrollWrap, _downEvents, self), _listen("initialZoomInEnd", function() {
							self.setContent(_itemHolders[0], _currentItemIndex - 1), self.setContent(_itemHolders[2], _currentItemIndex + 1), _itemHolders[0].el.style.display = _itemHolders[2].el.style.display = "block", _options.focus && template.focus(), _bindEvents()
						}), self.setContent(_itemHolders[1], _currentItemIndex), self.updateCurrItem(), _shout("afterInit"), _isFixedPosition || (_updateSizeInterval = setInterval(function() {
							_numAnimations || _isDragging || _isZooming || _currZoomLevel !== self.currItem.initialZoomLevel || self.updateSize()
						}, 1e3)), framework.addClass(template, "pswp--visible")
					}
				},
				close: function() {
					_isOpen && (_isOpen = !1, _isDestroying = !0, _shout("close"), _unbindEvents(), _showOrHide(self.currItem, null, !0, self.destroy))
				},
				destroy: function() {
					_shout("destroy"), _showOrHideTimeout && clearTimeout(_showOrHideTimeout), template.setAttribute("aria-hidden", "true"), template.className = _initalClassName, _updateSizeInterval && clearInterval(_updateSizeInterval), framework.unbind(self.scrollWrap, _downEvents, self), framework.unbind(window, "scroll", self), _stopDragUpdateLoop(), _stopAllAnimations(), _listeners = null
				},
				panTo: function(x, y, force) {
					force || (x > _currPanBounds.min.x ? x = _currPanBounds.min.x : x < _currPanBounds.max.x && (x = _currPanBounds.max.x), y > _currPanBounds.min.y ? y = _currPanBounds.min.y : y < _currPanBounds.max.y && (y = _currPanBounds.max.y)), _panOffset.x = x, _panOffset.y = y, _applyCurrentZoomPan()
				},
				handleEvent: function(e) {
					e = e || window.event, _globalEventHandlers[e.type] && _globalEventHandlers[e.type](e)
				},
				goTo: function(index) {
					index = _getLoopedId(index);
					var diff = index - _currentItemIndex;
					_indexDiff = diff, _currentItemIndex = index, self.currItem = _getItemAt(_currentItemIndex), _currPositionIndex -= diff, _moveMainScroll(_slideSize.x * _currPositionIndex), _stopAllAnimations(), _mainScrollAnimating = !1, self.updateCurrItem()
				},
				next: function() {
					self.goTo(_currentItemIndex + 1)
				},
				prev: function() {
					self.goTo(_currentItemIndex - 1)
				},
				updateCurrZoomItem: function(emulateSetContent) {
					if (emulateSetContent && _shout("beforeChange", 0), _itemHolders[1].el.children.length) {
						var zoomElement = _itemHolders[1].el.children[0];
						_currZoomElementStyle = framework.hasClass(zoomElement, "pswp__zoom-wrap") ? zoomElement.style : null
					} else _currZoomElementStyle = null;
					_currPanBounds = self.currItem.bounds, _startZoomLevel = _currZoomLevel = self.currItem.initialZoomLevel, _panOffset.x = _currPanBounds.center.x, _panOffset.y = _currPanBounds.center.y, emulateSetContent && _shout("afterChange")
				},
				invalidateCurrItems: function() {
					_itemsNeedUpdate = !0;
					for (var i = 0; NUM_HOLDERS > i; i++) _itemHolders[i].item && (_itemHolders[i].item.needsUpdate = !0)
				},
				updateCurrItem: function(beforeAnimation) {
					if (0 !== _indexDiff) {
						var tempHolder, diffAbs = Math.abs(_indexDiff);
						if (!(beforeAnimation && 2 > diffAbs)) {
							self.currItem = _getItemAt(_currentItemIndex), _renderMaxResolution = !1, _shout("beforeChange", _indexDiff), diffAbs >= NUM_HOLDERS && (_containerShiftIndex += _indexDiff + (_indexDiff > 0 ? -NUM_HOLDERS : NUM_HOLDERS), diffAbs = NUM_HOLDERS);
							for (var i = 0; diffAbs > i; i++) _indexDiff > 0 ? (tempHolder = _itemHolders.shift(), _itemHolders[NUM_HOLDERS - 1] = tempHolder, _containerShiftIndex++, _setTranslateX((_containerShiftIndex + 2) * _slideSize.x, tempHolder.el.style), self.setContent(tempHolder, _currentItemIndex - diffAbs + i + 1 + 1)) : (tempHolder = _itemHolders.pop(), _itemHolders.unshift(tempHolder), _containerShiftIndex--, _setTranslateX(_containerShiftIndex * _slideSize.x, tempHolder.el.style), self.setContent(tempHolder, _currentItemIndex + diffAbs - i - 1 - 1));
							if (_currZoomElementStyle && 1 === Math.abs(_indexDiff)) {
								var prevItem = _getItemAt(_prevItemIndex);
								prevItem.initialZoomLevel !== _currZoomLevel && (_calculateItemSize(prevItem, _viewportSize), _setImageSize(prevItem), _applyZoomPanToItem(prevItem))
							}
							_indexDiff = 0, self.updateCurrZoomItem(), _prevItemIndex = _currentItemIndex, _shout("afterChange")
						}
					}
				},
				updateSize: function(force) {
					if (!_isFixedPosition && _options.modal) {
						var windowScrollY = framework.getScrollY();
						if (_currentWindowScrollY !== windowScrollY && (template.style.top = windowScrollY + "px", _currentWindowScrollY = windowScrollY), !force && _windowVisibleSize.x === window.innerWidth && _windowVisibleSize.y === window.innerHeight) return;
						_windowVisibleSize.x = window.innerWidth, _windowVisibleSize.y = window.innerHeight, template.style.height = _windowVisibleSize.y + "px"
					}
					if (_viewportSize.x = self.scrollWrap.clientWidth, _viewportSize.y = self.scrollWrap.clientHeight, _updatePageScrollOffset(), _slideSize.x = _viewportSize.x + Math.round(_viewportSize.x * _options.spacing), _slideSize.y = _viewportSize.y, _moveMainScroll(_slideSize.x * _currPositionIndex), _shout("beforeResize"), void 0 !== _containerShiftIndex) {
						for (var holder, item, hIndex, i = 0; NUM_HOLDERS > i; i++) holder = _itemHolders[i], _setTranslateX((i + _containerShiftIndex) * _slideSize.x, holder.el.style), hIndex = _currentItemIndex + i - 1, _options.loop && _getNumItems() > 2 && (hIndex = _getLoopedId(hIndex)), item = _getItemAt(hIndex), item && (_itemsNeedUpdate || item.needsUpdate || !item.bounds) ? (self.cleanSlide(item), self.setContent(holder, hIndex), 1 === i && (self.currItem = item, self.updateCurrZoomItem(!0)), item.needsUpdate = !1) : -1 === holder.index && hIndex >= 0 && self.setContent(holder, hIndex), item && item.container && (_calculateItemSize(item, _viewportSize), _setImageSize(item), _applyZoomPanToItem(item));
						_itemsNeedUpdate = !1
					}
					_startZoomLevel = _currZoomLevel = self.currItem.initialZoomLevel, _currPanBounds = self.currItem.bounds, _currPanBounds && (_panOffset.x = _currPanBounds.center.x, _panOffset.y = _currPanBounds.center.y, _applyCurrentZoomPan(!0)), _shout("resize")
				},
				zoomTo: function(destZoomLevel, centerPoint, speed, easingFn, updateFn) {
					centerPoint && (_startZoomLevel = _currZoomLevel, _midZoomPoint.x = Math.abs(centerPoint.x) - _panOffset.x, _midZoomPoint.y = Math.abs(centerPoint.y) - _panOffset.y, _equalizePoints(_startPanOffset, _panOffset));
					var destPanBounds = _calculatePanBounds(destZoomLevel, !1),
						destPanOffset = {};
					_modifyDestPanOffset("x", destPanBounds, destPanOffset, destZoomLevel), _modifyDestPanOffset("y", destPanBounds, destPanOffset, destZoomLevel);
					var initialZoomLevel = _currZoomLevel,
						initialPanOffset = {
							x: _panOffset.x,
							y: _panOffset.y
						};
					_roundPoint(destPanOffset);
					var onUpdate = function(now) {
						1 === now ? (_currZoomLevel = destZoomLevel, _panOffset.x = destPanOffset.x, _panOffset.y = destPanOffset.y) : (_currZoomLevel = (destZoomLevel - initialZoomLevel) * now + initialZoomLevel, _panOffset.x = (destPanOffset.x - initialPanOffset.x) * now + initialPanOffset.x, _panOffset.y = (destPanOffset.y - initialPanOffset.y) * now + initialPanOffset.y), updateFn && updateFn(now), _applyCurrentZoomPan(1 === now)
					};
					speed ? _animateProp("customZoomTo", 0, 1, speed, easingFn || framework.easing.sine.inOut, onUpdate) : onUpdate(1)
				}
			},
			MIN_SWIPE_DISTANCE = 30,
			DIRECTION_CHECK_OFFSET = 10,
			p = {},
			p2 = {},
			delta = {},
			_currPoint = {},
			_startPoint = {},
			_currPointers = [],
			_startMainScrollPos = {},
			_posPoints = [],
			_tempPoint = {},
			_currZoomedItemIndex = 0,
			_centerPoint = _getEmptyPoint(),
			_lastReleaseTime = 0,
			_mainScrollPos = _getEmptyPoint(),
			_midZoomPoint = _getEmptyPoint(),
			_currCenterPoint = _getEmptyPoint(),
			_isEqualPoints = function(p1, p2) {
				return p1.x === p2.x && p1.y === p2.y
			},
			_isNearbyPoints = function(touch0, touch1) {
				return Math.abs(touch0.x - touch1.x) < DOUBLE_TAP_RADIUS && Math.abs(touch0.y - touch1.y) < DOUBLE_TAP_RADIUS
			},
			_calculatePointsDistance = function(p1, p2) {
				return _tempPoint.x = Math.abs(p1.x - p2.x), _tempPoint.y = Math.abs(p1.y - p2.y), Math.sqrt(_tempPoint.x * _tempPoint.x + _tempPoint.y * _tempPoint.y)
			},
			_stopDragUpdateLoop = function() {
				_dragAnimFrame && (_cancelAF(_dragAnimFrame), _dragAnimFrame = null)
			},
			_dragUpdateLoop = function() {
				_isDragging && (_dragAnimFrame = _requestAF(_dragUpdateLoop), _renderMovement())
			},
			_canPan = function() {
				return !("fit" === _options.scaleMode && _currZoomLevel === self.currItem.initialZoomLevel)
			},
			_closestElement = function(el, fn) {
				return el && el !== document ? el.getAttribute("class") && el.getAttribute("class").indexOf("pswp__scroll-wrap") > -1 ? !1 : fn(el) ? el : _closestElement(el.parentNode, fn) : !1
			},
			_preventObj = {},
			_preventDefaultEventBehaviour = function(e, isDown) {
				return _preventObj.prevent = !_closestElement(e.target, _options.isClickableElement),
					_shout("preventDragEvent", e, isDown, _preventObj), _preventObj.prevent
			},
			_convertTouchToPoint = function(touch, p) {
				return p.x = touch.pageX, p.y = touch.pageY, p.id = touch.identifier, p
			},
			_findCenterOfPoints = function(p1, p2, pCenter) {
				pCenter.x = .5 * (p1.x + p2.x), pCenter.y = .5 * (p1.y + p2.y)
			},
			_pushPosPoint = function(time, x, y) {
				if (time - _gestureCheckSpeedTime > 50) {
					var o = _posPoints.length > 2 ? _posPoints.shift() : {};
					o.x = x, o.y = y, _posPoints.push(o), _gestureCheckSpeedTime = time
				}
			},
			_calculateVerticalDragOpacityRatio = function() {
				var yOffset = _panOffset.y - self.currItem.initialPosition.y;
				return 1 - Math.abs(yOffset / (_viewportSize.y / 2))
			},
			_ePoint1 = {},
			_ePoint2 = {},
			_tempPointsArr = [],
			_getTouchPoints = function(e) {
				for (; _tempPointsArr.length > 0;) _tempPointsArr.pop();
				return _pointerEventEnabled ? (_tempCounter = 0, _currPointers.forEach(function(p) {
					0 === _tempCounter ? _tempPointsArr[0] = p : 1 === _tempCounter && (_tempPointsArr[1] = p), _tempCounter++
				})) : e.type.indexOf("touch") > -1 ? e.touches && e.touches.length > 0 && (_tempPointsArr[0] = _convertTouchToPoint(e.touches[0], _ePoint1), e.touches.length > 1 && (_tempPointsArr[1] = _convertTouchToPoint(e.touches[1], _ePoint2))) : (_ePoint1.x = e.pageX, _ePoint1.y = e.pageY, _ePoint1.id = "", _tempPointsArr[0] = _ePoint1), _tempPointsArr
			},
			_panOrMoveMainScroll = function(axis, delta) {
				var panFriction, startOverDiff, newPanPos, newMainScrollPos, overDiff = 0,
					newOffset = _panOffset[axis] + delta[axis],
					dir = delta[axis] > 0,
					newMainScrollPosition = _mainScrollPos.x + delta.x,
					mainScrollDiff = _mainScrollPos.x - _startMainScrollPos.x;
				return panFriction = newOffset > _currPanBounds.min[axis] || newOffset < _currPanBounds.max[axis] ? _options.panEndFriction : 1, newOffset = _panOffset[axis] + delta[axis] * panFriction, !_options.allowPanToNext && _currZoomLevel !== self.currItem.initialZoomLevel || (_currZoomElementStyle ? "h" !== _direction || "x" !== axis || _zoomStarted || (dir ? (newOffset > _currPanBounds.min[axis] && (panFriction = _options.panEndFriction, overDiff = _currPanBounds.min[axis] - newOffset, startOverDiff = _currPanBounds.min[axis] - _startPanOffset[axis]), (0 >= startOverDiff || 0 > mainScrollDiff) && _getNumItems() > 1 ? (newMainScrollPos = newMainScrollPosition, 0 > mainScrollDiff && newMainScrollPosition > _startMainScrollPos.x && (newMainScrollPos = _startMainScrollPos.x)) : _currPanBounds.min.x !== _currPanBounds.max.x && (newPanPos = newOffset)) : (newOffset < _currPanBounds.max[axis] && (panFriction = _options.panEndFriction, overDiff = newOffset - _currPanBounds.max[axis], startOverDiff = _startPanOffset[axis] - _currPanBounds.max[axis]), (0 >= startOverDiff || mainScrollDiff > 0) && _getNumItems() > 1 ? (newMainScrollPos = newMainScrollPosition, mainScrollDiff > 0 && newMainScrollPosition < _startMainScrollPos.x && (newMainScrollPos = _startMainScrollPos.x)) : _currPanBounds.min.x !== _currPanBounds.max.x && (newPanPos = newOffset))) : newMainScrollPos = newMainScrollPosition, "x" !== axis) ? void(_mainScrollAnimating || _mainScrollShifted || _currZoomLevel > self.currItem.fitRatio && (_panOffset[axis] += delta[axis] * panFriction)) : (void 0 !== newMainScrollPos && (_moveMainScroll(newMainScrollPos, !0), _mainScrollShifted = newMainScrollPos === _startMainScrollPos.x ? !1 : !0), _currPanBounds.min.x !== _currPanBounds.max.x && (void 0 !== newPanPos ? _panOffset.x = newPanPos : _mainScrollShifted || (_panOffset.x += delta.x * panFriction)), void 0 !== newMainScrollPos)
			},
			_onDragStart = function(e) {
				if (!("mousedown" === e.type && e.button > 0)) {
					if (_initialZoomRunning) return void e.preventDefault();
					if (!_oldAndroidTouchEndTimeout || "mousedown" !== e.type) {
						if (_preventDefaultEventBehaviour(e, !0) && e.preventDefault(), _shout("pointerDown"), _pointerEventEnabled) {
							var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, "id");
							0 > pointerIndex && (pointerIndex = _currPointers.length), _currPointers[pointerIndex] = {
								x: e.pageX,
								y: e.pageY,
								id: e.pointerId
							}
						}
						var startPointsList = _getTouchPoints(e),
							numPoints = startPointsList.length;
						_currentPoints = null, _stopAllAnimations(), _isDragging && 1 !== numPoints || (_isDragging = _isFirstMove = !0, framework.bind(window, _upMoveEvents, self), _isZoomingIn = _wasOverInitialZoom = _opacityChanged = _verticalDragInitiated = _mainScrollShifted = _moved = _isMultitouch = _zoomStarted = !1, _direction = null, _shout("firstTouchStart", startPointsList), _equalizePoints(_startPanOffset, _panOffset), _currPanDist.x = _currPanDist.y = 0, _equalizePoints(_currPoint, startPointsList[0]), _equalizePoints(_startPoint, _currPoint), _startMainScrollPos.x = _slideSize.x * _currPositionIndex, _posPoints = [{
							x: _currPoint.x,
							y: _currPoint.y
						}], _gestureCheckSpeedTime = _gestureStartTime = _getCurrentTime(), _calculatePanBounds(_currZoomLevel, !0), _stopDragUpdateLoop(), _dragUpdateLoop()), !_isZooming && numPoints > 1 && !_mainScrollAnimating && !_mainScrollShifted && (_startZoomLevel = _currZoomLevel, _zoomStarted = !1, _isZooming = _isMultitouch = !0, _currPanDist.y = _currPanDist.x = 0, _equalizePoints(_startPanOffset, _panOffset), _equalizePoints(p, startPointsList[0]), _equalizePoints(p2, startPointsList[1]), _findCenterOfPoints(p, p2, _currCenterPoint), _midZoomPoint.x = Math.abs(_currCenterPoint.x) - _panOffset.x, _midZoomPoint.y = Math.abs(_currCenterPoint.y) - _panOffset.y, _currPointsDistance = _startPointsDistance = _calculatePointsDistance(p, p2))
					}
				}
			},
			_onDragMove = function(e) {
				if (e.preventDefault(), _pointerEventEnabled) {
					var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, "id");
					if (pointerIndex > -1) {
						var p = _currPointers[pointerIndex];
						p.x = e.pageX, p.y = e.pageY
					}
				}
				if (_isDragging) {
					var touchesList = _getTouchPoints(e);
					if (_direction || _moved || _isZooming) _currentPoints = touchesList;
					else if (_mainScrollPos.x !== _slideSize.x * _currPositionIndex) _direction = "h";
					else {
						var diff = Math.abs(touchesList[0].x - _currPoint.x) - Math.abs(touchesList[0].y - _currPoint.y);
						Math.abs(diff) >= DIRECTION_CHECK_OFFSET && (_direction = diff > 0 ? "h" : "v", _currentPoints = touchesList)
					}
				}
			},
			_renderMovement = function() {
				if (_currentPoints) {
					var numPoints = _currentPoints.length;
					if (0 !== numPoints)
						if (_equalizePoints(p, _currentPoints[0]), delta.x = p.x - _currPoint.x, delta.y = p.y - _currPoint.y, _isZooming && numPoints > 1) {
							if (_currPoint.x = p.x, _currPoint.y = p.y, !delta.x && !delta.y && _isEqualPoints(_currentPoints[1], p2)) return;
							_equalizePoints(p2, _currentPoints[1]), _zoomStarted || (_zoomStarted = !0, _shout("zoomGestureStarted"));
							var pointsDistance = _calculatePointsDistance(p, p2),
								zoomLevel = _calculateZoomLevel(pointsDistance);
							zoomLevel > self.currItem.initialZoomLevel + self.currItem.initialZoomLevel / 15 && (_wasOverInitialZoom = !0);
							var zoomFriction = 1,
								minZoomLevel = _getMinZoomLevel(),
								maxZoomLevel = _getMaxZoomLevel();
							if (minZoomLevel > zoomLevel)
								if (_options.pinchToClose && !_wasOverInitialZoom && _startZoomLevel <= self.currItem.initialZoomLevel) {
									var minusDiff = minZoomLevel - zoomLevel,
										percent = 1 - minusDiff / (minZoomLevel / 1.2);
									_applyBgOpacity(percent), _shout("onPinchClose", percent), _opacityChanged = !0
								} else zoomFriction = (minZoomLevel - zoomLevel) / minZoomLevel, zoomFriction > 1 && (zoomFriction = 1), zoomLevel = minZoomLevel - zoomFriction * (minZoomLevel / 3);
							else zoomLevel > maxZoomLevel && (zoomFriction = (zoomLevel - maxZoomLevel) / (6 * minZoomLevel), zoomFriction > 1 && (zoomFriction = 1), zoomLevel = maxZoomLevel + zoomFriction * minZoomLevel);
							0 > zoomFriction && (zoomFriction = 0), _currPointsDistance = pointsDistance, _findCenterOfPoints(p, p2, _centerPoint), _currPanDist.x += _centerPoint.x - _currCenterPoint.x, _currPanDist.y += _centerPoint.y - _currCenterPoint.y, _equalizePoints(_currCenterPoint, _centerPoint), _panOffset.x = _calculatePanOffset("x", zoomLevel), _panOffset.y = _calculatePanOffset("y", zoomLevel), _isZoomingIn = zoomLevel > _currZoomLevel, _currZoomLevel = zoomLevel, _applyCurrentZoomPan()
						} else {
							if (!_direction) return;
							if (_isFirstMove && (_isFirstMove = !1, Math.abs(delta.x) >= DIRECTION_CHECK_OFFSET && (delta.x -= _currentPoints[0].x - _startPoint.x), Math.abs(delta.y) >= DIRECTION_CHECK_OFFSET && (delta.y -= _currentPoints[0].y - _startPoint.y)), _currPoint.x = p.x, _currPoint.y = p.y, 0 === delta.x && 0 === delta.y) return;
							if ("v" === _direction && _options.closeOnVerticalDrag && !_canPan()) {
								_currPanDist.y += delta.y, _panOffset.y += delta.y;
								var opacityRatio = _calculateVerticalDragOpacityRatio();
								return _verticalDragInitiated = !0, _shout("onVerticalDrag", opacityRatio), _applyBgOpacity(opacityRatio), void _applyCurrentZoomPan()
							}
							_pushPosPoint(_getCurrentTime(), p.x, p.y), _moved = !0, _currPanBounds = self.currItem.bounds;
							var mainScrollChanged = _panOrMoveMainScroll("x", delta);
							mainScrollChanged || (_panOrMoveMainScroll("y", delta), _roundPoint(_panOffset), _applyCurrentZoomPan())
						}
				}
			},
			_onDragRelease = function(e) {
				if (_features.isOldAndroid) {
					if (_oldAndroidTouchEndTimeout && "mouseup" === e.type) return;
					e.type.indexOf("touch") > -1 && (clearTimeout(_oldAndroidTouchEndTimeout), _oldAndroidTouchEndTimeout = setTimeout(function() {
						_oldAndroidTouchEndTimeout = 0
					}, 600))
				}
				_shout("pointerUp"), _preventDefaultEventBehaviour(e, !1) && e.preventDefault();
				var releasePoint;
				if (_pointerEventEnabled) {
					var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, "id");
					if (pointerIndex > -1)
						if (releasePoint = _currPointers.splice(pointerIndex, 1)[0], navigator.pointerEnabled) releasePoint.type = e.pointerType || "mouse";
						else {
							var MSPOINTER_TYPES = {
								4: "mouse",
								2: "touch",
								3: "pen"
							};
							releasePoint.type = MSPOINTER_TYPES[e.pointerType], releasePoint.type || (releasePoint.type = e.pointerType || "mouse")
						}
				}
				var gestureType, touchList = _getTouchPoints(e),
					numPoints = touchList.length;
				if ("mouseup" === e.type && (numPoints = 0), 2 === numPoints) return _currentPoints = null, !0;
				1 === numPoints && _equalizePoints(_startPoint, touchList[0]), 0 !== numPoints || _direction || _mainScrollAnimating || (releasePoint || ("mouseup" === e.type ? releasePoint = {
					x: e.pageX,
					y: e.pageY,
					type: "mouse"
				} : e.changedTouches && e.changedTouches[0] && (releasePoint = {
					x: e.changedTouches[0].pageX,
					y: e.changedTouches[0].pageY,
					type: "touch"
				})), _shout("touchRelease", e, releasePoint));
				var releaseTimeDiff = -1;
				if (0 === numPoints && (_isDragging = !1, framework.unbind(window, _upMoveEvents, self), _stopDragUpdateLoop(), _isZooming ? releaseTimeDiff = 0 : -1 !== _lastReleaseTime && (releaseTimeDiff = _getCurrentTime() - _lastReleaseTime)), _lastReleaseTime = 1 === numPoints ? _getCurrentTime() : -1, gestureType = -1 !== releaseTimeDiff && 150 > releaseTimeDiff ? "zoom" : "swipe", _isZooming && 2 > numPoints && (_isZooming = !1, 1 === numPoints && (gestureType = "zoomPointerUp"), _shout("zoomGestureEnded")), _currentPoints = null, _moved || _zoomStarted || _mainScrollAnimating || _verticalDragInitiated)
					if (_stopAllAnimations(), _releaseAnimData || (_releaseAnimData = _initDragReleaseAnimationData()), _releaseAnimData.calculateSwipeSpeed("x"), _verticalDragInitiated) {
						var opacityRatio = _calculateVerticalDragOpacityRatio();
						if (opacityRatio < _options.verticalDragRange) self.close();
						else {
							var initalPanY = _panOffset.y,
								initialBgOpacity = _bgOpacity;
							_animateProp("verticalDrag", 0, 1, 300, framework.easing.cubic.out, function(now) {
								_panOffset.y = (self.currItem.initialPosition.y - initalPanY) * now + initalPanY, _applyBgOpacity((1 - initialBgOpacity) * now + initialBgOpacity), _applyCurrentZoomPan()
							}), _shout("onVerticalDrag", 1)
						}
					} else {
						if ((_mainScrollShifted || _mainScrollAnimating) && 0 === numPoints) {
							var itemChanged = _finishSwipeMainScrollGesture(gestureType, _releaseAnimData);
							if (itemChanged) return;
							gestureType = "zoomPointerUp"
						}
						if (!_mainScrollAnimating) return "swipe" !== gestureType ? void _completeZoomGesture() : void(!_mainScrollShifted && _currZoomLevel > self.currItem.fitRatio && _completePanGesture(_releaseAnimData))
					}
			},
			_initDragReleaseAnimationData = function() {
				var lastFlickDuration, tempReleasePos, s = {
					lastFlickOffset: {},
					lastFlickDist: {},
					lastFlickSpeed: {},
					slowDownRatio: {},
					slowDownRatioReverse: {},
					speedDecelerationRatio: {},
					speedDecelerationRatioAbs: {},
					distanceOffset: {},
					backAnimDestination: {},
					backAnimStarted: {},
					calculateSwipeSpeed: function(axis) {
						_posPoints.length > 1 ? (lastFlickDuration = _getCurrentTime() - _gestureCheckSpeedTime + 50, tempReleasePos = _posPoints[_posPoints.length - 2][axis]) : (lastFlickDuration = _getCurrentTime() - _gestureStartTime, tempReleasePos = _startPoint[axis]), s.lastFlickOffset[axis] = _currPoint[axis] - tempReleasePos, s.lastFlickDist[axis] = Math.abs(s.lastFlickOffset[axis]), s.lastFlickSpeed[axis] = s.lastFlickDist[axis] > 20 ? s.lastFlickOffset[axis] / lastFlickDuration : 0, Math.abs(s.lastFlickSpeed[axis]) < .1 && (s.lastFlickSpeed[axis] = 0), s.slowDownRatio[axis] = .95, s.slowDownRatioReverse[axis] = 1 - s.slowDownRatio[axis], s.speedDecelerationRatio[axis] = 1
					},
					calculateOverBoundsAnimOffset: function(axis, speed) {
						s.backAnimStarted[axis] || (_panOffset[axis] > _currPanBounds.min[axis] ? s.backAnimDestination[axis] = _currPanBounds.min[axis] : _panOffset[axis] < _currPanBounds.max[axis] && (s.backAnimDestination[axis] = _currPanBounds.max[axis]), void 0 !== s.backAnimDestination[axis] && (s.slowDownRatio[axis] = .7, s.slowDownRatioReverse[axis] = 1 - s.slowDownRatio[axis], s.speedDecelerationRatioAbs[axis] < .05 && (s.lastFlickSpeed[axis] = 0, s.backAnimStarted[axis] = !0, _animateProp("bounceZoomPan" + axis, _panOffset[axis], s.backAnimDestination[axis], speed || 300, framework.easing.sine.out, function(pos) {
							_panOffset[axis] = pos, _applyCurrentZoomPan()
						}))))
					},
					calculateAnimOffset: function(axis) {
						s.backAnimStarted[axis] || (s.speedDecelerationRatio[axis] = s.speedDecelerationRatio[axis] * (s.slowDownRatio[axis] + s.slowDownRatioReverse[axis] - s.slowDownRatioReverse[axis] * s.timeDiff / 10), s.speedDecelerationRatioAbs[axis] = Math.abs(s.lastFlickSpeed[axis] * s.speedDecelerationRatio[axis]), s.distanceOffset[axis] = s.lastFlickSpeed[axis] * s.speedDecelerationRatio[axis] * s.timeDiff, _panOffset[axis] += s.distanceOffset[axis])
					},
					panAnimLoop: function() {
						return _animations.zoomPan && (_animations.zoomPan.raf = _requestAF(s.panAnimLoop), s.now = _getCurrentTime(), s.timeDiff = s.now - s.lastNow, s.lastNow = s.now, s.calculateAnimOffset("x"), s.calculateAnimOffset("y"), _applyCurrentZoomPan(), s.calculateOverBoundsAnimOffset("x"), s.calculateOverBoundsAnimOffset("y"), s.speedDecelerationRatioAbs.x < .05 && s.speedDecelerationRatioAbs.y < .05) ? (_panOffset.x = Math.round(_panOffset.x), _panOffset.y = Math.round(_panOffset.y), _applyCurrentZoomPan(), void _stopAnimation("zoomPan")) : void 0
					}
				};
				return s
			},
			_completePanGesture = function(animData) {
				return animData.calculateSwipeSpeed("y"), _currPanBounds = self.currItem.bounds, animData.backAnimDestination = {}, animData.backAnimStarted = {}, Math.abs(animData.lastFlickSpeed.x) <= .05 && Math.abs(animData.lastFlickSpeed.y) <= .05 ? (animData.speedDecelerationRatioAbs.x = animData.speedDecelerationRatioAbs.y = 0, animData.calculateOverBoundsAnimOffset("x"), animData.calculateOverBoundsAnimOffset("y"), !0) : (_registerStartAnimation("zoomPan"), animData.lastNow = _getCurrentTime(), void animData.panAnimLoop())
			},
			_finishSwipeMainScrollGesture = function(gestureType, _releaseAnimData) {
				var itemChanged;
				_mainScrollAnimating || (_currZoomedItemIndex = _currentItemIndex);
				var itemsDiff;
				if ("swipe" === gestureType) {
					var totalShiftDist = _currPoint.x - _startPoint.x,
						isFastLastFlick = _releaseAnimData.lastFlickDist.x < 10;
					totalShiftDist > MIN_SWIPE_DISTANCE && (isFastLastFlick || _releaseAnimData.lastFlickOffset.x > 20) ? itemsDiff = -1 : -MIN_SWIPE_DISTANCE > totalShiftDist && (isFastLastFlick || _releaseAnimData.lastFlickOffset.x < -20) && (itemsDiff = 1)
				}
				var nextCircle;
				itemsDiff && (_currentItemIndex += itemsDiff, 0 > _currentItemIndex ? (_currentItemIndex = _options.loop ? _getNumItems() - 1 : 0, nextCircle = !0) : _currentItemIndex >= _getNumItems() && (_currentItemIndex = _options.loop ? 0 : _getNumItems() - 1, nextCircle = !0), (!nextCircle || _options.loop) && (_indexDiff += itemsDiff, _currPositionIndex -= itemsDiff, itemChanged = !0));
				var finishAnimDuration, animateToX = _slideSize.x * _currPositionIndex,
					animateToDist = Math.abs(animateToX - _mainScrollPos.x);
				return itemChanged || animateToX > _mainScrollPos.x == _releaseAnimData.lastFlickSpeed.x > 0 ? (finishAnimDuration = Math.abs(_releaseAnimData.lastFlickSpeed.x) > 0 ? animateToDist / Math.abs(_releaseAnimData.lastFlickSpeed.x) : 333, finishAnimDuration = Math.min(finishAnimDuration, 400), finishAnimDuration = Math.max(finishAnimDuration, 250)) : finishAnimDuration = 333, _currZoomedItemIndex === _currentItemIndex && (itemChanged = !1), _mainScrollAnimating = !0, _shout("mainScrollAnimStart"), _animateProp("mainScroll", _mainScrollPos.x, animateToX, finishAnimDuration, framework.easing.cubic.out, _moveMainScroll, function() {
					_stopAllAnimations(), _mainScrollAnimating = !1, _currZoomedItemIndex = -1, (itemChanged || _currZoomedItemIndex !== _currentItemIndex) && self.updateCurrItem(), _shout("mainScrollAnimComplete")
				}), itemChanged && self.updateCurrItem(!0), itemChanged
			},
			_calculateZoomLevel = function(touchesDistance) {
				return 1 / _startPointsDistance * touchesDistance * _startZoomLevel
			},
			_completeZoomGesture = function() {
				var destZoomLevel = _currZoomLevel,
					minZoomLevel = _getMinZoomLevel(),
					maxZoomLevel = _getMaxZoomLevel();
				minZoomLevel > _currZoomLevel ? destZoomLevel = minZoomLevel : _currZoomLevel > maxZoomLevel && (destZoomLevel = maxZoomLevel);
				var onUpdate, destOpacity = 1,
					initialOpacity = _bgOpacity;
				return _opacityChanged && !_isZoomingIn && !_wasOverInitialZoom && minZoomLevel > _currZoomLevel ? (self.close(), !0) : (_opacityChanged && (onUpdate = function(now) {
					_applyBgOpacity((destOpacity - initialOpacity) * now + initialOpacity)
				}), self.zoomTo(destZoomLevel, 0, 200, framework.easing.cubic.out, onUpdate), !0)
			};
		_registerModule("Gestures", {
			publicMethods: {
				initGestures: function() {
					var addEventNames = function(pref, down, move, up, cancel) {
						_dragStartEvent = pref + down, _dragMoveEvent = pref + move, _dragEndEvent = pref + up, _dragCancelEvent = cancel ? pref + cancel : ""
					};
					_pointerEventEnabled = _features.pointerEvent, _pointerEventEnabled && _features.touch && (_features.touch = !1), _pointerEventEnabled ? navigator.pointerEnabled ? addEventNames("pointer", "down", "move", "up", "cancel") : addEventNames("MSPointer", "Down", "Move", "Up", "Cancel") : _features.touch ? (addEventNames("touch", "start", "move", "end", "cancel"), _likelyTouchDevice = !0) : addEventNames("mouse", "down", "move", "up"), _upMoveEvents = _dragMoveEvent + " " + _dragEndEvent + " " + _dragCancelEvent, _downEvents = _dragStartEvent, _pointerEventEnabled && !_likelyTouchDevice && (_likelyTouchDevice = navigator.maxTouchPoints > 1 || navigator.msMaxTouchPoints > 1), self.likelyTouchDevice = _likelyTouchDevice, _globalEventHandlers[_dragStartEvent] = _onDragStart, _globalEventHandlers[_dragMoveEvent] = _onDragMove, _globalEventHandlers[_dragEndEvent] = _onDragRelease, _dragCancelEvent && (_globalEventHandlers[_dragCancelEvent] = _globalEventHandlers[_dragEndEvent]), _features.touch && (_downEvents += " mousedown", _upMoveEvents += " mousemove mouseup", _globalEventHandlers.mousedown = _globalEventHandlers[_dragStartEvent], _globalEventHandlers.mousemove = _globalEventHandlers[_dragMoveEvent], _globalEventHandlers.mouseup = _globalEventHandlers[_dragEndEvent]), _likelyTouchDevice || (_options.allowPanToNext = !1)
				}
			}
		});
		var _showOrHideTimeout, _items, _initialContentSet, _initialZoomRunning, _getItemAt, _getNumItems, _initialIsLoop, _showOrHide = function(item, img, out, completeFn) {
				_showOrHideTimeout && clearTimeout(_showOrHideTimeout), _initialZoomRunning = !0, _initialContentSet = !0;
				var thumbBounds;
				item.initialLayout ? (thumbBounds = item.initialLayout, item.initialLayout = null) : thumbBounds = _options.getThumbBoundsFn && _options.getThumbBoundsFn(_currentItemIndex);
				var duration = out ? _options.hideAnimationDuration : _options.showAnimationDuration,
					onComplete = function() {
						_stopAnimation("initialZoom"), out ? (self.template.removeAttribute("style"), self.bg.removeAttribute("style")) : (_applyBgOpacity(1), img && (img.style.display = "block"), framework.addClass(template, "pswp--animated-in"), _shout("initialZoom" + (out ? "OutEnd" : "InEnd"))), completeFn && completeFn(), _initialZoomRunning = !1
					};
				if (!duration || !thumbBounds || void 0 === thumbBounds.x) return _shout("initialZoom" + (out ? "Out" : "In")), _currZoomLevel = item.initialZoomLevel, _equalizePoints(_panOffset, item.initialPosition), _applyCurrentZoomPan(), template.style.opacity = out ? 0 : 1, _applyBgOpacity(1), void(duration ? setTimeout(function() {
					onComplete()
				}, duration) : onComplete());
				var startAnimation = function() {
					var closeWithRaf = _closedByScroll,
						fadeEverything = !self.currItem.src || self.currItem.loadError || _options.showHideOpacity;
					item.miniImg && (item.miniImg.style.webkitBackfaceVisibility = "hidden"), out || (_currZoomLevel = thumbBounds.w / item.w, _panOffset.x = thumbBounds.x, _panOffset.y = thumbBounds.y - _initalWindowScrollY, self[fadeEverything ? "template" : "bg"].style.opacity = .001, _applyCurrentZoomPan()), _registerStartAnimation("initialZoom"), out && !closeWithRaf && framework.removeClass(template, "pswp--animated-in"), fadeEverything && (out ? framework[(closeWithRaf ? "remove" : "add") + "Class"](template, "pswp--animate_opacity") : setTimeout(function() {
						framework.addClass(template, "pswp--animate_opacity")
					}, 30)), _showOrHideTimeout = setTimeout(function() {
						if (_shout("initialZoom" + (out ? "Out" : "In")), out) {
							var destZoomLevel = thumbBounds.w / item.w,
								initialPanOffset = {
									x: _panOffset.x,
									y: _panOffset.y
								},
								initialZoomLevel = _currZoomLevel,
								initalBgOpacity = _bgOpacity,
								onUpdate = function(now) {
									1 === now ? (_currZoomLevel = destZoomLevel, _panOffset.x = thumbBounds.x, _panOffset.y = thumbBounds.y - _currentWindowScrollY) : (_currZoomLevel = (destZoomLevel - initialZoomLevel) * now + initialZoomLevel, _panOffset.x = (thumbBounds.x - initialPanOffset.x) * now + initialPanOffset.x, _panOffset.y = (thumbBounds.y - _currentWindowScrollY - initialPanOffset.y) * now + initialPanOffset.y), _applyCurrentZoomPan(), fadeEverything ? template.style.opacity = 1 - now : _applyBgOpacity(initalBgOpacity - now * initalBgOpacity)
								};
							closeWithRaf ? _animateProp("initialZoom", 0, 1, duration, framework.easing.cubic.out, onUpdate, onComplete) : (onUpdate(1), _showOrHideTimeout = setTimeout(onComplete, duration + 20))
						} else _currZoomLevel = item.initialZoomLevel, _equalizePoints(_panOffset, item.initialPosition), _applyCurrentZoomPan(), _applyBgOpacity(1), fadeEverything ? template.style.opacity = 1 : _applyBgOpacity(1), _showOrHideTimeout = setTimeout(onComplete, duration + 20)
					}, out ? 25 : 90)
				};
				startAnimation()
			},
			_tempPanAreaSize = {},
			_imagesToAppendPool = [],
			_controllerDefaultOptions = {
				index: 0,
				errorMsg: '<div class="pswp__error-msg"><a href="%url%" target="_blank">The image</a> could not be loaded.</div>',
				forceProgressiveLoading: !1,
				preload: [1, 1],
				getNumItemsFn: function() {
					return _items.length
				}
			},
			_getZeroBounds = function() {
				return {
					center: {
						x: 0,
						y: 0
					},
					max: {
						x: 0,
						y: 0
					},
					min: {
						x: 0,
						y: 0
					}
				}
			},
			_calculateSingleItemPanBounds = function(item, realPanElementW, realPanElementH) {
				var bounds = item.bounds;
				bounds.center.x = Math.round((_tempPanAreaSize.x - realPanElementW) / 2), bounds.center.y = Math.round((_tempPanAreaSize.y - realPanElementH) / 2) + item.vGap.top, bounds.max.x = realPanElementW > _tempPanAreaSize.x ? Math.round(_tempPanAreaSize.x - realPanElementW) : bounds.center.x, bounds.max.y = realPanElementH > _tempPanAreaSize.y ? Math.round(_tempPanAreaSize.y - realPanElementH) + item.vGap.top : bounds.center.y, bounds.min.x = realPanElementW > _tempPanAreaSize.x ? 0 : bounds.center.x, bounds.min.y = realPanElementH > _tempPanAreaSize.y ? item.vGap.top : bounds.center.y
			},
			_calculateItemSize = function(item, viewportSize, zoomLevel) {
				if (item.src && !item.loadError) {
					var isInitial = !zoomLevel;
					if (isInitial && (item.vGap || (item.vGap = {
							top: 0,
							bottom: 0
						}), _shout("parseVerticalMargin", item)), _tempPanAreaSize.x = viewportSize.x, _tempPanAreaSize.y = viewportSize.y - item.vGap.top - item.vGap.bottom, isInitial) {
						var hRatio = _tempPanAreaSize.x / item.w,
							vRatio = _tempPanAreaSize.y / item.h;
						item.fitRatio = vRatio > hRatio ? hRatio : vRatio;
						var scaleMode = _options.scaleMode;
						"orig" === scaleMode ? zoomLevel = 1 : "fit" === scaleMode && (zoomLevel = item.fitRatio), zoomLevel > 1 && (zoomLevel = 1), item.initialZoomLevel = zoomLevel, item.bounds || (item.bounds = _getZeroBounds())
					}
					if (!zoomLevel) return;
					return _calculateSingleItemPanBounds(item, item.w * zoomLevel, item.h * zoomLevel), isInitial && zoomLevel === item.initialZoomLevel && (item.initialPosition = item.bounds.center), item.bounds
				}
				return item.w = item.h = 0, item.initialZoomLevel = item.fitRatio = 1, item.bounds = _getZeroBounds(), item.initialPosition = item.bounds.center, item.bounds
			},
			_appendImage = function(index, item, baseDiv, img, preventAnimation, keepPlaceholder) {
				item.loadError || img && (item.imageAppended = !0, _setImageSize(item, img, item === self.currItem && _renderMaxResolution), baseDiv.appendChild(img), keepPlaceholder && setTimeout(function() {
					item && item.loaded && item.placeholder && (item.placeholder.style.display = "none", item.placeholder = null)
				}, 500))
			},
			_preloadImage = function(item) {
				item.loading = !0, item.loaded = !1;
				var img = item.img = framework.createEl("pswp__img", "img"),
					onComplete = function() {
						item.loading = !1, item.loaded = !0, item.loadComplete ? item.loadComplete(item) : item.img = null, img.onload = img.onerror = null, img = null
					};
				return img.onload = onComplete, img.onerror = function() {
					item.loadError = !0, onComplete()
				}, img.src = item.src, img
			},
			_checkForError = function(item, cleanUp) {
				return item.src && item.loadError && item.container ? (cleanUp && (item.container.innerHTML = ""), item.container.innerHTML = _options.errorMsg.replace("%url%", item.src), !0) : void 0
			},
			_setImageSize = function(item, img, maxRes) {
				if (item.src) {
					img || (img = item.container.lastChild);
					var w = maxRes ? item.w : Math.round(item.w * item.fitRatio),
						h = maxRes ? item.h : Math.round(item.h * item.fitRatio);
					item.placeholder && !item.loaded && (item.placeholder.style.width = w + "px", item.placeholder.style.height = h + "px"), img.style.width = w + "px", img.style.height = h + "px"
				}
			},
			_appendImagesPool = function() {
				if (_imagesToAppendPool.length) {
					for (var poolItem, i = 0; i < _imagesToAppendPool.length; i++) poolItem = _imagesToAppendPool[i], poolItem.holder.index === poolItem.index && _appendImage(poolItem.index, poolItem.item, poolItem.baseDiv, poolItem.img, !1, poolItem.clearPlaceholder);
					_imagesToAppendPool = []
				}
			};
		_registerModule("Controller", {
			publicMethods: {
				lazyLoadItem: function(index) {
					index = _getLoopedId(index);
					var item = _getItemAt(index);
					item && (!item.loaded && !item.loading || _itemsNeedUpdate) && (_shout("gettingData", index, item), item.src && _preloadImage(item))
				},
				initController: function() {
					framework.extend(_options, _controllerDefaultOptions, !0), self.items = _items = items, _getItemAt = self.getItemAt, _getNumItems = _options.getNumItemsFn, _initialIsLoop = _options.loop, _getNumItems() < 3 && (_options.loop = !1), _listen("beforeChange", function(diff) {
						var i, p = _options.preload,
							isNext = null === diff ? !0 : diff >= 0,
							preloadBefore = Math.min(p[0], _getNumItems()),
							preloadAfter = Math.min(p[1], _getNumItems());
						for (i = 1;
							(isNext ? preloadAfter : preloadBefore) >= i; i++) self.lazyLoadItem(_currentItemIndex + i);
						for (i = 1;
							(isNext ? preloadBefore : preloadAfter) >= i; i++) self.lazyLoadItem(_currentItemIndex - i)
					}), _listen("initialLayout", function() {
						self.currItem.initialLayout = _options.getThumbBoundsFn && _options.getThumbBoundsFn(_currentItemIndex)
					}), _listen("mainScrollAnimComplete", _appendImagesPool), _listen("initialZoomInEnd", _appendImagesPool), _listen("destroy", function() {
						for (var item, i = 0; i < _items.length; i++) item = _items[i], item.container && (item.container = null), item.placeholder && (item.placeholder = null), item.img && (item.img = null), item.preloader && (item.preloader = null), item.loadError && (item.loaded = item.loadError = !1);
						_imagesToAppendPool = null
					})
				},
				getItemAt: function(index) {
					return index >= 0 && void 0 !== _items[index] ? _items[index] : !1
				},
				allowProgressiveImg: function() {
					return _options.forceProgressiveLoading || !_likelyTouchDevice || _options.mouseUsed || screen.width > 1200
				},
				setContent: function(holder, index) {
					_options.loop && (index = _getLoopedId(index));
					var prevItem = self.getItemAt(holder.index);
					prevItem && (prevItem.container = null);
					var img, item = self.getItemAt(index);
					if (!item) return void(holder.el.innerHTML = "");
					_shout("gettingData", index, item), holder.index = index, holder.item = item;
					var baseDiv = item.container = framework.createEl("pswp__zoom-wrap");
					if (!item.src && item.html && (item.html.tagName ? baseDiv.appendChild(item.html) : baseDiv.innerHTML = item.html), _checkForError(item), _calculateItemSize(item, _viewportSize), !item.src || item.loadError || item.loaded) item.src && !item.loadError && (img = framework.createEl("pswp__img", "img"), img.style.opacity = 1, img.src = item.src, _setImageSize(item, img), _appendImage(index, item, baseDiv, img, !0));
					else {
						if (item.loadComplete = function(item) {
								if (_isOpen) {
									if (holder && holder.index === index) {
										if (_checkForError(item, !0)) return item.loadComplete = item.img = null, _calculateItemSize(item, _viewportSize), _applyZoomPanToItem(item), void(holder.index === _currentItemIndex && self.updateCurrZoomItem());
										item.imageAppended ? !_initialZoomRunning && item.placeholder && (item.placeholder.style.display = "none", item.placeholder = null) : _features.transform && (_mainScrollAnimating || _initialZoomRunning) ? _imagesToAppendPool.push({
											item: item,
											baseDiv: baseDiv,
											img: item.img,
											index: index,
											holder: holder,
											clearPlaceholder: !0
										}) : _appendImage(index, item, baseDiv, item.img, _mainScrollAnimating || _initialZoomRunning, !0)
									}
									item.loadComplete = null, item.img = null, _shout("imageLoadComplete", index, item)
								}
							}, framework.features.transform) {
							var placeholderClassName = "pswp__img pswp__img--placeholder";
							placeholderClassName += item.msrc ? "" : " pswp__img--placeholder--blank";
							var placeholder = framework.createEl(placeholderClassName, item.msrc ? "img" : "");
							item.msrc && (placeholder.src = item.msrc), _setImageSize(item, placeholder), baseDiv.appendChild(placeholder), item.placeholder = placeholder
						}
						item.loading || _preloadImage(item), self.allowProgressiveImg() && (!_initialContentSet && _features.transform ? _imagesToAppendPool.push({
							item: item,
							baseDiv: baseDiv,
							img: item.img,
							index: index,
							holder: holder
						}) : _appendImage(index, item, baseDiv, item.img, !0, !0))
					}
					_initialContentSet || index !== _currentItemIndex ? _applyZoomPanToItem(item) : (_currZoomElementStyle = baseDiv.style, _showOrHide(item, img || item.img)), holder.el.innerHTML = "", holder.el.appendChild(baseDiv)
				},
				cleanSlide: function(item) {
					item.img && (item.img.onload = item.img.onerror = null), item.loaded = item.loading = item.img = item.imageAppended = !1
				}
			}
		});
		var tapTimer, tapReleasePoint = {},
			_dispatchTapEvent = function(origEvent, releasePoint, pointerType) {
				var e = document.createEvent("CustomEvent"),
					eDetail = {
						origEvent: origEvent,
						target: origEvent.target,
						releasePoint: releasePoint,
						pointerType: pointerType || "touch"
					};
				e.initCustomEvent("pswpTap", !0, !0, eDetail), origEvent.target.dispatchEvent(e)
			};
		_registerModule("Tap", {
			publicMethods: {
				initTap: function() {
					_listen("firstTouchStart", self.onTapStart), _listen("touchRelease", self.onTapRelease), _listen("destroy", function() {
						tapReleasePoint = {}, tapTimer = null
					})
				},
				onTapStart: function(touchList) {
					touchList.length > 1 && (clearTimeout(tapTimer), tapTimer = null)
				},
				onTapRelease: function(e, releasePoint) {
					if (releasePoint && !_moved && !_isMultitouch && !_numAnimations) {
						var p0 = releasePoint;
						if (tapTimer && (clearTimeout(tapTimer), tapTimer = null, _isNearbyPoints(p0, tapReleasePoint))) return void _shout("doubleTap", p0);
						if ("mouse" === releasePoint.type) return void _dispatchTapEvent(e, releasePoint, "mouse");
						var clickedTagName = e.target.tagName.toUpperCase();
						if ("BUTTON" === clickedTagName || framework.hasClass(e.target, "pswp__single-tap")) return void _dispatchTapEvent(e, releasePoint);
						_equalizePoints(tapReleasePoint, p0), tapTimer = setTimeout(function() {
							_dispatchTapEvent(e, releasePoint), tapTimer = null
						}, 300)
					}
				}
			}
		});
		var _wheelDelta;
		_registerModule("DesktopZoom", {
			publicMethods: {
				initDesktopZoom: function() {
					_oldIE || (_likelyTouchDevice ? _listen("mouseUsed", function() {
						self.setupDesktopZoom()
					}) : self.setupDesktopZoom(!0))
				},
				setupDesktopZoom: function(onInit) {
					_wheelDelta = {};
					var events = "wheel mousewheel DOMMouseScroll";
					_listen("bindEvents", function() {
						framework.bind(template, events, self.handleMouseWheel)
					}), _listen("unbindEvents", function() {
						_wheelDelta && framework.unbind(template, events, self.handleMouseWheel)
					}), self.mouseZoomedIn = !1;
					var hasDraggingClass, updateZoomable = function() {
							self.mouseZoomedIn && (framework.removeClass(template, "pswp--zoomed-in"), self.mouseZoomedIn = !1), 1 > _currZoomLevel ? framework.addClass(template, "pswp--zoom-allowed") : framework.removeClass(template, "pswp--zoom-allowed"), removeDraggingClass()
						},
						removeDraggingClass = function() {
							hasDraggingClass && (framework.removeClass(template, "pswp--dragging"), hasDraggingClass = !1)
						};
					_listen("resize", updateZoomable), _listen("afterChange", updateZoomable), _listen("pointerDown", function() {
						self.mouseZoomedIn && (hasDraggingClass = !0, framework.addClass(template, "pswp--dragging"))
					}), _listen("pointerUp", removeDraggingClass), onInit || updateZoomable()
				},
				handleMouseWheel: function(e) {
					if (_currZoomLevel <= self.currItem.fitRatio) return _options.modal && (!_options.closeOnScroll || _numAnimations || _isDragging ? e.preventDefault() : _transformKey && Math.abs(e.deltaY) > 2 && (_closedByScroll = !0, self.close())), !0;
					if (e.stopPropagation(), _wheelDelta.x = 0, "deltaX" in e) 1 === e.deltaMode ? (_wheelDelta.x = 18 * e.deltaX, _wheelDelta.y = 18 * e.deltaY) : (_wheelDelta.x = e.deltaX, _wheelDelta.y = e.deltaY);
					else if ("wheelDelta" in e) e.wheelDeltaX && (_wheelDelta.x = -.16 * e.wheelDeltaX), _wheelDelta.y = e.wheelDeltaY ? -.16 * e.wheelDeltaY : -.16 * e.wheelDelta;
					else {
						if (!("detail" in e)) return;
						_wheelDelta.y = e.detail
					}
					_calculatePanBounds(_currZoomLevel, !0);
					var newPanX = _panOffset.x - _wheelDelta.x,
						newPanY = _panOffset.y - _wheelDelta.y;
					(_options.modal || newPanX <= _currPanBounds.min.x && newPanX >= _currPanBounds.max.x && newPanY <= _currPanBounds.min.y && newPanY >= _currPanBounds.max.y) && e.preventDefault(), self.panTo(newPanX, newPanY)
				},
				toggleDesktopZoom: function(centerPoint) {
					centerPoint = centerPoint || {
						x: _viewportSize.x / 2 + _offset.x,
						y: _viewportSize.y / 2 + _offset.y
					};
					var doubleTapZoomLevel = _options.getDoubleTapZoom(!0, self.currItem),
						zoomOut = _currZoomLevel === doubleTapZoomLevel;
					self.mouseZoomedIn = !zoomOut, self.zoomTo(zoomOut ? self.currItem.initialZoomLevel : doubleTapZoomLevel, centerPoint, 333), framework[(zoomOut ? "remove" : "add") + "Class"](template, "pswp--zoomed-in")
				}
			}
		});
		var _historyUpdateTimeout, _hashChangeTimeout, _hashAnimCheckTimeout, _hashChangedByScript, _hashChangedByHistory, _hashReseted, _initialHash, _historyChanged, _closedFromURL, _urlChangedOnce, _windowLoc, _supportsPushState, _historyDefaultOptions = {
				history: !0,
				galleryUID: 1
			},
			_getHash = function() {
				return _windowLoc.hash.substring(1)
			},
			_cleanHistoryTimeouts = function() {
				_historyUpdateTimeout && clearTimeout(_historyUpdateTimeout), _hashAnimCheckTimeout && clearTimeout(_hashAnimCheckTimeout)
			},
			_parseItemIndexFromURL = function() {
				var hash = _getHash(),
					params = {};
				if (hash.length < 5) return params;
				var i, vars = hash.split("&");
				for (i = 0; i < vars.length; i++)
					if (vars[i]) {
						var pair = vars[i].split("=");
						pair.length < 2 || (params[pair[0]] = pair[1])
					}
				if (_options.galleryPIDs) {
					var searchfor = params.pid;
					for (params.pid = 0, i = 0; i < _items.length; i++)
						if (_items[i].pid === searchfor) {
							params.pid = i;
							break
						}
				} else params.pid = parseInt(params.pid, 10) - 1;
				return params.pid < 0 && (params.pid = 0), params
			},
			_updateHash = function() {
				if (_hashAnimCheckTimeout && clearTimeout(_hashAnimCheckTimeout), _numAnimations || _isDragging) return void(_hashAnimCheckTimeout = setTimeout(_updateHash, 500));
				_hashChangedByScript ? clearTimeout(_hashChangeTimeout) : _hashChangedByScript = !0;
				var pid = _currentItemIndex + 1,
					item = _getItemAt(_currentItemIndex);
				item.hasOwnProperty("pid") && (pid = item.pid);
				var newHash = _initialHash + "&gid=" + _options.galleryUID + "&pid=" + pid;
				_historyChanged || -1 === _windowLoc.hash.indexOf(newHash) && (_urlChangedOnce = !0);
				var newURL = _windowLoc.href.split("#")[0] + "#" + newHash;
				_supportsPushState ? "#" + newHash !== window.location.hash && history[_historyChanged ? "replaceState" : "pushState"]("", document.title, newURL) : _historyChanged ? _windowLoc.replace(newURL) : _windowLoc.hash = newHash, _historyChanged = !0, _hashChangeTimeout = setTimeout(function() {
					_hashChangedByScript = !1
				}, 60)
			};
		_registerModule("History", {
			publicMethods: {
				initHistory: function() {
					if (framework.extend(_options, _historyDefaultOptions, !0), _options.history) {
						_windowLoc = window.location, _urlChangedOnce = !1, _closedFromURL = !1, _historyChanged = !1, _initialHash = _getHash(), _supportsPushState = "pushState" in history, _initialHash.indexOf("gid=") > -1 && (_initialHash = _initialHash.split("&gid=")[0], _initialHash = _initialHash.split("?gid=")[0]), _listen("afterChange", self.updateURL), _listen("unbindEvents", function() {
							framework.unbind(window, "hashchange", self.onHashChange)
						});
						var returnToOriginal = function() {
							_hashReseted = !0, _closedFromURL || (_urlChangedOnce ? history.back() : _initialHash ? _windowLoc.hash = _initialHash : _supportsPushState ? history.pushState("", document.title, _windowLoc.pathname + _windowLoc.search) : _windowLoc.hash = ""), _cleanHistoryTimeouts()
						};
						_listen("unbindEvents", function() {
							_closedByScroll && returnToOriginal()
						}), _listen("destroy", function() {
							_hashReseted || returnToOriginal()
						}), _listen("firstUpdate", function() {
							_currentItemIndex = _parseItemIndexFromURL().pid
						});
						var index = _initialHash.indexOf("pid=");
						index > -1 && (_initialHash = _initialHash.substring(0, index), "&" === _initialHash.slice(-1) && (_initialHash = _initialHash.slice(0, -1))), setTimeout(function() {
							_isOpen && framework.bind(window, "hashchange", self.onHashChange)
						}, 40)
					}
				},
				onHashChange: function() {
					return _getHash() === _initialHash ? (_closedFromURL = !0, void self.close()) : void(_hashChangedByScript || (_hashChangedByHistory = !0, self.goTo(_parseItemIndexFromURL().pid), _hashChangedByHistory = !1))
				},
				updateURL: function() {
					_cleanHistoryTimeouts(), _hashChangedByHistory || (_historyChanged ? _historyUpdateTimeout = setTimeout(_updateHash, 800) : _updateHash())
				}
			}
		}), framework.extend(self, publicMethods)
	};
	return PhotoSwipe
}),
function(root, factory) {
	"function" == typeof define && define.amd ? define(factory) : "object" == typeof exports ? module.exports = factory() : root.PhotoSwipeUI_Default = factory()
}(this, function() {
	"use strict";
	var PhotoSwipeUI_Default = function(pswp, framework) {
		var _fullscrenAPI, _controls, _captionContainer, _fakeCaptionContainer, _indexIndicator, _shareButton, _shareModal, _initalCloseOnScrollValue, _isIdle, _listen, _loadingIndicator, _loadingIndicatorHidden, _loadingIndicatorTimeout, _galleryHasOneSlide, _options, _blockControlsTap, _blockControlsTapTimeout, _idleInterval, _idleTimer, ui = this,
			_overlayUIUpdated = !1,
			_controlsVisible = !0,
			_shareModalHidden = !0,
			_defaultUIOptions = {
				barsSize: {
					top: 44,
					bottom: "auto"
				},
				closeElClasses: ["item", "caption", "zoom-wrap", "ui", "top-bar"],
				timeToIdle: 4e3,
				timeToIdleOutside: 1e3,
				loadingIndicatorDelay: 1e3,
				addCaptionHTMLFn: function(item, captionEl) {
					return item.title ? (captionEl.children[0].innerHTML = item.title, !0) : (captionEl.children[0].innerHTML = "", !1)
				},
				closeEl: !0,
				captionEl: !0,
				fullscreenEl: !0,
				zoomEl: !0,
				shareEl: !0,
				counterEl: !0,
				arrowEl: !0,
				preloaderEl: !0,
				tapToClose: !1,
				tapToToggleControls: !0,
				clickToCloseNonZoomable: !0,
				shareButtons: [{
					id: "facebook",
					label: "Share on Facebook",
					url: "https://www.facebook.com/sharer/sharer.php?u={{url}}"
				}, {
					id: "twitter",
					label: "Tweet",
					url: "https://twitter.com/intent/tweet?text={{text}}&url={{url}}"
				}, {
					id: "pinterest",
					label: "Pin it",
					url: "http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}"
				}, {
					id: "download",
					label: "Download image",
					url: "{{raw_image_url}}",
					download: !0
				}],
				getImageURLForShare: function() {
					return pswp.currItem.src || ""
				},
				getPageURLForShare: function() {
					return window.location.href
				},
				getTextForShare: function() {
					return pswp.currItem.title || ""
				},
				indexIndicatorSep: " / ",
				fitControlsWidth: 1200
			},
			_onControlsTap = function(e) {
				if (_blockControlsTap) return !0;
				e = e || window.event, _options.timeToIdle && _options.mouseUsed && !_isIdle && _onIdleMouseMove();
				for (var uiElement, found, target = e.target || e.srcElement, clickedClass = target.getAttribute("class") || "", i = 0; i < _uiElements.length; i++) uiElement = _uiElements[i], uiElement.onTap && clickedClass.indexOf("pswp__" + uiElement.name) > -1 && (uiElement.onTap(), found = !0);
				if (found) {
					e.stopPropagation && e.stopPropagation(), _blockControlsTap = !0;
					var tapDelay = framework.features.isOldAndroid ? 600 : 30;
					_blockControlsTapTimeout = setTimeout(function() {
						_blockControlsTap = !1
					}, tapDelay)
				}
			},
			_fitControlsInViewport = function() {
				return !pswp.likelyTouchDevice || _options.mouseUsed || screen.width > _options.fitControlsWidth
			},
			_togglePswpClass = function(el, cName, add) {
				framework[(add ? "add" : "remove") + "Class"](el, "pswp__" + cName)
			},
			_countNumItems = function() {
				var hasOneSlide = 1 === _options.getNumItemsFn();
				hasOneSlide !== _galleryHasOneSlide && (_togglePswpClass(_controls, "ui--one-slide", hasOneSlide), _galleryHasOneSlide = hasOneSlide)
			},
			_toggleShareModalClass = function() {
				_togglePswpClass(_shareModal, "share-modal--hidden", _shareModalHidden)
			},
			_toggleShareModal = function() {
				return _shareModalHidden = !_shareModalHidden, _shareModalHidden ? (framework.removeClass(_shareModal, "pswp__share-modal--fade-in"), setTimeout(function() {
					_shareModalHidden && _toggleShareModalClass()
				}, 300)) : (_toggleShareModalClass(), setTimeout(function() {
					_shareModalHidden || framework.addClass(_shareModal, "pswp__share-modal--fade-in")
				}, 30)), _shareModalHidden || _updateShareURLs(), !1
			},
			_openWindowPopup = function(e) {
				e = e || window.event;
				var target = e.target || e.srcElement;
				return pswp.shout("shareLinkClick", e, target), target.href ? target.hasAttribute("download") ? !0 : (window.open(target.href, "pswp_share", "scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=550,height=420,top=100,left=" + (window.screen ? Math.round(screen.width / 2 - 275) : 100)), _shareModalHidden || _toggleShareModal(), !1) : !1
			},
			_updateShareURLs = function() {
				for (var shareButtonData, shareURL, image_url, page_url, share_text, shareButtonOut = "", i = 0; i < _options.shareButtons.length; i++) shareButtonData = _options.shareButtons[i], image_url = _options.getImageURLForShare(shareButtonData), page_url = _options.getPageURLForShare(shareButtonData), share_text = _options.getTextForShare(shareButtonData), shareURL = shareButtonData.url.replace("{{url}}", encodeURIComponent(page_url)).replace("{{image_url}}", encodeURIComponent(image_url)).replace("{{raw_image_url}}", image_url).replace("{{text}}", encodeURIComponent(share_text)), shareButtonOut += '<a href="' + shareURL + '" target="_blank" class="pswp__share--' + shareButtonData.id + '"' + (shareButtonData.download ? "download" : "") + ">" + shareButtonData.label + "</a>", _options.parseShareButtonOut && (shareButtonOut = _options.parseShareButtonOut(shareButtonData, shareButtonOut));
				_shareModal.children[0].innerHTML = shareButtonOut, _shareModal.children[0].onclick = _openWindowPopup
			},
			_hasCloseClass = function(target) {
				for (var i = 0; i < _options.closeElClasses.length; i++)
					if (framework.hasClass(target, "pswp__" + _options.closeElClasses[i])) return !0
			},
			_idleIncrement = 0,
			_onIdleMouseMove = function() {
				clearTimeout(_idleTimer), _idleIncrement = 0, _isIdle && ui.setIdle(!1)
			},
			_onMouseLeaveWindow = function(e) {
				e = e ? e : window.event;
				var from = e.relatedTarget || e.toElement;
				from && "HTML" !== from.nodeName || (clearTimeout(_idleTimer), _idleTimer = setTimeout(function() {
					ui.setIdle(!0)
				}, _options.timeToIdleOutside))
			},
			_setupFullscreenAPI = function() {
				_options.fullscreenEl && !framework.features.isOldAndroid && (_fullscrenAPI || (_fullscrenAPI = ui.getFullscreenAPI()), _fullscrenAPI ? (framework.bind(document, _fullscrenAPI.eventK, ui.updateFullscreen), ui.updateFullscreen(), framework.addClass(pswp.template, "pswp--supports-fs")) : framework.removeClass(pswp.template, "pswp--supports-fs"))
			},
			_setupLoadingIndicator = function() {
				_options.preloaderEl && (_toggleLoadingIndicator(!0), _listen("beforeChange", function() {
					clearTimeout(_loadingIndicatorTimeout), _loadingIndicatorTimeout = setTimeout(function() {
						pswp.currItem && pswp.currItem.loading ? (!pswp.allowProgressiveImg() || pswp.currItem.img && !pswp.currItem.img.naturalWidth) && _toggleLoadingIndicator(!1) : _toggleLoadingIndicator(!0)
					}, _options.loadingIndicatorDelay)
				}), _listen("imageLoadComplete", function(index, item) {
					pswp.currItem === item && _toggleLoadingIndicator(!0)
				}))
			},
			_toggleLoadingIndicator = function(hide) {
				_loadingIndicatorHidden !== hide && (_togglePswpClass(_loadingIndicator, "preloader--active", !hide), _loadingIndicatorHidden = hide)
			},
			_applyNavBarGaps = function(item) {
				var gap = item.vGap;
				if (_fitControlsInViewport()) {
					var bars = _options.barsSize;
					if (_options.captionEl && "auto" === bars.bottom)
						if (_fakeCaptionContainer || (_fakeCaptionContainer = framework.createEl("pswp__caption pswp__caption--fake"), _fakeCaptionContainer.appendChild(framework.createEl("pswp__caption__center")), _controls.insertBefore(_fakeCaptionContainer, _captionContainer), framework.addClass(_controls, "pswp__ui--fit")), _options.addCaptionHTMLFn(item, _fakeCaptionContainer, !0)) {
							var captionSize = _fakeCaptionContainer.clientHeight;
							gap.bottom = parseInt(captionSize, 10) || 44
						} else gap.bottom = bars.top;
					else gap.bottom = "auto" === bars.bottom ? 0 : bars.bottom;
					gap.top = bars.top
				} else gap.top = gap.bottom = 0
			},
			_setupIdle = function() {
				_options.timeToIdle && _listen("mouseUsed", function() {
					framework.bind(document, "mousemove", _onIdleMouseMove), framework.bind(document, "mouseout", _onMouseLeaveWindow), _idleInterval = setInterval(function() {
						_idleIncrement++, 2 === _idleIncrement && ui.setIdle(!0)
					}, _options.timeToIdle / 2)
				})
			},
			_setupHidingControlsDuringGestures = function() {
				_listen("onVerticalDrag", function(now) {
					_controlsVisible && .95 > now ? ui.hideControls() : !_controlsVisible && now >= .95 && ui.showControls()
				});
				var pinchControlsHidden;
				_listen("onPinchClose", function(now) {
					_controlsVisible && .9 > now ? (ui.hideControls(), pinchControlsHidden = !0) : pinchControlsHidden && !_controlsVisible && now > .9 && ui.showControls()
				}), _listen("zoomGestureEnded", function() {
					pinchControlsHidden = !1, pinchControlsHidden && !_controlsVisible && ui.showControls()
				})
			},
			_uiElements = [{
				name: "caption",
				option: "captionEl",
				onInit: function(el) {
					_captionContainer = el
				}
			}, {
				name: "share-modal",
				option: "shareEl",
				onInit: function(el) {
					_shareModal = el
				},
				onTap: function() {
					_toggleShareModal()
				}
			}, {
				name: "button--share",
				option: "shareEl",
				onInit: function(el) {
					_shareButton = el
				},
				onTap: function() {
					_toggleShareModal()
				}
			}, {
				name: "button--zoom",
				option: "zoomEl",
				onTap: pswp.toggleDesktopZoom
			}, {
				name: "counter",
				option: "counterEl",
				onInit: function(el) {
					_indexIndicator = el
				}
			}, {
				name: "button--close",
				option: "closeEl",
				onTap: pswp.close
			}, {
				name: "button--arrow--left",
				option: "arrowEl",
				onTap: pswp.prev
			}, {
				name: "button--arrow--right",
				option: "arrowEl",
				onTap: pswp.next
			}, {
				name: "button--fs",
				option: "fullscreenEl",
				onTap: function() {
					_fullscrenAPI.isFullscreen() ? _fullscrenAPI.exit() : _fullscrenAPI.enter()
				}
			}, {
				name: "preloader",
				option: "preloaderEl",
				onInit: function(el) {
					_loadingIndicator = el
				}
			}],
			_setupUIElements = function() {
				var item, classAttr, uiElement, loopThroughChildElements = function(sChildren) {
					if (sChildren)
						for (var l = sChildren.length, i = 0; l > i; i++) {
							item = sChildren[i], classAttr = item.className;
							for (var a = 0; a < _uiElements.length; a++) uiElement = _uiElements[a], classAttr.indexOf("pswp__" + uiElement.name) > -1 && (_options[uiElement.option] ? (framework.removeClass(item, "pswp__element--disabled"), uiElement.onInit && uiElement.onInit(item)) : framework.addClass(item, "pswp__element--disabled"))
						}
				};
				loopThroughChildElements(_controls.children);
				var topBar = framework.getChildByClass(_controls, "pswp__top-bar");
				topBar && loopThroughChildElements(topBar.children)
			};
		ui.init = function() {
			framework.extend(pswp.options, _defaultUIOptions, !0), _options = pswp.options, _controls = framework.getChildByClass(pswp.scrollWrap, "pswp__ui"), _listen = pswp.listen, _setupHidingControlsDuringGestures(), _listen("beforeChange", ui.update), _listen("doubleTap", function(point) {
				var initialZoomLevel = pswp.currItem.initialZoomLevel;
				pswp.getZoomLevel() !== initialZoomLevel ? pswp.zoomTo(initialZoomLevel, point, 333) : pswp.zoomTo(_options.getDoubleTapZoom(!1, pswp.currItem), point, 333)
			}), _listen("preventDragEvent", function(e, isDown, preventObj) {
				var t = e.target || e.srcElement;
				t && t.getAttribute("class") && e.type.indexOf("mouse") > -1 && (t.getAttribute("class").indexOf("__caption") > 0 || /(SMALL|STRONG|EM)/i.test(t.tagName)) && (preventObj.prevent = !1)
			}), _listen("bindEvents", function() {
				framework.bind(_controls, "pswpTap click", _onControlsTap), framework.bind(pswp.scrollWrap, "pswpTap", ui.onGlobalTap), pswp.likelyTouchDevice || framework.bind(pswp.scrollWrap, "mouseover", ui.onMouseOver)
			}), _listen("unbindEvents", function() {
				_shareModalHidden || _toggleShareModal(), _idleInterval && clearInterval(_idleInterval), framework.unbind(document, "mouseout", _onMouseLeaveWindow), framework.unbind(document, "mousemove", _onIdleMouseMove), framework.unbind(_controls, "pswpTap click", _onControlsTap), framework.unbind(pswp.scrollWrap, "pswpTap", ui.onGlobalTap), framework.unbind(pswp.scrollWrap, "mouseover", ui.onMouseOver), _fullscrenAPI && (framework.unbind(document, _fullscrenAPI.eventK, ui.updateFullscreen), _fullscrenAPI.isFullscreen() && (_options.hideAnimationDuration = 0, _fullscrenAPI.exit()), _fullscrenAPI = null)
			}), _listen("destroy", function() {
				_options.captionEl && (_fakeCaptionContainer && _controls.removeChild(_fakeCaptionContainer), framework.removeClass(_captionContainer, "pswp__caption--empty")), _shareModal && (_shareModal.children[0].onclick = null), framework.removeClass(_controls, "pswp__ui--over-close"), framework.addClass(_controls, "pswp__ui--hidden"), ui.setIdle(!1)
			}), _options.showAnimationDuration || framework.removeClass(_controls, "pswp__ui--hidden"), _listen("initialZoomIn", function() {
				_options.showAnimationDuration && framework.removeClass(_controls, "pswp__ui--hidden")
			}), _listen("initialZoomOut", function() {
				framework.addClass(_controls, "pswp__ui--hidden")
			}), _listen("parseVerticalMargin", _applyNavBarGaps), _setupUIElements(), _options.shareEl && _shareButton && _shareModal && (_shareModalHidden = !0), _countNumItems(), _setupIdle(), _setupFullscreenAPI(), _setupLoadingIndicator()
		}, ui.setIdle = function(isIdle) {
			_isIdle = isIdle, _togglePswpClass(_controls, "ui--idle", isIdle)
		}, ui.update = function() {
			_controlsVisible && pswp.currItem ? (ui.updateIndexIndicator(), _options.captionEl && (_options.addCaptionHTMLFn(pswp.currItem, _captionContainer), _togglePswpClass(_captionContainer, "caption--empty", !pswp.currItem.title)), _overlayUIUpdated = !0) : _overlayUIUpdated = !1, _shareModalHidden || _toggleShareModal(), _countNumItems()
		}, ui.updateFullscreen = function(e) {
			e && setTimeout(function() {
				pswp.setScrollOffset(0, framework.getScrollY())
			}, 50), framework[(_fullscrenAPI.isFullscreen() ? "add" : "remove") + "Class"](pswp.template, "pswp--fs")
		}, ui.updateIndexIndicator = function() {
			_options.counterEl && (_indexIndicator.innerHTML = pswp.getCurrentIndex() + 1 + _options.indexIndicatorSep + _options.getNumItemsFn())
		}, ui.onGlobalTap = function(e) {
			e = e || window.event;
			var target = e.target || e.srcElement;
			if (!_blockControlsTap)
				if (e.detail && "mouse" === e.detail.pointerType) {
					if (_hasCloseClass(target)) return void pswp.close();
					framework.hasClass(target, "pswp__img") && (1 === pswp.getZoomLevel() && pswp.getZoomLevel() <= pswp.currItem.fitRatio ? _options.clickToCloseNonZoomable && pswp.close() : pswp.toggleDesktopZoom(e.detail.releasePoint))
				} else if (_options.tapToToggleControls && (_controlsVisible ? ui.hideControls() : ui.showControls()), _options.tapToClose && (framework.hasClass(target, "pswp__img") || _hasCloseClass(target))) return void pswp.close()
		}, ui.onMouseOver = function(e) {
			e = e || window.event;
			var target = e.target || e.srcElement;
			_togglePswpClass(_controls, "ui--over-close", _hasCloseClass(target))
		}, ui.hideControls = function() {
			framework.addClass(_controls, "pswp__ui--hidden"), _controlsVisible = !1
		}, ui.showControls = function() {
			_controlsVisible = !0, _overlayUIUpdated || ui.update(), framework.removeClass(_controls, "pswp__ui--hidden")
		}, ui.supportsFullscreen = function() {
			var d = document;
			return !!(d.exitFullscreen || d.mozCancelFullScreen || d.webkitExitFullscreen || d.msExitFullscreen)
		}, ui.getFullscreenAPI = function() {
			var api, dE = document.documentElement,
				tF = "fullscreenchange";
			return dE.requestFullscreen ? api = {
				enterK: "requestFullscreen",
				exitK: "exitFullscreen",
				elementK: "fullscreenElement",
				eventK: tF
			} : dE.mozRequestFullScreen ? api = {
				enterK: "mozRequestFullScreen",
				exitK: "mozCancelFullScreen",
				elementK: "mozFullScreenElement",
				eventK: "moz" + tF
			} : dE.webkitRequestFullscreen ? api = {
				enterK: "webkitRequestFullscreen",
				exitK: "webkitExitFullscreen",
				elementK: "webkitFullscreenElement",
				eventK: "webkit" + tF
			} : dE.msRequestFullscreen && (api = {
				enterK: "msRequestFullscreen",
				exitK: "msExitFullscreen",
				elementK: "msFullscreenElement",
				eventK: "MSFullscreenChange"
			}), api && (api.enter = function() {
				return _initalCloseOnScrollValue = _options.closeOnScroll, _options.closeOnScroll = !1, "webkitRequestFullscreen" !== this.enterK ? pswp.template[this.enterK]() : void pswp.template[this.enterK](Element.ALLOW_KEYBOARD_INPUT)
			}, api.exit = function() {
				return _options.closeOnScroll = _initalCloseOnScrollValue, document[this.exitK]()
			}, api.isFullscreen = function() {
				return document[this.elementK]
			}), api
		}
	};
	return PhotoSwipeUI_Default
}),
function() {
	var device, previousDevice, addClass, documentElement, find, handleOrientation, hasClass, orientationEvent, removeClass, userAgent;
	previousDevice = window.device, device = {}, window.device = device, documentElement = window.document.documentElement, userAgent = window.navigator.userAgent.toLowerCase(), device.ios = function() {
		return device.iphone() || device.ipod() || device.ipad()
	}, device.iphone = function() {
		return !device.windows() && find("iphone")
	}, device.ipod = function() {
		return find("ipod")
	}, device.ipad = function() {
		return find("ipad")
	}, device.android = function() {
		return !device.windows() && find("android")
	}, device.androidPhone = function() {
		return device.android() && find("mobile")
	}, device.androidTablet = function() {
		return device.android() && !find("mobile")
	}, device.blackberry = function() {
		return find("blackberry") || find("bb10") || find("rim")
	}, device.blackberryPhone = function() {
		return device.blackberry() && !find("tablet")
	}, device.blackberryTablet = function() {
		return device.blackberry() && find("tablet")
	}, device.windows = function() {
		return find("windows")
	}, device.windowsPhone = function() {
		return device.windows() && find("phone")
	}, device.windowsTablet = function() {
		return device.windows() && find("touch") && !device.windowsPhone()
	}, device.fxos = function() {
		return (find("(mobile;") || find("(tablet;")) && find("; rv:")
	}, device.fxosPhone = function() {
		return device.fxos() && find("mobile")
	}, device.fxosTablet = function() {
		return device.fxos() && find("tablet")
	}, device.meego = function() {
		return find("meego")
	}, device.cordova = function() {
		return window.cordova && "file:" === location.protocol
	}, device.nodeWebkit = function() {
		return "object" == typeof window.process
	}, device.mobile = function() {
		return device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone() || device.fxosPhone() || device.meego()
	}, device.tablet = function() {
		return device.ipad() || device.androidTablet() || device.blackberryTablet() || device.windowsTablet() || device.fxosTablet()
	}, device.desktop = function() {
		return !device.tablet() && !device.mobile()
	}, device.television = function() {
		var i;
		for (television = ["googletv", "viera", "smarttv", "internet.tv", "netcast", "nettv", "appletv", "boxee", "kylo", "roku", "dlnadoc", "roku", "pov_tv", "hbbtv", "ce-html"], i = 0; i < television.length;) {
			if (find(television[i])) return !0;
			i++
		}
		return !1
	}, device.portrait = function() {
		return window.innerHeight / window.innerWidth > 1
	}, device.landscape = function() {
		return window.innerHeight / window.innerWidth < 1
	}, device.noConflict = function() {
		return window.device = previousDevice, this
	}, find = function(needle) {
		return -1 !== userAgent.indexOf(needle)
	}, hasClass = function(className) {
		var regex;
		return regex = new RegExp(className, "i"), documentElement.className.match(regex)
	}, addClass = function(className) {
		var currentClassNames = null;
		hasClass(className) || (currentClassNames = documentElement.className.replace(/^\s+|\s+$/g, ""), documentElement.className = currentClassNames + " " + className)
	}, removeClass = function(className) {
		hasClass(className) && (documentElement.className = documentElement.className.replace(" " + className, ""))
	}, device.ios() ? device.ipad() ? addClass("ios ipad tablet") : device.iphone() ? addClass("ios iphone mobile") : device.ipod() && addClass("ios ipod mobile") : device.android() ? addClass(device.androidTablet() ? "android tablet" : "android mobile") : device.blackberry() ? addClass(device.blackberryTablet() ? "blackberry tablet" : "blackberry mobile") : device.windows() ? addClass(device.windowsTablet() ? "windows tablet" : device.windowsPhone() ? "windows mobile" : "desktop") : device.fxos() ? addClass(device.fxosTablet() ? "fxos tablet" : "fxos mobile") : device.meego() ? addClass("meego mobile") : device.nodeWebkit() ? addClass("node-webkit") : device.television() ? addClass("television") : device.desktop() && addClass("desktop"), device.cordova() && addClass("cordova"), handleOrientation = function() {
		device.landscape() ? (removeClass("portrait"), addClass("landscape")) : (removeClass("landscape"), addClass("portrait"))
	}, orientationEvent = Object.prototype.hasOwnProperty.call(window, "onorientationchange") ? "orientationchange" : "resize", window.addEventListener ? window.addEventListener(orientationEvent, handleOrientation, !1) : window.attachEvent ? window.attachEvent(orientationEvent, handleOrientation) : window[orientationEvent] = handleOrientation, handleOrientation(), "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function() {
		return device
	}) : "undefined" != typeof module && module.exports ? module.exports = device : window.device = device
}.call(this), ! function(root, factory) {
	"function" == typeof define && define.amd ? define(["jquery"], function($) {
		return factory(root, $)
	}) : "object" == typeof exports ? factory(root, require("jquery")) : factory(root, root.jQuery || root.Zepto)
}(this, function(global, $) {
	"use strict";

	function getAnimationDuration($elem) {
		if (IS_ANIMATION && "none" === $elem.css("animation-name") && "none" === $elem.css("-webkit-animation-name") && "none" === $elem.css("-moz-animation-name") && "none" === $elem.css("-o-animation-name") && "none" === $elem.css("-ms-animation-name")) return 0;
		var max, len, num, i, duration = $elem.css("animation-duration") || $elem.css("-webkit-animation-duration") || $elem.css("-moz-animation-duration") || $elem.css("-o-animation-duration") || $elem.css("-ms-animation-duration") || "0s",
			delay = $elem.css("animation-delay") || $elem.css("-webkit-animation-delay") || $elem.css("-moz-animation-delay") || $elem.css("-o-animation-delay") || $elem.css("-ms-animation-delay") || "0s",
			iterationCount = $elem.css("animation-iteration-count") || $elem.css("-webkit-animation-iteration-count") || $elem.css("-moz-animation-iteration-count") || $elem.css("-o-animation-iteration-count") || $elem.css("-ms-animation-iteration-count") || "1";
		for (duration = duration.split(", "), delay = delay.split(", "), iterationCount = iterationCount.split(", "), i = 0, len = duration.length, max = Number.NEGATIVE_INFINITY; len > i; i++) num = parseFloat(duration[i]) * parseInt(iterationCount[i], 10) + parseFloat(delay[i]), num > max && (max = num);
		return max
	}

	function getScrollbarWidth() {
		if ($(document.body).height() <= $(window).height()) return 0;
		var widthNoScroll, widthWithScroll, outer = document.createElement("div"),
			inner = document.createElement("div");
		return outer.style.visibility = "hidden", outer.style.width = "100px", document.body.appendChild(outer), widthNoScroll = outer.offsetWidth, outer.style.overflow = "scroll", inner.style.width = "100%", outer.appendChild(inner), widthWithScroll = inner.offsetWidth, outer.parentNode.removeChild(outer), widthNoScroll - widthWithScroll
	}

	function lockScreen() {
		if (!IS_IOS) {
			var paddingRight, $body, $html = $("html"),
				lockedClass = namespacify("is-locked");
			$html.hasClass(lockedClass) || ($body = $(document.body), paddingRight = parseInt($body.css("padding-right"), 10) + getScrollbarWidth(), $body.css("padding-right", paddingRight + "px"), $html.addClass(lockedClass))
		}
	}

	function unlockScreen() {
		if (!IS_IOS) {
			var paddingRight, $body, $html = $("html"),
				lockedClass = namespacify("is-locked");
			$html.hasClass(lockedClass) && ($body = $(document.body), paddingRight = parseInt($body.css("padding-right"), 10) - getScrollbarWidth(), $body.css("padding-right", paddingRight + "px"), $html.removeClass(lockedClass))
		}
	}

	function setState(instance, state, isSilent, reason) {
		var newState = namespacify("is", state),
			allStates = [namespacify("is", STATES.CLOSING), namespacify("is", STATES.OPENING), namespacify("is", STATES.CLOSED), namespacify("is", STATES.OPENED)].join(" ");
		instance.$bg.removeClass(allStates).addClass(newState), instance.$overlay.removeClass(allStates).addClass(newState), instance.$wrapper.removeClass(allStates).addClass(newState), instance.$modal.removeClass(allStates).addClass(newState), instance.state = state, !isSilent && instance.$modal.trigger({
			type: state,
			reason: reason
		}, [{
			reason: reason
		}])
	}

	function syncWithAnimation(doBeforeAnimation, doAfterAnimation, instance) {
		var runningAnimationsCount = 0,
			handleAnimationStart = function(e) {
				e.target === this && runningAnimationsCount++
			},
			handleAnimationEnd = function(e) {
				e.target === this && 0 === --runningAnimationsCount && ($.each(["$bg", "$overlay", "$wrapper", "$modal"], function(index, elemName) {
					instance[elemName].off(ANIMATIONSTART_EVENTS + " " + ANIMATIONEND_EVENTS)
				}), doAfterAnimation())
			};
		$.each(["$bg", "$overlay", "$wrapper", "$modal"], function(index, elemName) {
			instance[elemName].on(ANIMATIONSTART_EVENTS, handleAnimationStart).on(ANIMATIONEND_EVENTS, handleAnimationEnd)
		}), doBeforeAnimation(), 0 === getAnimationDuration(instance.$bg) && 0 === getAnimationDuration(instance.$overlay) && 0 === getAnimationDuration(instance.$wrapper) && 0 === getAnimationDuration(instance.$modal) && ($.each(["$bg", "$overlay", "$wrapper", "$modal"], function(index, elemName) {
			instance[elemName].off(ANIMATIONSTART_EVENTS + " " + ANIMATIONEND_EVENTS)
		}), doAfterAnimation())
	}

	function halt(instance) {
		instance.state !== STATES.CLOSED && ($.each(["$bg", "$overlay", "$wrapper", "$modal"], function(index, elemName) {
			instance[elemName].off(ANIMATIONSTART_EVENTS + " " + ANIMATIONEND_EVENTS)
		}), instance.$bg.removeClass(instance.settings.modifier), instance.$overlay.removeClass(instance.settings.modifier).hide(), instance.$wrapper.hide(), unlockScreen(), setState(instance, STATES.CLOSED, !0))
	}

	function parseOptions(str) {
		var arr, len, val, i, obj = {};
		for (str = str.replace(/\s*:\s*/g, ":").replace(/\s*,\s*/g, ","), arr = str.split(","), i = 0, len = arr.length; len > i; i++) arr[i] = arr[i].split(":"), val = arr[i][1], ("string" == typeof val || val instanceof String) && (val = "true" === val || ("false" === val ? !1 : val)), ("string" == typeof val || val instanceof String) && (val = isNaN(val) ? val : +val), obj[arr[i][0]] = val;
		return obj
	}

	function namespacify() {
		for (var result = NAMESPACE, i = 0; i < arguments.length; ++i) result += "-" + arguments[i];
		return result
	}

	function handleHashChangeEvent() {
		var instance, $elem, id = location.hash.replace("#", "");
		if (id) {
			try {
				$elem = $("[data-" + PLUGIN_NAME + '-id="' + id + '"]')
			} catch (err) {}
			$elem && $elem.length && (instance = $[PLUGIN_NAME].lookup[$elem.data(PLUGIN_NAME)], instance && instance.settings.hashTracking && instance.open())
		} else current && current.state === STATES.OPENED && current.settings.hashTracking && current.close()
	}

	function Remodal($modal, options) {
		var $body = $(document.body),
			remodal = this;
		remodal.settings = $.extend({}, DEFAULTS, options), remodal.index = $[PLUGIN_NAME].lookup.push(remodal) - 1, remodal.state = STATES.CLOSED, remodal.$overlay = $("." + namespacify("overlay")), remodal.$overlay.length || (remodal.$overlay = $("<div>").addClass(namespacify("overlay") + " " + namespacify("is", STATES.CLOSED)).hide(), $body.append(remodal.$overlay)), remodal.$bg = $("." + namespacify("bg")).addClass(namespacify("is", STATES.CLOSED)), remodal.$modal = $modal.addClass(NAMESPACE + " " + namespacify("is-initialized") + " " + remodal.settings.modifier + " " + namespacify("is", STATES.CLOSED)).attr("tabindex", "-1"), remodal.$wrapper = $("<div>").addClass(namespacify("wrapper") + " " + remodal.settings.modifier + " " + namespacify("is", STATES.CLOSED)).hide().append(remodal.$modal), $body.append(remodal.$wrapper), remodal.$wrapper.on("click." + NAMESPACE, "[data-" + PLUGIN_NAME + '-action="close"]', function(e) {
			e.preventDefault(), remodal.close()
		}), remodal.$wrapper.on("click." + NAMESPACE, "[data-" + PLUGIN_NAME + '-action="cancel"]', function(e) {
			e.preventDefault(), remodal.$modal.trigger(STATE_CHANGE_REASONS.CANCELLATION), remodal.settings.closeOnCancel && remodal.close(STATE_CHANGE_REASONS.CANCELLATION)
		}), remodal.$wrapper.on("click." + NAMESPACE, "[data-" + PLUGIN_NAME + '-action="confirm"]', function(e) {
			e.preventDefault(), remodal.$modal.trigger(STATE_CHANGE_REASONS.CONFIRMATION), remodal.settings.closeOnConfirm && remodal.close(STATE_CHANGE_REASONS.CONFIRMATION)
		}), remodal.$wrapper.on("click." + NAMESPACE, function(e) {
			var $target = $(e.target);
			$target.hasClass(namespacify("wrapper")) && remodal.settings.closeOnOutsideClick && remodal.close()
		})
	}
	var current, scrollTop, PLUGIN_NAME = "remodal",
		NAMESPACE = global.REMODAL_GLOBALS && global.REMODAL_GLOBALS.NAMESPACE || PLUGIN_NAME,
		ANIMATIONSTART_EVENTS = $.map(["animationstart", "webkitAnimationStart", "MSAnimationStart", "oAnimationStart"], function(eventName) {
			return eventName + "." + NAMESPACE
		}).join(" "),
		ANIMATIONEND_EVENTS = $.map(["animationend", "webkitAnimationEnd", "MSAnimationEnd", "oAnimationEnd"], function(eventName) {
			return eventName + "." + NAMESPACE
		}).join(" "),
		DEFAULTS = $.extend({
			hashTracking: !0,
			closeOnConfirm: !0,
			closeOnCancel: !0,
			closeOnEscape: !0,
			closeOnOutsideClick: !0,
			modifier: ""
		}, global.REMODAL_GLOBALS && global.REMODAL_GLOBALS.DEFAULTS),
		STATES = {
			CLOSING: "closing",
			CLOSED: "closed",
			OPENING: "opening",
			OPENED: "opened"
		},
		STATE_CHANGE_REASONS = {
			CONFIRMATION: "confirmation",
			CANCELLATION: "cancellation"
		},
		IS_ANIMATION = function() {
			var style = document.createElement("div").style;
			return void 0 !== style.animationName || void 0 !== style.WebkitAnimationName || void 0 !== style.MozAnimationName || void 0 !== style.msAnimationName || void 0 !== style.OAnimationName
		}(),
		IS_IOS = /iPad|iPhone|iPod/.test(navigator.platform);
	Remodal.prototype.open = function() {
		var id, remodal = this;
		remodal.state !== STATES.OPENING && remodal.state !== STATES.CLOSING && (id = remodal.$modal.attr("data-" + PLUGIN_NAME + "-id"), id && remodal.settings.hashTracking && (scrollTop = $(window).scrollTop(), location.hash = id), current && current !== remodal && halt(current), current = remodal, lockScreen(), remodal.$bg.addClass(remodal.settings.modifier), remodal.$overlay.addClass(remodal.settings.modifier).show(), remodal.$wrapper.show().scrollTop(0), remodal.$modal.focus(), syncWithAnimation(function() {
			setState(remodal, STATES.OPENING)
		}, function() {
			setState(remodal, STATES.OPENED)
		}, remodal))
	}, Remodal.prototype.close = function(reason) {
		var remodal = this;
		remodal.state !== STATES.OPENING && remodal.state !== STATES.CLOSING && (remodal.settings.hashTracking && remodal.$modal.attr("data-" + PLUGIN_NAME + "-id") === location.hash.substr(1) && (location.hash = "", $(window).scrollTop(scrollTop)), syncWithAnimation(function() {
			setState(remodal, STATES.CLOSING, !1, reason)
		}, function() {
			remodal.$bg.removeClass(remodal.settings.modifier), remodal.$overlay.removeClass(remodal.settings.modifier).hide(),
				remodal.$wrapper.hide(), unlockScreen(), setState(remodal, STATES.CLOSED, !1, reason)
		}, remodal))
	}, Remodal.prototype.getState = function() {
		return this.state
	}, Remodal.prototype.destroy = function() {
		var instanceCount, lookup = $[PLUGIN_NAME].lookup;
		halt(this), this.$wrapper.remove(), delete lookup[this.index], instanceCount = $.grep(lookup, function(instance) {
			return !!instance
		}).length, 0 === instanceCount && (this.$overlay.remove(), this.$bg.removeClass(namespacify("is", STATES.CLOSING) + " " + namespacify("is", STATES.OPENING) + " " + namespacify("is", STATES.CLOSED) + " " + namespacify("is", STATES.OPENED)))
	}, $[PLUGIN_NAME] = {
		lookup: []
	}, $.fn[PLUGIN_NAME] = function(opts) {
		var instance, $elem;
		return this.each(function(index, elem) {
			$elem = $(elem), null == $elem.data(PLUGIN_NAME) ? (instance = new Remodal($elem, opts), $elem.data(PLUGIN_NAME, instance.index), instance.settings.hashTracking && $elem.attr("data-" + PLUGIN_NAME + "-id") === location.hash.substr(1) && instance.open()) : instance = $[PLUGIN_NAME].lookup[$elem.data(PLUGIN_NAME)]
		}), instance
	}, $(document).ready(function() {
		$(document).on("click", "[data-" + PLUGIN_NAME + "-target]", function(e) {
			e.preventDefault();
			var elem = e.currentTarget,
				id = elem.getAttribute("data-" + PLUGIN_NAME + "-target"),
				$target = $("[data-" + PLUGIN_NAME + '-id="' + id + '"]');
			$[PLUGIN_NAME].lookup[$target.data(PLUGIN_NAME)].open()
		}), $(document).find("." + NAMESPACE).each(function(i, container) {
			var $container = $(container),
				options = $container.data(PLUGIN_NAME + "-options");
			options ? ("string" == typeof options || options instanceof String) && (options = parseOptions(options)) : options = {}, $container[PLUGIN_NAME](options)
		}), $(document).on("keydown." + NAMESPACE, function(e) {
			current && current.settings.closeOnEscape && current.state === STATES.OPENED && 27 === e.keyCode && current.close()
		}), $(window).on("hashchange." + NAMESPACE, handleHashChangeEvent)
	})
});
var $ = jQuery;
! function($) {
	$("document").ready(function() {
		"use strict";
		App.init();
		var throttle;
		$(window).on("resize", function() {
			clearTimeout(throttle), throttle = setTimeout(function() {
				App.resizeHandler()
			}, 100)
		})
	});
	var App = {
		transition: null,
		touch: !1,
		video: null,
		slideShowImages: [],
		slideShowIndex: 0,
		slideShow: null,
		modal: null,
		init: function() {
			"use strict";
			if (!App.detectCssFeature("transition")) {
				window.history.location || window.location
			}
			var video = $("body").data("video");
			"undefined" != typeof video && (App.video = video.toString()), page("*", this.displayPage), page(), App.touch = "ontouchstart" in window || navigator.msMaxTouchPoints, App.background(), App.detectCssFeature("transition") ? App.splash() : $("#splash").addClass("hidden")
		},
		splash: function() {
			var splash = $("#splash"),
				line = $(".line", "#splash"),
				logo = $(".splash-logo", "#splash"),
				main = $("main", "#wrapper");
			logo.addClass("visible"), main.addClass("splash-transition"), line.one("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
				splash.addClass("slide-from-top-in"), main.addClass("splash-transition-out"), main.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
					main.removeClass("splash-transition-out splash-transition").unbind()
				}), line.unbind()
			})
		},
		displayPage: function(ctx, next) {
			$.ajax({
				type: "GET",
				url: ctx.path,
				cache: !0,
				success: function(result) {
					function transitionComplete() {
						previous.remove(), App.activatePage(), main.css({
							"overflow-y": "scroll"
						}).unbind(), next()
					}
					var body = $(result),
						previous = $("main", "#wrapper"),
						main = body.find("main"),
						previousTransition = previous.data("transition"),
						supportsTransition = App.detectCssFeature("transition"),
						wrapper = $("#wrapper");
					if (ctx.init) App.activatePage(), next();
					else if (supportsTransition) {
						if ("undefined" != typeof previousTransition && previous.removeClass(previousTransition + " " + previousTransition + "-in " + previousTransition + "-out"), main.addClass(App.transition + " " + App.transition + "-in"), !App.touch) {
							main.css({
								overflow: "hidden"
							});
							var strokes = main.find(".strokes");
							strokes.length > 0 && strokes.css({
								overflow: "hidden"
							})
						}
						wrapper.prepend(main), setTimeout(function() {
							previous.addClass(App.transition + " " + App.transition + "-out"), App.touch || previous.css({
								overflow: "hidden"
							}), main.removeClass(App.transition + "-in")
						}, 100), main.data("transition", App.transition);
						var transitionCompleted = !1;
						main.one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
							transitionCompleted = !0, transitionComplete()
						}), setTimeout(function() {
							0 == transitionCompleted && transitionComplete()
						}, 1e3)
					} else wrapper.prepend(main), previous.remove(), main.unbind(), App.activatePage()
				},
				error: function(data) {
					404 == data.status && App.activatePage()
				}
			})
		},
		activatePage: function() {
			$("body").trigger("pageActivated");
			$(window).innerWidth();
			device.desktop() && $("#navigation").length > 0 && (new Slidenavigation($("#navigation")), App.touch && $(".strokes", "#wrapper").css("overflow-x", "scroll")), $("a", "#wrapper").on("click", function(e) {
				var $el = $(this);
				if ($el.hasClass("gallery-item")) return e.preventDefault(), void App.initPhotoswipe($el);
				if ($el.hasClass("activate-modal")) return e.preventDefault(), void App.initModal($el);
				if (!App.detectCssFeature("transition")) {
					var link = $el.attr("href");
					e.preventDefault(), page.show(link)
				}
				var t = $el.data("transition");
				App.transition = "undefined" != typeof t ? t : "transition"
			}), $("form", "#wrapper").length > 0 && App.initForms()
		},
		initForms: function() {
			$(".ambiance-html-form", "#wrapper").submit(function(e) {
				e.preventDefault();
				var $form = $(this),
					data = $form.serialize(),
					method = $form.attr("method"),
					action = $form.attr("action");
				$.ajax({
					url: action,
					method: method,
					data: data,
					cache: !1,
					dataType: "json",
					success: function(e) {
						$form.find(".message").html(e.message), 1 == e.success && ($form.find("input[type=text], input[type=email], textarea").val(""), App.initModal())
					}
				})
			})
		},
		initModal: function() {
			App.modal = $("[data-remodal-id=modal]").remodal({
				hashTracking: !1
			}), App.modal.open()
		},
		initPhotoswipe: function($el) {
			var galleryItems = [],
				itemIndex = 0;
			if ($(".gallery-item").each(function(index) {
					var $item = $(this),
						url = $item.attr("href");
					if (url.length) {
						var w = parseInt($(this).find("img").get(0).naturalWidth, 10),
							h = parseInt($(this).find("img").get(0).naturalHeight, 10);
						galleryItems.push({
							src: url,
							w: w,
							h: h
						}), $item.is($el) && (itemIndex = index)
					}
				}), galleryItems.length > 0) {
				var options = {
						index: itemIndex,
						bgOpacity: 1,
						history: !1
					},
					pswpElement = $(".pswp").get(0),
					gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, galleryItems, options);
				gallery.init()
			}
		},
		background: function() {
			device.desktop() && App.video ? $("main", "#wrapper").backgroundvideo({
				videoId: App.video
			}) : App.slideShow()
		},
		slideShow: function() {
			this.slideShow = $("#slideshow"), this.slideShowIndex = 0;
			var _this = this,
				slidesShowLength = this.slideShow.length;
			if (slidesShowLength > 0) {
				for (var items = _this.slideShow.find("li"), i = 0; i < items.length; i++) {
					var item = $(items[i]),
						image = item.find("img").attr("src");
					_this.slideShowImages.push(image), item.css({
						"background-image": "url(" + image + ")",
						display: "none"
					})
				}
				if (this.slideShowImages.length > 1) this.showSlide();
				else {
					var next = _this.slideShow.find("li:eq(0)");
					null != next && next.css({
						display: "block",
						opacity: 1
					})
				}
			}
		},
		showSlide: function() {
			var _this = App,
				next = _this.slideShow.find("li:eq(" + _this.slideShowIndex + ")"),
				supportsAnimation = _this.detectCssFeature("animation");
			_this.slideShow.children().css("z-index", 0), next.css({
				"z-index": 1,
				display: "block"
			}), supportsAnimation ? (next.one("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
				next.unbind(), next.removeClass("visible")
			}), next.addClass("visible"), setTimeout(_this.showSlide, 7e3)) : (next.fadeTo(1e3, 1), setTimeout(_this.showSlide, 6e3), setTimeout(function() {
				next.css("opacity", 0)
			}, 7e3)), _this.slideShowIndex == _this.slideShowImages.length - 1 ? _this.slideShowIndex = 0 : _this.slideShowIndex++
		},
		detectCssFeature: function(featurename) {
			var feature = !1,
				domPrefixes = "Webkit Moz ms O".split(" "),
				elm = document.createElement("div"),
				featurenameCapital = null;
			if (featurename = featurename.toLowerCase(), void 0 !== elm.style[featurename] && (feature = !0), feature === !1) {
				featurenameCapital = featurename.charAt(0).toUpperCase() + featurename.substr(1);
				for (var i = 0; i < domPrefixes.length; i++)
					if (void 0 !== elm.style[domPrefixes[i] + featurenameCapital]) {
						feature = !0;
						break
					}
			}
			return feature
		},
		resizeHandler: function() {
			var $window = $(window),
				navigation = $("#navigation");
			if (navigation.length > 0 && $window.width() < 950 ? (navigation.css({
					left: "0"
				}), navigation.unbind("mousemove")) : (new Slidenavigation(navigation), App.touch && $(".strokes", "#wrapper").css("overflow-x", "scroll")), App.touch) {
				var timeout, activeBackground = $("#slideShow > .visible");
				$window.on("resize", function() {
					timeout && clearTimeout(timeout), timeout = setTimeout(function() {
						activeBackground.height($window.height() + 60)
					}, 100)
				})
			}
		}
	}
}(jQuery);