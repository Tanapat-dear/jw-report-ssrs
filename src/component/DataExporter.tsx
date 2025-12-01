import '../styles/DataExporter.css';
import { useEffect, useState , useMemo} from 'react';
import axios from 'axios';
import TableComponent from './TableCompnent';
import ErrorDialog from './ErrorDialog';
import LoadingDialog from './LoadingDialog';
import { useParams } from 'react-router';
import { Autocomplete, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LoadingIndicator from './Loadingindicator';
import type { MasterMccodeType } from '../type/commontype';
import { FactoryOption  } from '../utils/autocompleteoption';
import dayjs from 'dayjs';

export default function DataExporter() {
    
    const params = useParams<Record<string, string>>();
    const [dataselected,setdataSelected] = useState({factory: '',process: '', machine_code: '', startdate: '' , enddate: '', table: ''})
    const [master_mccode, setMasterMcCode] = useState<MasterMccodeType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [apiLoading, setapiLoading] = useState(false)
    const [isError,setisError] = useState({error:false, message: ''});
    const [data,setData] = useState<any>({});

    const ProcessOption = useMemo(() => {
            if (!dataselected.factory) return []; // string ว่าง → return []
            
        
            const filtered = master_mccode.filter(m =>
                m.process_group.startsWith(dataselected.factory) // string.startsWith
            );

            const uniqueProcess = Array.from(new Set(filtered.map(m => m.master_group)));
            return uniqueProcess.map(p => ({ label: p, value: p }));

        }, [master_mccode, dataselected.factory]);
    


    const MachineOption = useMemo(() => {
            if (!dataselected.process) return [];

            return master_mccode
                .filter(m => m.master_group === dataselected.process) // filter by selected process
                .map(m => ({ label: m.mc_code, value: m.mc_code })); // map เป็น AutocompleteOption
            }, [master_mccode, dataselected.process]);
    
    
    const TableOption = useMemo(() => {
        if (!dataselected.machine_code) return [];

        const target = master_mccode.find(
                    m => m.mc_code === dataselected.machine_code
                );

                if (!target) return [];

                const list = [];

                if (target.actv_table) {
                    list.push({ label: 'ACTV', value: "ACTV" });
                }

                if (target.status_table) {
                    list.push({ label: "STATUS", value: "STATUS" });
                }

                if (target.set_table) {
                    list.push({ label: "SET", value: "SET" });
                }

                return list;
                }, [dataselected.machine_code]);



    useEffect(() => {
        const allow = ['pth', 'cfm', 'lpi', 'fin', 'smt', 'cvc', 'sft'];

        if (!params.process || !allow.includes(params.process)) {
            throw new Response("Not Found", { status: 404 ,statusText:'Not Found'});
            }

    const fetchData = async () => {
      try {
        setapiLoading(true)
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/master?process=${params.process}`);
        const data = await res.data;
        setMasterMcCode(data.data);
        
        setapiLoading(false)
        setisError({error: false , message: ""})

      } catch (err) {
        console.error("Error fetching master_mccode:", err);
        setisError({error: true , message: "Error: Cannot Fetch Master Table Data, Please try again later!"})
        setapiLoading(false)
      }
    };

    fetchData();
  }, [params.process]);


   

    async function sendhttp_loaddata() {
        try {
            if (!dataselected.process|| !dataselected.machine_code) {
            window.alert("Please select process and machine code");
            return;
            }
            else if(!dataselected.startdate || !dataselected.enddate){
                window.alert('Please Input Start Date and End Date Correctly')
                return;
            }
           if (dataselected.startdate && dataselected.enddate) {
                const start = dayjs(dataselected.startdate);
                const end = dayjs(dataselected.enddate);

                if (start.isAfter(end)) {
                    window.alert('Start date is more than End Date');
                    return; // หยุดการเรียก API ต่อ
                }
                }
           const tableKeyMap: Record<'ACTV' | 'STATUS' | 'SET', string> = {
                    ACTV: 'actv_table',
                    STATUS: 'status_table',
                    SET: 'set_table',
                    };

            const filtered_masterdata = master_mccode.find((item: MasterMccodeType)=>(item.mc_code == dataselected.machine_code));
            
            
            const tableName: string | number | null = (dataselected.table && master_mccode.find(m => m.mc_code === dataselected.machine_code)?.[tableKeyMap[dataselected.table as keyof typeof tableKeyMap] as keyof MasterMccodeType]) ?? null;


            if (!filtered_masterdata) {
                setIsLoading(false);
                window.alert(`${dataselected.table} Table not found for this machine code and table type`);
                return;
            }

            setIsLoading(true);
            setisError({error:false,message:''});

            const res = await axios.get(
            `http://10.17.77.217:6813/api/report/${dataselected.machine_code}?startdate=${dataselected.startdate}&enddate=${dataselected.enddate}&tablename=${tableName}`
            );

            if (!res.data?.data?.length) {
            setIsLoading(false);
            window.alert('There are no data for this selection!');
            }

            setData(res.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            setIsLoading(false);
            setisError({error:true,message:'Error: Cannot Load data, Please try again later!'});
        } finally {
            setIsLoading(false);
        }
        }

         if (apiLoading) {
    // แสดงเต็มหน้า LoadingIndicator ตอน fetch master data
    return (
      <div className="fullpage-loading">
        <LoadingIndicator />
      </div>
    );
  }
    return (
        <>
        <div className="header-custom">
            <h2 className='styled-heading'>
                 <span role="img" aria-label="data-export">📊</span>JW {params.process?.toUpperCase()} PROCESS – Raw Data Export
            </h2>
            <div className="filter-bar">

                <div className="filter-item">
          
    
                        <Autocomplete
                        
                            options={FactoryOption}
                            getOptionLabel={(option) => option.label}
                            value={FactoryOption.find(f => f.value === dataselected.factory) || null}
                            style={{ width: '100%' }}
                            onChange={(_event, newValue) => {
                                setdataSelected(prev => ({
                                ...prev,
                                factory: newValue?.value || '',
                                process: "",
                                machine_code: ""
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField {...params} placeholder='Factory' label="Select Factory" variant="outlined" InputLabelProps={{ shrink: true }} />
                            )}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            className='autocomplete-box'
                            />

                 </div>

                 

                <div className="filter-item">
                
                        <Autocomplete
                            fullWidth
                            
                            options={ProcessOption} 
                            getOptionLabel={(option) => option.label}
                            value={ProcessOption.find(p => p.value === dataselected.process) || null} // object หรือ null
                            onChange={(_e, newValue) =>
                                setdataSelected(prev => ({
                                ...prev,
                                process: newValue?.value || '', // always string
                                machine_code: '' // reset machine
                                }))
                            }
                            renderInput={(params) => (
                                <TextField
                                {...params}
                                label="Process"
                                placeholder="Process"
                                InputLabelProps={{ shrink: true }}
                              
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option.value === value?.value}
                            disableClearable={false} // allow initial empty state
                            className='autocomplete-box'
                            />
                </div>

                <div className="filter-item">
             
                    <Autocomplete
                        options={MachineOption}
                        getOptionLabel={(option) => option.label}
                        value={dataselected.machine_code ? MachineOption.find(m => m.value === dataselected.machine_code) : null}
                        onChange={(_e, newValue) => setdataSelected(prev => ({
                            ...prev,
                            machine_code: newValue?.value || '',
                        }))}
                        renderInput={(params) => <TextField {...params} label="Machine" placeholder="Machine" InputLabelProps={{ shrink: true }} />}
                        isOptionEqualToValue={(option, value) => option.value === value?.value}
                        
                        className='autocomplete-box'
                        />
                </div>
                 <div className="filter-item">
        
                
                    <Autocomplete
                            fullWidth
                            options={TableOption}
                            getOptionLabel={(option) => option.label}
                            value={TableOption.find(f => f.value === dataselected.table) || null } // เริ่มต้นจาก state
                        
                            onChange={(_event, newValue) => {
                                setdataSelected(prev => ({
                                ...prev,
                                table: newValue?.value || ""
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField
                                {...params}
                                placeholder="Table"
                                label="Select Table"
                
                                variant="outlined"
                                InputLabelProps={{ shrink: true }} // label fix
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            className="autocomplete-box"
                            />
                </div>
                <div className="filter-item">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Start Date"
                            value={dataselected.startdate ? dayjs(dataselected.startdate) : null}
                            onChange={(newValue) =>
                                setdataSelected(prev => ({
                                    ...prev,
                                    startdate: newValue ? newValue.format('YYYY-MM-DD') : ''
                                }))
                            }
                            slots={{ textField: TextField }}
                            slotProps={{ textField: { variant: 'outlined', InputLabelProps: { shrink: true } } }}
                            maxDate={dayjs()} // ห้ามเกินวันนี้
                            enableAccessibleFieldDOMStructure={false}
                            className='autocomplete-box'
                        />
                    </LocalizationProvider>
                </div>

                    <div className="filter-item">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="End Date"
                                value={dataselected.enddate ? dayjs(dataselected.enddate) : null}
                                onChange={(newValue) =>
                                    setdataSelected(prev => ({
                                        ...prev,
                                        enddate: newValue ? newValue.format('YYYY-MM-DD') : ''
                                    }))
                                }
                                slots={{ textField: TextField }}
                                slotProps={{ textField: { variant: 'outlined', InputLabelProps: { shrink: true } } }}
                                // ล็อก end date ไม่เกิน 30 วันหลัง start date
                                minDate={dataselected.startdate ? dayjs(dataselected.startdate) : undefined}
                                maxDate={dataselected.startdate ? dayjs(dataselected.startdate).add(30, 'day') : undefined}
                                enableAccessibleFieldDOMStructure={false}
                                className='autocomplete-box'
                            />
                        </LocalizationProvider>
                    </div>
                        
                   
            </div>
            <button className='data-button' onClick={()=> sendhttp_loaddata()} disabled={isLoading}>
                {isLoading ? 'Loading Data...' : 'Load Data'}
            </button>
        </div>
        {isLoading? <LoadingDialog open={true} />:<LoadingDialog open={false} />}
        <div className='gap-process'>
            <TableComponent data={data.data} startdate={dataselected.startdate} enddate={dataselected.enddate} mccode={dataselected.machine_code}/>
        </div>
        {isError.error && <ErrorDialog message={isError.message} />}
        
        </>
    )
}