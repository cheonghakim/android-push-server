export type AlarmType = {}

export type targetType = {
  userId: string
  token: string
}

export type dataType = {
  title: string
  body: string
  targets: targetType[]
  selectAll?: boolean
}
