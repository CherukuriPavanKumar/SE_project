// src/hooks/use-leads-data.ts
"use client";

import { useEffect, useCallback } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setLeads, setLoading, setError } from "@/lib/redux/slices/leadSlice";
import { getLeads } from "@/app/dashboard/leads/actions"; // Import your Server Action directly
import toast from "react-hot-toast";

export function useLeadsData() {
  const dispatch = useAppDispatch();

  const fetchLeads = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      
      // Call the Server Action (The Middleware Layer)
      const data = await getLeads();
      
      if (data) {
        dispatch(setLeads(data));
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      dispatch(setError("Failed to load leads"));
      toast.error("Could not load leads");
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Automatically fetch on mount
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return { refreshLeads: fetchLeads };
}