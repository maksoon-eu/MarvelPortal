import './charItem.scss'

const CharItem = ({name, thumbnail, imgStyle, id, onCharSelected, onActive, styleChar}) => {
    return (
        <li onClick={() => {onCharSelected();onActive()}} className={`char__item ${styleChar}`} key={id}>
            <img src={thumbnail} alt={name} style={imgStyle}/>
            <div className="char__item-name">{name}</div>
        </li>
    );
};

export default CharItem;