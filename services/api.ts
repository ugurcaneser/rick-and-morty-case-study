// service to hold the character model in the project

import { useQuery } from "@tanstack/react-query";
import { Character, CharacterResponse } from "../types/character";

const BASE_URL = "https://rickandmortyapi.com/api";

async function fetchAllCharacters(): Promise<Character[]> {
  let allCharacters: Character[] = [];
  let nextPage: string | null = `${BASE_URL}/character`;

  while (nextPage) {
    const response = await fetch(nextPage);
    const data: CharacterResponse = await response.json();

    const charactersWithEpisodeCount = data.results.map((character) => ({
      ...character,
      episodeCount: character.episode.length,
    }));

    allCharacters = [...allCharacters, ...charactersWithEpisodeCount];
    nextPage = data.info.next;
  }

  return allCharacters;
}

export function useCharacters() {
  return useQuery({
    queryKey: ["characters"],
    queryFn: fetchAllCharacters,
  });
}
