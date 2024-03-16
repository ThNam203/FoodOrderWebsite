import { useState } from "react";
import LoadingCircle from "./LoadingCircle/loading_circle";

const AddNewThingDialog = ({
  title,
  placeholder,
  open,
  onOpenChange,
  onAddClick,
}: {
  title: string;
  placeholder: string;
  open: boolean;
  onOpenChange: (value: boolean) => any;
  onAddClick: (value: string) => Promise<any>;
}) => {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="">
      <svg
        className="mx-2"
        onClick={() => onOpenChange(true)}
        xmlns="http://www.w3.org/2000/svg"
        width="1rem"
        height="1rem"
        viewBox="0 0 256 256"
      >
        <path
          fill="black"
          d="M128 20a108 108 0 1 0 108 108A108.12 108.12 0 0 0 128 20m0 192a84 84 0 1 1 84-84a84.09 84.09 0 0 1-84 84m52-84a12 12 0 0 1-12 12h-28v28a12 12 0 0 1-24 0v-28H88a12 12 0 0 1 0-24h28V88a12 12 0 0 1 24 0v28h28a12 12 0 0 1 12 12"
        />
      </svg>
      {open && (
        <div>
          <h3>{title}</h3>
          <div className="!my-4 flex flex-row items-center gap-3 text-sm">
            <label htmlFor="alert_input" className="w-36 font-semibold">
              {placeholder}
            </label>
            <input
              id="alert_input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 rounded-sm border p-1"
            />
          </div>
          <button
            onClick={async (e) => {
              setIsLoading(true);
              try {
                await onAddClick(value);
                onOpenChange(false);
              } catch (e) {}

              setIsLoading(false);
            }}
            className="!h-[35px]"
            disabled={isLoading}
          >
            Done
            {isLoading ? <LoadingCircle /> : null}
          </button>
          <button
            className={
              "!h-[35px] border-none bg-red-400 text-white hover:bg-red-500 hover:text-white"
            }
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AddNewThingDialog;
