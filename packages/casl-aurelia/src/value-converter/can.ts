import { signalBindings } from 'aurelia-framework';
import { Ability, AnyAbility, AbilityParameters } from '@casl/ability';

const ABILITY_CHANGED_SIGNAL = 'caslAbilityChanged';
const HAS_AU_SUBSCRIPTION = new WeakMap<object, boolean>();

class AbilityValueConverter<T extends AnyAbility> {
  static inject = [Ability];

  public readonly signals = [ABILITY_CHANGED_SIGNAL];
  protected readonly _ability: T;

  constructor(ability: T) {
    this._ability = ability;
  }

  can(...args: Parameters<T['can']>): boolean {
    if (!HAS_AU_SUBSCRIPTION.has(this._ability)) {
      this._ability.on('updated', () => signalBindings(ABILITY_CHANGED_SIGNAL));
      HAS_AU_SUBSCRIPTION.set(this._ability, true);
    }

    return this._ability.can(...args);
  }
}

export class CanValueConverter<T extends AnyAbility> extends AbilityValueConverter<T> {
  static $resource = {
    name: 'can',
    type: 'valueConverter'
  };

  toView(
    subject: AbilityParameters<T>['subject'],
    action: AbilityParameters<T>['action'],
    field?: string
  ): boolean {
    // eslint-disable-next-line
    console.warn('`can` value converter is deprecated. Use `able` converter instead');
    return (this as any).can(action, subject, field);
  }
}

export class AbleValueConverter<T extends AnyAbility> extends AbilityValueConverter<T> {
  static $resource = {
    name: 'able',
    type: 'valueConverter'
  };

  toView(...args: Parameters<T['can']>): boolean {
    return this.can(...args);
  }
}
