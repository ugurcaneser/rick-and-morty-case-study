import React, { useState } from "react";
import { View, Text, Image, FlatList, ActivityIndicator, TextInput, TouchableOpacity } from "react-native";
import { useCharacterStore } from "../store/useCharacterStore";
import { Character } from "../types/character";

const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) {
    return <Text className="text-xl font-normal text-gray-900">{text}</Text>;
  }

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  
  return (
    <Text className="text-xl font-normal text-gray-900">
      {parts.map((part, index) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <Text key={index} className="text-blue-600 font-normal">{part}</Text>
        ) : (
          <Text key={index}>{part}</Text>
        )
      )}
    </Text>
  );
};

export const CharacterList = () => {
  const { filteredCharacters, isLoading, error, searchQuery, setSearchQuery } = useCharacterStore();
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const toggleCheckbox = (id: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Eğer arama alanı boşaltılırsa seçimleri temizle
    if (!text.trim()) {
      setCheckedItems({});
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" className="mb-2" />
        <Text className="text-gray-600 text-base">Loading characters...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-4">
        <View className="bg-red-100 p-4 rounded-lg items-center">
          <Text className="text-red-800 text-lg font-semibold mb-1">
            Oops! Something went wrong
          </Text>
          <Text className="text-red-600 text-center">{error}</Text>
        </View>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Character }) => (
    <TouchableOpacity 
      onPress={() => toggleCheckbox(item.id)}
      className="bg-white border-b border-gray-100"
    >
      <View className="flex-row p-3 items-center">
        <View className="justify-center mr-2">
          <View className={`w-5 h-5 rounded border items-center justify-center ${checkedItems[item.id] ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
            {checkedItems[item.id] && (
              <Text className="text-white text-sm">✓</Text>
            )}
          </View>
        </View>
        <Image
          source={{ uri: item.image }}
          className="w-14 h-14 rounded-lg"
          resizeMode="cover"
        />
        <View className="flex-1 ml-3">
          <HighlightedText text={item.name} highlight={searchQuery} />
          <Text className="text-sm text-gray-500 mt-0.5">
            Episodes: {item.episodeCount}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <TextInput
          className="bg-white h-12 px-4 rounded-xl shadow-sm text-base"
          placeholder="Search characters..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoFocus
        />
        {searchQuery.trim() !== "" && filteredCharacters.length > 0 && (
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-gray-600">
              {filteredCharacters.length} character{filteredCharacters.length !== 1 ? 's' : ''} found
            </Text>
            <TouchableOpacity
              onPress={() => {
                const allIds = filteredCharacters.reduce((acc, char) => {
                  acc[char.id] = true;
                  return acc;
                }, {} as { [key: string]: boolean });
                setCheckedItems(allIds);
              }}
              className="bg-blue-500 px-3 py-1 rounded-lg"
            >
              <Text className="text-white font-medium">Select All</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <FlatList
        data={filteredCharacters}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
