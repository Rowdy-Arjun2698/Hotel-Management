import { Search, Plus } from "lucide-react";

const TableNav = ({ search, setSearch, setOpenForm }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end gap-5">
        {/* Search */}
        <div className="min-w-[320px] flex-1">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Search Table
          </label>

          <div className="relative group">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-orange-400"
            />

            <input
              type="text"
              placeholder="Search by table number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-[15px] text-gray-900 outline-none transition-all duration-200 ease-out hover:border-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        {/* Add Table */}
        <button
          onClick={() => setOpenForm(true)}
          className="flex h-11 items-center gap-2 rounded-lg bg-orange-500 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          <Plus size={16} />
          Add Table
        </button>
      </div>
    </div>
  );
};

export default TableNav;