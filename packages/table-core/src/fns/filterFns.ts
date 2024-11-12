import type { RowData } from '../types/type-utils'
import type { TableFeatures } from '../types/TableFeatures'
import type { Row } from '../types/Row'
import type { FilterFn } from '../features/column-filtering/ColumnFiltering.types'

// Basic filters

/**
 * Filter function for checking if a value is exactly equal to a given value. (JS === comparison)
 */
export const filterFn_equals: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<any, any>,
  columnId: string,
  filterValue: unknown,
) => {
  return row.getValue(columnId) === filterValue
}

filterFn_equals.autoRemove = (val: any) => testFalsy(val)

/**
 * Filter function for checking if a value is weakly equal to a given value. (JS == comparison)
 */
export const filterFn_weakEquals: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<any, any>,
  columnId: string,
  filterValue: unknown,
) => {
  return row.getValue(columnId) == filterValue
}

filterFn_weakEquals.autoRemove = (val: any) => testFalsy(val)

// String filters

/**
 * Filter function for checking if a string includes a given substring. (Case-sensitive)
 */
export const filterFn_includesStringSensitive: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<any, any>,
  columnId: string,
  filterValue: string,
) => {
  return Boolean(
    row.getValue<string | null>(columnId)?.toString().includes(filterValue),
  )
}

filterFn_includesStringSensitive.autoRemove = (val: any) => testFalsy(val)

/**
 * Filter function for checking if a string includes a given substring. (Non-case-sensitive)
 */
export const filterFn_includesString: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<any, any>,
  columnId: string,
  filterValue: string,
) => {
  return Boolean(
    row
      .getValue<string | null>(columnId)
      ?.toString()
      .toLowerCase()
      .includes(filterValue.toString().toLowerCase()),
  )
}

filterFn_includesString.autoRemove = (val: any) => testFalsy(val)

/**
 * Filter function for checking if a string is exactly equal to a given string. (Non-case-sensitive)
 */
export const filterFn_equalsString: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<any, any>,
  columnId: string,
  filterValue: string,
) => {
  return (
    row.getValue<string | null>(columnId)?.toString().toLowerCase() ===
    filterValue.toLowerCase()
  )
}

filterFn_equalsString.autoRemove = (val: any) => testFalsy(val)

// Number filters

/**
 * Filter function for checking if a number is greater than a given number.
 */
export const filterFn_greaterThan: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<any, any>,
  columnId: string,
  filterValue: Date | number | string,
) => {
  return !isNaN(+filterValue) &&
    !isNaN(+row.getValue<number | string>(columnId))
    ? +(row.getValue<number | string | null>(columnId) ?? 0) > +filterValue
    : (row.getValue<number | string | null>(columnId) ?? '')
        .toString()
        .toLowerCase()
        .trim() > filterValue.toString().toLowerCase().trim()
}

filterFn_greaterThan.resolveFilterValue = (val: any) => testFalsy(val)

/**
 * Filter function for checking if a number is greater than or equal to a given number.
 */
export const filterFn_greaterThanOrEqualTo: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<any, any>,
  columnId: string,
  filterValue: Date | number | string,
) => {
  return (
    filterFn_greaterThan(row, columnId, filterValue) ||
    filterFn_equals(row, columnId, filterValue)
  )
}

filterFn_greaterThanOrEqualTo.resolveFilterValue = (val: any) => testFalsy(val)

/**
 * Filter function for checking if a number is less than a given number.
 */
export const filterFn_lessThan: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<any, any>,
  columnId: string,
  filterValue: Date | number | string,
) => {
  return !isNaN(+filterValue) &&
    !isNaN(+row.getValue<number | string>(columnId))
    ? +(row.getValue<number | string | null>(columnId) ?? 0) < +filterValue
    : (row.getValue<number | string | null>(columnId) ?? '')
        .toString()
        .toLowerCase()
        .trim() < filterValue.toString().toLowerCase().trim()
}

filterFn_lessThan.resolveFilterValue = (val: any) => testFalsy(val)

/**
 * Filter function for checking if a number is less than or equal to a given number.
 */
export const filterFn_lessThanOrEqualTo: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<any, any>,
  columnId: string,
  filterValue: Date | number | string,
) => {
  return (
    filterFn_lessThan(row, columnId, filterValue) ||
    filterFn_equals(row, columnId, filterValue)
  )
}

filterFn_lessThanOrEqualTo.resolveFilterValue = (val: any) => testFalsy(val)

// Range filters

/**
 * Filter function for checking if a number or a string is between two given values.
 */
