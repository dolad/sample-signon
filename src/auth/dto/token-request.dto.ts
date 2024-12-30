import { IsNotEmpty } from 'class-validator';

export class TokenRequestDto {
    @IsNotEmpty()
    code: string;

    @IsNotEmpty()
    client_id: string;

    @IsNotEmpty()
    client_secret: string;

    @IsNotEmpty()
    redirect_uri: string;

    @IsNotEmpty()
    grant_type: string;
}
