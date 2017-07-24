

/*!
 * Globalize
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */

(function( window, undefined ) {

var Globalize,
	// private variables
	regexHex,
	regexInfinity,
	regexParseFloat,
	regexTrim,
	// private JavaScript utility functions
	arrayIndexOf,
	endsWith,
	extend,
	isArray,
	isFunction,
	isObject,
	startsWith,
	trim,
	truncate,
	zeroPad,
	// private Globalization utility functions
	appendPreOrPostMatch,
	expandFormat,
	formatDate,
	formatNumber,
	getTokenRegExp,
	getEra,
	getEraYear,
	parseExact,
	parseNegativePattern;

// Global variable (Globalize) or CommonJS module (globalize)
Globalize = function( cultureSelector ) {
	return new Globalize.prototype.init( cultureSelector );
};

if ( typeof require !== "undefined" &&
	typeof exports !== "undefined" &&
	typeof module !== "undefined" ) {
	// Assume CommonJS
	module.exports = Globalize;
} else {
	// Export as global variable
	window.Globalize = Globalize;
}

Globalize.cultures = {};

Globalize.prototype = {
	constructor: Globalize,
	init: function( cultureSelector ) {
		this.cultures = Globalize.cultures;
		this.cultureSelector = cultureSelector;

		return this;
	}
};
Globalize.prototype.init.prototype = Globalize.prototype;

// 1. When defining a culture, all fields are required except the ones stated as optional.
// 2. Each culture should have a ".calendars" object with at least one calendar named "standard"
//    which serves as the default calendar in use by that culture.
// 3. Each culture should have a ".calendar" object which is the current calendar being used,
//    it may be dynamically changed at any time to one of the calendars in ".calendars".
Globalize.cultures[ "default" ] = {
	// A unique name for the culture in the form <language code>-<country/region code>
	name: "en",
	// the name of the culture in the english language
	englishName: "English",
	// the name of the culture in its own language
	nativeName: "English",
	// whether the culture uses right-to-left text
	isRTL: false,
	// "language" is used for so-called "specific" cultures.
	// For example, the culture "es-CL" means "Spanish, in Chili".
	// It represents the Spanish-speaking culture as it is in Chili,
	// which might have different formatting rules or even translations
	// than Spanish in Spain. A "neutral" culture is one that is not
	// specific to a region. For example, the culture "es" is the generic
	// Spanish culture, which may be a more generalized version of the language
	// that may or may not be what a specific culture expects.
	// For a specific culture like "es-CL", the "language" field refers to the
	// neutral, generic culture information for the language it is using.
	// This is not always a simple matter of the string before the dash.
	// For example, the "zh-Hans" culture is netural (Simplified Chinese).
	// And the "zh-SG" culture is Simplified Chinese in Singapore, whose lanugage
	// field is "zh-CHS", not "zh".
	// This field should be used to navigate from a specific culture to it's
	// more general, neutral culture. If a culture is already as general as it
	// can get, the language may refer to itself.
	language: "en",
	// numberFormat defines general number formatting rules, like the digits in
	// each grouping, the group separator, and how negative numbers are displayed.
	numberFormat: {
		// [negativePattern]
		// Note, numberFormat.pattern has no "positivePattern" unlike percent and currency,
		// but is still defined as an array for consistency with them.
		//   negativePattern: one of "(n)|-n|- n|n-|n -"
		pattern: [ "-n" ],
		// number of decimal places normally shown
		decimals: 2,
		// string that separates number groups, as in 1,000,000
		",": ",",
		// string that separates a number from the fractional portion, as in 1.99
		".": ".",
		// array of numbers indicating the size of each number group.
		// TODO: more detailed description and example
		groupSizes: [ 3 ],
		// symbol used for positive numbers
		"+": "+",
		// symbol used for negative numbers
		"-": "-",
		// symbol used for NaN (Not-A-Number)
		"NaN": "NaN",
		// symbol used for Negative Infinity
		negativeInfinity: "-Infinity",
		// symbol used for Positive Infinity
		positiveInfinity: "Infinity",
		percent: {
			// [negativePattern, positivePattern]
			//   negativePattern: one of "-n %|-n%|-%n|%-n|%n-|n-%|n%-|-% n|n %-|% n-|% -n|n- %"
			//   positivePattern: one of "n %|n%|%n|% n"
			pattern: [ "-n %", "n %" ],
			// number of decimal places normally shown
			decimals: 2,
			// array of numbers indicating the size of each number group.
			// TODO: more detailed description and example
			groupSizes: [ 3 ],
			// string that separates number groups, as in 1,000,000
			",": ",",
			// string that separates a number from the fractional portion, as in 1.99
			".": ".",
			// symbol used to represent a percentage
			symbol: "%"
		},
		currency: {
			// [negativePattern, positivePattern]
			//   negativePattern: one of "($n)|-$n|$-n|$n-|(n$)|-n$|n-$|n$-|-n $|-$ n|n $-|$ n-|$ -n|n- $|($ n)|(n $)"
			//   positivePattern: one of "$n|n$|$ n|n $"
			pattern: [ "($n)", "$n" ],
			// number of decimal places normally shown
			decimals: 2,
			// array of numbers indicating the size of each number group.
			// TODO: more detailed description and example
			groupSizes: [ 3 ],
			// string that separates number groups, as in 1,000,000
			",": ",",
			// string that separates a number from the fractional portion, as in 1.99
			".": ".",
			// symbol used to represent currency
			symbol: "$"
		}
	},
	// calendars defines all the possible calendars used by this culture.
	// There should be at least one defined with name "standard", and is the default
	// calendar used by the culture.
	// A calendar contains information about how dates are formatted, information about
	// the calendar's eras, a standard set of the date formats,
	// translations for day and month names, and if the calendar is not based on the Gregorian
	// calendar, conversion functions to and from the Gregorian calendar.
	calendars: {
		standard: {
			// name that identifies the type of calendar this is
			name: "Gregorian_USEnglish",
			// separator of parts of a date (e.g. "/" in 11/05/1955)
			"/": "/",
			// separator of parts of a time (e.g. ":" in 05:44 PM)
			":": ":",
			// the first day of the week (0 = Sunday, 1 = Monday, etc)
			firstDay: 0,
			days: {
				// full day names
				names: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
				// abbreviated day names
				namesAbbr: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
				// shortest day names
				namesShort: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ]
			},
			months: {
				// full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
				names: [ "Januari", "Februari", "Maret", "April", "May", "June", "July", "August", "September", "October", "November", "December", "" ],
				// abbreviated month names
				namesAbbr: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "" ]
			},
			// AM and PM designators in one of these forms:
			// The usual view, and the upper and lower case versions
			//   [ standard, lowercase, uppercase ]
			// The culture does not use AM or PM (likely all standard date formats use 24 hour time)
			//   null
			AM: [ "AM", "am", "AM" ],
			PM: [ "PM", "pm", "PM" ],
			eras: [
				// eras in reverse chronological order.
				// name: the name of the era in this culture (e.g. A.D., C.E.)
				// start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
				// offset: offset in years from gregorian calendar
				{
					"name": "A.D.",
					"start": null,
					"offset": 0
				}
			],
			// when a two digit year is given, it will never be parsed as a four digit
			// year greater than this year (in the appropriate era for the culture)
			// Set it as a full year (e.g. 2029) or use an offset format starting from
			// the current year: "+19" would correspond to 2029 if the current year 2010.
			twoDigitYearMax: 2029,
			// set of predefined date and time patterns used by the culture
			// these represent the format someone in this culture would expect
			// to see given the portions of the date that are shown.
			patterns: {
				// short date pattern
				d: "M/d/yyyy",
				// long date pattern
				D: "dddd, MMMM dd, yyyy",
				// short time pattern
				t: "h:mm tt",
				// long time pattern
				T: "h:mm:ss tt",
				// long date, short time pattern
				f: "dddd, MMMM dd, yyyy h:mm tt",
				// long date, long time pattern
				F: "dddd, MMMM dd, yyyy h:mm:ss tt",
				// month/day pattern
				M: "MMMM dd",
				// month/year pattern
				Y: "yyyy MMMM",
				// S is a sortable format that does not vary by culture
				S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss"
			}
			// optional fields for each calendar:
			/*
			monthsGenitive:
				Same as months but used when the day preceeds the month.
				Omit if the culture has no genitive distinction in month names.
				For an explaination of genitive months, see http://blogs.msdn.com/michkap/archive/2004/12/25/332259.aspx
			convert:
				Allows for the support of non-gregorian based calendars. This convert object is used to
				to convert a date to and from a gregorian calendar date to handle parsing and formatting.
				The two functions:
					fromGregorian( date )
						Given the date as a parameter, return an array with parts [ year, month, day ]
						corresponding to the non-gregorian based year, month, and day for the calendar.
					toGregorian( year, month, day )
						Given the non-gregorian year, month, and day, return a new Date() object
						set to the corresponding date in the gregorian calendar.
			*/
		}
	},
	// For localized strings
	messages: {}
};

Globalize.cultures[ "default" ].calendar = Globalize.cultures[ "default" ].calendars.standard;

Globalize.cultures.en = Globalize.cultures[ "default" ];

Globalize.cultureSelector = "en";

//
// private variables
//

regexHex = /^0x[a-f0-9]+$/i;
regexInfinity = /^[+\-]?infinity$/i;
regexParseFloat = /^[+\-]?\d*\.?\d*(e[+\-]?\d+)?$/;
regexTrim = /^\s+|\s+$/g;

//
// private JavaScript utility functions
//

arrayIndexOf = function( array, item ) {
	if ( array.indexOf ) {
		return array.indexOf( item );
	}
	for ( var i = 0, length = array.length; i < length; i++ ) {
		if ( array[i] === item ) {
			return i;
		}
	}
	return -1;
};

endsWith = function( value, pattern ) {
	return value.substr( value.length - pattern.length ) === pattern;
};

extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction(target) ) {
		target = {};
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( isObject(copy) || (copyIsArray = isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && isArray(src) ? src : [];

					} else {
						clone = src && isObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

isArray = Array.isArray || function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Array]";
};

isFunction = function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Function]";
};

isObject = function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Object]";
};

startsWith = function( value, pattern ) {
	return value.indexOf( pattern ) === 0;
};

trim = function( value ) {
	return ( value + "" ).replace( regexTrim, "" );
};

truncate = function( value ) {
	if ( isNaN( value ) ) {
		return NaN;
	}
	return Math[ value < 0 ? "ceil" : "floor" ]( value );
};

zeroPad = function( str, count, left ) {
	var l;
	for ( l = str.length; l < count; l += 1 ) {
		str = ( left ? ("0" + str) : (str + "0") );
	}
	return str;
};

//
// private Globalization utility functions
//

appendPreOrPostMatch = function( preMatch, strings ) {
	// appends pre- and post- token match strings while removing escaped characters.
	// Returns a single quote count which is used to determine if the token occurs
	// in a string literal.
	var quoteCount = 0,
		escaped = false;
	for ( var i = 0, il = preMatch.length; i < il; i++ ) {
		var c = preMatch.charAt( i );
		switch ( c ) {
			case "\'":
				if ( escaped ) {
					strings.push( "\'" );
				}
				else {
					quoteCount++;
				}
				escaped = false;
				break;
			case "\\":
				if ( escaped ) {
					strings.push( "\\" );
				}
				escaped = !escaped;
				break;
			default:
				strings.push( c );
				escaped = false;
				break;
		}
	}
	return quoteCount;
};

expandFormat = function( cal, format ) {
	// expands unspecified or single character date formats into the full pattern.
	format = format || "F";
	var pattern,
		patterns = cal.patterns,
		len = format.length;
	if ( len === 1 ) {
		pattern = patterns[ format ];
		if ( !pattern ) {
			throw "Invalid date format string \'" + format + "\'.";
		}
		format = pattern;
	}
	else if ( len === 2 && format.charAt(0) === "%" ) {
		// %X escape format -- intended as a custom format string that is only one character, not a built-in format.
		format = format.charAt( 1 );
	}
	return format;
};

formatDate = function( value, format, culture ) {
	var cal = culture.calendar,
		convert = cal.convert,
		ret;

	if ( !format || !format.length || format === "i" ) {
		if ( culture && culture.name.length ) {
			if ( convert ) {
				// non-gregorian calendar, so we cannot use built-in toLocaleString()
				ret = formatDate( value, cal.patterns.F, culture );
			}
			else {
				var eraDate = new Date( value.getTime() ),
					era = getEra( value, cal.eras );
				eraDate.setFullYear( getEraYear(value, cal, era) );
				ret = eraDate.toLocaleString();
			}
		}
		else {
			ret = value.toString();
		}
		return ret;
	}

	var eras = cal.eras,
		sortable = format === "s";
	format = expandFormat( cal, format );

	// Start with an empty string
	ret = [];
	var hour,
		zeros = [ "0", "00", "000" ],
		foundDay,
		checkedDay,
		dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g,
		quoteCount = 0,
		tokenRegExp = getTokenRegExp(),
		converted;

	function padZeros( num, c ) {
		var r, s = num + "";
		if ( c > 1 && s.length < c ) {
			r = ( zeros[c - 2] + s);
			return r.substr( r.length - c, c );
		}
		else {
			r = s;
		}
		return r;
	}

	function hasDay() {
		if ( foundDay || checkedDay ) {
			return foundDay;
		}
		foundDay = dayPartRegExp.test( format );
		checkedDay = true;
		return foundDay;
	}

	function getPart( date, part ) {
		if ( converted ) {
			return converted[ part ];
		}
		switch ( part ) {
			case 0:
				return date.getFullYear();
			case 1:
				return date.getMonth();
			case 2:
				return date.getDate();
			default:
				throw "Invalid part value " + part;
		}
	}

	if ( !sortable && convert ) {
		converted = convert.fromGregorian( value );
	}

	for ( ; ; ) {
		// Save the current index
		var index = tokenRegExp.lastIndex,
			// Look for the next pattern
			ar = tokenRegExp.exec( format );

		// Append the text before the pattern (or the end of the string if not found)
		var preMatch = format.slice( index, ar ? ar.index : format.length );
		quoteCount += appendPreOrPostMatch( preMatch, ret );

		if ( !ar ) {
			break;
		}

		// do not replace any matches that occur inside a string literal.
		if ( quoteCount % 2 ) {
			ret.push( ar[0] );
			continue;
		}

		var current = ar[ 0 ],
			clength = current.length;

		switch ( current ) {
			case "ddd":
				//Day of the week, as a three-letter abbreviation
			case "dddd":
				// Day of the week, using the full name
				var names = ( clength === 3 ) ? cal.days.namesAbbr : cal.days.names;
				ret.push( names[value.getDay()] );
				break;
			case "d":
				// Day of month, without leading zero for single-digit days
			case "dd":
				// Day of month, with leading zero for single-digit days
				foundDay = true;
				ret.push(
					padZeros( getPart(value, 2), clength )
				);
				break;
			case "MMM":
				// Month, as a three-letter abbreviation
			case "MMMM":
				// Month, using the full name
				var part = getPart( value, 1 );
				ret.push(
					( cal.monthsGenitive && hasDay() ) ?
					( cal.monthsGenitive[ clength === 3 ? "namesAbbr" : "names" ][ part ] ) :
					( cal.months[ clength === 3 ? "namesAbbr" : "names" ][ part ] )
				);
				break;
			case "M":
				// Month, as digits, with no leading zero for single-digit months
			case "MM":
				// Month, as digits, with leading zero for single-digit months
				ret.push(
					padZeros( getPart(value, 1) + 1, clength )
				);
				break;
			case "y":
				// Year, as two digits, but with no leading zero for years less than 10
			case "yy":
				// Year, as two digits, with leading zero for years less than 10
			case "yyyy":
				// Year represented by four full digits
				part = converted ? converted[ 0 ] : getEraYear( value, cal, getEra(value, eras), sortable );
				if ( clength < 4 ) {
					part = part % 100;
				}
				ret.push(
					padZeros( part, clength )
				);
				break;
			case "h":
				// Hours with no leading zero for single-digit hours, using 12-hour clock
			case "hh":
				// Hours with leading zero for single-digit hours, using 12-hour clock
				hour = value.getHours() % 12;
				if ( hour === 0 ) hour = 12;
				ret.push(
					padZeros( hour, clength )
				);
				break;
			case "H":
				// Hours with no leading zero for single-digit hours, using 24-hour clock
			case "HH":
				// Hours with leading zero for single-digit hours, using 24-hour clock
				ret.push(
					padZeros( value.getHours(), clength )
				);
				break;
			case "m":
				// Minutes with no leading zero for single-digit minutes
			case "mm":
				// Minutes with leading zero for single-digit minutes
				ret.push(
					padZeros( value.getMinutes(), clength )
				);
				break;
			case "s":
				// Seconds with no leading zero for single-digit seconds
			case "ss":
				// Seconds with leading zero for single-digit seconds
				ret.push(
					padZeros( value.getSeconds(), clength )
				);
				break;
			case "t":
				// One character am/pm indicator ("a" or "p")
			case "tt":
				// Multicharacter am/pm indicator
				part = value.getHours() < 12 ? ( cal.AM ? cal.AM[0] : " " ) : ( cal.PM ? cal.PM[0] : " " );
				ret.push( clength === 1 ? part.charAt(0) : part );
				break;
			case "f":
				// Deciseconds
			case "ff":
				// Centiseconds
			case "fff":
				// Milliseconds
				ret.push(
					padZeros( value.getMilliseconds(), 3 ).substr( 0, clength )
				);
				break;
			case "z":
				// Time zone offset, no leading zero
			case "zz":
				// Time zone offset with leading zero
				hour = value.getTimezoneOffset() / 60;
				ret.push(
					( hour <= 0 ? "+" : "-" ) + padZeros( Math.floor(Math.abs(hour)), clength )
				);
				break;
			case "zzz":
				// Time zone offset with leading zero
				hour = value.getTimezoneOffset() / 60;
				ret.push(
					( hour <= 0 ? "+" : "-" ) + padZeros( Math.floor(Math.abs(hour)), 2 ) +
					// Hard coded ":" separator, rather than using cal.TimeSeparator
					// Repeated here for consistency, plus ":" was already assumed in date parsing.
					":" + padZeros( Math.abs(value.getTimezoneOffset() % 60), 2 )
				);
				break;
			case "g":
			case "gg":
				if ( cal.eras ) {
					ret.push(
						cal.eras[ getEra(value, eras) ].name
					);
				}
				break;
		case "/":
			ret.push( cal["/"] );
			break;
		default:
			throw "Invalid date format pattern \'" + current + "\'.";
		}
	}
	return ret.join( "" );
};

// formatNumber
(function() {
	var expandNumber;

	expandNumber = function( number, precision, formatInfo ) {
		var groupSizes = formatInfo.groupSizes,
			curSize = groupSizes[ 0 ],
			curGroupIndex = 1,
			factor = Math.pow( 10, precision ),
			rounded = Math.round( number * factor ) / factor;

		if ( !isFinite(rounded) ) {
			rounded = number;
		}
		number = rounded;

		var numberString = number+"",
			right = "",
			split = numberString.split( /e/i ),
			exponent = split.length > 1 ? parseInt( split[1], 10 ) : 0;
		numberString = split[ 0 ];
		split = numberString.split( "." );
		numberString = split[ 0 ];
		right = split.length > 1 ? split[ 1 ] : "";

		var l;
		if ( exponent > 0 ) {
			right = zeroPad( right, exponent, false );
			numberString += right.slice( 0, exponent );
			right = right.substr( exponent );
		}
		else if ( exponent < 0 ) {
			exponent = -exponent;
			numberString = zeroPad( numberString, exponent + 1, true );
			right = numberString.slice( -exponent, numberString.length ) + right;
			numberString = numberString.slice( 0, -exponent );
		}

		if ( precision > 0 ) {
			right = formatInfo[ "." ] +
				( (right.length > precision) ? right.slice(0, precision) : zeroPad(right, precision) );
		}
		else {
			right = "";
		}

		var stringIndex = numberString.length - 1,
			sep = formatInfo[ "," ],
			ret = "";

		while ( stringIndex >= 0 ) {
			if ( curSize === 0 || curSize > stringIndex ) {
				return numberString.slice( 0, stringIndex + 1 ) + ( ret.length ? (sep + ret + right) : right );
			}
			ret = numberString.slice( stringIndex - curSize + 1, stringIndex + 1 ) + ( ret.length ? (sep + ret) : "" );

			stringIndex -= curSize;

			if ( curGroupIndex < groupSizes.length ) {
				curSize = groupSizes[ curGroupIndex ];
				curGroupIndex++;
			}
		}

		return numberString.slice( 0, stringIndex + 1 ) + sep + ret + right;
	};

	formatNumber = function( value, format, culture ) {
		if ( !isFinite(value) ) {
			if ( value === Infinity ) {
				return culture.numberFormat.positiveInfinity;
			}
			if ( value === -Infinity ) {
				return culture.numberFormat.negativeInfinity;
			}
			return culture.numberFormat.NaN;
		}
		if ( !format || format === "i" ) {
			return culture.name.length ? value.toLocaleString() : value.toString();
		}
		format = format || "D";

		var nf = culture.numberFormat,
			number = Math.abs( value ),
			precision = -1,
			pattern;
		if ( format.length > 1 ) precision = parseInt( format.slice(1), 10 );

		var current = format.charAt( 0 ).toUpperCase(),
			formatInfo;

		switch ( current ) {
			case "D":
				pattern = "n";
				number = truncate( number );
				if ( precision !== -1 ) {
					number = zeroPad( "" + number, precision, true );
				}
				if ( value < 0 ) number = "-" + number;
				break;
			case "N":
				formatInfo = nf;
				/* falls through */
			case "C":
				formatInfo = formatInfo || nf.currency;
				/* falls through */
			case "P":
				formatInfo = formatInfo || nf.percent;
				pattern = value < 0 ? formatInfo.pattern[ 0 ] : ( formatInfo.pattern[1] || "n" );
				if ( precision === -1 ) precision = formatInfo.decimals;
				number = expandNumber( number * (current === "P" ? 100 : 1), precision, formatInfo );
				break;
			default:
				throw "Bad number format specifier: " + current;
		}

		var patternParts = /n|\$|-|%/g,
			ret = "";
		for ( ; ; ) {
			var index = patternParts.lastIndex,
				ar = patternParts.exec( pattern );

			ret += pattern.slice( index, ar ? ar.index : pattern.length );

			if ( !ar ) {
				break;
			}

			switch ( ar[0] ) {
				case "n":
					ret += number;
					break;
				case "$":
					ret += nf.currency.symbol;
					break;
				case "-":
					// don't make 0 negative
					if ( /[1-9]/.test(number) ) {
						ret += nf[ "-" ];
					}
					break;
				case "%":
					ret += nf.percent.symbol;
					break;
			}
		}

		return ret;
	};

}());

getTokenRegExp = function() {
	// regular expression for matching date and time tokens in format strings.
	return (/\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g);
};

getEra = function( date, eras ) {
	if ( !eras ) return 0;
	var start, ticks = date.getTime();
	for ( var i = 0, l = eras.length; i < l; i++ ) {
		start = eras[ i ].start;
		if ( start === null || ticks >= start ) {
			return i;
		}
	}
	return 0;
};

getEraYear = function( date, cal, era, sortable ) {
	var year = date.getFullYear();
	if ( !sortable && cal.eras ) {
		// convert normal gregorian year to era-shifted gregorian
		// year by subtracting the era offset
		year -= cal.eras[ era ].offset;
	}
	return year;
};

// parseExact
(function() {
	var expandYear,
		getDayIndex,
		getMonthIndex,
		getParseRegExp,
		outOfRange,
		toUpper,
		toUpperArray;

	expandYear = function( cal, year ) {
		// expands 2-digit year into 4 digits.
		if ( year < 100 ) {
			var now = new Date(),
				era = getEra( now ),
				curr = getEraYear( now, cal, era ),
				twoDigitYearMax = cal.twoDigitYearMax;
			twoDigitYearMax = typeof twoDigitYearMax === "string" ? new Date().getFullYear() % 100 + parseInt( twoDigitYearMax, 10 ) : twoDigitYearMax;
			year += curr - ( curr % 100 );
			if ( year > twoDigitYearMax ) {
				year -= 100;
			}
		}
		return year;
	};

	getDayIndex = function	( cal, value, abbr ) {
		var ret,
			days = cal.days,
			upperDays = cal._upperDays;
		if ( !upperDays ) {
			cal._upperDays = upperDays = [
				toUpperArray( days.names ),
				toUpperArray( days.namesAbbr ),
				toUpperArray( days.namesShort )
			];
		}
		value = toUpper( value );
		if ( abbr ) {
			ret = arrayIndexOf( upperDays[1], value );
			if ( ret === -1 ) {
				ret = arrayIndexOf( upperDays[2], value );
			}
		}
		else {
			ret = arrayIndexOf( upperDays[0], value );
		}
		return ret;
	};

	getMonthIndex = function( cal, value, abbr ) {
		var months = cal.months,
			monthsGen = cal.monthsGenitive || cal.months,
			upperMonths = cal._upperMonths,
			upperMonthsGen = cal._upperMonthsGen;
		if ( !upperMonths ) {
			cal._upperMonths = upperMonths = [
				toUpperArray( months.names ),
				toUpperArray( months.namesAbbr )
			];
			cal._upperMonthsGen = upperMonthsGen = [
				toUpperArray( monthsGen.names ),
				toUpperArray( monthsGen.namesAbbr )
			];
		}
		value = toUpper( value );
		var i = arrayIndexOf( abbr ? upperMonths[1] : upperMonths[0], value );
		if ( i < 0 ) {
			i = arrayIndexOf( abbr ? upperMonthsGen[1] : upperMonthsGen[0], value );
		}
		return i;
	};

	getParseRegExp = function( cal, format ) {
		// converts a format string into a regular expression with groups that
		// can be used to extract date fields from a date string.
		// check for a cached parse regex.
		var re = cal._parseRegExp;
		if ( !re ) {
			cal._parseRegExp = re = {};
		}
		else {
			var reFormat = re[ format ];
			if ( reFormat ) {
				return reFormat;
			}
		}

		// expand single digit formats, then escape regular expression characters.
		var expFormat = expandFormat( cal, format ).replace( /([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1" ),
			regexp = [ "^" ],
			groups = [],
			index = 0,
			quoteCount = 0,
			tokenRegExp = getTokenRegExp(),
			match;

		// iterate through each date token found.
		while ( (match = tokenRegExp.exec(expFormat)) !== null ) {
			var preMatch = expFormat.slice( index, match.index );
			index = tokenRegExp.lastIndex;

			// don't replace any matches that occur inside a string literal.
			quoteCount += appendPreOrPostMatch( preMatch, regexp );
			if ( quoteCount % 2 ) {
				regexp.push( match[0] );
				continue;
			}

			// add a regex group for the token.
			var m = match[ 0 ],
				len = m.length,
				add;
			switch ( m ) {
				case "dddd": case "ddd":
				case "MMMM": case "MMM":
				case "gg": case "g":
					add = "(\\D+)";
					break;
				case "tt": case "t":
					add = "(\\D*)";
					break;
				case "yyyy":
				case "fff":
				case "ff":
				case "f":
					add = "(\\d{" + len + "})";
					break;
				case "dd": case "d":
				case "MM": case "M":
				case "yy": case "y":
				case "HH": case "H":
				case "hh": case "h":
				case "mm": case "m":
				case "ss": case "s":
					add = "(\\d\\d?)";
					break;
				case "zzz":
					add = "([+-]?\\d\\d?:\\d{2})";
					break;
				case "zz": case "z":
					add = "([+-]?\\d\\d?)";
					break;
				case "/":
					add = "(\\/)";
					break;
				default:
					throw "Invalid date format pattern \'" + m + "\'.";
			}
			if ( add ) {
				regexp.push( add );
			}
			groups.push( match[0] );
		}
		appendPreOrPostMatch( expFormat.slice(index), regexp );
		regexp.push( "$" );

		// allow whitespace to differ when matching formats.
		var regexpStr = regexp.join( "" ).replace( /\s+/g, "\\s+" ),
			parseRegExp = { "regExp": regexpStr, "groups": groups };

		// cache the regex for this format.
		return re[ format ] = parseRegExp;
	};

	outOfRange = function( value, low, high ) {
		return value < low || value > high;
	};

	toUpper = function( value ) {
		// "he-IL" has non-breaking space in weekday names.
		return value.split( "\u00A0" ).join( " " ).toUpperCase();
	};

	toUpperArray = function( arr ) {
		var results = [];
		for ( var i = 0, l = arr.length; i < l; i++ ) {
			results[ i ] = toUpper( arr[i] );
		}
		return results;
	};

	parseExact = function( value, format, culture ) {
		// try to parse the date string by matching against the format string
		// while using the specified culture for date field names.
		value = trim( value );
		var cal = culture.calendar,
			// convert date formats into regular expressions with groupings.
			// use the regexp to determine the input format and extract the date fields.
			parseInfo = getParseRegExp( cal, format ),
			match = new RegExp( parseInfo.regExp ).exec( value );
		if ( match === null ) {
			return null;
		}
		// found a date format that matches the input.
		var groups = parseInfo.groups,
			era = null, year = null, month = null, date = null, weekDay = null,
			hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null,
			pmHour = false;
		// iterate the format groups to extract and set the date fields.
		for ( var j = 0, jl = groups.length; j < jl; j++ ) {
			var matchGroup = match[ j + 1 ];
			if ( matchGroup ) {
				var current = groups[ j ],
					clength = current.length,
					matchInt = parseInt( matchGroup, 10 );
				switch ( current ) {
					case "dd": case "d":
						// Day of month.
						date = matchInt;
						// check that date is generally in valid range, also checking overflow below.
						if ( outOfRange(date, 1, 31) ) return null;
						break;
					case "MMM": case "MMMM":
						month = getMonthIndex( cal, matchGroup, clength === 3 );
						if ( outOfRange(month, 0, 11) ) return null;
						break;
					case "M": case "MM":
						// Month.
						month = matchInt - 1;
						if ( outOfRange(month, 0, 11) ) return null;
						break;
					case "y": case "yy":
					case "yyyy":
						year = clength < 4 ? expandYear( cal, matchInt ) : matchInt;
						if ( outOfRange(year, 0, 9999) ) return null;
						break;
					case "h": case "hh":
						// Hours (12-hour clock).
						hour = matchInt;
						if ( hour === 12 ) hour = 0;
						if ( outOfRange(hour, 0, 11) ) return null;
						break;
					case "H": case "HH":
						// Hours (24-hour clock).
						hour = matchInt;
						if ( outOfRange(hour, 0, 23) ) return null;
						break;
					case "m": case "mm":
						// Minutes.
						min = matchInt;
						if ( outOfRange(min, 0, 59) ) return null;
						break;
					case "s": case "ss":
						// Seconds.
						sec = matchInt;
						if ( outOfRange(sec, 0, 59) ) return null;
						break;
					case "tt": case "t":
						// AM/PM designator.
						// see if it is standard, upper, or lower case PM. If not, ensure it is at least one of
						// the AM tokens. If not, fail the parse for this format.
						pmHour = cal.PM && ( matchGroup === cal.PM[0] || matchGroup === cal.PM[1] || matchGroup === cal.PM[2] );
						if (
							!pmHour && (
								!cal.AM || ( matchGroup !== cal.AM[0] && matchGroup !== cal.AM[1] && matchGroup !== cal.AM[2] )
							)
						) return null;
						break;
					case "f":
						// Deciseconds.
					case "ff":
						// Centiseconds.
					case "fff":
						// Milliseconds.
						msec = matchInt * Math.pow( 10, 3 - clength );
						if ( outOfRange(msec, 0, 999) ) return null;
						break;
					case "ddd":
						// Day of week.
					case "dddd":
						// Day of week.
						weekDay = getDayIndex( cal, matchGroup, clength === 3 );
						if ( outOfRange(weekDay, 0, 6) ) return null;
						break;
					case "zzz":
						// Time zone offset in +/- hours:min.
						var offsets = matchGroup.split( /:/ );
						if ( offsets.length !== 2 ) return null;
						hourOffset = parseInt( offsets[0], 10 );
						if ( outOfRange(hourOffset, -12, 13) ) return null;
						var minOffset = parseInt( offsets[1], 10 );
						if ( outOfRange(minOffset, 0, 59) ) return null;
						tzMinOffset = ( hourOffset * 60 ) + ( startsWith(matchGroup, "-") ? -minOffset : minOffset );
						break;
					case "z": case "zz":
						// Time zone offset in +/- hours.
						hourOffset = matchInt;
						if ( outOfRange(hourOffset, -12, 13) ) return null;
						tzMinOffset = hourOffset * 60;
						break;
					case "g": case "gg":
						var eraName = matchGroup;
						if ( !eraName || !cal.eras ) return null;
						eraName = trim( eraName.toLowerCase() );
						for ( var i = 0, l = cal.eras.length; i < l; i++ ) {
							if ( eraName === cal.eras[i].name.toLowerCase() ) {
								era = i;
								break;
							}
						}
						// could not find an era with that name
						if ( era === null ) return null;
						break;
				}
			}
		}
		var result = new Date(), defaultYear, convert = cal.convert;
		defaultYear = convert ? convert.fromGregorian( result )[ 0 ] : result.getFullYear();
		if ( year === null ) {
			year = defaultYear;
		}
		else if ( cal.eras ) {
			// year must be shifted to normal gregorian year
			// but not if year was not specified, its already normal gregorian
			// per the main if clause above.
			year += cal.eras[( era || 0 )].offset;
		}
		// set default day and month to 1 and January, so if unspecified, these are the defaults
		// instead of the current day/month.
		if ( month === null ) {
			month = 0;
		}
		if ( date === null ) {
			date = 1;
		}
		// now have year, month, and date, but in the culture's calendar.
		// convert to gregorian if necessary
		if ( convert ) {
			result = convert.toGregorian( year, month, date );
			// conversion failed, must be an invalid match
			if ( result === null ) return null;
		}
		else {
			// have to set year, month and date together to avoid overflow based on current date.
			result.setFullYear( year, month, date );
			// check to see if date overflowed for specified month (only checked 1-31 above).
			if ( result.getDate() !== date ) return null;
			// invalid day of week.
			if ( weekDay !== null && result.getDay() !== weekDay ) {
				return null;
			}
		}
		// if pm designator token was found make sure the hours fit the 24-hour clock.
		if ( pmHour && hour < 12 ) {
			hour += 12;
		}
		result.setHours( hour, min, sec, msec );
		if ( tzMinOffset !== null ) {
			// adjust timezone to utc before applying local offset.
			var adjustedMin = result.getMinutes() - ( tzMinOffset + result.getTimezoneOffset() );
			// Safari limits hours and minutes to the range of -127 to 127.  We need to use setHours
			// to ensure both these fields will not exceed this range.	adjustedMin will range
			// somewhere between -1440 and 1500, so we only need to split this into hours.
			result.setHours( result.getHours() + parseInt(adjustedMin / 60, 10), adjustedMin % 60 );
		}
		return result;
	};
}());

parseNegativePattern = function( value, nf, negativePattern ) {
	var neg = nf[ "-" ],
		pos = nf[ "+" ],
		ret;
	switch ( negativePattern ) {
		case "n -":
			neg = " " + neg;
			pos = " " + pos;
			/* falls through */
		case "n-":
			if ( endsWith(value, neg) ) {
				ret = [ "-", value.substr(0, value.length - neg.length) ];
			}
			else if ( endsWith(value, pos) ) {
				ret = [ "+", value.substr(0, value.length - pos.length) ];
			}
			break;
		case "- n":
			neg += " ";
			pos += " ";
			/* falls through */
		case "-n":
			if ( startsWith(value, neg) ) {
				ret = [ "-", value.substr(neg.length) ];
			}
			else if ( startsWith(value, pos) ) {
				ret = [ "+", value.substr(pos.length) ];
			}
			break;
		case "(n)":
			if ( startsWith(value, "(") && endsWith(value, ")") ) {
				ret = [ "-", value.substr(1, value.length - 2) ];
			}
			break;
	}
	return ret || [ "", value ];
};

//
// public instance functions
//

Globalize.prototype.findClosestCulture = function( cultureSelector ) {
	return Globalize.findClosestCulture.call( this, cultureSelector );
};

Globalize.prototype.format = function( value, format, cultureSelector ) {
	return Globalize.format.call( this, value, format, cultureSelector );
};

Globalize.prototype.localize = function( key, cultureSelector ) {
	return Globalize.localize.call( this, key, cultureSelector );
};

Globalize.prototype.parseInt = function( value, radix, cultureSelector ) {
	return Globalize.parseInt.call( this, value, radix, cultureSelector );
};

Globalize.prototype.parseFloat = function( value, radix, cultureSelector ) {
	return Globalize.parseFloat.call( this, value, radix, cultureSelector );
};

Globalize.prototype.culture = function( cultureSelector ) {
	return Globalize.culture.call( this, cultureSelector );
};

//
// public singleton functions
//

Globalize.addCultureInfo = function( cultureName, baseCultureName, info ) {

	var base = {},
		isNew = false;

	if ( typeof cultureName !== "string" ) {
		// cultureName argument is optional string. If not specified, assume info is first
		// and only argument. Specified info deep-extends current culture.
		info = cultureName;
		cultureName = this.culture().name;
		base = this.cultures[ cultureName ];
	} else if ( typeof baseCultureName !== "string" ) {
		// baseCultureName argument is optional string. If not specified, assume info is second
		// argument. Specified info deep-extends specified culture.
		// If specified culture does not exist, create by deep-extending default
		info = baseCultureName;
		isNew = ( this.cultures[ cultureName ] == null );
		base = this.cultures[ cultureName ] || this.cultures[ "default" ];
	} else {
		// cultureName and baseCultureName specified. Assume a new culture is being created
		// by deep-extending an specified base culture
		isNew = true;
		base = this.cultures[ baseCultureName ];
	}

	this.cultures[ cultureName ] = extend(true, {},
		base,
		info
	);
	// Make the standard calendar the current culture if it's a new culture
	if ( isNew ) {
		this.cultures[ cultureName ].calendar = this.cultures[ cultureName ].calendars.standard;
	}
};

Globalize.findClosestCulture = function( name ) {
	var match;
	if ( !name ) {
		return this.findClosestCulture( this.cultureSelector ) || this.cultures[ "default" ];
	}
	if ( typeof name === "string" ) {
		name = name.split( "," );
	}
	if ( isArray(name) ) {
		var lang,
			cultures = this.cultures,
			list = name,
			i, l = list.length,
			prioritized = [];
		for ( i = 0; i < l; i++ ) {
			name = trim( list[i] );
			var pri, parts = name.split( ";" );
			lang = trim( parts[0] );
			if ( parts.length === 1 ) {
				pri = 1;
			}
			else {
				name = trim( parts[1] );
				if ( name.indexOf("q=") === 0 ) {
					name = name.substr( 2 );
					pri = parseFloat( name );
					pri = isNaN( pri ) ? 0 : pri;
				}
				else {
					pri = 1;
				}
			}
			prioritized.push({ lang: lang, pri: pri });
		}
		prioritized.sort(function( a, b ) {
			if ( a.pri < b.pri ) {
				return 1;
			} else if ( a.pri > b.pri ) {
				return -1;
			}
			return 0;
		});
		// exact match
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			match = cultures[ lang ];
			if ( match ) {
				return match;
			}
		}

		// neutral language match
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			do {
				var index = lang.lastIndexOf( "-" );
				if ( index === -1 ) {
					break;
				}
				// strip off the last part. e.g. en-US => en
				lang = lang.substr( 0, index );
				match = cultures[ lang ];
				if ( match ) {
					return match;
				}
			}
			while ( 1 );
		}

		// last resort: match first culture using that language
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			for ( var cultureKey in cultures ) {
				var culture = cultures[ cultureKey ];
				if ( culture.language == lang ) {
					return culture;
				}
			}
		}
	}
	else if ( typeof name === "object" ) {
		return name;
	}
	return match || null;
};

