package com.tastien.telephone

import android.Manifest
import android.app.ActivityManager
import android.content.ComponentName
import android.content.ContentResolver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.os.Handler
import android.os.Looper
import android.provider.CallLog
import android.provider.Settings
import android.util.Log
import android.widget.Toast
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.File


class TelephoneModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {
    private var TAG_NAME: String = "TASTIER_TELEPHONE";
    private val mContext: Context = reactApplicationContext.applicationContext
    private val permissions: List<String> get() = listOf<String>("android.permission.CALL_PHONE", "android.permission.READ_PHONE_STATE")

    init {
        setContext(reactContext)
    }

    override fun getName(): String {
        return "TelephoneModule"
    }
    @ReactMethod
    fun recordTime(time: String) {
        val file = File(mContext.filesDir, "time.txt")
        file.createNewFile()
        file.writeText(time)
    }

    @ReactMethod
    fun readTime(promise: Promise) {
        try {
            val file = File(mContext.filesDir, "time.txt")
            if (!file.exists()) {
                file.createNewFile()
            }
            val text = file.readText()
            promise.resolve(text)
        } catch (e: Exception) {
            promise.reject("ERR_UNEXPECTED_EXCEPTION", e)
        }
    }

    private fun findMatchingRecordings(startTime: String): List<File> {
        val parent = Environment.getExternalStorageDirectory()
        val folderPath = File(parent, "MIUI/sound_recorder/call_rec")
        val matchingFiles = mutableListOf<File>()

        if (folderPath.exists() && folderPath.isDirectory) {
            val files = folderPath.listFiles()

            for (file in files!!) {
                val date = file.lastModified()

                if (date > startTime.toLong()) {
                    matchingFiles.add(file)
                }
            }
        }

        return matchingFiles
    }

    data class CallRecord(val number: String, val date: Long, val duration: Int, val callType: String)
    data class MatchedResult(val call: CallRecord, val recording: File?)

    private fun matchCallsAndRecordings(calls: List<CallRecord>, recordings: MutableList<File>): List<MatchedResult> {
        val matchedResults = mutableListOf<MatchedResult>()

        for (call in calls) {
            var matchedRecording: File? = null

            if (call.duration > 0) {
                val numberMatchedRecordings = recordings.filter { it.name.contains(call.number) }
                if (numberMatchedRecordings.isNotEmpty()) {
                    matchedRecording = numberMatchedRecordings.first()
                    recordings.remove(matchedRecording)
                }
            }

            matchedResults.add(MatchedResult(call, matchedRecording))
        }

        return matchedResults
    }

    @ReactMethod
    fun matchCallRecordsAndRecordings(startTime: String, promise: Promise) {
        val matchingCalls = mutableListOf<CallRecord>()
        val cursor = mContext.contentResolver.query(
                CallLog.Calls.CONTENT_URI,
                null,
                "${CallLog.Calls.DATE} >= ?",
                arrayOf(startTime),
                "${CallLog.Calls.DATE} DESC"
        )

        cursor?.use {
            while (it.moveToNext()) {
                val numberColumnIndex = it.getColumnIndex(CallLog.Calls.NUMBER)
                val dateColumnIndex = it.getColumnIndex(CallLog.Calls.DATE)
                val durationColumnIndex = it.getColumnIndex(CallLog.Calls.DURATION)
                val typeIndex = it.getColumnIndex(CallLog.Calls.TYPE)


                if (numberColumnIndex != -1 && dateColumnIndex != -1 && durationColumnIndex != -1 && typeIndex != -1) {
                    val number = it.getString(numberColumnIndex)
                    val date = it.getLong(dateColumnIndex)
                    val duration = it.getInt(durationColumnIndex)
                    val callType = it.getString(typeIndex)
                    matchingCalls.add(CallRecord(number, date, duration, callType))
                } else {
                    Log.d(TAG_NAME, "没有找到需要补偿的记录和文件")
                }
            }
        }

        val matchingRecordings = findMatchingRecordings(startTime).toMutableList()
        val matchedResults = matchCallsAndRecordings(matchingCalls, matchingRecordings)

        val writableArray = Arguments.createArray()
        for (result in matchedResults) {
            val writableMap = Arguments.createMap()
            writableMap.putString("number", result.call.number)
            writableMap.putDouble("date", result.call.date.toDouble())
            writableMap.putInt("duration", result.call.duration)
            writableMap.putString("callType", result.call.callType)


            if (result.recording != null) {
                val uri = Uri.fromFile(result.recording)
                val mimeType: String? = FileTypeHelper.getMimeType(mContext, uri)
                writableMap.putString("recording", uri.toString())
                writableMap.putString("name", result.recording.name)
                writableMap.putString("type", mimeType)
            } else {
                writableMap.putNull("recording")
                writableMap.putNull("name")
                writableMap.putNull("type")
            }

            writableArray.pushMap(writableMap)
        }
        promise.resolve(writableArray)

    }
    private fun isAppOnForeground():Boolean {
        val activityManager: ActivityManager = mContext?.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val appProcesses:List<ActivityManager.RunningAppProcessInfo>  =
        activityManager.runningAppProcesses;
        val packageName = mContext!!.packageName;
        for (appProcess:ActivityManager.RunningAppProcessInfo in appProcesses) {
            if (appProcess.importance ==
                ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND &&
                appProcess.processName.equals(packageName)) {
                return true;
            }
        }
        return false;
    }

