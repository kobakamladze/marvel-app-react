import { Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Transition from 'react-transition-group/Transition';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charInfo.scss';

// Creating element with photo and description of character
function BasicCharacterInfo({
  data: {
    name,
    description,
    thumbnail,
    urls: { charHomePage, charWikiPage },
    comics,
  },
  loading,
}) {
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
      console.log(state); return (
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
const CharacterInfoLoadingSkeleton = ({ initialTitle }) => {
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

  // const content =
  //   !loading && !error && chosenCharacter ? (
  //     <BasicCharacterInfo data={chosenCharacter} loading={loading} />
  //   ) : error ? (
  //     <ErrorMessage />
  //   ) : (
  //     <CharacterInfoLoadingSkeleton initialTitle={initialTitle} />
  //   );

  // return <div className="char__info">{content}</div>;

  const transitionStyles = {
    entering: { opacity: 1, transiiton: 'all 200ms' },
    entered: { opacity: 1, transiiton: 'all 200ms' },
    exiting: { opacity: 0, transiiton: 'all 200ms' },
    exited: { opacity: 0, transiiton: 'all 200ms' },
  };

  return (
    <div className="char__info">
      <Transition in={!loading && !error && chosenCharacter}>
        {state => (
          <div style={{ ...transitionStyles[state] }}>
            <BasicCharacterInfo data={chosenCharacter} />
          </div>
        )}
      </Transition>
      <Transition in={error && !chosenCharacter}>
        {state => (
          <div style={{ ...transitionStyles[state] }}>
            <ErrorMessage />
          </div>
        )}
      </Transition>
      <Transition in={loading && !error && chosenCharacter}>
        {state => (
          <div style={{ ...transitionStyles[state] }}>
            <CharacterInfoLoadingSkeleton initialTitle={initialTitle} />
          </div>
        )}
      </Transition>
    </div>
  );
};

export default CharInfo;
