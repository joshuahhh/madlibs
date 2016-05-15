var nlp = require('nlp_compromise');
var _ = require('underscore');

function wordIndices(originalString, words) {
  var curIndex = 0;
  return words.map(function(word) {
    var wordIndex = originalString.indexOf(word, curIndex);
    curIndex = wordIndex + word.length;
    return wordIndex
  });
};

// `replacements` should be an array of {replaceWith, start, end} objects, ordered by `start`
function multiReplace(string, replacements) {
  var toReturn = "";
  var stringIndex = 0;
  var replacementIndex = 0;
  var count = 0;
  while (stringIndex < string.length && count < 10) {
    count++;
    // we're not done with the original string!

    if (replacementIndex < replacements.length) {
      // there are more replacements to make!
      var curReplacement = replacements[replacementIndex];

      if (curReplacement.start == stringIndex) {
        toReturn += curReplacement.replaceWith;
        stringIndex = curReplacement.end;
        replacementIndex += 1;
      } else {
        toReturn += string.slice(stringIndex, curReplacement.start);
        stringIndex = curReplacement.start;
      }

    } else {
      toReturn += string.slice(stringIndex, string.length);
      stringIndex = string.length;
    }
  }
  return toReturn;
};

var termSelectionProbability = (term) => {
    if (!term.text) {
        return 0;
    }

    if (term.pos.Pronoun || term.pos.Copula || term.pos.Infinitive || term.pos.Gerund) {
        return 0;
    } else if (term.pos.Verb) {
        return 0.15;
    } else if (term.pos.Noun) {
        return 0.15;
    } else if (term.pos.Adjective) {
        return 0.3;
    } else if (term.pos.Adverb) {
        return 0.1;
    } else {
        return 0;
    }
}

var posText = (pos) => {
    if (pos.Adjective) {
        return "adjective";
    }

    if (pos.Noun) {
        if (pos.Plural) {
            return "noun (plural)";
        } else {
            return "noun";
        }
    }

    if (pos.Verb) {
        if (pos.PastTense) {
            return "verb (past)";
        } else {
            return "verb";
        }
    }
}

module.exports = {
  madlibify: function (text) {
    // var text = "Always good for a laugh.  Montreal's mayor, angry at home delivery of mail being cut and replaced by community mailboxes, heard about a slab that was just poured at the edge of a park.  So he took a jackhammer to the situation, and did not mince words.";

    console.log('madlibify just got', text);
    var terms = nlp.text(text).terms()
    var termIndices = wordIndices(text, _.pluck(terms, 'text'))

    terms.forEach((term, i) => {
        term.index = termIndices[i];
        term.prob = termSelectionProbability(term);
        if (Math.random() < term.prob) {
            term.selected = true;
        }
    })

    var replacements = _.where(terms, {selected: true}).map((term) => ({
        replaceWith: '{' + posText(term.pos) + '}', //JSON.stringify(term.pos) + " (" + posText(term.pos) + ")",
        start: term.index,
        end: term.index + term.text.replace(/[.,]/, '').length
    }));

    return multiReplace(text, replacements);
  }
}
