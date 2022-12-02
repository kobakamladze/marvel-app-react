import { Skeleton } from '@mui/material';
import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/errorMessage';

import './charInfo.scss';

// Creating element with photo and description of character
function BasicCharacterInfo({
  data: {
    name,
    description,
    thumbnail,
    urls: { charHomePage, charWikiPage },
  },
}) {
  let descriptionToDisplay;
  if (description) {
    const splitDescription = description.split(' ');
    if (splitDescription.length >= 124) {
      descriptionToDisplay = splitDescription.splice(0, 124).join(' ');
    }
    descriptionToDisplay = description;
  }

  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt={name} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={charHomePage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={charWikiPage} className="button button__secondary">
              <div className="inner">wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">
        {descriptionToDisplay || 'No description for this character...'}
      </div>
    </>
  );
}

// Creating list of comics
function ComicsList({ comicsList }) {
  return (
    <>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comicsList.length
          ? comicsList.splice(0, 10).map(({ name, resourceURI }, i) => (
              <li className="char__comics-item" key={i}>
                <a href={resourceURI}>{name}</a>
              </li>
            ))
          : 'No comics found for this character'}
      </ul>
    </>
  );
}

// Skeleton for loading
const characterInfoLoadingSkeleton = (
  <>
    <Skeleton variant="circular" width={80} height={80} animation="wave" />
    <Skeleton
      style={{ margin: '15px 0' }}
      variant="rectangular"
      height={150}
      animation="wave"
    />
    <Skeleton animation="wave" />
    <Skeleton animation="wave" />
    <Skeleton animation="wave" />
  </>
);

class CharInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      character: null,
      stage: {
        error: false,
        loading: true,
      },
    };
  }

  // Stage managment
  onError = () => this.setState({ error: true, loading: false });
  onLoading = () =>
    this.setState(
      this.setState(state => ({
        ...state,
        stage: { error: false, loading: true },
      }))
    );

  marvelService = new MarvelService();

  // Update character
  updateCharacter = () => {
    // Show loading template
    this.onLoading();

    const { characterId } = this.props;
    if (!characterId) {
      return;
    }

    // Fetch clicked character, store it into state and stop loading
    // also call onError function if error occures
    return this.marvelService
      .fetchPreciseCharacter(this.props.characterId)
      .then(response =>
        this.setState(() => ({
          character: response,
          stage: {
            error: false,
            loading: false,
          },
        }))
      )
      .catch(() => this.onError());
  };

  // Updating character when component is mounted to display its info
  componentDidMount = () => this.updateCharacter();

  // Updating character to display its info
  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.characterId !== this.props.characterId)
      this.updateCharacter();
  };

  componentDidCatch = (error, errorInfo) => this.onError();

  render() {
    const {
      character,
      stage: { loading, error },
    } = this.state;

    const loadingElem = loading && !error ? characterInfoLoadingSkeleton : null;
    const errorElem = error ? <ErrorMessage /> : null;
    const content =
      !loading && !error && character ? (
        <>
          <BasicCharacterInfo data={character} />
          <ComicsList comicsList={character.comics} />
        </>
      ) : null;

    return (
      <div className="char__info">
        {loadingElem}
        {errorElem}
        {content}
      </div>
    );
  }
}

export default CharInfo;
