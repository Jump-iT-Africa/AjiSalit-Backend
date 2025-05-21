import { PartialType } from "@nestjs/mapped-types";
import { CreateFlagDtos } from "./create-flag.dto";

export class UpdateFlagDto extends PartialType(CreateFlagDtos) {}
