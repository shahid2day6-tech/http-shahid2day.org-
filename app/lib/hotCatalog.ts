/** Requested live-action pins for homepage rails. */


export type MostWatchedTitle = { id: number; type: "movie" | "tv" };

/** GATE24 + famous titles pinned to the Most watched today / trending rail. */
export const MOST_WATCHED_TODAY: MostWatchedTitle[] = [
  { id: 323579, type: "tv" }, // GATE24: The Border
  { id: 1288445, type: "movie" }, // Mutiny (2026)
  { id: 1084244, type: "movie" }, // Toy Story 5
  { id: 108978, type: "tv" }, // Reacher
  { id: 95350, type: "tv" }, // Lanterns
  { id: 296206, type: "tv" }, // Agent Kim Reactivated
  { id: 125282, type: "tv" }, // The Cleaning Lady
  { id: 1408, type: "tv" }, // House
  { id: 63174, type: "tv" }, // Lucifer
  { id: 46952, type: "tv" }, // The Blacklist
  { id: 37680, type: "tv" }, // Suits
  { id: 71712, type: "tv" }, // The Good Doctor
  { id: 119051, type: "tv" }, // Wednesday
  { id: 71912, type: "tv" }, // The Witcher
  { id: 436270, type: "movie" }, // Black Adam
  { id: 95479, type: "tv" }, // Jujutsu Kaisen
  { id: 1402, type: "tv" }, // The Walking Dead
  { id: 111110, type: "tv" }, // One Piece (live action)
  { id: 71789, type: "tv" }, // SEAL Team
  { id: 129552, type: "tv" }, // The Night Agent
];

export const HOT_MOVIE_IDS: number[] = [
  1084199, // Companion
  10398, // Double Jeopardy
  216282, // Into the Storm (2014)
  3021, // 1408 (2007)
];

export const HOT_TV_IDS: number[] = [
  95350, // Lanterns
];
