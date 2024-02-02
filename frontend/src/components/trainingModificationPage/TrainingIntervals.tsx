import React, {FC, useState} from 'react';
import {CCardText, CFormInput} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {cilPlus, cilTrash} from "@coreui/icons";

const NEW_INTERVAL_DEFAULT_VALUE = 1;
interface Props {
    title: string,
    intervals: number[],
    onIntervalsChanges: (intervals: number[]) => void
}

const TrainingIntervals: FC<Props> = ({title, intervals, onIntervalsChanges}) => {

    const intervalChanged = (idx: number, value: string) => {
        intervals[idx] = +value;
        onIntervalsChanges(intervals);
    }

    const onRemoveClicked = (idx: number) => {
        intervals.splice(idx, 1);
        onIntervalsChanges(intervals);
    }

    const onAddClicked = () => {
        intervals.push(NEW_INTERVAL_DEFAULT_VALUE);
        onIntervalsChanges(intervals);
    }

    return (
        <div>
            <CCardText className="">{title}</CCardText>
            {intervals.map((interval, idx) => {
                return (
                    <div className="w-25 mb-2 d-flex align-items-center gap-3" key={`interval-${idx}`}>
                        <CFormInput type="number" min={1} onChange={(e) => intervalChanged(idx, e.target.value)} value={interval}/>
                        <CIcon icon={cilTrash} onClick={() => onRemoveClicked(idx)}/>
                    </div>
                )
            })}
            <CIcon className="mt-1" icon={cilPlus} size="xl" onClick={onAddClicked}/>
        </div>
    )
}

export default TrainingIntervals;