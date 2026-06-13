package com.notifetch.app;

import android.app.Activity;
import android.app.Service;
import android.content.Context;
import android.view.View;
import androidx.fragment.app.Fragment;
import androidx.hilt.work.HiltWorkerFactory;
import androidx.hilt.work.WorkerAssistedFactory;
import androidx.hilt.work.WorkerFactoryModule_ProvideFactoryFactory;
import androidx.lifecycle.SavedStateHandle;
import androidx.lifecycle.ViewModel;
import androidx.work.ListenableWorker;
import androidx.work.WorkerParameters;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;
import com.google.errorprone.annotations.CanIgnoreReturnValue;
import com.google.firebase.auth.FirebaseAuth;
import com.notifetch.app.data.local.NotiFetchDatabase;
import com.notifetch.app.data.local.NotificationDao;
import com.notifetch.app.data.local.PlatformConfigDao;
import com.notifetch.app.data.remote.NotiFetchApi;
import com.notifetch.app.data.repository.AuthRepository;
import com.notifetch.app.data.repository.NotificationRepository;
import com.notifetch.app.di.DatabaseModule_ProvideDatabaseFactory;
import com.notifetch.app.di.DatabaseModule_ProvideNotificationDaoFactory;
import com.notifetch.app.di.DatabaseModule_ProvidePlatformConfigDaoFactory;
import com.notifetch.app.di.FirebaseModule_ProvideFirebaseAuthFactory;
import com.notifetch.app.di.FirebaseModule_ProvideGoogleSignInClientFactory;
import com.notifetch.app.di.NetworkModule_ProvideMoshiFactory;
import com.notifetch.app.di.NetworkModule_ProvideNotiFetchApiFactory;
import com.notifetch.app.di.NetworkModule_ProvideOkHttpClientFactory;
import com.notifetch.app.di.NetworkModule_ProvideRetrofitFactory;
import com.notifetch.app.firebase.NotiFetchMessagingService;
import com.notifetch.app.firebase.NotiFetchMessagingService_MembersInjector;
import com.notifetch.app.notification.NotiFetchListenerService;
import com.notifetch.app.notification.NotiFetchListenerService_MembersInjector;
import com.notifetch.app.ui.viewmodel.EarningsViewModel;
import com.notifetch.app.ui.viewmodel.EarningsViewModel_HiltModules;
import com.notifetch.app.ui.viewmodel.EarningsViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.notifetch.app.ui.viewmodel.EarningsViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.notifetch.app.ui.viewmodel.HomeViewModel;
import com.notifetch.app.ui.viewmodel.HomeViewModel_HiltModules;
import com.notifetch.app.ui.viewmodel.HomeViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.notifetch.app.ui.viewmodel.HomeViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.notifetch.app.ui.viewmodel.NotificationDetailViewModel;
import com.notifetch.app.ui.viewmodel.NotificationDetailViewModel_HiltModules;
import com.notifetch.app.ui.viewmodel.NotificationDetailViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.notifetch.app.ui.viewmodel.NotificationDetailViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.notifetch.app.ui.viewmodel.ProfileViewModel;
import com.notifetch.app.ui.viewmodel.ProfileViewModel_HiltModules;
import com.notifetch.app.ui.viewmodel.ProfileViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.notifetch.app.ui.viewmodel.ProfileViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.notifetch.app.ui.viewmodel.SettingsViewModel;
import com.notifetch.app.ui.viewmodel.SettingsViewModel_HiltModules;
import com.notifetch.app.ui.viewmodel.SettingsViewModel_HiltModules_BindsModule_Binds_LazyMapKey;
import com.notifetch.app.ui.viewmodel.SettingsViewModel_HiltModules_KeyModule_Provide_LazyMapKey;
import com.notifetch.app.worker.SyncWorker;
import com.notifetch.app.worker.SyncWorker_AssistedFactory;
import com.squareup.moshi.Moshi;
import dagger.hilt.android.ActivityRetainedLifecycle;
import dagger.hilt.android.ViewModelLifecycle;
import dagger.hilt.android.internal.builders.ActivityComponentBuilder;
import dagger.hilt.android.internal.builders.ActivityRetainedComponentBuilder;
import dagger.hilt.android.internal.builders.FragmentComponentBuilder;
import dagger.hilt.android.internal.builders.ServiceComponentBuilder;
import dagger.hilt.android.internal.builders.ViewComponentBuilder;
import dagger.hilt.android.internal.builders.ViewModelComponentBuilder;
import dagger.hilt.android.internal.builders.ViewWithFragmentComponentBuilder;
import dagger.hilt.android.internal.lifecycle.DefaultViewModelFactories;
import dagger.hilt.android.internal.lifecycle.DefaultViewModelFactories_InternalFactoryFactory_Factory;
import dagger.hilt.android.internal.managers.ActivityRetainedComponentManager_LifecycleModule_ProvideActivityRetainedLifecycleFactory;
import dagger.hilt.android.internal.managers.SavedStateHandleHolder;
import dagger.hilt.android.internal.modules.ApplicationContextModule;
import dagger.hilt.android.internal.modules.ApplicationContextModule_ProvideApplicationFactory;
import dagger.hilt.android.internal.modules.ApplicationContextModule_ProvideContextFactory;
import dagger.internal.DaggerGenerated;
import dagger.internal.DoubleCheck;
import dagger.internal.LazyClassKeyMap;
import dagger.internal.Preconditions;
import dagger.internal.Provider;
import dagger.internal.SingleCheck;
import java.util.Map;
import java.util.Set;
import javax.annotation.processing.Generated;
import okhttp3.OkHttpClient;
import retrofit2.Retrofit;

