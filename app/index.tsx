import { SafeAreaView } from "react-native-safe-area-context";
import { CharacterList } from "../components/CharacterList";
import { useCharacterStore } from "../store/useCharacterStore";
import { useEffect } from "react";

export default function App() {
  const fetchCharacters = useCharacterStore((state) => state.fetchCharacters);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <CharacterList />
    </SafeAreaView>
  );
}
