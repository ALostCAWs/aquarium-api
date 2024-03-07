import { Parameter } from "./parameterInterface"

export interface Event {
  tank_id: string,
  timestamp: string,
  type: string,
  parameters: Parameter | undefined,
  water_change_percentage: number | undefined
  comments: string | undefined,
}