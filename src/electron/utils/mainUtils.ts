import { WebFrameMain } from "electron";
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL } from 'url';
import { DEV_CONFIG } from '../config/constants.js';

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

export function validateEventFrame(frame: WebFrameMain): void {
    if (isDev() && new URL(frame.url).host === `${DEV_CONFIG.DEV_SERVER_HOST}:${DEV_CONFIG.DEV_SERVER_PORT}`) {
        return;
    }
    if (frame.url !== pathToFileURL(getUIPath()).toString()) {
        throw new Error('Malicious event');
    }
}