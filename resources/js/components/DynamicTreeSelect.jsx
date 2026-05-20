import ReactTreeSelect from 'react-dropdown-tree-select';
import React, {useEffect, useState} from "react";

export default function DynamicTreeSelect({urlRoute, mode="radioSelect", onChange, labelKey = "name", valueKey= "id", placeholder= null,defaultValue=null}){

    let [elements,setElements] = useState([]);

    const getRouteItems = () => {
        let items = [];
        if(elements.length > 0) {
            items = mapItems(elements);
            setElements(items);
        }else{
            items = axios.get(route(urlRoute)).then((response) =>{
                items = mapItems(response.data);
                setElements(items);
            });
        }
    }

    function mapItems(items){
        return items.map((item) => {
            let itemValue = item[valueKey] ?? item.value;
            let itemLabel = item[labelKey] ?? item.label;
            return {
                value: itemValue,
                label: itemLabel,
                isDefaultValue: itemValue === defaultValue,
                expanded: itemValue === defaultValue,
                children: item.children?mapItems(item.children):null,
            }
        })
    }

    useEffect(() => {
        getRouteItems();
    }, [defaultValue]);


    return (
        <ReactTreeSelect className="w-full text-sm" onChange={onChange} data={elements} mode={mode} texts={{placeholder: placeholder}} />
    )
}