Globalize.format = function( value, format, cultureSelector ) {
	var culture = this.findClosestCulture( cultureSelector );
	if ( value instanceof Date ) {
		value = formatDate( value, format, culture );
	}
	else if ( typeof value === "number" ) {
		value = formatNumber( value, format, culture );
	}
	return value;
};

Globalize.localize = function( key, cultureSelector ) {
	return this.findClosestCulture( cultureSelector ).messages[ key ] ||
		this.cultures[ "default" ].messages[ key ];
};

Globalize.parseDate = function( value, formats, culture ) {
	culture = this.findClosestCulture( culture );

	var date, prop, patterns;
	if ( formats ) {
		if ( typeof formats === "string" ) {
			formats = [ formats ];
		}
		if ( formats.length ) {
			for ( var i = 0, l = formats.length; i < l; i++ ) {
				var format = formats[ i ];
				if ( format ) {
					date = parseExact( value, format, culture );
					if ( date ) {
						break;
					}
				}
			}
		}
	} else {
		patterns = culture.calendar.patterns;
		for ( prop in patterns ) {
			date = parseExact( value, patterns[prop], culture );
			if ( date ) {
				break;
			}
		}
	}

	return date || null;
};

Globalize.parseInt = function( value, radix, cultureSelector ) {
	return truncate( Globalize.parseFloat(value, radix, cultureSelector) );
};

Globalize.parseFloat = function( value, radix, cultureSelector ) {
	// radix argument is optional
	if ( typeof radix !== "number" ) {
		cultureSelector = radix;
		radix = 10;
	}

	var culture = this.findClosestCulture( cultureSelector );
	var ret = NaN,
		nf = culture.numberFormat;

	if ( value.indexOf(culture.numberFormat.currency.symbol) > -1 ) {
		// remove currency symbol
		value = value.replace( culture.numberFormat.currency.symbol, "" );
		// replace decimal seperator
		value = value.replace( culture.numberFormat.currency["."], culture.numberFormat["."] );
	}

	//Remove percentage character from number string before parsing
	if ( value.indexOf(culture.numberFormat.percent.symbol) > -1){
		value = value.replace( culture.numberFormat.percent.symbol, "" );
	}

	// remove spaces: leading, trailing and between - and number. Used for negative currency pt-BR
	value = value.replace( / /g, "" );

	// allow infinity or hexidecimal
	if ( regexInfinity.test(value) ) {
		ret = parseFloat( value );
	}
	else if ( !radix && regexHex.test(value) ) {
		ret = parseInt( value, 16 );
	}
	else {

		// determine sign and number
		var signInfo = parseNegativePattern( value, nf, nf.pattern[0] ),
			sign = signInfo[ 0 ],
			num = signInfo[ 1 ];

		// #44 - try parsing as "(n)"
		if ( sign === "" && nf.pattern[0] !== "(n)" ) {
			signInfo = parseNegativePattern( value, nf, "(n)" );
			sign = signInfo[ 0 ];
			num = signInfo[ 1 ];
		}

		// try parsing as "-n"
		if ( sign === "" && nf.pattern[0] !== "-n" ) {
			signInfo = parseNegativePattern( value, nf, "-n" );
			sign = signInfo[ 0 ];
			num = signInfo[ 1 ];
		}

		sign = sign || "+";

		// determine exponent and number
		var exponent,
			intAndFraction,
			exponentPos = num.indexOf( "e" );
		if ( exponentPos < 0 ) exponentPos = num.indexOf( "E" );
		if ( exponentPos < 0 ) {
			intAndFraction = num;
			exponent = null;
		}
		else {
			intAndFraction = num.substr( 0, exponentPos );
			exponent = num.substr( exponentPos + 1 );
		}
		// determine decimal position
		var integer,
			fraction,
			decSep = nf[ "." ],
			decimalPos = intAndFraction.indexOf( decSep );
		if ( decimalPos < 0 ) {
			integer = intAndFraction;
			fraction = null;
		}
		else {
			integer = intAndFraction.substr( 0, decimalPos );
			fraction = intAndFraction.substr( decimalPos + decSep.length );
		}
		// handle groups (e.g. 1,000,000)
		var groupSep = nf[ "," ];
		integer = integer.split( groupSep ).join( "" );
		var altGroupSep = groupSep.replace( /\u00A0/g, " " );
		if ( groupSep !== altGroupSep ) {
			integer = integer.split( altGroupSep ).join( "" );
		}
		// build a natively parsable number string
		var p = sign + integer;
		if ( fraction !== null ) {
			p += "." + fraction;
		}
		if ( exponent !== null ) {
			// exponent itself may have a number patternd
			var expSignInfo = parseNegativePattern( exponent, nf, "-n" );
			p += "e" + ( expSignInfo[0] || "+" ) + expSignInfo[ 1 ];
		}
		if ( regexParseFloat.test(p) ) {
			ret = parseFloat( p );
		}
	}
	return ret;
};

Globalize.culture = function( cultureSelector ) {
	// setter
	if ( typeof cultureSelector !== "undefined" ) {
		this.cultureSelector = cultureSelector;
	}
	// getter
	return this.findClosestCulture( cultureSelector ) || this.cultures[ "default" ];
};

}( this ));


/*!
 * Globalize
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */

(function( window, undefined ) {

var Globalize,
	// private variables
	regexHex,
	regexInfinity,
	regexParseFloat,
	regexTrim,
	// private JavaScript utility functions
	arrayIndexOf,
	endsWith,
	extend,
	isArray,
	isFunction,
	isObject,
	startsWith,
	trim,
	truncate,
	zeroPad,
	// private Globalization utility functions
	appendPreOrPostMatch,
	expandFormat,
	formatDate,
	formatNumber,
	getTokenRegExp,
	getEra,
	getEraYear,
	parseExact,
	parseNegativePattern;

// Global variable (Globalize) or CommonJS module (globalize)
Globalize = function( cultureSelector ) {
	return new Globalize.prototype.init( cultureSelector );
};

if ( typeof require !== "undefined" &&
	typeof exports !== "undefined" &&
	typeof module !== "undefined" ) {
	// Assume CommonJS
	module.exports = Globalize;
} else {
	// Export as global variable
	window.Globalize = Globalize;
}

Globalize.cultures = {};

Globalize.prototype = {
	constructor: Globalize,
	init: function( cultureSelector ) {
		this.cultures = Globalize.cultures;
		this.cultureSelector = cultureSelector;

		return this;
	}
};
Globalize.prototype.init.prototype = Globalize.prototype;

// 1. When defining a culture, all fields are required except the ones stated as optional.
// 2. Each culture should have a ".calendars" object with at least one calendar named "standard"
//    which serves as the default calendar in use by that culture.
// 3. Each culture should have a ".calendar" object which is the current calendar being used,
//    it may be dynamically changed at any time to one of the calendars in ".calendars".
Globalize.cultures[ "default" ] = {
	// A unique name for the culture in the form <language code>-<country/region code>
	name: "en",
	// the name of the culture in the english language
	englishName: "English",
	// the name of the culture in its own language
	nativeName: "English",
	// whether the culture uses right-to-left text
	isRTL: false,
	// "language" is used for so-called "specific" cultures.
	// For example, the culture "es-CL" means "Spanish, in Chili".
	// It represents the Spanish-speaking culture as it is in Chili,
	// which might have different formatting rules or even translations
	// than Spanish in Spain. A "neutral" culture is one that is not
	// specific to a region. For example, the culture "es" is the generic
	// Spanish culture, which may be a more generalized version of the language
	// that may or may not be what a specific culture expects.
	// For a specific culture like "es-CL", the "language" field refers to the
	// neutral, generic culture information for the language it is using.
	// This is not always a simple matter of the string before the dash.
	// For example, the "zh-Hans" culture is netural (Simplified Chinese).
	// And the "zh-SG" culture is Simplified Chinese in Singapore, whose lanugage
	// field is "zh-CHS", not "zh".
	// This field should be used to navigate from a specific culture to it's
	// more general, neutral culture. If a culture is already as general as it
	// can get, the language may refer to itself.
	language: "en",
	// numberFormat defines general number formatting rules, like the digits in
	// each grouping, the group separator, and how negative numbers are displayed.
	numberFormat: {
		// [negativePattern]
		// Note, numberFormat.pattern has no "positivePattern" unlike percent and currency,
		// but is still defined as an array for consistency with them.
		//   negativePattern: one of "(n)|-n|- n|n-|n -"
		pattern: [ "-n" ],
		// number of decimal places normally shown
		decimals: 2,
		// string that separates number groups, as in 1,000,000
		",": ",",
		// string that separates a number from the fractional portion, as in 1.99
		".": ".",
		// array of numbers indicating the size of each number group.
		// TODO: more detailed description and example
		groupSizes: [ 3 ],
		// symbol used for positive numbers
		"+": "+",
		// symbol used for negative numbers
		"-": "-",
		// symbol used for NaN (Not-A-Number)
		"NaN": "NaN",
		// symbol used for Negative Infinity
		negativeInfinity: "-Infinity",
		// symbol used for Positive Infinity
		positiveInfinity: "Infinity",
		percent: {
			// [negativePattern, positivePattern]
			//   negativePattern: one of "-n %|-n%|-%n|%-n|%n-|n-%|n%-|-% n|n %-|% n-|% -n|n- %"
			//   positivePattern: one of "n %|n%|%n|% n"
			pattern: [ "-n %", "n %" ],
			// number of decimal places normally shown
			decimals: 2,
			// array of numbers indicating the size of each number group.
			// TODO: more detailed description and example
			groupSizes: [ 3 ],
			// string that separates number groups, as in 1,000,000
			",": ",",
			// string that separates a number from the fractional portion, as in 1.99
			".": ".",
			// symbol used to represent a percentage
			symbol: "%"
		},
		currency: {
			// [negativePattern, positivePattern]
			//   negativePattern: one of "($n)|-$n|$-n|$n-|(n$)|-n$|n-$|n$-|-n $|-$ n|n $-|$ n-|$ -n|n- $|($ n)|(n $)"
			//   positivePattern: one of "$n|n$|$ n|n $"
			pattern: [ "($n)", "$n" ],
			// number of decimal places normally shown
			decimals: 2,
			// array of numbers indicating the size of each number group.
			// TODO: more detailed description and example
			groupSizes: [ 3 ],
			// string that separates number groups, as in 1,000,000
			",": ",",
			// string that separates a number from the fractional portion, as in 1.99
			".": ".",
			// symbol used to represent currency
			symbol: "Rp."
		}
	},
	// calendars defines all the possible calendars used by this culture.
	// There should be at least one defined with name "standard", and is the default
	// calendar used by the culture.
	// A calendar contains information about how dates are formatted, information about
	// the calendar's eras, a standard set of the date formats,
	// translations for day and month names, and if the calendar is not based on the Gregorian
	// calendar, conversion functions to and from the Gregorian calendar.
	calendars: {
		standard: {
			// name that identifies the type of calendar this is
			name: "Gregorian_USEnglish",
			// separator of parts of a date (e.g. "/" in 11/05/1955)
			"/": "/",
			// separator of parts of a time (e.g. ":" in 05:44 PM)
			":": ":",
			// the first day of the week (0 = Sunday, 1 = Monday, etc)
			firstDay: 0,
			days: {
				// full day names
				names: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
				// abbreviated day names
				namesAbbr: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
				// shortest day names
				namesShort: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ]
			},
			months: {
				// full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
				names: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "" ],
				// abbreviated month names
				namesAbbr: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "" ]
			},
			// AM and PM designators in one of these forms:
			// The usual view, and the upper and lower case versions
			//   [ standard, lowercase, uppercase ]
			// The culture does not use AM or PM (likely all standard date formats use 24 hour time)
			//   null
			AM: [ "AM", "am", "AM" ],
			PM: [ "PM", "pm", "PM" ],
			eras: [
				// eras in reverse chronological order.
				// name: the name of the era in this culture (e.g. A.D., C.E.)
				// start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
				// offset: offset in years from gregorian calendar
				{
					"name": "A.D.",
					"start": null,
					"offset": 0
				}
			],
			// when a two digit year is given, it will never be parsed as a four digit
			// year greater than this year (in the appropriate era for the culture)
			// Set it as a full year (e.g. 2029) or use an offset format starting from
			// the current year: "+19" would correspond to 2029 if the current year 2010.
			twoDigitYearMax: 2029,
			// set of predefined date and time patterns used by the culture
			// these represent the format someone in this culture would expect
			// to see given the portions of the date that are shown.
			patterns: {
				// short date pattern
				d: "dd/MM/yyyy",
				// long date pattern
				D: "dddd, MMMM dd, yyyy",
				// short time pattern
				t: "h:mm tt",
				// long time pattern
				T: "h:mm:ss tt",
				// long date, short time pattern
				f: "dddd, MMMM dd, yyyy h:mm tt",
				// long date, long time pattern
				F: "dddd, MMMM dd, yyyy h:mm:ss tt",
				// month/day pattern
				M: "MMMM dd",
				// month/year pattern
				Y: "yyyy MMMM",
				// S is a sortable format that does not vary by culture
				S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss"
			}
			// optional fields for each calendar:
			/*
			monthsGenitive:
				Same as months but used when the day preceeds the month.
				Omit if the culture has no genitive distinction in month names.
				For an explaination of genitive months, see http://blogs.msdn.com/michkap/archive/2004/12/25/332259.aspx
			convert:
				Allows for the support of non-gregorian based calendars. This convert object is used to
				to convert a date to and from a gregorian calendar date to handle parsing and formatting.
				The two functions:
					fromGregorian( date )
						Given the date as a parameter, return an array with parts [ year, month, day ]
						corresponding to the non-gregorian based year, month, and day for the calendar.
					toGregorian( year, month, day )
						Given the non-gregorian year, month, and day, return a new Date() object
						set to the corresponding date in the gregorian calendar.
			*/
		}
	},
	// For localized strings
	messages: {}
};

Globalize.cultures[ "default" ].calendar = Globalize.cultures[ "default" ].calendars.standard;

Globalize.cultures.en = Globalize.cultures[ "default" ];

Globalize.cultureSelector = "en";

//
// private variables
//

regexHex = /^0x[a-f0-9]+$/i;
regexInfinity = /^[+\-]?infinity$/i;
regexParseFloat = /^[+\-]?\d*\.?\d*(e[+\-]?\d+)?$/;
regexTrim = /^\s+|\s+$/g;

//
// private JavaScript utility functions
//

arrayIndexOf = function( array, item ) {
	if ( array.indexOf ) {
		return array.indexOf( item );
	}
	for ( var i = 0, length = array.length; i < length; i++ ) {
		if ( array[i] === item ) {
			return i;
		}
	}
	return -1;
};

endsWith = function( value, pattern ) {
	return value.substr( value.length - pattern.length ) === pattern;
};

extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction(target) ) {
		target = {};
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( isObject(copy) || (copyIsArray = isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && isArray(src) ? src : [];

					} else {
						clone = src && isObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

isArray = Array.isArray || function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Array]";
};

isFunction = function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Function]";
};

isObject = function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Object]";
};

startsWith = function( value, pattern ) {
	return value.indexOf( pattern ) === 0;
};

trim = function( value ) {
	return ( value + "" ).replace( regexTrim, "" );
};

truncate = function( value ) {
	if ( isNaN( value ) ) {
		return NaN;
	}
	return Math[ value < 0 ? "ceil" : "floor" ]( value );
};

zeroPad = function( str, count, left ) {
	var l;
	for ( l = str.length; l < count; l += 1 ) {
		str = ( left ? ("0" + str) : (str + "0") );
	}
	return str;
};

//
// private Globalization utility functions
//

appendPreOrPostMatch = function( preMatch, strings ) {
	// appends pre- and post- token match strings while removing escaped characters.
	// Returns a single quote count which is used to determine if the token occurs
	// in a string literal.
	var quoteCount = 0,
		escaped = false;
	for ( var i = 0, il = preMatch.length; i < il; i++ ) {
		var c = preMatch.charAt( i );
		switch ( c ) {
			case "\'":
				if ( escaped ) {
					strings.push( "\'" );
				}
				else {
					quoteCount++;
				}
				escaped = false;
				break;
			case "\\":
				if ( escaped ) {
					strings.push( "\\" );
				}
				escaped = !escaped;
				break;
			default:
				strings.push( c );
				escaped = false;
				break;
		}
	}
	return quoteCount;
};

expandFormat = function( cal, format ) {
	// expands unspecified or single character date formats into the full pattern.
	format = format || "F";
	var pattern,
		patterns = cal.patterns,
		len = format.length;
	if ( len === 1 ) {
		pattern = patterns[ format ];
		if ( !pattern ) {
			throw "Invalid date format string \'" + format + "\'.";
		}
		format = pattern;
	}
	else if ( len === 2 && format.charAt(0) === "%" ) {
		// %X escape format -- intended as a custom format string that is only one character, not a built-in format.
		format = format.charAt( 1 );
	}
	return format;
};

formatDate = function( value, format, culture ) {
	var cal = culture.calendar,
		convert = cal.convert,
		ret;

	if ( !format || !format.length || format === "i" ) {
		if ( culture && culture.name.length ) {
			if ( convert ) {
				// non-gregorian calendar, so we cannot use built-in toLocaleString()
				ret = formatDate( value, cal.patterns.F, culture );
			}
			else {
				var eraDate = new Date( value.getTime() ),
					era = getEra( value, cal.eras );
				eraDate.setFullYear( getEraYear(value, cal, era) );
				ret = eraDate.toLocaleString();
			}
		}
		else {
			ret = value.toString();
		}
		return ret;
	}

	var eras = cal.eras,
		sortable = format === "s";
	format = expandFormat( cal, format );

	// Start with an empty string
	ret = [];
	var hour,
		zeros = [ "0", "00", "000" ],
		foundDay,
		checkedDay,
		dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g,
		quoteCount = 0,
		tokenRegExp = getTokenRegExp(),
		converted;

	function padZeros( num, c ) {
		var r, s = num + "";
		if ( c > 1 && s.length < c ) {
			r = ( zeros[c - 2] + s);
			return r.substr( r.length - c, c );
		}
		else {
			r = s;
		}
		return r;
	}

	function hasDay() {
		if ( foundDay || checkedDay ) {
			return foundDay;
		}
		foundDay = dayPartRegExp.test( format );
		checkedDay = true;
		return foundDay;
	}

	function getPart( date, part ) {
		if ( converted ) {
			return converted[ part ];
		}
		switch ( part ) {
			case 0:
				return date.getFullYear();
			case 1:
				return date.getMonth();
			case 2:
				return date.getDate();
			default:
				throw "Invalid part value " + part;
		}
	}

	if ( !sortable && convert ) {
		converted = convert.fromGregorian( value );
	}

	for ( ; ; ) {
		// Save the current index
		var index = tokenRegExp.lastIndex,
			// Look for the next pattern
			ar = tokenRegExp.exec( format );

		// Append the text before the pattern (or the end of the string if not found)
		var preMatch = format.slice( index, ar ? ar.index : format.length );
		quoteCount += appendPreOrPostMatch( preMatch, ret );

		if ( !ar ) {
			break;
		}

		// do not replace any matches that occur inside a string literal.
		if ( quoteCount % 2 ) {
			ret.push( ar[0] );
			continue;
		}

		var current = ar[ 0 ],
			clength = current.length;

		switch ( current ) {
			case "ddd":
				//Day of the week, as a three-letter abbreviation
			case "dddd":
				// Day of the week, using the full name
				var names = ( clength === 3 ) ? cal.days.namesAbbr : cal.days.names;
				ret.push( names[value.getDay()] );
				break;
			case "d":
				// Day of month, without leading zero for single-digit days
			case "dd":
				// Day of month, with leading zero for single-digit days
				foundDay = true;
				ret.push(
					padZeros( getPart(value, 2), clength )
				);
				break;
			case "MMM":
				// Month, as a three-letter abbreviation
			case "MMMM":
				// Month, using the full name
				var part = getPart( value, 1 );
				ret.push(
					( cal.monthsGenitive && hasDay() ) ?
					( cal.monthsGenitive[ clength === 3 ? "namesAbbr" : "names" ][ part ] ) :
					( cal.months[ clength === 3 ? "namesAbbr" : "names" ][ part ] )
				);
				break;
			case "M":
				// Month, as digits, with no leading zero for single-digit months
			case "MM":
				// Month, as digits, with leading zero for single-digit months
				ret.push(
					padZeros( getPart(value, 1) + 1, clength )
				);
				break;
			case "y":
				// Year, as two digits, but with no leading zero for years less than 10
			case "yy":
				// Year, as two digits, with leading zero for years less than 10
			case "yyyy":
				// Year represented by four full digits
				part = converted ? converted[ 0 ] : getEraYear( value, cal, getEra(value, eras), sortable );
				if ( clength < 4 ) {
					part = part % 100;
				}
				ret.push(
					padZeros( part, clength )
				);
				break;
			case "h":
				// Hours with no leading zero for single-digit hours, using 12-hour clock
			case "hh":
				// Hours with leading zero for single-digit hours, using 12-hour clock
				hour = value.getHours() % 12;
				if ( hour === 0 ) hour = 12;
				ret.push(
					padZeros( hour, clength )
				);
				break;
			case "H":
				// Hours with no leading zero for single-digit hours, using 24-hour clock
			case "HH":
				// Hours with leading zero for single-digit hours, using 24-hour clock
				ret.push(
					padZeros( value.getHours(), clength )
				);
				break;
			case "m":
				// Minutes with no leading zero for single-digit minutes
			case "mm":
				// Minutes with leading zero for single-digit minutes
				ret.push(
					padZeros( value.getMinutes(), clength )
				);
				break;
			case "s":
				// Seconds with no leading zero for single-digit seconds
			case "ss":
				// Seconds with leading zero for single-digit seconds
				ret.push(
					padZeros( value.getSeconds(), clength )
				);
				break;
			case "t":
				// One character am/pm indicator ("a" or "p")
			case "tt":
				// Multicharacter am/pm indicator
				part = value.getHours() < 12 ? ( cal.AM ? cal.AM[0] : " " ) : ( cal.PM ? cal.PM[0] : " " );
				ret.push( clength === 1 ? part.charAt(0) : part );
				break;
			case "f":
				// Deciseconds
			case "ff":
				// Centiseconds
			case "fff":
				// Milliseconds
				ret.push(
					padZeros( value.getMilliseconds(), 3 ).substr( 0, clength )
				);
				break;
			case "z":
				// Time zone offset, no leading zero
			case "zz":
				// Time zone offset with leading zero
				hour = value.getTimezoneOffset() / 60;
				ret.push(
					( hour <= 0 ? "+" : "-" ) + padZeros( Math.floor(Math.abs(hour)), clength )
				);
				break;
			case "zzz":
				// Time zone offset with leading zero
				hour = value.getTimezoneOffset() / 60;
				ret.push(
					( hour <= 0 ? "+" : "-" ) + padZeros( Math.floor(Math.abs(hour)), 2 ) +
					// Hard coded ":" separator, rather than using cal.TimeSeparator
					// Repeated here for consistency, plus ":" was already assumed in date parsing.
					":" + padZeros( Math.abs(value.getTimezoneOffset() % 60), 2 )
				);
				break;
			case "g":
			case "gg":
				if ( cal.eras ) {
					ret.push(
						cal.eras[ getEra(value, eras) ].name
					);
				}
				break;
		case "/":
			ret.push( cal["/"] );
			break;
		default:
			throw "Invalid date format pattern \'" + current + "\'.";
		}
	}
	return ret.join( "" );
};

// formatNumber
(function() {
	var expandNumber;

	expandNumber = function( number, precision, formatInfo ) {
		var groupSizes = formatInfo.groupSizes,
			curSize = groupSizes[ 0 ],
			curGroupIndex = 1,
			factor = Math.pow( 10, precision ),
			rounded = Math.round( number * factor ) / factor;

		if ( !isFinite(rounded) ) {
			rounded = number;
		}
		number = rounded;

		var numberString = number+"",
			right = "",
			split = numberString.split( /e/i ),
			exponent = split.length > 1 ? parseInt( split[1], 10 ) : 0;
		numberString = split[ 0 ];
		split = numberString.split( "." );
		numberString = split[ 0 ];
		right = split.length > 1 ? split[ 1 ] : "";

		var l;
		if ( exponent > 0 ) {
			right = zeroPad( right, exponent, false );
			numberString += right.slice( 0, exponent );
			right = right.substr( exponent );
		}
		else if ( exponent < 0 ) {
			exponent = -exponent;
			numberString = zeroPad( numberString, exponent + 1, true );
			right = numberString.slice( -exponent, numberString.length ) + right;
			numberString = numberString.slice( 0, -exponent );
		}

		if ( precision > 0 ) {
			right = formatInfo[ "." ] +
				( (right.length > precision) ? right.slice(0, precision) : zeroPad(right, precision) );
		}
		else {
			right = "";
		}

		var stringIndex = numberString.length - 1,
			sep = formatInfo[ "," ],
			ret = "";

		while ( stringIndex >= 0 ) {
			if ( curSize === 0 || curSize > stringIndex ) {
				return numberString.slice( 0, stringIndex + 1 ) + ( ret.length ? (sep + ret + right) : right );
			}
			ret = numberString.slice( stringIndex - curSize + 1, stringIndex + 1 ) + ( ret.length ? (sep + ret) : "" );

			stringIndex -= curSize;

			if ( curGroupIndex < groupSizes.length ) {
				curSize = groupSizes[ curGroupIndex ];
				curGroupIndex++;
			}
		}

		return numberString.slice( 0, stringIndex + 1 ) + sep + ret + right;
	};

	formatNumber = function( value, format, culture ) {
		if ( !isFinite(value) ) {
			if ( value === Infinity ) {
				return culture.numberFormat.positiveInfinity;
			}
			if ( value === -Infinity ) {
				return culture.numberFormat.negativeInfinity;
			}
			return culture.numberFormat.NaN;
		}
		if ( !format || format === "i" ) {
			return culture.name.length ? value.toLocaleString() : value.toString();
		}
		format = format || "D";

		var nf = culture.numberFormat,
			number = Math.abs( value ),
			precision = -1,
			pattern;
		if ( format.length > 1 ) precision = parseInt( format.slice(1), 10 );

		var current = format.charAt( 0 ).toUpperCase(),
			formatInfo;

		switch ( current ) {
			case "D":
				pattern = "n";
				number = truncate( number );
				if ( precision !== -1 ) {
					number = zeroPad( "" + number, precision, true );
				}
				if ( value < 0 ) number = "-" + number;
				break;
			case "N":
				formatInfo = nf;
				/* falls through */
			case "C":
				formatInfo = formatInfo || nf.currency;
				/* falls through */
			case "P":
				formatInfo = formatInfo || nf.percent;
				pattern = value < 0 ? formatInfo.pattern[ 0 ] : ( formatInfo.pattern[1] || "n" );
				if ( precision === -1 ) precision = formatInfo.decimals;
				number = expandNumber( number * (current === "P" ? 100 : 1), precision, formatInfo );
				break;
			default:
				throw "Bad number format specifier: " + current;
		}

		var patternParts = /n|\$|-|%/g,
			ret = "";
		for ( ; ; ) {
			var index = patternParts.lastIndex,
				ar = patternParts.exec( pattern );

			ret += pattern.slice( index, ar ? ar.index : pattern.length );

			if ( !ar ) {
				break;
			}

			switch ( ar[0] ) {
				case "n":
					ret += number;
					break;
				case "$":
					ret += nf.currency.symbol;
					break;
				case "-":
					// don't make 0 negative
					if ( /[1-9]/.test(number) ) {
						ret += nf[ "-" ];
					}
					break;
				case "%":
					ret += nf.percent.symbol;
					break;
			}
		}

		return ret;
	};

}());

getTokenRegExp = function() {
	// regular expression for matching date and time tokens in format strings.
	return (/\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g);
};

getEra = function( date, eras ) {
	if ( !eras ) return 0;
	var start, ticks = date.getTime();
	for ( var i = 0, l = eras.length; i < l; i++ ) {
		start = eras[ i ].start;
		if ( start === null || ticks >= start ) {
			return i;
		}
	}
	return 0;
};

getEraYear = function( date, cal, era, sortable ) {
	var year = date.getFullYear();
	if ( !sortable && cal.eras ) {
		// convert normal gregorian year to era-shifted gregorian
		// year by subtracting the era offset
		year -= cal.eras[ era ].offset;
	}
	return year;
};

