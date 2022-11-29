import { Component } from 'react';
import MarvelService from '../../services/MarvelService';

import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import { Skeleton } from '@mui/material';

import './charList.scss';

// Card
function CharacterCard(props) {
  const {
    name,
    thumbnail: { path, extension },
    condition: { selected },
  } = props;

  const imageSrc = `${path}.${extension}`;
  const selectedClassName = selected ? 'char__item_selected' : null;

  return (
    <>
      <li className="char__item">
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
    </div>
  );
}

// Button
function LoadMoreButton(props) {
  return (
    <ul className="char__grid">
      <button
        className="button button__main button__long"
        onClick={() => props.function()}
      >
        <div className="inner">load more</div>
      </button>
    </ul>
  );
}

// Generating random offset
const randomOffset = Math.floor(Math.random() * (501 - 1) + 1);

class CharList extends Component {
  state = {
    charactersList: [],
    queryParams: { limit: 9, offset: randomOffset },
    stage: {
      error: false,
      loading: true,
    },
  };

  marvelService = new MarvelService();

  onError = () => this.setState({ stage: { error: true, loading: false } });
  onLoading = () => this.setState({ stage: { error: false, loading: true } });

  fetchMoreCharacters = () =>
    this.marvelService
      .fetchCharacters(this.state.queryParams)
      .then(response =>
        this.setState(({ charactersList, queryParams: { offset } }) => ({
          charactersList: [...charactersList, ...response],
          queryParams: {
            offset: offset + 9,
          },
          stage: { error: false, loading: false },
        }))
      )
      .catch(() => this.onError());

  componentDidMount = () => {
    this.onLoading();
    return this.fetchMoreCharacters();
  };

  render() {
    const {
      charactersList,
      stage: { error, loading },
    } = this.state;

    const cards = charactersList.map(({ name, id, thumbnail, condition }) => (
      <CharacterCard
        key={id}
        name={name}
        thumbnail={thumbnail}
        condition={condition}
      />
    ));

    const loadMoreButtonCondition =
      charactersList.length < 18 ? (
        <LoadMoreButton function={this.fetchMoreCharacters} />
      ) : null;

    const errorElem = error ? <ErrorMessage /> : null;
    const loadingElem = loading ? <CardsSkeleton /> : null;
    const content =
      !error && !loading ? (
        <ul className="char__grid">{cards}</ul>
      ) : error && !loading ? (
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
  }
}

export default CharList;
