"use client";

import { useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setProperties, setLoading, setError } from "@/lib/redux/slices/propertySlice";
import { getProperties } from "@/app/dashboard/properties/actions";
import toast from "react-hot-toast";

export function usePropertyData() {
  const dispatch = useAppDispatch();
  const propertiesCount = useAppSelector((state) => state.properties.items.length);
  const isInitialized = useRef(false);

  const fetchProperties = useCallback(async (force = false) => {
    if (!force && propertiesCount > 0 && isInitialized.current) {
      return;
    }

    try {
      if (propertiesCount === 0) dispatch(setLoading(true));
      
      const data = await getProperties();
      
      if (data) {
        dispatch(setProperties(data));
      }
      isInitialized.current = true;
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      dispatch(setError("Failed to load properties"));
      toast.error("Could not load properties");
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, propertiesCount]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { refreshProperties: () => fetchProperties(true) };
}