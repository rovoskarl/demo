package com.tastien.telephone

import android.content.Context
import android.net.Uri
import android.webkit.MimeTypeMap

object FileTypeHelper {
    fun getMimeType(context: Context, uri: Uri): String? {
        val contentResolver = context.contentResolver

        // 使用 ContentResolver 获取文件的 MIME 类型
        var mimeType = contentResolver.getType(uri)

        // 如果 ContentResolver 未能获取 MIME 类型，则尝试使用文件扩展名推断
        if (mimeType == null) {
            mimeType = getMimeTypeFromExtension(context, uri)
        }
        return mimeType
    }

    private fun getMimeTypeFromExtension(
        context: Context,
        uri: Uri
    ): String? {
        val contentResolver = context.contentResolver

        // 使用 MimeTypeMap 获取文件扩展名
        val fileExtension = MimeTypeMap.getFileExtensionFromUrl(uri.toString())

        // 使用 MimeTypeMap 获取 MIME 类型
        return MimeTypeMap.getSingleton().getMimeTypeFromExtension(fileExtension)
    }
}
