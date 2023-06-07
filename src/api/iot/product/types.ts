export interface ProductVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 产品类别ID
   */
  groupId: string | number;

  /**
   * 产品名称
   */
  name: string;

  /**
   * 设备类型 （1=直连设备, 2=网关设备,3=网关子设备）
   */
  deviceType: number;

  /**
   * 网络类型（1=以太网, 2=蜂窝网络(2G/3G/4G/5G),3=WIFI, 0=其他）
   */
  networkType: number;

  /**
   * 驱动
   */
  driverCode: string;

  /**
   * 图标
   */
  icon: string;

  /**
   * 描述
   */
  remark: string;

}

export interface ProductForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 产品类别ID
   */
  groupId?: string | number;

  /**
   * 产品名称
   */
  name?: string;

  /**
   * 设备类型 （1=直连设备, 2=网关设备,3=网关子设备）
   */
  deviceType?: number;

  /**
   * 网络类型（1=以太网, 2=蜂窝网络(2G/3G/4G/5G),3=WIFI, 0=其他）
   */
  networkType?: number;
  /**
   * 驱动
   */
  driverCode?: string;

  /**
   * 图标
   */
  icon?: string;

  /**
   * 描述
   */
  remark?: string;

}

export interface ProductQuery extends PageQuery {
  /**
   * 产品类别ID
   */
  groupId?: string | number;

  /**
   * 产品名称
   */
  name?: string;

  /**
   * 设备类型 （1=直连设备, 2=网关设备,3=网关子设备）
   */
  deviceType?: number;

  /**
   * 网络类型（1=以太网, 2=蜂窝网络(2G/3G/4G/5G),3=WIFI, 0=其他）
   */
  networkType?: number;

  /**
   * 驱动
   */
  driverCode?: string;

}
