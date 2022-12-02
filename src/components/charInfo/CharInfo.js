import { Skeleton } from '@mui/material';
import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/errorMessage';
import errorIamge from '../../resources/img/error.png';

import './charInfo.scss';

function BasicCharacterInfo({
  name,
  description,
  thumbnail,
  urls: { charHomePage, charWikiPage },
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
              <div className="inner"></div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{descriptionToDisplay}</div>
    </>
  );
}

function ComicsList({ comicsList }) {
  return (
    <>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comicsList.length ? (
          comicsList.splice(0, 10).map(({ name, resourceURI }) => (
            <li className="char__comics-item">
              <a href={resourceURI}>{name}</a>
            </li>
          ))
        ) : (
          <li className="char__comics-item">
            {'No comics found for this character'}
          </li>
        )}
      </ul>
    </>
  );
}

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
  onLoading = () => this.setState({ error: false, loading: true });

  marvelService = new MarvelService();

  // Update character
  updateCharacter = () => {
    const { characterId } = this.props;
    if (!characterId) {
      return;
    }

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

  render() {
    const {
      character,
      stage: { loading, error },
    } = this.state;

    console.log(
      JSON.stringify('STATED === ' + JSON.stringify(this.state.character))
    );

    const loadingElem =
      loading && !error ? (
        <>
          <Skeleton
            variant="circular"
            width={80}
            height={80}
            animation="wave"
          />
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
      ) : null;
    const errorElem = error ? <ErrorMessage errorIamge={errorIamge} /> : null;

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
