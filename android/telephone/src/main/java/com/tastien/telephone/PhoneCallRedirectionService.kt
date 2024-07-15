package com.tastien.telephone

import android.telecom.CallRedirectionService
import android.telecom.PhoneAccountHandle
import android.net.Uri
import android.os.Build
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.Arguments
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@RequiresApi(Build.VERSION_CODES.Q)
class PhoneCallInterceptService : CallRedirectionService() {

    override fun onPlaceCall(handle: Uri, initialPhoneAccount: PhoneAccountHandle, allowInteractiveResponse: Boolean) {
        val callNumber = handle.schemeSpecificPart
        val params = Arguments.createMap()
        val currentTime = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(Date())

        params.putString("callNumber", callNumber)
        params.putString("callTime", currentTime)
        TelephoneModule.sendEvent("outgoingCalls", params)
        placeCallUnmodified()
    }
}