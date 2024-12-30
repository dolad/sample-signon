import { IsNotEmpty } from 'class-validator';

export class AuthorizeRequestDto {
    @IsNotEmpty()
    client_id: string;

    @IsNotEmpty()
    redirect_uri: string;

    @IsNotEmpty()
    response_type: string;

    @IsNotEmpty()
    scope: string;

    @IsNotEmpty()
    state: string;
}
