import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MainModule } from "./main.module";
import { testCases } from "./test-cases";

describe("API main (@nestjs/testing)", () => {
  describe("Lifecycle", () => {
    let app: INestApplication;

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [MainModule],
      }).compile();

      app = moduleRef.createNestApplication();
      app = await app.init();
    });

    afterEach(async () => {
      await app.close();
    });

    const probeReadiness = () => request(app.getHttpServer()).get("/health").send();

    testCases(probeReadiness, () => app.close());
  });
});
