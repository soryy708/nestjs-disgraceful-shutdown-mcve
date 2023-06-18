import { INestApplication } from "@nestjs/common";
import request from "supertest";

export function testCases(appGetter: () => INestApplication): void {
  const probeReadiness = () =>
    request(appGetter().getHttpServer()).get("/health").send();

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
          const closePromise = appGetter().close();
          const [response] = await Promise.all([
            responsePromise,
            closePromise,
          ]);
          expect(response.statusCode).toBe(200);
        });
      });

      describe("When a new request is made", () => {
        it("Should respond with 503 Service Unavailable", async () => {
          await appGetter().close();
          const response = await probeReadiness();
          expect(response.statusCode).toBe(503);
        });
      });
    });
  });
}
