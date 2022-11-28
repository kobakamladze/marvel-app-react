import axios from 'axios';

class MarvelService {
  _domain = 'https://gateway.marvel.com:443';
  _apkikey = 'apikey=f3efb51bf799f47e431a63c43ee818ae';

  // Max CharId = 1011500
  // Min CharId = 1010801
  // Generates random number in range of (1010801, 1011500) for character ID
  getRandomCharId = () => {
    const min = Math.ceil(1010801);
    const max = Math.floor(1011500);
    return Math.floor(Math.random() * (max - min) + min);
  };

  fetchMarvelData = url =>
    axios
      .get(`${this._domain}/${url}?${this._apkikey}`)
      .then(({ data: response }) => response)
      .catch(e => e)
      .finally();

  fetchCharacters = () =>
    this.fetchMarvelData(`v1/public/characters`).then(response => {
      //   console.log(JSON.stringify(response));
      //   console.log(JSON.stringify(response.data.results.map(({ id }) => id)));
    });

  fetchRandomCharacter = () => {
    const characterId = this.getRandomCharId();

    return this.fetchMarvelData(`v1/public/characters/${characterId}`).then(
      response => {
        // if (response.status !== 'Ok') return Promise.resolve({ error: true });

        if (response.data.results.length) return response.data.results[0];
      }
    );
  };
}

export default MarvelService;
