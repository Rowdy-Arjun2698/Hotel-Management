import { Search, Plus, ChevronDown } from "lucide-react";
import {useState, useEffect} from "react";
import  axios from "axios";

const CategoryNav = ({setopenform,refreshCategories}) => {
const [mainCategory, setMainCategory] = useState("All");
const [subCat, setAllCat] = useState([]);

   async function  fetchAllCategory() {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/menu/fetch_cat",
        {
          withCredentials: true,
        }
      );

    

     setAllCat(response.data.categories);
       

    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  }

const filteredCategories =
  mainCategory === "All"
    ? subCat
    : subCat.filter((cat) => cat.mainCategory === mainCategory);


useEffect(() => {
  fetchAllCategory();
}, [subCat,refreshCategories]);

  return (
    <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-wrap items-end gap-5">

        {/* Search */}
        <div className="flex-1 min-w-[320px]">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Search Dish
          </label>

          <div className="relative group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-orange-400"
            />
            <input
              type="text"
              placeholder="Search dish..."
              className="w-full h-12 rounded-full bg-gray-100 pl-11 pr-4 outline-none
                         transition-all duration-200 ease-out
                         hover:bg-gray-200/70
                         focus:bg-white focus:ring-2 focus:ring-orange-300 focus:shadow-sm"
            />
          </div>
        </div>

        {/* Main Category */}
        <div className="w-48">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Main Category
          </label>

          <div className="relative group">
            <select
              className="w-full h-12 rounded-full bg-gray-100 pl-5 pr-10 outline-none
                         appearance-none cursor-pointer
                         transition-all duration-200 ease-out
                         hover:bg-gray-200/70
                         focus:bg-white focus:ring-2 focus:ring-orange-300 focus:shadow-sm"
                         value={mainCategory}
                         onChange={(e)=> setMainCategory(e.target.value)}
            >
              <option>All</option>
              <option>Food</option>
              <option>Beverages</option>
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition-transform duration-200 group-focus-within:rotate-180"
            />
          </div>
        </div>

        {/* Category */}
        <div className="w-56">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Category
          </label>

          <div className="relative group">
            <select
              className="w-full h-12 rounded-full bg-gray-100 pl-5 pr-10 outline-none
                         appearance-none cursor-pointer
                         transition-all duration-200 ease-out
                         hover:bg-gray-200/70
                         focus:bg-white focus:ring-2 focus:ring-orange-300 focus:shadow-sm"
            >
              {filteredCategories.map((cat) => (
 <option
    key={cat._id}
    value={cat.Catname}
>
    {cat.Catname}
</option>
))}
            {}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition-transform duration-200 group-focus-within:rotate-180"
            />
          </div>
        </div>

        {/* Add Category */}
        <button
          className="h-12 px-6 rounded-full bg-orange-100 text-[#d2873a] font-semibold
                     flex items-center gap-2 cursor-pointer
                     transition-all duration-200 ease-out
                     hover:bg-orange-200 hover:-translate-y-0.5
                     active:translate-y-0 active:scale-[0.97]"
                onClick={()=>setopenform(true)}     
        >
          <Plus size={18} />
          Category
        </button>

        {/* Add Dish */}
        <button
          className="h-12 px-6 rounded-full bg-[#d2873a] text-white font-semibold
                     flex items-center gap-2 cursor-pointer
                     transition-all duration-200 ease-out
                     hover:bg-[#bc742b] hover:-translate-y-0.5 hover:shadow-md hover:shadow-orange-200/60
                     active:translate-y-0 active:scale-[0.97]"
        >
          <Plus size={18} />
          Dish
        </button>

      </div>
    </div>
  );
};

export default CategoryNav;