@DaggerGenerated
@Generated(
    value = "dagger.internal.codegen.ComponentProcessor",
    comments = "https://dagger.dev"
)
@SuppressWarnings({
    "unchecked",
    "rawtypes",
    "KotlinInternal",
    "KotlinInternalInJava",
    "cast",
    "deprecation",
    "nullness:initialization.field.uninitialized"
})
public final class DaggerNotiFetchApp_HiltComponents_SingletonC {
  private DaggerNotiFetchApp_HiltComponents_SingletonC() {
  }

  public static Builder builder() {
    return new Builder();
  }

  public static final class Builder {
    private ApplicationContextModule applicationContextModule;

    private Builder() {
    }

    public Builder applicationContextModule(ApplicationContextModule applicationContextModule) {
      this.applicationContextModule = Preconditions.checkNotNull(applicationContextModule);
      return this;
    }

    public NotiFetchApp_HiltComponents.SingletonC build() {
      Preconditions.checkBuilderRequirement(applicationContextModule, ApplicationContextModule.class);
      return new SingletonCImpl(applicationContextModule);
    }
  }

  private static final class ActivityRetainedCBuilder implements NotiFetchApp_HiltComponents.ActivityRetainedC.Builder {
    private final SingletonCImpl singletonCImpl;

    private SavedStateHandleHolder savedStateHandleHolder;

    private ActivityRetainedCBuilder(SingletonCImpl singletonCImpl) {
      this.singletonCImpl = singletonCImpl;
    }

    @Override
    public ActivityRetainedCBuilder savedStateHandleHolder(
        SavedStateHandleHolder savedStateHandleHolder) {
      this.savedStateHandleHolder = Preconditions.checkNotNull(savedStateHandleHolder);
      return this;
    }

    @Override
    public NotiFetchApp_HiltComponents.ActivityRetainedC build() {
      Preconditions.checkBuilderRequirement(savedStateHandleHolder, SavedStateHandleHolder.class);
      return new ActivityRetainedCImpl(singletonCImpl, savedStateHandleHolder);
    }
  }

  private static final class ActivityCBuilder implements NotiFetchApp_HiltComponents.ActivityC.Builder {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private Activity activity;

    private ActivityCBuilder(SingletonCImpl singletonCImpl,
        ActivityRetainedCImpl activityRetainedCImpl) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;
    }

    @Override
    public ActivityCBuilder activity(Activity activity) {
      this.activity = Preconditions.checkNotNull(activity);
      return this;
    }

