import { Parameter } from "./parameterInterface"
import { Test_Schedule } from "./testScheduleInterface"
import { WaterChange } from "./waterChange"

export interface Tank {
  id: string,
  volume: number,
  volume_unit: string,
  is_cycled: boolean,
  filtration: string,
  substrate: string,
  light: string,
  light_schedule: number,
  temperature_setting: number,
  temperature_unit: string,
  livestock_list: string[],
  plant_list: string[]
  parameters: Parameter,
  test_schedule: Test_Schedule,
  recent_water_change: WaterChange,
}