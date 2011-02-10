
(function($) {
$.fn.bindWithDelay = function( type, data, fn, timeout ) {
	var wait = null;
	var that = this;
	
	if ( $.isFunction( data ) ) {
		timeout = fn;
		fn = data;
		data = undefined;
	}
		
	var cb = function(e) {
		clearTimeout(wait);
		var cachedEvent = $.extend({}, e);
		
		wait = setTimeout(function() {
			fn.apply(that, [cachedEvent]);
		}, timeout);
	}
	
	return this.bind(type, data, cb);
}
})(jQuery);


window.log = function(){
	if(this.console){
		console.log( Array.prototype.slice.call(arguments) );
	}
};

var MAX_LETTERS = 8;
var MAX_WILDCARDS = 2;

var dictionaries = {
	'sowpods': false,
	'twl': false,
	'ospd4': false
};

function loadDictionary(id) {
	var loading = $("#dictionary-loading");
	$("#error-dictionary").hide();
	loading.show().find(".dictionary").text(id);
	
	$.get('../words/' + id, function(data) {
		// copy array into object to make word lookups easier
		var words = data.split(' ');
		var dictionary = { };
		for (var i in words) { dictionary[words[i]] = 1; }
		dictionaries[id] = dictionary;

		loading.fadeOut();
	});
	
};


function findwords() {
	
	var input = $.trim($("#inputletters").val());
	var whichDictionary = $("#dictionaries").val();
	if (!dictionaries[whichDictionary]) {
		$("#error-dictionary").show().find(".dictionary").text(whichDictionary);
		return;
	}
	
	if (input.length > MAX_LETTERS) { 
		$("#max-letters").text(MAX_LETTERS);
		$("#max-wildcards").text(MAX_WILDCARDS);
		$("#error-input").show();
		return;
	}
	
	$("#error-dictionary").hide();
	$("#error-input").hide();
	$("#status-solving").show();
	var startTime = new Date().getTime();
	
	var results = wordsolver.solve(input, dictionaries[whichDictionary], { });
	
	var runTime = (new Date().getTime() - startTime);
	$("#status-solving").hide();
	
	var html = [],
		numResults = 0;
	for (var i in results) {
		numResults += results[i].length;
		html.push('<li>' + results[i].join(', ') + '</li>');
	}
	
	$("#result-details").show().text("Found " + numResults + " results in " + runTime + "ms.");
	
	$("#results").html(html.join(''));	

}

$(function() {

loadDictionary($("#dictionaries").val());

$("#dictionaries").change(function() { loadDictionary($(this).val()); });
$("#go").click(findwords);

$("#inputletters").keydown(function(e) { if (e.keyCode == 13) { findwords(); } }).
	bindWithDelay("keydown", findwords, 100);
});