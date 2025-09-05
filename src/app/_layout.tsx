import { View } from "react-native";
import SignUp from "../screens/signUp";
import "../../global.css";

export default function Layout(){
    return(
        <View className="flex-1">
            <SignUp />
        </View>
    )
}