import * as fs from "fs";
import * as path from "path";
import { SpinelClient } from "../Client";
import { Listener } from "../classes/Listener";
import { EventEmitter } from "events";
const ALLOWED_EXTENSIONS = [".ts", ".js"];

export class ListenerHandler {
  public client: SpinelClient;
  public directory: string;
  public listeners: Listener<any>[] = [];

  public constructor(client: SpinelClient, options: ListenerHandlerOptions) {
    this.client = client;
    this.directory = options.directory;
    this.setup();
  }

  private async getListeners(directory: string): Promise<Listener<any>[]> {
    const listenerFolderNames = this.getListenerFolderNames(directory);

    for (const folder of listenerFolderNames) {
      await this.processListenerFolder(directory, folder);
    }

    return this.listeners;
  }

  private getListenerFolderNames(directory: string): string[] {
    return fs
      .readdirSync(directory)
      .filter((file) => ALLOWED_EXTENSIONS.some((ext) => file.endsWith(ext)));
  }

  private async processListenerFolder(
    directory: string,
    folder: string
  ): Promise<void> {
    const listenersPath = path.join(directory, folder);
    const listenerFiles = fs.readdirSync(listenersPath);

    for (const file of listenerFiles) {
      await this.processListenerFile(listenersPath, file);
    }
  }

  private async processListenerFile(
    listenersPath: string,
    file: string
  ): Promise<void> {
    const filePath = path.join(listenersPath, file);
    const { default: listenerExport } = await import(filePath);

    if (!(listenerExport instanceof Listener)) {
      console.warn(`[WARNING] >> Invalid export in ${filePath}`);
      return;
    }

    this.listeners.push(listenerExport);

    let emitter: EventEmitter;
    if (typeof listenerExport.emitter === "string") {
      emitter = (this.client as any)[listenerExport.emitter];
    } else {
      emitter = listenerExport.emitter;
    }

    if (!emitter) {
      console.warn(`[WARNING] >> Invalid emitter in ${filePath}`);
      return;
    }

    const listenerType = listenerExport.once ? "once" : "on";
    emitter[listenerType](
      listenerExport.event,
      listenerExport.run.bind(listenerExport)
    );
  }

  protected setup() {
    this.getListeners(this.directory);
  }
}

export type ListenerHandlerOptions = {
  directory: string;
};
