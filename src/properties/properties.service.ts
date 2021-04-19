import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './property.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  async create(
    user: User,
    createPropertyDto: CreatePropertyDto,
  ): Promise<Property> {
    const property = this.propertyRepository.create(createPropertyDto);
    property.user = user;
    return this.propertyRepository.save(property);
  }

  async findAll(user: User): Promise<Property[]> {
    return this.propertyRepository.find({ user: user });
  }

  async findOne(user: User, id: number): Promise<Property | undefined> {
    return this.propertyRepository.findOne({ user: user, id: id });
  }
}
