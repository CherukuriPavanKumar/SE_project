"use client";

import { useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setClients, setLoading, setError } from "@/lib/redux/slices/clientSlice";
import { getClients } from "@/app/dashboard/clients/actions";
import toast from "react-hot-toast";

export function useClientData() {
  const dispatch = useAppDispatch();
  const clientsCount = useAppSelector((state) => state.clients.items.length);
  const isInitialized = useRef(false);

  const fetchClients = useCallback(async (force = false) => {
    // Cache check: Don't refetch if we have data and aren't forcing
    if (!force && clientsCount > 0 && isInitialized.current) {
      return;
    }

    try {
      if (clientsCount === 0) dispatch(setLoading(true));
      
      const data = await getClients();
      
      if (data) {
        dispatch(setClients(data));
      }
      isInitialized.current = true;
    } catch (err) {
      console.error("Failed to fetch clients:", err);
      dispatch(setError("Failed to load clients"));
      toast.error("Could not load clients");
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, clientsCount]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return { refreshClients: () => fetchClients(true) };
}