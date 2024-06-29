import {Stack} from 'expo-router'
export default function GeoGuideLayout(){
    return(
        <Stack screenOptions={{
            headerStyle:{
                backgroundColor: 'blue',
            },
            headerTintColor: '#fff',

        }}>
            <Stack.Screen name = "index" options={{
            headerTitle:"GeoGuide",
            title:"GeoGuide",}
            }/>
        <Stack.Screen name = "[id]" options={{
        headerTitle:"Details",
        title:"Details",}
        }/>
            </Stack>
    )
}