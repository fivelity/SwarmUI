export type FlatParamValue = string | number | boolean | string[] | null | undefined;

export type FlatParamRecord = Record<string, FlatParamValue>;

export interface LoRASlot {
  name: string;
  weight: number;
  textEncoderWeight?: number;
}

export interface ControlNetSlot {
  model: string;
  weight: number;
  image?: string;
  preprocessor?: string;
}

export interface ParamSerializerInput {
  prompt: string;
  negativeprompt?: string;
  images: number;

  seed?: number;
  steps?: number;
  cfgscale?: number;
  width?: number;
  height?: number;
  model?: string;

  initimage?: string;
  maskimage?: string;

  loras?: LoRASlot[];
  controlnets?: ControlNetSlot[];

  extras?: FlatParamRecord;
}

export class ParamSerializer {
  static toFlat(input: ParamSerializerInput): FlatParamRecord {
    const out: FlatParamRecord = {
      prompt: input.prompt,
      images: input.images,
    };

    if (input.negativeprompt !== undefined) out.negativeprompt = input.negativeprompt;
    if (input.seed !== undefined) out.seed = input.seed;
    if (input.steps !== undefined) out.steps = input.steps;
    if (input.cfgscale !== undefined) out.cfgscale = input.cfgscale;
    if (input.width !== undefined) out.width = input.width;
    if (input.height !== undefined) out.height = input.height;
    if (input.model !== undefined) out.model = input.model;

    if (input.initimage !== undefined) out.initimage = input.initimage;
    if (input.maskimage !== undefined) out.maskimage = input.maskimage;

    if (input.loras) {
      input.loras.forEach((l, idx) => {
        const i = idx + 1;
        out[`lora${i}`] = l.name;
        out[`lora${i}weight`] = l.weight;
        if (l.textEncoderWeight !== undefined) {
          out[`lora${i}textencweight`] = l.textEncoderWeight;
        }
      });
    }

    if (input.controlnets) {
      input.controlnets.forEach((c, idx) => {
        const i = idx + 1;
        out[`controlnet${i}`] = c.model;
        out[`controlnet${i}weight`] = c.weight;
        if (c.image !== undefined) out[`controlnet${i}image`] = c.image;
        if (c.preprocessor !== undefined) out[`controlnet${i}preprocessor`] = c.preprocessor;
      });
    }

    if (input.extras) {
      for (const [k, v] of Object.entries(input.extras)) {
        if (v !== undefined) {
          out[k] = v;
        }
      }
    }

    return out;
  }
}
