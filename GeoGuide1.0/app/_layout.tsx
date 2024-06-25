import {SplashScreen, Tabs} from "expo-router";
import {useFonts} from "expo-font";
import {useEffect} from "react";

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

    if (!loaded) {
        return null;
    }

    return <TabsLayout />;
}
function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="(geoguide)" options={{
                headerShown: false,
                title: "GeoGuide"
            }}/>
            <Tabs.Screen name="profile" options={{
                headerTitle: "Profile",
                title: "Profile"
            }}/>
        </Tabs>
    )
}