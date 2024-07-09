import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
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
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Lädt...</Text>
            </View>
        );
    }

    if (!country) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Keine Daten gefunden</Text>
            </View>
        );
    }

    const { name, capital, currencies, languages } = country;
    const currencyNames = currencies ? Object.values(currencies).map(currency => currency.name).join(', ') : 'Keine Währung';
    const languageNames = languages ? Object.values(languages).join(', ') : 'Keine Sprache';

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>{name.common}</Text>
                </View>
                <Card.Content>
                    <View style={styles.infoContainer}>
                        <Text style={styles.label}>Capital:</Text>
                        <Text style={styles.value}>{capital ? capital[0] : 'Keine Hauptstadt'}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.label}>Currency:</Text>
                        <Text style={styles.value}>{currencyNames}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.label}>Language(s):</Text>
                        <Text style={styles.value}>{languageNames}</Text>
                    </View>
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
        backgroundColor: '#f0f8ff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: '#007bff',
    },
    errorText: {
        fontSize: 18,
        color: '#ff0000',
    },
    card: {
        width: '90%',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    headerContainer: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    infoContainer: {
        flexDirection: 'row',
        marginVertical: 8,
        marginTop: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: '#555',
        flex: 2,
    },
    value: {
        fontSize: 18,
        color: '#000',
        flex: 2,
    },
});
