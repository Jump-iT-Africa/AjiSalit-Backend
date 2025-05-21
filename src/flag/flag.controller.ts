import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FlagService } from "./flag.service";
import { AdminRoleGuard } from "../user/guards/admin-role.guard";
import { CreateFlagDtos } from "./dtos/create-flag.dto";
import { UpdateFlagDto } from "./dtos/update-flag.dto";
import { FlagInterceptor } from "./interceptors/flag.interceptor";
import { useContainer } from "class-validator";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("flag")
export class FlagController {
  constructor(private readonly flagService: FlagService) {}
  @ApiOperation({
    summary:
      "This method allow user to create new flag in order to use flipping feauture",
  })
    @ApiBearerAuth()
  @ApiBody({
    type: CreateFlagDtos,
  })
  @ApiResponse({
    status: 201,
    description: "Return of a succes case to create the flag ",
    example: {
      title: "hehe",
      isVisible: true,
      adminId: "682da962a6b45d464c9a9735",
      _id: "682dd742189399b632b23ff0",
      createdAt: "2025-05-21T13:38:10.498Z",
      updatedAt: "2025-05-21T13:38:10.498Z",
      __v: 0,
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized error: the user is not logged in ",
    schema: {
      example: {
        statusCode: 401,
        message: "kindly try to login again",
        error: "Unauthorized error",
      },
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "Forbidden error: The users should have admin role to process those method",
    schema: {
      example: {
        statusCode: 403,
        message: "Osp only admins can access to this route",
        error: "Forbidden error",
      },
    },
  })
  @ApiResponse({
    status: 409,
    description:
      "Conflict Exception: A flag with the same info is already stored in database",
    schema: {
      example: {
        statusCode: 409,
        message: "Flag with this name is already exists",
        error: "Not Found",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request exception: something bad happend",
    schema: {
      example: {
        statusCode: 400,
        message: "Ops something went wrong",
        error: "Ops the flag isn't added",
      },
    },
  })
  @Post()
  @UseGuards(AdminRoleGuard)
  async createFlag(@Body() createFlagDto: CreateFlagDtos, @Req() req) {
    try {
      return await this.flagService.createFlag(createFlagDto, req.user.id);
    } catch (e) {
      if (
        e instanceof UnauthorizedException ||
        e instanceof ForbiddenException ||
        e instanceof BadRequestException ||
        e instanceof ConflictException
      ) {
        throw e;
      }
      throw new BadRequestException("Ops the flag isn't added");
    }
  }
  @ApiOperation({
    summary: "This method allow user to update a specific flag ",
  })
    @ApiBearerAuth()
  @ApiBody({
    type: CreateFlagDtos,
  })
  @ApiResponse({
    status: 201,
    description: "Flag updated successfully",
    example: {
      _id: "682dc2d1b44a939c01fbf918",
      title: "WOOOW",
      isVisible: false,
      adminId: "682da962a6b45d464c9a9735",
      createdAt: "2025-05-21T12:10:57.387Z",
      updatedAt: "2025-05-21T13:33:00.690Z",
      __v: 0,
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized error: the user is not logged in ",
    schema: {
      example: {
        statusCode: 401,
        message: "kindly try to login again",
        error: "Unauthorized error",
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Not found error: Flag not found",
    schema: {
      example: {
        statusCode: 404,
        message: "The flag not found",
        error: "Not Found error",
      },
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "Forbidden error: The users should have admin role to process those method",
    schema: {
      example: {
        statusCode: 403,
        message: "Osp only admins can access to this route",
        error: "Forbidden error",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request exception: something bad happend",
    content: {
      "application/json": {
        examples: {
          "The id is not valid": {
            value: {
              statusCode: 400,
              message: "Ops the id of flag is not valid id ",
              error: "Bad Error exception",
            },
          },
          "Something bad happend and crush the app": {
            value: {
              statusCode: 400,
              message: "Something bad happend ",
              error: "Bad Error exception",
            },
          },
        },
      },
    },
  })
  @Put(":id")
  @UseInterceptors(FlagInterceptor)
  @UseGuards(AdminRoleGuard)
  async updateFlag(
    @Param("id") id: string,
    @Body() updateFlagDto: UpdateFlagDto
  ) {
    try {
      return await this.flagService.updateFlag(updateFlagDto, id);
    } catch (e) {
      if (
        e instanceof UnauthorizedException ||
        e instanceof ForbiddenException ||
        e instanceof BadRequestException ||
        e instanceof ConflictException ||
        e instanceof NotFoundException
      ) {
        throw e;
      }
      if (e.name == "CastError") {
        throw new BadRequestException("Ops the id of flag is not valid id ");
      }
      throw new BadRequestException("Something bad happend ");
    }
  }

  @ApiOperation({
    summary: "This method get all the flags",
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: "fetching flags successfully",
    example: [
      {
        _id: "682dd731189399b632b23feb",
        title: "requessst",
        isVisible: true,
        adminId: "682da962a6b45d464c9a9735",
        createdAt: "2025-05-21T13:37:53.950Z",
        updatedAt: "2025-05-21T13:37:53.950Z",
        __v: 0,
      },
      {
        _id: "682dd742189399b632b23ff0",
        title: "hehe",
        isVisible: true,
        adminId: "682da962a6b45d464c9a9735",
        createdAt: "2025-05-21T13:38:10.498Z",
        updatedAt: "2025-05-21T13:38:10.498Z",
        __v: 0,
      },
    ],
  })
    @ApiResponse({
    status: 401,
    description: "Unauthorized error: the user is not logged in ",
    schema: {
      example: {
        statusCode: 401,
        message: "kindly try to login again",
        error: "Unauthorized error",
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Not found Exception: Flag not found",
    schema: {
      example: {
        statusCode: 404,
        message: "No flags yet",
        error: "Not Found error",
      },
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "Forbidden error: The users should have admin role to process those method",
    schema: {
      example: {
        statusCode: 403,
        message: "Osp only admins can access to this route",
        error: "Forbidden error",
      },
    },
  })

  @Get()
  @UseGuards(AdminRoleGuard)
  async getAllFlags() {
    try {
      return await this.flagService.getAllFlags();
    } catch (e) {
      console.log("there's an error", e);
      if ( e instanceof UnauthorizedException || e instanceof ForbiddenException || e instanceof BadRequestException || e instanceof NotFoundException) {
        throw e;
      }
      throw e;
    }
  }
}
