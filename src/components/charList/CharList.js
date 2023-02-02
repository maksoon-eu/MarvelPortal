import './charList.scss';

import { useEffect, useState } from 'react';
import CharItem from '../charItem/CharItem';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spiner/Spinner';

const CharList = (props) => {
    const [itemList, setItemList] = useState([])
    const [activeChar, setActiveChar] = useState(null)
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [charEnded, setCharEnded] = useState(false)
    const [offset, setOffset] = useState(210)

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true)
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllCharacters(offset)
            .then(onCharLoaded)
    }

    const onCharLoaded = (newItemList) => {
        if (newItemList.length < 9) {
            setCharEnded(true)
        }

        setItemList(itemList => [...itemList, ...newItemList])
        setNewItemLoading(false)
        setOffset(offset => offset + 9)
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
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {list}
            <button 
                onClick={() => onRequest(offset, false)}
                disabled={newItemLoading}
                style={{'display' : charEnded ? 'none' : 'block'}}
                className="button button__main button__long">
                    <div className="inner">load more</div>
            </button>
        </div>
    )

}

export default CharList;