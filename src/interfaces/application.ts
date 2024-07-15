export const ApplicationResterToken = Symbol('ApplicationResterToken');

/**
 * 应用状态的重置器接口
 * 负责把应用的状态重置到初始值，包括路由状态重置为登录态
 */
export interface ApplicationRester {
  reset(): void;
}
