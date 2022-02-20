import { Injectable } from '@nestjs/common';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos';
import { UserDto } from '../dtos/user.dto';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly _userRepository: UserRepository) {}
  public async getUsers(
    PageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this._userRepository.createQueryBuilder('user');

    queryBuilder
      .orderBy('user.createdAt', PageOptionsDto.order)
      .skip(PageOptionsDto.skip)
      .take(PageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, PageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}
