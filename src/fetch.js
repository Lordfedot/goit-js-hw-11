import axios from 'axios';

const API_KEY = '30996402-c54c41306985cfdc2f4f02212'
const URL = 'https://pixabay.com/api'
const OPTION = 'image_type=photo&orientation=horizontal&safesearch=true&per_page=40'
const axios = require('axios').default;

export class PhotoApiService{
    constructor(){
        this.searchQuery = ''
        this.page = 1
    }
    async fetchPhoto() {
        try {
            const response = await axios.get(`${URL}/?key=${API_KEY}&q=${this.searchQuery}&${OPTION}&page=${this.page}`)
            this.page +=1
            return response.data
        } catch (error) {
            console.log(error);
        }
    }

    resetPage(){
        this.page = 1
    }

    get query() {
        return this.searchQuery
    }
    set query(newQuery) {
        this.searchQuery = newQuery
    }

}