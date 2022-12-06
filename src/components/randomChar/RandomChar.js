import { useEffect, useState } from 'react';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import ErrorMessage from '../errorMessage/errorMessage';
import Spinner from '../spinner/spinner';

import MarvelService from '../../services/MarvelService';
import useComponentCondition from '../../hooks/componentConditionHook';

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

const RandomChar = props => {
  const [character, setCharacter] = useState({});
  const componentCondition = useComponentCondition();

  const marvelService = new MarvelService();

  // Updating random character
  const updateRandomChar = () => {
    componentCondition.startLoading();
    return marvelService
      .fetchRandomCharacter()
      .then(response => {
        const {
          name,
          description,
          thumbnail,
          homePageUrl: charHomePage,
          wikiUrl: charWikiPage,
        } = response;

        setCharacter(() => ({
          name,
          description: description
            ? descriptionViewManament(description)
            : 'No description for this character...',
          thumbnail,
          urls: {
            charHomePage,
            charWikiPage,
          },
        }));

        componentCondition.stopLoading();
      })
      .catch(() => componentCondition.onErrorSet());
  };

  // Updating random character immediately when component is mounted
  useEffect(() => {
    async function fetchData() {
      return await updateRandomChar();
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loadingValue, errorValue } = componentCondition;

  const content =
    !loadingValue && !errorValue ? (
      <CharacterStateRender characterData={character} />
    ) : !errorValue && loadingValue ? (
      <Spinner />
    ) : (
      <ErrorMessage />
    );

  return (
    <div className="randomchar">
      {content}
      <div className="randomchar__static">
        <p className="randomchar__title">
          Random character for today!
          <br />
          Do you want to get to know him better?
        </p>
        <p className="randomchar__title">Or choose another one</p>
        <button className="button button__main" onClick={updateRandomChar}>
          <div className="inner">try it</div>
        </button>
        <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
      </div>
    </div>
  );
};

export default RandomChar;
