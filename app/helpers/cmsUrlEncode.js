'use strict';
// @todo pending description, preconditions
// test not to include e.g. PDF
// new lines in regex
// make sure this work:
//  My [image](http://...) and your [image](http://...)

let imageCacheUrl = require('../models/gbifdata/apiConfig').image.url;

function appendImgCachePrefix(url) {
    return imageCacheUrl + url;
}

function extractAndEncodeUriMarkdown(text) {
    let regex = /\]\(http\:\/\/([a-z]+\.)?gbif(-dev|-uat)?\.org\/sites\/default\/files\/documents\/.*\.(png|PNG|jpg|JPG|jpeg|JPEG)/g;

    return text.replace(regex, function (match) {
        return '](' + appendImgCachePrefix(encodeURIComponent(match.substring(2)));
    });
}

// @todo merge in one function with extractAndEncodeUriMarkdown()
function extractAndEncodeUriHtml(text) {
    let regex = /src\=\"(http|https)\:\/\/([a-z]+\.)?gbif(-dev|-uat)?\.org\/sites\/default\/files\/.*\.(png|PNG|jpg|JPG|jpeg|JPEG)/g;

    return text.replace(regex, function (match) {
        return 'src="' + appendImgCachePrefix(encodeURIComponent(match.substring(5)));
    });
}

module.exports = {
    extractAndEncodeUriMarkdown: extractAndEncodeUriMarkdown,
    extractAndEncodeUriHtml: extractAndEncodeUriHtml,
    imageCacheUrl: imageCacheUrl,
    appendImgCachePrefix: appendImgCachePrefix
};