'use strict'
/*global cuid */


const bookmarklist = (function () {

    function ratingDisplay(ratingNum) {
        let htmlRating = [];
        for (let i = 1; i < 6; i++) {
            if (i <= ratingNum) {
                htmlRating.push('<span class="fa fa-star checked"></span>');
            } else {
                htmlRating.push('<span class="fa fa-star"></span>');
            }
        };
        return htmlRating.join('');
    }

    function generateBookmark(bookmark) {
        const rating = ratingDisplay(bookmark.rating);
        return `
        <li class='bookmark-element' data-id="${bookmark.id}">
            <p>TITLE : ${bookmark.title}</p>
            <div>
                <label for="rating" data-id="${bookmark.rating}">RATING: </label>
                ${rating}
            </div>
        
            <div class="bookmarks-controls">
                <button class="bookmark-details">
                    <span class="button-label">DETAILS</span>
                </button>
                <button class="bookmark-delete">
                    <span class="button-label">DELETE</span>
                </button>
            </div>
        </li>`
    }

    function gnenerateExpandedBookmark(bookmark) {
        const rating = ratingDisplay(bookmark.rating);
        return ` 
        <li class='bookmark-element' data-id="${bookmark.id}">
            <p>TITLE: ${bookmark.title}</p>
            <div>
                <label for="rating" data-id="${bookmark.rating}">RATING: </label>
                ${rating}
            </div>
            <label for='a href'>LINK: <br></label>
            <a href='${bookmark.url}'target="_blank">${bookmark.url}</a>
            <p>DESCRIPTION: ${bookmark.desc}</p>
            <div class="bookmarks-controls">
                <button class="bookmark-delete">
                    <span class="button-label">DELETE</span>
                </button>
                <button class="bookmark-collapse">
                <span class="button-label">COLLAPSE</span>
            </button>
            </div>
        </li>`
    }


    function generateSmallBookmarkList(bookmarks) {
        const tags = bookmarks.map(bookmark => {
            if (bookmark.expanded === true) {
                return gnenerateExpandedBookmark(bookmark);
            }
            return generateBookmark(bookmark);
        });
        return tags.join('');
    };

    function handleEnterFormClick() {
        $('#new-bookmark').on('click', (() => {
            $('#bookmarks-form').removeAttr('hidden');
        }))
    }


    function handleFormEntries() {
        $('#bookmarks-form').submit(function (event) {
            console.log(event);
            event.preventDefault();
            const newTagTitle = $('#title-entry').val();
            const newURL = $('#URL-entry').val()
            const desc = $('#desc-entry').val();
            const rating = $('input[name=stars]:checked').val();
            Store.ratingSort = null;
            clearingForm(event);
            saveNewBookmark(newTagTitle,newURL,rating,desc);
        })

    }
    function clearingForm(event){
        if (event) {
            console.log('here', event)
            $('#title-entry').val('');
            $('#URL-entry').val('');
            $('#desc-entry').val('');
            $('#bookmarks-form').attr('hidden', true);
            $('input[name=stars]').prop('checked', false);
            $('#star-choices').prop('selectedIndex',0);
        }
            
    }

    function saveNewBookmark(title, url, rating, desc){
        api.createItem(title, url, rating, desc)
                .then((newTag) => {
                    Store.addNewBookmark(newTag);
                    Store.errorMessage = null;
                    render();
                })
                .catch(error => {
                    Store.errorMessage = error.message;
                    render();
                  });
    }

    
    function handleFormCancel(){
        $('#bookmarks-form').on('click', '#cancel', (() => {
            $('#title-entry').val('');
            $('#URL-entry').val('');
            $('#desc-entry').val('');
            $('#bookmarks-form').attr('hidden', true);
            $('input[name=stars]').prop('checked', false);
        }));
    }


    function getBookmarkIdFromElement(bookmark) {
        console.log($(bookmark).closest('.bookmark-element').data('id'));
        return $(bookmark).closest('.bookmark-element').data('id');
    }

    function handleDetailsClick() {
        $('.bookmarks-list').on('click', '.bookmark-details', event => {
            const currentTagId = getBookmarkIdFromElement(event.currentTarget);
            Store.setBookmarkExpanded(currentTagId);
            render();
        });
    }
    function handleTagCollapse(){
        $('.bookmarks-list').on('click', '.bookmark-collapse', event => {
            const currentTagId = getBookmarkIdFromElement(event.currentTarget);
            Store.setBookmarkCollapsed(currentTagId);
            render();
        });
    }
    
    function handleDeleteClick() {
        $('.bookmarks-list').on('click', '.bookmark-delete', event => {
            const deletedTagId = getBookmarkIdFromElement(event.currentTarget);
            api.deleteItem(deletedTagId)
                .then(() => {
                    Store.findAndDelete(deletedTagId);
                    Store.errorMessage = null;
                    render();
                })
                .catch(error => {
                    Store.errorMessage = error.message;
                    render();
                });
        })
    }

    function handleRatingDropDownMenu() {
        $('#star-choices').change((event) => {
            const choice = $("#star-choices option:selected").attr('value');
            console.log(choice)
            Store.ratingSort = Number(choice);
            render();
        })
    }

    function ratingBookmarksSelection(bookmarks, rating) {
        return bookmarks.filter((bookmark) => bookmark.rating >= rating)
    }


    function render() {
        let { bookmarks, ratingSort, errorMessage } = Store;
        if (errorMessage){
            console.log(errorMessage);
            $('.js-error-message').text(errorMessage);
            $('.js-error-message').attr('hidden', false);
        }
        if (ratingSort) {
            bookmarks = ratingBookmarksSelection(bookmarks, ratingSort);
        }
        let tagsString = generateSmallBookmarkList(bookmarks);
        $('.bookmarks-list').html(tagsString);
    }


    function bundleFn() {
        handleFormEntries();
        handleFormCancel()
        handleDetailsClick();
        handleTagCollapse();
        handleEnterFormClick();
        handleDeleteClick();
        handleRatingDropDownMenu()
    }




    return {
        render,
        bundleFn,

    }




})();