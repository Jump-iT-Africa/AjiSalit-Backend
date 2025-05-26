import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { QuizzService } from "./quizz.service";
import { AdminRoleGuard } from "../user/guards/admin-role.guard";

@Controller("quizz")
export class QuizzController {
  constructor(private readonly quizzService: QuizzService) {}
  @Post()
  @UseGuards(AdminRoleGuard)
  async createQuizz(@Req() req) {
    try {
        let result = await this.quizzService.createQuizz()
    } catch (e) {

    }
  }

  async updateQuizz() {
    try {
    } catch (e) {

    }
  }

  async findOne() {
    try{

    }catch(e){

    }
  }
}
