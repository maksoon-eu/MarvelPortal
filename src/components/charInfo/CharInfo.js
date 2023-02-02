import './charInfo.scss';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import useMarvelService from '../../services/MarvelService';

import Spinner from '../spiner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

const CharInfo = (props) => {
    const [char, setChar]= useState(null)

    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])

    const updateChar = () => {
        const {charId} = props

        if (!charId) {
            return;
        }

        clearError()
        getCharacter(charId)
            .then(onCharLoaded)
    }

    const onCharLoaded = (char) => {
        setChar(char)
    }
    
    const skeleton = char || loading || error  ? null : <Skeleton/>
    const errorMessage = error ? <ErrorMessage/> : null
    const spinner = loading ? <Spinner/> : null
    const content =  !(loading || error || !char) ? <View char={char}/> : null


    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
    
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char
    const styleImg = thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ? {'objectFit' : 'unset'} : {'objectFit' : 'cover'}

    return (
        <>
            <div className="char__basics">
                <img style={styleImg} src={thumbnail} alt="abyss"/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length === 0 ? 'No comics featuring this character have been found' : null}
                
                {comics.map((item, i) => {
                    // eslint-disable-next-line
                    if (i > 10) return;
                    return (
                        <li key={i} className="char__comics-item">
                            <a className="char__comics-link" href={item.resourceURI}>{item.name}</a>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;