const filterFn_between: FilterFn<any, any> = (
  row: Row<any, any>,
  columnId: string,
  filterValues: [number | string, number | string],
): boolean =>
  ((['', undefined] as Array<any>).includes(filterValues[0]) ||
    filterFn_greaterThan(row, columnId, filterValues[0])) &&
  ((!isNaN(+filterValues[0]) &&
    !isNaN(+filterValues[1]) &&
    +filterValues[0] > +filterValues[1]) ||
    (['', undefined] as Array<any>).includes(filterValues[1]) ||
    filterFn_lessThan(row, columnId, filterValues[1]))

filterFn_between.autoRemove = (val: any) => !val

/**
 * Filter function for checking if a number or a string is between two given values or equal to them.
 */
const filterFn_betweenInclusive: FilterFn<any, any> = (
  row: Row<any, any>,
  columnId: string,
  filterValues: [number | string, number | string],
): boolean =>
  ((['', undefined] as Array<any>).includes(filterValues[0]) ||
    filterFn_greaterThanOrEqualTo(row, columnId, filterValues[0])) &&
  ((!isNaN(+filterValues[0]) &&
    !isNaN(+filterValues[1]) &&
    +filterValues[0] > +filterValues[1]) ||
    (['', undefined] as Array<any>).includes(filterValues[1]) ||
    filterFn_lessThanOrEqualTo(row, columnId, filterValues[1]))

filterFn_betweenInclusive.autoRemove = (val: any) => !val

/**
 * Filter function for checking if a number is within a given range.
 */
export const filterFn_inNumberRange: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<any, any>,
  columnId: string,
  filterValue: [number, number],
) => {
  const [min, max] = filterValue

  const rowValue = row.getValue<number>(columnId)
  return rowValue >= min && rowValue <= max
}

filterFn_inNumberRange.resolveFilterValue = (val: [any, any]) => {
  const [unsafeMin, unsafeMax] = val

  const parsedMin =
    typeof unsafeMin !== 'number' ? parseFloat(unsafeMin as string) : unsafeMin
  const parsedMax =
    typeof unsafeMax !== 'number' ? parseFloat(unsafeMax as string) : unsafeMax

  let min =
    unsafeMin === null || Number.isNaN(parsedMin) ? -Infinity : parsedMin
  let max = unsafeMax === null || Number.isNaN(parsedMax) ? Infinity : parsedMax

  if (min > max) {
    const temp = min
    min = max
    max = temp
  }

  return [min, max] as const
}

filterFn_inNumberRange.autoRemove = (val: any) =>
  testFalsy(val) || (testFalsy(val[0]) && testFalsy(val[1]))

// Array filters

/**
 * Filter function for checking if an array includes a given value.
 */
export const filterFn_arrIncludes: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<any, any>,
  columnId: string,
  filterValue: unknown,
) => {
  return row.getValue<Array<unknown>>(columnId).includes(filterValue)
}

filterFn_arrIncludes.autoRemove = (val: any) => testFalsy(val) || !val?.length

/**
 * Filter function for checking if an array includes all of the given values.
 */
export const filterFn_arrIncludesAll: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<any, any>,
  columnId: string,
  filterValue: Array<unknown>,
) => {
  return !filterValue.some(
    (val) => !row.getValue<Array<unknown>>(columnId).includes(val),
  )
}

filterFn_arrIncludesAll.autoRemove = (val: any) =>
  testFalsy(val) || !val?.length

/**
 * Filter function for checking if an array includes any of the given values.
 */
export const filterFn_arrIncludesSome: FilterFn<any, any> = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<any, any>,
  columnId: string,
  filterValue: Array<unknown>,
) => {
  return filterValue.some((val) =>
    row.getValue<Array<unknown>>(columnId).includes(val),
  )
}

filterFn_arrIncludesSome.autoRemove = (val: any) =>
  testFalsy(val) || !val?.length

// Export

export const filterFns = {
  arrIncludes: filterFn_arrIncludes,
  arrIncludesAll: filterFn_arrIncludesAll,
  arrIncludesSome: filterFn_arrIncludesSome,
  between: filterFn_between,
  betweenInclusive: filterFn_betweenInclusive,
  equals: filterFn_equals,
  equalsString: filterFn_equalsString,
  inNumberRange: filterFn_inNumberRange,
  includesString: filterFn_includesString,
  includesStringSensitive: filterFn_includesStringSensitive,
  weakEquals: filterFn_weakEquals,
}

export type BuiltInFilterFn = keyof typeof filterFns

// Utils

function testFalsy(val: any) {
  return val === undefined || val === null || val === ''
}
