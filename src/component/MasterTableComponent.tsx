import { useEffect, useState, useRef } from "react";
import ErrorDialog from "./ErrorDialog";
import LoadingIndicator from "./Loadingindicator";
import axios from "axios";
import "../styles/MasterTableComponent.css";
import MasterTableList from "./MasterTableList";

interface MasterData {
  id: string;
  process_group: string;
  master_group: string;
  mc_code: string;
  actv_table: string;
  status_table: string;
  set_table: string | null;
}

export default function MasterTableComponent() {
  const [data, setData] = useState<MasterData[]>([]);
  const [filtered, setFiltered] = useState<MasterData[]>([]);
  const [processList, setProcessList] = useState<string[]>([]);
  const [filterValue, setFilterValue] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ error: false, message: "" });

  const [visibleCount, setVisibleCount] = useState(20);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/master`);
        const allData: MasterData[] = res.data.data;

        setData(allData);
        setFiltered(allData);

        const unique = ["ALL", ...Array.from(new Set(allData.map(d => d.process_group)))];
        setProcessList(unique);

        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsError({ error: true, message: "Error: Cannot fetch Master Table Data" });
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // update filtered data when filterValue or searchText changes
  useEffect(() => {
    let result = data;

    if (filterValue !== "ALL") {
      result = result.filter(d => d.process_group === filterValue);
    }

    if (searchText.trim() !== "") {
      const text = searchText.trim().toLowerCase();
      result = result.filter(d => d.mc_code.toLowerCase().includes(text));
    }

    setFiltered(result);
    setVisibleCount(20); // reset lazy scroll
  }, [filterValue, searchText, data]);

  const handleFilter = (value: string) => {
    setFilterValue(value);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  // lazy scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => Math.min(prev + 20, filtered.length));
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [filtered]);

  return (
    <>
      <div className="master-container">
        <h2 className="styled-heading">📊 JW Master Table – Data Table</h2>

        <div className="master-flex-container">
          <select value={filterValue} onChange={(e) => handleFilter(e.target.value)}>
            {processList.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <input
            type="text"
            placeholder="Search MC Code..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            className="mc-search-input"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="fullpage-loading">
          <LoadingIndicator />
        </div>
      ) : (
        <>
          <MasterTableList data={filtered.slice(0, visibleCount)} />
          <div ref={loaderRef} style={{ height: "30px", textAlign: "center" }}>
            {visibleCount < filtered.length && "Loading..."}
          </div>
        </>
      )}

      {isError.error && <ErrorDialog message={isError.message} />}
    </>
  );
}
