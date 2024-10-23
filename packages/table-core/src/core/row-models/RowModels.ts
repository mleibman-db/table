import { assignAPIs } from '../../utils'
import {
  table_getCoreRowModel,
  table_getExpandedRowModel,
  table_getFilteredRowModel,
  table_getGroupedRowModel,
  table_getPaginatedRowModel,
  table_getPreExpandedRowModel,
  table_getPreFilteredRowModel,
  table_getPreGroupedRowModel,
  table_getPrePaginatedRowModel,
  table_getPreSortedRowModel,
  table_getRowModel,
  table_getSortedRowModel,
} from './RowModels.utils'
import type { Table } from '../../types/Table'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'

export const RowModels: TableFeature = {
  constructTableAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData>,
  ): void => {
    assignAPIs(table, [
      {
        fn: () => table_getCoreRowModel(table),
      },
      {
        fn: () => table_getRowModel(table),
      },
      {
        fn: () => table_getPreFilteredRowModel(table),
      },
      {
        fn: () => table_getFilteredRowModel(table),
      },
      {
        fn: () => table_getPreGroupedRowModel(table),
      },
      {
        fn: () => table_getGroupedRowModel(table),
      },
      {
        fn: () => table_getPreExpandedRowModel(table),
      },
      {
        fn: () => table_getExpandedRowModel(table),
      },
      {
        fn: () => table_getPrePaginatedRowModel(table),
      },
      {
        fn: () => table_getPaginatedRowModel(table),
      },
      {
        fn: () => table_getPreSortedRowModel(table),
      },
      {
        fn: () => table_getSortedRowModel(table),
      },
    ])
  },
}
