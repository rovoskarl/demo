package com.tastien.telephone

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.provider.CallLog
import android.telephony.PhoneStateListener
import android.telephony.TelephonyManager
import android.util.Log
import com.facebook.react.bridge.Arguments
import java.util.concurrent.atomic.AtomicInteger
import java.util.concurrent.atomic.AtomicReference

class PhoneCallStateServiceReceiver : Service() {
    private var phoneStateReceiver: BroadcastReceiver? = null
    private var telephonyManager: TelephonyManager? = null
    private val notificationName = "电话监听"
    private var notificationManager: NotificationManager? = null
    private val activeCallNumber = AtomicReference<String?>()
    private val handler = Handler(Looper.getMainLooper())
    private var activeCallState = CallState.IDLE
    private var waitingCallState = CallState.IDLE

    private enum class CallState {
        IDLE, OFFHOOK, RINGING
    }


    override fun onCreate() {
        super.onCreate()
        registerPhoneStateReceiver()

        telephonyManager = getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
        telephonyManager?.listen(phoneStateListener, PhoneStateListener.LISTEN_CALL_STATE)
        Log.d("PhoneStateService", "[onCreate] MediaServer Service Started.")
    }

    private fun getNotification(): Notification? {
        val builder: Notification.Builder = Notification.Builder(this)
                .setSmallIcon(android.R.drawable.stat_notify_more)
                .setContentTitle("电话服务")
                .setContentText("正在运行...")

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            builder.setChannelId(NOTIFICATION_ID)
        }
        return builder.build()
    }

    override fun onStartCommand(intent: Intent, flags: Int, startId: Int): Int {
        notificationManager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                    NOTIFICATION_ID,
                    notificationName,
                    NotificationManager.IMPORTANCE_HIGH
            )
            notificationManager?.createNotificationChannel(channel)
            startForeground(1, getNotification())
        }
        return START_STICKY
    }

    override fun onBind(intent: Intent): IBinder? {
        return null
    }

    private fun registerPhoneStateReceiver() {
        phoneStateReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                if (intent.action == TelephonyManager.ACTION_PHONE_STATE_CHANGED) {
                    Log.d("PhoneStateReceiver", "Phone state changed")
                }
            }
        }
        val intentFilter = IntentFilter(TelephonyManager.ACTION_PHONE_STATE_CHANGED)
        registerReceiver(phoneStateReceiver, intentFilter)
    }

    private val phoneStateListener = object : PhoneStateListener() {
        override fun onCallStateChanged(state: Int, phoneNumber: String?) {
            super.onCallStateChanged(state, phoneNumber)
            when (state) {
                TelephonyManager.CALL_STATE_IDLE -> {
                    if (activeCallState != CallState.IDLE) {
                        activeCallState = CallState.IDLE
                        handleIdleState(phoneNumber)
                    } else if (waitingCallState != CallState.IDLE) {
                        waitingCallState = CallState.IDLE
                        handleIdleState(phoneNumber)
                    }
                }
                TelephonyManager.CALL_STATE_OFFHOOK -> {
                    if (activeCallState == CallState.IDLE) {
                        activeCallState = CallState.OFFHOOK
                    } else {
                        waitingCallState = CallState.OFFHOOK
                    }
                }
                TelephonyManager.CALL_STATE_RINGING -> {
                    waitingCallState = CallState.RINGING
                }
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        telephonyManager?.listen(phoneStateListener, PhoneStateListener.LISTEN_NONE)
        unregisterPhoneStateReceiver()
    }

    private fun unregisterPhoneStateReceiver() {
        phoneStateReceiver?.let { unregisterReceiver(it) }
    }

    private fun handleIdleState(phoneNumber: String?) {
        Log.d("PHONE_STATE", "挂断电话，查询通话记录${phoneNumber}")
        handler.postDelayed({ queryCallHistory(phoneNumber) }, 5000)
    }

    private fun handleOffHookState() {
        Log.d("PHONE_STATE", "电话接通")
    }

    private fun handleRingingState() {
        Log.d("PHONE_STATE", "电话响铃")
    }

    /**
     * 挂断电话5秒后查询最新的通话记录
     */
    private fun queryCallHistory(phoneNumber: String?) {
        val callUri = CallLog.Calls.CONTENT_URI

        val projection = arrayOf(
                CallLog.Calls.DATE,
                CallLog.Calls.NUMBER,
                CallLog.Calls.DURATION,
                CallLog.Calls.TYPE
        )

        val selection = "${CallLog.Calls.NUMBER} = ?"
        val selectionArgs: Array<String>? = arrayOf(phoneNumber ?: "")

        val sortOrder = CallLog.Calls.DATE + " DESC"

        val cursor = contentResolver.query(
                callUri,
                projection,
                selection,
                selectionArgs,
                sortOrder
        )

        val params = Arguments.createMap()

        if (cursor != null && cursor.moveToFirst()) {
            val dateIndex = cursor.getColumnIndex(CallLog.Calls.DATE)
            val numberIndex = cursor.getColumnIndex(CallLog.Calls.NUMBER)
            val durationIndex = cursor.getColumnIndex(CallLog.Calls.DURATION)
            val typeIndex = cursor.getColumnIndex(CallLog.Calls.TYPE)

            val callDate = cursor.getString(dateIndex)
            val callNumber = cursor.getString(numberIndex)
            val callDuration = cursor.getString(durationIndex)
            val callType = cursor.getString(typeIndex)

            params.putString("callDate", callDate)
            params.putString("callNumber", callNumber)
            params.putString("callDuration", callDuration)
            params.putString("callType", callType)
            TelephoneModule.sendEvent("onPhoneState", params)
        } else {
            TelephoneModule.sendEvent("onPhoneState", params)
        }

        cursor?.close()
    }



    companion object {
        private const val NOTIFICATION_ID = "1234"
    }
}
