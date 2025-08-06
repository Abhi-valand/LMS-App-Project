import AnimatedPage from "@/components/ui/AnimatedPage";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState ,useEffect} from "react";

const categories = [
  { id: "Next JS", label: "Next JS" },
  { id: "Data Science", label: "Data Science" },
  { id: "Frontend Development", label: "Frontend Development" },
  { id: "Fullstack Development", label: "Fullstack Development" },
  { id: "MERN Stack Development", label: "MERN Stack Development" },
  { id: "Backend Development", label: "Backend Development" },
  { id: "Javascript", label: "Javascript" },
  { id: "Python", label: "Python" },
  { id: "Docker", label: "Docker" },
  { id: "MongoDB", label: "MongoDB" },
  { id: "HTML", label: "HTML" },
];

const Filter = ({ handleFilterChange, query }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  useEffect(() => {
    if (query && selectedCategories.length === 0) {
      const match = categories.find(
        (cat) => cat?.id?.toLowerCase?.() === query?.toLowerCase?.()
      );
      if (match) {
        setSelectedCategories([match.id]);
        handleFilterChange([match.id], sortByPrice);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => {
      const updated = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];
      handleFilterChange(updated, sortByPrice);
      return updated;
    });
  };

  const selectByPriceHandler = (value) => {
    setSortByPrice(value);
    handleFilterChange(selectedCategories, value);
  };

  return (
    <AnimatedPage>
            
    <div className="w-full md:w-72 bg-white dark:bg-[#0A0A0A]/5 p-4 rounded-xl shadow-md sticky top-20 h-fit">
      <div className="mb-4">
        <h2 className="font-semibold text-lg md:text-xl mb-2">Filter Options</h2>
        <Select onValueChange={selectByPriceHandler} >
          <SelectTrigger className="w-full  ">
            <SelectValue placeholder="Sort by price" />
          </SelectTrigger>
          <SelectContent className='dark:bg-[#0A0A0A]'>
            <SelectGroup className=''>
              <SelectLabel  >Sort by price</SelectLabel>
              <SelectItem value="low" >Low to High</SelectItem>
              <SelectItem value="high" >High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <hr className="my-4 border-gray-300 dark:border-gray-700" />
      <div>
        <h3 className="font-semibold text-base mb-3 dark:bg-[#0A0A0A]/5">Category</h3>
        <div
  className="max-h-64 overflow-y-auto pr-2
  scrollbar-thin
  scrollbar-thumb-gray-400
  scrollbar-track-gray-200
  dark:scrollbar-thumb-gray-600
  dark:scrollbar-track-gray-800"
>
  {categories.map((category) => (
    <div key={category.id} className="flex items-center space-x-2 mb-2">
      <Checkbox
        id={category.id}
        checked={selectedCategories.includes(category.id)}
        onCheckedChange={() => handleCategoryChange(category.id)}
        />
      <Label
        htmlFor={category.id}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
        {category.label}
      </Label>
    </div>
  ))}
</div>
      </div>
    </div>
  </AnimatedPage>
  );
};

export default Filter;

