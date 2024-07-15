plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
}

fun getExtOrDefault(name:String, defaultValue: Int): Int {
    if (rootProject.ext.has(name)) {
        return rootProject.ext.get(name) as Int
    }
    return defaultValue
}


android {
    namespace = "com.tastien.utils"
    compileSdk = getExtOrDefault("compileSdkVersion", 33)

    defaultConfig {
        minSdk = getExtOrDefault("minSdkVersion", 21)
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        consumerProguardFiles("consumer-rules.pro")
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("com.facebook.react:react-native:+")
    implementation("com.github.getActivity:XXPermissions:18.6")
}