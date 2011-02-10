
module("dictionary tests", {
	setup: function() { }
});


test("solve with empty dictionary", function() {
	expect(1);
	
	var results = wordsolver.solve("retains", { });
	var numResults = 0;
	for (var i in results) {
		numResults += results[i].length;
	}
	
	ok(numResults == 0);
});

test("solve two word dictionary", function() {
	expect(2);
	
	var results = wordsolver.solve("retains", { "retains": 1, "ate": 1, "cantfind": 1 });
	for (var i in results) {
		ok();
	}
});

