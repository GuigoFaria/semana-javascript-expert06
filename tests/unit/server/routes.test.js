import { jest, expect, describe, test, beforeEach } from "@jest/globals";
import config from "../../../server/config.js";
import { Controller } from "../../../server/controller.js";
import { handler } from "../../../server/routes.js";
import TestUtil from "../_util/testUtil.js";
describe("#Routes - test suite for api response", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test("GET / - Deve redirecionar para a homepage", async() => {
        const params = TestUtil.defaultHandleParams();
        params.request.method = "GET";
        params.request.url = "/";

        await handler(...params.values());
        expect(params.response.end).toHaveBeenCalled();
        expect(params.response.writeHead).toBeCalledWith(302, {
            Location: config.location.home,
        });
    });
    test("GET /home - Deve responder com index.html fileStream", async() => {
        const params = TestUtil.defaultHandleParams();
        params.request.method = "GET";
        params.request.url = "/home";
        const mockFileStream = TestUtil.generateReadableStream([""]);

        jest
            .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
            .mockResolvedValue({
                stream: mockFileStream,
            });

        jest.spyOn(mockFileStream, "pipe").mockReturnValue();

        await handler(...params.values());
        expect(Controller.prototype.getFileStream).toBeCalledWith(
            config.pages.homeHTML
        );
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    });
    test("GET /controller - Deve responder com index.html fileStream", async() => {
        const params = TestUtil.defaultHandleParams();
        params.request.method = "GET";
        params.request.url = "/controller";
        const mockFileStream = TestUtil.generateReadableStream([""]);

        jest
            .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
            .mockResolvedValue({
                stream: mockFileStream,
            });

        jest.spyOn(mockFileStream, "pipe").mockReturnValue();

        await handler(...params.values());
        expect(Controller.prototype.getFileStream).toBeCalledWith(
            config.pages.controllerHTML
        );
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    });

    test("GET /index.html - Deve responder com fileStream", async() => {
        const params = TestUtil.defaultHandleParams();
        params.request.method = "GET";
        params.request.url = "/index.html";
        const mockFileStream = TestUtil.generateReadableStream([""]);
        const expectedType = ".html";

        jest
            .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
            .mockResolvedValue({
                stream: mockFileStream,
                type: expectedType,
            });

        jest.spyOn(mockFileStream, "pipe").mockReturnValue();

        await handler(...params.values());
        expect(Controller.prototype.getFileStream).toBeCalledWith("/index.html");
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
        expect(params.response.writeHead).toHaveBeenCalledWith(200, {
            "Content-Type": config.constants.CONTENT_TYPE[expectedType],
        });
    });
    test("GET /file.ext - Deve responder com fileStream", async() => {
        const params = TestUtil.defaultHandleParams();
        params.request.method = "GET";
        params.request.url = "/file.ext";
        const mockFileStream = TestUtil.generateReadableStream([""]);
        const expectedType = ".ext";

        jest
            .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
            .mockResolvedValue({
                stream: mockFileStream,
                type: expectedType,
            });

        jest.spyOn(mockFileStream, "pipe").mockReturnValue();

        await handler(...params.values());
        expect(Controller.prototype.getFileStream).toBeCalledWith("/file.ext");
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
        expect(params.response.writeHead).not.toHaveBeenCalled();
    });
    test("POST /unknown - Deve responder com 404", async() => {
        const params = TestUtil.defaultHandleParams();
        params.request.method = "POST";
        params.request.url = "/unknown";

        await handler(...params.values());

        expect(params.response.writeHead).toHaveBeenCalledWith(404);
        expect(params.response.end).toHaveBeenCalled();
    });
    describe("exceptions", () => {
        test("Dado que não existe o arquivo deve retornar 404", async() => {
            const params = TestUtil.defaultHandleParams();
            params.request.method = "GET";
            params.request.url = "/index.png";

            jest
                .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
                .mockRejectedValue(new Error("Error: ENOENT: no such file"));
            await handler(...params.values());

            expect(params.response.writeHead).toHaveBeenCalledWith(404);
            expect(params.response.end).toHaveBeenCalled();
        });
        test("Dado que deu erro deve retornar 500", async() => {
            const params = TestUtil.defaultHandleParams();
            params.request.method = "GET";
            params.request.url = "/index.png";

            jest
                .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
                .mockRejectedValue(new Error("Error"));
            await handler(...params.values());

            expect(params.response.writeHead).toHaveBeenCalledWith(500);
            expect(params.response.end).toHaveBeenCalled();
        });
    });
});