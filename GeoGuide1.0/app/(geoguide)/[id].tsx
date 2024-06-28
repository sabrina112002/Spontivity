import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function GeoGuideDetail() {
    const { cca3 } = useLocalSearchParams(); // Holen der Länderkennung aus den Parametern
    const [country, setCountry] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Daten für das ausgewählte Land abrufen
        fetch(`https://restcountries.com/v3.1/alpha/${cca3}`)
            .then(response => response.json())
            .then(data => {
                setCountry(data[0]); // API liefert ein Array zurück
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, [cca3]);

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

    // Extrahieren der gewünschten Informationen
    const { name, capital, currencies, languages } = country;
    const currencyNames = Object.values(currencies).map(currency => currency.name).join(', ');
    const languageNames = Object.values(languages).join(', ');

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{name.common}</Text>
            <Text>Hauptstadt: {capital ? capital[0] : 'Keine Hauptstadt'}</Text>
            <Text>Währung: {currencyNames}</Text>
            <Text>Sprache(n): {languageNames}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});