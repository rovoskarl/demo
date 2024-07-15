package com.tastien.telephone

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.telephony.TelephonyManager
import com.facebook.react.bridge.Arguments
import com.tastien.telephone.ThrottleUtil.ThrottleCallback
import com.tastien.telephone.ThrottleUtil.throttle


class PhoneReceiver : BroadcastReceiver() {
    private val TAG_NAME: String = "TelephoneModule"

    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == TelephonyManager.ACTION_PHONE_STATE_CHANGED) {
            val phoneState = intent.getStringExtra(TelephonyManager.EXTRA_STATE)
            if (!phoneState.isNullOrBlank()) {
                when (phoneState) {
                    TelephonyManager.EXTRA_STATE_IDLE -> handleIdleState()
                    TelephonyManager.EXTRA_STATE_OFFHOOK -> handleOffHookState()
                    TelephonyManager.EXTRA_STATE_RINGING -> handleRingingState()
                }
            }
        }
    }

    private fun handleIdleState() {
        val params = Arguments.createMap()
        params.putBoolean("isCall", false)
        throttle(object : ThrottleCallback {
            override fun onThrottle() {
                TelephoneModule.sendEvent("onPhoneState", params)
            }
        })
    }

    private fun handleOffHookState() {
        val params = Arguments.createMap()
        params.putBoolean("isCall", true)
        throttle(object : ThrottleCallback {
            override fun onThrottle() {
                TelephoneModule.sendEvent("onPhoneState", params)
            }
        })
    }

    private fun handleRingingState() {
        // 电话响铃状态，可以添加处理逻辑
    }
}


