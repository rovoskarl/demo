package com.tastien.telephone


object ThrottleUtil {
    private const val THROTTLE_TIME: Long = 500 // 定义节流的时间间隔
    private var lastExecutionTime: Long = 0
    fun throttle(callback: ThrottleCallback) {
        val currentTime = System.currentTimeMillis()
        if (currentTime - lastExecutionTime > THROTTLE_TIME) {
            // 如果距离上一次执行的时间超过了节流时间间隔，则执行回调
            callback.onThrottle()
            lastExecutionTime = currentTime
        }
    }

    interface ThrottleCallback {
        fun onThrottle() // 定义节流回调方法
    }
}
