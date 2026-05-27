<script setup lang="ts">
import type { FormRules } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { feedback } from '@/plugins/feedback'
import { menuApi, type MenuTreeItem, type MenuType } from '@/api/menu'
import {
  ICON_NAME_LIST,
  getIconComponent,
  type IconName,
} from '@/components/CommonIcon/types'

// ─── 类型 ───
type DrawerMode = 'create' | 'createChild' | 'edit'

interface OpenOptions {
  mode: DrawerMode
  /** 父级节点（新增下级/编辑时使用） */
  parent?: MenuTreeItem | null
  /** 编辑时的当前节点 */
  row?: MenuTreeItem | null
  /** 菜单树（用于父级下拉选择） */
  treeData?: MenuTreeItem[]
}

// ─── 状态 ───
const visible = ref(false)
const submitting = ref(false)
const mode = ref<DrawerMode>('create')
const treeData = ref<MenuTreeItem[]>([])

let parentRow: MenuTreeItem | null = null
let editRow: MenuTreeItem | null = null

const parentDisplay = ref<MenuTreeItem | null>(null)

// ─── 表单 ───
const formRef = ref<FormInstance>()

function createDefaultFormData() {
  return {
    parentId: null as string | null,
    name: '',
    type: 'directory' as MenuType,
    icon: '',
    path: '',
    component: '',
    permissionCode: '',
    sortOrder: 0,
    isVisible: true,
    status: true,
  }
}

const formData = reactive(createDefaultFormData())

const rules = computed((): FormRules => {
  const base: FormRules = {
    name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
    type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  }

  if (formData.type === 'menu') {
    base.path = [{ required: true, message: '请填写路由地址', trigger: 'blur' }]
    base.component = [
      { required: true, message: '请填写页面组件路径', trigger: 'blur' },
    ]
  }

  if (formData.type === 'button') {
    base.parentId = [
      { required: true, message: '请选择所属菜单', trigger: 'change' },
    ]
    base.permissionCode = [
      { required: true, message: '请填写权限标识', trigger: 'blur' },
    ]
  }

  return base
})

/** 父级选择器是否禁用（新增下级时不可修改父级） */
const parentDisabled = computed(() => mode.value === 'createChild')

/** 切换类型 */
const canSwitchTypeArr = computed(() => {
  if (mode.value === 'createChild') {
    if (parentRow?.type === 'directory') {
      return ['directory', 'menu']
    } else if (parentRow?.type === 'menu') {
      return ['button']
    }
  } else if (mode.value === 'edit') {
    return []
  }
  return ['directory', 'menu', 'button']
})

/** el-tree-select 的树形节点 */
interface TreeOption {
  value: string
  label: string
  disabled?: boolean
  children?: TreeOption[]
}

// ─── 父级树：根据 type 动态构建 ───
const parentTree = ref<TreeOption[]>([])

function buildParentTree() {
  const includeTypes: MenuType[] =
    formData.type === 'button' ? ['directory', 'menu'] : ['directory']
  function buildTree(items: MenuTreeItem[], types: MenuType[]): TreeOption[] {
    const result: TreeOption[] = []
    for (const item of items) {
      if (types.includes(item.type)) {
        const node: TreeOption = {
          value: item.id,
          label: item.name,
          children: [],
          disabled: mode.value === 'edit' && item.id === editRow?.id,
        }
        if (item.children?.length) {
          node.children = buildTree(item.children, types)
        }
        result.push(node)
      }
    }
    return result
  }
  parentTree.value = buildTree(treeData.value, includeTypes)
}

// ─── 抽屉标题 ───
const drawerTitle = computed(() => {
  if (mode.value === 'create') return '新增菜单'
  if (mode.value === 'createChild') return '新增子项'
  return '修改菜单'
})

// ─── type 切换时清空无关字段 ───
watch(
  () => formData.type,
  (newType, oldType) => {
    if (oldType && newType !== oldType) {
      if (newType !== 'menu') {
        formData.path = ''
        formData.component = ''
      }
      if (newType !== 'button') {
        formData.permissionCode = ''
      }
      if (newType === 'button') {
        formData.parentId = parentRow?.id ?? null
        formData.isVisible = false
        formData.icon = ''
        formData.path = ''
        formData.component = ''
      }
      if (newType === 'directory') {
        // 新增下级时不允许修改父级，保持原有 parentId
        if (mode.value !== 'createChild') {
          formData.parentId = null
        }
        formData.isVisible = true
      }
      formRef.value?.clearValidate()
    }
  }
)

// ─── 方法 ───
function open(options: OpenOptions) {
  mode.value = options.mode
  parentRow = options.parent ?? null
  editRow = options.row ?? null
  parentDisplay.value = options.parent ?? null
  treeData.value = options.treeData ?? []
  resetForm()
  if (options.mode === 'create') {
    formData.type = 'directory'
  } else if (options.mode === 'createChild') {
    if (parentRow?.type === 'directory') {
      formData.type = 'menu'
    } else if (parentRow?.type === 'menu') {
      formData.type = 'button'
      formData.isVisible = false
    }
    formData.parentId = parentRow?.id ?? null
  } else if (options.mode === 'edit' && options.row) {
    const row = options.row
    Object.assign(formData, { ...row })
  }
  buildParentTree()
  visible.value = true
}

