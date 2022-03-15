import { jest, expect, describe, test, beforeEach } from "@jest/globals";

import { Controller } from "../../../server/controller.js";

import { Service } from "../../../server/service.js";
import TestUtil from "../_util/testUtil.js";

describe("#Controller - test suite for controller", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test("Chama a função getFileStream da service", async() => {
        const mockFileStream = TestUtil.generateReadableStream([""]);
        jest
            .spyOn(Service.prototype, Service.prototype.getFileStream.name)
            .mockReturnValue(mockFileStream);

        const controller = new Controller();
        controller.getFileStream("");
        expect(Service.prototype.getFileStream).toBeCalled();
    });
});