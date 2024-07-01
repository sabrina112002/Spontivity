import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Card, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GeoGuideDetail() {
    const { id: cca3 } = useLocalSearchParams();
    console.log("CCA3 Parameter:", cca3); // Protokollieren des CCA3-Parameters

    const [country, setCountry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false); // Zustand für das Favoriten-Icon

    useEffect(() => {
        if (cca3) {
            fetch(`https://restcountries.com/v3.1/alpha/${cca3}`)
                .then(response => response.json())
                .then(data => {
                    console.log("API Response:", data); // Protokollieren der API-Antwort
                    if (data && data.length > 0) {
                        setCountry(data[0]);
                        checkFavoriteStatus(data[0].cca3);
                    } else {
                        console.error("Keine Daten gefunden für CCA3:", cca3);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Fehler beim Abrufen der Daten:", error);
                    setLoading(false);
                });
        } else {
            console.error("CCA3 Parameter nicht vorhanden");
            setLoading(false);
        }
    }, [cca3]);

    const checkFavoriteStatus = async (cca3) => {
        try {
            const favorites = await AsyncStorage.getItem('favorites');
            if (favorites) {
                const favoriteCountries = JSON.parse(favorites);
                setIsFavorite(favoriteCountries.includes(cca3));
            }
        } catch (error) {
            console.error("Fehler beim Abrufen der Favoriten:", error);
        }
    };

    const toggleFavorite = async () => {
        try {
            const favorites = await AsyncStorage.getItem('favorites');
            let favoriteCountries = favorites ? JSON.parse(favorites) : [];

            if (isFavorite) {
                favoriteCountries = favoriteCountries.filter(code => code !== cca3);
            } else {
                favoriteCountries.push(cca3);
            }

            await AsyncStorage.setItem('favorites', JSON.stringify(favoriteCountries));
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Fehler beim Speichern der Favoriten:", error);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Lädt...</Text>
            </View>
        );
    }

    if (!country) {
        return (
            <View style={styles.container}>
                <Text>Keine Daten gefunden</Text>
            </View>
        );
    }

    const { name, capital, currencies, languages } = country;
    const currencyNames = currencies ? Object.values(currencies).map(currency => currency.name).join(', ') : 'Keine Währung';
    const languageNames = languages ? Object.values(languages).join(', ') : 'Keine Sprache';

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.header}>{name.common}</Text>
                    <Text>Capital: {capital ? capital[0] : 'Keine Hauptstadt'}</Text>
                    <Text>Currency: {currencyNames}</Text>
                    <Text>Language(s): {languageNames}</Text>
                </Card.Content>
                <Card.Actions>
                    <IconButton
                        icon={isFavorite ? "heart" : "heart-outline"}
                        color={isFavorite ? "#f00" : "#000"}
                        size={30}
                        onPress={toggleFavorite}
                    />
                </Card.Actions>
            </Card>
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
    card: {
        width: '100%',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 4,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});