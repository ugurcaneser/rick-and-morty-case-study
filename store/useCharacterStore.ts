// store for managing character state

import { create } from 'zustand';
import { Character } from '../types/character';

interface CharacterState {
  characters: Character[];
  filteredCharacters: Character[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  fetchCharacters: () => Promise<void>;
  setSearchQuery: (query: string) => void;
}

// api base url

const BASE_URL = 'https://rickandmortyapi.com/api';

// character store

export const useCharacterStore = create<CharacterState>((set, get) => ({
  characters: [],
  filteredCharacters: [],
  searchQuery: '',
  isLoading: false,
  error: null,
  fetchCharacters: async () => {
    try {
      set({ isLoading: true, error: null });
      let allCharacters: Character[] = [];
      let nextPage: string | null = `${BASE_URL}/character`;

      while (nextPage) {
        const response: Response = await fetch(nextPage);
        if (!response.ok) {
          throw new Error('Failed to fetch characters');
        }
        const data: { 
          results: Character[], 
          info: { next: string | null } 
        } = await response.json();
        
        const charactersWithEpisodeCount = data.results.map((character: Character) => ({
          ...character,
          episodeCount: character.episode.length,
        }));
        
        allCharacters = [...allCharacters, ...charactersWithEpisodeCount];
        nextPage = data.info.next;
      }

      set({ 
        characters: allCharacters, 
        filteredCharacters: allCharacters,
        isLoading: false 
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  setSearchQuery: (query: string) => {
    const { characters } = get();
    const filtered = characters.filter(character =>
      character.name.toLowerCase().includes(query.toLowerCase())
    );
    set({ searchQuery: query, filteredCharacters: filtered });
  },
}));
