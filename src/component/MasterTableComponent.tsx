import { useEffect , useState } from "react"
import axios from 'axios';
import '../styles/MasterTableComponent.css'



export default function MasterTableComponent(){
    const [data,setData] = useState()

    useEffect(() => {
        const fetchdata = async () => {
            try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/master`);
            console.log(res.data);
            setData(res.data.data)
            } catch (err) {
            console.error(err);
            }
        };

        fetchdata();  // <-- ต้องเรียกตรงนี้

        }, []);

    return(
        <>
        <div className="master-container">
            <div>
                <h2 className='styled-heading'>
                        <span role="img" aria-label="data-export">📊</span>JW Master Table – Data Table
                </h2>
            </div>
        </div>
        </>
    )
}