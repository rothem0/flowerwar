export type Difficulty = 'easy' | 'normal' | 'hard';

export interface CardDifference {
  id: string;
  name: string; // e.g., '붉은 태양 크기', '기러기 마릿수'
  description: string;
  x: number; // 0 to 300 viewBox coordinate
  y: number; // 0 to 480 viewBox coordinate
  radius: number; // click hit radius in SVG viewBox units (generous ~40 for seniors)
  hintText: string;
}

export interface HwatuCard {
  id: string;
  month: number;
  title: string;
  subtitle: string;
  themeColor: string;
  story: string;
  differences: CardDifference[];
}

export interface FoundDifference {
  diffId: string;
  x: number;
  y: number;
  name: string;
}
