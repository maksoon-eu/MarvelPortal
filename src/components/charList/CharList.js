import './charList.scss';

import { useEffect, useState } from 'react';
import CharItem from '../charItem/CharItem';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spiner/Spinner';

const CharList = (props) => {
    const [itemList, setItemList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [activeChar, setActiveChar] = useState(null)
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [charEnded, setCharEnded] = useState(false)
    const [offset, setOffset] = useState(210)

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest()
    }, [])

    const onRequest = (offset) => {
        onCharListLoading();
        marvelService
            .getAllCharacters(offset)
            .then(onCharLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => {
        setNewItemLoading(true)
    }

    const onCharLoaded = (newItemList) => {
        let ended = false
        if (newItemList.length < 9) {
            ended = true
        }

        setItemList(itemList => [...itemList, ...newItemList])
        setLoading(false)
        setNewItemLoading(false)
        setCharEnded(ended)
        setOffset(offset => offset + 9)
    }

    const onError = () => {
        setError(true)
        setLoading(false)
    }

    const onActive = (id) => {
        setActiveChar(id)
    }

    function renderItems(arr) {
        const list = arr.map(item => {
            const styleChar = activeChar === item.id ? 'char__item-selected' : ''
            let imgStyle = {'objectFit' : 'cover'}
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return <CharItem 
                styleChar={styleChar}
                onActive={() => onActive(item.id)}
                onCharSelected={() => props.onCharSelected(item.id)} 
                name={item.name} 
                thumbnail={item.thumbnail} 
                imgStyle={imgStyle} 
                key={item.id}/>
        })

        return (
            <ul className="char__grid">
                {list}
            </ul>
        )
    }

    const list = renderItems(itemList)

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? list : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button 
                onClick={() => onRequest(offset)}
                disabled={newItemLoading}
                style={{'display' : charEnded ? 'none' : 'block'}}
                className="button button__main button__long">
                    <div className="inner">load more</div>
            </button>
        </div>
    )

}

export default CharList;