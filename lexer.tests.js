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

var tests = [
	function TestKeywords(){
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

	},
	function TestComments(){
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
		
	},
	function TestForLoop(){
		var input = "for(i:int = 0; i<10; i++){}"
		var parser = Lexer.parse(input);
		var expected = [
			{ type: 'kw', value: 'for', line: 0, column: 3 },                                                                                                                             
			{ type: 'punc', value: '(', line: 0, column: 4 },                                                                                                                             
			{ type: 'var', value: 'i', line: 0, column: 5 },                                                                                                                              
			{ type: 'type', value: 'int', line: 0, column: 9 },                                                                                                                           
			{ type: 'operator', value: '=', line: 0, column: 11 },                                                                                                                        
			{ type: 'number', value: '0', line: 0, column: 13 },                                                                                                                          
			{ type: 'punc', value: ';', line: 0, column: 14 },                                                                                                                            
			{ type: 'var', value: 'i', line: 0, column: 16 },                                                                                                                             
			{ type: 'operator', value: '<', line: 0, column: 17 },                                                                                                                        
			{ type: 'number', value: '10', line: 0, column: 19 },                                                                                                                         
			{ type: 'punc', value: ';', line: 0, column: 20 },                                                                                                                            
			{ type: 'var', value: 'i', line: 0, column: 22 },                                                                                                                             
			{ type: 'operator', value: '++', line: 0, column: 24 },                                                                                                                       
			{ type: 'punc', value: ')', line: 0, column: 25 },                                                                                                                            
			{ type: 'punc', value: '{', line: 0, column: 26 },                                                                                                                            
			{ type: 'punc', value: '}', line: 0, column: 27 }
		];
		var results = [];
		while(!parser.eof()){
			results.push(parser.next());
		}
		Expect(results).to.eql(expected)
	},
	function TestStrings(){
		var input = "a:string = \"This is a test of a string\";\nb:string = `this is also a string`;\nc:string = 'and so is this \n in fact it\\\'s a multiline\n string'"
		var parser = Lexer.parse(input);
		var expected = [
			{ type: 'var', value: 'a', line: 0, column: 1 },                                                                                                                              
			{ type: 'type', value: 'string', line: 0, column: 8 },                                                                                                                        
			{ type: 'operator', value: '=', line: 0, column: 10 },                                                                                                                        
			{ type: 'string', value: 'This is a test of a string', delimiter: '"' },
			{ type: 'punc', value: ';', line: 0, column: 40 },                                                                                                                            
			{ type: 'var', value: 'b', line: 1, column: 1 },                                                                                                                              
			{ type: 'type', value: 'string', line: 1, column: 8 },                                                                                                                        
			{ type: 'operator', value: '=', line: 1, column: 10 },                                                                                                                        
			{ type: 'string', value: 'this is also a string', delimiter: '`' },                                                                                                                                                           
			{ type: 'punc', value: ';', line: 1, column: 35 },                                                                                                                            
			{ type: 'var', value: 'c', line: 2, column: 1 },                                                                                                                              
			{ type: 'type', value: 'string', line: 2, column: 8 },                                                                                                                        
			{ type: 'operator', value: '=', line: 2, column: 10 },                                                                                                                        
			{ type: 'string', value: 'and so is this \n in fact it\\\'s a multiline\n string', delimiter: '\'' }
		];
		var results = [];
		while(!parser.eof()){
			results.push(parser.next());
		}
		Expect(results).to.eql(expected)
	},
	function TestSomething(){
		
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
		console.log(e);
		passed = false;
		failed ++;
		error = e;
	}
	var n = " ";
	while((t.name.length + n.length) < 32)
		n += '.';
	n = t.name + fgBlack.replace('%s', n);
	
	if(passed)
		console.log(n, fgGreen.replace('%s', "✓ Passed"));
	else
		console.log(n, fgRed.replace('%s', "✗ Failed"), "\nActual:", error.expected, "\nExpected:", error.actual);
}
console.log('')
if(!failed)
	console.log(fgGreen, "✓ Tests completed successfully.")
else
	console.log(bgRed, "✗ Tests completed with "+failed+" errors.")
console.log('');