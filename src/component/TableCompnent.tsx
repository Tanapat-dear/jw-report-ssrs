import type { TableComponentTypeProp , TableRowTypeProp } from "../type/commontype";
import { useState , useEffect, memo, useRef } from "react";
import "../styles/TableComponent.css";
import DownloadCSV from "./DownloadCSV";

const TableRow = memo(function TableRow({ row, headers }: TableRowTypeProp) {
  return (
    <tr>
      {headers.map((h:any) => (
        <td key={h}>{row[h]}</td>
      ))}
    </tr>
  );
});

export default function TableComponent({ data, mccode, startdate, enddate }: TableComponentTypeProp) {
 
  const [visibleRows, setVisibleRows] = useState(40); // เริ่มต้นแสดง 40 row
  const rowsPerLoad = 15; // โหลดเพิ่มทีละ 40 row
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleRows(rowsPerLoad); // reset เมื่อ data เปลี่ยน
  }, [data]);

  if (!Array.isArray(data) || data.length === 0) return null;

  const headers =  Object.keys(data[0] || {});
  const fileMccode =
    data?.[0]?.mccode ||
    data?.[0]?.mc_code ||
    mccode || "no_mccode";

  // scroll handler
  const handleScroll = () => {
    const container = tableWrapperRef.current;
    if (!container) return;

    const { scrollTop, clientHeight, scrollHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      // โหลด row เพิ่มเมื่อ scroll ถึงท้าย table
      setVisibleRows(prev => Math.min(prev + rowsPerLoad, data.length));
    }
  };

  return (
    <>
      <div className="csv-container">
         <div className="flex-container-csv">
            <div className="found-rows">
                Found <span className="row-count">{data.length}</span> rows
            </div>
            <DownloadCSV data={data} fileName={`${fileMccode}_${startdate}_to_${enddate}`}/>
        </div>
      </div>

      <div className="table-wrapper" ref={tableWrapperRef} onScroll={handleScroll} style={{ maxHeight: 400, overflowY: "auto" }}>
        <table className="nice-table">
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, visibleRows).map((row,index) => (
              <TableRow key={row.id || row._id || row.mccode || index} row={row} headers={headers} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
