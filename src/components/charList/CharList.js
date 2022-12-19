import { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/spinner';
import { Skeleton } from '@mui/material';

import './charList.scss';

// Cards skeleton
const CardsSkeleton = ({ stateMount }) => {
  if (!stateMount) return null;

  const skeletonCards = Array(6).fill(
    <Skeleton variant="rectangular" animation="wave" width={200} height={318} />
  );

  return (
    <div className="char__grid">
      <ul className="char__grid">
        {skeletonCards.map((card, i) => ({ ...card, key: i }))}
      </ul>
    </div>
  );
};

// Card
const CharacterCardsList = ({
  charactersList,
  onCharacterUpdate,
  stateMount,
}) => (
  <ul className="char__grid">
    <TransitionGroup component={null} mountOnEnter>
      {charactersList.map(
        ({ name, id, thumbnail, condition: { selected } }) => {
          const selectedClassName = selected ? 'char__item_selected' : '';

          return (
            <CSSTransition
              in={stateMount}
              key={id}
              timeout={{ enter: 250, exit: 500 }}
              classNames="char__item"
            >
              <li
                className={`char__item ${selectedClassName}`}
                onClick={() => onCharacterUpdate(id)}
              >
                <img src={thumbnail} alt="abyss" />
                <div className="char__name">{name}</div>
              </li>
            </CSSTransition>
          );
        }
      )}
    </TransitionGroup>
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

const LocalErrorMessage = ({ stateMount }) => {
  if (!stateMount) return null;
  return <ErrorMessage />;
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

  return (
    <div className="char__list">
      <LocalErrorMessage stateMount={error} />
      <CardsSkeleton stateMount={loading && !initialFetch} />

      <CharacterCardsList
        charactersList={charactersList}
        onCharacterUpdate={props.onCharacterUpdate}
        stateMount={!loading && !error && Boolean(charactersList.length)}
      />

      <LoadMoreButton
        loading={loading}
        charactersList={charactersList}
        fetchMoreCharacters={fetchMoreCharacters}
      />
    </div>
  );
};

export default CharList;
