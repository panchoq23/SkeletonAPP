import { Injectable } from "@angular/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

@Injectable({
  providedIn: "root"
})
export class CameraService {
  constructor() {}

  async takePhoto(): Promise<string | undefined> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      return image.webPath;
    } catch (error) {
      console.error("Error al tomar foto", error);
      return undefined;
    }
  }
}
