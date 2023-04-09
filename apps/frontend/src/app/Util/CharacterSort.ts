import { getCharSheet } from '../Data/Characters'
import type { ArtCharDatabase } from '../Database/Database'
import i18n from '../i18n'
import type { CharacterKey, ElementKey, WeaponTypeKey } from '../Types/consts'
import {
  allElements,
  allWeaponTypeKeys,
  charKeyToCharName,
} from '../Types/consts'
import type { FilterConfigs, SortConfigs } from './SortByFilters'
export const characterSortKeys = [
  'new',
  'level',
  'rarity',
  'name',
  'favorite',
] as const
export type CharacterSortKey = (typeof characterSortKeys)[number]

export function characterSortConfigs(
  database: ArtCharDatabase
): SortConfigs<CharacterSortKey, CharacterKey> {
  return {
    new: (ck) => (database.chars.get(ck as CharacterKey) ? 0 : 1),
    name: (ck) =>
      i18n
        .t(`sillyWisher_charNames:${charKeyToCharName(ck, database.gender)}`)
        .toString(),
    level: (ck) => {
      const char = database.chars.get(ck as CharacterKey)
      return char ? char.level * (char.ascension + 1) : 0
    },
    rarity: (ck) => getCharSheet(ck, database.gender).rarity ?? 0,
    favorite: (ck) => (database.charMeta.get(ck).favorite ? 1 : 0),
  }
}

export const characterFilterKeys = [
  'element',
  'weaponType',
  'name',
  'new',
] as const
export type CharacterFilterKey = (typeof characterFilterKeys)[number]

export type CharacterFilterConfigs = FilterConfigs<
  CharacterFilterKey,
  CharacterKey
>
export function characterFilterConfigs(
  database: ArtCharDatabase
): CharacterFilterConfigs {
  return {
    element: (ck, filter) =>
      filter.includes(getCharSheet(ck, database.gender).elementKey),
    weaponType: (ck, filter) =>
      filter.includes(getCharSheet(ck, database.gender).weaponTypeKey),
    name: (ck, filter) =>
      filter === undefined ||
      i18n
        .t(`sillyWisher_charNames:${charKeyToCharName(ck, database.gender)}`)
        .toLowerCase()
        .includes(filter.toLowerCase()) ||
      i18n
        .t(`charNames_gen:${charKeyToCharName(ck, database.gender)}`)
        .toLowerCase()
        .includes(filter.toLowerCase()),
    new: (ck, filter) =>
      filter === undefined ||
      filter === (database.chars.get(ck as CharacterKey) ? 'no' : 'yes'),
  }
}

export const characterSortMap: Partial<
  Record<CharacterSortKey, CharacterSortKey[]>
> = {
  name: ['favorite', 'name'],
  level: ['favorite', 'level', 'rarity', 'name'],
  rarity: ['favorite', 'rarity', 'level', 'name'],
}

export const initialCharacterDisplayState = (): {
  sortType: CharacterSortKey
  ascending: boolean
  weaponType: WeaponTypeKey[]
  element: ElementKey[]
  pageIndex: number
} => ({
  sortType: characterSortKeys[0],
  ascending: false,
  weaponType: [...allWeaponTypeKeys],
  element: [...allElements],
  pageIndex: 0,
})
