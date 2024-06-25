import {View, Text, StyleSheet} from "react-native";



export default function GeoGuideDetail(){
    return(
        <View style={styles.container}>
            <Text>DetailScreen</Text>
            <Text>DetailScreen</Text>
            <Text>DetailScreen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
