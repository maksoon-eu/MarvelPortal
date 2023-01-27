import './charItem.scss'

const CharItem = ({name, thumbnail, imgStyle, id, onCharSelected}) => {
    return (
        <li onClick={onCharSelected} className="char__item" key={id}>
            <img src={thumbnail} alt={name} style={imgStyle}/>
            <div className="char__item-name">{name}</div>
        </li>
    );
};

export default CharItem;