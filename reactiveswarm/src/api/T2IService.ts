import { swarmHttp } from "@/api/SwarmHttpClient";
import type { GenerateText2ImageResponse } from "@/types/t2i";
import type { FlatParamRecord } from "@/lib/utils/ParamSerializer";

export class T2IService {
  async generateText2ImageREST(payload: FlatParamRecord): Promise<GenerateText2ImageResponse> {
    // REST route expects:
    // { images: <count>, rawInput: { ...flat params... } }
    const imagesRaw = payload["images"];
    const images = typeof imagesRaw === "number" ? imagesRaw : 1;

    const rawInput: Record<string, unknown> = { ...payload };
    delete rawInput.images;
    return swarmHttp.post<GenerateText2ImageResponse>("GenerateText2Image", { images, rawInput });
  }
}

export const t2iService = new T2IService();
