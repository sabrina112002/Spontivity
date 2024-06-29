import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from "expo-router";

export default function HomePage() {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                // @ts-ignore
                const sortedCountries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
                setCountries(sortedCountries);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    // @ts-ignore
    const filteredCountries = countries.filter(country =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
    );

    // @ts-ignore
    const renderItem = ({ item }) => (
        <Pressable onPress={() => {
            console.log('Navigating to:', `/${item.cca3}`);
            router.push(`/${item.cca3}`);
        }}>
            <Text style={styles.countryName}>{item.name.common}</Text>
        </Pressable>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Countries List</Text>
            <TextInput
                style={styles.searchBar}
                placeholder="Search for a country..."
                value={search}
                onChangeText={setSearch}
            />
            <FlatList
                data={filteredCountries}
                keyExtractor={item => item.cca3}
                renderItem={renderItem}
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
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    searchBar: {
        width: '100%',
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
    },
    countryName: {
        fontSize: 18,
        padding: 10,
    },
});
