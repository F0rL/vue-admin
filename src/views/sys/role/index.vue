<script setup lang="ts">
import { feedback } from '@/plugins/feedback'
import { roleApi, type RoleListItem } from '@/api/role'
import EditRoleDrawer from './EditRoleDrawer.vue'

const tableData = ref<RoleListItem[]>([])
const loading = ref(false)
const drawerVisible = ref(false)
const drawerMode = ref<'create' | 'edit'>('create')
const editingId = ref('')

async function fetchList() {
  loading.value = true
  try {
    const res = await roleApi.list()
    tableData.value = res
  } finally {
    loading.value = false
  }
}

fetchList()

function handleAdd() {
  drawerMode.value = 'create'
  editingId.value = ''
  drawerVisible.value = true
}

function handleEdit(row: RoleListItem) {
  drawerMode.value = 'edit'
  editingId.value = row.id
  drawerVisible.value = true
}

async function handleDelete(row: RoleListItem) {
  if (row.isSystem) return

  const confirmed = await feedback.confirm(
    `确定删除角色「${row.name}」吗？`,
    { title: '删除确认', type: 'warning' }
  )
  if (!confirmed) return

  try {
    await roleApi.delete(row.id)
    feedback.success('删除成功')
    await fetchList()
  } catch {
    // 接口层已处理错误提示
  }
}
</script>

<template>
  <div class="p-4 bg-white rounded">
    <el-button type="primary" @click="handleAdd">
      <CommonIcon icon="el-Plus" />
      新增角色
    </el-button>

    <el-table class="mt-4" :data="tableData" :loading="loading">
      <el-table-column
        prop="name"
        label="角色名称"
        min-width="130"
      />
      <el-table-column
        prop="code"
        label="角色编码"
        min-width="120"
      >
        <template #default="scope">
          <code class="text-sm font-mono bg-gray-100 px-1.5 py-0.5 rounded">
            {{ scope.row.code }}
          </code>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        min-width="160"
        show-overflow-tooltip
      />
      <el-table-column
        prop="isSystem"
        label="系统角色"
        width="90"
        align="center"
      >
        <template #default="scope">
          <el-tag
            :type="scope.row.isSystem ? 'warning' : 'info'"
            effect="light"
          >
            {{ scope.row.isSystem ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="userCount"
        label="用户数"
        width="70"
        align="center"
      />
      <el-table-column
        prop="sortOrder"
        label="排序"
        width="70"
        align="center"
      />
      <el-table-column
        prop="status"
        label="状态"
        width="70"
        align="center"
      >
        <template #default="scope">
          <el-tag
            :type="scope.row.status ? 'success' : 'danger'"
            effect="light"
          >
            {{ scope.row.status ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="创建时间"
        width="170"
        align="center"
      />
      <el-table-column label="操作" width="150" align="right" fixed="right">
        <template #default="scope">
          <div class="flex items-center justify-end gap-1">
            <el-button link type="primary" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-tooltip
              v-if="scope.row.isSystem"
              content="系统角色不可删除"
              placement="top"
            >
              <el-button link type="danger" disabled>
                删除
              </el-button>
            </el-tooltip>
            <el-button
              v-else
              link
              type="danger"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <EditRoleDrawer
    :visible="drawerVisible"
    :mode="drawerMode"
    :editing-id="editingId"
    @update:visible="drawerVisible = $event"
    @saved="fetchList"
  />
</template>

<style scoped>
@reference "@/styles/main.css";
:deep(.el-table th.el-table__cell) {
  @apply bg-gray-100 font-semibold text-gray-500;
}
</style>
