import Notiflix from 'notiflix';
import {PhotoApiService} from './fetch'
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import debounce from 'lodash.debounce'; 

const refs = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMore: document.querySelector('.load-more')
}
const photoApiService = new PhotoApiService()

refs.form.addEventListener('submit', onFormSubmit)
refs.loadMore.addEventListener('click', onLoadMoreClick)
window.addEventListener('scroll' , debounce(onSkroll,400))

function onSkroll(){
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    if (clientHeight + scrollTop >= scrollHeight - 5) {
        onLoadMoreClick()
    }
}

async function onFormSubmit(e) {
    e.preventDefault()
    refs.loadMore.classList.add('is-hidden')

    destroyMarkup()

    photoApiService.query = e.target.elements.searchQuery.value.trim()
    if (photoApiService.searchQuery === '') {
        refs.loadMore.classList.add('is-hidden')
        destroyMarkup()
        return
    }

    photoApiService.resetPage()
    photoApiService.resetSumHits()

    const data = await photoApiService.fetchPhoto()
    console.log(data);
    const array = data.hits
    photoApiService.sumHits = array.length
    if (array.length === 0) {
        refs.loadMore.classList.add('is-hidden')
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        return
    }

    buildPhoto(array);
    
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    
    if (array.length >= 40) {
        refs.loadMore.classList.remove('is-hidden')
    }
}

async function onLoadMoreClick() {
    try {
        const data = await photoApiService.fetchPhoto()
        const array = data.hits
        appendPhoto(array);
        console.log(photoApiService.sumHits);
        photoApiService.sumHits += array.length
        console.log(photoApiService.sumHits);
    } catch (error) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
        refs.loadMore.classList.add('is-hidden')
    }
}

function buildPhoto(array) {
    const markup = array.map(photo => createMarkUp(photo)).join('')
    refs.gallery.innerHTML = markup
    const gallery = new SimpleLightbox('.gallery a');
}

function appendPhoto(array) {
    const markup = array.map(photo => createMarkUp(photo)).join('');
    refs.gallery.insertAdjacentHTML('beforeend',markup)
    const gallery = new SimpleLightbox('.gallery a'); 
    gallery.refresh() 
}

function destroyMarkup() {
    refs.gallery.innerHTML = ''
}

function createMarkUp({webformatURL,largeImageURL,tags,likes,views,comments,downloads}) {
    return `<a class="gallery__image" href="${largeImageURL}">
    <div class="photo-card">
    <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>${likes}
      </p>
      <p class="info-item">
        <b>Views</b>${views}
      </p>
      <p class="info-item">
        <b>Comments</b>${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>${downloads}
      </p>
    </div>
    </div>
    </a>
    `
}
