import React, {FC, useContext, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import CIcon from "@coreui/icons-react";
import {cilPencil} from "@coreui/icons";
import ProfileContext from "../../contexts/ProfileContext";
import {Column, Row} from "react-table";
import {CButton} from "@coreui/react";
import Table from "../table/Table";

interface DataType {
    id: string,
    training: string,
    actions: any
}

const EditButton: FC<{ row: Row<DataType> }> = ({row}) => {
    const navigate = useNavigate();
    const handleEdit = () => {
        navigate(`/edit-training/${row.original.id}`)
    };

    return <CIcon icon={cilPencil} onClick={handleEdit}/>;
};

function TrainingsPage() {
    const {profile} = useContext(ProfileContext);
    const navigate = useNavigate();
    const trainings = profile.trainingDefinitions;

    let columns: Column<DataType>[] = useMemo(() => [
        {
            Header: 'Training',
            accessor: 'training',
        },
        {
            Header: 'Action',
            accessor: 'actions',
            Cell: ({row}) => <EditButton row={row}/>,
        }
    ], []);


    const data: any[] = trainings.map(e => ({'id': e.id, 'training': e.name}))

    const onAddClicked = () => {
        navigate(`/add-training/`)
    }

    const addButton = <CButton onClick={onAddClicked} color="info">Add new training</CButton>

    return (<div>
        <Table columns={columns} data={data} additionalHeaderElements={addButton}/>
    </div>)
}

export default TrainingsPage;