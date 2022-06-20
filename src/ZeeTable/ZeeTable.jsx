import { useState, useEffect } from "react";
import { throttle } from "lodash";

import Paginate from "./Paginate";
import "./ZeeTable.css";
import { publicAPI } from "../service/api";
import DataTable from "./DataTable";

export default function ZeeTable() {
  const [tableData, setTableData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageLimit = 10;
  const pages = Math.ceil(tableData.length / pageLimit);
  const lastPost = currentPage * pageLimit;
  const firstPost = lastPost - pageLimit;
  const currentPosts = tableData.slice(firstPost, lastPost);

  const initTable = async () => {
    const { data } = await publicAPI.get("posts/");

    setTableData(data);
  };

  useEffect(() => {
    initTable();
  }, []);

  const onEdit = (e, id) => {
    let done = false;
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
      done = true;
    }

    if (done) return;
    let editedValue = e.target.textContent || e.target.innerText || "";

    let oData = [...tableData];

    if (e.type === "blur" || e.key === "Enter") {
      oData.forEach((element, index) => {
        if (element.id === id) {
          oData[index] = { ...oData[index], title: editedValue };
        }
      });
      setTableData(oData);

      publicAPI.patch(
        `posts/${id}`,
        JSON.stringify({
          title: editedValue,
        }),
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
    }
  };

  const onDelete = (id) => {
    let uData = tableData.filter((o) => o.id !== id);
    setTableData(uData);
    publicAPI.delete(`posts/${id}`);
  };

  const onSearch = (e) => {
    setSearch(e.target.value);
    console.log(e.target.value);
    let oData = [...tableData];

    throttle(() => {
      oData = oData.filter((o) => {
        if (o.title.toString().toLowerCase().includes(search.toLowerCase())) {
          return true;
        }

        return false;
      });
      console.log("filter", oData);
      if (oData.length) setTableData(oData);
    }, 200)();
  };

  const onPaginate = (page) => {
    let local = page;
    if (page === -1) local = currentPage - 1;
    if (!page) local = currentPage + 1;
    setCurrentPage(local);
  };

  return (
    <div>
      <DataTable
        posts={currentPosts}
        search={search}
        onSearch={onSearch}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      {pages > 1 && <Paginate pages={pages} paginate={onPaginate} />}
    </div>
  );
}
