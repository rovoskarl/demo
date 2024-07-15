package com.tastien.telephone

import android.content.BroadcastReceiver
import android.content.Intent
import android.content.IntentFilter
import android.os.Bundle
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.jstasks.HeadlessJsTaskConfig
import com.facebook.react.jstasks.LinearCountingRetryPolicy

class BackgroundFileService: HeadlessJsTaskService() {
   /* override fun getTaskConfig(intent: Intent): HeadlessJsTaskConfig {
        val extras: Bundle? = intent.extras;
        var data: WritableMap? = null
        data = if (extras != null) {
            Arguments.fromBundle(extras)
        } else {
            Arguments.createMap()
        }
        val retryPolicy = LinearCountingRetryPolicy(
            3, // Max number of retry attempts
            1000 // Delay between each retry attempt
        );
        return HeadlessJsTaskConfig(
            "BackgroundTask",
            data,
            10000,
            false,
            retryPolicy
        )
    }*/
   override fun getTaskConfig(intent: Intent): HeadlessJsTaskConfig? {
       return intent.extras?.let {
           HeadlessJsTaskConfig(
               "SomeTaskName",
               Arguments.fromBundle(it),
               5000, // timeout for the task
               false // optional: defines whether or not the task is allowed in foreground.
               // Default is false
           )
       }
   }
}