import { Component } from 'react';
import MarvelService from '../../services/MarvelService';

import ErrorMessage from '../errorMessage/errorMessage';
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
    </div>
  );
}

// Button
function LoadMoreButton(props) {
  return (
    <button
      className="button button__main button__long"
      disabled={props.condition}
      onClick={() => props.fetchMoreCharacters()}
    >
      <div className="inner">load more</div>
    </button>
  );
}

// Generating random offset
const randomOffset = Math.floor(Math.random() * (501 - 1) + 1);

class CharList extends Component {
  state = {
    charactersList: [],
    queryParams: { limit: 9, offset: randomOffset + 210 },
    stage: {
      error: false,
      loading: true,
    },
    loadingButtonDisabled: false,
  };

  marvelService = new MarvelService();

  // Stage managment
  onError = () => this.setState({ stage: { error: true, loading: false } });
  onLoading = () => this.setState({ stage: { error: false, loading: true } });

  // Disable or enable button
  disableButton = () =>
    this.setState(state => ({ ...state, loadingButtonDisabled: true }));

  // Fetching characters for list (by default 9)
  fetchMoreCharacters = () => {
    this.disableButton();

    return this.marvelService
      .fetchCharacters(this.state.queryParams)
      .then(response =>
        this.setState(({ charactersList, queryParams: { offset } }) => ({
          charactersList: [...charactersList, ...response],
          queryParams: {
            offset: offset + 9,
          },
          stage: { error: false, loading: false },
          loadingButtonDisabled: false,
        }))
      )
      .catch(() => this.onError());
  };

  // Fetching characters immediately when components is mounted
  componentDidMount = () => {
    this.onLoading();
    return this.fetchMoreCharacters();
  };

  render() {
    const {
      charactersList,
      stage: { error, loading },
      loadingButtonDisabled,
    } = this.state;

    //Creating cards of characrters for list
    const cards = charactersList.map(({ name, id, thumbnail, condition }) => (
      <CharacterCard
        key={id}
        name={name}
        id={id}
        thumbnail={thumbnail}
        condition={condition}
        onCharacterUpdate={() => this.props.onCharacterUpdate(id)}
      />
    ));

    const loadMoreButtonCondition =
      charactersList.length < 18 ? (
        <LoadMoreButton
          fetchMoreCharacters={this.fetchMoreCharacters}
          condition={loadingButtonDisabled}
        />
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
