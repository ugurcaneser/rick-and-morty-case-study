import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View>
        <Text className="text-3xl text-red-500">Rick & Morty Case Study App</Text>
      </View>
    </SafeAreaView>
  );
}
