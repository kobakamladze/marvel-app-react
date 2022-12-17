import { Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Transition from 'react-transition-group/Transition';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charInfo.scss';

// Creating element with photo and description of character
function BasicCharacterInfo({ data, mountState }) {
  if (!mountState) return null;

  // deep cloning of data recieved as a prop
  const clonedData = JSON.parse(JSON.stringify(data));
  const {
    name,
    description,
    thumbnail,
    urls: { charHomePage, charWikiPage },
    comics,
  } = clonedData;

  let descriptionToDisplay;
  if (description) {
    const splitDescription = description.split(' ');
    if (splitDescription.length >= 124) {
      descriptionToDisplay = splitDescription.splice(0, 124).join(' ');
    }
    descriptionToDisplay = description;
  }

  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt={name} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={charHomePage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={charWikiPage} className="button button__secondary">
              <div className="inner">wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">
        {descriptionToDisplay || 'No description for this character...'}
      </div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length
          ? comics.splice(0, 10).map(({ name, resourceURI }) => {
              const comicId = resourceURI.split('/').at(-1);
              return (
                <li className="char__comics-item" key={comicId}>
                  <Link to={`/comic/${comicId}`}>{name}</Link>
                </li>
              );
            })
          : 'No comics found for this character'}
      </ul>
    </>
  );
}

// Skeleton for loading
const CharacterInfoLoadingSkeleton = ({ initialTitle, mountState }) => {
  if (!mountState) return null;

  const title = initialTitle ? (
    <p
      style={{
        fontWeight: 'bold',
        fontSize: '18px',
        textAlign: 'center',
        margin: '5px 0 10px',
      }}
    >
      {initialTitle}
    </p>
  ) : null;

  return (
    <>
      {title}
      <Skeleton variant="circular" width={80} height={80} animation="wave" />
      <Skeleton
        style={{ margin: '15px 0' }}
        variant="rectangular"
        height={150}
        animation="wave"
      />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
    </>
  );
};

const LocalErrorMessage = ({ mountState }) => {
  if (!mountState) return null;
  return <ErrorMessage />;
};

// Main function component
const CharInfo = props => {
  // State
  const [chosenCharacter, setChosenCharacter] = useState(null);
  const [initialTitle, setInitialTitle] = useState(
    'Choose character from list on the left'
  );

  const { fetchSingleCharacter, loading, error } = useMarvelService();

  // State managment
  const onNewCharacterId = newCharacter => setChosenCharacter(newCharacter);

  // Update character
  const updateCharacterInfo = () => {
    if (!props.characterId) {
      return;
    }

    // Fetch clicked character, store it into state and stop loading
    // also call onError function if error occures
    return fetchSingleCharacter(props.characterId)
      .then(response => {
        setInitialTitle(null);
        return onNewCharacterId(response);
      })
      .catch(e => {
        throw e;
      })
      .finally();
  };

  // Updating character to display its info
  useEffect(() => {
    async function fetchData() {
      return await updateCharacterInfo();
    }
    fetchData();
    // eslint-disable-next-line
  }, [props.characterId]);

  const defaultStyles = { opacity: 0, transition: 'all 500ms ease' };
  const transitionStyles = {
    entering: { opacity: 1, transition: 'all 500ms ease' },
    entered: { opacity: 1, transition: 'all 500ms ease' },
    exiting: { opacity: 0, transition: 'all 500ms ease' },
    exited: { opacity: 0, transition: 'all 500ms ease' },
  };

  return (
    <div className="char__info">
      <Transition
        in={!loading && !error && Boolean(chosenCharacter)}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {state => (
          <div style={{ ...defaultStyles, ...transitionStyles[state] }}>
            <BasicCharacterInfo
              data={chosenCharacter}
              mountState={!loading && !error && Boolean(chosenCharacter)}
              loading={loading}
            />
          </div>
        )}
      </Transition>

      <Transition in={loading && !error} timeout={500}>
        {state => (
          <div style={{ ...defaultStyles, ...transitionStyles[state] }}>
            <CharacterInfoLoadingSkeleton
              initialTitle={initialTitle}
              mountState={loading && !error}
              mountOnEnter
              unmountOnExit
            />
          </div>
        )}
      </Transition>

      <Transition in={error} timeout={500} mountOnEnter unmountOnExit>
        {state => (
          <div style={{ ...defaultStyles, ...transitionStyles[state] }}>
            <LocalErrorMessage mountState={error} />
          </div>
        )}
      </Transition>
    </div>
  );
};

export default CharInfo;
