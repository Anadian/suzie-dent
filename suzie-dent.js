#!/usr/local/bin/node

const FileSystem = require('fs');

var input_string = process.argv[2];
var letters_array = input_string.split('');
var dictionary_string = FileSystem.readFileSync('./countdown-dictionary.txt', 'utf8');
letters_array.sort();

function PermutationMatch( sequence, letters_remaining, words ){
	//console.log(`PermutationMatch: ${sequence}, ${letters_remaining}`);
	//if( sequence.length >= 3 ) console.log(words);
	var _return = []; //proper matches
	var match_regex = null;
	var matches_array = [];
	var filtered_array = [];
	var submatches_array = [];
	var letter_removed = false;
	var test_sequence = '';
	for( var letter of letters_remaining ){
		test_sequence = (sequence + letter);
		//console.log(`letter: ${letter}, test_sequence: ${test_sequence}`);
		//if( sequence.length >= 3 ) console.log(words);
		//exact match
		match_regex = new RegExp( '^'+test_sequence+'$', 'm' ); 
		matches_array = words.match( match_regex );
		//if( sequence.length >= 3 ) console.log(matches_array);
		if( matches_array != null ){
			//console.log(`exact match: ${matches_array[0]}`);
			_return.push( matches_array[0] );
		}
		//sub-matches
		match_regex = new RegExp( '^'+test_sequence+'.*', 'gm' );
		matches_array = words.match( match_regex );
		//if( sequence.length >= 3 ) console.log(matches_array);
		if( matches_array != null ){
			//remaining_letters.reduce( (accumulator, value, index, source) => {
			letter_removed = false;
			filtered_array = letters_remaining.filter( (element) => {
				if( element === letter && letter_removed === false ){
					letter_removed = true;
					return false;
				} else{
					return true;
				}
			} );
			submatches_array = PermutationMatch( test_sequence, filtered_array, matches_array.join('\n') );
			if( submatches_array.length > 0 ){
				for( var submatch of submatches_array ){
					_return.push(submatch);
				}
			}
		}
	}
	return _return;
}

var matches = PermutationMatch( '', letters_array, dictionary_string );
matches.sort( (a, b) => {
	return (a.length - b.length);
} );
for( var match of matches ){
	console.log( match );
}
