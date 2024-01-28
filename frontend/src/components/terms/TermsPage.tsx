import React, {FC, useContext, useMemo} from "react";
import ProfileContext from "../../contexts/ProfileContext";
import Table from "../table/Table";
import CIcon from "@coreui/icons-react";
import {cilPencil} from "@coreui/icons";
import {useNavigate} from "react-router-dom";
import {Column, Row} from "react-table"

interface DataType {
    id_number: number,
    term: string,
    actions: any
}

const EditButton: FC<{ row: Row<DataType> }> = ({row}) => {
    const navigate = useNavigate();

    const handleEdit = () => {
        console.log("Edit button clicked for row:", row.original);
        navigate(`/edit-word/${row.original.id_number}`)
    };

    return <CIcon icon={cilPencil} onClick={handleEdit}/>;
};

function TermsPage() {
    const {profile} = useContext(ProfileContext);
    const terms = profile.terms;
    let columns: Column<DataType>[] = useMemo(() => [
        {
            Header: 'ID',
            accessor: 'id_number',
        },
        {
            Header: 'Term',
            accessor: 'term',
        },
        {
            Header: 'Action',
            accessor: 'actions',
            Cell: ({row}) => <EditButton row={row}/>,
        }
    ], [])

    const data: any[] = terms.map(e => ({'id_number': e.id, 'term': Array.from(e.attributeValues.values()).join('; ')}))

    return <Table columns={columns} data={data}/>
}

export default TermsPage;