import React from "react";
import "./Paginate.css";

export default function Paginate({ pages, paginate }) {
  const pagesList = [];

  for (let i = 1; i <= pages; i++) {
    pagesList.push(i);
  }
  return (
    <nav>
      <a onClick={() => paginate(-1)} href='!#' id='btn_prev'>
        Prev
      </a>

      <ul className='pages'>
        {pagesList.map((number) => (
          <li key={number}>
            <a onClick={() => paginate(number)} href='!#'>
              {" "}
              {number}
            </a>
          </li>
        ))}
      </ul>
      <a onClick={() => paginate()} href='!#' id='btn_next'>
        Next
      </a>
    </nav>
  );
}
