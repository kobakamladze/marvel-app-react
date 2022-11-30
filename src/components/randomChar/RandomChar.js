import { Component } from 'react';

import './randomChar.scss';
import errorIamge from '../../resources/img/error.png';
import mjolnir from '../../resources/img/mjolnir.png';
import ErrorMessage from '../errorMessage/errorMessage';
import Spinner from '../spinner/spinner';

import MarvelService from '../../services/MarvelService';

// Characters
function CharacterStateRender({ characterData }) {
  const {
    name,
    description,
    thumbnail,
    urls: { charHomePage, charWikiPage },
  } = characterData;

  return (
    <div className="randomchar__block">
      <img src={thumbnail} alt="Random character" className="randomchar__img" />
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">{description}</p>
        <div className="randomchar__btns">
          <a href={charHomePage} className="button button__main">
            <div className="inner">homepage</div>
          </a>
          <a href={charWikiPage} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
}

// Cut description if it contains more than 35 words
function descriptionViewManament(description) {
  const paragraphWordsAmount = description.split(' ');

  if (paragraphWordsAmount.length <= 35) {
    return description;
  }

  const paragraph = paragraphWordsAmount.splice(0, 35).join(' ');
  return `${paragraph}...`;
}

class RandomChar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      character: {},
      error: false,
      loading: true,
    };
  }

  marvelService = new MarvelService();

  // Stage managment
  onError = () => this.setState({ error: true, loading: false });
  onLoading = () => this.setState({ error: false, loading: true });

  // Updating random character
  updateRandomChar = () => {
    this.onLoading();

    return this.marvelService
      .fetchRandomCharacter()
      .then(response => {
        const {
          name,
          description,
          thumbnail,
          homePageUrl: charHomePage,
          wikiUrl: charWikiPage,
        } = response;

        return this.setState(() => ({
          character: {
            name,
            description: description
              ? descriptionViewManament(description)
              : 'No description for this character...',
            thumbnail,
            urls: {
              charHomePage: charHomePage,
              charWikiPage: charWikiPage,
            },
          },
          error: false,
          loading: false,
        }));
      })
      .catch(() => this.onError());
  };

  // Updating random character immediately when component is mounted
  componentDidMount = () => this.updateRandomChar();

  render() {
    const { character, loading, error } = this.state;

    const errorElem = error ? <ErrorMessage errorIamge={errorIamge} /> : null;
    const loadingElem = loading ? <Spinner /> : null;
    const characterView =
      !loading && !error ? (
        <CharacterStateRender characterData={character} />
      ) : null;
    const randomCharContent = characterView || loadingElem || errorElem;

    return (
      <div className="randomchar">
        {randomCharContent}

        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!
            <br />
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">Or choose another one</p>
          <button
            className="button button__main"
            onClick={this.updateRandomChar}
          >
            <div className="inner">try it</div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
        </div>
      </div>
    );
  }
}

export default RandomChar;
