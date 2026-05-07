export interface MenuItem {
  path: string
  name: string
  title: string
  icon?: string
  children?: MenuItem[]
}

export interface MenuProps {
  menuList: MenuItem[]
}