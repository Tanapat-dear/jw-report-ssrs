
import DataExporter from "../component/DataExporter";
import { useParams } from "react-router";

export default function Dashboard(){
    
    const params = useParams<Record<string, string>>();
    return(
        <>
        
        <DataExporter key={params.process}/>
        </>
    )
}