import { useEffect, useState } from 'react';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import ErrorMessage from '../errorMessage/errorMessage';
import Spinner from '../spinner/spinner';

import useMarvelService from '../../services/MarvelService';

// Characters
function CharacterStateRender(response) {
  const {
    name,
    description,
    thumbnail,
    urls: { charHomePage, charWikiPage },
  } = response.characterData;

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

// Max CharId = 1011500
// Min CharId = 1010801
// Generates random number in range of (1010801, 1011500) for character ID
function generateRandomCharId() {
  const min = 1010801;
  const max = 1011500;
  return Math.floor(Math.random() * (max - min) + min);
}

const RandomChar = () => {
  const [character, setCharacter] = useState({});
  const { fetchSingleCharacter, loading, error, clearError } =
    useMarvelService();

  // Updating random character
  const updateRandomChar = () => {
    clearError();
    return fetchSingleCharacter(generateRandomCharId())
      .then(response => {
        const {
          name,
          description,
          thumbnail,
          urls: { charHomePage, charWikiPage },
        } = response;

        return setCharacter(() => ({
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
      })
      .finally(() => {});
  };

  // Updating random character immediately when component is mounted
  useEffect(() => {
    async function fetchData() {
      return await updateRandomChar();
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  const errorElem = error ? <ErrorMessage /> : null;
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
        <button className="button button__main" onClick={updateRandomChar}>
          <div className="inner">try it</div>
        </button>
        <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
      </div>
    </div>
  );
};

export default RandomChar;
