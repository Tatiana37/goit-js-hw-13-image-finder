import { getPictures } from "./services/apiService";
import cardTmp from './templates/cardTmp.hbs';
import * as basicLightbox from 'basiclightbox';
import { error, notice } from '../node_modules/@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/BrightTheme.css';



const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
}


const refs = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadMore: document.querySelector('.load-more')
};

const state = { page: 1, value: '' };
refs.loadMore.style.visibility = 'hidden';


refs.form.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);
refs.gallery.addEventListener('click', onOpenGallery);


async function onSearch(e) {

    e.preventDefault()
    refs.loadMore.style.visibility = 'hidden';
    const newValue = e.currentTarget.elements.query.value
    if (!newValue.trim()) {
        error({
            text: 'Please enter search word!',
            delay: 1000,
        })
        return;
    }

    try {
        state.value = newValue
        const pictures = await getPictures(state.value, state.page);
        refs.gallery.innerHTML = cardTmp(pictures);
        if (pictures.length > 11) {
            notice({
                title: `Downloading pictures...`,
                delay: 500,
        });
            refs.loadMore.style.visibility = 'visible';
        } if (!pictures.length) {
            error({
                text: `No matches found. Please enter correct query!!`,
                delay: 2000,
            });
            console.log('Nothing found');
        }
    } catch (error) {
        console.log(error.message);
    }
}


async function onLoadMore() {

    state.page += 1
    const pictures = await getPictures(state.value, state.page);
    refs.gallery.insertAdjacentHTML('beforeend', cardTmp(pictures));
    if (state.page === 2) {
        const observer = new IntersectionObserver(onLoadMore, options)
        observer.observe(refs.loadMore)
    }
//     refs.gallery.scrollIntoView({
//         behavior: 'smooth',
//         block: 'end',
// });
}

function onOpenGallery(e) {
    // window.addEventListener('keydown', onEscKeyPress);
    if (e.target.nodeName !== 'IMG') {
        return
    }
    basicLightbox.create(`
    <img src="${e.target.dataset.source}" width="800" height="600">
    `).show()
}

// function onEscKeyPress(e) {
//     const ESC_KEY_CODE = 'Escape';
//     if (e.code === ESC_KEY_CODE) {
//         basicLightbox.create(`
//     <img src="${e.target.dataset.source}" width="800" height="600">
//     `).close()
// };
//     }
    