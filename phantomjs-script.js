console.log('welcome to phantomjs-script.js');

var page = require('webpage').create();
var fs = require('fs');
var _ = require('underscore');

var cookieJar = require('./secrets/cookie-jar');
phantom.cookies = cookieJar

// page.onAlert = function(msg) {
//   console.log(msg);
// };

function scrollToBottom() {
  page.evaluate(function() {
    window.document.body.scrollTop = window.document.body.scrollHeight;
  });
}

function scrollToBottomUntilHeightIsAtLeast(desiredHeight, ongoingCallback, finishedCallback) {
  var interval = setInterval(function() {
    var height = page.evaluate(function() {
      return document.body.scrollHeight;
    });
    console.log('height:', height);
    if (height < desiredHeight) {
      scrollToBottom();
      ongoingCallback();
    } else {
      clearInterval(interval);
      finishedCallback();
    }
  }, 500);
}

function clickOnMoreLinks() {
  page.evaluate(function() {
    function eventFire(el, etype){
      if (el.fireEvent) {
        el.fireEvent('on' + etype);
      } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
      }
    }

    var moreLinks = window.document.querySelectorAll('[data-sigil="more"]');
    _.map(moreLinks, function (link) { eventFire(link, 'click'); });
  });
}

function getDataForReasonablePosts() {
  var articleData = page.evaluate(function () {
    var streams = $('._4ikz');
    var articles = $(streams).find('._3ccb');
    var articleData = _.compact(_.map(articles, function (article) {
      if ($(article).find('.uiStreamSponsoredLink').length > 0) {
        return null;
      }
      var text = $(article).find(".userContent").text();
      if (text.length < 40) {
        return null;
      }
      var textHtml = $(article).find(".userContent").html();
      return {text: text, textHtml: textHtml}; //, html: $(article).html()};
    }))
    return articleData;
  });
  return articleData;
}

page.open('https://www.facebook.com/', function(status) {
  console.log("Status: " + status);
  page.injectJs('node_modules/underscore/underscore-min.js');
  page.injectJs('node_modules/jquery/dist/jquery.min.js');

  var interval = setInterval(function() {
    var postData = getDataForReasonablePosts();
    console.log(postData.length, 'posts');
    if (postData.length < 20) {
      scrollToBottom();
      clickOnMoreLinks();
    } else {
      clearInterval(interval);
      fs.write('madlibs.json', JSON.stringify(postData, null, 4), 'w');
      phantom.exit();
    }
  }, 500);
});
