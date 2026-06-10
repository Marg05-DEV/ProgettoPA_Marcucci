import { Request, Response, NextFunction } from "express";
import { checkEmail, checkPassword, checkUsername } from "../src/middleware/AuthMiddleware";
import { ErrorFactory } from "../src/status/StatusFactory";
import { AppErrorNames } from "../src/enums/responseStatus/AppStatusNames";

// Mock di ErrorFactory per controllare gli errori restituiti
jest.mock("../src/status/StatusFactory", () => ({
  ErrorFactory: {
    getStatus: jest.fn((name) => new Error(name)),
  },
}));

// Utility per creare oggetti mock di req, res, next
const mockReq = (body: object): Request => ({ body } as Request);
const mockRes = (): Response => ({} as Response);
const mockNext = (): NextFunction => jest.fn();

// ───────────────────────────────────────────────
// checkEmail
// ───────────────────────────────────────────────
describe("checkEmail", () => {
  afterEach(() => jest.clearAllMocks());

  test("chiama next() senza errori con una email valida", () => {
    const req = mockReq({ email: "mario@example.com" });
    const next = mockNext();

    checkEmail(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith(); // next() senza argomenti = successo
    expect(ErrorFactory.getStatus).not.toHaveBeenCalled();
  });

  test("chiama next(errore) se l'email è assente", () => {
    const req = mockReq({});
    const next = mockNext();

    checkEmail(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_EMAIL);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se l'email non contiene '@'", () => {
    const req = mockReq({ email: "mario-example.com" });
    const next = mockNext();

    checkEmail(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_EMAIL);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se l'email non è una stringa", () => {
    const req = mockReq({ email: 12345 });
    const next = mockNext();

    checkEmail(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_EMAIL);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("accetta email con spazi iniziali/finali (trim)", () => {
    const req = mockReq({ email: "  mario@example.com  " });
    const next = mockNext();

    checkEmail(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith();
  });
});

// ───────────────────────────────────────────────
// checkPassword
// ───────────────────────────────────────────────
describe("checkPassword", () => {
  afterEach(() => jest.clearAllMocks());

  test("chiama next() senza errori con una password valida", () => {
    const req = mockReq({ password: "Sicura!99" });
    const next = mockNext();

    checkPassword(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(ErrorFactory.getStatus).not.toHaveBeenCalled();
  });

  test("chiama next(errore) se la password è assente", () => {
    const req = mockReq({});
    const next = mockNext();

    checkPassword(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_PASSWORD);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se la password è troppo corta (< 8 caratteri)", () => {
    const req = mockReq({ password: "Ab1!" });
    const next = mockNext();

    checkPassword(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_PASSWORD);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se la password non ha caratteri speciali", () => {
    const req = mockReq({ password: "SenzaSpeciali99" });
    const next = mockNext();

    checkPassword(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_PASSWORD);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se la password non è una stringa", () => {
    const req = mockReq({ password: 99999999 });
    const next = mockNext();

    checkPassword(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_PASSWORD);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

// ───────────────────────────────────────────────
// checkUsername
// ───────────────────────────────────────────────
describe("checkUsername", () => {
  afterEach(() => jest.clearAllMocks());

  test("chiama next() senza errori con uno username valido", () => {
    const req = mockReq({ username: "mario_99" });
    const next = mockNext();

    checkUsername(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(ErrorFactory.getStatus).not.toHaveBeenCalled();
  });

  test("chiama next(errore) se lo username è assente", () => {
    const req = mockReq({});
    const next = mockNext();

    checkUsername(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_USERNAME);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se lo username è troppo corto (< 3 caratteri)", () => {
    const req = mockReq({ username: "ab" });
    const next = mockNext();

    checkUsername(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_USERNAME);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se lo username supera 20 caratteri", () => {
    const req = mockReq({ username: "questo_username_e_troppo_lungo" });
    const next = mockNext();

    checkUsername(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_USERNAME);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se lo username contiene caratteri non permessi", () => {
    const req = mockReq({ username: "mario@99" });
    const next = mockNext();

    checkUsername(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_USERNAME);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});