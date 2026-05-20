<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { feedback } from '@/plugins/feedback'
import {
  userApi,
  type UserListItem,
  type CreateUserParams,
  type UpdateUserParams,
  type RoleItem,
  type DepartmentItem,
} from '@/api/user'

// ─── 搜索表单 ───
const searchParams = reactive({
  keyword: '',
  status: '' as '' | 'true' | 'false',
  roleId: '',
  departmentId: '',
})

// ─── 表格数据 ───
const tableData = ref<UserListItem[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const loading = ref(false)

// ─── 角色/部门选项 ───
const roleOptions = ref<RoleItem[]>([])
const departmentOptions = ref<DepartmentItem[]>([])

// ─── 对话框 ───
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const editingId = ref('')

const formRef = ref<FormInstance>()

interface UserForm {
  username: string
  password: string
  nickname: string
  email: string
  phone: string
  roleId: string
  departmentId: string
  isActive: boolean
  isLocked: boolean
}

const formDefault: UserForm = {
  username: '',
  password: '',
  nickname: '',
  email: '',
  phone: '',
  roleId: '',
  departmentId: '',
  isActive: true,
  isLocked: false,
}

const formData = reactive<UserForm>({ ...formDefault })

const formRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 50, message: '用户名长度 2-50 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 255, message: '密码长度 6-255 个字符', trigger: 'blur' },
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 1, max: 100, message: '昵称长度 1-100 个字符', trigger: 'blur' },
  ],
  email: [{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }],
}

// 编辑时密码为非必填
const editFormRules: FormRules = {
  ...formRules,
  password: [
    { min: 6, max: 255, message: '密码长度 6-255 个字符', trigger: 'blur' },
  ],
}

// ─── 获取数据 ───
async function fetchList() {
  loading.value = true
  try {
    const result = await userApi.list({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchParams.keyword || undefined,
      status:
        searchParams.status !== '' ? searchParams.status === 'true' : undefined,
      roleId: searchParams.roleId || undefined,
      departmentId: searchParams.departmentId || undefined,
    })
    tableData.value = result.list
    total.value = result.total
  } finally {
    loading.value = false
  }
}

async function fetchSelectOptions() {
  const [roles, departments] = await Promise.all([
    userApi.getRoleList().catch(() => [] as RoleItem[]),
    userApi.getDepartmentTree().catch(() => [] as DepartmentItem[]),
  ])
  roleOptions.value = roles
  departmentOptions.value = departments
}

// ─── 搜索 / 重置 ───
function handleSearch() {
  currentPage.value = 1
  fetchList()
}

function handleReset() {
  searchParams.keyword = ''
  searchParams.status = ''
  searchParams.roleId = ''
  searchParams.departmentId = ''
  currentPage.value = 1
  fetchList()
}

// ─── 分页 ───
function handleSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
  fetchList()
}

function handleCurrentChange(page: number) {
  currentPage.value = page
  fetchList()
}

// ─── 新增 / 编辑 ───
function handleAdd() {
  isEdit.value = false
  dialogTitle.value = '新增用户'
  editingId.value = ''
  Object.assign(formData, formDefault)
  dialogVisible.value = true
}

async function handleEdit(row: UserListItem) {
  isEdit.value = true
  dialogTitle.value = '编辑用户'
  editingId.value = row.id
  formData.username = row.username
  formData.nickname = row.nickname
  formData.email = row.email ?? ''
  formData.phone = row.phone ?? ''
  formData.roleId = row.role?.id ?? ''
  formData.departmentId = row.department?.id ?? ''
  formData.password = ''
  formData.isActive = row.isActive
  formData.isLocked = row.isLocked
  dialogVisible.value = true
}

// ─── 保存 ───
async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  if (isEdit.value) {
    const payload: UpdateUserParams = { id: editingId.value }
    if (formData.nickname) payload.nickname = formData.nickname
    payload.email = formData.email || null
    payload.phone = formData.phone || null
    payload.roleId = formData.roleId || null
    payload.departmentId = formData.departmentId || null
    payload.isActive = formData.isActive
    payload.isLocked = formData.isLocked
    if (formData.password) payload.password = formData.password

    await userApi.update(payload)
    feedback.success('更新成功')
  } else {
    const payload: CreateUserParams = {
      username: formData.username,
      password: formData.password,
      nickname: formData.nickname,
      email: formData.email || null,
      phone: formData.phone || null,
      roleId: formData.roleId || null,
      departmentId: formData.departmentId || null,
    }
    await userApi.create(payload)
    feedback.success('创建成功')
  }

  dialogVisible.value = false
  fetchList()
}

