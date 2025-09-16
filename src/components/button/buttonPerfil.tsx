import React from "react";
import { TouchableOpacity, Image } from "react-native";

import { router } from "expo-router";
import { useAuth } from "@/src/contexts/authContext";

export function ButtonPerfil() {
    const { user } = useAuth();
    const [ image ] = React.useState<string | null>(null);
  
    return(
        <TouchableOpacity onPress={() => {
            router.push('/(screens)/perfilUser');
        }}>

          <Image
            source={{ uri: image ?? user?.photo ?? 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg' }}
            className="
            w-14 
            h-14 
            mt-3
            rounded-full 
            border-4 
            border-blue-500"
          />
        </TouchableOpacity>
    );
}