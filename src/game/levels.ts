import { parseLevel } from "./parse-level";

export const prototypeLevel = parseLevel({
  id: "prototype-01",
  name: "Prototype 01",
  rows: [
    "#########",
    "#..G....#",
    "#..#..#.#",
    "#..C.C..#",
    "#.##.##.#",
    "#...P...#",
    "#..#..#.#",
    "#....G..#",
    "#########",
  ],
});

export const crossCurrentLevel = parseLevel({
  id: "cross-current",
  name: "Cross Current",
  rows: [
    "###########",
    "#..G......#",
    "#.###.###.#",
    "#.C.C..#..#",
    "#.#.#..#..#",
    "#.........#",
    "#..#..#.#.#",
    "#..##....G#",
    "#.###.###.#",
    "#........P#",
    "###########",
  ],
});

export const relaySpineLevel = parseLevel({
  id: "relay-spine",
  name: "Relay Spine",
  rows: [
    "###########",
    "#..G......#",
    "#.###.###.#",
    "#......#.C#",
    "#.#C#.##..#",
    "#.........#",
    "#.C##.#.#.#",
    "#..#....PG#",
    "#.###.###.#",
    "#..G......#",
    "###########",
  ],
});

export const campaignLevels = [prototypeLevel, crossCurrentLevel, relaySpineLevel];