    // @ReactMethod
    // fun startTask(promise: Promise) {
    //     if (timer != null) {
    //         timer?.cancel()
    //         timer = null
    //     }
    //     timer = Timer()
    //     timerTask = object : TimerTask() {
    //         override fun run() {
    //            try {
    //                val parmas: WritableMap = Arguments.createMap()
    //                parmas.putString("msg", "BackgroundFileWorker started")
    //                sendEvent("task", parmas)

    //                WorkManager.getInstance(reactApplicationContext.applicationContext).enqueueUniquePeriodicWork("BackgroundFileWorker", ExistingPeriodicWorkPolicy.KEEP, workRequest!!)

    //                val params2 = Arguments.createMap()
    //                params2.putString("msg", "BackgroundFileWorker started");
    //                promise.resolve(params2);
    //            } catch (e: Exception) {
    //                e.printStackTrace()
    //                promise.reject(TAGERROR, e)
    //            }
    //         }
    //     }

    //     // 3s后执行1次
    //     timer!!.schedule(timerTask, 3000);
    // }

    /**
     * 停止扫描
     */
    // @ReactMethod
    // fun stopTask(promise: Promise) {
    //     if(timer!=null) {
    //         timer!!.cancel();
    //         timer=null;
    //     }

    //     var params = Arguments.createMap();
    //     params.putString("msg", "BackgroundFileWorker stop successed");
    //     promise.resolve(params);
    //     WorkManager.getInstance(reactApplicationContext.applicationContext).cancelUniqueWork("BackgroundFileWorker");
    // }

    /**
     * 安卓11及以上版本(SDK>=30)，需要申请MANAGE_EXTERNAL_STORAGE权限，否则按钮无法点击，如下
     * 在manifest.json>app-plus>distribute>android>permissions中添加权限
     * <uses-permission android:name=\"android.permission.MANAGE_EXTERNAL_STORAGE\"/>
     */
    @ReactMethod
    fun requestPermission(promise: Promise) {
        if (Build.VERSION.SDK_INT >= 30) {
            // 权限未获取跳转到设置页
            if (!Environment.isExternalStorageManager()) {
                promise.resolve(false)
            } else {
                promise.resolve(true)
            }
        }
    }

    @ReactMethod
    fun openSettings() {
        val pkName = mContext.packageName;
        val intent = Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
        val uri = Uri.fromParts("package", pkName, null);
        intent.data = uri;
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        mContext.startActivity(intent);
    }

    /* 跳转设置 */
    @ReactMethod
    fun callPhone(phone: String) {
        Log.d(TAG_NAME, "call phone$phone")
        Log.d(TAG_NAME, "${lacksPermissions(permissions)}")
        Log.d(TAG_NAME, "是否开启自动通话录音：${checkXiaomiRecord()}")
        if (!checkXiaomiRecord()) {
            startXiaomiRecord()
            return
        }
        val uri = Uri.parse("tel:$phone")
        val intent = Intent(Intent.ACTION_CALL, uri)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        mContext.startActivity(intent);
    }

