import { LightSettings } from "./tankInterface"
import { TankInhabitant } from "./tankInterface"
import { TestSchedule } from "./tankInterface"

export interface AilmentEvent {
  ailment: string,
  ailment_type: string,
  comments: string
}

export interface ParameterEvent {
  parameter: string,
  result: number,
  result_unit: string
}

export interface RecentProductEvent {
  product: string,
  dose: number | undefined,
  unit: string | undefined
}

export interface WaterChangeEvent {
  percentage: number,
  water_type: string
}

export interface Event {
  tank_id: string,
  timestamp: string | undefined,
  event_type: string,
  update: string | number | TankInhabitant[] | LightSettings | ParameterEvent[] | TestSchedule[] | WaterChangeEvent | AilmentEvent[] | RecentProductEvent | undefined,
  comments: string | undefined
}