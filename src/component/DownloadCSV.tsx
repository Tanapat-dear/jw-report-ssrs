import { useState } from "react";

const DownloadCSV = ({ data, fileName }: any ) => {

  const [isLoading,setIsloading] = useState(false);
  
  const convertToCSV = (objArray : any) => {
      const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
      if (!array || !array.length) return "";

      let str = '';

      // สร้าง header row จาก keys ของ object แรก
      const headers = Object.keys(array[0]);
      str += headers.join(",") + "\r\n";

      // สร้าง data rows
      for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let index in array[i]) {
          if (line !== '') line += ',';
          line += array[i][index];
        }
        str += line + '\r\n';
      }
      return str;
    };

  const downloadCSV = () => {
    setIsloading(true)
    const csvData = new Blob([convertToCSV(data)], { type: 'text/csv' });
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement('a');
    link.href = csvURL;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsloading(false)
  };

  return (
   <button
        onClick={downloadCSV}
        id='no-border-button'
        className="csv-button"
        disabled={isLoading}
      >
        {isLoading ? "Preparing..." : "Download CSV"}
      </button>
  );
}

export default DownloadCSV;