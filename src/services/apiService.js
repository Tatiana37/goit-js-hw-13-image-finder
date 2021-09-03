import axios from 'axios';
import { async } from 'q';

const MY_API_KEY = '23191493-c555b110853d44812f8f12711';
axios.defaults.baseURL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal';


export async function getPictures(query, page) {
    const { data: { hits } } = await axios.get(`&q=${query}&page=${page}&per_page=12&key=${MY_API_KEY}`)
    
    return hits;
}
