import './comicsList.scss';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@mui/material';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/spinner';

// Comic card
const ComicsListContent = ({ comicsList }) => {
  return (
    <ul className="comics__grid">
      {comicsList.map(({ id, title, thumbnail, price }, i) => (
        <li className="comics__item" key={i}>
          <Link to={`/comic/${id}`}>
            <img src={thumbnail} alt={title} className="comics__item-img" />
            <div className="comics__item-name">{title}</div>
            <div className="comics__item-price">
              {price ? `${price}$` : 'Unknown price...'}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

// Comic cards skeletton
const CardsSkeleton = () => {
  const customSkeleton = Array(8).fill(
    <Skeleton variant="rectangular" animation="wave" width={230} height={348} />
  );

  return <ul className="comics__grid">{customSkeleton}</ul>;
};

// Load more button component
const LoadMoreButton = ({ comicsList, loading, fetchMoreComics }) => {
  return comicsList.length < 30 && !loading ? (
    <button
      className="button button__main button__long"
      onClick={fetchMoreComics}
    >
      <div className="inner">load more</div>
    </button>
  ) : loading ? (
    <Spinner styleHeight={{ height: '80px' }} />
  ) : null;
};

// Generating random offset to fetch random comics
const randomOffsetForComics = Math.floor(Math.random() * (19000 - 9000) + 9000);

// Main component for rendering comics list
const ComicsList = () => {
  const [offset, setOffset] = useState(randomOffsetForComics);
  const [comicsList, setComicsList] = useState([]);
  const [initialFetch, setInitialFetch] = useState(false);

  const { loading, error, clearError, fetchComics } = useMarvelService();

  const fetchMoreComics = () => {
    clearError();
    return fetchComics({ limit: 8, offset })
      .then(response =>
        setComicsList(prevComicsList => [...prevComicsList, ...response])
      )
      .then(() => {
        setOffset(prevOffset => prevOffset + 8);
        setInitialFetch(() => true);
      })
      .catch(e => {
        throw e;
      })
      .finally();
  };

  useEffect(() => {
    async function fetchData() {
      return await fetchMoreComics();
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  const content =
    loading && !initialFetch ? (
      <CardsSkeleton />
    ) : error ? (
      <ErrorMessage />
    ) : (
      <ComicsListContent comicsList={comicsList} />
    );

  return (
    <div className="comics__list">
      {content}
      <LoadMoreButton
        comicsList={comicsList}
        fetchMoreComics={fetchMoreComics}
        loading={loading}
      />
    </div>
  );
};

export default ComicsList;
