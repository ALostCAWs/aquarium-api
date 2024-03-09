import { LightSettings } from "./lightInterface"
import { Parameter } from "./parameterInterface"
import { TestSchedule } from "./testScheduleInterface"
import { WaterChange } from "./waterChange"

export interface Tank {
  id: string,
  volume: number,
  volume_unit: string,
  is_cycled: boolean,
  filtration: string,
  substrate: string,
  temperature_setting: number,
  temperature_unit: string,
  livestock_list: string[],
  plant_list: string[],
  light_settings: LightSettings,
  parameters: Parameter,
  test_schedule: TestSchedule,
  recent_water_change: WaterChange,
}