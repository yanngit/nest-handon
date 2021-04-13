import { Injectable } from '@nestjs/common';
import { Property } from './interfaces/property.interface';
import { CreatePropertyDto } from './dto/create-property.dto';

@Injectable()
export class PropertiesService {
  private readonly properties: Property[] = [];

  create(createPropertyDto: CreatePropertyDto): Property {
    const property = {
      id: this.properties.length,
      name: createPropertyDto.name,
      nbLots: createPropertyDto.nbLots,
    };
    this.properties.push(property);
    return property;
  }

  findAll(): Property[] {
    return this.properties;
  }
}
