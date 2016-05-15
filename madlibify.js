var text = "Always good for a laugh.  Montreal's mayor, angry at home delivery of mail being cut and replaced by community mailboxes, heard about a slab that was just poured at the edge of a park.  So he took a jackhammer to the situation, and did not mince words.";

var pos = require('pos');
var words = new pos.Lexer().lex(text);
var tagger = new pos.Tagger();
var taggedWords = tagger.tag(words);
for (var i in taggedWords) {
    var taggedWord = taggedWords[i];
    var word = taggedWord[0];
    var tag = taggedWord[1];
    console.log(word + " /" + tag);
}
