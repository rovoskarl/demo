package com.tastien.utils

import android.R
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.view.View
import android.widget.Toast
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.hjq.permissions.OnPermissionCallback
import com.hjq.permissions.XXPermissions


class UtilModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {
    val notificationId = 1
    var notificationManager:NotificationManager? = null
    var builder: NotificationCompat.Builder? = null

    override fun getName(): String {
        return "UtilModule"
    }

    /**
     * 安卓获取权限，使用了XXPermissions Android框架
     */
    @ReactMethod
    fun request(permission: String, promise: Promise) {
        reactApplicationContext.currentActivity?.let {
            XXPermissions.with(it)
                .permission(permission)
                .request(object : OnPermissionCallback {
                    override fun onGranted(permissions: MutableList<String>, allGranted: Boolean) {
                        if (!allGranted) {
                            promise.resolve("LIMITED")
                            Toast.makeText(reactApplicationContext.applicationContext, "获取部分权限成功，但部分权限未正常授予", Toast.LENGTH_LONG).show() // in Activity
                            return
                        }
                        promise.resolve("GRANTED")
                    }

                    override fun onDenied(permissions: MutableList<String>, doNotAskAgain: Boolean) {
                        super.onDenied(permissions, doNotAskAgain)
                        if (doNotAskAgain) {
                            promise.resolve("BLOCKED")
                            XXPermissions.startPermissionActivity(reactApplicationContext.applicationContext, permissions)
                        } else {
                            promise.resolve("DENIED")
                            Toast.makeText(reactApplicationContext.applicationContext, "获取权限失败", Toast.LENGTH_LONG).show() // in Activity
                        }
                    }
                })
        };
    }

    /**
     * 通知栏进度条
     */
    @ReactMethod
    fun showDownloadProgressBar(title: String, progress: Int) {
        // 获取NotificationManager实例
        if (notificationManager == null) {
            notificationManager = this.reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        }

        // 创建NotificationChannel（仅在Android O及以上版本需要）
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel("download", "下载通知", NotificationManager.IMPORTANCE_LOW)
            notificationManager?.createNotificationChannel(channel)
        }

        // 创建Notification.Builder
        if (builder == null) {
            builder = NotificationCompat.Builder(this.reactApplicationContext, "download")
                .setContentTitle(title)
                .setContentText("正在下载")
                .setSmallIcon(android.R.drawable.stat_sys_download)
                .setProgress(100, 0, false)

            // 发布通知
            notificationManager?.notify(notificationId, builder?.build())
        }

        builder?.setProgress(100, progress, false)
        builder?.setContentText("下载中：$progress%")

        // 更新通知的进度
        notificationManager?.notify(notificationId, builder?.build())
    }

    @ReactMethod
    fun hideDownloadProgressBar() {
        if (notificationManager != null && builder != null) {
            // 销毁通知管理
            notificationManager?.cancel(notificationId)
            builder = null
            notificationManager = null
        } else {
            // 下载完成后移除进度条并更新通知
            builder?.setContentText("下载完成")
                ?.setProgress(0, 0, false)
            notificationManager?.notify(notificationId, builder?.build())
        }
    }
}