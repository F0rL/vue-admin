<script setup lang="ts">
import { CommonIcon } from '@/components/CommonIcon'
import { menuApi, type MenuTreeItem, type MenuType } from '@/api/menu'

const tableData = ref<MenuTreeItem[]>([])
async function getList() {
  const res = await menuApi.tree()
  tableData.value = res
}

function handleAddChild(index: number, row: MenuTreeItem) {
  console.log('新增下级', index, row)
}

function handleEdit(index: number, row: MenuTreeItem) {
  console.log('修改', index, row)
}

function handleDelete(index: number, row: MenuTreeItem) {
  console.log('删除', index, row)
}

const typeMap: Record<
  MenuType,
  { label: string; tag: 'warning' | 'primary' | 'info' }
> = {
  directory: { label: '目录', tag: 'warning' },
  menu: { label: '菜单', tag: 'primary' },
  button: { label: '按钮', tag: 'info' },
}

getList()
</script>

<template>
  <div class="p-4 bg-white rounded">
    <el-button type="primary">
      <CommonIcon icon="el-Plus"></CommonIcon>
      新增菜单
    </el-button>
    <el-table class="mt-4" :data="tableData" row-key="id">
      <el-table-column prop="name" label="标题" />
      <el-table-column prop="type" label="类型">
        <template #default="scope">
          <el-tag
            :type="typeMap[scope.row.type as MenuType]?.tag"
            effect="plain"
          >
            {{ typeMap[scope.row.type as MenuType]?.label ?? scope.row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路由地址" />
      <el-table-column prop="component" label="页面组件" />
      <el-table-column prop="permissionCode" label="权限标识" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag
            :type="scope.row.status ? 'success' : 'danger'"
            effect="light"
          >
            {{ scope.row.status ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <div class="whitespace-nowrap">
            <el-button
              type="primary"
              link
              @click="handleAddChild(scope.$index, scope.row)"
            >
              新增下级
            </el-button>
            <el-button
              type="primary"
              link
              @click="handleEdit(scope.$index, scope.row)"
            >
              修改
            </el-button>
            <el-button
              type="danger"
              link
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";
:deep(.el-table th.el-table__cell) {
  @apply bg-gray-100 font-semibold text-gray-500;
}
</style>
