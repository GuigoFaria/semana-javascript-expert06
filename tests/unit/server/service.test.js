import { jest, expect, describe, test, beforeEach } from "@jest/globals";
import config from "../../../server/config.js";
import { join, extname } from "path";
import fs from "fs";
import fsPromises from "fs/promises";

import { Service } from "../../../server/service.js";
import TestUtil from "../_util/testUtil.js";

describe("#Controller - test suite for controller", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test("getFileStream deve retornar um objeto com um stream e um tipo", async() => {
        const file = config.pages.homeHTML;
        const type = ".html";
        const fullFilePath = join(config.dir.publicDirectory, file);
        const stream = TestUtil.generateReadableStream([""]);
        const service = new Service();
        jest
            .spyOn(Service.prototype, Service.prototype.getFileInfo.name)
            .mockResolvedValue({
                type,
                name: fullFilePath,
            });
        jest
            .spyOn(Service.prototype, Service.prototype.createFileStream.name)
            .mockReturnValue(stream);

        const result = await service.getFileStream(file);
        expect(Service.prototype.getFileInfo).toBeCalled();
        expect(Service.prototype.createFileStream).toBeCalled();
        expect(result).toEqual({ stream, type });
    });
    test("createFileStream deve retornar uma stream", () => {
        const service = new Service();
        const stream = TestUtil.generateReadableStream(["index.html"]);
        jest.spyOn(fs, fs.createReadStream.name).mockReturnValue(stream);
        const result = service.createFileStream("index.html");

        expect(fs.createReadStream).toBeCalledWith("index.html");
        expect(result).toEqual(stream);
    });
    test.todo(
        "getFileInfo deve retornar erro quando o arquivo não existe"
        // async() => {
        //     const file = "/index.png";

        //     const service = new Service();
        //     // jest
        //     //     .spyOn(fsPromises, fsPromises.access.name)
        //     //     .mockRejectedValue(new Error("Error: ENOENT: no such file"));

        //     await service.getFileInfo(file);

        //     expect(service.getFileInfo).toBe();
        // }
    );
    test("getFileInfo deve retornar o tipo e o nome do arquivo que virará stream", async() => {
        const file = config.pages.homeHTML;
        const fullFilePath = join(config.dir.publicDirectory, file);

        const service = new Service();
        jest.spyOn(fsPromises, fsPromises.access.name).mockResolvedValue();

        const result = await service.getFileInfo(file);

        expect(fsPromises.access).toHaveBeenCalledWith(fullFilePath);
        expect(result).toEqual({ type: ".html", name: fullFilePath });
    });
});