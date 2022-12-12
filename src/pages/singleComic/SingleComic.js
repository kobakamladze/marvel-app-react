import './singleComic.scss';
import { Link, useParams } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';

const ComicInfo = props => {
  const { title, description, pageCount, languages, thumbnail, price } =
    props.comic;
  const noDescription = (
    <p style={{ fontWeight: 'bold', fontSize: '20px' }}>
      No description for this character...
    </p>
  );

  return (
    <div className="single-comic">
      <img src={thumbnail} alt={title} className="single-comic__img" />
      <div className="single-comic__info">
        <h2 className="single-comic__name">{title}</h2>
        <p className="single-comic__descr">{description || noDescription}</p>
        <p className="single-comic__descr">pages: {pageCount || 'Unknown'}</p>
        <p className="single-comic__descr">Language: {languages}</p>
        <div className="single-comic__price">
          {price ? `${price}$` : 'Unknown'}
        </div>
      </div>
      <Link to="/comics" className="single-comic__back">
        Back to all
      </Link>
    </div>
  );
};

const CustomSkeleton = () => {
  return (
    <div className="single-comic">
      <div className="single-comic__img">
        <Skeleton animation="wave" height={450} width={293} />
      </div>
      <div className="single-comic__info">
        <Skeleton animation="wave" height={100} />
        <Skeleton animation="wave" height={20} />
        <Skeleton animation="wave" height={20} />
        <Skeleton animation="wave" height={20} />
      </div>
    </div>
  );
};

const SingleComic = () => {
  // Pulling
  const { comicId } = useParams();

  // State
  const [comic, setComic] = useState({});

  const { loading, error, clearError, fetchSingleComic } = useMarvelService();

  const fetchComic = () => {
    clearError();
    return fetchSingleComic(comicId)
      .then(response => setComic(() => response))
      .catch(e => {
        throw e;
      })
      .finally();
  };
  useEffect(() => {
    async function fetchData() {
      return await fetchComic();
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  return comic && !loading && !error ? (
    <ComicInfo comic={comic} />
  ) : loading && !error ? (
    <CustomSkeleton />
  ) : (
    <ErrorMessage />
  );
};

export default SingleComic;
