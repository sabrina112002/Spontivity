import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function App() {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                const countryList = data.map(country => ({
                    name: country.name.common,
                    cca3: country.cca3,
                }));
                setCountries(countryList);
                setLoading(false);
            })
            .catch(error => {
                console.error("Fehler beim Abrufen der Länder:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Lädt...</Text>
                <StatusBar style="auto" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={countries}
                keyExtractor={(item) => item.cca3}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => router.push(`/${item.cca3}`)}>
                        <Text style={styles.item}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
    },
    item: {
        padding: 20,
        fontSize: 18,
        height: 44,
    },
});