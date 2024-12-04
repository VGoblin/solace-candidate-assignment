"use client";

import { useEffect, useState, useMemo, ChangeEvent } from "react";
import useDebounce from "@/hooks/useDebounce";

interface Advocate {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        const response = await fetch("/api/advocates");
        const jsonResponse = await response.json();
        setAdvocates(jsonResponse.data || []);
      } catch (error) {
        console.error("Error fetching advocates:", error);
      }
    };

    fetchAdvocates();
  }, []);

  const filteredAdvocates = useMemo(() => {
    const lowercasedTerm = debouncedSearchTerm.toLowerCase();
    return advocates.filter((advocate) =>
      [advocate.firstName, advocate.lastName, advocate.city, advocate.degree]
        .some((field) => field.toLowerCase().includes(lowercasedTerm)) ||
      advocate.specialties.some((specialty) => specialty.toLowerCase().includes(lowercasedTerm)) ||
      advocate.yearsOfExperience.toString().includes(lowercasedTerm) ||
      advocate.phoneNumber.toString().includes(lowercasedTerm)
    );
  }, [debouncedSearchTerm, advocates]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onReset = () => {
    setSearchTerm("");
  };

  return (
    <main className="container mx-auto py-6">
      <h1 className="text-4xl text-center">Solace Advocates</h1>
      <div className="flex items-center max-w-lg mx-auto mt-4">
        <label htmlFor="search-term" className="sr-only">Search</label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
            <input type="text" id="search-term" value={searchTerm} onChange={onChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="Search Mockups, Logos, Design Templates..." required />
            <button type="button" className="absolute inset-y-0 end-0 flex items-center pe-3" onClick={onReset}>
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
              </svg>
            </button>
        </div>
      </div>
      
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg border mt-4">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">First Name</th>
              <th scope="col" className="px-6 py-3">Last Name</th>
              <th scope="col" className="px-6 py-3">City</th>
              <th scope="col" className="px-6 py-3">Degree</th>
              <th scope="col" className="px-6 py-3">Specialties</th>
              <th scope="col" className="px-6 py-3">Years of Experience</th>
              <th scope="col" className="px-6 py-3">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate, index) => {
              return (
                <tr className="bg-white border-b" key={index}>
                  <td scope="row" className="px-6 py-4">{advocate.firstName}</td>
                  <td scope="row" className="px-6 py-4">{advocate.lastName}</td>
                  <td scope="row" className="px-6 py-4">{advocate.city}</td>
                  <td scope="row" className="px-6 py-4">{advocate.degree}</td>
                  <td scope="row" className="px-6 py-4">
                    <details>
                      <summary className="cursor-pointer text-blue-500">{advocate.specialties.length} Specialties</summary>
                      <ul className="list-disc list-inside mt-2">
                        {advocate.specialties.map((specialty, index) => (
                          <li key={index}>{specialty}</li>
                        ))}
                      </ul>
                    </details>
                  </td>
                  <td scope="row" className="px-6 py-4">{advocate.yearsOfExperience}</td>
                  <td scope="row" className="px-6 py-4">{advocate.phoneNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
