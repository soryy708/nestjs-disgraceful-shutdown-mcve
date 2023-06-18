import { INestApplication, ShutdownSignal } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MainModule } from "./main.module";

describe("API main (@nestjs/testing)", () => {
  describe("Lifecycle", () => {
    let app: INestApplication;

    const probeReadiness = () =>
      request(app.getHttpServer()).get("/health").send();

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [MainModule],
      }).compile();

      app = moduleRef.createNestApplication();
      app.enableShutdownHooks([ShutdownSignal.SIGTERM]);
      app = await app.init();
    });

    afterEach(async () => {
      await app.close();
    });

    describe("When bootstrapped", () => {
      describe("When running", () => {
        it("Should respond successfully", async () => {
          const response = await probeReadiness();
          expect(response.statusCode).toBe(200);
        });
      });

      describe("When shutting down", () => {
        describe("When a request is already in progress", () => {
          it("Should respond successfully", async () => {
            const responsePromise = probeReadiness();
            const closePromise = app.close();
            const [response] = await Promise.all([
              responsePromise,
              closePromise,
            ]);
            expect(response.statusCode).toBe(200);
          });
        });

        describe("When a new request is made", () => {
          it("Should respond with 503 Service Unavailable", async () => {
            await app.close();
            const response = await probeReadiness();
            expect(response.statusCode).toBe(503);
          });
        });
      });
    });
  });
});
