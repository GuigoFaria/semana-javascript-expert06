import fs from "fs";
import { join, extname } from "path";
import config from "./config.js";
import fsPromises from "fs/promises";

export class Service {
    createFileStream(filename) {
        return fs.createReadStream(filename);
    }
    async getFileInfo(file) {
        const fullFilePath = join(config.dir.publicDirectory, file);
        await fsPromises.access(fullFilePath);
        const filetype = extname(fullFilePath);

        return {
            type: filetype,
            name: fullFilePath,
        };
    }

    async getFileStream(file) {
        const { name, type } = await this.getFileInfo(file);
        return { stream: this.createFileStream(name), type };
    }
}