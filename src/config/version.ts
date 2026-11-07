/**
 * Platform Version & Storage Configuration
 *
 * When PLATFORM_VERSION is updated, any browser loading the application with an older
 * (or missing) version will immediately and completely wipe the siteStore and related
 * persisted state, resetting the entire platform to a factory-new state.
 */

declare const __APP_VERSION__: string | undefined;

export const PLATFORM_VERSION =
  typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '2.1.2';
export const PLATFORM_VERSION_STORAGE_KEY = 'billionbiz_platform_version';
export const PLATFORM_RESET_EVENT = 'billionbiz_platform_reset';

export interface VersionCheckResult {
  isNewVersion: boolean;
  previousVersion: string | null;
  currentVersion: string;
}

/**
 * Checks whether the browser is running this platform version for the first time.
 * If a version change is detected (or first load), all legacy store keys are purged from
 * localStorage, and the new version is recorded.
 */
export const checkAndHandleVersionUpgrade = (): VersionCheckResult => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { isNewVersion: false, previousVersion: null, currentVersion: PLATFORM_VERSION };
  }

  try {
    const storedVersion = localStorage.getItem(PLATFORM_VERSION_STORAGE_KEY);
    const isNewVersion = storedVersion !== PLATFORM_VERSION;

    if (isNewVersion) {
      console.info(
        `%c[BillionBiz Platform]%c Upgrading from ${storedVersion || 'initial/legacy'} to v${PLATFORM_VERSION}. Resetting siteStore to factory new.`,
        'background: #ff6b00; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
        'color: inherit;'
      );

      // Clean all legacy platform keys from localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.startsWith('billionbiz-') ||
            key.startsWith('billionbiz_') ||
            key.includes('siteStore') ||
            key.includes('editorContext'))
        ) {
          // Do not delete the version key itself here, we'll set it right after
          if (key !== PLATFORM_VERSION_STORAGE_KEY) {
            keysToRemove.push(key);
          }
        }
      }

      keysToRemove.forEach((k) => localStorage.removeItem(k));

      // Record the new version and a one-time welcome/reset notice flag in sessionStorage
      localStorage.setItem(PLATFORM_VERSION_STORAGE_KEY, PLATFORM_VERSION);
      sessionStorage.setItem('billionbiz_version_just_upgraded', 'true');

      // Dispatch reset event so all listeners immediately refresh to factory defaults
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          try {
            (window as any).__resetEntirePlatformStore?.();
            window.dispatchEvent(
              new CustomEvent(PLATFORM_RESET_EVENT, { detail: { version: PLATFORM_VERSION, isUpgrade: true } })
            );
          } catch (e) {
            console.warn('[BillionBiz Platform] Error dispatching upgrade reset:', e);
          }
        }, 0);
      }

      return {
        isNewVersion: true,
        previousVersion: storedVersion,
        currentVersion: PLATFORM_VERSION,
      };
    }

    return {
      isNewVersion: false,
      previousVersion: storedVersion,
      currentVersion: PLATFORM_VERSION,
    };
  } catch (error) {
    console.error('[BillionBiz Platform] Error checking version upgrade:', error);
    return { isNewVersion: false, previousVersion: null, currentVersion: PLATFORM_VERSION };
  }
};
