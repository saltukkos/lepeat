import React from "react";
import { useTable, useGlobalFilter } from "react-table";
import {CFormInput, CTable, CTableBody, CTableDataCell, CTableHead, CTableRow} from "@coreui/react";

export default function Table({ columns, data }) {

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter, state } =
        useTable({ columns, data }, useGlobalFilter);

    const { globalFilter } = state;

    return (
        <div>
            <div className="w-50 mb-3">
                <CFormInput
                    type="text"
                    value={globalFilter || ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>
            <CTable {...getTableProps()}>
                <CTableHead>
                    {headerGroups.map((headerGroup) => (
                        <CTableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <CTableDataCell {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </CTableDataCell>
                            ))}
                        </CTableRow>
                    ))}
                </CTableHead>
                <CTableBody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row);
                        return (
                            <CTableRow {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <CTableDataCell {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </CTableDataCell>
                                    );
                                })}
                            </CTableRow>
                        );
                    })}
                </CTableBody>
            </CTable>
        </div>
    )
}