import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MainModule } from "./main.module";
import { testCases } from "./test-cases";

describe("API main (no Supertest)", () => {
  describe("Lifecycle", () => {
    let app: INestApplication;
    let port: number;

    beforeEach(async () => {
      app = await NestFactory.create(MainModule);
      await app.listen(0);

      const server = app.getHttpServer();
      const address = server.address();
      port = address.port;
    });

    afterEach(async () => {
      await app.close();
    });

    const probeReadiness = async () => {
      const request = new Request(`http://localhost:${port}/health`, { method: 'GET' });
      const response = await fetch(request);
      return { statusCode: response.status };
    }

    testCases(probeReadiness, () => app.close());
  });
});
