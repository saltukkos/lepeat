import React from "react";
import {useTable, useGlobalFilter} from "react-table";
import {CButton, CFormInput, CTable, CTableBody, CTableDataCell, CTableHead, CTableRow} from "@coreui/react";
import PropTypes from "prop-types";

export default function Table({columns, data, additionalHeaderElements}) {

    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter, state} =
        useTable({columns, data}, useGlobalFilter);

    const {globalFilter} = state;

    return (
        <div>
            <div className="w-100 mb-3 d-flex justify-content-between">
                <CFormInput
                    className="w-50"
                    type="text"
                    value={globalFilter || ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
                {additionalHeaderElements}
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

// Define the prop types
Table.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    additionalHeaderElements: PropTypes.any, // Not marking as .isRequired makes it optional
};