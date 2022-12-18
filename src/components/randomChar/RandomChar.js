import { useEffect, useState } from 'react';
import { Transition } from 'react-transition-group';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/spinner';

import useMarvelService from '../../services/MarvelService';

// Character
function CharacterStateRender({ character, mountState }) {
  if (!mountState) return null;

  const {
    name,
    description,
    thumbnail,
    urls: { charHomePage, charWikiPage },
  } = character;

  const descriptionToDisplay = description.split(' ').splice(0, 30).join(' ');

  return (
    <div className="randomchar__block">
      <img src={thumbnail} alt="Random character" className="randomchar__img" />
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">{descriptionToDisplay}</p>
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

const LocalErrorMessage = ({ mountState }) => {
  if (!mountState) return null;
  return <ErrorMessage />;
};

const LocalSpinner = ({ mountState }) => {
  if (!mountState) return null;
  return <Spinner />;
};

// Cut description if it contains more than 35 words
function descriptionViewManagment(description) {
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
            ? descriptionViewManagment(description)
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

  const defaultStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 0,
    transition: 'opacity 500ms ease',
  };
  const transitionStyles = {
    entering: { opacity: 1, width: 'auto' },
    entered: { opacity: 1, width: 'auto' },
    exiting: { opacity: 0, width: 0, height: 0 },
    exited: { opacity: 0, width: 0, height: 0 },
  };

  return (
    <div className="randomchar">
      <div>
        <Transition in={loading} timeout={500}>
          {state => {
            return (
              <div
                style={{
                  ...defaultStyles,
                  ...transitionStyles[state],
                }}
              >
                <LocalSpinner mountState={loading} />
              </div>
            );
          }}
        </Transition>

        <Transition in={!loading && !error} timeout={500}>
          {state => {
            return (
              <div
                style={{
                  ...defaultStyles,
                  ...transitionStyles[state],
                }}
              >
                <CharacterStateRender
                  character={character}
                  mountState={!loading && !error}
                />
              </div>
            );
          }}
        </Transition>

        <Transition in={error} timeout={500}>
          {state => {
            return (
              <div
                style={{
                  ...defaultStyles,
                  ...transitionStyles[state],
                }}
              >
                <LocalErrorMessage mountState={error} />
              </div>
            );
          }}
        </Transition>
      </div>

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
