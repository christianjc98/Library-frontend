interface Props {
  currentPage: number;
  totalPages: number;
  paginate: any;
}

const Pagination = ({
  currentPage,
  totalPages,
  paginate,
}: Props): JSX.Element => {
  const pageNumber = [];

  if (currentPage === 1) {
    pageNumber.push(currentPage);
    if (totalPages >= currentPage + 1) {
      pageNumber.push(currentPage + 1);
    }
    if (totalPages >= currentPage + 2) {
      pageNumber.push(currentPage + 2);
    }
  } else if (currentPage > 1) {
    if (currentPage >= 3) {
      pageNumber.push(currentPage - 2);
      pageNumber.push(currentPage - 1);
    } else {
      pageNumber.push(currentPage - 1);
    }
    pageNumber.push(currentPage);

    if (totalPages >= currentPage + 1) {
      pageNumber.push(currentPage + 1);
    }
    if (totalPages >= currentPage + 2) {
      pageNumber.push(currentPage + 2);
    }
  }

  return (
    <nav aria-label="...">
      <ul className="pagination">
        <li className="page-item" onClick={() => paginate(1)}>
          <button className="page-link">First Page</button>
        </li>
        {pageNumber.map((number) => {
          return (
            <li
              key={number}
              className={"page-item" + (currentPage === number ? "active" : "")}
              onClick={() => paginate(number)}
            >
              <button className="page-link">{number}</button>
            </li>
          );
        })}
        <li className="page-item" onClick={() => paginate(totalPages)}>
          <button className="page-link">Last Page</button>
        </li>
      </ul>
    </nav>
  );
};
export default Pagination;
