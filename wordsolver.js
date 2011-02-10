/*
solve.js
Documentation at https://github.com/bgrins/wordsolver.js
*/

(function(wordsolver) {

var allletters = 'abcdefghijklmnopqrstuvwxyz'.split('');

wordsolver.settings = { 
	sortOutput: true,
	useCache: true
};

wordsolver.solve = function(word, dictionary, settings) {
	
	if (!settings) { 
		settings = { }; 
	}
	
	for (var i in wordsolver.settings) {
		if (!settings.hasOwnProperty(i)) {
			settings[i] = wordsolver.settings;
		}
	}
	
	if (!dictionary) {
		throw "WordSolver: No dictionary provied.";
	}
	
	var cache = settings.useCache ? getResultCache(dictionary) : { };
	var words = cache[word];
	
	// Either missed on the cache, or caching is disabled
	if (!words) {
		words = cache[word] = solve(word, dictionary);
	} 
	
	// Group the results into arrays based on their length
	var groupByLength = { };
	
	for (var word in words) {
		var length = word.length;
		if (!groupByLength[length]) { 
			groupByLength[length] = []; 
		}	
		groupByLength[length].push(word);
	}
	
	if (settings.sortOutput) {
		for (var i in groupByLength) {
			groupByLength[i].sort();
		}
	}
	
	return groupByLength;
};


function solve(word, dictionary) {
	var words = { };
	
	addword('', word.toLowerCase().split(''));
	function addword(word, letters) {
	
		// add word to results if it matches dictionary
		if (dictionary[word]) {
			words[word] = 1;
		}
		
		// base case: no more letters to check
		if (letters.length == 0) { return; }
		
		for (var i = 0; i < letters.length; i++) {
			
			// Clone the letters and remove the current one
			var newletters = letters.slice();
			newletters.splice(i, 1);
			
			// Need to call this function with the new set.
			var currentletter = letters[i];
			var iswildcard = (currentletter == '?');
			
			// Have to check with each letter if wildcard.
			// Otherwise just run with the current letter appended.
			if (iswildcard) {
				for (var k = 0; k < allletters.length; k++) {
					addword(word + allletters[k], newletters);
				}
			}
			else {
				addword(word + currentletter, newletters);
			}
		}
	}
	
	return words;	
}

var cache = [];

// Keep a cache of results as we search for words to speed up subsequent searches
function getResultCache(dictionary) {
	
	for (var i = 0; i < cache.length; i++) {
		if (cache[i][0] == dictionary) {
			return cache[i][1];
		}
	}
	
	cache.push([dictionary, {}]);
	return cache[cache.length-1][1];
}

})(this.wordsolver = { });
