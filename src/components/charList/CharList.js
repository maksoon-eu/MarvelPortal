import './charList.scss';

import { Component } from 'react';
import CharItem from '../charItem/CharItem';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spiner/Spinner';

class CharList extends Component {
    state = {
        itemList: [],
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar()
    }

    onCharLoaded = (itemList) => {
        this.setState({
            itemList, 
            loading: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    updateChar = () => {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    renderItems(arr) {
        const list = arr.map(item => {
            let imgStyle = {'objectFit' : 'cover'}
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return <CharItem 
                onCharSelected={() => this.props.onCharSelected(item.id)} 
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

    render() {
        const {itemList, loading, error} = this.state;

        const list = this.renderItems(itemList)

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? list : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;