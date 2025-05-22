// copied and slightly modified from here: https://github.com/aiji42/zod-i18n/blob/main/packages/core/locales/de/zod.json

import { zodErrorTranslationsEn } from './zodTranslations.en'

export const zodErrorTranslationsDe = {
  errors: {
    invalid_type: (expected: string, received: string) =>
      `${expected} erwartet, ${received} erhalten`,
    invalid_type_received_undefined: 'Darf nicht leer sein',
    invalid_type_received_null: 'Darf nicht leer sein',
    invalid_literal: 'Ungültiger Literalwert, {{expected}} erwartet',
    unrecognized_keys: 'Unbekannte Schlüssel im Objekt: {{- keys}}',
    invalid_union: 'Ungültige Eingabe',
    invalid_union_discriminator:
      'Ungültiger Diskriminatorwert, {{- options}} erwartet',
    invalid_enum_value:
      "Ungültiger Enum-Wert. {{- options}} erwartet, '{{received}}' erhalten",
    invalid_arguments: 'Ungültige Funktionsargumente',
    invalid_return_type: 'Ungültiger Funktionsrückgabewert',
    invalid_date: 'Ungültiges Datum',
    custom: 'Ungültige Eingabe',
    invalid_intersection_types:
      'Schnittmengenergebnisse konnten nicht zusammengeführt werden',
    not_multiple_of: 'Zahl muss ein Vielfaches von {{multipleOf}} sein',
    not_finite: 'Zahl muss endlich sein',
    invalid_string: {
      email: 'Ungültige {{validation}}',
      url: 'Ungültige {{validation}}',
      uuid: 'Ungültige {{validation}}',
      cuid: 'Ungültige {{validation}}',
      regex: 'Ungültig',
      datetime: 'Ungültiger {{validation}}',
      startsWith: 'Ungültige Eingabe: muss mit "{{startsWith}}" beginnen',
      endsWith: 'Ungültige Eingabe: muss mit "{{endsWith}}" enden',
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
        inclusive: (minimum: string) =>
          `Muss mindestens ${minimum} Zeichen enthalten`,
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
        exact: 'Array muss genau {{maximum}} Element(e) enthalten',
        inclusive: 'Array darf höchstens {{maximum}} Element(e) enthalten',
        not_inclusive:
          'Array muss weniger als {{maximum}} Element(e) enthalten',
      },
      string: {
        exact: 'String muss genau {{maximum}} Zeichen enthalten',
        inclusive: 'String darf höchstens {{maximum}} Zeichen enthalten',
        not_inclusive: 'String muss weniger als {{maximum}} Zeichen enthalten',
      },
      number: {
        exact: 'Zahl muss genau {{maximum}} sein',
        inclusive: 'Zahl muss kleiner oder gleich {{maximum}} sein',
        not_inclusive: 'Zahl muss kleiner als {{maximum}} sein',
      },
      set: {
        exact: 'Ungültige Eingabe',
        inclusive: 'Ungültige Eingabe',
        not_inclusive: 'Ungültige Eingabe',
      },
      date: {
        exact: 'Datum muss genau {{- maximum, datetime}} sein',
        inclusive:
          'Datum muss kleiner oder gleich {{- maximum, datetime}} sein',
        not_inclusive: 'Datum muss kleiner als {{- maximum, datetime}} sein',
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
} satisfies typeof zodErrorTranslationsEn
