import './charList.scss';
import abyss from '../../resources/img/abyss.jpg';

import { Component } from 'react';

import MarvelService from '../../services/MarvelService';

class CharList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      charactersList: [],
      queryParams: { limit: 9, offset: 0 },
    };
  }

  marvelService = new MarvelService();

  fetchCharactersToDisplay = () =>
    this.marvelService
      .fetchCharacters({ ...this.state.queryParams })
      .then(response => this.setState({ charactersList: response }));

  componentDidMount = () => this.fetchCharactersToDisplay();

  render() {
    return (
      <div className="char__list">
        <ul className="char__grid">
          <li className="char__item">
            <img src={abyss} alt="abyss" />
            <div className="char__name">Abyss</div>
          </li>
          <li className="char__item char__item_selected">
            <img src={abyss} alt="abyss" />
            <div className="char__name">Abyss</div>
          </li>
        </ul>
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
