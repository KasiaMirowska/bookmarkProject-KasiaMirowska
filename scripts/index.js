'use strict';

$(function(){
    bookmarklist.bundleFn();
    bookmarklist.render();
    api.getItems()
    .then(bookmarks =>{
        bookmarks.forEach((bookmark)=> Store.addNewBookmark(bookmark));
        bookmarklist.render();
    })
    .catch(error => {
        Store.errorMessage = error.message;
        render();
    });
});