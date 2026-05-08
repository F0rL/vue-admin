import type { IconName } from '@/components/CommonIcon/types'

export interface MenuItem {
  path: string
  name: string
  title: string
  icon?: IconName
  children?: MenuItem[]
}

export interface MenuProps {
  menuList: MenuItem[]
}