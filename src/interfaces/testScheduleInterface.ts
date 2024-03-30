// Schedule for specific test to be taken every n days
export interface TestScheduleItem {
  frequency: number
}

export interface TestSchedule {
  [parameter: string]: TestScheduleItem
}