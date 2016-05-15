var fs = require('fs');
var scraper = require('./scraper');
var madlibify = require('./madlibify');

module.exports = {
  turnCookiesIntoScrapedBits: function (cookies, callback) {
    fs.writeFileSync('secrets/cookie-jar.json', JSON.stringify(cookies, null, 4));
    scraper.scrapeFb(function (scrapedBits) {
      callback(scrapedBits);
    })
  },
  turnCookiesIntoFbPostData: function (cookies, callback) {
    fs.writeFileSync('secrets/cookie-jar.json', JSON.stringify(cookies, null, 4));
    scraper.scrapeFb(function (scrapedBits) {
      // TODO: madlib stuff;
      var toReturn, numBraces = 0;
      while (numBraces < 5) {
        toReturn = scrapedBits[Math.floor(Math.random() * scrapedBits.length)];
        // toReturn.madlib = "{emoji} his {noun}"; //madlibify.madlibify(toReturn.text);
        toReturn.madlib = madlibify.madlibify(toReturn.text);
        numBraces = ((toReturn.madlib.match(/{/g) || []).length);
      }
      callback(toReturn);
    })
  }
};
