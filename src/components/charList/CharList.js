import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';

import ErrorMessage from '../errorMessage/errorMessage';
import Spinner from '../spinner/spinner';
import { Skeleton } from '@mui/material';

import './charList.scss';

// Card
function CharacterCard(props) {
  const {
    name,
    thumbnail,
    condition: { selected },
    onCharacterUpdate,
  } = props;

  const selectedClassName = selected ? 'char__item_selected' : null;

  return (
    <>
      <li className="char__item" onClick={onCharacterUpdate}>
        <img src={thumbnail} alt="abyss" />
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

// Main funciton component
const CharList = props => {
  const { fetchCharacters, loading, error } = useMarvelService();

  // States
  const [charactersList, setCharactersList] = useState([]);
  const [queryParams, setQueryParams] = useState({
    limit: 9,
    offset: randomOffset + 210,
  });

  // States managment

  // Fetching characters for list (by default 9)
  const fetchMoreCharacters = () => {
    return fetchCharacters(queryParams)
      .then(response => {
        setCharactersList(charactersList => [...charactersList, ...response]);
        setQueryParams(queryParams => ({
          ...queryParams,
          offset: queryParams.offset + 9,
        }));
      })
      .catch(() => {});
  };

  // Fetching characters immediately when component is mounted
  useEffect(() => {
    async function fetchData() {
      return await fetchMoreCharacters();
    }
    fetchData();
    // eslint-disable-next-line
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

  // Load more button render by loading status
  const loadMoreButtonCondition =
    charactersList.length < 18 && !loading ? (
      <button
        className="button button__main button__long"
        onClick={() => fetchMoreCharacters()}
      >
        <div className="inner">load more</div>
      </button>
    ) : loading ? (
      <Spinner styleHeight={{ height: '80px' }} />
    ) : null;

  const loadingElem = loading ? <CardsSkeleton /> : null;
  const content =
    !error && !loading ? (
      <ul className="char__grid">{cards}</ul>
    ) : error && !loading ? (
      <ErrorMessage />
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
