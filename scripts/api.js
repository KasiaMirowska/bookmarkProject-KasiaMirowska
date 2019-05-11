'use strict';

const api = (function(){
    const BASE_URL = 'https://thinkful-list-api.herokuapp.com/KasiaMirowska/bookmarks';


    function baseFetchMethod(...args) {
        let error = null;
        return fetch(...args)
        .then(response => {
            if (!response.ok){
                error = { code: response.status};
            }
            return response.json();
        })
        .then(data => {
            if (error) {
                error.message = data.message;
                return Promise.reject(error)
            }
            return data;
        });
    }

    function getItems(){
        return baseFetchMethod(`${BASE_URL}`);
    }

    function createItem(title, url, rating, desc){
        let newTag= JSON.stringify({ title, url, rating, desc });
        const options = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json; charset=utf-8'
            }),
            body: newTag,
        }
        return baseFetchMethod(`${BASE_URL}`, options);
    }

    function deleteItem(id){
        const options = {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json; charset=utf-8'
            })
        };
        return baseFetchMethod(`${BASE_URL}/${id}`, options);
    }

    return {
        getItems,
        createItem,
        deleteItem,
    }
})();