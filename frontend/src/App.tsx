import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FileUpload } from "./components/FileUpload";
import { HighlightText } from "./components/HighlightText";

function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/posts?page=${page}&search=${search}`,
      );
      setData(res.data.data);
      setTotalPages(res.data.pages);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // Fallback to empty list so map() doesn't break
    }
  };

  const handleClear = async () => {
    try {
      await axios.delete("http://localhost:3000/posts");
      // Only refresh the table if the delete was successful
      fetchData();
    } catch (error) {
      console.error("Failed to clear data:", error);
      alert("Could not clear data. Please try again.");
    }
  };

  // --- Scroll Function ---
  const scrollToOverview = () => {
    const element = document.getElementById("csv-viewer");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Helper to generate page numbers with ellipses
  const getPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 7) {
      // If few pages, show them all (1 2 3 4 5 6 7)
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show First Page
      pageNumbers.push(1);

      // Determine the start and end of the middle block
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);

      // Adjust if we are near the beginning
      if (page <= 3) {
        endPage = 4;
      }
      // Adjust if we are near the end
      if (page >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add Left Ellipsis
      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // Add Middle Pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add Right Ellipsis
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always show Last Page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Create a ref to track if it's the first render
  const isFirstRun = useRef(true);

  // Debounce search to ensure responsiveness
  useEffect(() => {
    // 3. If it's the first run, skip the logic and flip the flag
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setPage(1);
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="h-screen w-full 2xl:bg-[var(--pale-grey)] bg-blue-900 flex items-center">
        <div
          className="flex-1 flex flex-col 
        sm:ml-[15%] 
        p-[48px]

        2xl:mr-0
        xl:mr-[-15%] 
        lg:mr-[-40%]
        mr-0 
        z-20"
        >
          <h1
            className="
          lg:text-[clamp(56px,5vw,96px)] 
          sm:text-[clamp(40px,5vw,64px)] 
          text-[clamp(32px,5vw,64px)] 

          font-barlow font-bold uppercase 2xl:text-[var(--black)] text-white max-w-[471px] leading-tight"
          >
            Smart CSV Viewer
          </h1>
          <div className="h-[1px] 2xl:bg-blue-700 bg-blue-600 w-[100px] mt-[18px]"></div>
          <p
            className="
            lg:max-w-[clamp(300px,35.6vw,684px)]
            md:max-w-[clamp(400px,35.6vw,684px)]
            sm:max-w-[clamp(350px,35.6vw,684px)]
            max-w-none
            mt-[18px] 2xl:text-[var(--black)] text-white
            lg:text-[clamp(16px,1.04vw,20px)] 
            sm:text-[clamp(16px,1.04vw,20px)] 
            text-[clamp(16px,1.04vw,20px)]
            "
          >
            Smart CSV Viewer is a 3-tier architecture web app that allows users
            to upload csv files and visualise them. It uses React and Tailwind
            CSS for the frontend, Node.js and Express for the backend,
            PostgreSQL for the database and Docker for devops.
          </p>
          <div className="flex mt-[41px]">
            <button
              className="2xl:bg-blue-700 bg-blue-600 text-white uppercase font-bold flex items-center gap-[12px]
            sm:text-[13px]
            text-[12px]

            2xl:py-[15px] 
            xl:py-[12px] 
            lg:py-[13px] 
            sm:py-[10px] 
            py-[8px] 

            2xl:px-[35px] 
            xl:px-[26px] 
            lg:px-[26px] 
            sm:px-[26px] 
            px-[22px] 

            hover:cursor-pointer hover:bg-blue-500 active:bg-[var(--light-green)] transition-all duration-200 ease-in-out"
              onClick={scrollToOverview}
            >
              <svg
                width="24"
                height="24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16 16h-1.5c0-1.415.76-2.455 1.5-3.46.77-1.055 1.5-2.055 1.5-3.54 0-3.035-2.465-5.5-5.5-5.5A5.503 5.503 0 0 0 6.5 9c0 1.485.73 2.485 1.5 3.54l.01.013c.731 1 1.49 2.038 1.49 3.447H8c0-.925-.56-1.69-1.21-2.575v-.001C5.95 12.274 5 10.974 5 9c0-3.86 3.14-7 7-7s7 3.14 7 7c0 1.975-.95 3.28-1.79 4.425C16.56 14.31 16 15.075 16 16Zm-7 4.5V22h6v-1.5H9ZM8 19v-1.5h8V19H8ZM20.72 2.217l-2 2.001 1.06 1.06 2.002-2-1.061-1.061ZM2.218 3.28l1.061-1.06 2.001 2-1.06 1.06-2.002-2ZM23 8.5h-2.5V10H23V8.5Zm-22 0h2.5V10H1V8.5Zm3.222 4.717L2.22 15.218l1.06 1.061 2.001-2.001-1.06-1.06Zm14.496 1.064 1.06-1.061 2.002 2.001-1.061 1.06-2.001-2Z"
                  fill="#FFF"
                />
              </svg>
              Find out more
            </button>
          </div>
        </div>
        <div className="lg:relative absolute lg:max-w-[720px] max-w-none w-full h-full lg:shrink-0">
          <img
            src="/hero_bg.jpg"
            alt="Hero Background"
            className="absolute w-full h-full object-cover z-0 2xl:brightness-100 lg:brightness-70 brightness-50"
          />
        </div>
      </section>

      {/* CSV DASHBOARD SECTION */}
      <section
        id="csv-viewer"
        className="max-w-[1280px] mx-auto 2xl:px-0
      px-[clamp(16px,3.33vw,64px)] py-14"
      >
        <h1 className="font-barlow uppercase text-[clamp(40px,3vw,64px)] font-bold my-[8px]">
          CSV Records
        </h1>
        <p className="mb-[16px]">
          Here you can explore your csv dataset records.
        </p>

        <FileUpload onUploadSuccess={fetchData} />

        {/* Search bar and clear data button */}
        <div className="mt-4">
          <div className="flex justify-end items-center">
            <div
              className="relative
              sm:w-[300px] 
              w-full flex"
            >
              <input
                type="text"
                placeholder="Search..."
                className="border px-2 py-[6px] w-full my-4 focus:outline-none 
              lg:rounded-3xl 
              md:rounded-[16px] 
              rounded-[8px]

              lg:pl-[24px] 
              md:pl-[20px] 
              sm:pl-[20px] 
              pl-[16px]
              "
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute right-[20px] top-[50%] -translate-y-1/2 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="text-gray-500 xl:w-[20px] xl:h-[20px]  lg:w-[16px] lg:h-[16px]  md:w-[16px] md:h-[16px]  sm:w-[14px] sm:h-[14px]  w-[12px] h-[12px]  "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  ></path>
                </svg>
              </div>
            </div>

            <button
              onClick={handleClear}
              className="block text-sm text-gray-500
            py-2 px-4 my-4
            rounded-full border-0
            text-sm font-semibold
            text-red-700
            hover:text-red-500 cursor-pointer whitespace-nowrap"
            >
              Clear Data
            </button>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[var(--pale-grey)]">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-5 px-6 whitespace-nowrap">ID</th>
                  <th className="py-5 px-6 whitespace-nowrap">Name</th>
                  <th className="py-5 px-6 whitespace-nowrap">Email</th>
                  <th className="py-5 px-6 whitespace-nowrap">Body</th>
                </tr>
              </thead>
              <tbody>
                {data.map((post: any) => (
                  <tr key={post.id} className="hover:bg-gray-50 border-b">
                    <td className="p-4 px-6">{post.externalId}</td>
                    <td className="p-4 px-6 font-medium">
                      <HighlightText text={post.name} highlight={search} />
                    </td>
                    <td className="p-4 px-6 text-blue-700">
                      <HighlightText text={post.email} highlight={search} />
                    </td>
                    <td
                      className="p-4 px-6 text-gray-600 break-words whitespace-pre-wrap min-w-[300px]"
                      title={post.body}
                    >
                      <HighlightText text={post.body} highlight={search} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination buttons */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {/* prev button */}
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-2 border rounded-md text-sm font-medium transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:bg-gray-50 bg-white text-gray-700"
            >
              Prev
            </button>

            {/* Page numbers loop */}
            {getPageNumbers().map((pageNum, index) => (
              <div key={index}>
                {pageNum === "..." ? (
                  <span className="px-2 text-gray-400">...</span>
                ) : (
                  <button
                    onClick={() => setPage(pageNum as number)}
                    className={`
            min-w-[40px] h-[40px] rounded-md text-sm font-medium transition-colors border
            ${
              page === pageNum
                ? "bg-blue-700 text-white border-blue-700" // Active State
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50" // Inactive State
            }
          `}
                  >
                    {pageNum}
                  </button>
                )}
              </div>
            ))}

            {/* Next button */}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-2 border rounded-md text-sm font-medium transition-colors
      disabled:opacity-50 disabled:cursor-not-allowed
      hover:bg-gray-50 bg-white text-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
