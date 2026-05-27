<script setup lang="ts">
import { feedback } from '@/plugins/feedback'
import { menuApi, type MenuTreeItem, type MenuType } from '@/api/menu'
import EditMenuDrawer from './EditMenuDrawer.vue'

const tableData = ref<MenuTreeItem[]>([])
const loading = ref(false)

async function getList() {
  loading.value = true
  try {
    const res = await menuApi.tree()
    tableData.value = res
  } finally {
    loading.value = false
  }
}

getList()

function handleAdd() {
  editDrawerRef.value?.open({ mode: 'create', treeData: tableData.value })
}

function handleAddChild(row: MenuTreeItem) {
  editDrawerRef.value?.open({
    mode: 'createChild',
    parent: row,
    treeData: tableData.value,
  })
}

function handleEdit(row: MenuTreeItem) {
  editDrawerRef.value?.open({
    mode: 'edit',
    row,
    treeData: tableData.value,
  })
}

async function handleDelete(row: MenuTreeItem) {
  const confirmed = await feedback.confirm(
    `确定删除「${row.name}」吗？${
      row.children?.length ? '其子节点也将一并删除。' : ''
    }`,
    { title: '删除确认', type: 'warning' }
  )
  if (!confirmed) return

  try {
    await menuApi.delete({ ids: [row.id] })
    feedback.success('删除成功')
    await getList()
  } catch {
    // 接口层已处理错误提示
  }
}

const typeMap: Record<
  MenuType,
  { label: string; tag: 'warning' | 'primary' | 'info' }
> = {
  directory: { label: '目录', tag: 'warning' },
  menu: { label: '菜单', tag: 'primary' },
  button: { label: '按钮', tag: 'info' },
}

const editDrawerRef = useTemplateRef('editDrawerRef')
</script>

<template>
  <div class="p-4 bg-white rounded">
    <el-button type="primary" @click="handleAdd">
      <CommonIcon icon="el-Plus" />
      新增菜单
    </el-button>
    <el-table class="mt-4" :data="tableData" :loading="loading" row-key="id">
      <el-table-column prop="name" label="标题" min-width="160" />
      <el-table-column prop="type" label="类型" width="100" align="center">
        <template #default="scope">
          <el-tag
            :type="typeMap[scope.row.type as MenuType]?.tag"
            effect="plain"
          >
            {{ typeMap[scope.row.type as MenuType]?.label ?? scope.row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路由地址" min-width="160" />
      <el-table-column prop="component" label="页面组件" min-width="160" />
      <el-table-column prop="permissionCode" label="权限标识" min-width="140" />
      <el-table-column
        prop="sortOrder"
        label="排序"
        width="70"
        align="center"
      />
      <el-table-column prop="status" label="状态" width="80" align="center">
        <template #default="scope">
          <el-tag
            :type="scope.row.status ? 'success' : 'danger'"
            effect="light"
          >
            {{ scope.row.status ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" fixed="right">
        <template #default="scope">
          <div class="flex items-center justify-end">
            <el-button
              v-if="scope.row.type !== 'button'"
              link
              type="primary"
              @click="handleAddChild(scope.row)"
            >
              新增下级
            </el-button>
            <el-button link type="primary" @click="handleEdit(scope.row)">
              修改
            </el-button>
            <el-button link type="danger" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <EditMenuDrawer ref="editDrawerRef" @saved="getList" />
</template>

<style scoped>
@reference "@/styles/main.css";
:deep(.el-table th.el-table__cell) {
  @apply bg-gray-100 font-semibold text-gray-500;
}
</style>
