import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { MainController } from "./main.controller";

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [MainController],
})
export class MainModule {}
