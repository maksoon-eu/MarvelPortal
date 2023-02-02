import {useHttp} from '../hooks/http.hook'

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp()

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=110dfe2c9e8265f41479aad92e417eb7';
    const _baseOffset = 210

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter)
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?&${_apiKey}`);
        return _transformCharacter(res.data.results[0])
    }

    const getComics = async (offset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics)
    }

    const _transformCharacter = (char) => {
        return {
            name: char.name,
            description: char.description === '' ? 'The description will appear soon!' : char.description,
            id: char.id,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const _transformComics = (comics) => {
        return {
            title: comics.title,
            id: comics.id,
            price: comics.prices.map(item => item.price),
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension
        }
    }

    return {loading, error, getAllCharacters, getCharacter, clearError, getComics}
}

export default useMarvelService;