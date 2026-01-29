"use client";

import { useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setAgents, setLoading, setError } from "@/lib/redux/slices/agentSlice";
import { getAgents } from "@/app/dashboard/agents/actions";
import toast from "react-hot-toast";

export function useAgentData() {
  const dispatch = useAppDispatch();
  const agentsCount = useAppSelector((state) => state.agents.items.length);
  const isInitialized = useRef(false);

  const fetchAgents = useCallback(async (force = false) => {
    if (!force && agentsCount > 0 && isInitialized.current) {
      return;
    }

    try {
      if (agentsCount === 0) dispatch(setLoading(true));
      
      const data = await getAgents();
      
      if (data) {
        dispatch(setAgents(data));
      }
      isInitialized.current = true;
    } catch (err) {
      console.error("Failed to fetch agents:", err);
      dispatch(setError("Failed to load agents"));
      toast.error("Could not load agents");
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, agentsCount]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return { refreshAgents: () => fetchAgents(true) };
}