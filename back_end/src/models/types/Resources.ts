import {prop} from '@typegoose/typegoose';

export default class ResourcesSettings {
  @prop({required: true})
  items!: Item[];
}

class Item {
  @prop({required: true})
  name!: string;

  @prop({required: true})
  source!: string;

  @prop()
  type?: string;
}