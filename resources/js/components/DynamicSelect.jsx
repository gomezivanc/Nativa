import React, {useState, useEffect} from "react";
import ReactSelect from 'react-select';
import AsyncReactSelect from 'react-select/async';

export default function DynamicSelect({urlRoute = null,options=[],multiple=false, withIcons=false, onChange, labelKey = "name", valueKey= "id",value=null, parentValue=null,parentSearch=null, errors = [], limpiar=false}){

    let [value2, setValue2] = useState(null);

    const onChange2 = (option) => {
        setValue2(option);
        onChange(option);
    }

    const searchQuery = async (inputValue) => {
        let rq = route(urlRoute);
        if(inputValue)
            rq += '?q=' + inputValue;
        else if(value)
            if(typeof value != "object")
                rq += '?v=' + value;
        if(parentValue && parentSearch) {
            if (rq.indexOf('?') >= 0)
                rq += '&'
            else
                rq += '?'
            rq += (parentSearch + '=' + parentValue);
        }
        let as = [];
        let response = await fetch(rq);
        as = await response.json();

        if(multiple === false)
            setValue2(as.find((o) => o[valueKey] == value));
        else
            setValue2(as.filter((o) => value.includes(o[valueKey])));
        return as;
    }

    const valueFromId = (opts, value) => multiple?(value?opts.filter(o => value.includes(o[valueKey])):null):opts.find(o => o[valueKey] === value);

    const optionValue = (option) => {
        return limpiar == false?option[labelKey]:'Select...';
    }

    const optionLabel = (option) => (

        <div style={{ display: 'flex', alignItems: 'center' }}>
            {withIcons && (
                <i className={limpiar == false?option[valueKey]:''}></i>
            )}
            <span style={{ marginLeft: 5 }}>{limpiar == false?option[labelKey]:'Select...'}</span>
        </div>
    )

    return (
        <div className="w-full">
            {urlRoute && (
                <AsyncReactSelect
                    isMulti={multiple}
                    loadOptions={searchQuery}
                    defaultOptions={true}
                    onChange={onChange2}
                    value={value2}
                    getOptionValue={optionValue}
                    getOptionLabel={optionLabel}
                />
            )}

            {!urlRoute && (
                <ReactSelect
                className=" "
                    isMulti={multiple}
                    options={options}
                    onChange={onChange2}
                    value={valueFromId(options,value)}
                    getOptionValue={optionValue}
                    getOptionLabel={optionLabel}
                />
            )}
 {errors && <div className="text-xs text-red-500 form-error">{errors}</div>}
        </div>
    )



}
