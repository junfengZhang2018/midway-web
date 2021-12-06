import { Rule, RuleType } from "@midwayjs/decorator";

export class loginDto {
    @Rule(RuleType.string().required())
    name: string;

    @Rule(RuleType.string().required())
    password: string
}

export class UpdatePasswordDto {
    @Rule(RuleType.string().min(6).required())
    originPassword: string;
  
    @Rule(
      RuleType.string()
        .min(6)
        .pattern(/^[a-z0-9A-Z`~!#%^&*=+\\|{};:'\\",<>/?]+$/)
        .required()
    )
    newPassword: string;
}