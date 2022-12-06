import { Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/errorMessage';
import useComponentCondition from '../../hooks/componentConditionHook';

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
  const componentCondition = useComponentCondition();

  // State managment
  const onNewCharacterId = newCharacter => setChosenCharacter(newCharacter);

  // Update character
  const updateCharacterInfo = () => {
    // Show loading template
    componentCondition.startLoading();

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
        componentCondition.stopLoading();
      })
      .catch(() => componentCondition.onErrorSet());
  };

  // Updating character to display its info
  useEffect(() => {
    async function fetchData() {
      return await updateCharacterInfo();
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.characterId]);

  const { loadingValue, errorValue } = componentCondition;

  const content =
    !loadingValue && !errorValue && chosenCharacter ? (
      <>
        <BasicCharacterInfo data={chosenCharacter} />
        <ComicsList comicsList={chosenCharacter.comics} />
      </>
    ) : errorValue ? (
      <ErrorMessage />
    ) : (
      characterInfoLoadingSkeleton
    );

  return <div className="char__info">{content}</div>;
};

export default CharInfo;
