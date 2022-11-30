import { Component } from 'react';

import MarvelService from '../../services/MarvelService';

import './charInfo.scss';
import thor from '../../resources/img/thor.jpeg';

function comicsList() {
  return (
    <li className="char__comics-item">
      All-Winners Squad: Band of Heroes (2011) #3
    </li>
  );
}

class CharInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCharacter: {
        id: 1011333,
      },
      stage: {
        error: false,
        loading: true,
      },
    };
  }

  marvelService = new MarvelService();

  fetchCharacter = id => this.marvelService.fetchPreciseCharacter(id);

  // Updating character ID to display its info
  updateSelectedCharacter = () => {
    this.setState(currentState => ({
      ...currentState,
      selectedCharacter: {
        id: this.props.characterId,
      },
    }));

    const {
      selectedCharacter: { id },
    } = this.state;

    if (id)
      return this.updateSelectedCharacter(this.state.selectedCharacter.id);
  };
  componentDidUpdate = (prevProps, prevState) => {
    console.log('{REV PROP CHARACTER ID === ' + prevProps.characterId);
    if (prevProps.characterId !== this.props.characterId) {
      this.setState(currentState => ({
        ...currentState,
        selectedCharacter: {
          id: this.props.characterId,
        },
      }));
    }
  };

  render() {
    const {
      selectedCharacter: { id },
    } = this.state;

    if (id) this.fetchCharacter(id);

    return (
      <div className="char__info">
        <div className="char__basics">
          <img src={thor} alt="abyss" />
          <div>
            <div className="char__info-name">thor</div>
            <div className="char__btns">
              <a href="#" className="button button__main">
                <div className="inner">homepage</div>
              </a>
              <a href="#" className="button button__secondary">
                <div className="inner">Wiki</div>
              </a>
            </div>
          </div>
        </div>
        <div className="char__descr">
          In Norse mythology, Loki is a god or jötunn (or both). Loki is the son
          of Fárbauti and Laufey, and the brother of Helblindi and Býleistr. By
          the jötunn Angrboða, Loki is the father of Hel, the wolf Fenrir, and
          the world serpent Jörmungandr. By Sigyn, Loki is the father of Nari
          and/or Narfi and with the stallion Svaðilfari as the father, Loki gave
          birth—in the form of a mare—to the eight-legged horse Sleipnir. In
          addition, Loki is referred to as the father of Váli in the Prose Edda.
        </div>
        <div className="char__comics">Comics:</div>
        <ul className="char__comics-list"></ul>
      </div>
    );
  }
}

export default CharInfo;
