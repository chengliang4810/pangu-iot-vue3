<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="产品名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入产品名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="设备类型 " prop="deviceType">
            <el-select v-model="queryParams.deviceType" placeholder="请选择设备类型 " clearable>
              <el-option v-for="dict in device_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="网络类型" prop="networkType">
            <el-select v-model="queryParams.networkType" placeholder="请选择网络类型" clearable>
              <el-option v-for="dict in network_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="驱动" prop="driverCode">
            <el-input v-model="queryParams.driverCode" placeholder="请输入驱动" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['iot:product:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['iot:product:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['iot:product:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['iot:product:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="产品编号" align="center" prop="id" v-if="true" />
        <!-- <el-table-column label="产品类别ID" align="center" prop="groupId" /> -->
        <el-table-column label="产品名称" align="center" prop="name" />
        <el-table-column label="设备类型 " align="center" prop="deviceType">
          <template #default="scope">
            <dict-tag :options="device_type" :value="scope.row.deviceType" />
          </template>
        </el-table-column>
        <el-table-column label="网络类型" align="center" prop="networkType">
          <template #default="scope">
            <dict-tag :options="network_type" :value="scope.row.networkType" />
          </template>
        </el-table-column>
        <el-table-column label="驱动" align="center" prop="driverCode" />
        <el-table-column label="图标" align="center" prop="icon" />
        <el-table-column label="设备数量" align="center" prop="deviceNumber" />
        <el-table-column label="描述" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['iot:product:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['iot:product:remove']"></el-button>
            </el-tooltip>
            <el-tooltip content="详情" placement="top">
              <el-button link type="primary" icon="View" @click="handleView(scope.row)" v-hasPermi="['iot:product:list']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改产品对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="productFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="设备类型 " prop="deviceType">
          <el-select v-model="form.deviceType" placeholder="请选择设备类型 " @change="deviceTypeChangeHandle">
            <el-option v-for="dict in device_type" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="网络类型" prop="networkType">
          <el-select v-model="form.networkType" placeholder="请选择网络类型">
            <el-option v-for="dict in network_type" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="驱动" prop="driverCode" v-if="form.deviceType === 2">
          <el-select v-model="form.driverCode" placeholder="请选择驱动">
            <el-option v-for="dict in device_type" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标" prop="icon" v-if="false">
          <el-input v-model="form.icon" type="text" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Product" lang="ts">
import { listProduct, getProduct, delProduct, addProduct, updateProduct } from '@/api/iot/product';
import { ProductVO, ProductQuery, ProductForm } from '@/api/iot/product/types';
import { ComponentInternalInstance } from 'vue';
import { ElForm } from 'element-plus';

const router = useRouter();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { network_type, device_type } = toRefs<any>(proxy?.useDict('network_type', 'device_type'));

const productList = ref<ProductVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref(ElForm);
const productFormRef = ref(ElForm);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: ProductForm = {
  id: undefined,
  groupId: 1,
  name: undefined,
  deviceType: 1,
  networkType: 1,
  driverCode: undefined,
  icon: undefined,
  remark: undefined
}
const data = reactive<PageData<ProductForm, ProductQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    groupId: undefined,
    name: undefined,
    deviceType: undefined,
    networkType: undefined,
    driverCode: undefined,
  },
  rules: {
    id: [
      { required: true, message: "主键不能为空", trigger: "blur" }
    ],
    groupId: [
      { required: true, message: "产品类别ID不能为空", trigger: "change" }
    ],
    name: [
      { required: true, message: "产品名称不能为空", trigger: "blur" }
    ],
    driverCode: [
      { required: true, message: "驱动不能为空", trigger: "blur" }
    ],
    deviceType: [
      { required: true, message: "设备类型不能为空", trigger: "change" }
    ],
    networkType: [
      { required: true, message: "网络类型不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询产品列表 */
const getList = async () => {
  loading.value = true;
  const res = await listProduct(queryParams.value);
  productList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/**
 * 设备类型改变
 * @param val 设备类型
 */
const deviceTypeChangeHandle = (val: number) => {
  if (val === 2) {
    rules.value.driverCode = [
      { required: true, message: "设备类型 不能为空", trigger: "blur" }
    ];
  } else {
    // 删除对象的属性
    delete rules.value['driverCode'];
  }
}

// 查看按钮
const handleView = (row?: ProductVO) => {
  const _id = row?.id || ids.value[0]
  router.push({ path: `/product/detail/index`, query: { active: 'detail', productId: _id } });
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  productFormRef.value.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: ProductVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  dialog.visible = true;
  dialog.title = "添加产品";
  nextTick(() => {
    reset();
  });
}

/** 修改按钮操作 */
const handleUpdate = (row?: ProductVO) => {
  loading.value = true
  dialog.visible = true;
  dialog.title = "修改产品";
  nextTick(async () => {
    reset();
    const _id = row?.id || ids.value[0]
    const res = await getProduct(_id);
    loading.value = false;
    Object.assign(form.value, res.data);
  });
}

/** 提交按钮 */
const submitForm = () => {
  productFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateProduct(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addProduct(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: ProductVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除产品编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delProduct(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('iot/product/export', {
    ...queryParams.value
  }, `product_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
