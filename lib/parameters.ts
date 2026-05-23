import { safeWaterRanges } from '@/constants/parameters';

export function isTemperatureSafe(celsius: number) {
  const { min, max } = safeWaterRanges.temperatureCelsius;
  return celsius >= min && celsius <= max;
}
