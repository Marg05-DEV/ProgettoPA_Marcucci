import { Request, Response, NextFunction } from "express";
import {
  checkAdmin,
  checkAmount,
  checkUpdateId,
  checkStatus,
  checkIsAdminField,
} from "../src/middleware/AdminMiddleware";
import { ErrorFactory } from "../src/status/StatusFactory";
import { AppErrorNames } from "../src/enums/responseStatus/AppStatusNames";
import { updateStatus } from "../src/enums/UpdateEdgeStatus";

// Mock di ErrorFactory
jest.mock("../src/status/StatusFactory", () => ({
  ErrorFactory: {
    getStatus: jest.fn((name) => new Error(name)),
  },
}));

// Mock di decodeJwt: viene importata e usata internamente da checkAdmin
jest.mock("../src/middleware/UserMiddleware", () => ({
  checkJwt: jest.fn(),
  decodeJwt: jest.fn(),
}));

// Import del mock DOPO il jest.mock() per poterne controllare il comportamento
import { decodeJwt } from "../src/middleware/UserMiddleware";
const mockDecodeJwt = decodeJwt as jest.MockedFunction<typeof decodeJwt>;

// Utility
const mockReq = (body: object = {}, headers: object = {}): Request =>
  ({ body, headers } as unknown as Request);
const mockRes = (): Response => ({} as Response);
const mockNext = (): NextFunction => jest.fn();

// ───────────────────────────────────────────────
// checkAdmin
// ───────────────────────────────────────────────
describe("checkAdmin", () => {
  afterEach(() => jest.clearAllMocks());

  test("chiama next() se il payload JWT contiene isAdmin: true", () => {
    mockDecodeJwt.mockReturnValue({ userId: 1, email: "admin@example.com", isAdmin: true });
    const next = mockNext();

    checkAdmin(mockReq(), mockRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(ErrorFactory.getStatus).not.toHaveBeenCalled();
  });

  test("chiama next(errore) se isAdmin è false", () => {
    mockDecodeJwt.mockReturnValue({ userId: 1, email: "mario@example.com", isAdmin: false });
    const next = mockNext();

    checkAdmin(mockReq(), mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.NOT_ADMIN);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(err) se decodeJwt lancia un'eccezione", () => {
    const fakeError = new Error("JWT non valido");
    mockDecodeJwt.mockImplementation(() => { throw fakeError; });
    const next = mockNext();

    checkAdmin(mockReq(), mockRes(), next);

    expect(next).toHaveBeenCalledWith(fakeError);
  });
});

// ───────────────────────────────────────────────
// checkAmount
// ───────────────────────────────────────────────
describe("checkAmount", () => {
  afterEach(() => jest.clearAllMocks());

  test("chiama next() con una quantità intera positiva valida", () => {
    const req = mockReq({ qtyToken: 10 });
    const next = mockNext();

    checkAmount(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(ErrorFactory.getStatus).not.toHaveBeenCalled();
  });

  test("chiama next(errore) se qtyToken è assente", () => {
    const req = mockReq({});
    const next = mockNext();

    checkAmount(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_TOKEN_AMOUNT);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se qtyToken è zero", () => {
    const req = mockReq({ qtyToken: 0 });
    const next = mockNext();

    checkAmount(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_TOKEN_AMOUNT);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se qtyToken è negativo", () => {
    const req = mockReq({ qtyToken: -5 });
    const next = mockNext();

    checkAmount(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_TOKEN_AMOUNT);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se qtyToken è un numero decimale", () => {
    const req = mockReq({ qtyToken: 3.5 });
    const next = mockNext();

    checkAmount(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_TOKEN_AMOUNT);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se qtyToken è una stringa", () => {
    const req = mockReq({ qtyToken: "10" });
    const next = mockNext();

    checkAmount(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_TOKEN_AMOUNT);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

// ───────────────────────────────────────────────
// checkUpdateId
// ───────────────────────────────────────────────
describe("checkUpdateId", () => {
  afterEach(() => jest.clearAllMocks());

  test("chiama next() con un updateId intero positivo valido", () => {
    const req = mockReq({ updateId: 5 });
    const next = mockNext();

    checkUpdateId(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(ErrorFactory.getStatus).not.toHaveBeenCalled();
  });

  test("chiama next(errore) se updateId è assente", () => {
    const req = mockReq({});
    const next = mockNext();

    checkUpdateId(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_ID);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se updateId è zero", () => {
    const req = mockReq({ updateId: 0 });
    const next = mockNext();

    checkUpdateId(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_ID);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se updateId è negativo", () => {
    const req = mockReq({ updateId: -1 });
    const next = mockNext();

    checkUpdateId(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_ID);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

// ───────────────────────────────────────────────
// checkStatus
// ───────────────────────────────────────────────
describe("checkStatus", () => {
  afterEach(() => jest.clearAllMocks());

  test("chiama next() con status APPROVED", () => {
    const req = mockReq({ status: updateStatus.APPROVED });
    const next = mockNext();

    checkStatus(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(ErrorFactory.getStatus).not.toHaveBeenCalled();
  });

  test("chiama next() con status REJECTED", () => {
    const req = mockReq({ status: updateStatus.REJECTED });
    const next = mockNext();

    checkStatus(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(ErrorFactory.getStatus).not.toHaveBeenCalled();
  });

  test("chiama next(errore) se status è assente", () => {
    const req = mockReq({});
    const next = mockNext();

    checkStatus(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_STATUS);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se status è un valore non riconosciuto", () => {
    const req = mockReq({ status: "PENDING" });
    const next = mockNext();

    checkStatus(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_STATUS);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se status non è una stringa", () => {
    const req = mockReq({ status: 1 });
    const next = mockNext();

    checkStatus(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_STATUS);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

// ───────────────────────────────────────────────
// checkIsAdminField
// ───────────────────────────────────────────────
describe("checkIsAdminField", () => {
  afterEach(() => jest.clearAllMocks());

  test("chiama next() con isAdmin: true", () => {
    const req = mockReq({ isAdmin: true });
    const next = mockNext();

    checkIsAdminField(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(ErrorFactory.getStatus).not.toHaveBeenCalled();
  });

  test("chiama next() con isAdmin: false", () => {
    const req = mockReq({ isAdmin: false });
    const next = mockNext();

    checkIsAdminField(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(ErrorFactory.getStatus).not.toHaveBeenCalled();
  });

  test("chiama next(errore) se isAdmin è assente (undefined)", () => {
    const req = mockReq({});
    const next = mockNext();

    checkIsAdminField(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_ROLE);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("chiama next(errore) se isAdmin è una stringa 'true'", () => {
    const req = mockReq({ isAdmin: "true" });
    const next = mockNext();

    checkIsAdminField(req, mockRes(), next);

    expect(ErrorFactory.getStatus).toHaveBeenCalledWith(AppErrorNames.INVALID_ROLE);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});