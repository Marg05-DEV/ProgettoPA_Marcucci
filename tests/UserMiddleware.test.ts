import { Request, Response, NextFunction } from "express";
import { checkJwt, checkOwnerOrAdmin, decodeJwt } from "../src/middleware/UserMiddleware";
import { ErrorFactory } from "../src/status/StatusFactory";
import { AppErrorNames } from "../src/enums/responseStatus/AppStatusNames";

// Mock di ErrorFactory
jest.mock("../src/status/StatusFactory", () => ({
  ErrorFactory: {
    getStatus: jest.fn((name) => new Error(name)),
  },
}));

// Mock di UserDAO per evitare connessioni al DB
jest.mock("../src/dao/UserDAO", () => ({
  UserDAO: jest.fn().mockImplementation(() => ({
    read: jest.fn(),
  })),
}));

// Mock di fs per evitare letture di file reali
jest.mock("fs", () => ({
  readFileSync: jest.fn(() => "fake-public-key"),
}));

// Mock di jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

import jwt from "jsonwebtoken";
import { UserDAO } from "../src/dao/UserDAO";

const mockJwtVerify = jwt.verify as jest.MockedFunction<typeof jwt.verify>;
const MockedUserDAO = UserDAO as jest.MockedClass<typeof UserDAO>;

// Utility: costruisce un req con header Authorization
const mockReqWithToken = (token?: string, params: object = {}, body: object = {}): Request =>
  ({
    headers: { authorization: token },
    params,
    body,
  } as unknown as Request);

const mockRes = (): Response => ({} as Response);
const mockNext = (): NextFunction => jest.fn();

// Payload JWT di esempio
const fakePayload = { userId: 42, isAdmin: false };
const fakeAdminPayload = { userId: 1, isAdmin: true };
const validToken = "Bearer valid.jwt.token";

// ───────────────────────────────────────────────
// decodeJwt
// ───────────────────────────────────────────────
describe("decodeJwt", () => {
  afterEach(() => jest.clearAllMocks());

  test("restituisce il payload se il token è valido", () => {
    mockJwtVerify.mockReturnValue(fakePayload as any);
    const req = mockReqWithToken(validToken);

    const result = decodeJwt(req);

    expect(result).toEqual(fakePayload);
    expect(mockJwtVerify).toHaveBeenCalledTimes(1);
  });

  test("lancia un errore se l'header Authorization è assente", () => {
    const req = mockReqWithToken(undefined);

    expect(() => decodeJwt(req)).toThrow();
    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.JWT_NOT_PROVIDED);
  });

  test("lancia un errore se il formato non è 'Bearer <token>'", () => {
    // Token senza la parte "Bearer"
    const req = mockReqWithToken("solo-token-senza-bearer");

    expect(() => decodeJwt(req)).toThrow();
    // Il controllo del formato scatena INVALID_JWT
    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(
      expect.stringMatching(/INVALID_JWT|JWT/)
    );
  });

  test("lancia un errore se jwt.verify fallisce", () => {
    mockJwtVerify.mockImplementation(() => { throw new Error("Firma non valida"); });
    const req = mockReqWithToken(validToken);

    expect(() => decodeJwt(req)).toThrow();
    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_JWT);
  });
});

// ───────────────────────────────────────────────
// checkJwt
// ───────────────────────────────────────────────
describe("checkJwt", () => {
  afterEach(() => jest.clearAllMocks());

  test("chiama next() se il token è valido e l'utente ha token sufficienti", async () => {
    mockJwtVerify.mockReturnValue(fakePayload as any);

    // Simula un utente con token sufficienti
    const mockRead = jest.fn().mockResolvedValue({
      get: jest.fn((field: string) => (field === "qtyToken" ? 5 : null)),
    });
    MockedUserDAO.mockImplementation(() => ({ read: mockRead } as any));

    const req = mockReqWithToken(validToken);
    const next = mockNext();

    await checkJwt(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(ErrorFactory.getStatus).not.toHaveBeenCalled();
  });

  test("chiama next(errore) se l'header Authorization è assente", async () => {
    const req = mockReqWithToken(undefined);
    const next = mockNext();

    await checkJwt(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.JWT_NOT_PROVIDED);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se l'utente non esiste nel DB", async () => {
    mockJwtVerify.mockReturnValue(fakePayload as any);

    // Simula utente non trovato
    const mockRead = jest.fn().mockResolvedValue(null);
    MockedUserDAO.mockImplementation(() => ({ read: mockRead } as any));

    const req = mockReqWithToken(validToken);
    const next = mockNext();

    await checkJwt(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.TOKENS_FINISHED);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se l'utente ha qtyToken <= 0", async () => {
    mockJwtVerify.mockReturnValue(fakePayload as any);

    // Simula utente con token esauriti
    const mockRead = jest.fn().mockResolvedValue({
      get: jest.fn((field: string) => (field === "qtyToken" ? 0 : null)),
    });
    MockedUserDAO.mockImplementation(() => ({ read: mockRead } as any));

    const req = mockReqWithToken(validToken);
    const next = mockNext();

    await checkJwt(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.TOKENS_FINISHED);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

// ───────────────────────────────────────────────
// checkOwnerOrAdmin
// ───────────────────────────────────────────────
describe("checkOwnerOrAdmin", () => {
  afterEach(() => jest.clearAllMocks());

  test("chiama next() se l'utente è il proprietario della risorsa", () => {
    mockJwtVerify.mockReturnValue({ userId: 7, isAdmin: false } as any);

    // params.id corrisponde all'userId nel token
    const req = mockReqWithToken(validToken, { id: "7" });
    const next = mockNext();

    checkOwnerOrAdmin(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(ErrorFactory.getStatus).not.toHaveBeenCalled();
  });

  test("chiama next() se l'utente è admin (anche se non è proprietario)", () => {
    mockJwtVerify.mockReturnValue(fakeAdminPayload as any);

    // params.id diverso dall'userId, ma l'utente è admin
    const req = mockReqWithToken(validToken, { id: "99" });
    const next = mockNext();

    checkOwnerOrAdmin(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(ErrorFactory.getStatus).not.toHaveBeenCalled();
  });

  test("chiama next(errore) se l'utente non è né proprietario né admin", () => {
    mockJwtVerify.mockReturnValue({ userId: 7, isAdmin: false } as any);

    // params.id diverso dall'userId e non è admin
    const req = mockReqWithToken(validToken, { id: "99" });
    const next = mockNext();

    checkOwnerOrAdmin(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.NOT_OWNER_OR_ADMIN);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se params.id non è un numero valido", () => {
    mockJwtVerify.mockReturnValue(fakePayload as any);

    const req = mockReqWithToken(validToken, { id: "abc" });
    const next = mockNext();

    checkOwnerOrAdmin(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_ID);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se params.id è <= 0", () => {
    mockJwtVerify.mockReturnValue(fakePayload as any);

    const req = mockReqWithToken(validToken, { id: "-1" });
    const next = mockNext();

    checkOwnerOrAdmin(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_ID);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});