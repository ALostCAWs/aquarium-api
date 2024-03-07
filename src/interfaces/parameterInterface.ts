interface Parameter_Item {
  result: number,
  result_unit: string,
  test_timestamp: string
}
export interface Parameter {
  [parameter: string]: Parameter_Item
}