// critical libraries required in the project
import React, { useState } from "react";
import { View, Text, Image, FlatList, ActivityIndicator, TextInput, TouchableOpacity } from "react-native";
import { useCharacterStore } from "../store/useCharacterStore";
import { Character } from "../types/character";

// component to highlight searched text within character names
const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) {
    return <Text className="text-base font-normal text-gray-900">{text}</Text>;
  }

  // Split text into parts based on the search query for highlighting
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

  return (
    <Text className="text-base font-normal text-gray-900">
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

// main character list component

export const CharacterList = () => {
  const { filteredCharacters, isLoading, error, searchQuery, setSearchQuery } = useCharacterStore();
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [showDropdown, setShowDropdown] = useState(false);

  // toggle character selection and update the checkedItems state
  const toggleCheckbox = (id: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // to handle search input changes and clear selections when search is cleared
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setCheckedItems({});
    }
  };

  // get the list of currently selected characters
  const selectedCharacters = filteredCharacters.filter(char => checkedItems[char.id]);

  // Loading state ui
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" className="mb-2" />
        <Text className="text-gray-600 text-base">Loading characters...</Text>
      </View>
    );
  }

  // error state ui
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

  // render individual character item with checkbox
  const renderItem = ({ item }: { item: Character }) => (
    <TouchableOpacity
      onPress={() => toggleCheckbox(item.id)}
      className="bg-white border-b border-gray-100"
    >
      <View className="flex-row p-3 items-center">
        <View className="justify-center mr-2">
          <View className={`w-5 h-5 rounded border items-center justify-center ${checkedItems[item.id] ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
            {checkedItems[item.id] && (
              <Text className="text-white text-sm leading-none">✓</Text>
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
        <View className="relative">
          {/* Search input container with selected character tags */}
          <View className="bg-white h-12 rounded-xl shadow-sm flex-row items-center px-4 gap-1">
            <View className="flex-1 flex-row items-center overflow-hidden">
              {/* Display first 2 selected characters as tags */}
              {selectedCharacters.slice(0, 2).map(char => (
                <View key={char.id} className="bg-gray-100 rounded-lg flex-row items-center h-7 mr-1">
                  <Text className="text-gray-800 text-sm px-2">{char.name}</Text>
                  <TouchableOpacity
                    onPress={() => toggleCheckbox(char.id)}
                    className="h-7 px-2 items-center justify-center border-l border-gray-200"
                  >
                    <Text className="text-gray-600 text-sm">×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {selectedCharacters.length > 2 && (
                <Text className="text-gray-500 text-sm mr-2">+{selectedCharacters.length - 2} more</Text>
              )}
              <TextInput
                className="flex-1 text-base min-w-[120px]"
                placeholder={selectedCharacters.length === 0 ? "Search characters..." : ""}
                value={searchQuery}
                onChangeText={handleSearch}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                autoFocus
              />
            </View>
            {selectedCharacters.length > 0 && (
              <TouchableOpacity
                onPress={() => setShowDropdown(!showDropdown)}
                className="px-2 h-full justify-center"
              >
                <Text className="text-gray-600 text-lg">{showDropdown ? '▲' : '▼'}</Text>
              </TouchableOpacity>
            )}
          </View>

          {showDropdown && selectedCharacters.length > 0 && (
            <View className="absolute top-14 left-0 right-0 bg-white rounded-xl shadow-lg z-10 p-2">
              <Text className="text-gray-500 text-sm px-2 pb-2">Selected Characters ({selectedCharacters.length})</Text>
              <View className="flex-row flex-wrap gap-1">
                {selectedCharacters.map(char => (
                  <View key={char.id} className="bg-gray-100 rounded-lg flex-row items-center h-7">
                    <Text className="text-gray-800 text-sm px-2">{char.name}</Text>
                    <TouchableOpacity
                      onPress={() => toggleCheckbox(char.id)}
                      className="h-7 px-2 items-center justify-center border-l border-gray-200"
                    >
                      <Text className="text-gray-600 text-sm">×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

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
