import "../styles/MasterTableList.css";

interface MasterData {
  id: string;
  process_group: string;
  master_group: string;
  mc_code: string;
  actv_table: string;
  status_table: string;
  set_table: string | null;
}

export default function MasterTableList({ data }: { data: MasterData[] }) {
  return (
    <div className="table-wrapper">
      <table className="master-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Process Group</th>
            <th>Master Group</th>
            <th>MC Code</th>
            <th>Activity Table</th>
            <th>Status Table</th>
            <th>Set Table</th>
          </tr>
        </thead>
        <tbody >
          {data.map(row => (
            <tr key={row.id} className="table-row">
              <td>{row.id}</td>
              <td>{row.process_group}</td>
              <td>{row.master_group}</td>
              <td>{row.mc_code}</td>
              <td>{row.actv_table ?? '-'}</td>
              <td>{row.status_table ?? '-'}</td>
              <td>{row.set_table ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
