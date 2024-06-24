import {Stack} from 'expo-router'
export default function GeoGuideLayout(){
    return(
        <Stack>
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