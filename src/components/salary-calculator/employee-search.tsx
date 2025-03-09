import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useEmployees } from "@/lib/hooks/use-employees";

interface EmployeeSearchProps {
  onSelect: (employeeId: string) => void;
  selectedEmployeeId?: string;
  className?: string;
}

export function EmployeeSearch({
  onSelect,
  selectedEmployeeId,
  className = "",
}: EmployeeSearchProps) {
  const { employees } = useEmployees();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<typeof employees>([]);
  const [showResults, setShowResults] = useState(false);

  // Get selected employee name
  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);

  // Update search results when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setSearchResults(results);
  }, [searchTerm, employees]);

  const handleSelect = (employeeId: string) => {
    onSelect(employeeId);
    setSearchTerm("");
    setShowResults(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSelect("");
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center">
        <div className="relative flex-1">
          <Input
            placeholder={
              selectedEmployee ? selectedEmployee.name : "بحث عن موظف..."
            }
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            className="text-right pr-10"
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        {selectedEmployeeId && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-card border rounded-md shadow-lg max-h-60 overflow-auto">
          {searchResults.map((employee) => (
            <div
              key={employee.id}
              className="p-2 hover:bg-muted cursor-pointer text-right"
              onClick={() => handleSelect(employee.id)}
            >
              <div className="font-medium">{employee.name}</div>
              <div className="text-sm text-muted-foreground">
                {employee.position} - {employee.department}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
