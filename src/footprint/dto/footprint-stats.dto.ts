import { ApiProperty } from '@nestjs/swagger';

export class FootprintStatsDto {
    @ApiProperty({
        type: [Number],
        description: 'Impronta di carbonio per ciascun mese dell’anno corrente (in kg CO2)',
    })
    monthly: number[];

    @ApiProperty({
        type: [Number],
        description: 'Impronta di carbonio per gli ultimi 5 anni (in kg CO2)',
    })
    yearly: number[];
}