    /* 获取通话记录中的播出 */
    // @ReactMethod
    // fun fetchCalls(promise: Promise) {
    //     val resolver = context.contentResolver
    //     var cursor: Cursor? = null
    //     try {
    //         val start = System.currentTimeMillis()
    //         cursor = resolver.query(
    //             CallLog.Calls.CONTENT_URI,
    //             null,
    //             null,
    //             null,
    //             CallLog.Calls.DEFAULT_SORT_ORDER
    //         )
    //         val finish = System.currentTimeMillis()
    //         Log.d(TAG_NAME, "$cursor")
    //     } catch (e: java.lang.Exception) {
    //         e.printStackTrace()
    //     } finally {
    //         cursor?.close()
    //     }
    // }

    // class Record {
    //     var number: String? = null // 手机号
    //     var name: String? = null // 匹配通讯录的名称
    //     var date: String? = null // 通话日期
    //     var duration: String? = null // 通话时长，秒数
    //     var type: String? = null // 1 来电，2拨出，3未接
    //     var icc_id: String? = null
    // }

    private var listenerCount = 0;

    @ReactMethod
    fun addListener(eventName: String) {
        if (listenerCount == 0) {
            // Set up any upstream listeners or background tasks as necessary
        }

        listenerCount += 1
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        listenerCount -= count
        if (listenerCount == 0) {
            // Remove upstream listeners, stop unnecessary background tasks
        }
    }

    private fun matchSpecificPhoneNumber(specificPhoneNumber: String, fileName:String): Boolean {
        val regex = Regex("""\b$specificPhoneNumber\b""")
        return regex.containsMatchIn(fileName)
    }

    /* 获取录音文件 */
    @ReactMethod
    fun findLatestRecordingFile(phone: String, startTime: String, promise: Promise) {
        val parent = Environment.getExternalStorageDirectory()
        val folderPath = File(parent, "MIUI/sound_recorder/call_rec")
        val matchingFiles = mutableListOf<File>()

        if (folderPath.exists() && folderPath.isDirectory) {
            val files = folderPath.listFiles()

            for (file in files!!) {
                val name = file.name
                val date = file.lastModified()

                if (matchSpecificPhoneNumber(phone, name) && date > startTime.toLong()) {
                    matchingFiles.add(file)
                }
            }

            if (matchingFiles.isNotEmpty()) {
                val filesArray = Arguments.createArray()

                for (file in matchingFiles) {
                    val params = Arguments.createMap()
                    val uri = Uri.fromFile(file)
                    Log.d(TAG_NAME, "文件url：$uri")
                    val mimeType: String? = FileTypeHelper.getMimeType(mContext, uri)
                    params.putString("url", uri.toString())
                    params.putString("type", mimeType)
                    params.putString("name", file.name)
                    Log.d(TAG_NAME, "文件名称：${file.name}")
                    Log.d(TAG_NAME, "文件大小：${file.length()}")
                    Log.d(TAG_NAME, "文件类型：${mimeType}")
                    Log.d(TAG_NAME, "文件创建时间：${file.lastModified()}")
                    filesArray.pushMap(params)
                }

                promise.resolve(filesArray)

            } else {
                promise.resolve(Arguments.createArray())
                Log.d(TAG_NAME, "未找到匹配的最新文件")
            }
        } else {
            promise.resolve(Arguments.createArray())
            Log.d(TAG_NAME, "目录不存在或者不是有效的目录")
        }
    }


    /* 查找某个日期后的所有文件 */
    @ReactMethod
    fun findRecordingFile(startTime: String, promise: Promise) {
        val parent = Environment.getExternalStorageDirectory()
        val folderPath = File(parent, "MIUI/sound_recorder/call_rec")
        val matchingFiles = mutableListOf<File>()

        if (folderPath.exists() && folderPath.isDirectory) {
            val files = folderPath.listFiles()

            for (file in files!!) {
                val date = file.lastModified()

                if (date > startTime.toLong()) {
                    matchingFiles.add(file)
                }
            }

            if (matchingFiles.isNotEmpty()) {
                val filesArray = Arguments.createArray()

                for (file in matchingFiles) {
                    val params = Arguments.createMap()
                    val uri = Uri.fromFile(file)
                    Log.d(TAG_NAME, "文件url：$uri")
                    val mimeType: String? = FileTypeHelper.getMimeType(mContext, uri)
                    params.putString("url", uri.toString())
                    params.putString("type", mimeType)
                    params.putString("name", file.name)
                    Log.d(TAG_NAME, "文件名称：${file.name}")
                    Log.d(TAG_NAME, "文件大小：${file.length()}")
                    Log.d(TAG_NAME, "文件类型：${mimeType}")
                    Log.d(TAG_NAME, "文件创建时间：${file.lastModified()}")
                    filesArray.pushMap(params)
                }

                promise.resolve(filesArray)

            } else {
                promise.resolve(Arguments.createArray())
                Log.d(TAG_NAME, "未找到需要补偿的文件")
            }
        } else {
            promise.resolve(Arguments.createArray())
            Log.d(TAG_NAME, "目录不存在或者不是有效的目录")
        }
    }


