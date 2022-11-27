import axios from 'axios';

const MARVEL_API_KEY = 'f3efb51bf799f47e431a63c43ee818ae';

class MarvelService {
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
      .get(url)
      .then(({ data: response }) => response)
      .catch(e => console.log(e))
      .finally();

  fetchCharacters = () =>
    this.fetchMarvelData(
      `https://gateway.marvel.com:443/v1/public/characters?apikey=${MARVEL_API_KEY}`
    ).then(response => {
      //   console.log(JSON.stringify(response.data));
      //   console.log(JSON.stringify(response.data.results.map(({ id }) => id)));
    });

  fetchRandomCharacter = () => {
    const characterId = this.getRandomCharId();

    return this.fetchMarvelData(
      `https://gateway.marvel.com:443/v1/public/characters/${characterId}?apikey=${MARVEL_API_KEY}`
    ).then(({ data }) => {
      if (data.results.length) return data.results[0];
    });
  };
}

export default MarvelService;
