var Lexer = require('./lexer');
var Expect = require('chai').expect;

var reset = "\x1b[0m";
var bright = "\x1b[1m%s"		+reset;
var dim = "\x1b[2m%s"			+reset;
var underscore = "\x1b[4m%s"	+reset;
var blink = "\x1b[5m%s"			+reset;
var reverse = "\x1b[7m%s"		+reset;
var hidden = "\x1b[8m%s"		+reset;

var fgBlack = "\x1b[30m%s"		+reset;
var fgRed = "\x1b[31m%s"		+reset;
var fgGreen = "\x1b[32m%s"		+reset;
var fgYellow = "\x1b[33m%s"		+reset;
var fgBlue = "\x1b[34m%s"		+reset;
var fgMagenta = "\x1b[35m%s"	+reset;
var fgCyan = "\x1b[36m%s"		+reset;
var fgWhite = "\x1b[37m%s"		+reset;

var bgBlack = "\x1b[40m%s"		+reset;
var bgRed = "\x1b[41m%s"		+reset;
var bgGreen = "\x1b[42m%s"		+reset;
var bgYellow = "\x1b[43m%s"		+reset;
var bgBlue = "\x1b[44m%s"		+reset;
var bgMagenta = "\x1b[45m%s"	+reset;
var bgCyan = "\x1b[46m%s"		+reset;
var bgWhite = "\x1b[47m%s"		+reset;

var tests = [function TestKeywords(){
	var input = "Class {}";
	var parser = Lexer.parse(input)
	var expected = [
		{type:'kw',   value:'Class',line:0, column:5},
		{type:'punc', value:'{',	line:0, column:7},
		{type:'punc', value:'}',	line:0, column:8}
	];
	var results = [];
	while(!parser.eof()){
		results.push(parser.next());
	}
	Expect(results).to.eql(expected)
	
}, function TestComments(){
	var input = "/* blockComment \n */\n//lel this is the \n beginning of a line."
	var parser = Lexer.parse(input);
	var expected = [
		{ type: 'var', value: 'beginning', line: 3, column: 10 },                                                                                                                  
		{ type: 'var', value: 'of', line: 3, column: 13 },                                                                                                                         
		{ type: 'var', value: 'a', line: 3, column: 15 },                                                                                                                          
		{ type: 'var', value: 'line', line: 3, column: 20 },                                                                                                                       
		{ type: 'punc', value: '.', line: 3, column: 21 }
	];
	var results = [];
	while(!parser.eof()){
		results.push(parser.next());
	}
	Expect(results).to.eql(expected)
}];
/*
function assertEqual(a, b, resultAsBool){
	var pass = true;
	if(typeof a == "object" && typeof b == "object"){
		for(var i in a){
			if(a[i] && b[i]){
				pass = (pass && assertEqual(a[i], b[i], true));
			} else pass = false;
			
			if(!pass)
				break;
		}
	}else if (typeof a == typeof b){
		pass = (a === b);
	}else
		pass = false;
	
	if(resultAsBool)
		return pass;
	else if(pass)
		return fgGreen.replace('%s', "Passed");
	else
		return fgRed.replace('%s', "Failed");
}
*/
failed = 0;
for(var t of tests){
	var error;
	var passed;
	try{
		t();
		passed = true;
	}catch(e){
		passed = false;
		failed ++;
		error = e;
	}
	if(passed)
		console.log("%s ......... %s", t.name, fgGreen.replace('%s', "✓ Passed"));
	else
		console.log("%s ......... %s", t.name, fgRed.replace('%s', "✗ Failed"), "\nActual:", error.actual, "\nExpected:", error.expected);
}
if(!failed)
	console.log(fgGreen, "✓ Tests completed successfully.")
else
	console.log(bgRed, "✗ Tests completed with errors.")