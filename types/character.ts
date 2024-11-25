export interface Character {
  id: number;
  name: string;
  image: string;
  episode: string[];
  episodeCount: number;
}

export interface CharacterResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}