// ─── 删除 ───
async function handleDelete(row: UserListItem) {
  try {
    await feedback.confirm(`确定要删除用户「${row.nickname}」吗？`)
  } catch {
    return
  }

  await userApi.delete(row.id)
  feedback.success('删除成功')
  fetchList()
}

// ─── 批量操作 ───
const selectedIds = ref<string[]>([])

function handleSelectionChange(selection: UserListItem[]) {
  selectedIds.value = selection.map(item => item.id)
}

async function handleBatchDelete() {
  if (selectedIds.value.length === 0) return

  try {
    await feedback.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 个用户吗？`
    )
  } catch {
    return
  }

  for (const id of selectedIds.value) {
    await userApi.delete(id)
  }
  feedback.success('批量删除成功')
  selectedIds.value = []
  fetchList()
}

// ─── 初始化 ───
onMounted(() => {
  fetchList()
  fetchSelectOptions()
})
</script>

<template>
  <div class="p-4">
    <!-- 搜索栏 -->
    <el-card class="mb-4" shadow="never">
      <el-form :model="searchParams" inline>
        <el-form-item label="关键词">
          <el-input
            v-model="searchParams.keyword"
            placeholder="用户名/昵称/邮箱/手机号"
            clearable
            style="width: 220px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchParams.status"
            placeholder="全部"
            clearable
            style="width: 120px"
          >
            <el-option label="启用" value="true" />
            <el-option label="禁用" value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="searchParams.roleId"
            placeholder="全部"
            clearable
            filterable
            style="width: 160px"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select
            v-model="searchParams.departmentId"
            placeholder="全部"
            clearable
            filterable
            style="width: 160px"
          >
            <el-option
              v-for="item in departmentOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <el-card class="mb-4" shadow="never">
      <el-button type="primary" @click="handleAdd">新增用户</el-button>
      <el-button
        :disabled="selectedIds.length === 0"
        @click="handleBatchDelete"
      >
        批量删除
      </el-button>
    </el-card>

    <!-- 表格 -->
    <el-card shadow="never">
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column label="角色" min-width="140">
          <template #default="{ row }: { row: UserListItem }">
            {{ row.role?.name ?? '-' }}
          </template>
        </el-table-column>
        <el-table-column label="部门" min-width="140">
          <template #default="{ row }: { row: UserListItem }">
            {{ row.department?.name ?? '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }: { row: UserListItem }">
            <el-tag :type="row.isActive ? 'success' : 'danger'" size="small">
              {{ row.isActive ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="锁定" width="80">
          <template #default="{ row }: { row: UserListItem }">
            <el-tag :type="row.isLocked ? 'danger' : 'info'" size="small">
              {{ row.isLocked ? '已锁定' : '正常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="最后登录" width="170">
          <template #default="{ row }: { row: UserListItem }">
            {{ row.lastLoginAt ?? '-' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="170">
          <template #default="{ row }: { row: UserListItem }">
            {{ row.createdAt }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }: { row: UserListItem }">
            <el-button
              type="primary"
              link
              size="small"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="560px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="isEdit ? editFormRules : formRules"
        label-width="90px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            show-password
            :placeholder="isEdit ? '留空则不修改密码' : '请输入密码'"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="formData.roleId"
            placeholder="请选择角色"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select
            v-model="formData.departmentId"
            placeholder="请选择部门"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in departmentOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <template v-if="isEdit">
          <el-form-item label="状态">
            <el-radio-group v-model="formData.isActive">
              <el-radio :value="true">启用</el-radio>
              <el-radio :value="false">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="锁定">
            <el-radio-group v-model="formData.isLocked">
              <el-radio :value="true">锁定</el-radio>
              <el-radio :value="false">正常</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
:deep(.el-table th.el-table__cell) {
  background-color: #f3f4f6;
  font-weight: 600;
  color: #374151;
}
</style>
