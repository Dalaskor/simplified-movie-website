import { ApiProperty } from "@nestjs/swagger";

export class GetReviewsByParent {
  @ApiProperty({
    description: 'Идентификатор фильма',
    type: Number,
  })
  film_id: number;
  @ApiProperty({
    description: 'Идентификатор родительского коментария',
    type: Number
  })
  parent_id: number;
}
