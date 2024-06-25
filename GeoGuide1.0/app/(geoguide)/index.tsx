import {View, Text, StyleSheet, Pressable} from "react-native";
import {router} from "expo-router";
export default function HomePage(){
    return(
        <View style={styles.container}>
            <Text>HomeScreen</Text>
            <Pressable onPress={()=>router.push("1")}>
                <Text>Press me to see the Details of your selected Country!</Text>
            </Pressable>
        </View>
    )
}

interface Country {
    name: { common: string };
    capital: string[];
    languages: { [key: string]: string };
    currencies: { [key: string]: { name: string } };
    idd: { root: string; suffixes: string[] };
}

function App() {
    const [country, setCountry] = useState<string>('');
    const [countryData, setCountryData] = useState<Country | null>(null);
    const [savedCountries, setSavedCountries] = useState<Country[]>([]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCountry(event.target.value);
    };

    const handleSearch = async () => {
        if (country) {
            try {
                const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
                const data: Country[] = await response.json();
                setCountryData(data[0]);
            } catch (error) {
                console.error('Error fetching country data:', error);
            }
        }
    };

    const handleSave = () => {
        if (countryData) {
            const savedCountries: Country[] = JSON.parse(localStorage.getItem('savedCountries') || '[]');
            savedCountries.push(countryData);
            localStorage.setItem('savedCountries', JSON.stringify(savedCountries));
        }
    };

    const handleShowSaved = () => {
        const savedCountries: Country[] = JSON.parse(localStorage.getItem('savedCountries') || '[]');
        setSavedCountries(savedCountries);
    };

    return (
        <div className="App">
            <h1>GEO GUIDE</h1>
            <input
                type="text"
                value={country}
                onChange={handleInputChange}
                placeholder="Land eingeben"
            />
            <button onClick={handleSearch}>Suchen</button>
            {countryData && (
                <div>
                    <h2>{countryData.name.common}</h2>
                    <p>Hauptstadt: {countryData.capital.join(', ')}</p>
                    <p>Sprache: {Object.values(countryData.languages).join(', ')}</p>
                    <p>Währung: {Object.values(countryData.currencies).map(currency => currency.name).join(', ')}</p>
                    <p>Ländervorwahl: +{countryData.idd.root}{countryData.idd.suffixes[0]}</p>
                    <button onClick={handleSave}>Speichern</button>
                </div>
            )}
            <button onClick={handleShowSaved}>Gespeicherte Länder anzeigen</button>
            {savedCountries.length > 0 && (
                <div>
                    <h2>Gespeicherte Länder</h2>
                    {savedCountries.map((savedCountry, index) => (
                        <div key={index}>
                            <h3>{savedCountry.name.common}</h3>
                            <p>Hauptstadt: {savedCountry.capital.join(', ')}</p>
                            <p>Sprache: {Object.values(savedCountry.languages).join(', ')}</p>
                            <p>Währung: {Object.values(savedCountry.currencies).map(currency => currency.name).join(', ')}</p>
                            <p>Ländervorwahl: +{savedCountry.idd.root}{savedCountry.idd.suffixes[0]}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
