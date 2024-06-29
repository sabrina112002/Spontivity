import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function GeoGuideDetail() {
    const { cca3 } = useLocalSearchParams();
    console.log("CCA3 Parameter:", cca3); // Protokollieren des CCA3-Parameters

    const [country, setCountry] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (cca3) {
            fetch(`https://restcountries.com/v3.1/alpha/${cca3}`)
                .then(response => response.json())
                .then(data => {
                    console.log("API Response:", data); // Protokollieren der API-Antwort
                    setCountry(data[0]);
                    setLoading(false);
                })
                .catch(error => {
                    console.error(error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
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

    const { name, capital, currencies, languages } = country;
    // @ts-ignore
    const currencyNames = currencies ? Object.values(currencies).map(currency => currency.name).join(', ') : 'Keine Währung';
    const languageNames = languages ? Object.values(languages).join(', ') : 'Keine Sprache';

    // @ts-ignore
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
