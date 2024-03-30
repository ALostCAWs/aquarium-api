export interface ParameterItem {
  result: number,
  result_unit: string,
  test_timestamp: string
}
export interface Parameter {
  [parameter: string]: ParameterItem
}