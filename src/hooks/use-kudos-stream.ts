"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/libs/supabase/client";
import type { Kudo } from "@/types/kudos";

type KudosStreamResult = {
  kudos: Kudo[];
  isConnected: boolean;
  error: string | null;
};

export function useKudosStream(initialKudos: Kudo[]): KudosStreamResult {
  const [kudos, setKudos] = useState<Kudo[]>(initialKudos);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel("kudos-realtime");

    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "kudos" },
        (payload: { new: Kudo }) => {
          setKudos((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          setError(null);
        } else if (status === "CHANNEL_ERROR") {
          setIsConnected(false);
          setError("Connection error");
        } else if (status === "TIMED_OUT") {
          setIsConnected(false);
          setError("Connection timed out");
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { kudos, isConnected, error };
}
