import { Search, Plus } from "lucide-react";

const TableNav = ({ search, setSearch, setOpenForm }) => {
  return (
    <div className="bg-white shadow-sm ring-1 ring-black/5 p-6 sticky top-0 z-40">
      <div className="flex flex-wrap items-end gap-5">

        {/* Search */}
        <div className="flex-1 min-w-[320px]">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Search Table
          </label>

          <div className="relative group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400
              transition-colors duration-200 group-focus-within:text-orange-400"
            />

            <input
              type="text"
              placeholder="Search by table number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 rounded-full bg-gray-100 pl-11 pr-4 outline-none
              transition-all duration-200 ease-out
              hover:bg-gray-200/70
              focus:bg-white focus:ring-2 focus:ring-orange-300 focus:shadow-sm"
            />
          </div>
        </div>

        {/* Add Table */}
        <button
          onClick={() => setOpenForm(true)}
          className="h-12 px-6 rounded-full bg-[#d2873a] text-white font-semibold
          flex items-center gap-2 cursor-pointer
          transition-all duration-200 ease-out
          hover:bg-[#bc742b] hover:-translate-y-0.5
          hover:shadow-md hover:shadow-orange-200/60
          active:translate-y-0 active:scale-[0.97]"
        >
          <Plus size={18} />
          Table
        </button>

      </div>
    </div>
  );
};

export default TableNav;