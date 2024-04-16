import { useEffect, useState } from "react";
import { cn } from "./cn";
import { Filter } from "lucide-react";
import { ScrollArea } from "@/components/scroll-area";
import { TextButton } from "@/components/buttons";

const PageWithFilters = ({
  title,
  filters,
  headerButtons,
  children,
}: {
  title: string;
  filters: React.JSX.Element[];
  headerButtons?: React.JSX.Element[];
  children: React.ReactNode;
}) => {
  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    const screenObserver = (e: MediaQueryListEvent) => {
      if (e.matches) setOpenFilter(false);
    };

    const mql = window.matchMedia("(min-width: 768px)");
    mql.addEventListener("change", screenObserver);
    return () => {
      mql.removeEventListener("change", screenObserver);
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          "flex min-h-screen min-w-0 flex-1 flex-col rounded-sm bg-white px-4 pb-2 md:mr-[200px] lg:mr-[260px]"
        )}
      >
        {openFilter ? null : children}
      </div>
      <div
        className={cn(
          "fixed top-2 h-full overflow-hidden",
          openFilter
            ? "left-0 top-0 z-[50] w-full bg-slate-400 p-3"
            : "max-md:hidden md:right-2 md:w-[200px] lg:w-[260px]"
        )}
      >
        <div className="flex flex-col">
          <ScrollArea
            className={cn("rounded-md", openFilter ? "pr-[1px]" : "")}
          >
            <div className={openFilter ? "h-[calc(96vh-40px)]" : "h-[96vh]"}>
              {...filters}
            </div>
          </ScrollArea>
          {openFilter ? (
            <TextButton
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation();
                setOpenFilter(false);
              }}
              content="Close Filters"
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export { PageWithFilters };
