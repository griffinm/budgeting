import { usePathname } from '@budgeting/ui/hooks';
// ----------------------------------------------------------------------

export function useActiveLink(itemPath: string, deep: boolean = true): boolean {
  const pathname = removeLastSlash(usePathname());

  const pathHasParams = hasParams(itemPath);

  /* Start check */
  const notValid = itemPath.startsWith('#') || isExternalLink(itemPath);

  if (notValid) {
    return false;
  }
  /* End check */

  /**
   * [1] Apply for Item has children or has params.
   */
  const isDeep = deep || pathHasParams;

  // console.info(isDeep ? '[deep]   :' : '[normal] :', itemPath, '-?-', pathname);

  if (isDeep) {
    /**
     * [1] Deep: default
     * @itemPath 			 = '/dashboard/user'
     * @match pathname = '/dashboard/user'
     * @match pathname = '/dashboard/user/list'
     * @match pathname = '/dashboard/user/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b15/edit'
     */
    const defaultActive = pathname.includes(itemPath);

    /**
     * [1] Deep: has params
     * @itemPath 			 = '/dashboard/test?id=e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1'
     * @match pathname = '/dashboard/test'
     */

    const originItemPath = removeParams(itemPath);

    const hasParamsActive = pathHasParams && originItemPath === pathname;

    return defaultActive || hasParamsActive;
  }

  /**
   * [1] Normal: active
   * @itemPath 			 = '/dashboard/calendar'
   * @match pathname = '/dashboard/calendar'
   */
  return pathname === itemPath;
}

// ----------------------------------------------------------------------

export const hasParams = (url: string): boolean => {
  const queryString = url.split('?')[1];
  return queryString ? new URLSearchParams(queryString).toString().length > 0 : false;
};

// ----------------------------------------------------------------------

export function removeLastSlash(pathname: string): string {
  /**
   * Remove last slash
   * [1]
   * @input  = '/dashboard/calendar/'
   * @output = '/dashboard/calendar'
   * [2]
   * @input  = '/dashboard/calendar'
   * @output = '/dashboard/calendar'
   */
  if (pathname !== '/' && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

// ----------------------------------------------------------------------

export function removeParams(url: string): string {
  try {
    const urlObj = new URL(url, window.location.origin);

    return removeLastSlash(urlObj.pathname);
  } catch (error) {
    return url;
  }
}

// ----------------------------------------------------------------------

export function isExternalLink(url: string): boolean {
  return url.startsWith('http');
}
