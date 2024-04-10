import { LightSettings } from "./tankInterface"
import { TankInhabitant } from "./tankInterface"
import { TestSchedule } from "./tankInterface"

export interface AilmentEvent {
  name: string,
  type: string,
  comments: string
}

export interface ParameterEvent {
  parameter: string,
  result: number,
  result_unit: string
}

export interface RecentProductEvent {
  name: string,
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
  type: string,
  update: string | number | TankInhabitant[] | LightSettings | ParameterEvent[] | TestSchedule[] | WaterChangeEvent | AilmentEvent[] | RecentProductEvent | undefined,
  comments: string | undefined
}