"use client";

import { useId, useState } from "react";
import CreatableSelect from "react-select/creatable";

const Tags = ({ tag, setTag }) => {
    const selectId = useId();

    return (
        <div>
            <CreatableSelect
                instanceId={selectId}
                inputId={selectId}
                placeholder='Add a tag and press enter'
                isMulti
                unstyled
                className="flex-none bg-dark-200 rounded-[6px] mb-3 px-5 py-1"
                onChange={(selectedOptions) => {
                    const values = (selectedOptions ?? []).map((option) => option.value);
                    setTag(values);
                }}
            />
        </div>
    )
};

export default Tags;
