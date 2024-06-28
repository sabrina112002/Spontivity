import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator} from 'react-native';
import {router} from "expo-router";



export default function HomePage() {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the countries data from the API
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                setCountries(data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    // @ts-ignore
    const renderItem = ({item}) => (
        <Pressable onPress={() => router.push(`1`)}>
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
            <FlatList
                data={countries}
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
    countryName: {
        fontSize: 18,
        padding: 10,
    },
});