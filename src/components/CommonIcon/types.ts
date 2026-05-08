import type { Component } from 'vue'

import * as elementPlusIcons from '@element-plus/icons-vue'

export type ElementPlusIconName =
  | 'AddLocation'
  | 'Aim'
  | 'AlarmClock'
  | 'Apple'
  | 'ArrowDown'
  | 'ArrowDownBold'
  | 'ArrowLeft'
  | 'ArrowLeftBold'
  | 'ArrowRight'
  | 'ArrowRightBold'
  | 'ArrowUp'
  | 'ArrowUpBold'
  | 'Avatar'
  | 'Back'
  | 'Baseball'
  | 'Basketball'
  | 'Bell'
  | 'BellFilled'
  | 'Bicycle'
  | 'Bottom'
  | 'BottomLeft'
  | 'BottomRight'
  | 'Bowl'
  | 'Box'
  | 'Briefcase'
  | 'Brush'
  | 'BrushFilled'
  | 'Burger'
  | 'Calendar'
  | 'Camera'
  | 'CameraFilled'
  | 'CaretBottom'
  | 'CaretLeft'
  | 'CaretRight'
  | 'CaretTop'
  | 'Cellphone'
  | 'ChatDotRound'
  | 'ChatDotSquare'
  | 'ChatLineRound'
  | 'ChatLineSquare'
  | 'ChatRound'
  | 'ChatSquare'
  | 'Check'
  | 'Checked'
  | 'Cherry'
  | 'Chicken'
  | 'ChromeFilled'
  | 'CircleCheck'
  | 'CircleCheckFilled'
  | 'CircleClose'
  | 'CircleCloseFilled'
  | 'CirclePlus'
  | 'CirclePlusFilled'
  | 'Clock'
  | 'Close'
  | 'CloseBold'
  | 'Cloudy'
  | 'Coffee'
  | 'CoffeeCup'
  | 'Coin'
  | 'ColdDrink'
  | 'Collection'
  | 'CollectionTag'
  | 'Comment'
  | 'Compass'
  | 'Connection'
  | 'Coordinate'
  | 'CopyDocument'
  | 'Cpu'
  | 'CreditCard'
  | 'Crop'
  | 'DArrowLeft'
  | 'DArrowRight'
  | 'DataAnalysis'
  | 'DataBoard'
  | 'DataLine'
  | 'DCaret'
  | 'Delete'
  | 'DeleteFilled'
  | 'DeleteLocation'
  | 'Dessert'
  | 'Discount'
  | 'Dish'
  | 'DishDot'
  | 'Document'
  | 'DocumentAdd'
  | 'DocumentChecked'
  | 'DocumentCopy'
  | 'DocumentDelete'
  | 'DocumentRemove'
  | 'Download'
  | 'Drizzling'
  | 'Edit'
  | 'EditPen'
  | 'Eleme'
  | 'ElemeFilled'
  | 'ElementPlus'
  | 'Expand'
  | 'Failed'
  | 'Female'
  | 'Files'
  | 'Film'
  | 'Filter'
  | 'Finished'
  | 'FirstAidKit'
  | 'Flag'
  | 'Fold'
  | 'Folder'
  | 'FolderAdd'
  | 'FolderChecked'
  | 'FolderDelete'
  | 'FolderOpened'
  | 'FolderRemove'
  | 'Food'
  | 'Football'
  | 'ForkSpoon'
  | 'Fries'
  | 'FullScreen'
  | 'Goblet'
  | 'GobletFull'
  | 'GobletSquare'
  | 'GobletSquareFull'
  | 'GoldMedal'
  | 'Goods'
  | 'GoodsFilled'
  | 'Grape'
  | 'Grid'
  | 'Guide'
  | 'Handbag'
  | 'Headset'
  | 'Help'
  | 'HelpFilled'
  | 'Hide'
  | 'Histogram'
  | 'HomeFilled'
  | 'HotWater'
  | 'House'
  | 'IceCream'
  | 'IceCreamRound'
  | 'IceCreamSquare'
  | 'IceDrink'
  | 'IceTea'
  | 'InfoFilled'
  | 'Iphone'
  | 'Key'
  | 'KnifeFork'
  | 'Lightning'
  | 'Link'
  | 'List'
  | 'Loading'
  | 'Location'
  | 'LocationFilled'
  | 'LocationInformation'
  | 'Lock'
  | 'Lollipop'
  | 'MagicStick'
  | 'Magnet'
  | 'Male'
  | 'Management'
  | 'MapLocation'
  | 'Medal'
  | 'Memo'
  | 'Menu'
  | 'Message'
  | 'MessageBox'
  | 'Mic'
  | 'Microphone'
  | 'MilkTea'
  | 'Minus'
  | 'Money'
  | 'Monitor'
  | 'Moon'
  | 'MoonNight'
  | 'More'
  | 'MoreFilled'
  | 'MostlyCloudy'
  | 'Mouse'
  | 'Mug'
  | 'Mute'
  | 'MuteNotification'
  | 'NoSmoking'
  | 'Notebook'
  | 'Notification'
  | 'Odometer'
  | 'OfficeBuilding'
  | 'Open'
  | 'Operation'
  | 'Opportunity'
  | 'Orange'
  | 'Paperclip'
  | 'PartlyCloudy'
  | 'Pear'
  | 'Phone'
  | 'PhoneFilled'
  | 'Picture'
  | 'PictureFilled'
  | 'PictureRounded'
  | 'PieChart'
  | 'Place'
  | 'Platform'
  | 'Plus'
  | 'Pointer'
  | 'Position'
  | 'Postcard'
  | 'Pouring'
  | 'Present'
  | 'PriceTag'
  | 'Printer'
  | 'Promotion'
  | 'QuartzWatch'
  | 'QuestionFilled'
  | 'Rank'
  | 'Reading'
  | 'ReadingLamp'
  | 'Refresh'
  | 'RefreshLeft'
  | 'RefreshRight'
  | 'Refrigerator'
  | 'Remove'
  | 'RemoveFilled'
  | 'Right'
  | 'ScaleToOriginal'
  | 'School'
  | 'Scissor'
  | 'Search'
  | 'Select'
  | 'Sell'
  | 'SemiSelect'
  | 'Service'
  | 'Setting'
  | 'SetUp'
  | 'Share'
  | 'Ship'
  | 'Shop'
  | 'ShoppingBag'
  | 'ShoppingCart'
  | 'ShoppingCartFull'
  | 'ShoppingTrolley'
  | 'Smoking'
  | 'Soccer'
  | 'SoldOut'
  | 'Sort'
  | 'SortDown'
  | 'SortUp'
  | 'Stamp'
  | 'Star'
  | 'StarFilled'
  | 'Stopwatch'
  | 'SuccessFilled'
  | 'Sugar'
  | 'Suitcase'
  | 'SuitcaseLine'
  | 'Sunny'
  | 'Sunrise'
  | 'Sunset'
  | 'Switch'
  | 'SwitchButton'
  | 'SwitchFilled'
  | 'TakeawayBox'
  | 'Ticket'
  | 'Tickets'
  | 'Timer'
  | 'ToiletPaper'
  | 'Tools'
  | 'Top'
  | 'TopLeft'
  | 'TopRight'
  | 'TrendCharts'
  | 'Trophy'
  | 'TrophyBase'
  | 'TurnOff'
  | 'Umbrella'
  | 'Unlock'
  | 'Upload'
  | 'UploadFilled'
  | 'User'
  | 'UserFilled'
  | 'Van'
  | 'VideoCamera'
  | 'VideoCameraFilled'
  | 'VideoPause'
  | 'VideoPlay'
  | 'View'
  | 'Wallet'
  | 'WalletFilled'
  | 'Warning'
  | 'WarningFilled'
  | 'WarnTriangleFilled'
  | 'Watch'
  | 'Watermelon'
  | 'WindPower'
  | 'ZoomIn'
  | 'ZoomOut'

