import { Ailment } from "./ailmentInterface"
import { LightSettings } from "./lightInterface"
import { Parameter } from "./parameterInterface"

export interface Event {
  tank_id: string,
  timestamp: string,
  type: string,
  product_dose: number | undefined,
  product_dose_unit: string | undefined,
  water_change_percentage: number | undefined,
  parameters: Parameter | undefined,
  light_settings: LightSettings | undefined,
  ailment: Ailment | undefined
  comments: string | undefined,
}