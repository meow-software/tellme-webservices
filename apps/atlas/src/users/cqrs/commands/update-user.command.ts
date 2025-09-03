import { Snowflake } from "src/lib";
import { UpdateUserDto } from "src/users/dto/update-user.dto";

export class UpdateUserCommand {
  constructor(public readonly userId: Snowflake, public readonly dto: UpdateUserDto) {}
}
