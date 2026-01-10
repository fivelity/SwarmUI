import { useEffect, useRef } from "react";
import type { FlatParamRecord } from "@/lib/utils/ParamSerializer";
import { runText2ImageWS, type T2IWsRunHandle } from "@/services/t2iWsRunner";

export interface UseText2ImageWsOptions {
  enabled: boolean;
}

export interface WsRunHandle {
  requestId: string;
  close: () => void;
}

export function useText2ImageWS(options: UseText2ImageWsOptions) {
  const activeHandlesRef = useRef<Map<string, T2IWsRunHandle>>(new Map());

  useEffect(() => {
    const handles = activeHandlesRef.current;
    return () => {
      for (const h of handles.values()) {
        h.close();
      }
      handles.clear();
    };
  }, []);

  const run = async (flatPayload: FlatParamRecord): Promise<WsRunHandle> => {
    const handle = await runText2ImageWS(flatPayload);
    activeHandlesRef.current.set(handle.requestId, handle);
    return {
      requestId: handle.requestId,
      close: () => {
        const existing = activeHandlesRef.current.get(handle.requestId);
        existing?.close();
        activeHandlesRef.current.delete(handle.requestId);
      },
    };
  };

  return { run, enabled: options.enabled };
}
