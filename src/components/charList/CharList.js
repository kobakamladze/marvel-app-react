import { useState, useEffect } from 'react';
import MarvelService from '../../services/MarvelService';

import ErrorMessage from '../errorMessage/errorMessage';
import Spinner from '../spinner/spinner';
import { Skeleton } from '@mui/material';

import './charList.scss';

// Card
function CharacterCard(props) {
  const {
    name,
    thumbnail: { path, extension },
    condition: { selected },
    onCharacterUpdate,
  } = props;

  const imageSrc = `${path}.${extension}`;
  const selectedClassName = selected ? 'char__item_selected' : null;

  return (
    <>
      <li className="char__item" onClick={onCharacterUpdate}>
        <img src={imageSrc} alt="abyss" />
        <div className={`char__name ${selectedClassName}`}>{name}</div>
      </li>
    </>
  );
}

// Cards skeleton
function CardsSkeleton() {
  return (
    <div className="char__grid">
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={200}
        height={318}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={200}
        height={318}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={200}
        height={318}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={200}
        height={318}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={200}
        height={318}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={200}
        height={318}
      />
    </div>
  );
}

// Button
function LoadMoreButton(props) {
  if (props.isLoading)
    return (
      <div>
        <Spinner styleHeight={{ height: '80px' }} />
      </div>
    );
  return (
    <button
      className="button button__main button__long"
      onClick={() => props.fetchMoreCharacters()}
    >
      <div className="inner">load more</div>
    </button>
  );
}

// Generating random offset
const randomOffset = Math.floor(Math.random() * (501 - 1) + 1);

// Class for fetching data
const marvelService = new MarvelService();

// Main funciton component
const CharList = props => {
  // States
  const [charactersList, setCharactersList] = useState([]);
  const [queryParams, setQueryParams] = useState({
    limit: 9,
    offset: randomOffset + 210,
  });
  const [stage, setStage] = useState({ error: false, loading: true });
  const [loadMoreButton, setLoadMoreButton] = useState({ loading: true });

  // States managment
  const onError = () => setStage({ error: true, loading: false });
  const onLoading = () => setStage({ error: false, loading: true });
  const buttonOnLoading = () =>
    setLoadMoreButton({
      loading: true,
    });

  // Fetching characters for list (by default 9)
  const fetchMoreCharacters = () => {
    buttonOnLoading();

    return marvelService
      .fetchCharacters(queryParams)
      .then(response => {
        setCharactersList(charactersList => [...charactersList, ...response]);
        setQueryParams(queryParams => ({
          ...queryParams,
          offset: queryParams.offset + 9,
        }));
        setStage({ error: false, loading: false });
        setLoadMoreButton({ loading: false });
      })
      .catch(() => onError());
  };

  // Fetching characters immediately when components is mounted
  useEffect(() => {
    onLoading();
    async function fetchData() {
      return await fetchMoreCharacters();
    }
    fetchData();
  }, []);

  //Creating cards of characrters for list
  const cards = charactersList.map(({ name, id, thumbnail, condition }) => (
    <CharacterCard
      key={id}
      name={name}
      id={id}
      thumbnail={thumbnail}
      condition={condition}
      onCharacterUpdate={() => props.onCharacterUpdate(id)}
    />
  ));

  const loadMoreButtonCondition =
    charactersList.length < 18 ? (
      <LoadMoreButton
        fetchMoreCharacters={fetchMoreCharacters}
        isLoading={loadMoreButton.loading}
      />
    ) : null;

  const errorElem = stage.error ? <ErrorMessage /> : null;
  const loadingElem = stage.loading ? <CardsSkeleton /> : null;
  const content =
    !stage.error && !stage.loading ? (
      <ul className="char__grid">{cards}</ul>
    ) : stage.error && !stage.loading ? (
      errorElem
    ) : (
      loadingElem
    );

  return (
    <div className="char__list">
      {content}
      {loadMoreButtonCondition}
    </div>
  );
};

export default CharList;