// parseExact
(function() {
	var expandYear,
		getDayIndex,
		getMonthIndex,
		getParseRegExp,
		outOfRange,
		toUpper,
		toUpperArray;

	expandYear = function( cal, year ) {
		// expands 2-digit year into 4 digits.
		if ( year < 100 ) {
			var now = new Date(),
				era = getEra( now ),
				curr = getEraYear( now, cal, era ),
				twoDigitYearMax = cal.twoDigitYearMax;
			twoDigitYearMax = typeof twoDigitYearMax === "string" ? new Date().getFullYear() % 100 + parseInt( twoDigitYearMax, 10 ) : twoDigitYearMax;
			year += curr - ( curr % 100 );
			if ( year > twoDigitYearMax ) {
				year -= 100;
			}
		}
		return year;
	};

	getDayIndex = function	( cal, value, abbr ) {
		var ret,
			days = cal.days,
			upperDays = cal._upperDays;
		if ( !upperDays ) {
			cal._upperDays = upperDays = [
				toUpperArray( days.names ),
				toUpperArray( days.namesAbbr ),
				toUpperArray( days.namesShort )
			];
		}
		value = toUpper( value );
		if ( abbr ) {
			ret = arrayIndexOf( upperDays[1], value );
			if ( ret === -1 ) {
				ret = arrayIndexOf( upperDays[2], value );
			}
		}
		else {
			ret = arrayIndexOf( upperDays[0], value );
		}
		return ret;
	};

	getMonthIndex = function( cal, value, abbr ) {
		var months = cal.months,
			monthsGen = cal.monthsGenitive || cal.months,
			upperMonths = cal._upperMonths,
			upperMonthsGen = cal._upperMonthsGen;
		if ( !upperMonths ) {
			cal._upperMonths = upperMonths = [
				toUpperArray( months.names ),
				toUpperArray( months.namesAbbr )
			];
			cal._upperMonthsGen = upperMonthsGen = [
				toUpperArray( monthsGen.names ),
				toUpperArray( monthsGen.namesAbbr )
			];
		}
		value = toUpper( value );
		var i = arrayIndexOf( abbr ? upperMonths[1] : upperMonths[0], value );
		if ( i < 0 ) {
			i = arrayIndexOf( abbr ? upperMonthsGen[1] : upperMonthsGen[0], value );
		}
		return i;
	};

	getParseRegExp = function( cal, format ) {
		// converts a format string into a regular expression with groups that
		// can be used to extract date fields from a date string.
		// check for a cached parse regex.
		var re = cal._parseRegExp;
		if ( !re ) {
			cal._parseRegExp = re = {};
		}
		else {
			var reFormat = re[ format ];
			if ( reFormat ) {
				return reFormat;
			}
		}

		// expand single digit formats, then escape regular expression characters.
		var expFormat = expandFormat( cal, format ).replace( /([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1" ),
			regexp = [ "^" ],
			groups = [],
			index = 0,
			quoteCount = 0,
			tokenRegExp = getTokenRegExp(),
			match;

		// iterate through each date token found.
		while ( (match = tokenRegExp.exec(expFormat)) !== null ) {
			var preMatch = expFormat.slice( index, match.index );
			index = tokenRegExp.lastIndex;

			// don't replace any matches that occur inside a string literal.
			quoteCount += appendPreOrPostMatch( preMatch, regexp );
			if ( quoteCount % 2 ) {
				regexp.push( match[0] );
				continue;
			}

			// add a regex group for the token.
			var m = match[ 0 ],
				len = m.length,
				add;
			switch ( m ) {
				case "dddd": case "ddd":
				case "MMMM": case "MMM":
				case "gg": case "g":
					add = "(\\D+)";
					break;
				case "tt": case "t":
					add = "(\\D*)";
					break;
				case "yyyy":
				case "fff":
				case "ff":
				case "f":
					add = "(\\d{" + len + "})";
					break;
				case "dd": case "d":
				case "MM": case "M":
				case "yy": case "y":
				case "HH": case "H":
				case "hh": case "h":
				case "mm": case "m":
				case "ss": case "s":
					add = "(\\d\\d?)";
					break;
				case "zzz":
					add = "([+-]?\\d\\d?:\\d{2})";
					break;
				case "zz": case "z":
					add = "([+-]?\\d\\d?)";
					break;
				case "/":
					add = "(\\/)";
					break;
				default:
					throw "Invalid date format pattern \'" + m + "\'.";
			}
			if ( add ) {
				regexp.push( add );
			}
			groups.push( match[0] );
		}
		appendPreOrPostMatch( expFormat.slice(index), regexp );
		regexp.push( "$" );

		// allow whitespace to differ when matching formats.
		var regexpStr = regexp.join( "" ).replace( /\s+/g, "\\s+" ),
			parseRegExp = { "regExp": regexpStr, "groups": groups };

		// cache the regex for this format.
		return re[ format ] = parseRegExp;
	};

	outOfRange = function( value, low, high ) {
		return value < low || value > high;
	};

	toUpper = function( value ) {
		// "he-IL" has non-breaking space in weekday names.
		return value.split( "\u00A0" ).join( " " ).toUpperCase();
	};

	toUpperArray = function( arr ) {
		var results = [];
		for ( var i = 0, l = arr.length; i < l; i++ ) {
			results[ i ] = toUpper( arr[i] );
		}
		return results;
	};

	parseExact = function( value, format, culture ) {
		// try to parse the date string by matching against the format string
		// while using the specified culture for date field names.
		value = trim( value );
		var cal = culture.calendar,
			// convert date formats into regular expressions with groupings.
			// use the regexp to determine the input format and extract the date fields.
			parseInfo = getParseRegExp( cal, format ),
			match = new RegExp( parseInfo.regExp ).exec( value );
		if ( match === null ) {
			return null;
		}
		// found a date format that matches the input.
		var groups = parseInfo.groups,
			era = null, year = null, month = null, date = null, weekDay = null,
			hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null,
			pmHour = false;
		// iterate the format groups to extract and set the date fields.
		for ( var j = 0, jl = groups.length; j < jl; j++ ) {
			var matchGroup = match[ j + 1 ];
			if ( matchGroup ) {
				var current = groups[ j ],
					clength = current.length,
					matchInt = parseInt( matchGroup, 10 );
				switch ( current ) {
					case "dd": case "d":
						// Day of month.
						date = matchInt;
						// check that date is generally in valid range, also checking overflow below.
						if ( outOfRange(date, 1, 31) ) return null;
						break;
					case "MMM": case "MMMM":
						month = getMonthIndex( cal, matchGroup, clength === 3 );
						if ( outOfRange(month, 0, 11) ) return null;
						break;
					case "M": case "MM":
						// Month.
						month = matchInt - 1;
						if ( outOfRange(month, 0, 11) ) return null;
						break;
					case "y": case "yy":
					case "yyyy":
						year = clength < 4 ? expandYear( cal, matchInt ) : matchInt;
						if ( outOfRange(year, 0, 9999) ) return null;
						break;
					case "h": case "hh":
						// Hours (12-hour clock).
						hour = matchInt;
						if ( hour === 12 ) hour = 0;
						if ( outOfRange(hour, 0, 11) ) return null;
						break;
					case "H": case "HH":
						// Hours (24-hour clock).
						hour = matchInt;
						if ( outOfRange(hour, 0, 23) ) return null;
						break;
					case "m": case "mm":
						// Minutes.
						min = matchInt;
						if ( outOfRange(min, 0, 59) ) return null;
						break;
					case "s": case "ss":
						// Seconds.
						sec = matchInt;
						if ( outOfRange(sec, 0, 59) ) return null;
						break;
					case "tt": case "t":
						// AM/PM designator.
						// see if it is standard, upper, or lower case PM. If not, ensure it is at least one of
						// the AM tokens. If not, fail the parse for this format.
						pmHour = cal.PM && ( matchGroup === cal.PM[0] || matchGroup === cal.PM[1] || matchGroup === cal.PM[2] );
						if (
							!pmHour && (
								!cal.AM || ( matchGroup !== cal.AM[0] && matchGroup !== cal.AM[1] && matchGroup !== cal.AM[2] )
							)
						) return null;
						break;
					case "f":
						// Deciseconds.
					case "ff":
						// Centiseconds.
					case "fff":
						// Milliseconds.
						msec = matchInt * Math.pow( 10, 3 - clength );
						if ( outOfRange(msec, 0, 999) ) return null;
						break;
					case "ddd":
						// Day of week.
					case "dddd":
						// Day of week.
						weekDay = getDayIndex( cal, matchGroup, clength === 3 );
						if ( outOfRange(weekDay, 0, 6) ) return null;
						break;
					case "zzz":
						// Time zone offset in +/- hours:min.
						var offsets = matchGroup.split( /:/ );
						if ( offsets.length !== 2 ) return null;
						hourOffset = parseInt( offsets[0], 10 );
						if ( outOfRange(hourOffset, -12, 13) ) return null;
						var minOffset = parseInt( offsets[1], 10 );
						if ( outOfRange(minOffset, 0, 59) ) return null;
						tzMinOffset = ( hourOffset * 60 ) + ( startsWith(matchGroup, "-") ? -minOffset : minOffset );
						break;
					case "z": case "zz":
						// Time zone offset in +/- hours.
						hourOffset = matchInt;
						if ( outOfRange(hourOffset, -12, 13) ) return null;
						tzMinOffset = hourOffset * 60;
						break;
					case "g": case "gg":
						var eraName = matchGroup;
						if ( !eraName || !cal.eras ) return null;
						eraName = trim( eraName.toLowerCase() );
						for ( var i = 0, l = cal.eras.length; i < l; i++ ) {
							if ( eraName === cal.eras[i].name.toLowerCase() ) {
								era = i;
								break;
							}
						}
						// could not find an era with that name
						if ( era === null ) return null;
						break;
				}
			}
		}
		var result = new Date(), defaultYear, convert = cal.convert;
		defaultYear = convert ? convert.fromGregorian( result )[ 0 ] : result.getFullYear();
		if ( year === null ) {
			year = defaultYear;
		}
		else if ( cal.eras ) {
			// year must be shifted to normal gregorian year
			// but not if year was not specified, its already normal gregorian
			// per the main if clause above.
			year += cal.eras[( era || 0 )].offset;
		}
		// set default day and month to 1 and January, so if unspecified, these are the defaults
		// instead of the current day/month.
		if ( month === null ) {
			month = 0;
		}
		if ( date === null ) {
			date = 1;
		}
		// now have year, month, and date, but in the culture's calendar.
		// convert to gregorian if necessary
		if ( convert ) {
			result = convert.toGregorian( year, month, date );
			// conversion failed, must be an invalid match
			if ( result === null ) return null;
		}
		else {
			// have to set year, month and date together to avoid overflow based on current date.
			result.setFullYear( year, month, date );
			// check to see if date overflowed for specified month (only checked 1-31 above).
			if ( result.getDate() !== date ) return null;
			// invalid day of week.
			if ( weekDay !== null && result.getDay() !== weekDay ) {
				return null;
			}
		}
		// if pm designator token was found make sure the hours fit the 24-hour clock.
		if ( pmHour && hour < 12 ) {
			hour += 12;
		}
		result.setHours( hour, min, sec, msec );
		if ( tzMinOffset !== null ) {
			// adjust timezone to utc before applying local offset.
			var adjustedMin = result.getMinutes() - ( tzMinOffset + result.getTimezoneOffset() );
			// Safari limits hours and minutes to the range of -127 to 127.  We need to use setHours
			// to ensure both these fields will not exceed this range.	adjustedMin will range
			// somewhere between -1440 and 1500, so we only need to split this into hours.
			result.setHours( result.getHours() + parseInt(adjustedMin / 60, 10), adjustedMin % 60 );
		}
		return result;
	};
}());

parseNegativePattern = function( value, nf, negativePattern ) {
	var neg = nf[ "-" ],
		pos = nf[ "+" ],
		ret;
	switch ( negativePattern ) {
		case "n -":
			neg = " " + neg;
			pos = " " + pos;
			/* falls through */
		case "n-":
			if ( endsWith(value, neg) ) {
				ret = [ "-", value.substr(0, value.length - neg.length) ];
			}
			else if ( endsWith(value, pos) ) {
				ret = [ "+", value.substr(0, value.length - pos.length) ];
			}
			break;
		case "- n":
			neg += " ";
			pos += " ";
			/* falls through */
		case "-n":
			if ( startsWith(value, neg) ) {
				ret = [ "-", value.substr(neg.length) ];
			}
			else if ( startsWith(value, pos) ) {
				ret = [ "+", value.substr(pos.length) ];
			}
			break;
		case "(n)":
			if ( startsWith(value, "(") && endsWith(value, ")") ) {
				ret = [ "-", value.substr(1, value.length - 2) ];
			}
			break;
	}
	return ret || [ "", value ];
};

//
// public instance functions
//

Globalize.prototype.findClosestCulture = function( cultureSelector ) {
	return Globalize.findClosestCulture.call( this, cultureSelector );
};

Globalize.prototype.format = function( value, format, cultureSelector ) {
	return Globalize.format.call( this, value, format, cultureSelector );
};

Globalize.prototype.localize = function( key, cultureSelector ) {
	return Globalize.localize.call( this, key, cultureSelector );
};

Globalize.prototype.parseInt = function( value, radix, cultureSelector ) {
	return Globalize.parseInt.call( this, value, radix, cultureSelector );
};

Globalize.prototype.parseFloat = function( value, radix, cultureSelector ) {
	return Globalize.parseFloat.call( this, value, radix, cultureSelector );
};

Globalize.prototype.culture = function( cultureSelector ) {
	return Globalize.culture.call( this, cultureSelector );
};

//
// public singleton functions
//

Globalize.addCultureInfo = function( cultureName, baseCultureName, info ) {

	var base = {},
		isNew = false;

	if ( typeof cultureName !== "string" ) {
		// cultureName argument is optional string. If not specified, assume info is first
		// and only argument. Specified info deep-extends current culture.
		info = cultureName;
		cultureName = this.culture().name;
		base = this.cultures[ cultureName ];
	} else if ( typeof baseCultureName !== "string" ) {
		// baseCultureName argument is optional string. If not specified, assume info is second
		// argument. Specified info deep-extends specified culture.
		// If specified culture does not exist, create by deep-extending default
		info = baseCultureName;
		isNew = ( this.cultures[ cultureName ] == null );
		base = this.cultures[ cultureName ] || this.cultures[ "default" ];
	} else {
		// cultureName and baseCultureName specified. Assume a new culture is being created
		// by deep-extending an specified base culture
		isNew = true;
		base = this.cultures[ baseCultureName ];
	}

	this.cultures[ cultureName ] = extend(true, {},
		base,
		info
	);
	// Make the standard calendar the current culture if it's a new culture
	if ( isNew ) {
		this.cultures[ cultureName ].calendar = this.cultures[ cultureName ].calendars.standard;
	}
};

Globalize.findClosestCulture = function( name ) {
	var match;
	if ( !name ) {
		return this.findClosestCulture( this.cultureSelector ) || this.cultures[ "default" ];
	}
	if ( typeof name === "string" ) {
		name = name.split( "," );
	}
	if ( isArray(name) ) {
		var lang,
			cultures = this.cultures,
			list = name,
			i, l = list.length,
			prioritized = [];
		for ( i = 0; i < l; i++ ) {
			name = trim( list[i] );
			var pri, parts = name.split( ";" );
			lang = trim( parts[0] );
			if ( parts.length === 1 ) {
				pri = 1;
			}
			else {
				name = trim( parts[1] );
				if ( name.indexOf("q=") === 0 ) {
					name = name.substr( 2 );
					pri = parseFloat( name );
					pri = isNaN( pri ) ? 0 : pri;
				}
				else {
					pri = 1;
				}
			}
			prioritized.push({ lang: lang, pri: pri });
		}
		prioritized.sort(function( a, b ) {
			if ( a.pri < b.pri ) {
				return 1;
			} else if ( a.pri > b.pri ) {
				return -1;
			}
			return 0;
		});
		// exact match
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			match = cultures[ lang ];
			if ( match ) {
				return match;
			}
		}

		// neutral language match
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			do {
				var index = lang.lastIndexOf( "-" );
				if ( index === -1 ) {
					break;
				}
				// strip off the last part. e.g. en-US => en
				lang = lang.substr( 0, index );
				match = cultures[ lang ];
				if ( match ) {
					return match;
				}
			}
			while ( 1 );
		}

		// last resort: match first culture using that language
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			for ( var cultureKey in cultures ) {
				var culture = cultures[ cultureKey ];
				if ( culture.language == lang ) {
					return culture;
				}
			}
		}
	}
	else if ( typeof name === "object" ) {
		return name;
	}
	return match || null;
};

Globalize.format = function( value, format, cultureSelector ) {
	var culture = this.findClosestCulture( cultureSelector );
	if ( value instanceof Date ) {
		value = formatDate( value, format, culture );
	}
	else if ( typeof value === "number" ) {
		value = formatNumber( value, format, culture );
	}
	return value;
};

Globalize.localize = function( key, cultureSelector ) {
	return this.findClosestCulture( cultureSelector ).messages[ key ] ||
		this.cultures[ "default" ].messages[ key ];
};

Globalize.parseDate = function( value, formats, culture ) {
	culture = this.findClosestCulture( culture );

	var date, prop, patterns;
	if ( formats ) {
		if ( typeof formats === "string" ) {
			formats = [ formats ];
		}
		if ( formats.length ) {
			for ( var i = 0, l = formats.length; i < l; i++ ) {
				var format = formats[ i ];
				if ( format ) {
					date = parseExact( value, format, culture );
					if ( date ) {
						break;
					}
				}
			}
		}
	} else {
		patterns = culture.calendar.patterns;
		for ( prop in patterns ) {
			date = parseExact( value, patterns[prop], culture );
			if ( date ) {
				break;
			}
		}
	}

	return date || null;
};

Globalize.parseInt = function( value, radix, cultureSelector ) {
	return truncate( Globalize.parseFloat(value, radix, cultureSelector) );
};

Globalize.parseFloat = function( value, radix, cultureSelector ) {
	// radix argument is optional
	if ( typeof radix !== "number" ) {
		cultureSelector = radix;
		radix = 10;
	}

	var culture = this.findClosestCulture( cultureSelector );
	var ret = NaN,
		nf = culture.numberFormat;

	if ( value.indexOf(culture.numberFormat.currency.symbol) > -1 ) {
		// remove currency symbol
		value = value.replace( culture.numberFormat.currency.symbol, "" );
		// replace decimal seperator
		value = value.replace( culture.numberFormat.currency["."], culture.numberFormat["."] );
	}

	//Remove percentage character from number string before parsing
	if ( value.indexOf(culture.numberFormat.percent.symbol) > -1){
		value = value.replace( culture.numberFormat.percent.symbol, "" );
	}

	// remove spaces: leading, trailing and between - and number. Used for negative currency pt-BR
	value = value.replace( / /g, "" );

	// allow infinity or hexidecimal
	if ( regexInfinity.test(value) ) {
		ret = parseFloat( value );
	}
	else if ( !radix && regexHex.test(value) ) {
		ret = parseInt( value, 16 );
	}
	else {

		// determine sign and number
		var signInfo = parseNegativePattern( value, nf, nf.pattern[0] ),
			sign = signInfo[ 0 ],
			num = signInfo[ 1 ];

		// #44 - try parsing as "(n)"
		if ( sign === "" && nf.pattern[0] !== "(n)" ) {
			signInfo = parseNegativePattern( value, nf, "(n)" );
			sign = signInfo[ 0 ];
			num = signInfo[ 1 ];
		}

		// try parsing as "-n"
		if ( sign === "" && nf.pattern[0] !== "-n" ) {
			signInfo = parseNegativePattern( value, nf, "-n" );
			sign = signInfo[ 0 ];
			num = signInfo[ 1 ];
		}

		sign = sign || "+";

		// determine exponent and number
		var exponent,
			intAndFraction,
			exponentPos = num.indexOf( "e" );
		if ( exponentPos < 0 ) exponentPos = num.indexOf( "E" );
		if ( exponentPos < 0 ) {
			intAndFraction = num;
			exponent = null;
		}
		else {
			intAndFraction = num.substr( 0, exponentPos );
			exponent = num.substr( exponentPos + 1 );
		}
		// determine decimal position
		var integer,
			fraction,
			decSep = nf[ "." ],
			decimalPos = intAndFraction.indexOf( decSep );
		if ( decimalPos < 0 ) {
			integer = intAndFraction;
			fraction = null;
		}
		else {
			integer = intAndFraction.substr( 0, decimalPos );
			fraction = intAndFraction.substr( decimalPos + decSep.length );
		}
		// handle groups (e.g. 1,000,000)
		var groupSep = nf[ "," ];
		integer = integer.split( groupSep ).join( "" );
		var altGroupSep = groupSep.replace( /\u00A0/g, " " );
		if ( groupSep !== altGroupSep ) {
			integer = integer.split( altGroupSep ).join( "" );
		}
		// build a natively parsable number string
		var p = sign + integer;
		if ( fraction !== null ) {
			p += "." + fraction;
		}
		if ( exponent !== null ) {
			// exponent itself may have a number patternd
			var expSignInfo = parseNegativePattern( exponent, nf, "-n" );
			p += "e" + ( expSignInfo[0] || "+" ) + expSignInfo[ 1 ];
		}
		if ( regexParseFloat.test(p) ) {
			ret = parseFloat( p );
		}
	}
	return ret;
};

Globalize.culture = function( cultureSelector ) {
	// setter
	if ( typeof cultureSelector !== "undefined" ) {
		this.cultureSelector = cultureSelector;
	}
	// getter
	return this.findClosestCulture( cultureSelector ) || this.cultures[ "default" ];
};

}( this ));


