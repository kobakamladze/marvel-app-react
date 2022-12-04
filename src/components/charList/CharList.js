import { Component } from 'react';
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

class CharList extends Component {
  state = {
    charactersList: [],
    queryParams: { limit: 9, offset: randomOffset + 210 },
    stage: {
      error: false,
      loading: true,
    },
    loadMoreButton: {
      loading: true,
    },
  };

  marvelService = new MarvelService();

  // Stage managment
  onError = () => this.setState({ stage: { error: true, loading: false } });
  onLoading = () => this.setState({ stage: { error: false, loading: true } });
  buttonOnLoading = () =>
    this.setState({
      loadMoreButton: {
        loading: true,
      },
    });

  // Fetching characters for list (by default 9)
  fetchMoreCharacters = () => {
    this.buttonOnLoading();

    return this.marvelService
      .fetchCharacters(this.state.queryParams)
      .then(response => {
        this.setState(({ charactersList, queryParams: { offset } }) => ({
          charactersList: [...charactersList, ...response],
          queryParams: {
            offset: offset + 9,
          },
          stage: { error: false, loading: false },
          loadMoreButton: {
            loading: false,
          },
        }));
      })
      .catch(() => this.onError());
  };

  // Fetching characters immediately when components is mounted
  componentDidMount = () => {
    this.onLoading();
    return this.fetchMoreCharacters();
  };

  render() {
    const { charactersList, stage, loadMoreButton } = this.state;

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
  }
}

export default CharList;
