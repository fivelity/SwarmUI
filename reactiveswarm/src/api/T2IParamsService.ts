import { swarmHttp } from "@/api/SwarmHttpClient";
import type { ListT2IParamsResponse } from "@/types/t2iParams";

export class T2IParamsService {
  listT2IParams(): Promise<ListT2IParamsResponse> {
    return swarmHttp.post<ListT2IParamsResponse>("ListT2IParams", {});
  }

  triggerRefresh(strong: boolean): Promise<ListT2IParamsResponse> {
    return swarmHttp.post<ListT2IParamsResponse>("TriggerRefresh", { strong });
  }
}

export const t2iParamsService = new T2IParamsService();