export type IconName = `el-${ElementPlusIconName}`

export const ICON_NAME_LIST: IconName[] = [
  'el-AddLocation',
  'el-Aim',
  'el-AlarmClock',
  'el-Apple',
  'el-ArrowDown',
  'el-ArrowDownBold',
  'el-ArrowLeft',
  'el-ArrowLeftBold',
  'el-ArrowRight',
  'el-ArrowRightBold',
  'el-ArrowUp',
  'el-ArrowUpBold',
  'el-Avatar',
  'el-Back',
  'el-Baseball',
  'el-Basketball',
  'el-Bell',
  'el-BellFilled',
  'el-Bicycle',
  'el-Bottom',
  'el-BottomLeft',
  'el-BottomRight',
  'el-Bowl',
  'el-Box',
  'el-Briefcase',
  'el-Brush',
  'el-BrushFilled',
  'el-Burger',
  'el-Calendar',
  'el-Camera',
  'el-CameraFilled',
  'el-CaretBottom',
  'el-CaretLeft',
  'el-CaretRight',
  'el-CaretTop',
  'el-Cellphone',
  'el-ChatDotRound',
  'el-ChatDotSquare',
  'el-ChatLineRound',
  'el-ChatLineSquare',
  'el-ChatRound',
  'el-ChatSquare',
  'el-Check',
  'el-Checked',
  'el-Cherry',
  'el-Chicken',
  'el-ChromeFilled',
  'el-CircleCheck',
  'el-CircleCheckFilled',
  'el-CircleClose',
  'el-CircleCloseFilled',
  'el-CirclePlus',
  'el-CirclePlusFilled',
  'el-Clock',
  'el-Close',
  'el-CloseBold',
  'el-Cloudy',
  'el-Coffee',
  'el-CoffeeCup',
  'el-Coin',
  'el-ColdDrink',
  'el-Collection',
  'el-CollectionTag',
  'el-Comment',
  'el-Compass',
  'el-Connection',
  'el-Coordinate',
  'el-CopyDocument',
  'el-Cpu',
  'el-CreditCard',
  'el-Crop',
  'el-DArrowLeft',
  'el-DArrowRight',
  'el-DataAnalysis',
  'el-DataBoard',
  'el-DataLine',
  'el-DCaret',
  'el-Delete',
  'el-DeleteFilled',
  'el-DeleteLocation',
  'el-Dessert',
  'el-Discount',
  'el-Dish',
  'el-DishDot',
  'el-Document',
  'el-DocumentAdd',
  'el-DocumentChecked',
  'el-DocumentCopy',
  'el-DocumentDelete',
  'el-DocumentRemove',
  'el-Download',
  'el-Drizzling',
  'el-Edit',
  'el-EditPen',
  'el-Eleme',
  'el-ElemeFilled',
  'el-ElementPlus',
  'el-Expand',
  'el-Failed',
  'el-Female',
  'el-Files',
  'el-Film',
  'el-Filter',
  'el-Finished',
  'el-FirstAidKit',
  'el-Flag',
  'el-Fold',
  'el-Folder',
  'el-FolderAdd',
  'el-FolderChecked',
  'el-FolderDelete',
  'el-FolderOpened',
  'el-FolderRemove',
  'el-Food',
  'el-Football',
  'el-ForkSpoon',
  'el-Fries',
  'el-FullScreen',
  'el-Goblet',
  'el-GobletFull',
  'el-GobletSquare',
  'el-GobletSquareFull',
  'el-GoldMedal',
  'el-Goods',
  'el-GoodsFilled',
  'el-Grape',
  'el-Grid',
  'el-Guide',
  'el-Handbag',
  'el-Headset',
  'el-Help',
  'el-HelpFilled',
  'el-Hide',
  'el-Histogram',
  'el-HomeFilled',
  'el-HotWater',
  'el-House',
  'el-IceCream',
  'el-IceCreamRound',
  'el-IceCreamSquare',
  'el-IceDrink',
  'el-IceTea',
  'el-InfoFilled',
  'el-Iphone',
  'el-Key',
  'el-KnifeFork',
  'el-Lightning',
  'el-Link',
  'el-List',
  'el-Loading',
  'el-Location',
  'el-LocationFilled',
  'el-LocationInformation',
  'el-Lock',
  'el-Lollipop',
  'el-MagicStick',
  'el-Magnet',
  'el-Male',
  'el-Management',
  'el-MapLocation',
  'el-Medal',
  'el-Memo',
  'el-Menu',
  'el-Message',
  'el-MessageBox',
  'el-Mic',
  'el-Microphone',
  'el-MilkTea',
  'el-Minus',
  'el-Money',
  'el-Monitor',
  'el-Moon',
  'el-MoonNight',
  'el-More',
  'el-MoreFilled',
  'el-MostlyCloudy',
  'el-Mouse',
  'el-Mug',
  'el-Mute',
  'el-MuteNotification',
  'el-NoSmoking',
  'el-Notebook',
  'el-Notification',
  'el-Odometer',
  'el-OfficeBuilding',
  'el-Open',
  'el-Operation',
  'el-Opportunity',
  'el-Orange',
  'el-Paperclip',
  'el-PartlyCloudy',
  'el-Pear',
  'el-Phone',
  'el-PhoneFilled',
  'el-Picture',
  'el-PictureFilled',
  'el-PictureRounded',
  'el-PieChart',
  'el-Place',
  'el-Platform',
  'el-Plus',
  'el-Pointer',
  'el-Position',
  'el-Postcard',
  'el-Pouring',
  'el-Present',
  'el-PriceTag',
  'el-Printer',
  'el-Promotion',
  'el-QuartzWatch',
  'el-QuestionFilled',
  'el-Rank',
  'el-Reading',
  'el-ReadingLamp',
  'el-Refresh',
  'el-RefreshLeft',
  'el-RefreshRight',
  'el-Refrigerator',
  'el-Remove',
  'el-RemoveFilled',
  'el-Right',
  'el-ScaleToOriginal',
  'el-School',
  'el-Scissor',
  'el-Search',
  'el-Select',
  'el-Sell',
  'el-SemiSelect',
  'el-Service',
  'el-Setting',
  'el-SetUp',
  'el-Share',
  'el-Ship',
  'el-Shop',
  'el-ShoppingBag',
  'el-ShoppingCart',
  'el-ShoppingCartFull',
  'el-ShoppingTrolley',
  'el-Smoking',
  'el-Soccer',
  'el-SoldOut',
  'el-Sort',
  'el-SortDown',
  'el-SortUp',
  'el-Stamp',
  'el-Star',
  'el-StarFilled',
  'el-Stopwatch',
  'el-SuccessFilled',
  'el-Sugar',
  'el-Suitcase',
  'el-SuitcaseLine',
  'el-Sunny',
  'el-Sunrise',
  'el-Sunset',
  'el-Switch',
  'el-SwitchButton',
  'el-SwitchFilled',
  'el-TakeawayBox',
  'el-Ticket',
  'el-Tickets',
  'el-Timer',
  'el-ToiletPaper',
  'el-Tools',
  'el-Top',
  'el-TopLeft',
  'el-TopRight',
  'el-TrendCharts',
  'el-Trophy',
  'el-TrophyBase',
  'el-TurnOff',
  'el-Umbrella',
  'el-Unlock',
  'el-Upload',
  'el-UploadFilled',
  'el-User',
  'el-UserFilled',
  'el-Van',
  'el-VideoCamera',
  'el-VideoCameraFilled',
  'el-VideoPause',
  'el-VideoPlay',
  'el-View',
  'el-Wallet',
  'el-WalletFilled',
  'el-Warning',
  'el-WarningFilled',
  'el-WarnTriangleFilled',
  'el-Watch',
  'el-Watermelon',
  'el-WindPower',
  'el-ZoomIn',
  'el-ZoomOut',
]

export function getIconComponent(name: IconName): Component | undefined {
  return (elementPlusIcons as Record<string, Component>)[name.slice(3)]
}