import { swarmHttp } from "@/api/SwarmHttpClient";
import type { GenerateText2ImageResponse } from "@/types/t2i";
import type { FlatParamRecord } from "@/lib/utils/ParamSerializer";

export class T2IService {
  async generateText2ImageREST(payload: FlatParamRecord): Promise<GenerateText2ImageResponse> {
    // SwarmUI expects root-level flat parameters, plus required `images` and `session_id`.
    return swarmHttp.post<GenerateText2ImageResponse>("GenerateText2Image", payload);
  }
}

export const t2iService = new T2IService();
