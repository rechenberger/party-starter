// copied and slightly modified from here: https://github.com/aiji42/zod-i18n/blob/main/packages/core/locales/de/zod.json

import { zodErrorTranslationsEn } from './zodTranslations.en'

export const zodErrorTranslationsDe = {
  errors: {
    invalid_type: (expected: string, received: string) =>
      `${expected} erwartet, ${received} erhalten`,
    invalid_type_received_undefined: 'Darf nicht leer sein',
    invalid_type_received_null: 'Darf nicht leer sein',
    invalid_literal: (expected: string) =>
      `Ungültiger Wert, ${expected} erwartet`,
    unrecognized_keys: (keys: string) =>
      `Unbekannte Schlüssel im Objekt: ${keys}`,
    invalid_union: 'Ungültige Eingabe',
    invalid_union_discriminator: (options: string) =>
      `Ungültiger Diskriminatorwert, ${options} erwartet`,
    invalid_enum_value: (options: string, received: string) =>
      `Ungültiger Enum-Wert, ${options} erwartet, '${received}' erhalten`,
    invalid_arguments: 'Ungültige Funktionsargumente',
    invalid_return_type: 'Ungültiger Funktionsrückgabewert',
    invalid_date: 'Ungültiges Datum',
    custom: 'Ungültige Eingabe',
    invalid_intersection_types:
      'Schnittmengenergebnisse konnten nicht zusammengeführt werden',
    not_multiple_of: (multipleOf: string) =>
      `Zahl muss ein Vielfaches von ${multipleOf} sein`,
    not_finite: 'Zahl muss endlich sein',
    invalid_string: {
      email: (validation: string) => `Ungültige ${validation}`,
      url: (validation: string) => `Ungültige ${validation}`,
      uuid: (validation: string) => `Ungültige ${validation}`,
      cuid: (validation: string) => `Ungültige ${validation}`,
      regex: (_: string) => 'Ungültig',
      datetime: (validation: string) => `Ungültige ${validation}`,
      emoji: (validation: string) => `Ungültige ${validation}`,
      cuid2: (validation: string) => `Ungültige ${validation}`,
      ulid: (validation: string) => `Ungültige ${validation}`,
      ip: (validation: string) => `Ungültige ${validation}`,
      startsWith: (startsWith: string) =>
        `Ungültige Eingabe: muss mit "${startsWith}" beginnen`,
      endsWith: (endsWith: string) =>
        `Ungültige Eingabe: muss mit "${endsWith}" enden`,
    },
    too_small: {
      array: {
        exact: (minimum: string) =>
          `Muss genau ${minimum} Element(e) enthalten`,
        inclusive: (minimum: string) =>
          `Muss mindestens ${minimum} Element(e) enthalten`,
        not_inclusive: (minimum: string) =>
          `Muss mehr als ${minimum} Element(e) enthalten`,
      },
      string: {
        exact: (minimum: string) => `Muss genau ${minimum} Zeichen enthalten`,
        inclusive: (minimum: string) => {
          if (minimum === '1') {
            return 'Darf nicht leer sein.'
          }
          return `Muss mindestens ${minimum} Zeichen enthalten`
        },
        not_inclusive: (minimum: string) =>
          `Muss mehr als ${minimum} Zeichen enthalten`,
      },
      number: {
        exact: (minimum: string) => `Zahl muss genau ${minimum} sein`,
        inclusive: (minimum: string) =>
          `Zahl muss größer oder gleich ${minimum} sein`,
        not_inclusive: (minimum: string) =>
          `Zahl muss größer als ${minimum} sein`,
      },
      set: {
        exact: 'Ungültige Eingabe',
        inclusive: 'Ungültige Eingabe',
        not_inclusive: 'Ungültige Eingabe',
      },
      date: {
        exact: (minimum: string) => `Datum muss genau ${minimum} sein`,
        inclusive: (minimum: string) =>
          `Datum muss größer oder gleich ${minimum} sein`,
        not_inclusive: (minimum: string) =>
          `Datum muss größer als ${minimum} sein`,
      },
    },
    too_big: {
      array: {
        exact: (maximum: string) =>
          `Muss genau ${maximum} Element(e) enthalten`,
        inclusive: (maximum: string) =>
          `Darf höchstens ${maximum} Element(e) enthalten`,
        not_inclusive: (maximum: string) =>
          `Muss weniger als ${maximum} Element(e) enthalten`,
      },
      string: {
        exact: (maximum: string) => `Muss genau ${maximum} Zeichen enthalten`,
        inclusive: (maximum: string) =>
          `Darf höchstens ${maximum} Zeichen enthalten`,
        not_inclusive: (maximum: string) =>
          `Muss weniger als ${maximum} Zeichen enthalten`,
      },
      number: {
        exact: (maximum: string) => `Muss genau ${maximum} sein`,
        inclusive: (maximum: string) =>
          `Muss kleiner oder gleich ${maximum} sein`,
        not_inclusive: (maximum: string) => `Muss kleiner als ${maximum} sein`,
      },
      set: {
        exact: 'Ungültige Eingabe',
        inclusive: 'Ungültige Eingabe',
        not_inclusive: 'Ungültige Eingabe',
      },
      date: {
        exact: (maximum: string) => `Muss genau ${maximum} sein`,
        inclusive: (maximum: string) =>
          `Muss kleiner oder gleich ${maximum} sein`,
        not_inclusive: (maximum: string) => `Muss kleiner als ${maximum} sein`,
      },
    },
  },
  validations: {
    email: 'E-Mail-Adresse',
    url: 'URL',
    uuid: 'UUID',
    cuid: 'CUID',
    regex: 'Regex',
    datetime: 'Datums- und Uhrzeitwert',
    emoji: 'Emoji',
    cuid2: 'CUID2',
    ulid: 'ULID',
    ip: 'IP-Adresse',
  },
  types: {
    function: 'Funktion',
    number: 'Zahl',
    string: 'String',
    nan: 'NaN',
    integer: 'Ganzzahl',
    float: 'Gleitkommazahl',
    boolean: 'Boolean',
    date: 'Datum',
    bigint: 'Bigint',
    undefined: 'Undefined',
    symbol: 'Symbol',
    null: 'Nullwert',
    array: 'Array',
    object: 'Objekt',
    unknown: 'Unknown',
    promise: 'Promise',
    void: 'Void',
    never: 'Never',
    map: 'Map',
    set: 'Set',
  },
  custom: {
    auth: {
      confirmPasswordMismatch: `Passwörter stimmen nicht überein`,
      acceptTerms: `Sie müssen die Nutzungsbedingungen akzeptieren`,
    },
  },
} satisfies typeof zodErrorTranslationsEn
