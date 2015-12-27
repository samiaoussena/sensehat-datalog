/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 * 
 * http://blog.stevenlevithan.com/archives/date-time-format
 */
(function(){
	
	var dateFormat = function () {
		var	token = /d{1,4}|M{1,4}|yy(?:yy)?|q|([HhmsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
			timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
			timezoneClip = /[^-+\dA-Z]/g,
			pad = function (val, len) {
				val = String(val);
				len = len || 2;
				while (val.length < len) val = "0" + val;
				return val;
			};
	
		// Regexes and supporting functions are cached through closure
		return function (date, mask, utc) {
			var dF = dateFormat;
	
			// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
			if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
				mask = date;
				date = undefined;
			}
	
			// Passing date through Date applies Date.parse, if necessary
			date = date ? new Date(date) : new Date;
			if (isNaN(date)) {
				return "";
				//throw SyntaxError("invalid date");
			}
	
			mask = String(dF.masks[mask] || mask || dF.masks["default"]);
	
			// Allow setting the utc argument via the mask
			if (mask.slice(0, 4) == "UTC:") {
				mask = mask.slice(4);
				utc = true;
			}
	
			var	_ = utc ? "getUTC" : "get",
				d = date[_ + "Date"](),
				D = date[_ + "Day"](),
				M = date[_ + "Month"](),
				y = date[_ + "FullYear"](),
				H = date[_ + "Hours"](),
				m = date[_ + "Minutes"](),
				s = date[_ + "Seconds"](),
				L = date[_ + "Milliseconds"](),
				o = utc ? 0 : date.getTimezoneOffset(),
				q = [4,1,2,3],
				flags = {
					d:    d,
					dd:   pad(d),
					ddd:  dF.i18n.dayNames[D],
					dddd: dF.i18n.dayNames[D + 7],
					M:    M + 1,
					MM:   pad(M + 1),
					MMM:  dF.i18n.monthNames[M],
					MMMM: dF.i18n.monthNames[M + 12],
					yy:   String(y).slice(2),
					yyyy: y,
					h:    H % 12 || 12,
					hh:   pad(H % 12 || 12),
					H:    H,
					HH:   pad(H),
					m:    m,
					mm:   pad(m),
					s:    s,
					ss:   pad(s),
					l:    pad(L, 3),
					L:    pad(L > 99 ? Math.round(L / 10) : L),
					t:    H < 12 ? "a"  : "p",
					tt:   H < 12 ? "am" : "pm",
					T:    H < 12 ? "A"  : "P",
					TT:   H < 12 ? "AM" : "PM",
					Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
					o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
					S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10],
					q:    q[Math.floor(M / 3)]
				};
	
			return mask.replace(token, function ($0) {
				return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
			});
		};
	}();
	
	// Some common format strings
	dateFormat.masks = {
		"default":      "ddd MMM dd yyyy HH:mm:ss",
		shortDate:      "M/d/yy",
		mediumDate:     "MMM d, yyyy",
		longDate:       "MMMM d, yyyy",
		fullDate:       "dddd, MMMM d, yyyy",
		shortTime:      "h:mm TT",
		mediumTime:     "h:mm:ss TT",
		longTime:       "h:mm:ss TT Z",
		isoDate:        "yyyy-MM-dd",
		isoTime:        "HH:mm:ss",
		isoDateTime:    "yyyy-MM-dd'T'HH:mm:ss",
		isoUtcDateTime: "UTC:yyyy-MM-dd'T'HH:mm:ss'Z'"
	};
	
	// Internationalization strings
	if( typeof __LOCALE__ !== "undefined" && __LOCALE__ == "ko_KR" ){
		dateFormat.i18n = {
			dayNames: [
				"일", "월", "화", "수", "목", "금", "토",
				"일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"
			],
			monthNames: [
				'1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월',
				'1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'
				
			]
		};
	} else {
		dateFormat.i18n = {
			dayNames: [
				"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
				"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
			],
			monthNames: [
				"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
				"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
			]
		};
	}
	
	// For convenience...
	if (typeof Date.prototype.format == 'function') {
		console.log("Date.prototype.format already exist!");
	} else {
		Date.prototype.format = function (mask, utc) {
			return dateFormat(this, mask, utc);
		};
	}
	
})();