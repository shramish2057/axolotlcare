export const safeWaterRanges = {
  temperatureCelsius: { min: 15, max: 20 },
  ammoniaPpm: { min: 0, max: 0 },
  nitritePpm: { min: 0, max: 0 },
  ph: { min: 6.5, max: 8.0 },
  ghDgh: { min: 7, max: 14 },
  khDkh: { min: 3, max: 8 },
} as const;
