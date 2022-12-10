import { useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';
import { Link } from 'react-router-dom';
import SingleComic from '../singleComic/SingleComic';
import { useState } from 'react';
import { Skeleton } from '@mui/material';

// Comic card
const Comic = ({ comicsList }) => {
  return (
    <>
      {comicsList.map(({ id, title, thumbnail, price }) => (
        <li className="comics__item" key={id}>
          <Link to="#">
            <img src={thumbnail} alt={title} className="comics__item-img" />
            <div className="comics__item-name">{title}</div>
            <div className="comics__item-price">
              {price ? `${price}$` : 'Unknown price...'}
            </div>
          </Link>
        </li>
      ))}
    </>
  );
};

// Comic cards skeletton
const CardsSkeleton = () => {
  const customSkeleton = (
    <Skeleton variant="rectangular" animation="wave" width={200} height={318} />
  );

  return Array(8).fill(customSkeleton);
};

// Generating random offset to fetch random comics
const randomOffsetForComics = Math.floor(Math.random() * (19000 - 9000) + 9000);

// Main component for rendering comics list
const ComicsList = () => {
  const [offset, setOffset] = useState(randomOffsetForComics);
  const [comicsList, setComicsList] = useState([]);
  const [initialFetch, setInitialFetch] = useState(false);

  const { loading, error, clearError, fetchComics } = useMarvelService();

  const fetchComicsForList = () => {
    clearError();
    return fetchComics({ limit: 8, offset })
      .then(response =>
        setComicsList(prevComicsList => [...prevComicsList, ...response])
      )
      .then(() => {
        setOffset(prevOffset => prevOffset + 8);
        setInitialFetch(() => true);
      })
      .catch(() => {});
  };

  useEffect(() => {
    async function fetchData() {
      return await fetchComicsForList();
    }
    fetchData();
  }, []);

  const content =
    loading && !initialFetch ? (
      <CardsSkeleton />
    ) : (
      <Comic comicsList={comicsList} />
    );

  return (
    <div className="comics__list">
      <ul className="comics__grid">{content}</ul>
      <button
        className="button button__main button__long"
        onClick={fetchComicsForList}
      >
        <div className="inner">load more</div>
      </button>

      {/* TO DELETE */}
      <SingleComic />
    </div>
  );
};

export default ComicsList;
