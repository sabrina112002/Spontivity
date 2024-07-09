import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function App() {
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
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
                // alphabetic filter
                countryList.sort((a, b) => a.name.localeCompare(b.name));
                setCountries(countryList);
                setFilteredCountries(countryList);
                setLoading(false);
            })
            .catch(error => {
                console.error("Fehler beim Abrufen der Länder:", error);
                setLoading(false);
            });
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = countries.filter(country =>
            country.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCountries(filtered);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Lädt...</Text>
                <StatusBar style="auto" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Countries:</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search by country..."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredCountries}
                keyExtractor={(item) => item.cca3}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.itemContainer}
                        onPress={() => router.push(`/${item.cca3}`)}
                    >
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
        backgroundColor: '#f0f8ff',
        padding: 20,
        paddingTop: 50,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 18,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
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
    itemContainer: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 5, // Added to ensure there's space on the sides
        borderRadius: 10, // Increased for a more rounded appearance
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    item: {
        fontSize: 18,
        color: '#333',
    },
});
