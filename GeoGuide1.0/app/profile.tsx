import {View, Text, StyleSheet} from "react-native";


export default function ProfilePage(){
    return(
        <View style={styles.container}>
            <Text>Profile Screen</Text>
            <Text>Profile Screen</Text>
            <Text>Profile Screen</Text>
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