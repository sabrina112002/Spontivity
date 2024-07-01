import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, IconButton } from 'react-native-paper';

const { width } = Dimensions.get('window');
const cardWidth = width - 32; // Abzüglich des Padding

export default function ProfilePage() {
    const [favoriteCountries, setFavoriteCountries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const favorites = await AsyncStorage.getItem('favorites');
            if (favorites !== null) {
                const favoriteCodes = JSON.parse(favorites);
                const countryPromises = favoriteCodes.map(code =>
                    fetch(`https://restcountries.com/v3.1/alpha/${code}`).then(response => response.json())
                );
                const countries = await Promise.all(countryPromises);
                setFavoriteCountries(countries.map(country => country[0])); // Flattening the response structure
            }
        } catch (error) {
            console.error("Fehler beim Laden der Favoriten:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (cca3) => {
        try {
            // Entfernen des Landes aus AsyncStorage
            const favorites = await AsyncStorage.getItem('favorites');
            if (favorites !== null) {
                let favoriteCountries = JSON.parse(favorites);
                favoriteCountries = favoriteCountries.filter(code => code !== cca3);
                await AsyncStorage.setItem('favorites', JSON.stringify(favoriteCountries));
                // Lokales Aktualisieren der Favoritenliste ohne Neu laden
                setFavoriteCountries(prevFavorites => prevFavorites.filter(country => country.cca3 !== cca3));
            }
        } catch (error) {
            console.error("Fehler beim Entfernen des Favoriten:", error);
        }
    };

    const refreshPage = () => {
        setLoading(true);
        loadFavorites();
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Lädt...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.refreshButton} onPress={refreshPage}>
                <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
            <FlatList
                data={favoriteCountries}
                keyExtractor={item => item.cca3}
                renderItem={({ item }) => {
                    if (!item || !item.name || !item.name.common) {
                        return null; // oder alternative Anzeige für fehlende Daten
                    }
                    return (
                        <Card style={[styles.card, { width: cardWidth }]}>
                            <Card.Content>
                                <Text style={styles.header}>{item.name.common}</Text>
                                <Text>Capital: {item.capital ? item.capital[0] : 'Keine Hauptstadt'}</Text>
                                <Text>Currency: {Object.values(item.currencies).map(currency => currency.name).join(', ')}</Text>
                                <Text>Language(s): {Object.values(item.languages).join(', ')}</Text>
                            </Card.Content>
                            <Card.Actions>
                                <IconButton
                                    icon="heart"
                                    color="#f00"
                                    size={30}
                                    onPress={() => removeFavorite(item.cca3)}
                                />
                            </Card.Actions>
                        </Card>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    refreshButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
    },
    refreshButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    card: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 4,
        marginBottom: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});