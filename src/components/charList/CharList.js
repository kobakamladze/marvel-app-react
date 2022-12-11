import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/spinner';
import { Skeleton } from '@mui/material';

import './charList.scss';

// Cards skeleton
const CardsSkeleton = () => {
  const customSkeleton = (
    <Skeleton variant="rectangular" animation="wave" width={225} height={345} />
  );
  return <div className="char__grid">{Array(6).fill(customSkeleton)}</div>;
};

// Card
const CharacterCardsList = ({ charactersList, onCharacterUpdate }) => (
  <ul className="char__grid">
    {charactersList.map(
      ({ name, id, thumbnail, condition: { selected } }, i) => {
        const selectedClassName = selected ? 'char__item_selected' : null;

        return (
          <li
            key={i}
            className="char__item"
            onClick={() => onCharacterUpdate(id)}
          >
            <img src={thumbnail} alt="abyss" />
            <div className={`char__name ${selectedClassName}`}>{name}</div>
          </li>
        );
      }
    )}
  </ul>
);

// Load more button component
const LoadMoreButton = ({ charactersList, loading, fetchMoreCharacters }) => {
  return charactersList.length < 18 && !loading ? (
    <button
      className="button button__main button__long"
      onClick={fetchMoreCharacters}
    >
      <div className="inner">load more</div>
    </button>
  ) : loading ? (
    <Spinner styleHeight={{ height: '80px' }} />
  ) : null;
};

// Generating random offset
const randomOffsetForCharacters = Math.floor(Math.random() * (501 - 1) + 1);

// Main funciton component
const CharList = props => {
  // States
  const [charactersList, setCharactersList] = useState([]);
  const [offset, setOffset] = useState(randomOffsetForCharacters + 210);
  const [initialFetch, setInitialFetch] = useState(false);

  const { fetchCharacters, loading, error } = useMarvelService();

  // Fetching characters for list (by default 9)
  const fetchMoreCharacters = () =>
    fetchCharacters({ limit: 9, offset })
      .then(response => {
        setCharactersList(charactersList => [...charactersList, ...response]);
        setOffset(prevOffset => prevOffset + 9);
        setInitialFetch(() => true);
      })
      .catch(e => {
        throw e;
      })
      .finally();

  // Fetching characters immediately when component is mounted
  useEffect(() => {
    async function fetchData() {
      return await fetchMoreCharacters();
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  const content =
    loading && !initialFetch ? (
      <CardsSkeleton />
    ) : !error ? (
      <CharacterCardsList
        charactersList={charactersList}
        onCharacterUpdate={props.onCharacterUpdate}
      />
    ) : error ? (
      <ErrorMessage />
    ) : null;

  return (
    <div className="char__list">
      {content}
      <LoadMoreButton
        loading={loading}
        charactersList={charactersList}
        fetchMoreCharacters={fetchMoreCharacters}
      />
    </div>
  );
};

export default CharList;