/*class PhoneReceiver: BroadcastReceiver() {
    private val TAG_NAME: String = "TelephoneModule"
    private var startTime: Long? = null

    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == TelephonyManager.ACTION_PHONE_STATE_CHANGED) {
            val phoneState = intent.getStringExtra(TelephonyManager.EXTRA_STATE)
            if (!phoneState.isNullOrBlank()) {
                when (phoneState) {
                    TelephonyManager.EXTRA_STATE_IDLE -> {
                        // 电话挂断状态
                        Log.d("PhoneStateReceiver", "挂断")
                        val endTime = System.currentTimeMillis()
                        val params = Arguments.createMap()

                        Log.d("PhoneStateReceiver", "通话结束时间：$endTime")

                        // 在计算通话时长之前检查 startTime 是否为 null
                        if (startTime != null) {
                            val callDuration = (endTime - startTime!!) / 1000 // 转换为秒
                            params.putString("callDuration", callDuration.toString())
                            Log.d("PhoneStateReceiver", "通话时长：$callDuration 秒")
                        }

                        params.putBoolean("isCall", false)
                        // TelephoneModule.sendEvent("onPhoneState", params)
                    }
                    TelephonyManager.EXTRA_STATE_OFFHOOK -> {
                        // 电话接通状态，表示正在拨打或接听电话
                        Log.d("PhoneStateReceiver", "接通")
                        val params = Arguments.createMap()
                        params.putBoolean("isCall", true)
                        // 在通话开始时捕获开始时间
                        startTime = System.currentTimeMillis()
                        Log.d("PhoneStateReceiver", "通话开始时间：$startTime")
                        // TelephoneModule.sendEvent("onPhoneState", params)
                    }
                    TelephonyManager.EXTRA_STATE_RINGING -> {
                        // 电话响铃状态
                        Log.d("PhoneStateReceiver", "响铃")
                    }
                }
            }
        }
    }



    *//* fun startRecord() {
         if (mediaRecorder == null) {
             mediaRecorder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                 MediaRecorder(TelephoneModule.getAppContext().applicationContext)
             } else {
                 MediaRecorder()
             }
         }
         try {
             val phone = TelephoneModule.getPhone();
             mediaRecorder!!.setAudioSource(MediaRecorder.AudioSource.VOICE_CALL) // 设置麦克风
             mediaRecorder!!.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
             mediaRecorder!!.setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
             val fileName = phone.toString() + ".m4a"
             filePath = Environment.getExternalStorageDirectory().toString() + "/MIUI/sound_recorder/call_rec/" + fileName
             mediaRecorder!!.setOutputFile(filePath)
             mediaRecorder!!.prepare()
             mediaRecorder!!.start()
         } catch (e: IllegalStateException) {
             e.printStackTrace()
         } catch (e: IOException) {
             e.printStackTrace()
         }
     }

     fun stopRecord() {
         if (mediaRecorder == null) return
         try {
             mediaRecorder!!.stop()
             mediaRecorder!!.release()
             mediaRecorder = null
         } catch (e: RuntimeException) {
             mediaRecorder!!.reset()
             mediaRecorder!!.release()
             mediaRecorder = null
             val file: File = File(filePath)
             if (file.exists()) file.delete()
         }
     }

     @RequiresApi(api = Build.VERSION_CODES.S)
     private class PhoneCallStateListener : TelephonyCallback(), CallStateListener {
         override fun onCallStateChanged(state: Int) {
             when (state) {
                 TelephonyManager.CALL_STATE_IDLE -> {
                     Log.i(
                         "TelephoneModule",
                         "手机状态：空闲状态"
                     )
                 }

                 TelephonyManager.CALL_STATE_RINGING -> Log.i(
                     "TelephoneModule",
                     "手机状态：来电话状态"
                 )

                 TelephonyManager.CALL_STATE_OFFHOOK -> {
                     Log.i(
                         "TelephoneModule",
                         "手机状态：接电话状态"
                     )
                 }
             }
         }
     }

     private class OldPhoneCallStateListener : PhoneStateListener() {
         override fun onCallStateChanged(state: Int, phoneNumber: String) {
             when (state) {
                 TelephonyManager.CALL_STATE_IDLE -> Log.i(
                     "TelephoneModule",
                     "手机状态：空闲状态"
                 )

                 TelephonyManager.CALL_STATE_RINGING -> Log.i(
                     "TelephoneModule",
                     "手机状态：来电话状态"
                 )

                 TelephonyManager.CALL_STATE_OFFHOOK -> Log.i(
                     "TelephoneModule",
                     "手机状态：接电话状态"
                 )
             }
             super.onCallStateChanged(state, phoneNumber)
         }
     }

     companion object {
         private var mediaRecorder: MediaRecorder? = null
         private var filePath:String? = null
         fun findPhoneFile() {
             val phone = TelephoneModule.getPhone();
             val folderPath = File(Environment.getExternalStorageDirectory().toString() + "MIUI/sound_recorder/call_rec")
             if (folderPath.exists() && folderPath.isDirectory) {
                 val files = folderPath.listFiles();
                 for (file in files!!) {
                     println("文件名称：" + file.name)
                     println("文件大小：" + file.length() + " bytes")
                 }
             } else {
                 System.out.println("目录不存在或者不是有效的目录")
             }
         }

         fun stopRecord() {
             if (mediaRecorder == null) return
             try {
                 mediaRecorder!!.stop()
                 mediaRecorder!!.release()
                 mediaRecorder = null
             } catch (e: RuntimeException) {
                 mediaRecorder!!.reset()
                 mediaRecorder!!.release()
                 mediaRecorder = null
                 val file: File = File(filePath)
                 if (file.exists()) file.delete()
             }
         }

         fun startRecord() {
             if (mediaRecorder == null) {
                 mediaRecorder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                     MediaRecorder(TelephoneModule.getAppContext().applicationContext)
                 } else {
                     MediaRecorder()
                 }
             }
             try {
                 val phone = TelephoneModule.getPhone();
                 mediaRecorder!!.setAudioSource(MediaRecorder.AudioSource.VOICE_CALL) // 设置麦克风
                 mediaRecorder!!.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
                 mediaRecorder!!.setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
                 val fileName = phone.toString() + ".m4a"
                 filePath = Environment.getExternalStorageDirectory().toString() + "/MIUI/sound_recorder/call_rec/" + fileName
                 mediaRecorder!!.setOutputFile(filePath)
                 mediaRecorder!!.prepare()
                 mediaRecorder!!.start()
             } catch (e: IllegalStateException) {
                 e.printStackTrace()
             } catch (e: IOException) {
                 e.printStackTrace()
             }
         }
     }*//*
}*/