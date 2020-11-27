import { StrictTypes, Uppy } from '@uppy/core';
import Dashboard, { DashboardOptions } from '@uppy/dashboard';
import Tus, { TusOptions } from '@uppy/tus';
import Webcam, { WebcamOptions } from '@uppy/webcam';
import ScreenCapture, { ScreenCaptureOptions } from '@uppy/screen-capture';
import ImageEditor, { ImageEditorOptions } from '@uppy/image-editor';
import Url, { UrlOptions } from '@uppy/url';

export type StrictUppy = Uppy<StrictTypes>;

export function createUppy(id: string, target: HTMLDivElement): StrictUppy {
    const uppyId = `${id}-uppy`;
    const dashboardId = `${uppyId}-Dashboard`;
    const tusId = `${uppyId}-Tus`;

    const uppy = new Uppy<StrictTypes>({
        id: uppyId,
        autoProceed: false,
        allowMultipleUploads: false,
        debug: true,
    });
    uppy.use<DashboardOptions, Dashboard>(Dashboard, {
        id: dashboardId,
        target,
        inline: false,
        closeModalOnClickOutside: true,
        closeAfterFinish: true,
        fileManagerSelectionType: 'files',
        theme: 'auto',
        trigger: `#${id}-toolbar-item-Image`,
        showProgressDetails: true,
    });
    uppy.use<TusOptions, Tus>(Tus, {
        id: tusId,
        resume: true,
        removeFingerprintOnSuccess: true,
        endpoint: 'https://localhost:1080/files',
        limit: 10,
    } as TusOptions);
    // eslint-disable-next-line
    uppy.use<WebcamOptions, Webcam>(Webcam, {
        target: Dashboard,
    } as WebcamOptions);
    uppy.use<ScreenCaptureOptions, ScreenCapture>(ScreenCapture, {
        target: Dashboard,
    } as ScreenCaptureOptions);
    uppy.use<ImageEditorOptions, ImageEditor>(ImageEditor, {
        target: Dashboard,
        quality: 0.8,
    } as ImageEditorOptions);
    uppy.use<UrlOptions, Url>(Url, {
        target: Dashboard,
        companionUrl: 'http://localhost:3020',
    } as UrlOptions);
    return uppy;
}