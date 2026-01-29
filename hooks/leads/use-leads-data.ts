// hooks/use-leads-data.ts
"use client";

import { useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setLeads, setLoading, setError } from "@/lib/redux/slices/leadSlice";
import { getLeads } from "@/app/dashboard/leads/actions";

export function useLeadsData() {
  const dispatch = useAppDispatch();
  // Check if we already have data
  const leadsCount = useAppSelector((state) => state.leads.items.length);
  const isInitialized = useRef(false);

  const fetchLeads = useCallback(async (force = false) => {
    // OPTIMIZATION: If we have data and aren't forcing a refresh, STOP.
    // This prevents re-fetching when navigating between tabs.
    if (!force && leadsCount > 0 && isInitialized.current) {
      return;
    }

    try {
      if (leadsCount === 0) dispatch(setLoading(true)); // Only show loading if empty
      
      const data = await getLeads();
      
      if (data) {
        dispatch(setLeads(data));
      }
      isInitialized.current = true;
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      dispatch(setError("Failed to load leads"));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, leadsCount]);

  // Automatically fetch on mount
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return { refreshLeads: () => fetchLeads(true) }; // Allow manual force refresh
}