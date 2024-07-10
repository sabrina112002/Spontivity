import {SplashScreen, Tabs} from "expo-router";
import {useFonts} from "expo-font";
import {useEffect} from "react";
import {FontAwesome} from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
    const [loaded, error] = useFonts({
        'nunito-regular':require('../assets/fonts/Nunito-Regular.ttf'),
        'nunito-bold':require('../assets/fonts/Nunito-Bold.ttf'),
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    // Wenn die Schriftarten noch nicht geladen sind, wird nichts angezeigt
    if (!loaded) {
        return null;
    }

    return <TabsLayout />;
}
// Funktion zur Definition der Tabs
function TabsLayout() {
    return (
        <Tabs screenOptions={{
            headerStyle:{
                backgroundColor: 'blue',
            },
            headerTintColor: '#fff',

        }}>
            <Tabs.Screen name="(geoguide)" options={{
                headerShown: false,
                title: "GeoGuide",
                headerStyle:{
                    backgroundColor: 'blue',
                },
                headerTintColor: '#fff',
                tabBarIcon: ({color})=> <FontAwesome name="search" size={20} color={color}/>
            }}/>
            <Tabs.Screen name="profile" options={{
                headerTitle: "Favorites",
                title: "Favorites",
                tabBarIcon: ({color})=> <FontAwesome name="heart" size={20} color={color}/>
            }}/>
        </Tabs>
    )
}