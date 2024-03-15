import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function SearchAndChooseButton({
  value,
  placeholder,
  searchPlaceholder,
  choices,
  onValueChanged,
}: {
  value: string | null;
  placeholder?: string;
  searchPlaceholder?: string;
  choices: string[];
  onValueChanged: (val: string | null) => void;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const results = choices
    .filter((choice) =>
      choice.toLowerCase().includes(searchInput.trim().toLowerCase())
    )
    .map((choice, idx) => (
      <li
        key={idx}
        className="flex flex-row items-center bg-white p-2 hover:cursor-pointer hover:bg-slate-300"
        onClick={(e) => {
          if (choice === value) onValueChanged(null);
          else onValueChanged(choice);
          e.stopPropagation();
          setIsPopoverOpen(false);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
      >
        <p className="flex-1">{choice}</p>
        {choice == value ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1rem"
            height="1rem"
            viewBox="0 0 24 24"
          >
            <path
              fill="black"
              d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z"
            />
          </svg>
        ) : null}
      </li>
    ));

  if (results.length > 0) {
    results.unshift(
      <li
        key={results.length + 1}
        className="flex flex-row items-center bg-white p-2 hover:cursor-pointer hover:bg-slate-300"
        onClick={(e) => {
          if (value !== undefined) onValueChanged(null);
          setIsPopoverOpen(false);
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
      >
        <p className="flex-1 italic text-gray-500">Remove value</p>
      </li>
    );
  }

  return (
    <div className="relative text-sm">
      <div
        className="h-full min-h-[40px] w-full flex items-center hover:cursor-pointer"
        onClick={() => setIsPopoverOpen((prev) => !prev)}
      >
        <p className="px-2 text-start leading-4">
          {value ? value : placeholder}
        </p>
      </div>
      {isPopoverOpen && (
        <div className="absolute max-h-[200px] top-full left-0 right-0 overflow-y-auto !rounded-none bg-white z-[1000] shadow-sm shadow-gray-600 scrollbar small-scrollbar">
          <div className="flex flex-col">
            <input
              className="!m-0 pl-2 h-10 w-full !rounded-none border-0 placeholder:text-xs"
              value={searchInput}
              placeholder={searchPlaceholder}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <ul>
              {results.length > 0 ? (
                results
              ) : (
                <li
                  className="flex flex-row items-center bg-white p-2"
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                >
                  <p className="flex-1">No results found!</p>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
