var fs = require('fs');
var path = require('path');

var options = {};
process.argv.forEach(function (val, index, array) {
	if(index >= 2){
		var v;

		if(val.substr(0,2) == ("--")){ // long-form arg
			v = val.split("=");
			v[0] = v[0].substr(2);
			options[v[0]] = v[1] || true;

		}else if(val.substr(0,1) == ("-")){ // short-form arg
			v = val.substr(1).split('');
			for(var vv of v){
				options[vv] = true;
			}
		}else{ // path
			options.file = val;
		}
	}
});

var InputStream = (function(){
	function InputStream(input){
		this.pos = 0;
		this.line = 0;
		this.col = 0;
		this.input = input;
		this.lastLine = '';
	}

	InputStream.prototype.next = function() {
		var char = this.input.charAt(this.pos++);
		if(char == "\n")
			this.line++, this.col = 0, this.lastLine = '';
		else this.col++;
		this.lastLine += char;
		return char;
	}

	InputStream.prototype.peek = function() {
		return (this.input.charAt(this.pos));
	}

	InputStream.prototype.eof = function() {
		return (this.peek() === "");
	}

	InputStream.prototype.croak = function(msg) {
		var pointer = "";
		for(var i = 0; i<this.col-1; i++)
			pointer += "-";
		pointer += "^";
		console.error(`Error (line {this.line}, column {this.col}) : \n {this.lastLine} \n{pointer}\n{msg}`);
	}
	return InputStream;
})();
var Token = (function(){
	function Token(type, value){
		this.type = type;
		this.value = value;
		this.line = Token.input.line;
		this.column = Token.input.col;
	}
	return Token;
})();
var Tokenizer = (function(){

	function Tokenizer(inputStream){
		this.input = inputStream;
		this.keywords = ["Class", "+", "-", "~", "if", "else", "for", "while", "true", "false", "undefined", "null", "in", "of", "typeof", "new", "delete"];
		this.operators = /[+\-/*|\^<>&%=~]{1,2}/i;
		this.numChars = /[0-9]/;
		this.stringChars = /['"`]/;
		this.idChars = /[a-z0-9\$_&]/i;
		this.declarationChars = /[:]/;
		this.puncChars = /[,;!\{\}\[\]()\.]/i;
		this.isBuilding = true;
		this.current = null;
	}

	Tokenizer.prototype.readNext = function(){
		Token.input = this.input;
		this.readWhile(/\s/i);
		if(this.input.eof()) return null;

		var ch = this.input.peek();

		if(ch == '#'){
			this.readWhile(/[^\n]/); // skip to end of line
			return this.next(); // recurse to next token
		}

		if(this.stringChars.test(ch)){
			var read = true;
			var string = "";
			var delimiter = new RegExp(`[^${ch}]`);
			var isEscaped = new RegExp(`\\\\${ch}$`);
			//string += this.input.next();
			this.input.next();
			while(read){
				var fragment = this.readWhile(delimiter);
				string += fragment; // read til matching unescaped string delimiter
				read = isEscaped.test(fragment + this.input.peek());
				if(read) string += this.input.next();
				if(this.input.eof()){
					var err = `File ends before string is closed on line ${this.input.line} column ${this.input.col}`;
					throw new Error(err);
				}
			}
			this.input.next();
			//string += this.input.next();
			// TODO: do some ops on string, like escaping/unescaping chars
			return { type:"string", value:string, delimiter:ch };
		}

		if(this.numChars.test(ch)){
			var num = this.readWhile(this.numChars);
			// TODO: string to number, validate number;
			return new Token('number', num);
		}

		if(this.idChars.test(ch)){
			var id = this.readWhile(this.idChars);
			return new Token(this.keywords.indexOf(id) > -1 ? "kw" : "var", id);
		}

		if(this.puncChars.test(ch)){
			var punc = this.input.next();
			return new Token('punc', punc);
		}

		if(this.declarationChars.test(ch)){
			this.input.next(); // skip over type-declaration character
			this.readWhile(/\s+/); // and any following whitespace
			var decl = this.readWhile(this.idChars);
			return new Token('type', decl);
		}

		if(this.operators.test(ch)){
			var op = this.readWhile(this.operators);

			if(op.substr(0, 2) === "//"){
				this.readWhile(/[^\n]/);
				return this.next();

			}else if(op.substr(0, 2) === "/*"){ // read til matching "*/"
				var skip = true;
				while(skip){
					var token = this.input.next() + this.input.peek();
					if (token === "*/")
						skip = false;
					else if (this.input.eof()){
						return null;
					}
				}
				this.input.next();
				return this.next();
			}
			return new Token("operator", op);
		}

		throw new Error(`Unintelligible token on line ${this.input.line} column ${this.input.col}`);
	}

	Tokenizer.prototype.next = function(){
		var token = this.current;
		this.current = null;
		return token || this.readNext();
	}

	Tokenizer.prototype.peek = function(){
		return this.current || (this.current = this.next());
	}

	Tokenizer.prototype.eof = function(){
		return this.isBuilding && this.input.eof();
	}

	Tokenizer.prototype.croak = function(msg){
		this.input.croak(msg)
		this.isBuilding = false;
	}

	Tokenizer.prototype.readWhile = function(r){
		var s = '';
		while( !this.input.eof() && r.test(this.input.peek()) ){
			s += this.input.next();
		}
		return s;
	}

	return Tokenizer;
})();
var Tokenize = function(text){
	return new Tokenizer(new InputStream(text));
}

module.exports = {
	InputStream:InputStream,
	Tokenizer:Tokenizer,
	parse:Tokenize
}

if(!module.parent){
	if(!options.file)
		return console.log("usage:\nnode lexer.js /path/to/file");

	var tokenizer = Tokenize(String(fs.readFileSync(options.file)));

	while(!tokenizer.eof() && tokenizer.isBuilding){
		console.log((lastResult = tokenizer.next()));
	}
}
