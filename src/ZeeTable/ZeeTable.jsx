import { useState, useEffect } from "react";
import { throttle } from "lodash";

import "./ZeeTable.css";
import { publicAPI } from "../service/api";

export default function ZeeTable() {
  const [tableData, setTableData] = useState([]);
  const [search, setSearch] = useState("");

  const initTable = async () => {
    const { data } = await publicAPI.get("posts?limit=10");

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

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>TITLE</th>
            <th>
              <input placeholder='Search' onChange={onSearch} value={search} />
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData?.map((row, i) => {
            return (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>
                  <div
                    suppressContentEditableWarning
                    contentEditable
                    onKeyPress={(e) => onEdit(e, row.id)}
                    onBlur={(e) => onEdit(e, row.id)}
                  >
                    {row.title}
                  </div>
                </td>

                <td>
                  <button onClick={() => onDelete(row.id)}>delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
