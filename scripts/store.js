'use strict'
/*global cuid */

const Store = (function () {

    const bookmarks = [];

    let errorMessage = null;
    let ratingSort = null;   //disable-line no-unused-vars
    
    const addNewBookmark = function(bookmark) {
        bookmark.expanded = false;
        bookmarks.push(bookmark);
    }

    const findById = function(id){
        return this.bookmarks.find(bookmark => bookmark.id === id)
    }
    
    const setBookmarkExpanded = function(id){
        const tag = this.findById(id);
        tag.expanded = true
    }
    
    const setBookmarkCollapsed = function(id){
        const tag = this.findById(id);
        tag.expanded = false
    }
    const findAndDelete = function(id){
       this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !==id);
        
    }
    
    let findAndUpdate=function(id, newData){
      let updatedTag = this.bookmarks.find(bookmark => bookmark.id === id);
      Object.assign(updatedItem, newData);
    }
    
    return {
        bookmarks,
        ratingSort,
        addNewBookmark,
        findById,
        setBookmarkExpanded,
        setBookmarkCollapsed,
        findAndDelete,
        errorMessage,
    }

})();