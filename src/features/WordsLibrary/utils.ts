import { DeckSize } from '@/features/GameSession/types';

export function parseRouteParameter(parameter: string | string[] | undefined) {
  return Array.isArray(parameter) ? parameter[0] : parameter;
}

export function parseDeckSizeRouteParameter(
  parameter: string | string[] | undefined,
  fallbackDeckSize: DeckSize,
) {
  const resolvedParameter = Number(parseRouteParameter(parameter));

  if (
    resolvedParameter === DeckSize.Six ||
    resolvedParameter === DeckSize.Ten ||
    resolvedParameter === DeckSize.Fifteen
  ) {
    return resolvedParameter;
  }

  return fallbackDeckSize;
}
