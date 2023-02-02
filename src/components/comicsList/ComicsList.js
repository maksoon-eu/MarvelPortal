import './comicsList.scss';

import { useState, useEffect } from 'react';

import ComicsItem from '../comicsItem/ComicsItem'
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spiner/Spinner';
import AppBanner from '../appBanner/AppBanner';

const ComicsList = () => {
    const [itemList, setItemList] = useState([])
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [charEnded, setCharEnded] = useState(false)
    const [offset, setOffset] = useState(0)

    const {loading, error, getComics} = useMarvelService()

    useEffect(() => {
        onRequest(offset, true)
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getComics(offset)
            .then(onCharLoaded)
    }

    const onCharLoaded = (newItemList) => {
        if (newItemList.length < 8) {
            setCharEnded(true)
        }

        setItemList(itemList => [...itemList, ...newItemList])
        setNewItemLoading(false)
        setOffset(offset => offset + 9)
    }

    function renderItems(arr) {
        const list = arr.map(item => {
            let imgStyle = {'objectFit' : 'cover'}
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return <ComicsItem
                title={item.title} 
                thumbnail={item.thumbnail} 
                imgStyle={imgStyle} 
                price={item.price}
                key={item.id}/>
        })

        return (
            <ul className="comics__grid">
                {list}
            </ul>
        )
    }

    const list = renderItems(itemList)

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;


    return (
        <div className="comics__list">
            <AppBanner/>
            {list}
            {errorMessage}
            {spinner}
            <button 
                onClick={() => onRequest(offset, false)}
                disabled={newItemLoading}
                style={{'display' : charEnded ? 'none' : 'block'}} className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;