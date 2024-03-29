import {Severity, modelOptions, prop} from '@typegoose/typegoose';
import OptionSettings from './Option';
import PromptSettings from './Prompt';
import SoundsSettings from './../Sounds';
import SpawnIslandSettings from './SpawnIsland';

@modelOptions({options: {allowMixed: Severity.ALLOW}})
export default class WorldSettings {
  @prop({required: true})
  prompt!: PromptSettings;

  @prop({required: true, type: () => [OptionSettings]})
  options!: OptionSettings[];

  @prop({required: true})
  sounds!: SoundsSettings;

  @prop({required: true})
  spawnIsland!: SpawnIslandSettings;
}
