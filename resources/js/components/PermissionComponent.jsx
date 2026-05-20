import React, {useState, useEffect} from "react";

export default function PermissionComponent({ value, onChange }) {
    let [data,setData] = useState([]);
    let [cnt,setCnt] = useState(0);
    let [value2,setValue2] = useState([]);
    useEffect(() =>{
        if(cnt === 0) {
            getPermissions();
        }
    });

    async function getPermissions(){
        let rq = route("permissions.all");
        let response = await fetch(rq);
        let as = await response.json();
        setData(as);
        setCnt(cnt+1);
        setValue2(value);
    }

    const checkPermission = (e) => {
        let val = value2;
        let dd = 0;
        for(let x in data){
            for(let y in data[x].children){
                if(data[x].children[y].id == e.target.value)
                    dd = data[x].children[y].id;
            }
        }
        if(e.target.checked && !val.includes(dd)) {
            val.push(dd);
        }else{
            let ind = val.indexOf(dd);
            val.splice(ind,1);
        }
        setValue2(val);
        onChange(value2);
    }

    const checkPermissionValue = (val) => {
        if(value2){
            if(value2.includes(val)){
                return true;
            }
        }
        return false;
    }

    return (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {data && (
                data.map(({name,children}) => (
                    <div className="col-span-1 my-3" key={name}>
                        <label className="text-sm font-bold mb-3">{name}</label>
                        {children && (
                            children.map((permission) =>(
                                <p key={permission.id}>
                                    <label>
                                        <input type="checkbox" name={"permissions"+permission.id} value={permission.id} onChange={checkPermission} defaultChecked={checkPermissionValue(permission.id)} />
                                        &nbsp;{permission.name}
                                    </label>
                                </p>
                            ))
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
