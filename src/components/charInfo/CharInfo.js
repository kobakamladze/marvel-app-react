import { Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/errorMessage';

import './charInfo.scss';

// Creating element with photo and description of character
function BasicCharacterInfo({
  data: {
    name,
    description,
    thumbnail,
    urls: { charHomePage, charWikiPage },
  },
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
    </>
  );
}

// Creating list of comics
function ComicsList({ comicsList }) {
  return (
    <>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comicsList.length
          ? comicsList.splice(0, 10).map(({ name, resourceURI }, i) => (
              <li className="char__comics-item" key={i}>
                <a href={resourceURI}>{name}</a>
              </li>
            ))
          : 'No comics found for this character'}
      </ul>
    </>
  );
}

// Skeleton for loading
const characterInfoLoadingSkeleton = (
  <>
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

// Class for fetching data
const marvelService = new MarvelService();

// Main function component
const CharInfo = props => {
  // State
  const [chosenCharacter, setChosenCharacter] = useState(null);
  const [stage, setStage] = useState({ error: false, loading: true });

  // State managment
  const onError = () => setStage({ error: true, loading: false });
  const onLoading = () => setStage({ error: false, loading: true });
  const onNewCharacterId = newCharacter => setChosenCharacter(newCharacter);

  // Update character
  const updateCharacterInfo = () => {
    // Show loading template
    onLoading();

    const { characterId } = props;
    if (!characterId) {
      return;
    }

    // Fetch clicked character, store it into state and stop loading
    // also call onError function if error occures
    return marvelService
      .fetchPreciseCharacter(props.characterId)
      .then(response => {
        onNewCharacterId(response);
        setStage({
          error: false,
          loading: false,
        });
      })
      .catch(() => onError());
  };

  // Updating character when component is mounted to display its info
  // eslint-disable-next-line
  useEffect(() => updateCharacterInfo, []);

  // Updating character to display its info
  useEffect(() => {
    async function fetchData() {
      return await updateCharacterInfo();
    }
    fetchData();
    // eslint-disable-next-line
  }, [props.characterId]);

  const loadingElem =
    stage.loading && !stage.error ? characterInfoLoadingSkeleton : null;
  const errorElem = stage.error ? <ErrorMessage /> : null;
  const content =
    !stage.loading && !stage.error && chosenCharacter ? (
      <>
        <BasicCharacterInfo data={chosenCharacter} />
        <ComicsList comicsList={chosenCharacter.comics} />
      </>
    ) : null;

  return (
    <div className="char__info">
      {loadingElem}
      {errorElem}
      {content}
    </div>
  );
};

export default CharInfo;
