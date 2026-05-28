<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { feedback } from '@/plugins/feedback'
import { roleApi, type RoleDetail } from '@/api/role'
import { menuApi, type MenuTreeItem } from '@/api/menu'

const props = defineProps<{
  visible: boolean
  mode: 'create' | 'edit'
  editingId: string
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  saved: []
}>()

const submitting = ref(false)
const formRef = ref<FormInstance>()
const menuTreeRef = ref()
const menuTreeData = ref<MenuTreeItem[]>([])
const filterText = ref('')

function createDefaultForm() {
  return {
    name: '',
    code: '',
    description: '',
    sortOrder: 0,
    status: true,
  }
}

const formData = reactive(createDefaultForm())

const rules: FormRules = {
  name: [
    { required: true, message: '请填写角色名称', trigger: 'blur' },
    { max: 50, message: '角色名称不能超过 50 个字符', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请填写角色编码', trigger: 'blur' },
    { max: 50, message: '角色编码不能超过 50 个字符', trigger: 'blur' },
  ],
  description: [
    { max: 255, message: '描述不能超过 255 个字符', trigger: 'blur' },
  ],
}

const drawerTitle = computed(() =>
  props.mode === 'create' ? '新增角色' : '编辑角色'
)

const codeDisabled = computed(() => props.mode === 'edit')

// 菜单树过滤
const filterNodeMethod = (value: string, data: MenuTreeItem) => {
  if (!value) return true
  return data.name.includes(value)
}

watch(filterText, (val) => {
  menuTreeRef.value?.filter(val)
})

// 全选/取消全选
const checkedKeys = ref<string[]>([])

function handleCheckAll() {
  const allIds = getAllIds(menuTreeData.value)
  if (checkedKeys.value.length === allIds.length) {
    checkedKeys.value = []
    menuTreeRef.value?.setCheckedKeys([])
  } else {
    checkedKeys.value = allIds
    menuTreeRef.value?.setCheckedKeys(allIds)
  }
}

function getAllIds(tree: MenuTreeItem[]): string[] {
  const ids: string[] = []
  for (const node of tree) {
    ids.push(node.id)
    if (node.children?.length) {
      ids.push(...getAllIds(node.children))
    }
  }
  return ids
}

const checkAllText = computed(() => {
  if (!menuTreeData.value.length) return '全选'
  const allIds = getAllIds(menuTreeData.value)
  const currentChecked = menuTreeRef.value?.getCheckedKeys() ?? []
  return currentChecked.length === allIds.length ? '取消全选' : '全选'
})

// 展开/折叠
const treeExpanded = ref(true)

function toggleExpand() {
  treeExpanded.value = !treeExpanded.value
}

// 初始化
async function initForm() {
  menuTreeData.value = await menuApi.tree()

  if (props.mode === 'edit' && props.editingId) {
    const detail = await roleApi.detail(props.editingId)
    formData.name = detail.name
    formData.code = detail.code
    formData.description = detail.description ?? ''
    formData.sortOrder = detail.sortOrder
    formData.status = detail.status
    nextTick(() => {
      menuTreeRef.value?.setCheckedKeys(detail.menuIds)
    })
  } else {
    Object.assign(formData, createDefaultForm())
    nextTick(() => {
      menuTreeRef.value?.setCheckedKeys([])
    })
  }
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      initForm()
    }
  }
)

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const payload = {
      name: formData.name,
      code: formData.code,
      description: formData.description || null,
      status: formData.status,
      sortOrder: formData.sortOrder,
      menuIds: menuTreeRef.value?.getCheckedKeys() ?? [],
      permissionCodes: [],
    }

    if (props.mode === 'edit') {
      await roleApi.update({ ...payload, id: props.editingId })
      feedback.success('更新成功')
    } else {
      await roleApi.create(payload)
      feedback.success('创建成功')
    }
    emit('saved')
    emit('update:visible', false)
  } catch {
    // 接口层已处理错误提示
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <el-drawer
    :model-value="visible"
    :title="drawerTitle"
    size="600px"
    @close="emit('update:visible', false)"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
      label-suffix="："
    >
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="formData.name"
          :maxlength="50"
          show-word-limit
          clearable
          placeholder="请输入角色名称"
        />
      </el-form-item>

      <el-form-item label="角色编码" prop="code">
        <el-input
          v-model="formData.code"
          :maxlength="50"
          show-word-limit
          clearable
          :disabled="codeDisabled"
          placeholder="请输入角色编码"
        />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          :maxlength="255"
          show-word-limit
          placeholder="请输入角色描述（选填）"
        />
      </el-form-item>

      <el-divider content-position="left">显示配置</el-divider>

      <el-form-item label="排序" prop="sortOrder">
        <el-input-number
          v-model="formData.sortOrder"
          :min="0"
          :max="9999"
          controls-position="right"
          class="w-full"
        />
      </el-form-item>

      <el-form-item label="启用状态" prop="status">
        <el-switch v-model="formData.status" />
      </el-form-item>
    </el-form>

    <el-divider content-position="left">菜单权限</el-divider>

    <div class="mb-3 flex items-center gap-2">
      <el-input
        v-model="filterText"
        placeholder="搜索菜单"
        clearable
        size="small"
        class="w-48"
      />
      <el-button size="small" @click="handleCheckAll">
        {{ checkAllText }}
      </el-button>
      <el-button size="small" @click="toggleExpand">
        {{ treeExpanded ? '折叠' : '展开' }}
      </el-button>
    </div>

    <el-tree
      ref="menuTreeRef"
      :data="menuTreeData"
      :props="{ label: 'name', children: 'children' }"
      node-key="id"
      show-checkbox
      default-expand-all
      highlight-current
      :filter-node-method="filterNodeMethod"
    />

    <template #footer>
      <div class="flex justify-end gap-3">
        <el-button @click="emit('update:visible', false)">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ mode === 'edit' ? '保存' : '确定' }}
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
@reference "@/styles/main.css";
</style>
