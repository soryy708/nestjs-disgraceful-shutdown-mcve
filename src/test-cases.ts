export function testCases(
  probeReadiness: () => Promise<{statusCode: number}>,
  closeApp: () => Promise<void>
): void {
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
          const closePromise = closeApp();
          const [response] = await Promise.all([
            responsePromise,
            closePromise,
          ]);
          expect(response.statusCode).toBe(200);
        });
      });

      describe("When a new request is made", () => {
        it("Should respond with 503 Service Unavailable", async () => {
          await closeApp();
          const response = await probeReadiness();
          expect(response.statusCode).toBe(503);
        });
      });
    });
  });
}