    @Override
    public NotiFetchApp_HiltComponents.ActivityC build() {
      Preconditions.checkBuilderRequirement(activity, Activity.class);
      return new ActivityCImpl(singletonCImpl, activityRetainedCImpl, activity);
    }
  }

  private static final class FragmentCBuilder implements NotiFetchApp_HiltComponents.FragmentC.Builder {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private final ActivityCImpl activityCImpl;

    private Fragment fragment;

    private FragmentCBuilder(SingletonCImpl singletonCImpl,
        ActivityRetainedCImpl activityRetainedCImpl, ActivityCImpl activityCImpl) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;
      this.activityCImpl = activityCImpl;
    }

    @Override
    public FragmentCBuilder fragment(Fragment fragment) {
      this.fragment = Preconditions.checkNotNull(fragment);
      return this;
    }

    @Override
    public NotiFetchApp_HiltComponents.FragmentC build() {
      Preconditions.checkBuilderRequirement(fragment, Fragment.class);
      return new FragmentCImpl(singletonCImpl, activityRetainedCImpl, activityCImpl, fragment);
    }
  }

  private static final class ViewWithFragmentCBuilder implements NotiFetchApp_HiltComponents.ViewWithFragmentC.Builder {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private final ActivityCImpl activityCImpl;

    private final FragmentCImpl fragmentCImpl;

    private View view;

    private ViewWithFragmentCBuilder(SingletonCImpl singletonCImpl,
        ActivityRetainedCImpl activityRetainedCImpl, ActivityCImpl activityCImpl,
        FragmentCImpl fragmentCImpl) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;
      this.activityCImpl = activityCImpl;
      this.fragmentCImpl = fragmentCImpl;
    }

    @Override
    public ViewWithFragmentCBuilder view(View view) {
      this.view = Preconditions.checkNotNull(view);
      return this;
    }

    @Override
    public NotiFetchApp_HiltComponents.ViewWithFragmentC build() {
      Preconditions.checkBuilderRequirement(view, View.class);
      return new ViewWithFragmentCImpl(singletonCImpl, activityRetainedCImpl, activityCImpl, fragmentCImpl, view);
    }
  }

  private static final class ViewCBuilder implements NotiFetchApp_HiltComponents.ViewC.Builder {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private final ActivityCImpl activityCImpl;

    private View view;

    private ViewCBuilder(SingletonCImpl singletonCImpl, ActivityRetainedCImpl activityRetainedCImpl,
        ActivityCImpl activityCImpl) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;
      this.activityCImpl = activityCImpl;
    }

    @Override
    public ViewCBuilder view(View view) {
      this.view = Preconditions.checkNotNull(view);
      return this;
    }

    @Override
    public NotiFetchApp_HiltComponents.ViewC build() {
      Preconditions.checkBuilderRequirement(view, View.class);
      return new ViewCImpl(singletonCImpl, activityRetainedCImpl, activityCImpl, view);
    }
  }

  private static final class ViewModelCBuilder implements NotiFetchApp_HiltComponents.ViewModelC.Builder {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private SavedStateHandle savedStateHandle;

    private ViewModelLifecycle viewModelLifecycle;

    private ViewModelCBuilder(SingletonCImpl singletonCImpl,
        ActivityRetainedCImpl activityRetainedCImpl) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;
    }

    @Override
    public ViewModelCBuilder savedStateHandle(SavedStateHandle handle) {
      this.savedStateHandle = Preconditions.checkNotNull(handle);
      return this;
    }

    @Override
    public ViewModelCBuilder viewModelLifecycle(ViewModelLifecycle viewModelLifecycle) {
      this.viewModelLifecycle = Preconditions.checkNotNull(viewModelLifecycle);
      return this;
    }

    @Override
    public NotiFetchApp_HiltComponents.ViewModelC build() {
      Preconditions.checkBuilderRequirement(savedStateHandle, SavedStateHandle.class);
      Preconditions.checkBuilderRequirement(viewModelLifecycle, ViewModelLifecycle.class);
      return new ViewModelCImpl(singletonCImpl, activityRetainedCImpl, savedStateHandle, viewModelLifecycle);
    }
  }

  private static final class ServiceCBuilder implements NotiFetchApp_HiltComponents.ServiceC.Builder {
    private final SingletonCImpl singletonCImpl;

    private Service service;

    private ServiceCBuilder(SingletonCImpl singletonCImpl) {
      this.singletonCImpl = singletonCImpl;
    }

    @Override
    public ServiceCBuilder service(Service service) {
      this.service = Preconditions.checkNotNull(service);
      return this;
    }

    @Override
    public NotiFetchApp_HiltComponents.ServiceC build() {
      Preconditions.checkBuilderRequirement(service, Service.class);
      return new ServiceCImpl(singletonCImpl, service);
    }
  }

  private static final class ViewWithFragmentCImpl extends NotiFetchApp_HiltComponents.ViewWithFragmentC {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private final ActivityCImpl activityCImpl;

    private final FragmentCImpl fragmentCImpl;

    private final ViewWithFragmentCImpl viewWithFragmentCImpl = this;

    private ViewWithFragmentCImpl(SingletonCImpl singletonCImpl,
        ActivityRetainedCImpl activityRetainedCImpl, ActivityCImpl activityCImpl,
        FragmentCImpl fragmentCImpl, View viewParam) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;
      this.activityCImpl = activityCImpl;
      this.fragmentCImpl = fragmentCImpl;


    }
  }

  private static final class FragmentCImpl extends NotiFetchApp_HiltComponents.FragmentC {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private final ActivityCImpl activityCImpl;

    private final FragmentCImpl fragmentCImpl = this;

    private FragmentCImpl(SingletonCImpl singletonCImpl,
        ActivityRetainedCImpl activityRetainedCImpl, ActivityCImpl activityCImpl,
        Fragment fragmentParam) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;
      this.activityCImpl = activityCImpl;


    }

    @Override
    public DefaultViewModelFactories.InternalFactoryFactory getHiltInternalFactoryFactory() {
      return activityCImpl.getHiltInternalFactoryFactory();
    }

    @Override
    public ViewWithFragmentComponentBuilder viewWithFragmentComponentBuilder() {
      return new ViewWithFragmentCBuilder(singletonCImpl, activityRetainedCImpl, activityCImpl, fragmentCImpl);
    }
  }

  private static final class ViewCImpl extends NotiFetchApp_HiltComponents.ViewC {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private final ActivityCImpl activityCImpl;

    private final ViewCImpl viewCImpl = this;

    private ViewCImpl(SingletonCImpl singletonCImpl, ActivityRetainedCImpl activityRetainedCImpl,
        ActivityCImpl activityCImpl, View viewParam) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;
      this.activityCImpl = activityCImpl;


    }
  }

  private static final class ActivityCImpl extends NotiFetchApp_HiltComponents.ActivityC {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private final ActivityCImpl activityCImpl = this;

    private ActivityCImpl(SingletonCImpl singletonCImpl,
        ActivityRetainedCImpl activityRetainedCImpl, Activity activityParam) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;


    }

    @Override
    public void injectMainActivity(MainActivity mainActivity) {
    }

    @Override
    public DefaultViewModelFactories.InternalFactoryFactory getHiltInternalFactoryFactory() {
      return DefaultViewModelFactories_InternalFactoryFactory_Factory.newInstance(getViewModelKeys(), new ViewModelCBuilder(singletonCImpl, activityRetainedCImpl));
    }

    @Override
    public Map<Class<?>, Boolean> getViewModelKeys() {
      return LazyClassKeyMap.<Boolean>of(ImmutableMap.<String, Boolean>of(EarningsViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, EarningsViewModel_HiltModules.KeyModule.provide(), HomeViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, HomeViewModel_HiltModules.KeyModule.provide(), NotificationDetailViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, NotificationDetailViewModel_HiltModules.KeyModule.provide(), ProfileViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, ProfileViewModel_HiltModules.KeyModule.provide(), SettingsViewModel_HiltModules_KeyModule_Provide_LazyMapKey.lazyClassKeyName, SettingsViewModel_HiltModules.KeyModule.provide()));
    }

    @Override
    public ViewModelComponentBuilder getViewModelComponentBuilder() {
      return new ViewModelCBuilder(singletonCImpl, activityRetainedCImpl);
    }

    @Override
    public FragmentComponentBuilder fragmentComponentBuilder() {
      return new FragmentCBuilder(singletonCImpl, activityRetainedCImpl, activityCImpl);
    }

    @Override
    public ViewComponentBuilder viewComponentBuilder() {
      return new ViewCBuilder(singletonCImpl, activityRetainedCImpl, activityCImpl);
    }
  }

  private static final class ViewModelCImpl extends NotiFetchApp_HiltComponents.ViewModelC {
    private final SavedStateHandle savedStateHandle;

    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl;

    private final ViewModelCImpl viewModelCImpl = this;

    private Provider<EarningsViewModel> earningsViewModelProvider;

    private Provider<HomeViewModel> homeViewModelProvider;

    private Provider<NotificationDetailViewModel> notificationDetailViewModelProvider;

    private Provider<ProfileViewModel> profileViewModelProvider;

    private Provider<SettingsViewModel> settingsViewModelProvider;

    private ViewModelCImpl(SingletonCImpl singletonCImpl,
        ActivityRetainedCImpl activityRetainedCImpl, SavedStateHandle savedStateHandleParam,
        ViewModelLifecycle viewModelLifecycleParam) {
      this.singletonCImpl = singletonCImpl;
      this.activityRetainedCImpl = activityRetainedCImpl;
      this.savedStateHandle = savedStateHandleParam;
      initialize(savedStateHandleParam, viewModelLifecycleParam);

    }

    @SuppressWarnings("unchecked")
    private void initialize(final SavedStateHandle savedStateHandleParam,
        final ViewModelLifecycle viewModelLifecycleParam) {
      this.earningsViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 0);
      this.homeViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 1);
      this.notificationDetailViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 2);
      this.profileViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 3);
      this.settingsViewModelProvider = new SwitchingProvider<>(singletonCImpl, activityRetainedCImpl, viewModelCImpl, 4);
    }

    @Override
    public Map<Class<?>, javax.inject.Provider<ViewModel>> getHiltViewModelMap() {
      return LazyClassKeyMap.<javax.inject.Provider<ViewModel>>of(ImmutableMap.<String, javax.inject.Provider<ViewModel>>of(EarningsViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) earningsViewModelProvider), HomeViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) homeViewModelProvider), NotificationDetailViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) notificationDetailViewModelProvider), ProfileViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) profileViewModelProvider), SettingsViewModel_HiltModules_BindsModule_Binds_LazyMapKey.lazyClassKeyName, ((Provider) settingsViewModelProvider)));
    }

    @Override
    public Map<Class<?>, Object> getHiltViewModelAssistedMap() {
      return ImmutableMap.<Class<?>, Object>of();
    }

    private static final class SwitchingProvider<T> implements Provider<T> {
      private final SingletonCImpl singletonCImpl;

      private final ActivityRetainedCImpl activityRetainedCImpl;

      private final ViewModelCImpl viewModelCImpl;

      private final int id;

      SwitchingProvider(SingletonCImpl singletonCImpl, ActivityRetainedCImpl activityRetainedCImpl,
          ViewModelCImpl viewModelCImpl, int id) {
        this.singletonCImpl = singletonCImpl;
        this.activityRetainedCImpl = activityRetainedCImpl;
        this.viewModelCImpl = viewModelCImpl;
        this.id = id;
      }

      @SuppressWarnings("unchecked")
      @Override
      public T get() {
        switch (id) {
          case 0: // com.notifetch.app.ui.viewmodel.EarningsViewModel 
          return (T) new EarningsViewModel(ApplicationContextModule_ProvideApplicationFactory.provideApplication(singletonCImpl.applicationContextModule), singletonCImpl.notificationRepositoryProvider.get(), singletonCImpl.authRepositoryProvider.get());

          case 1: // com.notifetch.app.ui.viewmodel.HomeViewModel 
          return (T) new HomeViewModel(singletonCImpl.notificationRepositoryProvider.get(), singletonCImpl.authRepositoryProvider.get());

          case 2: // com.notifetch.app.ui.viewmodel.NotificationDetailViewModel 
          return (T) new NotificationDetailViewModel(viewModelCImpl.savedStateHandle, singletonCImpl.notificationRepositoryProvider.get());

          case 3: // com.notifetch.app.ui.viewmodel.ProfileViewModel 
          return (T) new ProfileViewModel(singletonCImpl.authRepositoryProvider.get(), singletonCImpl.notificationRepositoryProvider.get(), singletonCImpl.provideGoogleSignInClientProvider.get(), singletonCImpl.provideFirebaseAuthProvider.get());

          case 4: // com.notifetch.app.ui.viewmodel.SettingsViewModel 
          return (T) new SettingsViewModel(ApplicationContextModule_ProvideContextFactory.provideContext(singletonCImpl.applicationContextModule), singletonCImpl.notificationRepositoryProvider.get());

          default: throw new AssertionError(id);
        }
      }
    }
  }

  private static final class ActivityRetainedCImpl extends NotiFetchApp_HiltComponents.ActivityRetainedC {
    private final SingletonCImpl singletonCImpl;

    private final ActivityRetainedCImpl activityRetainedCImpl = this;

    private Provider<ActivityRetainedLifecycle> provideActivityRetainedLifecycleProvider;

    private ActivityRetainedCImpl(SingletonCImpl singletonCImpl,
        SavedStateHandleHolder savedStateHandleHolderParam) {
      this.singletonCImpl = singletonCImpl;

      initialize(savedStateHandleHolderParam);

    }

    @SuppressWarnings("unchecked")
    private void initialize(final SavedStateHandleHolder savedStateHandleHolderParam) {
      this.provideActivityRetainedLifecycleProvider = DoubleCheck.provider(new SwitchingProvider<ActivityRetainedLifecycle>(singletonCImpl, activityRetainedCImpl, 0));
    }

    @Override
    public ActivityComponentBuilder activityComponentBuilder() {
      return new ActivityCBuilder(singletonCImpl, activityRetainedCImpl);
    }

    @Override
    public ActivityRetainedLifecycle getActivityRetainedLifecycle() {
      return provideActivityRetainedLifecycleProvider.get();
    }

    private static final class SwitchingProvider<T> implements Provider<T> {
      private final SingletonCImpl singletonCImpl;

      private final ActivityRetainedCImpl activityRetainedCImpl;

      private final int id;

      SwitchingProvider(SingletonCImpl singletonCImpl, ActivityRetainedCImpl activityRetainedCImpl,
          int id) {
        this.singletonCImpl = singletonCImpl;
        this.activityRetainedCImpl = activityRetainedCImpl;
        this.id = id;
      }

      @SuppressWarnings("unchecked")
      @Override
      public T get() {
        switch (id) {
          case 0: // dagger.hilt.android.ActivityRetainedLifecycle 
          return (T) ActivityRetainedComponentManager_LifecycleModule_ProvideActivityRetainedLifecycleFactory.provideActivityRetainedLifecycle();

          default: throw new AssertionError(id);
        }
      }
    }
  }

  private static final class ServiceCImpl extends NotiFetchApp_HiltComponents.ServiceC {
    private final SingletonCImpl singletonCImpl;

    private final ServiceCImpl serviceCImpl = this;

    private ServiceCImpl(SingletonCImpl singletonCImpl, Service serviceParam) {
      this.singletonCImpl = singletonCImpl;


    }

    @Override
    public void injectNotiFetchMessagingService(
        NotiFetchMessagingService notiFetchMessagingService) {
      injectNotiFetchMessagingService2(notiFetchMessagingService);
    }

    @Override
    public void injectNotiFetchListenerService(NotiFetchListenerService notiFetchListenerService) {
      injectNotiFetchListenerService2(notiFetchListenerService);
    }

    @CanIgnoreReturnValue
    private NotiFetchMessagingService injectNotiFetchMessagingService2(
        NotiFetchMessagingService instance) {
      NotiFetchMessagingService_MembersInjector.injectApi(instance, singletonCImpl.provideNotiFetchApiProvider.get());
      NotiFetchMessagingService_MembersInjector.injectAuthRepository(instance, singletonCImpl.authRepositoryProvider.get());
      return instance;
    }

    @CanIgnoreReturnValue
    private NotiFetchListenerService injectNotiFetchListenerService2(
        NotiFetchListenerService instance2) {
      NotiFetchListenerService_MembersInjector.injectRepository(instance2, singletonCImpl.notificationRepositoryProvider.get());
      NotiFetchListenerService_MembersInjector.injectAuthRepository(instance2, singletonCImpl.authRepositoryProvider.get());
      return instance2;
    }
  }

  private static final class SingletonCImpl extends NotiFetchApp_HiltComponents.SingletonC {
    private final ApplicationContextModule applicationContextModule;

    private final SingletonCImpl singletonCImpl = this;

    private Provider<NotiFetchDatabase> provideDatabaseProvider;

    private Provider<OkHttpClient> provideOkHttpClientProvider;

    private Provider<Moshi> provideMoshiProvider;

    private Provider<Retrofit> provideRetrofitProvider;

    private Provider<NotiFetchApi> provideNotiFetchApiProvider;

    private Provider<FirebaseAuth> provideFirebaseAuthProvider;

    private Provider<AuthRepository> authRepositoryProvider;

    private Provider<NotificationRepository> notificationRepositoryProvider;

    private Provider<SyncWorker_AssistedFactory> syncWorker_AssistedFactoryProvider;

    private Provider<GoogleSignInClient> provideGoogleSignInClientProvider;

    private SingletonCImpl(ApplicationContextModule applicationContextModuleParam) {
      this.applicationContextModule = applicationContextModuleParam;
      initialize(applicationContextModuleParam);

    }

    private NotificationDao notificationDao() {
      return DatabaseModule_ProvideNotificationDaoFactory.provideNotificationDao(provideDatabaseProvider.get());
    }

    private PlatformConfigDao platformConfigDao() {
      return DatabaseModule_ProvidePlatformConfigDaoFactory.providePlatformConfigDao(provideDatabaseProvider.get());
    }

    private Map<String, javax.inject.Provider<WorkerAssistedFactory<? extends ListenableWorker>>> mapOfStringAndProviderOfWorkerAssistedFactoryOf(
        ) {
      return ImmutableMap.<String, javax.inject.Provider<WorkerAssistedFactory<? extends ListenableWorker>>>of("com.notifetch.app.worker.SyncWorker", ((Provider) syncWorker_AssistedFactoryProvider));
    }

    private HiltWorkerFactory hiltWorkerFactory() {
      return WorkerFactoryModule_ProvideFactoryFactory.provideFactory(mapOfStringAndProviderOfWorkerAssistedFactoryOf());
    }

    @SuppressWarnings("unchecked")
    private void initialize(final ApplicationContextModule applicationContextModuleParam) {
      this.provideDatabaseProvider = DoubleCheck.provider(new SwitchingProvider<NotiFetchDatabase>(singletonCImpl, 2));
      this.provideOkHttpClientProvider = DoubleCheck.provider(new SwitchingProvider<OkHttpClient>(singletonCImpl, 5));
      this.provideMoshiProvider = DoubleCheck.provider(new SwitchingProvider<Moshi>(singletonCImpl, 6));
      this.provideRetrofitProvider = DoubleCheck.provider(new SwitchingProvider<Retrofit>(singletonCImpl, 4));
      this.provideNotiFetchApiProvider = DoubleCheck.provider(new SwitchingProvider<NotiFetchApi>(singletonCImpl, 3));
      this.provideFirebaseAuthProvider = DoubleCheck.provider(new SwitchingProvider<FirebaseAuth>(singletonCImpl, 8));
      this.authRepositoryProvider = DoubleCheck.provider(new SwitchingProvider<AuthRepository>(singletonCImpl, 7));
      this.notificationRepositoryProvider = DoubleCheck.provider(new SwitchingProvider<NotificationRepository>(singletonCImpl, 1));
      this.syncWorker_AssistedFactoryProvider = SingleCheck.provider(new SwitchingProvider<SyncWorker_AssistedFactory>(singletonCImpl, 0));
      this.provideGoogleSignInClientProvider = DoubleCheck.provider(new SwitchingProvider<GoogleSignInClient>(singletonCImpl, 9));
    }

    @Override
    public void injectNotiFetchApp(NotiFetchApp notiFetchApp) {
      injectNotiFetchApp2(notiFetchApp);
    }

    @Override
    public Set<Boolean> getDisableFragmentGetContextFix() {
      return ImmutableSet.<Boolean>of();
    }

    @Override
    public ActivityRetainedComponentBuilder retainedComponentBuilder() {
      return new ActivityRetainedCBuilder(singletonCImpl);
    }

    @Override
    public ServiceComponentBuilder serviceComponentBuilder() {
      return new ServiceCBuilder(singletonCImpl);
    }

    @CanIgnoreReturnValue
    private NotiFetchApp injectNotiFetchApp2(NotiFetchApp instance) {
      NotiFetchApp_MembersInjector.injectWorkerFactory(instance, hiltWorkerFactory());
      return instance;
    }

    private static final class SwitchingProvider<T> implements Provider<T> {
      private final SingletonCImpl singletonCImpl;

      private final int id;

      SwitchingProvider(SingletonCImpl singletonCImpl, int id) {
        this.singletonCImpl = singletonCImpl;
        this.id = id;
      }

      @SuppressWarnings("unchecked")
      @Override
      public T get() {
        switch (id) {
          case 0: // com.notifetch.app.worker.SyncWorker_AssistedFactory 
          return (T) new SyncWorker_AssistedFactory() {
            @Override
            public SyncWorker create(Context appContext, WorkerParameters workerParams) {
              return new SyncWorker(appContext, workerParams, singletonCImpl.notificationRepositoryProvider.get());
            }
          };

          case 1: // com.notifetch.app.data.repository.NotificationRepository 
          return (T) new NotificationRepository(singletonCImpl.notificationDao(), singletonCImpl.platformConfigDao(), singletonCImpl.provideNotiFetchApiProvider.get(), singletonCImpl.authRepositoryProvider.get());

          case 2: // com.notifetch.app.data.local.NotiFetchDatabase 
          return (T) DatabaseModule_ProvideDatabaseFactory.provideDatabase(ApplicationContextModule_ProvideContextFactory.provideContext(singletonCImpl.applicationContextModule));

          case 3: // com.notifetch.app.data.remote.NotiFetchApi 
          return (T) NetworkModule_ProvideNotiFetchApiFactory.provideNotiFetchApi(singletonCImpl.provideRetrofitProvider.get());

          case 4: // retrofit2.Retrofit 
          return (T) NetworkModule_ProvideRetrofitFactory.provideRetrofit(singletonCImpl.provideOkHttpClientProvider.get(), singletonCImpl.provideMoshiProvider.get());

          case 5: // okhttp3.OkHttpClient 
          return (T) NetworkModule_ProvideOkHttpClientFactory.provideOkHttpClient();

          case 6: // com.squareup.moshi.Moshi 
          return (T) NetworkModule_ProvideMoshiFactory.provideMoshi();

          case 7: // com.notifetch.app.data.repository.AuthRepository 
          return (T) new AuthRepository(ApplicationContextModule_ProvideContextFactory.provideContext(singletonCImpl.applicationContextModule), singletonCImpl.provideFirebaseAuthProvider.get());

          case 8: // com.google.firebase.auth.FirebaseAuth 
          return (T) FirebaseModule_ProvideFirebaseAuthFactory.provideFirebaseAuth();

          case 9: // com.google.android.gms.auth.api.signin.GoogleSignInClient 
          return (T) FirebaseModule_ProvideGoogleSignInClientFactory.provideGoogleSignInClient(ApplicationContextModule_ProvideContextFactory.provideContext(singletonCImpl.applicationContextModule));

          default: throw new AssertionError(id);
        }
      }
    }
  }
}
