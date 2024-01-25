import React, {FC, useState} from 'react';
import {CButton, CCardText, CFormInput} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {cilPlus, cilTrash} from "@coreui/icons";

const NEW_INTERVAL_DEFAULT_VALUE = 1;
interface Props {
    title: string,
    intervals: number[],
    onIntervalsChanges: (intervals: number[]) => void
}

const TrainingIntervals: FC<Props> = ({title, intervals, onIntervalsChanges}) => {
    const [intervalsToShow, setIntervalsToShow] = useState(intervals);

    const intervalChanged = (idx: number, value: string) => {
        intervalsToShow[idx] = +value;
        setIntervalsToShow([...intervalsToShow]);
        onIntervalsChanges(intervalsToShow);
    }

    const onRemoveClicked = (idx: number) => {
        intervalsToShow.splice(idx, 1);
        setIntervalsToShow([...intervalsToShow]);
        onIntervalsChanges(intervalsToShow);
    }

    const onAddClicked = () => {
        intervalsToShow.push(NEW_INTERVAL_DEFAULT_VALUE);
        setIntervalsToShow([...intervalsToShow]);
        onIntervalsChanges(intervalsToShow);
    }

    return (
        <div>
            <CCardText className="">{title}</CCardText>
            {intervalsToShow.map((interval, idx) => {
                return (
                    <div className="w-25 mb-2 d-flex align-items-center gap-3" key={`interval-${idx}`}>
                        <CFormInput type="number" min={1} onChange={(e) => intervalChanged(idx, e.target.value)} value={interval}/>
                        <CIcon icon={cilTrash} onClick={() => onRemoveClicked(idx)}/>
                    </div>
                )
            })}
            <CIcon icon={cilPlus} size="xl" onClick={onAddClicked}/>
        </div>
    )
}

export default TrainingIntervals;