/*
jQWidgets v3.0.3 (2013-Oct-01)
Copyright (c) 2011-2013 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function(a){a.jqx=a.jqx||{};a.jqx.define=function(b,c,d){b[c]=function(){if(this.baseType){this.base=new b[this.baseType]();this.base.defineInstance()}this.defineInstance()};b[c].prototype.defineInstance=function(){};b[c].prototype.base=null;b[c].prototype.baseType=undefined;if(d&&b[d]){b[c].prototype.baseType=d}};a.jqx.invoke=function(e,d){if(d.length==0){return}var f=typeof(d)==Array||d.length>0?d[0]:d;var c=typeof(d)==Array||d.length>1?Array.prototype.slice.call(d,1):a({}).toArray();while(e[f]==undefined&&e.base!=null){e=e.base}if(e[f]!=undefined&&a.isFunction(e[f])){return e[f].apply(e,c)}if(typeof f=="string"){var b=f.toLowerCase();if(e[b]!=undefined&&a.isFunction(e[b])){return e[b].apply(e,c)}}return};a.jqx.hasProperty=function(c,b){if(typeof(b)=="object"){for(var e in b){var d=c;while(d){if(d.hasOwnProperty(e)){return true}if(d.hasOwnProperty(e.toLowerCase())){return true}d=d.base}return false}}else{while(c){if(c.hasOwnProperty(b)){return true}if(c.hasOwnProperty(b.toLowerCase())){return true}c=c.base}}return false};a.jqx.hasFunction=function(e,d){if(d.length==0){return false}if(e==undefined){return false}var f=typeof(d)==Array||d.length>0?d[0]:d;var c=typeof(d)==Array||d.length>1?Array.prototype.slice.call(d,1):{};while(e[f]==undefined&&e.base!=null){e=e.base}if(e[f]&&a.isFunction(e[f])){return true}if(typeof f=="string"){var b=f.toLowerCase();if(e[b]&&a.isFunction(e[b])){return true}}return false};a.jqx.isPropertySetter=function(c,b){if(b.length==1&&typeof(b[0])=="object"){return true}if(b.length==2&&typeof(b[0])=="string"&&!a.jqx.hasFunction(c,b)){return true}return false};a.jqx.validatePropertySetter=function(f,d,b){if(!a.jqx.propertySetterValidation){return true}if(d.length==1&&typeof(d[0])=="object"){for(var e in d[0]){var g=f;while(!g.hasOwnProperty(e)&&g.base){g=g.base}if(!g||!g.hasOwnProperty(e)){if(!b){var c=g.hasOwnProperty(e.toString().toLowerCase());if(!c){throw"Invalid property: "+e}else{return true}}return false}}return true}if(d.length!=2){if(!b){throw"Invalid property: "+d.length>=0?d[0]:""}return false}while(!f.hasOwnProperty(d[0])&&f.base){f=f.base}if(!f||!f.hasOwnProperty(d[0])){if(!b){throw"Invalid property: "+d[0]}return false}return true};a.jqx.set=function(c,b){if(b.length==1&&typeof(b[0])=="object"){a.each(b[0],function(d,e){var f=c;while(!f.hasOwnProperty(d)&&f.base!=null){f=f.base}if(f.hasOwnProperty(d)){a.jqx.setvalueraiseevent(f,d,e)}else{if(f.hasOwnProperty(d.toLowerCase())){a.jqx.setvalueraiseevent(f,d.toLowerCase(),e)}else{if(a.jqx.propertySetterValidation){throw"jqxCore: invalid property '"+d+"'"}}}})}else{if(b.length==2){while(!c.hasOwnProperty(b[0])&&c.base){c=c.base}if(c.hasOwnProperty(b[0])){a.jqx.setvalueraiseevent(c,b[0],b[1])}else{if(c.hasOwnProperty(b[0].toLowerCase())){a.jqx.setvalueraiseevent(c,b[0].toLowerCase(),b[1])}else{if(a.jqx.propertySetterValidation){throw"jqxCore: invalid property '"+b[0]+"'"}}}}}};a.jqx.setvalueraiseevent=function(c,d,e){var b=c[d];c[d]=e;if(!c.isInitialized){return}if(c.propertyChangedHandler!=undefined){c.propertyChangedHandler(c,d,b,e)}if(c.propertyChangeMap!=undefined&&c.propertyChangeMap[d]!=undefined){c.propertyChangeMap[d](c,d,b,e)}};a.jqx.get=function(e,d){if(d==undefined||d==null){return undefined}if(e.propertyMap){var c=e.propertyMap(d);if(c!=null){return c}}if(e.hasOwnProperty(d)){return e[d]}if(e.hasOwnProperty(d.toLowerCase())){return e[d.toLowerCase()]}var b=undefined;if(typeof(d)==Array){if(d.length!=1){return undefined}b=d[0]}else{if(typeof(d)=="string"){b=d}}while(!e.hasOwnProperty(b)&&e.base){e=e.base}if(e){return e[b]}return undefined};a.jqx.serialize=function(e){var b="";if(a.isArray(e)){b="[";for(var d=0;d<e.length;d++){if(d>0){b+=", "}b+=a.jqx.serialize(e[d])}b+="]"}else{if(typeof(e)=="object"){b="{";var c=0;for(var d in e){if(c++>0){b+=", "}b+=d+": "+a.jqx.serialize(e[d])}b+="}"}else{b=e.toString()}}return b};a.jqx.propertySetterValidation=true;a.jqx.jqxWidgetProxy=function(g,c,b){var d=a(c);var f=a.data(c,g);if(f==undefined){return undefined}var e=f.instance;if(a.jqx.hasFunction(e,b)){return a.jqx.invoke(e,b)}if(a.jqx.isPropertySetter(e,b)){if(a.jqx.validatePropertySetter(e,b)){a.jqx.set(e,b);return undefined}}else{if(typeof(b)=="object"&&b.length==0){return}else{if(typeof(b)=="object"&&b.length==1&&a.jqx.hasProperty(e,b[0])){return a.jqx.get(e,b[0])}else{if(typeof(b)=="string"&&a.jqx.hasProperty(e,b[0])){return a.jqx.get(e,b)}}}}throw"jqxCore: Invalid parameter '"+a.jqx.serialize(b)+"' does not exist.";return undefined};a.jqx.jqxWidget=function(b,d,j){var c=false;try{jqxArgs=Array.prototype.slice.call(j,0)}catch(h){jqxArgs=""}try{c=window.MSApp!=undefined}catch(h){}var g=b;var f="";if(d){f="_"+d}a.jqx.define(a.jqx,"_"+g,f);a.fn[g]=function(){var e=Array.prototype.slice.call(arguments,0);var k=null;if(e.length==0||(e.length==1&&typeof(e[0])=="object")){if(this.length==0){if(this.selector){throw new Error("Invalid jQuery Selector - "+this.selector+"! Please, check whether the used ID or CSS Class name is correct.")}else{throw new Error("Invalid jQuery Selector! Please, check whether the used ID or CSS Class name is correct.")}}return this.each(function(){var o=a(this);var n=this;var q=a.data(n,g);if(q==null){q={};q.element=n;q.host=o;q.instance=new a.jqx["_"+g]();if(n.id==""){n.id=a.jqx.utilities.createId()}q.instance.get=q.instance.set=q.instance.call=function(){var r=Array.prototype.slice.call(arguments,0);return a.jqx.jqxWidgetProxy(g,n,r)};a.data(n,g,q);a.data(n,"jqxWidget",q.instance);var p=new Array();var l=q.instance;while(l){l.isInitialized=false;p.push(l);l=l.base}p.reverse();p[0].theme="";a.jqx.jqxWidgetProxy(g,this,e);for(var m in p){l=p[m];if(m==0){l.host=o;l.element=n;l.WinJS=c}if(l!=undefined){if(l.createInstance!=null){if(c){MSApp.execUnsafeLocalFunction(function(){l.createInstance(e)})}else{l.createInstance(e)}}}}for(var m in p){if(p[m]!=undefined){p[m].isInitialized=true}}if(c){MSApp.execUnsafeLocalFunction(function(){q.instance.refresh(true)})}else{q.instance.refresh(true)}k=this}else{a.jqx.jqxWidgetProxy(g,this,e)}})}else{if(this.length==0){if(this.selector){throw new Error("Invalid jQuery Selector - "+this.selector+"! Please, check whether the used ID or CSS Class name is correct.")}else{throw new Error("Invalid jQuery Selector! Please, check whether the used ID or CSS Class name is correct.")}}this.each(function(){var l=a.jqx.jqxWidgetProxy(g,this,e);if(k==null){k=l}})}return k};try{a.extend(a.jqx["_"+g].prototype,Array.prototype.slice.call(j,0)[0])}catch(h){}a.extend(a.jqx["_"+g].prototype,{toThemeProperty:function(e,k){if(this.theme==""){return e}if(k!=null&&k){return e+"-"+this.theme}return e+" "+e+"-"+this.theme}});a.jqx["_"+g].prototype.refresh=function(){if(this.base){this.base.refresh()}};a.jqx["_"+g].prototype.createInstance=function(){};a.jqx["_"+g].prototype.propertyChangeMap={};a.jqx["_"+g].prototype.addHandler=function(m,k,e,l){switch(k){case"mousewheel":if(window.addEventListener){if(a.jqx.browser.mozilla){m[0].addEventListener("DOMMouseScroll",e,false)}else{m[0].addEventListener("mousewheel",e,false)}return false}break;case"mousemove":if(window.addEventListener&&!l){m[0].addEventListener("mousemove",e,false);return false}break}if(l==undefined||l==null){if(m.on){m.on(k,e)}else{m.bind(k,e)}}else{if(m.on){m.on(k,l,e)}else{m.bind(k,l,e)}}};a.jqx["_"+g].prototype.removeHandler=function(l,k,e){switch(k){case"mousewheel":if(window.removeEventListener){if(a.jqx.browser.mozilla){l[0].removeEventListener("DOMMouseScroll",e,false)}else{l[0].removeEventListener("mousewheel",e,false)}return false}break;case"mousemove":if(e){if(window.removeEventListener){l[0].removeEventListener("mousemove",e,false)}}break}if(k==undefined){if(l.off){l.off()}else{l.unbind()}return}if(e==undefined){if(l.off){l.off(k)}else{l.unbind(k)}}else{if(l.off){l.off(k,e)}else{l.unbind(k,e)}}}};a.jqx.utilities=a.jqx.utilities||{};a.extend(a.jqx.utilities,{scrollBarSize:15,touchScrollBarSize:10,createId:function(){var b=function(){return(((1+Math.random())*65536)|0).toString(16).substring(1)};return"jqxWidget"+b()+b()},setTheme:function(f,g,e){if(typeof e==="undefined"){return}var h=e[0].className.split(" "),b=[],j=[],d=e.children();for(var c=0;c<h.length;c+=1){if(h[c].indexOf(f)>=0){if(f.length>0){b.push(h[c]);j.push(h[c].replace(f,g))}else{j.push(h[c]+"-"+g)}}}this._removeOldClasses(b,e);this._addNewClasses(j,e);for(var c=0;c<d.length;c+=1){this.setTheme(f,g,a(d[c]))}},_removeOldClasses:function(d,c){for(var b=0;b<d.length;b+=1){c.removeClass(d[b])}},_addNewClasses:function(d,c){for(var b=0;b<d.length;b+=1){c.addClass(d[b])}},getOffset:function(b){var d=a.jqx.mobile.getLeftPos(b[0]);var c=a.jqx.mobile.getTopPos(b[0]);return{top:c,left:d}},resize:function(d,m,l,k){if(k===undefined){k=true}var g=-1;var f=this;var c=function(o){if(!f.hiddenWidgets){return -1}var p=-1;for(var n=0;n<f.hiddenWidgets.length;n++){if(o.id){if(f.hiddenWidgets[n].id==o.id){p=n;break}}else{if(f.hiddenWidgets[n].id==o[0].id){p=n;break}}}return p};if(this.resizeHandlers){for(var e=0;e<this.resizeHandlers.length;e++){if(d.id){if(this.resizeHandlers[e].id==d.id){g=e;break}}else{if(this.resizeHandlers[e].id==d[0].id){g=e;break}}}if(l===true){if(g!=-1){this.resizeHandlers.splice(g,1)}if(this.resizeHandlers.length==0){var j=a(window);if(j.off){j.off("resize.jqx");j.off("orientationchange.jqx");j.off("orientationchanged.jqx")}else{j.unbind("resize.jqx");j.unbind("orientationchange.jqx");j.unbind("orientationchanged.jqx")}this.resizeHandlers=null}var b=c(d);if(b!=-1&&this.hiddenWidgets){this.hiddenWidgets.splice(b,1)}return}}else{if(l===true){var b=c(d);if(b!=-1&&this.hiddenWidgets){this.hiddenWidgets.splice(b,1)}return}}var f=this;var h=function(n,o){if(!f.resizeHandlers){return}var p=function(t,r){var s=t.widget.parents().length;var q=r.widget.parents().length;try{if(s<q){return -1}if(s>q){return 1}}catch(u){var v=u}return 0};f.hiddenWidgets=new Array();f.resizeHandlers.sort(p);a.each(f.resizeHandlers,function(s,v){var u=this.widget.data();if(!u){return true}if(!u.jqxWidget){return true}var t=u.jqxWidget.width;var q=u.jqxWidget.height;var r=false;if(t!=null&&t.toString().indexOf("%")!=-1){r=true}if(q!=null&&q.toString().indexOf("%")!=-1){r=true}if(a.jqx.isHidden(this.widget)){if(c(this.widget)===-1){f.hiddenWidgets.push(this)}}else{if(n===undefined||n!==true){if(r){this.callback(o);if(f.hiddenWidgets.indexOf(this)>=0){f.hiddenWidgets.splice(f.hiddenWidgets.indexOf(this),1)}}}}});if(f.hiddenWidgets.length>0){f.hiddenWidgets.sort(p);if(f.__resizeInterval){clearInterval(f.__resizeInterval)}f.__resizeInterval=setInterval(function(){var q=false;var r=new Array();a.each(f.hiddenWidgets,function(s,t){if(a.jqx.isHidden(this.widget)){q=true;r.push(this)}else{this.callback(o)}});f.hiddenWidgets=r;if(!q){clearInterval(f.__resizeInterval)}},100)}};if(!this.resizeHandlers){this.resizeHandlers=new Array();var j=a(window);if(j.on){j.on("resize.jqx",function(n){h(null,"resize")});j.on("orientationchange.jqx",function(n){h(null,"orientationchange")});j.on("orientationchanged.jqx",function(n){h(null,"orientationchange")})}else{j.bind("resize.jqx",function(n){h(null,"orientationchange")});j.bind("orientationchange.jqx",function(n){h(null,"orientationchange")});j.bind("orientationchanged.jqx",function(n){h(null,"orientationchange")})}}if(k){if(g===-1){this.resizeHandlers.push({id:d[0].id,widget:d,callback:m})}}if(a.jqx.isHidden(d)&&k===true){h(true)}},html:function(c,d){if(!a(c).on){return a(c).html(d)}try{return jQuery.access(c,function(s){var f=c[0]||{},m=0,j=c.length;if(s===undefined){return f.nodeType===1?f.innerHTML.replace(rinlinejQuery,""):undefined}var r=/<(?:script|style|link)/i,n="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",h=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,p=/<([\w:]+)/,g=/<(?:script|object|embed|option|style)/i,k=new RegExp("<(?:"+n+")[\\s/>]","i"),q=/^\s+/,t={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]};if(typeof s==="string"&&!r.test(s)&&(jQuery.support.htmlSerialize||!k.test(s))&&(jQuery.support.leadingWhitespace||!q.test(s))&&!t[(p.exec(s)||["",""])[1].toLowerCase()]){s=s.replace(h,"<$1></$2>");try{for(;m<j;m++){f=this[m]||{};if(f.nodeType===1){jQuery.cleanData(f.getElementsByTagName("*"));f.innerHTML=s}}f=0}catch(o){}}if(f){c.empty().append(s)}},null,d,arguments.length)}catch(b){return a(c).html(d)}},hasTransform:function(d){var c="";c=d.css("transform");if(c==""||c=="none"){c=d.parents().css("transform");if(c==""||c=="none"){var b=a.jqx.utilities.getBrowser();if(b.browser=="msie"){c=d.css("-ms-transform");if(c==""||c=="none"){c=d.parents().css("-ms-transform")}}else{if(b.browser=="chrome"){c=d.css("-webkit-transform");if(c==""||c=="none"){c=d.parents().css("-webkit-transform")}}else{if(b.browser=="opera"){c=d.css("-o-transform");if(c==""||c=="none"){c=d.parents().css("-o-transform")}}else{if(b.browser=="mozilla"){c=d.css("-moz-transform");if(c==""||c=="none"){c=d.parents().css("-moz-transform")}}}}}}else{return c!=""&&c!="none"}}if(c==""||c=="none"){c=a(document.body).css("transform")}return c!=""&&c!="none"&&c!=null},getBrowser:function(){var c=navigator.userAgent.toLowerCase();var b=/(chrome)[ \/]([\w.]+)/.exec(c)||/(webkit)[ \/]([\w.]+)/.exec(c)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(c)||/(msie) ([\w.]+)/.exec(c)||c.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(c)||[];var d={browser:b[1]||"",version:b[2]||"0"};d[b[1]]=b[1];return d}});a.jqx.browser=a.jqx.utilities.getBrowser();a.jqx.isHidden=function(d){try{var b=d[0].offsetWidth,e=d[0].offsetHeight;if(b===0||e===0){return true}else{return false}}catch(c){return false}};a.jqx.ariaEnabled=true;a.jqx.aria=function(c,e,d){if(!a.jqx.ariaEnabled){return}if(e==undefined){a.each(c.aria,function(g,h){var k=!c.base?c.host.attr(g):c.base.host.attr(g);if(k!=undefined&&!a.isFunction(k)){var j=k;switch(h.type){case"number":j=new Number(k);if(isNaN(j)){j=k}break;case"boolean":j=k=="true"?true:false;break;case"date":j=new Date(k);if(j=="Invalid Date"||isNaN(j)){j=k}break}c[h.name]=j}else{var k=c[h.name];if(a.isFunction(k)){k=c[h.name]()}if(k==undefined){k=""}try{!c.base?c.host.attr(g,k.toString()):c.base.host.attr(g,k.toString())}catch(f){}}})}else{try{if(c.host){if(!c.base){if(c.host){if(c.element.setAttribute){c.element.setAttribute(e,d.toString())}else{c.host.attr(e,d.toString())}}else{c.attr(e,d.toString())}}else{if(c.base.host){c.base.host.attr(e,d.toString())}else{c.attr(e,d.toString())}}}else{if(c.setAttribute){c.setAttribute(e,d.toString())}}}catch(b){}}};if(!Array.prototype.indexOf){Array.prototype.indexOf=function(c){var b=this.length;var d=Number(arguments[1])||0;d=(d<0)?Math.ceil(d):Math.floor(d);if(d<0){d+=b}for(;d<b;d++){if(d in this&&this[d]===c){return d}}return -1}}a.jqx.mobile=a.jqx.mobile||{};a.jqx.position=function(b){var e=parseInt(b.pageX);var d=parseInt(b.pageY);if(a.jqx.mobile.isTouchDevice()){var c=a.jqx.mobile.getTouches(b);var f=c[0];e=parseInt(f.pageX);d=parseInt(f.pageY)}return{left:e,top:d}};a.extend(a.jqx.mobile,{_touchListener:function(h,f){var b=function(j,l){var k=document.createEvent("MouseEvents");k.initMouseEvent(j,l.bubbles,l.cancelable,l.view,l.detail,l.screenX,l.screenY,l.clientX,l.clientY,l.ctrlKey,l.altKey,l.shiftKey,l.metaKey,l.button,l.relatedTarget);k._pageX=l.pageX;k._pageY=l.pageY;return k};var g={mousedown:"touchstart",mouseup:"touchend",mousemove:"touchmove"};var d=b(g[h.type],h);h.target.dispatchEvent(d);var c=h.target["on"+g[h.type]];if(typeof c==="function"){c(h)}},setMobileSimulator:function(c,e){if(this.isTouchDevice()){return}this.simulatetouches=true;if(e==false){this.simulatetouches=false}var d={mousedown:"touchstart",mouseup:"touchend",mousemove:"touchmove"};var b=this;if(window.addEventListener){var f=function(){for(var g in d){if(c.addEventListener){c.removeEventListener(g,b._touchListener);c.addEventListener(g,b._touchListener,false)}}};if(a.jqx.browser.msie){f()}else{f()}}},isTouchDevice:function(){if(this.touchDevice!=undefined){return this.touchDevice}var b="Browser CodeName: "+navigator.appCodeName+"";b+="Browser Name: "+navigator.appName+"";b+="Browser Version: "+navigator.appVersion+"";b+="Platform: "+navigator.platform+"";b+="User-agent header: "+navigator.userAgent+"";if(b.indexOf("Android")!=-1){return true}if(b.indexOf("IEMobile")!=-1){return true}if(b.indexOf("Windows Phone")!=-1){return true}if(b.indexOf("WPDesktop")!=-1){return true}if(b.indexOf("ZuneWP7")!=-1){return true}if(b.indexOf("BlackBerry")!=-1&&b.indexOf("Mobile Safari")!=-1){return true}if(b.indexOf("ipod")!=-1){return true}if(b.indexOf("nokia")!=-1||b.indexOf("Nokia")!=-1){return true}if(b.indexOf("Chrome/17")!=-1){return false}if(b.indexOf("CrOS")!=-1){return false}if(b.indexOf("Opera")!=-1&&b.indexOf("Mobi")==-1&&b.indexOf("Mini")==-1&&b.indexOf("Platform: Win")!=-1){return false}if(b.indexOf("Opera")!=-1&&b.indexOf("Mobi")!=-1&&b.indexOf("Opera Mobi")!=-1){return true}var c={ios:"i(?:Pad|Phone|Pod)(?:.*)CPU(?: iPhone)? OS ",android:"(Android |HTC_|Silk/)",blackberry:"BlackBerry(?:.*)Version/",rimTablet:"RIM Tablet OS ",webos:"(?:webOS|hpwOS)/",bada:"Bada/"};try{if(this.touchDevice!=undefined){return this.touchDevice}this.touchDevice=false;for(i in c){if(c.hasOwnProperty(i)){prefix=c[i];match=b.match(new RegExp("(?:"+prefix+")([^\\s;]+)"));if(match){if(i.toString()=="blackberry"){this.touchDevice=false;return false}this.touchDevice=true;return true}}}if(navigator.platform.toLowerCase().indexOf("win")!=-1){this.touchDevice=false;return false}document.createEvent("TouchEvent");this.touchDevice=true;return this.touchDevice}catch(d){this.touchDevice=false;return false}},getLeftPos:function(b){var c=b.offsetLeft;while((b=b.offsetParent)!=null){if(b.tagName!="HTML"){c+=b.offsetLeft;if(document.all){c+=b.clientLeft}}}return c},getTopPos:function(c){var e=c.offsetTop;var b=a(c).coord();while((c=c.offsetParent)!=null){if(c.tagName!="HTML"){e+=(c.offsetTop-c.scrollTop);if(document.all){e+=c.clientTop}}}var d=navigator.userAgent.toLowerCase();var f=(d.indexOf("windows phone")!=-1||d.indexOf("WPDesktop")!=-1||d.indexOf("ZuneWP7")!=-1||d.indexOf("msie 9")!=-1||d.indexOf("msie 11")!=-1||d.indexOf("msie 10")!=-1)&&d.indexOf("touch")!=-1;if(f){return b.top}if(this.isSafariMobileBrowser()){if(this.isSafari4MobileBrowser()&&this.isIPadSafariMobileBrowser()){return e}if(d.indexOf("version/7")!=-1){return b.top}e=e+a(window).scrollTop()}return e},isChromeMobileBrowser:function(){var c=navigator.userAgent.toLowerCase();var b=c.indexOf("android")!=-1;return b},isOperaMiniMobileBrowser:function(){var c=navigator.userAgent.toLowerCase();var b=c.indexOf("opera mini")!=-1||c.indexOf("opera mobi")!=-1;return b},isOperaMiniBrowser:function(){var c=navigator.userAgent.toLowerCase();var b=c.indexOf("opera mini")!=-1;return b},isNewSafariMobileBrowser:function(){var c=navigator.userAgent.toLowerCase();var b=c.indexOf("ipad")!=-1||c.indexOf("iphone")!=-1||c.indexOf("ipod")!=-1;b=b&&(c.indexOf("version/5")!=-1);return b},isSafari4MobileBrowser:function(){var c=navigator.userAgent.toLowerCase();var b=c.indexOf("ipad")!=-1||c.indexOf("iphone")!=-1||c.indexOf("ipod")!=-1;b=b&&(c.indexOf("version/4")!=-1);return b},isWindowsPhone:function(){var c=navigator.userAgent.toLowerCase();var b=(c.indexOf("windows phone")!=-1||c.indexOf("WPDesktop")!=-1||c.indexOf("ZuneWP7")!=-1||c.indexOf("msie 9")!=-1||c.indexOf("msie 11")!=-1||c.indexOf("msie 10")!=-1)&&c.indexOf("touch")!=-1;return b},isSafariMobileBrowser:function(){var c=navigator.userAgent.toLowerCase();var b=c.indexOf("ipad")!=-1||c.indexOf("iphone")!=-1||c.indexOf("ipod")!=-1;return b},isIPadSafariMobileBrowser:function(){var c=navigator.userAgent.toLowerCase();var b=c.indexOf("ipad")!=-1;return b},isMobileBrowser:function(){var c=navigator.userAgent.toLowerCase();var b=c.indexOf("ipad")!=-1||c.indexOf("iphone")!=-1||c.indexOf("android")!=-1;return b},getTouches:function(b){if(b.originalEvent){if(b.originalEvent.touches&&b.originalEvent.touches.length){return b.originalEvent.touches}else{if(b.originalEvent.changedTouches&&b.originalEvent.changedTouches.length){return b.originalEvent.changedTouches}}}if(!b.touches){b.touches=new Array();b.touches[0]=b.originalEvent!=undefined?b.originalEvent:b;if(b.originalEvent!=undefined&&b.pageX){b.touches[0]=b}if(b.type=="mousemove"){b.touches[0]=b}}return b.touches},getTouchEventName:function(b){if(this.isWindowsPhone()){if(b.toLowerCase().indexOf("start")!=-1){return"MSPointerDown"}if(b.toLowerCase().indexOf("move")!=-1){return"MSPointerMove"}if(b.toLowerCase().indexOf("end")!=-1){return"MSPointerUp"}}else{return b}},dispatchMouseEvent:function(b,f,d){if(this.simulatetouches){return}var c=document.createEvent("MouseEvent");c.initMouseEvent(b,true,true,f.view,1,f.screenX,f.screenY,f.clientX,f.clientY,false,false,false,false,0,null);if(d!=null){d.dispatchEvent(c)}},getRootNode:function(b){while(b.nodeType!==1){b=b.parentNode}return b},setTouchScroll:function(b,c){if(!this.enableScrolling){this.enableScrolling=[]}this.enableScrolling[c]=b},touchScroll:function(d,y,g,D,b,k){if(d==null){return}var B=this;var t=0;var j=0;var l=0;var u=0;var m=0;var n=0;if(!this.scrolling){this.scrolling=[]}this.scrolling[D]=false;var h=false;var q=a(d);var v=["select","input","textarea"];var c=0;var e=0;if(!this.enableScrolling){this.enableScrolling=[]}this.enableScrolling[D]=true;var D=D;var C=this.getTouchEventName("touchstart")+".touchScroll";var p=this.getTouchEventName("touchend")+".touchScroll";var A=this.getTouchEventName("touchmove")+".touchScroll";var c=function(E){if(!B.enableScrolling[D]){return true}if(a.inArray(E.target.tagName.toLowerCase(),v)!==-1){return}var F=B.getTouches(E);var G=F[0];if(F.length==1){B.dispatchMouseEvent("mousedown",G,B.getRootNode(G.target))}h=false;j=G.pageY;m=G.pageX;if(B.simulatetouches){j=G._pageY;m=G._pageX}B.scrolling[D]=true;t=0;u=0;return true};if(q.on){q.on(C,c)}else{q.bind(C,c)}var x=function(J){if(!B.enableScrolling[D]){return true}if(!B.scrolling[D]){return true}var L=B.getTouches(J);if(L.length>1){return true}var H=L[0].pageY;var I=L[0].pageX;if(B.simulatetouches){H=L[0]._pageY;I=L[0]._pageX}var E=H-j;var F=I-m;e=H;touchHorizontalEnd=I;l=E-t;n=F-u;h=true;t=E;u=F;g(-n*1,-l*1,F,E,J);var G=b!=null?b[0].style.display!="none":true;var K=k!=null?k[0].style.display!="none":true;if(G||K){if((n!==0&&G)||(l!==0&&K)){J.preventDefault();J.stopPropagation();if(J.preventManipulation){J.preventManipulation()}return false}}};if(q.on){q.on(A,x)}else{q.bind(A,x)}if(this.simulatetouches){var o=a(window).on!=undefined||a(window).bind;var z=function(E){B.scrolling[D]=false};a(window).on!=undefined?a(document).on("mouseup.touchScroll",z):a(document).bind("mouseup.touchScroll",z);if(window.frameElement){if(window.top!=null){var r=function(E){B.scrolling[D]=false};if(window.top.document){a(window.top.document).on?a(window.top.document).on("mouseup",r):a(window.top.document).bind("mouseup",r)}}}var s=a(document).on!=undefined||a(document).bind;var w=function(E){if(!B.scrolling[D]){return true}B.scrolling[D]=false;var G=B.getTouches(E)[0],F=B.getRootNode(G.target);B.dispatchMouseEvent("mouseup",G,F);B.dispatchMouseEvent("click",G,F)};a(document).on!=undefined?a(document).on("touchend",w):a(document).bind("touchend",w)}var f=function(E){if(!B.enableScrolling[D]){return true}var G=B.getTouches(E)[0];if(!B.scrolling[D]){return true}B.scrolling[D]=false;if(h){B.dispatchMouseEvent("mouseup",G,F)}else{var G=B.getTouches(E)[0],F=B.getRootNode(G.target);B.dispatchMouseEvent("mouseup",G,F);B.dispatchMouseEvent("click",G,F);return true}};q.on?q.on(p+" touchcancel.touchScroll",f):q.bind(p+" touchcancel.touchScroll",f)}});a.jqx.cookie=a.jqx.cookie||{};a.extend(a.jqx.cookie,{cookie:function(e,f,c){if(arguments.length>1&&String(f)!=="[object Object]"){c=jQuery.extend({},c);if(f===null||f===undefined){c.expires=-1}if(typeof c.expires==="number"){var h=c.expires,d=c.expires=new Date();d.setDate(d.getDate()+h)}f=String(f);return(document.cookie=[encodeURIComponent(e),"=",c.raw?f:encodeURIComponent(f),c.expires?"; expires="+c.expires.toUTCString():"",c.path?"; path="+c.path:"",c.domain?"; domain="+c.domain:"",c.secure?"; secure":""].join(""))}c=f||{};var b,g=c.raw?function(j){return j}:decodeURIComponent;return(b=new RegExp("(?:^|; )"+encodeURIComponent(e)+"=([^;]*)").exec(document.cookie))?g(b[1]):null}});a.jqx.string=a.jqx.string||{};a.extend(a.jqx.string,{replace:function(f,d,e){if(d===e){return this}var b=f;var c=b.indexOf(d);while(c!=-1){b=b.replace(d,e);c=b.indexOf(d)}return b},contains:function(b,c){if(b==null||c==null){return false}return b.indexOf(c)!=-1},containsIgnoreCase:function(b,c){if(b==null||c==null){return false}return b.toUpperCase().indexOf(c.toUpperCase())!=-1},equals:function(b,c){if(b==null||c==null){return false}b=this.normalize(b);if(c.length==b.length){return b.slice(0,c.length)==c}return false},equalsIgnoreCase:function(b,c){if(b==null||c==null){return false}b=this.normalize(b);if(c.length==b.length){return b.toUpperCase().slice(0,c.length)==c.toUpperCase()}return false},startsWith:function(b,c){if(b==null||c==null){return false}return b.slice(0,c.length)==c},startsWithIgnoreCase:function(b,c){if(b==null||c==null){return false}return b.toUpperCase().slice(0,c.length)==c.toUpperCase()},normalize:function(b){if(b.charCodeAt(b.length-1)==65279){b=b.substring(0,b.length-1)}return b},endsWith:function(b,c){if(b==null||c==null){return false}b=this.normalize(b);return b.slice(-c.length)==c},endsWithIgnoreCase:function(b,c){if(b==null||c==null){return false}b=this.normalize(b);return b.toUpperCase().slice(-c.length)==c.toUpperCase()}});a.extend(jQuery.easing,{easeOutBack:function(f,g,e,k,j,h){if(h==undefined){h=1.70158}return k*((g=g/j-1)*g*((h+1)*g+h)+1)+e},easeInQuad:function(f,g,e,j,h){return j*(g/=h)*g+e},easeInOutCirc:function(f,g,e,j,h){if((g/=h/2)<1){return -j/2*(Math.sqrt(1-g*g)-1)+e}return j/2*(Math.sqrt(1-(g-=2)*g)+1)+e},easeInOutSine:function(f,g,e,j,h){return -j/2*(Math.cos(Math.PI*g/h)-1)+e},easeInCubic:function(f,g,e,j,h){return j*(g/=h)*g*g+e},easeOutCubic:function(f,g,e,j,h){return j*((g=g/h-1)*g*g+1)+e},easeInOutCubic:function(f,g,e,j,h){if((g/=h/2)<1){return j/2*g*g*g+e}return j/2*((g-=2)*g*g+2)+e},easeInSine:function(f,g,e,j,h){return -j*Math.cos(g/h*(Math.PI/2))+j+e},easeOutSine:function(f,g,e,j,h){return j*Math.sin(g/h*(Math.PI/2))+e},easeInOutSine:function(f,g,e,j,h){return -j/2*(Math.cos(Math.PI*g/h)-1)+e}})})(jQuery);(function(b){b.extend(jQuery.event.special,{close:{noBubble:true},open:{noBubble:true},expand:{noBubble:true},collapse:{noBubble:true},tabclick:{noBubble:true},selected:{noBubble:true},expanded:{noBubble:true},collapsed:{noBubble:true},valuechanged:{noBubble:true},expandedItem:{noBubble:true},collapsedItem:{noBubble:true},expandingItem:{noBubble:true},collapsingItem:{noBubble:true}});b.fn.extend({ischildof:function(f){var d=b(this).parents().get();for(var c=0;c<d.length;c++){if(typeof f!="string"){var e=d[c];if(f!==undefined){if(e==f[0]){return true}}}else{if(f!==undefined){if(b(d[c]).is(f)){return true}}}}return false}});var a=this.originalVal=b.fn.val;b.fn.val=function(d){if(typeof d=="undefined"){if(b(this).hasClass("jqx-widget")){var c=b(this).data().jqxWidget;if(c&&c.val){return c.val()}}return a.call(this)}else{if(b(this).hasClass("jqx-widget")){var c=b(this).data().jqxWidget;if(c&&c.val){if(arguments.length!=2){return c.val(d)}else{return c.val(d,arguments[1])}}}return a.call(this,d)}};b.fn.coord=function(o){var e,k,j={top:0,left:0},f=this[0],m=f&&f.ownerDocument;if(!m){return}e=m.documentElement;if(!jQuery.contains(e,f)){return j}if(typeof f.getBoundingClientRect!==undefined){j=f.getBoundingClientRect()}var d=function(p){return jQuery.isWindow(p)?p:p.nodeType===9?p.defaultView||p.parentWindow:false};k=d(m);var h=0;var c=0;var g=navigator.userAgent.toLowerCase();var n=g.indexOf("ipad")!=-1||g.indexOf("iphone")!=-1;if(n){h=2}if(true==o){if(b(document.body).css("position")!="static"){var l=b(document.body).coord();h=-l.left;c=-l.top}}return{top:c+j.top+(k.pageYOffset||e.scrollTop)-(e.clientTop||0),left:h+j.left+(k.pageXOffset||e.scrollLeft)-(e.clientLeft||0)}}})(jQuery);

/*
jQWidgets v3.0.3 (2013-Oct-01)
Copyright (c) 2011-2013 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function(a){a.jqx.jqxWidget("jqxDateTimeInput","",{});a.extend(a.jqx._jqxDateTimeInput.prototype,{defineInstance:function(){if(this.value==undefined){this.value=a.jqx._jqxDateTimeInput.getDateTime(new Date());this.value._setHours(0);this.value._setMinutes(0);this.value._setSeconds(0);this.value._setMilliseconds(0)}if(this.minDate==undefined){this.minDate=a.jqx._jqxDateTimeInput.getDateTime(new Date());this.minDate._setYear(1900);this.minDate._setMonth(1);this.minDate._setDay(1);this.minDate._setHours(1);this.minDate._setMinutes(1);this.minDate._setSeconds(1);this.minDate._setMilliseconds(1)}this.defaultMinDate=this.minDate;if(this.maxDate==undefined){this.maxDate=a.jqx._jqxDateTimeInput.getDateTime(new Date());this.maxDate._setYear(2100);this.maxDate._setMonth(1);this.maxDate._setDay(1);this.maxDate._setHours(1);this.maxDate._setMinutes(1);this.maxDate._setSeconds(1);this.maxDate._setMilliseconds(1)}this.defaultMaxDate=this.maxDate;this.min=new Date(1900,0,1);this.max=new Date(2100,0,1);this.rowHeaderWidth=25;this.columnHeaderHeight=20;this.titleHeight=25;if(this.firstDayOfWeek==undefined){this.firstDayOfWeek=0}if(this.showWeekNumbers==undefined){this.showWeekNumbers=false}this.cookies=false;this.cookieoptions=null;this.showFooter=false;if(this.formatString===undefined){this.formatString="dd/MM/yyyy"}if(this.width===undefined){this.width=null}if(this.height===undefined){this.height=null}if(this.dayNameFormat===undefined){this.dayNameFormat="firstTwoLetters"}if(this.textAlign===undefined){this.textAlign="left"}if(this.readonly===undefined){this.readonly=false}if(this.culture===undefined){this.culture="default"}this.activeEditor=this.activeEditor||null;if(this.showCalendarButton===undefined){this.showCalendarButton=true}if(this.openDelay==undefined){this.openDelay=250}if(this.closeDelay===undefined){this.closeDelay=300}if(this.closeCalendarAfterSelection===undefined){this.closeCalendarAfterSelection=true}this.isEditing=false;this.enableBrowserBoundsDetection=false;this.dropDownHorizontalAlignment="left";this.enableAbsoluteSelection=false;this.disabled=false;this.buttonSize=18;this.animationType="slide";this.dropDownWidth="205px";this.dropDownHeight="205px";this.selectionMode="default";this.rtl=false;this._editor=false;this.todayString="Today";this.clearString="Clear";this.popupZIndex=100000;this.allowNullDate=true;this.allowKeyboardDelete=true;this.localization={backString:"Back",forwardString:"Forward",todayString:"Today",clearString:"Clear",calendar:{name:"Gregorian_USEnglish","/":"/",":":":",firstDay:0,days:{names:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],namesAbbr:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],namesShort:["Su","Mo","Tu","We","Th","Fr","Sa"]},months:{names:["January","February","March","April","May","June","July","August","September","October","November","December",""],namesAbbr:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""]},AM:["AM","am","AM"],PM:["PM","pm","PM"],eras:[{name:"A.D.",start:null,offset:0}],twoDigitYearMax:2029,patterns:{d:"M/d/yyyy",D:"dddd, MMMM dd, yyyy",t:"h:mm tt",T:"h:mm:ss tt",f:"dddd, MMMM dd, yyyy h:mm tt",F:"dddd, MMMM dd, yyyy h:mm:ss tt",M:"MMMM dd",Y:"yyyy MMMM",S:"yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss",ISO:"yyyy-MM-dd hh:mm:ss"}}};this.events=["valuechanged","textchanged","mousedown","mouseup","keydown","keyup","keypress","open","close","change"];this.aria={"aria-valuenow":{name:"getDate",type:"date"},"aria-valuetext":{name:"getText",type:"string"},"aria-valuemin":{name:"min",type:"date"},"aria-valuemax":{name:"max",type:"date"},"aria-disabled":{name:"disabled",type:"boolean"}}},createInstance:function(c){var e="";if(!this.host.jqxCalendar){throw new Error("jqxDateTimeInput: Missing reference to jqxcalendar.js.")}if(this.host.attr("value")){e=true;var g=this.host.attr("value");if(this.selectionMode!="range"){var b=new Date(g);if(b!=undefined&&!isNaN(b)){this.value=a.jqx._jqxDateTimeInput.getDateTime(b)}}}if(this.value!=null&&this.value instanceof Date){this.value=a.jqx._jqxDateTimeInput.getDateTime(this.value)}else{if(this.value!=null&&typeof(this.value)=="string"){var b=new Date(this.value);if(b!=undefined&&!isNaN(b)){this.value=a.jqx._jqxDateTimeInput.getDateTime(b)}}}this.host.attr("data-role","input");this.render();a.jqx.aria(this);if(this.getDate()!=null){a.jqx.aria(this,"aria-label","Current focused date is "+this.getDate().toLocaleString())}else{a.jqx.aria(this,"aria-label","Current focused date is Null")}if(this.minDate!==this.defaultMinDate){this.min=this.minDate}if(this.maxDate!==this.defaultMaxDate){this.max=this.maxDate}this.setMaxDate(this.max,false);this.setMinDate(this.min,false);if(this.selectionMode=="range"){if(e){var g=this.host.attr("value");var f=g.substring(0,g.indexOf("-"));var d=g.substring(g.indexOf("-")+1);var j=new Date(f);var h=new Date(d);if(j!=undefined&&!isNaN(j)){if(h!=undefined&&!isNaN(h)){this.setRange(j,h)}}}else{if(this.getDate()!=null){this.setRange(this.getDate(),this.getDate())}}}},_format:function(d,e,b){var f=false;try{if(Globalize!=undefined){f=true}}catch(c){}if(a.global){return a.global.format(d,e,this.culture)}else{if(f){try{var e=Globalize.format(d,e,this.culture);return e}catch(c){return Globalize.format(d,e)}}else{if(a.jqx.dataFormat){if(d instanceof Date){return a.jqx.dataFormat.formatdate(d,e,this.localization.calendar)}else{if(typeof d==="number"){return a.jqx.dataFormat.formatnumber(d,e,this.localization.calendar)}else{return a.jqx.dataFormat.formatdate(d,e,this.localization.calendar)}}}else{throw new Error("jqxDateTimeInput: Missing reference to globalize.js.")}}}},render:function(){this._removeHandlers();this.element.innerHTML="";this.host.attr({role:"textbox"});this.id=a.jqx.utilities.createId();var f=a.jqx.utilities.createId();var k=a.jqx.utilities.createId();var b=a("<div class='jqx-datetimeinput-container' style='overflow: hidden; border: 0px;'><div id='dateTimeWrapper' style='float: none; position: relative; width: 100%; height: 100%;'><div class='jqx-datetimeinput-content' id='dateTimeContent"+f+"' style='position: relative; overflow: hidden; float: left;'/><div id='dateTimeButton"+k+"' style='position: relative; float: right;'/></div></div>");this.host.css("overflow","hidden");this._setSize();if(this.width==null){this.width=this.host.width();this.host.width(this.width)}this.touch=a.jqx.mobile.isTouchDevice();this.host.append(b);this.dateTimeWrapper=this.host.find("#dateTimeWrapper");this.inputElement=this.host.find("#dateTimeContent"+f);this.calendarElement=this.host.find("#dateTimeButton"+k);this.dateTimeInput=a("<input autocomplete='off' style='position: relative; border: none; margin: 0; padding: 0;' id='inputElement' class='jqx-input-content' type='textarea'/>").appendTo(this.inputElement);this.dateTimeInput[0].id="input"+this.element.id;this.dateTimeInput.removeClass(this.toThemeProperty("jqx-input-content"));this.dateTimeInput.addClass(this.toThemeProperty("jqx-input-content"));this.dateTimeInput.addClass(this.toThemeProperty("jqx-widget-content"));this.dateTimeInput.addClass(this.toThemeProperty("jqx-rc-all"));var c=this.host.attr("name");if(!c){c=this.element.id}this.dateTimeInput.attr("name",c);if(this.rtl){this.dateTimeInput.css("direction","rtl");this.dateTimeInput.addClass("jqx-rtl");this.inputElement.css("float","right");this.calendarElement.css("float","left")}this.inputElement.addClass(this.toThemeProperty("jqx-input"));this.inputElement.addClass(this.toThemeProperty("jqx-widget-content"));this.inputElement.addClass(this.toThemeProperty("jqx-rc-all"));this.inputElement.height(this.host.height()-2);this.calendarButton=a("<div style='padding: 0px; margin: 0px; top: 0; font-size: 3px; position: relative;' class='jqx-input-button-header'><div style='position: relative; font-size: 3px;' class='jqx-input-button-innerheader'></div></div><div style='padding: 0px; margin: 0px; top: 0; position: relative;' class='jqx-input-button-content'/>").appendTo(this.calendarElement);this.calendarButtonContent=this.host.find(".jqx-input-button-content");this.calendarButtonHeader=this.host.find(".jqx-input-button-header");this.calendarButtonInnerHeader=this.host.find(".jqx-input-button-innerheader");this.calendarButtonContent.removeClass(this.toThemeProperty("jqx-input-button-content"));this.calendarButtonContent.addClass(this.toThemeProperty("jqx-input-button-content"));this.calendarButtonContent.removeClass(this.toThemeProperty("jqx-widget-content"));this.calendarButtonContent.addClass(this.toThemeProperty("jqx-widget-content"));this.calendarButtonHeader.removeClass(this.toThemeProperty("jqx-input-button-header"));this.calendarButtonHeader.addClass(this.toThemeProperty("jqx-input-button-header"));this.calendarButtonHeader.removeClass(this.toThemeProperty("jqx-widget-header"));this.calendarButtonHeader.addClass(this.toThemeProperty("jqx-widget-header"));this.calendarButtonInnerHeader.removeClass(this.toThemeProperty("jqx-input-button-innerHeader"));this.calendarButtonInnerHeader.addClass(this.toThemeProperty("jqx-input-button-innerHeader"));var m=this;this._arrange();this.addHandler(this.host,"loadContent",function(e){m._arrange()});if(this.showCalendarButton){this.calendarButton.css("display","block")}else{this.calendarButton.css("display","none")}if(a.jqx._jqxCalendar!=null&&a.jqx._jqxCalendar!=undefined){try{var j="calendar"+this.id;var h=a(a.find("#"+j));if(h.length>0){h.remove()}a.jqx.aria(this,"aria-owns",j);a.jqx.aria(this,"aria-haspopup",true);a.jqx.aria(this,"aria-readonly",this.selectionMode=="range"?true:false);var d=a("<div style='overflow: hidden; background: transparent; position: absolute;' id='calendar"+this.id+"'><div id='innerCalendar"+this.id+"'></div></div>");if(a.jqx.utilities.getBrowser().browser=="opera"){d.hide()}d.appendTo(document.body);this.container=d;this.calendarContainer=a(a.find("#innerCalendar"+this.id)).jqxCalendar({rowHeaderWidth:this.rowHeaderWidth,titleHeight:this.titleHeight,columnHeaderHeight:this.columnHeaderHeight,_checkForHiddenParent:false,enableAutoNavigation:false,canRender:false,localization:this.localization,todayString:this.todayString,clearString:this.clearString,dayNameFormat:this.dayNameFormat,rtl:this.rtl,culture:this.culture,showFooter:this.showFooter,selectionMode:this.selectionMode,firstDayOfWeek:this.firstDayOfWeek,showWeekNumbers:this.showWeekNumbers,width:this.dropDownWidth,height:this.dropDownHeight,theme:this.theme});this.calendarContainer.css({position:"absolute",zIndex:this.popupZIndex,top:0,left:0});this.calendarContainer.addClass(this.toThemeProperty("jqx-popup"));if(a.jqx.browser.msie){this.calendarContainer.addClass(this.toThemeProperty("jqx-noshadow"))}this._calendar=a.data(this.calendarContainer[0],"jqxCalendar").instance;var m=this;this._calendar.today=function(){m.today()};this._calendar.clear=function(){m.clear()};if(a.jqx.utilities.getBrowser().browser=="opera"){d.show()}d.height(parseInt(this.calendarContainer.height())+25);d.width(parseInt(this.calendarContainer.width())+25);if(this.selectionMode=="range"){this.readonly=true}if(this.animationType=="none"){this.container.css("display","none")}else{this.container.hide()}}catch(l){}}if(a.global){a.global.preferCulture(this.culture)}this.selectedText="";this._addHandlers();this.self=this;this.oldValue=this.getDate();this.items=new Array();this.editors=new Array();if(this.value){this.calendarButtonContent.html("<div style='line-height: 16px;  color: inherit; background: transparent; margin: 0; border: 0; padding: 0px; text-align: center; vertical-align: middle;'><b style='border: 0; padding: 0px; margin: 0px; background: transparent;'>"+this.value.day+"</b></div>")}this._loadItems();this.editorText="";if(this.readonly==true){this.dateTimeInput.css("readonly",this.readonly)}this.dateTimeInput.css("text-align",this.textAlign);this.host.addClass(this.toThemeProperty("jqx-widget"));this.propertyChangeMap.disabled=function(e,p,o,q){if(q){e.host.addClass(m.toThemeProperty("jqx-input-disabled"));e.dateTimeInput.addClass(m.toThemeProperty("jqx-input-disabled"));e.host.addClass(m.toThemeProperty("jqx-fill-state-disabled"))}else{e.host.removeClass(m.toThemeProperty("jqx-fill-state-disabled"));e.host.removeClass(m.toThemeProperty("jqx-input-disabled"));e.dateTimeInput.removeClass(m.toThemeProperty("jqx-input-disabled"))}a.jqx.aria(this,"aria-disabled",q)};if(this.disabled){this.host.addClass(this.toThemeProperty("jqx-input-disabled"));this.host.addClass(this.toThemeProperty("jqx-input-disabled"));this.dateTimeInput.addClass(this.toThemeProperty("jqx-input-disabled"))}if(this.host.parents("form").length>0){this.addHandler(this.host.parents("form"),"reset",function(){setTimeout(function(){m.setDate(new Date())},10)})}if(this.cookies){var g=a.jqx.cookie.cookie("jqxDateTimeInput"+this.element.id);if(g!=null){this.setDate(new Date(g))}}if(a.jqx.browser.msie&&a.jqx.browser.version<8){if(this.host.parents(".jqx-window").length>0){var n=this.host.parents(".jqx-window").css("z-index");this.container.css("z-index",n+10);this.calendarContainer.css("z-index",n+10)}}if(this.culture!="default"){this._applyCulture()}},val:function(b){if(arguments.length!=0){if(b==null){this.setDate(null)}if(this.selectionMode=="range"){this.setRange(arguments[0],arguments[1]);return this.getText()}if(b instanceof Date){this.setDate(b)}if(typeof(b)=="string"){if(b=="date"){return this.getDate()}this.setDate(b)}}return this.getText()},_setSize:function(){if(this.width!=null&&this.width.toString().indexOf("px")!=-1){this.host.width(this.width)}else{if(this.width!=undefined&&!isNaN(this.width)){this.host.width(this.width)}}if(this.height!=null&&this.height.toString().indexOf("px")!=-1){this.host.height(this.height)}else{if(this.height!=undefined&&!isNaN(this.height)){this.host.height(this.height)}}var e=false;if(this.width!=null&&this.width.toString().indexOf("%")!=-1){e=true;this.host.width(this.width)}if(this.height!=null&&this.height.toString().indexOf("%")!=-1){e=true;this.host.height(this.height)}var c=this;var d=function(){if(c.calendarContainer){c._arrange();if(c.dropDownWidth=="auto"){var f=c.host.width();c.calendarContainer.jqxCalendar({width:f});c.container.width(parseInt(f)+25)}}};if(e){if(this.calendarContainer){this.refresh(false);var b=this.host.width();if(this.dropDownWidth!="auto"){b=this.dropDownWidth}this.calendarContainer.jqxCalendar({width:b});this.container.width(parseInt(b)+25)}}a.jqx.utilities.resize(this.host,function(){d()})},_arrange:function(){var d=parseInt(this.host.width());var l=parseInt(this.host.height());var j=this.buttonSize;var f=3;this.calendarButtonHeader.width(j);this.calendarButtonContent.height(j-f-1);this.calendarButtonContent.width(j);this.inputElement.height(l-2);var h=parseInt(this.inputElement.outerHeight())-parseInt(this.inputElement.height());h=0;var b=d-j-2-1*f;if(b>0){this.inputElement.width(b+"px")}this.dateTimeInput.width(b-f+"px");this.dateTimeInput.css("left",0);this.dateTimeInput.css("top",0);this.inputElement.css("left",0);this.inputElement.css("top",0);var k=parseInt(this.calendarButtonHeader.outerWidth())/2-parseInt(this.calendarButtonInnerHeader.outerWidth())/2;this.calendarButtonInnerHeader.css("left",k);var m=parseInt(this.calendarButtonContent.outerHeight())+parseInt(this.calendarButtonHeader.outerHeight());var g=parseInt(this.inputElement.outerHeight())/2-m/2;this.calendarElement.css("top",parseInt(g)+"px");var c=this.dateTimeInput.outerHeight();if(c==0){c=parseInt(this.dateTimeInput.css("font-size"))+3}var e=parseInt(this.inputElement.height())/2-parseInt(c)/2;var l=this.host.height()-2;if(l>16){this.dateTimeInput.height(l)}},_removeHandlers:function(){var b=this;this.removeHandler(a(document),"mousedown."+this.id);if(this.dateTimeInput){this.removeHandler(this.dateTimeInput,"keydown."+this.id);this.removeHandler(this.dateTimeInput,"blur");this.removeHandler(this.dateTimeInput,"focus");this.removeHandler(this.host,"focus");this.removeHandler(this.dateTimeInput,"mousedown");this.removeHandler(this.dateTimeInput,"mouseup");this.removeHandler(this.dateTimeInput,"keydown");this.removeHandler(this.dateTimeInput,"keyup");this.removeHandler(this.dateTimeInput,"keypress")}if(this.calendarButton!=null){this.removeHandler(this.calendarButton,"mousedown")}if(this.calendarContainer!=null){this.removeHandler(this.calendarContainer,"cellSelected");this.removeHandler(this.calendarContainer,"cellMouseDown")}this.removeHandler(a(window),"resize."+this.id)},isOpened:function(){var c=this;var b=a.data(document.body,"openedJQXCalendar"+this.id);if(b!=null&&b==c.calendarContainer){return true}return false},wheel:function(d,c){var e=0;if(!d){d=window.event}if(d.originalEvent&&d.originalEvent.wheelDelta){d.wheelDelta=d.originalEvent.wheelDelta}if(d.wheelDelta){e=d.wheelDelta/120}else{if(d.detail){e=-d.detail/3}}if(e){var b=c._handleDelta(e);if(!b){if(d.preventDefault){d.preventDefault()}d.returnValue=false;return b}else{return false}}if(d.preventDefault){d.preventDefault()}d.returnValue=false},_handleDelta:function(b){if(b<0){this.spinDown()}else{this.spinUp()}return false},focus:function(){try{this.dateTimeInput.focus()}catch(b){}},_addHandlers:function(){var e=this.element.id;var c=this.element;var d=this;if(this.host.parents()){this.addHandler(this.host.parents(),"scroll.datetimeinput"+this.element.id,function(f){var g=d.isOpened();if(g){d.close()}})}this.addHandler(this.host,"mousewheel",function(f){d.wheel(f,d)});this.addHandler(a(document),"mousedown."+this.id,this._closeOpenedCalendar,{me:this});if(a.jqx.mobile.isTouchDevice()){this.addHandler(a(document),a.jqx.mobile.getTouchEventName("touchstart")+"."+this.id,this._closeOpenedCalendar,{me:this})}this.addHandler(this.dateTimeInput,"keydown."+this.id,function(h){var g=a.data(document.body,"openedJQXCalendar"+d.id);if(g!=null&&g==d.calendarContainer){var f=d.handleCalendarKey(h,d);return f}});if(this.calendarContainer!=null){this.addHandler(this.calendarContainer,"keydown",function(f){if(f.keyCode==13){if(d.isOpened()){if(!d._calendar._viewAnimating&&d._calendar.view=="month"){d.hideCalendar("selected");d.dateTimeInput.focus();return false}}return true}else{if(f.keyCode==9){if(d.isOpened()){d.hideCalendar("selected");return true}}else{if(f.keyCode==27){if(d.isOpened()){d.hideCalendar();d.dateTimeInput.focus();return false}return true}}}if(f.keyCode==115){if(d.isOpened()){d.hideCalendar();d.dateTimeInput.focus();return false}else{if(!d.isOpened()){d.showCalendar();d.dateTimeInput.focus();return false}}}if(f.altKey){if(f.keyCode==38){if(d.isOpened()){d.hideCalendar();d.dateTimeInput.focus();return false}}else{if(f.keyCode==40){if(!d.isOpened()){d.showCalendar();d.dateTimeInput.focus();return false}}}}});this.addHandler(this.calendarContainer,"cellSelected",function(g){if(d.closeCalendarAfterSelection){var f=a.data(document.body,"openedJQXCalendarValue");if(g.args.selectionType=="mouse"){if(d.selectionMode!="range"){d.hideCalendar("selected")}else{if(d._calendar._clicks==0){d.hideCalendar("selected")}}}}});this.addHandler(this.calendarContainer,"cellMouseDown",function(f){if(d.closeCalendarAfterSelection){if(d._calendar.value){a.data(document.body,"openedJQXCalendarValue",new a.jqx._jqxDateTimeInput.getDateTime(d._calendar.value.dateTime))}}})}this.addHandler(this.dateTimeInput,"blur",function(f){if(d.value!=null){d.isEditing=false;d._validateValue();d._updateText();d._raiseEvent(9,f)}d.inputElement.removeClass(d.toThemeProperty("jqx-fill-state-focus"))});this.addHandler(this.host,"focus",function(f){d.focus()});this.addHandler(this.dateTimeInput,"focus",function(g){if(d.value!=null){if(d.selectionMode!="range"){d._oldDT=new Date(d.value.dateTime)}else{d._oldDT=d.getRange()}var f=d._selection();d.isEditing=true;d._validateValue();d._updateText();d._setSelectionStart(0);d._selectGroup(-1);d.inputElement.addClass(d.toThemeProperty("jqx-fill-state-focus"))}else{d._setSelectionStart(0);d._selectGroup(-1);d.inputElement.addClass(d.toThemeProperty("jqx-fill-state-focus"))}if(g.preventDefault){g.preventDefault();return false}});var b="mousedown";if(this.touch){b=a.jqx.mobile.getTouchEventName("touchstart")}this.addHandler(this.calendarButton,b,function(g){var h=d.container;var f=h.css("display")=="block";if(!d.disabled){if(!d.isanimating){if(f){d.hideCalendar();return false}else{d.showCalendar();g.preventDefault()}}}});this.addHandler(this.dateTimeInput,"mousedown",function(f){return d._raiseEvent(2,f)});this.addHandler(this.dateTimeInput,"mouseup",function(f){return d._raiseEvent(3,f)});this.addHandler(this.dateTimeInput,"keydown",function(f){return d._raiseEvent(4,f)});this.addHandler(this.dateTimeInput,"keyup",function(f){return d._raiseEvent(5,f)});this.addHandler(this.dateTimeInput,"keypress",function(f){return d._raiseEvent(6,f)})},createID:function(){var b=Math.random()+"";b=b.replace(".","");b="99"+b;b=b/1;return"dateTimeInput"+b},setMaxDate:function(b,c){if(b==null){return}if(b!=null&&typeof(b)=="string"){b=new Date(b);if(b=="Invalid Date"){return}}this.maxDate=a.jqx._jqxDateTimeInput.getDateTime(b);if(this._calendar!=null){this._calendar.setMaxDate(b)}if(c!=false){if(this.getDate()>b){this.setDate(b)}a.jqx.aria(this,"aria-valuemax",b);this._refreshValue();this._updateText()}},getMaxDate:function(){if(this.maxDate!=null&&this.maxDate!=undefined){return this.maxDate.dateTime}return null},setMinDate:function(b,c){if(b==null){return}if(b!=null&&typeof(b)=="string"){b=new Date(b);if(b=="Invalid Date"){return}}this.minDate=a.jqx._jqxDateTimeInput.getDateTime(b);if(this._calendar!=null){this._calendar.setMinDate(b)}if(c!=false){if(this.getDate()<b){this.setDate(b)}a.jqx.aria(this,"aria-valuemin",b);this._refreshValue();this._updateText()}},getMinDate:function(){if(this.minDate!=null&&this.minDate!=undefined){return this.minDate.dateTime}return null},_applyCulture:function(){var d=false;try{if(Globalize!=undefined){d=true}}catch(c){}try{if(a.global){a.global.preferCulture(this.culture);this.localization.calendar=a.global.culture.calendar}else{if(d){var b=Globalize.culture(this.culture);this.localization.calendar=b.calendar}}this._loadItems();if(this._calendar!=null){this._calendar.culture=this.culture;this._calendar.localization=this.localization;this._calendar.render()}}catch(c){}},propertyMap:function(b){if(b=="value"){if(this.selectionMode!="range"){return this.getDate()}else{return this.getRange()}}return null},propertyChangedHandler:function(c,d,f,e){if(c.isInitialized==undefined||c.isInitialized==false){return}if(d=="popupZIndex"){c.calendarContainer.css({zIndex:e})}if(d=="selectionMode"){c._calendar.selectionMode=e;c.refreshValue()}if(d=="min"){if(typeof(e)=="string"){c.setMinDate(new Date(e))}else{c.setMinDate(e)}}if(d=="max"){if(typeof(e)=="string"){c.setMaxDate(new Date(e))}else{c.setMaxDate(e)}}if(d=="value"){if(e!=null&&e instanceof Date){if(isNaN(e.getFullYear())||isNaN(e.getMonth())||isNaN(e.getDate())){this.value=f;return}e=a.jqx._jqxDateTimeInput.getDateTime(e)}else{if(e!=null&&typeof(e)=="string"){var b=new Date(e);if(b!=undefined&&!isNaN(b)){this.value=a.jqx._jqxDateTimeInput.getDateTime(b)}}}}if(d=="rtl"){c.calendarContainer.jqxCalendar({rtl:e});if(e){c.dateTimeInput.css("direction","rtl");c.dateTimeInput.addClass("jqx-rtl");c.inputElement.css("float","right");c.calendarElement.css("float","left")}else{c.dateTimeInput.css("direction","ltr");c.dateTimeInput.removeClass("jqx-rtl");c.inputElement.css("float","left");c.calendarElement.css("float","right")}}if(d=="todayString"||d=="clearString"){c.calendarContainer.jqxCalendar({clearString:c.clearString,todayString:c.todayString})}if(d=="dayNameFormat"){c.calendarContainer.jqxCalendar({dayNameFormat:e})}if(d=="firstDayOfWeek"){c.calendarContainer.jqxCalendar({firstDayOfWeek:e})}if(d=="showWeekNumbers"){c.calendarContainer.jqxCalendar({showWeekNumbers:e})}if(d=="culture"||d=="localization"){c._applyCulture()}else{if(d=="formatString"){c._loadItems()}}if(d=="theme"){if(c.dateTimeInput){c.host.removeClass();c.host.addClass(c.toThemeProperty("jqx-widget"));c.dateTimeInput.removeClass();c.dateTimeInput.addClass(c.toThemeProperty("jqx-input-content"));c.dateTimeInput.addClass(c.toThemeProperty("jqx-widget-content"));c.inputElement.removeClass();c.inputElement.addClass(c.toThemeProperty("jqx-input"));c.inputElement.addClass(c.toThemeProperty("jqx-widget-content"));c.inputElement.addClass(c.toThemeProperty("jqx-rc-all"));c.calendarButtonContent.removeClass();c.calendarButtonContent.addClass(c.toThemeProperty("jqx-input-button-content"));c.calendarButtonContent.addClass(c.toThemeProperty("jqx-widget-content"));c.calendarButtonHeader.removeClass();c.calendarButtonHeader.addClass(c.toThemeProperty("jqx-input-button-header"));c.calendarButtonHeader.addClass(c.toThemeProperty("jqx-widget-header"));c.calendarButtonInnerHeader.removeClass();c.calendarButtonInnerHeader.addClass(c.toThemeProperty("jqx-input-button-innerHeader"));c.calendarContainer.jqxCalendar({theme:e})}}if(d=="width"||d=="height"){c.refresh();return}c._setOption(d,e);if(d=="dropDownWidth"||d=="dropDownHeight"){c.calendarContainer.jqxCalendar({width:c.dropDownWidth,height:c.dropDownHeight});c._calendar.render();c.container.height(c.calendarContainer.height());c.container.width(c.calendarContainer.width())}},clear:function(){if(this.allowNullDate){if(this.selectionMode!="range"){this.setDate(null)}else{this._calendar._clicks=1;this.setRange(null,null)}this._calendar._clicks=0}else{if(this.selectionMode!="range"){this.setDate(me.getMinDate())}else{this._calendar._clicks=1;this.setRange(me.getMinDate(),me.getMinDate());this._calendar._clicks=0}}this.hideCalendar()},today:function(){var b=new Date();b.setHours(0,0,0,0);if(this.selectionMode!="range"){this.setDate(b)}else{this._calendar._clicks=1;this.setRange(b,b);this._calendar._clicks=0}this.hideCalendar()},setDate:function(b){if(b!=null&&typeof(b)=="string"){b=new Date(b);if(b=="Invalid Date"){return}}if(b==null||b=="null"||b=="undefined"){if(!this.allowNullDate){b=this.min}}if(b=="Invalid Date"){b=null}if(b==null||b=="null"||b=="undefined"){if(this.value!=null){this.value=null;this._calendar.setDate(null);this._refreshValue();if(this.cookies){if(this.value!=null){a.jqx.cookie.cookie("jqxDateTimeInput"+this.element.id,this.value.dateTime.toString(),this.cookieoptions)}}this._setSelectionStart(0);this._selectGroup(-1);this._raiseEvent("0",b);this._raiseEvent("9",b)}return}if(b<this.getMinDate()||b>this.getMaxDate()){return}if(this.value==null){this.value=new a.jqx._jqxDateTimeInput.getDateTime(new Date());this.value._setHours(0);this.value._setMinutes(0);this.value._setSeconds(0);this.value._setMilliseconds(0)}if(b.getFullYear){this.value._setYear(b.getFullYear());this.value._setDay(1);this.value._setMonth(b.getMonth()+1);this.value._setHours(b.getHours());this.value._setMinutes(b.getMinutes());this.value._setSeconds(b.getSeconds());this.value._setMilliseconds(b.getMilliseconds());this.value._setDay(b.getDate())}this._refreshValue();if(this.cookies){if(this.value!=null){a.jqx.cookie.cookie("jqxDateTimeInput"+this.element.id,this.value.dateTime.toString(),this.cookieoptions)}}this._raiseEvent("0",b);this._raiseEvent("9",b)},getDate:function(){if(this.value==undefined){return null}return new Date(this.value.dateTime)},getText:function(){return this.dateTimeInput.val()},setRange:function(d,c){if(d=="Invalid Date"){d=null}if(c=="Invalid Date"){c=null}if(d!=null&&typeof(d)=="string"){d=new Date(d);if(d=="Invalid Date"){return}}if(c!=null&&typeof(c)=="string"){c=new Date(c);if(c=="Invalid Date"){return}}if(d&&isNaN(d)&&d.toString()=="NaN"&&typeof(d)!="string"){return}if(c&&isNaN(c)&&c.toString()=="NaN"&&typeof(c)!="string"){return}this._calendar.setRange(d,c);var b=d;if(b!=null&&b.getFullYear){if(this.value==null){this.value=new a.jqx._jqxDateTimeInput.getDateTime(new Date());this.value._setHours(0);this.value._setMinutes(0);this.value._setSeconds(0);this.value._setMilliseconds(0)}this.value._setYear(b.getFullYear());this.value._setMonth(b.getMonth()+1);this.value._setHours(b.getHours());this.value._setMinutes(b.getMinutes());this.value._setSeconds(b.getSeconds());this.value._setMilliseconds(b.getMilliseconds());this.value._setDay(b.getDate())}this._refreshValue();if(this.value){this._raiseEvent("0",this.value.dateTime)}else{this._raiseEvent("0",null)}},getRange:function(){return this._calendar.getRange()},_validateValue:function(){var b=false;for(var d=0;d<this.items.length;d++){var c=this.editors[d].value;switch(this.items[d].type){case"FORMAT_AMPM":if(c<0){c=0}else{if(c>1){c=1}}break;case"Character":break;case"Day":if(c<1){c=1}else{if(c>31){c=31}}break;case"FORMAT_hh":if(c<1){c=1}else{if(c>12){c=12}}break;case"FORMAT_HH":if(c<0){c=0}else{if(c>23){c=23}}break;case"Millisecond":if(c<0){c=0}else{if(c>99){c=99}}break;case"Minute":if(c<0){c=0}else{if(c>59){c=59}}break;case"Month":if(c<1){c=1}else{if(c>12){c=12}}break;case"ReadOnly":break;case"Second":if(c<0){c=0}else{if(c>59){c=59}}break;case"Year":if(c<this.minDate.year){c=this.minDate.year}else{if(c>this.maxDate.year){c=this.maxDate.year}}break}if(this.editors[d].value!=c){this.editors[d].value=c;b=true}}this.updateValue();if(this.value!=null){if(this.value.dateTime>this.maxDate.dateTime){this._internalSetValue(this.maxDate);this._updateEditorsValue()}else{if(this.value.dateTime<this.minDate.dateTime){this._internalSetValue(this.minDate);this._updateEditorsValue()}}}},spinUp:function(){var d=this.value;if(d==null){return}if(this.activeEditor!=null){var b=this.editors.indexOf(this.activeEditor);if(b==-1){return}if(this.items[b].type=="Day"){if(this.value!=null){this.activeEditor.maxValue=this.value._daysInMonth(this.value.year,this.value.month)}}var c=this.activeEditor.positions;this.activeEditor.increaseValue(this.enableAbsoluteSelection);this.activeEditor.positions=c}if(this.isEditing){this.isEditing=false}this.updateValue();this.isEditing=true;this._updateText();var e=this.editors.indexOf(this.activeEditor);if(e>=0){this._selectGroup(e)}},spinDown:function(){var d=this.value;if(d==null){return}if(this.activeEditor!=null){var b=this.editors.indexOf(this.activeEditor);if(b==-1){return}if(this.items[b].type=="Day"){if(this.value!=null){this.activeEditor.maxValue=this.value._daysInMonth(this.value.year,this.value.month)}}var c=this.activeEditor.positions;this.activeEditor.decreaseValue(this.enableAbsoluteSelection);this.activeEditor.positions=c}if(this.isEditing){this.isEditing=false}this.updateValue();this.isEditing=true;this._updateText();var e=this.editors.indexOf(this.activeEditor);if(e>=0){this._selectGroup(e)}},_passKeyToCalendar:function(c){if(c.keyCode==13||c.keyCode==9){this.hideCalendar("selected");return true}else{if(c.keyCode==27){var e=this.calendarContainer;var d=this._calendar;var f=this.closeCalendarAfterSelection;this.closeCalendarAfterSelection=false;d.setDate(this.value.dateTime);this.closeCalendarAfterSelection=f;this.hideCalendar()}}var f=this.closeCalendarAfterSelection;this.closeCalendarAfterSelection=false;var b=this._calendar._handleKey(c);this.closeCalendarAfterSelection=f;return b},handleCalendarKey:function(f,e){var c=a(f.target);var d=a.data(document.body,"openedJQXCalendar"+this.id);if(d!=null){if(d.length>0){var b=e._passKeyToCalendar(f);return b}}return true},_findPos:function(c){if(c==null){return}while(c&&(c.type=="hidden"||c.nodeType!=1||a.expr.filters.hidden(c))){c=c.nextSibling}var b=a(c).coord(true);return[b.left,b.top]},testOffset:function(h,f,c){var g=h.outerWidth();var k=h.outerHeight();var j=a(window).width()+a(window).scrollLeft();var e=a(window).height()+a(window).scrollTop();if(f.left+g>j){if(g>this.host.width()){var d=this.host.coord().left;var b=g-this.host.width();f.left=d-b+2}}if(f.left<0){f.left=parseInt(this.host.coord().left)+"px"}f.top-=Math.min(f.top,(f.top+k>e&&e>k)?Math.abs(k+c+23):0);return f},open:function(){this.showCalendar()},close:function(b){this.hideCalendar()},_getBodyOffset:function(){var c=0;var b=0;if(a("body").css("border-top-width")!="0px"){c=parseInt(a("body").css("border-top-width"));if(isNaN(c)){c=0}}if(a("body").css("border-left-width")!="0px"){b=parseInt(a("body").css("border-left-width"));if(isNaN(b)){b=0}}return{left:b,top:c}},showCalendar:function(){var m=this.calendarContainer;var q=this._calendar;a.jqx.aria(this,"aria-expanded",true);if(this.value!=null){if(this.selectionMode!="range"){this._oldDT=new Date(this.value.dateTime)}else{this._oldDT=this.getRange()}}else{this._oldDT=null}if(!q.canRender){q.canRender=true;q.render()}var l=this.container;var p=this;var e=a(window).scrollTop();var f=a(window).scrollLeft();var n=parseInt(this._findPos(this.inputElement[0])[1])+parseInt(this.inputElement.outerHeight())-1+"px";var d,r=parseInt(Math.round(this.host.coord(true).left));d=r+"px";var u=a.jqx.mobile.isSafariMobileBrowser()||a.jqx.mobile.isWindowsPhone();var h=a.jqx.utilities.hasTransform(this.host);if(h||(u!=null&&u)){d=a.jqx.mobile.getLeftPos(this.element);n=a.jqx.mobile.getTopPos(this.element)+parseInt(this.host.outerHeight());if(a("body").css("border-top-width")!="0px"){n=parseInt(n)-this._getBodyOffset().top+"px"}if(a("body").css("border-left-width")!="0px"){d=parseInt(d)-this._getBodyOffset().left+"px"}}this.container.css("left",d);this.container.css("top",n);var c=this.closeCalendarAfterSelection;this.closeCalendarAfterSelection=false;this.isEditing=false;if(p.selectionMode=="default"){this._validateValue();this._updateText();var s=this.value!=null?this.value.dateTime:new Date();q.setDate(s)}this.closeCalendarAfterSelection=c;var b=false;if(this.dropDownHorizontalAlignment=="right"||this.rtl){var k=this.container.outerWidth();var t=Math.abs(k-this.host.outerWidth()+2);if(!this.rtl){t-=2}if(k>this.host.width()){var g=this.rtl?23:2;this.container.css("left",g+parseInt(Math.round(r))-t+"px")}else{this.container.css("left",25+parseInt(Math.round(r))+t+"px")}}if(this.enableBrowserBoundsDetection){var j=this.testOffset(m,{left:parseInt(this.container.css("left")),top:parseInt(n)},parseInt(this.host.outerHeight()));if(parseInt(this.container.css("top"))!=j.top){b=true;m.css("top",23)}else{m.css("top",0)}this.container.css("top",j.top);if(parseInt(this.container.css("left"))!=j.left){this.container.css("left",j.left)}}this._raiseEvent(7,m);if(this.animationType!="none"){this.container.css("display","block");var o=parseInt(m.outerHeight());m.stop();this.isanimating=true;this.opening=true;if(this.animationType=="fade"){m.css("margin-top",0);m.css("opacity",0);m.animate({opacity:1},this.openDelay,function(){p.isanimating=false;p.opening=false;a.data(document.body,"openedJQXCalendar"+p.id,m);p.calendarContainer.focus()})}else{m.css("opacity",1);if(b){m.css("margin-top",o)}else{m.css("margin-top",-o)}m.animate({"margin-top":0},this.openDelay,function(){p.isanimating=false;p.opening=false;a.data(document.body,"openedJQXCalendar"+p.id,m);p.calendarContainer.focus()})}}else{m.stop();p.isanimating=false;p.opening=false;m.css("opacity",1);m.css("margin-top",0);this.container.css("display","block");a.data(document.body,"openedJQXCalendar"+p.id,m);this.calendarContainer.focus()}if(this.value==null){if(this._calendar&&this._calendar._getSelectedCell()){this._calendar._getSelectedCell().isSelected=false}}},hideCalendar:function(g){var f=this.calendarContainer;var c=this.container;var d=this;a.jqx.aria(this,"aria-expanded",false);a.data(document.body,"openedJQXCalendar"+this.id,null);if(this.animationType!="none"){var b=f.outerHeight();f.css("margin-top",0);this.isanimating=true;var e=-b;if(parseInt(this.container.coord().top)<parseInt(this.host.coord().top)){e=b}if(this.animationType=="fade"){f.animate({opacity:0},this.closeDelay,function(){c.css("display","none");d.isanimating=false})}else{f.animate({"margin-top":e},this.closeDelay,function(){c.css("display","none");d.isanimating=false})}}else{c.css("display","none")}if(g!=undefined){this._updateSelectedDate()}this._raiseEvent(8,f)},_updateSelectedDate:function(){var f=this.value;if(f==null){f=new a.jqx._jqxDateTimeInput.getDateTime(new Date());f._setHours(0);f._setMinutes(0);f._setSeconds(0);f._setMilliseconds(0)}var b=f.hour;var g=f.minute;var e=f.second;var c=f.millisecond;if(this.selectionMode=="range"&&this._calendar.getRange().from==null){this.setDate(null);return}var d=new a.jqx._jqxDateTimeInput.getDateTime(this._calendar.value.dateTime);d._setHours(b);d._setMinutes(g);d._setSeconds(e);d._setMilliseconds(c);this.setDate(d.dateTime)},_closeOpenedCalendar:function(b){var e=a(b.target);var k=a.data(document.body,"openedJQXCalendar"+b.data.me.id);var d=false;a.each(e.parents(),function(){if(this.className&&this.className.indexOf){if(this.className.indexOf("jqx-calendar")!=-1){d=true;return false}if(this.className.indexOf("jqx-input")!=-1){d=true;return false}}});if(a(b.target).ischildof(b.data.me.host)){return true}if(b.target!=null&&(b.target.tagName=="B"||b.target.tagName=="b")){var l=b.data.me.host.coord();var n=b.data.me.host.width();var c=b.data.me.host.height();var m=parseInt(l.top);var g=parseInt(l.left);if(m<=b.pageY&&b.pageY<=m+c){if(g<=b.pageX&&b.pageX<=g+n){return true}}}if(k!=null&&!d){if(k.length>0){var h=k[0].id.toString();var f=h.toString().substring(13);var j=a(document).find("#"+f);b.data.me.hideCalendar();a.data(document.body,"openedJQXCalendar"+b.data.me.id,null)}}},_loadItems:function(){if(this.value!=null){this.items=new Array();var d=this._getFormatValue(this.formatString);this.items=this._parseFormatValue(d);this.editors=new Array();for(var b=0;b<this.items.length;b++){var c=this.items[b].getDateTimeEditorByItemType(this.value,this);this.editors[b]=c}}this._updateEditorsValue();this._updateText()},_updateText:function(){var d="";if(this.items.length==0&&this.value!=null){this._loadItems()}if(this.value!=null){if(this.items.length>=1){d=this.format(this.value,0,this.items.length)}var b=this.dateTimeInput.val();if(b!=d){this._raiseEvent(1,this.value)}}if(this.selectionMode=="range"){var c=this.getRange();fromText=this.format(this.value,0,this.items.length);if(c.to){var f=a.jqx._jqxDateTimeInput.getDateTime(c.from);fromText=this.format(f,0,this.items.length);var e=a.jqx._jqxDateTimeInput.getDateTime(c.to);toText=this.format(e,0,this.items.length);var d=fromText+" - "+toText;if(d==" - "){d=""}}else{d="";this.calendarButtonContent.html("<div style='line-height: 16px; background: transparent; margin: 0; border: 0; padding: 0px; text-align: center; vertical-align: middle;'><b style='border: 0; padding: 0px; margin: 0px; background: transparent;'></b></div>")}}this.dateTimeInput.val(d)},format:function(g,h,f){var b="";for(var e=h;e<f;++e){var c=this.items[e].dateParser(g,this);if(this.isEditing&&this.items[e].type!="ReadOnly"){if(this.selectionMode!="range"){var d=this.items[e].type=="Day"&&this.items[e].format.length>2;if(this.items[e].type=="FORMAT_AMPM"){d=true;if(this.editors[e].value==0){c=this.editors[e].amString}else{c=this.editors[e].pmString}}if(!d){c=this.items[e].dateParserInEditMode(new Number(this.editors[e].value),"d"+this.editors[e].maxEditPositions,this);while(c.length<this.editors[e].maxEditPositions){c="0"+c}}}}b+=c}return b},_getFormatValueGroupLength:function(b){for(i=1;i<b.toString().length;++i){if(b.substring(i,i+1)!=b.substring(0,1)){return i}}return b.length},_parseFormatValue:function(h){var c=new Array();var f=h.toString();var e=0;while(f.length>0){var d=this._getFormatValueGroupLength(f);var g=null;switch(f.substring(0,1)){case":":case"/":d=1;g=a.jqx._jqxDateTimeInput.DateTimeFormatItem._create(f.substring(0,1),"ReadOnly",this.culture);break;case'"':case"'":var b=f.indexOf(f[0],1);g=a.jqx._jqxDateTimeInput.DateTimeFormatItem._create(f.substring(1,1+Math.max(1,b-1)),"ReadOnly",this.culture);d=Math.max(1,b+1);break;case"\\":if(f.length>=2){g=a.jqx._jqxDateTimeInput.DateTimeFormatItem._create(f.substring(1,1),"ReadOnly",this.culture);d=2}break;case"d":case"D":if(d>2){g=a.jqx._jqxDateTimeInput.DateTimeFormatItem._create(f.substring(0,d),"Day",this.culture)}else{g=a.jqx._jqxDateTimeInput.DateTimeFormatItem._create(f.substring(0,d),"Day",this.culture)}break;case"f":case"F":if(d>7){d=7}if(d>3){g=a.jqx._jqxDateTimeInput.DateTimeFormatItem._create(f.substring(0,d),"ReadOnly",this.culture)}else{g=a.jqx._jqxDateTimeInput.DateTimeFormatItem._create(f.substring(0,d),"Millisecond",this.culture)}break;case"g":g=a.jqx._jqxDateTimeInput.DateTimeFormatItem._create(f.substring(0,d),"ReadOnly",this.culture);break;case"h":g=a.jqx._jqxDateTimeInput.DateTimeFormatItem._create(f.substring(0,d),"FORMAT_hh",this.culture);break;case"H":g=a.jqx._jqxDateTimeInput.DateTimeFormatItem._create(f.substring(0,d),"FORMAT_HH",this.culture);break;case"m":g=a.jqx._jqxDateTimeInput.DateTimeFormatItem._create(f.substring(0,d),"Minute",this.culture);break;case"M":if(d>4){d=4}g=a.jqx._jqxDateTimeInput.DateTimeFormatItem._create(f.substring(0,d),"Month",this.culture);break;case"s":case"S":g=a.jqx._jqxDateTimeInput.DateTimeFormatItem._create(f.substring(0,d),"Second",this.culture);break;case"t":case"T":g=a.jqx._jqxDateTimeInput.DateTimeFormatItem._create(f.substring(0,d),"FORMAT_AMPM",this.culture);break;case"y":case"Y":if(d>1){g=a.jqx._jqxDateTimeInput.DateTimeFormatItem._create(f.substring(0,d),"Year",this.culture)}else{d=1;g=a.jqx._jqxDateTimeInput.DateTimeFormatItem._create(f.substring(0,1),dateTimeFormatInfo,"ReadOnly",this.culture)}break;case"z":g=a.jqx._jqxDateTimeInput.DateTimeFormatItem._create(f.substring(0,d),"ReadOnly",this.culture);break;default:d=1;g=a.jqx._jqxDateTimeInput.DateTimeFormatItem._create(f.substring(0,1),"ReadOnly",this.culture);break}c[e]=a.extend(true,{},g);f=f.substring(d);e++}return c},_getFormatValue:function(b){if(b==null||b.length==0){b="d"}if(b.length==1){switch(b.substring(0,1)){case"d":return this.localization.calendar.patterns.d;case"D":return this.localization.calendar.patterns.D;case"t":return this.localization.calendar.patterns.t;case"T":return this.localization.calendar.patterns.T;case"f":return this.localization.calendar.patterns.f;case"F":return this.localization.calendar.patterns.F;case"M":return this.localization.calendar.patterns.M;case"Y":return this.localization.calendar.patterns.Y;case"S":return this.localization.calendar.patterns.S}}if(b.length==2&&b.substring(0,1)=="%"){b=b.substring(1)}return b},_updateEditorsValue:function(){var j=this.value;if(j==null){return}var g=j.year;var h=j.day;var d=j.hour;var l=j.millisecond;var b=j.second;var c=j.minute;var f=j.month;if(this.items==null){return}for(var e=0;e<this.items.length;e++){switch(this.items[e].type){case"FORMAT_AMPM":var k=d%12;if(k==0){k=12}if(d>=0&&d<12){this.editors[e].value=0}else{this.editors[e].value=1}break;case"Day":this.editors[e].value=h;break;case"FORMAT_hh":var k=d%12;if(k==0){k=12}this.editors[e].value=k;break;case"FORMAT_HH":this.editors[e].value=d;break;case"Millisecond":this.editors[e].value=l;break;case"Minute":this.editors[e].value=c;break;case"Month":this.editors[e].value=f;break;case"Second":this.editors[e].value=b;break;case"Year":this.editors[e].value=g;break}}},updateValue:function(){if(this.isEditing){return}var j=0;var n=1;var u=1;var g=0;var b=0;var C=0;var p=0;var B=1;var e=0;var h=false;var m=false;var w=false;var o=new Array();var c=null;var s=0;for(var v=0;v<this.items.length;v++){switch(this.items[v].type){case"FORMAT_AMPM":e=this.editors[v].value;c=this.editors[v];break;case"Character":break;case"Day":if(this.items[v].format.length<4){u=this.editors[v].value;o[s++]=this.editors[v];if(u==0){u=1}w=true}break;case"FORMAT_hh":var y=this.editors[v];g=y.value;break;case"FORMAT_HH":g=this.editors[v].value;break;case"Millisecond":b=this.editors[v].value;break;case"Minute":p=this.editors[v].value;break;case"Month":B=this.editors[v].value;m=true;if(B==0){B=1}break;case"ReadOnly":break;case"Second":C=this.editors[v].value;break;case"Year":h=true;n=this.editors[v].value;var A=this.editors[v].getDateTimeItem().format;if(A.length<3){var r="1900";if(r.Length==4){var q=""+r[0]+r[1];var x;x=parseInt(q);n=n+(x*100)}}if(n==0){n=1}break}}var z=this.value!=null?new Date(this.value.dateTime):null;if(n>0&&B>0&&u>0&&p>=0&&g>=0&&C>=0&&b>=0){var D=this.value;if(D!=null){if(!h){n=D.year}if(!m){B=D.month}if(!w){u=D.day}}try{if(B>12){B=12}if(B<1){B=1}if(D._daysInMonth(n,B)<=u){u=D._daysInMonth(n,B);if(o!=null&&o.length>0){for(v=0;v<o.length;v++){o[v].value=u}}}if(c!=null){if(c.value==0){if(g>=12){g-=12}}else{if(g+12<24){g+=12}}}this.value._setYear(parseInt(n));this.value._setDay(u);this.value._setMonth(B);this.value._setHours(g);this.value._setMinutes(p);this.value._setSeconds(C);this.value._setMilliseconds(b)}catch(f){this.value=D}if(z!=null){var t=this.value.dateTime.getFullYear()==z.getFullYear()&&this.value.dateTime.getDate()==z.getDate()&&this.value.dateTime.getMonth()==z.getMonth()&&this.value.dateTime.getHours()==z.getHours()&&this.value.dateTime.getMinutes()==z.getMinutes()&&this.value.dateTime.getSeconds()==z.getSeconds();if(!t){this._raiseEvent("0",this.value.dateTime);if(this.cookies){if(this.value!=null){a.jqx.cookie.cookie("jqxDateTimeInput"+this.element.id,this.value.dateTime.toString(),this.cookieoptions)}}}this.calendarButtonContent.html("<div style='line-height: 16px; background: transparent; margin: 0; border: 0; padding: 0px; text-align: center; vertical-align: middle;'><b style='border: 0; padding: 0px; margin: 0px; background: transparent;'>"+this.value.day+"</b></div>")}else{this.calendarButtonContent.html("<div style='line-height: 16px; background: transparent; margin: 0; border: 0; padding: 0px; text-align: center; vertical-align: middle;'><b style='border: 0; padding: 0px; margin: 0px; background: transparent;'></b></div>")}}var d=this.editors.indexOf(this.activeEditor);var l=this.items[d]},_internalSetValue:function(b){this.value._setYear(parseInt(b.year));this.value._setDay(b.day);this.value._setMonth(b.month);this.value._setHours(b.hour);this.value._setMinutes(b.minute);this.value._setSeconds(b.second);this.value._setMilliseconds(b.milisecond)},_raiseEvent:function(c,n){var m=this.events[c];var f={};f.owner=this;if(n==null){n={}}var l=n.charCode?n.charCode:n.keyCode?n.keyCode:0;var o=true;var k=this.readonly;var b=new jQuery.Event(m);b.owner=this;b.args=f;b.args.date=this.getDate();this.element.value=this.dateTimeInput.val();if(c==9&&this.selectionMode!="range"){var d=b.args.date;if(this._oldDT){if(d!=null){if(!(d.getFullYear()!=this._oldDT.getFullYear()||d.getMonth()!=this._oldDT.getMonth()||d.getDate()!=this._oldDT.getDate()||d.getHours()!=this._oldDT.getHours()||d.getMinutes()!=this._oldDT.getMinutes()||d.getSeconds()!=this._oldDT.getSeconds())){return true}}a.jqx.aria(this,"aria-valuenow",this.getDate());a.jqx.aria(this,"aria-valuetext",this.getText());if(this.getDate()!=null){a.jqx.aria(this,"aria-label","Current focused date is "+this.getDate().toLocaleString())}else{a.jqx.aria(this,"aria-label","Current focused date is Null")}}}if(this.selectionMode=="range"){b.args.date=this.getRange();if(this._oldDT){var d=b.args.date.from;if(c==9){var j=false;var h=false;var e=this._oldDT.from;if(d!=null&&e){if(!(d.getFullYear()!=e.getFullYear()||d.getMonth()!=e.getMonth()||d.getDate()!=e.getDate()||d.getHours()!=e.getHours()||d.getMinutes()!=e.getMinutes()||d.getSeconds()!=e.getSeconds())){j=true}}var d=b.args.date.to;if(d!=null){e=this._oldDT.to;if(e){if(!(d.getFullYear()!=e.getFullYear()||d.getMonth()!=e.getMonth()||d.getDate()!=e.getDate()||d.getHours()!=e.getHours()||d.getMinutes()!=e.getMinutes()||d.getSeconds()!=e.getSeconds())){h=true}}}if(j&&h){return true}var j=b.args.date.from;if(j==null){j=""}else{j=j.toString()}var h=b.args.date.to;if(h==null){h=""}else{h=h.toString()}a.jqx.aria(this,"aria-valuenow",j+"-"+h);a.jqx.aria(this,"aria-valuetext",this.getText());if(j&&h){a.jqx.aria(this,"aria-label","Current focused range is "+j.toLocaleString()+"-"+h.toLocaleString())}}}}if(this.host.css("display")=="none"){return true}if(c!=2&&c!=3){o=this.host.trigger(b)}var g=this;if(!k){if(c==2&&!this.disabled){setTimeout(function(){g.isEditing=true;g._selectGroup(-1)},25)}}if(c==4){if(k||this.disabled){if(l==8||l==46){this.isEditing=false;if(this.allowKeyboardDelete){if(this.allowNullDate){this.setDate(null)}else{if(this.selectionMode!="range"){this.setDate(this.getMinDate())}else{this.setRange(this.getMinDate(),this.getMinDate())}}}}if(l==9){return true}return false}o=this._handleKeyDown(n,l)}else{if(c==5){if(l==9){return true}if(k||this.disabled){return false}}else{if(c==6){if(l==9){return true}if(k||this.disabled){return false}o=this._handleKeyPress(n,l)}}}return o},_doLeftKey:function(){if(this.activeEditor!=null){if(!this.isEditing){this.isEditing=true}var b=this.activeEditor;var d=false;var e=this.editors.indexOf(this.activeEditor);var c=e;if(this.enableAbsoluteSelection){if(e>=0&&this.activeEditor.positions>0){this.activeEditor.positions--;this._selectGroup(e);return}}while(e>0){this.activeEditor=this.editors[--e];this._selectGroup(e);if(this.items[e].type!="ReadOnly"){d=true;break}}if(!d){if(c>=0){this.activeEditor=this.editors[c]}}if(this.activeEditor!=null&&b!=this.activeEditor){if(this.items[e].type!="ReadOnly"){if(this.enableAbsoluteSelection){this.activeEditor.positions=this.activeEditor.maxEditPositions-1}else{this.activeEditor.positions=0}}}if(this.activeEditor!=b){this._validateValue();this._updateText();this._selectGroup(this.editors.indexOf(this.activeEditor));return true}else{return false}}},_doRightKey:function(){if(this.activeEditor!=null){if(!this.isEditing){this.isEditing=true}var b=this.activeEditor;var d=false;var e=this.editors.indexOf(this.activeEditor);var c=e;if(this.enableAbsoluteSelection){if(e>=0&&this.activeEditor.positions<this.activeEditor.maxEditPositions-1){this.activeEditor.positions++;this._selectGroup(e);return}}while(e<=this.editors.length-2){this.activeEditor=this.editors[++e];this._selectGroup(e);if(this.items[e].type!="ReadOnly"){if(this.items[e].type=="Day"&&this.items[e].format.length>2){break}d=true;break}}if(!d){if(c>=0){this.activeEditor=this.editors[c]}}if(this.activeEditor!=null&&this.activeEditor!=b){if(this.items[e].type!="ReadOnly"){this.activeEditor.positions=0}}if(this.activeEditor!=b){this._validateValue();this._updateText();this._selectGroup(this.editors.indexOf(this.activeEditor));return true}else{return false}}},_saveSelectedText:function(){var b=this._selection();var d="";var c=this.dateTimeInput.val();if(b.start>0||b.length>0){for(i=b.start;i<b.end;i++){d+=c[i]}}window.clipboardData.setData("Text",d);return d},_selectWithAdvancePattern:function(){var f=this.editors.indexOf(this.activeEditor);var g=false;if(this.items[f].type!="ReadOnly"){g=true}if(!g){return}var d=this.activeEditor;if(d!=null){var e=d.positions==d.maxEditPositions;if(e){this.editorText="";var c=d.value;var b=false;switch(this.items[f].type){case"FORMAT_AMPM":if(c<0){c=0}else{if(c>1){c=1}}break;case"Character":break;case"Day":if(c<1){c=1}else{if(c>31){c=31}}break;case"FORMAT_hh":if(c<1){c=1}else{if(c>12){c=12}}break;case"FORMAT_HH":if(c<0){c=0}else{if(c>23){c=23}}break;case"Millisecond":if(c<0){c=0}else{if(c>99){c=99}}break;case"Minute":if(c<0){c=0}else{if(c>59){c=59}}break;case"Month":if(c<1){c=1}else{if(c>12){c=12}}break;case"ReadOnly":break;case"Second":if(c<0){c=0}else{if(c>59){c=59}}break;case"Year":if(c<this.minDate.year){c=this.minDate.year}else{if(c>this.maxDate.year){c=this.maxDate.year}}break}if(d.value!=c){b=true}if(!b){this.isEditing=false;this._validateValue();this._updateText();this.isEditing=true;this._doRightKey();return true}return false}}},_handleKeyPress:function(j,n){var m=this._selection();var b=this;if((j.ctrlKey&&n==97)||(j.ctrlKey&&n==65)){return true}if(n==8){if(m.start>0){b._setSelectionStart(m.start)}return false}if(n==46){if(m.start<this.items.length){b._setSelectionStart(m.start)}return false}if(m.start>=0){var d=String.fromCharCode(n);var k=parseInt(d);if(!isNaN(k)){if(this.container.css("display")=="block"){this.hideCalendar()}this.updateValue();this._updateText();var g=false;var h=this.editors.indexOf(this.activeEditor);var c=null;this.isEditing=true;if(h.type!="ReadOnly"){c=this.activeEditor}if(c!=null&&c.positions==0){this.editorText=""}if(this.activeEditor==null){this.activeEditor=this.editors[0]}if(this.activeEditor==null){return false}this.activeEditor.insert(d);if(c!=null&&this.editorText.length>=c.maxEditPositions){this.editorText=""}this.editorText+=d;var o=this._selectWithAdvancePattern();if(this.activeEditor.positions==this.activeEditor.maxEditPositions){var f=this._getLastEditableEditorIndex();if(this.editors.indexOf(this.activeEditor)==f&&o&&this.enableAbsoluteSelection){this.activeEditor.positions=this.activeEditor.maxEditPositions-1}else{this.activeEditor.positions=0}}g=true;this.updateValue();this._updateText();this._selectGroup(this.editors.indexOf(this.activeEditor));return false}}var l=this._isSpecialKey(n);return l},_getLastEditableEditorIndex:function(){var b=0;var c=this;for(itemIndex=this.items.length-1;itemIndex>=0;itemIndex--){if(this.items[itemIndex].type!="ReadOnly"){return itemIndex}}return -1},_handleKeyDown:function(j,c){if(j.keyCode==115){if(this.isOpened()){this.hideCalendar();return false}else{if(!this.isOpened()){this.showCalendar();return false}}}if(j.altKey){if(j.keyCode==38){if(this.isOpened()){this.hideCalendar();return false}}else{if(j.keyCode==40){if(!this.isOpened()){this.showCalendar();return false}}}}if(this.isOpened()){if(j.keyCode==9){this.hideCalendar("selected");return true}return}var g=this._selection();if((j.ctrlKey&&c==99)||(j.ctrlKey&&c==67)){this._saveSelectedText(j);return false}if((j.ctrlKey&&c==122)||(j.ctrlKey&&c==90)){return false}if((j.ctrlKey&&c==118)||(j.ctrlKey&&c==86)||(j.shiftKey&&c==45)){return false}if(c==8||c==46){if(!j.altKey&&!j.ctrlKey&&c==46){this.isEditing=false;if(this.allowKeyboardDelete){if(this.allowNullDate){this.setDate(null)}else{if(this.selectionMode!="range"){this.setDate(this.getMinDate())}else{this.setRange(this.getMinDate(),this.getMinDate())}}}}else{if(this.activeEditor!=null){var k=this.editors.indexOf(this.activeEditor);if(this.activeEditor.positions>=0){var f=this._format(Number(this.activeEditor.value),"d"+this.activeEditor.maxEditPositions,this.culture);tmp=f;tmp=tmp.substring(0,this.activeEditor.positions)+"0"+tmp.substring(this.activeEditor.positions+1);if(parseInt(tmp)<this.activeEditor.minValue){tmp=this._format(Number(this.activeEditor.minValue),"d"+this.activeEditor.maxEditPositions,this.culture)}if(this.enableAbsoluteSelection){this.activeEditor.value=tmp}else{this.activeEditor.value=this.activeEditor.minValue}this._validateValue();this._updateText();if(c==8){var d=this;if(this.enableAbsoluteSelection&&this.activeEditor.positions>0){setTimeout(function(){d.activeEditor.positions=d.activeEditor.positions-1;d._selectGroup(k)},10)}else{setTimeout(function(){d._doLeftKey()},10)}}else{this._selectGroup(k)}}else{this._doLeftKey()}}}return false}if(c==38){this.spinUp();return false}else{if(c==40){this.spinDown();return false}}if(c==37){if(this._editor){var b=this._doLeftKey();if(!b){this.isEditing=false;this._validateValue()}return !b}else{this._doLeftKey();return false}}else{if(c==39||c==191){if(this._editor){var b=this._doRightKey();if(!b){this.isEditing=false;this._validateValue()}return !b}else{this._doRightKey();return false}}}var h=this._isSpecialKey(c);if(this.value==null&&(c>=48&&c<=57||c>=96&&c<=105)){this.setDate(new Date())}if(!a.jqx.browser.mozilla){return true}return h},_isSpecialKey:function(b){if(b!=8&&b!=9&&b!=13&&b!=35&&b!=36&&b!=37&&b!=39&&b!=27&&b!=46){return false}return true},_selection:function(){if("selectionStart" in this.dateTimeInput[0]){var f=this.dateTimeInput[0];var g=f.selectionEnd-f.selectionStart;return{start:f.selectionStart,end:f.selectionEnd,length:g,text:f.value}}else{var c=document.selection.createRange();if(c==null){return{start:0,end:f.value.length,length:0}}var b=this.dateTimeInput[0].createTextRange();var d=b.duplicate();b.moveToBookmark(c.getBookmark());d.setEndPoint("EndToStart",b);var g=c.text.length;return{start:d.text.length,end:d.text.length+c.text.length,length:g,text:c.text}}},_selectGroup:function(k){if(this.host.css("display")=="none"){return}if(this.readonly){return}var m=this._selection();var f="";var b="";var c=null;for(var d=0;d<this.items.length;d++){b=this.items[d].dateParser(this.value,this);if(this.isEditing&&this.items[d].type!="ReadOnly"){var j=this.items[d].type=="Day"&&this.items[d].format.length>2;if(!j&&this.items[d].type!="FORMAT_AMPM"){b=this.items[d].dateParserInEditMode(new Number(this.editors[d].value),"d"+this.editors[d].maxEditPositions,this);while(b.length<this.editors[d].maxEditPositions){b="0"+b}}}f+=b;if(this.items[d].type=="ReadOnly"){continue}if(this.items[d].type=="Day"&&this.items[d].format.length>2){continue}if(k!=undefined&&k!=-1){if(d>=k){var l=f.length-b.length;var e=b.length;if(this.enableAbsoluteSelection){if(!isNaN(parseInt(b))&&this.isEditing&&k!=-1){e=1;l+=this.editors[d].positions}}if(l==this.dateTimeInput.val().length){l--}this._setSelection(l,l+e);c=this.editors[d];this.activeEditor=c;break}}else{if(f.length>=m.start){c=this.editors[d];this.activeEditor=c;var l=f.length-b.length;var e=1;if(this.enableAbsoluteSelection){if(!isNaN(parseInt(b))&&this.isEditing&&k!=-1){e=1;l+=this.editors[d].positions}}else{e=b.length}this._setSelection(l,l+e);break}}}if(d<this.items.length&&k==-1){if(this.items[d].type!="ReadOnly"){this.activeEditor.positions=0}}var h=this._selection();if(h.length==0){if(h.start>0){var g=this._getLastEditableEditorIndex();if(g>=0){this._selectGroup(g)}}}},_getLastEditableEditorIndex:function(){var b=-1;for(i=0;i<this.editors.length;i++){if(this.items[i].type=="ReadOnly"){continue}if(this.items[i].type=="Day"&&this.items[i].format.length>2){continue}b=i}return b},_setSelection:function(e,b){try{if("selectionStart" in this.dateTimeInput[0]){this.dateTimeInput[0].setSelectionRange(e,b)}else{var c=this.dateTimeInput[0].createTextRange();c.collapse(true);c.moveEnd("character",b);c.moveStart("character",e);c.select()}}catch(d){}},_setSelectionStart:function(b){this._setSelection(b,b)},destroy:function(){this.host.removeClass("jqx-rc-all");this._calendar.destroy();this.container.remove();this._removeHandlers();this.dateTimeInput.remove();this.host.remove()},refreshValue:function(){this._refreshValue()},refresh:function(b){if(b!=true){this._setSize();this._arrange()}},_setOption:function(b,c){if(b==="value"){this.value=c;this._refreshValue();this._raiseEvent(9,{})}if(b=="maxDate"){this._calendar.maxDate=c;this._raiseEvent(9,{})}if(b=="minDate"){this._calendar.minDate=c;this._raiseEvent(9,{})}if(b=="showCalendarButton"){if(c){this.calendarButton.css("display","block")}else{this.calendarButton.css("display","none")}}if(b=="disabled"){this.dateTimeInput.attr("disabled",c)}if(b=="readonly"){this.readonly=c;this.dateTimeInput.css("readonly",c)}if(b=="textAlign"){this.dateTimeInput.css("text-align",c);this.textAlign=c}if(b=="width"){this.width=c;this.width=parseInt(this.width);this._arrange()}else{if(b=="height"){this.height=c;this.height=parseInt(this.height);this._arrange()}}},_refreshValue:function(){this._updateEditorsValue();this.updateValue();this._validateValue();this._updateText()}})})(jQuery);(function(a){a.jqx._jqxDateTimeInput.DateTimeFormatItem={};a.extend(a.jqx._jqxDateTimeInput.DateTimeFormatItem,{_create:function(d,c,b){this.format=d;this.type=c;this.culture=b;return this},_itemValue:function(){switch(this.format.length){case 1:return 9;case 2:return 99;case 3:default:return 999}},_maximumValue:function(){switch(this.format.length){case 1:return 9;case 2:return 99;case 3:default:return 999}},dateParser:function(b,c){if(b==null){return""}var d=c._format(b.dateTime,this.format.length==1?"%"+this.format:this.format,this.culture);return d},dateParserInEditMode:function(e,d,b){if(e==null){return""}var c=b._format(e.toString(),d.length==1?"%"+d:d,this.culture);return c},getDateTimeEditorByItemType:function(n,e){switch(this.type){case"FORMAT_AMPM":var f=a.jqx._jqxDateTimeInput.AmPmEditor._createAmPmEditor(this.format,n.hour/12,e.localization.calendar.AM[0],e.localization.calendar.PM[0],this,e);var d=a.extend({},f);return d;case"Character":return null;case"Day":var k=n.year;var s=n.month;var r;if(this.format.length==3){r=e.localization.calendar.days.namesAbbr}else{if(this.format.length>3){r=e.localization.calendar.days.names}else{r=null}}var t=n.day;if(r!=null){t=n.dayOfWeek+1}var g=a.jqx._jqxDateTimeInput.DateEditor._createDayEditor(n,n.day,1,n._daysInMonth(k,s),this.format.length==1?1:2,2,r,this,e);var d=a.extend({},g);return d;case"FORMAT_hh":var c=n.hour%12;if(c==0){c=12}var q=a.jqx._jqxDateTimeInput.NumberEditor._createNumberEditor(c,1,12,this.format.length==1?1:2,2,this,e);var d=a.extend({},q);return d;case"FORMAT_HH":var h=a.jqx._jqxDateTimeInput.NumberEditor._createNumberEditor(n.hour,0,23,this.format.length==1?1:2,2,this,e);var d=a.extend({},h);return d;case"Millisecond":var l=a.jqx._jqxDateTimeInput.NumberEditor._createNumberEditor(n.millisecond/this._itemValue(),0,this._maximumValue(),this.format.length,this.format.length,this,e);var d=a.extend({},l);return d;case"Minute":var o=a.jqx._jqxDateTimeInput.NumberEditor._createNumberEditor(n.minute,0,59,this.format.length==1?1:2,2,this,e);var d=a.extend({},o);return d;case"Month":var j;if(this.format.length==3){j=e.localization.calendar.months.namesAbbr}else{if(this.format.length>3){j=e.localization.calendar.months.names}else{j=null}}var m=a.jqx._jqxDateTimeInput.DateEditor._createMonthEditor(n.month,this.format.length==2?2:1,j,this,e);var d=a.extend({},m);return d;case"ReadOnly":return a.jqx._jqxDateTimeInput.DisabledEditor._create(this.format.length,n.day,this,e);case"Second":var b=a.jqx._jqxDateTimeInput.NumberEditor._createNumberEditor(n.second,0,59,this.format.length==1?1:2,2,this,e);var d=a.extend({},b);return d;case"Year":var p=a.jqx._jqxDateTimeInput.DateEditor._createYearEditor(n.year,this.format.length,this,e);var d=a.extend({},p);return d}return null}})})(jQuery);(function(a){a.jqx._jqxDateTimeInput.DateEditor=a.extend(a.jqx._jqxDateTimeInput.DateEditor,{formatValueLength:0,handleYears:false,handleDays:false,handleMonths:false,positions:0,value:0,minEditPositions:0,maxEditPositions:0,minValue:0,maxValue:0,item:null,dateTimeFormatInfo:null,days:null,dateTimeMonths:null,lastDayInput:null,minPositions:function(){if(this.handleYears){if(this.formatValueLength==4){if(this.positions<=1){return 1}else{if(this.positions>=4){return 4}}return this.positions}else{return this.minEditPositions}}return this.minEditPositions},initializeFields:function(e,f,b,d,c){this.minValue=e;this.maxValue=f;this.minEditPositions=b;this.maxEditPositions=d;this.updateActiveEditor(e);this.item=c},_createYearEditor:function(e,d,c,b){a.jqx._jqxDateTimeInput.DateEditor=a.extend(true,{},this);this.initializeFields(d<=4?0:0,d<4?99:9999,(d==2)?2:1,d>3?4:2,c);this.initializeYearEditor(e,d,c.culture);this.handleYears=true;this.that=b;return this},initializeYearEditor:function(d,c,e){this.formatValueLength=c;this.dateTimeFormatInfo=e;var b=d;b=Math.min(b,9999);b=Math.max(b,1);b=this.formatValueLength<4?b%100:b;this.updateActiveEditor(b);this.value=b},updateActiveEditor:function(b){this.value=b;this.positions=0},_createDayEditor:function(b,j,h,e,c,f,g,k,d){a.jqx._jqxDateTimeInput.DateEditor=a.extend(true,{},this);this.initializeFields(h,e,1,f,k);this.currentValue=b;this.value=j;this.days=g;this.handleDays=true;this.that=d;return this},getDayOfWeek:function(b){if(typeof this.currentValue==a.jqx._jqxDateTimeInput.DateTime){this.currentValue.dayOfWeek()}return b},defaultTextValue:function(){var d=this.value;var e=this.minEditPositions;var b=e;var c=this.that._format(this.value,"d"+b,"");return c},textValue:function(){if(this.handleDays){if(this.days==null){return this.defaultTextValue()}else{var b=(this.value%7)+1;b=this.getDayOfWeek(b);return this.days[b]}}else{if(this.handleMonths){if(this.dateTimeMonths==null||this.value<1||this.value>12){return this.defaultTextValue()}else{return this.dateTimeMonths[this.value-1]}}}return this.defaultTextValue()},defaultInsertString:function(c){if(c==null){return this.deleteValue()}if(c.length==0){return this.deleteValue()}var g=c.substring(0,1);if(isNaN(g)){return}var e=true;var d;var b=1;var f=this.that._format(Number(this.value),"d"+this.maxEditPositions,this.culture);d=f;if(this.positions>=this.maxEditPositions){this.positions=0}d=d.substring(0,this.positions)+g+d.substring(this.positions+1);d=this.setValueByString(d,b);return true},setValueByString:function(d,b){d=this.fixValueString(d);var c=new Number(d);this.value=c;this.positions+=b;return d},fixValueString:function(b){if(b.length>this.maxEditPositions){b=b.substring(b.length-this.maxEditPositions)}return b},initializeValueString:function(c){var b;b="";if(this.hasDigits()){b=c}return b},deleteValue:function(){if(this.value==this.minValue&&this.hasDigits()==false){return false}this.updateActiveEditor(this.minValue);return true},hasDigits:function(){return this.positions>0},insert:function(b){if(this.handleDays){if(this.days!=null){var c=false;c=this.insertLongString(b,c);if(c){return c}c=this.insertShortString(b,c);if(c){return c}}if(this.value==1&&this.lastDayInput!=null&&this.lastDayInput.toString().length>0&&this.lastDayInput.toString()=="0"){this.value=0}this.lastDayInput=b;return this.defaultInsertString(b)}else{if(this.handleMonths){if(this.dateTimeMonths!=null){var c=false;c=this.insertLongString2(b,c);if(c){return c}c=this.insertShortString2(b,c);if(c){return c}}}}return this.defaultInsertString(b)},insertShortString:function(d,e){if(d.length==1){for(i=0;i<6;++i){var c=(this.value+i)%7+1;var b=this.days[c-1];if(b.substring(0,1)==d){this.updateActiveEditor(c);e=true;return e}}}return e},insertLongString:function(c,d){if(c.length>0){for(i=0;i<6;++i){var b=(this.value+i)%7+1;if(this.days[b-1]==c){this.updateActiveEditor(b);d=true;return d}}}return d},_createMonthEditor:function(d,c,b,f,e){a.jqx._jqxDateTimeInput.DateEditor=a.extend(true,{},this);this.initializeFields(1,12,c,2,f);this.dateTimeMonths=b;this.value=d;if(this.dateTimeMonths!=null&&this.dateTimeMonths[12]!=null&&this.dateTimeMonths[12].length>0){this.dateTimeMonths=null}this.handleMonths=true;this.that=e;return this},insertLongString2:function(b,c){if(b.length>0){for(i=0;i<11;++i){month=(this.value+i)%12+1;if(this.dateTimeMonths[month-1]==b){this.updateActiveEditor(month);c=true;return c}}}return c},insertShortString2:function(c,d){if(c.length==1){for(i=0;i<11;++i){var e=(this.value+i)%12+1;var b=this.dateTimeMonths[e-1];if(b.substring(0,1)==c){this.updateActiveEditor(e);d=true;return d}}}return d},correctMaximumValue:function(b){if(b>this.maxValue){b=this.minValue}return b},correctMinimumValue:function(b){if(b<this.minValue){b=this.maxValue}return b},increaseValue:function(e){var c=this.that._format(Number(this.value),"d"+this.maxEditPositions,this.culture);var f=c.toString()[this.positions];f=parseInt(f)+1;if(f>9){f=0}if(!e){var b=this.value+1;b=this.correctMaximumValue(b);this.updateActiveEditor(b);return true}var d=c.substring(0,this.positions)+f+c.substring(this.positions+1);if(d!=this.value||this.hasDigits()){this.updateActiveEditor(d);return true}else{return false}},decreaseValue:function(e){var c=this.that._format(Number(this.value),"d"+this.maxEditPositions,this.culture);var f=c.toString()[this.positions];f=parseInt(f)-1;if(f<0){f=9}if(!e){var b=this.value-1;b=this.correctMinimumValue(b);this.updateActiveEditor(b);return true}var d=c.substring(0,this.positions)+f+c.substring(this.positions+1);if(d!=this.value||this.hasDigits()){this.updateActiveEditor(d);return true}else{return false}},getDateTimeItem:function(){return this.item}})})(jQuery);(function(a){a.jqx._jqxDateTimeInput.NumberEditor={};a.extend(a.jqx._jqxDateTimeInput.NumberEditor,{formatValueLength:0,positions:0,value:0,minEditPositions:0,maxEditPositions:0,minValue:0,maxValue:0,item:null,minPositions:function(){if(this.handleYears){if(this.formatValueLength==4){if(this.positions<=1){return 1}else{if(this.positions>=4){return 4}}return this.positions}else{return this.minEditPositions}}return this.minEditPositions},_createNumberEditor:function(g,f,h,b,e,d,c){a.jqx._jqxDateTimeInput.NumberEditor=a.extend(true,{},this);this.initializeFields(f,h,b,e,d);this.that=c;return this},initializeFields:function(e,f,b,d,c){this.minValue=e;this.maxValue=f;this.minEditPositions=b;this.maxEditPositions=d;this.updateActiveEditor(e);this.item=c},updateActiveEditor:function(b){this.value=b;this.positions=0},getDayOfWeek:function(b){if(typeof this.currentValue==a.jqx._jqxDateTimeInput.DateTime){this.currentValue.dayOfWeek()}return b},textValue:function(){var d=this.value;var e=this.minEditPositions;var b=e;var c=this.that._format(this.value,"d"+b,"");return c},insert:function(c){if(c==null){return this.deleteValue()}if(c.length==0){return this.deleteValue()}var g=c.substring(0,1);if(isNaN(g)){return}var e=true;var d;var b=1;var f=this.that._format(Number(this.value),"d"+this.maxEditPositions,this.culture);d=f;if(this.positions>=this.maxEditPositions){this.positions=0}d=d.substring(0,this.positions)+g+d.substring(this.positions+1);d=this.setValueByString(d,b);return true},setValueByString:function(d,b){d=this.fixValueString(d);var c=new Number(d);this.value=c;this.positions+=b;return d},fixValueString:function(b){if(b.length>this.maxEditPositions){b=b.substring(b.length-this.maxEditPositions)}return b},initializeValueString:function(c){var b;b="";if(this.hasDigits()){b=c}return b},deleteValue:function(){if(this.value==this.minValue&&this.hasDigits()==false){return false}this.updateActiveEditor(this.minValue);return true},hasDigits:function(){return this.positions>0},correctMaximumValue:function(b){if(b>this.maxValue){b=this.minValue}return b},correctMinimumValue:function(b){if(b<this.minValue){b=this.maxValue}return b},increaseValue:function(e){var c=this.that._format(Number(this.value),"d"+this.maxEditPositions,this.culture);var f=c.toString()[this.positions];f=parseInt(f)+1;if(f>9){f=0}if(!e){var b=this.value+1;b=this.correctMaximumValue(b);this.updateActiveEditor(b);return true}var d=c.substring(0,this.positions)+f+c.substring(this.positions+1);if(d!=this.value||this.hasDigits()){this.updateActiveEditor(d);return true}else{return false}},decreaseValue:function(e){var c=this.that._format(Number(this.value),"d"+this.maxEditPositions,this.culture);var f=c.toString()[this.positions];f=parseInt(f)-1;if(f<0){f=9}if(!e){var b=this.value-1;b=this.correctMinimumValue(b);this.updateActiveEditor(b);return true}var d=c.substring(0,this.positions)+f+c.substring(this.positions+1);if(d!=this.value||this.hasDigits()){this.updateActiveEditor(d);return true}else{return false}},getDateTimeItem:function(){return this.item}})})(jQuery);(function(a){a.jqx._jqxDateTimeInput.DisabledEditor={};a.extend(a.jqx._jqxDateTimeInput.DisabledEditor,{_create:function(g,c,f,b,e,d){this.format=g;this.value=-1;this.item=e;this.that=d;return this},textValue:function(){return""},insert:function(b){return false},deleteValue:function(){return false},increaseValue:function(){return false},decreaseValue:function(){return false},getDateTimeItem:function(){return this.item}})})(jQuery);(function(a){a.jqx._jqxDateTimeInput.AmPmEditor={};a.extend(a.jqx._jqxDateTimeInput.AmPmEditor,{_createAmPmEditor:function(g,c,f,b,e,d){this.format=g;this.value=c;this.amString=f;this.pmString=b;this.item=e;this.that=d;if(f==b){this.amString="<"+f;this.pmString=">"+b}return this},textValue:function(){var b=this.amString;if(this.value!=0){b=this.pmString}if(this.format.length==1&&b.length>1){b=b.substring(0,1)}return b},insert:function(f){var d=f.toString();if(d.Length==0){return this.deleteValue()}var c=false;if(this.amString.Length>0&&this.pmString.Length>0){var g=amString[0];var b=d[0];var e=pmString[0];if(g.toString()==b.toString()){this.value=0;c=true}else{if(e.toString()==b.toString()){this.value=1;c=true}}}else{if(this.pmString.Length>0){this.value=1;c=true}else{if(this.amString.Length>0){this.value=0;c=true}}}return c},deleteValue:function(){var b=true;if(this.amString.Length==0&&this.pmString.Length!=0){if(this.value==0){return false}this.value=0}else{if(this.value==1){return false}this.value=1}return b},increaseValue:function(){this.value=1-this.value;return true},decreaseValue:function(){this.increaseValue();return true},getDateTimeItem:function(){return this.item}})})(jQuery);(function(a){a.jqx._jqxDateTimeInput.getDateTime=function(c){var b={dateTime:new Date(c),daysPer4Years:1461,daysPerYear:365,daysToMonth365:{0:0,1:31,2:59,3:90,4:120,5:151,6:181,7:212,8:243,9:273,10:304,11:334,12:365},daysToMonth366:{0:0,1:31,2:60,3:91,4:121,5:152,6:182,7:213,8:244,9:274,10:305,11:335,12:366},maxValue:3155378976000000000,millisPerDay:86400000,millisPerHour:3600000,millisPerMinute:60000,millisPerSecond:1000,minTicks:0,minValue:0,ticksPerDay:864000000000,ticksPerHour:36000000000,ticksPerMillisecond:10000,ticksPerMinute:600000000,ticksPerSecond:10000000,hour:c.getHours(),minute:c.getMinutes(),day:c.getDate(),second:c.getSeconds(),month:1+c.getMonth(),year:c.getFullYear(),millisecond:c.getMilliseconds(),dayOfWeek:c.getDay(),isWeekend:function(d){if(d==undefined||d==null){d=this.dateTime}var e=d.getDay()%6==0;return e},dayOfYear:function(e){if(e==undefined||e==null){e=this.dateTime}var d=new Date(e.getFullYear(),0,1);return Math.ceil((e-d)/86400000)},_setDay:function(d){if(d==undefined||d==null){d=0}this.dateTime.setDate(d);this.day=this.dateTime.getDate()},_setMonth:function(d){if(d==undefined||d==null){d=0}this.dateTime.setMonth(d-1);this.month=1+this.dateTime.getMonth()},_setYear:function(d){if(d==undefined||d==null){d=0}this.dateTime.setFullYear(d);this.year=this.dateTime.getFullYear()},_setHours:function(d){if(d==undefined||d==null){d=0}this.dateTime.setHours(d);this.hour=this.dateTime.getHours()},_setMinutes:function(d){if(d==undefined||d==null){d=0}this.dateTime.setMinutes(d);this.minute=this.dateTime.getMinutes()},_setSeconds:function(d){if(d==undefined||d==null){d=0}this.dateTime.setSeconds(d);this.second=this.dateTime.getSeconds()},_setMilliseconds:function(d){if(d==undefined||d==null){d=0}this.dateTime.setMilliseconds(d);this.millisecond=this.dateTime.getMilliseconds()},_addDays:function(e){var d=this.dateTime;d.setDate(d.getDate()+e);return d},_addWeeks:function(e){var d=this.dateTime;d.setDate(d.getDate()+7*e);return d},_addMonths:function(e){var d=this.dateTime;d.setMonth(d.getMonth()+e);return d},_addYears:function(e){var d=this.dateTime;d.setFullYear(d.getFullYear()+e);return d},_addHours:function(e){var d=this.dateTime;d.setHours(d.getHours()+e);return d},_addMinutes:function(e){var d=this.dateTime;d.setMinutes(d.getMinutes()+e);return d},_addSeconds:function(e){var d=this.dateTime;d.setSeconds(d.getSeconds()+e);return d},_addMilliseconds:function(e){var d=this.dateTime;d.setMilliseconds(d.getMilliseconds()+e);return d},_isLeapYear:function(d){if((d<1)||(d>9999)){throw"invalid year"}if((d%4)!=0){return false}if((d%100)==0){return((d%400)==0)}return true},_dateToTicks:function(f,h,e){if(((f>=1)&&(f<=9999))&&((h>=1)&&(h<=12))){var d=this._isLeapYear(f)?this.daysToMonth366:this.daysToMonth365;if((e>=1)&&(e<=(d[h]-d[h-1]))){var f=f-1;var g=((((((f*365)+(f/4))-(f/100))+(f/400))+d[h-1])+e)-1;return(g*864000000000)}}},_daysInMonth:function(e,f){if((f<1)||(f>12)){throw ("Invalid month.")}var d=this._isLeapYear(e)?this.daysToMonth366:this.daysToMonth365;return(d[f]-d[f-1])},_timeToTicks:function(d,g,e){var f=((d*3600)+(g*60))+e;return(f*10000000)},_equalDate:function(d){if(this.year==d.getFullYear()&&this.day==d.getDate()&&this.month==d.getMonth()+1){return true}return false}};return b}})(jQuery);

/*
jQWidgets v3.0.3 (2013-Oct-01)
Copyright (c) 2011-2013 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function(a){a.jqx.jqxWidget("jqxCalendar","",{});a.extend(a.jqx._jqxCalendar.prototype,{defineInstance:function(){this.disabled=false;this.multipleMonthRows=1;this.multipleMonthColumns=1;if(this.minDate==undefined){this.minDate=a.jqx._jqxDateTimeInput.getDateTime(new Date());this.minDate._setYear(1900);this.minDate._setMonth(1);this.minDate._setDay(1);this.minDate._setHours(0);this.minDate._setMinutes(0);this.minDate._setSeconds(0);this.minDate._setMilliseconds(0)}if(this.maxDate==undefined){this.maxDate=a.jqx._jqxDateTimeInput.getDateTime(new Date());this.maxDate._setYear(2100);this.maxDate._setMonth(1);this.maxDate._setDay(1);this.maxDate._setHours(0);this.maxDate._setMinutes(0);this.maxDate._setSeconds(0);this.maxDate._setMilliseconds(0)}this.min=new Date(1900,0,1);this.max=new Date(2100,0,1);this.navigationDelay=400;if(this.stepMonths===undefined){this.stepMonths=1}this.width=null;this.height=null;if(this.value===undefined){this.value=a.jqx._jqxDateTimeInput.getDateTime(new Date());this.value._setHours(0);this.value._setMinutes(0);this.value._setSeconds(0);this.value._setMilliseconds(0)}this.firstDayOfWeek=0;this.showWeekNumbers=false;this.showDayNames=true;this.enableWeekend=false;this.enableOtherMonthDays=true;this.showOtherMonthDays=true;this.rowHeaderWidth=25;this.columnHeaderHeight=20;this.titleHeight=25;this.dayNameFormat="firstTwoLetters";this.monthNameFormat="default";this.titleFormat=["MMMM yyyy","yyyy","yyyy","yyyy"];this.enableViews=true;if(this.readOnly===undefined){this.readOnly=false}if(this.culture==undefined){this.culture="default"}if(this.enableFastNavigation==undefined){this.enableFastNavigation=true}if(this.enableHover==undefined){this.enableHover=true}if(this.enableAutoNavigation==undefined){this.enableAutoNavigation=true}if(this.enableTooltips===undefined){this.enableTooltips=false}this.backText="Back";this.forwardText="Forward";if(this.specialDates===undefined){this.specialDates=new Array()}this.keyboardNavigation=true;this.selectionMode="default";this.todayString="Today";this.clearString="Clear";this.showFooter=false;this.selection={from:null,to:null};this.canRender=true;this._checkForHiddenParent=true;this.height=null;this.rtl=false;this.view="month";this.localization={backString:"Back",forwardString:"Forward",todayString:"Today",clearString:"Clear",calendar:{name:"Gregorian_USEnglish","/":"/",":":":",firstDay:0,days:{names:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],namesAbbr:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],namesShort:["Su","Mo","Tu","We","Th","Fr","Sa"]},months:{names:["January","February","March","April","May","June","July","August","September","October","November","December",""],namesAbbr:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""]},AM:["AM","am","AM"],PM:["PM","pm","PM"],eras:[{name:"A.D.",start:null,offset:0}],twoDigitYearMax:2029,patterns:{d:"M/d/yyyy",D:"dddd, MMMM dd, yyyy",t:"h:mm tt",T:"h:mm:ss tt",f:"dddd, MMMM dd, yyyy h:mm tt",F:"dddd, MMMM dd, yyyy h:mm:ss tt",M:"MMMM dd",Y:"yyyy MMMM",S:"yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss",ISO:"yyyy-MM-dd hh:mm:ss"}}};this.events=["backButtonClick","nextButtonClick","valuechanged","cellMouseDown","cellMouseUp","cellSelected","cellUnselected","change","viewChange"]},createInstance:function(e){this.setCalendarSize();if(this.element.id===""){this.element.id=a.jqx.utilities.createId()}this.host.attr("data-role","calendar");var i=this.element.id;var h=this;this.propertyChangeMap.width=function(j,l,k,m){h.setCalendarSize()};this.propertyChangeMap.height=function(j,l,k,m){h.setCalendarSize()};if(a.global){a.global.preferCulture(this.culture)}if(this.culture!="default"){if(a.global){a.global.preferCulture(this.culture);this.localization.calendar=a.global.culture.calendar}else{if(Globalize){var c=Globalize.culture(this.culture);this.localization.calendar=c.calendar}}this.firstDayOfWeek=this.localization.calendar.firstDay}if(this.localization.backString!="Back"){this.backText=this.localization.backString}if(this.localization.forwardString!="Forward"){this.forwardText=this.localization.forwardString}if(this.localization.todayString!="Today"){this.todayString=this.localization.todayString}if(this.localization.clearString!="Clear"){this.clearString=this.localization.clearString}this.setMaxDate(this.max,false);this.setMinDate(this.min,false);if(!this.host.attr("tabIndex")){this.host.attr("tabIndex",0)}this.host.css("outline","none");this.host.addClass(this.toThemeProperty("jqx-calendar"));this.host.addClass(this.toThemeProperty("jqx-widget"));this.host.addClass(this.toThemeProperty("jqx-widget-content"));this.host.addClass(this.toThemeProperty("jqx-rc-all"));this._addInput();this.addHandler(this.host,"keydown",function(k){var j=true;if(h.keyboardNavigation){if(h._handleKey!=undefined){j=h._handleKey(k);if(!j){if(k.stopPropagation){k.stopPropagation()}if(k.preventDefault){k.preventDefault()}}}}return j});var d=false;var g=this;var b=false;if(h.width!=null&&h.width.toString().indexOf("%")!=-1){b=true}if(h.height!=null&&h.height.toString().indexOf("%")!=-1){b=true}a.jqx.utilities.resize(this.host,function(){var j=g.host.find("#View"+h.element.id);if(!d){d=true;g.render()}else{g.refreshTitle(j)}if(b){if(h.refreshTimer){clearTimeout(h.refreshTimer)}h.refreshTimer=setTimeout(function(){h.refreshControl()},1)}});var f="View";this.propertyChangeMap.disabled=function(j,l,k,m){if(m){j.host.addClass(h.toThemeProperty("jqx-fill-state-disabled"))}else{j.host.removeClass(h.toThemeProperty("jqx-fill-state-disabled"))}h.refreshControl()}},_addInput:function(){var b=this.host.attr("name");if(!b){b=this.element.id}this.input=a("<input type='hidden'/>");this.host.append(this.input);this.input.attr("name",b);this.input.val(this.getDate().toString())},setCalendarSize:function(){if(this.width!=null&&this.width.toString().indexOf("px")!=-1){this.host.width(this.width)}else{if(this.width!=undefined&&!isNaN(this.width)){this.host.width(this.width)}}if(this.width!=null&&this.width.toString().indexOf("%")!=-1){this.host.css("width",this.width)}if(this.height!=null&&this.height.toString().indexOf("px")!=-1){this.host.height(this.height)}else{if(this.height!=undefined&&!isNaN(this.height)){this.host.height(this.height)}}if(this.height!=null&&this.height.toString().indexOf("%")!=-1){this.host.css("height",this.height)}},_getYearAndMonthPart:function(c){var b=new Date(c.getFullYear(),c.getMonth(),1);return b},_handleKey:function(p){if(this.readOnly){return true}var z=p.keyCode;var x=this;var b=this._getSelectedDate();if(b==undefined){return true}if(p.altKey){return true}if(this._animating){return false}if(this.view!="month"&&z==13){var d=this._getSelectedCell();this._setDateAndSwitchViews(d)}if(this.view=="year"){var v=b.getMonth();var j=this._getYearAndMonthPart(this.getMinDate());var m=this._getYearAndMonthPart(this.getMaxDate());switch(z){case 37:if(v==0){var h=new Date(b.getFullYear()-1,11,1);if(h>=j){this.selectedDate=h;this.navigateBackward()}else{if(this.selectedDate!=j){this.selectedDate=j;this.navigateBackward()}}}else{var h=new Date(b.getFullYear(),v-1,1);if(h>=j){this._selectDate(h,"key")}}return false;case 38:var h=new Date(b.getFullYear(),v-4,1);if(h<j){h=j}if(v-4<0){this.selectedDate=h;this.navigateBackward()}else{this._selectDate(h,"key")}return false;case 40:var h=new Date(b.getFullYear(),v+4,1);if(h>m){h=m}if(v+4>11){this.selectedDate=h;this.navigateForward()}else{this._selectDate(h,"key")}return false;case 39:if(v==11){var h=new Date(b.getFullYear()+1,0,1);if(h<=m){this.selectedDate=h;this.navigateForward()}else{if(this.selectedDate!=m){this.selectedDate=m;this.navigateForward()}}}else{var h=new Date(b.getFullYear(),v+1,1);if(h<=m){this._selectDate(h,"key")}}return false}return true}if(this.view=="decade"){var o=this._renderStartDate.getFullYear();var k=this._renderEndDate.getFullYear();var n=b.getFullYear();var u=this.getMinDate().getFullYear();var c=this.getMaxDate().getFullYear();switch(z){case 37:if(n-1>=u){if(n<=o){this.selectedDate=new Date(n-1,b.getMonth(),1);this.navigateBackward()}else{this._selectDate(new Date(n-1,b.getMonth(),1),"key")}}return false;case 38:var w=n-4;if(n-4<u){w=u}if(w<o){this.selectedDate=new Date(w,b.getMonth(),1);this.navigateBackward()}else{this._selectDate(new Date(w,b.getMonth(),1),"key")}return false;case 40:var w=n+4;if(w>c){w=c}if(w>k){this.selectedDate=new Date(w,b.getMonth(),1);this.navigateForward()}else{this._selectDate(new Date(w,b.getMonth(),1),"key")}return false;case 39:if(n+1<=c){if(n==k){this.selectedDate=new Date(n+1,b.getMonth(),1);this.navigateForward()}else{this._selectDate(new Date(n+1,b.getMonth(),1),"key")}}return false}return true}var t=new a.jqx._jqxDateTimeInput.getDateTime(b);var f=this.getViewStart();var e=this.getViewEnd();var s=a.data(this.element,"View"+this.element.id);if(s==undefined||s==null){return true}if(z==36){t._setDay(1);this._selectDate(t.dateTime,"key");return false}if(z==35){var r=this.value._daysInMonth(this.value.year,this.value.month);t._setDay(r);this._selectDate(t.dateTime,"key");return false}var g=1;if(p.ctrlKey){g=12}if(z==34){var y=this.navigateForward(g);if(y){t._addMonths(g);this._selectDate(t.dateTime,"key")}return false}if(z==33){var y=this.navigateBackward(g);if(y){t._addMonths(-g);this._selectDate(t.dateTime,"key")}return false}if(z==38){t._addDays(-7);if(t.dateTime<this.getMinDate()){return false}if(t.dateTime<f){var y=this.navigateBackward();if(!y){return false}}this._selectDate(t.dateTime,"key");for(var q=0;q<s.cells.length;q++){var d=s.cells[q];var l=d.getDate();if(d.isOtherMonth&&d.isSelected&&l<=t.dateTime){this.value.day=l.getDate();this.navigateBackward();this._selectDate(t.dateTime,"key");break}}return false}else{if(z==40){t._addDays(7);if(t.dateTime>this.getMaxDate()){return false}if(t.dateTime>e){var y=this.navigateForward();if(!y){return false}}this._selectDate(t.dateTime,"key");for(var q=0;q<s.cells.length;q++){var d=s.cells[q];var l=d.getDate();if(d.isOtherMonth&&d.isSelected&&l>=t.dateTime){this.value.day=l.getDate();this.navigateForward();this._selectDate(t.dateTime,"key");break}}return false}}if(z==37){t._addDays(-1);if(t.dateTime<this.getMinDate()){return false}if(t.dateTime<f){var y=this.navigateBackward();if(!y){return false}}this._selectDate(t.dateTime,"key");for(var q=0;q<s.cells.length;q++){var d=s.cells[q];var l=d.getDate();if(d.isOtherMonth&&d.isSelected&&l<=t.dateTime){if(t.dateTime<this.getMinDate()||t.dateTime>this.getMaxDate()){return false}this.navigateBackward();this._selectDate(t.dateTime,"key");break}}return false}else{if(z==39){t._addDays(1);if(t.dateTime>this.getMaxDate()){return false}if(t.dateTime>e){var y=this.navigateForward();if(!y){return false}}this._selectDate(t.dateTime,"key");for(var q=0;q<s.cells.length;q++){var d=s.cells[q];var l=d.getDate();if(d.isOtherMonth&&d.isSelected&&l>=t.dateTime){if(t.dateTime<this.getMinDate()||t.dateTime>this.getMaxDate()){return false}this.navigateForward();this._selectDate(t.dateTime,"key");break}}return false}}return true},render:function(){if(!this.canRender){return}this.host.children().remove();var c=this._renderSingleCalendar("View"+this.element.id);var b=this;if(this._checkForHiddenParent){if(!this._hiddenParentTimer){if(a.jqx.isHidden(this.host)){this._hiddenParentTimer=setInterval(function(){if(!a.jqx.isHidden(b.host)){try{clearInterval(b._hiddenParentTimer);b.updateSize();b._hiddenParentTimer=0}catch(d){}}},10)}}}this.host.append(c)},addSpecialDate:function(b,c,d){if(this.multipleMonthRows==1&&this.multipleMonthColumns==1){var e=this.specialDates.length;this.specialDates[e]={Date:b,Class:c,Tooltip:d};this.refreshControl()}},refresh:function(b){this.render()},invalidate:function(){this.refreshControl()},refreshControl:function(){if(this.multipleMonthRows==1&&this.multipleMonthColumns==1){this.refreshSingleCalendar("View"+this.element.id,null)}},getViewStart:function(){var c=this.getVisibleDate();var b=this.getFirstDayOfWeek(c);return b.dateTime},getViewEnd:function(){var c=this.getViewStart();var b=new a.jqx._jqxDateTimeInput.getDateTime(c);b._addDays(41);return b.dateTime},refreshSingleCalendar:function(f,e){if(!this.canRender){return}var h=this.host.find("#"+f);var d=this.getVisibleDate();var b=this.getFirstDayOfWeek(d);this.refreshCalendarCells(h,b,f);this.refreshTitle(h);this.refreshRowHeader(h,f);if(this.selectedDate!=undefined){this._selectDate(this.selectedDate)}var g=this.host.height()-this.titleHeight-this.columnHeaderHeight;if(!this.showDayNames){g=this.host.height()-this.titleHeight}if(this.showFooter){g-=20}var c=h.find("#cellsTable"+f);var i=h.find("#calendarRowHeader"+f);c.height(g);i.height(g)},refreshRowHeader:function(l,g){if(!this.showWeekNumbers){return}var h=this.getVisibleDate();var c=this.getFirstDayOfWeek(h);var f=c.dayOfWeek;var r=this.getWeekOfYear(c);var m=this.rowHeader.find("table");m.width(this.rowHeaderWidth);var d=c;var q=new Array();for(var j=0;j<6;j++){var e=r.toString();var p=new a.jqx._jqxCalendar.cell(d.dateTime);var k=j+1+this.element.id;var o=a(m[0].rows[j].cells[0]);p.element=o;p.row=j;p.column=0;var b=o.find("#headerCellContent"+k);b.addClass(this.toThemeProperty("jqx-calendar-row-cell"));b[0].innerHTML=r;q[j]=p;d=new a.jqx._jqxDateTimeInput.getDateTime(new Date(d._addWeeks(1)));r=this.getWeekOfYear(d)}var n=a.data(this.element,l[0].id);n.rowCells=q;this._refreshOtherMonthRows(n,g)},_refreshOtherMonthRows:function(f,e){if(this.showOtherMonthDays){return}this._displayLastRow(true,e);this._displayFirstRow(true,e);var d=false;var g=false;for(var c=0;c<f.cells.length;c++){var b=f.cells[c];if(b.isVisible&&c<7){d=true}else{if(b.isVisible&&c>=f.cells.length-7){g=true}}}if(!d){this._displayFirstRow(false,e)}if(!g){this._displayLastRow(false,e)}},_displayLastRow:function(b,c){var g=this.host.find("#"+c);var f=g.find("#calendarRowHeader"+g[0].id).find("table");var d=null;if(this.showWeekNumbers){if(f[0].cells){var d=a(f[0].rows[5])}}var e=a(g.find("#cellTable"+g[0].id)[0].rows[5]);if(b){if(this.showWeekNumbers&&d){d.css("display","table-row")}e.css("display","table-row")}else{if(this.showWeekNumbers&&d){d.css("display","none")}e.css("display","none")}},_displayFirstRow:function(b,c){var e=this.host.find("#"+c);var d=e.find("#calendarRowHeader"+e[0].id).find("table");var f=null;if(this.showWeekNumbers){if(d[0].cells){var f=a(d[0].rows[0])}}var g=a(e.find("#cellTable"+e[0].id)[0].rows[0]);if(b){if(this.showWeekNumbers&&f){f.css("display","table-row")}g.css("display","table-row")}else{if(this.showWeekNumbers&&f){f.css("display","none")}g.css("display","none")}},_renderSingleCalendar:function(o,j){if(!this.canRender){return}var l=this.host.find("#"+o.toString());if(l!=null){l.remove()}var r=a("<div id='"+o.toString()+"'></div>");var b=this.getVisibleDate();var k=this.getFirstDayOfWeek(b);var e=new a.jqx._jqxDateTimeInput.getDateTime(k.dateTime);e._addMonths(1);var q=a.jqx._jqxCalendar.monthView(k,e,null,null,null,r);if(j==undefined||j==null){this.host.append(r);if(this.height!=undefined&&!isNaN(this.height)){r.height(this.height)}else{if(this.height!=null&&this.height.toString().indexOf("px")!=-1){r.height(this.height)}}if(this.width!=undefined&&!isNaN(this.width)){r.width(this.width)}else{if(this.width!=null&&this.width.toString().indexOf("px")!=-1){r.width(this.width)}}if(this.width!=null&&this.width.toString().indexOf("%")!=-1){r.width("100%")}if(this.height!=null&&this.height.toString().indexOf("%")!=-1){r.height("100%")}}else{j.append(r)}a.data(this.element,o,q);var p=this.host.height()-this.titleHeight-this.columnHeaderHeight;if(!this.showDayNames){p=this.host.height()-this.titleHeight}if(this.showFooter){p-=20}if(this.rowHeaderWidth<0){this.rowHeaderWidth=0}if(this.columnHeaderHeight<0){this.columnHeaderHeight=0}if(this.titleHeight<0){this.titleHeight=0}var f=this.rowHeaderWidth;var i=this.columnHeaderHeight;if(!this.showWeekNumbers){f=0}if(!this.showDayNames){i=0}var t=a("<div style='height:"+this.titleHeight+"px;'><table role='grid' style='margin: 0px; width: 100%; height: 100%; border-spacing: 0px;' cellspacing='0' cellpadding='0'><tr role='row' id='calendarTitle' width='100%'><td role='gridcell' NOWRAP id='leftNavigationArrow'></td><td aria-live='assertive' aria-atomic='true' role='gridcell' align='center' NOWRAP id='calendarTitleHeader'></td><td role='gridcell' NOWRAP id='rightNavigationArrow'></td></tr></table></div>");t.addClass(this.toThemeProperty("jqx-calendar-title-container"));r.append(t);var c=a("<table role='grid' style='margin: 0px; border-spacing: 0px;' cellspacing='0' cellpadding='0'><tr role='row' id='calendarHeader' height='"+i+"'><td role='gridcell' id='selectCell' width='"+f+"'></td><td role='gridcell' colspan='2' style='padding-left: 2px; padding-right: 2px' id='calendarColumnHeader'></td></tr><tr role='row' id='calendarContent'><td role='gridcell' id='calendarRowHeader' valign='top' height='"+p+"' width='"+f+"'></td><td role='gridcell' valign='top' colspan='2' style='padding-left: 2px; padding-right: 2px' id='cellsTable' height='"+p+"'></td></tr></table>");var d=20;var n=a("<div style='margin: 0px; display: none; height:"+d+"px;'><table style='width: 100%; height: 100%; border-spacing: 0px;' cellspacing='0' cellpadding='0'><tr id='calendarFooter'><td align='right' id='todayButton'></td><td align='left' colspan='2' id=doneButton></td></tr></table></div>");if(this.showFooter){n.css("display","block")}r.append(c);r.append(n);c.addClass(this.toThemeProperty("jqx-calendar-month"));this._footer=n;this.header=r.find("#calendarHeader");this.header[0].id="calendarHeader"+o;this.header.addClass(this.toThemeProperty("calendar-header"));this.columnHeader=r.find("#calendarColumnHeader");this.columnHeader[0].id="calendarColumnHeader"+o;this.table=r.find("#cellsTable");this.table[0].id="cellsTable"+o;this.rowHeader=r.find("#calendarRowHeader");this.rowHeader[0].id="calendarRowHeader"+o;this.selectCell=r.find("#selectCell");this.selectCell[0].id="selectCell"+o;this.title=r.find("#calendarTitle");this.title[0].id="calendarTitle"+o;this.leftButton=r.find("#leftNavigationArrow");this.leftButton[0].id="leftNavigationArrow"+o;this.titleHeader=r.find("#calendarTitleHeader");this.titleHeader[0].id="calendarTitleHeader"+o;this.rightButton=r.find("#rightNavigationArrow");this.rightButton[0].id="rightNavigationArrow"+o;this.footer=r.find("#calendarFooter");this.footer[0].id="calendarFooter"+o;this.todayButton=r.find("#todayButton");this.todayButton[0].id="todayButton"+o;this.doneButton=r.find("#doneButton");this.doneButton[0].id="doneButton"+o;r.find("tr").addClass(this.toThemeProperty("jqx-reset"));r.addClass(this.toThemeProperty("jqx-widget-content"));r.addClass(this.toThemeProperty("jqx-calendar-month-container"));this.month=r;this.selectCell.addClass(this.toThemeProperty("jqx-reset"));this.selectCell.addClass(this.toThemeProperty("jqx-calendar-top-left-header"));if(this.showWeekNumbers){this._renderRowHeader(r)}else{this.table[0].colSpan=3;this.columnHeader[0].colSpan=3;this.rowHeader.css("display","none");this.selectCell.css("display","none")}if(this.showFooter){this.footer.height(20);var h=a("<a href='#'>"+this.todayString+"</a>");h.appendTo(this.todayButton);var g=a("<a href='#'>"+this.clearString+"</a>");g.appendTo(this.doneButton);g.addClass(this.toThemeProperty("jqx-calendar-footer"));h.addClass(this.toThemeProperty("jqx-calendar-footer"));var m=this;this.addHandler(h,"click",function(){if(m.today){m.today()}else{m.setDate(new Date(),"mouse")}return false});this.addHandler(g,"click",function(){if(m.clear){m.clear()}else{m.setDate(null,"mouse")}return false})}if(this.view!="month"){this.header.hide()}if(this.showDayNames&&this.view=="month"){this.renderColumnHeader(r)}this.renderCalendarCells(r,k,o);if(j==undefined||j==null){this.renderTitle(r)}this._refreshOtherMonthRows(q,o);r.find("tbody").css({border:"none",background:"transparent"});if(this.selectedDate!=undefined){this._selectDate(this.selectedDate)}var s=this;this.addHandler(this.host,"focus",function(){s.focus()});return r},_getTitleFormat:function(){switch(this.view){case"month":return this.titleFormat[0];case"year":return this.titleFormat[1];case"decade":return this.titleFormat[2];case"centuries":return this.titleFormat[3]}},renderTitle:function(t){var k=a("<div role='button' style='float: left;'></div>");var l=a("<div role='button' style='float: right;'></div>");var o=this.title;o.addClass(this.toThemeProperty("jqx-reset"));o.addClass(this.toThemeProperty("jqx-widget-header"));o.addClass(this.toThemeProperty("jqx-calendar-title-header"));var e=o.find("td");if(a.jqx.browser.msie&&a.jqx.browser.version<8){if(e.css("background-color")!="transparent"){var g=o.css("background-color");e.css("background-color",g)}if(e.css("background-image")!="transparent"){var d=o.css("background-image");var p=o.css("background-repeat");var c=o.css("background-position");e.css("background-image",d);e.css("background-repeat",p);e.css("background-position","left center scroll")}}else{e.css("background-color","transparent")}if(this.disabled){o.addClass(this.toThemeProperty("jqx-calendar-title-header-disabled"))}k.addClass(this.toThemeProperty("jqx-calendar-title-navigation"));k.addClass(this.toThemeProperty("jqx-icon-arrow-left"));k.appendTo(this.leftButton);var m=this.leftButton;l.addClass(this.toThemeProperty("jqx-calendar-title-navigation"));l.addClass(this.toThemeProperty("jqx-icon-arrow-right"));l.appendTo(this.rightButton);var b=this.rightButton;if(this.enableTooltips){if(a(m).jqxTooltip){a(m).jqxTooltip({name:this.element.id,position:"mouse",theme:this.theme,content:this.backText});a(b).jqxTooltip({name:this.element.id,position:"mouse",theme:this.theme,content:this.forwardText})}}var n=this.titleHeader;var v=this._format(this.value.dateTime,this._getTitleFormat(),this.culture);if(this.view=="decade"){var q=this._format(this._renderStartDate,this._getTitleFormat(),this.culture);var j=this._format(this._renderEndDate,this._getTitleFormat(),this.culture);v=q+" - "+j}else{if(this.view=="centuries"){var q=this._format(this._renderCenturyStartDate,this._getTitleFormat(),this.culture);var j=this._format(this._renderCenturyEndDate,this._getTitleFormat(),this.culture);v=q+" - "+j}}var f=a("<div style='background: transparent; margin: 0; padding: 0; border: none;'>"+v+"</div>");n.append(f);f.addClass(this.toThemeProperty("jqx-calendar-title-content"));var s=parseInt(k.width());var i=t.width()-2*s;var r=n.find(".jqx-calendar-title-content").width(i);a.data(k,"navigateLeft",this);a.data(l,"navigateRight",this);var h=a.jqx.mobile.isTouchDevice();if(!this.disabled){var u=this;this.addHandler(n,"mousedown",function(A){if(u.enableViews){if(!u._viewAnimating&&!u._animating){var x=u.view;switch(u.view){case"month":u.view="year";break;case"year":u.view="decade";break}if(x!=u.view){var z="View"+u.element.id;var B=u.host.find("#"+z);var y=u.getVisibleDate();var w=u.getFirstDayOfWeek(y);u.renderCalendarCells(B,w,z,true);u.refreshTitle(B)}}return false}});this.addHandler(k,"mousedown",function(x){if(!u._animating){a.data(k,"navigateLeftRepeat",true);var w=a.data(k,"navigateLeft");if(w.enableFastNavigation&&!h){w.startRepeat(w,k,true,500)}w.navigateBackward();return w._raiseEvent(0,x)}else{return false}});this.addHandler(k,"mouseup",function(w){a.data(k,"navigateLeftRepeat",false)});this.addHandler(k,"mouseleave",function(w){a.data(k,"navigateLeftRepeat",false)});this.addHandler(l,"mousedown",function(x){if(!u._animating){a.data(l,"navigateRightRepeat",true);var w=a.data(l,"navigateRight");if(w.enableFastNavigation&&!h){w.startRepeat(w,l,false,500)}w.navigateForward();return w._raiseEvent(1,x)}else{return false}});this.addHandler(l,"mouseup",function(w){a.data(l,"navigateRightRepeat",false)});this.addHandler(l,"mouseleave",function(w){a.data(l,"navigateRightRepeat",false)})}},refreshTitle:function(f){var g=this._format(this.value.dateTime,this._getTitleFormat(),this.culture);if(this.view=="decade"){var d=this._format(this._renderStartDate,this._getTitleFormat(),this.culture);var b=this._format(this._renderEndDate,this._getTitleFormat(),this.culture);g=d+" - "+b}else{if(this.view=="centuries"){var d=this._format(this._renderCenturyStartDate,this._getTitleFormat(),this.culture);var b=this._format(this._renderCenturyEndDate,this._getTitleFormat(),this.culture);g=d+" - "+b}}var e=this.titleHeader;if(this.titleHeader){var c=e.find(".jqx-calendar-title-content");var h=a("<div style='background: transparent; margin: 0; padding: 0; border: none;'>"+g+"</div>");e.append(h);h.addClass(this.toThemeProperty("jqx-calendar-title-content"));if(c!=null){c.remove()}}},startRepeat:function(d,b,f,e){var c=window.setTimeout(function(){var g=a.data(b,"navigateLeftRepeat");if(!f){g=a.data(b,"navigateRightRepeat")}if(g){if(e<25){e=25}if(f){d.navigateBackward();d.startRepeat(d,b,true,e)}else{d.navigateForward();c=d.startRepeat(d,b,false,e)}}else{window.clearTimeout(c);return}},e)},navigateForward:function(g){if(g==undefined||g==null){g=this.stepMonths}var f=this.value.year;if(this.view=="decade"){f=this._renderStartDate.getFullYear()+12;if(this._renderEndDate.getFullYear()>=this.getMaxDate().getFullYear()){return}}else{if(this.view=="year"){f=this.value.year+1}else{if(this.view=="centuries"){f=this.value.year+100}}}if(this.view!="month"){var b=this.getMaxDate().getFullYear();if(b<f||f>b){f=b}if(this.value.year==f){return}this.value.year=f;this.value.month=1;this.value.day=1}var c=this.value.day;var h=this.value.month;if(h+g<=12){var e=this.value._daysInMonth(this.value.year,this.value.month+g);if(c>e){c=e}}if(this.view=="month"){var d=new Date(this.value.year,this.value.month-1+g,c)}else{var d=new Date(this.value.year,this.value.month-1,c)}return this.navigateTo(d)},navigateBackward:function(f){if(f==undefined||f==null){f=this.stepMonths}var e=this.value.year;if(this.view=="decade"){e=this._renderStartDate.getFullYear()-12}else{if(this.view=="year"){e=this.value.year-1}else{if(this.view=="centuries"){e=this.value.year-100}}}if(this.view!="month"){var h=this.getMinDate().getFullYear();if(e<h){e=h}if(this.view=="decade"){if(this._renderStartDate){if(this._renderStartDate.getFullYear()==e){return}}}this.value.year=e;this.value.month=1;this.value.day=1}var b=this.value.day;var g=this.value.month;if(g-f>=1){var d=this.value._daysInMonth(this.value.year,this.value.month-f);if(b>d){b=d}}if(this.view=="month"){var c=new Date(this.value.year,this.value.month-1-f,b)}else{var c=new Date(this.value.year,this.value.month-1,b)}return this.navigateTo(c)},refreshCalendarCells:function(x,f,m){if(this.view=="year"||this.view=="decade"||this.view=="centuries"){this.refreshViews(x,f,m);return}var s=this.table;var q=s.find("#cellTable"+m.toString());var e=f;var c=new Array();var n=0;var u=new a.jqx._jqxDateTimeInput.getDateTime(new Date());for(var p=0;p<6;p++){for(var o=0;o<7;o++){var d=p+1;var h=o;if(this.rtl){h=6-h}var t=h+1;var l="#cell"+d+t+this.element.id;var w=new Date(e.dateTime.getFullYear(),e.dateTime.getMonth(),e.dateTime.getDate());var b=new a.jqx._jqxCalendar.cell(w);var g=a(q[0].rows[p].cells[t-1]);g[0].id=l.substring(1);b.element=g;b.row=p;b.column=o;b.isVisible=true;b.isOtherMonth=false;b.isToday=false;b.isWeekend=false;b.isHighlighted=false;b.isSelected=false;if(e.month!=this.value.month){b.isOtherMonth=true;b.isVisible=this.showOtherMonthDays}if(w<this.getMinDate()||w>this.getMaxDate()){b.isDisabled=true}if(e.month==u.month&&e.day==u.day&&e.year==u.year){b.isToday=true}if(e.isWeekend()){b.isWeekend=true}a.data(this.element,"cellContent"+l.substring(1),b);a.data(this.element,l.substring(1),b);c[n]=b;n++;a.jqx.utilities.html(g,e.day);this._applyCellStyle(b,g,g);e=new a.jqx._jqxDateTimeInput.getDateTime(new Date(e._addDays(1)))}}var v=a.data(this.element,x[0].id);if(v!=undefined&&v!=null){v.cells=c}this.renderedCells=c;this._refreshOtherMonthRows(v,m)},_getDecadeAndCenturiesData:function(){var k=new Array();var p=new Array();var c=this.getMaxDate().getFullYear()-this.getMinDate().getFullYear();if(c<12){c=12}var f=this.getMinDate();var b=this.getMaxDate();var l=this.value.dateTime.getFullYear();if(this.view=="decade"){if(l+12>b.getFullYear()){l=b.getFullYear()-11}if(l<f.getFullYear()){l=f.getFullYear()}for(var h=0;h<c;h++){var d=new Date(f.getFullYear()+h,0,1);if(f.getFullYear()<=l&&l<=d.getFullYear()){var g=new Date(d.getFullYear(),d.getMonth(),1);for(var e=0;e<12;e++){var o=new Date(g.getFullYear()+e,this.value.dateTime.getMonth(),this.value.dateTime.getDate());var m=o.getFullYear();if(f.getFullYear()<=m&&m<=b.getFullYear()){k.push(m);p.push(o);if(e==0){this._renderStartDate=o}this._renderEndDate=o}else{k.push(m);p.push(o)}}break}}}else{if(this.view=="centuries"){for(var h=0;h<c;h+=120){var d=new Date(f.getFullYear()+h+120,0,1);if(f.getFullYear()<=l&&l<=d.getFullYear()){var g=new Date(d.getFullYear()-130,d.getMonth(),1);if(g<f){g=f}for(var e=0;e<12;e++){var n=new Date(g.getFullYear()+e*10,g.getMonth(),1);if(g.getFullYear()>=f.getFullYear()&&n.getFullYear()<=b.getFullYear()){k.push("<span style='visibility: hidden;'>-</span>"+n.getFullYear()+"-"+(n.getFullYear()+9));p.push(n);if(e==0){this._renderCenturyStartDate=n}this._renderCenturyEndDate=new Date(n.getFullYear()+9,0,1)}}break}}}}return{years:k,dates:p}},refreshViews:function(A,m,s){var B=this;var c=new Array();var w=A.find("#cellTable"+s.toString());var D=this._getDecadeAndCenturiesData();var l=D.years;var C=D.dates;var t=0;var f=this.getMinDate();var n=this.getMaxDate();for(var v=0;v<3;v++){for(var u=0;u<4;u++){var d=v+1;var q=u;if(this.rtl){q=3-q}var x=q+1;var z=new Date(this.value.dateTime);z.setMonth(v*4+q);var b=new a.jqx._jqxCalendar.cell(z);var e=w[0].rows["row"+(1+v)+this.element.id];var o=a(e.cells[u]);b.isVisible=true;b.element=o;b.row=v;b.column=u;b.index=c.length;var p="";if(this.view=="year"){var h=this.localization.calendar.months.names;var g=h[v*4+q];switch(this.monthNameFormat){case"default":g=this.localization.calendar.months.namesAbbr[v*4+q];break;case"shortest":g=this.localization.calendar.months.namesShort[v*4+q];break;case"firstTwoLetters":g=g.substring(0,2);break;case"firstLetter":g=g.substring(0,1);break}p=g}else{if(this.view=="decade"||this.view=="centuries"){p=l[v*4+q];if(undefined==p){p="<span style='cursor: default; visibility: hidden;'>2013</span>"}b.setDate(C[v*4+q])}}var z=b.getDate();if(this.view=="year"){if(this._getYearAndMonthPart(z)<this._getYearAndMonthPart(f)){b.isDisabled=true}if(this._getYearAndMonthPart(z)>this._getYearAndMonthPart(n)){b.isDisabled=true}}else{if(z.getFullYear()<f.getFullYear()){b.isDisabled=true}if(z.getFullYear()>n.getFullYear()){b.isDisabled=true}}a.jqx.utilities.html(o,p);c[t]=b;t++}}var y=a.data(this.element,A[0].id);if(y!=undefined&&y!=null){y.cells=c}this.renderedCells=c;this._applyCellStyles()},_createViewClone:function(){var b=this.host.find(".jqx-calendar-month");var c=b.clone();c.css("position","absolute");c.css("top",b.position().top);return c},_addCellsTable:function(h,g){var e=this;var c=this.showFooter?20:0;if(this.view!="month"){g.height(this.host.height()-this.titleHeight)}else{g.height(this.host.height()-this.titleHeight-this.columnHeaderHeight-c)}this._viewAnimating=true;var b=this.host.find(".jqx-calendar-month-container");b.css("position","relative");var d=this.host.find(".jqx-calendar-month");var f=this._createViewClone();b.append(f);if(this.view!="month"){this.header.fadeOut(0);if(this.showWeekNumbers){this.rowHeader.fadeOut(0)}if(this.showFooter){this._footer.fadeOut(0)}}else{this.header.fadeIn(this.navigationDelay+200);if(this.showWeekNumbers){this.rowHeader.fadeIn(this.navigationDelay+200)}if(this.showFooter){this._footer.fadeIn(this.navigationDelay+200)}}h.children().remove();h.append(g);this._animateViews(f,g,function(){if(!e.selectedDate){e.selectedDate=e.renderedCells[0].getDate()}try{e.renderedCells[0].element.focus();setTimeout(function(){e.renderedCells[0].element.focus()},10)}catch(i){}e._viewAnimating=false});g.addClass(this.toThemeProperty("jqx-calendar-view"))},_animateViews:function(c,b,e){var d=this;d._viewAnimating=true;c.fadeOut(this.navigationDelay+100,function(){c.remove()});b.fadeOut(0);b.fadeIn(this.navigationDelay+200,function(){e()})},focus:function(){try{if(this.renderedCells&&this.renderedCells.length>0){var d=this;var c=false;if(!d.selectedDate&&d.selectionMode!="range"){this.setDate(new Date(),"mouse")}this.element.focus()}}catch(b){}},renderViews:function(D,m,u){var E=this;var d=new Array();var y=a("<table role='grid' style='width: 100%; height: 100%;' cellspacing='2' cellpadding='0' id=cellTable"+u.toString()+"><tr role='row' id='row1"+this.element.id+"'><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td></tr><tr role='row' id='row2"+this.element.id+"'><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td></tr><tr role='row' id='row3"+this.element.id+"'><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td></tr></table>");var p=this.host.find(".jqx-calendar-month-container");p.css("position","relative");var z=D.find("#cellsTable"+D[0].id);var G=this._getDecadeAndCenturiesData();var l=G.years;var F=G.dates;var v=0;var f=this.getMinDate();var n=this.getMaxDate();var s=new Date(this.value.dateTime);s.setDate(1);for(var x=0;x<3;x++){for(var w=0;w<4;w++){var c=x+1;var t=w;if(this.rtl){t=3-t}var A=t+1;var e=y[0].rows["row"+(1+x)+this.element.id];var C=new Date(s);C.setMonth(x*4+t);var b=new a.jqx._jqxCalendar.cell(C);var o=a(e.cells[w]);b.isVisible=true;b.element=o;b.row=x;b.column=w;b.index=d.length;var q="";if(this.view=="year"){if(C.getMonth()==this.getDate().getMonth()){b.isSelected=true}var h=this.localization.calendar.months.names;var g=h[x*4+t];switch(this.monthNameFormat){case"default":g=this.localization.calendar.months.namesAbbr[x*4+t];break;case"shortest":g=this.localization.calendar.months.namesShort[x*4+t];break;case"firstTwoLetters":g=g.substring(0,2);break;case"firstLetter":g=g.substring(0,1);break}q=g}else{if(this.view=="decade"||this.view=="centuries"){q=l[x*4+t];b.setDate(F[x*4+t]);if(b.getDate().getFullYear()==this.getDate().getFullYear()){b.isSelected=true}if(undefined==q){q="<span style='cursor: default; visibility: hidden;'>2013</span>"}}}var C=b.getDate();if(this.view=="year"){if(this._getYearAndMonthPart(C)<this._getYearAndMonthPart(f)){b.isDisabled=true}if(this._getYearAndMonthPart(C)>this._getYearAndMonthPart(n)){b.isDisabled=true}}else{if(C.getFullYear()<f.getFullYear()){b.isDisabled=true}if(C.getFullYear()>n.getFullYear()){b.isDisabled=true}}a.jqx.utilities.html(o,q);d[v]=b;v++}}a.each(d,function(){var j=this.element;var i=this;if(!E.disabled){E.addHandler(j,"mousedown",function(k){E._setDateAndSwitchViews(i)});E.addHandler(j,"mouseover",function(r){var k=E.renderedCells[i.index];if(E.view!="centuries"&&k.element.html().toLowerCase().indexOf("span")!=-1){return}k.isHighlighted=true;E._applyCellStyle(k,k.element,k.element)});E.addHandler(j,"mouseout",function(r){var k=E.renderedCells[i.index];if(E.view!="centuries"&&k.element.html().toLowerCase().indexOf("span")!=-1){return}k.isHighlighted=false;E._applyCellStyle(k,k.element,k.element)})}});var B=a.data(this.element,D[0].id);if(B!=undefined&&B!=null){B.cells=d}this.renderedCells=d;this._addCellsTable(z,y);this._applyCellStyles()},_setDateAndSwitchViews:function(k){if(!this._viewAnimating&&!this._animating){var f=this.getDate();var d=this.renderedCells[k.index].getDate();var i=this.value.dateTime.getDate();var j=new Date(d);j.setDate(i);if(j.getMonth()==d.getMonth()){d=j}var g=this.getMinDate();var c=this.getMaxDate();if(this.view=="year"){if(this._getYearAndMonthPart(d)<this._getYearAndMonthPart(g)){return}if(this._getYearAndMonthPart(d)>this._getYearAndMonthPart(c)){return}}else{if(d.getFullYear()<g.getFullYear()){return}if(d.getFullYear()>c.getFullYear()){return}}this._selectDate(d);switch(this.view){case"year":this.view="month";break;case"decade":this.view="year";break}if(this.view=="year"){if(this._getYearAndMonthPart(d)<this._getYearAndMonthPart(g)){d=g}if(this._getYearAndMonthPart(d)>this._getYearAndMonthPart(c)){d=c}}else{if(d.getFullYear()<g.getFullYear()){d=g}if(d.getFullYear()>c.getFullYear()){d=c}}this.value._setYear(d.getFullYear());this.value._setDay(d.getDate());this.value._setMonth(d.getMonth()+1);var h=this.getVisibleDate();var b=this.getFirstDayOfWeek(h);var e="View"+this.element.id;this.renderCalendarCells(this.month,b,e,true);this.refreshTitle(this.month);this._selectDate(f,"view")}},renderCalendarCells:function(D,m,s,q){if(this.view=="year"||this.view=="decade"||this.view=="centuries"){this.renderViews(D,m,s);return}var x=a("<table role='grid' style='width: 100%; height: 100%;' cellspacing='2' cellpadding='1' id=cellTable"+s.toString()+"><tr role='row'><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td></tr><tr role='row'><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td></tr><tr role='row'><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td></tr><tr role='row'><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td></tr><tr role='row'><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td></tr><tr role='row'><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td></tr></table>");var y=this.table;if(q==undefined){var g=y.find("#cellTable"+s.toString());if(g!=null){g.remove()}y.append(x)}var l=m;var b=this.showDayNames?1:0;var f=this.showWeekNumbers?1:0;var d=new Array();var t=0;var v=(D.width()-this.rowHeaderWidth-2)/7;if(!this.showWeekNumbers){v=(D.width()-2)/7}v=parseInt(v);var A=new a.jqx._jqxDateTimeInput.getDateTime(new Date());for(var w=0;w<6;w++){for(var u=0;u<7;u++){var e=w+1;var o=u;if(this.rtl){o=6-o}var z=o+1;var p="#cell"+e+z+this.element.id;var C=new Date(l.dateTime.getFullYear(),l.dateTime.getMonth(),l.dateTime.getDate());var c=new a.jqx._jqxCalendar.cell(C);var n=a(x[0].rows[w].cells[z-1]);n[0].id=p.substring(1);c.isVisible=true;c.isDisabled=false;if(l.month!=this.value.month){c.isOtherMonth=true;c.isVisible=this.showOtherMonthDays}if(C<this.getMinDate()||C>this.getMaxDate()){c.isDisabled=true}if(l.month==A.month&&l.day==A.day&&l.year==A.year){c.isToday=true}if(l.isWeekend()){c.isWeekend=true}c.element=n;c.row=b;c.column=f;a.jqx.utilities.html(n,l.day);l=new a.jqx._jqxDateTimeInput.getDateTime(new Date(l._addDays(1)));a.data(this.element,"cellContent"+p.substring(1),c);a.data(this.element,""+p.substring(1),c);var E=this;this.addHandler(n,"mousedown",function(I){if(!E.readOnly&&!E.disabled){var H=a(I.target);var j=a.data(E.element,H[0].id);var i=E._raiseEvent(3,I);if(j!=null&&j!=undefined){var r=j.getDate();if(E.getMinDate()<=r&&r<=E.getMaxDate()){if(!j.isDisabled){if(j.isOtherMonth&&E.enableAutoNavigation){if(j.row<2){E.navigateBackward()}else{E.navigateForward()}E._selectDate(j.getDate(),"mouse",I.shiftKey)}else{var F=new Date(E.getDate());E._selectDate(j.getDate(),"mouse",I.shiftKey);E.value._setYear(r.getFullYear());E.value._setDay(1);E.value._setMonth(r.getMonth()+1);E.value._setDay(r.getDate());var G=E.host.find(".jqx-calendar-month");G.stop();G.css("margin-left","0px");var k=E.getDate();E._raiseEvent("2");if(j.isOtherMonth){E._raiseEvent("5",{selectionType:"mouse"})}}}}}return i}});if(!E.disabled){var h=function(F,j){if(!E.readOnly){var r=a(F.target);var i=a.data(E.element,r[0].id);if(i!=null&&i!=undefined){var k=i.getDate();if(E.getMinDate()<=k&&k<=E.getMaxDate()){i.isHighlighted=j;E._applyCellStyle(i,i.element,r)}}}};this.addHandler(n,"mouseenter",function(i){h(i,true);return false});this.addHandler(n,"mouseleave",function(i){h(i,false);return false})}f++;d[t]=c;t++}f=0;b++}var B=a.data(this.element,D[0].id);if(B!=undefined&&B!=null){B.cells=d}this.renderedCells=d;if(q!=undefined){this._addCellsTable(y,x)}this._applyCellStyles();this._refreshOtherMonthRows(B,s)},setMaxDate:function(b){if(b!=null&&typeof(b)=="string"){b=new Date(b);if(b=="Invalid Date"){return}}this.maxDate=a.jqx._jqxDateTimeInput.getDateTime(b);this.render()},getMaxDate:function(){if(this.maxDate!=null&&this.maxDate!=undefined){return this.maxDate.dateTime}return null},setMinDate:function(b){if(b!=null&&typeof(b)=="string"){b=new Date(b);if(b=="Invalid Date"){return}}this.minDate=a.jqx._jqxDateTimeInput.getDateTime(b);this.render()},getMinDate:function(){if(this.minDate!=null&&this.minDate!=undefined){return this.minDate.dateTime}return null},navigateTo:function(f,h){if(this.view=="month"){var g=this.getMinDate();var c=new Date(this.getMaxDate().getFullYear(),this.getMaxDate().getMonth()+1,this.getMaxDate().getDate());if((f<this._getYearAndMonthPart(g))||(f>this._getYearAndMonthPart(c))){return false}}else{if(f.getFullYear()<this.getMinDate().getFullYear()||f.getFullYear()>this.getMaxDate().getFullYear()){return false}}if(f==null){return false}if(h==undefined){var i=this;if(this._animating){return}this._animating=true;var d=this.host.find(".jqx-calendar-month-container");if(this._viewClone){this._viewClone.stop();this._viewClone.remove()}if(this._newViewClone){this._newViewClone.stop();this._newViewClone.remove()}var k=this.host.find(".jqx-calendar-month");k.stop();k.css("margin-left","0px");var b=k.clone();this._viewClone=b;var j=new Date(this.value.dateTime);this.value._setYear(f.getFullYear());this.value._setDay(f.getDate());this.value._setMonth(f.getMonth()+1);i.refreshControl();d.css("position","relative");b.css("position","absolute");b.css("top",k.position().top);d.append(b);if(a.jqx.browser.msie&&a.jqx.browser.version<8){this.month.css("position","relative");this.month.css("overflow","hidden");this.table.css("position","relative");this.table.css("overflow","hidden")}var e=-this.host.width();if(f<j){if(this.view=="month"&&f.getMonth()!=j.getMonth()){e=this.host.width()}else{if(f.getFullYear()!=j.getFullYear()){e=this.host.width()}}}b.animate({marginLeft:parseInt(e)+"px"},this.navigationDelay,function(){b.remove()});var l=k.clone();this._newViewClone=l;l.css("position","absolute");l.css("top",k.position().top);d.append(l);l.css("margin-left",-e);k.css("visibility","hidden");l.animate({marginLeft:"0px"},this.navigationDelay,function(){l.remove();k.css("visibility","visible");i._animating=false})}else{this.value._setYear(f.getFullYear());this.value._setDay(f.getDate());this.value._setMonth(f.getMonth()+1);var k=this.host.find(".jqx-calendar-month");k.stop();k.css("margin-left","0px");this.refreshControl()}this._raiseEvent("2");this._raiseEvent("8");return true},setDate:function(b){if(b!=null&&typeof(b)=="string"){b=new Date(b)}if(this.canRender==false){this.canRender=true;this.render()}this.navigateTo(b,"api");this._selectDate(b);if(this.selectionMode=="range"){this._selectDate(b,"mouse")}return true},val:function(b){if(arguments.length!=0){if(b==null){this.setDate(null)}if(b instanceof Date){this.setDate(b)}if(typeof(b)=="string"){this.setDate(b)}}return this.getDate()},getDate:function(){if(this.selectedDate==undefined){return new Date()}return this.selectedDate},getValue:function(){if(this.value==undefined){return new Date()}return this.value.dateTime},setRange:function(c,b){if(this.canRender==false){this.canRender=true;this.render()}this.navigateTo(c,"api");this._selectDate(c,"mouse");this._selectDate(b,"mouse")},getRange:function(){return this.selection},_selectDate:function(e,h,b){if(this.selectionMode=="none"){return}if(h==null||h==undefined){h="none"}if(b==null||b==undefined){b=false}var i=a.data(this.element,"View"+this.element.id);if(i==undefined||i==null){return}var d=this;if(this.input){if(e!=null){this.input.val(e.toString())}else{this.input.val("")}}var g=this.selectedDate;this.selectedDate=e;if(this.view!="month"){if(g!=e){this._raiseEvent(7)}a.each(this.renderedCells,function(n){var j=this;var o=j.getDate();var k=a(j.element);var m=k.find("#cellContent"+k[0].id);if(e==null){j.isSelected=false;j.isDisabled=false}else{j.isSelected=false;if(o){if((o.getMonth()==e.getMonth()&&d.view=="year")||(d.view=="decade"&&o.getFullYear()==e.getFullYear())){j.isSelected=true;try{j.element.focus()}catch(l){}}}}d._applyCellStyle(j,k,k)});return}if(this.view=="month"){if(this.selectionMode=="range"&&h=="key"){var f=this.getVisibleDate();var c=this.getFirstDayOfWeek(f);this.refreshCalendarCells(this.month,c,"View"+this.element.id)}}a.each(this.renderedCells,function(p){var u=this;var m=u.getDate();var t=a(u.element);var j=t;if(t.length==0){return false}if(e==null){u.isSelected=false;u.isDisabled=false;if(p==0){d.selection={from:null,to:null};d._raiseEvent("2");d._raiseEvent("5",{selectionType:h})}}else{if(d.selectionMode!="range"||h=="key"){if(m.getDate()==e.getDate()&&m.getMonth()==e.getMonth()&&m.getFullYear()==e.getFullYear()&&u.isSelected){d._applyCellStyle(u,t,j);return}if(u.isSelected){d._raiseEvent("6",{selectionType:h})}u.isSelected=false;if(m.getDate()==e.getDate()&&m.getMonth()==e.getMonth()&&m.getFullYear()==e.getFullYear()){u.isSelected=true;if(p==0){d.selection={date:e}}try{u.element.focus()}catch(q){}if(!u.isOtherMonth){d.value._setMonth(e.getMonth()+1);d.value._setDay(e.getDate());d.value._setYear(e.getFullYear());d._raiseEvent("2");d._raiseEvent("5",{selectionType:h})}}if(d.selectionMode=="range"){d._clicks=0;d.selection={from:e,to:e}}}else{if(d.selectionMode=="range"){if(h=="view"){u.isSelected=false;u.isDisabled=false;if(d.getMaxDate()<m){u.isDisabled=true}if(d.getMinDate()>m){u.isDisabled=true}d._applyCellStyle(u,t,j);return true}if(p==0){if(h!="none"){if(d._clicks==undefined){d._clicks=0}d._clicks++;if(b){d._clicks++}if(d._clicks==1){d.selection={from:e,to:e}}else{var s=d.selection.from;var o=s<=e?s:e;var r=s<=e?e:s;if(o){var k=new Date(o.getFullYear(),o.getMonth(),o.getDate())}if(r){var l=new Date(r.getFullYear(),r.getMonth(),r.getDate(),23,59,59)}d.selection={from:k,to:l};d._clicks=0}}else{if(d.selection==null||d.selection.from==null){d.selection={from:e,to:e};if(d._clicks==undefined){d._clicks=0}d._clicks++;if(d._clicks==2){d._clicks=0}}}}var n=function(w){if(w==null){return new Date()}var v=new Date();v.setHours(0,0,0,0);v.setFullYear(w.getFullYear(),w.getMonth(),w.getDate());return v};if(!u.isOtherMonth&&n(m).toString()==n(e).toString()){d.value._setMonth(e.getMonth()+1);d.value._setDay(e.getDate());d.value._setYear(e.getFullYear());d._raiseEvent("2");d._raiseEvent("5",{selectionType:h})}u.isSelected=false;u.isDisabled=false;if(n(m)<n(d.selection.from)&&d._clicks==1){u.isDisabled=true}if(d.getMaxDate()<m){u.isDisabled=true}if(d.getMinDate()>m){u.isDisabled=true}if(n(m)>=n(d.selection.from)&&n(m)<=n(d.selection.to)){u.isSelected=true}}}}d._applyCellStyle(u,t,j)});if(d.selectionMode=="range"&&d._clicks==0){d._raiseEvent(7);return}else{if(d.selectionMode=="range"){return}}if(g!=e){d._raiseEvent(7)}},_getSelectedDate:function(){var d=a.data(this.element,"View"+this.element.id);if(d==undefined||d==null){return}if(this.view!="month"){return this.selectedDate}for(var c=0;c<d.cells.length;c++){var b=d.cells[c];var e=b.getDate();if(b.isSelected){return e}}if(this.selectedDate){return this.selectedDate}},_getSelectedCell:function(){var d=a.data(this.element,"View"+this.element.id);if(d==undefined||d==null){return}for(var c=0;c<d.cells.length;c++){var b=d.cells[c];var e=b.getDate();if(b.isSelected){return b}}},_applyCellStyle:function(b,c,e){var d=this;if(e==null||(e!=null&&e.length==0)){e=c}e.removeClass();e[0].className="";e.addClass(this.toThemeProperty("jqx-rc-all"));if(this.disabled||b.isDisabled){e.addClass(this.toThemeProperty("jqx-calendar-cell-disabled"));e.addClass(this.toThemeProperty("jqx-fill-state-disabled"))}if(b.isOtherMonth&&this.enableOtherMonthDays&&b.isVisible){e.addClass(this.toThemeProperty("jqx-calendar-cell-othermonth"))}if(b.isWeekend&&this.enableWeekend&&b.isVisible&&b.isVisible){e.addClass(this.toThemeProperty("jqx-calendar-cell-weekend"))}if(!b.isVisible){e.addClass(this.toThemeProperty("jqx-calendar-cell-hidden"))}else{e.addClass(this.toThemeProperty("jqx-calendar-cell"));if(this.view!="month"){if(e.length>0&&e.html().toLowerCase().indexOf("span")!=-1){e.css("cursor","default")}}}e.removeAttr("aria-selected");if(b.isSelected&&b.isVisible){e.addClass(this.toThemeProperty("jqx-calendar-cell-selected"));e.addClass(this.toThemeProperty("jqx-fill-state-pressed"));e.attr("aria-selected",true);this.host.removeAttr("aria-activedescendant").attr("aria-activedescendant",e[0].id)}if(b.isHighlighted&&b.isVisible&&this.enableHover){if(!b.isDisabled){e.addClass(this.toThemeProperty("jqx-calendar-cell-hover"));e.addClass(this.toThemeProperty("jqx-fill-state-hover"))}}e.addClass(this.toThemeProperty("jqx-calendar-cell-"+this.view));if(b.isToday&&b.isVisible){e.addClass(this.toThemeProperty("jqx-calendar-cell-today"))}if(this.specialDates.length>0){var f=this;a.each(this.specialDates,function(){if(this.Class!=undefined&&this.Class!=null&&this.Class!=""){e.removeClass(this.Class)}else{e.removeClass(d.toThemeProperty("jqx-calendar-cell-specialDate"))}var g=b.getDate();if(g.getFullYear()==this.Date.getFullYear()&&g.getMonth()==this.Date.getMonth()&&g.getDate()==this.Date.getDate()){if(b.tooltip==null&&this.Tooltip!=null){b.tooltip=this.Tooltip;if(a(e).jqxTooltip){var h=this.Class;a(e).jqxTooltip({value:{cell:b,specialDate:this.Date},name:f.element.id,content:this.Tooltip,position:"mouse",theme:f.theme,opening:function(i){if(e.hasClass(d.toThemeProperty("jqx-calendar-cell-specialDate"))){return true}if(e.hasClass(h)){return true}return false}})}}e.removeClass(d.toThemeProperty("jqx-calendar-cell-othermonth"));e.removeClass(d.toThemeProperty("jqx-calendar-cell-weekend"));if(this.Class==undefined||this.Class==""){e.addClass(d.toThemeProperty("jqx-calendar-cell-specialDate"));return false}else{e.addClass(this.Class);return false}}})}},_applyCellStyles:function(){var f=a.data(this.element,"View"+this.element.id);if(f==undefined||f==null){return}for(var e=0;e<f.cells.length;e++){var b=f.cells[e];var c=a(b.element);var d=c.find("#cellContent"+c[0].id);if(d.length==0){d=c}this._applyCellStyle(b,c,d)}},getWeekOfYear:function(c){var b=c.dayOfYear(c.dateTime)-1;var d=c.dayOfWeek-(b%7);var e=((d-this.firstDayOfWeek)+14)%7;return Math.ceil((((b+e)/7)+1))},renderColumnHeader:function(w){if(!this.showDayNames){return}var t=a("<table role='grid' style='border-spacing: 0px; border-collapse: collapse; width: 100%; height: 100%;' cellspacing='0' cellpadding='1'><tr role='row'><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td><td role='gridcell'></td></tr></table>");t.find("table").addClass(this.toThemeProperty("jqx-reset"));t.find("tr").addClass(this.toThemeProperty("jqx-reset"));t.find("td").css({background:"transparent",padding:1,margin:0,border:"none"});t.addClass(this.toThemeProperty("jqx-reset"));t.addClass(this.toThemeProperty("jqx-calendar-column-header"));this.columnHeader.append(t);var d=this.getVisibleDate();var h=this.getFirstDayOfWeek(d);var m=h.dayOfWeek;var x=this.getWeekOfYear(h);var q=this.firstDayOfWeek;var v=this.localization.calendar.days.names;var n=new Array();var g=h;var o=(w.width()-this.rowHeaderWidth-2)/7;if(!this.showWeekNumbers){o=(w.width()-2)/7}for(var s=0;s<7;s++){var f=v[q];if(this.rtl){f=v[6-q]}switch(this.dayNameFormat){case"default":f=this.localization.calendar.days.namesAbbr[q];break;case"shortest":f=this.localization.calendar.days.namesShort[q];break;case"firstTwoLetters":f=f.substring(0,2);break;case"firstLetter":f=f.substring(0,1);break}var b=new a.jqx._jqxCalendar.cell(g.dateTime);var k=s+1;var l=k+this.element.id;var j=a(t[0].rows[0].cells[s]);var p=s;if(this.enableTooltips){if(a(j).jqxTooltip){a(j).jqxTooltip({name:this.element.id,content:v[q],theme:this.theme,position:"mouse"})}}if(q>=6){q=0}else{q++}s=p;b.element=j;b.row=0;b.column=s+1;var e=this._textwidth(f);var c="<div style='padding: 0; margin: 0; border: none; background: transparent;' id='columnCell"+l+"'>"+f+"</div>";j.append(c);j.find("#columnCell"+l).addClass(this.toThemeProperty("jqx-calendar-column-cell"));j.width(o);if(this.disabled){j.find("#columnCell"+l).addClass(this.toThemeProperty("jqx-calendar-column-cell-disabled"))}if(e>0&&o>0){while(e>j.width()){if(f.length==0){break}f=f.substring(0,f.length-1);a.jqx.utilities.html(j.find("#columnCell"+l),f);e=this._textwidth(f)}}n[s]=b;g=new a.jqx._jqxDateTimeInput.getDateTime(new Date(g._addDays(1)))}if(parseInt(this.columnHeader.width())>parseInt(this.host.width())){this.columnHeader.width(this.host.width())}var u=a.data(this.element,w[0].id);u.columnCells=n},_format:function(d,e,b){var f=false;try{if(Globalize!=undefined){f=true}}catch(c){}if(a.global){a.global.culture.calendar=this.localization.calendar;return a.global.format(d,e,this.culture)}else{if(f){try{if(Globalize.cultures[this.culture]){Globalize.cultures[this.culture].calendar=this.localization.calendar;return Globalize.format(d,e,this.culture)}else{return Globalize.format(d,e,this.culture)}}catch(c){return Globalize.format(d,e)}}else{if(a.jqx.dataFormat){return a.jqx.dataFormat.formatdate(d,e,this.localization.calendar)}}}},_textwidth:function(d){var c=a("<span>"+d+"</span>");c.addClass(this.toThemeProperty("jqx-calendar-column-cell"));a(this.host).append(c);var b=c.width();c.remove();return b},_textheight:function(d){var c=a("<span>"+d+"</span>");a(this.host).append(c);var b=c.height();c.remove();return b},_renderRowHeader:function(k){var g=this.getVisibleDate();var c=this.getFirstDayOfWeek(g);var f=c.dayOfWeek;var q=this.getWeekOfYear(c);var l=a("<table style='overflow: hidden; width: 100%; height: 100%;' cellspacing='0' cellpadding='1'><tr><td></td></tr><tr><td/></tr><tr><td/></tr><tr><td/></tr><tr><td/></tr><tr><td/></tr></table>");l.find("table").addClass(this.toThemeProperty("jqx-reset"));l.find("td").addClass(this.toThemeProperty("jqx-reset"));l.find("tr").addClass(this.toThemeProperty("jqx-reset"));l.addClass(this.toThemeProperty("jqx-calendar-row-header"));l.width(this.rowHeaderWidth);this.rowHeader.append(l);var d=c;var p=new Array();for(var h=0;h<6;h++){var e=q.toString();var o=new a.jqx._jqxCalendar.cell(d.dateTime);var j=h+1+this.element.id;var n=a(l[0].rows[h].cells[0]);o.element=n;o.row=h;o.column=0;var b="<div style='background: transparent; border: none; padding: 0; margin: 0;' id ='headerCellContent"+j+"'>"+e+"</div>";n.append(b);n.find("#headerCellContent"+j).addClass(this.toThemeProperty("jqx-calendar-row-cell"));p[h]=o;d=new a.jqx._jqxDateTimeInput.getDateTime(new Date(d._addWeeks(1)));q=this.getWeekOfYear(d)}var m=a.data(this.element,k[0].id);m.rowCells=p},getFirstDayOfWeek:function(e){var d=e;if(this.firstDayOfWeek<0||this.firstDayOfWeek>6){this.firstDayOfWeek=6}var c=d.dayOfWeek-this.firstDayOfWeek;if(c<=0){c+=7}var b=a.jqx._jqxDateTimeInput.getDateTime(d._addDays(-c));return b},getVisibleDate:function(){var c=new a.jqx._jqxDateTimeInput.getDateTime(new Date(this.value.dateTime));if(c<this.minDate){c=this.minDate}if(c>this.maxDate){this.visibleDate=this.maxDate}var d=c.day;var b=a.jqx._jqxDateTimeInput.getDateTime(c._addDays(-d+1));c=b;return c},destroy:function(b){this.host.removeClass();if(b!=false){this.host.remove()}},_raiseEvent:function(i,c){if(c==undefined){c={owner:null}}var e=this.events[i];var f=c?c:{};f.owner=this;var g=new jQuery.Event(e);g.owner=this;g.args=f;if(i==0||i==1||i==2||i==3||i==4||i==5||i==6||i==7||i==8){g.args.date=g.args.selectedDate=this.getDate();g.args.range=this.getRange();var h=this.getViewStart();var d=this.getViewEnd();g.args.view={from:h,to:d}}var b=this.host.trigger(g);if(i==0||i==1){b=false}return b},propertyMap:function(b){if(b=="value"){if(this.selectionMode!="range"){return this.getDate()}else{return this.getRange()}}return null},updateSize:function(){var d=this.host.find("#View"+this.element.id);if(d.length>0){this.setCalendarSize();if(this.height!=undefined&&!isNaN(this.height)){d.height(this.height)}else{if(this.height!=null&&this.height.toString().indexOf("px")!=-1){d.height(this.height)}}if(this.width!=undefined&&!isNaN(this.width)){d.width(this.width)}else{if(this.width!=null&&this.width.toString().indexOf("px")!=-1){d.width(this.width)}}var c=this.host.height()-this.titleHeight-this.columnHeaderHeight;var b="View"+this.element.id;d.find("#cellsTable"+b).height(c);d.find("#calendarRowHeader"+b).height(c);this.refreshControl()}},clear:function(){if(this.selectionMode=="range"){this._clicks=1;this.setRange(null,null);this._raiseEvent(7)}else{this.setDate(null,"mouse")}this._clicks=0;this.selection={from:null,to:null}},today:function(){if(this.selectionMode=="range"){this.setRange(new Date(),new Date())}else{this.setDate(new Date(),"mouse")}},propertyChangedHandler:function(d,e,g,f){if(this.isInitialized==undefined||this.isInitialized==false){return}if(e=="enableHover"){return}if(e=="keyboardNavigation"){return}if(e=="localization"){if(this.localization){if(this.localization.backString){this.backText=this.localization.backString}if(this.localization.forwardString){this.forwardText=this.localization.forwardString}if(this.localization.todayString){this.todayString=this.localization.todayString}if(this.localization.clearString){this.clearString=this.localization.clearString}this.firstDayOfWeek=this.localization.calendar.firstDay}}if(e=="culture"){try{if(a.global){a.global.preferCulture(d.culture);d.localization.calendar=a.global.culture.calendar}else{if(Globalize){var b=Globalize.culture(d.culture);d.localization.calendar=b.calendar}}}catch(c){}}if(e=="width"||e=="height"){d.updateSize();return}else{if(e=="theme"){a.jqx.utilities.setTheme(g,f,this.host)}else{this.view="month";this.render()}}}})})(jQuery);(function(a){a.jqx._jqxCalendar.cell=function(c){var b={dateTime:new a.jqx._jqxDateTimeInput.getDateTime(c),_date:c,getDate:function(){return this._date},setDate:function(d){this.dateTime=new a.jqx._jqxDateTimeInput.getDateTime(d);this._date=d},isToday:false,isWeekend:false,isOtherMonth:false,isVisible:true,isSelected:false,isHighlighted:false,element:null,row:-1,column:-1,tooltip:null};return b};a.jqx._jqxCalendar.monthView=function(c,h,d,b,f,e){var g={start:c,end:h,cells:d,rowCells:b,columnCells:f,element:e};return g}})(jQuery);