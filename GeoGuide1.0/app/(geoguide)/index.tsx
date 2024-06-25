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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
