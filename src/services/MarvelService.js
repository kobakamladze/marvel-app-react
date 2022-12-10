import useHttp from '../hooks/http.hooks';

// class MarvelService {
//   _domain = 'https://gateway.marvel.com:443';
//   _apkikey = 'apikey=f3efb51bf799f47e431a63c43ee818ae';

//   fetchMarvelData = (url, limit, offset = 0) => {
//     let extraParams = '';
//     if (limit) {
//       extraParams = `&offset=${offset}&limit=${limit}`;
//     }

//     return axios
//       .get(`${this._domain}/${url}?${this._apkikey}${extraParams}`)
//       .then(({ data: response }) => response)
//       .catch(e => e)
//       .finally();
//   };

//   fetchCharacters = ({ limit = 9, offset }) =>
//     this.fetchMarvelData(`v1/public/characters`, limit, offset).then(
//       response => {
//         const responseWithFilteredProps = response.data.results.map(
//           ({
//             name,
//             id,
//             description,
//             thumbnail: { path, extension },
//             urls: [{ url: charHomePage }, { url: charWikiPage }],
//           }) => ({
//             name,
//             id,
//             description,
//             thumbnail: { path, extension },
//             urls: [{ url: charHomePage }, { url: charWikiPage }],
//             condition: { selected: false },
//           })
//         );

//         return responseWithFilteredProps;
//       }
//     );

//   fetchPreciseCharacter = id =>
//     this.fetchMarvelData(`v1/public/characters/${id}`).then(response => {
//       const {
//         name,
//         id,
//         description,
//         thumbnail: { path, extension },
//         urls: [{ url: charHomePage }, { url: charWikiPage }],
//         comics: { items: comics },
//       } = response.data.results[0];

//       return {
//         name,
//         id,
//         description,
//         thumbnail: `${path}.${extension}`,
//         urls: { charHomePage, charWikiPage },
//         comics,
//       };
//     });
// }

const useMarvelService = () => {
  const { loading, error, request, clearError } = useHttp();

  const _domain = 'https://gateway.marvel.com:443';
  const _apkikey = 'apikey=f3efb51bf799f47e431a63c43ee818ae';

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

  const fetchPreciseCharacter = id =>
    request(`${_domain}/v1/public/characters/${id}?${_apkikey}`)
      .then(response => _transformCharacter(response.results[0]))
      .catch(e => Promise.reject(e))
      .finally(() => {});

  const _transformCharacter = character => ({
    name: character.name,
    id: character.id,
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

  return { loading, error, clearError, fetchCharacters, fetchPreciseCharacter };
};

export default useMarvelService;
