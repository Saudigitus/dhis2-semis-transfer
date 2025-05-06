interface TabElementsProps {
  name: string
  value: string
}

interface TabBarProps {
  selectedValue: any
  setSelectedValue: (arg: any) => void
}

export type { TabElementsProps, TabBarProps }