function resetForm() {
  Object.assign(formData, createDefaultFormData())
}

function resolveParentId(): string | null {
  return formData.parentId
}

function handleIconSelect(icon: string) {
  formData.icon = icon
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const baseParams = {
      type: formData.type,
      icon: formData.icon || null,
      path: formData.path || null,
      component: formData.component || null,
      permissionCode: formData.permissionCode || null,
      sortOrder: formData.sortOrder,
      isVisible: formData.isVisible,
      status: formData.status,
      name: formData.name,
      parentId: resolveParentId(),
    }

    if (mode.value === 'edit' && editRow?.id) {
      await menuApi.update({ ...baseParams, id: editRow.id })
      feedback.success('修改成功')
    } else {
      await menuApi.create(baseParams)
      feedback.success('新增成功')
    }
    visible.value = false
    emit('saved')
  } catch {
    // 接口层已处理错误提示
  } finally {
    submitting.value = false
  }
}

const emit = defineEmits<{
  saved: []
}>()

defineExpose({ open })
</script>

<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    size="560px"
    @close="resetForm"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
      label-suffix="："
      class="edit-menu-form"
    >
      <!-- 类型 -->
      <el-form-item label="菜单类型" prop="type">
        <el-radio-group v-model="formData.type" @change="buildParentTree">
          <el-radio-button
            label="目录"
            value="directory"
            :disabled="!canSwitchTypeArr.includes('directory')"
          />
          <el-radio-button
            label="菜单"
            value="menu"
            :disabled="!canSwitchTypeArr.includes('menu')"
          />
          <el-radio-button
            label="按钮"
            value="button"
            :disabled="!canSwitchTypeArr.includes('button')"
          />
        </el-radio-group>
      </el-form-item>

      <!-- 父级选择器 -->
      <el-form-item label="父级" prop="parentId">
        <el-tree-select
          v-model="formData.parentId"
          :data="parentTree"
          :disabled="parentDisabled"
          :clearable="!parentDisabled"
          :placeholder="
            formData.type === 'button'
              ? '请选择所属菜单'
              : '选择父级目录（留空为顶级）'
          "
          class="w-full"
        />
      </el-form-item>

      <!-- 名称 -->
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="formData.name"
          :maxlength="32"
          clearable
          placeholder="请输入目录或菜单名称"
          show-word-limit
        />
      </el-form-item>

      <!-- 图标（按钮不显示） -->
      <el-form-item v-if="formData.type !== 'button'" label="图标" prop="icon">
        <el-popover placement="bottom-start" trigger="click" width="420">
          <template #reference>
            <el-input
              v-model="formData.icon"
              :placeholder="formData.icon || '点击选择图标'"
              clearable
              class="w-full"
              @clear="formData.icon = ''"
            >
              <template #prefix>
                <CommonIcon
                  v-if="
                    formData.icon && getIconComponent(formData.icon as IconName)
                  "
                  :icon="formData.icon as IconName"
                  :size="16"
                />
              </template>
            </el-input>
          </template>
          <div
            class="flex flex-wrap gap-2 p-2 max-h-64 overflow-auto icon-picker"
          >
            <div
              class="cursor-pointer p-1 rounded hover:bg-gray-200"
              v-for="icon in ICON_NAME_LIST"
              :key="icon"
              :title="icon"
              :class="{
                'bg-blue-100!': formData.icon === icon,
              }"
              @click="handleIconSelect(icon)"
            >
              <CommonIcon :icon="icon" :size="18" />
            </div>
          </div>
        </el-popover>
      </el-form-item>
      <!-- 路由地址（菜单） -->
      <el-form-item
        v-if="formData.type === 'menu'"
        label="路由地址"
        prop="path"
      >
        <el-input
          v-model="formData.path"
          clearable
          placeholder="例如：/sys/user"
        />
      </el-form-item>

      <!-- 页面组件（菜单） -->
      <el-form-item
        v-if="formData.type === 'menu'"
        label="页面组件"
        prop="component"
      >
        <el-input
          v-model="formData.component"
          clearable
          placeholder="例如：sys/user/index"
        />
      </el-form-item>

      <!-- 权限标识（按钮） -->
      <el-form-item
        v-if="formData.type === 'button'"
        label="权限标识"
        prop="permissionCode"
      >
        <el-input
          v-model="formData.permissionCode"
          clearable
          placeholder="例如：sys:user:create"
        />
      </el-form-item>
      <!-- 显示配置区域 -->
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
      <el-form-item
        v-if="formData.type !== 'button'"
        label="是否显示"
        prop="isVisible"
      >
        <el-switch v-model="formData.isVisible" />
      </el-form-item>
      <el-form-item label="启用状态" prop="status">
        <el-switch v-model="formData.status" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="flex justify-end gap-3">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ mode === 'edit' ? '保存' : '确定' }}
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped></style>
