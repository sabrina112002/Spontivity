import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const cardWidth = width - 30; // Abzüglich des Padding

// Definieren und Exportieren der Hauptkomponente der Seite
export default function ProfilePage() {
    const [favoriteCountries, setFavoriteCountries] = useState([]);
    const [loading, setLoading] = useState(true);

    // useEffect-Hook, der beim ersten Rendern der Komponente ausgeführt wird
    useEffect(() => {
        loadFavorites(); // Lädt die Favoriten aus dem AsyncStorage
    }, []);


    // Funktion zum Laden der Favoriten aus dem AsyncStorage
    const loadFavorites = async () => {
        try {
            // Abrufen der gespeicherten Favoriten
            const favorites = await AsyncStorage.getItem('favorites');
            if (favorites !== null) {
                // Parsen der JSON-Daten
                const favoriteCodes = JSON.parse(favorites);
                // Abrufen der Länderinformationen von der REST Countries API
                const countryPromises = favoriteCodes.map(code =>
                    fetch(`https://restcountries.com/v3.1/alpha/${code}`).then(response => response.json())
                );
                const countries = await Promise.all(countryPromises);
                // Aktualisieren des Zustands mit den abgerufenen Länderinformationen
                setFavoriteCountries(countries.map(country => country[0])); // Flattening the response structure
            }
        } catch (error) {
            console.error("Fehler beim Laden der Favoriten:", error); //Fehlerbehandlung
        } finally {
            setLoading(false); // Deaktivieren des Ladezustands
        }
    };

    // Funktion zum Entfernen eines Favoriten aus der Liste
    const removeFavorite = async (cca3) => {
        try {
            // Abrufen der gespeicherten Favoriten
            const favorites = await AsyncStorage.getItem('favorites');
            if (favorites !== null) {
                // Parsen der JSON-Daten
                let favoriteCountries = JSON.parse(favorites);
                // Filtern der Favoritenliste und Entfernen des ausgewählten Landes
                favoriteCountries = favoriteCountries.filter(code => code !== cca3);
                // Speichern der aktualisierten Favoritenliste
                await AsyncStorage.setItem('favorites', JSON.stringify(favoriteCountries));
                // Lokales Aktualisieren der Favoritenliste ohne Neu laden
                setFavoriteCountries(prevFavorites => prevFavorites.filter(country => country.cca3 !== cca3));
            }
        } catch (error) {
            console.error("Fehler beim Entfernen des Favoriten:", error); //Fehlerbehandlung
        }
    };

    // Funktion zum Neuladen der Favoritenliste
    const refreshPage = () => {
        setLoading(true); // Aktivieren des Ladezustands
        loadFavorites(); // Erneutes Laden der Favoriten
    };

    // Wenn der Ladezustand aktiv ist, wird ein Ladeindikator angezeigt
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Lädt...</Text>
            </View>
        );
    }

    // Hauptinhalt der Komponente
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
                    // @ts-ignore
                    // @ts-ignore
                    return (
                        <Card style={[styles.card, { width: cardWidth }]}>
                            <Card.Content>
                                <Text style={styles.header}>{item.name.common}</Text>
                                <View style={styles.infoItem}>
                                    <Icon name="location-city" size={24} color="#555" style={styles.icon} />
                                    <Text style={styles.value}>Capital: {item.capital ? item.capital[0] : 'Keine Hauptstadt'}</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Icon name="attach-money" size={24} color="#555" style={styles.icon} />
                                    <Text style={styles.value}>Currency: {Object.values(item.currencies).map(currency => currency.name).join(', ')}</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Icon name="language" size={24} color="#555" style={styles.icon} />
                                    <Text style={styles.value}>Language(s): {Object.values(item.languages).join(', ')}</Text>
                                </View>
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
        backgroundColor: '#f0f8ff',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    refreshButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
    },
    refreshButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: '#007bff',
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
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    icon: {
        marginRight: 10,
    },
    value: {
        fontSize: 18,
    },
});
