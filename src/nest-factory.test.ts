import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import request from "supertest";
import { MainModule } from "./main.module";
import { testCases } from "./test-cases";

describe("API main (NestFactory)", () => {
  describe("Lifecycle", () => {
    let app: INestApplication;

    beforeEach(async () => {
      app = await NestFactory.create(MainModule);
      await app.listen(0);
    });

    afterEach(async () => {
      await app.close();
    });

    const probeReadiness = () => request(app.getHttpServer()).get("/health").send();

    testCases(probeReadiness, () => app.close());
  });
});