    private val handler = Handler(Looper.getMainLooper())

    @ReactMethod
    fun delayedGetOutgoingCallDetails(phoneNumber: String, promise: Promise) {
        // 延迟 5 秒后执行查询通话记录的操作
        handler.postDelayed({
            getOutgoingCallDetails(phoneNumber, promise)
        }, 5000) // 5000 毫秒等于 5 秒
    }

    /**
     * 启动前台服务
     */
    @ReactMethod
    fun startForegroundService() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            Log.d("smart-helper", "新sdk启动service")
            val intent = Intent(reactApplicationContext, PhoneCallStateServiceReceiver::class.java)
            reactApplicationContext.startForegroundService(intent)
        } else {
            Log.d("smart-helper", "旧sdk启动service")
            reactApplicationContext.startService(Intent(reactApplicationContext, PhoneCallStateServiceReceiver::class.java))
        }
    }

    /**
     * 停止前台服务
     */
    @ReactMethod
    fun stopForegroundService() {
        reactApplicationContext.stopService(Intent(reactApplicationContext, PhoneCallStateServiceReceiver::class.java))
    }

    /**
     * 从通话记录中，获取通话时长
     */
    @ReactMethod
    fun getOutgoingCallDetails(phoneNumber: String, promise: Promise) {
        val callUri = CallLog.Calls.CONTENT_URI

        val projection = arrayOf(
            CallLog.Calls.DATE,
            CallLog.Calls.NUMBER,
            CallLog.Calls.DURATION,
            CallLog.Calls.TYPE
        )

        val selection = "${CallLog.Calls.NUMBER} = ?"
        val selectionArgs = arrayOf(phoneNumber)

        val contentResolver: ContentResolver = mContext.contentResolver

        val cursor = contentResolver.query(
            callUri,
            projection,
            selection,
            selectionArgs,
            CallLog.Calls.DATE + " DESC" // 按照通话日期倒序排序
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


            promise.resolve(params)
        } else {
            promise.resolve(null)
        }

        cursor?.close()
    }

    private fun checkXiaomiRecord(): Boolean {
        try {
            val key: Int = Settings.System.getInt(
                reactApplicationContext.applicationContext.contentResolver,
                "button_auto_record_call"
            )
            //0是未开启,1是开启
            return key != 0
        } catch (e: Settings.SettingNotFoundException) {
            e.printStackTrace()
        }
        return true
    }

    private fun startXiaomiRecord() {
        val componentName =
            ComponentName("com.android.phone", "com.android.phone.settings.CallRecordSetting")
        val intent = Intent()
        intent.component = componentName
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        mContext.startActivity(intent)
        Toast.makeText(mContext, "请打开小米通话自动录音功能", Toast.LENGTH_LONG).show()
    }


    /**
     * 判断权限集合
     * permissions 权限数组
     * return true-表示有权限 false-表示无权限
     */
    private fun lacksPermissions(permissions: List<String>): Boolean {
        for (permission in permissions) {
            return lacksPermission(permission)
        }
        return false
    }

    // 判断是否缺少权限
    private fun lacksPermission(permission: String): Boolean {
        return ContextCompat.checkSelfPermission(mContext, permission) == PackageManager.PERMISSION_GRANTED
    }

    override fun invalidate() {
        super.invalidate()
        Log.d(TAG_NAME, "释放资源")
    }

    companion object {
        private var context: ReactApplicationContext? = null;
        fun setContext(con: ReactApplicationContext) {
            this.context = con
        }
        fun sendEvent(eventName: String, params: WritableMap) {
            Log.d("PhoneStateReceiver", "eventName：$eventName，params:$params")
            context?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit(eventName, params)
        }
    }
}

