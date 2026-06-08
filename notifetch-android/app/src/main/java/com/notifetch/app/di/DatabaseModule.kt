package com.notifetch.app.di

import android.content.Context
import androidx.room.Room
import com.notifetch.app.data.local.NotiFetchDatabase
import com.notifetch.app.data.local.NotificationDao
import com.notifetch.app.data.local.PlatformConfigDao
import com.notifetch.app.util.Constants
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): NotiFetchDatabase {
        return Room.databaseBuilder(
            context,
            NotiFetchDatabase::class.java,
            Constants.DATABASE_NAME
        )
            .fallbackToDestructiveMigration()
            .build()
    }

    @Provides
    fun provideNotificationDao(database: NotiFetchDatabase): NotificationDao =
        database.notificationDao()

    @Provides
    fun providePlatformConfigDao(database: NotiFetchDatabase): PlatformConfigDao =
        database.platformConfigDao()
}
