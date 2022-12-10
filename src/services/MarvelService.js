import useHttp from '../hooks/http.hooks';

const useMarvelService = () => {
  const { loading, error, request, clearError } = useHttp();

  const _domain = 'https://gateway.marvel.com:443';
  const _apkikey = 'apikey=f3efb51bf799f47e431a63c43ee818ae';

  // Functions to fetch Characters
  const fetchCharacters = ({ limit = 9, offset }) => {
    let extraParams = '';
    if (limit) {
      extraParams = `&offset=${offset}&limit=${limit}`;
    }

    return request(
      `${_domain}/v1/public/characters?${_apkikey}${extraParams}`,
      limit,
      offset
    )
      .then(response => response.results.map(_transformCharacter))
      .catch(e => Promise.reject(e))
      .finally(() => clearError);
  };

  const fetchSingleCharacter = id =>
    request(`${_domain}/v1/public/characters/${id}?${_apkikey}`)
      .then(response => _transformCharacter(response.results[0]))
      .catch(e => Promise.reject(e))
      .finally(() => {});

  // Functions to fetch Comics
  const fetchComics = ({ limit = 8, offset }) => {
    let extraParams = '';
    if (limit) {
      extraParams = `&offset=${offset}&limit=${limit}`;
    }

    return request(
      `${_domain}/v1/public/comics?${_apkikey}${extraParams}`,
      limit,
      offset
    )
      .then(response => response.results.map(_transformComic))
      .catch(e => Promise.reject(e))
      .finally(() => clearError);

    // response.results.map(_transformCharacter)
  };

  // Transforming character
  const _transformCharacter = character => ({
    id: character.id,
    name: character.name,
    description: character.description,
    thumbnail: `${character.thumbnail.path}.${character.thumbnail.extension}`,
    urls: {
      charHomePage: character.urls[0].url,
      charWikiPage: character.urls[1].url,
    },
    comics: character.comics.items,
    // property for characters list
    condition: { selected: false },
  });

  const _transformComic = comic => ({
    id: comic.id,
    title: comic.title,
    description: comic.description,
    thumbnail: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
    price: comic.prices[0].price,
  });

  return {
    loading,
    error,
    clearError,
    fetchCharacters,
    fetchSingleCharacter,
    fetchComics,
  };
};

export default useMarvelService;
