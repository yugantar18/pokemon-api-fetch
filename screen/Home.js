import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';

const Home = ({navigation}) => {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch(
          'https://pokeapi.co/api/v2/pokemon?limit=20',
        );
        const data = await response.json();

        const detailedPokemonPromises = data.results.map(async poke => {
          const res = await fetch(poke.url);
          const details = await res.json();

          const types = details.types
            .map(typeInfo => typeInfo.type.name)
            .join(', ');

          const stats = details.stats.map(typeInfo => typeInfo);
          //   console.log(stats);

          const sprites = details.sprites;
          // console.log(sprites);

          return {
            name: details.name,
            image: details.sprites.front_default,
            types: types,
            stats: stats,
            sprites: sprites,
          };
        });

        const detailedPokemon = await Promise.all(detailedPokemonPromises);
        setPokemon(detailedPokemon);
        setFilteredPokemon(detailedPokemon);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, []);

  const handleSearch = text => {
    setSearchQuery(text);
    if (text) {
      const filteredData = pokemon.filter(poke =>
        poke.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredPokemon(filteredData);
    } else {
      setFilteredPokemon(pokemon);
    }
  };

  const navigateToDetails = Details => {
    navigation.navigate('Details', {pokemon: Details});
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Pokémon"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredPokemon}
        renderItem={({item}) => (
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.card}
            onPress={() => navigateToDetails(item)}>
            <Image source={{uri: item.image}} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.types}>{item.types}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.name}
        numColumns={2}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    height: 50,
    margin: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: '44%',
    marginHorizontal: 12,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  types: {
    fontSize: 14,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
