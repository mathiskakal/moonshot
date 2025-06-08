import path from 'path';
import {app} from 'electron';
import { isDev } from './mainUtils.js';
import { FILE_PATHS } from '../config/constants.js';

export function getPreloadPath(): string {
    return path.join(
        app.getAppPath(),
        isDev() ? '.' : '..',
        FILE_PATHS.PRELOAD_PATH
    )
}

export function getUIPath(): string {
   return path.join(app.getAppPath(), FILE_PATHS.UI_PATH)
}