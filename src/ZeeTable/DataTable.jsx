import React from "react";

import "./DataTable.css";

export default function DataTable({
  posts,
  search,
  onSearch,
  onEdit,
  onDelete,
}) {
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
          {posts?.map((row, i) => {
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
